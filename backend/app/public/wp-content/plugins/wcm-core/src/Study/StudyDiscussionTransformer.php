<?php

declare(strict_types=1);

namespace WCM\Study;

use WP_Comment;
use WP_User;

final class StudyDiscussionTransformer
{
    public function __construct(
        private readonly StudyDiscussionRepository $repository = new StudyDiscussionRepository()
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function transform(WP_Comment $comment, int $currentUserId): array
    {
        $author = get_user_by('id', (int) $comment->user_id);

        return [
            'id' => (int) $comment->comment_ID,
            'studyId' => (int) $comment->comment_post_ID,
            'parentId' => (int) $comment->comment_parent,
            'author' => [
                'id' => (int) $comment->user_id,
                'displayName' => $author instanceof WP_User && $author->exists()
                    ? (string) $author->display_name
                    : 'Reader',
            ],
            'content' => (string) $comment->comment_content,
            'status' => $this->publicStatus($comment),
            'createdAt' => $this->dateTime((string) $comment->comment_date_gmt),
            'updatedAt' => $this->dateTime((string) $comment->comment_date_gmt),
            'canEdit' => $currentUserId > 0 && (int) $comment->user_id === $currentUserId && $this->isEditable($comment),
            'canDelete' => $currentUserId > 0 && (int) $comment->user_id === $currentUserId && $this->isEditable($comment),
            'replyCount' => $this->repository->countApprovedReplies((int) $comment->comment_ID),
        ];
    }

    private function publicStatus(WP_Comment $comment): string
    {
        return match ((string) $comment->comment_approved) {
            '1' => 'approved',
            '0' => 'pending',
            'spam' => 'spam',
            'trash', 'post-trashed' => 'trash',
            default => 'pending',
        };
    }

    private function isEditable(WP_Comment $comment): bool
    {
        return in_array((string) $comment->comment_approved, ['0', '1'], true);
    }

    private function dateTime(string $mysqlGmt): string
    {
        $timestamp = strtotime($mysqlGmt . ' UTC');

        if (! is_int($timestamp) || $timestamp < 1) {
            return gmdate('c');
        }

        return gmdate('c', $timestamp);
    }
}
