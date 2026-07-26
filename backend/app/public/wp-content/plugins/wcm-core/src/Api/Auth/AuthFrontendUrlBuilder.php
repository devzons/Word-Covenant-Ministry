<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

final class AuthFrontendUrlBuilder
{
    /**
     * @return array<int, string>
     */
    public function allowedOrigins(): array
    {
        $origins = [];
        $configuredOrigins = trim((string) getenv('WCM_ALLOWED_ORIGINS'));

        if ($configuredOrigins !== '') {
            foreach (explode(',', $configuredOrigins) as $configuredOrigin) {
                $normalizedOrigin = $this->normalizeOrigin($configuredOrigin);

                if ($normalizedOrigin !== null) {
                    $origins[] = $normalizedOrigin;
                }
            }
        }

        $frontendOrigin = $this->normalizeOrigin($this->frontendBaseUrl());

        if ($frontendOrigin !== null) {
            $origins[] = $frontendOrigin;
        }

        return array_values(array_unique($origins));
    }

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

    public function frontendBaseUrl(): string
    {
        $configuredUrl = $this->normalizeAbsoluteUrl((string) getenv('WCM_FRONTEND_URL'));

        if ($configuredUrl !== null) {
            return $configuredUrl;
        }

        $derivedUrl = $this->deriveFrontendUrlFromBackend(home_url());

        if ($derivedUrl !== null) {
            return $derivedUrl;
        }

        return 'https://wordcovenantministry.org';
    }

    private function deriveFrontendUrlFromBackend(string $backendUrl): ?string
    {
        $scheme = wp_parse_url($backendUrl, PHP_URL_SCHEME);
        $host = wp_parse_url($backendUrl, PHP_URL_HOST);

        if (! is_string($scheme) || ! is_string($host) || $scheme === '' || $host === '') {
            return null;
        }

        $normalizedHost = strtolower($host);

        if (str_contains($normalizedHost, '.local') || str_contains($normalizedHost, 'localhost')) {
            return 'http://wordcovenantministry.local:3030';
        }

        if (str_starts_with($normalizedHost, 'api.')) {
            return untrailingslashit($scheme . '://' . substr($normalizedHost, 4));
        }

        if (str_starts_with($normalizedHost, 'api-')) {
            return untrailingslashit($scheme . '://' . substr($normalizedHost, 4));
        }

        return null;
    }

    private function normalizeAbsoluteUrl(string $url): ?string
    {
        $url = trim($url);

        if ($url === '') {
            return null;
        }

        $scheme = wp_parse_url($url, PHP_URL_SCHEME);
        $host = wp_parse_url($url, PHP_URL_HOST);
        $port = wp_parse_url($url, PHP_URL_PORT);

        if (! is_string($scheme) || ! is_string($host) || $scheme === '' || $host === '') {
            return null;
        }

        $normalized = strtolower($scheme) . '://' . strtolower($host);

        if (is_int($port)) {
            $normalized .= ':' . $port;
        }

        return untrailingslashit($normalized);
    }

    private function normalizeOrigin(string $origin): ?string
    {
        return $this->normalizeAbsoluteUrl($origin);
    }
}
