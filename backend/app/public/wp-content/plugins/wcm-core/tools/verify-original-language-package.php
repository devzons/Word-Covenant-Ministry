<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    try {
        $arguments = wcm_ol_package_parse_verify_arguments($argv);

        wcm_ol_package_load_composer_autoload();
        wcm_ol_package_bootstrap_wordpress($arguments['dbSocket']);

        $report = wcm_ol_package_verify($arguments['package']);
        wcm_ol_package_print_verify_report($report);

        exit($report['ok'] ? 0 : 1);
    } catch (Throwable $exception) {
        fwrite(STDERR, $exception->getMessage() . "\n");
        exit(1);
    }
}

/**
 * @param string[] $argv
 * @return array{package: string, dbSocket: string|null}
 */
function wcm_ol_package_parse_verify_arguments(array $argv): array
{
    $package = null;
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
        if (str_starts_with($argument, '--package=')) {
            $package = substr($argument, strlen('--package='));
            continue;
        }

        if ($argument === '--package') {
            throw new RuntimeException('Use --package=/path/to/package-directory.');
        }

        if (str_starts_with($argument, '--db-socket=')) {
            $dbSocket = substr($argument, strlen('--db-socket='));
            continue;
        }

        if ($argument === '--db-socket') {
            throw new RuntimeException('Use --db-socket=/path/to/mysqld.sock.');
        }

        throw new RuntimeException('Unknown argument: ' . $argument);
    }

    if ($package === null || trim($package) === '') {
        throw new RuntimeException('Usage: php tools/verify-original-language-package.php --package=/path/to/package-directory [--db-socket=/path/to/mysqld.sock]');
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'package' => $package,
        'dbSocket' => $dbSocket,
    ];
}

function wcm_ol_package_load_composer_autoload(): void
{
    $autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';

    if (! is_file($autoloadPath)) {
        throw new RuntimeException('Composer autoload file not found. Run composer dump-autoload first.');
    }

    require_once $autoloadPath;
}

function wcm_ol_package_bootstrap_wordpress(?string $dbSocket): void
{
    $wpLoadPath = dirname(__DIR__, 4) . '/wp-load.php';

    if (! is_file($wpLoadPath)) {
        throw new RuntimeException('WordPress bootstrap file not found: ' . $wpLoadPath);
    }

    wcm_ol_package_preflight_wordpress_database(dirname($wpLoadPath) . '/wp-config.php', $dbSocket);

    if (! defined('WP_USE_THEMES')) {
        define('WP_USE_THEMES', false);
    }

    require_once $wpLoadPath;
}

function wcm_ol_package_preflight_wordpress_database(string $configPath, ?string $dbSocket): void
{
    if (! extension_loaded('mysqli') || ! is_file($configPath)) {
        return;
    }

    $config = file_get_contents($configPath);

    if ($config === false) {
        return;
    }

    $dbName = wcm_ol_package_parse_wp_config_constant($config, 'DB_NAME');
    $dbUser = wcm_ol_package_parse_wp_config_constant($config, 'DB_USER');
    $dbPassword = wcm_ol_package_parse_wp_config_constant($config, 'DB_PASSWORD');
    $dbHost = wcm_ol_package_parse_wp_config_constant($config, 'DB_HOST');

    if ($dbName === null || $dbUser === null || $dbPassword === null || $dbHost === null) {
        return;
    }

    mysqli_report(MYSQLI_REPORT_OFF);

    if ($dbSocket !== null && $dbHost === 'localhost') {
        $error = wcm_ol_package_test_database_connection('localhost', $dbUser, $dbPassword, $dbName, $dbSocket);
        if ($error === null) {
            ini_set('mysqli.default_socket', $dbSocket);
            return;
        }
    }

    $error = wcm_ol_package_test_database_connection($dbHost, $dbUser, $dbPassword, $dbName, null);
    if ($error !== null) {
        throw new RuntimeException(
            "Unable to connect to the WordPress database before bootstrap.\n"
            . $error
            . "\nIf this is a Local/Flywheel socket issue, re-run with --db-socket=/path/to/mysqld.sock."
        );
    }
}

function wcm_ol_package_parse_wp_config_constant(string $config, string $name): ?string
{
    if (! preg_match("/define\\(\\s*['\"]" . preg_quote($name, '/') . "['\"]\\s*,\\s*(['\"])(.*?)\\1\\s*\\)/", $config, $matches)) {
        return null;
    }

    return stripcslashes($matches[2]);
}

