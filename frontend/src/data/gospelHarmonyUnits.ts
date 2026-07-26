export type GospelHarmonyBook = "matthew" | "mark" | "luke" | "john";

export type GospelHarmonyKind = "parable" | "eschatology" | "event" | "figurative";

export type GospelHarmonySection =
  | "ministry-start"
  | "kingdom"
  | "grace-repentance-forgiveness"
  | "discipleship-obedience"
  | "prayer-faith"
  | "stewardship-wealth"
  | "israel-leaders"
  | "eschatology"
  | "figurative";

export type GospelHarmonyView = "all" | "parables" | "eschatology" | "events" | "figurative";

export type GospelHarmonyPassage = {
  book: GospelHarmonyBook;
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse?: number;
};

export type GospelHarmonyUnit = {
  id: string;
  sequence: number;
  title: { ko: string; en: string };
  category: { ko: string; en: string };
  kinds: GospelHarmonyKind[];
  section: GospelHarmonySection;
  passages: Partial<Record<GospelHarmonyBook, GospelHarmonyPassage>>;
};

type GospelHarmonyUnitDefinition = Omit<GospelHarmonyUnit, "category" | "sequence">;

export const gospelHarmonyBooks: GospelHarmonyBook[] = [
  "matthew",
  "mark",
  "luke",
  "john",
];

export const gospelHarmonyViewOrder: GospelHarmonyView[] = [
  "all",
  "parables",
  "eschatology",
  "events",
  "figurative",
];

export const gospelHarmonyViewLabels: Record<
  GospelHarmonyView,
  { en: string; ko: string }
> = {
  all: { en: "All", ko: "전체" },
  parables: { en: "Parables", ko: "비유" },
  eschatology: { en: "End Times", ko: "종말" },
  events: { en: "Events", ko: "사건" },
  figurative: { en: "Figurative Teachings", ko: "표상 말씀" },
};

export const gospelHarmonyKindLabels: Record<
  GospelHarmonyKind,
  { en: string; ko: string }
> = {
  parable: { en: "Parable", ko: "비유" },
  eschatology: { en: "End Times", ko: "종말" },
  event: { en: "Event", ko: "사건" },
  figurative: { en: "Figurative Teaching", ko: "표상 말씀" },
};

export const gospelHarmonySectionLabels: Record<
  GospelHarmonySection,
  { en: string; ko: string }
> = {
  "ministry-start": { en: "Beginning of Ministry", ko: "사역의 시작" },
  kingdom: { en: "Kingdom of God", ko: "하나님 나라" },
  "grace-repentance-forgiveness": {
    en: "Grace, Repentance, and Forgiveness",
    ko: "은혜·회개·용서",
  },
  "discipleship-obedience": {
    en: "Discipleship and Obedience",
    ko: "제자도와 순종",
  },
  "prayer-faith": { en: "Prayer and Faith", ko: "기도와 믿음" },
  "stewardship-wealth": { en: "Stewardship and Wealth", ko: "청지기와 재물" },
  "israel-leaders": { en: "Israel and Its Leaders", ko: "이스라엘과 지도자" },
  eschatology: { en: "End Times, Return, and Judgment", ko: "종말·재림·심판" },
  figurative: { en: "Johannine Figurative Teachings", ko: "요한복음 표상 말씀" },
};

export const gospelHarmonyBookLabels: Record<
  GospelHarmonyBook,
  { en: string; ko: string }
> = {
  matthew: { en: "Matthew", ko: "마태복음" },
  mark: { en: "Mark", ko: "마가복음" },
  luke: { en: "Luke", ko: "누가복음" },
  john: { en: "John", ko: "요한복음" },
};

export const gospelHarmonyScopeLabels = {
  four: { en: "4 Gospels", ko: "4복음서" },
  three: { en: "3 Gospels", ko: "3복음서" },
  two: { en: "2 Gospels", ko: "2복음서" },
  single: {
    matthew: {
      badge: { en: "Matthew Only", ko: "마태 단독" },
      detail: { en: "Unique to Matthew", ko: "마태복음의 고유 기록" },
    },
    mark: {
      badge: { en: "Mark Only", ko: "마가 단독" },
      detail: { en: "Unique to Mark", ko: "마가복음의 고유 기록" },
    },
    luke: {
      badge: { en: "Luke Only", ko: "누가 단독" },
      detail: { en: "Unique to Luke", ko: "누가복음의 고유 기록" },
    },
    john: {
      badge: { en: "John Only", ko: "요한 단독" },
      detail: { en: "Unique to John", ko: "요한복음의 고유 기록" },
    },
  },
} as const;

