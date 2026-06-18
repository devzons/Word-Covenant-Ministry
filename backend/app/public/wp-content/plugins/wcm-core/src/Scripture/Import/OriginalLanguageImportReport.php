<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final class OriginalLanguageImportReport
{
    public string $sourceDataset;
    public string $sourceFile;
    public string $licenseStatus;
    public int $rowsRead;
    public int $rowsValid;
    public int $rowsInvalid;
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
        int $rowsRead = 0,
        int $rowsValid = 0,
        int $rowsInvalid = 0,
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
        $this->rowsRead = $this->nonNegative($rowsRead, 'rowsRead');
        $this->rowsValid = $this->nonNegative($rowsValid, 'rowsValid');
        $this->rowsInvalid = $this->nonNegative($rowsInvalid, 'rowsInvalid');
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
     *     rows_read: int,
     *     rows_valid: int,
     *     rows_invalid: int,
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
            'rows_read' => $this->rowsRead,
            'rows_valid' => $this->rowsValid,
            'rows_invalid' => $this->rowsInvalid,
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
            'issues' => array_map(
                static fn (OriginalLanguageImportIssue $issue): array => $issue->toArray(),
                $this->issues
            ),
            'ok' => $this->ok(),
        ];
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
