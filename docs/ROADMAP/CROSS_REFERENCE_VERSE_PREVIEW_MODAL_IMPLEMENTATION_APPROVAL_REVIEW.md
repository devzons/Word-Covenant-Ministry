# Cross Reference Verse Preview Modal Implementation Approval Review

Date: 2026-06-22

## Purpose

CR-34 reviews whether the Cross Reference Verse Preview Modal design is ready for implementation.

This review evaluates UX, data boundaries, API sufficiency, range handling, accessibility, mobile behavior, performance, and risk before any modal code is written.

This document is review only. It does not implement the modal, change frontend runtime behavior, change backend APIs, write data, import data, change schema, add migrations, or touch staging/production.

## Current State

Completed prerequisites:

```txt
Cross Reference MVP: complete
Reader API: implemented
Reader Frontend Integration: complete
Frontend Validation: complete with recorded limitations
Verse Preview Modal Design: complete
```

Current behavior:

- Related Passages displays reference-only Cross Reference targets.
- The Cross Reference API does not include Bible text.
- Target references currently navigate to the Reader.
- Users want a way to preview the target passage without leaving the current Reader context.

## UX Audit

### View Passage / 본문 보기

Verdict:

```txt
sufficient with conditions
```

`View passage` / `본문 보기` is the correct action for opening a modal preview.

Implementation conditions:

- Use a button, not a plain link, when the action opens a dialog.
- Keep the label near the target reference.
- Do not make the entire card clickable.
- Keep the modal preview action visually distinct from full Reader navigation.

### Open in Reader / 성경 본문으로 이동

Verdict:

```txt
sufficient
```

`Open in Reader` / `성경 본문으로 이동` should remain a normal navigation link.

Implementation conditions:

- Preserve locale.
- Preserve current Bible version.
- Navigate to target book and chapter.
- Use `mode=reader`.
- Apply `#v{target_start_verse}`.

Recommended route:

```txt
/{locale}/bible/{version}/{target_book}/{target_start_chapter}?mode=reader#v{target_start_verse}
```

## Data Boundary Audit

Verdict:

```txt
sufficient
```

The design preserves the Cross Reference data boundary:

- `wcm_cross_references` remains reference-only.
- Bible text is not stored in the Cross Reference table.
- Bible text is not added to Cross Reference API responses by default.
- Modal text is fetched at runtime from the existing Bible API.

Implementation conditions:

- Do not add Bible text fields to Cross Reference types.
- Do not use Cross Reference API `include_text`.
- Do not add Bible text to the Cross Reference API response.
- Do not cache preview text in persistent storage.

## API Audit

### Existing Chapter Endpoint

Reviewed endpoint:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Verdict:

```txt
existing API sufficient
```

The existing chapter endpoint is sufficient for first implementation because CR-35 should support only:

- single verse preview
- same-chapter range preview

Implementation approach:

1. Fetch the target chapter for the current Bible version.
2. Filter verses by target start/end verse.
3. Render only the selected verse/range.
4. Show unavailable state if the verse is absent.

### New API Requirement

Verdict:

```txt
new API not required for first implementation
```

A future range endpoint may be useful, but it is not required for CR-35.

New API should remain out of scope unless later approved for:

- same-book cross-chapter range preview
- long range preview
- server-side verse range slicing

## Range Audit

### Single Verse

Verdict:

```txt
approved for first implementation
```

Single-verse previews are the safest MVP behavior.

### Same-Chapter Range

Verdict:

```txt
approved with limit
```

Same-chapter ranges may be previewed if bounded.

Condition:

```txt
maximum preview length: 10 verses
```

If a target range exceeds the preview limit, the modal should show a short unavailable/too-long message and provide `Open in Reader`.

### Cross-Chapter / Cross-Book Range

Verdict:

```txt
defer
```

Cross-chapter and cross-book range preview should be deferred because the existing first-phase plan depends on chapter fetch and simple slicing.

Policy:

- Do not fetch multiple chapters in CR-35.
- Do not construct cross-book previews.
- Route users to `Open in Reader` for unsupported ranges.

## Accessibility Audit

Verdict:

```txt
ready with required conditions
```

CR-35 implementation must include:

- `role="dialog"` or native dialog semantics.
- `aria-modal="true"`.
- Visible modal title connected with `aria-labelledby`.
- Close button with localized accessible label.
- Escape close.
- Focus return to the trigger.
- Keyboard-accessible `View passage`, close, and `Open in Reader` controls.
- Basic focus containment while modal is open.

Required implementation check:

- Do not ship the modal without Escape close and focus return.
- Do not rely only on backdrop click for closing.

## Mobile Audit

Verdict:

```txt
ready with conditions
```

Implementation conditions:

- Modal must fit narrow mobile widths.
- Modal body must scroll independently when content is taller than viewport.
- Long references and version labels must wrap.
- `Open in Reader` and `Close` controls must remain reachable.
- Attribution or source notes should not crowd the main verse text.

Recommended mobile layout:

- Use a constrained modal or bottom-sheet pattern consistent with existing drawer behavior.
- Keep text preview compact.
- Avoid horizontal overflow.

## Performance Audit

Verdict:

```txt
ready with conditions
```

Required performance policy:

- Lazy fetch only after user action.
- No prefetch for all Related Passages cards.
- No unbounded range fetch.
- No Cross Reference API text inclusion.
- Loading state while fetching.
- Bounded text rendering.

Optional:

- Component-local cache for already viewed previews may be considered, but it is not required for CR-35.

## Risk Review

### Long Range Clutter

Risk:

Long ranges could turn the modal into a second Reader.

Mitigation:

- Limit first implementation to single verse and same-chapter ranges.
- Cap preview length at `10` verses.
- Use `Open in Reader` for longer ranges.

### Excessive Fetches

Risk:

Opening many previews could trigger repeated chapter fetches.

Mitigation:

- Lazy fetch only.
- Optional component-local cache.
- No prefetching every card.

### Modal Accessibility

Risk:

Poor focus behavior would make the UI harder for keyboard and screen-reader users.

Mitigation:

- Require Escape close.
- Require focus return.
- Require accessible close label.
- Require dialog semantics.

### Version Mismatch

Risk:

Preview might show a different version than the current Reader.

Mitigation:

- Always use the current `translation` value.
- Show version in the modal.
- Do not silently fallback to another version.

### API Overuse

Risk:

Modal could become an accidental workaround for range APIs.

Mitigation:

- Use existing chapter endpoint only for bounded first-phase preview.
- Defer multi-chapter and long-range support.

## Final Verdict

```txt
Ready With Conditions
```

## Approval Conditions For CR-35

CR-35 may implement the modal if it stays within these constraints:

- Frontend-only.
- Existing Bible chapter API only.
- No backend API changes.
- No DB write.
- No import.
- No schema or migration changes.
- No staging or production changes.
- Single verse and same-chapter ranges only.
- Maximum preview length of `10` verses.
- Runtime fetch from current Bible version.
- No Bible text duplication in Cross Reference data/API.
- Required accessibility behavior included.

## Next Objective

```txt
CR-35 Cross Reference Verse Preview Modal Implementation
```

CR-35 should be implemented only after explicit approval.

