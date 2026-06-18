<?php

declare(strict_types=1);

namespace WCM\Scripture\Import;

use Throwable;
use WCM\Scripture\Repositories\BibleRepository;
use WCM\Scripture\ValueObjects\BibleVerse;

final class VerseImportService
{
    public function __construct(
        private readonly BibleRepository $repository,
        private readonly KrvImportValidator $validator
    ) {
    }

    /**
     * @param ImportRow[] $rows
     */
    public function import(array $rows): ImportReport
    {
        $importedRows = 0;
        $skippedRows = 0;
        $failedRows = 0;
        $issues = [];

        foreach ($rows as $row) {
            if (! $row instanceof ImportRow) {
                $failedRows++;
                $issues[] = $this->error(
                    'invalid_import_row',
                    'Verse import service expects ImportRow objects.',
                    ['actual_type' => get_debug_type($row)]
                );
                continue;
            }

            $rowIssues = $this->validator->validateRow($row->toValidatorRow());

            if ($rowIssues !== []) {
                $failedRows++;
                $issues = array_merge($issues, $this->withRowContext($rowIssues, $row));
                continue;
            }

            $version = $this->repository->getVersionByCode($row->versionCode);

            if ($version === null || ! isset($version['id'])) {
                $failedRows++;
                $issues[] = $this->error(
                    'missing_bible_version',
                    'Bible version was not found for import row.',
                    $row->context()
                );
                continue;
            }

            $book = $this->repository->getBookByOrder($row->bookOrder);

            if ($book === null || ! isset($book['id'])) {
                $failedRows++;
                $issues[] = $this->error(
                    'missing_bible_book',
                    'Bible book was not found for import row.',
                    $row->context()
                );
                continue;
            }

            try {
                $verse = new BibleVerse(
                    (int) $version['id'],
                    (int) $book['id'],
                    $row->chapter,
                    $row->verse,
                    $row->text
                );
            } catch (Throwable $exception) {
                $failedRows++;
                $issues[] = $this->error(
                    'invalid_bible_verse',
                    $exception->getMessage(),
                    $row->context()
                );
                continue;
            }

            if (! $this->repository->upsertVerse($verse)) {
                $failedRows++;
                $issues[] = $this->error(
                    'verse_upsert_failed',
                    'Bible verse could not be inserted or updated.',
                    $row->context()
                );
                continue;
            }

            $importedRows++;
        }

        return new ImportReport(
            count($rows),
            $importedRows,
            $skippedRows,
            $failedRows,
            $issues
        );
    }

    /**
     * @param KrvImportIssue[] $issues
     * @return KrvImportIssue[]
     */
    private function withRowContext(array $issues, ImportRow $row): array
    {
        $contextualIssues = [];

        foreach ($issues as $issue) {
            $contextualIssues[] = new KrvImportIssue(
                $issue->severity,
                $issue->code,
                $issue->message,
                $issue->context + $row->context()
            );
        }

        return $contextualIssues;
    }

    /**
     * @param array<string, mixed> $context
     */
    private function error(string $code, string $message, array $context): KrvImportIssue
    {
        return new KrvImportIssue(KrvImportIssue::SEVERITY_ERROR, $code, $message, $context);
    }
}
