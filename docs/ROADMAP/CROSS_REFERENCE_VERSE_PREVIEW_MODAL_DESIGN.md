# Cross Reference Verse Preview Modal Design

Date: 2026-06-22

## Purpose

CR-33 designs a Bible Reader UX where a user can inspect a Cross Reference target passage without leaving the current reading context.

When a user clicks a target reference in the Related Passages panel, WCM should open a modal/dialog that shows only the referenced Bible text for the current Bible version. The Cross Reference layer remains reference-only; it does not store or duplicate Bible text.

This document is design only. It does not implement frontend code, change backend APIs, write data, import data, change schema, add migrations, or touch staging/production.

## UX Flow

Recommended first flow:

1. User opens the Bible Study Workspace.
2. User selects a verse.
3. The Related Passages panel lists target references from the Cross Reference API.
4. User activates a target reference text or a `View passage` / `본문 보기` button.
5. A modal opens in the current reader view.
6. The frontend lazily fetches the target passage text using the current Bible version.
7. The modal displays the reference title, version, and verse text.
8. User may close the modal or choose `Open in Reader` / `성경 본문으로 이동`.
9. Closing returns focus to the trigger.
10. Opening in Reader navigates to the target chapter and verse anchor.

The modal is a preview surface, not a replacement for the full Bible Reader.

## Trigger

Recommended trigger:

- Target reference text may open the preview modal.
- A dedicated `View passage` / `본문 보기` button may also open the modal.
- The whole card should not become a modal trigger because that weakens keyboard and screen-reader clarity.

Accessibility policy:

- If the reference text opens the modal, use button semantics rather than a navigation link.
- If a separate navigation link is present, label it clearly as `Open in Reader` / `성경 본문으로 이동`.
- Avoid using one visual element for both modal open and route navigation.

## Data Policy

The Cross Reference data boundary remains unchanged:

- `wcm_cross_references` stores references and metadata only.
- It does not store Bible text.
- It does not duplicate KRV, WEB, or any future Bible version text.
- Modal passage text must be fetched at runtime from the existing Bible API.

Version policy:

- In a KRV reader route, preview target text uses KRV.
- In a WEB reader route, preview target text uses WEB.
- If the current version is unavailable for the target passage, the modal shows a localized error or unavailable state.
- The modal must not silently fall back to a different Bible version without a visible label.

## API Needs

Use the existing Bible API first.

First implementation should fetch the target chapter through the existing chapter endpoint and slice the target verse or same-chapter range on the frontend:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Rationale:

- The Reader already depends on chapter-level Bible API behavior.
- Cross Reference target rows are reference-only.
- Most first-phase previews can be single-verse or same-chapter ranges.
- No new API is required for CR-34 if chapter fetch is sufficient.

Future API consideration:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}/{verse}
GET /wp-json/wcm/v1/bible/{version}/{book}/{startChapter}/{startVerse}-{endChapter}/{endVerse}
```

A future range endpoint may be useful if previewing long or cross-chapter ranges becomes common, but it should be separately approved.

## Modal Content

The modal should include:

- Reference title, for example `John 3:16` / `요한복음 3:16`.
- Bible version, for example `WEB` or `KRV`.
- Verse number and verse text.
- Loading state.
- Error state.
- Empty or unavailable state.
- Close button.
- `Open in Reader` / `성경 본문으로 이동` link.

The modal should not include:

- Cross Reference source score.
- Full related-passage list duplication.
- The full target chapter unless the target range requires it and remains within limits.
- Any interpretive label beyond the existing relationship metadata.

## Range Policy

Supported in first implementation:

- Single verse.
- Same-chapter verse range.

Deferred:

- Same-book cross-chapter ranges.
- Cross-book ranges.
- Long range preview.

Preview limit policy:

- If a range is too long, show a bounded preview or an unavailable preview message with an `Open in Reader` link.
- Suggested first limit: no more than `10` verses in the modal.
- Long ranges should push users to the full Reader route instead of expanding the modal into a second reader.

Cross-chapter policy:

- First implementation may defer cross-chapter previews and route users to `Open in Reader`.
- If implemented later, cross-chapter previews must use bounded fetches and visible loading states.

## Navigation Policy

`Open in Reader` / `성경 본문으로 이동` should navigate to:

```txt
/{locale}/bible/{version}/{target_book}/{target_start_chapter}?mode=reader#v{target_start_verse}
```

Navigation rules:

- Preserve current locale.
- Preserve current Bible version.
- Use target book and start chapter.
- Apply `#v{target_start_verse}` anchor.
- Use `mode=reader`.

