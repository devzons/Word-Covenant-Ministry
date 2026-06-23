<?php

declare(strict_types=1);

namespace WCM\Database;

use RuntimeException;
use WCM\Scripture\Repositories\OriginalTermRepository;

final class SchemaInstaller
{
    public const DB_VERSION_OPTION = 'wcm_core_db_version';
    public const DB_VERSION = '1.6.0';

    public function install(): void
    {
        global $wpdb;

        if (! function_exists('dbDelta')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        $charsetCollate = $wpdb->get_charset_collate();

        dbDelta($this->getSchemaSql($wpdb->prefix, $charsetCollate));
        $this->migrateOriginalTermIdentityHash($wpdb->prefix . 'wcm_original_terms');
        $this->migrateOriginalTermKoreanTransliteration($wpdb->prefix . 'wcm_original_terms');
        $this->migrateOriginalTermKoreanGloss($wpdb->prefix . 'wcm_original_terms');
        $this->migrateCrossReferenceAuditMetadata($wpdb->prefix . 'wcm_cross_references');

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
        $crossReferencesTable = $prefix . 'wcm_cross_references';

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
                term_identity_hash CHAR(64) NOT NULL DEFAULT '',
                transliteration VARCHAR(255) NOT NULL DEFAULT '',
                transliteration_ko VARCHAR(255) NULL,
                root VARCHAR(255) NOT NULL DEFAULT '',
                gloss TEXT NULL,
                gloss_ko TEXT NULL,
                definition LONGTEXT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                KEY term_identity_text (language_type, lemma_normalized, strongs_number, strongs_extended),
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
            "CREATE TABLE {$crossReferencesTable} (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                source_book VARCHAR(64) NOT NULL,
                source_start_chapter SMALLINT UNSIGNED NOT NULL,
                source_start_verse SMALLINT UNSIGNED NOT NULL,
                source_end_chapter SMALLINT UNSIGNED NULL,
                source_end_verse SMALLINT UNSIGNED NULL,
                target_book VARCHAR(64) NOT NULL,
                target_start_chapter SMALLINT UNSIGNED NOT NULL,
                target_start_verse SMALLINT UNSIGNED NOT NULL,
                target_end_chapter SMALLINT UNSIGNED NULL,
                target_end_verse SMALLINT UNSIGNED NULL,
                relationship_type VARCHAR(50) NOT NULL,
                source_dataset VARCHAR(50) NOT NULL,
                source_score INT NULL,
                confidence VARCHAR(50) NOT NULL DEFAULT 'source_backed',
                review_status VARCHAR(50) NOT NULL DEFAULT 'unreviewed',
                reviewed_by BIGINT UNSIGNED NULL,
                reviewed_at DATETIME NULL,
                previous_review_status VARCHAR(50) NULL,
                review_source VARCHAR(50) NULL,
                review_reason VARCHAR(191) NULL,
                review_notes TEXT NULL,
                package_id VARCHAR(191) NOT NULL,
                source_checksum CHAR(64) NOT NULL,
                relationship_identity_hash CHAR(64) NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY relationship_identity_hash (relationship_identity_hash),
                KEY source_lookup (source_book, source_start_chapter, source_start_verse),
                KEY target_lookup (target_book, target_start_chapter, target_start_verse),
                KEY relationship_type_lookup (relationship_type),
                KEY source_dataset_lookup (source_dataset),
                KEY review_status_lookup (review_status),
                KEY package_lookup (package_id)
            ) {$charsetCollate};",
        ];
    }

    private function migrateOriginalTermIdentityHash(string $tableName): void
    {
        global $wpdb;

        if (! $this->tableExists($tableName)) {
            return;
        }

        if (! $this->columnExists($tableName, 'term_identity_hash')) {
            $added = $wpdb->query("ALTER TABLE {$tableName} ADD term_identity_hash CHAR(64) NOT NULL DEFAULT '' AFTER strongs_extended");
            if ($added === false) {
                throw new RuntimeException('Failed to add original term identity hash column.');
            }
        }

        $this->backfillOriginalTermIdentityHashes($tableName);
        $this->assertNoDuplicateOriginalTermIdentityHashes($tableName);

        if (! $this->indexExists($tableName, 'term_identity_hash')) {
            $created = $wpdb->query("ALTER TABLE {$tableName} ADD UNIQUE KEY term_identity_hash (term_identity_hash)");
            if ($created === false) {
                throw new RuntimeException('Failed to add original term identity hash unique key.');
            }
        }

        if ($this->uniqueIndexExists($tableName, 'term_identity')) {
            $dropped = $wpdb->query("ALTER TABLE {$tableName} DROP INDEX term_identity");
            if ($dropped === false) {
                throw new RuntimeException('Failed to drop collation-sensitive original term identity unique key.');
            }
        }
    }

    private function backfillOriginalTermIdentityHashes(string $tableName): void
    {
        global $wpdb;

        $repository = new OriginalTermRepository();

        do {
            $rows = $wpdb->get_results(
                "SELECT id, language_type, lemma_normalized, strongs_number, strongs_extended
                FROM {$tableName}
                WHERE term_identity_hash = ''
                ORDER BY id ASC
                LIMIT 500",
                'ARRAY_A'
            );

            if (! is_array($rows)) {
                throw new RuntimeException('Failed to read original terms for identity hash backfill.');
            }

            foreach ($rows as $row) {
                $hash = $repository->buildIdentityHash(
                    (string) $row['language_type'],
                    (string) $row['lemma_normalized'],
                    (string) $row['strongs_number'],
                    (string) $row['strongs_extended']
                );

                $updated = $wpdb->update(
                    $tableName,
                    ['term_identity_hash' => $hash],
                    ['id' => (int) $row['id']],
                    ['%s'],
                    ['%d']
                );

                if ($updated === false) {
                    throw new RuntimeException('Failed to backfill original term identity hash for term ID ' . (int) $row['id'] . '.');
                }
            }
        } while ($rows !== []);
    }

    private function assertNoDuplicateOriginalTermIdentityHashes(string $tableName): void
    {
        global $wpdb;

        $duplicateHash = $wpdb->get_var(
            "SELECT term_identity_hash
            FROM {$tableName}
            WHERE term_identity_hash <> ''
            GROUP BY term_identity_hash
            HAVING COUNT(*) > 1
            LIMIT 1"
        );

        if (is_string($duplicateHash) && $duplicateHash !== '') {
            throw new RuntimeException('Duplicate original term identity hash detected: ' . $duplicateHash);
        }
    }

    private function migrateOriginalTermKoreanTransliteration(string $tableName): void
    {
        global $wpdb;

        if (! $this->tableExists($tableName)) {
            return;
        }

        if ($this->columnExists($tableName, 'transliteration_ko')) {
            return;
        }

        $added = $wpdb->query("ALTER TABLE {$tableName} ADD transliteration_ko VARCHAR(255) NULL AFTER transliteration");
        if ($added === false) {
            throw new RuntimeException('Failed to add original term Korean transliteration column.');
        }
    }

    private function migrateOriginalTermKoreanGloss(string $tableName): void
    {
        global $wpdb;

        if (! $this->tableExists($tableName)) {
            return;
        }

        if ($this->columnExists($tableName, 'gloss_ko')) {
            return;
        }

        $added = $wpdb->query("ALTER TABLE {$tableName} ADD gloss_ko TEXT NULL AFTER gloss");
        if ($added === false) {
            throw new RuntimeException('Failed to add original term Korean gloss column.');
        }
    }

    private function migrateCrossReferenceAuditMetadata(string $tableName): void
    {
        global $wpdb;

        if (! $this->tableExists($tableName)) {
            return;
        }

        $columns = [
            'reviewed_by' => 'ADD reviewed_by BIGINT UNSIGNED NULL AFTER review_status',
            'reviewed_at' => 'ADD reviewed_at DATETIME NULL AFTER reviewed_by',
            'previous_review_status' => 'ADD previous_review_status VARCHAR(50) NULL AFTER reviewed_at',
            'review_source' => 'ADD review_source VARCHAR(50) NULL AFTER previous_review_status',
            'review_reason' => 'ADD review_reason VARCHAR(191) NULL AFTER review_source',
            'review_notes' => 'ADD review_notes TEXT NULL AFTER review_reason',
        ];

        foreach ($columns as $columnName => $alterSql) {
            if ($this->columnExists($tableName, $columnName)) {
                continue;
            }

            $added = $wpdb->query("ALTER TABLE {$tableName} {$alterSql}");
            if ($added === false) {
                throw new RuntimeException('Failed to add cross reference audit metadata column: ' . $columnName . '.');
            }
        }
    }

    private function tableExists(string $tableName): bool
    {
        global $wpdb;

        return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName)) === $tableName;
    }

    private function columnExists(string $tableName, string $columnName): bool
    {
        global $wpdb;

        return $wpdb->get_var(
            $wpdb->prepare("SHOW COLUMNS FROM {$tableName} LIKE %s", $columnName)
        ) === $columnName;
    }

    private function indexExists(string $tableName, string $indexName): bool
    {
        foreach ($this->getIndexes($tableName) as $row) {
            if ((string) ($row['Key_name'] ?? '') === $indexName) {
                return true;
            }
        }

        return false;
    }

    private function uniqueIndexExists(string $tableName, string $indexName): bool
    {
        foreach ($this->getIndexes($tableName) as $row) {
            if (
                (string) ($row['Key_name'] ?? '') === $indexName
                && (string) ($row['Non_unique'] ?? '1') === '0'
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getIndexes(string $tableName): array
    {
        global $wpdb;

        $rows = $wpdb->get_results("SHOW INDEX FROM {$tableName}", 'ARRAY_A');

        return is_array($rows) ? $rows : [];
    }
}
