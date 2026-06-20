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

    $report = seedReviewedKoreanGlosses($arguments['apply']);
    printSeedSummary($report, $arguments['apply']);

    exit($report['ok'] ? 0 : 1);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{apply: bool, dbSocket: string|null}
 */
function parseCliArguments(array $argv): array
{
    $apply = false;
    $dbSocket = null;

    foreach (array_slice($argv, 1) as $argument) {
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

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'apply' => $apply,
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

    return $matches[1];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     gloss: string,
 *     gloss_ko: string
 * }>
 */
function reviewedGlossSeeds(): array
{
    return [
        [
            'term_id' => 5577,
            'language_type' => 'hebrew',
            'lemma' => 'ו',
            'strongs_number' => 'H9002',
            'strongs_extended' => '',
            'transliteration' => 've.',
            'gloss' => 'and',
            'gloss_ko' => '그리고',
        ],
        [
            'term_id' => 5575,
            'language_type' => 'hebrew',
            'lemma' => 'ה',
            'strongs_number' => 'H9009',
            'strongs_extended' => '',
            'transliteration' => 'ha.',
            'gloss' => 'the',
            'gloss_ko' => '그',
        ],
        [
            'term_id' => 5601,
            'language_type' => 'hebrew',
            'lemma' => 'ל',
            'strongs_number' => 'H9005',
            'strongs_extended' => '',
            'transliteration' => 'le.',
            'gloss' => 'to',
            'gloss_ko' => '에게',
        ],
        [
            'term_id' => 4,
            'language_type' => 'hebrew',
            'lemma' => 'ב',
            'strongs_number' => 'H9003',
            'strongs_extended' => '',
            'transliteration' => 'be.',
            'gloss' => 'in',
            'gloss_ko' => '안에',
        ],
        [
            'term_id' => 5574,
            'language_type' => 'hebrew',
            'lemma' => 'אֵת',
            'strongs_number' => 'H853',
            'strongs_extended' => '',
            'transliteration' => "'et-",
            'gloss' => '[Obj.]',
            'gloss_ko' => '목적격 표지',
        ],
        [
            'term_id' => 18,
            'language_type' => 'greek',
            'lemma' => 'καί',
            'strongs_number' => 'G2532',
            'strongs_extended' => '',
            'transliteration' => 'kai',
            'gloss' => 'and',
            'gloss_ko' => '그리고',
        ],
        [
            'term_id' => 5612,
            'language_type' => 'hebrew',
            'lemma' => 'מ',
            'strongs_number' => 'H9006',
            'strongs_extended' => '',
            'transliteration' => 'mi.',
            'gloss' => 'from',
            'gloss_ko' => '로부터',
        ],
        [
            'term_id' => 5584,
            'language_type' => 'hebrew',
            'lemma' => 'עַל',
            'strongs_number' => 'H5921',
            'strongs_extended' => 'H5921A',
            'transliteration' => "'al-",
            'gloss' => 'upon',
            'gloss_ko' => '위에',
        ],
        [
            'term_id' => 5617,
            'language_type' => 'hebrew',
            'lemma' => 'אֶל',
            'strongs_number' => 'H413',
            'strongs_extended' => '',
            'transliteration' => "'El-",
            'gloss' => 'to(wards)',
            'gloss_ko' => '향하여',
        ],
        [
            'term_id' => 5655,
            'language_type' => 'hebrew',
            'lemma' => 'כֹּל',
            'strongs_number' => 'H3605',
            'strongs_extended' => '',
            'transliteration' => 'kol-',
            'gloss' => 'all',
            'gloss_ko' => '모든',
        ],
        [
            'term_id' => 5705,
            'language_type' => 'hebrew',
            'lemma' => 'לֹא',
            'strongs_number' => 'H3808',
            'strongs_extended' => '',
            'transliteration' => "lo'",
            'gloss' => 'not',
            'gloss_ko' => '아니다',
        ],
        [
            'term_id' => 5611,
            'language_type' => 'hebrew',
            'lemma' => 'אֲשֶׁר',
            'strongs_number' => 'H834',
            'strongs_extended' => 'H0834A',
            'transliteration' => "'a.Sher",
            'gloss' => 'which',
            'gloss_ko' => '관계사',
        ],
        [
            'term_id' => 5595,
            'language_type' => 'hebrew',
            'lemma' => 'כִּי',
            'strongs_number' => 'H3588',
            'strongs_extended' => 'H3588A',
            'transliteration' => 'ki-',
            'gloss' => 'for',
            'gloss_ko' => '왜냐하면',
        ],
        [
            'term_id' => 15,
            'language_type' => 'greek',
            'lemma' => 'δέ',
            'strongs_number' => 'G1161',
            'strongs_extended' => '',
            'transliteration' => 'de',
            'gloss' => 'but/and',
            'gloss_ko' => '그러나',
        ],
        [
            'term_id' => 85,
            'language_type' => 'greek',
            'lemma' => 'ἐν',
            'strongs_number' => 'G1722',
            'strongs_extended' => '',
            'transliteration' => 'en',
            'gloss' => 'in/on/among',
            'gloss_ko' => '안에',
        ],
    ];
}

/**
 * @return array{
 *     ok: bool,
 *     requested: int,
 *     validated: int,
 *     updated: int,
 *     unchanged: int,
 *     errors: string[],
 *     updated_term_ids: int[]
 * }
 */
function seedReviewedKoreanGlosses(bool $apply): array
{
    global $wpdb;

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $seeds = reviewedGlossSeeds();
    $errors = [];
    $validated = 0;
    $updated = 0;
    $unchanged = 0;
    $updatedTermIds = [];

    ensureColumnExists($termsTable, 'gloss_ko');

    if ($apply) {
        $wpdb->query('START TRANSACTION');
    }

    try {
        foreach ($seeds as $seed) {
            $row = readSeedTerm($termsTable, $seed['term_id']);

            if ($row === null) {
                $errors[] = 'Missing term ID ' . $seed['term_id'] . '.';
                continue;
            }

            $identityErrors = validateSeedIdentity($row, $seed);
            if ($identityErrors !== []) {
                array_push($errors, ...$identityErrors);
                continue;
            }

            if (! seedHasOccurrences($termsTable, $seed['term_id'])) {
                $errors[] = 'Seed term ID ' . $seed['term_id'] . ' has no occurrences.';
                continue;
            }

            $currentKo = nullableString($row['gloss_ko'] ?? null);

            if ($currentKo !== null && $currentKo !== '' && $currentKo !== $seed['gloss_ko']) {
                $errors[] = 'Seed term ID ' . $seed['term_id'] . ' already has a different gloss_ko value.';
                continue;
            }

            $validated++;

            if ($currentKo === $seed['gloss_ko']) {
                $unchanged++;
                continue;
            }

            if ($apply) {
                $result = $wpdb->update(
                    $termsTable,
                    ['gloss_ko' => $seed['gloss_ko']],
                    [
                        'id' => $seed['term_id'],
                        'language_type' => $seed['language_type'],
                        'strongs_number' => $seed['strongs_number'],
                        'strongs_extended' => $seed['strongs_extended'],
                        'transliteration' => $seed['transliteration'],
                        'gloss' => $seed['gloss'],
                    ],
                    ['%s'],
                    ['%d', '%s', '%s', '%s', '%s', '%s']
                );

                if ($result === false) {
                    $errors[] = 'Failed to update gloss_ko for term ID ' . $seed['term_id'] . '.';
                    continue;
                }
            }

            $updated++;
            $updatedTermIds[] = $seed['term_id'];
        }

        if ($errors !== []) {
            if ($apply) {
                $wpdb->query('ROLLBACK');
            }

            return seedReport(count($seeds), $validated, 0, $unchanged, $errors, []);
        }

        if ($apply) {
            validateAppliedSeeds($termsTable, $seeds);
            $wpdb->query('COMMIT');
        }

        return seedReport(count($seeds), $validated, $updated, $unchanged, [], $updatedTermIds);
    } catch (Throwable $exception) {
        if ($apply) {
            $wpdb->query('ROLLBACK');
        }

        return seedReport(count($seeds), $validated, 0, $unchanged, [$exception->getMessage()], []);
    }
}

function ensureColumnExists(string $tableName, string $columnName): void
{
    global $wpdb;

    $column = $wpdb->get_var(
        $wpdb->prepare("SHOW COLUMNS FROM {$tableName} LIKE %s", $columnName)
    );

    if ($column !== $columnName) {
        throw new RuntimeException("Required column does not exist: {$tableName}.{$columnName}");
    }
}

/**
 * @return array<string, mixed>|null
 */
function readSeedTerm(string $termsTable, int $termId): ?array
{
    global $wpdb;

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT id, language_type, lemma, strongs_number, strongs_extended, transliteration, gloss, gloss_ko
            FROM {$termsTable}
            WHERE id = %d
            LIMIT 1",
            $termId
        ),
        'ARRAY_A'
    );

    return is_array($row) ? $row : null;
}

