<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

try {
    $arguments = wcm_ol_export_parse_arguments($argv);

    wcm_ol_export_load_composer_autoload();
    wcm_ol_export_bootstrap_wordpress($arguments['dbSocket']);

    $summary = wcm_ol_export_package($arguments['output']);
    wcm_ol_export_print_summary($summary);

    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{output: string, dbSocket: string|null}
 */
function wcm_ol_export_parse_arguments(array $argv): array
{
    $output = null;
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
        if (str_starts_with($argument, '--output=')) {
            $output = substr($argument, strlen('--output='));
            continue;
        }

        if ($argument === '--output') {
            throw new RuntimeException('Use --output=/path/to/package-directory.');
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

    if ($output === null || trim($output) === '') {
        throw new RuntimeException('Usage: php tools/export-original-language-package.php --output=/path/to/package-directory [--db-socket=/path/to/mysqld.sock]');
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'output' => $output,
        'dbSocket' => $dbSocket,
    ];
}

function wcm_ol_export_load_composer_autoload(): void
{
    $autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';

    if (! is_file($autoloadPath)) {
        throw new RuntimeException('Composer autoload file not found. Run composer dump-autoload first.');
    }

    require_once $autoloadPath;
}

function wcm_ol_export_bootstrap_wordpress(?string $dbSocket): void
{
    $wpLoadPath = dirname(__DIR__, 4) . '/wp-load.php';

    if (! is_file($wpLoadPath)) {
        throw new RuntimeException('WordPress bootstrap file not found: ' . $wpLoadPath);
    }

    wcm_ol_export_preflight_wordpress_database(dirname($wpLoadPath) . '/wp-config.php', $dbSocket);

    if (! defined('WP_USE_THEMES')) {
        define('WP_USE_THEMES', false);
    }

    require_once $wpLoadPath;
}

function wcm_ol_export_preflight_wordpress_database(string $configPath, ?string $dbSocket): void
{
    if (! extension_loaded('mysqli') || ! is_file($configPath)) {
        return;
    }

    $config = file_get_contents($configPath);

    if ($config === false) {
        return;
    }

    $dbName = wcm_ol_export_parse_wp_config_constant($config, 'DB_NAME');
    $dbUser = wcm_ol_export_parse_wp_config_constant($config, 'DB_USER');
    $dbPassword = wcm_ol_export_parse_wp_config_constant($config, 'DB_PASSWORD');
    $dbHost = wcm_ol_export_parse_wp_config_constant($config, 'DB_HOST');

    if ($dbName === null || $dbUser === null || $dbPassword === null || $dbHost === null) {
        return;
    }

    mysqli_report(MYSQLI_REPORT_OFF);

    $errors = [];

    if ($dbSocket !== null && $dbHost === 'localhost') {
        $error = wcm_ol_export_test_database_connection('localhost', $dbUser, $dbPassword, $dbName, $dbSocket);
        if ($error === null) {
            ini_set('mysqli.default_socket', $dbSocket);
            return;
        }

        $errors[] = $error;
    }

    $error = wcm_ol_export_test_database_connection($dbHost, $dbUser, $dbPassword, $dbName, null);
    if ($error === null) {
        return;
    }

    $errors[] = $error;

    throw new RuntimeException(
        "Unable to connect to the WordPress database before bootstrap.\n"
        . implode("\n", array_unique($errors))
        . "\nIf this is a Local/Flywheel socket issue, re-run with --db-socket=/path/to/mysqld.sock."
    );
}

function wcm_ol_export_parse_wp_config_constant(string $config, string $name): ?string
{
    if (! preg_match("/define\\(\\s*['\"]" . preg_quote($name, '/') . "['\"]\\s*,\\s*(['\"])(.*?)\\1\\s*\\)/", $config, $matches)) {
        return null;
    }

    return stripcslashes($matches[2]);
}

function wcm_ol_export_test_database_connection(
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
 * @return array<string, mixed>
 */
function wcm_ol_export_package(string $output): array
{
    global $wpdb;

    $outputPath = wcm_ol_export_prepare_output_directory($output);
    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';

    wcm_ol_export_assert_table_exists($termsTable);
    wcm_ol_export_assert_table_exists($occurrencesTable);

    foreach (wcm_ol_export_term_fields() as $field) {
        wcm_ol_export_assert_column_exists($termsTable, $field);
    }

    foreach (array_diff(wcm_ol_export_occurrence_fields(), ['term_identity_hash']) as $field) {
        wcm_ol_export_assert_column_exists($occurrencesTable, $field);
    }

    $termsPath = $outputPath . '/original-terms.jsonl';
    $occurrencesPath = $outputPath . '/original-word-occurrences.jsonl';
    $manifestPath = $outputPath . '/manifest.json';
    $checksumsPath = $outputPath . '/checksums.sha256';

    $termCount = wcm_ol_export_terms($termsTable, $termsPath);
    $occurrenceCount = wcm_ol_export_occurrences($occurrencesTable, $termsTable, $occurrencesPath);
    $datasetCounts = wcm_ol_export_source_dataset_counts($occurrencesTable);

    $termsChecksum = hash_file('sha256', $termsPath);
    $occurrencesChecksum = hash_file('sha256', $occurrencesPath);

    if (! is_string($termsChecksum) || ! is_string($occurrencesChecksum)) {
        throw new RuntimeException('Failed to calculate package checksums.');
    }

    $dbVersion = (string) get_option('wcm_core_db_version', '');
    $gitCommit = trim((string) @shell_exec('git -C ' . escapeshellarg(dirname(__DIR__, 5)) . ' rev-parse HEAD 2>/dev/null'));
    if ($gitCommit === '') {
        $gitCommit = 'unknown';
    }

    $packageId = 'original-language.step-tahot-tagnt.' . gmdate('Y-m-d.His');

    $manifest = [
        'package_id' => $packageId,
        'package_type' => 'original_language',
        'package_version' => '1.0.0',
        'generated_at' => gmdate('c'),
        'generated_by' => basename(__FILE__),
        'git_commit' => $gitCommit,
        'db_version' => $dbVersion,
        'schema' => [
            'terms_table' => 'wcm_original_terms',
            'occurrences_table' => 'wcm_original_word_occurrences',
            'required_term_fields' => wcm_ol_export_term_fields(),
            'required_occurrence_fields' => wcm_ol_export_occurrence_fields(),
        ],
        'expected_counts' => [
            'original_terms' => $termCount,
            'original_word_occurrences' => $occurrenceCount,
        ],
        'source_datasets' => $datasetCounts,
        'seed_sets' => [
            'phase8f-transliteration-push',
            'phase8f-gloss-60',
            'phase8f-gloss-60-policy',
        ],
        'files' => [
            [
                'path' => 'original-terms.jsonl',
                'record_type' => 'original_term',
                'expected_count' => $termCount,
                'sha256' => $termsChecksum,
            ],
            [
                'path' => 'original-word-occurrences.jsonl',
                'record_type' => 'original_word_occurrence',
                'expected_count' => $occurrenceCount,
                'sha256' => $occurrencesChecksum,
            ],
        ],
        'policy_notes' => [
            'SQL dumps are not part of the official original-language package format.',
            'Reviewed transliteration_ko and gloss_ko values must not be overwritten by conflicting package values.',
        ],
    ];

    wcm_ol_export_write_json_file($manifestPath, $manifest);
    wcm_ol_export_write_checksums($checksumsPath, [
        'original-terms.jsonl' => $termsChecksum,
        'original-word-occurrences.jsonl' => $occurrencesChecksum,
    ]);

    return [
        'output' => $outputPath,
        'package_id' => $packageId,
        'db_version' => $dbVersion,
        'terms' => $termCount,
        'occurrences' => $occurrenceCount,
        'source_datasets' => $datasetCounts,
        'manifest' => $manifestPath,
        'checksums' => $checksumsPath,
    ];
}

function wcm_ol_export_prepare_output_directory(string $output): string
{
    $path = wcm_ol_export_absolute_path($output);

    if (is_file($path)) {
        throw new RuntimeException('Output path is a file: ' . $path);
    }

    if (! is_dir($path) && ! mkdir($path, 0775, true) && ! is_dir($path)) {
        throw new RuntimeException('Failed to create output directory: ' . $path);
    }

    if (! is_writable($path)) {
        throw new RuntimeException('Output directory is not writable: ' . $path);
    }

    return rtrim($path, '/');
}

function wcm_ol_export_absolute_path(string $path): string
{
    if ($path === '') {
        throw new RuntimeException('Path must not be empty.');
    }

    if ($path[0] === '/') {
        return $path;
    }

    return getcwd() . '/' . $path;
}

/**
 * @return string[]
 */
function wcm_ol_export_term_fields(): array
{
    return [
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
}

/**
 * @return string[]
 */
function wcm_ol_export_occurrence_fields(): array
{
    return [
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
}

function wcm_ol_export_terms(string $termsTable, string $path): int
{
    global $wpdb;

    $handle = fopen($path, 'wb');
    if ($handle === false) {
        throw new RuntimeException('Failed to open terms export file: ' . $path);
    }

    $count = 0;
    $lastHash = '';

    try {
        do {
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT id, term_identity_hash, language_type, lemma, lemma_normalized, strongs_number,
                        strongs_extended, transliteration, transliteration_ko, root, gloss, gloss_ko,
                        definition, created_at, updated_at
                    FROM {$termsTable}
                    WHERE term_identity_hash > %s
                    ORDER BY term_identity_hash ASC
                    LIMIT 1000",
                    $lastHash
                ),
                'ARRAY_A'
            );

            if (! is_array($rows)) {
                throw new RuntimeException('Failed to read original terms for export.');
            }

            foreach ($rows as $row) {
                $lastHash = (string) $row['term_identity_hash'];
                wcm_ol_export_write_json_line($handle, $row);
                $count++;
            }
        } while ($rows !== []);
    } finally {
        fclose($handle);
    }

    return $count;
}

function wcm_ol_export_occurrences(string $occurrencesTable, string $termsTable, string $path): int
{
    global $wpdb;

    $handle = fopen($path, 'wb');
    if ($handle === false) {
        throw new RuntimeException('Failed to open occurrences export file: ' . $path);
    }

    $count = 0;
    $last = [
        'source_dataset' => '',
        'book_id' => 0,
        'chapter' => 0,
        'verse' => 0,
        'word_order' => 0,
        'subword_order' => 0,
        'token_type' => '',
    ];

    try {
        do {
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT
                        occurrences.id,
                        occurrences.term_id,
                        terms.term_identity_hash,
                        occurrences.book_id,
                        occurrences.chapter,
                        occurrences.verse,
                        occurrences.word_order,
                        occurrences.subword_order,
                        occurrences.token_type,
                        occurrences.surface_form,
                        occurrences.normalized_form,
                        occurrences.morphology,
                        occurrences.grammar_summary,
                        occurrences.grammar_note,
                        occurrences.contextual_function,
                        occurrences.source_dataset,
                        occurrences.source_ref,
                        occurrences.created_at,
                        occurrences.updated_at
                    FROM {$occurrencesTable} occurrences
                    INNER JOIN {$termsTable} terms ON terms.id = occurrences.term_id
                    WHERE (
                        occurrences.source_dataset > %s
                        OR (occurrences.source_dataset = %s AND occurrences.book_id > %d)
                        OR (occurrences.source_dataset = %s AND occurrences.book_id = %d AND occurrences.chapter > %d)
                        OR (occurrences.source_dataset = %s AND occurrences.book_id = %d AND occurrences.chapter = %d AND occurrences.verse > %d)
                        OR (occurrences.source_dataset = %s AND occurrences.book_id = %d AND occurrences.chapter = %d AND occurrences.verse = %d AND occurrences.word_order > %d)
                        OR (occurrences.source_dataset = %s AND occurrences.book_id = %d AND occurrences.chapter = %d AND occurrences.verse = %d AND occurrences.word_order = %d AND occurrences.subword_order > %d)
                        OR (occurrences.source_dataset = %s AND occurrences.book_id = %d AND occurrences.chapter = %d AND occurrences.verse = %d AND occurrences.word_order = %d AND occurrences.subword_order = %d AND occurrences.token_type > %s)
                    )
                    ORDER BY occurrences.source_dataset ASC, occurrences.book_id ASC, occurrences.chapter ASC,
                        occurrences.verse ASC, occurrences.word_order ASC, occurrences.subword_order ASC,
                        occurrences.token_type ASC
                    LIMIT 5000",
                    $last['source_dataset'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['chapter'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['chapter'],
                    $last['verse'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['chapter'],
                    $last['verse'],
                    $last['word_order'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['chapter'],
                    $last['verse'],
                    $last['word_order'],
                    $last['subword_order'],
                    $last['source_dataset'],
                    $last['book_id'],
                    $last['chapter'],
                    $last['verse'],
                    $last['word_order'],
                    $last['subword_order'],
                    $last['token_type']
                ),
                'ARRAY_A'
            );

            if (! is_array($rows)) {
                throw new RuntimeException('Failed to read original word occurrences for export.');
            }

            foreach ($rows as $row) {
                wcm_ol_export_write_json_line($handle, $row);
                $last = [
                    'source_dataset' => (string) $row['source_dataset'],
                    'book_id' => (int) $row['book_id'],
                    'chapter' => (int) $row['chapter'],
                    'verse' => (int) $row['verse'],
                    'word_order' => (int) $row['word_order'],
                    'subword_order' => (int) $row['subword_order'],
                    'token_type' => (string) $row['token_type'],
                ];
                $count++;
            }
        } while ($rows !== []);
    } finally {
        fclose($handle);
    }

    return $count;
}

/**
 * @return array<string, int>
 */
function wcm_ol_export_source_dataset_counts(string $occurrencesTable): array
{
    global $wpdb;

    $rows = $wpdb->get_results(
        "SELECT source_dataset, COUNT(*) AS count
        FROM {$occurrencesTable}
        GROUP BY source_dataset
        ORDER BY source_dataset ASC",
        'ARRAY_A'
    );

    if (! is_array($rows)) {
        throw new RuntimeException('Failed to read source dataset counts.');
    }

    $counts = [];
    foreach ($rows as $row) {
        $counts[(string) $row['source_dataset']] = (int) $row['count'];
    }

    return $counts;
}

/**
 * @param resource $handle
 * @param array<string, mixed> $row
 */
function wcm_ol_export_write_json_line($handle, array $row): void
{
    $json = json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if (! is_string($json)) {
        throw new RuntimeException('Failed to encode JSONL row.');
    }

    if (fwrite($handle, $json . "\n") === false) {
        throw new RuntimeException('Failed to write JSONL row.');
    }
}

/**
 * @param array<string, mixed> $data
 */
function wcm_ol_export_write_json_file(string $path, array $data): void
{
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if (! is_string($json)) {
        throw new RuntimeException('Failed to encode manifest JSON.');
    }

    if (file_put_contents($path, $json . "\n") === false) {
        throw new RuntimeException('Failed to write JSON file: ' . $path);
    }
}

/**
 * @param array<string, string> $checksums
 */
function wcm_ol_export_write_checksums(string $path, array $checksums): void
{
    $lines = [];
    foreach ($checksums as $file => $checksum) {
        $lines[] = $checksum . '  ' . $file;
    }

    if (file_put_contents($path, implode("\n", $lines) . "\n") === false) {
        throw new RuntimeException('Failed to write checksum file: ' . $path);
    }
}

function wcm_ol_export_assert_table_exists(string $table): void
{
    global $wpdb;

    $exists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table));

    if ($exists !== $table) {
        throw new RuntimeException('Required table does not exist: ' . $table);
    }
}

function wcm_ol_export_assert_column_exists(string $table, string $column): void
{
    global $wpdb;

    $exists = $wpdb->get_var($wpdb->prepare("SHOW COLUMNS FROM {$table} LIKE %s", $column));

    if ($exists !== $column) {
        throw new RuntimeException("Required column does not exist: {$table}.{$column}");
    }
}

/**
 * @param array<string, mixed> $summary
 */
function wcm_ol_export_print_summary(array $summary): void
{
    fwrite(STDOUT, "Original Language Data Package exported.\n");
    fwrite(STDOUT, 'Output: ' . $summary['output'] . "\n");
    fwrite(STDOUT, 'Package ID: ' . $summary['package_id'] . "\n");
    fwrite(STDOUT, 'DB version: ' . $summary['db_version'] . "\n");
    fwrite(STDOUT, 'Terms: ' . $summary['terms'] . "\n");
    fwrite(STDOUT, 'Occurrences: ' . $summary['occurrences'] . "\n");
    fwrite(STDOUT, 'Manifest: ' . $summary['manifest'] . "\n");
    fwrite(STDOUT, 'Checksums: ' . $summary['checksums'] . "\n");
}
