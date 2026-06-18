<?php

declare(strict_types=1);

use WCM\Scripture\Import\ImportReport;
use WCM\Scripture\Import\ImportRow;
use WCM\Scripture\Import\KrvImportValidator;
use WCM\Scripture\Import\VerseImportService;
use WCM\Scripture\Repositories\BibleRepository;

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

try {
    $arguments = parseCliArguments($argv);

    loadComposerAutoload();
    bootstrapWordPress($arguments['dbSocket']);

    $jsonPath = resolvePath($arguments['jsonPath']);
    $records = readJsonRecords($jsonPath);
    $prepared = prepareImportRows($records);

    $service = new VerseImportService(
        new BibleRepository(),
        new KrvImportValidator()
    );

    $report = $service->import($prepared['rows']);

    printImportSummary($records, $prepared, $report);

    exit($report->ok() ? 0 : 1);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{jsonPath: string, dbSocket: string|null}
 */
function parseCliArguments(array $argv): array
{
    $jsonPath = null;
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
        if (str_starts_with($argument, '--db-socket=')) {
            $dbSocket = substr($argument, strlen('--db-socket='));
            continue;
        }

        if ($argument === '--db-socket') {
            throw new RuntimeException('Use --db-socket=/path/to/mysqld.sock.');
        }

        if (str_starts_with($argument, '--')) {
            throw new RuntimeException('Unknown option: ' . $argument);
        }

        if ($jsonPath !== null) {
            throw new RuntimeException('Only one JSON path argument is supported.');
        }

        $jsonPath = $argument;
    }

    if ($jsonPath === null) {
        throw new RuntimeException(
            "Usage: php import-krv-json.php <krv.generated.json> [--db-socket=/path/to/mysqld.sock]"
        );
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'jsonPath' => $jsonPath,
        'dbSocket' => $dbSocket,
    ];
}

function loadComposerAutoload(): void
{
    $autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';

    if (! is_file($autoloadPath)) {
        throw new RuntimeException('Composer autoload file not found. Run composer dump-autoload first.');
    }

    require_once $autoloadPath;
}

function bootstrapWordPress(?string $dbSocket): void
{
    $wpLoadPath = dirname(__DIR__, 4) . '/wp-load.php';

    if (! is_file($wpLoadPath)) {
        throw new RuntimeException('WordPress bootstrap file not found: ' . $wpLoadPath);
    }

    preflightWordPressDatabase(dirname($wpLoadPath) . '/wp-config.php', $dbSocket);

    if (! defined('WP_USE_THEMES')) {
        define('WP_USE_THEMES', false);
    }

    require_once $wpLoadPath;
}

function preflightWordPressDatabase(string $configPath, ?string $dbSocket): void
{
    if (! extension_loaded('mysqli') || ! is_file($configPath)) {
        return;
    }

    $config = file_get_contents($configPath);

    if ($config === false) {
        return;
    }

    $dbName = parseWpConfigConstant($config, 'DB_NAME');
    $dbUser = parseWpConfigConstant($config, 'DB_USER');
    $dbPassword = parseWpConfigConstant($config, 'DB_PASSWORD');
    $dbHost = parseWpConfigConstant($config, 'DB_HOST');

    if ($dbName === null || $dbUser === null || $dbPassword === null || $dbHost === null) {
        return;
    }

    mysqli_report(MYSQLI_REPORT_OFF);

    $errors = [];

    if ($dbSocket !== null && $dbHost === 'localhost') {
        if (isMysqlSocket($dbSocket)) {
            $error = testDatabaseConnection('localhost', $dbUser, $dbPassword, $dbName, $dbSocket);

            if ($error === null) {
                configureRuntimeMysqlSocket($dbSocket);
                fwrite(STDOUT, 'Using Local WP socket: ' . $dbSocket . "\n");

                return;
            }

            $errors[] = $dbSocket . ': ' . $error;
        } else {
            $errors[] = $dbSocket . ': socket path does not exist or is not a socket';
        }
    }

    $connectionHosts = $dbHost === 'localhost' ? ['localhost', '127.0.0.1'] : [$dbHost];

    foreach ($connectionHosts as $connectionHost) {
        $error = testDatabaseConnection($connectionHost, $dbUser, $dbPassword, $dbName);

        if ($error === null) {
            if ($dbHost === 'localhost' && $connectionHost === '127.0.0.1') {
                fwrite(STDOUT, "WordPress DB preflight used TCP fallback host 127.0.0.1.\n");
            }

            return;
        }

        $errors[] = $connectionHost . ': ' . $error;
    }

    throw new RuntimeException('WordPress database is not reachable: ' . implode('; ', $errors));
}

