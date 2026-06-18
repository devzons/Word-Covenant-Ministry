<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

try {
    $arguments = parseCliArguments($argv);

    loadComposerAutoload();
    bootstrapWordPress($arguments['dbSocket']);

    $summary = verifyKrvImport();
    printVerificationSummary($summary);

    exit($summary['ok'] ? 0 : 1);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{dbSocket: string|null}
 */
function parseCliArguments(array $argv): array
{
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
        if (str_starts_with($argument, '--db-socket=')) {
            $dbSocket = substr($argument, strlen('--db-socket='));
            continue;
        }

        if ($argument === '--db-socket') {
            throw new RuntimeException('Use --db-socket=/path/to/mysqld.sock.');
        }

        throw new RuntimeException('Unknown argument: ' . $argument);
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return ['dbSocket' => $dbSocket];
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
): ?string {
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
 * @return array{
 *     versionsCount: int,
 *     booksCount: int,
 *     krvExists: bool,
 *     krvVerseCount: int,
 *     emptyTextCount: int,
 *     samples: array<string, array{expectedLabel: string, text: string|null, ok: bool}>,
 *     ok: bool
 * }
 */
function verifyKrvImport(): array
{
    global $wpdb;

    $versionsTable = $wpdb->prefix . 'wcm_bible_versions';
    $booksTable = $wpdb->prefix . 'wcm_bible_books';
    $versesTable = $wpdb->prefix . 'wcm_bible_verses';

    $versionsCount = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$versionsTable}");
    $booksCount = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$booksTable}");

    $krvVersionId = $wpdb->get_var(
        $wpdb->prepare("SELECT id FROM {$versionsTable} WHERE code = %s LIMIT 1", 'KRV')
    );
    $krvExists = $krvVersionId !== null;
    $krvVersionId = $krvExists ? (int) $krvVersionId : 0;

    $krvVerseCount = $krvExists
        ? (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$versesTable} WHERE version_id = %d", $krvVersionId))
        : 0;

    $emptyTextCount = $krvExists
        ? (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$versesTable} WHERE version_id = %d AND TRIM(text) = ''",
                $krvVersionId
            )
        )
        : 0;

    $samples = [
        'Genesis 1:1' => verifySample($krvVersionId, 1, 1, 1, null),
        'John 3:16' => verifySample($krvVersionId, 43, 3, 16, null),
        'Psalm 72:20' => verifySample($krvVersionId, 19, 72, 20, '이새의 아들 다윗의 기도가 필하다'),
        'Revelation 22:21' => verifySample($krvVersionId, 66, 22, 21, null),
    ];

    $samplesOk = true;

    foreach ($samples as $sample) {
        if (! $sample['ok']) {
            $samplesOk = false;
            break;
        }
    }

    return [
        'versionsCount' => $versionsCount,
        'booksCount' => $booksCount,
        'krvExists' => $krvExists,
        'krvVerseCount' => $krvVerseCount,
        'emptyTextCount' => $emptyTextCount,
        'samples' => $samples,
        'ok' => $krvExists
            && $booksCount === 66
            && $krvVerseCount === 31102
            && $emptyTextCount === 0
            && $samplesOk,
    ];
}

/**
 * @return array{expectedLabel: string, text: string|null, ok: bool}
 */
function verifySample(int $versionId, int $bookOrder, int $chapter, int $verse, ?string $expectedText): array
{
    global $wpdb;

    if ($versionId < 1) {
        return [
            'expectedLabel' => $expectedText === null ? 'present non-empty text' : $expectedText,
            'text' => null,
            'ok' => false,
        ];
    }

    $booksTable = $wpdb->prefix . 'wcm_bible_books';
    $versesTable = $wpdb->prefix . 'wcm_bible_verses';

    $text = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT v.text
            FROM {$versesTable} v
            INNER JOIN {$booksTable} b ON b.id = v.book_id
            WHERE v.version_id = %d
            AND b.book_order = %d
            AND v.chapter = %d
            AND v.verse = %d
            LIMIT 1",
            $versionId,
            $bookOrder,
            $chapter,
            $verse
        )
    );

    $text = is_string($text) ? $text : null;

    return [
        'expectedLabel' => $expectedText === null ? 'present non-empty text' : $expectedText,
        'text' => $text,
        'ok' => $expectedText === null ? $text !== null && trim($text) !== '' : $text === $expectedText,
    ];
}

/**
 * @param array{
 *     versionsCount: int,
 *     booksCount: int,
 *     krvExists: bool,
 *     krvVerseCount: int,
 *     emptyTextCount: int,
 *     samples: array<string, array{expectedLabel: string, text: string|null, ok: bool}>,
 *     ok: bool
 * } $summary
 */
function printVerificationSummary(array $summary): void
{
    fwrite(STDOUT, "KRV import verification summary\n");
    fwrite(STDOUT, 'Versions count: ' . $summary['versionsCount'] . "\n");
    fwrite(STDOUT, 'KRV exists: ' . ($summary['krvExists'] ? 'yes' : 'no') . "\n");
    fwrite(STDOUT, 'Bible books: ' . $summary['booksCount'] . "\n");
    fwrite(STDOUT, 'KRV verses: ' . $summary['krvVerseCount'] . "\n");
    fwrite(STDOUT, 'Empty KRV texts: ' . $summary['emptyTextCount'] . "\n");
    fwrite(STDOUT, "Sample verse results:\n");

    foreach ($summary['samples'] as $reference => $sample) {
        fwrite(STDOUT, sprintf(
            '- %s: %s | text: %s',
            $reference,
            $sample['ok'] ? 'ok' : 'failed',
            json_encode($sample['text'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"
        ));
    }

    fwrite(STDOUT, 'Psalm 72:20 corrected: ' . ($summary['samples']['Psalm 72:20']['ok'] ? 'yes' : 'no') . "\n");
    fwrite(STDOUT, 'ok: ' . ($summary['ok'] ? 'yes' : 'no') . "\n");
}
