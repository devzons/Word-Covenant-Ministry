<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class StepTagntNormalizer implements OriginalLanguageNormalizerInterface
{
    private const FIELD_WORD_AND_TYPE = 'Word & Type';
    private const FIELD_GREEK = 'Greek';
    private const FIELD_ENGLISH_TRANSLATION = 'English translation';
    private const FIELD_DSTRONGS_GRAMMAR = 'dStrongs = Grammar';
    private const FIELD_DICTIONARY_GLOSS = 'Dictionary form = Gloss';
    private const FIELD_EDITIONS = 'editions';

    /**
     * @var string[]
     */
    private const GRAMMAR_NOTE_FIELDS = [
        'Meaning variants',
        'Spelling variants',
        'Spanish translation',
        'Sub-meaning',
        'Conjoin word',
        'sStrong+Instance',
        'Alt Strongs',
    ];

    public function supports(string $sourceDataset): bool
    {
        return trim($sourceDataset) === OriginalWordOccurrence::SOURCE_STEP_TAGNT;
    }

    /**
     * @param array<string, mixed> $row
     * @return iterable<OriginalLanguageNormalizedRow>
     */
    public function normalizeRow(array $row, int $rowNumber): iterable
    {
        $normalizedRow = $this->normalizeRowKeys($row);
        $editionTokens = $this->parseEditionTokens($this->stringValue($row, self::FIELD_EDITIONS));
        if (! in_array('SBL', $editionTokens, true)) {
            return [];
        }

        $wordReference = $this->parseWordAndType($this->requiredStringValue($normalizedRow, self::FIELD_WORD_AND_TYPE));
        $greek = $this->parseGreek($this->requiredStringValue($normalizedRow, self::FIELD_GREEK));
        $strongsAndGrammar = $this->parseDStrongsAndGrammar(
            $this->stringValue($normalizedRow, self::FIELD_DSTRONGS_GRAMMAR)
        );
        $dictionary = $this->parseDictionaryAndGloss(
            $this->requiredStringValue($normalizedRow, self::FIELD_DICTIONARY_GLOSS)
        );
        $contextualFunction = $this->nullableString($this->stringValue($normalizedRow, self::FIELD_ENGLISH_TRANSLATION));

        return [
            new OriginalLanguageNormalizedRow(
                sourceDataset: OriginalWordOccurrence::SOURCE_STEP_TAGNT,
                sourceRef: OriginalWordOccurrence::SOURCE_STEP_TAGNT . ':' . $wordReference['source_ref'],
                languageType: OriginalTerm::LANGUAGE_GREEK,
                bookCode: $wordReference['book_code'],
                chapter: $wordReference['chapter'],
                verse: $wordReference['verse'],
                wordOrder: $wordReference['word_order'],
                subwordOrder: 0,
                tokenType: OriginalWordOccurrence::TOKEN_WORD,
                surfaceForm: $greek['surface_form'],
                normalizedForm: $this->normalizeSearchText($greek['surface_form']),
                lemma: $dictionary['lemma'],
                lemmaNormalized: $this->normalizeSearchText($dictionary['lemma']),
                strongsNumber: $strongsAndGrammar['strongs_number'],
                strongsExtended: $strongsAndGrammar['strongs_extended'],
                transliteration: $greek['transliteration'],
                root: '',
                gloss: $dictionary['gloss'] ?? $contextualFunction,
                definition: null,
                morphology: $strongsAndGrammar['morphology'],
                grammarSummary: null,
                grammarNote: $this->buildGrammarNote($normalizedRow),
                contextualFunction: $contextualFunction,
                raw: $row + [
                    '_row_number' => $rowNumber,
                    '_word_type' => $wordReference['word_type'],
                    '_alternate_reference_marker' => $wordReference['alternate_reference_marker'],
                    '_alternate_reference_type' => $wordReference['alternate_reference_type'],
                    '_alternate_reference' => $wordReference['alternate_reference'],
                    '_edition_tokens' => $editionTokens,
                    '_selected_greek_strongs' => $strongsAndGrammar['selected_greek_strongs'],
                ]
            ),
        ];
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function normalizeRowKeys(array $row): array
    {
        $normalized = [];

        foreach ($row as $key => $value) {
            if (! is_string($key)) {
                continue;
            }

            $normalized[$this->canonicalFieldName($key)] = $value;
        }

        return $row + $normalized;
    }

    private function canonicalFieldName(string $field): string
    {
        $field = trim($field);
        $field = preg_replace('/\s*=\s*/u', ' = ', $field) ?? $field;
        $field = preg_replace('/\s+/u', ' ', $field) ?? $field;

        return trim($field);
    }

    /**
     * @return array{
     *     book_code: string,
     *     chapter: int,
     *     verse: int,
     *     word_order: int,
     *     word_type: string,
     *     source_ref: string,
     *     alternate_reference_marker: string,
     *     alternate_reference_type: string,
     *     alternate_reference: string
     * }
     */
    private function parseWordAndType(string $wordAndType): array
    {
        if (preg_match('/^([^.]+)\.(\d+)\.(\d+)(?:([\{\[\(])(\d+\.\d+)([\}\]\)]))?#(\d+)=([^\s]+)$/', $wordAndType, $matches) !== 1) {
            throw new InvalidArgumentException('STEP TAGNT Word & Type must use a format like Mat.1.1#01=NKO.');
        }

        $alternateMarker = $matches[4] ?? '';

        return [
            'book_code' => $matches[1],
            'chapter' => (int) $matches[2],
            'verse' => (int) $matches[3],
            'word_order' => (int) $matches[7],
            'word_type' => $matches[8],
            'source_ref' => $wordAndType,
            'alternate_reference_marker' => $alternateMarker,
            'alternate_reference_type' => $this->alternateReferenceType($alternateMarker),
            'alternate_reference' => $matches[5] ?? '',
        ];
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

    /**
     * @return array{surface_form: string, transliteration: string}
     */
    private function parseGreek(string $greek): array
    {
        if (preg_match('/^(.*?)\s*\(([^()]*)\)\s*$/u', $greek, $matches) === 1) {
            return [
                'surface_form' => $this->normalizeWhitespace($matches[1]),
                'transliteration' => $this->normalizeWhitespace($matches[2]),
            ];
        }

        return [
            'surface_form' => $this->normalizeWhitespace($greek),
            'transliteration' => '',
        ];
    }

    /**
     * @return array{strongs_number: string, strongs_extended: string, morphology: string, selected_greek_strongs: string}
     */
    private function parseDStrongsAndGrammar(string $value): array
    {
        [$strongsPart, $morphology] = $this->splitFirst($value, '=');
        $selectedGreekStrongs = $this->selectGreekStrongs($strongsPart);

        return [
            'strongs_number' => $selectedGreekStrongs === '' ? '' : $this->normalizeBaseStrongs($selectedGreekStrongs),
            'strongs_extended' => $this->normalizeExtendedStrongs($selectedGreekStrongs),
            'morphology' => $this->normalizeWhitespace($morphology),
            'selected_greek_strongs' => $selectedGreekStrongs,
        ];
    }

    /**
     * @return array{lemma: string, gloss: ?string}
     */
    private function parseDictionaryAndGloss(string $value): array
    {
        [$lemma, $gloss] = $this->splitFirst($value, '=');
        $lemma = $this->normalizeWhitespace($lemma);

        if ($lemma === '') {
            throw new InvalidArgumentException('STEP TAGNT Dictionary form must include a lemma.');
        }

        return [
            'lemma' => $lemma,
            'gloss' => $this->nullableString($gloss),
        ];
    }

    /**
     * @return string[]
     */
    private function parseEditionTokens(string $editions): array
    {
        if (trim($editions) === '') {
            return [];
        }

        $tokens = preg_split('/[+\s,;]+/', trim($editions)) ?: [];
        $tokens = array_map(static fn (string $token): string => trim($token), $tokens);
        $tokens = array_filter($tokens, static fn (string $token): bool => $token !== '');

        return array_values(array_unique($tokens));
    }

    private function selectGreekStrongs(string $strongsPart): string
    {
        if (preg_match_all('/G\d+[A-Z]?/i', $strongsPart, $matches) !== false && $matches[0] !== []) {
            return strtoupper((string) end($matches[0]));
        }

        return '';
    }

    private function normalizeBaseStrongs(string $strongs): string
    {
        if (preg_match('/^([HG])0*(\d+)/i', $strongs, $matches) !== 1) {
            return '';
        }

        return strtoupper($matches[1]) . (string) ((int) $matches[2]);
    }

    private function normalizeExtendedStrongs(string $strongs): string
    {
        $strongs = strtoupper(trim($strongs));

        return preg_match('/^[HG]\d+[A-Z]$/', $strongs) === 1 ? $strongs : '';
    }

    /**
     * @param array<string, mixed> $row
     */
    private function buildGrammarNote(array $row): ?string
    {
        $notes = [];

        foreach (self::GRAMMAR_NOTE_FIELDS as $field) {
            $value = $this->stringValue($row, $field);
            if (trim($value) !== '') {
                $notes[] = $field . ': ' . $this->normalizeWhitespace($value);
            }
        }

        return $notes === [] ? null : implode("\n", $notes);
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
        if (trim($value) === '') {
            throw new InvalidArgumentException(sprintf('STEP TAGNT field is required: %s.', $field));
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

    private function normalizeSearchText(string $value): string
    {
        $value = $this->normalizeWhitespace($value);

        if (function_exists('mb_strtolower')) {
            return mb_strtolower($value, 'UTF-8');
        }

        return strtolower($value);
    }

    private function normalizeWhitespace(string $value): string
    {
        $trimmed = trim($value);
        $normalized = preg_replace('/\s+/u', ' ', $trimmed);

        return $normalized ?? $trimmed;
    }
}
