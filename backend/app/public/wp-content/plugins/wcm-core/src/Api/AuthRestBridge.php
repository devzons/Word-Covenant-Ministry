<?php

declare(strict_types=1);

namespace WCM\Api;

final class AuthRestBridge
{
    /**
     * @param int|false $userId
     * @return int|false
     */
    public function determineCurrentUser(int|false $userId): int|false
    {
        if ($userId || ! $this->isBridgeRoute() || ! $this->hasAllowedOrigin()) {
            return $userId;
        }

        if (! defined('LOGGED_IN_COOKIE') || empty($_COOKIE[LOGGED_IN_COOKIE])) {
            return $userId;
        }

        $validatedUserId = wp_validate_auth_cookie((string) $_COOKIE[LOGGED_IN_COOKIE], 'logged_in');

        if (! is_int($validatedUserId) || $validatedUserId < 1) {
            return false;
        }

        return $validatedUserId;
    }

    /**
     * @param mixed $result
     * @return mixed
     */
    public function bypassNonceCheckForBridgeRoutes(mixed $result): mixed
    {
        if (! empty($result) || ! $this->isBridgeRoute() || ! $this->hasAllowedOrigin()) {
            return $result;
        }

        if (! is_user_logged_in()) {
            return $result;
        }

        return true;
    }

    private function isBridgeRoute(): bool
    {
        $route = $this->requestRoute();

        if ($route === null) {
            return false;
        }

        return $route === '/wcm/v1/auth/me' || $route === '/wcm/v1/auth/logout';
    }

    private function hasAllowedOrigin(): bool
    {
        $origin = get_http_origin();

        if (! is_string($origin) || $origin === '') {
            return false;
        }

        return is_allowed_http_origin($origin);
    }

    private function requestRoute(): ?string
    {
        if (isset($_GET['rest_route']) && is_string($_GET['rest_route'])) {
            return wp_unslash($_GET['rest_route']);
        }

        $requestUri = isset($_SERVER['REQUEST_URI']) && is_string($_SERVER['REQUEST_URI'])
            ? wp_unslash($_SERVER['REQUEST_URI'])
            : '';

        if ($requestUri === '') {
            return null;
        }

        $path = (string) wp_parse_url($requestUri, PHP_URL_PATH);
        $prefix = '/wp-json';

        if (! str_starts_with($path, $prefix)) {
            return null;
        }

        $route = substr($path, strlen($prefix));

        return $route === '' ? '/' : $route;
    }
}
