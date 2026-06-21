<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

require_once __DIR__ . '/verify-original-language-package.php';

try {
    $arguments = wcm_ol_import_parse_arguments($argv);

    wcm_ol_package_load_composer_autoload();
    wcm_ol_package_bootstrap_wordpress($arguments['dbSocket']);

    $report = wcm_ol_import_package($arguments['package'], $arguments['apply']);
    wcm_ol_import_print_report($report);

    exit($report['ok'] ? 0 : 1);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{package: string, apply: bool, dbSocket: string|null}
 */
function wcm_ol_import_parse_arguments(array $argv): array
{
    $package = null;
    $apply = false;
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
        if (str_starts_with($argument, '--package=')) {
            $package = substr($argument, strlen('--package='));
            continue;
        }

        if ($argument === '--package') {
            throw new RuntimeException('Use --package=/path/to/package-directory.');
        }

        if ($argument === '--apply') {
            $apply = true;
            continue;
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
        throw new RuntimeException('Usage: php tools/import-original-language-package.php --package=/path/to/package-directory [--apply] [--db-socket=/path/to/mysqld.sock]');
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'package' => $package,
        'apply' => $apply,
        'dbSocket' => $dbSocket,
    ];
}

/**
 * @return array<string, mixed>
 */
function wcm_ol_import_package(string $package, bool $apply): array
{
    global $wpdb;

    if ($apply && function_exists('wp_get_environment_type') && wp_get_environment_type() === 'production') {
        throw new RuntimeException('Refusing to apply an original-language package against a production WordPress environment.');
    }

    $verifyReport = wcm_ol_package_verify($package);
    if (! $verifyReport['ok']) {
        return [
            'ok' => false,
            'mode' => $apply ? 'apply' : 'dry-run',
            'package_path' => $verifyReport['package_path'],
            'verify_errors' => $verifyReport['errors'],
        ];
    }

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
    $packagePath = $verifyReport['package_path'];

    $report = [
        'ok' => true,
        'mode' => $apply ? 'apply' : 'dry-run',
        'package_path' => $packagePath,
        'package_id' => (string) ($verifyReport['manifest']['package_id'] ?? ''),
        'terms_seen' => 0,
        'terms_inserted' => 0,
        'terms_existing' => 0,
        'terms_korean_filled' => 0,
        'terms_korean_conflicts' => 0,
        'occurrences_seen' => 0,
        'occurrences_inserted' => 0,
        'occurrences_existing' => 0,
        'errors' => [],
    ];

    if ($apply) {
        $wpdb->query('START TRANSACTION');
    }

    try {
        $termMap = wcm_ol_import_terms($packagePath . '/original-terms.jsonl', $termsTable, $apply, $report);

        if ($report['terms_korean_conflicts'] > 0) {
            $report['ok'] = false;
            $report['errors'][] = 'Reviewed Korean field conflicts were detected. Import skipped conflicting values.';
            if ($apply) {
                $wpdb->query('ROLLBACK');
            }

            return $report;
        }

        wcm_ol_import_occurrences($packagePath . '/original-word-occurrences.jsonl', $occurrencesTable, $termMap, $apply, $report);

        if ($report['errors'] !== []) {
            $report['ok'] = false;
            if ($apply) {
                $wpdb->query('ROLLBACK');
            }

            return $report;
        }

        if ($apply) {
            $wpdb->query('COMMIT');
        }

        return $report;
    } catch (Throwable $exception) {
        if ($apply) {
            $wpdb->query('ROLLBACK');
        }

        $report['ok'] = false;
        $report['errors'][] = $exception->getMessage();
        return $report;
    }
}

/**
 * @param array<string, mixed> $report
 * @return array<string, int>
 */
function wcm_ol_import_terms(string $path, string $termsTable, bool $apply, array &$report): array
{
    global $wpdb;

    $termMap = [];

    foreach (wcm_ol_package_read_jsonl($path) as $row) {
        $report['terms_seen']++;
        $hash = (string) $row['term_identity_hash'];
        $existing = wcm_ol_import_read_term_by_hash($termsTable, $hash);

        if ($existing === null) {
            if ($apply) {
                $termId = wcm_ol_import_insert_term($termsTable, $row);
                $termMap[$hash] = $termId;
            } else {
                $termMap[$hash] = (int) $row['id'];
            }

            $report['terms_inserted']++;
            continue;
        }

        $termMap[$hash] = (int) $existing['id'];
        $report['terms_existing']++;

        $updates = [];
        foreach (['transliteration_ko', 'gloss_ko'] as $field) {
            $incoming = wcm_ol_import_nullable_string($row[$field] ?? null);
            $current = wcm_ol_import_nullable_string($existing[$field] ?? null);

            if ($incoming === null || $incoming === '') {
                continue;
            }

            if ($current !== null && $current !== '' && $current !== $incoming) {
                $report['terms_korean_conflicts']++;
                $report['errors'][] = sprintf('Term %s has conflicting reviewed %s value.', $hash, $field);
                continue;
            }

            if ($current === null || $current === '') {
                $updates[$field] = $incoming;
            }
        }

        if ($updates !== []) {
            if ($apply) {
                $updates['updated_at'] = current_time('mysql');
                $formats = array_fill(0, count($updates), '%s');
                $updated = $wpdb->update($termsTable, $updates, ['id' => (int) $existing['id']], $formats, ['%d']);
                if ($updated === false) {
                    throw new RuntimeException('Failed to update Korean fields for term hash ' . $hash . '.');
                }
            }

            $report['terms_korean_filled'] += count($updates);
        }
    }

    return $termMap;
}

/**
 * @param array<string, mixed> $row
 */
function wcm_ol_import_insert_term(string $termsTable, array $row): int
{
    global $wpdb;

    $data = [
        'language_type' => (string) $row['language_type'],
        'lemma' => (string) $row['lemma'],
        'lemma_normalized' => (string) $row['lemma_normalized'],
        'strongs_number' => (string) $row['strongs_number'],
        'strongs_extended' => (string) $row['strongs_extended'],
        'term_identity_hash' => (string) $row['term_identity_hash'],
        'transliteration' => (string) $row['transliteration'],
        'transliteration_ko' => wcm_ol_import_nullable_string($row['transliteration_ko'] ?? null),
        'root' => (string) $row['root'],
        'gloss' => wcm_ol_import_nullable_string($row['gloss'] ?? null),
        'gloss_ko' => wcm_ol_import_nullable_string($row['gloss_ko'] ?? null),
        'definition' => wcm_ol_import_nullable_string($row['definition'] ?? null),
        'created_at' => wcm_ol_import_datetime_or_now($row['created_at'] ?? null),
        'updated_at' => wcm_ol_import_datetime_or_now($row['updated_at'] ?? null),
    ];

    $inserted = $wpdb->insert(
        $termsTable,
        $data,
        ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
    );

    if ($inserted === false) {
        throw new RuntimeException('Failed to insert original term hash ' . (string) $row['term_identity_hash'] . '.');
    }

    return (int) $wpdb->insert_id;
}

/**
 * @param array<string, int> $termMap
 * @param array<string, mixed> $report
 */
function wcm_ol_import_occurrences(string $path, string $occurrencesTable, array $termMap, bool $apply, array &$report): void
{
    foreach (wcm_ol_package_read_jsonl($path) as $row) {
        $report['occurrences_seen']++;
        $hash = (string) $row['term_identity_hash'];

        if (! isset($termMap[$hash])) {
            $report['errors'][] = 'Occurrence references unresolved term hash ' . $hash . '.';
            continue;
        }

        $existingId = wcm_ol_import_find_occurrence_id($occurrencesTable, $row);
        if ($existingId !== null) {
            $report['occurrences_existing']++;
            continue;
        }

        if ($apply) {
            wcm_ol_import_insert_occurrence($occurrencesTable, $row, $termMap[$hash]);
        }

        $report['occurrences_inserted']++;
    }
}

/**
 * @param array<string, mixed> $row
 */
function wcm_ol_import_insert_occurrence(string $occurrencesTable, array $row, int $termId): int
{
    global $wpdb;

    $data = [
        'term_id' => $termId,
        'book_id' => (int) $row['book_id'],
        'chapter' => (int) $row['chapter'],
        'verse' => (int) $row['verse'],
        'word_order' => (int) $row['word_order'],
        'subword_order' => (int) $row['subword_order'],
        'token_type' => (string) $row['token_type'],
        'surface_form' => (string) $row['surface_form'],
        'normalized_form' => (string) $row['normalized_form'],
        'morphology' => (string) $row['morphology'],
        'grammar_summary' => wcm_ol_import_nullable_string($row['grammar_summary'] ?? null),
        'grammar_note' => wcm_ol_import_nullable_string($row['grammar_note'] ?? null),
        'contextual_function' => wcm_ol_import_nullable_string($row['contextual_function'] ?? null),
        'source_dataset' => (string) $row['source_dataset'],
        'source_ref' => (string) $row['source_ref'],
        'created_at' => wcm_ol_import_datetime_or_now($row['created_at'] ?? null),
        'updated_at' => wcm_ol_import_datetime_or_now($row['updated_at'] ?? null),
    ];

    $inserted = $wpdb->insert(
        $occurrencesTable,
        $data,
        ['%d', '%d', '%d', '%d', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
    );

    if ($inserted === false) {
        throw new RuntimeException('Failed to insert original word occurrence.');
    }

    return (int) $wpdb->insert_id;
}

/**
 * @return array<string, mixed>|null
 */
function wcm_ol_import_read_term_by_hash(string $termsTable, string $hash): ?array
{
    global $wpdb;

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT id, term_identity_hash, transliteration_ko, gloss_ko
            FROM {$termsTable}
            WHERE term_identity_hash = %s
            LIMIT 1",
            $hash
        ),
        'ARRAY_A'
    );

    return is_array($row) ? $row : null;
}

