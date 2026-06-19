<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalLanguageSourceInspector
{
    private const DEFAULT_ENCODING = 'UTF-8';
    private const SAMPLE_ROW_LIMIT = 5;
    private const READ_LENGTH = 8192;

    public function inspect(
        string $sourceDataset,
        string $sourcePath,
        string $licenseStatus = '',
        string $attribution = '',
        string $sourceVersion = '',
        string $sourceUrl = ''
    ): OriginalLanguageSourceMetadata {
        $sourceDataset = trim($sourceDataset);
        $sourcePath = trim($sourcePath);

        if (! $this->isAllowedSourceDataset($sourceDataset)) {
            throw new InvalidArgumentException('Original language source dataset is not allowed.');
        }

        if ($sourcePath === '') {
            throw new InvalidArgumentException('Original language source path is required.');
        }

        if (! file_exists($sourcePath)) {
            throw new InvalidArgumentException('Original language source file does not exist.');
        }

        if (! is_file($sourcePath)) {
            throw new InvalidArgumentException('Original language source path must be a file.');
        }

        if (! is_readable($sourcePath)) {
            throw new InvalidArgumentException('Original language source file is not readable.');
        }

        $checksum = hash_file('sha256', $sourcePath);
        if ($checksum === false) {
            throw new InvalidArgumentException('Original language source checksum could not be calculated.');
        }

        $format = $this->detectFormat($sourcePath, $sourceDataset);

        return new OriginalLanguageSourceMetadata(
            $sourceDataset,
            basename($sourcePath),
            $sourcePath,
            $checksum,
            self::DEFAULT_ENCODING,
            $format,
            trim($licenseStatus),
            trim($attribution),
            $this->estimateRowCount($sourcePath),
            trim($sourceVersion),
            trim($sourceUrl),
            $this->extractHeaders($sourcePath, $format, $sourceDataset),
            $this->extractSampleRows($sourcePath, $format, $sourceDataset)
        );
    }

    private function isAllowedSourceDataset(string $sourceDataset): bool
    {
        return in_array($sourceDataset, OriginalWordOccurrence::ALLOWED_SOURCE_DATASETS, true);
    }

    private function detectFormat(string $sourcePath, string $sourceDataset): string
    {
        $extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));

        return match ($extension) {
            'tsv' => 'tsv',
            'csv' => 'csv',
            'xml' => 'xml',
            'txt' => $this->isStepSourceDataset($sourceDataset) ? 'step_txt' : 'unknown',
            default => 'unknown',
        };
    }

    private function isStepSourceDataset(string $sourceDataset): bool
    {
        return in_array($sourceDataset, [
            OriginalWordOccurrence::SOURCE_STEP_TAHOT,
            OriginalWordOccurrence::SOURCE_STEP_TAGNT,
        ], true);
    }

    /**
     * @return string[]
     */
    private function expectedHeaderFirstCells(string $sourceDataset): array
    {
        return match ($sourceDataset) {
            OriginalWordOccurrence::SOURCE_STEP_TAHOT => ['Eng (Heb) Ref & Type'],
            OriginalWordOccurrence::SOURCE_STEP_TAGNT => ['Word & Type'],
            default => [],
        };
    }

    /**
     * @return string[]
     */
    private function expectedDataReferencePrefixes(string $sourceDataset): array
    {
        return match ($sourceDataset) {
            OriginalWordOccurrence::SOURCE_STEP_TAHOT => [
                'Gen.', 'Exo.', 'Lev.', 'Num.', 'Deu.', 'Jos.', 'Jdg.', 'Rut.', '1Sa.', '2Sa.',
                '1Ki.', '2Ki.', '1Ch.', '2Ch.', 'Ezr.', 'Neh.', 'Est.', 'Job.', 'Psa.', 'Pro.',
                'Ecc.', 'Sng.', 'Isa.', 'Jer.', 'Lam.', 'Ezk.', 'Dan.', 'Hos.', 'Jol.', 'Amo.',
                'Oba.', 'Jon.', 'Mic.', 'Nam.', 'Hab.', 'Zep.', 'Hag.', 'Zec.', 'Mal.',
            ],
            OriginalWordOccurrence::SOURCE_STEP_TAGNT => [
                'Mat.', 'Mrk.', 'Luk.', 'Jhn.', 'Act.', 'Rom.', '1Co.', '2Co.', 'Gal.', 'Eph.',
                'Php.', 'Col.', '1Th.', '2Th.', '1Ti.', '2Ti.', 'Tit.', 'Phm.', 'Heb.', 'Jas.',
                '1Pe.', '2Pe.', '1Jn.', '2Jn.', '3Jn.', 'Jud.', 'Rev.',
            ],
            default => [],
        };
    }

    /**
     * @param string[] $prefixes
     */
    private function lineStartsWithAny(string $line, array $prefixes): bool
    {
        foreach ($prefixes as $prefix) {
            if (str_starts_with($line, $prefix)) {
                return true;
            }
        }

        return false;
    }

    private function isExpectedHeaderLine(string $line, string $sourceDataset): bool
    {
        $headers = $this->parseDelimitedLine($line, "\t");
        $firstCell = $headers[0] ?? '';

        return in_array($firstCell, $this->expectedHeaderFirstCells($sourceDataset), true);
    }

    /**
     * @return string[]
     */
    private function extractHeaders(string $sourcePath, string $format, string $sourceDataset): array
    {
        if ($format === 'step_txt') {
            return $this->extractStepHeaders($sourcePath, $sourceDataset);
        }

        $firstLine = $this->readFirstNonEmptyLine($sourcePath);
        if ($firstLine === null) {
            return [];
        }

        return match ($format) {
            'tsv' => $this->parseDelimitedLine($firstLine, "\t"),
            'csv' => $this->parseDelimitedLine($firstLine, ','),
            'xml' => $this->extractXmlTags($firstLine),
            default => [],
        };
    }

    /**
     * @return array<int, mixed>
     */
    private function extractSampleRows(string $sourcePath, string $format, string $sourceDataset): array
    {
        return match ($format) {
            'step_txt' => $this->extractStepSampleRows($sourcePath, $sourceDataset),
            'tsv' => $this->extractDelimitedSampleRows($sourcePath, "\t"),
            'csv' => $this->extractDelimitedSampleRows($sourcePath, ','),
            'xml' => $this->extractTextSampleRows($sourcePath),
            default => [],
        };
    }

    /**
     * @return string[]
     */
    private function extractStepHeaders(string $sourcePath, string $sourceDataset): array
    {
        $headerLine = $this->readStepHeaderLine($sourcePath, $sourceDataset);
        if ($headerLine === null) {
            return [];
        }

        return $this->parseDelimitedLine($headerLine, "\t");
    }

    /**
     * @return array<int, string[]>
     */
    private function extractStepSampleRows(string $sourcePath, string $sourceDataset): array
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for STEP sample inspection.');
        }

        $samples = [];
        $seenHeader = false;

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                if (! $seenHeader) {
                    $seenHeader = $this->isExpectedHeaderLine($line, $sourceDataset);
                    continue;
                }

                if (! $this->isStepDataRow($line, $sourceDataset)) {
                    continue;
                }

                $samples[] = $this->parseDelimitedLine($line, "\t");
                if (count($samples) >= self::SAMPLE_ROW_LIMIT) {
                    break;
                }
            }
        } finally {
            fclose($handle);
        }

        return $samples;
    }

    private function readStepHeaderLine(string $sourcePath, string $sourceDataset): ?string
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for STEP header inspection.');
        }

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                if ($this->isExpectedHeaderLine($line, $sourceDataset)) {
                    return $line;
                }
            }
        } finally {
            fclose($handle);
        }

        return null;
    }

    private function isStepDataRow(string $line, string $sourceDataset): bool
    {
        if ($line === '' || str_starts_with($line, '#')) {
            return false;
        }

        return $this->lineStartsWithAny($line, $this->expectedDataReferencePrefixes($sourceDataset));
    }

    private function estimateRowCount(string $sourcePath): int
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for row counting.');
        }

        $count = 0;
        $lastCharacter = '';
        try {
            while (! feof($handle)) {
                $chunk = fread($handle, self::READ_LENGTH);
                if ($chunk === false) {
                    throw new InvalidArgumentException('Original language source file could not be read for row counting.');
                }

                if ($chunk !== '') {
                    $lastCharacter = substr($chunk, -1);
                }

                $count += substr_count($chunk, "\n");
            }
        } finally {
            fclose($handle);
        }

        if ($lastCharacter !== '' && $lastCharacter !== "\n") {
            $count++;
        }

        return $count;
    }

    private function readFirstNonEmptyLine(string $sourcePath): ?string
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for header inspection.');
        }

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line !== '') {
                    return $line;
                }
            }
        } finally {
            fclose($handle);
        }

        return null;
    }

    /**
     * @return string[]
     */
    private function parseDelimitedLine(string $line, string $delimiter): array
    {
        $values = str_getcsv($line, $delimiter, '"', '');

        return array_values(array_map(
            static fn (mixed $value): string => trim(str_replace("\xEF\xBB\xBF", '', (string) $value)),
            $values
        ));
    }

    /**
     * @return string[]
     */
    private function extractXmlTags(string $line): array
    {
        preg_match_all('/<([A-Za-z_][A-Za-z0-9_.:-]*)\b/', $line, $matches);

        $tags = [];
        foreach ($matches[1] ?? [] as $tag) {
            if ($tag === '?xml') {
                continue;
            }

            $tags[] = $tag;
        }

        return array_values(array_unique($tags));
    }

    /**
     * @return array<int, string[]>
     */
    private function extractDelimitedSampleRows(string $sourcePath, string $delimiter): array
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for sample inspection.');
        }

        $samples = [];
        $seenHeader = false;

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                if (! $seenHeader) {
                    $seenHeader = true;
                    continue;
                }

                $samples[] = $this->parseDelimitedLine($line, $delimiter);
                if (count($samples) >= self::SAMPLE_ROW_LIMIT) {
                    break;
                }
            }
        } finally {
            fclose($handle);
        }

        return $samples;
    }

    /**
     * @return string[]
     */
    private function extractTextSampleRows(string $sourcePath): array
    {
        $handle = fopen($sourcePath, 'rb');
        if ($handle === false) {
            throw new InvalidArgumentException('Original language source file could not be opened for sample inspection.');
        }

        $samples = [];

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                $samples[] = $line;
                if (count($samples) >= self::SAMPLE_ROW_LIMIT) {
                    break;
                }
            }
        } finally {
            fclose($handle);
        }

        return $samples;
    }
}
