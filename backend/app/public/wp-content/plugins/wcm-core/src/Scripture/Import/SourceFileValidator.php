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

        if (trim($metadata->checksum) === '') {
            $issues[] = $this->error('checksum_missing', 'Source checksum is required.');
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
                'Source format must be tsv, csv, or xml.',
                ['format' => $metadata->format]
            );
        }

        if (in_array($format, ['tsv', 'csv'], true) && $metadata->headers === []) {
            $issues[] = $this->error(
                'headers_missing',
                'Delimited source files must include headers.',
                ['format' => $format]
            );
        }

        if ($metadata->sampleRows === []) {
            $issues[] = $this->warning('sample_rows_missing', 'Source sample rows are missing.');
        }

        if ($metadata->rowCountEstimate === null) {
            $issues[] = $this->warning('row_count_missing', 'Source row count estimate is missing.');
        } elseif ($metadata->rowCountEstimate === 0) {
            $issues[] = $this->error('row_count_empty', 'Source row count estimate is zero.');
        }

        if (in_array($metadata->sourceDataset, OriginalWordOccurrence::ALLOWED_SOURCE_DATASETS, true)) {
            $issues[] = $this->warning(
                'source_header_map_not_finalized',
                sprintf('%s header map is not finalized.', $metadata->sourceDataset),
                ['source_dataset' => $metadata->sourceDataset]
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
