<?php

declare(strict_types=1);

namespace WCM\Study;

final class StudyDiscussionRateLimiter
{
    private const WINDOW_SECONDS = 600;
    private const MAX_REQUESTS = 3;

    public function allow(int $userId): bool
    {
        $cacheKey = $this->cacheKey($userId);
        $state = get_transient($cacheKey);

        if (! is_array($state)) {
            $state = [
                'count' => 0,
                'window_started_at' => time(),
            ];
        }

        $now = time();
        $windowStartedAt = isset($state['window_started_at']) ? (int) $state['window_started_at'] : $now;
        $count = isset($state['count']) ? (int) $state['count'] : 0;

        if (($now - $windowStartedAt) >= self::WINDOW_SECONDS) {
            $windowStartedAt = $now;
            $count = 0;
        }

        $count++;

        set_transient(
            $cacheKey,
            [
                'count' => $count,
                'window_started_at' => $windowStartedAt,
            ],
            self::WINDOW_SECONDS
        );

        return $count <= self::MAX_REQUESTS;
    }

    public function duplicateRecentlySeen(int $userId, int $studyId, int $parentId, string $content): bool
    {
        return get_transient($this->duplicateCacheKey($userId, $studyId, $parentId, $content)) === '1';
    }

    public function rememberDuplicateGuard(int $userId, int $studyId, int $parentId, string $content): void
    {
        set_transient(
            $this->duplicateCacheKey($userId, $studyId, $parentId, $content),
            '1',
            self::WINDOW_SECONDS
        );
    }

    private function cacheKey(int $userId): string
    {
        return 'wcm_study_discussion_rate_' . hash_hmac('sha256', (string) $userId, wp_salt('nonce'));
    }

    private function duplicateCacheKey(int $userId, int $studyId, int $parentId, string $content): string
    {
        $normalized = preg_replace('/\s+/', ' ', strtolower(trim($content)));

        return 'wcm_study_discussion_dupe_' . hash_hmac(
            'sha256',
            $userId . '|' . $studyId . '|' . $parentId . '|' . $normalized,
            wp_salt('nonce')
        );
    }
}
