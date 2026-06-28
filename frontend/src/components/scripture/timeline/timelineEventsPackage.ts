import type { TimelineEvent, TimelineReader, TimelineScriptureAnchor, TimelineText } from "./passionWeekTimeline";

export type CoreBiblicalEventsPackage = {
  items: CoreBiblicalEventSkeletonRow[];
};

type CoreBiblicalEventSkeletonRow = {
  id: string;
  eventId: string;
  recordType: "event";
  title: TimelineText;
  summary: TimelineText;
  sequence: number;
  timelinePeriodId: string;
  sectionId: string;
  displayOrder: number;
  accordionGroup: string;
  periodLabel: TimelineText;
  scriptureAnchors: Array<{
    bookId: string;
    label: TimelineText;
    reference: string;
    scope: string;
  }>;
  relatedBookIds: string[];
  relatedPlaceIds: string[];
  relatedKingdomIds: string[];
  relatedPeopleLabels: TimelineText[];
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  dateLabel: TimelineText;
  dateBasisLabel: TimelineText;
  dateConfidenceLabel: TimelineText;
  cautionNote: TimelineText;
  relatedEventIds: string[];
  reviewRequired: boolean;
  isSkeleton: true;
};

function createReferenceReader(bookId: string): TimelineReader {
  return {
    book: bookId,
    chapter: 1,
    verse: 1,
    translation: { en: "WEB", ko: "KRV" },
  };
}

function createReferenceAnchor(
  anchor: CoreBiblicalEventSkeletonRow["scriptureAnchors"][number],
): TimelineScriptureAnchor {
  return {
    label: anchor.label,
    reader: createReferenceReader(anchor.bookId),
  };
}

function createEventSummary(row: CoreBiblicalEventSkeletonRow): TimelineText {
  return row.summary;
}

function createLocationNote(): TimelineText {
  return {
    ko: "이 package는 성경 본문을 저장하지 않습니다. Scripture reference만 표시합니다.",
    en: "This package does not store Bible text. It shows Scripture references only.",
  };
}

function createDatingNote(row: CoreBiblicalEventSkeletonRow): TimelineText {
  return row.cautionNote;
}

function createSequenceLabel(sequence: number): TimelineText {
  return {
    ko: `핵심 순서 ${sequence}`,
    en: `Core sequence ${sequence}`,
  };
}

function createEventType(): TimelineText {
  return {
    ko: "핵심 사건 skeleton",
    en: "Core event skeleton",
  };
}

export function normalizeCoreBiblicalEventsPackage(
  coreEventsPackage: CoreBiblicalEventsPackage,
): TimelineEvent[] {
  return coreEventsPackage.items
    .map((row) => ({
      accordionGroup: row.accordionGroup,
      basisLabel: row.basisLabel,
      cautionNote: row.cautionNote,
      confidenceLevel: row.confidenceLabel,
      dateBasisLabel: row.dateBasisLabel,
      dateConfidenceLabel: row.dateConfidenceLabel,
      dateLabel: row.dateLabel,
      datingNote: createDatingNote(row),
      displayOrder: row.displayOrder,
      eventType: createEventType(),
      id: row.id,
      isSkeleton: row.isSkeleton,
      locationNote: createLocationNote(),
      periodId: row.timelinePeriodId,
      periodLabel: row.periodLabel,
      placeIds: row.relatedPlaceIds,
      people: row.relatedPeopleLabels,
      primaryBookId: row.relatedBookIds[0] ?? row.scriptureAnchors[0]?.bookId ?? "genesis",
      reader: createReferenceReader(row.scriptureAnchors[0]?.bookId ?? "genesis"),
      relatedBookIds: row.relatedBookIds,
      relatedEventIds: row.relatedEventIds,
      relatedKingdomIds: row.relatedKingdomIds,
      reviewRequired: row.reviewRequired,
      scriptureAnchors: row.scriptureAnchors.map(createReferenceAnchor),
      scriptureReferencesOnly: true,
      sectionId: row.sectionId,
      sequenceLabel: createSequenceLabel(row.sequence),
      sequenceNumber: row.sequence,
      sourcePackage: "core-biblical-skeleton" as const,
      summary: createEventSummary(row),
      title: row.title,
    }))
    .sort((left, right) => {
      if ((left.sequenceNumber ?? 0) !== (right.sequenceNumber ?? 0)) {
        return (left.sequenceNumber ?? 0) - (right.sequenceNumber ?? 0);
      }

      return (left.displayOrder ?? 0) - (right.displayOrder ?? 0);
    });
}

export function getCoreEventPreviewStats(rows: TimelineEvent[]) {
  return {
    totalCount: rows.length,
  };
}
