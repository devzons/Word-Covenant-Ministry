# Schematic Flow Highlights State Contract

## Date

2026-06-26

## Purpose

`CR-91D-2` turns the conceptual schematic-highlight idea from `CR-91D-1` into an implementation-ready UI state contract.

The highlight system is a metadata-derived UI affordance:

- it is not a doctrinal conclusion
- it is not a typology claim
- it is not a map or geography engine
- it does not infer meaning from Bible text

The contract exists to define how the Timeline Workspace can derive stable highlight state from the current Context Inspector selection and already approved package metadata.

Status note:

- `CR-91D-3` now applies this contract to the current Events, Books / Psalms, and Kings / Kingdoms package-backed previews.
- The v1 implementation keeps the existing `view`, `inspectType`, and `inspectId` deep-link baseline unchanged and derives highlight state from that selection.
- Places / Schematic Map remains deferred.
- `CR-91D-5` now records QA results in `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` without changing the state contract itself.

## Highlight Input Contract

The highlight system should derive from the existing Timeline selection model and current package-backed preview data.

Primary inputs:

- `activeView`
- selected inspector item
- `inspectType`
- `inspectId`

Dataset inputs:

- Events package-backed rows
- Books / Psalms package-backed rows
- Kings / Kingdoms package-backed rows

Relevant metadata inputs:

- `relatedBookIds`
- `scriptureAnchors`
- internal relation ids
- `sectionId`
- `accordionGroup`
- `timelinePeriodId`
- `recordType`
- transition links
- `predecessorId`
- `successorId`
- `kingdomId`
- `relatedKingIds`

Derived input policy:

- the current Context Inspector selection is the single active source item
- highlight state is derived from existing metadata only
- no Bible text parsing, external-history lookup, or coordinate lookup may participate in highlight derivation

## Highlight State Shape

The implementation CR should use a stable state model similar to the following TypeScript-like shape.

This CR documents the shape only. It does not create a TypeScript file.

```ts
type TimelineHighlightState = {
  activeItem: {
    type: "event" | "book" | "kingdom";
    id: string;
    view: "events" | "books" | "kingdoms";
  } | null;
  highlightedItems: Array<{
    type:
      | "event"
      | "book"
      | "kingdom"
      | "kingdomPeriod"
      | "king"
      | "transition"
      | "exileMarker"
      | "templeMarker"
      | "section";
    id: string;
    reason:
      | "selected"
      | "same-section"
      | "related-book"
      | "scripture-anchor-overlap"
      | "internal-relation"
      | "transition-link"
      | "predecessor-successor"
      | "same-period"
      | "same-accordion-group";
    strength: "primary" | "related" | "subdued" | "caution";
    source: "selection" | "metadata";
  }>;
  highlightedSections: Array<{
    view: "events" | "books" | "kingdoms" | "places";
    sectionId: string;
    reason:
      | "selected"
      | "same-section"
      | "same-period"
      | "same-accordion-group";
  }>;
  highlightedBookIds: string[];
  cautionNotes: string[];
};
```

## Supported Item Types

Recommended v1 supported highlight item types:

- `event`
- `book`
- `kingdom`
- `kingdomPeriod`
- `king`
- `transition`
- `exileMarker`
- `templeMarker`
- `section`

Policy:

- `kingdom` remains the existing umbrella inspect type for URL state
- concrete Kings / Kingdoms record types may still appear in highlight state
- `section` exists to support accordion and navigator emphasis without inventing a separate content dataset

## Highlight Reason Taxonomy

Allowed reasons:

- `selected`
- `same-section`
- `related-book`
- `scripture-anchor-overlap`
- `internal-relation`
- `transition-link`
- `predecessor-successor`
- `same-period`
- `same-accordion-group`

Disallowed reasons:

- `typology-claim`
- `doctrine-derived`
- `geography-derived`
- `external-history-derived`
- `hidden-meaning-derived`

Reason policy:

- reasons must be explainable from explicit metadata
- reasons must stay descriptive rather than interpretive
- reasons must not imply theological certainty where the underlying data only provides adjacency or grouping

## Highlight Strength Policy

Allowed strengths:

- `primary`
- `related`
- `subdued`
- `caution`

Strength rules:

- only the selected item is `primary`
- explicit metadata relations are `related`
- uncertain or `reviewRequired` relations are `caution`
- non-related items should not be hidden
- uncertain relations may be omitted entirely if a caution state would overstate confidence

Recommended usage:

- `primary`: current selected row or item
- `related`: explicit linked row, section, or book
- `subdued`: optional safe de-emphasis for non-selected context, if later used
- `caution`: chronology-sensitive or review-gated relation emphasis

## View-Specific Derivation Policy

### Events

A selected event may highlight:

- itself
- its `relatedBookIds`
- its own `timelinePeriodId`
- its own `accordionGroup` / `sectionId`
- other rows only where explicit metadata already exists