export const gospelHarmonyUnitAliases: Record<string, string> = {
  "baptism-of-jesus": "jesus-baptism",
  "feeding-5000": "feeding-five-thousand",
};

function passage(
  book: GospelHarmonyBook,
  startChapter: number,
  startVerse: number,
  endVerse?: number,
  endChapter?: number,
): GospelHarmonyPassage {
  return {
    book,
    startChapter,
    startVerse,
    ...(endChapter ? { endChapter } : {}),
    ...(endVerse ? { endVerse } : {}),
  };
}

function unit(definition: GospelHarmonyUnitDefinition): GospelHarmonyUnitDefinition {
  return definition;
}

const unitDefinitions: GospelHarmonyUnitDefinition[] = [
  unit({
    id: "jesus-baptism",
    title: { ko: "예수님의 세례", en: "Baptism of Jesus" },
    kinds: ["event"],
    section: "ministry-start",
    passages: {
      matthew: passage("matthew", 3, 13, 17),
      mark: passage("mark", 1, 9, 11),
      luke: passage("luke", 3, 21, 22),
    },
  }),
  unit({
    id: "wilderness-temptation",
    title: { ko: "광야 시험", en: "Temptation in the Wilderness" },
    kinds: ["event"],
    section: "ministry-start",
    passages: {
      matthew: passage("matthew", 4, 1, 11),
      mark: passage("mark", 1, 12, 13),
      luke: passage("luke", 4, 1, 13),
    },
  }),
  unit({
    id: "calling-four-disciples",
    title: { ko: "네 제자 부르심", en: "Calling of Four Disciples" },
    kinds: ["event"],
    section: "ministry-start",
    passages: {
      matthew: passage("matthew", 4, 18, 22),
      mark: passage("mark", 1, 16, 20),
      luke: passage("luke", 5, 1, 11),
    },
  }),
  unit({
    id: "feeding-five-thousand",
    title: { ko: "오병이어", en: "Feeding the Five Thousand" },
    kinds: ["event"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 14, 13, 21),
      mark: passage("mark", 6, 30, 44),
      luke: passage("luke", 9, 10, 17),
      john: passage("john", 6, 1, 14),
    },
  }),
  unit({
    id: "transfiguration",
    title: { ko: "변화산", en: "Transfiguration" },
    kinds: ["event"],
    section: "ministry-start",
    passages: {
      matthew: passage("matthew", 17, 1, 8),
      mark: passage("mark", 9, 2, 8),
      luke: passage("luke", 9, 28, 36),
    },
  }),
  unit({
    id: "gethsemane",
    title: { ko: "겟세마네", en: "Gethsemane" },
    kinds: ["event"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 26, 36, 46),
      mark: passage("mark", 14, 32, 42),
      luke: passage("luke", 22, 39, 46),
    },
  }),
  unit({
    id: "crucifixion",
    title: { ko: "십자가", en: "Crucifixion" },
    kinds: ["event"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 27, 32, 56),
      mark: passage("mark", 15, 21, 41),
      luke: passage("luke", 23, 26, 49),
      john: passage("john", 19, 16, 37),
    },
  }),

  unit({
    id: "lamp-on-stand",
    title: { ko: "등불", en: "Lamp on a Stand" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      matthew: passage("matthew", 5, 14, 16),
      mark: passage("mark", 4, 21, 25),
      luke: passage("luke", 8, 16, 18),
    },
  }),
  unit({
    id: "wise-and-foolish-builders",
    title: { ko: "반석과 모래 위에 지은 집", en: "Wise and Foolish Builders" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      matthew: passage("matthew", 7, 24, 27),
      luke: passage("luke", 6, 47, 49),
    },
  }),
  unit({
    id: "children-in-marketplace",
    title: { ko: "장터의 아이들", en: "Children in the Marketplace" },
    kinds: ["parable"],
    section: "israel-leaders",
    passages: {
      matthew: passage("matthew", 11, 16, 19),
      luke: passage("luke", 7, 31, 35),
    },
  }),
  unit({
    id: "new-cloth",
    title: { ko: "새 천 조각", en: "New Cloth on an Old Garment" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      matthew: passage("matthew", 9, 16, 16),
      mark: passage("mark", 2, 21, 21),
      luke: passage("luke", 5, 36, 36),
    },
  }),
  unit({
    id: "new-wine-and-wineskins",
    title: { ko: "새 포도주와 새 부대", en: "New Wine and New Wineskins" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      matthew: passage("matthew", 9, 17, 17),
      mark: passage("mark", 2, 22, 22),
      luke: passage("luke", 5, 37, 39),
    },
  }),
  unit({
    id: "two-debtors",
    title: { ko: "두 빚진 자", en: "Two Debtors" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 7, 41, 43),
    },
  }),
  unit({
    id: "parable-of-sower",
    title: { ko: "씨 뿌리는 자", en: "Parable of the Sower" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 1, 23),
      mark: passage("mark", 4, 1, 20),
      luke: passage("luke", 8, 4, 15),
    },
  }),
  unit({
    id: "growing-seed",
    title: { ko: "저절로 자라는 씨", en: "Growing Seed" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      mark: passage("mark", 4, 26, 29),
    },
  }),
  unit({
    id: "wheat-and-weeds",
    title: { ko: "곡식과 가라지", en: "Wheat and Weeds" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 24, 30),
    },
  }),
  unit({
    id: "mustard-seed",
    title: { ko: "겨자씨", en: "Mustard Seed" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 31, 32),
      mark: passage("mark", 4, 30, 32),
      luke: passage("luke", 13, 18, 19),
    },
  }),
  unit({
    id: "leaven",
    title: { ko: "누룩", en: "Leaven" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 33, 33),
      luke: passage("luke", 13, 20, 21),
    },
  }),
  unit({
    id: "hidden-treasure",
    title: { ko: "감추인 보화", en: "Hidden Treasure" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 44, 44),
    },
  }),
  unit({
    id: "pearl-of-great-price",
    title: { ko: "값진 진주", en: "Pearl of Great Value" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 45, 46),
    },
  }),
  unit({
    id: "dragnet",
    title: { ko: "그물", en: "Dragnet" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 47, 50),
    },
  }),
  unit({
    id: "new-and-old-treasures",
    title: { ko: "새것과 옛것을 내어오는 집주인", en: "Householder Bringing Out New and Old" },
    kinds: ["parable"],
    section: "kingdom",
    passages: {
      matthew: passage("matthew", 13, 52, 52),
    },
  }),
  unit({
    id: "binding-the-strong-man",
    title: { ko: "강한 자를 결박함", en: "Binding the Strong Man" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      matthew: passage("matthew", 12, 29, 29),
      mark: passage("mark", 3, 27, 27),
      luke: passage("luke", 11, 21, 22),
    },
  }),
  unit({
    id: "unforgiving-servant",
    title: { ko: "용서하지 않은 종", en: "Unforgiving Servant" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      matthew: passage("matthew", 18, 23, 35),
    },
  }),
  unit({
    id: "good-samaritan",
    title: { ko: "선한 사마리아인", en: "Good Samaritan" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 10, 30, 37),
    },
  }),
  unit({
    id: "friend-at-midnight",
    title: { ko: "한밤중에 찾아온 친구", en: "Friend at Midnight" },
    kinds: ["parable"],
    section: "prayer-faith",
    passages: {
      luke: passage("luke", 11, 5, 8),
    },
  }),
  unit({
    id: "rich-fool",
    title: { ko: "어리석은 부자", en: "Rich Fool" },
    kinds: ["parable"],
    section: "stewardship-wealth",
    passages: {
      luke: passage("luke", 12, 16, 21),
    },
  }),
  unit({
    id: "watchful-servants",
    title: { ko: "깨어 기다리는 종들", en: "Watchful Servants" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      luke: passage("luke", 12, 35, 38),
    },
  }),
  unit({
    id: "faithful-and-wise-servant",
    title: { ko: "충성되고 지혜로운 종", en: "Faithful and Wise Servant" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 45, 51),
      luke: passage("luke", 12, 42, 48),
    },
  }),
  unit({
    id: "barren-fig-tree",
    title: { ko: "열매 없는 무화과나무", en: "Barren Fig Tree" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 13, 6, 9),
    },
  }),
  unit({
    id: "lowest-place-at-feast",
    title: { ko: "잔치의 낮은 자리", en: "Lowest Place at the Feast" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      luke: passage("luke", 14, 7, 11),
    },
  }),
  unit({
    id: "great-banquet",
    title: { ko: "큰 잔치", en: "Great Banquet" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 14, 16, 24),
    },
  }),
  unit({
    id: "tower-builder",
    title: { ko: "망대를 세우는 사람", en: "Tower Builder" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      luke: passage("luke", 14, 28, 30),
    },
  }),
  unit({
    id: "warring-king",
    title: { ko: "전쟁을 앞둔 왕", en: "King Going to War" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      luke: passage("luke", 14, 31, 32),
    },
  }),
  unit({
    id: "lost-sheep",
    title: { ko: "잃은 양", en: "Lost Sheep" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      matthew: passage("matthew", 18, 12, 14),
      luke: passage("luke", 15, 3, 7),
    },
  }),
  unit({
    id: "lost-coin",
    title: { ko: "잃은 드라크마", en: "Lost Coin" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 15, 8, 10),
    },
  }),
  unit({
    id: "prodigal-son",
    title: { ko: "잃은 아들", en: "Prodigal Son" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 15, 11, 32),
    },
  }),
  unit({
    id: "dishonest-manager",
    title: { ko: "불의한 청지기", en: "Dishonest Manager" },
    kinds: ["parable"],
    section: "stewardship-wealth",
    passages: {
      luke: passage("luke", 16, 1, 13),
    },
  }),
  unit({
    id: "rich-man-and-lazarus",
    title: { ko: "부자와 나사로", en: "Rich Man and Lazarus" },
    kinds: ["parable"],
    section: "stewardship-wealth",
    passages: {
      luke: passage("luke", 16, 19, 31),
    },
  }),
  unit({
    id: "unworthy-servants",
    title: { ko: "무익한 종", en: "Unworthy Servants" },
    kinds: ["parable"],
    section: "discipleship-obedience",
    passages: {
      luke: passage("luke", 17, 7, 10),
    },
  }),
  unit({
    id: "persistent-widow",
    title: { ko: "불의한 재판장과 과부", en: "Persistent Widow" },
    kinds: ["parable"],
    section: "prayer-faith",
    passages: {
      luke: passage("luke", 18, 1, 8),
    },
  }),
  unit({
    id: "pharisee-and-tax-collector",
    title: { ko: "바리새인과 세리", en: "Pharisee and Tax Collector" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      luke: passage("luke", 18, 9, 14),
    },
  }),
  unit({
    id: "workers-in-vineyard",
    title: { ko: "포도원 품꾼", en: "Workers in the Vineyard" },
    kinds: ["parable"],
    section: "grace-repentance-forgiveness",
    passages: {
      matthew: passage("matthew", 20, 1, 16),
    },
  }),
  unit({
    id: "ten-minas",
    title: { ko: "열 므나", en: "Ten Minas" },
    kinds: ["parable"],
    section: "stewardship-wealth",
    passages: {
      luke: passage("luke", 19, 11, 27),
    },
  }),
  unit({
    id: "two-sons",
    title: { ko: "두 아들", en: "Two Sons" },
    kinds: ["parable"],
    section: "israel-leaders",
    passages: {
      matthew: passage("matthew", 21, 28, 32),
    },
  }),
  unit({
    id: "wicked-tenants",
    title: { ko: "악한 포도원 농부", en: "Wicked Tenants" },
    kinds: ["parable"],
    section: "israel-leaders",
    passages: {
      matthew: passage("matthew", 21, 33, 46),
      mark: passage("mark", 12, 1, 12),
      luke: passage("luke", 20, 9, 19),
    },
  }),
  unit({
    id: "wedding-banquet",
    title: { ko: "혼인 잔치", en: "Wedding Banquet" },
    kinds: ["parable"],
    section: "israel-leaders",
    passages: {
      matthew: passage("matthew", 22, 1, 14),
    },
  }),
  unit({
    id: "budding-fig-tree",
    title: { ko: "싹이 나는 무화과나무", en: "Budding Fig Tree" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 32, 35),
      mark: passage("mark", 13, 28, 31),
      luke: passage("luke", 21, 29, 33),
    },
  }),
  unit({
    id: "householder-against-thief",
    title: { ko: "도둑을 대비하는 집주인", en: "Householder Against the Thief" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 43, 44),
      luke: passage("luke", 12, 39, 40),
    },
  }),
  unit({
    id: "watchful-doorkeeper",
    title: { ko: "깨어 있는 문지기", en: "Watchful Doorkeeper" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      mark: passage("mark", 13, 34, 37),
    },
  }),
  unit({
    id: "ten-virgins",
    title: { ko: "열 처녀", en: "Ten Virgins" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 25, 1, 13),
    },
  }),
  unit({
    id: "talents",
    title: { ko: "달란트", en: "Talents" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 25, 14, 30),
    },
  }),
  unit({
    id: "sheep-and-goats",
    title: { ko: "양과 염소", en: "Sheep and the Goats" },
    kinds: ["parable", "eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 25, 31, 46),
    },
  }),

  unit({
    id: "olivet-discourse",
    title: { ko: "감람산 강화", en: "Olivet Discourse" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 3, 14),
      mark: passage("mark", 13, 3, 13),
      luke: passage("luke", 21, 7, 19),
    },
  }),
  unit({
    id: "temple-destruction-foretold",
    title: { ko: "성전 파괴 예고", en: "Temple Destruction Foretold" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 1, 2),
      mark: passage("mark", 13, 1, 2),
      luke: passage("luke", 21, 5, 6),
    },
  }),
  unit({
    id: "signs-of-the-end",
    title: { ko: "종말의 징조", en: "Signs of the End" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 4, 14),
      mark: passage("mark", 13, 5, 13),
      luke: passage("luke", 21, 8, 19),
    },
  }),
  unit({
    id: "abomination-and-great-tribulation",
    title: { ko: "멸망의 가증한 것과 큰 환난", en: "Abomination and Great Tribulation" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 15, 28),
      mark: passage("mark", 13, 14, 23),
      luke: passage("luke", 21, 20, 24),
    },
  }),
  unit({
    id: "coming-of-son-of-man",
    title: { ko: "인자의 오심", en: "Coming of the Son of Man" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 29, 31),
      mark: passage("mark", 13, 24, 27),
      luke: passage("luke", 21, 25, 28),
    },
  }),
  unit({
    id: "gathering-of-elect",
    title: { ko: "택하신 자들의 모임", en: "Gathering of the Elect" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 31, 31),
      mark: passage("mark", 13, 27, 27),
    },
  }),
  unit({
    id: "day-and-hour-unknown",
    title: { ko: "그 날과 그 때를 알지 못함", en: "No One Knows the Day or Hour" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 36, 44),
      mark: passage("mark", 13, 32, 37),
    },
  }),
  unit({
    id: "days-of-noah",
    title: { ko: "노아의 때", en: "Days of Noah" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      matthew: passage("matthew", 24, 37, 39),
      luke: passage("luke", 17, 26, 27),
    },
  }),
  unit({
    id: "stay-awake",
    title: { ko: "깨어 있음", en: "Stay Awake" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      mark: passage("mark", 13, 33, 33),
      luke: passage("luke", 21, 34, 36),
    },
  }),
  unit({
    id: "narrow-door-and-kingdom-banquet",
    title: { ko: "좁은 문과 하나님 나라의 잔치", en: "Narrow Door and the Kingdom Banquet" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      luke: passage("luke", 13, 22, 30),
    },
  }),
  unit({
    id: "resurrection-to-life-and-judgment",
    title: { ko: "생명의 부활과 심판의 부활", en: "Resurrection to Life and Judgment" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      john: passage("john", 5, 24, 29),
    },
  }),
  unit({
    id: "raised-on-the-last-day",
    title: { ko: "마지막 날에 다시 살리심", en: "Raised Up on the Last Day" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      john: passage("john", 6, 39, 40),
    },
  }),
  unit({
    id: "resurrection-and-life",
    title: { ko: "부활이요 생명", en: "Resurrection and the Life" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      john: passage("john", 11, 23, 27),
    },
  }),
  unit({
    id: "judgment-of-this-world",
    title: { ko: "세상의 심판", en: "Judgment of This World" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      john: passage("john", 12, 27, 33),
    },
  }),
  unit({
    id: "fathers-house-and-coming-again",
    title: { ko: "아버지의 집과 다시 오심", en: "Father's House and His Return" },
    kinds: ["eschatology"],
    section: "eschatology",
    passages: {
      john: passage("john", 14, 1, 3),
    },
  }),

  unit({
    id: "bread-of-life",
    title: { ko: "생명의 떡", en: "Bread of Life" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 6, 32, 58),
    },
  }),
  unit({
    id: "light-of-the-world",
    title: { ko: "세상의 빛", en: "Light of the World" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 8, 12, 20),
    },
  }),
  unit({
    id: "door-of-the-sheep",
    title: { ko: "양의 문", en: "Door of the Sheep" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 10, 1, 10),
    },
  }),
  unit({
    id: "good-shepherd",
    title: { ko: "선한 목자", en: "Good Shepherd" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 10, 11, 18),
    },
  }),
  unit({
    id: "grain-of-wheat",
    title: { ko: "한 알의 밀", en: "Grain of Wheat" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 12, 23, 26),
    },
  }),
  unit({
    id: "true-vine",
    title: { ko: "참포도나무", en: "True Vine" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 15, 1, 11),
    },
  }),
  unit({
    id: "sorrow-into-joy",
    title: { ko: "해산하는 여인의 근심과 기쁨", en: "Sorrow into Joy Like a Woman in Labor" },
    kinds: ["figurative"],
    section: "figurative",
    passages: {
      john: passage("john", 16, 20, 22),
    },
  }),
];

