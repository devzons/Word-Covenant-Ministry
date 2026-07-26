import type {
  TimelineGenealogyComparisonRow,
  TimelineGenealogySegment,
  TimelineReader,
  TimelineScriptureAnchor,
  TimelineText,
} from "./passionWeekTimeline";

type GenealogyPackageAnchor = {
  bookId: string;
  chapter: number;
  label: TimelineText;
  reference: string;
  scope: string;
  verse: number;
};

type GenealogyPackageBaseRow = {
  id: string;
  recordType: "segment" | "comparison";
  title: TimelineText;
  displayOrder: number;
  timelinePeriodId: string;
  sectionId: string;
  accordionGroup: string;
  scriptureAnchors: GenealogyPackageAnchor[];
  basisLabel: TimelineText;
};

export type GenealogyPackageSegmentRow = GenealogyPackageBaseRow & {
  recordType: "segment";
  rangeLabel: TimelineText;
  structureLabel: TimelineText;
  note: TimelineText;
};

export type GenealogyPackageComparisonRow = GenealogyPackageBaseRow & {
  recordType: "comparison";
  segmentId: string;
  matthewName: TimelineText;
  oldTestamentName?: TimelineText;
  comparisonLabel: TimelineText;
  periodId: string;
  relatedBookIds?: string[];
  relatedEventIds?: string[];
  kingdomTags?: TimelineText[];
  empireTags?: TimelineText[];
  rulerTags?: TimelineText[];
  nameVariantNote?: TimelineText;
  omissionNote?: TimelineText;
  note?: TimelineText;
};

export type GenealogyPackage = {
  items: Array<GenealogyPackageSegmentRow | GenealogyPackageComparisonRow>;
};

export type NormalizedGenealogyPackage = {
  comparisonRows: TimelineGenealogyComparisonRow[];
  segments: TimelineGenealogySegment[];
};

function createReferenceReader(anchor: GenealogyPackageAnchor): TimelineReader {
  return {
    book: anchor.bookId,
    chapter: anchor.chapter,
    verse: anchor.verse,
    translation: { en: "WEB", ko: "KRV" },
  };
}

function createReferenceAnchor(anchor: GenealogyPackageAnchor): TimelineScriptureAnchor {
  return {
    label: anchor.label,
    reader: createReferenceReader(anchor),
  };
}

export function normalizeGenealogyPackage(
  genealogyPackage: GenealogyPackage,
): NormalizedGenealogyPackage {
  const sortedItems = [...genealogyPackage.items].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );

  const segments = sortedItems
    .filter(
      (row): row is GenealogyPackageSegmentRow => row.recordType === "segment",
    )
    .map((row) => ({
      basisLabel: row.basisLabel,
      id: row.id,
      note: row.note,
      rangeLabel: row.rangeLabel,
      scriptureAnchors: row.scriptureAnchors.map(createReferenceAnchor),
      structureLabel: row.structureLabel,
      title: row.title,
    }));

  const comparisonRows = sortedItems
    .filter(
      (row): row is GenealogyPackageComparisonRow => row.recordType === "comparison",
    )
    .map((row) => ({
      basisLabel: row.basisLabel,
      comparisonLabel: row.comparisonLabel,
      empireTags: row.empireTags,
      id: row.id,
      kingdomTags: row.kingdomTags,
      matthewName: row.matthewName,
      nameVariantNote: row.nameVariantNote,
      note: row.note,
      oldTestamentName: row.oldTestamentName,
      omissionNote: row.omissionNote,
      periodId: row.periodId,
      relatedBookIds: row.relatedBookIds,
      relatedEventIds: row.relatedEventIds,
      rulerTags: row.rulerTags,
      scriptureAnchors: row.scriptureAnchors.map(createReferenceAnchor),
      segmentId: row.segmentId,
    }));

  return { comparisonRows, segments };
}