function wcm_ol_package_test_database_connection(
    string $host,
    string $user,
    string $password,
    string $database,
    ?string $socket
): ?string {
    $connection = mysqli_init();

    if (! $connection instanceof mysqli) {
        return 'Failed to initialize mysqli.';
    }

    $ok = @$connection->real_connect($host, $user, $password, $database, null, $socket);

    if ($ok) {
        $connection->close();
        return null;
    }

    $message = mysqli_connect_error();
    return sprintf('Database connection failed for host "%s"%s: %s', $host, $socket ? ' socket "' . $socket . '"' : '', $message ?: 'unknown error');
}

/**
 * @return array{
 *     ok: bool,
 *     package_path: string,
 *     manifest: array<string, mixed>,
 *     terms_count: int,
 *     occurrences_count: int,
 *     source_datasets: array<string, int>,
 *     term_hashes: array<string, bool>,
 *     errors: string[]
 * }
 */
function wcm_ol_package_verify(string $package): array
{
    $packagePath = wcm_ol_package_resolve_existing_directory($package);
    $errors = [];

    $manifestPath = $packagePath . '/manifest.json';
    if (! is_file($manifestPath)) {
        throw new RuntimeException('Package manifest not found: ' . $manifestPath);
    }

    $manifest = wcm_ol_package_read_json_file($manifestPath);

    if (($manifest['package_type'] ?? null) !== 'original_language') {
        $errors[] = 'Manifest package_type must be original_language.';
    }

    $currentDbVersion = (string) get_option('wcm_core_db_version', '');
    if (($manifest['db_version'] ?? '') !== $currentDbVersion) {
        $errors[] = sprintf('Manifest db_version %s does not match current wcm_core_db_version %s.', (string) ($manifest['db_version'] ?? ''), $currentDbVersion);
    }

    $fileMap = wcm_ol_package_manifest_file_map($manifest);
    foreach (['original-terms.jsonl', 'original-word-occurrences.jsonl'] as $requiredFile) {
        if (! isset($fileMap[$requiredFile])) {
            $errors[] = 'Manifest missing file entry: ' . $requiredFile;
            continue;
        }

        $path = $packagePath . '/' . $requiredFile;
        if (! is_file($path)) {
            $errors[] = 'Package file missing: ' . $requiredFile;
            continue;
        }

        $actualChecksum = hash_file('sha256', $path);
        if (! is_string($actualChecksum) || $actualChecksum !== (string) ($fileMap[$requiredFile]['sha256'] ?? '')) {
            $errors[] = 'Checksum mismatch: ' . $requiredFile;
        }
    }

    wcm_ol_package_verify_checksum_file($packagePath, $fileMap, $errors);

    $termResult = wcm_ol_package_verify_terms_file($packagePath . '/original-terms.jsonl', (int) ($fileMap['original-terms.jsonl']['expected_count'] ?? -1), $errors);
    $occurrenceResult = wcm_ol_package_verify_occurrences_file(
        $packagePath . '/original-word-occurrences.jsonl',
        (int) ($fileMap['original-word-occurrences.jsonl']['expected_count'] ?? -1),
        $termResult['term_hashes'],
        $errors
    );

    $expectedCounts = is_array($manifest['expected_counts'] ?? null) ? $manifest['expected_counts'] : [];
    if ((int) ($expectedCounts['original_terms'] ?? -1) !== $termResult['count']) {
        $errors[] = 'Manifest expected_counts.original_terms does not match terms file count.';
    }

    if ((int) ($expectedCounts['original_word_occurrences'] ?? -1) !== $occurrenceResult['count']) {
        $errors[] = 'Manifest expected_counts.original_word_occurrences does not match occurrences file count.';
    }

    $manifestDatasets = is_array($manifest['source_datasets'] ?? null) ? $manifest['source_datasets'] : [];
    foreach ($occurrenceResult['source_datasets'] as $sourceDataset => $count) {
        if ((int) ($manifestDatasets[$sourceDataset] ?? -1) !== $count) {
            $errors[] = 'Manifest source_datasets mismatch for ' . $sourceDataset . '.';
        }
    }

    return [
        'ok' => $errors === [],
        'package_path' => $packagePath,
        'manifest' => $manifest,
        'terms_count' => $termResult['count'],
        'occurrences_count' => $occurrenceResult['count'],
        'source_datasets' => $occurrenceResult['source_datasets'],
        'term_hashes' => $termResult['term_hashes'],
        'errors' => $errors,
    ];
}