export const gospelHarmonyUnits: GospelHarmonyUnit[] = unitDefinitions.map(
  (definition, index) => ({
    ...definition,
    category: gospelHarmonySectionLabels[definition.section],
    sequence: index + 1,
  }),
);

export const gospelHarmonyCounts = {
  total: gospelHarmonyUnits.length,
  parables: gospelHarmonyUnits.filter((unit) => unit.kinds.includes("parable")).length,
  eschatology: gospelHarmonyUnits.filter((unit) => unit.kinds.includes("eschatology")).length,
  events: gospelHarmonyUnits.filter((unit) => unit.kinds.includes("event")).length,
  figurative: gospelHarmonyUnits.filter((unit) => unit.kinds.includes("figurative")).length,
  singleGospel: gospelHarmonyUnits.filter((unit) => getGospelHarmonyRecordCount(unit) === 1)
    .length,
};

export function resolveGospelHarmonyView(value: string | null): GospelHarmonyView | null {
  if (!value) {
    return "all";
  }

  return gospelHarmonyViewOrder.includes(value as GospelHarmonyView)
    ? (value as GospelHarmonyView)
    : null;
}

export function resolveGospelHarmonyUnitId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalizedValue = gospelHarmonyUnitAliases[value] ?? value;

  return gospelHarmonyUnits.some((unit) => unit.id === normalizedValue) ? normalizedValue : null;
}

