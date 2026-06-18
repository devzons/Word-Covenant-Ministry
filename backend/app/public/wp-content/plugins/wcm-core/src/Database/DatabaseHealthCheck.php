<?php

declare(strict_types=1);

namespace WCM\Database;

final class DatabaseHealthCheck
{
    /**
     * @return array{ok: bool, tables: array<int, array{name: string, exists: bool}>, missing: string[], db_version: mixed}
     */
    public function check(): array
    {
        global $wpdb;

        $tables = [];
        $missing = [];

        foreach ($this->getTableNames($wpdb->prefix) as $tableName) {
            $exists = $this->tableExists($tableName);

            $tables[] = [
                'name' => $tableName,
                'exists' => $exists,
            ];

            if (! $exists) {
                $missing[] = $tableName;
            }
        }

        return [
            'ok' => $missing === [],
            'tables' => $tables,
            'missing' => $missing,
            'db_version' => get_option(SchemaInstaller::DB_VERSION_OPTION),
        ];
    }

    /**
     * @return string[]
     */
    private function getTableNames(string $prefix): array
    {
        return [
            $prefix . 'wcm_bible_versions',
            $prefix . 'wcm_bible_books',
            $prefix . 'wcm_bible_verses',
        ];
    }

    private function tableExists(string $tableName): bool
    {
        global $wpdb;

        return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName)) === $tableName;
    }
}
