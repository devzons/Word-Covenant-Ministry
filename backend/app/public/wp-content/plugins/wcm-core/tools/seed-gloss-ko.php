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

    $report = seedReviewedKoreanGlosses($arguments['apply'], $arguments['seedSet']);
    printSeedSummary($report, $arguments['apply'], $arguments['seedSet']);

    exit($report['ok'] ? 0 : 1);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @param string[] $argv
 * @return array{apply: bool, dbSocket: string|null, seedSet: string}
 */
function parseCliArguments(array $argv): array
{
    $apply = false;
    $dbSocket = null;
    $seedSet = 'phase8c-approved';

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

        if (str_starts_with($argument, '--seed-set=')) {
            $seedSet = substr($argument, strlen('--seed-set='));
            continue;
        }

        if ($argument === '--seed-set') {
            throw new RuntimeException('Use --seed-set=phase8c-approved, --seed-set=phase8e-approved-lexical, --seed-set=phase8e5-approved-reviewed, --seed-set=phase8f3-top250-filled, or --seed-set=phase8f5-top500-filled.');
        }

        throw new RuntimeException('Unknown argument: ' . $argument);
    }

    if ($dbSocket !== null && trim($dbSocket) === '') {
        throw new RuntimeException('The --db-socket value must not be empty.');
    }

    return [
        'apply' => $apply,
        'dbSocket' => $dbSocket,
        'seedSet' => $seedSet,
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
function reviewedGlossSeeds(string $seedSet): array
{
    return match ($seedSet) {
        'phase8c-approved' => phase8cApprovedGlossSeeds(),
        'phase8e-approved-lexical' => phase8eApprovedLexicalGlossSeeds(),
        'phase8e5-approved-reviewed' => phase8e5ApprovedReviewedGlossSeeds(),
        'phase8f3-top250-filled' => phase8f3Top250FilledGlossSeeds(),
        'phase8f5-top500-filled' => phase8f5Top500FilledGlossSeeds(),
        default => throw new RuntimeException('Unknown seed set: ' . $seedSet),
    };
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
function phase8cApprovedGlossSeeds(): array
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
function phase8eApprovedLexicalGlossSeeds(): array
{
    return [
        [
            'term_id' => 6352,
            'language_type' => 'hebrew',
            'lemma' => 'מֶ֫לֶךְ',
            'strongs_number' => 'H4428',
            'strongs_extended' => 'H4428G',
            'transliteration' => 'Me.lekh',
            'gloss' => 'king',
            'gloss_ko' => '왕',
        ],
        [
            'term_id' => 7129,
            'language_type' => 'hebrew',
            'lemma' => 'יִשְׂרָאֵל',
            'strongs_number' => 'H3478',
            'strongs_extended' => '',
            'transliteration' => "Yis.ra.'El",
            'gloss' => 'Israel',
            'gloss_ko' => '이스라엘',
        ],
        [
            'term_id' => 7,
            'language_type' => 'hebrew',
            'lemma' => 'אֱלֹהִים',
            'strongs_number' => 'H430',
            'strongs_extended' => 'H0430G',
            'transliteration' => "'E.lo.Him",
            'gloss' => 'God',
            'gloss_ko' => '하나님',
        ],
        [
            'term_id' => 5602,
            'language_type' => 'hebrew',
            'lemma' => 'יוֹם',
            'strongs_number' => 'H3117',
            'strongs_extended' => 'H3117G',
            'transliteration' => 'Yom',
            'gloss' => 'day',
            'gloss_ko' => '날',
        ],
        [
            'term_id' => 6258,
            'language_type' => 'hebrew',
            'lemma' => 'עַם',
            'strongs_number' => 'H5971',
            'strongs_extended' => 'H5971A',
            'transliteration' => "'am",
            'gloss' => 'people',
            'gloss_ko' => '백성',
        ],
        [
            'term_id' => 129,
            'language_type' => 'greek',
            'lemma' => 'θεός',
            'strongs_number' => 'G2316',
            'strongs_extended' => '',
            'transliteration' => 'theos',
            'gloss' => 'God',
            'gloss_ko' => '하나님',
        ],
        [
            'term_id' => 5920,
            'language_type' => 'hebrew',
            'lemma' => 'עִיר',
            'strongs_number' => 'H5892',
            'strongs_extended' => 'H5892B',
            'transliteration' => "'Ir",
            'gloss' => 'city',
            'gloss_ko' => '성읍',
        ],
        [
            'term_id' => 5781,
            'language_type' => 'hebrew',
            'lemma' => 'אִישׁ',
            'strongs_number' => 'H376',
            'strongs_extended' => 'H0376G',
            'transliteration' => "'Ish",
            'gloss' => 'man',
            'gloss_ko' => '남자',
        ],
        [
            'term_id' => 10360,
            'language_type' => 'hebrew',
            'lemma' => 'דָּוִד',
            'strongs_number' => 'H1732',
            'strongs_extended' => '',
            'transliteration' => 'da.Vid',
            'gloss' => 'David',
            'gloss_ko' => '다윗',
        ],
        [
            'term_id' => 5606,
            'language_type' => 'hebrew',
            'lemma' => 'אֶחָד',
            'strongs_number' => 'H259',
            'strongs_extended' => '',
            'transliteration' => "'e.Chad",
            'gloss' => 'one',
            'gloss_ko' => '하나',
        ],
    ];
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
function phase8e5ApprovedReviewedGlossSeeds(): array
{
    return [
        [
            'term_id' => 5578,
            'language_type' => 'hebrew',
            'lemma' => 'אֶ֫רֶץ',
            'strongs_number' => 'H776',
            'strongs_extended' => 'H0776G',
            'transliteration' => "'A.retz",
            'gloss' => 'country;_planet',
            'gloss_ko' => '땅',
        ],
        [
            'term_id' => 5739,
            'language_type' => 'hebrew',
            'lemma' => 'הוּא',
            'strongs_number' => 'H1931',
            'strongs_extended' => '',
            'transliteration' => "hu'",
            'gloss' => 'he;_she;_it',
            'gloss_ko' => '그',
        ],
        [
            'term_id' => 135,
            'language_type' => 'greek',
            'lemma' => 'οὐ',
            'strongs_number' => 'G3756',
            'strongs_extended' => '',
            'transliteration' => 'ouk',
            'gloss' => 'no',
            'gloss_ko' => '아니다',
        ],
        [
            'term_id' => 5783,
            'language_type' => 'hebrew',
            'lemma' => 'אָב',
            'strongs_number' => 'H1',
            'strongs_extended' => 'H0001G',
            'transliteration' => "'a.Vi",
            'gloss' => 'father',
            'gloss_ko' => '아버지',
        ],
        [
            'term_id' => 5956,
            'language_type' => 'hebrew',
            'lemma' => 'זֶה',
            'strongs_number' => 'H2088',
            'strongs_extended' => '',
            'transliteration' => 'zeh',
            'gloss' => 'this',
            'gloss_ko' => '이것',
        ],
        [
            'term_id' => 91,
            'language_type' => 'greek',
            'lemma' => 'μή',
            'strongs_number' => 'G3361',
            'strongs_extended' => '',
            'transliteration' => 'mē',
            'gloss' => 'not',
            'gloss_ko' => '아니다',
        ],
        [
            'term_id' => 5804,
            'language_type' => 'hebrew',
            'lemma' => 'עִם',
            'strongs_number' => 'H5973',
            'strongs_extended' => 'H5973A',
            'transliteration' => "'i.Ma",
            'gloss' => 'with',
            'gloss_ko' => '함께',
        ],
    ];
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
function phase8f3Top250FilledGlossSeeds(): array
{
    $worksheetPath = '/tmp/wcm_phase8f2_top250_gloss_filled.tsv';
    $seedsByTermId = [];

    foreach (readPhase8f3ApprovedWorksheetRows($worksheetPath, 'proposed_gloss_ko') as $row) {
        $seed = phase8f3ReviewedGlossSeed((int) $row['term_id'], $row['proposed_gloss_ko']);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    foreach ([101 => '주', 3 => '예수'] as $termId => $glossKo) {
        $seed = phase8f3ReviewedGlossSeed($termId, $glossKo);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    $seeds = array_values($seedsByTermId);

    if (count($seeds) !== 66) {
        throw new RuntimeException('Phase 8F-3 gloss seed set must contain exactly 66 reviewed rows.');
    }

    return $seeds;
}

/**
 * @return array<string, string>[]
 */
function readPhase8f3ApprovedWorksheetRows(string $path, string $valueColumn): array
{
    if (! is_file($path)) {
        throw new RuntimeException('Phase 8F-3 worksheet not found: ' . $path);
    }

    $handle = fopen($path, 'rb');

    if ($handle === false) {
        throw new RuntimeException('Unable to read Phase 8F-3 worksheet: ' . $path);
    }

    $header = fgetcsv($handle, 0, "\t");

    if (! is_array($header)) {
        fclose($handle);
        throw new RuntimeException('Phase 8F-3 worksheet is empty: ' . $path);
    }

    $rows = [];

    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        $row = array_combine($header, $values);

        if (! is_array($row)) {
            fclose($handle);
            throw new RuntimeException('Phase 8F-3 worksheet row does not match the header.');
        }

        if ((int) ($row['rank'] ?? 0) > 250) {
            continue;
        }

        if (($row['recommendation'] ?? '') !== 'approve_seed') {
            continue;
        }

        if (($row[$valueColumn] ?? '') === '') {
            throw new RuntimeException('Approved Phase 8F-3 row is missing ' . $valueColumn . '.');
        }

        $rows[] = $row;
    }

    fclose($handle);

    return $rows;
}

/**
 * @return array{
 *     term_id: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     gloss: string,
 *     gloss_ko: string
 * }
 */
function phase8f3ReviewedGlossSeed(int $termId, string $glossKo): array
{
    global $wpdb;

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $term = readSeedTerm($termsTable, $termId);

    if ($term === null) {
        throw new RuntimeException('Missing Phase 8F-3 term ID ' . $termId . '.');
    }

    return [
        'term_id' => $termId,
        'language_type' => (string) $term['language_type'],
        'lemma' => (string) $term['lemma'],
        'strongs_number' => (string) $term['strongs_number'],
        'strongs_extended' => (string) $term['strongs_extended'],
        'transliteration' => (string) $term['transliteration'],
        'gloss' => (string) $term['gloss'],
        'gloss_ko' => $glossKo,
    ];
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
function phase8f5Top500FilledGlossSeeds(): array
{
    $worksheetPath = '/tmp/wcm_phase8f4_top500_gloss_filled.tsv';
    $seedsByTermId = [];

    foreach (readPhase8f5ApprovedWorksheetRows($worksheetPath, 'proposed_gloss_ko') as $row) {
        $seed = phase8f3ReviewedGlossSeed((int) $row['term_id'], $row['proposed_gloss_ko']);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    $seeds = array_values($seedsByTermId);

    if (count($seeds) !== 259) {
        throw new RuntimeException('Phase 8F-5 gloss seed set must contain exactly 259 reviewed rows.');
    }

    return $seeds;
}

/**
 * @return array<string, string>[]
 */
function readPhase8f5ApprovedWorksheetRows(string $path, string $valueColumn): array
{
    if (! is_file($path)) {
        throw new RuntimeException('Phase 8F-5 worksheet not found: ' . $path);
    }

    $handle = fopen($path, 'rb');

    if ($handle === false) {
        throw new RuntimeException('Unable to read Phase 8F-5 worksheet: ' . $path);
    }

    $header = fgetcsv($handle, 0, "\t");

    if (! is_array($header)) {
        fclose($handle);
        throw new RuntimeException('Phase 8F-5 worksheet is empty: ' . $path);
    }

    $rows = [];

    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        $row = array_combine($header, $values);

        if (! is_array($row)) {
            fclose($handle);
            throw new RuntimeException('Phase 8F-5 worksheet row does not match the header.');
        }

        if ((int) ($row['rank'] ?? 0) > 500) {
            continue;
        }

        if (($row['recommendation'] ?? '') !== 'approve_seed') {
            continue;
        }

        if (($row[$valueColumn] ?? '') === '') {
            continue;
        }

        if (phase8f5IsForbiddenWorksheetRow($row)) {
            continue;
        }

        $rows[] = $row;
    }

    fclose($handle);

    return $rows;
}

/**
 * @param array<string, string> $row
 */
function phase8f5IsForbiddenWorksheetRow(array $row): bool
{
    $forbiddenLemmas = ['אָדוֹן', 'יְהֹוִה', 'צָבָא', 'אֵל', 'יָרֵא'];
    $forbiddenGlosses = ['lord', 'YHWH|Yahweh', 'Hosts', 'God', 'awesome(god)'];

    return in_array($row['lemma'] ?? '', $forbiddenLemmas, true)
        || in_array($row['current_gloss'] ?? '', $forbiddenGlosses, true);
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
function seedReviewedKoreanGlosses(bool $apply, string $seedSet): array
{
    global $wpdb;

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $seeds = reviewedGlossSeeds($seedSet);
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
function printSeedSummary(array $report, bool $apply, string $seedSet): void
{
    fwrite(STDOUT, 'Mode: ' . ($apply ? 'apply' : 'dry-run') . "\n");
    fwrite(STDOUT, 'Seed set: ' . $seedSet . "\n");
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
