# Kings / Kingdoms Interaction QA

## Date

2026-06-25

## Scope

CR-93G-6 Kings / Kingdoms Interaction QA covered the current package-backed Kings / Kingdoms preview flow inside the Timeline Workspace.

Checked scope:

- Kings / Kingdoms route/view structure
- Kings / Kingdoms left navigator section navigation
- Kings / Kingdoms center-column accordion behavior
- Kings / Kingdoms right metadata panel behavior
- Regression review for Books / Psalms, Events, Overview, Genealogy, and Places views
- Accessibility-focused code review for buttons, pressed state, and accordion wiring
- Route smoke where locally possible

Out of scope:

- Data package row changes
- Verifier changes
- Backend or API behavior
- Schema or import pipeline changes
- Bible text rendering
- Exact chronology finalization

## Checked Views

- Kings / Kingdoms
- Books / Psalms
- Events
- Overview
- Genealogy
- Places / Schematic Map

## Summary

Result: pass through available validation and code-path inspection.

No required frontend code changes were identified in this QA pass.

The current Kings / Kingdoms preview remains package-backed, metadata-only, and Scripture-reference-first. The supporting chronology labels remain review-gated cautions rather than final chronology claims.

## Pass / Fail Review

### Kings / Kingdoms View

Pass through code-path inspection and static validation.

- The Timeline route server-loads `kings-kingdoms.skeleton.json`.
- The adapter normalizes package rows into preview rows without copying package data into frontend fixtures.
- The center view renders section-level accordion groups instead of a wide comparison table.
- The preview stats surface `20` total rows and `5` sections.
- Row buttons expose active state through `aria-pressed`.
- Review-required and confidence/caution labels are rendered as metadata-only tags.
- Chronology copy stays approximate and review-gated.

### Kings / Kingdoms Left Navigator

Pass through code-path inspection.

- The left navigator switches correctly into Kings / Kingdoms mode.
- Section buttons remain `button` elements with `type="button"`.
- Section buttons expose `aria-controls` and `aria-pressed`.
- Navigator copy matches package-backed preview status and does not conflict with older placeholder wording.
- Section selection routes through the same open plus scroll/focus pattern already used for Books / Psalms.

### Kings / Kingdoms Center Accordion

Pass through code-path inspection and static validation.

Confirmed section model:

- United Monarchy
- Divided Kingdom Overview
- Northern Kingdom / Israel
- Southern Kingdom / Judah
- Exile / Fall Markers

Confirmed behavior:

- Section headers are buttons
- `aria-expanded` and `aria-controls` are wired
- Multiple sections can stay open
- Preview remains compact and card/list based
- No regression back to the old table-first presentation

### Right Scripture Evidence Panel

Pass through code-path inspection.

- Selected kingdom/king/transition/marker rows render metadata-only detail.
- The panel shows record type, display-order context, kingdom/reign/scope metadata, Scripture references, and internal relation labels.
- Related books use title lookup with safe fallback to `bookId`.
- Scripture anchors are displayed as reference-only chips.
- The panel explicitly states that Bible text is not stored in the package.
- Chronology is presented as caution/review metadata, not as primary evidence.

### Regression Review

Pass through code-path inspection and static validation.

- Books / Psalms package-backed preview remains intact
- Books canonical-section accordion remains intact
- Events package-backed preview remains intact
- View switching still routes by `view` query state
- Selection reset still routes through the existing view-switch path
- Overview, Genealogy, and Places placeholder/preview views remain structurally unchanged

## Accessibility Review

Pass with current limitations.

Confirmed:

- Interactive section controls use buttons
- Accordion triggers expose `aria-expanded`
- Navigator buttons expose `aria-controls` and `aria-pressed`
- Row selection remains keyboard-accessible
- No obvious clickable div-without-keyboard path was found in the Kings / Kingdoms preview flow

Current limitation:

- Active section tracking is selection-driven rather than viewport-observer-driven.

## Mobile / Responsive Review

Pass through code-path inspection only.

- Accordion headers use wrapped flex layouts
- Metadata chips and Scripture reference chips are rendered in wrap-capable flex containers
- No obvious broad horizontal overflow path stood out in the inspected Kings / Kingdoms components

Limitation:

- No live narrow-viewport browser QA was available in this environment.

## Route Smoke

Attempted:

- `http://wordcovenantministry.local:3030/ko/timeline?view=kingdoms`
- `http://127.0.0.1:3030/ko/timeline?view=kingdoms`
- `http://wordcovenantministry.local:3030/ko/timeline?view=events`
- `http://wordcovenantministry.local:3030/ko/timeline?view=books`

Result:

- curl returned connection failures in this session
- local route smoke could not verify HTTP responses from port `3030`

## Guardrails Confirmed

- No Bible text rendered from Timeline packages
- No coordinates or map-provider fields introduced
- No API, DB, backend, or schema changes
- No data package row changes
- No verifier logic changes
- No exact chronology finalization
- Timeline package verifier wrapper still passes

## Fixed Issues

- None required in this pass

## Known Limitations

- Live browser interaction QA was not available from this environment
- Route smoke could not verify HTTP responses from the local `:3030` route
- Section active state remains selection-driven rather than viewport-observer-driven
