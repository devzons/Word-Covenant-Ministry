<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final readonly class OriginalLanguageResolvedReference
{
    public const STATUS_RESOLVED = 'resolved';
    public const STATUS_PSALM_TITLE = 'psalm_title';
    public const STATUS_UNRESOLVED = 'unresolved_reference';

    /**
     * @var string[]
     */
    private const ALLOWED_STATUSES = [
        self::STATUS_RESOLVED,
        self::STATUS_PSALM_TITLE,
        self::STATUS_UNRESOLVED,
    ];

    /**
     * @param OriginalLanguageImportIssue[] $issues
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $status,
        public string $sourceBookCode,
        public int $sourceChapter,
        public int $sourceVerse,
        public ?string $resolvedBookCode,
        public ?int $resolvedChapter,
        public ?int $resolvedVerse,
        public array $issues = [],
        public array $context = []
    ) {
        if (! in_array($this->status, self::ALLOWED_STATUSES, true)) {
            throw new InvalidArgumentException('Resolved reference status is not allowed.');
        }

        if (trim($this->sourceBookCode) === '') {
            throw new InvalidArgumentException('Resolved reference source book code is required.');
        }

        if ($this->sourceChapter < 1) {
            throw new InvalidArgumentException('Resolved reference source chapter must be greater than zero.');
        }

        if ($this->sourceVerse < 0) {
            throw new InvalidArgumentException('Resolved reference source verse must be zero or greater.');
        }

        if ($this->status === self::STATUS_RESOLVED) {
            if (
                $this->resolvedBookCode === null
                || trim($this->resolvedBookCode) === ''
                || $this->resolvedChapter === null
                || $this->resolvedChapter < 1
                || $this->resolvedVerse === null
                || $this->resolvedVerse < 1
            ) {
                throw new InvalidArgumentException('Resolved references must include a valid canonical reference.');
            }
        }
    }

    public function isResolved(): bool
    {
        return $this->status === self::STATUS_RESOLVED;
    }

    /**
     * @return array{
     *     status: string,
     *     source_reference: array{book_code: string, chapter: int, verse: int},
     *     resolved_reference: array{book_code: ?string, chapter: ?int, verse: ?int},
     *     issues: array<int, array{severity: string, code: string, message: string, context: array<string, mixed>}>,
     *     context: array<string, mixed>
     * }
     */
    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'source_reference' => [
                'book_code' => $this->sourceBookCode,
                'chapter' => $this->sourceChapter,
                'verse' => $this->sourceVerse,
            ],
            'resolved_reference' => [
                'book_code' => $this->resolvedBookCode,
                'chapter' => $this->resolvedChapter,
                'verse' => $this->resolvedVerse,
            ],
            'issues' => array_map(
                static fn (OriginalLanguageImportIssue $issue): array => $issue->toArray(),
                $this->issues
            ),
            'context' => $this->context,
        ];
    }
}
