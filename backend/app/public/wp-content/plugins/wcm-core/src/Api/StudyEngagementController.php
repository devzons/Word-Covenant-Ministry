<?php

declare(strict_types=1);

namespace WCM\Api;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WCM\Study\StudyViewService;

final class StudyEngagementController
{
    private const NAMESPACE = 'wcm/v1';

    public function __construct(
        private readonly StudyViewService $views = new StudyViewService()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/studies/(?P<id>\d+)/engagement',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getEngagement'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/studies/(?P<id>\d+)/view',
            [
                'methods' => 'POST',
                'callback' => [$this, 'recordView'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getEngagement(WP_REST_Request $request): WP_REST_Response
    {
        $studyId = (int) $request->get_param('id');
        $locale = sanitize_text_field((string) $request->get_param('locale'));
        $result = $this->views->getEngagement($studyId, $locale);

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        return $this->success($result, 200, 'study_engagement_loaded', 'Study engagement loaded.');
    }

    public function recordView(WP_REST_Request $request): WP_REST_Response
    {
        $originValidation = $this->validateRecordOrigin();

        if ($originValidation instanceof WP_Error) {
            return $this->errorFromWpError($originValidation);
        }

        $studyId = (int) $request->get_param('id');
        $payload = $this->payload($request);
        $locale = sanitize_text_field((string) ($payload['locale'] ?? ''));

        if ($this->isPrefetchRequest($request)) {
            return $this->ignoredResponse($studyId, $locale, 'prefetch');
        }

        if ($this->isObviousBotRequest()) {
            return $this->ignoredResponse($studyId, $locale, 'bot');
        }

        $result = $this->views->recordView($studyId, $locale);

        if ($result instanceof WP_Error) {
            return $this->errorFromWpError($result);
        }

        $counted = (bool) ($result['counted'] ?? false);

        return $this->success(
            $result,
            200,
            $counted ? 'study_view_recorded' : 'study_view_duplicate',
            $counted ? 'Study view recorded.' : 'Study view was already counted.'
        );
    }

    private function validateRecordOrigin(): true|WP_Error
    {
        $origin = get_http_origin();

        if (! is_string($origin) || trim($origin) === '') {
            return new WP_Error(
                'study_view_origin_required',
                'A valid frontend origin is required.',
                ['status' => 403]
            );
        }

        if (! is_allowed_http_origin($origin)) {
            return new WP_Error(
                'study_view_origin_forbidden',
                'Origin is not allowed.',
                ['status' => 403]
            );
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

    private function ignoredResponse(int $studyId, string $locale, string $reason): WP_REST_Response
    {
        $engagement = $this->views->getEngagement($studyId, $locale);

        if ($engagement instanceof WP_Error) {
            return $this->errorFromWpError($engagement);
        }

        return $this->success(
            [
                'counted' => false,
                'reason' => $reason,
                ...$engagement,
            ],
            200,
            'study_view_ignored',
            'Study view request was ignored.'
        );
    }

    private function isPrefetchRequest(WP_REST_Request $request): bool
    {
        $purpose = strtolower(trim((string) $request->get_header('Purpose')));
        $secPurpose = strtolower(trim((string) $request->get_header('Sec-Purpose')));

        return $purpose === 'prefetch' || $secPurpose === 'prefetch';
    }

    private function isObviousBotRequest(): bool
    {
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) && is_string($_SERVER['HTTP_USER_AGENT'])
            ? strtolower($_SERVER['HTTP_USER_AGENT'])
            : '';

        if ($userAgent === '') {
            return false;
        }

        foreach (['bot', 'crawler', 'spider', 'slurp', 'curl/', 'wget/'] as $needle) {
            if (str_contains($userAgent, $needle)) {
                return true;
            }
        }

        return false;
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
