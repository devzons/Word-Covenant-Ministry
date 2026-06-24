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
  reader: TimelineReader;
};

export type TimelineDatePreview = {
  dateLabel: TimelineText;
  dateBasisLabel: TimelineText;
  dateConfidenceLabel: TimelineText;
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
  { id: "gospel", order: 9, label: { en: "Gospel", ko: "복음서" } },
  { id: "acts", order: 10, label: { en: "Acts / Early Church", ko: "사도행전 / 초기 교회" } },
];

export const timelineBooks: TimelineBook[] = [
  { id: "genesis", label: { en: "Genesis", ko: "창세기" } },
  { id: "exodus", label: { en: "Exodus", ko: "출애굽기" } },
  { id: "leviticus", label: { en: "Leviticus", ko: "레위기" } },
  { id: "numbers", label: { en: "Numbers", ko: "민수기" } },
  { id: "deuteronomy", label: { en: "Deuteronomy", ko: "신명기" } },
  { id: "joshua", label: { en: "Joshua", ko: "여호수아" } },
  { id: "judges", label: { en: "Judges", ko: "사사기" } },
  { id: "1-samuel", label: { en: "1 Samuel", ko: "사무엘상" } },
  { id: "2-samuel", label: { en: "2 Samuel", ko: "사무엘하" } },
  { id: "1-kings", label: { en: "1 Kings", ko: "열왕기상" } },
  { id: "2-kings", label: { en: "2 Kings", ko: "열왕기하" } },
  { id: "ezra", label: { en: "Ezra", ko: "에스라" } },
  { id: "nehemiah", label: { en: "Nehemiah", ko: "느헤미야" } },
  { id: "isaiah", label: { en: "Isaiah", ko: "이사야" } },
  { id: "jeremiah", label: { en: "Jeremiah", ko: "예레미야" } },
  { id: "matthew", label: { en: "Matthew", ko: "마태복음" } },
  { id: "mark", label: { en: "Mark", ko: "마가복음" } },
  { id: "luke", label: { en: "Luke", ko: "누가복음" } },
  { id: "john", label: { en: "John", ko: "요한복음" } },
  { id: "acts", label: { en: "Acts", ko: "사도행전" } },
  { id: "psalms", label: { en: "Psalms", ko: "시편" } },
  { id: "romans", label: { en: "Romans", ko: "로마서" } },
  { id: "1-corinthians", label: { en: "1 Corinthians", ko: "고린도전서" } },
  { id: "galatians", label: { en: "Galatians", ko: "갈라디아서" } },
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
  { id: "revelation", label: { en: "Revelation", ko: "요한계시록" } },
];

