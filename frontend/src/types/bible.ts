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

export type BibleReaderParams = {
  locale: string;
  version: string;
  book: string;
  chapter: string;
};
