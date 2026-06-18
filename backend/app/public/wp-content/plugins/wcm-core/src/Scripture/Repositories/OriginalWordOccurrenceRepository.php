<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalWordOccurrenceRepository
{
    private const MAX_PER_PAGE = 50;

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
}
