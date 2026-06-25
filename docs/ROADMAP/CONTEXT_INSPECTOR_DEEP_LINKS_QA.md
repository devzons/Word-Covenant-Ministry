# Context Inspector Deep Links QA

## Date

2026-06-25

## Scope

`CR-91C-3` reviewed the implemented Context Inspector deep-link behavior for the currently supported package-backed Timeline views.

Checked scope:

- Events deep-link restore
- Books / Psalms deep-link restore
- Kings / Kingdoms deep-link restore
- invalid and mismatched query fallback behavior
- in-view selection URL update behavior
- accordion auto-open and focus-target wiring
- right-panel stale-state clearing
- regression review for existing package-backed previews
- metadata-only and reference-only guardrails

Out of scope:

- backend persistence
- Bible text rendering or fetch
- Genealogy and Places deep-link support
- data-package row changes
- verifier changes
- API, DB, backend, or schema changes

## Checked URLs

- `/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton`
- `/ko/timeline?view=books&inspectType=book&inspectId=genesis`
- `/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton`
- `/ko/timeline?view=events&inspectType=event&inspectId=missing-event`

Additional code-path review covered:

- unsupported `inspectType`
- missing `inspectId`
- empty `inspectId`
- view / type mismatch

## Summary

Result: pass through available validation and explicit code-path inspection.

No required frontend changes were identified in this QA pass.

The current implementation restores metadata-only selection for the supported Events, Books / Psalms, and Kings / Kingdoms views, safely clears invalid query state, and preserves the existing package-backed preview guardrails.

## Pass / Fail Review

### Events Restore

Pass through code-path inspection and static validation.

- `event-creation-skeleton` exists in `events.core-biblical-skeleton.json`.
- `view=events` plus `inspectType=event` resolves through the active event lookup map.
- The right panel restores the selected event through the existing metadata-only event detail path.
- Event rows expose stable focus targets through `createTimelineEventRowId(...)`.
- Scripture anchors remain reference-only chips.
- No Bible text render or fetch path is added.

### Books Restore

Pass through code-path inspection and static validation.

- `inspectId=genesis` resolves through `bookContextByBookId`.
- The resolved selection is converted back to the canonical book row id before the right panel renders.
- The matching canonical section key is derived and merged into the expanded accordion set.
- Books rows and sections keep stable id targets for focus and scroll behavior.
- The right panel remains metadata-only and does not render Bible text.

### Kings / Kingdoms Restore

Pass through code-path inspection and static validation.

- `king-david-skeleton` exists in `kings-kingdoms.skeleton.json`.
- `view=kingdoms` plus `inspectType=kingdom` resolves through the active kingdom lookup map.
- The matching kingdom section is forced open during restore.
- The right panel continues to render review-gated chronology metadata rather than exact-final chronology claims.
- Scripture anchors remain reference-only.
- No Bible text render or fetch path is added.

### Invalid / Mismatch Fallback

Pass through code-path inspection.

- unsupported `inspectType` is normalized to `null`
- empty or missing `inspectId` falls back safely
- dataset-missing ids such as `missing-event` resolve to no selection
- view / type mismatch resolves to no selection
- invalid query state is cleared through the existing `replaceTimelineQuery(activeView, null)` path
- no hard error screen is introduced
- stale right-panel state is prevented by the no-selection fallback path

### Interaction URL Update

Pass through code-path inspection.

- event selection writes `inspectType=event` and `inspectId=<event id>`
- book selection writes `inspectType=book` and `inspectId=<bookId>`
- kingdom selection writes `inspectType=kingdom` and `inspectId=<row id>`
- query updates use `router.replace(..., { scroll: false })`
- the active `view` query is preserved
- per-row selection does not intentionally add a browser-history entry each time

### Accordion Open / Focus Wiring

Pass through code-path inspection with current limitations.

- Books restore forces the matching canonical section open
- Kings / Kingdoms restore forces the matching section open
- focus/scroll is attempted against stable section or row ids
- Events restore focuses the selected event row when the DOM target exists

Current limitation:

- route smoke was unavailable in this environment, so live focus movement could not be confirmed over HTTP

## Regression Review

Pass through code-path inspection and static validation.

- Books / Psalms 66-book package-backed preview remains intact
- Books canonical-section accordion behavior remains intact
- Events core event package-backed preview remains intact
- Kings / Kingdoms package-backed preview remains intact
- left navigator section navigation remains intact
- Overview, Genealogy, and Places views remain structurally unchanged
- right panel stays metadata-only across supported views

## Accessibility / UX Review

Pass with current limitations.

Confirmed:

- interactive rows use buttons
- selected rows expose `aria-pressed`
- accordion sections expose `aria-expanded` and `aria-controls`
- left navigator section controls remain buttons
- focus targets are present for selected Events rows and Books / Kings section or row targets
- no obvious clickable-div-only path was found in the supported deep-link flow

Current limitations:

- live browser QA was not available in this environment
- focus movement was verified by code-path inspection rather than interactive browser confirmation

## Route Smoke

Attempted:

- `http://wordcovenantministry.local:3030/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton`
- `http://wordcovenantministry.local:3030/ko/timeline?view=books&inspectType=book&inspectId=genesis`
- `http://wordcovenantministry.local:3030/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton`
- `http://wordcovenantministry.local:3030/ko/timeline?view=events&inspectType=event&inspectId=missing-event`
- `http://127.0.0.1:3030/ko/timeline?view=events&inspectType=event&inspectId=event-creation-skeleton`
- `http://127.0.0.1:3030/ko/timeline?view=books&inspectType=book&inspectId=genesis`
- `http://127.0.0.1:3030/ko/timeline?view=kingdoms&inspectType=kingdom&inspectId=king-david-skeleton`

Result:

- curl returned connection failures for both hosts in this session
- local HTTP route smoke could not verify live responses from port `3030`

## Guardrails Confirmed

- no Bible text rendered from Timeline packages
- no Bible API or backend API call introduced for deep-link restore
- no coordinates or map-provider state introduced
- no data-package row changes
- no verifier changes
- no API, DB, backend, or schema changes
- no exact chronology finalization
- Korean/world reference authority was not elevated
- timeline package verifier wrapper still passes

## Fixed Issues

- None required in this pass

## Known Limitations

- Live browser route smoke was unavailable in this environment.
- Genealogy and Places still do not participate in the first-pass deep-link matrix.
- Deep-link restore remains metadata-only and does not introduce a separate share UI beyond the address bar.