function wcm_ol_package_resolve_existing_directory(string $path): string
{
    $absolute = $path !== '' && $path[0] === '/' ? $path : getcwd() . '/' . $path;
    $real = realpath($absolute);

    if (! is_string($real) || ! is_dir($real)) {
        throw new RuntimeException('Package directory not found: ' . $path);
    }

    return $real;
}

/**
 * @return array<string, mixed>
 */
function wcm_ol_package_read_json_file(string $path): array
{
    $contents = file_get_contents($path);
    if ($contents === false) {
        throw new RuntimeException('Failed to read JSON file: ' . $path);
    }

    $decoded = json_decode($contents, true);
    if (! is_array($decoded)) {
        throw new RuntimeException('Invalid JSON file: ' . $path);
    }

    return $decoded;
}

/**
 * @param array<string, mixed> $manifest
 * @return array<string, array<string, mixed>>
 */
function wcm_ol_package_manifest_file_map(array $manifest): array
{
    $files = is_array($manifest['files'] ?? null) ? $manifest['files'] : [];
    $map = [];

    foreach ($files as $file) {
        if (is_array($file) && isset($file['path'])) {
            $map[(string) $file['path']] = $file;
        }
    }

    return $map;
}

/**
 * @param array<string, array<string, mixed>> $fileMap
 * @param string[] $errors
 */
