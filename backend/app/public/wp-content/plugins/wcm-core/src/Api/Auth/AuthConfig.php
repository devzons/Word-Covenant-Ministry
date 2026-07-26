<?php

declare(strict_types=1);

namespace WCM\Api\Auth;

final class AuthConfig
{
    public const TERMS_VERSION = '1.0';
    public const PRIVACY_VERSION = '1.0';
    public const DEFAULT_ROLE = 'subscriber';

    public const EMAIL_VERIFICATION_TTL = 86400;

    public const MIN_USERNAME_LENGTH = 3;
    public const MAX_USERNAME_LENGTH = 60;
    public const MAX_EMAIL_LENGTH = 100;
    public const MAX_DISPLAY_NAME_LENGTH = 120;
    public const MIN_PASSWORD_LENGTH = 12;
    public const MAX_PASSWORD_LENGTH = 256;

    public const META_REQUIRES_EMAIL_VERIFICATION = 'wcm_requires_email_verification';
    public const META_EMAIL_VERIFIED_AT = 'wcm_email_verified_at';
    public const META_EMAIL_VERIFICATION_TOKEN_HASH = 'wcm_email_verification_token_hash';
    public const META_EMAIL_VERIFICATION_EXPIRES_AT = 'wcm_email_verification_expires_at';
    public const META_EMAIL_VERIFICATION_SENT_AT = 'wcm_email_verification_sent_at';
    public const META_TERMS_ACCEPTED_VERSION = 'wcm_terms_accepted_version';
    public const META_TERMS_ACCEPTED_AT = 'wcm_terms_accepted_at';
    public const META_PRIVACY_ACCEPTED_VERSION = 'wcm_privacy_accepted_version';
    public const META_PRIVACY_ACCEPTED_AT = 'wcm_privacy_accepted_at';

    public const REGISTRATION_IP_LIMIT = 5;
    public const REGISTRATION_WINDOW = 3600;
    public const RESEND_IP_LIMIT = 5;
    public const RESEND_EMAIL_LIMIT = 5;
    public const RESEND_WINDOW = 3600;
    public const RESEND_COOLDOWN = 60;
    public const VERIFY_IP_LIMIT = 20;
    public const VERIFY_WINDOW = 3600;

    public static function utcNow(): string
    {
        return gmdate('Y-m-d\TH:i:s\Z');
    }
}
