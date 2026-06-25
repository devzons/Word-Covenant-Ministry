# Timeline Workspace Interaction QA

## Date

2026-06-25

## Scope

CR-93F Timeline Workspace Interaction QA covered the current package-backed Timeline Workspace preview flows.

Checked scope:

- Timeline view switching
- Events package-backed preview
- Books / Psalms package-backed preview
- Left navigator behavior by active view
- Right Scripture Evidence Panel metadata-only behavior
- Accessibility-focused code review for interactive controls
- Route smoke where locally possible

Out of scope:

- Data package expansion
- Bible text rendering
- Backend or API behavior
- Schema or import pipeline changes
- Korean/world history runtime integration

## Checked Views

- Overview
- Events
- Books / Psalms
- Kings / Kingdoms
- Genealogy
- Places / Schematic Map

## Summary

Result: pass through available validation and code-path inspection.

No required frontend code changes were identified in this QA pass.

The current Timeline Workspace keeps the package-backed Books / Psalms and Events previews metadata-only, preserves Scripture-reference-only rendering for package-backed rows, and keeps the right panel aligned with the current selection model.

## Pass / Fail Review

### View Switching

Pass through code-path inspection.

- Timeline tabs still route by `view` query state.
- Tab changes clear stale right-panel selection through the existing `setTimelineView(..., true)` path.
- Books and Events package-backed previews remain isolated to their intended views.

### Events View

Pass through code-path inspection and static validation.

- The route loader passes `events.core-biblical-skeleton.json` through the existing adapter.
- Events are normalized and sorted by sequence/display order.
- Event cards expose selection state through buttons with `aria-pressed`.
- The right panel remains metadata-only and explicitly states that Bible text is not stored in the package.
- Related book display uses timeline book lookup labels with safe fallback to `bookId`.

### Books / Psalms View

Pass through code-path inspection and static validation.

- The route loader passes `books.66-canonical-skeleton.json` through the existing adapter.
- The center view remains grouped by canonical section and ordered canonically.
- Left canonical section navigation targets stable section IDs and uses button-based interaction.
- Canonical sections are now accordion panels that start collapsed on first load.
- Left canonical section selection opens the matching section, scrolls to it, and focuses the section target.
- Multiple canonical sections can stay open at the same time, and center-column section headers can directly toggle expanded state.
- Active section state is exposed through `aria-pressed`, `aria-expanded`, and `aria-controls`, and center section targets remain focusable with `tabIndex={-1}`.
- The right panel remains metadata-only and reference-only.

### Left Navigator

Pass through code-path inspection.

- Navigator content changes by active view.
- Events navigator stays scoped to Events filters.
- Books navigator shows canonical section navigation instead of generic event filters.
- Placeholder/future sections remain labeled as planned/preview rather than overclaiming package support.

### Right Scripture Evidence Panel

Pass through code-path inspection.

- Event and book selections show metadata-only evidence.
- No Bible text rendering path was added for package-backed previews.
- Scripture anchors remain the primary Reader links where applicable.
- Supporting world/Korean reference authority is not elevated in the panel.

## Accessibility Review

Pass with current limitations.

Confirmed:

- Interactive controls use `button` or `Link`.
- Active tab state exposes `aria-current`.
- Event and related-item selection buttons expose `aria-pressed`.
- Books section navigation buttons expose `aria-controls` and `aria-pressed`.
- Canonical section focus targets exist after scroll/focus movement.
- No obvious keyboard trap was identified from current code review.

Current limitation:

- The Books canonical section active state is click-driven rather than viewport-observer-driven.

## Mobile / Responsive Review

Pass through code-path inspection only.

- Main navigator and status rows already use wrapping flex layouts.
- Event cards and section controls use compact chip/button layouts that should wrap rather than overflow.
- No broad horizontal-overflow risk stood out in the inspected components.

Limitations:

- No live browser viewport QA was available in this environment.

## Route Smoke

Attempted:

- `http://wordcovenantministry.local:3030/ko/timeline`
- `http://wordcovenantministry.local:3030/ko/timeline?view=events`
- `http://wordcovenantministry.local:3030/ko/timeline?view=books`
- `http://127.0.0.1:3030/ko/timeline`
- `http://127.0.0.1:3030/ko/timeline?view=events`
- `http://127.0.0.1:3030/ko/timeline?view=books`

Result:

- curl returned connection failures in this session.
- Port `3030` was already held by a local `node` process, but the current environment could not complete HTTP route smoke against it.

## Guardrails Confirmed

- No Bible text rendered from Timeline packages
- No coordinates or map-provider fields introduced
- No API, DB, backend, or schema changes
- No data package row changes
- Timeline package verifier wrapper still passes

## Fixed Issues

- After this QA pass, the Books / Psalms center column was updated to a collapsed-by-default canonical-section accordion model with navigator-triggered open plus scroll/focus behavior.

## Known Limitations

- Live browser interaction QA was not available from this environment.
- Route smoke could not verify HTTP responses despite a local listener on port `3030`.
- Books canonical section active state is click-driven and does not yet track viewport position automatically.

## Addendum After CR-93D-4

- Books / Psalms center sections are no longer always-expanded content bands.
- The current behavior is accordion-first: all canonical sections start collapsed, left navigator selection opens and focuses the target section, and users can manually keep multiple sections open.
- This preserves the existing metadata-only / Scripture-reference-only guardrail and does not introduce Bible text rendering, coordinates, map-provider data, or backend changes.
