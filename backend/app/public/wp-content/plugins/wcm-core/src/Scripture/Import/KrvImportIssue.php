<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final readonly class KrvImportIssue
{
    public const SEVERITY_ERROR = 'error';
    public const SEVERITY_WARNING = 'warning';

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $severity,
        public string $code,
        public string $message,
        public array $context = []
    ) {
        if (! in_array($this->severity, [self::SEVERITY_ERROR, self::SEVERITY_WARNING], true)) {
            throw new InvalidArgumentException('KRV import issue severity must be error or warning.');
        }

        if (trim($this->code) === '') {
            throw new InvalidArgumentException('KRV import issue code must not be empty.');
        }

        if (trim($this->message) === '') {
            throw new InvalidArgumentException('KRV import issue message must not be empty.');
        }
    }
}
