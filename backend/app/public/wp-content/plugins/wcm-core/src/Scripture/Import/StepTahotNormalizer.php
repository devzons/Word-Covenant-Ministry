<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class StepTahotNormalizer implements OriginalLanguageNormalizerInterface
{
    private const FIELD_REF_TYPE = 'Eng (Heb) Ref & Type';
    private const FIELD_HEBREW = 'Hebrew';
    private const FIELD_TRANSLITERATION = 'Transliteration';
    private const FIELD_TRANSLATION = 'Translation';
    private const FIELD_DSTRONGS = 'dStrongs';
    private const FIELD_GRAMMAR = 'Grammar';
    private const FIELD_EXPANDED_STRONG_TAGS = 'Expanded Strong tags';
    private const FIELD_ROOT_DSTRONG = 'Root dStrong+Instance';

    /**
     * @var string[]
     */
    private const GRAMMAR_NOTE_FIELDS = [
        'Meaning Variants',
        'Spelling Variants',
        'Root dStrong+Instance',
        'Alternative Strongs+Instance',
        'Conjoin word',
    ];

    public function supports(string $sourceDataset): bool
    {
        return trim($sourceDataset) === OriginalWordOccurrence::SOURCE_STEP_TAHOT;
    }

    /**
     * @param array<string, mixed> $row
     * @return iterable<OriginalLanguageNormalizedRow>
     */
    public function normalizeRow(array $row, int $rowNumber): iterable
    {
        $reference = $this->parseReference($this->requiredStringValue($row, self::FIELD_REF_TYPE));
        $hebrewSegments = $this->splitSegments($this->requiredStringValue($row, self::FIELD_HEBREW));
        if ($hebrewSegments === []) {
            throw new InvalidArgumentException('STEP TAHOT Hebrew field must include at least one segment.');
        }

        $transliterationSegments = $this->splitSegments($this->stringValue($row, self::FIELD_TRANSLITERATION));
        $translationSegments = $this->splitSegments($this->stringValue($row, self::FIELD_TRANSLATION));
        $strongSegments = $this->splitSegments($this->stringValue($row, self::FIELD_DSTRONGS));
        $grammarSegments = $this->splitSegments($this->stringValue($row, self::FIELD_GRAMMAR));
        $expandedSegments = $this->splitSegments($this->stringValue($row, self::FIELD_EXPANDED_STRONG_TAGS));
        $wordSegmentIndex = $this->findWordSegmentIndex($hebrewSegments, $strongSegments, $expandedSegments);
        $hasMultipleSegments = count($hebrewSegments) > 1;

        $rows = [];
        foreach ($hebrewSegments as $index => $segment) {
            $surfaceForm = $this->normalizeWhitespace($segment['value']);
            if ($surfaceForm === '') {
                continue;
            }

            $tokenType = $this->resolveTokenType($segment, $index, $wordSegmentIndex);
            $strongRaw = $this->parallelValue($strongSegments, $index, '');
            $expandedRaw = $this->parallelValue($expandedSegments, $index, '');
            $expanded = $this->parseExpandedStrongTag($expandedRaw);
            $selectedStrong = $expanded['strong_raw'] !== '' ? $expanded['strong_raw'] : $strongRaw;
            $lemma = $expanded['lemma'] !== '' ? $expanded['lemma'] : $surfaceForm;
            $translation = $this->parallelValue($translationSegments, $index, $this->stringValue($row, self::FIELD_TRANSLATION));
            $gloss = $expanded['gloss'] !== null ? $expanded['gloss'] : $this->nullableString($translation);

            $rows[] = new OriginalLanguageNormalizedRow(
                sourceDataset: OriginalWordOccurrence::SOURCE_STEP_TAHOT,
                sourceRef: OriginalWordOccurrence::SOURCE_STEP_TAHOT . ':' . $reference['source_ref'] . ':' . $index,
                languageType: OriginalTerm::LANGUAGE_HEBREW,
                bookCode: $reference['book_code'],
                chapter: $reference['chapter'],
                verse: $reference['verse'],
                wordOrder: $reference['word_order'],
                subwordOrder: $hasMultipleSegments ? $index : 0,
                tokenType: $tokenType,
                surfaceForm: $surfaceForm,
                normalizedForm: $this->normalizeSearchText($surfaceForm),
                lemma: $lemma,
                lemmaNormalized: $this->normalizeSearchText($lemma),
                strongsNumber: $this->normalizeBaseStrongs($selectedStrong),
                strongsExtended: $this->normalizeExtendedStrongs($selectedStrong),
                transliteration: $this->parallelValue($transliterationSegments, $index, ''),
                root: $tokenType === OriginalWordOccurrence::TOKEN_WORD
                    ? $this->normalizeRoot($this->stringValue($row, self::FIELD_ROOT_DSTRONG))
                    : '',
                gloss: $gloss,
                definition: $expanded['definition'],
                morphology: $this->parallelValue($grammarSegments, $index, ''),
                grammarSummary: null,
                grammarNote: $this->buildGrammarNote($row, [
                    'segment_index' => $index,
                    'text_type' => $reference['text_type'],
                    'raw_segment_strongs' => $strongRaw,
                    'raw_segment_expanded_strong_tag' => $expandedRaw,
                    'alignment_note' => $this->buildAlignmentNote(
                        $hebrewSegments,
                        $transliterationSegments,
                        $translationSegments,
                        $strongSegments,
                        $grammarSegments,
                        $expandedSegments
                    ),
                ]),
                contextualFunction: $this->nullableString($translation),
                raw: $row + [
                    '_row_number' => $rowNumber,
                    '_text_type' => $reference['text_type'],
                    '_hebrew_reference' => $reference['hebrew_reference'],
                    '_segment_index' => $index,
                    '_segment_separator' => $segment['separator'],
                    '_segment_token_type' => $tokenType,
                    '_segment_surface' => $surfaceForm,
                    '_segment_transliteration' => $this->parallelValue($transliterationSegments, $index, ''),
                    '_segment_translation' => $translation,
                    '_segment_dstrongs' => $strongRaw,
                    '_segment_grammar' => $this->parallelValue($grammarSegments, $index, ''),
                    '_segment_expanded_strong_tag' => $expandedRaw,
                ]
            );
        }

        return $rows;
    }

    /**
     * @return array{book_code: string, chapter: int, verse: int, word_order: int, text_type: string, hebrew_reference: string, source_ref: string}
     */
    private function parseReference(string $reference): array
    {
        if (preg_match('/^([^.]+)\.(\d+)\.(\d+)(?:\(([^)]*)\))?#(\d+)=([^\s]+)$/', $reference, $matches) !== 1) {
            throw new InvalidArgumentException('STEP TAHOT reference must use a format like Gen.1.1#01=L.');
        }

        return [
            'book_code' => $matches[1],
            'chapter' => (int) $matches[2],
            'verse' => (int) $matches[3],
            'word_order' => (int) $matches[5],
            'text_type' => $matches[6],
            'hebrew_reference' => $matches[4] ?? '',
            'source_ref' => $reference,
        ];
    }

    /**
     * @return array<int, array{value: string, separator: string}>
     */
    private function splitSegments(string $value): array
    {
        $value = trim($value);
        if ($value === '') {
            return [];
        }

        $parts = preg_split('/([\/\\\\])/', $value, -1, PREG_SPLIT_DELIM_CAPTURE);
        if ($parts === false) {
            return [['value' => $value, 'separator' => '']];
        }

        $segments = [];
        $separator = '';

        foreach ($parts as $part) {
            if ($part === '/' || $part === '\\') {
                $separator = $part;
                continue;
            }

            if ($part === '') {
                continue;
            }

            $segments[] = [
                'value' => $part,
                'separator' => $separator,
            ];
            $separator = '';
        }

        return $segments;
    }

    /**
     * @param array<int, array{value: string, separator: string}> $hebrewSegments
     * @param array<int, array{value: string, separator: string}> $strongSegments
     * @param array<int, array{value: string, separator: string}> $expandedSegments
     */
    private function findWordSegmentIndex(array $hebrewSegments, array $strongSegments, array $expandedSegments): int
    {
        foreach ($hebrewSegments as $index => $segment) {
            if ($this->isPunctuationSegment($segment)) {
                continue;
            }

            $strongValue = $this->parallelValue($strongSegments, $index, '');
            $expandedValue = $this->parallelValue($expandedSegments, $index, '');
            if (str_contains($strongValue, '{') || str_starts_with(trim($expandedValue), '{')) {
                return $index;
            }
        }

        foreach ($hebrewSegments as $index => $segment) {
            if (! $this->isPunctuationSegment($segment)) {
                return $index;
            }
        }

        return 0;
    }

    /**
     * @param array{value: string, separator: string} $segment
     */
    private function resolveTokenType(array $segment, int $index, int $wordSegmentIndex): string
    {
        if ($this->isPunctuationSegment($segment)) {
            return OriginalWordOccurrence::TOKEN_PUNCTUATION;
        }

        if ($index < $wordSegmentIndex) {
            return OriginalWordOccurrence::TOKEN_PREFIX;
        }

        if ($index === $wordSegmentIndex) {
            return OriginalWordOccurrence::TOKEN_WORD;
        }

        return OriginalWordOccurrence::TOKEN_SUFFIX;
    }

    /**
     * @param array{value: string, separator: string} $segment
     */
    private function isPunctuationSegment(array $segment): bool
    {
        $value = $this->normalizeWhitespace($segment['value']);

        return $segment['separator'] === '\\' || preg_match('/^[\p{P}\x{05BE}\x{05C3}]+$/u', $value) === 1;
    }

    /**
     * @return array{strong_raw: string, lemma: string, gloss: ?string, definition: ?string}
     */
    private function parseExpandedStrongTag(string $value): array
    {
        $value = $this->stripSourceWrappers($value);
        if ($value === '') {
            return [
                'strong_raw' => '',
                'lemma' => '',
                'gloss' => null,
                'definition' => null,
            ];
        }

        [$strongRaw, $rest] = $this->splitFirst($value, '=');
        [$lemma, $glossValue] = $this->splitFirst($rest, '=');
        [$gloss, $definition] = $this->splitDefinition($glossValue);

        return [
            'strong_raw' => $strongRaw,
            'lemma' => $this->normalizeWhitespace($lemma),
            'gloss' => $this->nullableString($gloss),
            'definition' => $this->nullableString($definition),
        ];
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function splitDefinition(string $value): array
    {
        if (! str_contains($value, '»')) {
            return [ltrim($this->normalizeWhitespace($value), ': '), ''];
        }

        [$gloss, $definition] = $this->splitFirst($value, '»');

        return [ltrim($gloss, ': '), $definition];
    }

    private function normalizeBaseStrongs(string $strongs): string
    {
        $strongs = $this->stripSourceWrappers($strongs);
        if (preg_match('/([HG])0*(\d+)/i', $strongs, $matches) !== 1) {
            return '';
        }

        return strtoupper($matches[1]) . (string) ((int) $matches[2]);
    }

    private function normalizeExtendedStrongs(string $strongs): string
    {
        $strongs = $this->stripSourceWrappers($strongs);
        if (preg_match('/([HG]\d+[A-Z])(?:_[A-Z])?/i', $strongs, $matches) !== 1) {
            return '';
        }

        return strtoupper($matches[1]);
    }

    private function normalizeRoot(string $root): string
    {
        $root = $this->stripSourceWrappers($root);
        if (preg_match('/([HG]\d+[A-Z]?)(?:_[A-Z])?/i', $root, $matches) !== 1) {
            return '';
        }

        return strtoupper($matches[1]);
    }

    /**
     * @param array<string, mixed> $row
     * @param array<string, mixed> $context
     */
    private function buildGrammarNote(array $row, array $context): ?string
    {
        $notes = [];

        foreach (self::GRAMMAR_NOTE_FIELDS as $field) {
            $value = $this->stringValue($row, $field);
            if ($value !== '') {
                $notes[] = $field . ': ' . $this->normalizeWhitespace($value);
            }
        }

        foreach ($context as $key => $value) {
            if (is_scalar($value) && trim((string) $value) !== '') {
                $notes[] = $key . ': ' . $this->normalizeWhitespace((string) $value);
            }
        }

        return $notes === [] ? null : implode("\n", $notes);
    }

    /**
     * @param array<int, array{value: string, separator: string}> ...$segmentGroups
     */
    private function buildAlignmentNote(array ...$segmentGroups): string
    {
        $counts = array_map('count', $segmentGroups);
        $nonEmptyCounts = array_values(array_filter($counts, static fn (int $count): bool => $count > 0));

        if ($nonEmptyCounts === [] || count(array_unique($nonEmptyCounts)) === 1) {
            return '';
        }

        return 'TAHOT segment alignment differs across source fields.';
    }

    /**
     * @param array<int, array{value: string, separator: string}> $segments
     */
    private function parallelValue(array $segments, int $index, string $fallback): string
    {
        if (isset($segments[$index])) {
            return $this->normalizeWhitespace($segments[$index]['value']);
        }

        if (count($segments) === 1) {
            return $this->normalizeWhitespace($segments[0]['value']);
        }

        return $this->normalizeWhitespace($fallback);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function splitFirst(string $value, string $separator): array
    {
        $position = strpos($value, $separator);
        if ($position === false) {
            return [$this->normalizeWhitespace($value), ''];
        }

        return [
            $this->normalizeWhitespace(substr($value, 0, $position)),
            $this->normalizeWhitespace(substr($value, $position + strlen($separator))),
        ];
    }

    /**
     * @param array<string, mixed> $row
     */
    private function requiredStringValue(array $row, string $field): string
    {
        $value = $this->stringValue($row, $field);
        if ($value === '') {
            throw new InvalidArgumentException(sprintf('STEP TAHOT field is required: %s.', $field));
        }

        return $value;
    }

    /**
     * @param array<string, mixed> $row
     */
    private function stringValue(array $row, string $field): string
    {
        $value = $row[$field] ?? '';

        if (is_scalar($value)) {
            return trim((string) $value);
        }

        return '';
    }

    private function nullableString(string $value): ?string
    {
        $value = $this->normalizeWhitespace($value);

        return $value === '' ? null : $value;
    }

    private function stripSourceWrappers(string $value): string
    {
        $value = $this->normalizeWhitespace($value);
        $value = trim($value, '{}');

        return ltrim($value, '\\/');
    }

    private function normalizeSearchText(string $value): string
    {
        return $this->normalizeWhitespace($value);
    }

    private function normalizeWhitespace(string $value): string
    {
        $trimmed = trim($value);
        $normalized = preg_replace('/\s+/u', ' ', $trimmed);

        return $normalized ?? $trimmed;
    }
}
