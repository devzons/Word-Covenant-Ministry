<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\Repositories\OriginalTermRepository;
use WCM\Scripture\Repositories\OriginalWordOccurrenceRepository;
use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\ValueObjects\OriginalWordOccurrence;
use WP_REST_Request;
use WP_REST_Response;

final class OriginalLanguageController
{
    private const NAMESPACE = 'wcm/v1';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 100;

    public function __construct(
        private readonly BibleRepository $bibleRepository = new BibleRepository(),
        private readonly OriginalTermRepository $termRepository = new OriginalTermRepository(),
        private readonly OriginalWordOccurrenceRepository $occurrenceRepository = new OriginalWordOccurrenceRepository()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/original-language/(?P<source>[A-Za-z0-9_-]+)/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)/(?P<verse>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getVerseOccurrences'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/original-language/interlinear/(?P<source>[A-Za-z0-9_-]+)/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)/(?P<verse>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getInterlinearVerse'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/original-language/terms/(?P<term_id>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getTerm'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/original-language/terms/(?P<term_id>\d+)/occurrences',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getTermOccurrences'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/original-language/strongs/(?P<strongs_number>[HGhg]\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getStrongsTerms'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getVerseOccurrences(WP_REST_Request $request): WP_REST_Response
    {
        $reference = $this->resolveVerseRequest($request);

        if ($reference instanceof WP_REST_Response) {
            return $reference;
        }

        $rows = $this->occurrenceRepository->findForVerseWithTerms(
            $reference['source_dataset'],
            (int) $reference['book']['id'],
            $reference['chapter'],
            $reference['verse']
        );

        if ($rows === []) {
            return $this->notFound('original_language_verse_not_found', 'Original language verse data not found.');
        }

        return new WP_REST_Response(
            [
                'source_dataset' => $reference['source_dataset'],
                'book' => $this->formatBook($reference['book']),
                'reference' => [
                    'chapter' => $reference['chapter'],
                    'verse' => $reference['verse'],
                ],
                'occurrences' => array_map([$this, 'formatJoinedOccurrence'], $rows),
                'meta' => [
                    'count' => count($rows),
                ],
            ]
        );
    }

    public function getInterlinearVerse(WP_REST_Request $request): WP_REST_Response
    {
        $reference = $this->resolveVerseRequest($request);

        if ($reference instanceof WP_REST_Response) {
            return $reference;
        }

        $rows = $this->occurrenceRepository->findForVerseWithTerms(
            $reference['source_dataset'],
            (int) $reference['book']['id'],
            $reference['chapter'],
            $reference['verse']
        );

        if ($rows === []) {
            return $this->notFound('original_language_verse_not_found', 'Original language verse data not found.');
        }

        return new WP_REST_Response(
            [
                'source_dataset' => $reference['source_dataset'],
                'book' => $this->formatBook($reference['book']),
                'reference' => [
                    'chapter' => $reference['chapter'],
                    'verse' => $reference['verse'],
                ],
                'tokens' => array_map([$this, 'formatInterlinearToken'], $rows),
                'meta' => [
                    'count' => count($rows),
                ],
            ]
        );
    }

    public function getTerm(WP_REST_Request $request): WP_REST_Response
    {
        $termId = absint($request->get_param('term_id'));

        if ($termId < 1) {
            return $this->error('invalid_term_id', 'Term ID must be a positive integer.', 400);
        }

        $term = $this->termRepository->findById($termId);

        if ($term === null) {
            return $this->notFound('original_language_term_not_found', 'Original language term not found.');
        }

        return new WP_REST_Response(
            [
                'term' => $this->formatTerm($term),
            ]
        );
    }

    public function getTermOccurrences(WP_REST_Request $request): WP_REST_Response
    {
        $termId = absint($request->get_param('term_id'));

        if ($termId < 1) {
            return $this->error('invalid_term_id', 'Term ID must be a positive integer.', 400);
        }

        $term = $this->termRepository->findById($termId);

        if ($term === null) {
            return $this->notFound('original_language_term_not_found', 'Original language term not found.');
        }

        $pagination = $this->pagination($request);

        if ($pagination instanceof WP_REST_Response) {
            return $pagination;
        }

        $total = $this->occurrenceRepository->countByTermId($termId);
        $occurrences = $this->occurrenceRepository->findByTermId($termId, $pagination['page'], $pagination['per_page']);

        return new WP_REST_Response(
            [
                'term' => $this->formatTerm($term),
                'total' => $total,
                'page' => $pagination['page'],
                'per_page' => $pagination['per_page'],
                'occurrences' => array_map([$this, 'formatOccurrence'], $occurrences),
            ]
        );
    }

    public function getStrongsTerms(WP_REST_Request $request): WP_REST_Response
    {
        $languageType = $this->sanitizeLanguageType($request->get_param('language'));
        $strongsNumber = strtoupper(trim(sanitize_text_field((string) $request->get_param('strongs_number'))));

        if ($languageType === null) {
            return $this->error('invalid_language_type', 'Language must be hebrew or greek.', 400);
        }

        if (preg_match('/^[HG]\d+$/', $strongsNumber) !== 1) {
            return $this->error('invalid_strongs_number', 'Strong\'s number must use a format like H7225 or G3056.', 400);
        }

        $pagination = $this->pagination($request);

        if ($pagination instanceof WP_REST_Response) {
            return $pagination;
        }

        $total = $this->termRepository->countByStrongsNumber($languageType, $strongsNumber);
        $terms = $this->termRepository->findByStrongsNumber(
            $languageType,
            $strongsNumber,
            $pagination['page'],
            $pagination['per_page']
        );

        if ($total === 0) {
            return $this->notFound('original_language_strongs_not_found', 'Original language Strong\'s number not found.');
        }

        return new WP_REST_Response(
            [
                'language_type' => $languageType,
                'strongs_number' => $strongsNumber,
                'total' => $total,
                'page' => $pagination['page'],
                'per_page' => $pagination['per_page'],
                'terms' => array_map([$this, 'formatTerm'], $terms),
            ]
        );
    }

    /**
     * @return array{source_dataset: string, book: array<string, mixed>, chapter: int, verse: int}|WP_REST_Response
     */
    private function resolveVerseRequest(WP_REST_Request $request): array|WP_REST_Response
    {
        $sourceDataset = $this->canonicalSourceDataset($request->get_param('source'));
        $bookSlug = sanitize_title((string) $request->get_param('book'));
        $chapter = absint($request->get_param('chapter'));
        $verse = absint($request->get_param('verse'));

        if ($sourceDataset === null) {
            return $this->error('invalid_source_dataset', 'Source must be STEP_TAGNT or STEP_TAHOT.', 400);
        }

        if ($chapter < 1 || $verse < 1) {
            return $this->error('invalid_reference', 'Chapter and verse must be positive integers.', 400);
        }

        $book = $this->bibleRepository->getBookBySlug($bookSlug);

        if ($book === null) {
            return $this->notFound('bible_book_not_found', 'Bible book not found.');
        }

        return [
            'source_dataset' => $sourceDataset,
            'book' => $book,
            'chapter' => $chapter,
            'verse' => $verse,
        ];
    }

    private function canonicalSourceDataset(mixed $source): ?string
    {
        $source = strtolower(trim(sanitize_key((string) $source)));
        $source = str_replace('-', '_', $source);

        return match ($source) {
            'step_tagnt', 'tagnt' => OriginalWordOccurrence::SOURCE_STEP_TAGNT,
            'step_tahot', 'tahot' => OriginalWordOccurrence::SOURCE_STEP_TAHOT,
            default => null,
        };
    }

    private function sanitizeLanguageType(mixed $languageType): ?string
    {
        $languageType = strtolower(trim(sanitize_key((string) $languageType)));

        return match ($languageType) {
            OriginalTerm::LANGUAGE_HEBREW => OriginalTerm::LANGUAGE_HEBREW,
            OriginalTerm::LANGUAGE_GREEK => OriginalTerm::LANGUAGE_GREEK,
            default => null,
        };
    }

    /**
     * @return array{page: int, per_page: int}|WP_REST_Response
     */
    private function pagination(WP_REST_Request $request): array|WP_REST_Response
    {
        $page = $this->positivePaginationInt($request->get_param('page'), self::DEFAULT_PAGE);
        $perPage = $this->positivePaginationInt($request->get_param('per_page'), self::DEFAULT_PER_PAGE);

        if ($page === null || $perPage === null) {
            return $this->error('invalid_pagination', 'Page and per_page must be positive integers.', 400);
        }

        return [
            'page' => $page,
            'per_page' => min($perPage, self::MAX_PER_PAGE),
        ];
    }

    private function positivePaginationInt(mixed $value, int $default): ?int
    {
        if ($value === null || $value === '') {
            return $default;
        }

        if (is_int($value)) {
            return $value > 0 ? $value : null;
        }

        if (is_string($value) && preg_match('/^\d+$/', $value) === 1) {
            $value = (int) $value;

            return $value > 0 ? $value : null;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatJoinedOccurrence(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'source_dataset' => (string) $row['source_dataset'],
            'source_ref' => (string) $row['source_ref'],
            'word_order' => (int) $row['word_order'],
            'subword_order' => (int) $row['subword_order'],
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

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatInterlinearToken(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'source_dataset' => (string) $row['source_dataset'],
            'source_ref' => (string) $row['source_ref'],
            'word_order' => (int) $row['word_order'],
            'subword_order' => (int) $row['subword_order'],
            'token_type' => (string) $row['token_type'],
            'surface_form' => (string) $row['surface_form'],
            'normalized_form' => (string) $row['normalized_form'],
            'lemma' => (string) $row['lemma'],
            'lemma_normalized' => (string) $row['lemma_normalized'],
            'strongs_number' => (string) $row['strongs_number'],
            'strongs_extended' => (string) $row['strongs_extended'],
            'transliteration' => (string) $row['transliteration'],
            'transliteration_ko' => $this->nullableString($row['transliteration_ko'] ?? null),
            'morphology' => (string) $row['morphology'],
            'gloss' => $this->nullableString($row['gloss']),
            'contextual_function' => $this->nullableString($row['contextual_function']),
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
            'transliteration_ko' => $term->transliterationKo,
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

    private function nullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }

    private function notFound(string $code, string $message): WP_REST_Response
    {
        return $this->error($code, $message, 404);
    }

    private function error(string $code, string $message, int $status): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'code' => $code,
                'message' => $message,
            ],
            $status
        );
    }
}
