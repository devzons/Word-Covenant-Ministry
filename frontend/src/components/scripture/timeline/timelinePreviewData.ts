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

const noChronology = {
  en: "External chronology is not shown in this preview.",
  ko: "외부 연대는 이 미리보기에서 표시하지 않습니다.",
} satisfies TimelineText;

const highConfidence = {
  en: "Scripture anchor: High",
  ko: "본문 근거: 높음",
} satisfies TimelineText;

const narrativeSequence = {
  en: "Dating: Internal biblical sequence",
  ko: "연대: 성경 내부 순서",
} satisfies TimelineText;

const approximateSequence = {
  en: "Dating: Approximate biblical sequence",
  ko: "연대: 성경 순서에 따른 대략적 배치",
} satisfies TimelineText;

const israelKingdomTag = { en: "Israel", ko: "이스라엘" } satisfies TimelineText;
const unitedKingdomTag = { en: "United Kingdom", ko: "통일 왕국" } satisfies TimelineText;
const judahKingdomTag = { en: "Judah", ko: "유다" } satisfies TimelineText;
const northernIsraelKingdomTag = { en: "Northern Israel", ko: "북이스라엘" } satisfies TimelineText;
const assyriaEmpireTag = { en: "Assyria", ko: "앗수르" } satisfies TimelineText;
const babylonEmpireTag = { en: "Babylon", ko: "바벨론" } satisfies TimelineText;
const persiaEmpireTag = { en: "Persia", ko: "바사" } satisfies TimelineText;
const samuelProphetTag = { en: "Samuel", ko: "사무엘" } satisfies TimelineText;
const saulRulerTag = { en: "Saul", ko: "사울" } satisfies TimelineText;
const davidRulerTag = { en: "David", ko: "다윗" } satisfies TimelineText;
const solomonRulerTag = { en: "Solomon", ko: "솔로몬" } satisfies TimelineText;
const rehoboamRulerTag = { en: "Rehoboam", ko: "르호보암" } satisfies TimelineText;
const jeroboamRulerTag = { en: "Jeroboam", ko: "여로보암" } satisfies TimelineText;
const ahabRulerTag = { en: "Ahab", ko: "아합" } satisfies TimelineText;
const hezekiahRulerTag = { en: "Hezekiah", ko: "히스기야" } satisfies TimelineText;
const sennacheribRulerTag = { en: "Sennacherib", ko: "산헤립" } satisfies TimelineText;
const hosheaRulerTag = { en: "Hoshea", ko: "호세아" } satisfies TimelineText;
const nathanProphetTag = { en: "Nathan", ko: "나단" } satisfies TimelineText;
const elijahProphetTag = { en: "Elijah", ko: "엘리야" } satisfies TimelineText;
const isaiahProphetTag = { en: "Isaiah", ko: "이사야" } satisfies TimelineText;
const jeremiahProphetTag = { en: "Jeremiah", ko: "예레미야" } satisfies TimelineText;
const hoseaProphetTag = { en: "Hosea", ko: "호세아" } satisfies TimelineText;
const amosProphetTag = { en: "Amos", ko: "아모스" } satisfies TimelineText;
const baalProphetsTag = { en: "Prophets of Baal", ko: "바알 선지자들" } satisfies TimelineText;
const cyrusRulerTag = { en: "Cyrus", ko: "고레스" } satisfies TimelineText;
const modernReferenceConnected = { en: "Modern-name connection", ko: "현대 지명 연결" } satisfies TimelineText;
const modernReferenceApproximate = { en: "Broad modern region", ko: "대략적 현대 지역" } satisfies TimelineText;
const modernReferenceCandidate = { en: "Candidate identification, not asserted", ko: "후보지, 단정하지 않음" } satisfies TimelineText;
const modernReferenceTraditional = { en: "Traditional identification / debated", ko: "전통 위치 / 논의 가능" } satisfies TimelineText;
const locationBasisRepeated = { en: "Repeated biblical textual location", ko: "성경 본문 반복 등장" } satisfies TimelineText;
const locationBasisTextual = { en: "Textual setting", ko: "본문 배경" } satisfies TimelineText;
const locationConfidenceMajor = { en: "Major biblical location", ko: "성경 본문 중심 장소" } satisfies TimelineText;
const locationConfidenceBroad = { en: "Broad biblical region", ko: "대략적 성경 지역" } satisfies TimelineText;
const locationConfidenceCandidate = { en: "Candidate identification, not asserted", ko: "현대 지점 단정하지 않음" } satisfies TimelineText;
const locationConfidenceNotAsserted = { en: "Exact location not asserted", ko: "정확한 위치 단정 안 함" } satisfies TimelineText;
const noCoordinatesNote = { en: "No coordinates in this preview.", ko: "이 미리보기에는 좌표가 없습니다." } satisfies TimelineText;

const periodById = new Map(timelinePeriods.map((period) => [period.id, period]));
const bookById = new Map(timelineBooks.map((book) => [book.id, book]));
const placeById = new Map(timelinePlaces.map((place) => [place.id, place]));

const noDatePreview: TimelineDatePreview = {
  dateBasisLabel: { en: "Not dated in this preview", ko: "이 미리보기에서는 연대 미표기" },
  dateConfidenceLabel: { en: "Scripture anchor high; chronology not asserted", ko: "본문 근거는 높음, 연대는 단정하지 않음" },
  dateLabel: { en: "Undated", ko: "연대 미표기" },
};

