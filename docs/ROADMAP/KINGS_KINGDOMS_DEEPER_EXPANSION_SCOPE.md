# Kings / Kingdoms Deeper Expansion Scope

## Date

2026-06-27

## Purpose

This document defines the current scope gate for any deeper Kings / Kingdoms Timeline data expansion after the current preview baseline.

It is a docs-only scope definition. It does not authorize package-row additions, runtime-to-package promotion, prophet-package work, or prophetic-context expansion.

## Current Baseline

Current package baseline source:

```txt
docs/data-packages/timeline/kings-kingdoms.skeleton.json
```

Current total rows:

- `20`

Current record-type distribution:

- `kingdomPeriod`: `5`
- `kingdom`: `3`
- `transition`: `2`
- `king`: `7`
- `templeMarker`: `1`
- `exileMarker`: `2`

Current active baseline does not include any connected `propheticContextMarker` rows.

## Current Frontend Status

Current frontend Timeline status is mixed:

- package-backed Kings / Kingdoms preview is connected through the Timeline route loader
- runtime `timelineKingdomComparisonRows` still exists as supporting comparison data
- data source is therefore mixed rather than fully package-backed

Current frontend-connected paths:

```txt
frontend/src/app/[locale]/timeline/page.tsx
frontend/src/components/scripture/timeline/timelineKingsKingdomsPackage.ts
frontend/src/components/scripture/timeline/TimelinePageShell.tsx
frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx
```

Current scope boundary:

- package-backed rows provide the current accordion-first Kingdoms baseline
- runtime comparison rows still provide selective supporting comparison coverage
- prophet labels remain supporting tags rather than standalone selectable entities

## Current Verifier Coverage

Current verifier coverage is already strong enough to guard the existing package baseline.

Verified guardrail areas:

- Bible text guardrail
- coordinate and map-provider guardrail
- relation validation
- exact chronology review gating

Current verifier and wrapper paths:

```txt
scripts/timeline/verify-timeline-package.mjs
scripts/timeline/verify-timeline-packages.mjs
```

Current Kings-specific fixture coverage includes:

- valid relation samples
- invalid broken-link samples
- invalid Bible-text samples
- invalid coordinate samples
- invalid exact-chronology-without-review samples
- warning-level approximate-date / low-confidence / missing-reign-label samples

Verifier readiness does not equal row-level authorization. It only confirms that the current package structure and guardrails can be checked consistently.

## Expansion Categories

This scope gate defines future categories for review. These are not approvals.

### Future-Review King Candidates

Potential future additions may include more king rows only when all of the following are true:

- the row is Scripture-anchored
- relation targets are explicit and stable
- chronology wording remains cautious
- the row adds metadata-only value to the current package baseline

No specific future king candidate is approved by this document.

### Future-Review Transition Candidates

Potential future additions may include more transition rows only when all of the following are true:

- the dynastic or kingdom-state change is explicit in Scripture context
- predecessor/successor or state links can be represented safely
- the row does not require speculative synchronism

No specific future transition candidate is approved by this document.

### Separate-Approval-Required Prophet-Context Candidates

Any candidate whose main value depends on prophetic-context framing must stay outside automatic package expansion and requires separate approval plus row-level review first.

This includes candidates that would function mainly as:

- prophet-context rows
- prophet-driven review markers
- cross-links that depend on debated synchronism or caution-heavy historical compression

No prophet-context candidate is approved by this document.

### Out Of Scope Until Separately Approved

The following remain out of scope:

- new prophet rows
- new `propheticContextMarker` rows
- runtime comparison row promotion into package rows
- prophets package implementation
- exact-looking chronology upgrades
- stronger historical synchronization claims

## CR-91L / CR-91L-2 Handoff Status

Earlier handoff references to `CR-91L` and `CR-91L-2` are not part of the current local source of truth.

Current local source-of-truth review did not confirm:

- local roadmap documents for `CR-91L`
- local roadmap documents for `CR-91L-2`
- approved / hold / blocked candidate lists recorded in current roadmap files
- authorization commits that would allow row-level expansion based on those handoffs

Because those materials are not currently verified in the local roadmap, they must not be used as authorization for package expansion in this CR.

## Explicitly Not Authorized In This CR

This scope-definition CR does not authorize:

- data package row additions
- new king rows
- new prophet rows
- new prophetic-context rows
- runtime comparison row promotion to package rows
- prophet package implementation
- API changes
- DB changes
- backend changes
- schema changes
- runtime import/export changes

## Required Next Step

Before any deeper Kings / Kingdoms package expansion starts, the next required step is:

- row-level authorization review

That next review should decide, one row group at a time:

- which king candidates are safe for package addition
- which transition candidates are safe for package addition
- which prophet-context candidates remain separate-approval-required
- which items stay blocked or deferred

## Guardrails

All later expansion work must preserve these guardrails:

- metadata-only package expansion
- no Bible text storage or rendering
- no exact chronology overclaim
- no unsupported synchronism
- no forced prophetic-context expansion
- no external-history authority elevation over Scripture
- no coordinates
- no map-provider fields
- no geocoding
