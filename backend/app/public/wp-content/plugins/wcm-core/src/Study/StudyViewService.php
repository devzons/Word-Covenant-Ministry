<?php

declare(strict_types=1);

namespace WCM\Study;

use WP_Comment_Query;
use WP_Error;
use WP_Post;
use wpdb;

final class StudyViewService
{
    public const ALLOWED_LOCALES = ['ko', 'en'];
    public const DEDUPE_HOURS = 24;
    public const RETENTION_DAYS = 180;

    private const LOCK_TIMEOUT_SECONDS = 2;

    private readonly wpdb $db;

    public function __construct(
        ?wpdb $db = null,
        private readonly StudyViewerKey $viewerKey = new StudyViewerKey(),
        private readonly StudyViewRateLimiter $rateLimiter = new StudyViewRateLimiter()
    ) {
        global $wpdb;

        $this->db = $db ?? $wpdb;
    }

    public function recordView(int $studyId, string $locale): array|WP_Error
    {
        $study = $this->validatedStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        $validatedLocale = $this->validatedLocale($locale);

        if ($validatedLocale instanceof WP_Error) {
            return $validatedLocale;
        }

        $viewerKeyHash = $this->viewerKey->forCurrentRequest();

        if (! $this->rateLimiter->allow($viewerKeyHash)) {
            return new WP_Error(
                'study_view_rate_limited',
                'Too many study view requests were received.',
                ['status' => 429]
            );
        }

        $lockName = $this->lockName($studyId, $validatedLocale, $viewerKeyHash);

        if (! $this->acquireLock($lockName)) {
            return new WP_Error(
                'study_view_conflict',
                'Study view tracking is temporarily busy.',
                ['status' => 409]
            );
        }

        try {
            if ($this->isDuplicate($studyId, $validatedLocale, $viewerKeyHash)) {
                return [
                    'counted' => false,
                    'reason' => 'duplicate',
                    ...$this->engagementPayload($studyId, $validatedLocale),
                ];
            }

            $timestamp = current_time('mysql', true);
            $dedupeExpiresAt = gmdate('Y-m-d H:i:s', strtotime($timestamp . ' UTC +24 hours'));
            $inserted = $this->db->insert(
                $this->eventsTable(),
                [
                    'study_id' => $studyId,
                    'locale' => $validatedLocale,
                    'viewer_key_hash' => $viewerKeyHash,
                    'viewed_at' => $timestamp,
                    'dedupe_expires_at' => $dedupeExpiresAt,
                    'created_at' => $timestamp,
                ],
                ['%d', '%s', '%s', '%s', '%s', '%s']
            );

            if ($inserted !== 1) {
                return new WP_Error(
                    'study_view_insert_failed',
                    'Study view could not be recorded.',
                    ['status' => 500]
                );
            }

            $this->upsertStatsRow($studyId, $validatedLocale, $timestamp);
            $this->incrementTotalViews($studyId, $validatedLocale);
            $this->refreshRollingStats($studyId, $validatedLocale, $timestamp);

            return [
                'counted' => true,
                'reason' => 'recorded',
                ...$this->engagementPayload($studyId, $validatedLocale),
            ];
        } finally {
            $this->releaseLock($lockName);
        }
    }

    public function getEngagement(int $studyId, string $locale): array|WP_Error
    {
        $study = $this->validatedStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        $validatedLocale = $this->validatedLocale($locale);

        if ($validatedLocale instanceof WP_Error) {
            return $validatedLocale;
        }

        return $this->engagementPayload($studyId, $validatedLocale);
    }

    public function refreshAllRollingStats(): void
    {
        $rows = $this->db->get_results(
            "SELECT study_id, locale FROM {$this->statsTable()}",
            ARRAY_A
        );

        if (! is_array($rows)) {
            return;
        }

        $timestamp = current_time('mysql', true);

        foreach ($rows as $row) {
            $studyId = isset($row['study_id']) ? (int) $row['study_id'] : 0;
            $locale = isset($row['locale']) ? (string) $row['locale'] : '';

            if ($studyId < 1 || $locale === '') {
                continue;
            }

            $this->refreshRollingStats($studyId, $locale, $timestamp);
        }
    }

    public function pruneExpiredEvents(): void
    {
        $cutoff = gmdate('Y-m-d H:i:s', time() - (self::RETENTION_DAYS * DAY_IN_SECONDS));

        $this->db->query(
            $this->db->prepare(
                "DELETE FROM {$this->eventsTable()} WHERE viewed_at < %s",
                $cutoff
            )
        );
    }

    /**
     * @return array{study_id: int, locale: string, views_total: int, views_7d: int, views_30d: int, comments_approved: int}
     */
    private function engagementPayload(int $studyId, string $locale): array
    {
        $row = $this->db->get_row(
            $this->db->prepare(
                "SELECT total_views, views_7d, views_30d FROM {$this->statsTable()} WHERE study_id = %d AND locale = %s LIMIT 1",
                $studyId,
                $locale
            ),
            ARRAY_A
        );

        return [
            'study_id' => $studyId,
            'locale' => $locale,
            'views_total' => is_array($row) ? (int) ($row['total_views'] ?? 0) : 0,
            'views_7d' => is_array($row) ? (int) ($row['views_7d'] ?? 0) : 0,
            'views_30d' => is_array($row) ? (int) ($row['views_30d'] ?? 0) : 0,
            'comments_approved' => $this->approvedCommentCount($studyId),
        ];
    }