/**
 * @param array<string, mixed> $row
 */
function wcm_ol_import_find_occurrence_id(string $occurrencesTable, array $row): ?int
{
    global $wpdb;

    $id = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT id FROM {$occurrencesTable}
            WHERE source_dataset = %s
            AND book_id = %d
            AND chapter = %d
            AND verse = %d
            AND word_order = %d
            AND subword_order = %d
            AND token_type = %s
            LIMIT 1",
            (string) $row['source_dataset'],
            (int) $row['book_id'],
            (int) $row['chapter'],
            (int) $row['verse'],
            (int) $row['word_order'],
            (int) $row['subword_order'],
            (string) $row['token_type']
        )
    );

    return $id === null ? null : (int) $id;
}

function wcm_ol_import_nullable_string(mixed $value): ?string
{
    if ($value === null) {
        return null;
    }

    return (string) $value;
}

function wcm_ol_import_datetime_or_now(mixed $value): string
{
    if (is_string($value) && preg_match('/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/', $value)) {
        return $value;
    }

    return current_time('mysql');
}

/**
 * @param array<string, mixed> $report
 */
function wcm_ol_import_print_report(array $report): void
{
    fwrite(STDOUT, "Original Language Data Package import\n");
    fwrite(STDOUT, 'Mode: ' . ($report['mode'] ?? 'dry-run') . "\n");
    fwrite(STDOUT, 'Package: ' . ($report['package_path'] ?? '') . "\n");
    fwrite(STDOUT, 'Status: ' . (($report['ok'] ?? false) ? 'ok' : 'failed') . "\n");

    if (isset($report['verify_errors'])) {
        foreach ($report['verify_errors'] as $error) {
            fwrite(STDERR, 'ERROR: ' . $error . "\n");
        }
        return;
    }

    fwrite(STDOUT, 'Terms seen: ' . $report['terms_seen'] . "\n");
    fwrite(STDOUT, 'Terms existing: ' . $report['terms_existing'] . "\n");
    fwrite(STDOUT, 'Terms to insert: ' . $report['terms_inserted'] . "\n");
    fwrite(STDOUT, 'Korean fields to fill: ' . $report['terms_korean_filled'] . "\n");
    fwrite(STDOUT, 'Korean field conflicts: ' . $report['terms_korean_conflicts'] . "\n");
    fwrite(STDOUT, 'Occurrences seen: ' . $report['occurrences_seen'] . "\n");
    fwrite(STDOUT, 'Occurrences existing: ' . $report['occurrences_existing'] . "\n");
    fwrite(STDOUT, 'Occurrences to insert: ' . $report['occurrences_inserted'] . "\n");

    foreach ($report['errors'] as $error) {
        fwrite(STDERR, 'ERROR: ' . $error . "\n");
    }

    if (($report['mode'] ?? 'dry-run') === 'dry-run' && ($report['ok'] ?? false)) {
        fwrite(STDOUT, "Dry-run only. Re-run with --apply only after backup and explicit approval.\n");
    }
}

