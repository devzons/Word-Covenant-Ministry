<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final readonly class OriginalLanguageImportIssue
{
    public const SEVERITY_INFO = 'info';
    public const SEVERITY_WARNING = 'warning';
    public const SEVERITY_ERROR = 'error';

    private const ALLOWED_SEVERITIES = [
        self::SEVERITY_INFO,
        self::SEVERITY_WARNING,
        self::SEVERITY_ERROR,
    ];

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $severity,
        public string $code,
        public string $message,
        public array $context = []
    ) {
        if (! in_array($this->severity, self::ALLOWED_SEVERITIES, true)) {
            throw new InvalidArgumentException('Original language import issue severity must be info, warning, or error.');
        }

        if (trim($this->code) === '') {
            throw new InvalidArgumentException('Original language import issue code is required.');
        }

        if (trim($this->message) === '') {
            throw new InvalidArgumentException('Original language import issue message is required.');
        }
    }

    /**
     * @return array{severity: string, code: string, message: string, context: array<string, mixed>}
     */
    public function toArray(): array
    {
        return [
            'severity' => $this->severity,
            'code' => $this->code,
            'message' => $this->message,
            'context' => $this->context,
        ];
    }
}
