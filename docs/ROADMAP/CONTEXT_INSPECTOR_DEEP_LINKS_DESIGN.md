# Context Inspector Deep Links Design

## Date

2026-06-25

## Purpose

CR-91C defines the scope for Timeline Workspace deep links before any frontend implementation work begins.

The goal is to let the Timeline Workspace open a shareable URL that restores:

- the active Timeline view
- the selected metadata-only Context Inspector item
- the matching right-panel state
- the matching center-column accordion state where applicable

This design is intentionally limited to metadata-only selection restore. It does not add Bible text rendering, backend persistence, or external-history linking.

## Implementation Status

`CR-91C-1` documented the scope. `CR-91C-2` now implements the first-pass deep-link behavior for the package-backed Events, Books / Psalms, and Kings / Kingdoms views.

Implemented v1 behavior:

- `view`, `inspectType`, and `inspectId` query parsing in the Timeline route shell
- metadata-only selection restore for supported views
- URL updates on selection through query replacement rather than history growth on each row click
- safe fallback to no selection when `inspectType` or `inspectId` is invalid for the active view
- accordion auto-open for matching Books / Psalms and Kings / Kingdoms sections during restore

Still deferred after `CR-91C-2`:

- dedicated deep-link QA and docs sync in `CR-91C-3`
- Genealogy and Places deep-link support
- any backend persistence or share UI beyond the address bar itself

## Scope

Included in CR-91C design scope:

- Events selected-row deep links
- Books / Psalms selected-book deep links
- Kings / Kingdoms selected-row deep links
- `view` query preservation
- inspector selection query policy
- route-load selection restore policy
- right-panel metadata-only restore policy
- safe fallback behavior for invalid deep-link state

Out of scope for CR-91C design scope:

- Bible text rendering or Bible-text fetch
- Bible API or backend API calls
- DB persistence of Timeline selection state
- external-history or Korean-history deep links
- coordinates or map-provider links
- new timeline package rows
- Genealogy or Places deep-link implementation in the first pass

## Recommended URL / Query Policy

Recommended v1 policy:

```txt
/[locale]/timeline?view=<view>&inspectType=<type>&inspectId=<id>
```

Recommended examples:

```txt
/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton
/ko/timeline?view=books&inspectType=book&inspectId=genesis
/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton
```

Recommendation:

- keep `view` as the existing primary route-state query
- add `inspectType` and `inspectId` instead of a single ambiguous `inspect`
- do not rely on hash-only state for the right-panel selection model

Reasoning:

- `inspectType` avoids ID collisions across datasets
- `inspectType` keeps restore logic explicit and safer than inferring type from `inspectId`
- query-string state matches the current Timeline Workspace pattern better than a hash-only model
- the URL remains shareable and copyable without introducing backend persistence

## Selection Type Policy

Recommended v1 supported `inspectType` values:

- `event`
- `book`
- `kingdom`

`kingdom` is the recommended v1 umbrella type because the current frontend inspector selection model already groups Kings / Kingdoms rows under a shared kingdom-oriented selection path.

Within `inspectType=kingdom`, the resolved package row may be one of the following record types:

- `kingdomPeriod`
- `kingdom`
- `king`
- `transition`
- `exileMarker`
- `templeMarker`

Future extension candidates after the first implementation pass:

- `genealogy`
- `place`
- any later package-backed view-specific item types

The design intentionally avoids a more abstract `timelineItem` query type in v1 because that would add indirection without reducing real complexity.

## Restore Behavior

On route load, the frontend should restore state in this order:

1. Resolve `view` first.
2. Resolve `inspectType` and `inspectId` second.
3. If the selection exists in the active view dataset, restore the right-panel selection.
4. If the selected row belongs to a collapsed center-column section, open that section.
5. If a stable center-column target exists, scroll and focus it.
6. If the selection cannot be resolved, fall back safely to the active view with no stale inspector selection.

Expected restore behavior by view:

- `events`: select the matching event row and restore the metadata-only right panel
- `books`: select the matching canonical book row and restore the metadata-only right panel; no Bible text is rendered
- `kingdoms`: select the matching Kings / Kingdoms row, restore the metadata-only right panel, and open the matching accordion section

