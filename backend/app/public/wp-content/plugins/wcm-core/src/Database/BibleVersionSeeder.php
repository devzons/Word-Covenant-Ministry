<?php

declare(strict_types=1);

namespace WCM\Database;

final class BibleVersionSeeder
{
    /**
     * @return array{ok: bool, inserted: int, updated: int, errors: string[]}
     */
    public function seed(): array
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_bible_versions';

        if (! $this->tableExists($tableName)) {
            return [
                'ok' => false,
                'inserted' => 0,
                'updated' => 0,
                'errors' => ['Bible versions table does not exist.'],
            ];
        }

        $result = [
            'ok' => true,
            'inserted' => 0,
            'updated' => 0,
            'errors' => [],
        ];

        foreach ($this->getVersions() as $version) {
            $existingId = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$tableName} WHERE code = %s LIMIT 1",
                    $version['code']
                )
            );

            $now = current_time('mysql');
            $row = [
                'code' => $version['code'],
                'name' => $version['name'],
                'language' => $version['language'],
                'source' => $version['source'],
                'license_note' => $version['license_note'],
                'is_active' => $version['is_active'],
                'updated_at' => $now,
            ];

            if ($existingId !== null) {
                $updated = $wpdb->update(
                    $tableName,
                    $row,
                    ['code' => $version['code']],
                    ['%s', '%s', '%s', '%s', '%s', '%d', '%s'],
                    ['%s']
                );

                if ($updated === false) {
                    $result['ok'] = false;
                    $result['errors'][] = 'Failed to update Bible version ' . $version['code'] . '.';
                    continue;
                }

                $result['updated']++;
                continue;
            }

            $inserted = $wpdb->insert(
                $tableName,
                $row + ['created_at' => $now],
                ['%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s']
            );

            if ($inserted === false) {
                $result['ok'] = false;
                $result['errors'][] = 'Failed to insert Bible version ' . $version['code'] . '.';
                continue;
            }

            $result['inserted']++;
        }

        return $result;
    }

    private function tableExists(string $tableName): bool
    {
        global $wpdb;

        return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName)) === $tableName;
    }

    /**
     * @return array<int, array{code: string, name: string, language: string, source: string, license_note: string, is_active: int}>
     */
    private function getVersions(): array
    {
        return [
            [
                'code' => 'KRV',
                'name' => '개역한글',
                'language' => 'ko',
                'source' => 'docs/data-sources/개역한글.mdb',
                'license_note' => '개역한글판은 2011년 12월 31일 저작재산권 보호기간이 소멸된 것으로 문서화됨. See ADR-0007.',
                'is_active' => 1,
            ],
            [
                'code' => 'WEB',
                'name' => 'World English Bible',
                'language' => 'en',
                'source' => 'future data acquisition',
                'license_note' => 'Public-domain/open Bible translation candidate. Confirm source before import.',
                'is_active' => 0,
            ],
            [
                'code' => 'OSHB',
                'name' => 'Open Scriptures Hebrew Bible',
                'language' => 'he',
                'source' => 'future data acquisition',
                'license_note' => 'Original Hebrew source candidate. Confirm source and license before import.',
                'is_active' => 0,
            ],
            [
                'code' => 'SBLGNT',
                'name' => 'SBL Greek New Testament',
                'language' => 'el',
                'source' => 'future data acquisition',
                'license_note' => 'Original Greek source candidate. Confirm source and license before import.',
                'is_active' => 0,
            ],
        ];
    }
}