export function getGospelHarmonyRecordBooks(unit: GospelHarmonyUnit): GospelHarmonyBook[] {
  return gospelHarmonyBooks.filter((book) => Boolean(unit.passages[book]));
}

export function getGospelHarmonyRecordCount(unit: GospelHarmonyUnit): number {
  return getGospelHarmonyRecordBooks(unit).length;
}

function validateGospelHarmonyUnits() {
  const ids = new Set<string>();
  const sequences = new Set<number>();

  for (const unit of gospelHarmonyUnits) {
    if (ids.has(unit.id)) {
      throw new Error(`Duplicate Gospel Harmony unit id: ${unit.id}`);
    }

    if (sequences.has(unit.sequence)) {
      throw new Error(`Duplicate Gospel Harmony sequence: ${unit.sequence}`);
    }

    ids.add(unit.id);
    sequences.add(unit.sequence);

    const passageEntries = Object.entries(unit.passages) as [
      GospelHarmonyBook,
      GospelHarmonyPassage | undefined,
    ][];

    if (passageEntries.filter(([, passageEntry]) => Boolean(passageEntry)).length === 0) {
      throw new Error(`Gospel Harmony unit has no passages: ${unit.id}`);
    }

    for (const [book, passageEntry] of passageEntries) {
      if (!passageEntry) {
        continue;
      }

      if (passageEntry.book !== book) {
        throw new Error(`Passage book mismatch for ${unit.id}:${book}`);
      }

      if (
        passageEntry.startChapter < 1 ||
        passageEntry.startVerse < 1 ||
        (passageEntry.endChapter !== undefined && passageEntry.endChapter < 1) ||
        (passageEntry.endVerse !== undefined && passageEntry.endVerse < 1)
      ) {
        throw new Error(`Invalid passage bounds for ${unit.id}:${book}`);
      }

      const endChapter = passageEntry.endChapter ?? passageEntry.startChapter;
      const endVerse = passageEntry.endVerse ?? passageEntry.startVerse;

      if (endChapter < passageEntry.startChapter) {
        throw new Error(`End chapter before start chapter for ${unit.id}:${book}`);
      }

      if (endChapter === passageEntry.startChapter && endVerse < passageEntry.startVerse) {
        throw new Error(`End verse before start verse for ${unit.id}:${book}`);
      }
    }
  }

  if (gospelHarmonyCounts.parables !== 46) {
    throw new Error(
      `Expected 46 Gospel Harmony parables, received ${gospelHarmonyCounts.parables}`,
    );
  }
}

validateGospelHarmonyUnits();
