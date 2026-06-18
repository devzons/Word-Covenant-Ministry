<?php

declare(strict_types=1);

namespace WCM\Database;

final class SchemaInstaller
{
    public const DB_VERSION_OPTION = 'wcm_core_db_version';
    public const DB_VERSION = '1.0.0';

    public function install(): void
    {
        global $wpdb;

        if (! function_exists('dbDelta')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        $charsetCollate = $wpdb->get_charset_collate();

        dbDelta($this->getSchemaSql($wpdb->prefix, $charsetCollate));

        update_option(self::DB_VERSION_OPTION, self::DB_VERSION);
    }

    /**
     * @return string[]
     */
    private function getSchemaSql(string $prefix, string $charsetCollate): array
    {
        $versionsTable = $prefix . 'wcm_bible_versions';
        $booksTable = $prefix . 'wcm_bible_books';
        $versesTable = $prefix . 'wcm_bible_verses';

        return [
            "CREATE TABLE {$versionsTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                code VARCHAR(32) NOT NULL,
                name VARCHAR(191) NOT NULL,
                language VARCHAR(16) NOT NULL,
                source VARCHAR(191) NULL,
                license_note TEXT NULL,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY code (code),
                KEY language (language),
                KEY is_active (is_active)
            ) {$charsetCollate};",
            "CREATE TABLE {$booksTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                book_order SMALLINT UNSIGNED NOT NULL,
                slug VARCHAR(64) NOT NULL,
                name_ko VARCHAR(64) NOT NULL,
                name_en VARCHAR(64) NOT NULL,
                testament VARCHAR(16) NOT NULL,
                chapters SMALLINT UNSIGNED NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY book_order (book_order),
                UNIQUE KEY slug (slug),
                KEY testament (testament)
            ) {$charsetCollate};",
            "CREATE TABLE {$versesTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                version_id BIGINT UNSIGNED NOT NULL,
                book_id BIGINT UNSIGNED NOT NULL,
                chapter SMALLINT UNSIGNED NOT NULL,
                verse SMALLINT UNSIGNED NOT NULL,
                text LONGTEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY verse_lookup (version_id, book_id, chapter, verse),
                KEY reference_lookup (book_id, chapter, verse),
                KEY version_lookup (version_id)
            ) {$charsetCollate};",
        ];
    }
}
