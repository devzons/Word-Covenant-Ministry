<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class SourceFileValidator
{
    private const RECOMMENDED_ENCODING = 'UTF-8';

    /**
     * @var string[]
     */
    private const ALLOWED_FORMATS = [
        'tsv',
        'csv',
        'xml',
        'step_txt',
    ];

    /**
     * @var array<string, string[]>
     */
    private const REQUIRED_HEADERS_BY_SOURCE = [
        OriginalWordOccurrence::SOURCE_STEP_TAHOT => [
            'Eng (Heb) Ref & Type',
            'Hebrew',
            'Transliteration',
            'Translation',
            'dStrongs',
            'Grammar',
            'Meaning Variants',
            'Spelling Variants',
            'Root dStrong+Instance',
            'Alternative Strongs+Instance',
            'Conjoin word',
            'Expanded Strong tags',
        ],
        OriginalWordOccurrence::SOURCE_STEP_TAGNT => [
            'Word & Type',
            'Greek',
            'English translation',
            'dStrongs = Grammar',
            'Dictionary form = Gloss',
            'editions',
            'Meaning variants',
            'Spelling variants',
            'Spanish translation',
            'Sub-meaning',
            'Conjoin word',
            'sStrong+Instance',
            'Alt Strongs',
        ],
    ];

    /**
     * @var array<string, string>
     */
    private const REQUIRED_FILE_PREFIX_BY_SOURCE = [
        OriginalWordOccurrence::SOURCE_STEP_TAHOT => 'TAHOT ',
        OriginalWordOccurrence::SOURCE_STEP_TAGNT => 'TAGNT ',
    ];

    /**
     * @var array<string, string[]>
     */
    private const ALLOWED_PATH_PARTS_BY_SOURCE = [
        OriginalWordOccurrence::SOURCE_STEP_TAHOT => [
            'docs/data-sources/STEP/TAHOT/',
            '/docs/data-sources/STEP/TAHOT/',
            'docs/data-sources/STEPBible-Data/Translators Amalgamated OT+NT/',
            '/docs/data-sources/STEPBible-Data/Translators Amalgamated OT+NT/',
        ],
        OriginalWordOccurrence::SOURCE_STEP_TAGNT => [
            'docs/data-sources/STEP/TAGNT/',
            '/docs/data-sources/STEP/TAGNT/',
            'docs/data-sources/STEPBible-Data/Translators Amalgamated OT+NT/',
            '/docs/data-sources/STEPBible-Data/Translators Amalgamated OT+NT/',
        ],
    ];

    /**
     * @return OriginalLanguageImportIssue[]
     */
    public function validate(OriginalLanguageSourceMetadata $metadata): array
    {
        $issues = [];
        $format = strtolower(trim($metadata->format));

        if (! in_array($metadata->sourceDataset, OriginalWordOccurrence::ALLOWED_SOURCE_DATASETS, true)) {
            $issues[] = $this->error(
                'invalid_source_dataset',
                'Source dataset is not allowed.',
                ['source_dataset' => $metadata->sourceDataset]
            );
        }

        if (trim($metadata->sourceFile) === '') {
            $issues[] = $this->error('source_file_missing', 'Source file name is required.');
        }

        if (trim($metadata->sourcePath) === '') {
            $issues[] = $this->error('source_path_missing', 'Source path is required.');
        }

        $issues = array_merge($issues, $this->validateApprovedSourcePath($metadata));

        if (trim($metadata->checksum) === '') {
            $issues[] = $this->error('checksum_missing', 'Source checksum is required.');
        }

        if (trim($metadata->sourceVersion) === '') {
            $issues[] = $this->error('source_version_missing', 'Source version or pinned commit is required.');
        }

        if (trim($metadata->sourceUrl) === '') {
            $issues[] = $this->error('source_url_missing', 'Source URL is required.');
        }

        if (strtoupper(trim($metadata->encoding)) !== self::RECOMMENDED_ENCODING) {
            $issues[] = $this->warning(
                'unexpected_encoding',
                'Source encoding is not the recommended UTF-8 encoding.',
                ['encoding' => $metadata->encoding]
            );
        }

        if (! in_array($format, self::ALLOWED_FORMATS, true)) {
            $issues[] = $this->error(
                'invalid_format',
                'Source format must be tsv, csv, xml, or step_txt.',
                ['format' => $metadata->format]
            );
        }

        if (in_array($format, ['tsv', 'csv', 'step_txt'], true) && $metadata->headers === []) {
            $issues[] = $this->error(
                'headers_missing',
                'Delimited source files must include headers.',
                ['format' => $format]
            );
        }

        $issues = array_merge($issues, $this->validateRequiredHeaders($metadata));

        if ($metadata->sampleRows === []) {
            $issues[] = $this->warning('sample_rows_missing', 'Source sample rows are missing.');
        }

        if ($metadata->rowCountEstimate === null) {
            $issues[] = $this->warning('row_count_missing', 'Source row count estimate is missing.');
        } elseif ($metadata->rowCountEstimate === 0) {
            $issues[] = $this->error('row_count_empty', 'Source row count estimate is zero.');
        }

        return $issues;
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function validateApprovedSourcePath(OriginalLanguageSourceMetadata $metadata): array
    {
        $issues = [];
        $sourcePath = str_replace('\\', '/', $metadata->sourcePath);
        $sourceFile = $metadata->sourceFile;

        $requiredPrefix = self::REQUIRED_FILE_PREFIX_BY_SOURCE[$metadata->sourceDataset] ?? null;
        if ($requiredPrefix !== null && ! str_starts_with($sourceFile, $requiredPrefix)) {
            $issues[] = $this->error(
                'source_file_name_mismatch',
                sprintf('Source file name must start with %s.', trim($requiredPrefix)),
                [
                    'source_dataset' => $metadata->sourceDataset,
                    'source_file' => $metadata->sourceFile,
                ]
            );
        }

        $allowedPathParts = self::ALLOWED_PATH_PARTS_BY_SOURCE[$metadata->sourceDataset] ?? [];
        if ($allowedPathParts !== [] && ! $this->pathContainsAny($sourcePath, $allowedPathParts)) {
            $issues[] = $this->error(
                'source_path_not_approved',
                'Source path is not in an approved STEP source location.',
                [
                    'source_dataset' => $metadata->sourceDataset,
                    'source_path' => $metadata->sourcePath,
                ]
            );
        }

        return $issues;
    }

    /**
     * @param string[] $needles
     */
    private function pathContainsAny(string $path, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($path, $needle)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function validateRequiredHeaders(OriginalLanguageSourceMetadata $metadata): array
    {
        $requiredHeaders = self::REQUIRED_HEADERS_BY_SOURCE[$metadata->sourceDataset] ?? [];
        if ($requiredHeaders === []) {
            return [];
        }

        $issues = [];
        $normalizedHeaders = array_map(
            static fn (string $header): string => self::normalizeHeader($header),
            $metadata->headers
        );

        foreach ($requiredHeaders as $requiredHeader) {
            if (! in_array(self::normalizeHeader($requiredHeader), $normalizedHeaders, true)) {
                $issues[] = $this->error(
                    'required_header_missing',
                    sprintf('Required source header is missing: %s.', $requiredHeader),
                    [
                        'source_dataset' => $metadata->sourceDataset,
                        'required_header' => $requiredHeader,
                    ]
                );
            }
        }

        return $issues;
    }

    private static function normalizeHeader(string $header): string
    {
        $header = str_replace("\xEF\xBB\xBF", '', $header);
        $header = preg_replace('/\s+/', ' ', trim($header));

        return strtolower((string) $header);
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
