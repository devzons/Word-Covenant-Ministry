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

    $report = seedReviewedKoreanTransliterations($arguments['apply'], $arguments['seedSet']);
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
    $seedSet = 'genesis-matthew-1-1';

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
            throw new RuntimeException(
                'Use --seed-set=genesis-matthew-1-1, --seed-set=top500-conservative, --seed-set=top-lexical-hebrew, --seed-set=phase8e-approved-lexical, --seed-set=phase8e5-approved-reviewed, --seed-set=phase8f3-top250-filled, or --seed-set=phase8f5-top500-filled.'
            );
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
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function reviewedSeeds(string $seedSet): array
{
    return match ($seedSet) {
        'genesis-matthew-1-1' => genesisMatthewReviewedSeeds(),
        'top500-conservative' => top500ConservativeReviewedSeeds(),
        'top-lexical-hebrew' => topLexicalHebrewReviewedSeeds(),
        'phase8e-approved-lexical' => phase8eApprovedLexicalReviewedSeeds(),
        'phase8e5-approved-reviewed' => phase8e5ApprovedReviewedSeeds(),
        'phase8f3-top250-filled' => phase8f3Top250FilledReviewedSeeds(),
        'phase8f5-top500-filled' => phase8f5Top500FilledReviewedSeeds(),
        default => throw new RuntimeException('Unknown seed set: ' . $seedSet),
    };
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function genesisMatthewReviewedSeeds(): array
{
    return [
        [
            'term_id' => 4,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'ב',
            'strongs_number' => 'H9003',
            'strongs_extended' => '',
            'transliteration' => 'be.',
            'transliteration_ko' => '베',
        ],
        [
            'term_id' => 5,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'רֵאשִׁית',
            'strongs_number' => 'H7225',
            'strongs_extended' => 'H7225G',
            'transliteration' => 're.Shit',
            'transliteration_ko' => '레쉬트',
        ],
        [
            'term_id' => 6,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'בָּרָא',
            'strongs_number' => 'H1254',
            'strongs_extended' => 'H1254A',
            'transliteration' => "ba.Ra'",
            'transliteration_ko' => '바라',
        ],
        [
            'term_id' => 7,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'אֱלֹהִים',
            'strongs_number' => 'H430',
            'strongs_extended' => 'H0430G',
            'transliteration' => "'E.lo.Him",
            'transliteration_ko' => '엘로힘',
        ],
        [
            'term_id' => 5574,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'אֵת',
            'strongs_number' => 'H853',
            'strongs_extended' => '',
            'transliteration' => "'et-",
            'transliteration_ko' => '에트',
        ],
        [
            'term_id' => 5575,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'ה',
            'strongs_number' => 'H9009',
            'strongs_extended' => '',
            'transliteration' => 'ha.',
            'transliteration_ko' => '하',
        ],
        [
            'term_id' => 5576,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'שָׁמַיִם',
            'strongs_number' => 'H8064',
            'strongs_extended' => '',
            'transliteration' => 'sha.Ma.yim',
            'transliteration_ko' => '샤마임',
        ],
        [
            'term_id' => 5577,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'ו',
            'strongs_number' => 'H9002',
            'strongs_extended' => '',
            'transliteration' => 've.',
            'transliteration_ko' => '베',
        ],
        [
            'term_id' => 5578,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'אֶ֫רֶץ',
            'strongs_number' => 'H776',
            'strongs_extended' => 'H0776G',
            'transliteration' => "'A.retz",
            'transliteration_ko' => '아레츠',
        ],
        [
            'term_id' => 1,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'βίβλος',
            'strongs_number' => 'G976',
            'strongs_extended' => '',
            'transliteration' => 'Biblos',
            'transliteration_ko' => '비블로스',
        ],
        [
            'term_id' => 2,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'γένεσις',
            'strongs_number' => 'G1078',
            'strongs_extended' => '',
            'transliteration' => 'geneseōs',
            'transliteration_ko' => '게네세오스',
        ],
        [
            'term_id' => 3,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'Ἰησοῦς',
            'strongs_number' => 'G2424',
            'strongs_extended' => 'G2424G',
            'transliteration' => 'Iēsou',
            'transliteration_ko' => '예수',
        ],
        [
            'term_id' => 8,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'Χριστός',
            'strongs_number' => 'G5547',
            'strongs_extended' => '',
            'transliteration' => 'Christou',
            'transliteration_ko' => '크리스투',
        ],
        [
            'term_id' => 9,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'υἱός',
            'strongs_number' => 'G5207',
            'strongs_extended' => '',
            'transliteration' => 'huiou',
            'transliteration_ko' => '휘우',
        ],
        [
            'term_id' => 10,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'Δαυείδ, Δαυίδ, Δαβίδ',
            'strongs_number' => 'G1138',
            'strongs_extended' => '',
            'transliteration' => 'Dauid',
            'transliteration_ko' => '다윗',
        ],
        [
            'term_id' => 11,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 1,
            'language_type' => 'greek',
            'lemma' => 'Ἀβραάμ',
            'strongs_number' => 'G11',
            'strongs_extended' => '',
            'transliteration' => 'Abraam',
            'transliteration_ko' => '아브라함',
        ],
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function top500ConservativeReviewedSeeds(): array
{
    return [
        [
            'term_id' => 5591,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 3,
            'language_type' => 'hebrew',
            'lemma' => 'ו',
            'strongs_number' => 'H9001',
            'strongs_extended' => '',
            'transliteration' => 'va.',
            'transliteration_ko' => '바',
        ],
        [
            'term_id' => 5601,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 5,
            'language_type' => 'hebrew',
            'lemma' => 'ל',
            'strongs_number' => 'H9005',
            'strongs_extended' => '',
            'transliteration' => 'le.',
            'transliteration_ko' => '레',
        ],
        [
            'term_id' => 18,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 2,
            'language_type' => 'greek',
            'lemma' => 'καί',
            'strongs_number' => 'G2532',
            'strongs_extended' => '',
            'transliteration' => 'kai',
            'transliteration_ko' => '카이',
        ],
        [
            'term_id' => 5612,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 7,
            'language_type' => 'hebrew',
            'lemma' => 'מ',
            'strongs_number' => 'H9006',
            'strongs_extended' => '',
            'transliteration' => 'mi.',
            'transliteration_ko' => '미',
        ],
        [
            'term_id' => 15,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 2,
            'language_type' => 'greek',
            'lemma' => 'δέ',
            'strongs_number' => 'G1161',
            'strongs_extended' => '',
            'transliteration' => 'de',
            'transliteration_ko' => '데',
        ],
        [
            'term_id' => 85,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 18,
            'language_type' => 'greek',
            'lemma' => 'ἐν',
            'strongs_number' => 'G1722',
            'strongs_extended' => '',
            'transliteration' => 'en',
            'transliteration_ko' => '엔',
        ],
        [
            'term_id' => 135,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 25,
            'language_type' => 'greek',
            'lemma' => 'οὐ',
            'strongs_number' => 'G3756',
            'strongs_extended' => '',
            'transliteration' => 'ouk',
            'transliteration_ko' => '우',
        ],
        [
            'term_id' => 91,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 19,
            'language_type' => 'greek',
            'lemma' => 'μή',
            'strongs_number' => 'G3361',
            'strongs_extended' => '',
            'transliteration' => 'mē',
            'transliteration_ko' => '메',
        ],
        [
            'term_id' => 217,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 2,
            'verse' => 16,
            'language_type' => 'greek',
            'lemma' => 'ὅτι',
            'strongs_number' => 'G3754',
            'strongs_extended' => 'G3754G',
            'transliteration' => 'hoti',
            'transliteration_ko' => '호티',
        ],
        [
            'term_id' => 237,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 2,
            'verse' => 18,
            'language_type' => 'greek',
            'lemma' => 'ὅτι',
            'strongs_number' => 'G3754',
            'strongs_extended' => 'G3754H',
            'transliteration' => 'hoti',
            'transliteration_ko' => '호티',
        ],
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function topLexicalHebrewReviewedSeeds(): array
{
    return [
        [
            'term_id' => 5584,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 2,
            'language_type' => 'hebrew',
            'lemma' => 'עַל',
            'strongs_number' => 'H5921',
            'strongs_extended' => 'H5921A',
            'transliteration' => "'al-",
            'transliteration_ko' => '알',
        ],
        [
            'term_id' => 5617,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 9,
            'language_type' => 'hebrew',
            'lemma' => 'אֶל',
            'strongs_number' => 'H413',
            'strongs_extended' => '',
            'transliteration' => "'El-",
            'transliteration_ko' => '엘',
        ],
        [
            'term_id' => 5655,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 21,
            'language_type' => 'hebrew',
            'lemma' => 'כֹּל',
            'strongs_number' => 'H3605',
            'strongs_extended' => '',
            'transliteration' => 'kol-',
            'transliteration_ko' => '콜',
        ],
        [
            'term_id' => 5705,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 2,
            'verse' => 5,
            'language_type' => 'hebrew',
            'lemma' => 'לֹא',
            'strongs_number' => 'H3808',
            'strongs_extended' => '',
            'transliteration' => "lo'",
            'transliteration_ko' => '로',
        ],
        [
            'term_id' => 5611,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 7,
            'language_type' => 'hebrew',
            'lemma' => 'אֲשֶׁר',
            'strongs_number' => 'H834',
            'strongs_extended' => 'H0834A',
            'transliteration' => "'a.Sher",
            'transliteration_ko' => '아쉐르',
        ],
        [
            'term_id' => 5595,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 4,
            'language_type' => 'hebrew',
            'lemma' => 'כִּי',
            'strongs_number' => 'H3588',
            'strongs_extended' => 'H3588A',
            'transliteration' => 'ki-',
            'transliteration_ko' => '키',
        ],
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function phase8eApprovedLexicalReviewedSeeds(): array
{
    return [
        [
            'term_id' => 6352,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 14,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'מֶ֫לֶךְ',
            'strongs_number' => 'H4428',
            'strongs_extended' => 'H4428G',
            'transliteration' => 'Me.lekh',
            'transliteration_ko' => '멜레크',
        ],
        [
            'term_id' => 7129,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 32,
            'verse' => 28,
            'language_type' => 'hebrew',
            'lemma' => 'יִשְׂרָאֵל',
            'strongs_number' => 'H3478',
            'strongs_extended' => '',
            'transliteration' => "Yis.ra.'El",
            'transliteration_ko' => '이스라엘',
        ],
        [
            'term_id' => 5602,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 5,
            'language_type' => 'hebrew',
            'lemma' => 'יוֹם',
            'strongs_number' => 'H3117',
            'strongs_extended' => 'H3117G',
            'transliteration' => 'Yom',
            'transliteration_ko' => '욤',
        ],
        [
            'term_id' => 6258,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 11,
            'verse' => 6,
            'language_type' => 'hebrew',
            'lemma' => 'עַם',
            'strongs_number' => 'H5971',
            'strongs_extended' => 'H5971A',
            'transliteration' => "'am",
            'transliteration_ko' => '암',
        ],
        [
            'term_id' => 129,
            'source_dataset' => 'STEP_TAGNT',
            'book_slug' => 'matthew',
            'chapter' => 1,
            'verse' => 23,
            'language_type' => 'greek',
            'lemma' => 'θεός',
            'strongs_number' => 'G2316',
            'strongs_extended' => '',
            'transliteration' => 'theos',
            'transliteration_ko' => '테오스',
        ],
        [
            'term_id' => 5920,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 4,
            'verse' => 17,
            'language_type' => 'hebrew',
            'lemma' => 'עִיר',
            'strongs_number' => 'H5892',
            'strongs_extended' => 'H5892B',
            'transliteration' => "'Ir",
            'transliteration_ko' => '이르',
        ],
        [
            'term_id' => 5781,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 2,
            'verse' => 23,
            'language_type' => 'hebrew',
            'lemma' => 'אִישׁ',
            'strongs_number' => 'H376',
            'strongs_extended' => 'H0376G',
            'transliteration' => "'Ish",
            'transliteration_ko' => '이쉬',
        ],
        [
            'term_id' => 10360,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'ruth',
            'chapter' => 4,
            'verse' => 17,
            'language_type' => 'hebrew',
            'lemma' => 'דָּוִד',
            'strongs_number' => 'H1732',
            'strongs_extended' => '',
            'transliteration' => 'da.Vid',
            'transliteration_ko' => '다윗',
        ],
        [
            'term_id' => 5606,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 1,
            'verse' => 5,
            'language_type' => 'hebrew',
            'lemma' => 'אֶחָד',
            'strongs_number' => 'H259',
            'strongs_extended' => '',
            'transliteration' => "'e.Chad",
            'transliteration_ko' => '에하드',
        ],
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function phase8e5ApprovedReviewedSeeds(): array
{
    return [
        [
            'term_id' => 5739,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 2,
            'verse' => 11,
            'language_type' => 'hebrew',
            'lemma' => 'הוּא',
            'strongs_number' => 'H1931',
            'strongs_extended' => '',
            'transliteration' => "hu'",
            'transliteration_ko' => '후',
        ],
        [
            'term_id' => 5783,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 2,
            'verse' => 24,
            'language_type' => 'hebrew',
            'lemma' => 'אָב',
            'strongs_number' => 'H1',
            'strongs_extended' => 'H0001G',
            'transliteration' => "'a.Vi",
            'transliteration_ko' => '아비',
        ],
        [
            'term_id' => 5956,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 5,
            'verse' => 1,
            'language_type' => 'hebrew',
            'lemma' => 'זֶה',
            'strongs_number' => 'H2088',
            'strongs_extended' => '',
            'transliteration' => 'zeh',
            'transliteration_ko' => '제',
        ],
        [
            'term_id' => 5804,
            'source_dataset' => 'STEP_TAHOT',
            'book_slug' => 'genesis',
            'chapter' => 3,
            'verse' => 6,
            'language_type' => 'hebrew',
            'lemma' => 'עִם',
            'strongs_number' => 'H5973',
            'strongs_extended' => 'H5973A',
            'transliteration' => "'i.Ma",
            'transliteration_ko' => '이마',
        ],
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function phase8f3Top250FilledReviewedSeeds(): array
{
    $worksheetPath = '/tmp/wcm_phase8f2_top250_transliteration_filled.tsv';
    $seedsByTermId = [];

    foreach (readPhase8f3ApprovedWorksheetRows($worksheetPath, 'proposed_transliteration_ko') as $row) {
        $seed = phase8f3ReviewedTransliterationSeed((int) $row['term_id'], $row['proposed_transliteration_ko']);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    foreach ([101 => '퀴리오스', 3 => '예수'] as $termId => $transliterationKo) {
        $seed = phase8f3ReviewedTransliterationSeed($termId, $transliterationKo);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    $seeds = array_values($seedsByTermId);

    if (count($seeds) !== 47) {
        throw new RuntimeException('Phase 8F-3 transliteration seed set must contain exactly 47 reviewed rows.');
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
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }
 */
function phase8f3ReviewedTransliterationSeed(int $termId, string $transliterationKo): array
{
    global $wpdb;

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
    $booksTable = $wpdb->prefix . 'wcm_bible_books';
    $term = readSeedTerm($termsTable, $termId);

    if ($term === null) {
        throw new RuntimeException('Missing Phase 8F-3 term ID ' . $termId . '.');
    }

    $occurrence = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT occurrences.source_dataset, books.slug AS book_slug, occurrences.chapter, occurrences.verse
            FROM {$occurrencesTable} occurrences
            INNER JOIN {$booksTable} books ON books.id = occurrences.book_id
            WHERE occurrences.term_id = %d
            ORDER BY occurrences.id
            LIMIT 1",
            $termId
        ),
        'ARRAY_A'
    );

    if (! is_array($occurrence)) {
        throw new RuntimeException('Phase 8F-3 term ID ' . $termId . ' has no occurrence anchor.');
    }

    return [
        'term_id' => $termId,
        'source_dataset' => (string) $occurrence['source_dataset'],
        'book_slug' => (string) $occurrence['book_slug'],
        'chapter' => (int) $occurrence['chapter'],
        'verse' => (int) $occurrence['verse'],
        'language_type' => (string) $term['language_type'],
        'lemma' => (string) $term['lemma'],
        'strongs_number' => (string) $term['strongs_number'],
        'strongs_extended' => (string) $term['strongs_extended'],
        'transliteration' => (string) $term['transliteration'],
        'transliteration_ko' => $transliterationKo,
    ];
}

/**
 * @return array<int, array{
 *     term_id: int,
 *     source_dataset: string,
 *     book_slug: string,
 *     chapter: int,
 *     verse: int,
 *     language_type: string,
 *     lemma: string,
 *     strongs_number: string,
 *     strongs_extended: string,
 *     transliteration: string,
 *     transliteration_ko: string
 * }>
 */
function phase8f5Top500FilledReviewedSeeds(): array
{
    $worksheetPath = '/tmp/wcm_phase8f4_top500_transliteration_filled.tsv';
    $seedsByTermId = [];

    foreach (readPhase8f5ApprovedWorksheetRows($worksheetPath, 'proposed_transliteration_ko') as $row) {
        $seed = phase8f3ReviewedTransliterationSeed((int) $row['term_id'], $row['proposed_transliteration_ko']);
        $seedsByTermId[$seed['term_id']] = $seed;
    }

    $seeds = array_values($seedsByTermId);

    if (count($seeds) !== 275) {
        throw new RuntimeException('Phase 8F-5 transliteration seed set must contain exactly 275 reviewed rows.');
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
function seedReviewedKoreanTransliterations(bool $apply, string $seedSet): array
{
    global $wpdb;

    $termsTable = $wpdb->prefix . 'wcm_original_terms';
    $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
    $booksTable = $wpdb->prefix . 'wcm_bible_books';
    $seeds = reviewedSeeds($seedSet);
    $errors = [];
    $validated = 0;
    $updated = 0;
    $unchanged = 0;
    $updatedTermIds = [];

    ensureColumnExists($termsTable, 'transliteration_ko');

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

            if (! seedOccurrenceExists($occurrencesTable, $booksTable, $seed)) {
                $errors[] = 'Seed term ID ' . $seed['term_id'] . ' is not linked to expected reference '
                    . $seed['source_dataset'] . ' ' . $seed['book_slug'] . ' '
                    . $seed['chapter'] . ':' . $seed['verse'] . '.';
                continue;
            }

            $currentKo = nullableString($row['transliteration_ko'] ?? null);

            if ($currentKo !== null && $currentKo !== '' && $currentKo !== $seed['transliteration_ko']) {
                $errors[] = 'Seed term ID ' . $seed['term_id'] . ' already has a different transliteration_ko value.';
                continue;
            }

            $validated++;

            if ($currentKo === $seed['transliteration_ko']) {
                $unchanged++;
                continue;
            }

            if ($apply) {
                $result = $wpdb->update(
                    $termsTable,
                    ['transliteration_ko' => $seed['transliteration_ko']],
                    [
                        'id' => $seed['term_id'],
                        'language_type' => $seed['language_type'],
                        'strongs_number' => $seed['strongs_number'],
                        'strongs_extended' => $seed['strongs_extended'],
                        'transliteration' => $seed['transliteration'],
                    ],
                    ['%s'],
                    ['%d', '%s', '%s', '%s', '%s']
                );

                if ($result === false) {
                    $errors[] = 'Failed to update transliteration_ko for term ID ' . $seed['term_id'] . '.';
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
            "SELECT id, language_type, lemma, strongs_number, strongs_extended, transliteration, transliteration_ko
            FROM {$termsTable}
            WHERE id = %d
            LIMIT 1",
            $termId
        ),
        'ARRAY_A'
    );

    return is_array($row) ? $row : null;
}

/**
 * @param array<string, mixed> $row
 * @param array<string, mixed> $seed
 * @return string[]
 */
function validateSeedIdentity(array $row, array $seed): array
{
    $errors = [];

    foreach (['language_type', 'lemma', 'strongs_number', 'strongs_extended', 'transliteration'] as $field) {
        if ((string) $row[$field] !== (string) $seed[$field]) {
            $errors[] = 'Seed term ID ' . $seed['term_id'] . " identity mismatch for {$field}.";
        }
    }

    return $errors;
}

/**
 * @param array<string, mixed> $seed
 */
function seedOccurrenceExists(string $occurrencesTable, string $booksTable, array $seed): bool
{
    global $wpdb;

    $count = (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*)
            FROM {$occurrencesTable} occurrences
            INNER JOIN {$booksTable} books ON books.id = occurrences.book_id
            WHERE occurrences.term_id = %d
            AND occurrences.source_dataset = %s
            AND books.slug = %s
            AND occurrences.chapter = %d
            AND occurrences.verse = %d",
            $seed['term_id'],
            $seed['source_dataset'],
            $seed['book_slug'],
            $seed['chapter'],
            $seed['verse']
        )
    );

    return $count > 0;
}

/**
 * @param array<int, array<string, mixed>> $seeds
 */
function validateAppliedSeeds(string $termsTable, array $seeds): void
{
    foreach ($seeds as $seed) {
        $row = readSeedTerm($termsTable, $seed['term_id']);

        if ($row === null || nullableString($row['transliteration_ko'] ?? null) !== $seed['transliteration_ko']) {
            throw new RuntimeException('Post-update validation failed for term ID ' . $seed['term_id'] . '.');
        }

        if ((string) $row['transliteration'] !== $seed['transliteration']) {
            throw new RuntimeException('Source transliteration changed unexpectedly for term ID ' . $seed['term_id'] . '.');
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
