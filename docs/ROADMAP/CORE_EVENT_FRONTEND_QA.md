# Core Event Frontend QA

## Date

2026-06-27

## Scope

`CR-93C-3` reviewed the current package-backed Events frontend preview that reads from `docs/data-packages/timeline/events.core-biblical-skeleton.json`.

Checked scope:

- Events package route loader wiring
- event normalization path from package rows into frontend preview rows
- event-card selection behavior and `aria-pressed` state
- right Scripture Evidence Panel event detail behavior
- metadata-only and Scripture-reference-only guardrails
- no-Bible-text, no-coordinate, no-map-provider, and no-geocoding guardrails
- verifier-wrapper coverage for the core events package
- available frontend validation
- route smoke where locally possible

Out of scope:

- data-package row changes
- verifier logic changes
- API, DB, backend, or schema changes
- runtime import/export behavior
- Korean/world history layer expansion
- new event coverage or deeper contextual labeling

## Checked Files

- `docs/data-packages/timeline/events.core-biblical-skeleton.json`
- `frontend/src/app/[locale]/timeline/page.tsx`
- `frontend/src/components/scripture/timeline/timelineEventsPackage.ts`
- `frontend/src/components/scripture/timeline/TimelinePageShell.tsx`
- `frontend/src/components/scripture/timeline/TimelineEventCard.tsx`
- `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx`
- `scripts/timeline/verify-timeline-packages.mjs`

## Summary

Result: pass through available validation and explicit code-path inspection.

No required frontend code changes were identified in this QA pass.

The current Events preview remains package-backed, metadata-only, and Scripture-reference-first. The package stays read-only, no Bible text is rendered from the package or right panel, and no coordinates, map-provider state, or geocoding behavior were introduced.

## Pass / Fail Review

### Events Package Loader

Pass through code-path inspection.

- `frontend/src/app/[locale]/timeline/page.tsx` server-loads `events.core-biblical-skeleton.json`.
- The loaded JSON is passed through `normalizeCoreBiblicalEventsPackage(...)` before entering `TimelinePageShell`.
- The route stays aligned with the existing package-backed loader pattern used for Books and Kings / Kingdoms.

### Events Normalization Path

Pass through code-path inspection and static validation.

- `timelineEventsPackage.ts` maps package rows into `TimelineEvent` preview rows.
- normalization preserves `sequence`, `displayOrder`, `timelinePeriodId`, `sectionId`, `scriptureAnchors`, and related metadata fields needed by the current Events UI.
- normalized rows are sorted by `sequenceNumber` and then `displayOrder`.
- the normalization path injects explicit metadata-only copy stating that Bible text is not stored in the package.

### Event Card Selection / Pressed State

Pass through code-path inspection and static validation.

- `TimelineEventCard.tsx` renders interactive event rows as `button` elements.
- the selected row exposes `aria-pressed={selected}`.
- core package rows surface sequence labels, Scripture anchor chips, and related-book metadata without rendering Bible text.
- no clickable-div-only selection path was introduced.

### Right Panel Metadata Flow

Pass through code-path inspection and static validation.

- `TimelineEventDetailPanel.tsx` resolves selected Events rows through the existing event lookup map.
- the panel explicitly labels the core events package as a metadata-only preview.
- event-level Scripture anchors remain reference-only and route to Reader links rather than embedding Bible text.
- the panel states that the package does not store Bible text and shows event-level Scripture references only.

### Bible Text Guardrail

Pass through code-path inspection, static validation, and package inspection.

- `events.core-biblical-skeleton.json` notes that it stores Scripture references only and does not store Bible text.
- `timelineEventsPackage.ts` injects `locationNote` text confirming that Bible text is not stored.
- `TimelinePageShell.tsx` and `TimelineEventDetailPanel.tsx` both preserve explicit metadata-only / no-Bible-text copy.
- no Bible API fetch path, backend API path, or package text field was introduced in the inspected Events preview flow.

### Coordinates / Map / Geocoding Guardrail

Pass through code-path inspection and verifier coverage review.

- the inspected core events package and current Events preview path do not introduce coordinates.
- no map-provider or geocoding behavior was added in the Events preview flow.
- existing no-coordinate / no-map-provider verifier coverage remains present through the wrapper command.

### Verifier Wrapper Coverage

Pass through direct command execution.

- `node scripts/timeline/verify-timeline-packages.mjs` passed.
- the wrapper includes an explicit pass for `events.core-biblical-skeleton.json`.
- valid fixtures, invalid expected-fail fixtures, warning-only fixtures, and JSON smoke output also passed in the same wrapper run.

## Validation Run

Executed:

- `git status --short`
- `node scripts/timeline/verify-timeline-packages.mjs`
- `cd frontend && npm run typecheck`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

Results:

- `git status --short`: clean before edits
- verifier wrapper: passed
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: environment-limited failure

Build limitation detail:

- Next.js `16.2.9` Turbopack failed while processing `src/app/globals.css`
- failure reason was `creating new process` -> `binding to a port` -> `Operation not permitted (os error 1)`
- this did not surface as an application code error in the inspected Events preview files

## Route Smoke

Attempted:

- `http://wordcovenantministry.local:3030/ko/timeline`
- `http://wordcovenantministry.local:3030/en/timeline`

Result:

- curl returned connection failures for both URLs in this session
- local route smoke was unavailable from this environment

## Regression Review

Pass through code-path inspection and available validation.

- the existing package-backed Events preview remains intact
- the current right Scripture Evidence Panel remains metadata-only
- the existing Reader-link flow remains reference-only
- verifier wrapper coverage for Books, Events, and Kings / Kingdoms remains intact
- no inspected code path introduced backend, schema, API, or runtime import/export coupling

## Guardrails Confirmed

- no Bible text rendered from Timeline packages
- no Bible text stored in the core events package
- no API, DB, backend, or schema changes
- no data-package row changes
- no runtime import/export changes
- no coordinates introduced
- no map-provider state introduced
- no geocoding introduced
- no Korean/world history layer expansion
- Timeline package verifier wrapper still passes

## Fixed Issues

- None required in this pass

## Known Limitations

- live browser interaction QA was not available in this environment
- local route smoke was unavailable from this environment
- `npm run build` was blocked by an environment-level Turbopack process/port binding restriction rather than a confirmed Events-preview code defect
