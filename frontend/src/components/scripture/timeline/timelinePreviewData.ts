export type TimelineLocale = "en" | "ko";

export type TimelineText = {
  en: string;
  ko: string;
};

export type TimelineReader = {
  book: string;
  chapter: number;
  verse: number;
  translation: Record<TimelineLocale, string>;
};

export type TimelinePeriod = {
  id: string;
  label: TimelineText;
  order: number;
};

export type TimelineBook = {
  id: string;
  label: TimelineText;
};

export type TimelinePlace = {
  id: string;
  label: TimelineText;
};

export type TimelineScriptureAnchor = {
  label: TimelineText;
  reader: TimelineReader;
};

export type TimelineEvent = {
  id: string;
  title: TimelineText;
  summary: TimelineText;
  periodId: string;
  primaryBookId: string;
  relatedBookIds: string[];
  scriptureAnchors: TimelineScriptureAnchor[];
  people: TimelineText[];
  placeIds: string[];
  locationNote: TimelineText;
  datingNote: TimelineText;
  confidenceLevel: TimelineText;
  sequenceLabel: TimelineText;
  eventType: TimelineText;
  dateLabel?: TimelineText;
  dateBasisLabel?: TimelineText;
  dateConfidenceLabel?: TimelineText;
  relativeYearLabel?: TimelineText;
  relativeYearValue?: number;
  relativeYearBasisLabel?: TimelineText;
  relativeYearCalculationNote?: TimelineText;
  durationLabel?: TimelineText;
  kingdomTags?: TimelineText[];
  empireTags?: TimelineText[];
  rulerTags?: TimelineText[];
  prophetTags?: TimelineText[];
  surroundingNationTags?: TimelineText[];
  synchronismNote?: TimelineText;
  worldContextNote?: TimelineText;
  worldContextBasisLabel?: TimelineText;
  worldContextConfidenceLabel?: TimelineText;
  nameVariantNote?: TimelineText;
  sourcePackage?: "preview-fixture" | "core-biblical-skeleton";
  scriptureReferencesOnly?: boolean;
  isSkeleton?: boolean;
  reviewRequired?: boolean;
  basisLabel?: TimelineText;
  cautionNote?: TimelineText;
  relatedEventIds?: string[];
  relatedKingdomIds?: string[];
  periodLabel?: TimelineText;
  sectionId?: string;
  accordionGroup?: string;
  displayOrder?: number;
  sequenceNumber?: number;
  reader: TimelineReader;
};

export type TimelineDatePreview = {
  dateLabel: TimelineText;
  dateBasisLabel: TimelineText;
  dateConfidenceLabel: TimelineText;
};

export type TimelineKingdomComparisonRow = {
  id: string;
  periodId: string;
  eraLabel: TimelineText;
  sequenceLabel: TimelineText;
  scriptureAnchors: TimelineScriptureAnchor[];
  unitedKing?: TimelineText;
  judahKing?: TimelineText;
  northernKing?: TimelineText;
  prophetTags?: TimelineText[];
  empireTags?: TimelineText[];
  surroundingNationTags?: TimelineText[];
  dateLabel?: TimelineText;
  dateBasisLabel?: TimelineText;
  dateConfidenceLabel?: TimelineText;
  nameVariantNote?: TimelineText;
  note?: TimelineText;
  relatedEventIds?: string[];
};

export type TimelineBookContextRow = {
  id: string;
  bookId: string;
  periodId: string;
  title: TimelineText;
  canonicalLocation: TimelineText;
  canonicalOrder?: number;
  testament?: "OT" | "NT";
  canonicalSection?: string;
  canonicalSectionLabel?: TimelineText;
  sectionId?: string;
  displayOrder?: number;
  accordionGroup?: string;
  historicalSettingLabel?: TimelineText;
  authorshipLabel?: TimelineText;
  authorshipBasisLabel?: TimelineText;
  backgroundBasisLabel: TimelineText;
  scriptureAnchors: TimelineScriptureAnchor[];
  relatedEventIds?: string[];
  relatedPeople?: TimelineText[];
  relatedPlaces?: string[];
  relatedKingdoms?: TimelineText[];
  relatedEmpires?: TimelineText[];
  dateLabel?: TimelineText;
  dateBasisLabel?: TimelineText;
  dateConfidenceLabel?: TimelineText;
  basisLabel?: TimelineText;
  confidenceLabel?: TimelineText;
  relatedBookIds?: string[];
  relatedKingdomIds?: string[];
  note: TimelineText;
  sourcePackage?: "preview-fixture" | "canonical-66-skeleton";
  scriptureReferencesOnly?: boolean;
  isSkeleton?: boolean;
};

export type TimelineGenealogySegment = {
  id: string;
  title: TimelineText;
  rangeLabel: TimelineText;
  scriptureAnchors: TimelineScriptureAnchor[];
  structureLabel: TimelineText;
  basisLabel: TimelineText;
  note: TimelineText;
};

export type TimelineGenealogyComparisonRow = {
  id: string;
  segmentId: string;
  matthewName: TimelineText;
  oldTestamentName?: TimelineText;
  comparisonLabel: TimelineText;
  scriptureAnchors: TimelineScriptureAnchor[];
  relatedBookIds?: string[];
  relatedEventIds?: string[];
  periodId?: string;
  kingdomTags?: TimelineText[];
  empireTags?: TimelineText[];
  rulerTags?: TimelineText[];
  nameVariantNote?: TimelineText;
  omissionNote?: TimelineText;
  basisLabel: TimelineText;
  note?: TimelineText;
};

export type TimelineInspectorSelection =
  | { id: string; type: "event" }
  | { id: string; type: "book" }
  | { id: string; type: "kingdom" }
  | { id: string; type: "genealogy" }
  | { id: string; type: "place" }
  | null;

export type TimelineSchematicPlaceRow = {
  id: string;
  placeId: string;
  title: TimelineText;
  modernReferenceLabel?: TimelineText;
  modernReferenceStatusLabel?: TimelineText;
  conceptRegionLabel: TimelineText;
  conceptZoneId:
    | "mesopotamia"
    | "persia"
    | "aram-assyria"
    | "babylon"
    | "canaan"
    | "philistia"
    | "judah"
    | "wilderness"
    | "east-jordan"
    | "egypt"
    | "unknown";
  conceptFlowGroup?: "patriarchs" | "exodus" | "david-flight" | "kingdoms" | "exile-return" | "psalms";
  placeTypeLabel?: TimelineText;
  locationBasisLabel: TimelineText;
  locationConfidenceLabel: TimelineText;
  scriptureAnchors: TimelineScriptureAnchor[];
  relatedEventIds?: string[];
  relatedBookContextIds?: string[];
  relatedPeople?: TimelineText[];
  relatedKingdoms?: TimelineText[];
  relatedEmpires?: TimelineText[];
  cautionNote?: TimelineText;
  note: TimelineText;
};

export const timelinePeriods: TimelinePeriod[] = [
  { id: "primeval", order: 1, label: { en: "Creation / Primeval History", ko: "창조 / 태고 역사" } },
  { id: "patriarchs", order: 2, label: { en: "Patriarchs", ko: "족장 시대" } },
  { id: "exodus", order: 3, label: { en: "Exodus / Wilderness", ko: "출애굽 / 광야" } },
  { id: "conquest", order: 4, label: { en: "Conquest / Judges", ko: "가나안 정복 / 사사" } },
  { id: "united-kingdom", order: 5, label: { en: "United Kingdom", ko: "통일 왕국" } },
  {
    id: "divided-kingdom",
    order: 6,
    label: { en: "Divided Kingdom / Prophets", ko: "분열 왕국 / 선지자" },
  },
  { id: "exile", order: 7, label: { en: "Exile", ko: "포로기" } },
  { id: "return", order: 8, label: { en: "Return", ko: "귀환" } },
  { id: "gospel", order: 9, label: { en: "Gospels", ko: "복음서" } },
  { id: "acts", order: 10, label: { en: "Acts / Early Church", ko: "사도행전 / 초기 교회" } },
  { id: "epistles", order: 11, label: { en: "Epistles / Apostolic Witness", ko: "서신 / 사도적 증언" } },
  { id: "revelation", order: 12, label: { en: "Revelation", ko: "요한계시록" } },
];

