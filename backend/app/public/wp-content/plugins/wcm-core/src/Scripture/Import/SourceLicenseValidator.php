<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

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

        if ($this->isStepSource($metadata)) {
            $issues = array_merge($issues, $this->validateStepLicense($metadata, $licenseStatus, $attribution));
        }

        return $issues;
    }

    private function isStepSource(OriginalLanguageSourceMetadata $metadata): bool
    {
        return in_array($metadata->sourceDataset, [
            OriginalWordOccurrence::SOURCE_STEP_TAHOT,
            OriginalWordOccurrence::SOURCE_STEP_TAGNT,
        ], true);
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function validateStepLicense(
        OriginalLanguageSourceMetadata $metadata,
        string $licenseStatus,
        string $attribution
    ): array {
        $issues = [];
        $attributionLower = strtolower($attribution);
        $sourceUrlLower = strtolower(trim($metadata->sourceUrl));

        if ($licenseStatus !== self::STATUS_APPROVED) {
            $issues[] = $this->error(
                'step_license_not_approved',
                'STEP source license status must be approved before the source gate can pass.',
                ['license_status' => $metadata->licenseStatus]
            );
        }

        if (! str_contains($attributionLower, 'cc by 4.0')) {
            $issues[] = $this->error(
                'step_license_text_missing',
                'STEP attribution must include CC BY 4.0.',
                ['source_dataset' => $metadata->sourceDataset]
            );
        }

        if (! str_contains($attributionLower, 'step bible') && ! str_contains($attributionLower, 'stepbible.org')) {
            $issues[] = $this->error(
                'step_attribution_missing',
                'STEP attribution must credit STEP Bible or STEPBible.org.',
                ['source_dataset' => $metadata->sourceDataset]
            );
        }

        if (! str_contains($attributionLower, 'tyndale house cambridge')) {
            $issues[] = $this->error(
                'tyndale_attribution_missing',
                'STEP attribution must note the Tyndale House Cambridge basis.',
                ['source_dataset' => $metadata->sourceDataset]
            );
        }

        if (! str_contains($sourceUrlLower, 'github.com/stepbible/stepbible-data')) {
            $issues[] = $this->error(
                'step_source_url_missing',
                'STEP source URL must point to the STEPBible-Data repository.',
                [
                    'source_dataset' => $metadata->sourceDataset,
                    'source_url' => $metadata->sourceUrl,
                ]
            );
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
