<?php

declare(strict_types=1);

namespace WCM\Study;

use WCM\Api\Auth\AuthConfig;
use WP_Comment;
use WP_Error;
use WP_Post;
use WP_User;

final class StudyDiscussionService
{
    public const ALLOWED_LOCALES = ['ko', 'en'];

    private const MIN_CONTENT_LENGTH = 2;
    private const MAX_CONTENT_LENGTH = 2000;
    private const MAX_URL_COUNT = 1;
    private const MAX_PER_PAGE = 50;

    public function __construct(
        private readonly StudyDiscussionRepository $repository = new StudyDiscussionRepository(),
        private readonly StudyDiscussionTransformer $transformer = new StudyDiscussionTransformer(),
        private readonly StudyDiscussionRateLimiter $rateLimiter = new StudyDiscussionRateLimiter()
    ) {
    }

    /**
     * @return array<string, mixed>|WP_Error
     */
    public function list(int $studyId, int $page, int $perPage, int $currentUserId): array|WP_Error
    {
        $study = $this->validatedPublicStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        $page = max(1, $page);
        $perPage = min(self::MAX_PER_PAGE, max(1, $perPage));
        $result = $this->repository->listForStudy($studyId, $page, $perPage, $currentUserId);

        return [
            'items' => array_map(
                fn (WP_Comment $comment): array => $this->transformer->transform($comment, $currentUserId),
                $result['items']
            ),
            'pagination' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $result['total'],
                'hasMore' => ($page * $perPage) < $result['total'],
            ],
            'discussion' => [
                'open' => comments_open($studyId),
            ],
        ];
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>|WP_Error
     */
    public function create(int $studyId, int $userId, array $payload): array|WP_Error
    {
        $study = $this->validatedPublicStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        if (! comments_open($studyId)) {
            return new WP_Error('study_discussion_closed', 'Discussion is closed for this study.', ['status' => 403]);
        }

        $verified = $this->validateVerifiedUser($userId);

        if ($verified instanceof WP_Error) {
            return $verified;
        }

        $content = $this->validatedContent($payload['content'] ?? null);

        if ($content instanceof WP_Error) {
            return $content;
        }

        $locale = $this->validatedLocale($payload['locale'] ?? null);

        if ($locale instanceof WP_Error) {
            return $locale;
        }

        $parentId = $this->validatedParent($studyId, $userId, $payload['parentId'] ?? ($payload['parent_id'] ?? 0));

        if ($parentId instanceof WP_Error) {
            return $parentId;
        }

        if ($this->rateLimiter->duplicateRecentlySeen($userId, $studyId, $parentId, $content)) {
            return new WP_Error('study_discussion_duplicate', 'Duplicate discussion submission was rejected.', ['status' => 409]);
        }

        if (! $this->rateLimiter->allow($userId)) {
            return new WP_Error('study_discussion_rate_limited', 'Too many discussion submissions. Please try again later.', ['status' => 429]);
        }

        $created = $this->repository->create($studyId, $userId, $content, $parentId, $locale);

        if ($created instanceof WP_Error) {
            return $created;
        }

        $this->rateLimiter->rememberDuplicateGuard($userId, $studyId, $parentId, $content);

        return [
            'discussion' => $this->transformer->transform($created, $userId),
        ];
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>|WP_Error
     */
    public function update(int $studyId, int $discussionId, int $userId, array $payload): array|WP_Error
    {
        $study = $this->validatedPublicStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        $comment = $this->ownedStudyComment($studyId, $discussionId, $userId);

        if ($comment instanceof WP_Error) {
            return $comment;
        }

        if (! in_array((string) $comment->comment_approved, ['0', '1'], true)) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        $content = $this->validatedContent($payload['content'] ?? null);

        if ($content instanceof WP_Error) {
            return $content;
        }

        $updated = $this->repository->updateContent($comment, $content);

        if ($updated instanceof WP_Error) {
            return $updated;
        }

        return [
            'discussion' => $this->transformer->transform($updated, $userId),
        ];
    }

    /**
     * @return array<string, mixed>|WP_Error
     */
    public function delete(int $studyId, int $discussionId, int $userId): array|WP_Error
    {
        $study = $this->validatedPublicStudy($studyId);

        if ($study instanceof WP_Error) {
            return $study;
        }

        $comment = $this->ownedStudyComment($studyId, $discussionId, $userId);

        if ($comment instanceof WP_Error) {
            return $comment;
        }

        if (! $this->repository->trash($comment)) {
            return new WP_Error('discussion_delete_failed', 'Discussion could not be deleted.', ['status' => 500]);
        }

        return [
            'deleted' => true,
        ];
    }

    /**
     * @return array<string, mixed>|WP_Error
     */
    public function listForModeration(?int $studyId, string $status, int $page, int $perPage): array|WP_Error
    {
        if ($studyId !== null) {
            $study = $this->validatedPublicStudy($studyId);

            if ($study instanceof WP_Error) {
                return $study;
            }
        }

        $validatedStatus = $this->validatedStatus($status);

        if ($validatedStatus instanceof WP_Error) {
            return $validatedStatus;
        }

        $page = max(1, $page);
        $perPage = min(self::MAX_PER_PAGE, max(1, $perPage));
        $result = $this->repository->listForModeration($studyId, $validatedStatus, $page, $perPage);

        return [
            'items' => array_map(
                fn (WP_Comment $comment): array => $this->transformer->transform($comment, get_current_user_id()),
                $result['items']
            ),
            'pagination' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $result['total'],
                'hasMore' => ($page * $perPage) < $result['total'],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>|WP_Error
     */
    public function moderate(int $discussionId, array $payload): array|WP_Error
    {
        $comment = $this->repository->find($discussionId);

        if (! $comment instanceof WP_Comment) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        $status = $this->validatedStatus($payload['status'] ?? null);

        if ($status instanceof WP_Error) {
            return $status;
        }

        $updated = $this->repository->setStatus($comment, $status);

        if ($updated instanceof WP_Error) {
            return $updated;
        }

        return [
            'discussion' => $this->transformer->transform($updated, get_current_user_id()),
        ];
    }

    public function validatedPublicStudy(int $studyId): WP_Post|WP_Error
    {
        if ($studyId < 1) {
            return new WP_Error('study_invalid_id', 'Study ID is invalid.', ['status' => 400]);
        }

        $post = get_post($studyId);

        if (! $post instanceof WP_Post || $post->post_type !== 'wcm_study') {
            return new WP_Error('study_not_found', 'Study not found.', ['status' => 404]);
        }

        if ($post->post_status !== 'publish') {
            return new WP_Error('study_not_public', 'Study is not publicly available.', ['status' => 404]);
        }

        return $post;
    }

    private function validateVerifiedUser(int $userId): true|WP_Error
    {
        $user = get_user_by('id', $userId);

        if (! $user instanceof WP_User || ! $user->exists()) {
            return new WP_Error('rest_forbidden', 'Authentication is required.', ['status' => 401]);
        }

        $requiresVerification = (string) get_user_meta($userId, AuthConfig::META_REQUIRES_EMAIL_VERIFICATION, true) === '1';
        $verifiedAt = trim((string) get_user_meta($userId, AuthConfig::META_EMAIL_VERIFIED_AT, true));

        if ($requiresVerification && $verifiedAt === '') {
            return new WP_Error('email_verification_required', 'Please verify your email address before joining the discussion.', ['status' => 403]);
        }

        return true;
    }

    private function ownedStudyComment(int $studyId, int $discussionId, int $userId): WP_Comment|WP_Error
    {
        if ($discussionId < 1) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        $comment = $this->repository->find($discussionId);

        if (! $comment instanceof WP_Comment || (int) $comment->comment_post_ID !== $studyId) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        if ((int) $comment->user_id !== $userId) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        return $comment;
    }

    private function validatedContent(mixed $value): string|WP_Error
    {
        $content = trim(sanitize_textarea_field(is_string($value) ? wp_strip_all_tags($value, true) : ''));
        $length = function_exists('mb_strlen') ? mb_strlen($content) : strlen($content);

        if ($length < self::MIN_CONTENT_LENGTH) {
            return new WP_Error('discussion_content_required', 'Discussion content is required.', ['status' => 400]);
        }

        if ($length > self::MAX_CONTENT_LENGTH) {
            return new WP_Error('discussion_content_too_long', 'Discussion content exceeds the maximum length.', ['status' => 400]);
        }

        if (preg_match_all('/https?:\\/\\/|www\\./i', $content) > self::MAX_URL_COUNT) {
            return new WP_Error('discussion_too_many_links', 'Discussion content includes too many links.', ['status' => 400]);
        }

        return $content;
    }

    private function validatedLocale(mixed $value): string|WP_Error
    {
        $locale = strtolower(trim(is_string($value) ? sanitize_key($value) : ''));

        if (! in_array($locale, self::ALLOWED_LOCALES, true)) {
            return new WP_Error('study_invalid_locale', 'Locale is invalid.', ['status' => 400]);
        }

        return $locale;
    }

    private function validatedParent(int $studyId, int $userId, mixed $value): int|WP_Error
    {
        $parentId = is_numeric($value) ? (int) $value : 0;

        if ($parentId < 1) {
            return 0;
        }

        $parent = $this->repository->find($parentId);

        if (! $parent instanceof WP_Comment || (int) $parent->comment_post_ID !== $studyId) {
            return new WP_Error('discussion_parent_invalid', 'Parent discussion is invalid.', ['status' => 400]);
        }

        if ((int) $parent->comment_parent > 0) {
            return new WP_Error('discussion_reply_depth_exceeded', 'Replies may only be one level deep.', ['status' => 400]);
        }

        if ((string) $parent->comment_approved === '1') {
            return $parentId;
        }

        if ((string) $parent->comment_approved === '0' && (int) $parent->user_id === $userId) {
            return $parentId;
        }

        return new WP_Error('discussion_parent_invalid', 'Parent discussion is invalid.', ['status' => 400]);
    }

    private function validatedStatus(mixed $value): string|WP_Error
    {
        $status = sanitize_key(is_string($value) ? $value : '');

        if ($status === '') {
            $status = 'pending';
        }

        if (! in_array($status, ['pending', 'approved', 'rejected', 'trash', 'spam'], true)) {
            return new WP_Error('discussion_status_invalid', 'Moderation status is invalid.', ['status' => 400]);
        }

        return $status;
    }
}
