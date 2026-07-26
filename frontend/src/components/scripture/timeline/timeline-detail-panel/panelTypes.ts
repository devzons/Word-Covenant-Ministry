import type {
  PassionWeekTimelineEvent,
  TimelineBookContextRow,
  TimelineGenealogyComparisonRow,
  TimelineGenealogySegment,
  TimelineInspectorSelection,
  TimelineKingdomComparisonRow,
  TimelineSchematicPlaceRow,
} from "../passionWeekTimeline";
import type { TimelineKingsKingdomsPreviewRow } from "../timelineKingsKingdomsPackage";

export type TimelineInspectorSelectionItem = Exclude<TimelineInspectorSelection, null>;
export type TimelineInspectorSelectionType = TimelineInspectorSelectionItem["type"];

export type TimelineKingdomEvidenceRow = TimelineKingdomComparisonRow | TimelineKingsKingdomsPreviewRow;

export type TimelineEvidenceLookupMaps = {
  bookContextById: Map<string, TimelineBookContextRow>;
  bookContextByBookId: Map<string, TimelineBookContextRow>;
  eventById: Map<string, PassionWeekTimelineEvent>;
  genealogyComparisonById: Map<string, TimelineGenealogyComparisonRow>;
  genealogySegmentById: Map<string, TimelineGenealogySegment>;
  kingdomComparisonById: Map<string, TimelineKingdomEvidenceRow>;
  schematicPlaceById: Map<string, TimelineSchematicPlaceRow>;
  schematicPlaceByPlaceId: Map<string, TimelineSchematicPlaceRow>;
};
