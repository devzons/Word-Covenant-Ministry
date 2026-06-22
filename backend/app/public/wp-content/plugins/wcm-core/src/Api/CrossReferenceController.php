<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\Repositories\CrossReferenceRepository;
use WP_REST_Request;
use WP_REST_Response;

final class CrossReferenceController
{
    private const NAMESPACE = 'wcm/v1';
    private const CANONICAL_VERSION = 'KRV';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 100;

    /** @var array<int, string> */
    private const RELATIONSHIP_TYPES = [
        'quotation',
        'allusion',
        'parallel_event',
        'theme',
        'promise_fulfillment',
        'prophecy_fulfillment',
        'typology',
        'law_gospel',
        'word_study',
        'curated_manual',
    ];

    /** @var array<int, string> */
    private const REVIEW_STATUSES = [
        'unreviewed',
        'reviewed',
        'approved',
        'held',
        'rejected',
    ];

    /** @var array<int, string> */
    private const SORTS = [
        'source_score_desc',
        'canonical',
    ];

    public function __construct(
        private readonly CrossReferenceRepository $crossReferenceRepository = new CrossReferenceRepository(),
        private readonly BibleRepository $bibleRepository = new BibleRepository()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/cross-references/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)/(?P<verse>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getForVerse'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getForVerse(WP_REST_Request $request): WP_REST_Response
    {
        $bookSlug = sanitize_title((string) $request->get_param('book'));
        $chapter = absint($request->get_param('chapter'));
        $verse = absint($request->get_param('verse'));

        if ($chapter < 1 || $verse < 1) {
            return $this->error('invalid_reference', 'Chapter and verse must be positive integers.', 400);
        }

        $book = $this->bibleRepository->getBookBySlug($bookSlug);

        if ($book === null) {
            return $this->error('invalid_book', 'Bible book not found.', 400);
        }

        if (! $this->canonicalVerseExists((int) $book['id'], $chapter, $verse)) {
            return $this->error('invalid_reference', 'Bible reference not found.', 400);
        }

        if ($this->includeTextRequested($request)) {
            return $this->error('include_text_not_supported', 'Cross reference text snippets are not supported in this phase.', 400);
        }

        $pagination = $this->pagination($request);

        if ($pagination instanceof WP_REST_Response) {
            return $pagination;
        }

        $filters = $this->filters($request);

        if ($filters instanceof WP_REST_Response) {
            return $filters;
        }

        $sort = $this->sort($request);

        if ($sort instanceof WP_REST_Response) {
            return $sort;
        }

        $rows = $this->crossReferenceRepository->findBySourceReference(
            $bookSlug,
            $chapter,
            $verse,
            $pagination['page'],
            $pagination['per_page'],
            $filters,
            $sort
        );
        $hasMore = count($rows) > $pagination['per_page'];
        $rows = array_slice($rows, 0, $pagination['per_page']);
        $total = $this->crossReferenceRepository->countBySourceReference($bookSlug, $chapter, $verse, $filters);
        $sourceDatasetSummary = $this->crossReferenceRepository->sourceDatasetSummaryBySourceReference(
            $bookSlug,
            $chapter,
            $verse,
            $filters
        );

        return new WP_REST_Response(
            [
                'source_reference' => [
                    'book' => $bookSlug,
                    'chapter' => $chapter,
                    'verse' => $verse,
                ],
                'items' => array_map([$this, 'formatItem'], $rows),
                'pagination' => [
                    'page' => $pagination['page'],
                    'per_page' => $pagination['per_page'],
                    'total' => $total,
                    'has_more' => $hasMore,
                ],
                'attribution' => [
                    'source_dataset' => 'openbible',
                    'attribution' => 'www.openbible.info CC-BY 2026-06-22',
                    'source_url' => 'https://www.openbible.info/labs/cross-references/',
                ],
                'source_dataset_summary' => $sourceDatasetSummary,
            ]
        );
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatItem(array $row): array
    {
        $relationshipType = (string) $row['relationship_type'];

        return [
            'target_reference' => [
                'book' => (string) $row['target_book'],
                'start_chapter' => (int) $row['target_start_chapter'],
                'start_verse' => (int) $row['target_start_verse'],
                'end_chapter' => $row['target_end_chapter'] === null ? null : (int) $row['target_end_chapter'],
                'end_verse' => $row['target_end_verse'] === null ? null : (int) $row['target_end_verse'],
            ],
            'relationship_type' => $relationshipType,
            'relationship_label' => $this->relationshipLabel($relationshipType),
            'review_status' => (string) $row['review_status'],
            'source_score' => $row['source_score'] === null ? null : (int) $row['source_score'],
            'source_dataset' => (string) $row['source_dataset'],
        ];
    }

    private function canonicalVerseExists(int $bookId, int $chapter, int $verse): bool
    {
        $version = $this->bibleRepository->getVersionByCode(self::CANONICAL_VERSION);

        if ($version === null) {
            return false;
        }

        return $this->bibleRepository->verseExists((int) $version['id'], $bookId, $chapter, $verse);
    }

    /**
     * @return array{page: int, per_page: int}|WP_REST_Response
     */
    private function pagination(WP_REST_Request $request): array|WP_REST_Response
    {
        $page = $this->positivePaginationInt($request->get_param('page'), self::DEFAULT_PAGE);
        $perPage = $this->positivePaginationInt($request->get_param('per_page'), self::DEFAULT_PER_PAGE);

        if ($page === null || $perPage === null || $perPage > self::MAX_PER_PAGE) {
            return $this->error('invalid_pagination', 'Page and per_page must be positive integers. per_page must not exceed 100.', 400);
        }

        return [
            'page' => $page,
            'per_page' => $perPage,
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
     * @return array{relationship_type?: string, review_status?: string}|WP_REST_Response
     */
    private function filters(WP_REST_Request $request): array|WP_REST_Response
    {
        $filters = [];
        $relationshipType = $this->optionalToken($request->get_param('relationship_type'));
        $reviewStatus = $this->optionalToken($request->get_param('review_status'));

        if ($relationshipType !== null) {
            if (! in_array($relationshipType, self::RELATIONSHIP_TYPES, true)) {
                return $this->error('unsupported_relationship_type', 'Unsupported relationship type.', 400);
            }

            $filters['relationship_type'] = $relationshipType;
        }

        if ($reviewStatus !== null) {
            if (! in_array($reviewStatus, self::REVIEW_STATUSES, true)) {
                return $this->error('unsupported_review_status', 'Unsupported review status.', 400);
            }

            $filters['review_status'] = $reviewStatus;
        }

        return $filters;
    }

    private function sort(WP_REST_Request $request): string|WP_REST_Response
    {
        $sort = $this->optionalToken($request->get_param('sort')) ?? 'source_score_desc';

        if (! in_array($sort, self::SORTS, true)) {
            return $this->error('invalid_sort', 'Unsupported sort.', 400);
        }

        return $sort;
    }

    private function optionalToken(mixed $value): ?string
    {
        $value = sanitize_key((string) $value);

        return $value === '' ? null : $value;
    }

    private function includeTextRequested(WP_REST_Request $request): bool
    {
        $includeText = strtolower(trim((string) $request->get_param('include_text')));

        return in_array($includeText, ['1', 'true', 'yes'], true);
    }

    private function relationshipLabel(string $relationshipType): string
    {
        if ($relationshipType === 'theme') {
            return 'Related Theme';
        }

        return ucwords(str_replace('_', ' ', $relationshipType));
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
