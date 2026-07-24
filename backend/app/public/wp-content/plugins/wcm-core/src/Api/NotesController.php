<?php

declare(strict_types=1);

namespace WCM\Api;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\Repositories\VerseNoteRepository;

final class NotesController
{
    private const NAMESPACE = 'wcm/v1';
    private const DEFAULT_PAGE = 1;
    private const DEFAULT_PER_PAGE = 20;
    private const MAX_PER_PAGE = 50;
    private const MAX_NOTE_LENGTH = 10000;

    public function __construct(
        private readonly VerseNoteRepository $notes = new VerseNoteRepository(),
        private readonly BibleRepository $bible = new BibleRepository()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/my/notes',
            [
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'listNotes'],
                    'permission_callback' => [$this, 'canAccessPrivateNotes'],
                ],
                [
                    'methods' => 'POST',
                    'callback' => [$this, 'upsertNote'],
                    'permission_callback' => [$this, 'canAccessPrivateNotes'],
                ],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/my/notes/by-reference',
            [
                'methods' => 'GET',
                'callback' => [$this, 'noteByReference'],
                'permission_callback' => [$this, 'canAccessPrivateNotes'],
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/my/notes/(?P<id>\d+)',
            [
                [
                    'methods' => 'PATCH',
                    'callback' => [$this, 'updateNote'],
                    'permission_callback' => [$this, 'canAccessPrivateNotes'],
                ],
                [
                    'methods' => 'DELETE',
                    'callback' => [$this, 'deleteNote'],
                    'permission_callback' => [$this, 'canAccessPrivateNotes'],
                ],
            ]
        );
    }

    public function canAccessPrivateNotes(WP_REST_Request $request): bool|WP_Error
    {
        $origin = get_http_origin();

        if ($origin !== null && $origin !== '' && ! is_allowed_http_origin($origin)) {
            return new WP_Error(
                'forbidden_origin',
                'Origin is not allowed.',
                ['status' => 403]
            );
        }

        if (! is_user_logged_in()) {
            return new WP_Error(
                'rest_forbidden',
                'Authentication is required.',
                ['status' => 401]
            );
        }

        $nonce = (string) $request->get_header('X-WP-Nonce');

        if ($nonce === '' || wp_verify_nonce($nonce, 'wp_rest') === false) {
            return new WP_Error(
                'rest_nonce_invalid',
                'A valid REST nonce is required.',
                ['status' => 403]
            );
        }

        return true;
    }

    public function listNotes(WP_REST_Request $request): WP_REST_Response
    {
        $page = $this->positiveInt($request->get_param('page'), self::DEFAULT_PAGE);
        $perPage = min(
            self::MAX_PER_PAGE,
            $this->positiveInt($request->get_param('per_page'), self::DEFAULT_PER_PAGE)
        );
        $result = $this->notes->listByUser(get_current_user_id(), $page, $perPage);

        return $this->success(
            [
                'items' => array_map([$this, 'formatNote'], $result['items']),
                'page' => $result['page'],
                'perPage' => $result['per_page'],
                'total' => $result['total'],
            ]
        );
    }

    public function noteByReference(WP_REST_Request $request): WP_REST_Response
    {
        $reference = $this->validatedReference(
            [
                'translation' => $request->get_param('translation'),
                'book' => $request->get_param('book'),
                'chapter' => $request->get_param('chapter'),
                'verse' => $request->get_param('verse'),
            ]
        );

        if ($reference instanceof WP_REST_Response) {
            return $reference;
        }

        $note = $this->notes->findByReference(
            get_current_user_id(),
            $reference['translation'],
            $reference['book_slug'],
            $reference['chapter_number'],
            $reference['verse_number']
        );

        return $this->success(
            [
                'note' => $note === null ? null : $this->formatNote($note),
            ]
        );
    }

    public function upsertNote(WP_REST_Request $request): WP_REST_Response
    {
        $payload = $this->payload($request);
        $reference = $this->validatedReference($payload);

        if ($reference instanceof WP_REST_Response) {
            return $reference;
        }

        $noteText = $this->validatedNoteText($payload['note'] ?? null);

        if ($noteText instanceof WP_REST_Response) {
            return $noteText;
        }

        $result = $this->notes->upsert(
            get_current_user_id(),
            $reference['translation'],
            $reference['book_slug'],
            $reference['chapter_number'],
            $reference['verse_number'],
            $noteText
        );

        return $this->success(
            [
                'note' => $this->formatNote($result['row']),
            ],
            $result['created'] ? 201 : 200
        );
    }

    public function updateNote(WP_REST_Request $request): WP_REST_Response
    {
        $noteId = (int) $request->get_param('id');

        if ($noteId < 1) {
            return $this->error('invalid_request', 'Note ID is invalid.', 400);
        }

        $payload = $this->payload($request);
        $noteText = $this->validatedNoteText($payload['note'] ?? null);

        if ($noteText instanceof WP_REST_Response) {
            return $noteText;
        }

        $updated = $this->notes->updateTextById(
            $noteId,
            get_current_user_id(),
            $noteText
        );

        if ($updated === null) {
            return $this->error('note_not_found', 'Note not found.', 404);
        }

        return $this->success(
            [
                'note' => $this->formatNote($updated),
            ]
        );
    }

    public function deleteNote(WP_REST_Request $request): WP_REST_Response
    {
        $noteId = (int) $request->get_param('id');

        if ($noteId < 1) {
            return $this->error('invalid_request', 'Note ID is invalid.', 400);
        }

        $deleted = $this->notes->deleteById($noteId, get_current_user_id());

        if (! $deleted) {
            return $this->error('note_not_found', 'Note not found.', 404);
        }

        return $this->success(
            [
                'deleted' => true,
            ]
        );
    }

    /**
     * @param array<string, mixed> $payload
     * @return array{translation: string, book_slug: string, chapter_number: int, verse_number: int}|WP_REST_Response
     */
    private function validatedReference(array $payload): array|WP_REST_Response
    {
        $translation = strtoupper(trim(sanitize_text_field($this->stringValue($payload['translation'] ?? null))));
        $bookSlug = sanitize_title($this->stringValue($payload['book'] ?? null));
        $chapter = $this->positiveInt($payload['chapter'] ?? null, 0);
        $verse = $this->positiveInt($payload['verse'] ?? null, 0);

        if ($translation === '' || $bookSlug === '' || $chapter < 1 || $verse < 1) {
            return $this->error('invalid_reference', 'A valid verse reference is required.', 400);
        }

        $version = $this->bible->getVersionByCode($translation);
        $book = $this->bible->getBookBySlug($bookSlug);

        if (! is_array($version) || ! is_array($book)) {
            return $this->error('invalid_reference', 'A valid verse reference is required.', 400);
        }

        if (! $this->bible->verseExists((int) $version['id'], (int) $book['id'], $chapter, $verse)) {
            return $this->error('invalid_reference', 'A valid verse reference is required.', 400);
        }

        return [
            'translation' => $translation,
            'book_slug' => $bookSlug,
            'chapter_number' => $chapter,
            'verse_number' => $verse,
        ];
    }

    private function validatedNoteText(mixed $value): string|WP_REST_Response
    {
        $note = sanitize_textarea_field($this->stringValue($value));

        if (trim($note) === '') {
            return $this->error('note_required', 'Note text is required.', 400);
        }

        if (strlen($note) > self::MAX_NOTE_LENGTH) {
            return $this->error('note_too_long', 'Note text exceeds the maximum length.', 400);
        }

        return $note;
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

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function formatNote(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'translation' => (string) $row['translation'],
            'book' => (string) $row['book_slug'],
            'chapter' => (int) $row['chapter_number'],
            'verse' => (int) $row['verse_number'],
            'note' => (string) $row['note_text'],
            'createdAt' => (string) $row['created_at'],
            'updatedAt' => (string) $row['updated_at'],
        ];
    }

    private function positiveInt(mixed $value, int $default): int
    {
        if (is_numeric($value)) {
            $intValue = (int) $value;

            return $intValue > 0 ? $intValue : $default;
        }

        return $default;
    }

    private function stringValue(mixed $value): string
    {
        return is_string($value) ? $value : '';
    }

    /**
     * @param array<string, mixed> $data
     */
    private function success(array $data, int $status = 200): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => true,
                'data' => $data,
            ],
            $status
        );
    }

    private function error(string $code, string $message, int $status): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => false,
                'code' => $code,
                'message' => $message,
            ],
            $status
        );
    }
}
