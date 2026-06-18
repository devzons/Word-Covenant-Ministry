<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

final class KrvImportValidator
{
    private const MIN_BOOK_ORDER = 1;
    private const MAX_BOOK_ORDER = 66;
    private const PSALMS_BOOK_ORDER = 19;
    private const PSALM_72 = 72;
    private const PSALM_72_20 = 20;

    /**
     * Expected row shape:
     * [
     *   'book_order' => int,
     *   'chapter' => int,
     *   'verse' => int,
     *   'text' => string,
     * ]
     *
     * @param array<string, mixed> $row
     * @return KrvImportIssue[]
     */
    public function validateRow(array $row): array
    {
        $issues = [];

        $issues = array_merge(
            $issues,
            $this->validateIntegerField($row, 'book_order'),
            $this->validateIntegerField($row, 'chapter'),
            $this->validateIntegerField($row, 'verse'),
            $this->validateTextField($row)
        );

        if ($issues !== []) {
            return $issues;
        }

        $bookOrder = $row['book_order'];
        $chapter = $row['chapter'];
        $verse = $row['verse'];
        $text = $row['text'];

        if ($bookOrder === 0) {
            $issues[] = $this->error(
                'metadata_row',
                'KRV metadata rows must be rejected before BibleVerse construction.',
                $row
            );
        } elseif ($bookOrder < self::MIN_BOOK_ORDER || $bookOrder > self::MAX_BOOK_ORDER) {
            $issues[] = $this->error(
                'invalid_book_order',
                'KRV book_order must be between 1 and 66.',
                $row
            );
        }

        if ($chapter < 1) {
            $issues[] = $this->error(
                'invalid_chapter',
                'KRV chapter must be greater than or equal to 1.',
                $row
            );
        }

        if ($verse < 1) {
            $issues[] = $this->error(
                'invalid_verse',
                'KRV verse must be greater than or equal to 1.',
                $row
            );
        }

        if (trim($text) === '') {
            $issues[] = $this->emptyTextIssue($bookOrder, $chapter, $verse, $row);
        }

        return $issues;
    }

    /**
     * @param array<string, mixed> $row
     * @return KrvImportIssue[]
     */
    private function validateIntegerField(array $row, string $field): array
    {
        if (! array_key_exists($field, $row)) {
            return [
                $this->error(
                    'missing_' . $field,
                    'KRV normalized row is missing required field: ' . $field . '.',
                    $row
                ),
            ];
        }

        if (! is_int($row[$field])) {
            return [
                $this->error(
                    'invalid_' . $field . '_type',
                    'KRV normalized field must be an integer: ' . $field . '.',
                    $row
                ),
            ];
        }

        return [];
    }

    /**
     * @param array<string, mixed> $row
     * @return KrvImportIssue[]
     */
    private function validateTextField(array $row): array
    {
        if (! array_key_exists('text', $row)) {
            return [
                $this->error(
                    'missing_text',
                    'KRV normalized row is missing required field: text.',
                    $row
                ),
            ];
        }

        if (! is_string($row['text'])) {
            return [
                $this->error(
                    'invalid_text_type',
                    'KRV normalized text field must be a string.',
                    $row
                ),
            ];
        }

        return [];
    }

    /**
     * @param array<string, mixed> $context
     */
    private function emptyTextIssue(int $bookOrder, int $chapter, int $verse, array $context): KrvImportIssue
    {
        if (
            $bookOrder === self::PSALMS_BOOK_ORDER
            && $chapter === self::PSALM_72
            && $verse === self::PSALM_72_20
        ) {
            return $this->error(
                'psalm_72_20_empty_text',
                'KRV Psalm 72:20 has empty text and requires manual review before production import.',
                $context
            );
        }

        return $this->error(
            'empty_text',
            'KRV verse text must not be empty.',
            $context
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    private function error(string $code, string $message, array $context): KrvImportIssue
    {
        return new KrvImportIssue(KrvImportIssue::SEVERITY_ERROR, $code, $message, $context);
    }
}
