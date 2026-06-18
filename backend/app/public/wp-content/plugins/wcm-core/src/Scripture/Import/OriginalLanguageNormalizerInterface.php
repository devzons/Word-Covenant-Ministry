<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

interface OriginalLanguageNormalizerInterface
{
    public function supports(string $sourceDataset): bool;

    /**
     * @param array<string, mixed> $row
     */
    public function normalizeRow(array $row, int $rowNumber): OriginalLanguageNormalizedRow;
}