function seedHasOccurrences(string $termsTable, int $termId): bool
{
    global $wpdb;

    $occurrencesTable = str_replace('wcm_original_terms', 'wcm_original_word_occurrences', $termsTable);
    $count = (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$occurrencesTable} WHERE term_id = %d",
            $termId
        )
    );

    return $count > 0;
}

/**
 * @param array<string, mixed> $row
 * @param array<string, mixed> $seed
 * @return string[]
 */
function validateSeedIdentity(array $row, array $seed): array
{
    $errors = [];

    foreach (['language_type', 'lemma', 'strongs_number', 'strongs_extended', 'transliteration', 'gloss'] as $field) {
        if ((string) $row[$field] !== (string) $seed[$field]) {
            $errors[] = 'Seed term ID ' . $seed['term_id'] . " identity mismatch for {$field}.";
        }
    }

    return $errors;
}

/**
 * @param array<int, array<string, mixed>> $seeds
 */
function validateAppliedSeeds(string $termsTable, array $seeds): void
{
    foreach ($seeds as $seed) {
        $row = readSeedTerm($termsTable, $seed['term_id']);

        if ($row === null || nullableString($row['gloss_ko'] ?? null) !== $seed['gloss_ko']) {
            throw new RuntimeException('Post-update validation failed for term ID ' . $seed['term_id'] . '.');
        }

        if ((string) $row['gloss'] !== $seed['gloss']) {
            throw new RuntimeException('Source gloss changed unexpectedly for term ID ' . $seed['term_id'] . '.');
        }
    }
}

