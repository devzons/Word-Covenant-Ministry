# Cross Reference Verse Preview Modal Validation Report

Date: 2026-06-23

## Purpose

This document records CR-36 Cross Reference Verse Preview Modal Validation.

This phase validated the API-backed Related Passages panel and the verse preview modal in the local development environment. It did not change backend APIs, write data, import data, change schema, add migrations, or touch staging/production.

## Runtime Recovery

The local frontend runtime was recovered on the official project host:

```txt
http://wordcovenantministry.local:3030
```

Validation confirmed:

- Runtime hydration works on the official host.
- Bible Study Workspace research panel tabs are interactive.
- Related Passages activates and renders.
- No repeated HMR websocket failure was observed during official-host browser validation.

## API Baseline

Read-only Cross Reference API baseline passed:

```txt
GET /wp-json/wcm/v1/cross-references/genesis/1/1  -> total=61
GET /wp-json/wcm/v1/cross-references/john/3/16    -> total=23
GET /wp-json/wcm/v1/cross-references/romans/8/28  -> total=43
```

The API remains reference-only and includes OpenBible attribution metadata.

## Modal Validation

Passed:

- Genesis 1:1 preview.
- John 3:16 preview.
- WEB preview.
- KRV preview.
- Unsupported range fallback.
- Open in Reader navigation.
- Escape close.
- Close button close.
- Dialog semantics.
- Overlay/body scroll cleanup.
- Focus return to the triggering `View passage` / `본문 보기` button.
- No React console errors captured.

## Focus Return Fix Summary

CR-36 initially failed because closing the modal returned focus to `BODY` instead of the triggering preview button.

The fix:

- Stores the actual clicked preview button via `event.currentTarget`.
- Restores focus after modal close on the next animation frame.
- Guards focus restoration with:
  - element exists
  - `document.contains(element)`
  - `typeof element.focus === "function"`
- Applies to Escape close, close button close, overlay close, unsupported fallback close, and Open in Reader close.

## Interlinear Typography Improvement Summary

During CR-36 follow-up UX work, Interlinear original-language typography was refined without changing Original Language View:

- Hebrew Interlinear text remains enlarged for readability.
- Greek Interlinear text was restored to its previous visual size.
- A Greek font fallback class was added for polytonic Greek display:

```txt
"Gentium Plus", "Noto Serif", "New Athena Unicode", serif
```

- Transliteration remains improved at approximately `13px` with `leading-5`.
- Tooltip gloss typography remains unchanged.
- Original Language View typography remains unchanged.

## Validation Commands

Passed:

```txt
cd frontend && npm run typecheck
cd frontend && npm run lint
git diff --check
```

Browser QA passed on:

```txt
/en/bible/WEB/genesis/1
/ko/bible/KRV/genesis/1
/en/bible/WEB/john/3
/en/bible/WEB/matthew/13
```

## Final Verdict

```txt
modal_validation_passed
```

## Next Objective

```txt
CR-37 Word Study Cross Reference Integration Design
```

## Known Constraints

- Staging and production remain unchanged.
- Cross Reference imported rows remain `relationship_type=theme` and `review_status=unreviewed`.
- Automated labels such as quotation, fulfillment, typology, or prophecy fulfillment remain prohibited for OpenBible imported rows.
- Word Study Cross Reference integration is not implemented yet.
- Gospel Harmony Cross Reference integration is not implemented yet.
