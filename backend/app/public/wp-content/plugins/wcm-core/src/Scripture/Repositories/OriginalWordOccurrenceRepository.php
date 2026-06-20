<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

use RuntimeException;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalWordOccurrenceRepository
{
    private const MAX_PER_PAGE = 100;
    private const DEFAULT_BATCH_SIZE = 500;
    private const IDENTITY_DELIMITER = "\x1F";

    public function save(OriginalWordOccurrence $occurrence): int
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';
        $now = current_time('mysql');

        $data = [
            'term_id' => $occurrence->termId,
            'book_id' => $occurrence->bookId,
            'chapter' => $occurrence->chapter,
            'verse' => $occurrence->verse,
            'word_order' => $occurrence->wordOrder,
            'subword_order' => $occurrence->subwordOrder,
            'token_type' => trim($occurrence->tokenType),
            'surface_form' => trim($occurrence->surfaceForm),
            'normalized_form' => trim($occurrence->normalizedForm),
            'morphology' => trim($occurrence->morphology),
            'grammar_summary' => $occurrence->grammarSummary,
            'grammar_note' => $occurrence->grammarNote,
            'contextual_function' => $occurrence->contextualFunction,
            'source_dataset' => trim($occurrence->sourceDataset),
            'source_ref' => trim($occurrence->sourceRef),
            'updated_at' => $now,
        ];

        $formats = [
            '%d',
            '%d',
            '%d',
            '%d',
            '%d',
            '%d',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
        ];

        if ($occurrence->id !== null) {
            $updated = $wpdb->update(
                $tableName,
                $data,
                ['id' => $occurrence->id],
                $formats,
                ['%d']
            );

            return $updated === false ? 0 : $occurrence->id;
        }

        $data['created_at'] = $now;
        $formats[] = '%s';

        $inserted = $wpdb->insert($tableName, $data, $formats);

        return $inserted === false ? 0 : (int) $wpdb->insert_id;
    }

    public function findById(int $id): ?OriginalWordOccurrence
    {
        global $wpdb;

        if ($id < 1) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE id = %d LIMIT 1",
                $id
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $this->hydrateOccurrence($row) : null;
    }

    public function findByIdentity(
        string $sourceDataset,
        int $bookId,
        int $chapter,
        int $verse,
        int $wordOrder,
        int $subwordOrder,
        string $tokenType
    ): ?OriginalWordOccurrence {
        global $wpdb;

        $sourceDataset = trim($sourceDataset);
        $tokenType = trim($tokenType);

        if (
            $sourceDataset === ''
            || $bookId < 1
            || $chapter < 1
            || $verse < 1
            || $wordOrder < 1
            || $subwordOrder < 0
            || $tokenType === ''
        ) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE source_dataset = %s
                AND book_id = %d
                AND chapter = %d
                AND verse = %d
                AND word_order = %d
                AND subword_order = %d
                AND token_type = %s
                LIMIT 1",
                $sourceDataset,
                $bookId,
                $chapter,
                $verse,
                $wordOrder,
                $subwordOrder,
                $tokenType
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $this->hydrateOccurrence($row) : null;
    }

    /**
     * @return OriginalWordOccurrence[]
     */
    public function findForVerse(
        string $sourceDataset,
        int $bookId,
        int $chapter,
        int $verse
    ): array {
        global $wpdb;

        $sourceDataset = trim($sourceDataset);

        if ($sourceDataset === '' || $bookId < 1 || $chapter < 1 || $verse < 1) {
            return [];
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE source_dataset = %s
                AND book_id = %d
                AND chapter = %d
                AND verse = %d
                ORDER BY word_order ASC, subword_order ASC",
                $sourceDataset,
                $bookId,
                $chapter,
                $verse
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        return array_map([$this, 'hydrateOccurrence'], $rows);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findForVerseWithTerms(
        string $sourceDataset,
        int $bookId,
        int $chapter,
        int $verse
    ): array {
        global $wpdb;

        $sourceDataset = trim($sourceDataset);

        if ($sourceDataset === '' || $bookId < 1 || $chapter < 1 || $verse < 1) {
            return [];
        }

        $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
        $termsTable = $wpdb->prefix . 'wcm_original_terms';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    occurrences.id,
                    occurrences.term_id,
                    occurrences.book_id,
                    occurrences.chapter,
                    occurrences.verse,
                    occurrences.word_order,
                    occurrences.subword_order,
                    occurrences.token_type,
                    occurrences.surface_form,
                    occurrences.normalized_form,
                    occurrences.morphology,
                    occurrences.contextual_function,
                    occurrences.source_dataset,
                    occurrences.source_ref,
                    terms.language_type,
                    terms.lemma,
                    terms.lemma_normalized,
                    terms.strongs_number,
                    terms.strongs_extended,
                    terms.transliteration,
                    terms.transliteration_ko,
                    terms.gloss
                FROM {$occurrencesTable} occurrences
                INNER JOIN {$termsTable} terms ON terms.id = occurrences.term_id
                WHERE occurrences.source_dataset = %s
                AND occurrences.book_id = %d
                AND occurrences.chapter = %d
                AND occurrences.verse = %d
                ORDER BY occurrences.word_order ASC, occurrences.subword_order ASC",
                $sourceDataset,
                $bookId,
                $chapter,
                $verse
            ),
            'ARRAY_A'
        );

        return is_array($rows) ? $rows : [];
    }

    /**
     * @return OriginalWordOccurrence[]
     */
    public function findByTermId(
        int $termId,
        int $page = 1,
        int $perPage = 20
    ): array {
        global $wpdb;

        $page = max(1, $page);
        $perPage = min(self::MAX_PER_PAGE, max(1, $perPage));

        if ($termId < 1) {
            return [];
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';
        $offset = ($page - 1) * $perPage;

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE term_id = %d
                ORDER BY book_id ASC, chapter ASC, verse ASC, word_order ASC, subword_order ASC
                LIMIT %d OFFSET %d",
                $termId,
                $perPage,
                $offset
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        return array_map([$this, 'hydrateOccurrence'], $rows);
    }

    public function countByTermId(int $termId): int
    {
        global $wpdb;

        if ($termId < 1) {
            return 0;
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';

        return (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$tableName}
                WHERE term_id = %d",
                $termId
            )
        );
    }

    /**
     * @return array<int, array{
     *     book: array{
     *         id: int,
     *         slug: string,
     *         name_en: string,
     *         name_ko: string,
     *         testament: string
     *     },
     *     occurrence_count: int
     * }>
     */
    public function distributionByStrongsNumber(string $languageType, string $strongsNumber): array
    {
        global $wpdb;

        $languageType = trim($languageType);
        $strongsNumber = trim($strongsNumber);

        if ($languageType === '' || $strongsNumber === '') {
            return [];
        }

        $termsTable = $wpdb->prefix . 'wcm_original_terms';
        $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
        $booksTable = $wpdb->prefix . 'wcm_bible_books';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    books.id AS book_id,
                    books.slug,
                    books.name_en,
                    books.name_ko,
                    books.testament,
                    COUNT(occurrences.id) AS occurrence_count
                FROM {$termsTable} terms
                INNER JOIN {$occurrencesTable} occurrences ON occurrences.term_id = terms.id
                INNER JOIN {$booksTable} books ON books.id = occurrences.book_id
                WHERE terms.language_type = %s
                AND terms.strongs_number = %s
                GROUP BY books.id, books.slug, books.name_en, books.name_ko, books.testament, books.book_order
                ORDER BY books.book_order ASC",
                $languageType,
                $strongsNumber
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        return array_map([$this, 'formatBookDistributionRow'], $rows);
    }

    /**
     * @return array{total_occurrences: int, book_count: int, chapter_count: int}
     */
    public function summaryByTermId(int $termId): array
    {
        global $wpdb;

        if ($termId < 1) {
            return [
                'total_occurrences' => 0,
                'book_count' => 0,
                'chapter_count' => 0,
            ];
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT
                    COUNT(*) AS total_occurrences,
                    COUNT(DISTINCT book_id) AS book_count,
                    COUNT(DISTINCT CONCAT(book_id, ':', chapter)) AS chapter_count
                FROM {$tableName}
                WHERE term_id = %d",
                $termId
            ),
            'ARRAY_A'
        );

        if (! is_array($row)) {
            return [
                'total_occurrences' => 0,
                'book_count' => 0,
                'chapter_count' => 0,
            ];
        }

        return [
            'total_occurrences' => (int) $row['total_occurrences'],
            'book_count' => (int) $row['book_count'],
            'chapter_count' => (int) $row['chapter_count'],
        ];
    }

    /**
     * @return array<int, array{
     *     book: array{
     *         id: int,
     *         slug: string,
     *         name_en: string,
     *         name_ko: string,
     *         testament: string
     *     },
     *     occurrence_count: int,
     *     chapters: array<int, array{chapter: int, occurrence_count: int}>
     * }>
     */
    public function distributionByTermId(int $termId): array
    {
        global $wpdb;

        if ($termId < 1) {
            return [];
        }

        $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';
        $booksTable = $wpdb->prefix . 'wcm_bible_books';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    books.id AS book_id,
                    books.slug,
                    books.name_en,
                    books.name_ko,
                    books.testament,
                    occurrences.chapter,
                    COUNT(occurrences.id) AS occurrence_count
                FROM {$occurrencesTable} occurrences
                INNER JOIN {$booksTable} books ON books.id = occurrences.book_id
                WHERE occurrences.term_id = %d
                GROUP BY
                    books.id,
                    books.slug,
                    books.name_en,
                    books.name_ko,
                    books.testament,
                    books.book_order,
                    occurrences.chapter
                ORDER BY books.book_order ASC, occurrences.chapter ASC",
                $termId
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        $distribution = [];

        foreach ($rows as $row) {
            $bookId = (int) $row['book_id'];
            $occurrenceCount = (int) $row['occurrence_count'];

            if (! isset($distribution[$bookId])) {
                $distribution[$bookId] = [
                    'book' => [
                        'id' => $bookId,
                        'slug' => (string) $row['slug'],
                        'name_en' => (string) $row['name_en'],
                        'name_ko' => (string) $row['name_ko'],
                        'testament' => (string) $row['testament'],
                    ],
                    'occurrence_count' => 0,
                    'chapters' => [],
                ];
            }

            $distribution[$bookId]['occurrence_count'] += $occurrenceCount;
            $distribution[$bookId]['chapters'][] = [
                'chapter' => (int) $row['chapter'],
                'occurrence_count' => $occurrenceCount,
            ];
        }

        return array_values($distribution);
    }

    public function buildIdentityKey(
        string $sourceDataset,
        int $bookId,
        int $chapter,
        int $verse,
        int $wordOrder,
        int $subwordOrder,
        string $tokenType
    ): string {
        return implode(self::IDENTITY_DELIMITER, [
            trim($sourceDataset),
            (string) $bookId,
            (string) $chapter,
            (string) $verse,
            (string) $wordOrder,
            (string) $subwordOrder,
            trim($tokenType),
        ]);
    }

    /**
     * @param array<int, array{
     *     source_dataset?: string,
     *     sourceDataset?: string,
     *     book_id?: int,
     *     bookId?: int,
     *     chapter?: int,
     *     verse?: int,
     *     word_order?: int,
     *     wordOrder?: int,
     *     subword_order?: int,
     *     subwordOrder?: int,
     *     token_type?: string,
     *     tokenType?: string
     * }> $identities
     *
     * @return array<string, int>
     */
    public function findIdsByIdentities(array $identities, int $batchSize = self::DEFAULT_BATCH_SIZE): array
    {
        global $wpdb;

        $normalizedIdentities = $this->normalizeIdentitySet($identities);
        if ($normalizedIdentities === []) {
            return [];
        }

        $tableName = $wpdb->prefix . 'wcm_original_word_occurrences';
        $batchSize = max(1, $batchSize);
        $result = [];

        foreach (array_chunk($normalizedIdentities, $batchSize) as $batch) {
            $conditions = [];
            $values = [];

            foreach ($batch as $identity) {
                $conditions[] = '(source_dataset = %s AND book_id = %d AND chapter = %d AND verse = %d AND word_order = %d AND subword_order = %d AND token_type = %s)';
                array_push(
                    $values,
                    $identity['source_dataset'],
                    $identity['book_id'],
                    $identity['chapter'],
                    $identity['verse'],
                    $identity['word_order'],
                    $identity['subword_order'],
                    $identity['token_type']
                );
            }

            $sql = "SELECT id, source_dataset, book_id, chapter, verse, word_order, subword_order, token_type
                FROM {$tableName}
                WHERE " . implode(' OR ', $conditions);

            $rows = $wpdb->get_results($wpdb->prepare($sql, ...$values), 'ARRAY_A');
            if (! is_array($rows)) {
                throw new RuntimeException('Original word occurrence batch lookup failed.');
            }

            foreach ($rows as $row) {
                $result[$this->buildIdentityKey(
                    (string) $row['source_dataset'],
                    (int) $row['book_id'],
                    (int) $row['chapter'],
                    (int) $row['verse'],
                    (int) $row['word_order'],
                    (int) $row['subword_order'],
                    (string) $row['token_type']
                )] = (int) $row['id'];
            }
        }

        return $result;
    }

    /**
     * @param OriginalWordOccurrence[] $occurrences
     *
     * @return array<string, int>
     */
    public function insertBatch(array $occurrences, int $batchSize = self::DEFAULT_BATCH_SIZE): array
    {
        $batchSize = max(1, $batchSize);
        $created = [];

        foreach (array_chunk($occurrences, $batchSize) as $batch) {
            foreach ($batch as $occurrence) {
                if (! $occurrence instanceof OriginalWordOccurrence) {
                    throw new RuntimeException('Original word occurrence batch insert expects OriginalWordOccurrence instances.');
                }

                if ($occurrence->id !== null) {
                    throw new RuntimeException('Original word occurrence batch insert expects unpersisted OriginalWordOccurrence instances.');
                }

                $identity = $this->buildIdentityKey(
                    $occurrence->sourceDataset,
                    $occurrence->bookId,
                    $occurrence->chapter,
                    $occurrence->verse,
                    $occurrence->wordOrder,
                    $occurrence->subwordOrder,
                    $occurrence->tokenType
                );

                $id = $this->save($occurrence);
                if ($id < 1) {
                    throw new RuntimeException('Original word occurrence batch insert failed for identity: ' . $identity);
                }

                $created[$identity] = $id;
            }
        }

        return $created;
    }

    /**
     * @param array<string, mixed> $row
     */
    private function hydrateOccurrence(array $row): OriginalWordOccurrence
    {
        return new OriginalWordOccurrence(
            (int) $row['id'],
            (int) $row['term_id'],
            (int) $row['book_id'],
            (int) $row['chapter'],
            (int) $row['verse'],
            (int) $row['word_order'],
            (int) $row['subword_order'],
            (string) $row['token_type'],
            (string) $row['surface_form'],
            (string) $row['normalized_form'],
            (string) $row['morphology'],
            $this->nullableString($row['grammar_summary']),
            $this->nullableString($row['grammar_note']),
            $this->nullableString($row['contextual_function']),
            (string) $row['source_dataset'],
            (string) $row['source_ref']
        );
    }

    private function nullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }

    /**
     * @param array<string, mixed> $row
     *
     * @return array{
     *     book: array{id: int, slug: string, name_en: string, name_ko: string, testament: string},
     *     occurrence_count: int
     * }
     */
    private function formatBookDistributionRow(array $row): array
    {
        return [
            'book' => [
                'id' => (int) $row['book_id'],
                'slug' => (string) $row['slug'],
                'name_en' => (string) $row['name_en'],
                'name_ko' => (string) $row['name_ko'],
                'testament' => (string) $row['testament'],
            ],
            'occurrence_count' => (int) $row['occurrence_count'],
        ];
    }

    /**
     * @param array<int, array{
     *     source_dataset?: string,
     *     sourceDataset?: string,
     *     book_id?: int,
     *     bookId?: int,
     *     chapter?: int,
     *     verse?: int,
     *     word_order?: int,
     *     wordOrder?: int,
     *     subword_order?: int,
     *     subwordOrder?: int,
     *     token_type?: string,
     *     tokenType?: string
     * }> $identities
     *
     * @return array<string, array{
     *     source_dataset: string,
     *     book_id: int,
     *     chapter: int,
     *     verse: int,
     *     word_order: int,
     *     subword_order: int,
     *     token_type: string
     * }>
     */
    private function normalizeIdentitySet(array $identities): array
    {
        $normalized = [];

        foreach ($identities as $identity) {
            $sourceDataset = trim((string) ($identity['source_dataset'] ?? $identity['sourceDataset'] ?? ''));
            $bookId = (int) ($identity['book_id'] ?? $identity['bookId'] ?? 0);
            $chapter = (int) ($identity['chapter'] ?? 0);
            $verse = (int) ($identity['verse'] ?? 0);
            $wordOrder = (int) ($identity['word_order'] ?? $identity['wordOrder'] ?? 0);
            $subwordOrder = (int) ($identity['subword_order'] ?? $identity['subwordOrder'] ?? -1);
            $tokenType = trim((string) ($identity['token_type'] ?? $identity['tokenType'] ?? ''));

            if (
                $sourceDataset === ''
                || $bookId < 1
                || $chapter < 1
                || $verse < 1
                || $wordOrder < 1
                || $subwordOrder < 0
                || $tokenType === ''
            ) {
                continue;
            }

            $key = $this->buildIdentityKey(
                $sourceDataset,
                $bookId,
                $chapter,
                $verse,
                $wordOrder,
                $subwordOrder,
                $tokenType
            );

            $normalized[$key] = [
                'source_dataset' => $sourceDataset,
                'book_id' => $bookId,
                'chapter' => $chapter,
                'verse' => $verse,
                'word_order' => $wordOrder,
                'subword_order' => $subwordOrder,
                'token_type' => $tokenType,
            ];
        }

        return $normalized;
    }
}
