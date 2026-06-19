<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use InvalidArgumentException;

final class OriginalLanguageVersificationResolver
{
    /**
     * @var array<string, array{book_code: string, chapter: int, verse: int}>
     */
    private array $exceptionMap;

    /**
     * @var array<string, bool>
     */
    private array $canonicalReferences;

    /**
     * @param string[] $canonicalReferences Reference keys like Gen.1.1.
     * @param array<string, array{book_code: string, chapter: int, verse: int}> $exceptionMap
     */
    public function __construct(array $canonicalReferences, array $exceptionMap = [])
    {
        $this->canonicalReferences = [];
        foreach ($canonicalReferences as $reference) {
            $reference = trim($reference);
            if ($reference !== '') {
                $this->canonicalReferences[$reference] = true;
            }
        }

        $this->exceptionMap = $exceptionMap;
    }

    /**
     * @param array<string, mixed> $context
     */
    public function resolve(
        string $bookCode,
        int $chapter,
        int $verse,
        array $context = []
    ): OriginalLanguageResolvedReference {
        $bookCode = trim($bookCode);

        if ($bookCode === '') {
            throw new InvalidArgumentException('Versification resolver book code is required.');
        }

        if ($chapter < 1) {
            throw new InvalidArgumentException('Versification resolver chapter must be greater than zero.');
        }

        if ($verse < 0) {
            throw new InvalidArgumentException('Versification resolver verse must be zero or greater.');
        }

        $sourceKey = $this->referenceKey($bookCode, $chapter, $verse);

        if (isset($this->exceptionMap[$sourceKey])) {
            return $this->resolveFromExceptionMap($bookCode, $chapter, $verse, $sourceKey, $context);
        }

        if ($this->isPsalmTitle($bookCode, $verse)) {
            return new OriginalLanguageResolvedReference(
                OriginalLanguageResolvedReference::STATUS_PSALM_TITLE,
                $bookCode,
                $chapter,
                $verse,
                null,
                null,
                null,
                [
                    $this->warning(
                        'psalm_title',
                        'Psalm title references require title storage or explicit skip handling before import.',
                        $context + ['source_reference' => $sourceKey]
                    ),
                ],
                $context
            );
        }

        if (isset($this->canonicalReferences[$sourceKey])) {
            return new OriginalLanguageResolvedReference(
                OriginalLanguageResolvedReference::STATUS_RESOLVED,
                $bookCode,
                $chapter,
                $verse,
                $bookCode,
                $chapter,
                $verse,
                [],
                $context
            );
        }

        return new OriginalLanguageResolvedReference(
            OriginalLanguageResolvedReference::STATUS_UNRESOLVED,
            $bookCode,
            $chapter,
            $verse,
            null,
            null,
            null,
            [
                $this->error(
                    'unresolved_reference',
                    'Source reference does not resolve to a WCM canonical reference.',
                    $context + ['source_reference' => $sourceKey]
                ),
            ],
            $context
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    private function resolveFromExceptionMap(
        string $bookCode,
        int $chapter,
        int $verse,
        string $sourceKey,
        array $context
    ): OriginalLanguageResolvedReference {
        $mapped = $this->exceptionMap[$sourceKey];
        $mappedKey = $this->referenceKey($mapped['book_code'], $mapped['chapter'], $mapped['verse']);

        if (! isset($this->canonicalReferences[$mappedKey])) {
            return new OriginalLanguageResolvedReference(
                OriginalLanguageResolvedReference::STATUS_UNRESOLVED,
                $bookCode,
                $chapter,
                $verse,
                null,
                null,
                null,
                [
                    $this->error(
                        'unresolved_reference',
                        'Exception map target does not resolve to a WCM canonical reference.',
                        $context + [
                            'source_reference' => $sourceKey,
                            'mapped_reference' => $mappedKey,
                        ]
                    ),
                ],
                $context + ['mapped_reference' => $mappedKey]
            );
        }

        return new OriginalLanguageResolvedReference(
            OriginalLanguageResolvedReference::STATUS_RESOLVED,
            $bookCode,
            $chapter,
            $verse,
            $mapped['book_code'],
            $mapped['chapter'],
            $mapped['verse'],
            [],
            $context + ['mapped_reference' => $mappedKey]
        );
    }

    private function isPsalmTitle(string $bookCode, int $verse): bool
    {
        return $bookCode === 'Psa' && $verse === 0;
    }

    private function referenceKey(string $bookCode, int $chapter, int $verse): string
    {
        return trim($bookCode) . '.' . $chapter . '.' . $verse;
    }

    /**
     * @param array<string, mixed> $context
     */
    private function warning(string $code, string $message, array $context = []): OriginalLanguageImportIssue
    {
        return new OriginalLanguageImportIssue(
            OriginalLanguageImportIssue::SEVERITY_WARNING,
            $code,
            $message,
            $context
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    private function error(string $code, string $message, array $context = []): OriginalLanguageImportIssue
    {
        return new OriginalLanguageImportIssue(
            OriginalLanguageImportIssue::SEVERITY_ERROR,
            $code,
            $message,
            $context
        );
    }
}
