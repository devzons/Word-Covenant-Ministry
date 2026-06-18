<?php

declare(strict_types=1);

namespace WCM\Scripture\ValueObjects;

use InvalidArgumentException;

final readonly class OriginalWordOccurrence
{
    public const TOKEN_WORD = 'word';
    public const TOKEN_PREFIX = 'prefix';
    public const TOKEN_SUFFIX = 'suffix';
    public const TOKEN_PUNCTUATION = 'punctuation';
    public const TOKEN_VARIANT = 'variant';

    public const SOURCE_STEP_TAHOT = 'STEP_TAHOT';
    public const SOURCE_STEP_TAGNT = 'STEP_TAGNT';

    /**
     * @var string[]
     */
    public const ALLOWED_TOKEN_TYPES = [
        self::TOKEN_WORD,
        self::TOKEN_PREFIX,
        self::TOKEN_SUFFIX,
        self::TOKEN_PUNCTUATION,
        self::TOKEN_VARIANT,
    ];

    /**
     * @var string[]
     */
    public const ALLOWED_SOURCE_DATASETS = [
        self::SOURCE_STEP_TAHOT,
        self::SOURCE_STEP_TAGNT,
    ];

    public ?int $id;
    public int $termId;
    public int $bookId;
    public int $chapter;
    public int $verse;
    public int $wordOrder;
    public int $subwordOrder;
    public string $tokenType;
    public string $surfaceForm;
    public string $normalizedForm;
    public string $morphology;
    public ?string $grammarSummary;
    public ?string $grammarNote;
    public ?string $contextualFunction;
    public string $sourceDataset;
    public string $sourceRef;

    public function __construct(
        ?int $id,
        int $termId,
        int $bookId,
        int $chapter,
        int $verse,
        int $wordOrder,
        int $subwordOrder,
        string $tokenType,
        string $surfaceForm,
        string $normalizedForm = '',
        string $morphology = '',
        ?string $grammarSummary = null,
        ?string $grammarNote = null,
        ?string $contextualFunction = null,
        string $sourceDataset = '',
        string $sourceRef = ''
    ) {
        $tokenType = trim($tokenType);
        $surfaceForm = trim($surfaceForm);
        $normalizedForm = trim($normalizedForm);
        $morphology = trim($morphology);
        $grammarSummary = $this->normalizeNullableString($grammarSummary);
        $grammarNote = $this->normalizeNullableString($grammarNote);
        $contextualFunction = $this->normalizeNullableString($contextualFunction);
        $sourceDataset = trim($sourceDataset);
        $sourceRef = trim($sourceRef);

        if ($id !== null && $id < 1) {
            throw new InvalidArgumentException('Original word occurrence ID must be greater than zero when provided.');
        }

        if ($termId < 1) {
            throw new InvalidArgumentException('Original word occurrence term ID must be greater than zero.');
        }

        if ($bookId < 1) {
            throw new InvalidArgumentException('Original word occurrence book ID must be greater than zero.');
        }

        if ($chapter < 1) {
            throw new InvalidArgumentException('Original word occurrence chapter must be greater than zero.');
        }

        if ($verse < 1) {
            throw new InvalidArgumentException('Original word occurrence verse must be greater than zero.');
        }

        if ($wordOrder < 1) {
            throw new InvalidArgumentException('Original word occurrence word order must be greater than zero.');
        }

        if ($subwordOrder < 0) {
            throw new InvalidArgumentException('Original word occurrence subword order must be zero or greater.');
        }

        if (! in_array($tokenType, self::ALLOWED_TOKEN_TYPES, true)) {
            throw new InvalidArgumentException('Original word occurrence token type is not allowed.');
        }

        if ($surfaceForm === '') {
            throw new InvalidArgumentException('Original word occurrence surface form must not be empty.');
        }

        if (! in_array($sourceDataset, self::ALLOWED_SOURCE_DATASETS, true)) {
            throw new InvalidArgumentException('Original word occurrence source dataset is not allowed.');
        }

        $this->id = $id;
        $this->termId = $termId;
        $this->bookId = $bookId;
        $this->chapter = $chapter;
        $this->verse = $verse;
        $this->wordOrder = $wordOrder;
        $this->subwordOrder = $subwordOrder;
        $this->tokenType = $tokenType;
        $this->surfaceForm = $surfaceForm;
        $this->normalizedForm = $normalizedForm;
        $this->morphology = $morphology;
        $this->grammarSummary = $grammarSummary;
        $this->grammarNote = $grammarNote;
        $this->contextualFunction = $contextualFunction;
        $this->sourceDataset = $sourceDataset;
        $this->sourceRef = $sourceRef;
    }

    private function normalizeNullableString(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
