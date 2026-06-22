export type CrossReferenceType =
  | "quotation"
  | "allusion"
  | "parallel_event"
  | "theme"
  | "promise_fulfillment"
  | "prophecy_fulfillment"
  | "typology"
  | "word_study"
  | "curated_manual";

export type ScriptureReferenceRange = {
  book: string;
  chapter: number;
  verse: number;
  endChapter?: number;
  endVerse?: number;
};

export type CuratedCrossReference = {
  id: string;
  source: ScriptureReferenceRange;
  targets: ScriptureReferenceRange[];
  type: CrossReferenceType;
  label: { ko: string; en: string };
  note?: { ko: string; en: string };
};

// Reference-only MVP data. Do not store Bible text in this dataset.
export const curatedCrossReferences: CuratedCrossReference[] = [
  {
    id: "genesis-3-15-seed-conflict",
    source: { book: "genesis", chapter: 3, verse: 15 },
    targets: [
      { book: "romans", chapter: 16, verse: 20 },
      { book: "galatians", chapter: 4, verse: 4 },
      { book: "revelation", chapter: 12, verse: 1 },
    ],
    type: "theme",
    label: { ko: "씨와 대적 관계", en: "Seed and conflict theme" },
    note: {
      ko: "관련 주제 참조입니다.",
      en: "Related thematic references.",
    },
  },
  {
    id: "genesis-22-1-14-abraham-isaac",
    source: { book: "genesis", chapter: 22, verse: 1, endVerse: 14 },
    targets: [
      { book: "hebrews", chapter: 11, verse: 17, endVerse: 19 },
      { book: "james", chapter: 2, verse: 21, endVerse: 23 },
    ],
    type: "theme",
    label: { ko: "아브라함과 이삭", en: "Abraham and Isaac" },
    note: {
      ko: "관련 해석 본문 참조입니다.",
      en: "Related interpretive references.",
    },
  },
  {
    id: "exodus-12-1-14-passover",
    source: { book: "exodus", chapter: 12, verse: 1, endVerse: 14 },
    targets: [
      { book: "john", chapter: 1, verse: 29 },
      { book: "1-corinthians", chapter: 5, verse: 7 },
    ],
    type: "typology",
    label: { ko: "유월절 관련 참조", en: "Passover related references" },
  },
  {
    id: "isaiah-53-4-6-suffering-servant",
    source: { book: "isaiah", chapter: 53, verse: 4, endVerse: 6 },
    targets: [
      { book: "matthew", chapter: 8, verse: 17 },
      { book: "1-peter", chapter: 2, verse: 24 },
    ],
    type: "quotation",
    label: { ko: "이사야 53장 관련 인용", en: "Isaiah 53 related quotation" },
  },
  {
    id: "jeremiah-31-31-34-new-covenant",
    source: { book: "jeremiah", chapter: 31, verse: 31, endVerse: 34 },
    targets: [{ book: "hebrews", chapter: 8, verse: 8, endVerse: 12 }],
    type: "quotation",
    label: { ko: "새 언약 본문", en: "New covenant passage" },
  },
  {
    id: "ezekiel-36-25-27-cleansing-spirit",
    source: { book: "ezekiel", chapter: 36, verse: 25, endVerse: 27 },
    targets: [
      { book: "john", chapter: 3, verse: 5 },
      { book: "titus", chapter: 3, verse: 5 },
    ],
    type: "theme",
    label: { ko: "정결과 성령", en: "Cleansing and Spirit" },
  },
  {
    id: "matthew-13-24-30-parable-explained",
    source: { book: "matthew", chapter: 13, verse: 24, endVerse: 30 },
    targets: [{ book: "matthew", chapter: 13, verse: 36, endVerse: 43 }],
    type: "parallel_event",
    label: { ko: "비유와 설명", en: "Parable and explanation" },
  },
  {
    id: "mark-4-14-sower-parallels",
    source: { book: "mark", chapter: 4, verse: 14 },
    targets: [
      { book: "matthew", chapter: 13, verse: 18, endVerse: 23 },
      { book: "luke", chapter: 8, verse: 11, endVerse: 15 },
    ],
    type: "parallel_event",
    label: { ko: "씨 뿌리는 비유 병행", en: "Sower parable parallels" },
  },
];
