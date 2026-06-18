<?php

declare(strict_types=1);

namespace WCM\Database;

final class BibleBooksSeeder
{
    /**
     * @return array{ok: bool, inserted: int, updated: int, errors: string[]}
     */
    public function seed(): array
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wcm_bible_books';

        if (! $this->tableExists($tableName)) {
            return [
                'ok' => false,
                'inserted' => 0,
                'updated' => 0,
                'errors' => ['Bible books table does not exist.'],
            ];
        }

        $result = [
            'ok' => true,
            'inserted' => 0,
            'updated' => 0,
            'errors' => [],
        ];

        foreach ($this->getBooks() as $book) {
            $existingId = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$tableName} WHERE book_order = %d LIMIT 1",
                    $book['book_order']
                )
            );

            $now = current_time('mysql');
            $row = [
                'book_order' => $book['book_order'],
                'slug' => $book['slug'],
                'name_ko' => $book['name_ko'],
                'name_en' => $book['name_en'],
                'testament' => $book['testament'],
                'chapters' => $book['chapters'],
                'updated_at' => $now,
            ];

            if ($existingId !== null) {
                $updated = $wpdb->update(
                    $tableName,
                    $row,
                    ['book_order' => $book['book_order']],
                    ['%d', '%s', '%s', '%s', '%s', '%d', '%s'],
                    ['%d']
                );

                if ($updated === false) {
                    $result['ok'] = false;
                    $result['errors'][] = 'Failed to update book order ' . $book['book_order'] . '.';
                    continue;
                }

                $result['updated']++;
                continue;
            }

            $inserted = $wpdb->insert(
                $tableName,
                $row + ['created_at' => $now],
                ['%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s']
            );

            if ($inserted === false) {
                $result['ok'] = false;
                $result['errors'][] = 'Failed to insert book order ' . $book['book_order'] . '.';
                continue;
            }

            $result['inserted']++;
        }

        return $result;
    }

    private function tableExists(string $tableName): bool
    {
        global $wpdb;

        return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName)) === $tableName;
    }

    /**
     * @return array<int, array{book_order: int, name_en: string, name_ko: string, slug: string, testament: string, chapters: int}>
     */
    private function getBooks(): array
    {
        return [
            ['book_order' => 1, 'name_en' => 'Genesis', 'name_ko' => '창세기', 'slug' => 'genesis', 'testament' => 'old', 'chapters' => 50],
            ['book_order' => 2, 'name_en' => 'Exodus', 'name_ko' => '출애굽기', 'slug' => 'exodus', 'testament' => 'old', 'chapters' => 40],
            ['book_order' => 3, 'name_en' => 'Leviticus', 'name_ko' => '레위기', 'slug' => 'leviticus', 'testament' => 'old', 'chapters' => 27],
            ['book_order' => 4, 'name_en' => 'Numbers', 'name_ko' => '민수기', 'slug' => 'numbers', 'testament' => 'old', 'chapters' => 36],
            ['book_order' => 5, 'name_en' => 'Deuteronomy', 'name_ko' => '신명기', 'slug' => 'deuteronomy', 'testament' => 'old', 'chapters' => 34],
            ['book_order' => 6, 'name_en' => 'Joshua', 'name_ko' => '여호수아', 'slug' => 'joshua', 'testament' => 'old', 'chapters' => 24],
            ['book_order' => 7, 'name_en' => 'Judges', 'name_ko' => '사사기', 'slug' => 'judges', 'testament' => 'old', 'chapters' => 21],
            ['book_order' => 8, 'name_en' => 'Ruth', 'name_ko' => '룻기', 'slug' => 'ruth', 'testament' => 'old', 'chapters' => 4],
            ['book_order' => 9, 'name_en' => '1 Samuel', 'name_ko' => '사무엘상', 'slug' => '1-samuel', 'testament' => 'old', 'chapters' => 31],
            ['book_order' => 10, 'name_en' => '2 Samuel', 'name_ko' => '사무엘하', 'slug' => '2-samuel', 'testament' => 'old', 'chapters' => 24],
            ['book_order' => 11, 'name_en' => '1 Kings', 'name_ko' => '열왕기상', 'slug' => '1-kings', 'testament' => 'old', 'chapters' => 22],
            ['book_order' => 12, 'name_en' => '2 Kings', 'name_ko' => '열왕기하', 'slug' => '2-kings', 'testament' => 'old', 'chapters' => 25],
            ['book_order' => 13, 'name_en' => '1 Chronicles', 'name_ko' => '역대상', 'slug' => '1-chronicles', 'testament' => 'old', 'chapters' => 29],
            ['book_order' => 14, 'name_en' => '2 Chronicles', 'name_ko' => '역대하', 'slug' => '2-chronicles', 'testament' => 'old', 'chapters' => 36],
            ['book_order' => 15, 'name_en' => 'Ezra', 'name_ko' => '에스라', 'slug' => 'ezra', 'testament' => 'old', 'chapters' => 10],
            ['book_order' => 16, 'name_en' => 'Nehemiah', 'name_ko' => '느헤미야', 'slug' => 'nehemiah', 'testament' => 'old', 'chapters' => 13],
            ['book_order' => 17, 'name_en' => 'Esther', 'name_ko' => '에스더', 'slug' => 'esther', 'testament' => 'old', 'chapters' => 10],
            ['book_order' => 18, 'name_en' => 'Job', 'name_ko' => '욥기', 'slug' => 'job', 'testament' => 'old', 'chapters' => 42],
            ['book_order' => 19, 'name_en' => 'Psalms', 'name_ko' => '시편', 'slug' => 'psalms', 'testament' => 'old', 'chapters' => 150],
            ['book_order' => 20, 'name_en' => 'Proverbs', 'name_ko' => '잠언', 'slug' => 'proverbs', 'testament' => 'old', 'chapters' => 31],
            ['book_order' => 21, 'name_en' => 'Ecclesiastes', 'name_ko' => '전도서', 'slug' => 'ecclesiastes', 'testament' => 'old', 'chapters' => 12],
            ['book_order' => 22, 'name_en' => 'Song of Songs', 'name_ko' => '아가', 'slug' => 'song-of-songs', 'testament' => 'old', 'chapters' => 8],
            ['book_order' => 23, 'name_en' => 'Isaiah', 'name_ko' => '이사야', 'slug' => 'isaiah', 'testament' => 'old', 'chapters' => 66],
            ['book_order' => 24, 'name_en' => 'Jeremiah', 'name_ko' => '예레미야', 'slug' => 'jeremiah', 'testament' => 'old', 'chapters' => 52],
            ['book_order' => 25, 'name_en' => 'Lamentations', 'name_ko' => '예레미야애가', 'slug' => 'lamentations', 'testament' => 'old', 'chapters' => 5],
            ['book_order' => 26, 'name_en' => 'Ezekiel', 'name_ko' => '에스겔', 'slug' => 'ezekiel', 'testament' => 'old', 'chapters' => 48],
            ['book_order' => 27, 'name_en' => 'Daniel', 'name_ko' => '다니엘', 'slug' => 'daniel', 'testament' => 'old', 'chapters' => 12],
            ['book_order' => 28, 'name_en' => 'Hosea', 'name_ko' => '호세아', 'slug' => 'hosea', 'testament' => 'old', 'chapters' => 14],
            ['book_order' => 29, 'name_en' => 'Joel', 'name_ko' => '요엘', 'slug' => 'joel', 'testament' => 'old', 'chapters' => 3],
            ['book_order' => 30, 'name_en' => 'Amos', 'name_ko' => '아모스', 'slug' => 'amos', 'testament' => 'old', 'chapters' => 9],
            ['book_order' => 31, 'name_en' => 'Obadiah', 'name_ko' => '오바댜', 'slug' => 'obadiah', 'testament' => 'old', 'chapters' => 1],
            ['book_order' => 32, 'name_en' => 'Jonah', 'name_ko' => '요나', 'slug' => 'jonah', 'testament' => 'old', 'chapters' => 4],
            ['book_order' => 33, 'name_en' => 'Micah', 'name_ko' => '미가', 'slug' => 'micah', 'testament' => 'old', 'chapters' => 7],
            ['book_order' => 34, 'name_en' => 'Nahum', 'name_ko' => '나훔', 'slug' => 'nahum', 'testament' => 'old', 'chapters' => 3],
            ['book_order' => 35, 'name_en' => 'Habakkuk', 'name_ko' => '하박국', 'slug' => 'habakkuk', 'testament' => 'old', 'chapters' => 3],
            ['book_order' => 36, 'name_en' => 'Zephaniah', 'name_ko' => '스바냐', 'slug' => 'zephaniah', 'testament' => 'old', 'chapters' => 3],
            ['book_order' => 37, 'name_en' => 'Haggai', 'name_ko' => '학개', 'slug' => 'haggai', 'testament' => 'old', 'chapters' => 2],
            ['book_order' => 38, 'name_en' => 'Zechariah', 'name_ko' => '스가랴', 'slug' => 'zechariah', 'testament' => 'old', 'chapters' => 14],
            ['book_order' => 39, 'name_en' => 'Malachi', 'name_ko' => '말라기', 'slug' => 'malachi', 'testament' => 'old', 'chapters' => 4],
            ['book_order' => 40, 'name_en' => 'Matthew', 'name_ko' => '마태복음', 'slug' => 'matthew', 'testament' => 'new', 'chapters' => 28],
            ['book_order' => 41, 'name_en' => 'Mark', 'name_ko' => '마가복음', 'slug' => 'mark', 'testament' => 'new', 'chapters' => 16],
            ['book_order' => 42, 'name_en' => 'Luke', 'name_ko' => '누가복음', 'slug' => 'luke', 'testament' => 'new', 'chapters' => 24],
            ['book_order' => 43, 'name_en' => 'John', 'name_ko' => '요한복음', 'slug' => 'john', 'testament' => 'new', 'chapters' => 21],
            ['book_order' => 44, 'name_en' => 'Acts', 'name_ko' => '사도행전', 'slug' => 'acts', 'testament' => 'new', 'chapters' => 28],
            ['book_order' => 45, 'name_en' => 'Romans', 'name_ko' => '로마서', 'slug' => 'romans', 'testament' => 'new', 'chapters' => 16],
            ['book_order' => 46, 'name_en' => '1 Corinthians', 'name_ko' => '고린도전서', 'slug' => '1-corinthians', 'testament' => 'new', 'chapters' => 16],
            ['book_order' => 47, 'name_en' => '2 Corinthians', 'name_ko' => '고린도후서', 'slug' => '2-corinthians', 'testament' => 'new', 'chapters' => 13],
            ['book_order' => 48, 'name_en' => 'Galatians', 'name_ko' => '갈라디아서', 'slug' => 'galatians', 'testament' => 'new', 'chapters' => 6],
            ['book_order' => 49, 'name_en' => 'Ephesians', 'name_ko' => '에베소서', 'slug' => 'ephesians', 'testament' => 'new', 'chapters' => 6],
            ['book_order' => 50, 'name_en' => 'Philippians', 'name_ko' => '빌립보서', 'slug' => 'philippians', 'testament' => 'new', 'chapters' => 4],
            ['book_order' => 51, 'name_en' => 'Colossians', 'name_ko' => '골로새서', 'slug' => 'colossians', 'testament' => 'new', 'chapters' => 4],
            ['book_order' => 52, 'name_en' => '1 Thessalonians', 'name_ko' => '데살로니가전서', 'slug' => '1-thessalonians', 'testament' => 'new', 'chapters' => 5],
            ['book_order' => 53, 'name_en' => '2 Thessalonians', 'name_ko' => '데살로니가후서', 'slug' => '2-thessalonians', 'testament' => 'new', 'chapters' => 3],
            ['book_order' => 54, 'name_en' => '1 Timothy', 'name_ko' => '디모데전서', 'slug' => '1-timothy', 'testament' => 'new', 'chapters' => 6],
            ['book_order' => 55, 'name_en' => '2 Timothy', 'name_ko' => '디모데후서', 'slug' => '2-timothy', 'testament' => 'new', 'chapters' => 4],
            ['book_order' => 56, 'name_en' => 'Titus', 'name_ko' => '디도서', 'slug' => 'titus', 'testament' => 'new', 'chapters' => 3],
            ['book_order' => 57, 'name_en' => 'Philemon', 'name_ko' => '빌레몬서', 'slug' => 'philemon', 'testament' => 'new', 'chapters' => 1],
            ['book_order' => 58, 'name_en' => 'Hebrews', 'name_ko' => '히브리서', 'slug' => 'hebrews', 'testament' => 'new', 'chapters' => 13],
            ['book_order' => 59, 'name_en' => 'James', 'name_ko' => '야고보서', 'slug' => 'james', 'testament' => 'new', 'chapters' => 5],
            ['book_order' => 60, 'name_en' => '1 Peter', 'name_ko' => '베드로전서', 'slug' => '1-peter', 'testament' => 'new', 'chapters' => 5],
            ['book_order' => 61, 'name_en' => '2 Peter', 'name_ko' => '베드로후서', 'slug' => '2-peter', 'testament' => 'new', 'chapters' => 3],
            ['book_order' => 62, 'name_en' => '1 John', 'name_ko' => '요한일서', 'slug' => '1-john', 'testament' => 'new', 'chapters' => 5],
            ['book_order' => 63, 'name_en' => '2 John', 'name_ko' => '요한이서', 'slug' => '2-john', 'testament' => 'new', 'chapters' => 1],
            ['book_order' => 64, 'name_en' => '3 John', 'name_ko' => '요한삼서', 'slug' => '3-john', 'testament' => 'new', 'chapters' => 1],
            ['book_order' => 65, 'name_en' => 'Jude', 'name_ko' => '유다서', 'slug' => 'jude', 'testament' => 'new', 'chapters' => 1],
            ['book_order' => 66, 'name_en' => 'Revelation', 'name_ko' => '요한계시록', 'slug' => 'revelation', 'testament' => 'new', 'chapters' => 22],
        ];
    }
}
