# Word Study Cross Reference Frontend MVP Report

Date: 2026-06-23

## Current Phase

```txt
CR-39 - Word Study Cross Reference Frontend MVP
```

## Final Verdict

```txt
passed
```

CR-39 implemented and validated the Word Study Related Passages MVP in the local frontend.

## Implemented Scope

The CR-39 MVP is frontend-only and uses existing APIs only.

Implemented behavior:

- Adds Related Passages to Term Study.
- Uses Term Study `sample_occurrences` only.
- Limits lookup to maximum `3` sample occurrences.
- Limits display to maximum `3` related passages per occurrence.
- Loads Cross References only after explicit user intent through a lazy-load trigger.
- Reuses compact Related Passages cards.
- Reuses shared passage preview modal behavior.
- Preserves OpenBible / `theme` / `unreviewed` labels.
- Preserves OpenBible attribution.
- Uses the current Reader version for passage previews:
  - KRV route previews KRV text.
  - WEB route previews WEB text.
- Preserves locale/version-aware Open in Reader links.

Validated Open in Reader examples:

```txt
/ko/bible/KRV/john/1?mode=reader#v1
/en/bible/WEB/john/1?mode=reader#v1
```

## Shared Component Extraction

CR-39 extracted shared UI used by Reader Related Passages and Term Study Related Passages:

- `CrossReferenceItemCard`
- `CrossReferencePassagePreviewModal`

The extraction keeps Cross Reference behavior centralized:

- compact card layout
- `View passage` / `본문 보기` button
- `Open in Reader` / `성경 본문으로 이동` link
- reference formatting
- modal preview
- lazy Bible text fetch
- unsupported range fallback
- focus return to the trigger button

## Term Study Lazy Load

The Term Study Related Passages section does not fetch Cross References on initial Term Study load.

Flow:

```txt
Term Study
-> Related Passages section visible
-> user clicks load related passages
-> use up to 3 sample occurrences
-> fetch up to 3 related passages for each occurrence
-> render compact cards
```

This keeps drawer load bounded and avoids term-wide aggregation across high-frequency original-language terms.

## ESC Propagation Fix

Browser QA found a CR-39 regression:

```txt
ESC inside the passage preview modal also reached the parent Original Word drawer ESC handler.
```

Impact:

- The preview modal closed.
- The parent Word Study drawer also closed.
- Focus could not return to the triggering `View passage` / `본문 보기` button.

Fix:

- The shared passage preview modal now handles Escape during capture phase.
- It calls `preventDefault()` and `stopImmediatePropagation()` before closing.
- The parent Word Study drawer no longer receives the same Escape event.

Validated after fix:

- ESC closes only the preview modal.
- Parent Word Study drawer remains open.
- Focus returns to the triggering preview button.
- Body scroll cleanup still works.
- Close button behavior still works.

## Validation

Static validation passed:

```txt
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
git diff --check
```

Browser QA passed:

- Runtime route loaded on `wordcovenantministry.local:3030`.
- Interlinear word opened Original Word Panel.
- Strong Study opened.
- Term Study opened.
- Related Passages lazy-load trigger appeared.
- Related Passage cards did not render before lazy load.
- Lazy load rendered bounded related passage groups.
- Compact cards rendered OpenBible / theme / unreviewed labels.
- KRV preview worked.
- WEB preview worked.
- ESC close worked.
- Close button worked.
- Focus returned to triggering preview button.
- Body scroll cleanup worked.
- Open in Reader links preserved locale/version.
- Bible Reader Related Passages continued to work.
- No new React/runtime console errors were captured.

## Known Limitation

Strict unsupported-range fallback was not encountered in sampled Term Study QA.

Reader Related Passages QA checked the Genesis 1:1 related passage set and confirmed the available sampled ranges were supported. A dedicated unsupported-range fixture remains a CR-40 follow-up.

## Non-Actions

CR-39 did not change:

- backend API
- database schema
- imports
- migrations
- Cross Reference data
- Word Study backend endpoints
- staging or production

## Next Objective

```txt
CR-40 - post-MVP review, unsupported-range fixture validation, and Scripture Research integration planning
```
