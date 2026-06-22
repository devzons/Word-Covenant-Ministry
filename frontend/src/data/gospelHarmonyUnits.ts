export type GospelHarmonyBook = "matthew" | "mark" | "luke" | "john";

export type GospelHarmonyPassage = {
  book: GospelHarmonyBook;
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse?: number;
};

export type GospelHarmonyUnit = {
  id: string;
  title: { ko: string; en: string };
  category?: { ko: string; en: string };
  passages: Partial<Record<GospelHarmonyBook, GospelHarmonyPassage>>;
};

// Reference-only MVP data. Harmony units must not store copied Bible text.
export const gospelHarmonyUnits: GospelHarmonyUnit[] = [
  {
    id: "jesus-baptism",
    title: { ko: "예수님의 세례", en: "Baptism of Jesus" },
    category: { ko: "사역의 시작", en: "Beginning of Ministry" },
    passages: {
      matthew: { book: "matthew", startChapter: 3, startVerse: 13, endVerse: 17 },
      mark: { book: "mark", startChapter: 1, startVerse: 9, endVerse: 11 },
      luke: { book: "luke", startChapter: 3, startVerse: 21, endVerse: 22 },
    },
  },
  {
    id: "wilderness-temptation",
    title: { ko: "광야 시험", en: "Temptation in the Wilderness" },
    category: { ko: "사역의 시작", en: "Beginning of Ministry" },
    passages: {
      matthew: { book: "matthew", startChapter: 4, startVerse: 1, endVerse: 11 },
      mark: { book: "mark", startChapter: 1, startVerse: 12, endVerse: 13 },
      luke: { book: "luke", startChapter: 4, startVerse: 1, endVerse: 13 },
    },
  },
  {
    id: "calling-four-disciples",
    title: { ko: "네 제자 부르심", en: "Calling of Four Disciples" },
    passages: {
      matthew: { book: "matthew", startChapter: 4, startVerse: 18, endVerse: 22 },
      mark: { book: "mark", startChapter: 1, startVerse: 16, endVerse: 20 },
      luke: { book: "luke", startChapter: 5, startVerse: 1, endVerse: 11 },
    },
  },
  {
    id: "parable-of-sower",
    title: { ko: "씨 뿌리는 자의 비유", en: "Parable of the Sower" },
    category: { ko: "비유", en: "Parables" },
    passages: {
      matthew: { book: "matthew", startChapter: 13, startVerse: 1, endVerse: 23 },
      mark: { book: "mark", startChapter: 4, startVerse: 1, endVerse: 20 },
      luke: { book: "luke", startChapter: 8, startVerse: 4, endVerse: 15 },
    },
  },
  {
    id: "feeding-five-thousand",
    title: { ko: "오병이어", en: "Feeding the Five Thousand" },
    passages: {
      matthew: { book: "matthew", startChapter: 14, startVerse: 13, endVerse: 21 },
      mark: { book: "mark", startChapter: 6, startVerse: 30, endVerse: 44 },
      luke: { book: "luke", startChapter: 9, startVerse: 10, endVerse: 17 },
      john: { book: "john", startChapter: 6, startVerse: 1, endVerse: 14 },
    },
  },
  {
    id: "transfiguration",
    title: { ko: "변화산", en: "Transfiguration" },
    passages: {
      matthew: { book: "matthew", startChapter: 17, startVerse: 1, endVerse: 8 },
      mark: { book: "mark", startChapter: 9, startVerse: 2, endVerse: 8 },
      luke: { book: "luke", startChapter: 9, startVerse: 28, endVerse: 36 },
    },
  },
  {
    id: "gethsemane",
    title: { ko: "겟세마네", en: "Gethsemane" },
    category: { ko: "수난", en: "Passion" },
    passages: {
      matthew: { book: "matthew", startChapter: 26, startVerse: 36, endVerse: 46 },
      mark: { book: "mark", startChapter: 14, startVerse: 32, endVerse: 42 },
      luke: { book: "luke", startChapter: 22, startVerse: 39, endVerse: 46 },
    },
  },
  {
    id: "crucifixion",
    title: { ko: "십자가", en: "Crucifixion" },
    category: { ko: "수난", en: "Passion" },
    passages: {
      matthew: { book: "matthew", startChapter: 27, startVerse: 32, endVerse: 56 },
      mark: { book: "mark", startChapter: 15, startVerse: 21, endVerse: 41 },
      luke: { book: "luke", startChapter: 23, startVerse: 26, endVerse: 49 },
      john: { book: "john", startChapter: 19, startVerse: 16, endVerse: 37 },
    },
  },
];