function testDatabaseConnection(
    string $host,
    string $user,
    string $password,
    string $database,
    ?string $socket = null
): ?string
{
    $mysqli = mysqli_init();

    if (! $mysqli instanceof mysqli) {
        return null;
    }

    if (@$mysqli->real_connect($host, $user, $password, $database, null, $socket) === true) {
        $mysqli->close();

        return null;
    }

    $error = $mysqli->connect_error ?: 'unknown database connection error';
    $mysqli->close();

    return $error;
}

function configureRuntimeMysqlSocket(string $socket): void
{
    ini_set('mysqli.default_socket', $socket);
    ini_set('pdo_mysql.default_socket', $socket);
}

function isMysqlSocket(string $socket): bool
{
    return file_exists($socket) && @filetype($socket) === 'socket';
}

function parseWpConfigConstant(string $config, string $constant): ?string
{
    $pattern = '/define\s*\(\s*[\'"]' . preg_quote($constant, '/') . '[\'"]\s*,\s*[\'"]([^\'"]*)[\'"]\s*\)/';

    if (preg_match($pattern, $config, $matches) !== 1) {
        return null;
    }

    return stripcslashes($matches[1]);
}

/**
 * @return array<int, array<string, mixed>>
 */
function readJsonRecords(string $jsonPath): array
{
    if (! is_file($jsonPath)) {
        throw new RuntimeException('KRV JSON file not found: ' . $jsonPath);
    }

    $json = file_get_contents($jsonPath);

    if ($json === false) {
        throw new RuntimeException('Failed to read KRV JSON file: ' . $jsonPath);
    }

    $records = json_decode($json, true);

    if (! is_array($records)) {
        throw new RuntimeException('KRV JSON must decode to an array of rows: ' . json_last_error_msg());
    }

    foreach ($records as $index => $record) {
        if (! is_array($record)) {
            throw new RuntimeException('KRV JSON row must be an object at index ' . $index . '.');
        }
    }

    return $records;
}

/**
 * @param array<int, array<string, mixed>> $records
 * @return array{
 *     rows: ImportRow[],
 *     skippedNonKrv: int,
 *     skippedMetadata: int,
 *     correctedPsalm7220: bool
 * }
 */
function prepareImportRows(array $records): array
{
    $rows = [];
    $skippedNonKrv = 0;
    $skippedMetadata = 0;
    $correctedPsalm7220 = false;

    foreach ($records as $index => $record) {
        $versionCode = getVersionCode($record, $index);

        if ($versionCode !== 'KRV') {
            $skippedNonKrv++;
            continue;
        }

        $bookOrder = getIntegerField($record, 'bookOrder', $index);
        $chapter = getIntegerField($record, 'chapter', $index);
        $verse = getIntegerField($record, 'verse', $index);
        $text = getTextField($record, $index);

        if ($bookOrder === 0) {
            $skippedMetadata++;
            continue;
        }

        if (trim($text) === '') {
            if (isPsalm7220($bookOrder, $chapter, $verse)) {
                $text = '이새의 아들 다윗의 기도가 필하다';
                $correctedPsalm7220 = true;
            } else {
                throw new RuntimeException(
                    sprintf(
                        'Blocking empty KRV text row found at index %d: BOOK=%d CHAPTER=%d VERSE=%d.',
                        $index,
                        $bookOrder,
                        $chapter,
                        $verse
                    )
                );
            }
        }

        $rows[] = new ImportRow(
            $versionCode,
            $bookOrder,
            $chapter,
            $verse,
            $text,
            [
                'source_index' => $index,
                'psalm_72_20_corrected' => isPsalm7220($bookOrder, $chapter, $verse),
            ]
        );
    }

    return [
        'rows' => $rows,
        'skippedNonKrv' => $skippedNonKrv,
        'skippedMetadata' => $skippedMetadata,
        'correctedPsalm7220' => $correctedPsalm7220,
    ];
}

