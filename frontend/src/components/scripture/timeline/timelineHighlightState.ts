export type TimelineHighlightView = "events" | "books" | "kingdoms";

export type TimelineHighlightItemType =
  | "event"
  | "book"
  | "kingdom"
  | "kingdomPeriod"
  | "king"
  | "transition"
  | "exileMarker"
  | "templeMarker"
  | "propheticContextMarker"
  | "section";

export type TimelineHighlightReason =
  | "selected"
  | "same-section"
  | "related-book"
  | "scripture-anchor-overlap"
  | "internal-relation"
  | "transition-link"
  | "predecessor-successor"
  | "same-period"
  | "same-accordion-group";

export type TimelineHighlightStrength = "primary" | "related" | "subdued" | "caution";

export type TimelineHighlightItem = {
  id: string;
  reason: TimelineHighlightReason;
  source: "selection" | "metadata";
  strength: TimelineHighlightStrength;
  type: TimelineHighlightItemType;
};

export type TimelineHighlightSection = {
  reason: "selected" | "same-section" | "same-period" | "same-accordion-group";
  sectionId: string;
  view: TimelineHighlightView;
};

export type TimelineHighlightState = {
  activeItem: {
    id: string;
    type: "event" | "book" | "kingdom";
    view: TimelineHighlightView;
  } | null;
  cautionNotes: string[];
  highlightedBookIds: string[];
  highlightedItems: TimelineHighlightItem[];
  highlightedSections: TimelineHighlightSection[];
};

export type TimelineHighlightLookup = {
  highlightedBookIds: Set<string>;
  highlightedItems: Map<string, TimelineHighlightItem>;
  highlightedSections: Map<string, TimelineHighlightSection>;
};

export function createEmptyTimelineHighlightState(): TimelineHighlightState {
  return {
    activeItem: null,
    cautionNotes: [],
    highlightedBookIds: [],
    highlightedItems: [],
    highlightedSections: [],
  };
}

export function createTimelineHighlightItemKey(
  type: TimelineHighlightItemType,
  id: string,
) {
  return `${type}:${id}`;
}

export function createTimelineHighlightSectionKey(
  view: TimelineHighlightView,
  sectionId: string,
) {
  return `${view}:${sectionId}`;
}

export function buildTimelineHighlightLookup(
  state: TimelineHighlightState,
): TimelineHighlightLookup {
  return {
    highlightedBookIds: new Set(state.highlightedBookIds),
    highlightedItems: new Map(
      state.highlightedItems.map((item) => [
        createTimelineHighlightItemKey(item.type, item.id),
        item,
      ]),
    ),
    highlightedSections: new Map(
      state.highlightedSections.map((section) => [
        createTimelineHighlightSectionKey(section.view, section.sectionId),
        section,
      ]),
    ),
  };
}
