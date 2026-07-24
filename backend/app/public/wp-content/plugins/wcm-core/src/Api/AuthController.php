<?php

declare(strict_types=1);

namespace WCM\Api;

use WP_REST_Request;
use WP_REST_Response;
use WP_User;

final class AuthController
{
    private const NAMESPACE = 'wcm/v1';

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/auth/login',
            [
                'methods' => 'POST',
                'callback' => [$this, 'login'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/auth/logout',
            [
                'methods' => 'POST',
                'callback' => [$this, 'logout'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/auth/me',
            [
                'methods' => 'GET',
                'callback' => [$this, 'me'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function login(WP_REST_Request $request): WP_REST_Response
    {
        $originValidation = $this->validateAllowedOrigin();

        if ($originValidation !== null) {
            return $originValidation;
        }

        $payload = $this->payload($request);
        $identifier = trim(sanitize_text_field($this->stringValue($payload['identifier'] ?? null)));
        $password = $this->stringValue($payload['password'] ?? null);
        $remember = (bool) ($payload['remember'] ?? false);

        if ($identifier === '' || $password === '') {
            return $this->error('invalid_request', 'Identifier and password are required.', 400);
        }

        $login = $this->resolveLogin($identifier);
        $user = wp_signon(
            [
                'user_login' => $login,
                'user_password' => $password,
                'remember' => $remember,
            ],
            is_ssl()
        );

        if (is_wp_error($user)) {
            return $this->error('invalid_credentials', 'Invalid credentials.', 401);
        }

        wp_set_current_user($user->ID);

        return $this->success(
            [
                'user' => $this->formatUser($user),
            ]
        );
    }

    public function logout(WP_REST_Request $request): WP_REST_Response
    {
        $originValidation = $this->validateAllowedOrigin();

        if ($originValidation !== null) {
            return $originValidation;
        }

        if (is_user_logged_in()) {
            wp_logout();
        } else {
            wp_clear_auth_cookie();
            wp_set_current_user(0);
        }

        return $this->success(
            [
                'user' => null,
            ]
        );
    }

    public function me(): WP_REST_Response
    {
        $user = wp_get_current_user();

        return $this->success(
            [
                'user' => $user instanceof WP_User && $user->exists()
                    ? $this->formatUser($user)
                    : null,
            ]
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(WP_REST_Request $request): array
    {
        $json = $request->get_json_params();

        if (is_array($json)) {
            return $json;
        }

        $bodyParams = $request->get_body_params();

        return is_array($bodyParams) ? $bodyParams : [];
    }

    private function resolveLogin(string $identifier): string
    {
        if (is_email($identifier)) {
            $user = get_user_by('email', $identifier);

            if ($user instanceof WP_User && $user->exists()) {
                return (string) $user->user_login;
            }
        }

        return $identifier;
    }

    private function validateAllowedOrigin(): ?WP_REST_Response
    {
        $origin = get_http_origin();

        if ($origin !== null && $origin !== '' && ! is_allowed_http_origin($origin)) {
            return $this->error('forbidden_origin', 'Origin is not allowed.', 403);
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatUser(WP_User $user): array
    {
        $name = trim((string) $user->display_name);

        return [
            'id' => (int) $user->ID,
            'email' => (string) $user->user_email,
            'name' => $name !== '' ? $name : (string) $user->user_login,
            'roles' => array_values(
                array_filter(
                    array_map(
                        static fn (mixed $role): string => is_string($role) ? $role : '',
                        (array) $user->roles
                    )
                )
            ),
        ];
    }

    private function stringValue(mixed $value): string
    {
        return is_string($value) ? $value : '';
    }

    /**
     * @param array<string, mixed> $data
     */
    private function success(array $data, int $status = 200): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => true,
                'data' => $data,
            ],
            $status
        );
    }

    private function error(string $code, string $message, int $status): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => false,
                'code' => $code,
                'message' => $message,
            ],
            $status
        );
    }
}
