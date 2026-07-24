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

        register_rest_route(
            self::NAMESPACE,
            '/auth/forgot-password',
            [
                'methods' => 'POST',
                'callback' => [$this, 'forgotPassword'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/auth/reset-password',
            [
                'methods' => 'POST',
                'callback' => [$this, 'resetPassword'],
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

    public function forgotPassword(WP_REST_Request $request): WP_REST_Response
    {
        $originValidation = $this->validateAllowedOrigin();

        if ($originValidation !== null) {
            return $originValidation;
        }

        $payload = $this->payload($request);
        $identifier = trim(sanitize_text_field($this->stringValue($payload['identifier'] ?? null)));
        $locale = $this->normalizeLocale($payload['locale'] ?? null);

        if ($identifier === '') {
            return $this->error('invalid_request', 'Identifier is required.', 400);
        }

        if (strlen($identifier) > 191) {
            return $this->error('invalid_request', 'Identifier is too long.', 400);
        }

        $user = $this->userForIdentifier($identifier);

        if ($user instanceof WP_User && $user->exists()) {
            $this->sendPasswordResetEmail($user, $locale);
        }

        return $this->success(
            [
                'message' => $this->forgotPasswordSuccessMessage($locale),
            ]
        );
    }

    public function resetPassword(WP_REST_Request $request): WP_REST_Response
    {
        $originValidation = $this->validateAllowedOrigin();

        if ($originValidation !== null) {
            return $originValidation;
        }

        $payload = $this->payload($request);
        $locale = $this->normalizeLocale($payload['locale'] ?? null);
        $login = sanitize_user($this->stringValue($payload['login'] ?? null), true);
        $key = trim($this->stringValue($payload['key'] ?? null));
        $password = $this->stringValue($payload['password'] ?? null);

        if ($login === '' || $key === '' || $password === '') {
            return $this->error('invalid_request', 'Login, key, and password are required.', 400);
        }

        if (strlen($login) > 191 || strlen($key) > 255) {
            return $this->error('invalid_request', 'Reset request is invalid.', 400);
        }

        if (trim($password) === '') {
            return $this->error('password_invalid', $this->passwordValidationMessage($locale), 400);
        }

        if (strlen($password) < 8 || strlen($password) > 256) {
            return $this->error('password_invalid', $this->passwordValidationMessage($locale), 400);
        }

        $user = check_password_reset_key($key, $login);

        if (! $user instanceof WP_User || ! $user->exists()) {
            return $this->error('invalid_reset_link', $this->invalidResetLinkMessage($locale), 400);
        }

        reset_password($user, $password);

        return $this->success(
            [
                'message' => $this->resetPasswordSuccessMessage($locale),
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
            $user = $this->userForIdentifier($identifier);

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

    private function userForIdentifier(string $identifier): ?WP_User
    {
        if (is_email($identifier)) {
            $user = get_user_by('email', $identifier);

            return $user instanceof WP_User && $user->exists() ? $user : null;
        }

        $user = get_user_by('login', $identifier);

        return $user instanceof WP_User && $user->exists() ? $user : null;
    }

    private function sendPasswordResetEmail(WP_User $user, string $locale): void
    {
        $resetKey = get_password_reset_key($user);

        if (! is_string($resetKey) || $resetKey === '') {
            return;
        }

        $resetUrl = $this->buildPasswordResetUrl($locale, (string) $user->user_login, $resetKey);
        $subject = $locale === 'en'
            ? 'Word Covenant Ministry password reset'
            : 'Word Covenant Ministry 비밀번호 재설정';
        $message = $locale === 'en'
            ? "A password reset was requested for your account.\n\nOpen this link to set a new password:\n{$resetUrl}\n\nIf you did not request this reset, you can ignore this email."
            : "계정의 비밀번호 재설정이 요청되었습니다.\n\n아래 링크를 열어 새 비밀번호를 설정해 주세요.\n{$resetUrl}\n\n직접 요청하지 않았다면 이 메일을 무시하셔도 됩니다.";

        wp_mail(
            (string) $user->user_email,
            $subject,
            $message
        );
    }

    private function buildPasswordResetUrl(string $locale, string $login, string $key): string
    {
        $frontendBaseUrl = $this->frontendBaseUrl();

        return add_query_arg(
            [
                'key' => rawurlencode($key),
                'login' => rawurlencode($login),
            ],
            trailingslashit($frontendBaseUrl) . ltrim($locale . '/reset-password', '/')
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

    private function normalizeLocale(mixed $value): string
    {
        return is_string($value) && strtolower($value) === 'en' ? 'en' : 'ko';
    }

    private function forgotPasswordSuccessMessage(string $locale): string
    {
        return $locale === 'en'
            ? 'If an account matches the information provided, password reset instructions have been sent.'
            : '입력한 정보와 일치하는 계정이 있다면 비밀번호 재설정 안내를 보냈습니다.';
    }

    private function invalidResetLinkMessage(string $locale): string
    {
        return $locale === 'en'
            ? 'The password reset link is invalid or has expired.'
            : '비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.';
    }

    private function resetPasswordSuccessMessage(string $locale): string
    {
        return $locale === 'en'
            ? 'Your password has been reset. Please log in with your new password.'
            : '비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해 주세요.';
    }

    private function passwordValidationMessage(string $locale): string
    {
        return $locale === 'en'
            ? 'Password must be between 8 and 256 characters and cannot be blank.'
            : '비밀번호는 8자 이상 256자 이하이며 공백만으로 구성될 수 없습니다.';
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