The preview modal trigger and full-reader navigation should remain separate actions.

## Accessibility

Required modal behavior:

- Use dialog semantics, preferably `role="dialog"` with `aria-modal="true"`.
- Provide a visible title and connect it with `aria-labelledby`.
- Provide a close button with localized accessible label.
- Support `Escape` close.
- Return focus to the trigger after close.
- Keep keyboard focus inside the modal while open, or at minimum prevent focus from falling behind the modal.
- Make target text readable at mobile widths.
- Ensure the backdrop click, if used, does not become the only close mechanism.

Mobile behavior:

- Use a centered modal or bottom-sheet style depending on existing reader patterns.
- Keep content scrollable inside the modal.
- Avoid horizontal overflow for long references.

## Performance

Policy:

- Fetch passage text only after the user opens a preview.
- Do not prefetch text for every Cross Reference card.
- Do not include Bible text in the Cross Reference API response by default.
- Bound range length.
- Show a loading indicator while text fetch is in progress.
- Optional viewed-preview caching may be added later in component state, but must not introduce global cache complexity in the first implementation.

Failure behavior:

- API failures should show a localized error inside the modal.
- Missing verses should show an unavailable state.
- The current Bible Reader page should not crash if preview fetch fails.

## UX Copy

Recommended Korean labels:

```txt
본문 보기
성경 본문으로 이동
닫기
본문을 불러오는 중입니다...
본문을 불러오지 못했습니다.
이 번역본에서 본문을 찾을 수 없습니다.
```

Recommended English labels:

```txt
View passage
Open in Reader
Close
Loading passage...
Unable to load passage.
This passage is unavailable for the selected version.
```

## Risks

### Overfetch

Fetching full chapters for multiple preview opens can become expensive if users open many cards. Lazy fetch and bounded ranges reduce this risk.

### Long Range Clutter

Long ranges can turn the modal into a second Bible Reader. First implementation should limit preview length and provide an `Open in Reader` link.

### Modal Accessibility

Poor focus management would regress keyboard and screen-reader usability. CR-34 should treat dialog semantics, Escape close, and focus return as required.

### Bible API Range Limitation

The existing chapter endpoint can support single-verse and same-chapter range slicing, but same-book cross-chapter ranges may need a future endpoint or multiple bounded chapter fetches.

### User Confusion

Users may confuse preview with the full study view if the modal has too many controls. Keep the modal compact and provide a clear route to the full Reader.

### Version Availability

If a target passage is missing in WEB due to approved omissions or source differences, the modal must show an unavailable state instead of inventing text or switching versions silently.

## Non-Actions

This phase does not:

- Implement the modal.
- Change frontend runtime behavior.
- Change backend APIs.
- Add a range endpoint.
- Write to the database.
- Import data.
- Change schema.
- Add migrations.
- Touch staging or production.

## Final Recommendation

Proceed to:

```txt
CR-34 Cross Reference Verse Preview Modal Implementation Approval Review
```

Recommended CR-34 approval review focus:

- Confirm existing Bible chapter API is sufficient for first implementation.
- Approve single-verse and same-chapter range preview only.
- Require accessibility behavior before implementation.
- Keep modal preview and full-reader navigation as separate controls.
- Keep Cross Reference API reference-only.

