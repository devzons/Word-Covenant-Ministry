export type BibleVerse = {
  verse: number;
  text: string;
};

export type BibleChapterResponse = {
  translation: string;
  book: string;
  chapter: number;
  reference: string;
  verses: BibleVerse[];
};

export type BibleBookMetadata = {
  translation: string;
  book: string;
  name: string;
  chapter_count: number;
};

export type BibleReaderParams = {
  locale: string;
  version: string;
  book: string;
  chapter: string;
};

export type BibleSearchResult = {
  translation: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

export type BibleSearchResponse = {
  query: string;
  total: number;
  page: number;
  per_page: number;
  results: BibleSearchResult[];
};

export type BibleSearchParams = {
  q: string;
  translation?: string;
  page?: number;
  perPage?: number;
};
