<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This tool must be run from the command line.\n");
    exit(1);
}

if ($argc !== 3) {
    fwrite(
        STDERR,
        "Usage: php export-krv-mdb.php <source.mdb> <output.json>\n"
    );
    exit(1);
}

$sourcePath = resolvePath($argv[1]);
$outputPath = $argv[2];

if (! is_file($sourcePath)) {
    fwrite(STDERR, "Source MDB file not found: {$argv[1]}\n");
    exit(1);
}

try {
    $sourceRows = readBibleRows($sourcePath);
    $export = normalizeRows($sourceRows);
    writeJson($outputPath, $export['rows']);
    printSummary($export);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @return array<int, array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: string}>
 */
function readBibleRows(string $sourcePath): array
{
    $mdbExport = findExecutable('mdb-export');

    if ($mdbExport !== null) {
        return readBibleRowsWithMdbExport($mdbExport, $sourcePath);
    }

    if (extension_loaded('pdo_odbc')) {
        return readBibleRowsWithOdbc($sourcePath);
    }

    throw new RuntimeException(
        'No local MDB reader is available. Install mdbtools or configure a PHP ODBC MDB driver, then rerun this tool.'
    );
}

/**
 * @return array<int, array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: string}>
 */
function readBibleRowsWithMdbExport(string $mdbExport, string $sourcePath): array
{
    $process = proc_open(
        [$mdbExport, $sourcePath, 'BIBLE'],
        [
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ],
        $pipes
    );

    if (! is_resource($process)) {
        throw new RuntimeException('Failed to start mdb-export.');
    }

    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    $exitCode = proc_close($process);

    if ($exitCode !== 0) {
        throw new RuntimeException(
            'mdb-export failed: ' . trim((string) $stderr)
        );
    }

    $handle = fopen('php://temp', 'r+');

    if ($handle === false) {
        throw new RuntimeException('Failed to allocate temporary CSV buffer.');
    }

    fwrite($handle, (string) $stdout);
    rewind($handle);

    $headers = fgetcsv($handle);

    if ($headers === false) {
        fclose($handle);
        throw new RuntimeException('mdb-export returned no rows.');
    }

    $indexes = columnIndexes($headers);
    $rows = [];

    while (($record = fgetcsv($handle)) !== false) {
        $rows[] = mapCsvRecord($record, $indexes);
    }

    fclose($handle);

    return $rows;
}

/**
 * @return array<int, array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: string}>
 */
function readBibleRowsWithOdbc(string $sourcePath): array
{
    $dsnCandidates = [
        'odbc:Driver={MDBTools};DBQ=' . $sourcePath,
        'odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=' . $sourcePath,
        'odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ=' . $sourcePath,
    ];

    $lastError = null;

    foreach ($dsnCandidates as $dsn) {
        try {
            $pdo = new PDO($dsn);
            $statement = $pdo->query('SELECT BOOK, CHAPTER, VERSE, BIBLETEXT FROM BIBLE');

            if ($statement === false) {
                continue;
            }

            $rows = [];

            while (($row = $statement->fetch(PDO::FETCH_ASSOC)) !== false) {
                $rows[] = [
                    'BOOK' => (int) $row['BOOK'],
                    'CHAPTER' => (int) $row['CHAPTER'],
                    'VERSE' => (int) $row['VERSE'],
                    'BIBLETEXT' => normalizeTextValue($row['BIBLETEXT'] ?? ''),
                ];
            }

            return $rows;
        } catch (Throwable $exception) {
            $lastError = $exception;
        }
    }

    throw new RuntimeException(
        'No configured ODBC MDB driver could read the source file. Last error: '
        . ($lastError?->getMessage() ?? 'none')
    );
}

/**
 * @param array<int, array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: string}> $sourceRows
 * @return array{
 *     rows: array<int, array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}>,
 *     totalRows: int,
 *     metadataRowsSkipped: int,
 *     canonicalRowsExported: int,
 *     emptyTextRows: array<int, array{bookOrder: int, chapter: int, verse: int}>,
 *     firstVerse: array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}|null,
 *     lastVerse: array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}|null
 * }
 */
function normalizeRows(array $sourceRows): array
{
    $rows = [];
    $metadataRowsSkipped = 0;
    $emptyTextRows = [];
    $firstVerse = null;
    $lastVerse = null;

    foreach ($sourceRows as $sourceRow) {
        $book = $sourceRow['BOOK'];
        $chapter = $sourceRow['CHAPTER'];
        $verse = $sourceRow['VERSE'];
        $text = $sourceRow['BIBLETEXT'];

        if ($book === 0) {
            $metadataRowsSkipped++;
            continue;
        }

        if ($book < 1 || $book > 66 || $chapter < 1 || $verse < 1) {
            continue;
        }

        $row = [
            'versionCode' => 'KRV',
            'bookOrder' => $book,
            'chapter' => $chapter,
            'verse' => $verse,
            'text' => $text,
        ];

        if (trim($text) === '') {
            $emptyTextRows[] = [
                'bookOrder' => $book,
                'chapter' => $chapter,
                'verse' => $verse,
            ];
        }

        $firstVerse ??= $row;
        $lastVerse = $row;
        $rows[] = $row;
    }

    return [
        'rows' => $rows,
        'totalRows' => count($sourceRows),
        'metadataRowsSkipped' => $metadataRowsSkipped,
        'canonicalRowsExported' => count($rows),
        'emptyTextRows' => $emptyTextRows,
        'firstVerse' => $firstVerse,
        'lastVerse' => $lastVerse,
    ];
}

