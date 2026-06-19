<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final readonly class OriginalLanguageSourceMetadata
{
    /**
     * @param string[] $headers
     * @param array<int, mixed> $sampleRows
     */
    public function __construct(
        public string $sourceDataset,
        public string $sourceFile,
        public string $sourcePath,
        public string $checksum,
        public string $encoding,
        public string $format,
        public string $licenseStatus,
        public string $attribution,
        public ?int $rowCountEstimate,
        public string $sourceVersion = '',
        public string $sourceUrl = '',
        public array $headers = [],
        public array $sampleRows = []
    ) {
        if (trim($this->sourceDataset) === '') {
            throw new InvalidArgumentException('Original language source dataset is required.');
        }

        if (trim($this->sourceFile) === '') {
            throw new InvalidArgumentException('Original language source file is required.');
        }

        if (trim($this->sourcePath) === '') {
            throw new InvalidArgumentException('Original language source path is required.');
        }

        if (trim($this->checksum) === '') {
            throw new InvalidArgumentException('Original language source checksum is required.');
        }

        if (trim($this->encoding) === '') {
            throw new InvalidArgumentException('Original language source encoding is required.');
        }

        if (trim($this->format) === '') {
            throw new InvalidArgumentException('Original language source format is required.');
        }

        if (trim($this->sourceVersion) === '') {
            throw new InvalidArgumentException('Original language source version is required.');
        }

        if (trim($this->sourceUrl) === '') {
            throw new InvalidArgumentException('Original language source URL is required.');
        }

        if ($this->rowCountEstimate !== null && $this->rowCountEstimate < 0) {
            throw new InvalidArgumentException('Original language source row count estimate cannot be negative.');
        }
    }

    /**
     * @return array{
     *     source_dataset: string,
     *     source_file: string,
     *     source_path: string,
     *     checksum: string,
     *     encoding: string,
     *     format: string,
     *     license_status: string,
     *     attribution: string,
     *     source_version: string,
     *     source_url: string,
     *     row_count_estimate: ?int,
     *     headers: string[],
     *     sample_rows: array<int, mixed>
     * }
     */
    public function toArray(): array
    {
        return [
            'source_dataset' => $this->sourceDataset,
            'source_file' => $this->sourceFile,
            'source_path' => $this->sourcePath,
            'checksum' => $this->checksum,
            'encoding' => $this->encoding,
            'format' => $this->format,
            'license_status' => $this->licenseStatus,
            'attribution' => $this->attribution,
            'source_version' => $this->sourceVersion,
            'source_url' => $this->sourceUrl,
            'row_count_estimate' => $this->rowCountEstimate,
            'headers' => $this->headers,
            'sample_rows' => $this->sampleRows,
        ];
    }
}
