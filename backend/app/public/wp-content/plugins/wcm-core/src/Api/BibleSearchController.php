<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\Repositories\BibleRepository;
use WP_REST_Request;
use WP_REST_Response;

final class BibleSearchController
{
    private const NAMESPACE = 'wcm/v1';
    private const MIN_QUERY_LENGTH = 1;
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 50;

    public function __construct(
        private readonly BibleRepository $repository = new BibleRepository()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/search',
            [
                'methods' => 'GET',
                'callback' => [$this, 'search'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function search(WP_REST_Request $request): WP_REST_Response
    {
        $query = trim(sanitize_text_field((string) $request->get_param('q')));
        $translation = $this->sanitizeTranslation($request->get_param('translation'));
        $page = max(self::DEFAULT_PAGE, absint($request->get_param('page')));
        $perPage = absint($request->get_param('per_page'));

        if ($perPage < 1) {
            $perPage = self::DEFAULT_PER_PAGE;
        }

        $perPage = min($perPage, self::MAX_PER_PAGE);

        if ($query === '') {
            return $this->error('missing_query', 'Search query is required.', 400);
        }

        if ($this->queryLength($query) < self::MIN_QUERY_LENGTH) {
            return $this->error(
                'query_too_short',
                sprintf('Search query must be at least %d characters.', self::MIN_QUERY_LENGTH),
                400
            );
        }

        if ($translation !== null && $this->repository->getVersionByCode($translation) === null) {
            return $this->error('translation_not_found', 'Bible translation not found.', 404);
        }

        $report = $this->repository->searchVerses($query, $translation, $page, $perPage);

        return new WP_REST_Response(
            [
                'query' => $query,
                'total' => $report['total'],
                'page' => $report['page'],
                'per_page' => $report['per_page'],
                'results' => array_map([$this, 'formatResult'], $report['results']),
            ]
        );
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatResult(array $row): array
    {
        $chapter = (int) $row['chapter'];
        $verse = (int) $row['verse'];

        return [
            'translation' => (string) $row['translation'],
            'book' => (string) $row['book_slug'],
            'chapter' => $chapter,
            'verse' => $verse,
            'reference' => sprintf('%s %d:%d', (string) $row['book_name_ko'], $chapter, $verse),
            'text' => (string) $row['text'],
        ];
    }

    private function sanitizeTranslation(mixed $translation): ?string
    {
        $translation = strtoupper(sanitize_key((string) $translation));

        return $translation === '' ? null : $translation;
    }

    private function queryLength(string $query): int
    {
        if (function_exists('mb_strlen')) {
            return mb_strlen($query);
        }

        return strlen($query);
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
