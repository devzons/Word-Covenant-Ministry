<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\InterlinearService;
use WP_REST_Request;
use WP_REST_Response;

final class InterlinearController
{
    private const NAMESPACE = 'wcm/v1';

    public function __construct(
        private readonly InterlinearService $interlinearService = new InterlinearService()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/interlinear/(?P<source>[A-Za-z0-9_-]+)/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)/(?P<verse>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getVerse'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getVerse(WP_REST_Request $request): WP_REST_Response
    {
        $source = sanitize_key((string) $request->get_param('source'));
        $book = sanitize_title((string) $request->get_param('book'));
        $chapter = absint($request->get_param('chapter'));
        $verse = absint($request->get_param('verse'));

        if ($this->interlinearService->canonicalSourceDataset($source) === null) {
            return $this->error('invalid_source_dataset', 'Source must be STEP_TAGNT or STEP_TAHOT.', 400);
        }

        if ($chapter < 1 || $verse < 1) {
            return $this->error('invalid_reference', 'Chapter and verse must be positive integers.', 400);
        }

        $interlinearVerse = $this->interlinearService->verse($source, $book, $chapter, $verse);

        if ($interlinearVerse === null) {
            return $this->notFound('interlinear_verse_not_found', 'Interlinear verse data not found.');
        }

        return new WP_REST_Response($interlinearVerse);
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
