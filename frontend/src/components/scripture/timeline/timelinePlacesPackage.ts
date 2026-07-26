import type {
  TimelineReader,
  TimelineSchematicPlaceRow,
  TimelineScriptureAnchor,
  TimelineText,
} from "./passionWeekTimeline";

type PlacesPackageAnchor = {
  bookId: string;
  label: TimelineText;
  reference: string;
  scope: string;
};

export type PlacesPackageRow = {
  id: string;
  placeId: string;
  title: TimelineText;
  timelinePeriodId: string;
  sectionId: string;
  displayOrder: number;
  accordionGroup: string;
  scriptureAnchors: PlacesPackageAnchor[];
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  sourceBasisLabel: TimelineText;
  modernReferenceLabel?: TimelineText;
  modernReferenceStatusLabel?: TimelineText;
  conceptRegionLabel: TimelineText;
  conceptZoneId: TimelineSchematicPlaceRow["conceptZoneId"];
  conceptFlowGroup?: TimelineSchematicPlaceRow["conceptFlowGroup"];
  placeTypeLabel?: TimelineText;
  locationBasisLabel: TimelineText;
  locationConfidenceLabel: TimelineText;
  relatedEventIds: string[];
  relatedBookContextIds: string[];
  relatedPeople: TimelineText[];
  relatedKingdoms: TimelineText[];
  relatedEmpires: TimelineText[];
  cautionNote?: TimelineText;
  note: TimelineText;
};

export type PlacesPackage = {
  items: PlacesPackageRow[];
};

function createReferenceReader(bookId: string): TimelineReader {
  return {
    book: bookId,
    chapter: 1,
    verse: 1,
    translation: { en: "WEB", ko: "KRV" },
  };
}

function createReferenceAnchor(anchor: PlacesPackageAnchor): TimelineScriptureAnchor {
  return {
    label: anchor.label,
    reader: createReferenceReader(anchor.bookId),
  };
}

export function normalizePlacesPackage(placesPackage: PlacesPackage): TimelineSchematicPlaceRow[] {
  return placesPackage.items
    .map((row) => ({
      cautionNote: row.cautionNote,
      conceptFlowGroup: row.conceptFlowGroup,
      conceptRegionLabel: row.conceptRegionLabel,
      conceptZoneId: row.conceptZoneId,
      id: row.id,
      locationBasisLabel: row.locationBasisLabel,
      locationConfidenceLabel: row.locationConfidenceLabel,
      modernReferenceLabel: row.modernReferenceLabel,
      modernReferenceStatusLabel: row.modernReferenceStatusLabel,
      note: row.note,
      placeId: row.placeId,
      placeTypeLabel: row.placeTypeLabel,
      relatedBookContextIds: row.relatedBookContextIds,
      relatedEmpires: row.relatedEmpires,
      relatedEventIds: row.relatedEventIds,
      relatedKingdoms: row.relatedKingdoms,
      relatedPeople: row.relatedPeople,
      scriptureAnchors: row.scriptureAnchors.map(createReferenceAnchor),
      title: row.title,
    }))
    .sort((left, right) => {
      const leftItem = placesPackage.items.find((item) => item.id === left.id);
      const rightItem = placesPackage.items.find((item) => item.id === right.id);

      return (leftItem?.displayOrder ?? 0) - (rightItem?.displayOrder ?? 0);
    });
}
