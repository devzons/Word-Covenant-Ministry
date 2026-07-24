export type VerseNote = {
  id: number;
  translation: string;
  book: string;
  chapter: number;
  verse: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type VerseNoteList = {
  items: VerseNote[];
  page: number;
  perPage: number;
  total: number;
};
