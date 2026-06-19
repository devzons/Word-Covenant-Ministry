<?php

declare(strict_types=1);

namespace WCM\Scripture;

use WCM\Scripture\Repositories\OriginalTermRepository;
use WCM\Scripture\Repositories\OriginalWordOccurrenceRepository;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;

final class WordStudyService
{
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 100;

    public function __construct(
        private readonly OriginalTermRepository $termRepository = new OriginalTermRepository(),
        private readonly OriginalWordOccurrenceRepository $occurrenceRepository = new OriginalWordOccurrenceRepository()
    ) {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function strongOverview(string $languageType, string $strongsNumber): ?array
    {
        $languageType = trim($languageType);
        $strongsNumber = strtoupper(trim($strongsNumber));

        if ($languageType === '' || $strongsNumber === '') {
            return null;
        }

        $groups = $this->termRepository->findGroupedByStrongsNumber($languageType, $strongsNumber);

        if ($groups === []) {
            return null;
        }

        return [
            'language_type' => $languageType,
            'strongs_number' => $strongsNumber,
            'total_terms' => $this->termRepository->countByStrongsNumber($languageType, $strongsNumber),
            'total_occurrences' => $this->termRepository->countOccurrencesByStrongsNumber($languageType, $strongsNumber),
            'terms_by_extended' => $groups,
            'book_distribution' => $this->occurrenceRepository->distributionByStrongsNumber($languageType, $strongsNumber),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function termDetail(int $termId, int $page = self::DEFAULT_PAGE, int $perPage = self::DEFAULT_PER_PAGE): ?array
    {
        if ($termId < 1) {
            return null;
        }

        $term = $this->termRepository->findById($termId);

        if ($term === null) {
            return null;
        }

        $pagination = $this->pagination($page, $perPage);
        $summary = $this->occurrenceRepository->summaryByTermId($termId);
        $occurrences = $this->occurrenceRepository->findByTermId(
            $termId,
            $pagination['page'],
            $pagination['per_page']
        );

        return [
            'term' => $this->formatTerm($term),
            'summary' => $summary,
            'sample_occurrences' => array_map([$this, 'formatOccurrence'], $occurrences),
            'page' => $pagination['page'],
            'per_page' => $pagination['per_page'],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function termDistribution(int $termId): ?array
    {
        if ($termId < 1) {
            return null;
        }

        $term = $this->termRepository->findById($termId);

        if ($term === null) {
            return null;
        }

        return [
            'term' => $this->formatTerm($term),
            'summary' => $this->occurrenceRepository->summaryByTermId($termId),
            'books' => $this->occurrenceRepository->distributionByTermId($termId),
        ];
    }

    /**
     * @return array{page: int, per_page: int}
     */
    private function pagination(int $page, int $perPage): array
    {
        return [
            'page' => max(self::DEFAULT_PAGE, $page),
            'per_page' => min(self::MAX_PER_PAGE, max(1, $perPage)),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatTerm(OriginalTerm $term): array
    {
        return [
            'id' => (int) $term->id,
            'language_type' => $term->languageType,
            'lemma' => $term->lemma,
            'lemma_normalized' => $term->lemmaNormalized,
            'strongs_number' => $term->strongsNumber,
            'strongs_extended' => $term->strongsExtended,
            'transliteration' => $term->transliteration,
            'gloss' => $term->gloss,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOccurrence(OriginalWordOccurrence $occurrence): array
    {
        return [
            'id' => (int) $occurrence->id,
            'term_id' => $occurrence->termId,
            'book_id' => $occurrence->bookId,
            'chapter' => $occurrence->chapter,
            'verse' => $occurrence->verse,
            'word_order' => $occurrence->wordOrder,
            'subword_order' => $occurrence->subwordOrder,
            'token_type' => $occurrence->tokenType,
            'surface_form' => $occurrence->surfaceForm,
            'normalized_form' => $occurrence->normalizedForm,
            'morphology' => $occurrence->morphology,
            'contextual_function' => $occurrence->contextualFunction,
            'source_dataset' => $occurrence->sourceDataset,
            'source_ref' => $occurrence->sourceRef,
        ];
    }
}
