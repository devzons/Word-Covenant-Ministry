# Cross Reference Verse Preview Modal Implementation Report

Date: 2026-06-22

## Purpose

This document records CR-35 Cross Reference Verse Preview Modal Implementation.

The implementation adds a frontend-only passage preview modal to the Bible Study Workspace Related Passages panel. It does not change backend APIs, write data, import data, change schema, add migrations, store Bible text in Cross Reference data, integrate Word Study, integrate Gospel Harmony, or touch staging/production.

## Files Changed

```txt
frontend/src/components/scripture/CrossReferencePanel.tsx
docs/ROADMAP/CROSS_REFERENCE_VERSE_PREVIEW_MODAL_IMPLEMENTATION_REPORT.md
```

## Modal Implementation

Implemented:

- Added `View passage` / `본문 보기` button to each Related Passages item.
- Kept `Open in Reader` / `성경 본문으로 이동` as a separate navigation link.
- Added modal/dialog preview for target passage text.
- Added loading state.
- Added error state.
- Added unsupported range state.
- Added unavailable passage state.
- Added close button.
- Added Escape close.
- Added focus return to the trigger.
- Added body scroll lock while modal is open.

Not implemented:

- Backend API changes.
- Cross Reference API `include_text`.
- Bible text storage in Cross Reference data.
- Word Study integration.
- Gospel Harmony integration.
- Cross-chapter preview.
- Long range preview.

## Data Fetch Policy

Preview text is fetched lazily only after the user opens a modal.

The implementation uses the existing Bible chapter API helper:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Policy:

- KRV reader routes preview KRV text.
- WEB reader routes preview WEB text.
- The chapter response is filtered client-side to the target verse/range.
- Bible text is kept only in component state/cache for the current session.
- Cross Reference API responses remain reference-only.
- Cross Reference DB/API do not receive Bible text fields.

## Range Policy

Supported:

- Single verse.
- Same-chapter range.

Limits:

- Maximum preview length is `10` verses.
- Cross-chapter ranges are not previewed in this phase.
- Unsupported ranges show a friendly message and keep the `Open in Reader` link available.

## Accessibility

Implemented:

- Dialog semantics with `role="dialog"`.
- `aria-modal="true"`.
- Visible modal title connected with `aria-labelledby`.
- Close button.
- Localized close labels.
- Escape close.
- Focus return to the triggering button after close.
- Keyboard-accessible `View passage`, `Open in Reader`, and close controls.

## Validation Results

Passed:

```txt
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
git diff --check
```

Results:

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.

## Smoke Tests

HTTP route smoke:

```txt
/en/bible/WEB/genesis/1
/ko/bible/KRV/genesis/1
```

Results:

- `http://127.0.0.1:3030/en/bible/WEB/genesis/1`: HTTP 200.
- `http://127.0.0.1:3030/ko/bible/KRV/genesis/1`: HTTP 200.

Recommended CR-36 browser validation:

- `View passage` / `본문 보기` button appears.
- Modal opens.
- Current Bible version is shown.
- Verse text renders from the current Bible version.
- `Open in Reader` link remains available.
- Escape closes the modal.
- Focus returns to the trigger.
- Unsupported ranges show the unsupported-range state.

## Final Verdict

```txt
modal_implementation_passed
```

## Next Objective

```txt
CR-36 Cross Reference Verse Preview Modal Validation
```

## Known Constraints

- Interactive browser validation remains required.
- Cross-chapter range preview remains deferred.
- Preview uses current chapter fetch and client-side slicing.
- Cross Reference imported rows remain `relationship_type=theme` and `review_status=unreviewed`.