/**
 * @param array<int, array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}> $rows
 */
function writeJson(string $outputPath, array $rows): void
{
    $outputDirectory = dirname($outputPath);

    if (! is_dir($outputDirectory) && ! mkdir($outputDirectory, 0775, true) && ! is_dir($outputDirectory)) {
        throw new RuntimeException('Failed to create output directory: ' . $outputDirectory);
    }

    $json = json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($json === false) {
        throw new RuntimeException('Failed to encode JSON: ' . json_last_error_msg());
    }

    if (file_put_contents($outputPath, $json . "\n") === false) {
        throw new RuntimeException('Failed to write output JSON: ' . $outputPath);
    }
}

/**
 * @param array{
 *     rows: array<int, array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}>,
 *     totalRows: int,
 *     metadataRowsSkipped: int,
 *     canonicalRowsExported: int,
 *     emptyTextRows: array<int, array{bookOrder: int, chapter: int, verse: int}>,
 *     firstVerse: array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}|null,
 *     lastVerse: array{versionCode: string, bookOrder: int, chapter: int, verse: int, text: string}|null
 * } $export
 */
function printSummary(array $export): void
{
    fwrite(STDOUT, "KRV MDB export summary\n");
    fwrite(STDOUT, 'Total rows read: ' . $export['totalRows'] . "\n");
    fwrite(STDOUT, 'Metadata rows skipped: ' . $export['metadataRowsSkipped'] . "\n");
    fwrite(STDOUT, 'Canonical rows exported: ' . $export['canonicalRowsExported'] . "\n");
    fwrite(STDOUT, 'Empty text rows found: ' . count($export['emptyTextRows']) . "\n");
    fwrite(STDOUT, 'First verse sample: ' . json_encode($export['firstVerse'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
    fwrite(STDOUT, 'Last verse sample: ' . json_encode($export['lastVerse'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");

    foreach ($export['emptyTextRows'] as $emptyTextRow) {
        $reference = sprintf(
            'BOOK=%d CHAPTER=%d VERSE=%d',
            $emptyTextRow['bookOrder'],
            $emptyTextRow['chapter'],
            $emptyTextRow['verse']
        );

        fwrite(STDOUT, 'Empty text row: ' . $reference . "\n");

        if (
            $emptyTextRow['bookOrder'] === 19
            && $emptyTextRow['chapter'] === 72
            && $emptyTextRow['verse'] === 20
        ) {
            fwrite(STDOUT, "WARNING: Psalm 72:20 is empty and must be manually reviewed before production import.\n");
        }
    }
}

/**
 * @param array<int, string|null> $headers
 * @return array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: int}
 */
function columnIndexes(array $headers): array
{
    $normalized = [];

    foreach ($headers as $index => $header) {
        $normalized[strtoupper(trim((string) $header))] = $index;
    }

    foreach (['BOOK', 'CHAPTER', 'VERSE', 'BIBLETEXT'] as $requiredColumn) {
        if (! array_key_exists($requiredColumn, $normalized)) {
            throw new RuntimeException('Missing expected BIBLE column: ' . $requiredColumn);
        }
    }

    return [
        'BOOK' => $normalized['BOOK'],
        'CHAPTER' => $normalized['CHAPTER'],
        'VERSE' => $normalized['VERSE'],
        'BIBLETEXT' => $normalized['BIBLETEXT'],
    ];
}

/**
 * @param array<int, string|null> $record
 * @param array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: int} $indexes
 * @return array{BOOK: int, CHAPTER: int, VERSE: int, BIBLETEXT: string}
 */
function mapCsvRecord(array $record, array $indexes): array
{
    return [
        'BOOK' => (int) ($record[$indexes['BOOK']] ?? 0),
        'CHAPTER' => (int) ($record[$indexes['CHAPTER']] ?? 0),
        'VERSE' => (int) ($record[$indexes['VERSE']] ?? 0),
        'BIBLETEXT' => normalizeTextValue($record[$indexes['BIBLETEXT']] ?? ''),
    ];
}

function normalizeTextValue(mixed $value): string
{
    if ($value === null) {
        return '';
    }

    $text = (string) $value;

    if (mb_check_encoding($text, 'UTF-8')) {
        return $text;
    }

    $converted = mb_convert_encoding($text, 'UTF-8', 'CP949, EUC-KR, UTF-8');

    return is_string($converted) ? $converted : $text;
}

function resolvePath(string $path): string
{
    $resolved = realpath($path);

    return $resolved === false ? $path : $resolved;
}

function findExecutable(string $name): ?string
{
    $paths = explode(PATH_SEPARATOR, (string) getenv('PATH'));

    foreach ($paths as $path) {
        $candidate = rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;

        if (is_file($candidate) && is_executable($candidate)) {
            return $candidate;
        }
    }

    return null;
}
