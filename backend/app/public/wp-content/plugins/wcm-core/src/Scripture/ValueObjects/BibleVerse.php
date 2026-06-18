<?php

declare(strict_types=1);

namespace WCM\Scripture\ValueObjects;

use InvalidArgumentException;

final readonly class BibleVerse
{
    public function __construct(
        public int $versionId,
        public int $bookId,
        public int $chapter,
        public int $verse,
        public string $text
    ) {
        if ($this->versionId < 1) {
            throw new InvalidArgumentException('Bible verse version ID must be greater than zero.');
        }

        if ($this->bookId < 1) {
            throw new InvalidArgumentException('Bible verse book ID must be greater than zero.');
        }

        if ($this->chapter < 1) {
            throw new InvalidArgumentException('Bible verse chapter must be greater than zero.');
        }

        if ($this->verse < 1) {
            throw new InvalidArgumentException('Bible verse number must be greater than zero.');
        }

        if (trim($this->text) === '') {
            throw new InvalidArgumentException('Bible verse text must not be empty.');
        }
    }
}
