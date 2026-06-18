<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final readonly class ImportRow
{
    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $versionCode,
        public int $bookOrder,
        public int $chapter,
        public int $verse,
        public string $text,
        public array $context = []
    ) {
        if (trim($this->versionCode) === '') {
            throw new InvalidArgumentException('Import row version code must not be empty.');
        }
    }

    /**
     * @return array{book_order: int, chapter: int, verse: int, text: string}
     */
    public function toValidatorRow(): array
    {
        return [
            'book_order' => $this->bookOrder,
            'chapter' => $this->chapter,
            'verse' => $this->verse,
            'text' => $this->text,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return $this->context + [
            'version_code' => $this->versionCode,
            'book_order' => $this->bookOrder,
            'chapter' => $this->chapter,
            'verse' => $this->verse,
        ];
    }
}