/**
 * @param array<string, mixed> $record
 */
function getVersionCode(array $record, int $index): string
{
    $value = $record['versionCode'] ?? $record['version_code'] ?? null;

    if (! is_string($value) || trim($value) === '') {
        throw new RuntimeException('Missing versionCode for JSON row index ' . $index . '.');
    }

    return trim($value);
}

/**
 * @param array<string, mixed> $record
 */
function getIntegerField(array $record, string $field, int $index): int
{
    if (! array_key_exists($field, $record)) {
        throw new RuntimeException('Missing ' . $field . ' for JSON row index ' . $index . '.');
    }

    if (is_int($record[$field])) {
        return $record[$field];
    }

    if (is_string($record[$field]) && preg_match('/^-?\d+$/', $record[$field]) === 1) {
        return (int) $record[$field];
    }

    throw new RuntimeException('Invalid integer field ' . $field . ' for JSON row index ' . $index . '.');
}

/**
 * @param array<string, mixed> $record
 */
function getTextField(array $record, int $index): string
{
    if (! array_key_exists('text', $record)) {
        throw new RuntimeException('Missing text for JSON row index ' . $index . '.');
    }

    if ($record['text'] === null) {
        return '';
    }

    if (! is_string($record['text'])) {
        throw new RuntimeException('Invalid text field for JSON row index ' . $index . '.');
    }

    return $record['text'];
}

function isPsalm7220(int $bookOrder, int $chapter, int $verse): bool
{
    return $bookOrder === 19 && $chapter === 72 && $verse === 20;
}

/**
 * @param array<int, array<string, mixed>> $records
 * @param array{
 *     rows: ImportRow[],
 *     skippedNonKrv: int,
 *     skippedMetadata: int,
 *     correctedPsalm7220: bool
 * } $prepared
 */
function printImportSummary(array $records, array $prepared, ImportReport $report): void
{
    fwrite(STDOUT, "KRV JSON import summary\n");
    fwrite(STDOUT, 'JSON rows read: ' . count($records) . "\n");
    fwrite(STDOUT, 'KRV rows queued: ' . count($prepared['rows']) . "\n");
    fwrite(STDOUT, 'Non-KRV rows skipped: ' . $prepared['skippedNonKrv'] . "\n");
    fwrite(STDOUT, 'Metadata rows skipped: ' . $prepared['skippedMetadata'] . "\n");
    fwrite(STDOUT, 'Psalm 72:20 corrected: ' . ($prepared['correctedPsalm7220'] ? 'yes' : 'no') . "\n");
    fwrite(STDOUT, 'ImportReport total rows: ' . $report->totalRows . "\n");
    fwrite(STDOUT, 'ImportReport imported rows: ' . $report->importedRows . "\n");
    fwrite(STDOUT, 'ImportReport skipped rows: ' . $report->skippedRows . "\n");
    fwrite(STDOUT, 'ImportReport failed rows: ' . $report->failedRows . "\n");
    fwrite(STDOUT, 'ImportReport issues: ' . count($report->issues) . "\n");
    fwrite(STDOUT, 'ImportReport ok: ' . ($report->ok() ? 'yes' : 'no') . "\n");

    foreach ($report->issues as $issue) {
        fwrite(
            STDOUT,
            sprintf(
                '[%s] %s: %s %s',
                $issue->severity,
                $issue->code,
                $issue->message,
                json_encode($issue->context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"
            )
        );
    }
}

function resolvePath(string $path): string
{
    $resolved = realpath($path);

    return $resolved === false ? $path : $resolved;
}
