<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final class OriginalLanguageImportReport
{
    public string $sourceDataset;
    public string $sourceFile;
    public string $licenseStatus;
    public string $sourceVersion;
    public string $sourceUrl;
    public string $checksum;
    public int $rowsRead;
    public int $rowsValid;
    public int $rowsInvalid;
    public int $rowsNormalized;
    public int $rowsSkipped;
    public int $termsCandidateCount;
    public int $occurrencesCandidateCount;
    public int $termsCreated;
    public int $termsMatched;
    public int $occurrencesCreated;
    public int $occurrencesSkipped;
    public int $duplicateTerms;
    public int $duplicateOccurrences;
    public int $missingLemma;
    public int $missingStrongs;
    public int $missingMorphology;
    public int $invalidReference;
    public int $warnings = 0;
    public int $errors = 0;

    /**
     * @var OriginalLanguageImportIssue[]
     */
    public array $issues = [];

    /**
     * @param OriginalLanguageImportIssue[] $issues
     */
    public function __construct(
        string $sourceDataset = '',
        string $sourceFile = '',
        string $licenseStatus = '',
        string $sourceVersion = '',
        string $sourceUrl = '',
        string $checksum = '',
        int $rowsRead = 0,
        int $rowsValid = 0,
        int $rowsInvalid = 0,
        int $rowsNormalized = 0,
        int $rowsSkipped = 0,
        int $termsCandidateCount = 0,
        int $occurrencesCandidateCount = 0,
        int $termsCreated = 0,
        int $termsMatched = 0,
        int $occurrencesCreated = 0,
        int $occurrencesSkipped = 0,
        int $duplicateTerms = 0,
        int $duplicateOccurrences = 0,
        int $missingLemma = 0,
        int $missingStrongs = 0,
        int $missingMorphology = 0,
        int $invalidReference = 0,
        array $issues = []
    ) {
        $this->sourceDataset = trim($sourceDataset);
        $this->sourceFile = trim($sourceFile);
        $this->licenseStatus = trim($licenseStatus);
        $this->sourceVersion = trim($sourceVersion);
        $this->sourceUrl = trim($sourceUrl);
        $this->checksum = trim($checksum);
        $this->rowsRead = $this->nonNegative($rowsRead, 'rowsRead');
        $this->rowsValid = $this->nonNegative($rowsValid, 'rowsValid');
        $this->rowsInvalid = $this->nonNegative($rowsInvalid, 'rowsInvalid');
        $this->rowsNormalized = $this->nonNegative($rowsNormalized, 'rowsNormalized');
        $this->rowsSkipped = $this->nonNegative($rowsSkipped, 'rowsSkipped');
        $this->termsCandidateCount = $this->nonNegative($termsCandidateCount, 'termsCandidateCount');
        $this->occurrencesCandidateCount = $this->nonNegative($occurrencesCandidateCount, 'occurrencesCandidateCount');
        $this->termsCreated = $this->nonNegative($termsCreated, 'termsCreated');
        $this->termsMatched = $this->nonNegative($termsMatched, 'termsMatched');
        $this->occurrencesCreated = $this->nonNegative($occurrencesCreated, 'occurrencesCreated');
        $this->occurrencesSkipped = $this->nonNegative($occurrencesSkipped, 'occurrencesSkipped');
        $this->duplicateTerms = $this->nonNegative($duplicateTerms, 'duplicateTerms');
        $this->duplicateOccurrences = $this->nonNegative($duplicateOccurrences, 'duplicateOccurrences');
        $this->missingLemma = $this->nonNegative($missingLemma, 'missingLemma');
        $this->missingStrongs = $this->nonNegative($missingStrongs, 'missingStrongs');
        $this->missingMorphology = $this->nonNegative($missingMorphology, 'missingMorphology');
        $this->invalidReference = $this->nonNegative($invalidReference, 'invalidReference');

        foreach ($issues as $issue) {
            if (! $issue instanceof OriginalLanguageImportIssue) {
                throw new InvalidArgumentException('Original language import report issues must be OriginalLanguageImportIssue instances.');
            }

            $this->addIssue($issue);
        }
    }

    public function addIssue(OriginalLanguageImportIssue $issue): void
    {
        $this->issues[] = $issue;

        if ($issue->severity === OriginalLanguageImportIssue::SEVERITY_WARNING) {
            $this->warnings++;
        }

        if ($issue->severity === OriginalLanguageImportIssue::SEVERITY_ERROR) {
            $this->errors++;
        }
    }

    public function recordRowsRead(int $count = 1): void
    {
        $this->incrementCounter('rowsRead', $count);
    }

    public function recordRowsValid(int $count = 1): void
    {
        $this->incrementCounter('rowsValid', $count);
    }

    public function recordRowsInvalid(int $count = 1): void
    {
        $this->incrementCounter('rowsInvalid', $count);
    }

    public function recordRowsNormalized(int $count = 1): void
    {
        $this->incrementCounter('rowsNormalized', $count);
    }

    public function recordRowsSkipped(int $count = 1): void
    {
        $this->incrementCounter('rowsSkipped', $count);
    }

    public function recordTermsCandidateCount(int $count = 1): void
    {
        $this->incrementCounter('termsCandidateCount', $count);
    }

    public function recordOccurrencesCandidateCount(int $count = 1): void
    {
        $this->incrementCounter('occurrencesCandidateCount', $count);
    }

    public function recordTermsCreated(int $count = 1): void
    {
        $this->incrementCounter('termsCreated', $count);
    }

    public function recordTermsMatched(int $count = 1): void
    {
        $this->incrementCounter('termsMatched', $count);
    }

    public function recordOccurrencesCreated(int $count = 1): void
    {
        $this->incrementCounter('occurrencesCreated', $count);
    }

    public function recordOccurrencesSkipped(int $count = 1): void
    {
        $this->incrementCounter('occurrencesSkipped', $count);
    }

    public function recordDuplicateTerm(int $count = 1): void
    {
        $this->incrementCounter('duplicateTerms', $count);
    }

    public function recordDuplicateOccurrence(int $count = 1): void
    {
        $this->incrementCounter('duplicateOccurrences', $count);
    }

    public function recordMissingLemma(int $count = 1): void
    {
        $this->incrementCounter('missingLemma', $count);
    }

    public function recordMissingStrongs(int $count = 1): void
    {
        $this->incrementCounter('missingStrongs', $count);
    }

    public function recordMissingMorphology(int $count = 1): void
    {
        $this->incrementCounter('missingMorphology', $count);
    }

    public function recordInvalidReference(int $count = 1): void
    {
        $this->incrementCounter('invalidReference', $count);
    }

    public function ok(): bool
    {
        return $this->errors === 0;
    }

    /**
     * @return array{
     *     source_dataset: string,
     *     source_file: string,
     *     license_status: string,
     *     source_version: string,
     *     source_url: string,
     *     checksum: string,
     *     rows_read: int,
     *     rows_valid: int,
     *     rows_invalid: int,
     *     rows_normalized: int,
     *     rows_skipped: int,
     *     terms_candidate_count: int,
     *     occurrences_candidate_count: int,
     *     terms_created: int,
     *     terms_matched: int,
     *     occurrences_created: int,
     *     occurrences_skipped: int,
     *     duplicate_terms: int,
     *     duplicate_occurrences: int,
     *     missing_lemma: int,
     *     missing_strongs: int,
     *     missing_morphology: int,
     *     invalid_reference: int,
     *     warnings: int,
     *     errors: int,
     *     issue_counts_by_severity: array<string, int>,
     *     issue_counts_by_code: array<string, int>,
     *     issues: array<int, array{severity: string, code: string, message: string, context: array<string, mixed>}>,
     *     ok: bool
     * }
     */
    public function toArray(): array
    {
        return [
            'source_dataset' => $this->sourceDataset,
            'source_file' => $this->sourceFile,
            'license_status' => $this->licenseStatus,
            'source_version' => $this->sourceVersion,
            'source_url' => $this->sourceUrl,
            'checksum' => $this->checksum,
            'rows_read' => $this->rowsRead,
            'rows_valid' => $this->rowsValid,
            'rows_invalid' => $this->rowsInvalid,
            'rows_normalized' => $this->rowsNormalized,
            'rows_skipped' => $this->rowsSkipped,
            'terms_candidate_count' => $this->termsCandidateCount,
            'occurrences_candidate_count' => $this->occurrencesCandidateCount,
            'terms_created' => $this->termsCreated,
            'terms_matched' => $this->termsMatched,
            'occurrences_created' => $this->occurrencesCreated,
            'occurrences_skipped' => $this->occurrencesSkipped,
            'duplicate_terms' => $this->duplicateTerms,
            'duplicate_occurrences' => $this->duplicateOccurrences,
            'missing_lemma' => $this->missingLemma,
            'missing_strongs' => $this->missingStrongs,
            'missing_morphology' => $this->missingMorphology,
            'invalid_reference' => $this->invalidReference,
            'warnings' => $this->warnings,
            'errors' => $this->errors,
            'issue_counts_by_severity' => $this->issueCountsBySeverity(),
            'issue_counts_by_code' => $this->issueCountsByCode(),
            'issues' => array_map(
                static fn (OriginalLanguageImportIssue $issue): array => $issue->toArray(),
                $this->issues
            ),
            'ok' => $this->ok(),
        ];
    }

    /**
     * @return array<string, int>
     */
    private function issueCountsBySeverity(): array
    {
        $counts = [
            OriginalLanguageImportIssue::SEVERITY_INFO => 0,
            OriginalLanguageImportIssue::SEVERITY_WARNING => 0,
            OriginalLanguageImportIssue::SEVERITY_ERROR => 0,
        ];

        foreach ($this->issues as $issue) {
            $counts[$issue->severity] = ($counts[$issue->severity] ?? 0) + 1;
        }

        return $counts;
    }

    /**
     * @return array<string, int>
     */
    private function issueCountsByCode(): array
    {
        $counts = [];

        foreach ($this->issues as $issue) {
            $counts[$issue->code] = ($counts[$issue->code] ?? 0) + 1;
        }

        ksort($counts);

        return $counts;
    }

    private function incrementCounter(string $property, int $count): void
    {
        $this->{$property} += $this->nonNegative($count, $property);
    }

    private function nonNegative(int $value, string $field): int
    {
        if ($value < 0) {
            throw new InvalidArgumentException(sprintf('Original language import report %s cannot be negative.', $field));
        }

        return $value;
    }
}
