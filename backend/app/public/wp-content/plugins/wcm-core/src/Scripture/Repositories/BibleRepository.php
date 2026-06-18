<?php

declare(strict_types=1);

namespace WCM\Scripture\Repositories;

use WCM\Scripture\ValueObjects\BibleVerse;

final class BibleRepository
{
    /**
     * @return array<string, mixed>|null
     */
    public function getVersionByCode(string $code): ?array
    {
        global $wpdb;

        $code = trim($code);

        if ($code === '') {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_bible_versions';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE code = %s LIMIT 1",
                $code
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getBookByOrder(int $bookOrder): ?array
    {
        global $wpdb;

        if ($bookOrder < 1) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_bible_books';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE book_order = %d LIMIT 1",
                $bookOrder
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getBookBySlug(string $slug): ?array
    {
        global $wpdb;

        $slug = trim($slug);

        if ($slug === '') {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_bible_books';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE slug = %s LIMIT 1",
                $slug
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getVerse(
        int $versionId,
        int $bookId,
        int $chapter,
        int $verse
    ): ?array {
        global $wpdb;

        if ($versionId < 1 || $bookId < 1 || $chapter < 1 || $verse < 1) {
            return null;
        }

        $tableName = $wpdb->prefix . 'wcm_bible_verses';

        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName}
                WHERE version_id = %d
                AND book_id = %d
                AND chapter = %d
                AND verse = %d
                LIMIT 1",
                $versionId,
                $bookId,
                $chapter,
                $verse
            ),
            'ARRAY_A'
        );

        return is_array($row) ? $row : null;
    }

    public function verseExists(
        int $versionId,
        int $bookId,
        int $chapter,
        int $verse
    ): bool {
        global $wpdb;

        if ($versionId < 1 || $bookId < 1 || $chapter < 1 || $verse < 1) {
            return false;
        }

        $tableName = $wpdb->prefix . 'wcm_bible_verses';

        $existingId = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$tableName}
                WHERE version_id = %d
                AND book_id = %d
                AND chapter = %d
                AND verse = %d
                LIMIT 1",
                $versionId,
                $bookId,
                $chapter,
                $verse
            )
        );

        return $existingId !== null;
    }

    public function upsertVerse(BibleVerse $verse): bool
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_bible_verses';
        $now = current_time('mysql');

        $existingId = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$tableName}
                WHERE version_id = %d
                AND book_id = %d
                AND chapter = %d
                AND verse = %d
                LIMIT 1",
                $verse->versionId,
                $verse->bookId,
                $verse->chapter,
                $verse->verse
            )
        );

        if ($existingId !== null) {
            return $wpdb->update(
                $tableName,
                [
                    'text' => $verse->text,
                    'updated_at' => $now,
                ],
                [
                    'version_id' => $verse->versionId,
                    'book_id' => $verse->bookId,
                    'chapter' => $verse->chapter,
                    'verse' => $verse->verse,
                ],
                ['%s', '%s'],
                ['%d', '%d', '%d', '%d']
            ) !== false;
        }

        return $wpdb->insert(
            $tableName,
            [
                'version_id' => $verse->versionId,
                'book_id' => $verse->bookId,
                'chapter' => $verse->chapter,
                'verse' => $verse->verse,
                'text' => $verse->text,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            ['%d', '%d', '%d', '%d', '%s', '%s', '%s']
        ) !== false;
    }
}
