<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use WCM\Scripture\Validators\OriginalTermValidator;
use WCM\Scripture\Validators\OriginalWordOccurrenceValidator;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalLanguageImportValidator
{
    private OriginalTermValidator $termValidator;
    private OriginalWordOccurrenceValidator $occurrenceValidator;

    public function __construct(
        bool $hebrewVersificationResolved = false,
        bool $greekEditionFilteringResolved = false,
        ?OriginalTermValidator $termValidator = null,
        ?OriginalWordOccurrenceValidator $occurrenceValidator = null
    ) {
        $this->hebrewVersificationResolved = $hebrewVersificationResolved;
        $this->greekEditionFilteringResolved = $greekEditionFilteringResolved;
        $this->termValidator = $termValidator ?? new OriginalTermValidator();
        $this->occurrenceValidator = $occurrenceValidator ?? new OriginalWordOccurrenceValidator();
    }

    private bool $hebrewVersificationResolved;
    private bool $greekEditionFilteringResolved;

    /**
     * @return OriginalLanguageImportIssue[]
     */
    public function validateTerm(OriginalTerm $term): array
    {
        return $this->validateSingleTerm($term);
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    public function validateOccurrence(OriginalWordOccurrence $occurrence): array
    {
        return $this->validateSingleOccurrence($occurrence);
    }

    /**
     * @param OriginalTerm[] $terms
     *
     * @return OriginalLanguageImportIssue[]
     */
    public function validateTerms(array $terms): array
    {
        $issues = [];
        $identityKeys = [];
        $hasHebrew = false;
        $hasGreek = false;

        foreach ($terms as $index => $term) {
            $issues = array_merge($issues, $this->validateSingleTerm($term, $index));

            $identityKey = $this->buildTermIdentityKey($term);
            if (isset($identityKeys[$identityKey])) {
                $issues[] = $this->error(
                    'duplicate_term',
                    'Duplicate original term identity found in import batch.',
                    [
                        'identity_key' => $identityKey,
                        'first_index' => $identityKeys[$identityKey],
                        'duplicate_index' => $index,
                    ]
                );
            } else {
                $identityKeys[$identityKey] = $index;
            }

            $hasHebrew = $hasHebrew || $term->languageType === OriginalTerm::LANGUAGE_HEBREW;
            $hasGreek = $hasGreek || $term->languageType === OriginalTerm::LANGUAGE_GREEK;
        }

        return array_merge($issues, $this->buildGateIssues($hasHebrew, $hasGreek));
    }

    /**
     * @param OriginalWordOccurrence[] $occurrences
     *
     * @return OriginalLanguageImportIssue[]
     */
    public function validateOccurrences(array $occurrences): array
    {
        $issues = [];
        $identityKeys = [];
        $hasHebrew = false;
        $hasGreek = false;

        foreach ($occurrences as $index => $occurrence) {
            $issues = array_merge($issues, $this->validateSingleOccurrence($occurrence, $index));

            $identityKey = $this->buildOccurrenceIdentityKey($occurrence);
            if (isset($identityKeys[$identityKey])) {
                $issues[] = $this->error(
                    'duplicate_occurrence',
                    'Duplicate original word occurrence identity found in import batch.',
                    [
                        'identity_key' => $identityKey,
                        'first_index' => $identityKeys[$identityKey],
                        'duplicate_index' => $index,
                    ]
                );
            } else {
                $identityKeys[$identityKey] = $index;
            }

            $hasHebrew = $hasHebrew || $occurrence->sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAHOT;
            $hasGreek = $hasGreek || $occurrence->sourceDataset === OriginalWordOccurrence::SOURCE_STEP_TAGNT;
        }

        return array_merge($issues, $this->buildGateIssues($hasHebrew, $hasGreek));
    }

    public function buildTermIdentityKey(OriginalTerm $term): string
    {
        return $this->termValidator->buildIdentityKey($term);
    }

    public function buildOccurrenceIdentityKey(OriginalWordOccurrence $occurrence): string
    {
        return $this->occurrenceValidator->buildIdentityKey($occurrence);
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function validateSingleTerm(OriginalTerm $term, ?int $index = null): array
    {
        $issues = [];

        foreach ($this->termValidator->validate($term) as $error) {
            if (str_contains($error, 'lemma is required') || str_contains($error, 'lemma_normalized is required')) {
                $issues[] = $this->error('missing_lemma', 'Original term lemma is missing.', $this->context($index));
            }
        }

        if (trim($term->lemma) === '' || trim($term->lemmaNormalized) === '') {
            $issues[] = $this->error('missing_lemma', 'Original term lemma is missing.', $this->context($index));
        }

        if (trim($term->strongsNumber) === '') {
            $issues[] = $this->warning('missing_strongs', 'Original term Strong\'s number is missing.', $this->context($index));
        }

        return $this->deduplicateIssues($issues);
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function validateSingleOccurrence(OriginalWordOccurrence $occurrence, ?int $index = null): array
    {
        $issues = [];

        foreach ($this->occurrenceValidator->validate($occurrence) as $error) {
            if (str_contains($error, 'morphology')) {
                $issues[] = $this->warning('missing_morphology', 'Original word occurrence morphology is missing.', $this->context($index));
            }
        }

        if (trim($occurrence->morphology) === '') {
            $issues[] = $this->warning(
                'missing_morphology',
                'Original word occurrence morphology is missing.',
                $this->context($index)
            );
        }

        return $this->deduplicateIssues($issues);
    }

    /**
     * @return OriginalLanguageImportIssue[]
     */
    private function buildGateIssues(bool $hasHebrew, bool $hasGreek): array
    {
        $issues = [];

        if ($hasHebrew && ! $this->hebrewVersificationResolved) {
            $issues[] = $this->error(
                'hebrew_versification_missing',
                'Hebrew versification handling must be resolved before import.'
            );
        }

        if ($hasGreek && ! $this->greekEditionFilteringResolved) {
            $issues[] = $this->error(
                'greek_edition_filter_missing',
                'Greek edition filtering must be resolved before import.'
            );
        }

        return $issues;
    }

    /**
     * @param OriginalLanguageImportIssue[] $issues
     *
     * @return OriginalLanguageImportIssue[]
     */
    private function deduplicateIssues(array $issues): array
    {
        $seen = [];
        $deduplicated = [];

        foreach ($issues as $issue) {
            $key = $issue->severity . '|' . $issue->code . '|' . $issue->message . '|' . json_encode($issue->context);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $deduplicated[] = $issue;
        }

        return $deduplicated;
    }

    /**
     * @return array<string, int>
     */
    private function context(?int $index): array
    {
        return $index === null ? [] : ['index' => $index];
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
