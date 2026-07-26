<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

final class AuthFrontendUrlBuilder
{
    public function passwordResetUrl(string $locale, string $login, string $key): string
    {
        return add_query_arg(
            [
                'key' => rawurlencode($key),
                'login' => rawurlencode($login),
            ],
            trailingslashit($this->frontendBaseUrl()) . ltrim($locale . '/reset-password', '/')
        );
    }

    public function verifyEmailUrl(string $locale, string $token): string
    {
        return add_query_arg(
            [
                'token' => rawurlencode($token),
            ],
            trailingslashit($this->frontendBaseUrl()) . ltrim($locale . '/verify-email', '/')
        );
    }

    private function frontendBaseUrl(): string
    {
        $configuredUrl = trim((string) getenv('WCM_FRONTEND_URL'));

        if ($configuredUrl !== '') {
            return untrailingslashit($configuredUrl);
        }

        $homeHost = (string) wp_parse_url(home_url(), PHP_URL_HOST);
        $isLocalEnvironment =
            str_contains($homeHost, '.local') ||
            str_contains($homeHost, 'localhost') ||
            wp_get_environment_type() !== 'production';

        return $isLocalEnvironment
            ? 'http://wordcovenantministry.local:3030'
            : 'https://wordcovenantministry.org';
    }
}
