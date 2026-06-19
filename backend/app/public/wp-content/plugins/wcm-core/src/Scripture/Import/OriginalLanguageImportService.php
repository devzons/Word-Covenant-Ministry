<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use RuntimeException;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalLanguageImportService
{
    private const READ_LENGTH = 131072;

    /**
     * @var array<string, array{book_code: string, chapter: int, verse: int}>
     */
    private const DEFAULT_EXCEPTION_MAP = [
        '1Ch.22.17' => ['book_code' => '1Ch', 'chapter' => 22, 'verse' => 16],
        '1Ch.22.18' => ['book_code' => '1Ch', 'chapter' => 22, 'verse' => 17],
        '1Ch.22.19' => ['book_code' => '1Ch', 'chapter' => 22, 'verse' => 18],
        'Rev.12.18' => ['book_code' => 'Rev', 'chapter' => 13, 'verse' => 1],
    ];

    /**
     * @var OriginalLanguageNormalizerInterface[]
     */
    private array $normalizers;

    /**
     * @param string[] $canonicalReferences Reference keys like Gen.1.1.
     * @param OriginalLanguageNormalizerInterface[] $normalizers
     */
    public function __construct(
        private array $canonicalReferences = [],
        private ?OriginalLanguageSourceInspector $sourceInspector = null,
        private ?SourceFileValidator $sourceFileValidator = null,
        private ?SourceLicenseValidator $sourceLicenseValidator = null,
        private ?OriginalLanguageImportValidator $importValidator = null,
        array $normalizers = []
    ) {
        $this->sourceInspector ??= new OriginalLanguageSourceInspector();
        $this->sourceFileValidator ??= new SourceFileValidator();
        $this->sourceLicenseValidator ??= new SourceLicenseValidator();
        $this->importValidator ??= new OriginalLanguageImportValidator(
            hebrewVersificationResolved: true,
            greekEditionFilteringResolved: true
        );

        $this->normalizers = $normalizers === []
            ? [new StepTahotNormalizer(), new StepTagntNormalizer()]
            : $normalizers;

        foreach ($this->normalizers as $normalizer) {
            if (! $normalizer instanceof OriginalLanguageNormalizerInterface) {
                throw new InvalidArgumentException('Original language normalizers must implement OriginalLanguageNormalizerInterface.');
            }
        }
    }

    /**
     * @param array<string, array{book_code: string, chapter: int, verse: int}> $exceptionMap
     */
    public function dryRun(
        string $sourceDataset,
        string $sourcePath,
        string $licenseStatus,
        string $attribution,
        ?int $maxRows = null,
        array $exceptionMap = [],
        bool $dryRun = true,
        string $sourceVersion = '',
        string $sourceUrl = ''
    ): OriginalLanguageImportReport {
        if (! $dryRun) {
            throw new InvalidArgumentException('Original language import service only supports dry-run mode at this phase.');
        }

        if ($maxRows !== null && $maxRows < 1) {
            throw new InvalidArgumentException('Original language dry-run maxRows must be null or greater than zero.');
        }

        $metadata = $this->sourceInspector->inspect(
            $sourceDataset,
            $sourcePath,
            $licenseStatus,
            $attribution,
            $sourceVersion,
            $sourceUrl
        );

        $report = new OriginalLanguageImportReport(
            sourceDataset: $metadata->sourceDataset,
            sourceFile: $metadata->sourceFile,
            licenseStatus: $metadata->licenseStatus,
            sourceVersion: $metadata->sourceVersion,
            sourceUrl: $metadata->sourceUrl,
            checksum: $metadata->checksum
        );

        foreach ($this->sourceFileValidator->validate($metadata) as $issue) {
            $report->addIssue($issue);
        }

        foreach ($this->sourceLicenseValidator->validate($metadata) as $issue) {
            $report->addIssue($issue);
        }

        if (! $report->ok()) {
            return $report;
        }

        $normalizer = $this->normalizerFor($metadata->sourceDataset);
        if ($normalizer === null) {
            $report->addIssue($this->error(
                'normalizer_missing',
                'No normalizer supports the requested source dataset.',
                ['source_dataset' => $metadata->sourceDataset]
            ));

            return $report;
        }

        $resolver = new OriginalLanguageVersificationResolver(
            $this->canonicalReferences,
            array_merge(self::DEFAULT_EXCEPTION_MAP, $exceptionMap)
        );
        $termCandidateKeys = [];
        $occurrenceCandidateKeys = [];

        foreach ($this->streamRows($metadata, $maxRows) as $rowNumber => $row) {
            $report->recordRowsRead();

            $sourceReference = $this->sourceReferenceFromRow($metadata->sourceDataset, $row, $rowNumber);
            if ($sourceReference === null) {
                $report->recordRowsInvalid();
                $report->recordRowsSkipped();
                $report->recordInvalidReference();
                $report->addIssue($this->error(
                    'invalid_reference',
                    'Source row reference could not be parsed before normalization.',
                    ['row_number' => $rowNumber]
                ));
                continue;
            }

            if ($metadata->sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAHOT) {
                $textType = $sourceReference['text_type'] ?? '';
                if ($this->isTahotQereKethivTextType($textType)) {
                    $report->recordRowsSkipped();
                    $report->addIssue($this->warning(
                        'qere_kethiv_variant_skipped',
                        'TAHOT Q(K) variant row skipped by first-import policy.',
                        $this->sourceReferenceContext($sourceReference, $rowNumber)
                    ));
                    continue;
                }

                if ($textType !== 'L') {
                    $report->recordRowsSkipped();
                    $report->addIssue($this->info(
                        'tahot_non_base_text_type_skipped',
                        'TAHOT non-base text type row skipped by first-import policy.',
                        $this->sourceReferenceContext($sourceReference, $rowNumber)
                    ));
                    continue;
                }
            }

            $resolvedReference = $resolver->resolve(
                $sourceReference['book_code'],
                $sourceReference['chapter'],
                $sourceReference['verse'],
                $this->sourceReferenceContext($sourceReference, $rowNumber)
            );

            foreach ($resolvedReference->issues as $issue) {
                $report->addIssue($issue);
            }

            if ($resolvedReference->status === OriginalLanguageResolvedReference::STATUS_PSALM_TITLE) {
                $report->recordRowsSkipped();
                continue;
            }

            if ($resolvedReference->status === OriginalLanguageResolvedReference::STATUS_UNRESOLVED) {
                $report->recordRowsInvalid();
                $report->recordRowsSkipped();
                $report->recordInvalidReference();
                continue;
            }

            if ($metadata->sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAGNT && ! $this->tagntRowContainsSbl($row)) {
                $report->recordRowsSkipped();
                $report->addIssue($this->info(
                    'tagnt_non_sbl_skipped',
                    'TAGNT row skipped because the editions field does not contain the exact SBL token.',
                    $this->sourceReferenceContext($sourceReference, $rowNumber)
                ));
                continue;
            }

            try {
                $normalizedRows = $this->normalizeRows($normalizer, $row, $rowNumber);
            } catch (InvalidArgumentException $exception) {
                $report->recordRowsInvalid();
                $report->recordRowsSkipped();
                $report->addIssue($this->error(
                    'normalization_failed',
                    $exception->getMessage(),
                    ['row_number' => $rowNumber, 'source_ref' => $sourceReference['source_ref']]
                ));
                continue;
            }

            if ($normalizedRows === []) {
                $report->recordRowsSkipped();
                continue;
            }

            $report->recordRowsValid();
            $report->recordRowsNormalized(count($normalizedRows));

            foreach ($normalizedRows as $normalizedRow) {
                foreach ($this->importValidator->validateTerm($this->termFromNormalizedRow($normalizedRow)) as $issue) {
                    $this->recordIssue($report, $issue);
                }

                if (trim($normalizedRow->morphology) === '') {
                    $this->recordIssue($report, $this->warning(
                        'missing_morphology',
                        'Original normalized row morphology is missing.',
                        ['row_number' => $rowNumber, 'source_ref' => $normalizedRow->sourceRef]
                    ));
                }

                $termCandidateKeys[$this->termCandidateKey($normalizedRow)] = true;

                $occurrenceKey = $this->occurrenceCandidateKey($normalizedRow, $resolvedReference);
                if (isset($occurrenceCandidateKeys[$occurrenceKey])) {
                    $this->recordIssue($report, $this->warning(
                        'duplicate_occurrence',
                        'Duplicate original word occurrence identity skipped in dry-run candidates.',
                        ['identity_key' => $occurrenceKey, 'source_ref' => $normalizedRow->sourceRef]
                    ));
                    $report->recordOccurrencesSkipped();
                    continue;
                }

                $occurrenceCandidateKeys[$occurrenceKey] = true;
            }
        }

        $report->recordTermsCandidateCount(count($termCandidateKeys));
        $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

        return $report;
    }

    private function normalizerFor(string $sourceDataset): ?OriginalLanguageNormalizerInterface
    {
        foreach ($this->normalizers as $normalizer) {
            if ($normalizer->supports($sourceDataset)) {
                return $normalizer;
            }
        }

        return null;
    }

    /**
     * @return iterable<int, array<string, mixed>>
     */
    private function streamRows(OriginalLanguageSourceMetadata $metadata, ?int $maxRows): iterable
    {
        $handle = fopen($metadata->sourcePath, 'rb');
        if ($handle === false) {
            throw new RuntimeException('Original language source file could not be opened for dry-run streaming.');
        }

        $headers = [];
        $rowNumber = 0;

        try {
            while (($line = fgets($handle, self::READ_LENGTH)) !== false) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                if ($headers === []) {
                    if (! $this->isExpectedHeaderLine($line, $metadata->sourceDataset)) {
                        continue;
                    }

                    $headers = $this->parseDelimitedLine($line);
                    continue;
                }

                if (! $this->isExpectedDataRow($line, $metadata->sourceDataset)) {
                    continue;
                }

                $rowNumber++;
                yield $rowNumber => $this->combineRow($headers, $this->parseDelimitedLine($line));

                if ($maxRows !== null && $rowNumber >= $maxRows) {
                    break;
                }
            }
        } finally {
            fclose($handle);
        }
    }

    private function isExpectedHeaderLine(string $line, string $sourceDataset): bool
    {
        $headers = $this->parseDelimitedLine($line);
        $firstCell = $headers[0] ?? '';

        return $firstCell === $this->expectedHeaderFirstCell($sourceDataset);
    }

    private function expectedHeaderFirstCell(string $sourceDataset): string
    {
        return match ($sourceDataset) {
            OriginalWordOccurrence::SOURCE_STEP_TAHOT => 'Eng (Heb) Ref & Type',
            OriginalWordOccurrence::SOURCE_STEP_TAGNT => 'Word & Type',
            default => '',
        };
    }

    private function isExpectedDataRow(string $line, string $sourceDataset): bool
    {
        if ($line === '' || str_starts_with($line, '#')) {
            return false;
        }

        foreach ($this->expectedDataReferencePrefixes($sourceDataset) as $prefix) {
            if (str_starts_with($line, $prefix)) {
                return true;
            }
        }

        return false;
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
     * @return string[]
     */
    private function parseDelimitedLine(string $line): array
    {
        $values = str_getcsv($line, "\t", '"', '');

        return array_values(array_map(
            static fn (mixed $value): string => trim(str_replace("\xEF\xBB\xBF", '', (string) $value)),
            $values
        ));
    }

    /**
     * @param string[] $headers
     * @param string[] $values
     *
     * @return array<string, mixed>
     */
    private function combineRow(array $headers, array $values): array
    {
        $row = [];

        foreach ($headers as $index => $header) {
            if ($header === '') {
                continue;
            }

            $row[$header] = $values[$index] ?? '';
        }

        if (count($values) > count($headers)) {
            $row['_extra_columns'] = array_slice($values, count($headers));
        }

        return $row;
    }

    /**
     * @param array<string, mixed> $row
     *
     * @return array<string, mixed>|null
     */
    private function sourceReferenceFromRow(string $sourceDataset, array $row, int $rowNumber): ?array
    {
        $field = $sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAHOT
            ? 'Eng (Heb) Ref & Type'
            : 'Word & Type';
        $reference = $this->stringValue($row, $field);

        if ($reference === '') {
            return null;
        }

        $pattern = $sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAHOT
            ? '/^([^.]+)\.(\d+)\.(\d+)(?:\(([^)]*)\))?#(\d+)=([^\s]+)$/'
            : '/^([^.]+)\.(\d+)\.(\d+)(?:([\{\[\(])(\d+\.\d+)([\}\]\)]))?#(\d+)=([^\s]+)$/';

        if (preg_match($pattern, $reference, $matches) !== 1) {
            return null;
        }

        $parsed = [
            'book_code' => $matches[1],
            'chapter' => (int) $matches[2],
            'verse' => (int) $matches[3],
            'source_ref' => $reference,
        ];

        if ($sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAHOT) {
            $parsed['alternate_reference'] = $matches[4] ?? '';
            $parsed['word_order'] = (int) $matches[5];
            $parsed['text_type'] = $matches[6];

            return $parsed;
        }

        $alternateMarker = $matches[4] ?? '';
        $parsed['alternate_reference_marker'] = $alternateMarker;
        $parsed['alternate_reference_type'] = $this->alternateReferenceType($alternateMarker);
        $parsed['alternate_reference'] = $matches[5] ?? '';
        $parsed['word_order'] = (int) $matches[7];
        $parsed['text_type'] = $matches[8];

        return $parsed;
    }

    /**
     * @param array<string, mixed> $sourceReference
     *
     * @return array<string, mixed>
     */
    private function sourceReferenceContext(array $sourceReference, int $rowNumber): array
    {
        $context = [
            'row_number' => $rowNumber,
            'source_ref' => $sourceReference['source_ref'],
        ];

        foreach ([
            'alternate_reference_marker',
            'alternate_reference_type',
            'alternate_reference',
            'text_type',
            'word_order',
        ] as $key) {
            if (isset($sourceReference[$key]) && $sourceReference[$key] !== '') {
                $context[$key] = $sourceReference[$key];
            }
        }

        return $context;
    }

    private function alternateReferenceType(string $marker): string
    {
        return match ($marker) {
            '{' => 'brace',
            '[' => 'bracket',
            '(' => 'parenthesis',
            default => '',
        };
    }

    private function isTahotQereKethivTextType(string $textType): bool
    {
        return str_starts_with(strtoupper(trim($textType)), 'Q(');
    }

    /**
     * @param array<string, mixed> $row
     */
    private function tagntRowContainsSbl(array $row): bool
    {
        $editions = $this->stringValue($row, 'editions');
        if ($editions === '') {
            return false;
        }

        $tokens = preg_split('/[+\s,;]+/', $editions) ?: [];
        foreach ($tokens as $token) {
            if (trim($token) === 'SBL') {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array<string, mixed> $row
     *
     * @return OriginalLanguageNormalizedRow[]
     */
    private function normalizeRows(
        OriginalLanguageNormalizerInterface $normalizer,
        array $row,
        int $rowNumber
    ): array {
        $normalizedRows = [];

        foreach ($normalizer->normalizeRow($row, $rowNumber) as $normalizedRow) {
            if (! $normalizedRow instanceof OriginalLanguageNormalizedRow) {
                throw new InvalidArgumentException('Normalizer must return OriginalLanguageNormalizedRow instances.');
            }

            $normalizedRows[] = $normalizedRow;
        }

        return $normalizedRows;
    }

    private function termFromNormalizedRow(OriginalLanguageNormalizedRow $row): OriginalTerm
    {
        return new OriginalTerm(
            null,
            $row->languageType,
            $row->lemma,
            $row->lemmaNormalized,
            $row->strongsNumber,
            $row->strongsExtended,
            $row->transliteration,
            $row->root,
            $row->gloss,
            $row->definition
        );
    }

    private function termCandidateKey(OriginalLanguageNormalizedRow $row): string
    {
        return implode('|', [
            $row->languageType,
            $row->lemmaNormalized,
            $row->strongsNumber,
            $row->strongsExtended,
        ]);
    }

    private function occurrenceCandidateKey(
        OriginalLanguageNormalizedRow $row,
        OriginalLanguageResolvedReference $resolvedReference
    ): string {
        return implode('|', [
            $row->sourceDataset,
            $resolvedReference->resolvedBookCode,
            (string) $resolvedReference->resolvedChapter,
            (string) $resolvedReference->resolvedVerse,
            (string) $row->wordOrder,
            (string) $row->subwordOrder,
            $row->tokenType,
        ]);
    }

    private function recordIssue(OriginalLanguageImportReport $report, OriginalLanguageImportIssue $issue): void
    {
        $report->addIssue($issue);

        match ($issue->code) {
            'missing_lemma' => $report->recordMissingLemma(),
            'missing_strongs' => $report->recordMissingStrongs(),
            'missing_morphology' => $report->recordMissingMorphology(),
            'invalid_reference', 'unresolved_reference' => $report->recordInvalidReference(),
            'duplicate_term' => $report->recordDuplicateTerm(),
            'duplicate_occurrence' => $report->recordDuplicateOccurrence(),
            default => null,
        };
    }

    private function stringValue(array $row, string $field): string
    {
        $value = $row[$field] ?? '';

        if (is_scalar($value)) {
            return trim((string) $value);
        }

        return '';
    }

    /**
     * @param array<string, mixed> $context
     */
    private function info(string $code, string $message, array $context = []): OriginalLanguageImportIssue
    {
        return new OriginalLanguageImportIssue(
            OriginalLanguageImportIssue::SEVERITY_INFO,
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
}