export const timelineBooks: TimelineBook[] = [
  { id: "genesis", label: { en: "Genesis", ko: "창세기" } },
  { id: "exodus", label: { en: "Exodus", ko: "출애굽기" } },
  { id: "leviticus", label: { en: "Leviticus", ko: "레위기" } },
  { id: "numbers", label: { en: "Numbers", ko: "민수기" } },
  { id: "deuteronomy", label: { en: "Deuteronomy", ko: "신명기" } },
  { id: "joshua", label: { en: "Joshua", ko: "여호수아" } },
  { id: "judges", label: { en: "Judges", ko: "사사기" } },
  { id: "ruth", label: { en: "Ruth", ko: "룻기" } },
  { id: "1-samuel", label: { en: "1 Samuel", ko: "사무엘상" } },
  { id: "2-samuel", label: { en: "2 Samuel", ko: "사무엘하" } },
  { id: "1-kings", label: { en: "1 Kings", ko: "열왕기상" } },
  { id: "2-kings", label: { en: "2 Kings", ko: "열왕기하" } },
  { id: "ezra", label: { en: "Ezra", ko: "에스라" } },
  { id: "nehemiah", label: { en: "Nehemiah", ko: "느헤미야" } },
  { id: "esther", label: { en: "Esther", ko: "에스더" } },
  { id: "isaiah", label: { en: "Isaiah", ko: "이사야" } },
  { id: "jeremiah", label: { en: "Jeremiah", ko: "예레미야" } },
  { id: "ezekiel", label: { en: "Ezekiel", ko: "에스겔" } },
  { id: "matthew", label: { en: "Matthew", ko: "마태복음" } },
  { id: "mark", label: { en: "Mark", ko: "마가복음" } },
  { id: "luke", label: { en: "Luke", ko: "누가복음" } },
  { id: "john", label: { en: "John", ko: "요한복음" } },
  { id: "acts", label: { en: "Acts", ko: "사도행전" } },
  { id: "psalms", label: { en: "Psalms", ko: "시편" } },
  { id: "romans", label: { en: "Romans", ko: "로마서" } },
  { id: "1-corinthians", label: { en: "1 Corinthians", ko: "고린도전서" } },
  { id: "galatians", label: { en: "Galatians", ko: "갈라디아서" } },
  { id: "james", label: { en: "James", ko: "야고보서" } },
  { id: "jude", label: { en: "Jude", ko: "유다서" } },
  { id: "joel", label: { en: "Joel", ko: "요엘" } },
  { id: "ephesians", label: { en: "Ephesians", ko: "에베소서" } },
  { id: "philippians", label: { en: "Philippians", ko: "빌립보서" } },
  { id: "hebrews", label: { en: "Hebrews", ko: "히브리서" } },
  { id: "1-peter", label: { en: "1 Peter", ko: "베드로전서" } },
  { id: "hosea", label: { en: "Hosea", ko: "호세아" } },
  { id: "amos", label: { en: "Amos", ko: "아모스" } },
  { id: "haggai", label: { en: "Haggai", ko: "학개" } },
  { id: "zechariah", label: { en: "Zechariah", ko: "스가랴" } },
  { id: "malachi", label: { en: "Malachi", ko: "말라기" } },
  { id: "lamentations", label: { en: "Lamentations", ko: "예레미야애가" } },
  { id: "2-chronicles", label: { en: "2 Chronicles", ko: "역대하" } },
  { id: "job", label: { en: "Job", ko: "욥기" } },
  { id: "daniel", label: { en: "Daniel", ko: "다니엘" } },
  { id: "revelation", label: { en: "Revelation", ko: "요한계시록" } },
];

export const timelinePlaces: TimelinePlace[] = [
  { id: "eden", label: { en: "Eden", ko: "에덴" } },
  { id: "ararat", label: { en: "Ararat", ko: "아라랏" } },
  { id: "shinar", label: { en: "Shinar", ko: "시날" } },
  { id: "ur", label: { en: "Ur", ko: "우르" } },
  { id: "canaan", label: { en: "Canaan", ko: "가나안" } },
  { id: "moab", label: { en: "Moab", ko: "모압" } },
  { id: "egypt", label: { en: "Egypt", ko: "애굽" } },
  { id: "sinai", label: { en: "Sinai", ko: "시내산" } },
  { id: "kadesh-barnea", label: { en: "Kadesh Barnea", ko: "가데스 바네아" } },
  { id: "jordan", label: { en: "Jordan", ko: "요단" } },
  { id: "jericho", label: { en: "Jericho", ko: "여리고" } },
  { id: "shiloh", label: { en: "Shiloh", ko: "실로" } },
  { id: "gath", label: { en: "Gath", ko: "가드" } },
  { id: "nob", label: { en: "Nob", ko: "놉" } },
  { id: "zif", label: { en: "Ziph", ko: "십" } },
  { id: "adullam", label: { en: "Adullam", ko: "아둘람" } },
  { id: "en-gedi", label: { en: "En Gedi", ko: "엔게디" } },
  { id: "gibeah", label: { en: "Gibeah", ko: "기브아" } },
  { id: "valley-of-salt", label: { en: "Valley of Salt", ko: "염곡" } },
  { id: "wilderness-of-judah", label: { en: "Wilderness of Judah", ko: "유다 광야" } },
  { id: "susa", label: { en: "Susa", ko: "수산" } },
  { id: "uz", label: { en: "Uz", ko: "우스" } },
  { id: "bethlehem", label: { en: "Bethlehem", ko: "베들레헴" } },
  { id: "jerusalem", label: { en: "Jerusalem", ko: "예루살렘" } },
  { id: "hebron", label: { en: "Hebron", ko: "헤브론" } },
  { id: "carmel", label: { en: "Mount Carmel", ko: "갈멜산" } },
  { id: "samaria", label: { en: "Samaria", ko: "사마리아" } },
  { id: "babylon", label: { en: "Babylon", ko: "바벨론" } },
  { id: "persia", label: { en: "Persia", ko: "바사" } },
  { id: "galilee", label: { en: "Galilee", ko: "갈릴리" } },
  { id: "capernaum", label: { en: "Capernaum", ko: "가버나움" } },
  { id: "gethsemane", label: { en: "Gethsemane", ko: "겟세마네" } },
  { id: "golgotha", label: { en: "Golgotha", ko: "골고다" } },
  { id: "emmaus", label: { en: "Emmaus", ko: "엠마오" } },
  { id: "caesarea", label: { en: "Caesarea", ko: "가이사랴" } },
  { id: "antioch", label: { en: "Antioch", ko: "안디옥" } },
  { id: "shechem", label: { en: "Shechem", ko: "세겜" } },
  { id: "aram", label: { en: "Aram", ko: "아람" } },
  { id: "assyria", label: { en: "Assyria", ko: "앗수르" } },
  { id: "judean-wilderness", label: { en: "Judean Wilderness", ko: "유대 광야" } },
  { id: "sea-of-galilee", label: { en: "Sea of Galilee", ko: "갈릴리 호수" } },
  { id: "rome", label: { en: "Rome", ko: "로마" } },
];

