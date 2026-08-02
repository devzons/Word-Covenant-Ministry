<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Study\StudyDiscussionService;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

final class StudyDiscussionController
{
    private const NAMESPACE = 'wcm/v1';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;

    public function __construct(
        private readonly StudyDiscussionService $discussions = new StudyDiscussionService()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/studies/(?P<id>\d+)/discussions',
            [
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'listDiscussions'],
                    'permission_callback' => '__return_true',
                ],
                [
                    'methods' => 'POST',
                    'callback' => [$this, 'createDiscussion'],
                    'permission_callback' => [$this, 'canWriteDiscussion'],
                ],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/studies/(?P<id>\d+)/discussions/(?P<discussion_id>\d+)',
            [
                [
                    'methods' => 'PATCH',
                    'callback' => [$this, 'updateDiscussion'],
                    'permission_callback' => [$this, 'canWriteDiscussion'],
                ],
                [
                    'methods' => 'DELETE',
                    'callback' => [$this, 'deleteDiscussion'],
                    'permission_callback' => [$this, 'canWriteDiscussion'],
                ],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/admin/study-discussions',
            [
                'methods' => 'GET',
                'callback' => [$this, 'listModerationQueue'],
                'permission_callback' => [$this, 'canModerateDiscussions'],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/admin/study-discussions/(?P<discussion_id>\d+)/moderation',
            [
                'methods' => 'PATCH',
                'callback' => [$this, 'moderateDiscussion'],
                'permission_callback' => [$this, 'canModerateDiscussions'],
            ]
        );
    }

    public function listDiscussions(WP_REST_Request $request): WP_REST_Response
    {
        $result = $this->discussions->list(
            (int) $request->get_param('id'),
            $this->positiveInt($request->get_param('page'), self::DEFAULT_PAGE),
            $this->positiveInt($request->get_param('per_page'), self::DEFAULT_PER_PAGE),
            get_current_user_id()
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_discussions_loaded', 'Study discussions loaded.');
    }

    public function createDiscussion(WP_REST_Request $request): WP_REST_Response
    {
        $result = $this->discussions->create(
            (int) $request->get_param('id'),
            get_current_user_id(),
            $this->payload($request)
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 201, 'study_discussion_created', 'Study discussion created.');
    }

    public function updateDiscussion(WP_REST_Request $request): WP_REST_Response
    {
        $result = $this->discussions->update(
            (int) $request->get_param('id'),
            (int) $request->get_param('discussion_id'),
            get_current_user_id(),
            $this->payload($request)
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_discussion_updated', 'Study discussion updated.');
    }

    public function deleteDiscussion(WP_REST_Request $request): WP_REST_Response
    {
        $result = $this->discussions->delete(
            (int) $request->get_param('id'),
            (int) $request->get_param('discussion_id'),
            get_current_user_id()
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_discussion_deleted', 'Study discussion deleted.');
    }

    public function listModerationQueue(WP_REST_Request $request): WP_REST_Response
    {
        $studyId = $request->get_param('study_id');
        $result = $this->discussions->listForModeration(
            $studyId === null || $studyId === '' ? null : (int) $studyId,
            sanitize_key((string) $request->get_param('status')),
            $this->positiveInt($request->get_param('page'), self::DEFAULT_PAGE),
            $this->positiveInt($request->get_param('per_page'), self::DEFAULT_PER_PAGE)
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_discussion_moderation_loaded', 'Study discussion moderation queue loaded.');
    }

    public function moderateDiscussion(WP_REST_Request $request): WP_REST_Response
    {
        $result = $this->discussions->moderate(
            (int) $request->get_param('discussion_id'),
            $this->payload($request)
        );

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_discussion_moderated', 'Study discussion moderated.');
    }

    public function canWriteDiscussion(WP_REST_Request $request): bool|WP_Error
    {
        $origin = get_http_origin();

        if ($origin !== null && $origin !== '' && ! is_allowed_http_origin($origin)) {
            return new WP_Error('forbidden_origin', 'Origin is not allowed.', ['status' => 403]);
        }

        if (! is_user_logged_in()) {
            return new WP_Error('rest_forbidden', 'Authentication is required.', ['status' => 401]);
        }

        $nonce = (string) $request->get_header('X-WP-Nonce');

        if ($nonce === '' || wp_verify_nonce($nonce, 'wp_rest') === false) {
            return new WP_Error('rest_nonce_invalid', 'A valid REST nonce is required.', ['status' => 403]);
        }

        return true;
    }

    public function canModerateDiscussions(WP_REST_Request $request): bool|WP_Error
    {
        $writePermission = $this->canWriteDiscussion($request);

        if ($writePermission instanceof WP_Error) {
            return $writePermission;
        }

        if ($writePermission !== true || ! current_user_can('moderate_comments')) {
            return new WP_Error('rest_forbidden', 'Moderation permission is required.', ['status' => 403]);
        }

        return true;
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(WP_REST_Request $request): array
    {
        $json = $request->get_json_params();

        if (is_array($json)) {
            return $json;
        }

        $bodyParams = $request->get_body_params();

        return is_array($bodyParams) ? $bodyParams : [];
    }

    private function positiveInt(mixed $value, int $default): int
    {
        if (is_numeric($value)) {
            $intValue = (int) $value;

            return $intValue > 0 ? $intValue : $default;
        }

        return $default;
    }

    /**
     * @param array<string, mixed> $data
     */
    private function success(array $data, int $status, string $code, string $message): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => true,
                'data' => $data,
                'code' => $code,
                'message' => $message,
            ],
            $status
        );
    }

    private function errorFromWpError(WP_Error $error): WP_REST_Response
    {
        $data = $error->get_error_data();
        $status = is_array($data) && isset($data['status']) ? (int) $data['status'] : 400;

        return new WP_REST_Response(
            [
                'success' => false,
                'code' => $error->get_error_code(),
                'message' => $error->get_error_message(),
            ],
            $status
        );
    }
}
