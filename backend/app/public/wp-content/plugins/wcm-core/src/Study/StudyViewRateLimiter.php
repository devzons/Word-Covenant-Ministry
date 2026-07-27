<?php

declare(strict_types=1);

namespace WCM\Study;

final class StudyViewRateLimiter
{
    private const WINDOW_SECONDS = 600;
    private const MAX_REQUESTS = 60;

    public function allow(string $viewerKey): bool
    {
        $cacheKey = $this->cacheKey($viewerKey);
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

    public function maxRequests(): int
    {
        return self::MAX_REQUESTS;
    }

    public function windowSeconds(): int
    {
        return self::WINDOW_SECONDS;
    }

    private function cacheKey(string $viewerKey): string
    {
        return 'wcm_study_view_rate_' . hash_hmac('sha256', $viewerKey, wp_salt('nonce'));
    }
}
