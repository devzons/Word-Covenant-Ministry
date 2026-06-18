<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final readonly class OriginalLanguageNormalizedRow
{
    /**
     * @param array<string, mixed> $raw
     */
    public function __construct(
        public string $sourceDataset,
        public string $sourceRef,
        public string $languageType,
        public string $bookCode,
        public int $chapter,
        public int $verse,
        public int $wordOrder,
        public int $subwordOrder,
        public string $tokenType,
        public string $surfaceForm,
        public string $normalizedForm,
        public string $lemma,
        public string $lemmaNormalized,
        public string $strongsNumber = '',
        public string $strongsExtended = '',
        public string $transliteration = '',
        public string $root = '',
        public ?string $gloss = null,
        public ?string $definition = null,
        public string $morphology = '',
        public ?string $grammarSummary = null,
        public ?string $grammarNote = null,
        public ?string $contextualFunction = null,
        public array $raw = []
    ) {
        if (! in_array(trim($this->sourceDataset), OriginalWordOccurrence::ALLOWED_SOURCE_DATASETS, true)) {
            throw new InvalidArgumentException('Original language normalized row source dataset is not allowed.');
        }

        if (! in_array(trim($this->languageType), OriginalTerm::ALLOWED_LANGUAGE_TYPES, true)) {
            throw new InvalidArgumentException('Original language normalized row language type is not allowed.');
        }

        if (trim($this->bookCode) === '') {
            throw new InvalidArgumentException('Original language normalized row book code is required.');
        }

        if ($this->chapter < 1) {
            throw new InvalidArgumentException('Original language normalized row chapter must be greater than zero.');
        }

        if ($this->verse < 1) {
            throw new InvalidArgumentException('Original language normalized row verse must be greater than zero.');
        }

        if ($this->wordOrder < 1) {
            throw new InvalidArgumentException('Original language normalized row word order must be greater than zero.');
        }

        if ($this->subwordOrder < 0) {
            throw new InvalidArgumentException('Original language normalized row subword order must be zero or greater.');
        }

        if (! in_array(trim($this->tokenType), OriginalWordOccurrence::ALLOWED_TOKEN_TYPES, true)) {
            throw new InvalidArgumentException('Original language normalized row token type is not allowed.');
        }

        if (trim($this->surfaceForm) === '') {
            throw new InvalidArgumentException('Original language normalized row surface form is required.');
        }

        if (trim($this->lemma) === '') {
            throw new InvalidArgumentException('Original language normalized row lemma is required.');
        }

        if (trim($this->lemmaNormalized) === '') {
            throw new InvalidArgumentException('Original language normalized row normalized lemma is required.');
        }

        if (trim($this->strongsNumber) !== '' && preg_match('/^[HG]\d+$/', trim($this->strongsNumber)) !== 1) {
            throw new InvalidArgumentException('Original language normalized row Strong\'s number must use a format like H7225 or G3056.');
        }
    }

    /**
     * @return array{
     *     source_dataset: string,
     *     source_ref: string,
     *     language_type: string,
     *     book_code: string,
     *     chapter: int,
     *     verse: int,
     *     word_order: int,
     *     subword_order: int,
     *     token_type: string,
     *     surface_form: string,
     *     normalized_form: string,
     *     lemma: string,
     *     lemma_normalized: string,
     *     strongs_number: string,
     *     strongs_extended: string,
     *     transliteration: string,
     *     root: string,
     *     gloss: ?string,
     *     definition: ?string,
     *     morphology: string,
     *     grammar_summary: ?string,
     *     grammar_note: ?string,
     *     contextual_function: ?string,
     *     raw: array<string, mixed>
     * }
     */
    public function toArray(): array
    {
        return [
            'source_dataset' => $this->sourceDataset,
            'source_ref' => $this->sourceRef,
            'language_type' => $this->languageType,
            'book_code' => $this->bookCode,
            'chapter' => $this->chapter,
            'verse' => $this->verse,
            'word_order' => $this->wordOrder,
            'subword_order' => $this->subwordOrder,
            'token_type' => $this->tokenType,
            'surface_form' => $this->surfaceForm,
            'normalized_form' => $this->normalizedForm,
            'lemma' => $this->lemma,
            'lemma_normalized' => $this->lemmaNormalized,
            'strongs_number' => $this->strongsNumber,
            'strongs_extended' => $this->strongsExtended,
            'transliteration' => $this->transliteration,
            'root' => $this->root,
            'gloss' => $this->gloss,
            'definition' => $this->definition,
            'morphology' => $this->morphology,
            'grammar_summary' => $this->grammarSummary,
            'grammar_note' => $this->grammarNote,
            'contextual_function' => $this->contextualFunction,
            'raw' => $this->raw,
        ];
    }
}
