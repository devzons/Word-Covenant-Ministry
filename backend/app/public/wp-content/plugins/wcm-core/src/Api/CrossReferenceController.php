<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\Repositories\CrossReferenceRepository;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

final class CrossReferenceController
{
    private const NAMESPACE = 'wcm/v1';
    private const CANONICAL_VERSION = 'KRV';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 100;
    private const REVIEW_DEFAULT_PER_PAGE = 25;

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
    private const REVIEW_TOOL_STATUSES = [
        'unreviewed',
        'approved',
        'rejected',
        'suppressed',
    ];

    /** @var array<int, string> */
    private const REVIEW_TOOL_WRITE_STATUSES = [
        'approved',
        'rejected',
        'suppressed',
    ];

    /** @var array<int, string> */
    private const REVIEW_REASONS = [
        'accepted',
        'not_relevant',
        'too_broad',
        'duplicate_like',
        'confusing',
        'pastorally_unhelpful',
        'source_quality',
        'other',
    ];

    /** @var array<int, string> */
    private const REJECT_REASONS = [
        'not_relevant',
        'too_broad',
        'duplicate_like',
        'confusing',
        'source_quality',
        'other',
    ];

    /** @var array<int, string> */
    private const SUPPRESS_REASONS = [
        'too_broad',
        'duplicate_like',
        'confusing',
        'pastorally_unhelpful',
        'source_quality',
        'other',
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

        register_rest_route(
            self::NAMESPACE,
            '/cross-references/review',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getReviewQueue'],
                'permission_callback' => [$this, 'canReviewCrossReferences'],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/cross-references/review/(?P<id>\d+)',
            [
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'getReviewDetail'],
                    'permission_callback' => [$this, 'canReviewCrossReferences'],
                ],
                [
                    'methods' => 'PATCH',
                    'callback' => [$this, 'patchReviewStatus'],
                    'permission_callback' => [$this, 'canReviewCrossReferencesWithNonce'],
                ],
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

    public function getReviewQueue(WP_REST_Request $request): WP_REST_Response
    {
        $pagination = $this->pagination($request, self::REVIEW_DEFAULT_PER_PAGE);

        if ($pagination instanceof WP_REST_Response) {
            return $pagination;
        }

        $filters = $this->reviewFilters($request);

        if ($filters instanceof WP_REST_Response) {
            return $filters;
        }

        $sort = $this->sort($request);

        if ($sort instanceof WP_REST_Response) {
            return $sort;
        }

        $rows = $this->crossReferenceRepository->findReviewQueue(
            $pagination['page'],
            $pagination['per_page'],
            $filters,
            $sort
        );
        $hasMore = count($rows) > $pagination['per_page'];
        $rows = array_slice($rows, 0, $pagination['per_page']);
        $total = $this->crossReferenceRepository->countReviewQueue($filters);

        return new WP_REST_Response(
            [
                'items' => array_map([$this, 'formatReviewItem'], $rows),
                'pagination' => [
                    'page' => $pagination['page'],
                    'per_page' => $pagination['per_page'],
                    'total' => $total,
                    'has_more' => $hasMore,
                ],
            ]
        );
    }

    public function getReviewDetail(WP_REST_Request $request): WP_REST_Response
    {
        $id = absint($request->get_param('id'));

        if ($id < 1) {
            return $this->error('invalid_cross_reference_id', 'Cross reference ID must be a positive integer.', 400);
        }

        $row = $this->crossReferenceRepository->findReviewById($id);

        if ($row === null) {
            return $this->error('cross_reference_not_found', 'Cross reference relationship not found.', 404);
        }

        return new WP_REST_Response($this->formatReviewItem($row));
    }

    public function patchReviewStatus(WP_REST_Request $request): WP_REST_Response
    {
        $id = absint($request->get_param('id'));

        if ($id < 1) {
            return $this->error('invalid_cross_reference_id', 'Cross reference ID must be a positive integer.', 400);
        }

        $row = $this->crossReferenceRepository->findReviewById($id);

        if ($row === null) {
            return $this->error('cross_reference_not_found', 'Cross reference relationship not found.', 404);
        }

        $reviewStatus = $this->optionalToken($request->get_param('review_status'));

        if ($reviewStatus === null || ! in_array($reviewStatus, self::REVIEW_TOOL_WRITE_STATUSES, true)) {
            return $this->error('unsupported_review_status', 'Unsupported review status.', 400);
        }

        $reviewReason = $this->optionalToken($request->get_param('review_reason'));
        $reasonValidation = $this->validateReviewReason($reviewStatus, $reviewReason);

        if ($reasonValidation instanceof WP_REST_Response) {
            return $reasonValidation;
        }

        $reviewNotes = $this->reviewNotes($request->get_param('review_notes'));

        if ($reviewNotes instanceof WP_REST_Response) {
            return $reviewNotes;
        }

        if ($reviewReason === 'other' && ($reviewNotes === null || $reviewNotes === '')) {
            return $this->error('review_notes_required', 'Review notes are required when review_reason is other.', 400);
        }

        $updated = $this->crossReferenceRepository->updateReviewStatus(
            $id,
            $reviewStatus,
            $reviewReason,
            $reviewNotes,
            get_current_user_id(),
            current_time('mysql'),
            'manual'
        );

        if ($updated === null) {
            return $this->error('review_update_failed', 'Failed to update cross reference review status.', 500);
        }

        return new WP_REST_Response($this->formatReviewItem($updated));
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

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatReviewItem(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'source_reference' => [
                'book' => (string) $row['source_book'],
                'start_chapter' => (int) $row['source_start_chapter'],
                'start_verse' => (int) $row['source_start_verse'],
                'end_chapter' => $row['source_end_chapter'] === null ? null : (int) $row['source_end_chapter'],
                'end_verse' => $row['source_end_verse'] === null ? null : (int) $row['source_end_verse'],
            ],
            'target_reference' => [
                'book' => (string) $row['target_book'],
                'start_chapter' => (int) $row['target_start_chapter'],
                'start_verse' => (int) $row['target_start_verse'],
                'end_chapter' => $row['target_end_chapter'] === null ? null : (int) $row['target_end_chapter'],
                'end_verse' => $row['target_end_verse'] === null ? null : (int) $row['target_end_verse'],
            ],
            'relationship_type' => (string) $row['relationship_type'],
            'review_status' => (string) $row['review_status'],
            'source_dataset' => (string) $row['source_dataset'],
            'source_score' => $row['source_score'] === null ? null : (int) $row['source_score'],
            'confidence' => (string) $row['confidence'],
            'package_id' => (string) $row['package_id'],
            'source_checksum' => (string) $row['source_checksum'],
            'relationship_identity_hash' => (string) $row['relationship_identity_hash'],
            'audit' => [
                'reviewed_by' => $row['reviewed_by'] === null ? null : (int) $row['reviewed_by'],
                'reviewed_at' => $row['reviewed_at'] === null ? null : (string) $row['reviewed_at'],
                'previous_review_status' => $row['previous_review_status'] === null ? null : (string) $row['previous_review_status'],
                'review_source' => $row['review_source'] === null ? null : (string) $row['review_source'],
                'review_reason' => $row['review_reason'] === null ? null : (string) $row['review_reason'],
                'review_notes' => $row['review_notes'] === null ? null : (string) $row['review_notes'],
            ],
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
    private function pagination(WP_REST_Request $request, int $defaultPerPage = self::DEFAULT_PER_PAGE): array|WP_REST_Response
    {
        $page = $this->positivePaginationInt($request->get_param('page'), self::DEFAULT_PAGE);
        $perPage = $this->positivePaginationInt($request->get_param('per_page'), $defaultPerPage);

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

    /**
     * @return array{
     *   source_book?: string,
     *   source_chapter?: int,
     *   source_verse?: int,
     *   target_book?: string,
     *   review_status?: string,
     *   source_dataset?: string,
     *   min_source_score?: int
     * }|WP_REST_Response
     */
    private function reviewFilters(WP_REST_Request $request): array|WP_REST_Response
    {
        $filters = [];
        $sourceBook = sanitize_title((string) $request->get_param('source_book'));
        $targetBook = sanitize_title((string) $request->get_param('target_book'));
        $reviewStatus = $this->optionalToken($request->get_param('review_status'));
        $sourceDataset = $this->optionalToken($request->get_param('source_dataset'));
        $sourceChapter = $this->optionalPositiveInt($request->get_param('source_chapter'));
        $sourceVerse = $this->optionalPositiveInt($request->get_param('source_verse'));
        $minSourceScore = $this->optionalPositiveInt($request->get_param('min_source_score'));

        if ($sourceBook !== '') {
            $filters['source_book'] = $sourceBook;
        }

        if ($targetBook !== '') {
            $filters['target_book'] = $targetBook;
        }

        if ($reviewStatus !== null) {
            if (! in_array($reviewStatus, self::REVIEW_TOOL_STATUSES, true)) {
                return $this->error('unsupported_review_status', 'Unsupported review status.', 400);
            }

            $filters['review_status'] = $reviewStatus;
        }

        if ($sourceDataset !== null) {
            $filters['source_dataset'] = $sourceDataset;
        }

        if ($sourceChapter instanceof WP_REST_Response) {
            return $sourceChapter;
        }

        if ($sourceChapter !== null) {
            $filters['source_chapter'] = $sourceChapter;
        }

        if ($sourceVerse instanceof WP_REST_Response) {
            return $sourceVerse;
        }

        if ($sourceVerse !== null) {
            $filters['source_verse'] = $sourceVerse;
        }

        if ($minSourceScore instanceof WP_REST_Response) {
            return $minSourceScore;
        }

        if ($minSourceScore !== null) {
            $filters['min_source_score'] = $minSourceScore;
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

    private function optionalPositiveInt(mixed $value): int|WP_REST_Response|null
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value)) {
            return $value > 0 ? $value : $this->error('invalid_filter', 'Numeric filters must be positive integers.', 400);
        }

        if (is_string($value) && preg_match('/^\d+$/', $value) === 1) {
            $value = (int) $value;

            return $value > 0 ? $value : $this->error('invalid_filter', 'Numeric filters must be positive integers.', 400);
        }

        return $this->error('invalid_filter', 'Numeric filters must be positive integers.', 400);
    }

    private function validateReviewReason(string $reviewStatus, ?string $reviewReason): ?WP_REST_Response
    {
        if ($reviewReason !== null && ! in_array($reviewReason, self::REVIEW_REASONS, true)) {
            return $this->error('unsupported_review_reason', 'Unsupported review reason.', 400);
        }

        if ($reviewStatus === 'approved') {
            if ($reviewReason !== null && $reviewReason !== 'accepted') {
                return $this->error('unsupported_review_reason', 'Approved rows may only use accepted or no review reason.', 400);
            }

            return null;
        }

        if ($reviewReason === null) {
            return $this->error('review_reason_required', 'Rejected and suppressed rows require a review reason.', 400);
        }

        if ($reviewStatus === 'rejected' && ! in_array($reviewReason, self::REJECT_REASONS, true)) {
            return $this->error('unsupported_review_reason', 'Unsupported review reason for rejected status.', 400);
        }

        if ($reviewStatus === 'suppressed' && ! in_array($reviewReason, self::SUPPRESS_REASONS, true)) {
            return $this->error('unsupported_review_reason', 'Unsupported review reason for suppressed status.', 400);
        }

        return null;
    }

    private function reviewNotes(mixed $value): string|WP_REST_Response|null
    {
        if ($value === null || $value === '') {
            return null;
        }

        $notes = sanitize_textarea_field((string) $value);

        if (strlen($notes) > 2000) {
            return $this->error('review_notes_too_long', 'Review notes must not exceed 2000 characters.', 400);
        }

        return $notes;
    }

    public function canReviewCrossReferences(): bool
    {
        return is_user_logged_in() && current_user_can('manage_options');
    }

    public function canReviewCrossReferencesWithNonce(WP_REST_Request $request): bool|WP_Error
    {
        if (! $this->canReviewCrossReferences()) {
            return false;
        }

        $nonce = (string) $request->get_header('X-WP-Nonce');

        if ($nonce === '' || wp_verify_nonce($nonce, 'wp_rest') === false) {
            return new WP_Error(
                'rest_nonce_invalid',
                'A valid REST nonce is required for review writes.',
                ['status' => 403]
            );
        }

        return true;
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
