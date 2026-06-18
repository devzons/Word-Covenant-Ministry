<?php

declare(strict_types=1);

namespace WCM\Scripture\Validators;

use WCM\Scripture\ValueObjects\OriginalTerm;

final class OriginalTermValidator
{
    /**
     * @return string[]
     */
    public function validate(OriginalTerm $term): array
    {
        $errors = [];

        if ($term->id !== null && $term->id < 1) {
            $errors[] = 'id must be greater than zero when provided.';
        }

        if (! $this->validateLanguageType($term->languageType)) {
            $errors[] = 'language_type must be hebrew or greek.';
        }

        if (trim($term->lemma) === '') {
            $errors[] = 'lemma is required.';
        }

        if (trim($term->lemmaNormalized) === '') {
            $errors[] = 'lemma_normalized is required.';
        }

        if (! $this->validateStrongsNumber($term->strongsNumber)) {
            $errors[] = 'Invalid Strong\'s number format.';
        }

        return $errors;
    }

    public function buildIdentityKey(OriginalTerm $term): string
    {
        return implode('|', [
            $term->languageType,
            $term->lemmaNormalized,
            $term->strongsNumber,
            $term->strongsExtended,
        ]);
    }

    public function validateStrongsNumber(string $strongsNumber): bool
    {
        $strongsNumber = trim($strongsNumber);

        return $strongsNumber === '' || preg_match('/^[HG]\d+$/', $strongsNumber) === 1;
    }

    public function validateLanguageType(string $languageType): bool
    {
        return in_array(trim($languageType), OriginalTerm::ALLOWED_LANGUAGE_TYPES, true);
    }
}