Events-specific rules:

- no doctrine inference from `scriptureAnchors`
- no typology or hidden-meaning derivation
- `scriptureAnchors` may support `scripture-anchor-overlap` only when the overlap is already represented in metadata or stable package relationships

### Books / Psalms

A selected book may highlight:

- itself
- its canonical section
- event rows whose `relatedBookIds` include the current `bookId`
- kingdom rows whose `relatedBookIds` include the current `bookId`

Books-specific rules:

- do not parse Bible text
- do not infer event relationships from authorship, chronology, or tradition labels alone
- keep canonical section highlighting stronger than speculative cross-view relationships

### Kings / Kingdoms

A selected kingdom row may highlight:

- itself
- rows in the same `sectionId`
- explicit `relatedKingIds`
- `kingdomId` relations
- `predecessorId` / `successorId`
- `previousStateId` / `nextStateId`
- explicit transition links
- `relatedBookIds`

Kings-specific rules:

- chronology caution must be respected
- no exact chronology inference
- review-gated relations should prefer `caution` over ordinary `related`
- no implicit synchronism logic beyond explicit metadata

### Places / Schematic Map

Status:

- deferred in v1

Policy:

- a future schematic-only Places surface may consume the same highlight state pattern
- no coordinates
- no map provider
- no geocoding

## URL / State Relationship

The current deep-link baseline remains:

```txt
/<locale>/timeline?view=<view>&inspectType=<type>&inspectId=<id>
```

Policy:

- highlight state is derived from the current selection state
- no new highlight query parameter is required in v1
- invalid inspect state yields no highlight

Future-only reserved options:

- `highlightMode`
- `highlight`

These are documented only as future extension points. The current implementation path should not depend on them.

## Fallback Policy

Fallback rules:

- missing relation target -> omit highlight
- invalid `inspectId` -> no-selection / no-highlight fallback
- unknown `recordType` -> no highlight
- view mismatch -> no highlight
- stale highlight state must be cleared on view change
- no hard error UI

Failure behavior:

- fail soft
- clear stale highlight state rather than preserving misleading emphasis
- keep the right panel and center-column content usable even when no highlight can be derived

## Guardrails

The following guardrails remain mandatory:

- no Bible text
- no Bible API
- no backend API
- no coordinates
- no map provider
- no geocoding
- no external historical authority elevation
- no exact chronology inference
- Scripture evidence remains primary
- highlight is a UI affordance, not doctrinal interpretation
- metadata-only

## Component Impact Proposal

This section documents likely future ownership only.

`TimelinePageShell.tsx`

- derive highlight state from the selected inspector item
- clear stale highlight state on view change or invalid selection

`TimelineEventCard.tsx`

- accept highlight state / strength later

`ScriptureTimelineList.tsx`

- pass highlight state to event cards later

`TimelineFilterBar.tsx`

- may expose optional section-level highlight later

`TimelineEventDetailPanel.tsx`

- may explain why related highlights are shown

`timelineBooksPackage.ts`

- no row changes
- may expose helper lookups later if implementation needs them

`timelineEventsPackage.ts`

- no row changes
- may expose helper lookups later if implementation needs them

`timelineKingsKingdomsPackage.ts`

- no row changes
- may expose helper lookups later if implementation needs them

## Acceptance Criteria for CR-91D-3

- Selecting an event highlights its related book chips and same section when metadata exists.
- Selecting a book highlights its canonical section and package rows that explicitly list its `bookId`.
- Selecting a king/kingdom highlights explicit relation rows and related book chips.
- No highlight is derived from Bible text parsing.
- No map/coordinate highlight exists.
- Invalid inspect state clears highlight.
- Existing deep links keep working.
- Typecheck, lint, and build pass in the implementation CR.

## Recommended Implementation Phases

1. `CR-91D-2` Schematic Highlight Data Contract / UI State Design
2. `CR-91D-3` Events / Books / Kings Highlight Implementation
3. `CR-91D-4` Places / Schematic View Placeholder Highlight
4. `CR-91D-5` Interaction QA and Docs Sync

## Known Limitations

- package gaps limit highlight coverage
- Places schematic highlight remains deferred
- no live map
- no coordinates
- no Bible text
- no external historical comparison
- current highlight state is derived only from metadata
- a separate bugfix may be needed if the earlier React `useEffect` dependency-array-size warning remains reproducible

## Implementation Prerequisite / Known Risk

An earlier session reported a React `useEffect` dependency-array-size warning after the deep-link work.

This CR does not modify frontend code and does not resolve that warning.

Current policy:

- record the issue as an implementation prerequisite / known risk
- do not mix the fix into this docs-only CR
- handle any real frontend correction in a separate bugfix CR or at the start of `CR-91D-3` before highlight implementation expands state wiring
