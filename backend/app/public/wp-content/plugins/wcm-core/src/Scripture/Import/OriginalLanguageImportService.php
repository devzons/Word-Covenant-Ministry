<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use RuntimeException;
use Throwable;
use WCM\Scripture\Repositories\OriginalTermRepository;
use WCM\Scripture\Repositories\OriginalWordOccurrenceRepository;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalLanguageImportService
{
    private const READ_LENGTH = 131072;
    private const MAX_WRITE_BATCH_SIZE = 500;

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
        private ?OriginalTermRepository $termRepository = null,
        private ?OriginalWordOccurrenceRepository $occurrenceRepository = null,
        array $normalizers = []
    ) {
        $this->sourceInspector ??= new OriginalLanguageSourceInspector();
        $this->sourceFileValidator ??= new SourceFileValidator();
        $this->sourceLicenseValidator ??= new SourceLicenseValidator();
        $this->importValidator ??= new OriginalLanguageImportValidator(
            hebrewVersificationResolved: true,
            greekEditionFilteringResolved: true
        );
        $this->termRepository ??= new OriginalTermRepository();
        $this->occurrenceRepository ??= new OriginalWordOccurrenceRepository();

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

    /**
     * Write-enabled import entrypoint. This method is intentionally separate from dryRun()
     * and must only be called by an explicitly approved persistence phase.
     *
     * @param array<string, int> $bookIdsByCode Canonical STEP book code to wcm_bible_books.id map.
     * @param array<string, array{book_code: string, chapter: int, verse: int}> $exceptionMap
     */
    public function importApprovedSource(
        bool $dryRunApproved,
        string $sourceDataset,
        string $sourcePath,
        string $expectedChecksum,
        string $sourceVersion,
        string $sourceUrl,
        string $licenseStatus,
        string $attribution,
        array $bookIdsByCode,
        ?int $maxRows = null,
        array $exceptionMap = [],
        int $batchSize = self::MAX_WRITE_BATCH_SIZE
    ): OriginalLanguageImportReport {
        $this->validateApprovedImportRequest(
            $dryRunApproved,
            $expectedChecksum,
            $sourceVersion,
            $sourceUrl,
            $licenseStatus,
            $attribution,
            $bookIdsByCode,
            $maxRows,
            $batchSize
        );

        $preflightReport = $this->dryRun(
            $sourceDataset,
            $sourcePath,
            $licenseStatus,
            $attribution,
            null,
            $exceptionMap,
            true,
            $sourceVersion,
            $sourceUrl
        );

        if (
            ! $preflightReport->ok()
            || $preflightReport->sourceDataset !== trim($sourceDataset)
            || ! hash_equals(strtolower(trim($expectedChecksum)), strtolower($preflightReport->checksum))
            || $preflightReport->sourceVersion !== trim($sourceVersion)
            || $preflightReport->sourceUrl !== trim($sourceUrl)
            || $preflightReport->licenseStatus !== 'approved'
        ) {
            if ($preflightReport->ok()) {
                $preflightReport->addIssue($this->error(
                    'preflight_mismatch',
                    'Write-enabled import preflight does not match approved source inputs.',
                    [
                        'expected_source_dataset' => trim($sourceDataset),
                        'actual_source_dataset' => $preflightReport->sourceDataset,
                        'expected_checksum' => trim($expectedChecksum),
                        'actual_checksum' => $preflightReport->checksum,
                        'expected_source_version' => trim($sourceVersion),
                        'actual_source_version' => $preflightReport->sourceVersion,
                        'expected_source_url' => trim($sourceUrl),
                        'actual_source_url' => $preflightReport->sourceUrl,
                        'actual_license_status' => $preflightReport->licenseStatus,
                    ]
                ));
            }

            return $preflightReport;
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

        if (! hash_equals(strtolower(trim($expectedChecksum)), strtolower($metadata->checksum))) {
            $report->addIssue($this->error(
                'checksum_mismatch',
                'Approved source checksum does not match inspected source checksum.',
                [
                    'expected_checksum' => trim($expectedChecksum),
                    'actual_checksum' => $metadata->checksum,
                ]
            ));
        }

        if (trim($sourceVersion) !== $metadata->sourceVersion) {
            $report->addIssue($this->error(
                'source_version_mismatch',
                'Approved source version does not match inspected source version.',
                [
                    'expected_source_version' => trim($sourceVersion),
                    'actual_source_version' => $metadata->sourceVersion,
                ]
            ));
        }

        if ($metadata->licenseStatus !== 'approved') {
            $report->addIssue($this->error(
                'license_not_approved',
                'Approved source import requires licenseStatus=approved.',
                ['license_status' => $metadata->licenseStatus]
            ));
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
        $skippedOccurrences = 0;
        $chunk = [];

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
                $termCandidateKeys[$this->termCandidateKey($normalizedRow)] = true;

                $occurrenceKey = $this->occurrenceCandidateKey($normalizedRow, $resolvedReference);
                if (isset($occurrenceCandidateKeys[$occurrenceKey])) {
                    $this->recordIssue($report, $this->warning(
                        'duplicate_occurrence',
                        'Duplicate original word occurrence identity skipped in persistence candidates.',
                        ['identity_key' => $occurrenceKey, 'source_ref' => $normalizedRow->sourceRef]
                    ));
                    $skippedOccurrences++;
                    continue;
                }

                $occurrenceCandidateKeys[$occurrenceKey] = true;
                $chunk[] = [
                    'row' => $normalizedRow,
                    'resolved_reference' => $resolvedReference,
                ];

                if (count($chunk) >= $batchSize) {
                    if (! $report->ok()) {
                        $report->recordFailedBatch();
                        $report->recordTermsCandidateCount(count($termCandidateKeys));
                        $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

                        return $report;
                    }

                    if (! $this->persistApprovedChunk($chunk, $bookIdsByCode, $report, $batchSize)) {
                        $report->recordTermsCandidateCount(count($termCandidateKeys));
                        $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

                        return $report;
                    }

                    $chunk = [];
                }
            }
        }

        if ($chunk !== []) {
            if (! $report->ok()) {
                $report->recordFailedBatch();
                $report->recordTermsCandidateCount(count($termCandidateKeys));
                $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

                return $report;
            }

            if (! $this->persistApprovedChunk($chunk, $bookIdsByCode, $report, $batchSize)) {
                $report->recordTermsCandidateCount(count($termCandidateKeys));
                $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

                return $report;
            }
        }

        $report->recordOccurrencesSkipped($skippedOccurrences);
        $report->recordTermsCandidateCount(count($termCandidateKeys));
        $report->recordOccurrencesCandidateCount(count($occurrenceCandidateKeys));

        return $report;
    }

    /**
     * @param array<string, int> $bookIdsByCode
     */
    private function validateApprovedImportRequest(
        bool $dryRunApproved,
        string $expectedChecksum,
        string $sourceVersion,
        string $sourceUrl,
        string $licenseStatus,
        string $attribution,
        array $bookIdsByCode,
        ?int $maxRows,
        int $batchSize
    ): void {
        if (! $dryRunApproved) {
            throw new InvalidArgumentException('Write-enabled original language import requires dryRunApproved=true.');
        }

        if (trim($expectedChecksum) === '') {
            throw new InvalidArgumentException('Write-enabled original language import requires an expected checksum.');
        }

        if (trim($sourceVersion) === '') {
            throw new InvalidArgumentException('Write-enabled original language import requires a pinned source version.');
        }

        if (trim($sourceUrl) === '') {
            throw new InvalidArgumentException('Write-enabled original language import requires a source URL.');
        }

        if (trim($licenseStatus) !== 'approved') {
            throw new InvalidArgumentException('Write-enabled original language import requires licenseStatus=approved.');
        }

        if (trim($attribution) === '') {
            throw new InvalidArgumentException('Write-enabled original language import requires attribution text.');
        }

        if ($bookIdsByCode === []) {
            throw new InvalidArgumentException('Write-enabled original language import requires canonical book IDs by STEP book code.');
        }

        foreach ($bookIdsByCode as $bookCode => $bookId) {
            if (trim((string) $bookCode) === '' || (int) $bookId < 1) {
                throw new InvalidArgumentException('Canonical book ID map must contain non-empty book codes and positive IDs.');
            }
        }

        if ($maxRows !== null && $maxRows < 1) {
            throw new InvalidArgumentException('Write-enabled original language import maxRows must be null or greater than zero.');
        }

        if ($batchSize < 1) {
            throw new InvalidArgumentException('Write-enabled original language import batchSize must be greater than zero.');
        }

        if ($batchSize > self::MAX_WRITE_BATCH_SIZE) {
            throw new InvalidArgumentException('Write-enabled original language import batchSize must be 500 or less.');
        }
    }

    /**
     * @param array<int, array{row: OriginalLanguageNormalizedRow, resolved_reference: OriginalLanguageResolvedReference}> $chunk
     * @param array<string, int> $bookIdsByCode
     */
    private function persistApprovedChunk(
        array $chunk,
        array $bookIdsByCode,
        OriginalLanguageImportReport $report,
        int $batchSize
    ): bool {
        $termsByIdentity = [];
        $termIdentityByIndex = [];
        $occurrenceDrafts = [];

        foreach ($chunk as $index => $item) {
            $normalizedRow = $item['row'];
            $resolvedReference = $item['resolved_reference'];

            $term = $this->termFromNormalizedRow($normalizedRow);
            $termIdentity = $this->termRepository->buildIdentityKey(
                $term->languageType,
                $term->lemmaNormalized,
                $term->strongsNumber,
                $term->strongsExtended
            );

            $termsByIdentity[$termIdentity] = $term;
            $termIdentityByIndex[$index] = $termIdentity;

            try {
                $occurrenceDrafts[$index] = $this->occurrenceFromNormalizedRow(
                    $normalizedRow,
                    $resolvedReference,
                    1,
                    $bookIdsByCode
                );
            } catch (InvalidArgumentException $exception) {
                $report->recordFailedBatch();
                $report->addIssue($this->error(
                    'import_batch_validation_failed',
                    $exception->getMessage(),
                    ['source_ref' => $normalizedRow->sourceRef]
                ));

                return false;
            }
        }

        foreach ($this->importValidator->validateTerms(array_values($termsByIdentity)) as $issue) {
            $this->recordIssue($report, $issue);
        }

        foreach ($this->importValidator->validateOccurrences(array_values($occurrenceDrafts)) as $issue) {
            $this->recordIssue($report, $issue);
        }

        if (! $report->ok()) {
            $report->recordFailedBatch();

            return false;
        }

        try {
            $this->beginTransaction();

            $existingTermIds = $this->termRepository->findIdsByIdentities(
                $this->termIdentityPayloads(array_values($termsByIdentity)),
                $batchSize
            );
            $termsToCreate = array_diff_key($termsByIdentity, $existingTermIds);
            $createdTermIds = $this->termRepository->insertBatch(array_values($termsToCreate), $batchSize);
            $termIdsByIdentity = $existingTermIds + $createdTermIds;
            $matchedTerms = count($existingTermIds);
            $createdTerms = count($createdTermIds);

            $occurrencesByIdentity = [];
            foreach ($chunk as $index => $item) {
                $normalizedRow = $item['row'];
                $resolvedReference = $item['resolved_reference'];
                $termId = $termIdsByIdentity[$termIdentityByIndex[$index]] ?? 0;

                if ($termId < 1) {
                    throw new RuntimeException('Original language import could not resolve persisted term ID.');
                }

                $occurrence = $this->occurrenceFromNormalizedRow(
                    $normalizedRow,
                    $resolvedReference,
                    $termId,
                    $bookIdsByCode
                );

                $occurrenceIdentity = $this->occurrenceRepository->buildIdentityKey(
                    $occurrence->sourceDataset,
                    $occurrence->bookId,
                    $occurrence->chapter,
                    $occurrence->verse,
                    $occurrence->wordOrder,
                    $occurrence->subwordOrder,
                    $occurrence->tokenType
                );

                $occurrencesByIdentity[$occurrenceIdentity] = $occurrence;
            }

            $existingOccurrenceIds = $this->occurrenceRepository->findIdsByIdentities(
                $this->occurrenceIdentityPayloads(array_values($occurrencesByIdentity)),
                $batchSize
            );
            $occurrencesToCreate = array_diff_key($occurrencesByIdentity, $existingOccurrenceIds);
            $createdOccurrenceIds = $this->occurrenceRepository->insertBatch(array_values($occurrencesToCreate), $batchSize);
            $matchedOccurrences = count($existingOccurrenceIds);
            $createdOccurrences = count($createdOccurrenceIds);

            $this->commitTransaction();

            $report->recordTermsMatched($matchedTerms);
            $report->recordTermsCreated($createdTerms);
            $report->recordOccurrencesMatched($matchedOccurrences);
            $report->recordOccurrencesCreated($createdOccurrences);

            return true;
        } catch (Throwable $exception) {
            $this->rollbackTransaction();
            $report->recordFailedBatch();
            $report->addIssue($this->error(
                'import_batch_failed',
                $exception->getMessage()
            ));

            return false;
        }
    }

    /**
     * @param OriginalTerm[] $terms
     *
     * @return array<int, array{languageType: string, lemmaNormalized: string, strongsNumber: string, strongsExtended: string}>
     */
    private function termIdentityPayloads(array $terms): array
    {
        return array_map(
            static fn (OriginalTerm $term): array => [
                'languageType' => $term->languageType,
                'lemmaNormalized' => $term->lemmaNormalized,
                'strongsNumber' => $term->strongsNumber,
                'strongsExtended' => $term->strongsExtended,
            ],
            $terms
        );
    }

    /**
     * @param OriginalWordOccurrence[] $occurrences
     *
     * @return array<int, array{
     *     sourceDataset: string,
     *     bookId: int,
     *     chapter: int,
     *     verse: int,
     *     wordOrder: int,
     *     subwordOrder: int,
     *     tokenType: string
     * }>
     */
    private function occurrenceIdentityPayloads(array $occurrences): array
    {
        return array_map(
            static fn (OriginalWordOccurrence $occurrence): array => [
                'sourceDataset' => $occurrence->sourceDataset,
                'bookId' => $occurrence->bookId,
                'chapter' => $occurrence->chapter,
                'verse' => $occurrence->verse,
                'wordOrder' => $occurrence->wordOrder,
                'subwordOrder' => $occurrence->subwordOrder,
                'tokenType' => $occurrence->tokenType,
            ],
            $occurrences
        );
    }

    /**
     * @param array<string, int> $bookIdsByCode
     */
    private function occurrenceFromNormalizedRow(
        OriginalLanguageNormalizedRow $row,
        OriginalLanguageResolvedReference $resolvedReference,
        int $termId,
        array $bookIdsByCode
    ): OriginalWordOccurrence {
        if (! $resolvedReference->isResolved()) {
            throw new InvalidArgumentException('Original language occurrence requires a resolved canonical reference.');
        }

        $bookCode = (string) $resolvedReference->resolvedBookCode;
        $bookId = (int) ($bookIdsByCode[$bookCode] ?? 0);
        if ($bookId < 1) {
            throw new InvalidArgumentException('Original language occurrence requires a canonical book ID for ' . $bookCode . '.');
        }

        return new OriginalWordOccurrence(
            null,
            $termId,
            $bookId,
            (int) $resolvedReference->resolvedChapter,
            (int) $resolvedReference->resolvedVerse,
            $row->wordOrder,
            $row->subwordOrder,
            $row->tokenType,
            $row->surfaceForm,
            $row->normalizedForm,
            $row->morphology,
            $row->grammarSummary,
            $row->grammarNote,
            $row->contextualFunction,
            $row->sourceDataset,
            $row->sourceRef
        );
    }

    private function beginTransaction(): void
    {
        global $wpdb;

        if ($wpdb->query('START TRANSACTION') === false) {
            throw new RuntimeException('Original language import transaction could not start.');
        }
    }

    private function commitTransaction(): void
    {
        global $wpdb;

        if ($wpdb->query('COMMIT') === false) {
            throw new RuntimeException('Original language import transaction could not commit.');
        }
    }

    private function rollbackTransaction(): void
    {
        global $wpdb;

        $wpdb->query('ROLLBACK');
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
            null,
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
