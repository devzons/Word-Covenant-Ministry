<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

use RuntimeException;
use WCM\Scripture\ValueObjects\OriginalTerm;

final class OriginalTermRepository
{
    private const MAX_PER_PAGE = 100;
    private const DEFAULT_BATCH_SIZE = 500;

    public function save(OriginalTerm $term): int
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_original_terms';
        $now = current_time('mysql');
        $identityHash = $this->buildIdentityHash(
            $term->languageType,
            $term->lemmaNormalized,
            $term->strongsNumber,
            $term->strongsExtended
        );

        $data = [
            'language_type' => trim($term->languageType),
            'lemma' => trim($term->lemma),
            'lemma_normalized' => trim($term->lemmaNormalized),
            'strongs_number' => trim($term->strongsNumber),
            'strongs_extended' => trim($term->strongsExtended),
            'term_identity_hash' => $identityHash,
            'transliteration' => trim($term->transliteration),
            'transliteration_ko' => $term->transliterationKo,
            'root' => trim($term->root),
            'gloss' => $term->gloss,
            'gloss_ko' => $term->glossKo,
            'definition' => $term->definition,
            'updated_at' => $now,
        ];

        $formats = ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'];

        if ($term->id !== null) {
            $updated = $wpdb->update(
                $tableName,
                $data,
                ['id' => $term->id],
                $formats,
                ['%d']
            );

            return $updated === false ? 0 : $term->id;
        }

        $data['created_at'] = $now;
        $formats[] = '%s';

        $inserted = $wpdb->insert($tableName, $data, $formats);

