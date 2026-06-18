<?php

declare(strict_types=1);

namespace WCM\Database;

final class SchemaInstaller
{
    public const DB_VERSION_OPTION = 'wcm_core_db_version';
    public const DB_VERSION = '1.1.0';

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
        $originalTermsTable = $prefix . 'wcm_original_terms';
        $originalWordOccurrencesTable = $prefix . 'wcm_original_word_occurrences';

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
            "CREATE TABLE {$originalTermsTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                language_type VARCHAR(20) NOT NULL,
                lemma TEXT NOT NULL,
                lemma_normalized VARCHAR(255) NOT NULL,
                strongs_number VARCHAR(50) NOT NULL DEFAULT '',
                strongs_extended VARCHAR(100) NOT NULL DEFAULT '',
                transliteration VARCHAR(255) NOT NULL DEFAULT '',
                root VARCHAR(255) NOT NULL DEFAULT '',
                gloss TEXT NULL,
                definition LONGTEXT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY term_identity (language_type, lemma_normalized, strongs_number, strongs_extended),
                KEY language_strongs (language_type, strongs_number),
                KEY language_extended_strongs (language_type, strongs_extended),
                KEY language_lemma (language_type, lemma_normalized),
                KEY language_root (language_type, root)
            ) {$charsetCollate};",
            "CREATE TABLE {$originalWordOccurrencesTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                term_id BIGINT UNSIGNED NOT NULL,
                book_id BIGINT UNSIGNED NOT NULL,
                chapter INT UNSIGNED NOT NULL,
                verse INT UNSIGNED NOT NULL,
                word_order INT UNSIGNED NOT NULL,
                subword_order INT UNSIGNED NOT NULL DEFAULT 0,
                token_type VARCHAR(30) NOT NULL DEFAULT 'word',
                surface_form TEXT NOT NULL,
                normalized_form VARCHAR(255) NOT NULL DEFAULT '',
                morphology VARCHAR(255) NOT NULL DEFAULT '',
                grammar_summary TEXT NULL,
                grammar_note TEXT NULL,
                contextual_function TEXT NULL,
                source_dataset VARCHAR(50) NOT NULL,
                source_ref VARCHAR(255) NOT NULL DEFAULT '',
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY occurrence_identity (source_dataset, book_id, chapter, verse, word_order, subword_order, token_type),
                KEY verse_lookup (source_dataset, book_id, chapter, verse),
                KEY interlinear_lookup (source_dataset, book_id, chapter, verse, word_order, subword_order),
                KEY term_lookup (term_id),
                KEY term_reference_lookup (term_id, book_id, chapter, verse),
                KEY source_ref_lookup (source_dataset, source_ref)
            ) {$charsetCollate};",
        ];
    }
}