    private function validatedStudy(int $studyId): WP_Post|WP_Error
    {
        if ($studyId < 1) {
            return new WP_Error(
                'study_invalid_id',
                'Study ID is invalid.',
                ['status' => 400]
            );
        }

        $post = get_post($studyId);

        if (! $post instanceof WP_Post || $post->post_type !== 'wcm_study') {
            return new WP_Error(
                'study_not_found',
                'Study not found.',
                ['status' => 404]
            );
        }

        if ($post->post_status !== 'publish') {
            return new WP_Error(
                'study_not_public',
                'Study is not publicly available.',
                ['status' => 404]
            );
        }

        return $post;
    }

    private function validatedLocale(string $locale): string|WP_Error
    {
        $normalized = trim(strtolower($locale));

        if (! in_array($normalized, self::ALLOWED_LOCALES, true)) {
            return new WP_Error(
                'study_invalid_locale',
                'Locale is invalid.',
                ['status' => 400]
            );
        }

        return $normalized;
    }

    private function approvedCommentCount(int $studyId): int
    {
        $query = new WP_Comment_Query();
        $count = $query->query(
            [
                'count' => true,
                'post_id' => $studyId,
                'status' => 'approve',
                'type' => 'wcm_study_comment',
            ]
        );

        return is_numeric($count) ? (int) $count : 0;
    }

    private function isDuplicate(int $studyId, string $locale, string $viewerKeyHash): bool
    {
        $now = current_time('mysql', true);
        $found = $this->db->get_var(
            $this->db->prepare(
                "SELECT id FROM {$this->eventsTable()} WHERE study_id = %d AND locale = %s AND viewer_key_hash = %s AND dedupe_expires_at > %s ORDER BY id DESC LIMIT 1",
                $studyId,
                $locale,
                $viewerKeyHash,
                $now
            )
        );

        return $found !== null;
    }

    private function upsertStatsRow(int $studyId, string $locale, string $timestamp): void
    {
        $sql = $this->db->prepare(
            "INSERT INTO {$this->statsTable()} (study_id, locale, total_views, views_7d, views_30d, updated_at)
             VALUES (%d, %s, 0, 0, 0, %s)
             ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at)",
            $studyId,
            $locale,
            $timestamp
        );

        if (is_string($sql)) {
            $this->db->query($sql);
        }
    }

    private function incrementTotalViews(int $studyId, string $locale): void
    {
        $sql = $this->db->prepare(
            "UPDATE {$this->statsTable()} SET total_views = total_views + 1 WHERE study_id = %d AND locale = %s",
            $studyId,
            $locale
        );

        if (is_string($sql)) {
            $this->db->query($sql);
        }
    }

    private function refreshRollingStats(int $studyId, string $locale, string $timestamp): void
    {
        $views7d = (int) $this->db->get_var(
            $this->db->prepare(
                "SELECT COUNT(*) FROM {$this->eventsTable()} WHERE study_id = %d AND locale = %s AND viewed_at >= DATE_SUB(%s, INTERVAL 7 DAY)",
                $studyId,
                $locale,
                $timestamp
            )
        );
        $views30d = (int) $this->db->get_var(
            $this->db->prepare(
                "SELECT COUNT(*) FROM {$this->eventsTable()} WHERE study_id = %d AND locale = %s AND viewed_at >= DATE_SUB(%s, INTERVAL 30 DAY)",
                $studyId,
                $locale,
                $timestamp
            )
        );

        $this->db->update(
            $this->statsTable(),
            [
                'views_7d' => $views7d,
                'views_30d' => $views30d,
                'updated_at' => $timestamp,
            ],
            [
                'study_id' => $studyId,
                'locale' => $locale,
            ],
            ['%d', '%d', '%s'],
            ['%d', '%s']
        );
    }

    private function acquireLock(string $lockName): bool
    {
        $result = $this->db->get_var(
            $this->db->prepare(
                'SELECT GET_LOCK(%s, %d)',
                $lockName,
                self::LOCK_TIMEOUT_SECONDS
            )
        );

        return (string) $result === '1';
    }

    private function releaseLock(string $lockName): void
    {
        $sql = $this->db->prepare('SELECT RELEASE_LOCK(%s)', $lockName);

        if (is_string($sql)) {
            $this->db->query($sql);
        }
    }

    private function lockName(int $studyId, string $locale, string $viewerKeyHash): string
    {
        return 'wcmsv:' . md5($studyId . '|' . $locale . '|' . $viewerKeyHash);
    }

    private function eventsTable(): string
    {
        return $this->db->prefix . 'wcm_study_view_events';
    }

    private function statsTable(): string
    {
        return $this->db->prefix . 'wcm_study_view_stats';
    }
}
