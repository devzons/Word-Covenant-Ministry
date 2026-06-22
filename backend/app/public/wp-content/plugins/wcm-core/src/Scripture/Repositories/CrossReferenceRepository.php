<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

final class CrossReferenceRepository
{
    /**
     * @param array{relationship_type?: string, review_status?: string} $filters
     * @return array<int, array<string, mixed>>
     */
    public function findBySourceReference(
        string $book,
        int $chapter,
        int $verse,
        int $page,
        int $perPage,
        array $filters = [],
        string $sort = 'source_score_desc'
    ): array {
        global $wpdb;

        if ($book === '' || $chapter < 1 || $verse < 1 || $page < 1 || $perPage < 1) {
            return [];
        }

        $crossReferencesTable = $wpdb->prefix . 'wcm_cross_references';
        $booksTable = $wpdb->prefix . 'wcm_bible_books';
        $offset = ($page - 1) * $perPage;
        $limit = $perPage + 1;

        [$whereSql, $params] = $this->sourceWhere($book, $chapter, $verse, $filters);
        $orderSql = $sort === 'canonical'
            ? 'target_book_order ASC, refs.target_start_chapter ASC, refs.target_start_verse ASC, refs.id ASC'
            : 'refs.source_score DESC, target_book_order ASC, refs.target_start_chapter ASC, refs.target_start_verse ASC, refs.id ASC';

        $params[] = $limit;
        $params[] = $offset;

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    refs.id,
                    refs.target_book,
                    refs.target_start_chapter,
                    refs.target_start_verse,
                    refs.target_end_chapter,
                    refs.target_end_verse,
                    refs.relationship_type,
                    refs.review_status,
                    refs.source_score,
                    refs.source_dataset,
                    books.book_order AS target_book_order
                FROM {$crossReferencesTable} refs
                LEFT JOIN {$booksTable} books
                    ON books.slug = refs.target_book
                {$whereSql}
                ORDER BY {$orderSql}
                LIMIT %d OFFSET %d",
                ...$params
            ),
            'ARRAY_A'
        );

        return is_array($rows) ? $rows : [];
    }

    /**
     * @param array{relationship_type?: string, review_status?: string} $filters
     */
    public function countBySourceReference(
        string $book,
        int $chapter,
        int $verse,
        array $filters = []
    ): int {
        global $wpdb;

        if ($book === '' || $chapter < 1 || $verse < 1) {
            return 0;
        }

        $crossReferencesTable = $wpdb->prefix . 'wcm_cross_references';
        [$whereSql, $params] = $this->sourceWhere($book, $chapter, $verse, $filters);

        $count = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*)
                FROM {$crossReferencesTable} refs
                {$whereSql}",
                ...$params
            )
        );

        return (int) $count;
    }

    /**
     * @param array{relationship_type?: string, review_status?: string} $filters
     * @return array<string, int>
     */
    public function sourceDatasetSummaryBySourceReference(
        string $book,
        int $chapter,
        int $verse,
        array $filters = []
    ): array {
        global $wpdb;

        if ($book === '' || $chapter < 1 || $verse < 1) {
            return [];
        }

        $crossReferencesTable = $wpdb->prefix . 'wcm_cross_references';
        [$whereSql, $params] = $this->sourceWhere($book, $chapter, $verse, $filters);

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT refs.source_dataset, COUNT(*) AS dataset_count
                FROM {$crossReferencesTable} refs
                {$whereSql}
                GROUP BY refs.source_dataset
                ORDER BY refs.source_dataset ASC",
                ...$params
            ),
            'ARRAY_A'
        );

        if (! is_array($rows)) {
            return [];
        }

        $summary = [];

        foreach ($rows as $row) {
            $summary[(string) $row['source_dataset']] = (int) $row['dataset_count'];
        }

        return $summary;
    }

    /**
     * @param array{relationship_type?: string, review_status?: string} $filters
     * @return array{0: string, 1: array<int, mixed>}
     */
    private function sourceWhere(string $book, int $chapter, int $verse, array $filters): array
    {
        $where = [
            'refs.source_book = %s',
            'refs.source_start_chapter = %d',
            'refs.source_start_verse = %d',
        ];
        $params = [$book, $chapter, $verse];

        if (isset($filters['relationship_type']) && $filters['relationship_type'] !== '') {
            $where[] = 'refs.relationship_type = %s';
            $params[] = $filters['relationship_type'];
        }

        if (isset($filters['review_status']) && $filters['review_status'] !== '') {
            $where[] = 'refs.review_status = %s';
            $params[] = $filters['review_status'];
        }

        return ['WHERE ' . implode(' AND ', $where), $params];
    }
}