function nullableString(mixed $value): ?string
{
    return $value === null ? null : (string) $value;
}

/**
 * @param string[] $errors
 * @param int[] $updatedTermIds
 * @return array{
 *     ok: bool,
 *     requested: int,
 *     validated: int,
 *     updated: int,
 *     unchanged: int,
 *     errors: string[],
 *     updated_term_ids: int[]
 * }
 */
function seedReport(
    int $requested,
    int $validated,
    int $updated,
    int $unchanged,
    array $errors,
    array $updatedTermIds
): array {
    return [
        'ok' => $errors === [],
        'requested' => $requested,
        'validated' => $validated,
        'updated' => $updated,
        'unchanged' => $unchanged,
        'errors' => $errors,
        'updated_term_ids' => $updatedTermIds,
    ];
}

/**
 * @param array{
 *     ok: bool,
 *     requested: int,
 *     validated: int,
 *     updated: int,
 *     unchanged: int,
 *     errors: string[],
 *     updated_term_ids: int[]
 * } $report
 */
function printSeedSummary(array $report, bool $apply): void
{
    fwrite(STDOUT, 'Mode: ' . ($apply ? 'apply' : 'dry-run') . "\n");
    fwrite(STDOUT, 'Requested seeds: ' . $report['requested'] . "\n");
    fwrite(STDOUT, 'Validated seeds: ' . $report['validated'] . "\n");
    fwrite(STDOUT, 'Updated terms: ' . $report['updated'] . "\n");
    fwrite(STDOUT, 'Already seeded: ' . $report['unchanged'] . "\n");

    if ($report['updated_term_ids'] !== []) {
        fwrite(STDOUT, 'Updated term IDs: ' . implode(', ', $report['updated_term_ids']) . "\n");
    }

    foreach ($report['errors'] as $error) {
        fwrite(STDERR, 'ERROR: ' . $error . "\n");
    }

    if (! $apply && $report['ok']) {
        fwrite(STDOUT, "Dry-run only. Re-run with --apply to update reviewed seed values.\n");
    }
}
