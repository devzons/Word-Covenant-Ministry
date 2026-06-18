<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

final class SourceLicenseValidator
{
    public const STATUS_APPROVED = 'approved';
    public const STATUS_PENDING = 'pending';
    public const STATUS_REJECTED = 'rejected';

    /**
     * @var string[]
     */
    private const ALLOWED_LICENSE_STATUSES = [
        self::STATUS_APPROVED,
        self::STATUS_PENDING,
        self::STATUS_REJECTED,
    ];

    /**
     * @return OriginalLanguageImportIssue[]
     */
    public function validate(OriginalLanguageSourceMetadata $metadata): array
    {
        $issues = [];
        $licenseStatus = strtolower(trim($metadata->licenseStatus));
        $attribution = trim($metadata->attribution);

        if ($licenseStatus === '') {
            $issues[] = $this->error('license_missing', 'Source license status is required.');
        } elseif (! in_array($licenseStatus, self::ALLOWED_LICENSE_STATUSES, true)) {
            $issues[] = $this->warning(
                'license_pending',
                'Source license status is not approved, pending, or rejected.',
                ['license_status' => $metadata->licenseStatus]
            );
        } elseif ($licenseStatus === self::STATUS_REJECTED) {
            $issues[] = $this->error('license_rejected', 'Source license status is rejected.');
        } elseif ($licenseStatus === self::STATUS_PENDING) {
            $issues[] = $this->warning('license_pending', 'Source license status is pending.');
        }

        if ($attribution === '') {
            $issues[] = $this->error('attribution_missing', 'Source attribution is required.');
        }

        return $issues;
    }

    /**
     * @param array<string, mixed> $context
     */
    private function error(string $code, string $message, array $context = []): OriginalLanguageImportIssue
    {
        return new OriginalLanguageImportIssue(
            OriginalLanguageImportIssue::SEVERITY_ERROR,
            $code,
            $message,
            $context
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    private function warning(string $code, string $message, array $context = []): OriginalLanguageImportIssue
    {
        return new OriginalLanguageImportIssue(
            OriginalLanguageImportIssue::SEVERITY_WARNING,
            $code,
            $message,
            $context
        );
    }
}