const assyriaEmpireTag = { en: "Assyria", ko: "앗수르" } satisfies TimelineText;
const babylonEmpireTag = { en: "Babylon", ko: "바벨론" } satisfies TimelineText;
const persiaEmpireTag = { en: "Persia", ko: "바사" } satisfies TimelineText;
const samuelProphetTag = { en: "Samuel", ko: "사무엘" } satisfies TimelineText;
const nathanProphetTag = { en: "Nathan", ko: "나단" } satisfies TimelineText;
const elijahProphetTag = { en: "Elijah", ko: "엘리야" } satisfies TimelineText;
const isaiahProphetTag = { en: "Isaiah", ko: "이사야" } satisfies TimelineText;
const jeremiahProphetTag = { en: "Jeremiah", ko: "예레미야" } satisfies TimelineText;
const hoseaProphetTag = { en: "Hosea", ko: "호세아" } satisfies TimelineText;
const amosProphetTag = { en: "Amos", ko: "아모스" } satisfies TimelineText;
const baalProphetsTag = { en: "Prophets of Baal", ko: "바알 선지자들" } satisfies TimelineText;
const periodById = new Map(timelinePeriods.map((period) => [period.id, period]));
const bookById = new Map(timelineBooks.map((book) => [book.id, book]));
const placeById = new Map(timelinePlaces.map((place) => [place.id, place]));

const noDatePreview: TimelineDatePreview = {
  dateBasisLabel: { en: "Not dated in this preview", ko: "이 미리보기에서는 연대 미표기" },
  dateConfidenceLabel: { en: "Scripture anchor high; chronology not asserted", ko: "본문 근거는 높음, 연대는 단정하지 않음" },
  dateLabel: { en: "Undated", ko: "연대 미표기" },
};

const biblicalSequencePreview: TimelineDatePreview = {
  dateBasisLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
  dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
  dateLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
};

const approximateYearPreviewByPeriod: Record<string, TimelineDatePreview> = {
  primeval: noDatePreview,
  patriarchs: {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 2000 BC", ko: "약 주전 2000년" },
  },
  exodus: {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 1400 BC", ko: "약 주전 1400년" },
  },
  conquest: {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 1400 BC", ko: "약 주전 1400년" },
  },
  "united-kingdom": {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 1000 BC", ko: "약 주전 1000년" },
  },
  "divided-kingdom": {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 900-700 BC", ko: "약 주전 900-700년" },
  },
  exile: {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 586 BC", ko: "약 주전 586년" },
  },
  return: {
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    dateLabel: { en: "c. 538 BC", ko: "약 주전 538년" },
  },
  gospel: {
    dateBasisLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    dateLabel: { en: "c. AD 30", ko: "약 주후 30년" },
  },
  acts: {
    dateBasisLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    dateLabel: { en: "c. AD 30-60", ko: "약 주후 30-60년" },
  },
};

export function getTimelineDatePreview(event: TimelineEvent): TimelineDatePreview {
  const fallback = approximateYearPreviewByPeriod[event.periodId] ?? biblicalSequencePreview;

  return {
    dateBasisLabel: event.dateBasisLabel ?? fallback.dateBasisLabel,
    dateConfidenceLabel: event.dateConfidenceLabel ?? fallback.dateConfidenceLabel,
    dateLabel: event.dateLabel ?? fallback.dateLabel,
  };
}

function createAnchor(label: TimelineText, reader: TimelineReader): TimelineScriptureAnchor {
  return { label, reader };
}

