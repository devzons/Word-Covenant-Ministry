<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

use WP_Error;
use WP_User;

final class RegistrationService
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService = new EmailVerificationService()
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     * @return array{status: string, emailSent: bool}|WP_Error
     */
    public function register(array $payload, string $locale): array|WP_Error
    {
        $email = $this->validatedEmail($payload['email'] ?? null);

        if ($email instanceof WP_Error) {
            return $email;
        }

        $username = $this->validatedUsername($payload['username'] ?? null);

        if ($username instanceof WP_Error) {
            return $username;
        }

        $displayName = $this->validatedDisplayName($payload['displayName'] ?? null);

        if ($displayName instanceof WP_Error) {
            return $displayName;
        }

        $password = $this->validatedPassword(
            $payload['password'] ?? null,
            $payload['passwordConfirmation'] ?? null
        );

        if ($password instanceof WP_Error) {
            return $password;
        }

        if (($payload['acceptTerms'] ?? false) !== true) {
            return $this->validationError('registration_terms_required', 'You must accept the Terms of Service.');
        }

        if (($payload['acceptPrivacy'] ?? false) !== true) {
            return $this->validationError('registration_privacy_required', 'You must accept the Privacy Policy.');
        }

        if (email_exists($email)) {
            return $this->validationError('registration_email_exists', 'That email address is already in use.');
        }

        if (username_exists($username)) {
            return $this->validationError('registration_username_exists', 'That username is already in use.');
        }

        $role = $this->registrationRole();
        $userId = wp_insert_user(
            [
                'display_name' => $displayName,
                'role' => $role,
                'user_email' => $email,
                'user_login' => $username,
                'user_pass' => $password,
            ]
        );

        if (is_wp_error($userId)) {
            return $this->serverError('registration_failed', 'The account could not be created.');
        }

        $userId = (int) $userId;
        $user = get_user_by('id', $userId);

        if (! $user instanceof WP_User || ! $user->exists()) {
            $this->rollbackUser($userId);

            return $this->serverError('registration_failed', 'The account could not be created.');
        }

        $acceptedAt = AuthConfig::utcNow();

        if (! $this->storeMeta($userId, AuthConfig::META_REQUIRES_EMAIL_VERIFICATION, '1')
            || ! $this->storeMeta($userId, AuthConfig::META_TERMS_ACCEPTED_VERSION, AuthConfig::TERMS_VERSION)
            || ! $this->storeMeta($userId, AuthConfig::META_TERMS_ACCEPTED_AT, $acceptedAt)
            || ! $this->storeMeta($userId, AuthConfig::META_PRIVACY_ACCEPTED_VERSION, AuthConfig::PRIVACY_VERSION)
            || ! $this->storeMeta($userId, AuthConfig::META_PRIVACY_ACCEPTED_AT, $acceptedAt)
        ) {
            $this->rollbackUser($userId);

            return $this->serverError('registration_failed', 'The account could not be initialized.');
        }

        delete_user_meta($userId, AuthConfig::META_EMAIL_VERIFIED_AT);

        $verificationResult = $this->emailVerificationService->issueToken($user, $locale);

        if ($verificationResult instanceof WP_Error) {
            $this->rollbackUser($userId);

            return $verificationResult;
        }

        return [
            'status' => 'verification_required',
            'emailSent' => (bool) $verificationResult['emailSent'],
        ];
    }

    /**
     * @return string|WP_Error
     */
    private function validatedEmail(mixed $value): string|WP_Error
    {
        $email = strtolower(trim(is_string($value) ? $value : ''));
        $email = sanitize_email($email);

        if ($email === '' || ! is_email($email) || strlen($email) > AuthConfig::MAX_EMAIL_LENGTH) {
            return $this->validationError('registration_invalid_email', 'A valid email address is required.');
        }

        return $email;
    }

    /**
     * @return string|WP_Error
     */
    private function validatedUsername(mixed $value): string|WP_Error
    {
        $rawUsername = trim(is_string($value) ? $value : '');
        $username = sanitize_user($rawUsername, true);

        if ($rawUsername === ''
            || $username === ''
            || $rawUsername !== $username
            || strlen($username) < AuthConfig::MIN_USERNAME_LENGTH
            || strlen($username) > AuthConfig::MAX_USERNAME_LENGTH
        ) {
            return $this->validationError(
                'registration_invalid_username',
                'Username must be 3 to 60 characters and use a valid WordPress login format.'
            );
        }

        return $username;
    }

    /**
     * @return string|WP_Error
     */
    private function validatedDisplayName(mixed $value): string|WP_Error
    {
        $displayName = trim(is_string($value) ? wp_strip_all_tags($value, true) : '');

        if ($displayName === '' || strlen($displayName) > AuthConfig::MAX_DISPLAY_NAME_LENGTH) {
            return $this->validationError(
                'registration_invalid_display_name',
                'Display name is required and must be a reasonable length.'
            );
        }

        return $displayName;
    }

    /**
     * @return string|WP_Error
     */
    private function validatedPassword(mixed $passwordValue, mixed $confirmationValue): string|WP_Error
    {
        $password = is_string($passwordValue) ? $passwordValue : '';
        $confirmation = is_string($confirmationValue) ? $confirmationValue : '';
        $length = function_exists('mb_strlen') ? mb_strlen($password) : strlen($password);

        if (trim($password) === '') {
            return $this->validationError(
                'registration_password_too_short',
                'Password must be at least 12 characters.'
            );
        }

        if ($length < AuthConfig::MIN_PASSWORD_LENGTH || $length > AuthConfig::MAX_PASSWORD_LENGTH) {
            return $this->validationError(
                'registration_password_too_short',
                'Password must be between 12 and 256 characters.'
            );
        }

        if ($password !== $confirmation) {
            return $this->validationError(
                'registration_password_mismatch',
                'Password confirmation does not match.'
            );
        }

        return $password;
    }

    private function registrationRole(): string
    {
        $role = sanitize_key((string) get_option('default_role', AuthConfig::DEFAULT_ROLE));

        return $role !== '' ? $role : AuthConfig::DEFAULT_ROLE;
    }

    private function storeMeta(int $userId, string $key, string $value): bool
    {
        return update_user_meta($userId, $key, $value) !== false;
    }

    private function rollbackUser(int $userId): void
    {
        if ($userId < 1) {
            return;
        }

        if (! function_exists('wp_delete_user')) {
            require_once ABSPATH . 'wp-admin/includes/user.php';
        }

        wp_delete_user($userId);
    }

    private function validationError(string $code, string $message): WP_Error
    {
        return new WP_Error($code, $message, ['status' => 400]);
    }

    private function serverError(string $code, string $message): WP_Error
    {
        return new WP_Error($code, $message, ['status' => 500]);
    }
}