function wcm_ol_package_verify_checksum_file(string $packagePath, array $fileMap, array &$errors): void
{
    $checksumsPath = $packagePath . '/checksums.sha256';
    if (! is_file($checksumsPath)) {
        $errors[] = 'checksums.sha256 is missing.';
        return;
    }

    $lines = file($checksumsPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (! is_array($lines)) {
        $errors[] = 'Unable to read checksums.sha256.';
        return;
    }

    $checksumFileMap = [];
    foreach ($lines as $line) {
        if (! preg_match('/^([a-f0-9]{64})\\s+(.+)$/', $line, $matches)) {
            $errors[] = 'Invalid checksum line: ' . $line;
            continue;
        }

        $checksumFileMap[$matches[2]] = $matches[1];
    }

    foreach (['original-terms.jsonl', 'original-word-occurrences.jsonl'] as $file) {
        if (($checksumFileMap[$file] ?? null) !== ($fileMap[$file]['sha256'] ?? null)) {
            $errors[] = 'checksums.sha256 does not match manifest for ' . $file . '.';
        }
    }
}

/**
 * @param string[] $errors
 * @return array{count: int, term_hashes: array<string, bool>}
 */
function wcm_ol_package_verify_terms_file(string $path, int $expectedCount, array &$errors): array
{
    $required = [
        'id',
        'term_identity_hash',
        'language_type',
        'lemma',
        'lemma_normalized',
        'strongs_number',
        'strongs_extended',
        'transliteration',
        'transliteration_ko',
        'root',
        'gloss',
        'gloss_ko',
        'definition',
        'created_at',
        'updated_at',
    ];

    $count = 0;
    $previousHash = '';
    $termHashes = [];

    foreach (wcm_ol_package_read_jsonl($path) as $lineNumber => $row) {
        foreach ($required as $field) {
            if (! array_key_exists($field, $row)) {
                $errors[] = "Missing term field {$field} on line {$lineNumber}.";
            }
        }

        $hash = (string) ($row['term_identity_hash'] ?? '');
        if ($hash === '') {
            $errors[] = 'Empty term_identity_hash on terms line ' . $lineNumber . '.';
        }

        if ($previousHash !== '' && strcmp($hash, $previousHash) <= 0) {
            $errors[] = 'Duplicate or unsorted term_identity_hash near terms line ' . $lineNumber . '.';
        }

        $termHashes[$hash] = true;
        $previousHash = $hash;
        $count++;
    }

    if ($expectedCount !== $count) {
        $errors[] = "Terms expected_count {$expectedCount} does not match actual {$count}.";
    }

    return [
        'count' => $count,
        'term_hashes' => $termHashes,
    ];
}

/**
 * @param array<string, bool> $termHashes
 * @param string[] $errors
 * @return array{count: int, source_datasets: array<string, int>}
 */
function wcm_ol_package_verify_occurrences_file(string $path, int $expectedCount, array $termHashes, array &$errors): array
{
    $required = [
        'id',
        'term_id',
        'term_identity_hash',
        'book_id',
        'chapter',
        'verse',
        'word_order',
        'subword_order',
        'token_type',
        'surface_form',
        'normalized_form',
        'morphology',
        'grammar_summary',
        'grammar_note',
        'contextual_function',
        'source_dataset',
        'source_ref',
        'created_at',
        'updated_at',
    ];

    $count = 0;
    $previousIdentity = '';
    $sourceDatasets = [];

    foreach (wcm_ol_package_read_jsonl($path) as $lineNumber => $row) {
        foreach ($required as $field) {
            if (! array_key_exists($field, $row)) {
                $errors[] = "Missing occurrence field {$field} on line {$lineNumber}.";
            }
        }

        $termHash = (string) ($row['term_identity_hash'] ?? '');
        if (! isset($termHashes[$termHash])) {
            $errors[] = 'Occurrence line ' . $lineNumber . ' references unknown term_identity_hash.';
        }

        $identity = wcm_ol_package_occurrence_identity($row);
        if ($previousIdentity !== '' && strcmp($identity, $previousIdentity) <= 0) {
            $errors[] = 'Duplicate or unsorted occurrence identity near occurrences line ' . $lineNumber . '.';
        }

        $sourceDataset = (string) ($row['source_dataset'] ?? '');
        $sourceDatasets[$sourceDataset] = ($sourceDatasets[$sourceDataset] ?? 0) + 1;
        $previousIdentity = $identity;
        $count++;
    }

    ksort($sourceDatasets);

    if ($expectedCount !== $count) {
        $errors[] = "Occurrences expected_count {$expectedCount} does not match actual {$count}.";
    }

    return [
        'count' => $count,
        'source_datasets' => $sourceDatasets,
    ];
}

/**
 * @return Generator<int, array<string, mixed>>
 */
function wcm_ol_package_read_jsonl(string $path): Generator
{
    if (! is_file($path)) {
        throw new RuntimeException('JSONL file not found: ' . $path);
    }

    $handle = fopen($path, 'rb');
    if ($handle === false) {
        throw new RuntimeException('Failed to open JSONL file: ' . $path);
    }

    try {
        $lineNumber = 0;
        while (($line = fgets($handle)) !== false) {
            $lineNumber++;
            $line = trim($line);

            if ($line === '') {
                throw new RuntimeException('Blank JSONL line at ' . $path . ':' . $lineNumber . '.');
            }

            $decoded = json_decode($line, true);
            if (! is_array($decoded)) {
                throw new RuntimeException('Invalid JSONL at ' . $path . ':' . $lineNumber . '.');
            }

            yield $lineNumber => $decoded;
        }
    } finally {
        fclose($handle);
    }
}

/**
 * @param array<string, mixed> $row
 */
function wcm_ol_package_occurrence_identity(array $row): string
{
    return implode("\x1F", [
        (string) ($row['source_dataset'] ?? ''),
        str_pad((string) (int) ($row['book_id'] ?? 0), 3, '0', STR_PAD_LEFT),
        str_pad((string) (int) ($row['chapter'] ?? 0), 3, '0', STR_PAD_LEFT),
        str_pad((string) (int) ($row['verse'] ?? 0), 3, '0', STR_PAD_LEFT),
        str_pad((string) (int) ($row['word_order'] ?? 0), 6, '0', STR_PAD_LEFT),
        str_pad((string) (int) ($row['subword_order'] ?? 0), 6, '0', STR_PAD_LEFT),
        (string) ($row['token_type'] ?? ''),
    ]);
}

/**
 * @param array<string, mixed> $report
 */
function wcm_ol_package_print_verify_report(array $report): void
{
    fwrite(STDOUT, "Original Language Data Package verification\n");
    fwrite(STDOUT, 'Package: ' . $report['package_path'] . "\n");
    fwrite(STDOUT, 'Status: ' . ($report['ok'] ? 'ok' : 'failed') . "\n");
    fwrite(STDOUT, 'Terms: ' . $report['terms_count'] . "\n");
    fwrite(STDOUT, 'Occurrences: ' . $report['occurrences_count'] . "\n");

    foreach ($report['source_datasets'] as $sourceDataset => $count) {
        fwrite(STDOUT, $sourceDataset . ': ' . $count . "\n");
    }

    foreach ($report['errors'] as $error) {
        fwrite(STDERR, 'ERROR: ' . $error . "\n");
    }
}