export const timelineKingdomComparisonRows: TimelineKingdomComparisonRow[] = [
  {
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "1 Samuel 3 and 8 textual connection", ko: "사무엘상 3장과 8장 본문 연결" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    eraLabel: { en: "Judges to Monarchy", ko: "사사에서 왕정으로" },
    id: "comparison-samuel-monarchy",
    note: { en: "Samuel stands at the transition from the judges period to the monarchy.", ko: "사무엘은 사사 시대에서 왕정 시대로 넘어가는 전환점에 서 있습니다." },
    periodId: "united-kingdom",
    prophetTags: [samuelProphetTag],
    relatedEventIds: ["samuel-transition"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 3:1-21", ko: "사무엘상 3:1-21" },
        { book: "1-samuel", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Samuel 8:1-22", ko: "사무엘상 8:1-22" },
        { book: "1-samuel", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "1 Samuel 3 / 8", ko: "사무엘상 3장 / 8장" },
    unitedKing: { en: "Before monarchy", ko: "왕정 전환 전" },
  },
  {
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "1 Samuel textual sequence", ko: "사무엘상 본문 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    eraLabel: { en: "United Kingdom", ko: "통일 왕국" },
    id: "comparison-saul",
    note: { en: "Saul marks the beginning of Israel's monarchy.", ko: "사울은 이스라엘 왕정의 시작을 보여 줍니다." },
    periodId: "united-kingdom",
    prophetTags: [samuelProphetTag],
    relatedEventIds: ["saul-chosen-king"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 10:17-27", ko: "사무엘상 10:17-27" },
        { book: "1-samuel", chapter: 10, verse: 17, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Samuel 12:1-25", ko: "사무엘상 12:1-25" },
        { book: "1-samuel", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Saul", ko: "사울" },
    unitedKing: { en: "Saul", ko: "사울" },
  },
  {
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "2 Samuel textual sequence", ko: "사무엘하 본문 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    eraLabel: { en: "United Kingdom", ko: "통일 왕국" },
    id: "comparison-david",
    note: { en: "The Davidic covenant connects the kingdom flow to the messianic promise.", ko: "다윗 언약은 왕국 흐름을 메시아 약속과 연결합니다." },
    periodId: "united-kingdom",
    prophetTags: [samuelProphetTag, nathanProphetTag],
    relatedEventIds: ["david-anointed", "davidic-covenant"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 16:1-13", ko: "사무엘상 16:1-13" },
        { book: "1-samuel", chapter: 16, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 7:1-17", ko: "사무엘하 7:1-17" },
        { book: "2-samuel", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "David", ko: "다윗" },
    unitedKing: { en: "David", ko: "다윗" },
  },
  {
    dateLabel: { en: "Solomon's fourth year", ko: "솔로몬 제4년" },
    dateBasisLabel: { en: "1 Kings 6:1 reign-year notice", ko: "열왕기상 6:1의 통치 연수 기록" },
    dateConfidenceLabel: {
      en: "Biblical reign-year stated; external chronology supporting only",
      ko: "본문 통치 연수 기록은 명시, 외부 연대는 보조",
    },
    eraLabel: { en: "United Kingdom", ko: "통일 왕국" },
    id: "comparison-solomon-temple",
    note: { en: "The temple construction is a major textual marker in the united kingdom.", ko: "성전 건축은 통일 왕국의 중요한 본문 표지입니다." },
    periodId: "united-kingdom",
    relatedEventIds: ["solomon-temple"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 6:1", ko: "열왕기상 6:1" },
        { book: "1-kings", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Kings 8:1-66", ko: "열왕기상 8:1-66" },
        { book: "1-kings", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Solomon / Temple", ko: "솔로몬 / 성전" },
    unitedKing: { en: "Solomon", ko: "솔로몬" },
  },
  {
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "1 Kings 12 textual sequence", ko: "열왕기상 12장 본문 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    id: "comparison-kingdom-divided",
    note: { en: "After Solomon, the kingdom divides into Judah and Northern Israel.", ko: "솔로몬 이후 왕국은 유다와 북이스라엘로 갈라집니다." },
    periodId: "divided-kingdom",
    relatedEventIds: ["kingdom-divided"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 12:1-24", ko: "열왕기상 12:1-24" },
        { book: "1-kings", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Kingdom divided", ko: "왕국 분열" },
    judahKing: { en: "Rehoboam", ko: "르호보암" },
    northernKing: { en: "Jeroboam", ko: "여로보암" },
  },
  {
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "1 Kings 18 textual sequence", ko: "열왕기상 18장 본문 순서" },
    dateConfidenceLabel: { en: "Scripture sequence high; date approximate", ko: "본문 사건은 높음, 연대는 근사치" },
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    id: "comparison-ahab-elijah",
    note: { en: "The Mount Carmel event is shown in the Northern Israel context of Ahab.", ko: "갈멜산 사건은 아합 시대 북이스라엘 배경 속에 표시됩니다." },
    periodId: "divided-kingdom",
    prophetTags: [elijahProphetTag],
    relatedEventIds: ["elijah-carmel"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 18:16-40", ko: "열왕기상 18:16-40" },
        { book: "1-kings", chapter: 18, verse: 16, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Ahab / Elijah", ko: "아합 / 엘리야" },
    northernKing: { en: "Ahab", ko: "아합" },
    surroundingNationTags: [baalProphetsTag],
  },
  {
    dateLabel: { en: "Supporting date: c. 722 BC", ko: "보조 연대: 약 주전 722년" },
    dateBasisLabel: { en: "Scripture text with supporting historical chronology", ko: "성경 본문과 보조 역사 연대 연결" },
    dateConfidenceLabel: { en: "Scripture event high; external date supporting", ko: "본문 사건은 높음, 외부 연대는 보조" },
    eraLabel: { en: "Fall of Northern Kingdom", ko: "북이스라엘 멸망" },
    id: "comparison-northern-exile-assyria",
    note: { en: "The fall of Samaria is shown with Assyria as supporting context.", ko: "사마리아 함락은 앗수르 배경 속에 보조적으로 표시됩니다." },
    periodId: "divided-kingdom",
    empireTags: [assyriaEmpireTag],
    prophetTags: [hoseaProphetTag, amosProphetTag],
    relatedEventIds: ["northern-exile"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 17:1-23", ko: "열왕기하 17:1-23" },
        { book: "2-kings", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Samaria / Assyria", ko: "사마리아 / 앗수르" },
    northernKing: { en: "Hoshea", ko: "호세아" },
  },
  {
    dateLabel: { en: "Supporting date: c. 701 BC", ko: "보조 연대: 약 주전 701년" },
    dateBasisLabel: { en: "Scripture text with supporting historical chronology", ko: "성경 본문과 보조 역사 연대 연결" },
    dateConfidenceLabel: { en: "Scripture event high; external date supporting", ko: "본문 사건은 높음, 외부 연대는 보조" },
    eraLabel: { en: "Judah / Assyrian Crisis", ko: "유다 / 앗수르 위기" },
    id: "comparison-hezekiah-assyria",
    note: { en: "The Jerusalem crisis in Hezekiah's day is shown within the Assyrian pressure context.", ko: "히스기야 시대 예루살렘 위기는 앗수르의 유다 압박 배경 속에 표시됩니다." },
    periodId: "divided-kingdom",
    empireTags: [assyriaEmpireTag],
    prophetTags: [isaiahProphetTag],
    relatedEventIds: ["hezekiah-assyria"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 18:13-37", ko: "열왕기하 18:13-37" },
        { book: "2-kings", chapter: 18, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 19:1-37", ko: "열왕기하 19:1-37" },
        { book: "2-kings", chapter: 19, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 36:1-22", ko: "이사야 36:1-22" },
        { book: "isaiah", chapter: 36, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 37:1-38", ko: "이사야 37:1-38" },
        { book: "isaiah", chapter: 37, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Hezekiah / Sennacherib", ko: "히스기야 / 산헤립" },
    judahKing: { en: "Hezekiah", ko: "히스기야" },
  },
  {
    dateLabel: { en: "Supporting date: c. 586 BC", ko: "보조 연대: 약 주전 586년" },
    dateBasisLabel: { en: "Scripture text with supporting historical chronology", ko: "성경 본문과 보조 역사 연대 연결" },
    dateConfidenceLabel: { en: "Scripture event high; external date supporting", ko: "본문 사건은 높음, 외부 연대는 보조" },
    eraLabel: { en: "Fall of Judah / Exile", ko: "유다 멸망 / 포로" },
    id: "comparison-jerusalem-babylon",
    note: { en: "The fall of Jerusalem is shown with Babylonian exile context as a supporting layer.", ko: "예루살렘 함락은 바벨론 포로 배경 속에 보조적으로 표시됩니다." },
    periodId: "exile",
    empireTags: [babylonEmpireTag],
    prophetTags: [jeremiahProphetTag],
    relatedEventIds: ["fall-of-jerusalem"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 36:15-21", ko: "역대하 36:15-21" },
        { book: "2-chronicles", chapter: 36, verse: 15, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Jeremiah 39:1-10", ko: "예레미야 39:1-10" },
        { book: "jeremiah", chapter: 39, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Zedekiah / Nebuchadnezzar", ko: "시드기야 / 느부갓네살" },
    judahKing: { en: "Zedekiah", ko: "시드기야" },
  },
  {
    dateLabel: { en: "Supporting date: c. 538 BC", ko: "보조 연대: 약 주전 538년" },
    dateBasisLabel: { en: "Scripture text with supporting historical chronology", ko: "성경 본문과 보조 역사 연대 연결" },
    dateConfidenceLabel: { en: "Scripture event high; external date supporting", ko: "본문 사건은 높음, 외부 연대는 보조" },
    eraLabel: { en: "Return", ko: "귀환" },
    id: "comparison-cyrus-return",
    note: { en: "The return is shown within the Persian Empire and Cyrus decree context.", ko: "귀환은 바사 제국과 고레스 칙령 배경 속에 표시됩니다." },
    periodId: "return",
    empireTags: [persiaEmpireTag],
    relatedEventIds: ["return-decree"],
    scriptureAnchors: [
      createAnchor(
        { en: "Ezra 1:1-11", ko: "에스라 1:1-11" },
        { book: "ezra", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 36:22-23", ko: "역대하 36:22-23" },
        { book: "2-chronicles", chapter: 36, verse: 22, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    sequenceLabel: { en: "Cyrus's decree", ko: "고레스 칙령" },
  },
  {
    id: "comparison-asa-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Asa", ko: "아사" },
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 15:9-24", ko: "열왕기상 15:9-24" },
        { book: "1-kings", chapter: 15, verse: 9, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 14:1-15", ko: "역대하 14:1-15" },
        { book: "2-chronicles", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    judahKing: { en: "Asa", ko: "아사" },
    prophetTags: [{ en: "Azariah", ko: "아사랴" }],
    surroundingNationTags: [{ en: "Cush", ko: "구스" }],
    dateLabel: { en: "Biblical royal sequence", ko: "성경 내부 왕정 순서" },
    note: { en: "Asa is shown as an early king of Judah in the divided kingdom.", ko: "아사는 분열 왕국 초기 유다 왕으로 표시됩니다." },
  },
  {
    id: "comparison-jehoshaphat-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Jehoshaphat", ko: "여호사밧" },
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 22:41-50", ko: "열왕기상 22:41-50" },
        { book: "1-kings", chapter: 22, verse: 41, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 17:1-19", ko: "역대하 17:1-19" },
        { book: "2-chronicles", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    judahKing: { en: "Jehoshaphat", ko: "여호사밧" },
    prophetTags: [{ en: "Jehu son of Hanani", ko: "하나니의 아들 예후" }],
    note: {
      en: "Jehoshaphat belongs to Judah's royal line and overlaps with Ahab's Northern Israel context.",
      ko: "여호사밧은 유다 왕정 흐름에서 아합 시대 북이스라엘과도 연결됩니다.",
    },
  },
  {
    id: "comparison-omri-ahab",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Omri / Ahab", ko: "오므리 / 아합" },
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 16:21-34", ko: "열왕기상 16:21-34" },
        { book: "1-kings", chapter: 16, verse: 21, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    northernKing: { en: "Omri / Ahab", ko: "오므리 / 아합" },
    prophetTags: [{ en: "Elijah", ko: "엘리야" }],
    note: {
      en: "Omri's dynasty and Ahab remain major textual markers in Northern Israel, while Elijah is kept here only as supporting prophetic context.",
      ko: "오므리 왕조와 아합은 북이스라엘 흐름의 중요한 본문 표지로 남아 있으며, 엘리야는 여기서 보조적 선지자 문맥으로만 표시됩니다.",
    },
  },
  {
    id: "comparison-jehu-northern-israel",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Jehu", ko: "예후" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 9:1-37", ko: "열왕기하 9:1-37" },
        { book: "2-kings", chapter: 9, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 10:1-36", ko: "열왕기하 10:1-36" },
        { book: "2-kings", chapter: 10, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    northernKing: { en: "Jehu", ko: "예후" },
    prophetTags: [{ en: "Elisha", ko: "엘리사" }],
    note: {
      en: "Jehu marks a dynastic transition in Northern Israel, with Elisha retained here as supporting prophetic context rather than a separate prophet row.",
      ko: "예후는 북이스라엘의 왕조 전환을 보여 주며, 엘리사는 별도 선지자 row가 아니라 보조적 선지자 문맥으로만 유지됩니다.",
    },
  },
  {
    id: "comparison-jeroboam-ii",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Jeroboam II", ko: "여로보암 2세" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 14:23-29", ko: "열왕기하 14:23-29" },
        { book: "2-kings", chapter: 14, verse: 23, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Hosea 1:1", ko: "호세아 1:1" },
        { book: "hosea", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Amos 1:1", ko: "아모스 1:1" },
        { book: "amos", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    northernKing: { en: "Jeroboam II", ko: "여로보암 2세" },
    prophetTags: [
      { en: "Hosea", ko: "호세아" },
      { en: "Amos", ko: "아모스" },
      { en: "Jonah son of Amittai", ko: "아밋대의 아들 요나" },
    ],
    dateLabel: { en: "Biblical royal sequence", ko: "성경 내부 왕정 순서" },
    note: {
      en: "Jeroboam II's reign connects with the superscription settings of Hosea and Amos, which are shown here as supporting context tags rather than standalone prophet entries.",
      ko: "여로보암 2세 시대는 호세아와 아모스의 표제 배경과 연결되며, 이 선지자들은 별도 항목이 아니라 보조 문맥 태그로만 표시됩니다.",
    },
  },
  {
    id: "comparison-uzziah-azariah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Uzziah / Azariah", ko: "웃시야 / 아사랴" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 15:1-7", ko: "열왕기하 15:1-7" },
        { book: "2-kings", chapter: 15, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 26:1-23", ko: "역대하 26:1-23" },
        { book: "2-chronicles", chapter: 26, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 1:1", ko: "이사야 1:1" },
        { book: "isaiah", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    judahKing: { en: "Uzziah / Azariah", ko: "웃시야 / 아사랴" },
    nameVariantNote: {
      en: "2 Kings uses Azariah, while 2 Chronicles and Isaiah's superscription use Uzziah.",
      ko: "열왕기하에서는 아사랴, 역대하와 이사야 표제에서는 웃시야 이름이 사용됩니다.",
    },
    note: {
      en: "Uzziah's reign connects with Isaiah's superscription setting and remains a metadata-only bridge to the selected genealogy comparison rows.",
      ko: "웃시야 시대는 이사야 표제의 왕정 배경과 연결되며, 선택된 족보 비교 row로 이어지는 metadata-only 연결점으로만 유지됩니다.",
    },
    prophetTags: [{ en: "Isaiah", ko: "이사야" }],
  },
  {
    id: "comparison-ahaz-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Judah / Assyrian Crisis", ko: "유다 / 앗수르 위기" },
    sequenceLabel: { en: "Ahaz", ko: "아하스" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 16:1-20", ko: "열왕기하 16:1-20" },
        { book: "2-kings", chapter: 16, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 7:1-17", ko: "이사야 7:1-17" },
        { book: "isaiah", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    empireTags: [{ en: "Assyria", ko: "앗수르" }],
    judahKing: { en: "Ahaz", ko: "아하스" },
    prophetTags: [{ en: "Isaiah", ko: "이사야" }],
    surroundingNationTags: [
      { en: "Aram", ko: "아람" },
      { en: "Northern Israel", ko: "북이스라엘" },
    ],
    note: {
      en: "Ahaz's reign connects with the Aram-Ephraim crisis in Isaiah 7, with Isaiah shown only as supporting prophetic context.",
      ko: "아하스 시대는 이사야 7장의 아람-에브라임 위기와 연결되며, 이사야는 보조적 선지자 문맥으로만 표시됩니다.",
    },
  },
  {
    id: "comparison-manasseh-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Manasseh", ko: "므낫세" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 21:1-18", ko: "열왕기하 21:1-18" },
        { book: "2-kings", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 33:1-20", ko: "역대하 33:1-20" },
        { book: "2-chronicles", chapter: 33, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    empireTags: [{ en: "Assyria", ko: "앗수르" }],
    judahKing: { en: "Manasseh", ko: "므낫세" },
    note: {
      en: "Manasseh is a major textual marker in late Judah's royal history.",
      ko: "므낫세는 유다 말기 왕정 흐름의 중요한 본문 표지입니다.",
    },
  },
  {
    id: "comparison-josiah-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Josiah", ko: "요시야" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 22:1-20", ko: "열왕기하 22:1-20" },
        { book: "2-kings", chapter: 22, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 23:1-30", ko: "열왕기하 23:1-30" },
        { book: "2-kings", chapter: 23, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 34:1-33", ko: "역대하 34:1-33" },
        { book: "2-chronicles", chapter: 34, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    judahKing: { en: "Josiah", ko: "요시야" },
    prophetTags: [
      { en: "Huldah", ko: "훌다" },
      { en: "Jeremiah", ko: "예레미야" },
    ],
    note: {
      en: "Josiah connects with late Judah through the discovery of the Book of the Law and reform.",
      ko: "요시야는 율법책 발견과 개혁 사건을 통해 포로 직전 유다 흐름과 연결됩니다.",
    },
  },
  {
    id: "comparison-jehoiakim-judah",
    periodId: "divided-kingdom",
    eraLabel: { en: "Divided Kingdom", ko: "분열 왕국" },
    sequenceLabel: { en: "Jehoiakim", ko: "여호야김" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 23:34-37", ko: "열왕기하 23:34-37" },
        { book: "2-kings", chapter: 23, verse: 34, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Jeremiah 36:1-32", ko: "예레미야 36:1-32" },
        { book: "jeremiah", chapter: 36, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    empireTags: [{ en: "Babylon", ko: "바벨론" }],
    judahKing: { en: "Jehoiakim", ko: "여호야김" },
    prophetTags: [
      { en: "Jeremiah", ko: "예레미야" },
      { en: "Baruch", ko: "바룩" },
    ],
    note: {
      en: "Jehoiakim connects with the scroll episode in Jeremiah 36.",
      ko: "여호야김은 예레미야 36장의 두루마리 사건과 연결됩니다.",
    },
  },
  {
    id: "comparison-jehoiachin-jeconiah",
    periodId: "exile",
    eraLabel: { en: "Fall of Judah / Exile", ko: "유다 멸망 / 포로" },
    sequenceLabel: { en: "Jehoiachin / Jeconiah", ko: "여호야긴 / 여고냐" },
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 24:8-17", ko: "열왕기하 24:8-17" },
        { book: "2-kings", chapter: 24, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Chronicles 3:16", ko: "역대상 3:16" },
        { book: "1-chronicles", chapter: 3, verse: 16, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Matthew 1:11-12", ko: "마태복음 1:11-12" },
        { book: "matthew", chapter: 1, verse: 11, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    empireTags: [{ en: "Babylon", ko: "바벨론" }],
    judahKing: { en: "Jehoiachin / Jeconiah", ko: "여호야긴 / 여고냐" },
    nameVariantNote: {
      en: "Jehoiachin is associated with the names Jeconiah and Coniah.",
      ko: "여호야긴은 여고냐, 고니야와 연결되는 이름입니다.",
    },
    note: {
      en: "Jehoiachin/Jeconiah forms a metadata-only connection between the deportation context and Matthew's genealogy comparison rows.",
      ko: "여호야긴/여고냐는 포로기 문맥과 마태복음 족보 비교 row 사이의 metadata-only 연결점입니다.",
    },
  },
];

export const timelineBookContextRows: TimelineBookContextRow[] = [
  {
    authorshipBasisLabel: { en: "The biblical text does not explicitly name the author", ko: "성경 본문이 저자를 명시하지 않음" },
    authorshipLabel: { en: "Authorship uncertain", ko: "저자 미상" },
    backgroundBasisLabel: { en: "Inferred background / debated", ko: "본문 배경 추정 / 논의 중" },
    canonicalLocation: { en: "Wisdom / Writings", ko: "지혜서 / 성문서" },
    dateConfidenceLabel: { en: "Scripture event high; setting inferred", ko: "본문 사건은 높음, 배경 시기는 추정" },
    dateLabel: { en: "Date not asserted", ko: "연대 단정 없음" },
    id: "book-context-job",
    historicalSettingLabel: { en: "Possible patriarchal-era setting", ko: "족장 시대 배경 가능성" },
    note: {
      en: "Job belongs canonically among the wisdom writings, while its setting has elements often connected with the patriarchal world. This preview shows that only as a background connection, not as a fixed chronology.",
      ko: "욥기는 정경상 지혜서에 있으나, 배경은 족장 시대와 연결해 볼 수 있는 요소가 있습니다. 이 미리보기는 그것을 확정 연대가 아니라 배경 연결로만 표시합니다.",
    },
    periodId: "patriarchs",
    bookId: "job",
    relatedPeople: [{ en: "Job", ko: "욥" }],
    relatedPlaces: ["uz"],
    scriptureAnchors: [
      createAnchor(
        { en: "Job 1:1-5", ko: "욥기 1:1-5" },
        { book: "job", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Job", ko: "욥기" },
  },
  {
    authorshipBasisLabel: { en: "Superscription-based", ko: "시편 표제 근거" },
    authorshipLabel: { en: "David", ko: "다윗" },
    backgroundBasisLabel: { en: "Superscription-based / connected to 2 Samuel 15-18", ko: "표제 근거 / 사무엘하 15-18장 연결" },
    canonicalLocation: { en: "Psalms", ko: "시편" },
    dateConfidenceLabel: {
      en: "Superscription and textual connection high; exact date not asserted",
      ko: "표제와 본문 연결은 높음, 정확한 연대는 단정하지 않음",
    },
    dateLabel: { en: "Davidic period", ko: "다윗 시대" },
    id: "psalm-context-psalm-3",
    historicalSettingLabel: { en: "David fleeing from Absalom", ko: "다윗이 압살롬을 피할 때" },
    note: {
      en: "Psalm 3's superscription identifies it with David fleeing from Absalom. The Timeline connects it to the Davidic period on that basis.",
      ko: "시편 3편은 표제에서 다윗이 아들 압살롬을 피할 때의 시라고 밝힙니다. 타임라인에서는 표제 근거로 다윗 시대 사건과 연결합니다.",
    },
    periodId: "united-kingdom",
    bookId: "psalms",
    relatedEventIds: ["davidic-covenant"],
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Absalom", ko: "압살롬" },
    ],
    relatedPlaces: ["jerusalem"],
    scriptureAnchors: [
      createAnchor(
        { en: "Psalm 3:1", ko: "시편 3:1" },
        { book: "psalms", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 15:13-37", ko: "사무엘하 15:13-37" },
        { book: "2-samuel", chapter: 15, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Psalm 3", ko: "시편 3편" },
  },
  {
    authorshipBasisLabel: { en: "Superscription-based", ko: "시편 표제 근거" },
    authorshipLabel: { en: "David", ko: "다윗" },
    backgroundBasisLabel: { en: "Superscription-based / connected to 2 Samuel 11-12", ko: "표제 근거 / 사무엘하 11-12장 연결" },
    canonicalLocation: { en: "Psalms", ko: "시편" },
    dateConfidenceLabel: {
      en: "Superscription and textual connection high; exact date not asserted",
      ko: "표제와 본문 연결은 높음, 정확한 연대는 단정하지 않음",
    },
    dateLabel: { en: "Davidic period", ko: "다윗 시대" },
    id: "psalm-context-psalm-51",
    historicalSettingLabel: { en: "After Nathan came to David", ko: "나단이 다윗에게 온 후" },
    note: {
      en: "Psalm 51's superscription gives the setting after Nathan came to David. The Timeline connects that superscription with 2 Samuel 12.",
      ko: "시편 51편은 표제에서 나단이 다윗에게 온 후의 배경을 제시합니다. 타임라인에서는 이 표제를 사무엘하 12장과 연결합니다.",
    },
    periodId: "united-kingdom",
    bookId: "psalms",
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Nathan", ko: "나단" },
    ],
    relatedPlaces: ["jerusalem"],
    scriptureAnchors: [
      createAnchor(
        { en: "Psalm 51:1", ko: "시편 51:1" },
        { book: "psalms", chapter: 51, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 12:1-14", ko: "사무엘하 12:1-14" },
        { book: "2-samuel", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Psalm 51", ko: "시편 51편" },
  },
  {
    authorshipBasisLabel: { en: "Superscription-based", ko: "시편 표제 근거" },
    authorshipLabel: { en: "Moses", ko: "모세" },
    backgroundBasisLabel: { en: "Superscription-based / wilderness-period connection", ko: "표제 근거 / 광야 시대 연결" },
    canonicalLocation: { en: "Psalms", ko: "시편" },
    dateConfidenceLabel: { en: "Superscription clear; exact composition date not asserted", ko: "표제 근거는 명확, 정확한 작성 연대는 단정하지 않음" },
    dateLabel: { en: "Wilderness-period connection", ko: "광야 시대 연결" },
    id: "psalm-context-psalm-90",
    historicalSettingLabel: { en: "Moses / wilderness setting", ko: "모세 / 광야 배경" },
    note: {
      en: "Psalm 90's superscription presents it as a prayer of Moses. The Timeline connects it with the wilderness period without asserting an exact composition date.",
      ko: "시편 90편은 표제에서 모세의 기도로 제시됩니다. 타임라인에서는 광야 시대와 연결하되, 정확한 작성 연대는 단정하지 않습니다.",
    },
    periodId: "exodus",
    bookId: "psalms",
    relatedEventIds: ["wilderness-forty-years"],
    relatedPeople: [{ en: "Moses", ko: "모세" }],
    relatedPlaces: ["sinai", "kadesh-barnea"],
    scriptureAnchors: [
      createAnchor(
        { en: "Psalm 90:1", ko: "시편 90:1" },
        { book: "psalms", chapter: 90, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Deuteronomy 29:5", ko: "신명기 29:5" },
        { book: "deuteronomy", chapter: 29, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Psalm 90", ko: "시편 90편" },
  },
  {
    authorshipBasisLabel: { en: "The text does not name the author", ko: "본문이 저자를 명시하지 않음" },
    authorshipLabel: { en: "Authorship not named", ko: "저자 미상" },
    backgroundBasisLabel: { en: "Textual background / Babylonian exile connection", ko: "본문 배경 / 바벨론 포로 연결" },
    canonicalLocation: { en: "Psalms", ko: "시편" },
    dateConfidenceLabel: { en: "Textual setting high; author not named", ko: "본문 배경은 높음, 저자는 명시되지 않음" },
    dateLabel: { en: "Exile-period connection", ko: "포로기 연결" },
    id: "psalm-context-psalm-137",
    historicalSettingLabel: { en: "Babylonian exile setting", ko: "바벨론 포로 배경" },
    note: {
      en: "Psalm 137 shows an exile setting through the rivers of Babylon and the memory of Zion. The author is not named in the text.",
      ko: "시편 137편은 바벨론 강가와 시온 기억을 통해 포로기 배경을 보여 줍니다. 저자는 본문에서 명시하지 않습니다.",
    },
    periodId: "exile",
    bookId: "psalms",
    relatedEventIds: ["fall-of-jerusalem"],
    relatedPeople: [{ en: "The exiles", ko: "포로 된 자들" }],
    relatedPlaces: ["babylon", "jerusalem"],
    scriptureAnchors: [
      createAnchor(
        { en: "Psalm 137:1-9", ko: "시편 137:1-9" },
        { book: "psalms", chapter: 137, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Psalm 137", ko: "시편 137편" },
  },
  {
    authorshipBasisLabel: { en: "Traditional view", ko: "전통적 견해" },
    authorshipLabel: { en: "Traditionally associated with Jeremiah", ko: "전통적으로 예레미야와 연결" },
    backgroundBasisLabel: { en: "Fall of Jerusalem background", ko: "예루살렘 함락 배경" },
    canonicalLocation: { en: "Prophetic/Writings context / Lament", ko: "예언서 / 애가" },
    dateConfidenceLabel: { en: "Textual background high; authorship tradition separately labeled", ko: "본문 배경은 높음, 저자 전통은 구분 표시" },
    dateLabel: { en: "Exile-period connection", ko: "포로기 연결" },
    id: "book-context-lamentations",
    historicalSettingLabel: { en: "Lament after Jerusalem's fall", ko: "예루살렘 함락 이후 애가" },
    note: {
      en: "Lamentations laments the desolation of Jerusalem and connects to the exile setting. Authorship tradition is displayed separately from the textual background.",
      ko: "예레미야애가는 예루살렘의 황폐함을 애통하는 책으로 포로기 배경과 연결됩니다. 저자 전통은 본문 배경과 구분해서 표시합니다.",
    },
    periodId: "exile",
    bookId: "lamentations",
    relatedEventIds: ["fall-of-jerusalem"],
    relatedPeople: [{ en: "Jeremiah", ko: "예레미야" }],
    relatedPlaces: ["jerusalem", "babylon"],
    scriptureAnchors: [
      createAnchor(
        { en: "Lamentations 1:1-5", ko: "예레미야애가 1:1-5" },
        { book: "lamentations", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Lamentations", ko: "예레미야애가" },
  },
  {
    authorshipBasisLabel: { en: "Internal figure and traditional association", ko: "책 내부 인물 및 전통 연결" },
    authorshipLabel: { en: "Daniel", ko: "다니엘" },
    backgroundBasisLabel: { en: "Textual setting / exile court context", ko: "본문 배경 / 포로기 왕궁 배경" },
    canonicalLocation: { en: "Prophetic / Exile context", ko: "예언서 / 포로기" },
    dateConfidenceLabel: { en: "Textual setting high; detailed dating discussion separate", ko: "본문 배경은 높음, 세부 연대 논의는 별도" },
    dateLabel: { en: "Exile / Persian connection", ko: "포로기 / 바사 연결" },
    id: "book-context-daniel",
    historicalSettingLabel: { en: "Babylonian and Persian setting", ko: "바벨론과 바사 배경" },
    note: {
      en: "Daniel is read within Babylonian and Persian court settings. This preview shows the textual setting while leaving detailed dating discussion for another phase.",
      ko: "다니엘은 바벨론과 바사 궁정 배경 속에서 읽힙니다. 이 미리보기는 본문 배경을 표시하되, 세부 연대 논의는 별도 단계로 둡니다.",
    },
    periodId: "exile",
    bookId: "daniel",
    relatedEmpires: [
      { en: "Babylon", ko: "바벨론" },
      { en: "Persia", ko: "바사" },
    ],
    relatedPeople: [
      { en: "Daniel", ko: "다니엘" },
      { en: "Nebuchadnezzar", ko: "느부갓네살" },
      { en: "Darius", ko: "다리오" },
    ],
    relatedPlaces: ["babylon", "persia"],
    scriptureAnchors: [
      createAnchor(
        { en: "Daniel 1:1-7", ko: "다니엘 1:1-7" },
        { book: "daniel", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Daniel 6:1-28", ko: "다니엘 6:1-28" },
        { book: "daniel", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Daniel", ko: "다니엘" },
  },
  {
    backgroundBasisLabel: { en: "Textual background / return-period connection", ko: "본문 배경 / 귀환기 연결" },
    canonicalLocation: { en: "Historical / Return context", ko: "역사서 / 귀환기" },
    dateConfidenceLabel: {
      en: "Textual setting clear; exact composition date not asserted",
      ko: "본문 배경은 분명, 정확한 작성 연대는 단정하지 않음",
    },
    dateLabel: { en: "Return-period connection", ko: "귀환기 연결" },
    historicalSettingLabel: { en: "Return and temple restoration under Persia", ko: "바사 시대 귀환과 성전 회복" },
    id: "book-context-ezra",
    note: {
      en: "Ezra belongs with the return and temple-restoration movement after the exile. This preview keeps the setting Scripture-first and does not overstate the date.",
      ko: "에스라는 포로기 이후 귀환과 성전 회복 흐름에 속합니다. 이 미리보기는 본문 우선을 유지하고 연대를 과도하게 단정하지 않습니다.",
    },
    periodId: "return",
    bookId: "ezra",
    relatedEmpires: [{ en: "Persia", ko: "바사" }],
    relatedPeople: [
      { en: "Ezra", ko: "에스라" },
      { en: "Zerubbabel", ko: "스룹바벨" },
    ],
    relatedEventIds: ["return-decree"],
    scriptureAnchors: [
      createAnchor(
        { en: "Ezra 1:1-11", ko: "에스라 1:1-11" },
        { book: "ezra", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ezra 7:1-10", ko: "에스라 7:1-10" },
        { book: "ezra", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Ezra", ko: "에스라" },
  },
  {
    backgroundBasisLabel: { en: "Textual background / return-period connection", ko: "본문 배경 / 귀환기 연결" },
    canonicalLocation: { en: "Historical / Return context", ko: "역사서 / 귀환기" },
    dateConfidenceLabel: {
      en: "Textual setting clear; exact composition date not asserted",
      ko: "본문 배경은 분명, 정확한 작성 연대는 단정하지 않음",
    },
    dateLabel: { en: "Return-period connection", ko: "귀환기 연결" },
    historicalSettingLabel: { en: "Rebuilding Jerusalem's wall", ko: "예루살렘 성벽 재건" },
    id: "book-context-nehemiah",
    note: {
      en: "Nehemiah is read in the return period as the rebuilding of Jerusalem's wall takes shape. The preview keeps that setting without claiming a final dating solution.",
      ko: "느헤미야는 귀환기 예루살렘 성벽 재건이 진행되는 흐름 속에서 읽힙니다. 이 미리보기는 그 배경을 보여 주되 최종 연대 해법을 단정하지 않습니다.",
    },
    periodId: "return",
    bookId: "nehemiah",
    relatedEmpires: [{ en: "Persia", ko: "바사" }],
    relatedPeople: [
      { en: "Nehemiah", ko: "느헤미야" },
      { en: "Ezra", ko: "에스라" },
    ],
    relatedPlaces: ["jerusalem", "susa"],
    scriptureAnchors: [
      createAnchor(
        { en: "Nehemiah 1:1-11", ko: "느헤미야 1:1-11" },
        { book: "nehemiah", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Nehemiah 2:1-20", ko: "느헤미야 2:1-20" },
        { book: "nehemiah", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Nehemiah", ko: "느헤미야" },
  },
  {
    backgroundBasisLabel: { en: "Textual background / Persian imperial setting", ko: "본문 배경 / 바사 제국 배경" },
    canonicalLocation: { en: "Historical / Wisdom-Historical context", ko: "역사서 / 지혜적 역사 맥락" },
    dateConfidenceLabel: {
      en: "Textual setting clear; detailed external chronology supporting",
      ko: "본문 배경은 분명, 세부 외부 연대는 보조",
    },
    dateLabel: { en: "Persian-period connection", ko: "바사 시대 연결" },
    historicalSettingLabel: { en: "Persian imperial setting in Susa", ko: "바사 제국 수산 궁 배경" },
    id: "book-context-esther",
    note: {
      en: "Esther is set inside the Persian imperial court at Susa. The preview keeps the historical setting clear while treating external chronology as supporting only.",
      ko: "에스더는 수산 궁의 바사 제국 배경 속에 놓입니다. 이 미리보기는 역사적 배경을 분명히 하되 외부 연대는 보조로만 둡니다.",
    },
    periodId: "return",
    bookId: "esther",
    relatedEmpires: [{ en: "Persia", ko: "바사" }],
    relatedPeople: [
      { en: "Esther", ko: "에스더" },
      { en: "Mordecai", ko: "모르드개" },
      { en: "Ahasuerus", ko: "아하수에로" },
    ],
    relatedPlaces: ["susa"],
    scriptureAnchors: [
      createAnchor(
        { en: "Esther 1:1-3", ko: "에스더 1:1-3" },
        { book: "esther", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Esther 2:5-18", ko: "에스더 2:5-18" },
        { book: "esther", chapter: 2, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Esther", ko: "에스더" },
  },
  {
    backgroundBasisLabel: { en: "Textual background / return-period connection", ko: "본문 배경 / 귀환기 연결" },
    canonicalLocation: { en: "Prophetic / Post-exilic context", ko: "예언서 / 포로기 이후" },
    dateConfidenceLabel: {
      en: "Textual setting clear; exact dating not asserted",
      ko: "본문 배경은 분명, 정확한 연대는 단정하지 않음",
    },
    dateLabel: { en: "Return-period connection", ko: "귀환기 연결" },
    historicalSettingLabel: { en: "Exhortation to rebuild the temple", ko: "성전 재건 권면" },
    id: "book-context-haggai",
    note: {
      en: "Haggai speaks into the return-period call to rebuild the temple. This preview marks the biblical setting without claiming a full external chronology.",
      ko: "학개는 귀환기 성전 재건 권면의 흐름 속에서 말합니다. 이 미리보기는 성경 배경을 표시하되 외부 연대를 완전하게 단정하지 않습니다.",
    },
    periodId: "return",
    bookId: "haggai",
    relatedEmpires: [{ en: "Persia", ko: "바사" }],
    relatedPeople: [
      { en: "Haggai", ko: "학개" },
      { en: "Zerubbabel", ko: "스룹바벨" },
      { en: "Joshua son of Jehozadak", ko: "여호사닥의 아들 여호수아" },
    ],
    scriptureAnchors: [
      createAnchor(
        { en: "Haggai 1:1-15", ko: "학개 1:1-15" },
        { book: "haggai", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ezra 5:1-2", ko: "에스라 5:1-2" },
        { book: "ezra", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Haggai", ko: "학개" },
  },
  {
    backgroundBasisLabel: { en: "Textual background / return-period connection", ko: "본문 배경 / 귀환기 연결" },
    canonicalLocation: { en: "Prophetic / Post-exilic context", ko: "예언서 / 포로기 이후" },
    dateConfidenceLabel: {
      en: "Textual setting clear; exact dating not asserted",
      ko: "본문 배경은 분명, 정확한 연대는 단정하지 않음",
    },
    dateLabel: { en: "Return-period connection", ko: "귀환기 연결" },
    historicalSettingLabel: { en: "Returned community and temple rebuilding setting", ko: "귀환 공동체와 성전 재건 배경" },
    id: "book-context-zechariah",
    note: {
      en: "Zechariah addresses the returned community as the temple rebuilding work continues. The preview keeps the setting Scripture-first and date-cautious.",
      ko: "스가랴는 성전 재건이 이어지는 귀환 공동체를 향해 말합니다. 이 미리보기는 본문 우선과 연대 주의를 유지합니다.",
    },
    periodId: "return",
    bookId: "zechariah",
    relatedEmpires: [{ en: "Persia", ko: "바사" }],
    relatedPeople: [
      { en: "Zechariah", ko: "스가랴" },
      { en: "Zerubbabel", ko: "스룹바벨" },
    ],
    scriptureAnchors: [
      createAnchor(
        { en: "Zechariah 1:1-6", ko: "스가랴 1:1-6" },
        { book: "zechariah", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ezra 5:1-2", ko: "에스라 5:1-2" },
        { book: "ezra", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    title: { en: "Zechariah", ko: "스가랴" },
  },
];

export function getTimelineText(text: TimelineText, locale: TimelineLocale): string {
  return text[locale];
}

export function getTimelinePeriod(periodId: string): TimelinePeriod | undefined {
  return periodById.get(periodId);
}

export function getTimelineBook(bookId: string): TimelineBook | undefined {
  return bookById.get(bookId);
}

export function getTimelinePlace(placeId: string): TimelinePlace | undefined {
  return placeById.get(placeId);
}

export function getTimelineReaderHref(event: TimelineEvent, locale: TimelineLocale): string {
  const translation = event.reader.translation[locale];

  return `/${locale}/bible/${translation}/${event.reader.book}/${event.reader.chapter}?mode=reader#v${event.reader.verse}`;
}

export function getTimelineReaderHrefFromReader(
  reader: TimelineReader,
  locale: TimelineLocale,
): string {
  const translation = reader.translation[locale];

  return `/${locale}/bible/${translation}/${reader.book}/${reader.chapter}?mode=reader#v${reader.verse}`;
}
