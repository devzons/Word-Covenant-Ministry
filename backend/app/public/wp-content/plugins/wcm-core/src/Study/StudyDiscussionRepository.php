<?php

declare(strict_types=1);

namespace WCM\Study;

use WP_Comment;
use WP_Comment_Query;
use WP_Error;
use WP_User;

final class StudyDiscussionRepository
{
    public const COMMENT_TYPE = 'wcm_study_comment';
    public const LOCALE_META_KEY = '_wcm_study_locale';

    /**
     * @return array{items: array<int, WP_Comment>, total: int}
     */
    public function listForStudy(int $studyId, int $page, int $perPage, int $currentUserId): array
    {
        $comments = $this->queryComments([
            'post_id' => $studyId,
            'status' => 'all',
            'orderby' => 'comment_date_gmt',
            'order' => 'ASC',
        ]);

        $visible = array_values(array_filter(
            $comments,
            static function (WP_Comment $comment) use ($currentUserId): bool {
                if ((string) $comment->comment_approved === '1') {
                    return true;
                }

                return $currentUserId > 0
                    && (int) $comment->user_id === $currentUserId
                    && (string) $comment->comment_approved === '0';
            }
        ));

        usort($visible, [$this, 'sortComments']);

        $offset = ($page - 1) * $perPage;

        return [
            'items' => array_slice($visible, $offset, $perPage),
            'total' => count($visible),
        ];
    }

    /**
     * @return array{items: array<int, WP_Comment>, total: int}
     */
    public function listForModeration(?int $studyId, string $status, int $page, int $perPage): array
    {
        $queryArgs = [
            'status' => $this->wpStatus($status),
            'number' => $perPage,
            'offset' => ($page - 1) * $perPage,
            'orderby' => 'comment_date_gmt',
            'order' => 'ASC',
        ];

        if ($studyId !== null) {
            $queryArgs['post_id'] = $studyId;
        }

        $countArgs = $queryArgs;
        unset($countArgs['number'], $countArgs['offset'], $countArgs['orderby'], $countArgs['order']);
        $countArgs['count'] = true;

        $count = (new WP_Comment_Query())->query($this->withType($countArgs));

        return [
            'items' => $this->queryComments($queryArgs),
            'total' => is_numeric($count) ? (int) $count : 0,
        ];
    }

    public function find(int $discussionId): ?WP_Comment
    {
        $comment = get_comment($discussionId);

        if (! $comment instanceof WP_Comment || (string) $comment->comment_type !== self::COMMENT_TYPE) {
            return null;
        }

        return $comment;
    }

    public function create(int $studyId, int $userId, string $content, int $parentId, string $locale): WP_Comment|WP_Error
    {
        $user = get_user_by('id', $userId);

        if (! $user instanceof WP_User || ! $user->exists()) {
            return new WP_Error('discussion_user_not_found', 'User not found.', ['status' => 401]);
        }

        $commentId = wp_insert_comment([
            'comment_post_ID' => $studyId,
            'comment_author' => (string) $user->display_name,
            'comment_author_email' => (string) $user->user_email,
            'comment_author_url' => '',
            'comment_content' => $content,
            'comment_type' => self::COMMENT_TYPE,
            'comment_parent' => $parentId,
            'user_id' => $userId,
            'comment_approved' => '0',
            'comment_author_IP' => '',
            'comment_agent' => '',
            'comment_date' => current_time('mysql'),
            'comment_date_gmt' => current_time('mysql', true),
        ]);

        if (! is_numeric($commentId) || (int) $commentId < 1) {
            return new WP_Error('discussion_create_failed', 'Discussion could not be created.', ['status' => 500]);
        }

        $commentId = (int) $commentId;
        update_comment_meta($commentId, self::LOCALE_META_KEY, $locale);

        $comment = $this->find($commentId);

        if (! $comment instanceof WP_Comment) {
            return new WP_Error('discussion_create_failed', 'Discussion could not be created.', ['status' => 500]);
        }

        return $comment;
    }

    public function updateContent(WP_Comment $comment, string $content): WP_Comment|WP_Error
    {
        $result = wp_update_comment(
            [
                'comment_ID' => (int) $comment->comment_ID,
                'comment_content' => $content,
            ],
            true
        );

        if ($result instanceof WP_Error || $result === 0) {
            return new WP_Error('discussion_update_failed', 'Discussion could not be updated.', ['status' => 500]);
        }

        $updated = $this->find((int) $comment->comment_ID);

        if (! $updated instanceof WP_Comment) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        return $updated;
    }

    public function trash(WP_Comment $comment): bool
    {
        return wp_trash_comment((int) $comment->comment_ID);
    }

    public function setStatus(WP_Comment $comment, string $status): WP_Comment|WP_Error
    {
        $result = wp_set_comment_status((int) $comment->comment_ID, $this->wpStatus($status), true);

        if ($result instanceof WP_Error || $result === false) {
            return new WP_Error('discussion_moderation_failed', 'Discussion moderation failed.', ['status' => 500]);
        }

        $updated = $this->find((int) $comment->comment_ID);

        if (! $updated instanceof WP_Comment) {
            return new WP_Error('discussion_not_found', 'Discussion not found.', ['status' => 404]);
        }

        return $updated;
    }

    public function countApprovedReplies(int $discussionId): int
    {
        $count = (new WP_Comment_Query())->query($this->withType([
            'parent' => $discussionId,
            'status' => 'approve',
            'count' => true,
        ]));

        return is_numeric($count) ? (int) $count : 0;
    }

    /**
     * @param array<string, mixed> $args
     * @return array<int, WP_Comment>
     */
    private function queryComments(array $args): array
    {
        $comments = (new WP_Comment_Query())->query($this->withType($args));

        if (! is_array($comments)) {
            return [];
        }

        return array_values(array_filter($comments, static fn (mixed $comment): bool => $comment instanceof WP_Comment));
    }

    /**
     * @param array<string, mixed> $args
     * @return array<string, mixed>
     */
    private function withType(array $args): array
    {
        return [
            ...$args,
            'type' => self::COMMENT_TYPE,
        ];
    }

    private function wpStatus(string $status): string
    {
        return match ($status) {
            'approved' => 'approve',
            'pending' => 'hold',
            'rejected', 'trash' => 'trash',
            'spam' => 'spam',
            default => 'hold',
        };
    }

    private function sortComments(WP_Comment $a, WP_Comment $b): int
    {
        $dateCompare = strcmp((string) $a->comment_date_gmt, (string) $b->comment_date_gmt);

        if ($dateCompare !== 0) {
            return $dateCompare;
        }

        return (int) $a->comment_ID <=> (int) $b->comment_ID;
    }
}
