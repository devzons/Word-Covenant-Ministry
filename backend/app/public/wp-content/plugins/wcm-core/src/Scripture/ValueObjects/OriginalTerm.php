<?php

declare(strict_types=1);

namespace WCM\Scripture\ValueObjects;

use InvalidArgumentException;

final readonly class OriginalTerm
{
    public const LANGUAGE_HEBREW = 'hebrew';
    public const LANGUAGE_GREEK = 'greek';

    /**
     * @var string[]
     */
    public const ALLOWED_LANGUAGE_TYPES = [
        self::LANGUAGE_HEBREW,
        self::LANGUAGE_GREEK,
    ];

    public ?int $id;
    public string $languageType;
    public string $lemma;
    public string $lemmaNormalized;
    public string $strongsNumber;
    public string $strongsExtended;
    public string $transliteration;
    public ?string $transliterationKo;
    public string $root;
    public ?string $gloss;
    public ?string $definition;

    public function __construct(
        ?int $id,
        string $languageType,
        string $lemma,
        string $lemmaNormalized,
        string $strongsNumber = '',
        string $strongsExtended = '',
        string $transliteration = '',
        ?string $transliterationKo = null,
        string $root = '',
        ?string $gloss = null,
        ?string $definition = null
    ) {
        $languageType = trim($languageType);
        $lemma = trim($lemma);
        $lemmaNormalized = trim($lemmaNormalized);
        $strongsNumber = trim($strongsNumber);
        $strongsExtended = trim($strongsExtended);
        $transliteration = trim($transliteration);
        $transliterationKo = $transliterationKo === null ? null : trim($transliterationKo);
        $root = trim($root);

        if ($id !== null && $id < 1) {
            throw new InvalidArgumentException('Original term ID must be greater than zero when provided.');
        }

        if (! in_array($languageType, self::ALLOWED_LANGUAGE_TYPES, true)) {
            throw new InvalidArgumentException('Original term language type must be hebrew or greek.');
        }

        if ($lemma === '') {
            throw new InvalidArgumentException('Original term lemma must not be empty.');
        }

        if ($lemmaNormalized === '') {
            throw new InvalidArgumentException('Original term normalized lemma must not be empty.');
        }

        if ($strongsNumber !== '' && preg_match('/^[HG]\d+$/', $strongsNumber) !== 1) {
            throw new InvalidArgumentException('Original term Strong\'s number must use a format like H7225 or G3056.');
        }

        $this->id = $id;
        $this->languageType = $languageType;
        $this->lemma = $lemma;
        $this->lemmaNormalized = $lemmaNormalized;
        $this->strongsNumber = $strongsNumber;
        $this->strongsExtended = $strongsExtended;
        $this->transliteration = $transliteration;
        $this->transliterationKo = $transliterationKo;
        $this->root = $root;
        $this->gloss = $gloss;
        $this->definition = $definition;
    }
}
