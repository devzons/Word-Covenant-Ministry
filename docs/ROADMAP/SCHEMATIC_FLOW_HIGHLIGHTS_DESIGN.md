# Schematic Flow Highlights Design

## Date

2026-06-25

## Purpose

`CR-91D` defines the scope for Timeline Workspace schematic flow highlights before any frontend implementation begins.

The purpose is to let the Timeline Workspace visually emphasize conceptual relationships that already exist in package-backed metadata or approved preview metadata without introducing a real map, coordinates, or interpretive overclaim.

This feature is intentionally schematic and conceptual:

- not a live map
- not coordinate-driven
- not geocoded
- not Bible-text rendering
- not a doctrinal inference engine

The design remains Scripture-first and metadata-only.

## Implementation Status

`CR-91D-1` documented the conceptual scope.

`CR-91D-2` now documents the implementation-facing state contract in:

- `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_STATE_CONTRACT.md`

That note defines the allowed inputs, supported item types, reason and strength taxonomy, view-specific derivation rules, fallback behavior, and implementation-facing component impact while keeping the feature metadata-only and no-coordinate.

`CR-91D-3` now implements the first-pass schematic highlight behavior for the current package-backed Events, Books / Psalms, and Kings / Kingdoms previews.

Implemented in this step:

- selection-derived highlight state for supported Timeline views
- primary selected-row emphasis plus softer related/caution emphasis
- section-level highlight for active Books and Kings accordion sections
- same-period event highlighting inside Events
- no new query parameter; highlight remains derived from the existing Context Inspector selection state

Still deferred after `CR-91D-3`:

- Places / Schematic Map highlight behavior in `CR-91D-4`
- dedicated QA and docs sync in `CR-91D-5`

## Scope

Included in `CR-91D` design scope:

- conceptual flow highlighting between already-rendered Timeline items
- soft highlight behavior for related Events, Books / Psalms, and Kings / Kingdoms rows
- future schematic-only highlight behavior for Places / Schematic Map
- alignment between Context Inspector selection and highlight state
- no-coordinate schematic-only behavior
- safe fallback when metadata links are missing or incomplete

Out of scope:

- real maps
- coordinates
- map providers
- geocoding
- Bible text rendering or fetch
- backend or API calls
- DB persistence
- new timeline package rows in this CR
- external historical timeline expansion
- a full graph-visualization engine

## Supported v1 Surfaces

Recommended v1 implementation priority:

1. Events view
   - selected event may softly highlight related books, related sections, or linked package-backed context where metadata already exists
2. Books / Psalms view
   - selected book may softly highlight related event or kingdom context where existing metadata already links it
3. Kings / Kingdoms view
   - selected kingdom/king/transition row may softly highlight related kingdom periods, transitions, or related books where metadata already exists

Deferred but documented in this design:

4. Places / Schematic Map view
   - schematic-only highlight behavior
   - no coordinates
   - no map provider
   - no route geometry

## URL / State Relationship

The existing Context Inspector deep-link baseline is the selection source of truth:

```txt
/<locale>/timeline?view=<view>&inspectType=<type>&inspectId=<id>
```

Recommended v1 state relationship:

- `view` selects the active Timeline surface
- `inspectType` and `inspectId` select the active metadata item
- the selected item may produce a derived highlight state in the current view
- invalid selection state produces no highlight
- v1 does not require new URL parameters for highlight state

Future-only option if needed later:

- `highlight=<id>`
- `highlightMode=<mode>`

These are explicitly deferred unless the implementation later proves that derived highlight state is insufficient.

## UI Behavior Proposal

Recommended v1 UI behavior:

- the selected item remains the strongest active state
- related items may receive a softer highlight state
- non-related items remain visible
- non-related items may become visually quieter only if this stays readable and does not imply exclusion
- center-column layout remains accordion-first
- right panel remains metadata-only

Recommended label/copy style:

- `related reference`
- `same section`
- `linked package item`
- `same kingdom flow`
- `same canonical context`

Avoid labels that imply doctrinal or theological conclusions.

## Data Source Policy

Highlight state may derive only from existing approved metadata such as:

- `relatedBookIds`
- `scriptureAnchors`
- internal relation ids
- transition links
- `sectionId`
- `accordionGroup`
- Context Inspector selection
- existing related-item chip relationships already present in the Timeline Workspace

Not allowed:

- deriving doctrine
- deriving hidden typology
- asserting external history as primary evidence
- using coordinates
- parsing Bible text for highlight logic

## Guardrails

The following guardrails remain mandatory:

- no Bible text storage
- no Bible text rendering
- no coordinates
- no map provider
- no geocoding
- no external historical authority elevation
- Scripture evidence remains primary
- highlights are UI affordances, not doctrinal conclusions
- highlight state remains metadata-only
- invalid or missing relations must fail softly

## Component Impact

Likely later implementation surface:

- `frontend/src/components/scripture/timeline/TimelinePageShell.tsx`
- `frontend/src/components/scripture/timeline/TimelineFilterBar.tsx`
- `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx`
- `frontend/src/components/scripture/timeline/timelineBooksPackage.ts`
- `frontend/src/components/scripture/timeline/timelineEventsPackage.ts`
- `frontend/src/components/scripture/timeline/timelineKingsKingdomsPackage.ts`

Possible future adapter if the Places schematic surface needs one:

- a dedicated schematic-highlight adapter layered on top of existing preview/package metadata

This design note does not authorize implementation in this CR.

## Acceptance Criteria

Later implementation work should satisfy these criteria:

- selecting an event can softly highlight related book chips, sections, or linked package-backed items where metadata exists
- selecting a book can softly highlight related event or kingdom context where metadata exists
- selecting a king/kingdom row can softly highlight related transition or kingdom-period rows
- Places / Schematic Map remains schematic-only and does not introduce coordinates
- no Bible text is rendered
- invalid relations do not crash the UI
- typecheck, lint, and build pass in the implementation CR

## Recommended Implementation Phases

1. `CR-91D-1` Scope Definition
2. `CR-91D-2` Schematic Highlight Data Contract / UI State Design
3. `CR-91D-3` Events / Books / Kings Highlight Implementation
4. `CR-91D-4` Places / Schematic View Placeholder Highlight
5. `CR-91D-5` Interaction QA and Docs Sync

## Known Limitations

- no live map
- no coordinates
- no Bible text
- no external historical comparison
- initial highlights should stay metadata-derived only
- current package/preview gaps may limit highlight coverage
