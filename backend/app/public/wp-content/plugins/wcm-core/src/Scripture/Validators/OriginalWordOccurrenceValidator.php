<?php

declare(strict_types=1);

namespace WCM\Scripture\Validators;

use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class OriginalWordOccurrenceValidator
{
    /**
     * @return string[]
     */
    public function validate(OriginalWordOccurrence $occurrence): array
    {
        $errors = [];

        if ($occurrence->id !== null && $occurrence->id < 1) {
            $errors[] = 'id must be greater than zero when provided.';
        }

        if ($occurrence->termId < 1) {
            $errors[] = 'term_id must be greater than zero.';
        }

        if ($occurrence->bookId < 1) {
            $errors[] = 'book_id must be greater than zero.';
        }

        if ($occurrence->chapter < 1) {
            $errors[] = 'chapter must be greater than or equal to 1.';
        }

        if ($occurrence->verse < 1) {
            $errors[] = 'verse must be greater than or equal to 1.';
        }

        if ($occurrence->wordOrder < 1) {
            $errors[] = 'word_order must be greater than or equal to 1.';
        }

        if ($occurrence->subwordOrder < 0) {
            $errors[] = 'subword_order must be greater than or equal to 0.';
        }

        if (! $this->validateTokenType($occurrence->tokenType)) {
            $errors[] = 'token_type is not allowed.';
        }

        if (trim($occurrence->surfaceForm) === '') {
            $errors[] = 'surface_form is required.';
        }

        if (! $this->validateSourceDataset($occurrence->sourceDataset)) {
            $errors[] = 'source_dataset is not allowed.';
        }

        return $errors;
    }

    public function buildIdentityKey(OriginalWordOccurrence $occurrence): string
    {
        return implode('|', [
            $occurrence->sourceDataset,
            (string) $occurrence->bookId,
            (string) $occurrence->chapter,
            (string) $occurrence->verse,
            (string) $occurrence->wordOrder,
            (string) $occurrence->subwordOrder,
            $occurrence->tokenType,
        ]);
    }

    public function validateTokenType(string $tokenType): bool
    {
        return in_array(trim($tokenType), OriginalWordOccurrence::ALLOWED_TOKEN_TYPES, true);
    }

    public function validateSourceDataset(string $sourceDataset): bool
    {
        return in_array(trim($sourceDataset), OriginalWordOccurrence::ALLOWED_SOURCE_DATASETS, true);
    }
}
