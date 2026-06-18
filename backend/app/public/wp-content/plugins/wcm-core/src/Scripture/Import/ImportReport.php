<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

final readonly class ImportReport
{
    /**
     * @param KrvImportIssue[] $issues
     */
    public function __construct(
        public int $totalRows,
        public int $importedRows,
        public int $skippedRows,
        public int $failedRows,
        public array $issues = []
    ) {
    }

    public function ok(): bool
    {
        foreach ($this->issues as $issue) {
            if ($issue->severity === KrvImportIssue::SEVERITY_ERROR) {
                return false;
            }
        }

        return true;
    }
}
