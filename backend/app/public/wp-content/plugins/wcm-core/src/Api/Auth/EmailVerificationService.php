<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

use WP_Error;
use WP_User;

final class EmailVerificationService
{
    public function __construct(
        private readonly AuthFrontendUrlBuilder $urlBuilder = new AuthFrontendUrlBuilder()
    ) {
    }

    public function requiresVerification(WP_User $user): bool
    {
        return (string) get_user_meta($user->ID, AuthConfig::META_REQUIRES_EMAIL_VERIFICATION, true) === '1';
    }

    public function isVerified(WP_User $user): bool
    {
        return trim((string) get_user_meta($user->ID, AuthConfig::META_EMAIL_VERIFIED_AT, true)) !== '';
    }

    /**
     * @return array{emailSent: bool}|WP_Error
     */
    public function issueToken(WP_User $user, string $locale): array|WP_Error
    {
        $randomToken = bin2hex(random_bytes(32));
        $rawToken = $user->ID . '.' . $randomToken;
        $tokenHash = hash('sha256', $rawToken);
        $expiresAt = gmdate('Y-m-d\TH:i:s\Z', time() + AuthConfig::EMAIL_VERIFICATION_TTL);
        $sentAt = AuthConfig::utcNow();

        if (! $this->storeMeta($user->ID, AuthConfig::META_EMAIL_VERIFICATION_TOKEN_HASH, $tokenHash)) {
            return $this->serverError('registration_failed', 'Verification token could not be stored.');
        }

        if (! $this->storeMeta($user->ID, AuthConfig::META_EMAIL_VERIFICATION_EXPIRES_AT, $expiresAt)) {
            return $this->serverError('registration_failed', 'Verification expiry could not be stored.');
        }

        if (! $this->storeMeta($user->ID, AuthConfig::META_EMAIL_VERIFICATION_SENT_AT, $sentAt)) {
            return $this->serverError('registration_failed', 'Verification sent timestamp could not be stored.');
        }

        $emailSent = wp_mail(
            (string) $user->user_email,
            $this->verificationSubject($locale),
            $this->verificationMessage($user, $locale, $rawToken)
        );

        return [
            'emailSent' => $emailSent,
        ];
    }

    /**
     * @return array{verified: bool, loginAllowed: bool}|WP_Error
     */
    public function verifyToken(string $rawToken): array|WP_Error
    {
        $parts = explode('.', $rawToken, 2);

        if (count($parts) !== 2) {
            return $this->invalidTokenError();
        }

        $userId = absint($parts[0]);
        $randomToken = trim($parts[1]);

        if ($userId < 1 || $randomToken === '') {
            return $this->invalidTokenError();
        }

        $user = get_user_by('id', $userId);

        if (! $user instanceof WP_User || ! $user->exists()) {
            return $this->invalidTokenError();
        }

        $storedHash = trim((string) get_user_meta($userId, AuthConfig::META_EMAIL_VERIFICATION_TOKEN_HASH, true));
        $expiresAt = trim((string) get_user_meta($userId, AuthConfig::META_EMAIL_VERIFICATION_EXPIRES_AT, true));

        if ($storedHash === '' || $expiresAt === '') {
            return $this->invalidTokenError();
        }

        $expiryTimestamp = strtotime($expiresAt);

        if (! is_int($expiryTimestamp) || $expiryTimestamp < time()) {
            return $this->invalidTokenError();
        }

        $calculatedHash = hash('sha256', $rawToken);

        if (! hash_equals($storedHash, $calculatedHash)) {
            return $this->invalidTokenError();
        }

        if (! $this->storeMeta($userId, AuthConfig::META_EMAIL_VERIFIED_AT, AuthConfig::utcNow())) {
            return $this->serverError('verification_failed', 'Verification state could not be stored.');
        }

        delete_user_meta($userId, AuthConfig::META_EMAIL_VERIFICATION_TOKEN_HASH);
        delete_user_meta($userId, AuthConfig::META_EMAIL_VERIFICATION_EXPIRES_AT);

        return [
            'verified' => true,
            'loginAllowed' => true,
        ];
    }

    private function verificationSubject(string $locale): string
    {
        return $locale === 'en'
            ? 'Verify your Word Covenant Ministry email address'
            : 'Word Covenant Ministry 이메일 주소를 확인해 주세요';
    }

    private function verificationMessage(WP_User $user, string $locale, string $rawToken): string
    {
        $verifyUrl = $this->urlBuilder->verifyEmailUrl($locale, $rawToken);

        if ($locale === 'en') {
            return "Welcome to Word Covenant Ministry.\n\nPlease verify your email address by opening the link below within 24 hours:\n{$verifyUrl}\n\nIf you did not request this account, you can ignore this email.\n\nWord Covenant Ministry will not ask you to reply with your password by email.";
        }

        return "Word Covenant Ministry 계정 등록이 요청되었습니다.\n\n아래 링크를 24시간 이내에 열어 이메일 주소를 확인해 주세요:\n{$verifyUrl}\n\n직접 요청하지 않았다면 이 메일을 무시하셔도 됩니다.\n\nWord Covenant Ministry는 이메일로 비밀번호를 보내 달라고 요청하지 않습니다.";
    }

    private function invalidTokenError(): WP_Error
    {
        return new WP_Error(
            'verification_invalid_or_expired',
            'The verification link is invalid or has expired.',
            ['status' => 400]
        );
    }

    private function serverError(string $code, string $message): WP_Error
    {
        return new WP_Error($code, $message, ['status' => 500]);
    }

    private function storeMeta(int $userId, string $key, string $value): bool
    {
        return update_user_meta($userId, $key, $value) !== false;
    }
}