        return $inserted === false ? 0 : (int) $wpdb->insert_id;
    }

    public function findById(int $id): ?OriginalTerm
    {
        global $wpdb;

        if ($id < 1) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_original_terms';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE id = %d LIMIT 1",
                $id
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $this->hydrateTerm($row) : null;
    }

    public function findByIdentity(
        string $languageType,
        string $lemmaNormalized,
        string $strongsNumber,
        string $strongsExtended
    ): ?OriginalTerm {
        global $wpdb;

        $languageType = trim($languageType);
        $lemmaNormalized = trim($lemmaNormalized);
        $strongsNumber = trim($strongsNumber);
        $strongsExtended = trim($strongsExtended);

        if ($languageType === '' || $lemmaNormalized === '') {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_original_terms';
        $identityHash = $this->buildIdentityHash(
            $languageType,
            $lemmaNormalized,
            $strongsNumber,
            $strongsExtended
        );

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE term_identity_hash = %s
                LIMIT 1",
                $identityHash
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $this->hydrateTerm($row) : null;
    }

    /**
     * @return OriginalTerm[]
     */
    public function findByStrongsNumber(
        string $languageType,
        string $strongsNumber,
        int $page = 1,
        int $perPage = 20
    ): array {
        global $wpdb;

        $languageType = trim($languageType);
        $strongsNumber = trim($strongsNumber);
        $page = max(1, $page);
        $perPage = min(self::MAX_PER_PAGE, max(1, $perPage));

        if ($languageType === '' || $strongsNumber === '') {
            return [];
        }

        $tableName = $wpdb->prefix . 'wcm_original_terms';
        $offset = ($page - 1) * $perPage;

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE language_type = %s
                AND strongs_number = %s
                ORDER BY lemma_normalized ASC, id ASC
                LIMIT %d OFFSET %d",
                $languageType,
                $strongsNumber,
                $perPage,
                $offset
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        return array_map([$this, 'hydrateTerm'], $rows);
    }

    public function countByStrongsNumber(string $languageType, string $strongsNumber): int
    {
        global $wpdb;

        $languageType = trim($languageType);
        $strongsNumber = trim($strongsNumber);

        if ($languageType === '' || $strongsNumber === '') {
            return 0;
        }

        $tableName = $wpdb->prefix . 'wcm_original_terms';

        return (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$tableName}
                WHERE language_type = %s
                AND strongs_number = %s",
                $languageType,
                $strongsNumber
            )
        );
    }

    /**
     * @return array<int, array{
     *     strongs_extended: string,
     *     term_count: int,
     *     occurrence_count: int,
     *     terms: array<int, array{
     *         id: int,
     *         language_type: string,
     *         lemma: string,
     *         lemma_normalized: string,
     *         strongs_number: string,
     *         strongs_extended: string,
     *         transliteration: string,
     *         transliteration_ko: string|null,
     *         gloss: string|null,
     *         gloss_ko: string|null,
     *         occurrence_count: int
     *     }>
     * }>
     */
    public function findGroupedByStrongsNumber(string $languageType, string $strongsNumber): array
    {
        global $wpdb;

        $languageType = trim($languageType);
        $strongsNumber = trim($strongsNumber);

        if ($languageType === '' || $strongsNumber === '') {
            return [];
        }

        $termsTable = $wpdb->prefix . 'wcm_original_terms';
        $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    terms.id,
                    terms.language_type,
                    terms.lemma,
                    terms.lemma_normalized,
                    terms.strongs_number,
                    terms.strongs_extended,
                    terms.transliteration,
                    terms.transliteration_ko,
                    terms.gloss,
                    terms.gloss_ko,
                    COUNT(occurrences.id) AS occurrence_count
                FROM {$termsTable} terms
                LEFT JOIN {$occurrencesTable} occurrences ON occurrences.term_id = terms.id
                WHERE terms.language_type = %s
                AND terms.strongs_number = %s
                GROUP BY
                    terms.id,
                    terms.language_type,
                    terms.lemma,
                    terms.lemma_normalized,
                    terms.strongs_number,
                    terms.strongs_extended,
                    terms.transliteration,
                    terms.transliteration_ko,
                    terms.gloss,
                    terms.gloss_ko
                ORDER BY terms.strongs_extended ASC, terms.lemma_normalized ASC, terms.id ASC",
                $languageType,
                $strongsNumber
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        $groups = [];

        foreach ($rows as $row) {
            $strongsExtended = (string) $row['strongs_extended'];

            if (! isset($groups[$strongsExtended])) {
                $groups[$strongsExtended] = [
                    'strongs_extended' => $strongsExtended,
                    'term_count' => 0,
                    'occurrence_count' => 0,
                    'terms' => [],
                ];
            }

            $occurrenceCount = (int) $row['occurrence_count'];
            $groups[$strongsExtended]['term_count']++;
            $groups[$strongsExtended]['occurrence_count'] += $occurrenceCount;
            $groups[$strongsExtended]['terms'][] = [
                'id' => (int) $row['id'],
                'language_type' => (string) $row['language_type'],
                'lemma' => (string) $row['lemma'],
                'lemma_normalized' => (string) $row['lemma_normalized'],
                'strongs_number' => (string) $row['strongs_number'],
                'strongs_extended' => $strongsExtended,
                'transliteration' => (string) $row['transliteration'],
                'transliteration_ko' => $this->nullableString($row['transliteration_ko']),
                'gloss' => $this->nullableString($row['gloss']),
                'gloss_ko' => $this->nullableString($row['gloss_ko'] ?? null),
                'occurrence_count' => $occurrenceCount,
            ];
        }

        return array_values($groups);
    }

    public function countOccurrencesByStrongsNumber(string $languageType, string $strongsNumber): int
    {
        global $wpdb;

        $languageType = trim($languageType);
        $strongsNumber = trim($strongsNumber);

        if ($languageType === '' || $strongsNumber === '') {
            return 0;
        }

        $termsTable = $wpdb->prefix . 'wcm_original_terms';
        $occurrencesTable = $wpdb->prefix . 'wcm_original_word_occurrences';

        return (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(occurrences.id)
                FROM {$termsTable} terms
                INNER JOIN {$occurrencesTable} occurrences ON occurrences.term_id = terms.id
                WHERE terms.language_type = %s
                AND terms.strongs_number = %s",
                $languageType,
                $strongsNumber
            )
        );
    }

    public function buildIdentityKey(
        string $languageType,
        string $lemmaNormalized,
        string $strongsNumber,
        string $strongsExtended
    ): string {
        return $this->buildIdentityHash($languageType, $lemmaNormalized, $strongsNumber, $strongsExtended);
    }

    public function buildIdentityHash(
        string $languageType,
        string $lemmaNormalized,
        string $strongsNumber,
        string $strongsExtended
    ): string {
        $payload = '';

        foreach ([
            trim($languageType),
            trim($lemmaNormalized),
            trim($strongsNumber),
            trim($strongsExtended),
        ] as $field) {
            $payload .= pack('N', strlen($field)) . $field;
        }

        return hash('sha256', $payload);
    }

    /**
     * @param array<int, array{
     *     language_type?: string,
     *     languageType?: string,
     *     lemma_normalized?: string,
     *     lemmaNormalized?: string,
     *     strongs_number?: string,
     *     strongsNumber?: string,
     *     strongs_extended?: string,
     *     strongsExtended?: string
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

        $tableName = $wpdb->prefix . 'wcm_original_terms';
        $batchSize = max(1, $batchSize);
        $result = [];

        foreach (array_chunk($normalizedIdentities, $batchSize) as $batch) {
            $conditions = [];
            $values = [];

            foreach ($batch as $identity) {
                $conditions[] = 'term_identity_hash = %s';
                $values[] = $identity['term_identity_hash'];
            }

            $sql = "SELECT id, term_identity_hash
                FROM {$tableName}
                WHERE " . implode(' OR ', $conditions);

            $rows = $wpdb->get_results($wpdb->prepare($sql, ...$values), 'ARRAY_A');
            if (! is_array($rows)) {
                throw new RuntimeException('Original term batch lookup failed.');
            }

            foreach ($rows as $row) {
                $result[(string) $row['term_identity_hash']] = (int) $row['id'];
            }
        }

        return $result;
    }

    /**
     * @param OriginalTerm[] $terms
     *
     * @return array<string, int>
     */
    public function insertBatch(array $terms, int $batchSize = self::DEFAULT_BATCH_SIZE): array
    {
        $batchSize = max(1, $batchSize);
        $created = [];

        foreach (array_chunk($terms, $batchSize) as $batch) {
            foreach ($batch as $term) {
                if (! $term instanceof OriginalTerm) {
                    throw new RuntimeException('Original term batch insert expects OriginalTerm instances.');
                }

                if ($term->id !== null) {
                    throw new RuntimeException('Original term batch insert expects unpersisted OriginalTerm instances.');
                }

                $identity = $this->buildIdentityKey(
                    $term->languageType,
                    $term->lemmaNormalized,
                    $term->strongsNumber,
                    $term->strongsExtended
                );

                $id = $this->save($term);
                if ($id < 1) {
                    throw new RuntimeException('Original term batch insert failed for identity: ' . $identity);
                }

                $created[$identity] = $id;
            }
        }

        return $created;
    }

    /**
     * @param array<string, mixed> $row
     */
    private function hydrateTerm(array $row): OriginalTerm
    {
        return new OriginalTerm(
            (int) $row['id'],
            (string) $row['language_type'],
            (string) $row['lemma'],
            (string) $row['lemma_normalized'],
            (string) $row['strongs_number'],
            (string) $row['strongs_extended'],
            (string) $row['transliteration'],
            $this->nullableString($row['transliteration_ko'] ?? null),
            (string) $row['root'],
            $this->nullableString($row['gloss']),
            $this->nullableString($row['gloss_ko'] ?? null),
            $this->nullableString($row['definition'])
        );
    }

    private function nullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }

    /**
     * @param array<int, array{
     *     language_type?: string,
     *     languageType?: string,
     *     lemma_normalized?: string,
     *     lemmaNormalized?: string,
     *     strongs_number?: string,
     *     strongsNumber?: string,
     *     strongs_extended?: string,
     *     strongsExtended?: string
     * }> $identities
     *
     * @return array<string, array{
     *     language_type: string,
     *     lemma_normalized: string,
     *     strongs_number: string,
     *     strongs_extended: string,
     *     term_identity_hash: string
     * }>
     */
    private function normalizeIdentitySet(array $identities): array
    {
        $normalized = [];

        foreach ($identities as $identity) {
            $languageType = trim((string) ($identity['language_type'] ?? $identity['languageType'] ?? ''));
            $lemmaNormalized = trim((string) ($identity['lemma_normalized'] ?? $identity['lemmaNormalized'] ?? ''));

            if ($languageType === '' || $lemmaNormalized === '') {
                continue;
            }

            $strongsNumber = trim((string) ($identity['strongs_number'] ?? $identity['strongsNumber'] ?? ''));
            $strongsExtended = trim((string) ($identity['strongs_extended'] ?? $identity['strongsExtended'] ?? ''));
            $key = $this->buildIdentityKey($languageType, $lemmaNormalized, $strongsNumber, $strongsExtended);

            $normalized[$key] = [
                'language_type' => $languageType,
                'lemma_normalized' => $lemmaNormalized,
                'strongs_number' => $strongsNumber,
                'strongs_extended' => $strongsExtended,
                'term_identity_hash' => $key,
            ];
        }

        return $normalized;
    }
}