Invalid or mismatched deep-link state must not produce an error screen. It should safely fall back to:

- the requested view when valid
- no inspector selection when the item is invalid, stale, or belongs to a different unsupported dataset

## Interaction Behavior

When a user selects an item from the Timeline center column or related-item chips:

- update the right-panel selection
- keep the current `view` query intact
- write `inspectType` and `inspectId` into the URL

Recommended history behavior for v1:

- use `router.replace(...)` for ordinary in-view selection changes
- avoid adding a new browser-history entry for every row click
- preserve browser back/forward primarily for page-level navigation and explicit view changes

Expected share/copy behavior:

- after selection, the address bar should contain a copyable URL for the current inspector state
- opening that URL in a new tab should restore the same view and metadata-only inspector selection

## Supported Views

Recommended first-pass implementation scope:

- Events
- Books / Psalms
- Kings / Kingdoms

Deferred views:

- Genealogy
- Places / Schematic Map
- any future package-backed view added later

Reasoning:

- these three views already have package-backed preview baselines
- they already drive the right panel through stable selection IDs
- they provide the clearest value for URL-shareable study context without broadening scope into placeholder views

## Guardrails

The following guardrails remain mandatory:

- deep links restore metadata-only selection state only
- Bible text must not be fetched, stored, or rendered
- no Bible API or backend API call is introduced
- no DB persistence is introduced
- no coordinates or map-provider state is introduced
- invalid `inspectId` values must fall back safely instead of producing hard failure UI
- Scripture evidence remains primary
- Korean/world reference layers remain supporting-only
- query state must not imply a stronger authority model than the current inspector data already allows

## Component Impact

Likely implementation impact for the later frontend step:

- `frontend/src/app/[locale]/timeline/page.tsx`
  - continue route-level data loading and pass initial query state into the shell
- `frontend/src/components/scripture/timeline/TimelinePageShell.tsx`
  - primary owner for query parsing, selection restore, selection-to-query sync, and accordion open/focus behavior
- `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx`
  - may need optional copy/share affordances later, but no new data authority or Bible-text behavior
- `frontend/src/components/scripture/timeline/TimelineFilterBar.tsx`
  - likely unchanged except for any view-aware navigation sync needed during deep-link restore
- adapter files such as:
  - `timelineBooksPackage.ts`
  - `timelineEventsPackage.ts`
  - `timelineKingsKingdomsPackage.ts`
  - likely unchanged unless restore helpers need small exported lookup support

This document does not authorize implementation yet. It only narrows the intended impact surface.

## Acceptance Criteria

CR-91C implementation should later satisfy the following acceptance criteria:

- `/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton` opens the Events view and restores that event in the right panel
- `/ko/timeline?view=books&inspectType=book&inspectId=genesis` opens the Books / Psalms view and restores Genesis in the right panel
- `/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton` opens the Kings / Kingdoms view and restores the David row in the right panel
- deep-link restore opens the necessary center accordion section where applicable
- invalid `inspectId` values safely fall back to no selection without stale right-panel content
- Bible text is never rendered as part of deep-link restore
- existing package-backed Books, Events, and Kings previews remain intact
- frontend typecheck, lint, and build pass after implementation

`CR-91C-2` implementation now targets these examples directly:

- `/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton`
- `/ko/timeline?view=books&inspectType=book&inspectId=genesis`
- `/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton`

## Recommended Implementation Phases

1. `CR-91C-1 Deep Links Design`.
2. `CR-91C-2 Events / Books / Kings Deep Link Implementation`.
3. `CR-91C-3 Deep Link QA and Docs Sync`.

## Known Limitations

- no backend persistence
- no Bible-text linking
- no external-history deep links
- no genealogy/place deep links in the first implementation pass
- route smoke will still depend on the local dev server being reachable on `:3030`

## Validation Commands

```bash
node scripts/timeline/verify-timeline-packages.mjs
git diff --check
git status --short
```

## Out of Scope Reminder

CR-91C design does not authorize:

- frontend code changes in this step
- new timeline data package rows
- verifier changes
- backend/API/DB/schema changes
- runtime import/export changes
- Bible-text rendering
- coordinates or map-provider behavior