export const timelinePlaces: TimelinePlace[] = [
  { id: "eden", label: { en: "Eden", ko: "에덴" } },
  { id: "ararat", label: { en: "Ararat", ko: "아라랏" } },
  { id: "shinar", label: { en: "Shinar", ko: "시날" } },
  { id: "ur", label: { en: "Ur", ko: "우르" } },
  { id: "canaan", label: { en: "Canaan", ko: "가나안" } },
  { id: "egypt", label: { en: "Egypt", ko: "애굽" } },
  { id: "sinai", label: { en: "Sinai", ko: "시내산" } },
  { id: "kadesh-barnea", label: { en: "Kadesh Barnea", ko: "가데스 바네아" } },
  { id: "jordan", label: { en: "Jordan", ko: "요단" } },
  { id: "jericho", label: { en: "Jericho", ko: "여리고" } },
  { id: "shiloh", label: { en: "Shiloh", ko: "실로" } },
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
    id: "exodus-passover",
    title: { en: "Passover", ko: "유월절" },
    summary: { en: "A sacrificial night prepares liberation.", ko: "희생의 밤이 해방을 준비합니다." },
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
      en: "The event unfolds in the land of Egypt.",
      ko: "사건은 애굽 땅에서 펼쳐집니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the exodus departure", ko: "출애굽 출발 이전" },
    eventType: { en: "Deliverance", ko: "구원" },
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
    sequenceLabel: { en: "After deliverance", ko: "구원 이후" },
    eventType: { en: "Covenant", ko: "언약" },
    reader: { book: "exodus", chapter: 19, verse: 1, translation: { en: "WEB", ko: "KRV" } },
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
    ],
    people: [{ en: "Joshua", ko: "여호수아" }],
    placeIds: ["jordan"],
    locationNote: {
      en: "The Jordan becomes the threshold of the land.",
      ko: "요단은 땅으로 들어가는 문턱이 됩니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before Jericho", ko: "여리고 이전" },
    eventType: { en: "Conquest", ko: "정복" },
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
    people: [{ en: "Joshua", ko: "여호수아" }, { en: "Rahab", ko: "라합" }],
    placeIds: ["jericho"],
    locationNote: {
      en: "Jericho is one of the most visible place markers in the preview.",
      ko: "여리고는 미리보기에서 가장 눈에 띄는 지명 표지 중 하나입니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Early in the conquest sequence", ko: "정복 초반" },
    eventType: { en: "Conquest", ko: "정복" },
    reader: { book: "joshua", chapter: 6, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "judges-summary",
    title: { en: "Judges Period Summary", ko: "사사 시대 요약" },
    summary: { en: "The cycle of decline and rescue becomes clear.", ko: "쇠퇴와 회복의 순환이 분명해집니다." },
    periodId: "conquest",
    primaryBookId: "judges",
    relatedBookIds: ["1-samuel"],
    scriptureAnchors: [
      createAnchor(
        { en: "Judges 2:6-23", ko: "사사기 2:6-23" },
        { book: "judges", chapter: 2, verse: 6, translation: { en: "WEB", ko: "KRV" } },
      ),
    ],
    people: [{ en: "The judges", ko: "사사들" }],
    placeIds: ["canaan", "shiloh"],
    locationNote: {
      en: "The land of Canaan is the broad setting, not one city alone.",
      ko: "가나안 땅이 넓은 배경이며 한 도시만의 사건은 아닙니다.",
    },
    datingNote: narrativeSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "Before the monarchy", ko: "왕정 이전" },
    eventType: { en: "Historical summary", ko: "역사 요약" },
    reader: { book: "judges", chapter: 2, verse: 6, translation: { en: "WEB", ko: "KRV" } },
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
    eventType: { en: "Covenant", ko: "언약" },
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
    eventType: { en: "Political fracture", ko: "정치적 분열" },
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
    reader: { book: "2-kings", chapter: 17, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "fall-of-jerusalem",
    title: { en: "Fall of Jerusalem", ko: "예루살렘 함락" },
    summary: { en: "The city falls and the temple burns.", ko: "도성이 함락되고 성전이 불탑니다." },
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
    people: [{ en: "Jeremiah", ko: "예레미야" }],
    placeIds: ["jerusalem", "babylon"],
    locationNote: {
      en: "Jerusalem is the site of loss before Babylon becomes the backdrop of exile.",
      ko: "예루살렘은 상실의 자리이고 바벨론은 포로의 배경이 됩니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "The exile begins", ko: "포로기가 시작됨" },
    eventType: { en: "Judgment / exile", ko: "심판 / 포로" },
    reader: { book: "2-kings", chapter: 25, verse: 1, translation: { en: "WEB", ko: "KRV" } },
  }),
  createEvent({
    id: "return-decree",
    title: { en: "Return Decree", ko: "귀환 칙령" },
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
    people: [{ en: "Cyrus", ko: "고레스" }],
    placeIds: ["babylon", "persia"],
    locationNote: {
      en: "The decree is issued from imperial power centers.",
      ko: "칙령은 제국 권력 중심에서 나옵니다.",
    },
    datingNote: approximateSequence,
    confidenceLevel: highConfidence,
    sequenceLabel: { en: "After the exile", ko: "포로기 이후" },
    eventType: { en: "Return", ko: "귀환" },
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
