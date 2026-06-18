<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

use WCM\Scripture\ValueObjects\OriginalTerm;

final class OriginalTermRepository
{
    private const MAX_PER_PAGE = 50;

    public function save(OriginalTerm $term): int
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_original_terms';
        $now = current_time('mysql');

        $data = [
            'language_type' => trim($term->languageType),
            'lemma' => trim($term->lemma),
            'lemma_normalized' => trim($term->lemmaNormalized),
            'strongs_number' => trim($term->strongsNumber),
            'strongs_extended' => trim($term->strongsExtended),
            'transliteration' => trim($term->transliteration),
            'root' => trim($term->root),
            'gloss' => $term->gloss,
            'definition' => $term->definition,
            'updated_at' => $now,
        ];

        $formats = ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'];

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

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE language_type = %s
                AND lemma_normalized = %s
                AND strongs_number = %s
                AND strongs_extended = %s
                LIMIT 1",
                $languageType,
                $lemmaNormalized,
                $strongsNumber,
                $strongsExtended
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
            (string) $row['root'],
            $this->nullableString($row['gloss']),
            $this->nullableString($row['definition'])
        );
    }

    private function nullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }
}
