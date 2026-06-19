<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\ValueObjects\OriginalTerm;
use WCM\Scripture\WordStudyService;
use WP_REST_Request;
use WP_REST_Response;

final class WordStudyController
{
    private const NAMESPACE = 'wcm/v1';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 100;

    public function __construct(
        private readonly WordStudyService $wordStudyService = new WordStudyService()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/word-study/strongs/(?P<strongs_number>[A-Za-z0-9_-]+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getStrongsOverview'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/word-study/terms/(?P<term_id>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getTermDetail'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/word-study/terms/(?P<term_id>\d+)/distribution',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getTermDistribution'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getStrongsOverview(WP_REST_Request $request): WP_REST_Response
    {
        $strongsNumber = strtoupper(trim(sanitize_text_field((string) $request->get_param('strongs_number'))));
        $languageType = $this->languageTypeForStrongsNumber($strongsNumber);

        if ($languageType === null) {
            return $this->error('invalid_strongs_number', 'Strong\'s number must use a format like H7225 or G3056.', 400);
        }

        $overview = $this->wordStudyService->strongOverview($languageType, $strongsNumber);

        if ($overview === null) {
            return $this->notFound('word_study_strongs_not_found', 'Word study Strong\'s number not found.');
        }

        return new WP_REST_Response($overview);
    }

    public function getTermDetail(WP_REST_Request $request): WP_REST_Response
    {
        $termId = absint($request->get_param('term_id'));

        if ($termId < 1) {
            return $this->error('invalid_term_id', 'Term ID must be a positive integer.', 400);
        }

        $pagination = $this->pagination($request);

        if ($pagination instanceof WP_REST_Response) {
            return $pagination;
        }

        $detail = $this->wordStudyService->termDetail($termId, $pagination['page'], $pagination['per_page']);

        if ($detail === null) {
            return $this->notFound('word_study_term_not_found', 'Word study term not found.');
        }

        return new WP_REST_Response($detail);
    }

    public function getTermDistribution(WP_REST_Request $request): WP_REST_Response
    {
        $termId = absint($request->get_param('term_id'));

        if ($termId < 1) {
            return $this->error('invalid_term_id', 'Term ID must be a positive integer.', 400);
        }

        $distribution = $this->wordStudyService->termDistribution($termId);

        if ($distribution === null) {
            return $this->notFound('word_study_term_not_found', 'Word study term not found.');
        }

        return new WP_REST_Response($distribution);
    }

    private function languageTypeForStrongsNumber(string $strongsNumber): ?string
    {
        if (preg_match('/^H\d+$/', $strongsNumber) === 1) {
            return OriginalTerm::LANGUAGE_HEBREW;
        }

        if (preg_match('/^G\d+$/', $strongsNumber) === 1) {
            return OriginalTerm::LANGUAGE_GREEK;
        }

        return null;
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
