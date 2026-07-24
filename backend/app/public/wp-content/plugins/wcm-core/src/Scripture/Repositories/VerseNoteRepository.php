<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

final class VerseNoteRepository
{
    /**
     * @return array{items: array<int, array<string, mixed>>, total: int, page: int, per_page: int}
     */
    public function listByUser(int $userId, int $page, int $perPage): array
    {
        global $wpdb;

        $page = max(1, $page);
        $perPage = max(1, $perPage);
        $offset = ($page - 1) * $perPage;
        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';
        $total = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$tableName} WHERE user_id = %d",
                $userId
            )
        );
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE user_id = %d
                ORDER BY updated_at DESC, id DESC
                LIMIT %d OFFSET %d",
                $userId,
                $perPage,
                $offset
            ),
            'ARRAY_A'
        );

        return [
            'items' => is_array($rows) ? $rows : [],
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findByReference(
        int $userId,
        string $translation,
        string $bookSlug,
        int $chapter,
        int $verse
    ): ?array {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE user_id = %d
                AND translation = %s
                AND book_slug = %s
                AND chapter_number = %d
                AND verse_number = %d
                LIMIT 1",
                $userId,
                $translation,
                $bookSlug,
                $chapter,
                $verse
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }

    /**
     * @return array{row: array<string, mixed>, created: bool}
     */
    public function upsert(
        int $userId,
        string $translation,
        string $bookSlug,
        int $chapter,
        int $verse,
        string $noteText
    ): array {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';
        $existing = $this->findByReference($userId, $translation, $bookSlug, $chapter, $verse);
        $timestamp = current_time('mysql');

        if ($existing !== null) {
            $wpdb->update(
                $tableName,
                [
                    'note_text' => $noteText,
                    'updated_at' => $timestamp,
                ],
                ['id' => (int) $existing['id'], 'user_id' => $userId],
                ['%s', '%s'],
                ['%d', '%d']
            );

            $row = $this->findById((int) $existing['id'], $userId);

            return [
                'row' => $row ?? $existing,
                'created' => false,
            ];
        }

        $wpdb->insert(
            $tableName,
            [
                'user_id' => $userId,
                'translation' => $translation,
                'book_slug' => $bookSlug,
                'chapter_number' => $chapter,
                'verse_number' => $verse,
                'note_text' => $noteText,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            ['%d', '%s', '%s', '%d', '%d', '%s', '%s', '%s']
        );

        $row = $this->findById((int) $wpdb->insert_id, $userId);

        return [
            'row' => $row ?? [],
            'created' => true,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function updateTextById(int $noteId, int $userId, string $noteText): ?array
    {
        global $wpdb;

        $existing = $this->findById($noteId, $userId);

        if ($existing === null) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';

        $wpdb->update(
            $tableName,
            [
                'note_text' => $noteText,
                'updated_at' => current_time('mysql'),
            ],
            ['id' => $noteId, 'user_id' => $userId],
            ['%s', '%s'],
            ['%d', '%d']
        );

        return $this->findById($noteId, $userId);
    }

    public function deleteById(int $noteId, int $userId): bool
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';
        $deleted = $wpdb->delete(
            $tableName,
            ['id' => $noteId, 'user_id' => $userId],
            ['%d', '%d']
        );

        return is_int($deleted) && $deleted > 0;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findById(int $noteId, int $userId): ?array
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_user_verse_notes';
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE id = %d
                AND user_id = %d
                LIMIT 1",
                $noteId,
                $userId
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }
}
