# Prophet-Context Expansion Authorization Review

## Date

2026-06-27

## Purpose

This document records the current authorization-review gate for any fuller prophet-context expansion in the Timeline Workspace.

It is a docs-only review step.

It does not authorize:

- new prophet rows
- new `propheticContextMarker` rows
- runtime-to-package promotion
- prophets package implementation
- prophet inspector selection types
- prophet deep-link support
- exact chronology or synchronism strengthening

## Current Baseline

Current active Kings / Kingdoms package baseline:

- source: `docs/data-packages/timeline/kings-kingdoms.skeleton.json`
- active package rows: `20`
- active `propheticContextMarker` rows: `0`

Current prophets package status:

- connected prophets package: none
- `docs/data-packages/timeline/prophets.sample.json` exists as a skeleton-only sample
- `items` is empty

Current frontend and package boundary:

- package-backed Kings / Kingdoms preview is connected
- runtime `timelineKingdomComparisonRows` still provides the current prophet-context-like supporting layer
- prophet labels remain supporting tags rather than standalone selectable entities

## Current Prophet-Context Source

Current prophet-context-like material is limited to runtime metadata surfaces:

- runtime `timelineKingdomComparisonRows`
- runtime `prophetTags`
- selected event metadata
- selected place metadata

Current package-backed baseline does not yet contain connected prophet rows or connected `propheticContextMarker` rows.

## Authorization Status

Fuller prophet-context expansion is not yet authorized.

Current local source-of-truth requirement:

- separate approval is required
- row-level review is required

This means candidate review may proceed in documentation, but implementation must not start from this CR.

## Candidate Inventory

Current runtime Kings / Kingdoms comparison rows with explicit `prophetTags`:

### Review-Ready Candidate

These candidates already show explicit Scripture anchors and remain reasonably narrow as metadata-only supporting context, so they are ready for a later row-level authorization decision.

- `comparison-samuel-monarchy`
- `comparison-saul`
- `comparison-david`
- `comparison-ahab-elijah`
- `comparison-northern-exile-assyria`
- `comparison-hezekiah-assyria`
- `comparison-jerusalem-babylon`

Review-ready in this document does not mean approved for implementation. It only means the candidate is narrow enough to review later without first inventing a broader package model.

### Needs-More-Source-Review

These candidates currently look plausible as supporting context, but they need more review before any package-level decision because they compress broader overlap, dynasty framing, superscription linkage, or late-monarchy interpretive framing.

- `comparison-asa-judah`
- `comparison-jehoshaphat-judah`
- `comparison-jeroboam-ii`
- `comparison-uzziah-azariah`
- `comparison-ahaz-judah`
- `comparison-josiah-judah`
- `comparison-jehoiakim-judah`

Needs-more-source-review means:

- the current runtime wording may be acceptable as a supporting preview
- the package-level promotion decision is not ready
- chronology and prophetic-overlap framing need closer scrutiny

### Separate-Approval-Required

These candidates especially depend on prophet-context framing, dynastic compression, or caution-heavy overlap and therefore require separate approval even before any later package-level authorization step is attempted.

- `comparison-omri-ahab`
- `comparison-jehu-northern-israel`

Separate-approval-required means these candidates should not be treated as ordinary king-sequence additions.

### Blocked-For-Now

The following are blocked-for-now as implementation directions rather than candidate rows:

- any new standalone prophet row
- any new `propheticContextMarker` row
- any runtime comparison row promoted directly into the package without separate row-level authorization
- any prophets package implementation or connection
- any prophet-first inspector selection type
- any prophet deep-link support

## Required Review Questions

Every future candidate must be reviewed against these questions:

1. Does the candidate have explicit Scripture anchors?
2. Is the candidate still metadata-only?
3. Does it avoid Bible text storage and rendering?
4. Does it avoid exact chronology or synchronism overclaim?
5. Does it avoid making prophet context a primary interpretive authority over Scripture?
6. Would it require a new prophet row, a new `propheticContextMarker` row, or a new package type?

If the answer to question 6 is yes, the candidate must not move forward without separate approval first.

## Current UI Boundary

Current UI handling keeps prophet context secondary:

- the Kings / Kingdoms preview copy states that prophet labels remain supporting context tags only
- the right panel labels prophet tags as supporting context markers
- the current inspector does not expose prophets as a primary selection type
- current deep-link restore does not support a prophet inspect type

This boundary must remain unchanged unless a later separately approved CR explicitly changes it.

## Explicitly Not Authorized

This review does not authorize:

- new prophet rows
- new `propheticContextMarker` rows
- runtime-to-package promotion
- prophets package implementation
- prophet inspector selection type
- prophet deep-link support
- exact chronology strengthening
- synchronism strengthening
- API changes
- DB changes
- backend changes
- schema changes
- runtime import/export changes

## Required Next Authorization Step

Before any implementation CR begins, a later authorization step must explicitly decide:

- which review-ready candidates are approved for package-level expansion
- which needs-more-source-review candidates remain deferred
- which separate-approval-required candidates stay out of scope
- whether any implementation can proceed without introducing new prophet rows or new package types

Until that later authorization decision exists, fuller prophet-context expansion remains deferred.

## Guardrails

All future prophet-context work must preserve:

- metadata-only behavior
- no Bible text storage or rendering
- no exact chronology overclaim
- no unsupported synchronism
- no prophet-first interpretive authority
- no coordinates
- no map-provider fields
- no geocoding
