import type { TimelineReader, TimelineScriptureAnchor, TimelineText } from "./passionWeekTimeline";

export type KingsKingdomsPackage = {
  items: KingsKingdomsSkeletonRow[];
};

type KingsKingdomsAnchor = {
  bookId: string;
  label: TimelineText;
  reference: string;
  scope: string;
};

type KingsKingdomsSkeletonRow = {
  id: string;
  recordType:
    | "kingdomPeriod"
    | "kingdom"
    | "king"
    | "transition"
    | "exileMarker"
    | "templeMarker"
    | "propheticContextMarker";
  title: TimelineText;
  displayOrder: number;
  timelinePeriodId: string;
  sectionId: string;
  accordionGroup: string;
  scriptureAnchors: KingsKingdomsAnchor[];
  relatedBookIds: string[];
  confidence: string;
  reviewRequired: boolean;
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  cautionNote: TimelineText;
  kingdomId?: string;
  kingdomName?: TimelineText;
  reignLabel?: TimelineText;
  approximateDateLabel?: TimelineText;
  predecessorId?: string;
  successorId?: string;
  relatedTransitionIds?: string[];
  relatedKingIds?: string[];
  relatedKingdomIds?: string[];
  relatedPeriodIds?: string[];
  previousStateId?: string;
  nextStateId?: string;
  periodType?: string;
  scope?: TimelineText;
  startAnchor?: KingsKingdomsAnchor;
  endAnchor?: KingsKingdomsAnchor;
};

export type TimelineKingsKingdomsPreviewRow = {
  id: string;
  recordType: KingsKingdomsSkeletonRow["recordType"];
  title: TimelineText;
  displayOrder: number;
  timelinePeriodId: string;
  sectionId: string;
  accordionGroup: string;
  scriptureAnchors: TimelineScriptureAnchor[];
  relatedBookIds: string[];
  confidence: string;
  reviewRequired: boolean;
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  cautionNote: TimelineText;
  kingdomId?: string;
  kingdomName?: TimelineText;
  reignLabel?: TimelineText;
  approximateDateLabel?: TimelineText;
  predecessorId?: string;
  successorId?: string;
  relatedTransitionIds?: string[];
  relatedKingIds?: string[];
  relatedKingdomIds?: string[];
  relatedPeriodIds?: string[];
  previousStateId?: string;
  nextStateId?: string;
  periodType?: string;
  scope?: TimelineText;
  startAnchor?: TimelineScriptureAnchor;
  endAnchor?: TimelineScriptureAnchor;
  sourcePackage: "kings-kingdoms-skeleton";
  scriptureReferencesOnly: true;
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

function createReferenceAnchor(anchor: KingsKingdomsAnchor): TimelineScriptureAnchor {
  return {
    label: anchor.label,
    reader: createReferenceReader(anchor.bookId),
  };
}

export function normalizeKingsKingdomsPackage(
  kingsPackage: KingsKingdomsPackage,
): TimelineKingsKingdomsPreviewRow[] {
  return kingsPackage.items
    .map((row) => ({
      accordionGroup: row.accordionGroup,
      approximateDateLabel: row.approximateDateLabel,
      basisLabel: row.basisLabel,
      cautionNote: row.cautionNote,
      confidence: row.confidence,
      confidenceLabel: row.confidenceLabel,
      displayOrder: row.displayOrder,
      endAnchor: row.endAnchor ? createReferenceAnchor(row.endAnchor) : undefined,
      id: row.id,
      isSkeleton: true as const,
      kingdomId: row.kingdomId,
      kingdomName: row.kingdomName,
      nextStateId: row.nextStateId,
      periodType: row.periodType,
      predecessorId: row.predecessorId,
      previousStateId: row.previousStateId,
      recordType: row.recordType,
      reignLabel: row.reignLabel,
      relatedBookIds: row.relatedBookIds,
      relatedKingIds: row.relatedKingIds,
      relatedKingdomIds: row.relatedKingdomIds,
      relatedPeriodIds: row.relatedPeriodIds,
      relatedTransitionIds: row.relatedTransitionIds,
      reviewRequired: row.reviewRequired,
      scope: row.scope,
      scriptureAnchors: row.scriptureAnchors.map(createReferenceAnchor),
      scriptureReferencesOnly: true as const,
      sectionId: row.sectionId,
      sourcePackage: "kings-kingdoms-skeleton" as const,
      startAnchor: row.startAnchor ? createReferenceAnchor(row.startAnchor) : undefined,
      successorId: row.successorId,
      timelinePeriodId: row.timelinePeriodId,
      title: row.title,
    }))
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function getKingsKingdomsPreviewStats(rows: TimelineKingsKingdomsPreviewRow[]) {
  return {
    recordTypeCount: rows.reduce<Record<string, number>>((counts, row) => {
      counts[row.recordType] = (counts[row.recordType] ?? 0) + 1;
      return counts;
    }, {}),
    sectionCount: new Set(rows.map((row) => row.sectionId)).size,
    totalCount: rows.length,
  };
}