const scriptureRelativeYearPreview: TimelineDatePreview = {
  dateBasisLabel: { en: "Scripture-derived relative year", ko: "성경 내부 연수" },
  dateConfidenceLabel: { en: "Scripture anchor high; chronology not asserted", ko: "본문 근거는 높음, 연대는 단정하지 않음" },
  dateLabel: { en: "Biblical relative year", ko: "성경 내부 연수" },
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

function createEvent(event: TimelineEvent): TimelineEvent {
  return event;
}

export const passionWeekTimelineEvents: TimelineEvent[] = [
  createEvent({
    id: "creation",
    title: { en: "Creation", ko: "창조" },
    summary: { en: "God creates the heavens and the earth.", ko: "하나님이 하늘과 땅을 창조하십니다." },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["psalms", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 1:1-2:3", ko: "창세기 1:1-2:3" },
        { book: "genesis", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [],
    placeIds: ["eden"],
    locationNote: {
      en: "The opening scene is cosmic rather than local.",
      ko: "시작 장면은 우주적 배경에 가깝습니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the fall", ko: "타락 이전" },
    eventType: { en: "Primeval event", ko: "태고 사건" },
    durationLabel: { en: "Creation week", ko: "창조 주간" },
    reader: { book: "genesis", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "adam-first-humanity",
    title: { en: "Adam and First Humanity", ko: "아담과 첫 사람" },
    summary: {
      en: "The first human pair and humanity's starting point are shown in Scripture.",
      ko: "첫 인간 부부와 인류의 시작점이 성경에서 보입니다.",
    },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["psalms", "romans"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 1:26-28", ko: "창세기 1:26-28" },
        { book: "genesis", chapter: 1, verse: 26, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 2:7", ko: "창세기 2:7" },
        { book: "genesis", chapter: 2, verse: 7, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Adam", ko: "아담" }, { en: "Eve", ko: "하와" }],
    placeIds: ["eden"],
    locationNote: {
      en: "Eden remains the setting for the human starting point.",
      ko: "에덴은 인류 시작점의 배경으로 남습니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After creation", ko: "창조 뒤" },
    eventType: { en: "Creation order", ko: "창조 질서" },
    dateLabel: { en: "Undated", ko: "연대 미표기" },
    relativeYearLabel: { en: "AM 0", ko: "아담 기준 0년" },
    relativeYearValue: 0,
    relativeYearBasisLabel: { en: "Genesis 1-2 textual sequence", ko: "창세기 1-2장 본문 순서" },
    relativeYearCalculationNote: {
      en: "Adam is shown as the reference point from the creation-of-humanity text, not as a calculated birth year.",
      ko: "아담의 출생 연도는 계산식이 아니라 창세기 인간 창조 본문을 기준점으로 둔 표시입니다.",
    },
    dateBasisLabel: { en: "Scripture sequence", ko: "성경 내부 순서" },
    dateConfidenceLabel: {
      en: "Scripture anchor high; chronology not asserted",
      ko: "본문 근거는 높음, 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 1, verse: 26, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "fall",
    title: { en: "Fall", ko: "타락" },
    summary: { en: "Human disobedience enters the biblical flow.", ko: "인간의 불순종이 성경 흐름에 들어옵니다." },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["romans", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 3:1-24", ko: "창세기 3:1-24" },
        { book: "genesis", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Adam and Eve", ko: "아담과 하와" }],
    placeIds: ["eden"],
    locationNote: {
      en: "The garden remains central to the setting.",
      ko: "동산이 사건의 중심 배경입니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After creation", ko: "창조 후" },
    eventType: { en: "Primeval event", ko: "태고 사건" },
    reader: { book: "genesis", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "adam-cain-abel-seth",
    title: { en: "Adam's House: Cain, Abel, and Seth", ko: "아담의 집: 가인, 아벨, 셋" },
    summary: {
      en: "Adam's household and the opening family lines are traced in Scripture.",
      ko: "아담의 집과 초기 가계가 성경에서 추적됩니다.",
    },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["romans", "hebrews", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 4:1-26", ko: "창세기 4:1-26" },
        { book: "genesis", chapter: 4, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 5:1-5", ko: "창세기 5:1-5" },
        { book: "genesis", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Adam", ko: "아담" },
      { en: "Cain", ko: "가인" },
      { en: "Abel", ko: "아벨" },
      { en: "Seth", ko: "셋" },
    ],
    placeIds: ["eden"],
    locationNote: {
      en: "The bridge keeps the household connected to Eden without overclaiming chronology.",
      ko: "이 연결은 연대 단정을 피하면서도 가계를 에덴과 연결합니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the flood", ko: "홍수 이전" },
    eventType: { en: "Genealogy bridge", ko: "계보 연결" },
    dateLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    relativeYearLabel: { en: "AM 130", ko: "아담 기준 130년" },
    relativeYearValue: 130,
    relativeYearBasisLabel: { en: "Genesis 5 age calculation", ko: "창세기 5장 연수 계산" },
    relativeYearCalculationNote: {
      en: "Genesis 5:3 records that Adam was 130 years old when Seth was born. Cain and Abel appear earlier in the Genesis 4 event flow.",
      ko: "창세기 5:3은 아담이 130세에 셋을 낳았다고 기록합니다. 가인과 아벨은 창세기 4장의 사건 흐름 안에 먼저 등장합니다.",
    },
    dateBasisLabel: { en: "Genealogy passage connection", ko: "계보 본문 연결" },
    dateConfidenceLabel: {
      en: "Scripture anchor high; external date not asserted",
      ko: "본문 근거는 높음, 외부 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 4, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "noah-born",
    title: { en: "Noah Born", ko: "노아 출생" },
    summary: {
      en: "The last pre-flood patriarch enters the family line before the flood narrative.",
      ko: "홍수 서사 전에 마지막 족장 계보 인물이 등장합니다.",
    },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["hebrews", "1-peter"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 5:28-32", ko: "창세기 5:28-32" },
        { book: "genesis", chapter: 5, verse: 28, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Lamech", ko: "라멕" }, { en: "Noah", ko: "노아" }],
    placeIds: ["eden"],
    locationNote: {
      en: "This relative-year marker belongs to the Genesis 5 genealogy flow.",
      ko: "이 상대 연수 표시는 창세기 5장의 계보 흐름에 속합니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the flood", ko: "홍수 이전" },
    eventType: { en: "Genealogy year marker", ko: "계보 연수" },
    dateLabel: { en: "Biblical relative year", ko: "성경 내부 연수" },
    relativeYearLabel: { en: "AM 1056", ko: "아담 기준 1056년" },
    relativeYearValue: 1056,
    relativeYearBasisLabel: { en: "Genesis 5 cumulative age calculation", ko: "창세기 5장 누적 연수 계산" },
    relativeYearCalculationNote: {
      en: "Adding the Genesis 5 begetting ages from Adam to Lamech places Noah's birth at AM 1056.",
      ko: "아담에서 라멕까지의 출생 연수를 누적하면 노아 출생은 아담 기준 1056년입니다.",
    },
    dateBasisLabel: { en: "Genesis 5 age calculation", ko: "창세기 5장 연수 계산" },
    dateConfidenceLabel: {
      en: "Scripture anchor high; chronology not asserted",
      ko: "본문 근거는 높음, 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 5, verse: 28, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "flood",
    title: { en: "Flood", ko: "홍수" },
    summary: { en: "Judgment and rescue through the ark.", ko: "방주를 통한 심판과 구원입니다." },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["hebrews", "1-peter", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 6:5-22", ko: "창세기 6:5-22" },
        { book: "genesis", chapter: 6, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 8:1-22", ko: "창세기 8:1-22" },
        { book: "genesis", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Noah", ko: "노아" }],
    placeIds: ["ararat"],
    locationNote: {
      en: "The landing on Ararat gives the event a visible place marker.",
      ko: "아라랏 착지가 사건에 분명한 지명 표지를 제공합니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: { en: "Scripture anchor: High", ko: "본문 근거: 높음" },
    sequenceLabel: { en: "After the spread of evil", ko: "악이 퍼진 뒤" },
    eventType: { en: "Judgment / rescue", ko: "심판 / 구원" },
    dateLabel: { en: "c. 2500 BC", ko: "약 주전 2500년" },
    relativeYearLabel: { en: "AM 1656", ko: "아담 기준 1656년" },
    relativeYearValue: 1656,
    relativeYearBasisLabel: { en: "Genesis 5 cumulative ages and Genesis 7:6", ko: "창세기 5장 누적 연수와 창세기 7:6" },
    relativeYearCalculationNote: {
      en: "The Genesis 5 begetting ages place Noah's birth at AM 1056, and Genesis 7:6 records that the flood came when Noah was 600 years old. Therefore the flood is displayed as AM 1656.",
      ko: "창세기 5장의 출생 연수를 누적하면 노아 출생은 아담 기준 1056년이고, 창세기 7:6은 홍수가 노아 600세에 있었다고 기록합니다. 따라서 홍수는 아담 기준 1656년으로 표시됩니다.",
    },
    dateBasisLabel: { en: "Approximate traditional placement", ko: "전통적 근사 배치" },
    dateConfidenceLabel: { en: "Approximate support layer", ko: "보조 근사 연대" },
    reader: { book: "genesis", chapter: 6, verse: 5, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "noah-sons-nations",
    title: { en: "Noah's Sons: Shem, Ham, and Japheth", ko: "노아의 아들들: 셈, 함, 야벳" },
    summary: {
      en: "The family lines and the nations are connected after the flood.",
      ko: "홍수 후 가족 계보와 민족의 흐름이 연결됩니다.",
    },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["acts", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 9:18-19", ko: "창세기 9:18-19" },
        { book: "genesis", chapter: 9, verse: 18, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 10:1-32", ko: "창세기 10:1-32" },
        { book: "genesis", chapter: 10, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Noah", ko: "노아" },
      { en: "Shem", ko: "셈" },
      { en: "Ham", ko: "함" },
      { en: "Japheth", ko: "야벳" },
      { en: "The nations", ko: "민족들" },
    ],
    placeIds: ["ararat"],
    locationNote: {
      en: "Genesis 10 presents the spread of nations from Noah's sons, while Genesis 11 explains the Babel background of scattering.",
      ko: "창세기 10장은 노아의 아들들로부터 민족들이 퍼지는 흐름을 보여 주고, 창세기 11장은 바벨 사건을 통해 흩어짐의 배경을 설명합니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the flood and before Babel", ko: "홍수 이후 바벨 이전" },
    eventType: { en: "Genealogy / nations bridge", ko: "계보 / 민족 연결" },
    dateLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    dateBasisLabel: { en: "Textual bridge after the flood and before Babel", ko: "홍수 이후와 바벨 이전의 본문 연결" },
    dateConfidenceLabel: {
      en: "Textual connection high; external date not asserted",
      ko: "본문 연결은 높음, 외부 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 9, verse: 18, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "babel",
    title: { en: "Babel", ko: "바벨탑" },
    summary: { en: "Human pride is scattered by language and geography.", ko: "인간의 교만이 언어와 지리의 흩어짐으로 다뤄집니다." },
    periodId: "primeval",
    primaryBookId: "genesis",
    relatedBookIds: ["acts"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 11:1-9", ko: "창세기 11:1-9" },
        { book: "genesis", chapter: 11, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "The nations", ko: "민족들" }],
    placeIds: ["shinar"],
    locationNote: {
      en: "Shinar anchors the tower narrative in Scripture.",
      ko: "시날은 탑 사건의 서사적 배경입니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the patriarchs", ko: "족장들 이전" },
    eventType: { en: "Primeval event", ko: "태고 사건" },
    reader: { book: "genesis", chapter: 11, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "shem-line-after-flood",
    title: { en: "The Line of Shem", ko: "셈의 계보" },
    summary: {
      en: "Genesis 11 traces the line from Shem toward Terah before Abraham is called.",
      ko: "창세기 11장은 셈에서 데라에 이르는 계보를 추적한 뒤 아브라함의 부르심으로 이어집니다.",
    },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["acts", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 11:10-26", ko: "창세기 11:10-26" },
        { book: "genesis", chapter: 11, verse: 10, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Shem", ko: "셈" },
      { en: "Arphaxad", ko: "아르박삿" },
      { en: "Shelah", ko: "셀라" },
      { en: "Eber", ko: "에벨" },
      { en: "Peleg", ko: "벨렉" },
      { en: "Reu", ko: "르우" },
      { en: "Serug", ko: "스룩" },
      { en: "Nahor", ko: "나홀" },
      { en: "Terah", ko: "데라" },
    ],
    placeIds: [],
    locationNote: {
      en: "Genesis 11 emphasizes the family line rather than a single geographic center.",
      ko: "창세기 11장은 한 지리 중심보다 가계의 흐름을 강조합니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After Babel and before Abraham", ko: "바벨 뒤 아브라함 이전" },
    eventType: { en: "Genealogy year marker", ko: "계보 연수" },
    dateLabel: { en: "Biblical relative years", ko: "성경 내부 연수" },
    relativeYearLabel: { en: "AM 1658-1878", ko: "아담 기준 1658-1878년" },
    relativeYearValue: 1658,
    relativeYearBasisLabel: { en: "Genesis 11 age calculation", ko: "창세기 11장 연수 계산" },
    relativeYearCalculationNote: {
      en: "Genesis 11:10 records that Shem was 100 and fathered Arphaxad two years after the flood. Adding the Genesis 11 begetting ages places Terah's birth at AM 1878.",
      ko: "창세기 11:10은 홍수 후 2년에 셈이 100세였고 아르박삿을 낳았다고 기록합니다. 이후 창세기 11장의 출생 연수를 누적하면 데라 출생은 아담 기준 1878년으로 표시됩니다.",
    },
    dateBasisLabel: { en: "Biblical relative years", ko: "성경 내부 연수" },
    dateConfidenceLabel: {
      en: "Scripture anchor high; chronology not asserted",
      ko: "본문 근거는 높음, 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 11, verse: 10, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "terah-house",
    title: { en: "Terah's House: Abram, Nahor, and Haran", ko: "데라의 집: 아브람, 나홀, 하란" },
    summary: {
      en: "Terah's household marks the transition toward the patriarchal call.",
      ko: "데라의 가문은 족장 시대 부르심으로 넘어가는 전환점을 이룹니다.",
    },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["acts", "hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 11:26-32", ko: "창세기 11:26-32" },
        { book: "genesis", chapter: 11, verse: 26, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Terah", ko: "데라" },
      { en: "Abram", ko: "아브람" },
      { en: "Nahor", ko: "나홀" },
      { en: "Haran", ko: "하란" },
      { en: "Sarai", ko: "사래" },
      { en: "Lot", ko: "롯" },
    ],
    placeIds: ["ur", "canaan"],
    locationNote: {
      en: "The household begins in Ur and moves toward Canaan without settling Abraham's exact birth year here.",
      ko: "가문은 우르에서 시작해 가나안으로 향하지만, 여기서는 아브라함의 정확한 출생 연도를 단정하지 않습니다.",
    },
    datingNote: noChronology,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the call of Abraham", ko: "아브라함의 부르심 이전" },
    eventType: { en: "Patriarchal bridge", ko: "족장 시대 연결" },
    dateLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    relativeYearLabel: { en: "After Terah's line", ko: "데라 계보 이후" },
    relativeYearBasisLabel: { en: "Genesis 11 textual connection", ko: "창세기 11장 본문 연결" },
    relativeYearCalculationNote: {
      en: "Genesis 11:26 lists Abram, Nahor, and Haran in relation to Terah at age 70, but Abraham's exact birth-year calculation requires additional textual review, including Acts 7:4. This preview does not assert it as a settled AM date.",
      ko: "창세기 11:26은 데라가 70세에 아브람과 나홀과 하란을 낳았다고 기록하지만, 아브라함의 정확한 출생 연도 계산은 사도행전 7:4 등을 포함한 추가 본문 검토가 필요하므로 이 미리보기에서는 단정하지 않습니다.",
    },
    dateBasisLabel: { en: "Biblical sequence", ko: "성경 내부 순서" },
    dateConfidenceLabel: {
      en: "Scripture anchor high; chronology not asserted",
      ko: "본문 근거는 높음, 연대는 단정하지 않음",
    },
    reader: { book: "genesis", chapter: 11, verse: 26, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "call-of-abraham",
    title: { en: "Call of Abraham", ko: "아브라함의 부르심" },
    summary: { en: "Promise begins to move through one family.", ko: "약속이 한 가문을 따라 움직이기 시작합니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["romans", "galatians", "hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 12:1-9", ko: "창세기 12:1-9" },
        { book: "genesis", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Abram", ko: "아브람" }, { en: "Sarai", ko: "사래" }],
    placeIds: ["ur", "canaan"],
    locationNote: {
      en: "The route moves from Ur toward Canaan.",
      ko: "경로는 우르에서 가나안으로 이동합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the covenant formalization", ko: "언약 공식화 이전" },
    eventType: { en: "Patriarchal call", ko: "족장 부르심" },
    durationLabel: { en: "Journey sequence", ko: "여정 순서" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Abram age 75", ko: "아브람 75세" },
    relativeYearValue: 75,
    relativeYearBasisLabel: { en: "Genesis 12:4 age notice", ko: "창세기 12:4의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 12:4 records that Abram was 75 when he departed from Haran. This preview shows the stated biblical age without asserting Abraham's exact AM year.",
      ko: "창세기 12:4은 아브람이 하란을 떠날 때 75세였다고 기록합니다. 이 미리보기는 아브라함의 정확한 AM 연도는 단정하지 않고, 본문이 명시한 나이를 표시합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: {
      en: "Biblical age stated; external chronology supporting only",
      ko: "본문 나이 기록은 명시, 외부 연대는 보조",
    },
    reader: { book: "genesis", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "abrahamic-covenant",
    title: { en: "Covenant with Abraham", ko: "아브라함 언약" },
    summary: { en: "The covenant promise is clarified and signaled.", ko: "언약의 약속이 분명해지고 표지됩니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["romans", "galatians"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 15:1-21", ko: "창세기 15:1-21" },
        { book: "genesis", chapter: 15, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 17:1-27", ko: "창세기 17:1-27" },
        { book: "genesis", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Abraham", ko: "아브라함" }, { en: "Sarah", ko: "사라" }],
    placeIds: ["canaan", "hebron"],
    locationNote: {
      en: "Canaan and Hebron frame the promise narrative.",
      ko: "가나안과 헤브론이 약속의 서사를 감쌉니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Promise deepens", ko: "약속이 깊어짐" },
    eventType: { en: "Covenant", ko: "언약" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Abraham age 99", ko: "아브라함 99세" },
    relativeYearValue: 99,
    relativeYearBasisLabel: { en: "Genesis 17:1 age notice", ko: "창세기 17:1의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 17:1 records that Abram was 99 when the Lord appeared to him. Genesis 15 belongs to the same promise flow, but this preview does not assert an exact date for every covenant scene.",
      ko: "창세기 17:1은 아브람이 99세였을 때 여호와께서 나타나셨다고 기록합니다. 창세기 15장의 언약 장면은 같은 약속 흐름 안에 연결하되, 정확한 날짜를 단정하지 않습니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: {
      en: "Age notice stated; covenant flow Scripture-connected",
      ko: "본문 나이 기록은 명시, 언약 흐름은 본문 연결",
    },
    reader: { book: "genesis", chapter: 15, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "isaac-born",
    title: { en: "Isaac Born", ko: "이삭의 탄생" },
    summary: { en: "Promise becomes visible in a child of laughter.", ko: "약속이 웃음의 아들로 눈에 보이게 됩니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 21:1-7", ko: "창세기 21:1-7" },
        { book: "genesis", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 22:1-18", ko: "창세기 22:1-18" },
        { book: "genesis", chapter: 22, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Isaac", ko: "이삭" }, { en: "Abraham", ko: "아브라함" }],
    placeIds: ["canaan", "hebron"],
    locationNote: {
      en: "The promise stays tied to Canaan rather than a new imperial center.",
      ko: "약속은 제국의 중심이 아니라 가나안에 묶여 있습니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Promise continues through the son", ko: "아들을 통해 약속이 이어짐" },
    eventType: { en: "Promise / birth", ko: "약속 / 출생" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Abraham age 100", ko: "아브라함 100세" },
    relativeYearValue: 100,
    relativeYearBasisLabel: { en: "Genesis 21:5 age notice", ko: "창세기 21:5의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 21:5 records that Abraham was 100 years old when Isaac was born.",
      ko: "창세기 21:5은 이삭이 태어날 때 아브라함이 100세였다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "genesis", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jacob-esau-born",
    title: { en: "Jacob and Esau Born", ko: "야곱과 에서 출생" },
    summary: { en: "The twins begin the next patriarchal generation.", ko: "쌍둥이가 다음 족장 세대를 시작합니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["romans", "malachi"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 25:19-26", ko: "창세기 25:19-26" },
        { book: "genesis", chapter: 25, verse: 19, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Isaac", ko: "이삭" },
      { en: "Rebekah", ko: "리브가" },
      { en: "Esau", ko: "에서" },
      { en: "Jacob", ko: "야곱" },
    ],
    placeIds: ["canaan"],
    locationNote: {
      en: "The twins are born in the covenant family line within Canaan.",
      ko: "쌍둥이는 가나안 안에서 언약 가문 계보 속에 태어납니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Jacob's turning point", ko: "야곱의 전환점 이전" },
    eventType: { en: "Patriarchal genealogy", ko: "족장 계보" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Isaac age 60", ko: "이삭 60세" },
    relativeYearValue: 60,
    relativeYearBasisLabel: { en: "Genesis 25:26 age notice", ko: "창세기 25:26의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 25:26 records that Isaac was 60 when Rebekah bore Esau and Jacob.",
      ko: "창세기 25:26은 리브가가 에서와 야곱을 낳았을 때 이삭이 60세였다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "genesis", chapter: 25, verse: 19, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jacob-israel",
    title: { en: "Jacob Renamed Israel", ko: "야곱의 이름이 이스라엘로 바뀜" },
    summary: { en: "A wrestling night marks a new family name.", ko: "밤의 씨름이 새로운 가족 이름을 남깁니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["hosea"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 32:22-32", ko: "창세기 32:22-32" },
        { book: "genesis", chapter: 32, verse: 22, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jacob", ko: "야곱" }],
    placeIds: ["canaan"],
    locationNote: {
      en: "The crossing and wrestling take place as Jacob returns toward the land.",
      ko: "야곱이 땅으로 돌아오는 길에서 씨름이 벌어집니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the family settles in Egypt", ko: "가족이 애굽에 정착하기 전" },
    eventType: { en: "Patriarchal turning point", ko: "족장 전환점" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "genesis", chapter: 32, verse: 22, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "joseph-sold-egypt",
    title: { en: "Joseph Sold into Egypt", ko: "요셉이 애굽으로 팔려감" },
    summary: { en: "The covenant family begins the Egypt movement through Joseph.", ko: "언약 가문이 요셉을 통해 애굽으로 향하는 흐름이 시작됩니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["acts"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 37:2-36", ko: "창세기 37:2-36" },
        { book: "genesis", chapter: 37, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Joseph", ko: "요셉" },
      { en: "Jacob", ko: "야곱" },
      { en: "Joseph's brothers", ko: "요셉의 형들" },
    ],
    placeIds: ["canaan", "egypt"],
    locationNote: {
      en: "The flow moves from Canaan into Egypt through Joseph's suffering and providence.",
      ko: "본문 흐름은 요셉의 고난과 섭리를 통해 가나안에서 애굽으로 이동합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the family settles in Egypt", ko: "가족이 애굽에 정착하기 전" },
    eventType: { en: "Patriarchal family / Egypt bridge", ko: "족장 가족 / 애굽 연결" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Joseph age 17", ko: "요셉 17세" },
    relativeYearValue: 17,
    relativeYearBasisLabel: { en: "Genesis 37:2 age notice", ko: "창세기 37:2의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 37:2 introduces Joseph at age 17 in the setting with his brothers. This marks the beginning of the textual flow that takes Joseph into Egypt.",
      ko: "창세기 37:2은 요셉이 17세에 형들과 함께 양을 칠 때의 장면을 기록합니다. 이 사건은 요셉이 애굽으로 내려가게 되는 본문 흐름의 시작입니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "genesis", chapter: 37, verse: 2, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "joseph-before-pharaoh",
    title: { en: "Joseph Stands Before Pharaoh", ko: "요셉이 바로 앞에 섬" },
    summary: { en: "Joseph rises from prison to stand before Pharaoh.", ko: "요셉이 옥에서 올라와 바로 앞에 섭니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["acts", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 41:37-46", ko: "창세기 41:37-46" },
        { book: "genesis", chapter: 41, verse: 37, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Joseph", ko: "요셉" }, { en: "Pharaoh", ko: "바로" }],
    placeIds: ["egypt"],
    locationNote: {
      en: "Egypt is shown here as the biblical setting into which Joseph is elevated.",
      ko: "애굽은 여기서 요셉이 높임을 받는 성경적 배경으로 표시됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Jacob's household arrives", ko: "야곱의 집이 도착하기 전" },
    eventType: { en: "Egypt context", ko: "애굽 배경" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Joseph age 30", ko: "요셉 30세" },
    relativeYearValue: 30,
    relativeYearBasisLabel: { en: "Genesis 41:46 age notice", ko: "창세기 41:46의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 41:46 records that Joseph was 30 when he stood before Pharaoh king of Egypt.",
      ko: "창세기 41:46은 요셉이 애굽 왕 바로 앞에 설 때 30세였다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "genesis", chapter: 41, verse: 37, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jacob-goes-to-egypt",
    title: { en: "Jacob's House Goes Down to Egypt", ko: "야곱의 집이 애굽으로 내려감" },
    summary: { en: "Jacob's household moves into Egypt during the famine.", ko: "기근 중 야곱의 집이 애굽으로 이동합니다." },
    periodId: "patriarchs",
    primaryBookId: "genesis",
    relatedBookIds: ["acts", "exodus"],
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 45:4-11", ko: "창세기 45:4-11" },
        { book: "genesis", chapter: 45, verse: 4, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 46:1-7", ko: "창세기 46:1-7" },
        { book: "genesis", chapter: 46, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 47:7-12", ko: "창세기 47:7-12" },
        { book: "genesis", chapter: 47, verse: 7, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Jacob", ko: "야곱" },
      { en: "Joseph", ko: "요셉" },
      { en: "Pharaoh", ko: "바로" },
      { en: "Israel's household", ko: "이스라엘의 집안" },
    ],
    placeIds: ["canaan", "egypt"],
    locationNote: {
      en: "Egypt is shown here as the biblical setting into which Joseph and Jacob's household move.",
      ko: "애굽은 이 단계에서 요셉과 야곱의 집이 내려가는 성경적 배경으로 표시됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the exodus", ko: "출애굽 이전" },
    eventType: { en: "Beginning of the Egypt sojourn", ko: "애굽 체류의 시작" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Jacob age 130", ko: "야곱 130세" },
    relativeYearValue: 130,
    relativeYearBasisLabel: { en: "Genesis 47:9 age notice", ko: "창세기 47:9의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Genesis 47:9 records Jacob telling Pharaoh that the years of his pilgrimage were 130. Genesis 45:6 also shows that this was during the second year of famine.",
      ko: "창세기 47:9은 야곱이 바로에게 자신의 나그네 길의 세월이 130년이라고 말한 것을 기록합니다. 창세기 45:6은 이때가 기근 둘째 해였음을 함께 보여 줍니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "genesis", chapter: 45, verse: 4, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "israel-multiplies-egypt",
    title: { en: "Israel's Children Multiply in Egypt", ko: "애굽에서 번성한 이스라엘 자손" },
    summary: {
      en: "Israel grows in Egypt until a new Pharaoh turns the setting toward oppression.",
      ko: "새로운 바로 아래에서 이스라엘이 애굽 안에서 번성하다가 압제의 배경으로 넘어갑니다.",
    },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["acts"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 1:1-14", ko: "출애굽기 1:1-14" },
        { book: "exodus", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Israel's children", ko: "이스라엘 자손" }, { en: "Pharaoh", ko: "바로" }],
    placeIds: ["egypt"],
    locationNote: {
      en: "Egypt remains the setting where the covenant family multiplies before oppression tightens.",
      ko: "애굽은 언약 가문이 번성하다가 압제가 짙어지는 배경으로 남습니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After Jacob's household enters Egypt", ko: "야곱의 집이 애굽에 들어간 뒤" },
    eventType: { en: "Egypt sojourn", ko: "애굽 체류" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "Exodus 1 textual connection", ko: "출애굽기 1장 본문 연결" },
    dateConfidenceLabel: {
      en: "Scripture sequence high; chronology not asserted",
      ko: "본문 사건은 높음, 연대는 단정하지 않음",
    },
    reader: { book: "exodus", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "moses-born",
    title: { en: "Moses Born", ko: "모세 출생" },
    summary: {
      en: "Moses is born and preserved in the opening deliverance pattern.",
      ko: "모세가 태어나고 보존되는 구원 패턴이 시작됩니다.",
    },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["hebrews", "acts"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 2:1-10", ko: "출애굽기 2:1-10" },
        { book: "exodus", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Moses", ko: "모세" },
      { en: "Pharaoh's daughter", ko: "바로의 딸" },
      { en: "Moses' mother", ko: "모세의 어머니" },
    ],
    placeIds: ["egypt"],
    locationNote: {
      en: "Egypt is the cradle of Moses' preservation before his later call.",
      ko: "애굽은 모세가 훗날 부르심을 받기 전에 보존된 자리입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the burning bush call", ko: "떨기나무 부르심 이전" },
    eventType: { en: "Deliverer prepared", ko: "구원자 준비" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: { en: "Exodus 2 textual sequence", ko: "출애굽기 2장 본문 순서" },
    dateConfidenceLabel: {
      en: "Scripture sequence high; external date not asserted",
      ko: "본문 순서는 높음, 외부 연대는 단정하지 않음",
    },
    reader: { book: "exodus", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "moses-called-burning-bush",
    title: { en: "Moses Called at the Burning Bush", ko: "떨기나무 가운데 모세를 부르심" },
    summary: {
      en: "God calls Moses into the Exodus mission from the burning bush.",
      ko: "하나님이 떨기나무 가운데서 모세를 출애굽 사명으로 부르십니다.",
    },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["deuteronomy", "acts"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 3:1-12", ko: "출애굽기 3:1-12" },
        { book: "exodus", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Exodus 7:7", ko: "출애굽기 7:7" },
        { book: "exodus", chapter: 7, verse: 7, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Aaron", ko: "아론" }],
    placeIds: ["sinai", "egypt"],
    locationNote: {
      en: "The burning bush scene begins the visible Exodus commission.",
      ko: "떨기나무 장면이 출애굽 사명의 시작을 보여 줍니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the departure from Egypt", ko: "애굽을 떠나기 전" },
    eventType: { en: "Exodus calling", ko: "출애굽 부르심" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Moses age 80", ko: "모세 80세" },
    relativeYearValue: 80,
    relativeYearBasisLabel: { en: "Exodus 7:7 age notice", ko: "출애굽기 7:7의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Exodus 7:7 records that Moses was 80 and Aaron was 83 when they spoke to Pharaoh. The burning bush calling is displayed as the beginning of the Exodus mission.",
      ko: "출애굽기 7:7은 모세가 바로에게 말할 때 80세였고 아론은 83세였다고 기록합니다. 떨기나무 부르심은 출애굽 사명의 시작으로 표시합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "exodus", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "exodus-passover",
    title: { en: "Exodus / Passover Night", ko: "출애굽 / 유월절 밤" },
    summary: {
      en: "The Lord brings Israel out and the Passover night marks the departure.",
      ko: "여호와께서 이스라엘을 이끄시고 유월절 밤이 출발을 표시합니다.",
    },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["leviticus", "luke", "1-corinthians"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 12:1-28", ko: "출애굽기 12:1-28" },
        { book: "exodus", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }],
    placeIds: ["egypt"],
    locationNote: {
      en: "The event unfolds in the land of Egypt as the sojourn reaches its climax.",
      ko: "애굽 땅에서 사건이 전개되며 체류 기간이 절정에 이릅니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "The Exodus departure", ko: "출애굽 출발" },
    eventType: { en: "Deliverance", ko: "구원" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "430-year sojourn", ko: "애굽 체류 430년" },
    relativeYearBasisLabel: { en: "Exodus 12:40-41 duration notice", ko: "출애굽기 12:40-41의 연수 기록" },
    relativeYearCalculationNote: {
      en: "Exodus 12:40-41 records the sojourn of the children of Israel as 430 years and says that at the end of that period the Lord's armies went out from Egypt. This preview displays the textual notice first and does not assert an external chronology.",
      ko: "출애굽기 12:40-41은 이스라엘 자손이 애굽에 거주한 기간을 430년으로 기록하고, 그 끝에 여호와의 군대가 애굽 땅에서 나왔다고 말합니다. 이 미리보기는 본문 기록을 우선 표시하고, 외부 연대 계산은 단정하지 않습니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: {
      en: "Biblical duration stated; external chronology supporting only",
      ko: "본문 연수 기록은 명시, 외부 연대는 보조",
    },
    reader: { book: "exodus", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "red-sea",
    title: { en: "Red Sea Crossing", ko: "홍해 도하" },
    summary: { en: "The sea opens and closes around Israel.", ko: "바다가 이스라엘을 둘러싸고 열리고 닫힙니다." },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 14:1-31", ko: "출애굽기 14:1-31" },
        { book: "exodus", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }],
    placeIds: ["egypt", "jordan"],
    locationNote: {
      en: "The flow moves from Egypt toward the wilderness.",
      ko: "본문 흐름은 애굽에서 광야로 이동합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Immediately after Passover", ko: "유월절 직후" },
    eventType: { en: "Deliverance", ko: "구원" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "exodus", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "sinai-covenant",
    title: { en: "Sinai Covenant", ko: "시내산 언약" },
    summary: { en: "Law and covenant form a people.", ko: "율법과 언약이 한 백성을 세웁니다." },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["deuteronomy", "hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 19:1-20:21", ko: "출애굽기 19:1-20:21" },
        { book: "exodus", chapter: 19, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Israel", ko: "이스라엘" }],
    placeIds: ["sinai"],
    locationNote: {
      en: "Sinai becomes a covenant landmark in the flow.",
      ko: "시내산은 흐름 속 언약의 이정표가 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Third month after the Exodus", ko: "출애굽 후 3개월" },
    eventType: { en: "Covenant", ko: "언약" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Third month after the Exodus", ko: "출애굽 후 3개월" },
    relativeYearBasisLabel: { en: "Exodus 19:1 timing notice", ko: "출애굽기 19:1의 시기 기록" },
    relativeYearCalculationNote: {
      en: "Exodus 19:1 records that the children of Israel came to the wilderness of Sinai in the third month after going out from Egypt.",
      ko: "출애굽기 19:1은 이스라엘 자손이 애굽 땅에서 나온 지 셋째 달에 시내 광야에 이르렀다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "exodus", chapter: 19, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "tabernacle-set-up",
    title: { en: "The Tabernacle Set Up", ko: "성막이 세워짐" },
    summary: {
      en: "The tabernacle is erected and the presence of the Lord fills it.",
      ko: "성막이 세워지고 여호와의 임재가 그것을 채웁니다.",
    },
    periodId: "exodus",
    primaryBookId: "exodus",
    relatedBookIds: ["leviticus", "numbers", "hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 40:1-38", ko: "출애굽기 40:1-38" },
        { book: "exodus", chapter: 40, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["sinai"],
    locationNote: {
      en: "Sinai remains the setting for the tabernacle's completion.",
      ko: "시내산이 성막 완성의 배경으로 남습니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Kadesh Barnea", ko: "가데스 바네아 이전" },
    eventType: { en: "Tabernacle / presence", ko: "성막 / 임재" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "First month of the second year", ko: "제2년 첫째 달" },
    relativeYearBasisLabel: { en: "Exodus 40:17 timing notice", ko: "출애굽기 40:17의 시기 기록" },
    relativeYearCalculationNote: {
      en: "Exodus 40:17 records that the tabernacle was set up on the first day of the first month in the second year.",
      ko: "출애굽기 40:17은 둘째 해 첫째 달 초하루에 성막이 세워졌다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "exodus", chapter: 40, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "kadesh-barnea-spies",
    title: { en: "Kadesh Barnea and the Spies", ko: "가데스 바네아와 정탐꾼들" },
    summary: {
      en: "The spies return and unbelief shapes the wilderness judgment.",
      ko: "정탐꾼이 돌아오고 불신앙이 광야 심판을 형성합니다.",
    },
    periodId: "exodus",
    primaryBookId: "numbers",
    relatedBookIds: ["deuteronomy", "joshua"],
    scriptureAnchors: [
      createAnchor(
        { en: "Numbers 13:1-33", ko: "민수기 13:1-33" },
        { book: "numbers", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Numbers 14:1-38", ko: "민수기 14:1-38" },
        { book: "numbers", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Joshua", ko: "여호수아" }, { en: "Caleb", ko: "갈렙" }],
    placeIds: ["kadesh-barnea", "canaan"],
    locationNote: {
      en: "Kadesh Barnea marks the turning point before the wilderness judgment is announced.",
      ko: "가데스 바네아는 광야 심판이 선포되기 전의 전환점입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the wilderness judgment is carried out", ko: "광야 심판이 실행되기 전" },
    eventType: { en: "Unbelief / judgment", ko: "불신 / 심판" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "numbers", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "wilderness-forty-years",
    title: { en: "Forty Years in the Wilderness", ko: "광야 40년" },
    summary: {
      en: "A wilderness generation is marked by judgment and long wandering.",
      ko: "광야 세대는 심판과 긴 방황으로 특징지어집니다.",
    },
    periodId: "exodus",
    primaryBookId: "numbers",
    relatedBookIds: ["deuteronomy", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Numbers 14:33-34", ko: "민수기 14:33-34" },
        { book: "numbers", chapter: 14, verse: 33, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Deuteronomy 29:5", ko: "신명기 29:5" },
        { book: "deuteronomy", chapter: 29, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["kadesh-barnea", "sinai"],
    locationNote: {
      en: "The wilderness period spans the years between rebellion and entry.",
      ko: "광야 기간은 반역과 प्रवेश 사이의 세월을 가로지릅니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "The wilderness judgment period", ko: "광야 심판 기간" },
    eventType: { en: "Wilderness period", ko: "광야 기간" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "40 years in the wilderness", ko: "광야 40년" },
    relativeYearBasisLabel: { en: "Numbers 14:33-34 and Deuteronomy 29:5", ko: "민수기 14:33-34와 신명기 29:5" },
    relativeYearCalculationNote: {
      en: "Numbers 14:33-34 speaks of the forty-year wilderness judgment, and Deuteronomy 29:5 says that the Lord led Israel in the wilderness for forty years.",
      ko: "민수기 14:33-34은 광야 40년 심판을 말하고, 신명기 29:5은 여호와께서 40년 동안 광야에서 이스라엘을 인도하셨다고 말합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "numbers", chapter: 14, verse: 33, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "moses-dies",
    title: { en: "Moses Dies", ko: "모세의 죽음" },
    summary: {
      en: "Moses' life closes before the land is entered.",
      ko: "모세의 생애가 땅에 들어가기 전에 마무리됩니다.",
    },
    periodId: "exodus",
    primaryBookId: "deuteronomy",
    relatedBookIds: ["joshua"],
    scriptureAnchors: [
      createAnchor(
        { en: "Deuteronomy 34:1-12", ko: "신명기 34:1-12" },
        { book: "deuteronomy", chapter: 34, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Joshua", ko: "여호수아" }],
    placeIds: ["jordan"],
    locationNote: {
      en: "Moses dies before the Jordan crossing is led by Joshua.",
      ko: "모세는 여호수아가 요단 도하를 인도하기 전에 죽습니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Joshua enters the land", ko: "여호수아가 땅에 들어가기 전" },
    eventType: { en: "Close of the wilderness era", ko: "광야 시대 마침" },
    dateLabel: scriptureRelativeYearPreview.dateLabel,
    relativeYearLabel: { en: "Moses age 120", ko: "모세 120세" },
    relativeYearBasisLabel: { en: "Deuteronomy 34:7 age notice", ko: "신명기 34:7의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Deuteronomy 34:7 records that Moses was 120 years old when he died.",
      ko: "신명기 34:7은 모세가 죽을 때 120세였다고 기록합니다.",
    },
    dateBasisLabel: scriptureRelativeYearPreview.dateBasisLabel,
    dateConfidenceLabel: highConfidence,
    reader: { book: "deuteronomy", chapter: 34, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "joshua-commissioned",
    title: { en: "Joshua Commissioned", ko: "여호수아에게 사명을 맡기심" },
    summary: {
      en: "The Lord charges Joshua to lead the people after Moses.",
      ko: "여호와께서 모세 뒤에 백성을 이끌 여호수아에게 명하십니다.",
    },
    periodId: "conquest",
    primaryBookId: "joshua",
    relatedBookIds: ["deuteronomy", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 1:1-9", ko: "여호수아 1:1-9" },
        { book: "joshua", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Joshua", ko: "여호수아" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["jordan", "canaan"],
    locationNote: {
      en: "The commission bridges the wilderness and the land.",
      ko: "이 위임은 광야와 땅 사이를 잇습니다.",
    },
    datingNote: biblicalSequencePreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After Moses' death", ko: "모세의 죽음 이후" },
    eventType: { en: "Preparation to enter Canaan", ko: "가나안 입성 준비" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    relativeYearBasisLabel: { en: "Joshua 1 textual sequence", ko: "여호수아 1장 본문 순서" },
    relativeYearCalculationNote: {
      en: "Joshua 1 records the Lord commanding Joshua after Moses' death to arise and cross the Jordan.",
      ko: "여호수아 1장은 모세가 죽은 후 여호와께서 여호수아에게 일어나 요단을 건너라고 명하시는 장면을 기록합니다.",
    },
    reader: { book: "joshua", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "wilderness-unbelief",
    title: { en: "Wilderness Unbelief", ko: "광야 불신앙" },
    summary: { en: "The generation fails to trust the promise.", ko: "한 세대가 약속을 신뢰하지 못합니다." },
    periodId: "exodus",
    primaryBookId: "numbers",
    relatedBookIds: ["deuteronomy", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Numbers 13:1-33", ko: "민수기 13:1-33" },
        { book: "numbers", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Numbers 14:1-35", ko: "민수기 14:1-35" },
        { book: "numbers", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Moses", ko: "모세" }, { en: "Joshua and Caleb", ko: "여호수아와 갈렙" }],
    placeIds: ["kadesh-barnea", "sinai"],
    locationNote: {
      en: "Kadesh Barnea marks the decisive failure point.",
      ko: "가데스 바네아가 결정적 실패 지점입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the next generation enters", ko: "다음 세대의 प्रवेश 이전" },
    eventType: { en: "Warning / judgment", ko: "경고 / 심판" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "numbers", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jordan-crossing",
    title: { en: "Jordan Crossing", ko: "요단 강 도하" },
    summary: { en: "The people enter the land on foot.", ko: "백성이 걸어서 땅에 들어갑니다." },
    periodId: "conquest",
    primaryBookId: "joshua",
    relatedBookIds: ["deuteronomy", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 3:1-17", ko: "여호수아 3:1-17" },
        { book: "joshua", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Joshua 4:1-24", ko: "여호수아 4:1-24" },
        { book: "joshua", chapter: 4, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Joshua", ko: "여호수아" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["jordan", "canaan"],
    locationNote: {
      en: "The Jordan becomes the threshold of the land.",
      ko: "요단은 땅으로 들어가는 문턱이 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Entering Canaan", ko: "가나안 입성" },
    eventType: { en: "Entering Canaan", ko: "가나안 입성" },
    relativeYearBasisLabel: { en: "Joshua 3-4 textual sequence", ko: "여호수아 3-4장 본문 순서" },
    relativeYearCalculationNote: {
      en: "Joshua 3-4 records Israel crossing the Jordan into Canaan and setting up memorial stones.",
      ko: "여호수아 3-4장은 이스라엘이 요단을 건너 가나안 땅에 들어가는 장면과 기념 돌을 세우는 사건을 기록합니다.",
    },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "joshua", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jericho",
    title: { en: "Jericho", ko: "여리고" },
    summary: { en: "Walls fall after faithful obedience.", ko: "순종 뒤에 성벽이 무너집니다." },
    periodId: "conquest",
    primaryBookId: "joshua",
    relatedBookIds: ["hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 6:1-27", ko: "여호수아 6:1-27" },
        { book: "joshua", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Joshua", ko: "여호수아" },
      { en: "Rahab", ko: "라합" },
      { en: "Israel's children", ko: "이스라엘 자손" },
    ],
    placeIds: ["jericho"],
    locationNote: {
      en: "Jericho is one of the most visible place markers in the preview.",
      ko: "여리고는 미리보기에서 가장 눈에 띄는 지명 표지 중 하나입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Conquest", ko: "정복" },
    eventType: { en: "Conquest", ko: "정복" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearBasisLabel: { en: "Joshua 6 textual sequence", ko: "여호수아 6장 본문 순서" },
    relativeYearCalculationNote: {
      en: "Joshua 6 records the fall of Jericho and the rescue of Rahab and her household.",
      ko: "여호수아 6장은 여리고 성이 무너지고 라합과 그 집이 구원받는 사건을 기록합니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "joshua", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "covenant-renewal-shechem",
    title: { en: "Covenant Renewal at Shechem", ko: "세겜에서 언약을 새롭게 함" },
    summary: {
      en: "Joshua gathers Israel and renews the covenant at Shechem.",
      ko: "여호수아가 이스라엘을 세겜에 모아 언약을 새롭게 합니다.",
    },
    periodId: "conquest",
    primaryBookId: "joshua",
    relatedBookIds: ["deuteronomy"],
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 24:1-28", ko: "여호수아 24:1-28" },
        { book: "joshua", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Joshua", ko: "여호수아" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["shechem"],
    locationNote: {
      en: "Shechem becomes the covenant-renewal gathering place.",
      ko: "세겜은 언약 갱신의 모임 장소가 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the conquest summary", ko: "정복 요약 뒤" },
    eventType: { en: "Covenant renewal", ko: "언약 갱신" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearBasisLabel: { en: "Joshua 24 textual sequence", ko: "여호수아 24장 본문 순서" },
    relativeYearCalculationNote: {
      en: "Joshua 24 records Joshua gathering Israel at Shechem and calling them covenantally to serve the Lord.",
      ko: "여호수아 24장은 여호수아가 세겜에서 이스라엘을 모으고 여호와를 섬길 것을 언약적으로 촉구하는 장면을 기록합니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "joshua", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "joshua-dies",
    title: { en: "Joshua Dies", ko: "여호수아의 죽음" },
    summary: {
      en: "Joshua's generation closes and a new era begins.",
      ko: "여호수아 세대가 마무리되고 새로운 시대가 시작됩니다.",
    },
    periodId: "conquest",
    primaryBookId: "joshua",
    relatedBookIds: ["judges"],
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 24:29-33", ko: "여호수아 24:29-33" },
        { book: "joshua", chapter: 24, verse: 29, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Judges 2:6-10", ko: "사사기 2:6-10" },
        { book: "judges", chapter: 2, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Joshua", ko: "여호수아" }, { en: "Israel's elders", ko: "이스라엘 장로들" }],
    placeIds: ["canaan"],
    locationNote: {
      en: "Joshua's burial and the generational handoff close the conquest era.",
      ko: "여호수아의 장사와 세대 교체가 정복 시대를 마감합니다.",
    },
    datingNote: biblicalSequencePreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Close of the conquest generation", ko: "정복 세대의 마침" },
    eventType: { en: "Close of the conquest generation", ko: "정복 세대의 마침" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearLabel: { en: "Joshua age 110", ko: "여호수아 110세" },
    relativeYearBasisLabel: { en: "Joshua 24:29 age notice", ko: "여호수아 24:29의 나이 기록" },
    relativeYearCalculationNote: {
      en: "Joshua 24:29 records that Joshua died at age 110. Judges 2 shows the transition after Joshua and his generation.",
      ko: "여호수아 24:29은 여호수아가 110세에 죽었다고 기록합니다. 사사기 2장은 여호수아와 그 세대 이후의 전환을 보여 줍니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "joshua", chapter: 24, verse: 29, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "judges-summary",
    title: { en: "Judges Period Summary", ko: "사사 시대 요약" },
    summary: { en: "The recurring pattern of decline and rescue becomes clear.", ko: "쇠퇴와 회복의 반복 구조가 분명해집니다." },
    periodId: "conquest",
    primaryBookId: "judges",
    relatedBookIds: ["1-samuel"],
    scriptureAnchors: [
      createAnchor(
        { en: "Judges 2:11-23", ko: "사사기 2:11-23" },
        { book: "judges", chapter: 2, verse: 11, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Israel's children", ko: "이스라엘 자손" }, { en: "The judges", ko: "사사들" }],
    placeIds: ["canaan", "shiloh"],
    locationNote: {
      en: "The land of Canaan is the broad setting, not one city alone.",
      ko: "가나안 땅이 넓은 배경이며 한 도시만의 사건은 아닙니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Judges period pattern", ko: "사사 시대 구조" },
    eventType: { en: "Judges period pattern", ko: "사사 시대 구조" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    relativeYearBasisLabel: { en: "Judges 2 textual pattern", ko: "사사기 2장 본문 구조" },
    relativeYearCalculationNote: {
      en: "Judges 2 summarizes the recurring pattern of Israel's sin, oppression, crying out, and deliverance through judges.",
      ko: "사사기 2장은 이스라엘의 범죄, 압제, 부르짖음, 사사를 통한 구원의 반복 구조를 요약합니다.",
    },
    reader: { book: "judges", chapter: 2, verse: 6, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "deborah-barak",
    title: { en: "Deborah and Barak", ko: "드보라와 바락" },
    summary: {
      en: "Deborah and Barak lead Israel in deliverance from Canaanite oppression.",
      ko: "드보라와 바락이 가나안 압제에서 이스라엘을 구원으로 이끕니다.",
    },
    periodId: "conquest",
    primaryBookId: "judges",
    relatedBookIds: ["psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "Judges 4:1-24", ko: "사사기 4:1-24" },
        { book: "judges", chapter: 4, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Judges 5:1-31", ko: "사사기 5:1-31" },
        { book: "judges", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Deborah", ko: "드보라" }, { en: "Barak", ko: "바락" }, { en: "Jael", ko: "야엘" }],
    placeIds: ["canaan"],
    locationNote: {
      en: "The battle unfolds within Canaan's contested landscape.",
      ko: "전투는 가나안의 대립하는 배경 안에서 펼쳐집니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the judges period", ko: "사사 시대 중" },
    eventType: { en: "Judge / deliverance", ko: "사사 / 구원" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearLabel: { en: "The land had rest 40 years", ko: "그 땅이 40년 동안 평온" },
    relativeYearBasisLabel: { en: "Judges 5:31 duration notice", ko: "사사기 5:31의 기간 기록" },
    relativeYearCalculationNote: {
      en: "Judges 5:31 records that the land had rest for forty years after Deborah and Barak's victory. This preview shows it as a textual marker, not as a full accumulated chronology.",
      ko: "사사기 5:31은 드보라와 바락의 승리 후 그 땅이 40년 동안 평온했다고 기록합니다. 이 미리보기는 그 기간을 전체 사사 연대표로 누적 계산하지 않고 본문 표지로만 표시합니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "judges", chapter: 4, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "gideon",
    title: { en: "Gideon", ko: "기드온" },
    summary: {
      en: "Gideon leads a smaller army against Midian by the Lord's power.",
      ko: "기드온이 여호와의 능력으로 더 작은 군대로 미디안을 대적합니다.",
    },
    periodId: "conquest",
    primaryBookId: "judges",
    relatedBookIds: ["hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Judges 6:1-40", ko: "사사기 6:1-40" },
        { book: "judges", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Judges 7:1-25", ko: "사사기 7:1-25" },
        { book: "judges", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Judges 8:28", ko: "사사기 8:28" },
        { book: "judges", chapter: 8, verse: 28, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Gideon", ko: "기드온" },
      { en: "Israel's children", ko: "이스라엘 자손" },
      { en: "Midian", ko: "미디안" },
    ],
    placeIds: ["canaan"],
    locationNote: {
      en: "The Canaan setting remains broad while Gideon's deliverance takes shape.",
      ko: "기드온의 구원은 가나안이라는 넓은 배경 안에서 전개됩니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the judges period", ko: "사사 시대 중" },
    eventType: { en: "Judge / deliverance", ko: "사사 / 구원" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearLabel: { en: "The land had rest 40 years", ko: "그 땅이 40년 동안 평온" },
    relativeYearBasisLabel: { en: "Judges 8:28 duration notice", ko: "사사기 8:28의 기간 기록" },
    relativeYearCalculationNote: {
      en: "Judges 8:28 records that the land had rest for forty years in the days of Gideon. This preview does not settle the full chronology of the judges period.",
      ko: "사사기 8:28은 기드온의 날 동안 그 땅이 40년 동안 평온했다고 기록합니다. 이 미리보기는 사사 시대 전체 연대를 확정하지 않고 본문 기간 표지만 표시합니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "judges", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "samson",
    title: { en: "Samson", ko: "삼손" },
    summary: {
      en: "Samson confronts Philistine pressure as a judge of Israel.",
      ko: "삼손이 이스라엘의 사사로서 블레셋 압박에 맞섭니다.",
    },
    periodId: "conquest",
    primaryBookId: "judges",
    relatedBookIds: ["hebrews"],
    scriptureAnchors: [
      createAnchor(
        { en: "Judges 13:1-25", ko: "사사기 13:1-25" },
        { book: "judges", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Judges 16:23-31", ko: "사사기 16:23-31" },
        { book: "judges", chapter: 16, verse: 23, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Samson", ko: "삼손" }, { en: "Philistines", ko: "블레셋 사람들" }],
    placeIds: ["canaan"],
    locationNote: {
      en: "Philistine pressure remains the visible background of Samson's story.",
      ko: "블레셋 압박이 삼손 이야기의 눈에 보이는 배경으로 남습니다.",
    },
    datingNote: scriptureRelativeYearPreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the judges period", ko: "사사 시대 중" },
    eventType: { en: "Judge / Philistine context", ko: "사사 / 블레셋 배경" },
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearLabel: { en: "Samson judged 20 years", ko: "삼손이 20년 동안 사사로 지냄" },
    relativeYearBasisLabel: { en: "Judges 16:31 duration notice", ko: "사사기 16:31의 기간 기록" },
    relativeYearCalculationNote: {
      en: "Judges 16:31 records that Samson judged Israel for twenty years. This preview shows Samson with the Philistine context without asserting a full judges-period chronology.",
      ko: "사사기 16:31은 삼손이 이스라엘의 사사로 20년을 지냈다고 기록합니다. 이 미리보기는 삼손 사건을 블레셋 배경과 함께 표시하되, 사사 시대 전체 연대를 단정하지 않습니다.",
    },
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    reader: { book: "judges", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "ruth-boaz",
    title: { en: "Ruth and Boaz", ko: "룻과 보아스" },
    summary: {
      en: "Ruth and Boaz form a line that moves toward David.",
      ko: "룻과 보아스의 계보가 다윗을 향해 이어집니다.",
    },
    periodId: "conquest",
    primaryBookId: "ruth",
    relatedBookIds: ["1-samuel", "matthew"],
    scriptureAnchors: [
      createAnchor(
        { en: "Ruth 1:1-22", ko: "룻기 1:1-22" },
        { book: "ruth", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ruth 4:13-22", ko: "룻기 4:13-22" },
        { book: "ruth", chapter: 4, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Ruth", ko: "룻" },
      { en: "Naomi", ko: "나오미" },
      { en: "Boaz", ko: "보아스" },
      { en: "Obed", ko: "오벳" },
      { en: "David", ko: "다윗" },
    ],
    placeIds: ["bethlehem", "moab"],
    locationNote: {
      en: "Moab to Bethlehem becomes a genealogy bridge toward David.",
      ko: "모압에서 베들레헴으로 이어지는 흐름이 다윗을 향한 족보 다리가 됩니다.",
    },
    datingNote: biblicalSequencePreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the judges period", ko: "사사 시대 중" },
    eventType: { en: "Judges period / Davidic genealogy", ko: "사사 시대 / 다윗 계보" },
    dateLabel: biblicalSequencePreview.dateLabel,
    dateBasisLabel: biblicalSequencePreview.dateBasisLabel,
    dateConfidenceLabel: biblicalSequencePreview.dateConfidenceLabel,
    relativeYearBasisLabel: { en: "Ruth 1 and 4 textual connection", ko: "룻기 1장과 4장 본문 연결" },
    relativeYearCalculationNote: {
      en: "Ruth 1:1 places the account in the days when the judges judged, and Ruth 4 shows the genealogy from Ruth and Boaz toward David.",
      ko: "룻기 1:1은 이 일이 사사들이 치리하던 때에 있었다고 말하고, 룻기 4장은 룻과 보아스의 계보가 다윗으로 이어짐을 보여 줍니다.",
    },
    reader: { book: "ruth", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "samuel-transition",
    title: { en: "Samuel and the Monarchy Transition", ko: "사무엘과 왕정 전환" },
    summary: {
      en: "Samuel's prophetic calling leads into Israel's request for a king.",
      ko: "사무엘의 선지자적 부르심이 이스라엘의 왕 요구로 이어집니다.",
    },
    periodId: "united-kingdom",
    primaryBookId: "1-samuel",
    relatedBookIds: ["judges"],
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
    people: [{ en: "Samuel", ko: "사무엘" }, { en: "Israel's elders", ko: "이스라엘 장로들" }],
    placeIds: ["shiloh"],
    locationNote: {
      en: "Shiloh remains the covenant-memory setting for the transition.",
      ko: "실로는 이 전환의 언약 기억 배경으로 남습니다.",
    },
    datingNote: biblicalSequencePreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Judges to monarchy", ko: "사사에서 왕정으로" },
    eventType: { en: "Judges to monarchy", ko: "사사에서 왕정으로" },
    kingdomTags: [israelKingdomTag],
    prophetTags: [samuelProphetTag],
    dateLabel: biblicalSequencePreview.dateLabel,
    relativeYearBasisLabel: { en: "1 Samuel 3 and 8 textual connection", ko: "사무엘상 3장과 8장 본문 연결" },
    relativeYearCalculationNote: {
      en: "1 Samuel 3 records Samuel's prophetic calling, and 1 Samuel 8 records Israel's request for a king.",
      ko: "사무엘상 3장은 사무엘의 선지자적 부르심을, 사무엘상 8장은 이스라엘이 왕을 요구하는 전환점을 기록합니다.",
    },
    reader: { book: "1-samuel", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "saul-chosen-king",
    title: { en: "Saul Chosen as King", ko: "사울이 왕으로 세워짐" },
    summary: {
      en: "Israel receives its first king in the textual flow of 1 Samuel.",
      ko: "이스라엘이 사무엘상 본문 흐름 속에서 첫 왕을 받습니다.",
    },
    periodId: "united-kingdom",
    primaryBookId: "1-samuel",
    relatedBookIds: ["judges"],
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
    people: [{ en: "Saul", ko: "사울" }, { en: "Samuel", ko: "사무엘" }, { en: "Israel's children", ko: "이스라엘 자손" }],
    placeIds: ["canaan"],
    locationNote: {
      en: "The monarchy begins within Israel's covenant story, not outside it.",
      ko: "왕정은 이스라엘 언약 이야기 안에서 시작됩니다.",
    },
    datingNote: biblicalSequencePreview.dateLabel,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Beginning of monarchy", ko: "왕정 시작" },
    eventType: { en: "Beginning of monarchy", ko: "왕정 시작" },
    kingdomTags: [unitedKingdomTag],
    rulerTags: [saulRulerTag],
    prophetTags: [samuelProphetTag],
    dateLabel: biblicalSequencePreview.dateLabel,
    worldContextConfidenceLabel: {
      en: "Scripture anchor first; external chronology not asserted",
      ko: "본문 근거 우선, 외부 연대 단정 없음",
    },
    reader: { book: "1-samuel", chapter: 10, verse: 17, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "david-anointed",
    title: { en: "David Anointed", ko: "다윗의 기름부음" },
    summary: { en: "The shepherd boy is set apart for kingship.", ko: "목동 소년이 왕권을 위해 구별됩니다." },
    periodId: "united-kingdom",
    primaryBookId: "1-samuel",
    relatedBookIds: ["2-samuel", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 16:1-13", ko: "사무엘상 16:1-13" },
        { book: "1-samuel", chapter: 16, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "David", ko: "다윗" }, { en: "Samuel", ko: "사무엘" }],
    placeIds: ["bethlehem"],
    locationNote: {
      en: "Bethlehem appears as a royal beginning, not only a birth-place later in the flow.",
      ko: "베들레헴은 후일의 탄생지일 뿐 아니라 왕권의 시작점으로도 등장합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the monarchy settles", ko: "왕정이 안정되기 전" },
    eventType: { en: "Kingship", ko: "왕권" },
    kingdomTags: [unitedKingdomTag],
    rulerTags: [davidRulerTag],
    prophetTags: [samuelProphetTag],
    synchronismNote: {
      en: "David is anointed within the textual flow of Saul's monarchy.",
      ko: "사울 왕정 중 다윗이 기름부음을 받는 본문 흐름입니다.",
    },
    worldContextBasisLabel: { en: "1 Samuel 16 textual sequence", ko: "사무엘상 16장 본문 순서" },
    worldContextConfidenceLabel: { en: "Based on textual sequence", ko: "본문 순서 기반" },
    reader: { book: "1-samuel", chapter: 16, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "davidic-covenant",
    title: { en: "Davidic Covenant", ko: "다윗 언약" },
    summary: { en: "The promise of a lasting house and throne is spoken.", ko: "영원한 집과 왕좌의 약속이 선포됩니다." },
    periodId: "united-kingdom",
    primaryBookId: "2-samuel",
    relatedBookIds: ["psalms", "isaiah"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Samuel 7:1-17", ko: "사무엘하 7:1-17" },
        { book: "2-samuel", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "David", ko: "다윗" }, { en: "Nathan", ko: "나단" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem becomes the throne-city of the flow.",
      ko: "예루살렘이 흐름 속 왕좌의 도시가 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the united monarchy", ko: "통일 왕국 시기" },
    eventType: { en: "Covenant / kingship", ko: "언약 / 왕권" },
    kingdomTags: [unitedKingdomTag],
    rulerTags: [davidRulerTag],
    prophetTags: [nathanProphetTag],
    reader: { book: "2-samuel", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "solomon-temple",
    title: { en: "Solomon Builds the Temple", ko: "솔로몬 성전 건축" },
    summary: { en: "The house for the name of the Lord is dedicated.", ko: "여호와의 이름을 위한 집이 봉헌됩니다." },
    periodId: "united-kingdom",
    primaryBookId: "1-kings",
    relatedBookIds: ["2-chronicles", "psalms"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 8:1-66", ko: "열왕기상 8:1-66" },
        { book: "1-kings", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Solomon", ko: "솔로몬" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem now holds the temple center of the timeline.",
      ko: "예루살렘이 이제 타임라인의 성전 중심이 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the kingdom is established", ko: "왕국이 세워진 뒤" },
    eventType: { en: "Temple / kingship", ko: "성전 / 왕권" },
    kingdomTags: [unitedKingdomTag],
    rulerTags: [solomonRulerTag],
    relativeYearLabel: { en: "Solomon's fourth year", ko: "솔로몬 제4년" },
    relativeYearBasisLabel: { en: "1 Kings 6:1 reign-year notice", ko: "열왕기상 6:1의 통치 연수 기록" },
    relativeYearCalculationNote: {
      en: "1 Kings 6:1 records that temple construction began in Solomon's fourth year. The same verse's 480-years-after-Exodus notice is displayed as a biblical textual marker without asserting an external chronology.",
      ko: "열왕기상 6:1은 솔로몬 왕 제4년에 성전 건축이 시작되었다고 기록합니다. 같은 구절의 출애굽 후 480년 표지는 본문 기록으로 표시하되, 외부 연대 계산은 단정하지 않습니다.",
    },
    worldContextConfidenceLabel: {
      en: "Biblical reign-year stated; external chronology supporting only",
      ko: "본문 통치 연수 기록은 명시, 외부 연대는 보조",
    },
    reader: { book: "1-kings", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "kingdom-divided",
    title: { en: "Kingdom Divided", ko: "왕국 분열" },
    summary: { en: "The one kingdom splits into north and south.", ko: "하나의 왕국이 북과 남으로 갈라집니다." },
    periodId: "divided-kingdom",
    primaryBookId: "1-kings",
    relatedBookIds: ["2-kings", "2-chronicles"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 12:1-24", ko: "열왕기상 12:1-24" },
        { book: "1-kings", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Rehoboam", ko: "르호보암" }, { en: "Jeroboam", ko: "여로보암" }],
    placeIds: ["shechem", "jerusalem"],
    locationNote: {
      en: "The split is visible in both Shechem and Jerusalem.",
      ko: "분열은 세겜과 예루살렘 모두에서 드러납니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After Solomon", ko: "솔로몬 이후" },
    eventType: { en: "Kingdom division", ko: "왕국 분열" },
    kingdomTags: [judahKingdomTag, northernIsraelKingdomTag],
    rulerTags: [rehoboamRulerTag, jeroboamRulerTag],
    relativeYearBasisLabel: { en: "1 Kings 12 textual sequence", ko: "열왕기상 12장 본문 순서" },
    synchronismNote: {
      en: "After Solomon, the kingdom divides into Judah and Northern Israel in the biblical narrative.",
      ko: "솔로몬 이후 왕국이 유다와 북이스라엘로 갈라지는 본문 흐름입니다.",
    },
    worldContextBasisLabel: { en: "1 Kings 12 textual sequence", ko: "열왕기상 12장 본문 순서" },
    worldContextConfidenceLabel: { en: "Based on textual sequence", ko: "본문 순서 기반" },
    reader: { book: "1-kings", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "elijah-carmel",
    title: { en: "Elijah at Carmel", ko: "갈멜산의 엘리야" },
    summary: { en: "The Lord answers in fire and turns hearts back.", ko: "여호와께서 불로 응답하시고 마음을 돌이키십니다." },
    periodId: "divided-kingdom",
    primaryBookId: "1-kings",
    relatedBookIds: ["malachi", "matthew"],
    scriptureAnchors: [
      createAnchor(
        { en: "1 Kings 18:16-40", ko: "열왕기상 18:16-40" },
        { book: "1-kings", chapter: 18, verse: 16, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Elijah", ko: "엘리야" }],
    placeIds: ["carmel"],
    locationNote: {
      en: "Mount Carmel is a strong place chip for prophetic conflict.",
      ko: "갈멜산은 선지자 대결을 보여주는 강한 지명 표지입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the divided kingdom", ko: "분열 왕국 시기" },
    eventType: { en: "Prophetic confrontation", ko: "선지자 대결" },
    kingdomTags: [northernIsraelKingdomTag],
    rulerTags: [ahabRulerTag],
    prophetTags: [elijahProphetTag],
    surroundingNationTags: [baalProphetsTag],
    synchronismNote: {
      en: "Elijah's Mount Carmel event belongs to the Northern Israel context in the days of Ahab.",
      ko: "엘리야의 갈멜산 사건은 아합 시대 북이스라엘 배경 속에 있습니다.",
    },
    worldContextBasisLabel: { en: "1 Kings 18 textual sequence", ko: "열왕기상 18장 본문 순서" },
    worldContextConfidenceLabel: { en: "Based on textual sequence", ko: "본문 순서 기반" },
    reader: { book: "1-kings", chapter: 18, verse: 16, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "northern-exile",
    title: { en: "Northern Kingdom Exile", ko: "북이스라엘 포로" },
    summary: { en: "Samaria falls and the northern tribes are carried away.", ko: "사마리아가 함락되고 북쪽 지파들이 끌려갑니다." },
    periodId: "divided-kingdom",
    primaryBookId: "2-kings",
    relatedBookIds: ["hosea", "amos"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 17:1-23", ko: "열왕기하 17:1-23" },
        { book: "2-kings", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "The northern kingdom", ko: "북왕국" }],
    placeIds: ["samaria", "assyria"],
    locationNote: {
      en: "Samaria is the visual center of the north's collapse.",
      ko: "사마리아가 북왕국 붕괴의 시각적 중심입니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Judah's fall", ko: "유다 멸망 이전" },
    eventType: { en: "Exile", ko: "포로" },
    kingdomTags: [northernIsraelKingdomTag],
    empireTags: [assyriaEmpireTag],
    rulerTags: [hosheaRulerTag, { en: "King of Assyria", ko: "앗수르 왕" }],
    prophetTags: [hoseaProphetTag, amosProphetTag],
    dateLabel: { en: "Supporting date: c. 722 BC", ko: "보조 연대: 약 주전 722년" },
    dateBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    dateConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    worldContextBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    worldContextNote: {
      en: "The fall of Samaria is shown within the Assyrian conquest context of Northern Israel.",
      ko: "사마리아 함락은 앗수르 제국의 북이스라엘 정복 배경 속에 표시됩니다.",
    },
    worldContextConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    reader: { book: "2-kings", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "hezekiah-assyria",
    title: { en: "Hezekiah and the Assyrian Crisis", ko: "히스기야와 앗수르 위기" },
    summary: {
      en: "Jerusalem stands under Assyrian pressure while Hezekiah seeks the Lord.",
      ko: "히스기야가 여호와를 구할 때 예루살렘은 앗수르 압박 아래 서 있습니다.",
    },
    periodId: "divided-kingdom",
    primaryBookId: "2-kings",
    relatedBookIds: ["isaiah"],
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
    people: [{ en: "Hezekiah", ko: "히스기야" }, { en: "Isaiah", ko: "이사야" }, { en: "Sennacherib", ko: "산헤립" }],
    placeIds: ["jerusalem", "assyria"],
    locationNote: {
      en: "Jerusalem is the visible center of the crisis in Judah.",
      ko: "예루살렘이 유다 위기의 눈에 보이는 중심입니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Assyrian pressure on Judah", ko: "유다에 대한 앗수르 압박" },
    eventType: { en: "Judah / Assyria crisis", ko: "유다 / 앗수르 위기" },
    kingdomTags: [judahKingdomTag],
    empireTags: [assyriaEmpireTag],
    rulerTags: [hezekiahRulerTag, sennacheribRulerTag],
    prophetTags: [isaiahProphetTag],
    dateLabel: { en: "Supporting date: c. 701 BC", ko: "보조 연대: 약 주전 701년" },
    dateBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    dateConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    worldContextBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    worldContextNote: {
      en: "The Jerusalem crisis in Hezekiah's days is shown within the Assyrian pressure on Judah.",
      ko: "히스기야 시대 예루살렘 위기는 앗수르의 유다 압박 배경 속에 표시됩니다.",
    },
    worldContextConfidenceLabel: {
      en: "Scripture anchor high; external chronology supporting only",
      ko: "본문 근거는 높음, 외부 연대는 보조",
    },
    reader: { book: "2-kings", chapter: 18, verse: 13, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "fall-of-jerusalem",
    title: { en: "Jerusalem Falls and the Babylonian Exile", ko: "예루살렘 함락과 바벨론 포로" },
    summary: { en: "The city falls and the Babylonian exile begins.", ko: "도성이 함락되고 바벨론 포로가 시작됩니다." },
    periodId: "exile",
    primaryBookId: "2-kings",
    relatedBookIds: ["jeremiah", "lamentations"],
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Jeremiah 52:1-30", ko: "예레미야 52:1-30" },
        { book: "jeremiah", chapter: 52, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [
      { en: "Zedekiah", ko: "시드기야" },
      { en: "Nebuchadnezzar", ko: "느부갓네살" },
      { en: "Jeremiah", ko: "예레미야" },
    ],
    placeIds: ["jerusalem", "babylon"],
    locationNote: {
      en: "Jerusalem is the site of loss before Babylon becomes the backdrop of exile.",
      ko: "예루살렘은 상실의 자리이고 바벨론은 포로의 배경이 됩니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "The exile begins", ko: "포로기가 시작됨" },
    eventType: { en: "Fall of Judah / exile", ko: "유다 멸망 / 포로" },
    kingdomTags: [judahKingdomTag],
    empireTags: [babylonEmpireTag],
    rulerTags: [ { en: "Zedekiah", ko: "시드기야" }, { en: "Nebuchadnezzar", ko: "느부갓네살" } ],
    prophetTags: [jeremiahProphetTag],
    dateLabel: { en: "Supporting date: c. 586 BC", ko: "보조 연대: 약 주전 586년" },
    dateBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    dateConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    worldContextBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    worldContextNote: {
      en: "The fall of Jerusalem is shown within Babylon's conquest of Judah and exile context.",
      ko: "예루살렘 함락은 바벨론 제국의 유다 정복과 포로 배경 속에 표시됩니다.",
    },
    worldContextConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    reader: { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "return-decree",
    title: { en: "Cyrus's Decree and the Return", ko: "고레스 칙령과 귀환" },
    summary: { en: "Persia authorizes the people to go home.", ko: "바사가 백성의 귀환을 허락합니다." },
    periodId: "return",
    primaryBookId: "ezra",
    relatedBookIds: ["2-chronicles", "isaiah"],
    scriptureAnchors: [
      createAnchor(
        { en: "Ezra 1:1-11", ko: "에스라 1:1-11" },
        { book: "ezra", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Cyrus", ko: "고레스" }, { en: "The returned exiles", ko: "귀환한 포로들" }],
    placeIds: ["babylon", "persia"],
    locationNote: {
      en: "The decree is issued from imperial power centers.",
      ko: "칙령은 제국 권력 중심에서 나옵니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the exile", ko: "포로기 이후" },
    eventType: { en: "Return", ko: "귀환" },
    empireTags: [persiaEmpireTag],
    rulerTags: [cyrusRulerTag],
    dateLabel: { en: "Supporting date: c. 538 BC", ko: "보조 연대: 약 주전 538년" },
    dateBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    dateConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    worldContextBasisLabel: {
      en: "Scripture text with supporting historical chronology",
      ko: "성경 본문과 보조 역사 연대 연결",
    },
    worldContextNote: {
      en: "The return is shown within the Persian Empire and Cyrus decree context.",
      ko: "귀환은 바사 제국과 고레스 칙령 배경 속에 표시됩니다.",
    },
    worldContextConfidenceLabel: {
      en: "Scripture event high; external date supporting",
      ko: "본문 사건은 높음, 외부 연대는 보조",
    },
    reader: { book: "ezra", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "second-temple",
    title: { en: "Second Temple Rebuilt", ko: "제2성전 재건" },
    summary: { en: "The temple is completed and dedicated again.", ko: "성전이 다시 완성되고 봉헌됩니다." },
    periodId: "return",
    primaryBookId: "ezra",
    relatedBookIds: ["haggai", "zechariah", "nehemiah"],
    scriptureAnchors: [
      createAnchor(
        { en: "Ezra 3:1-13", ko: "에스라 3:1-13" },
        { book: "ezra", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ezra 6:13-18", ko: "에스라 6:13-18" },
        { book: "ezra", chapter: 6, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Zerubbabel", ko: "스룹바벨" }, { en: "Joshua the priest", ko: "제사장 여호수아" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem becomes the rebuilt center of worship.",
      ko: "예루살렘이 재건된 예배 중심이 됩니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the return period", ko: "귀환 기간 중" },
    eventType: { en: "Temple rebuilding", ko: "성전 재건" },
    reader: { book: "ezra", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "john-baptist",
    title: { en: "John the Baptist", ko: "세례 요한" },
    summary: { en: "A prophetic voice prepares the way.", ko: "선지자적 음성이 길을 준비합니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 3:1-12", ko: "마태복음 3:1-12" },
        { book: "matthew", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Luke 1:5-25", ko: "누가복음 1:5-25" },
        { book: "luke", chapter: 1, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "John the Baptist", ko: "세례 요한" }],
    placeIds: ["judean-wilderness", "jordan"],
    locationNote: {
      en: "The wilderness and the Jordan frame John's ministry.",
      ko: "광야와 요단이 요한의 사역을 감쌉니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Jesus' public ministry", ko: "예수님의 공적 사역 전" },
    eventType: { en: "Gospel preparation", ko: "복음서 준비" },
    reader: { book: "matthew", chapter: 3, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "jesus-baptism",
    title: { en: "Baptism of Jesus", ko: "예수님의 세례" },
    summary: { en: "The ministry is publicly affirmed.", ko: "사역이 공개적으로 확증됩니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 3:13-17", ko: "마태복음 3:13-17" },
        { book: "matthew", chapter: 3, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "John the Baptist", ko: "세례 요한" }],
    placeIds: ["jordan"],
    locationNote: {
      en: "The Jordan remains the visible baptism setting.",
      ko: "요단이 세례의 눈에 보이는 배경입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "At the start of public ministry", ko: "공적 사역 시작" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 3, verse: 13, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "galilean-ministry",
    title: { en: "Galilean Ministry Begins", ko: "갈릴리 사역 시작" },
    summary: { en: "The light shines first in Galilee.", ko: "빛이 먼저 갈릴리에서 비칩니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 4:12-25", ko: "마태복음 4:12-25" },
        { book: "matthew", chapter: 4, verse: 12, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The disciples", ko: "제자들" }],
    placeIds: ["galilee", "capernaum"],
    locationNote: {
      en: "Galilee and Capernaum make the ministry map feel tangible.",
      ko: "갈릴리와 가버나움이 사역의 지도를 구체적으로 보여줍니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Early public ministry", ko: "초기 공적 사역" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 4, verse: 12, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "sermon-on-mount",
    title: { en: "Sermon on the Mount", ko: "산상수훈" },
    summary: { en: "Kingdom life is described in detail.", ko: "하나님 나라의 삶이 상세하게 제시됩니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["luke"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 5:1-7:29", ko: "마태복음 5:1-7:29" },
        { book: "matthew", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The crowds", ko: "무리들" }],
    placeIds: ["galilee"],
    locationNote: {
      en: "Galilee remains the teaching landscape.",
      ko: "갈릴리가 가르침의 배경으로 남습니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "During the Galilean teachings", ko: "갈릴리 가르침 중" },
    eventType: { en: "Teaching", ko: "가르침" },
    reader: { book: "matthew", chapter: 5, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "kingdom-parables",
    title: { en: "Kingdom Parables", ko: "천국 비유" },
    summary: { en: "Parables make the kingdom visible through Scripture's flow.", ko: "비유가 성경 흐름을 따라 하나님 나라를 더 분명히 보이게 합니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 13:1-52", ko: "마태복음 13:1-52" },
        { book: "matthew", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }],
    placeIds: ["galilee", "sea-of-galilee"],
    locationNote: {
      en: "Sea and shore imagery gives the preview some geographic variety.",
      ko: "바다와 해안 이미지는 미리보기에 지리적 다양성을 더합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the sermon narratives", ko: "산상수훈 뒤" },
    eventType: { en: "Teaching", ko: "가르침" },
    reader: { book: "matthew", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "triumphal-entry",
    title: { en: "Triumphal Entry", ko: "예루살렘 입성" },
    summary: { en: "The king enters Jerusalem before the final week.", ko: "왕이 마지막 주간 전에 예루살렘에 들어오십니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 21:1-11", ko: "마태복음 21:1-11" },
        { book: "matthew", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The crowds", ko: "무리들" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem becomes the center point for the later Passion events.",
      ko: "예루살렘이 이후 수난 사건의 중심이 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the temple cleansing", ko: "성전 정화 이전" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "last-supper",
    title: { en: "Last Supper", ko: "최후의 만찬" },
    summary: { en: "Bread, cup, and covenant talk shape the night.", ko: "떡, 잔, 언약의 말씀이 밤을 형성합니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 26:17-35", ko: "마태복음 26:17-35" },
        { book: "matthew", chapter: 26, verse: 17, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The disciples", ko: "제자들" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem keeps the timeline connected to the Passion week map.",
      ko: "예루살렘이 타임라인을 수난 주간 지도에 연결합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Gethsemane", ko: "겟세마네 이전" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 26, verse: 17, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "crucifixion",
    title: { en: "Crucifixion", ko: "십자가형" },
    summary: { en: "The Gospel timeline reaches its painful center.", ko: "복음서 타임라인이 고통스러운 중심에 도달합니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 27:32-56", ko: "마태복음 27:32-56" },
        { book: "matthew", chapter: 27, verse: 32, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }],
    placeIds: ["golgotha", "jerusalem"],
    locationNote: {
      en: "Golgotha and Jerusalem are both useful visible place markers.",
      ko: "골고다와 예루살렘은 모두 유용한 시각적 지명 표지입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the trial", ko: "재판 후" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 27, verse: 32, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "burial",
    title: { en: "Burial", ko: "장사" },
    summary: { en: "The tomb is prepared before the resurrection dawn.", ko: "부활 새벽 전에 무덤이 준비됩니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 27:57-66", ko: "마태복음 27:57-66" },
        { book: "matthew", chapter: 27, verse: 57, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "Joseph of Arimathea", ko: "아리마대 요셉" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem remains in view even after the crucifixion.",
      ko: "예루살렘은 십자가형 이후에도 여전히 보입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the resurrection", ko: "부활 이전" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 27, verse: 57, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "resurrection",
    title: { en: "Resurrection", ko: "부활" },
    summary: { en: "The tomb is empty and the flow turns outward.", ko: "무덤이 비고 흐름이 밖으로 펼쳐집니다." },
    periodId: "gospel",
    primaryBookId: "matthew",
    relatedBookIds: ["mark", "luke", "john"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 28:1-10", ko: "마태복음 28:1-10" },
        { book: "matthew", chapter: 28, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The women", ko: "여인들" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "The empty tomb keeps Jerusalem in view.",
      ko: "빈 무덤이 예루살렘을 계속 보이게 합니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the burial", ko: "장사 후" },
    eventType: { en: "Gospel event", ko: "복음서 사건" },
    reader: { book: "matthew", chapter: 28, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "ascension",
    title: { en: "Ascension", ko: "승천" },
    summary: { en: "The risen Lord departs in blessing.", ko: "부활하신 주님이 축복 가운데 떠나십니다." },
    periodId: "acts",
    primaryBookId: "acts",
    relatedBookIds: ["luke"],
    scriptureAnchors: [
      createAnchor(
        { en: "Acts 1:1-11", ko: "사도행전 1:1-11" },
        { book: "acts", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Jesus", ko: "예수님" }, { en: "The apostles", ko: "사도들" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem remains the launching point for Acts.",
      ko: "예루살렘은 사도행전의 출발점으로 남습니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Pentecost", ko: "오순절 이전" },
    eventType: { en: "Ascension", ko: "승천" },
    reader: { book: "acts", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "pentecost",
    title: { en: "Pentecost", ko: "오순절" },
    summary: { en: "The Spirit fills the gathered church.", ko: "성령이 모인 교회를 충만하게 하십니다." },
    periodId: "acts",
    primaryBookId: "acts",
    relatedBookIds: ["joel"],
    scriptureAnchors: [
      createAnchor(
        { en: "Acts 2:1-47", ko: "사도행전 2:1-47" },
        { book: "acts", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Peter", ko: "베드로" }, { en: "The believers", ko: "믿는 사람들" }],
    placeIds: ["jerusalem"],
    locationNote: {
      en: "Jerusalem becomes the first public church location in the preview.",
      ko: "예루살렘은 미리보기에서 첫 공개 교회 장소가 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Immediately after the ascension", ko: "승천 직후" },
    eventType: { en: "Church birth", ko: "교회 탄생" },
    reader: { book: "acts", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "gentiles",
    title: { en: "Gospel to Gentiles", ko: "이방인에게 복음" },
    summary: { en: "The gospel crosses a major boundary into the nations.", ko: "복음이 민족들로 향하는 큰 경계를 넘습니다." },
    periodId: "acts",
    primaryBookId: "acts",
    relatedBookIds: ["romans", "galatians", "ephesians"],
    scriptureAnchors: [
      createAnchor(
        { en: "Acts 10:1-48", ko: "사도행전 10:1-48" },
        { book: "acts", chapter: 10, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Peter", ko: "베드로" }, { en: "Cornelius", ko: "고넬료" }],
    placeIds: ["caesarea"],
    locationNote: {
      en: "Caesarea makes the mission shift visible on the map of the page.",
      ko: "가이사랴는 사명 전환을 페이지의 지도 위에서 보이게 합니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After Jerusalem", ko: "예루살렘 이후" },
    eventType: { en: "Mission expansion", ko: "선교 확장" },
    reader: { book: "acts", chapter: 10, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "paul-missions",
    title: { en: "Paul's Missionary Movement", ko: "바울의 선교 여정" },
    summary: { en: "The mission widens through cities and seas.", ko: "선교가 도시들과 바다를 따라 넓어집니다." },
    periodId: "acts",
    primaryBookId: "acts",
    relatedBookIds: ["romans", "1-corinthians", "galatians", "philippians"],
    scriptureAnchors: [
      createAnchor(
        { en: "Acts 13:1-28:31", ko: "사도행전 13:1-28:31" },
        { book: "acts", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "Paul", ko: "바울" }, { en: "Barnabas", ko: "바나바" }],
    placeIds: ["antioch", "jerusalem", "rome"],
    locationNote: {
      en: "Antioch, the road cities, and Rome show the widening mission arc.",
      ko: "안디옥, 길 위의 도시들, 그리고 로마가 선교의 확장 호를 보여줍니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "The gospel moves outward", ko: "복음이 밖으로 확장됨" },
    eventType: { en: "Mission movement", ko: "선교 여정" },
    reader: { book: "acts", chapter: 13, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
];

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
      en: "Omri's dynasty and Ahab are major textual markers in Northern Israel.",
      ko: "오므리 왕조와 아합은 북이스라엘 흐름의 중요한 본문 표지입니다.",
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
      en: "Jehu marks a dynastic transition in Northern Israel connected with Elisha's prophetic circle.",
      ko: "예후는 엘리사의 선지자 제자와 연결되어 북이스라엘 왕조 전환을 보여 줍니다.",
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
      en: "Jeroboam II's reign connects with the superscription settings of Hosea and Amos.",
      ko: "여로보암 2세 시대는 호세아와 아모스의 표제 배경과 연결됩니다.",
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
    note: { en: "Uzziah's reign connects with Isaiah's superscription setting.", ko: "웃시야 시대는 이사야 표제의 왕정 배경과 연결됩니다." },
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
      en: "Ahaz's reign connects with the Aram-Ephraim crisis in Isaiah 7.",
      ko: "아하스 시대는 이사야 7장의 아람-에브라임 위기와 연결됩니다.",
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
      en: "Jehoiachin/Jeconiah forms a connection between the deportation and Matthew's genealogy.",
      ko: "여호야긴/여고냐는 포로기와 마태복음 족보의 연결점입니다.",
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

export const timelineGenealogySegments: TimelineGenealogySegment[] = [
  {
    basisLabel: { en: "Matthew's textual structure", ko: "마태복음 본문 구조" },
    id: "matthew-genealogy-abraham-to-david",
    note: {
      en: "Matthew presents Christ's genealogy with Abraham and David as major textual markers.",
      ko: "마태복음은 아브라함과 다윗을 중심 표지로 삼아 그리스도의 족보를 제시합니다.",
    },
    rangeLabel: { en: "First fourteen generations", ko: "첫 번째 14대" },
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:1-6", ko: "마태복음 1:1-6" },
        { book: "matthew", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ruth 4:18-22", ko: "룻기 4:18-22" },
        { book: "ruth", chapter: 4, verse: 18, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    structureLabel: {
      en: "Matthew 1:17 fourteen-generation structure",
      ko: "마태복음 1:17의 14대 구조",
    },
    title: { en: "From Abraham to David", ko: "아브라함에서 다윗까지" },
  },
  {
    basisLabel: { en: "Matthew compared with Old Testament royal genealogy", ko: "마태복음과 구약 왕계보 비교" },
    id: "matthew-genealogy-david-to-exile",
    note: {
      en: "This section follows the Davidic royal line toward the Babylonian deportation. Matthew uses a selective genealogical arrangement.",
      ko: "이 구간은 다윗 왕계보와 바벨론 포로를 향한 흐름을 보여 줍니다. 마태복음은 선택적으로 배열된 족보 구조를 사용합니다.",
    },
    rangeLabel: { en: "Second fourteen generations", ko: "두 번째 14대" },
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:6-11", ko: "마태복음 1:6-11" },
        { book: "matthew", chapter: 1, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Chronicles 3:10-16", ko: "역대상 3:10-16" },
        { book: "1-chronicles", chapter: 3, verse: 10, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 24:1-17", ko: "열왕기하 24:1-17" },
        { book: "2-kings", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    structureLabel: {
      en: "Matthew 1:17 fourteen-generation structure",
      ko: "마태복음 1:17의 14대 구조",
    },
    title: { en: "From David to the Deportation", ko: "다윗에서 바벨론 포로까지" },
  },
  {
    basisLabel: { en: "Matthew's textual structure", ko: "마태복음 본문 구조" },
    id: "matthew-genealogy-exile-to-christ",
    note: {
      en: "Matthew gathers the post-deportation line toward Christ.",
      ko: "마태복음은 바벨론 포로 이후의 흐름을 그리스도에게로 모읍니다.",
    },
    rangeLabel: { en: "Third fourteen generations", ko: "세 번째 14대" },
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:12-17", ko: "마태복음 1:12-17" },
        { book: "matthew", chapter: 1, verse: 12, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    structureLabel: {
      en: "Matthew 1:17 fourteen-generation structure",
      ko: "마태복음 1:17의 14대 구조",
    },
    title: { en: "From the Deportation to Christ", ko: "바벨론 포로부터 그리스도까지" },
  },
];

export const timelineGenealogyComparisonRows: TimelineGenealogyComparisonRow[] = [
  {
    basisLabel: { en: "Matthew / Genesis textual connection", ko: "마태복음 / 창세기 본문 연결" },
    comparisonLabel: { en: "Aligned", ko: "일치" },
    id: "genealogy-abraham",
    matthewName: { en: "Abraham", ko: "아브라함" },
    oldTestamentName: { en: "Abraham", ko: "아브라함" },
    periodId: "patriarchs",
    relatedEventIds: ["call-of-abraham"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:2", ko: "마태복음 1:2" },
        { book: "matthew", chapter: 1, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 12:1-9", ko: "창세기 12:1-9" },
        { book: "genesis", chapter: 12, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
    note: {
      en: "Matthew presents Christ's genealogy with Abraham and David as major textual markers.",
      ko: "마태복음은 아브라함과 다윗을 중심 표지로 삼아 그리스도의 족보를 제시합니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Genesis textual connection", ko: "마태복음 / 창세기 본문 연결" },
    comparisonLabel: { en: "Aligned", ko: "일치" },
    id: "genealogy-isaac",
    matthewName: { en: "Isaac", ko: "이삭" },
    oldTestamentName: { en: "Isaac", ko: "이삭" },
    periodId: "patriarchs",
    relatedEventIds: ["isaac-born"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:2", ko: "마태복음 1:2" },
        { book: "matthew", chapter: 1, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 21:1-7", ko: "창세기 21:1-7" },
        { book: "genesis", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
  },
  {
    basisLabel: { en: "Matthew / Genesis name connection", ko: "마태복음 / 창세기 이름 연결" },
    comparisonLabel: { en: "Name connection", ko: "이름 연결" },
    id: "genealogy-jacob",
    matthewName: { en: "Jacob", ko: "야곱" },
    oldTestamentName: { en: "Jacob / Israel", ko: "야곱 / 이스라엘" },
    periodId: "patriarchs",
    relatedEventIds: ["jacob-israel"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:2", ko: "마태복음 1:2" },
        { book: "matthew", chapter: 1, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 32:22-32", ko: "창세기 32:22-32" },
        { book: "genesis", chapter: 32, verse: 22, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
    nameVariantNote: {
      en: "Jacob receives the name Israel in Genesis 32.",
      ko: "야곱은 창세기 32장에서 이스라엘이라는 이름을 받습니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Genesis textual connection", ko: "마태복음 / 창세기 본문 연결" },
    comparisonLabel: { en: "Line transition", ko: "족보 전환" },
    id: "genealogy-judah",
    matthewName: { en: "Judah", ko: "유다" },
    oldTestamentName: { en: "Judah", ko: "유다" },
    periodId: "patriarchs",
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:2-3", ko: "마태복음 1:2-3" },
        { book: "matthew", chapter: 1, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Genesis 49:8-12", ko: "창세기 49:8-12" },
        { book: "genesis", chapter: 49, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
    note: {
      en: "Matthew's genealogy continues through Judah among Jacob's sons.",
      ko: "마태복음 족보는 야곱의 아들들 중 유다 계통으로 이어집니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Ruth textual connection", ko: "마태복음 / 룻기 본문 연결" },
    comparisonLabel: { en: "Ruth connection", ko: "룻기 연결" },
    id: "genealogy-boaz-ruth",
    matthewName: { en: "Boaz", ko: "보아스" },
    oldTestamentName: { en: "Boaz / Ruth", ko: "보아스 / 룻" },
    periodId: "conquest",
    relatedEventIds: ["ruth-boaz"],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:5", ko: "마태복음 1:5" },
        { book: "matthew", chapter: 1, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Ruth 4:13-22", ko: "룻기 4:13-22" },
        { book: "ruth", chapter: 4, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
    note: {
      en: "Matthew's genealogy gathers Ruth and Boaz into the Davidic line.",
      ko: "마태복음 족보는 보아스와 룻을 다윗 계통 안에 모읍니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Davidic covenant connection", ko: "마태복음 / 다윗 언약 연결" },
    comparisonLabel: { en: "Kingship marker", ko: "왕권 표지" },
    id: "genealogy-david",
    kingdomTags: [{ en: "United Kingdom", ko: "통일 왕국" }],
    matthewName: { en: "David", ko: "다윗" },
    oldTestamentName: { en: "David", ko: "다윗" },
    periodId: "united-kingdom",
    relatedEventIds: ["davidic-covenant"],
    rulerTags: [{ en: "David", ko: "다윗" }],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:6", ko: "마태복음 1:6" },
        { book: "matthew", chapter: 1, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 7:1-17", ko: "사무엘하 7:1-17" },
        { book: "2-samuel", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-abraham-to-david",
    note: {
      en: "The Davidic covenant connects the kingdom flow to the messianic promise.",
      ko: "다윗 언약은 왕국 흐름을 메시아 약속과 연결합니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Chronicles / Kings comparison", ko: "마태복음 / 역대상 / 열왕기 비교" },
    comparisonLabel: {
      en: "Omissions observed when compared with OT royal line",
      ko: "구약 왕계보와 비교 시 생략 관찰",
    },
    id: "genealogy-joram-uzziah",
    kingdomTags: [{ en: "Judah", ko: "유다" }],
    matthewName: { en: "Joram → Uzziah", ko: "요람 → 웃시야" },
    oldTestamentName: {
      en: "Joram → Ahaziah → Joash → Amaziah → Uzziah",
      ko: "요람 → 아하시야 → 요아스 → 아마샤 → 웃시야",
    },
    periodId: "divided-kingdom",
    rulerTags: [
      { en: "Joram", ko: "요람" },
      { en: "Uzziah", ko: "웃시야" },
    ],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:8", ko: "마태복음 1:8" },
        { book: "matthew", chapter: 1, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Chronicles 3:11-12", ko: "역대상 3:11-12" },
        { book: "1-chronicles", chapter: 3, verse: 11, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 8:24-25", ko: "열왕기하 8:24-25" },
        { book: "2-kings", chapter: 8, verse: 24, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 11:2", ko: "열왕기하 11:2" },
        { book: "2-kings", chapter: 11, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 14:1", ko: "열왕기하 14:1" },
        { book: "2-kings", chapter: 14, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 15:1-2", ko: "열왕기하 15:1-2" },
        { book: "2-kings", chapter: 15, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-david-to-exile",
    omissionNote: {
      en: "Matthew 1:8 moves from Joram to Uzziah, while Chronicles and Kings show Ahaziah, Joash, and Amaziah between them. This preview marks the difference as a selective genealogical arrangement.",
      ko: "마태복음 1:8은 요람에서 웃시야로 이어지지만, 역대상과 열왕기 계보를 함께 보면 아하시야, 요아스, 아마샤가 그 사이에 나타납니다. 이 미리보기는 이를 선택적 족보 배열로 표시합니다.",
    },
    nameVariantNote: {
      en: "Uzziah is also associated with the name Azariah in the Old Testament royal accounts.",
      ko: "웃시야는 구약 왕계보에서 아사랴라는 이름과도 연결됩니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Kings / Chronicles name comparison", ko: "마태복음 / 열왕기 / 역대기 이름 비교" },
    comparisonLabel: { en: "Name variant", ko: "이름 차이" },
    id: "genealogy-uzziah-azariah",
    kingdomTags: [{ en: "Judah", ko: "유다" }],
    matthewName: { en: "Uzziah", ko: "웃시야" },
    oldTestamentName: { en: "Uzziah / Azariah", ko: "웃시야 / 아사랴" },
    periodId: "divided-kingdom",
    rulerTags: [{ en: "Uzziah / Azariah", ko: "웃시야 / 아사랴" }],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:8-9", ko: "마태복음 1:8-9" },
        { book: "matthew", chapter: 1, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 15:1-7", ko: "열왕기하 15:1-7" },
        { book: "2-kings", chapter: 15, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Chronicles 26:1-23", ko: "역대하 26:1-23" },
        { book: "2-chronicles", chapter: 26, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-david-to-exile",
    nameVariantNote: {
      en: "2 Kings 15 uses the name Azariah, while 2 Chronicles 26 uses Uzziah.",
      ko: "열왕기하 15장은 아사랴라는 이름을 사용하고, 역대하 26장은 웃시야라는 이름을 사용합니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Chronicles / Kings comparison", ko: "마태복음 / 역대상 / 열왕기 비교" },
    comparisonLabel: {
      en: "Omission observed when compared with OT royal line",
      ko: "구약 왕계보와 비교 시 생략 관찰",
    },
    id: "genealogy-josiah-jeconiah",
    kingdomTags: [{ en: "Judah", ko: "유다" }],
    matthewName: { en: "Josiah → Jeconiah", ko: "요시야 → 여고냐" },
    oldTestamentName: { en: "Josiah → Jehoiakim → Jehoiachin / Jeconiah", ko: "요시야 → 여호야김 → 여호야긴 / 여고냐" },
    periodId: "exile",
    rulerTags: [
      { en: "Josiah", ko: "요시야" },
      { en: "Jeconiah", ko: "여고냐" },
    ],
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:11", ko: "마태복음 1:11" },
        { book: "matthew", chapter: 1, verse: 11, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Chronicles 3:15-16", ko: "역대상 3:15-16" },
        { book: "1-chronicles", chapter: 3, verse: 15, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 23:34-37", ko: "열왕기하 23:34-37" },
        { book: "2-kings", chapter: 23, verse: 34, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 24:6-17", ko: "열왕기하 24:6-17" },
        { book: "2-kings", chapter: 24, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-david-to-exile",
    omissionNote: {
      en: "Matthew 1:11 presents the royal line around the deportation in compressed form. Chronicles and Kings show Jehoiakim between Josiah and Jeconiah.",
      ko: "마태복음 1:11은 포로기 전후의 왕계보를 압축해서 제시합니다. 역대상과 열왕기를 함께 보면 여호야김이 요시야와 여고냐 사이에 나타납니다.",
    },
    nameVariantNote: {
      en: "Jeconiah is associated with the names Jehoiachin and Coniah.",
      ko: "여고냐는 여호야긴, 고니야와 연결되는 이름입니다.",
    },
  },
  {
    basisLabel: { en: "Matthew / Kings / Jeremiah name comparison", ko: "마태복음 / 열왕기 / 예레미야 이름 비교" },
    comparisonLabel: { en: "Deportation marker", ko: "포로기 표지" },
    id: "genealogy-jeconiah-exile",
    empireTags: [{ en: "Babylon", ko: "바벨론" }],
    kingdomTags: [{ en: "Judah", ko: "유다" }],
    matthewName: { en: "Jeconiah", ko: "여고냐" },
    oldTestamentName: { en: "Jehoiachin / Jeconiah", ko: "여호야긴 / 여고냐" },
    periodId: "exile",
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:11-12", ko: "마태복음 1:11-12" },
        { book: "matthew", chapter: 1, verse: 11, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 24:8-17", ko: "열왕기하 24:8-17" },
        { book: "2-kings", chapter: 24, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Jeremiah 22:24-30", ko: "예레미야 22:24-30" },
        { book: "jeremiah", chapter: 22, verse: 24, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-exile-to-christ",
    nameVariantNote: {
      en: "Jeconiah is associated with Jehoiachin and Coniah.",
      ko: "여고냐는 여호야긴과 고니야라는 이름과 연결됩니다.",
    },
  },
  {
    basisLabel: { en: "Matthew's textual structure", ko: "마태복음 본문 구조" },
    comparisonLabel: { en: "Gathered to Christ", ko: "그리스도께로 모임" },
    id: "genealogy-joseph-mary-christ",
    matthewName: { en: "Joseph / Mary / Christ", ko: "요셉 / 마리아 / 그리스도" },
    oldTestamentName: { en: "Fulfillment of the Davidic line", ko: "다윗 계보의 성취" },
    periodId: "gospel",
    scriptureAnchors: [
      createAnchor(
        { en: "Matthew 1:16-17", ko: "마태복음 1:16-17" },
        { book: "matthew", chapter: 1, verse: 16, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Matthew 1:18-25", ko: "마태복음 1:18-25" },
        { book: "matthew", chapter: 1, verse: 18, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    segmentId: "matthew-genealogy-exile-to-christ",
    note: {
      en: "Matthew gathers the genealogy to Christ. This preview is limited to showing Matthew 1's structure.",
      ko: "마태복음은 족보를 그리스도께로 모읍니다. 이 미리보기는 마태복음 1장의 구조를 보여 주는 데 제한됩니다.",
    },
  },
];

export const timelineSchematicPlaceRows: TimelineSchematicPlaceRow[] = [
  {
    id: "schematic-place-ur",
    placeId: "ur",
    title: { en: "Ur", ko: "우르" },
    modernReferenceLabel: { en: "Today: southern Iraq region", ko: "오늘날: 이라크 남부 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Mesopotamia / patriarchal route", ko: "메소포타미아 / 족장 여정" },
    conceptZoneId: "mesopotamia",
    conceptFlowGroup: "patriarchs",
    placeTypeLabel: { en: "City / departure point", ko: "도시 / 출발 지점" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 11:31-12:4", ko: "창세기 11:31-12:4" },
        { book: "genesis", chapter: 11, verse: 31, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Acts 7:2-4", ko: "사도행전 7:2-4" },
        { book: "acts", chapter: 7, verse: 2, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["terah-house", "call-of-abraham"],
    relatedPeople: [{ en: "Abram", ko: "아브람" }],
    note: {
      en: "Ur marks the starting point of Abraham's movement before the call is traced into Canaan.",
      ko: "우르는 아브라함의 이동 시작점으로, 부르심이 가나안으로 이어지기 전의 출발점입니다.",
    },
  },
  {
    id: "schematic-place-shinar",
    placeId: "shinar",
    title: { en: "Shinar", ko: "시날" },
    modernReferenceLabel: { en: "Today: Iraq / Mesopotamia region", ko: "오늘날: 이라크 / 메소포타미아 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Mesopotamia / tower setting", ko: "메소포타미아 / 탑 사건 배경" },
    conceptZoneId: "mesopotamia",
    conceptFlowGroup: "patriarchs",
    placeTypeLabel: { en: "Region / narrative setting", ko: "지역 / 서사 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceBroad,
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 11:1-9", ko: "창세기 11:1-9" },
        { book: "genesis", chapter: 11, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["babel"],
    relatedPeople: [{ en: "The nations", ko: "민족들" }],
    note: {
      en: "Shinar marks the Babel narrative setting in Scripture.",
      ko: "시날은 성경의 바벨 사건 배경으로 표시됩니다.",
    },
    cautionNote: noCoordinatesNote,
  },
  {
    id: "schematic-place-babylon",
    placeId: "babylon",
    title: { en: "Babylon", ko: "바벨론" },
    modernReferenceLabel: { en: "Today: Iraq region", ko: "오늘날: 이라크 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Mesopotamia / exile setting", ko: "메소포타미아 / 포로기 배경" },
    conceptZoneId: "babylon",
    conceptFlowGroup: "exile-return",
    placeTypeLabel: { en: "Imperial center / exile setting", ko: "제국 중심 / 포로기 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 24:8-17", ko: "열왕기하 24:8-17" },
        { book: "2-kings", chapter: 24, verse: 8, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Daniel 1:1-7", ko: "다니엘 1:1-7" },
        { book: "daniel", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 137:1-9", ko: "시편 137:1-9" },
        { book: "psalms", chapter: 137, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["book-context-daniel", "psalm-context-psalm-137", "book-context-lamentations"],
    relatedEmpires: [babylonEmpireTag],
    relatedPeople: [
      { en: "Nebuchadnezzar", ko: "느부갓네살" },
      { en: "The exiles", ko: "포로 된 자들" },
    ],
    note: {
      en: "Babylon is connected with Judah's exile, Daniel, and Psalm 137.",
      ko: "바벨론은 유다 포로기와 다니엘, 시편 137편의 배경과 연결됩니다.",
    },
  },
  {
    id: "schematic-place-susa",
    placeId: "susa",
    title: { en: "Susa", ko: "수산" },
    modernReferenceLabel: { en: "Today: Iran region", ko: "오늘날: 이란 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Persian imperial setting", ko: "바사 제국 궁정 배경" },
    conceptZoneId: "persia",
    conceptFlowGroup: "exile-return",
    placeTypeLabel: { en: "Imperial court / setting", ko: "궁정 / 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Esther 1:1-3", ko: "에스더 1:1-3" },
        { book: "esther", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Nehemiah 1:1", ko: "느헤미야 1:1" },
        { book: "nehemiah", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["book-context-esther", "book-context-nehemiah"],
    relatedEmpires: [persiaEmpireTag],
    note: {
      en: "Susa is shown as a textual setting for Esther and Nehemiah.",
      ko: "수산은 에스더와 느헤미야의 본문 배경으로 표시됩니다.",
    },
  },
  {
    id: "schematic-place-aram",
    placeId: "aram",
    title: { en: "Aram", ko: "아람" },
    modernReferenceLabel: { en: "Today: Syria region", ko: "오늘날: 시리아 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Aram / regional setting", ko: "아람 / 지역 배경" },
    conceptZoneId: "aram-assyria",
    conceptFlowGroup: "kingdoms",
    placeTypeLabel: { en: "Regional setting", ko: "지역 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceBroad,
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 16:5-9", ko: "열왕기하 16:5-9" },
        { book: "2-kings", chapter: 16, verse: 5, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 7:1-9", ko: "이사야 7:1-9" },
        { book: "isaiah", chapter: 7, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedKingdoms: [northernIsraelKingdomTag, judahKingdomTag],
    relatedEmpires: [assyriaEmpireTag],
    note: {
      en: "Aram appears as a regional setting in the kings and prophets context.",
      ko: "아람은 열왕기와 선지서 문맥 속 지역 배경으로 나타납니다.",
    },
  },
  {
    id: "schematic-place-assyria",
    placeId: "assyria",
    title: { en: "Assyria", ko: "앗수르" },
    modernReferenceLabel: { en: "Today: Iraq / northern Mesopotamia region", ko: "오늘날: 이라크 / 메소포타미아 북부 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Aram / Assyria imperial flow", ko: "아람 / 앗수르 제국 흐름" },
    conceptZoneId: "aram-assyria",
    conceptFlowGroup: "kingdoms",
    placeTypeLabel: { en: "Empire / imperial center", ko: "제국 / 제국 중심" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "2 Kings 17:1-23", ko: "열왕기하 17:1-23" },
        { book: "2-kings", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 18:13-37", ko: "열왕기하 18:13-37" },
        { book: "2-kings", chapter: 18, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Isaiah 36:1-22", ko: "이사야 36:1-22" },
        { book: "isaiah", chapter: 36, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["northern-exile", "hezekiah-assyria"],
    relatedKingdoms: [northernIsraelKingdomTag, judahKingdomTag],
    relatedEmpires: [assyriaEmpireTag],
    relatedPeople: [
      { en: "Hoshea", ko: "호세아" },
      { en: "Hezekiah", ko: "히스기야" },
      { en: "Sennacherib", ko: "산헤립" },
    ],
    note: {
      en: "Assyria functions as a major imperial setting in the divided kingdom period.",
      ko: "앗수르는 분열 왕국 시기의 중요한 제국 배경으로 기능합니다.",
    },
  },
  {
    id: "schematic-place-jerusalem",
    placeId: "jerusalem",
    title: { en: "Jerusalem", ko: "예루살렘" },
    modernReferenceLabel: { en: "Today: Jerusalem", ko: "오늘날: 예루살렘" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Judah highlands / kingdom center", ko: "유다 산지 / 왕국 중심" },
    conceptZoneId: "judah",
    conceptFlowGroup: "kingdoms",
    placeTypeLabel: { en: "City / temple / kingdom center", ko: "도시 / 성전 / 왕국 중심" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "2 Samuel 5:6-10", ko: "사무엘하 5:6-10" },
        { book: "2-samuel", chapter: 5, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Kings 8:1-11", ko: "열왕기상 8:1-11" },
        { book: "1-kings", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["davidic-covenant", "solomon-temple", "fall-of-jerusalem"],
    relatedBookContextIds: ["psalm-context-psalm-3", "psalm-context-psalm-51"],
    relatedKingdoms: [unitedKingdomTag, judahKingdomTag],
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Solomon", ko: "솔로몬" },
      { en: "Jeremiah", ko: "예레미야" },
    ],
    note: {
      en: "Jerusalem is a key biblical place connected with David's kingdom, the temple, and exile events.",
      ko: "예루살렘은 다윗 왕국, 성전, 포로기 사건과 연결되는 핵심 성경 장소입니다.",
    },
  },
  {
    id: "schematic-place-gath",
    placeId: "gath",
    title: { en: "Gath", ko: "가드" },
    modernReferenceLabel: { en: "Today: candidate / traditional identification area", ko: "오늘날: 후보지 / 전통 연결 지역" },
    modernReferenceStatusLabel: modernReferenceCandidate,
    conceptRegionLabel: { en: "Philistine city region", ko: "블레셋 도시권" },
    conceptZoneId: "philistia",
    conceptFlowGroup: "david-flight",
    placeTypeLabel: { en: "City / Philistine region", ko: "도시 / 블레셋 지역" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceCandidate,
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 21:10-15", ko: "사무엘상 21:10-15" },
        { book: "1-samuel", chapter: 21, verse: 10, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 34:1", ko: "시편 34:1" },
        { book: "psalms", chapter: 34, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 56:1", ko: "시편 56:1" },
        { book: "psalms", chapter: 56, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-34", "psalm-context-psalm-56"],
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Abimelech", ko: "아비멜렉" },
      { en: "Achish", ko: "아기스" },
    ],
    note: {
      en: "Gath connects with David's flight narrative and the superscription settings of Psalms 34 and 56.",
      ko: "가드는 다윗의 도피 이야기와 시편 34편, 56편 표제 배경과 연결됩니다.",
    },
    cautionNote: {
      en: "The exact modern site is not asserted in this phase.",
      ko: "현대의 정확한 대응 지점은 이 단계에서 단정하지 않습니다.",
    },
  },
  {
    id: "schematic-place-nob",
    placeId: "nob",
    title: { en: "Nob", ko: "놉" },
    modernReferenceLabel: { en: "Today: candidate / approximate region", ko: "오늘날: 후보지 / 대략적 지역" },
    modernReferenceStatusLabel: modernReferenceCandidate,
    conceptRegionLabel: { en: "Judah / Benjamin-area flow", ko: "유다 / 베냐민 인근 흐름" },
    conceptZoneId: "judah",
    conceptFlowGroup: "david-flight",
    placeTypeLabel: { en: "Settlement / priestly setting", ko: "거주지 / 제사장 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceCandidate,
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 21:1-9", ko: "사무엘상 21:1-9" },
        { book: "1-samuel", chapter: 21, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Samuel 22:6-23", ko: "사무엘상 22:6-23" },
        { book: "1-samuel", chapter: 22, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 52:1", ko: "시편 52:1" },
        { book: "psalms", chapter: 52, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-52"],
    relatedPeople: [
      { en: "Ahimelech", ko: "아히멜렉" },
      { en: "Doeg", ko: "도엑" },
      { en: "David", ko: "다윗" },
    ],
    note: {
      en: "Nob connects with Ahimelech, Doeg, and the superscription setting of Psalm 52.",
      ko: "놉은 아히멜렉과 도엑 사건, 시편 52편 표제 배경과 연결됩니다.",
    },
  },
  {
    id: "schematic-place-adullam",
    placeId: "adullam",
    title: { en: "Adullam", ko: "아둘람" },
    modernReferenceLabel: { en: "Today: candidate / approximate region", ko: "오늘날: 후보지 / 대략적 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Judah flight-flow region", ko: "유다 도피 흐름" },
    conceptZoneId: "judah",
    conceptFlowGroup: "david-flight",
    placeTypeLabel: { en: "Cave / refuge setting", ko: "굴 / 피난처 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceNotAsserted,
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 22:1-2", ko: "사무엘상 22:1-2" },
        { book: "1-samuel", chapter: 22, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 57:1", ko: "시편 57:1" },
        { book: "psalms", chapter: 57, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-57"],
    relatedPeople: [{ en: "David", ko: "다윗" }],
    note: {
      en: "Adullam is connected with David's flight narrative.",
      ko: "아둘람은 다윗의 도피 흐름과 연결되는 장소입니다.",
    },
    cautionNote: {
      en: "Connected with the cave setting of Psalm 57, but the exact location is not asserted.",
      ko: "시편 57편의 굴 배경과 연결되지만 정확한 장소를 단정하지 않습니다.",
    },
  },
  {
    id: "schematic-place-en-gedi",
    placeId: "en-gedi",
    title: { en: "En-gedi", ko: "엔게디" },
    modernReferenceLabel: { en: "Today: En-gedi region", ko: "오늘날: 엔게디 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Wilderness of Judah / Dead Sea area flow", ko: "유다 광야 / 사해 인근 흐름" },
    conceptZoneId: "wilderness",
    conceptFlowGroup: "david-flight",
    placeTypeLabel: { en: "Wilderness refuge setting", ko: "광야 피난 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceBroad,
    scriptureAnchors: [
      createAnchor(
        { en: "1 Samuel 24:1-7", ko: "사무엘상 24:1-7" },
        { book: "1-samuel", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 57:1", ko: "시편 57:1" },
        { book: "psalms", chapter: 57, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-57"],
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Saul", ko: "사울" },
    ],
    note: {
      en: "En-gedi connects with David and Saul's flight narrative.",
      ko: "엔게디는 다윗과 사울의 도피 이야기와 연결됩니다.",
    },
    cautionNote: {
      en: "The exact cave location for Psalm 57 is not asserted.",
      ko: "시편 57편의 정확한 굴 위치는 단정하지 않습니다.",
    },
  },
  {
    id: "schematic-place-wilderness-of-judah",
    placeId: "wilderness-of-judah",
    title: { en: "Wilderness of Judah", ko: "유다 광야" },
    modernReferenceLabel: { en: "Today: Wilderness of Judah region", ko: "오늘날: 유다 광야 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "Wilderness / flight-flow", ko: "광야 / 도피 흐름" },
    conceptZoneId: "wilderness",
    conceptFlowGroup: "david-flight",
    placeTypeLabel: { en: "Wilderness region", ko: "광야 지역" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceBroad,
    scriptureAnchors: [
      createAnchor(
        { en: "Psalm 63:1", ko: "시편 63:1" },
        { book: "psalms", chapter: 63, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Samuel 23:14-15", ko: "사무엘상 23:14-15" },
        { book: "1-samuel", chapter: 23, verse: 14, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 15:23-30", ko: "사무엘하 15:23-30" },
        { book: "2-samuel", chapter: 15, verse: 23, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-63"],
    relatedPeople: [{ en: "David", ko: "다윗" }],
    note: {
      en: "The Wilderness of Judah connects with David's flight setting and Psalm 63's superscription.",
      ko: "유다 광야는 다윗의 도피 배경과 시편 63편 표제에 연결됩니다.",
    },
    cautionNote: {
      en: "The exact flight episode is not asserted.",
      ko: "정확히 어느 도피 사건인지는 단정하지 않습니다.",
    },
  },
  {
    id: "schematic-place-sinai",
    placeId: "sinai",
    title: { en: "Sinai", ko: "시내산" },
    modernReferenceLabel: { en: "Today: Sinai-region candidate / traditional identification", ko: "오늘날: 시내 지역 후보 / 전통 위치" },
    modernReferenceStatusLabel: modernReferenceTraditional,
    conceptRegionLabel: { en: "Exodus / wilderness covenant flow", ko: "출애굽 / 광야 언약 흐름" },
    conceptZoneId: "wilderness",
    conceptFlowGroup: "exodus",
    placeTypeLabel: { en: "Covenant mountain / wilderness setting", ko: "언약 산 / 광야 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceCandidate,
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 19:1-25", ko: "출애굽기 19:1-25" },
        { book: "exodus", chapter: 19, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Exodus 24:1-18", ko: "출애굽기 24:1-18" },
        { book: "exodus", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Psalm 90:1", ko: "시편 90:1" },
        { book: "psalms", chapter: 90, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedBookContextIds: ["psalm-context-psalm-90"],
    relatedPeople: [
      { en: "Moses", ko: "모세" },
      { en: "Israel's children", ko: "이스라엘 자손" },
    ],
    note: {
      en: "Sinai connects with covenant, the wilderness flow, and the Mosaic setting of Psalm 90.",
      ko: "시내산은 언약과 광야 시대 흐름, 시편 90편의 모세 배경과 연결됩니다.",
    },
    cautionNote: {
      en: "Modern coordinates or exact mountain identification are not asserted in this phase.",
      ko: "현대 좌표나 정확한 산 위치는 이 단계에서 단정하지 않습니다.",
    },
  },
  {
    id: "schematic-place-jericho",
    placeId: "jericho",
    title: { en: "Jericho", ko: "여리고" },
    modernReferenceLabel: { en: "Today: Jericho region", ko: "오늘날: 여리고 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "West of Jordan / conquest flow", ko: "요단 서편 / 정복 흐름" },
    conceptZoneId: "canaan",
    placeTypeLabel: { en: "City / conquest setting", ko: "도시 / 정복 배경" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Joshua 6:1-27", ko: "여호수아 6:1-27" },
        { book: "joshua", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["jericho"],
    relatedPeople: [
      { en: "Joshua", ko: "여호수아" },
      { en: "Rahab", ko: "라합" },
      { en: "Israel's children", ko: "이스라엘 자손" },
    ],
    note: {
      en: "Jericho is a key textual location in the conquest sequence after crossing the Jordan.",
      ko: "여리고는 요단 도하 이후 정복 사건의 중요한 본문 장소입니다.",
    },
  },
  {
    id: "schematic-place-moab",
    placeId: "moab",
    title: { en: "Moab", ko: "모압" },
    modernReferenceLabel: { en: "Today: east-of-Jordan region", ko: "오늘날: 요단 동편 지역" },
    modernReferenceStatusLabel: modernReferenceApproximate,
    conceptRegionLabel: { en: "East of Jordan / Ruth setting", ko: "요단 동편 / 룻기 배경" },
    conceptZoneId: "east-jordan",
    placeTypeLabel: { en: "Region / narrative setting", ko: "지역 / 서사 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceBroad,
    scriptureAnchors: [
      createAnchor(
        { en: "Ruth 1:1-22", ko: "룻기 1:1-22" },
        { book: "ruth", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["ruth-boaz"],
    relatedPeople: [
      { en: "Ruth", ko: "룻" },
      { en: "Naomi", ko: "나오미" },
      { en: "Boaz", ko: "보아스" },
    ],
    note: {
      en: "Moab is shown as the opening setting of Ruth and part of the Davidic genealogy connection.",
      ko: "모압은 룻기의 시작 배경과 다윗 계보 연결에 표시됩니다.",
    },
  },
  {
    id: "schematic-place-egypt",
    placeId: "egypt",
    title: { en: "Egypt", ko: "애굽" },
    modernReferenceLabel: { en: "Today: Egypt", ko: "오늘날: 이집트" },
    modernReferenceStatusLabel: { en: "Modern country-name connection", ko: "현대 국가명 연결" },
    conceptRegionLabel: { en: "Exodus starting setting", ko: "출애굽 시작 배경" },
    conceptZoneId: "egypt",
    conceptFlowGroup: "exodus",
    placeTypeLabel: { en: "Kingdom / slavery / exodus setting", ko: "왕국 / 종살이 / 출애굽 배경" },
    locationBasisLabel: locationBasisTextual,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Exodus 1:1-14", ko: "출애굽기 1:1-14" },
        { book: "exodus", chapter: 1, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Exodus 12:29-42", ko: "출애굽기 12:29-42" },
        { book: "exodus", chapter: 12, verse: 29, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["israel-multiplies-egypt", "moses-born", "moses-called-burning-bush", "exodus-passover-night"],
    relatedPeople: [
      { en: "Moses", ko: "모세" },
      { en: "Pharaoh", ko: "바로" },
      { en: "Israel's children", ko: "이스라엘 자손" },
    ],
    note: {
      en: "Egypt is shown as the starting setting of the Exodus.",
      ko: "애굽은 출애굽 사건의 시작 배경으로 표시됩니다.",
    },
  },
  {
    id: "schematic-place-jerusalem-judah",
    placeId: "jerusalem",
    title: { en: "Jerusalem", ko: "예루살렘" },
    modernReferenceLabel: { en: "Today: Jerusalem", ko: "오늘날: 예루살렘" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Canaan / Judah / kingdom center", ko: "가나안 / 유다 / 왕국 중심" },
    conceptZoneId: "judah",
    conceptFlowGroup: "kingdoms",
    placeTypeLabel: { en: "City / temple / kingdom center", ko: "도시 / 성전 / 왕국 중심" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "2 Samuel 5:6-10", ko: "사무엘하 5:6-10" },
        { book: "2-samuel", chapter: 5, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "1 Kings 8:1-11", ko: "열왕기상 8:1-11" },
        { book: "1-kings", chapter: 8, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Kings 25:1-21", ko: "열왕기하 25:1-21" },
        { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["davidic-covenant", "solomon-temple", "fall-of-jerusalem"],
    relatedBookContextIds: ["psalm-context-psalm-3", "psalm-context-psalm-51"],
    relatedKingdoms: [unitedKingdomTag, judahKingdomTag],
    relatedPeople: [
      { en: "David", ko: "다윗" },
      { en: "Solomon", ko: "솔로몬" },
      { en: "Jeremiah", ko: "예레미야" },
    ],
    note: {
      en: "Jerusalem is a key biblical place connected with David's kingdom, the temple, and exile events.",
      ko: "예루살렘은 다윗 왕국, 성전, 포로기 사건과 연결되는 핵심 성경 장소입니다.",
    },
  },
  {
    id: "schematic-place-hebron",
    placeId: "hebron",
    title: { en: "Hebron", ko: "헤브론" },
    modernReferenceLabel: { en: "Today: Hebron region", ko: "오늘날: 헤브론 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Judah hill country / patriarchal setting", ko: "유다 산지 / 족장 배경" },
    conceptZoneId: "judah",
    conceptFlowGroup: "patriarchs",
    placeTypeLabel: { en: "City / covenant settlement", ko: "도시 / 언약 거주지" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 13:18", ko: "창세기 13:18" },
        { book: "genesis", chapter: 13, verse: 18, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "2 Samuel 2:1-4", ko: "사무엘하 2:1-4" },
        { book: "2-samuel", chapter: 2, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedPeople: [
      { en: "Abraham", ko: "아브라함" },
      { en: "David", ko: "다윗" },
    ],
    note: {
      en: "Hebron ties the patriarchal and Davidic narratives together.",
      ko: "헤브론은 족장 서사와 다윗 서사를 연결합니다.",
    },
  },
  {
    id: "schematic-place-shechem",
    placeId: "shechem",
    title: { en: "Shechem", ko: "세겜" },
    modernReferenceLabel: { en: "Today: Shechem area", ko: "오늘날: 세겜 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Canaan / covenant land", ko: "가나안 / 언약 땅" },
    conceptZoneId: "canaan",
    conceptFlowGroup: "patriarchs",
    placeTypeLabel: { en: "City / covenant waypoint", ko: "도시 / 언약 경유지" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Genesis 12:6-7", ko: "창세기 12:6-7" },
        { book: "genesis", chapter: 12, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
      createAnchor(
        { en: "Joshua 24:1-28", ko: "여호수아 24:1-28" },
        { book: "joshua", chapter: 24, verse: 1, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedEventIds: ["call-of-abraham", "covenant-renewal-shechem"],
    relatedPeople: [
      { en: "Abraham", ko: "아브라함" },
      { en: "Joshua", ko: "여호수아" },
    ],
    note: {
      en: "Shechem links the patriarchal promise with Joshua's covenant renewal.",
      ko: "세겜은 족장 약속과 여호수아의 언약 갱신을 연결합니다.",
    },
  },
  {
    id: "schematic-place-bethlehem",
    placeId: "bethlehem",
    title: { en: "Bethlehem", ko: "베들레헴" },
    modernReferenceLabel: { en: "Today: Bethlehem region", ko: "오늘날: 베들레헴 지역" },
    modernReferenceStatusLabel: modernReferenceConnected,
    conceptRegionLabel: { en: "Judah / Davidic genealogy", ko: "유다 / 다윗 계보" },
    conceptZoneId: "judah",
    placeTypeLabel: { en: "Town / genealogy setting", ko: "마을 / 족보 배경" },
    locationBasisLabel: locationBasisRepeated,
    locationConfidenceLabel: locationConfidenceMajor,
    scriptureAnchors: [
      createAnchor(
        { en: "Ruth 4:13-22", ko: "룻기 4:13-22" },
        { book: "ruth", chapter: 4, verse: 13, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    relatedPeople: [
      { en: "Ruth", ko: "룻" },
      { en: "Boaz", ko: "보아스" },
      { en: "David", ko: "다윗" },
    ],
    note: {
      en: "Bethlehem marks the Davidic line in Ruth's genealogy.",
      ko: "베들레헴은 룻기의 족보에서 다윗 계보를 표시합니다.",
    },
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
