export type Testament = "old" | "new";

export type ScriptureReference = {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  label: string;
  testament?: Testament;
  translation?: string;
};
