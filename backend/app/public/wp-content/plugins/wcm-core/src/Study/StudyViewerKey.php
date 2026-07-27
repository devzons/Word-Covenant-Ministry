<?php

declare(strict_types=1);

namespace WCM\Study;

final class StudyViewerKey
{
    public function forCurrentRequest(): string
    {
        if (is_user_logged_in()) {
            return $this->hmac('user:' . (string) get_current_user_id());
        }

        return $this->hmac('anon:' . $this->anonymousFingerprint());
    }

    private function anonymousFingerprint(): string
    {
        $ip = isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])
            ? trim($_SERVER['REMOTE_ADDR'])
            : 'unknown';
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) && is_string($_SERVER['HTTP_USER_AGENT'])
            ? strtolower(trim(substr($_SERVER['HTTP_USER_AGENT'], 0, 255)))
            : '';

        return $ip . '|' . $userAgent;
    }

    private function hmac(string $value): string
    {
        return hash_hmac('sha256', $value, wp_salt('auth'));
    }
}
