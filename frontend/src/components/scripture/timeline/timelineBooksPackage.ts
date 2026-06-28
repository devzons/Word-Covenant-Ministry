import type {
  TimelineBookContextRow,
  TimelineReader,
  TimelineScriptureAnchor,
  TimelineText,
} from "./passionWeekTimeline";

export type CanonicalBooksPackage = {
  items: CanonicalBookSkeletonRow[];
};

export type CanonicalBookSkeletonRow = {
  id: string;
  bookId: string;
  canonicalOrder: number;
  testament: "OT" | "NT";
  canonicalSection: string;
  title: TimelineText;
  canonicalTitle: TimelineText;
  timelinePeriodId: string;
  sectionId: string;
  displayOrder: number;
  accordionGroup: string;
  authorLabel: TimelineText;
  authorshipBasisLabel: TimelineText;
  backgroundSettingLabel: TimelineText;
  backgroundBasisLabel: TimelineText;
  dateLabel: TimelineText;
  dateConfidenceLabel: TimelineText;
  scriptureAnchors: Array<{
    bookId: string;
    label: TimelineText;
    reference: string;
    scope: string;
  }>;
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  cautionNote: TimelineText;
  relatedEventIds: string[];
  relatedPlaceIds: string[];
  relatedKingdomIds: string[];
  relatedBookIds: string[];
  isSkeleton: true;
};

const canonicalSectionLabels: Record<string, TimelineText> = {
  Torah: { ko: "율법서", en: "Torah" },
  "Historical Books": { ko: "역사서", en: "Historical Books" },
  "Wisdom / Poetry": { ko: "시가서", en: "Wisdom / Poetry" },
  "Major Prophets": { ko: "대선지서", en: "Major Prophets" },
  "Minor Prophets": { ko: "소선지서", en: "Minor Prophets" },
  "Gospels / Acts": { ko: "복음서 / 사도행전", en: "Gospels / Acts" },
  "Pauline Epistles": { ko: "바울서신", en: "Pauline Epistles" },
  "General Epistles": { ko: "공동서신", en: "General Epistles" },
  Revelation: { ko: "계시록", en: "Revelation" },
};

function createBookScopeReader(bookId: string): TimelineReader {
  return {
    book: bookId,
    chapter: 1,
    verse: 1,
    translation: { en: "WEB", ko: "KRV" },
  };
}

function createBookScopeAnchor(
  anchor: CanonicalBookSkeletonRow["scriptureAnchors"][number],
): TimelineScriptureAnchor {
  return {
    label: anchor.label,
    reader: createBookScopeReader(anchor.bookId),
  };
}

function getCanonicalSectionLabel(section: string): TimelineText {
  return canonicalSectionLabels[section] ?? { ko: section, en: section };
}

function createCanonicalLocationLabel(row: CanonicalBookSkeletonRow): TimelineText {
  const sectionLabel = getCanonicalSectionLabel(row.canonicalSection);
  return {
    ko: `정경 순서 ${row.canonicalOrder} · ${row.testament === "OT" ? "구약" : "신약"} · ${sectionLabel.ko}`,
    en: `Canonical Order ${row.canonicalOrder} · ${row.testament} · ${sectionLabel.en}`,
  };
}

export function normalizeCanonicalBooksPackage(
  canonicalBooksPackage: CanonicalBooksPackage,
): TimelineBookContextRow[] {
  return canonicalBooksPackage.items
    .map((row) => ({
      accordionGroup: row.accordionGroup,
      authorshipBasisLabel: row.authorshipBasisLabel,
      authorshipLabel: row.authorLabel,
      backgroundBasisLabel: row.backgroundBasisLabel,
      bookId: row.bookId,
      canonicalLocation: createCanonicalLocationLabel(row),
      canonicalOrder: row.canonicalOrder,
      canonicalSection: row.canonicalSection,
      canonicalSectionLabel: getCanonicalSectionLabel(row.canonicalSection),
      confidenceLabel: row.confidenceLabel,
      basisLabel: row.basisLabel,
      dateConfidenceLabel: row.dateConfidenceLabel,
      dateLabel: row.dateLabel,
      displayOrder: row.displayOrder,
      historicalSettingLabel: row.backgroundSettingLabel,
      id: row.id,
      isSkeleton: row.isSkeleton,
      note: row.cautionNote,
      periodId: row.timelinePeriodId,
      relatedKingdomIds: row.relatedKingdomIds,
      relatedBookIds: row.relatedBookIds,
      relatedEventIds: row.relatedEventIds,
      relatedKingdoms: [],
      relatedPlaces: row.relatedPlaceIds,
      scriptureAnchors: row.scriptureAnchors.map(createBookScopeAnchor),
      scriptureReferencesOnly: true,
      sectionId: row.sectionId,
      sourcePackage: "canonical-66-skeleton" as const,
      testament: row.testament,
      title: row.title,
    }))
    .sort((left, right) => left.canonicalOrder! - right.canonicalOrder!);
}

export function getCanonicalBookPreviewStats(rows: TimelineBookContextRow[]) {
  return {
    newTestamentCount: rows.filter((row) => row.testament === "NT").length,
    oldTestamentCount: rows.filter((row) => row.testament === "OT").length,
    totalCount: rows.length,
  };
}
