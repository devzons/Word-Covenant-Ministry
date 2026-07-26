<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

final class AuthRateLimiter
{
    public function requestIp(): string
    {
        $remoteAddr = isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])
            ? trim(wp_unslash($_SERVER['REMOTE_ADDR']))
            : '';

        return $remoteAddr !== '' ? $remoteAddr : 'unknown';
    }

    public function hashKey(string $value): string
    {
        return hash('sha256', $value);
    }

    public function tooManyAttempts(string $bucket, string $subject, int $limit, int $windowSeconds): bool
    {
        $key = $this->counterKey($bucket, $subject);
        $count = get_transient($key);
        $count = is_numeric($count) ? ((int) $count) + 1 : 1;

        set_transient($key, $count, $windowSeconds);

        return $count > $limit;
    }

    public function inCooldown(string $bucket, string $subject): bool
    {
        return get_transient($this->cooldownKey($bucket, $subject)) !== false;
    }

    public function startCooldown(string $bucket, string $subject, int $cooldownSeconds): void
    {
        set_transient($this->cooldownKey($bucket, $subject), 1, $cooldownSeconds);
    }

    private function counterKey(string $bucket, string $subject): string
    {
        return 'wcm_rate_' . hash('sha256', $bucket . '|' . $subject);
    }

    private function cooldownKey(string $bucket, string $subject): string
    {
        return 'wcm_cooldown_' . hash('sha256', $bucket . '|' . $subject);
    }
}
