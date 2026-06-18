<?php

declare(strict_types=1);

namespace WCM\Api;

use WCM\Scripture\Repositories\BibleRepository;
use WP_REST_Request;
use WP_REST_Response;

final class BibleController
{
    private const NAMESPACE = 'wcm/v1';

    public function __construct(
        private readonly BibleRepository $repository = new BibleRepository()
    ) {
    }

    public function registerRoutes(): void
    {
        register_rest_route(
            self::NAMESPACE,
            '/bible/(?P<version>[A-Za-z0-9_-]+)/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getChapter'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            self::NAMESPACE,
            '/bible/(?P<version>[A-Za-z0-9_-]+)/(?P<book>[a-z0-9-]+)/(?P<chapter>\d+)/(?P<verse>\d+)',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getVerse'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function getChapter(WP_REST_Request $request): WP_REST_Response
    {
        $versionCode = strtoupper(sanitize_key((string) $request->get_param('version')));
        $bookSlug = sanitize_title((string) $request->get_param('book'));
        $chapter = absint($request->get_param('chapter'));

        if ($chapter < 1) {
            return new WP_REST_Response(
                [
                    'code' => 'invalid_reference',
                    'message' => 'Chapter must be a positive integer.',
                ],
                400
            );
        }

        $version = $this->repository->getVersionByCode($versionCode);

        if ($version === null) {
            return $this->notFound('bible_version_not_found', 'Bible version not found.');
        }

        $book = $this->repository->getBookBySlug($bookSlug);

        if ($book === null) {
            return $this->notFound('bible_book_not_found', 'Bible book not found.');
        }

        $verses = $this->repository->getChapterVerses(
            (int) $version['id'],
            (int) $book['id'],
            $chapter
        );

        if ($verses === []) {
            return $this->notFound('bible_chapter_not_found', 'Bible chapter not found.');
        }

        return new WP_REST_Response(
            [
                'translation' => (string) $version['code'],
                'book' => (string) $book['slug'],
                'chapter' => $chapter,
                'reference' => sprintf('%s %d장', (string) $book['name_ko'], $chapter),
                'verses' => array_map(
                    static fn (array $verse): array => [
                        'verse' => (int) $verse['verse'],
                        'text' => (string) $verse['text'],
                    ],
                    $verses
                ),
            ]
        );
    }

    public function getVerse(WP_REST_Request $request): WP_REST_Response
    {
        $versionCode = strtoupper(sanitize_key((string) $request->get_param('version')));
        $bookSlug = sanitize_title((string) $request->get_param('book'));
        $chapter = absint($request->get_param('chapter'));
        $verseNumber = absint($request->get_param('verse'));

        if ($chapter < 1 || $verseNumber < 1) {
            return new WP_REST_Response(
                [
                    'code' => 'invalid_reference',
                    'message' => 'Chapter and verse must be positive integers.',
                ],
                400
            );
        }

        $version = $this->repository->getVersionByCode($versionCode);

        if ($version === null) {
            return $this->notFound('bible_version_not_found', 'Bible version not found.');
        }

        $book = $this->repository->getBookBySlug($bookSlug);

        if ($book === null) {
            return $this->notFound('bible_book_not_found', 'Bible book not found.');
        }

        $verse = $this->repository->getVerse(
            (int) $version['id'],
            (int) $book['id'],
            $chapter,
            $verseNumber
        );

        if ($verse === null) {
            return $this->notFound('bible_verse_not_found', 'Bible verse not found.');
        }

        return new WP_REST_Response(
            [
                'version' => [
                    'code' => (string) $version['code'],
                    'name' => (string) $version['name'],
                    'language' => (string) $version['language'],
                ],
                'book' => [
                    'id' => (int) $book['id'],
                    'slug' => (string) $book['slug'],
                    'name_ko' => (string) $book['name_ko'],
                    'name_en' => (string) $book['name_en'],
                ],
                'reference' => [
                    'chapter' => $chapter,
                    'verse' => $verseNumber,
                ],
                'text' => (string) $verse['text'],
            ]
        );
    }

    private function notFound(string $code, string $message): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'code' => $code,
                'message' => $message,
            ],
            404
        );
    }
}
