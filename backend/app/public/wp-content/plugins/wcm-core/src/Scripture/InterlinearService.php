<?php

declare(strict_types=1);

namespace WCM\Scripture;

use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\Repositories\OriginalWordOccurrenceRepository;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class InterlinearService
{
    private const CANONICAL_VERSION = 'KRV';

    public function __construct(
        private readonly BibleRepository $bibleRepository = new BibleRepository(),
        private readonly OriginalWordOccurrenceRepository $occurrenceRepository = new OriginalWordOccurrenceRepository()
    ) {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function verse(string $source, string $bookSlug, int $chapter, int $verse): ?array
    {
        $sourceDataset = $this->canonicalSourceDataset($source);
        $bookSlug = sanitize_title($bookSlug);

        if ($sourceDataset === null || $bookSlug === '' || $chapter < 1 || $verse < 1) {
            return null;
        }

        $version = $this->bibleRepository->getVersionByCode(self::CANONICAL_VERSION);
        $book = $this->bibleRepository->getBookBySlug($bookSlug);

        if ($version === null || $book === null) {
            return null;
        }

        $bibleVerse = $this->bibleRepository->getVerse(
            (int) $version['id'],
            (int) $book['id'],
            $chapter,
            $verse
        );

        if ($bibleVerse === null) {
            return null;
        }

        $tokens = $this->occurrenceRepository->findForVerseWithTerms(
            $sourceDataset,
            (int) $book['id'],
            $chapter,
            $verse
        );

        if ($tokens === []) {
            return null;
        }

        return [
            'source_dataset' => $sourceDataset,
            'version' => $this->formatVersion($version),
            'book' => $this->formatBook($book),
            'reference' => [
                'chapter' => $chapter,
                'verse' => $verse,
            ],
            'text' => (string) $bibleVerse['text'],
            'tokens' => array_map([$this, 'formatToken'], $tokens),
            'meta' => [
                'token_count' => count($tokens),
            ],
        ];
    }

    public function canonicalSourceDataset(string $source): ?string
    {
        $source = strtolower(trim(sanitize_key($source)));
        $source = str_replace('-', '_', $source);

        return match ($source) {
            'step_tagnt', 'tagnt' => OriginalWordOccurrence::SOURCE_STEP_TAGNT,
            'step_tahot', 'tahot' => OriginalWordOccurrence::SOURCE_STEP_TAHOT,
            default => null,
        };
    }

    /**
     * @param array<string, mixed> $version
     * @return array<string, mixed>
     */
    private function formatVersion(array $version): array
    {
        return [
            'code' => (string) $version['code'],
            'name' => (string) $version['name'],
            'language' => (string) $version['language'],
        ];
    }

    /**
     * @param array<string, mixed> $book
     * @return array<string, mixed>
     */
    private function formatBook(array $book): array
    {
        return [
            'id' => (int) $book['id'],
            'slug' => (string) $book['slug'],
            'name_ko' => (string) $book['name_ko'],
            'name_en' => (string) $book['name_en'],
        ];
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatToken(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'source_ref' => (string) $row['source_ref'],
            'position' => [
                'word_order' => (int) $row['word_order'],
                'subword_order' => (int) $row['subword_order'],
            ],
            'token_type' => (string) $row['token_type'],
            'surface_form' => (string) $row['surface_form'],
            'normalized_form' => (string) $row['normalized_form'],
            'morphology' => (string) $row['morphology'],
            'contextual_function' => $this->nullableString($row['contextual_function']),
            'term' => [
                'id' => (int) $row['term_id'],
                'language_type' => (string) $row['language_type'],
                'lemma' => (string) $row['lemma'],
                'lemma_normalized' => (string) $row['lemma_normalized'],
                'strongs_number' => (string) $row['strongs_number'],
                'strongs_extended' => (string) $row['strongs_extended'],
                'transliteration' => (string) $row['transliteration'],
                'transliteration_ko' => $this->nullableString($row['transliteration_ko'] ?? null),
                'gloss' => $this->nullableString($row['gloss']),
            ],
        ];
    }

    private function nullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }
}
