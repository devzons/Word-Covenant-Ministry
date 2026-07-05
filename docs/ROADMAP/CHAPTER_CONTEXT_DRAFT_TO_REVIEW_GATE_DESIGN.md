# Chapter Context Draft-to-Review Gate Design

## Purpose

This document defines the author self-check gate that must pass before a chapter-context pilot row can move from `draft` to `review-required`.

The goal is to standardize when a row is ready for a separate reviewer or acceptance CR without changing the current package maturity, runtime behavior, or review status in this design step.

## Current Package State

- Package file: `docs/data-packages/timeline/chapter-context.skeleton.json`
- Package version: `0.2.0-pilot`
- Package status: `pilot`
- Current row count: `4`
- Current row review status: all rows remain `draft`
- Current row skeleton status: all rows remain `isSkeleton: false`

This CR is docs-only. No row content, package maturity, or review state changes are authorized here.

## Current Pilot Rows

- `Genesis 1`
- `Genesis 3`
- `Exodus 12`
- `Matthew 13`

## Draft Row Meaning

A `draft` row is an author-owned pilot row that already matches the accepted chapter-context package shape but has not yet passed the required author self-check gate for reviewer handoff.

Draft rows must remain chapter-level preview metadata only.

## Author Self-Check Purpose

The author self-check exists to prevent premature promotion of a pilot row into a reviewer queue when the row still has unresolved scope, wording, relation, or safety problems.

The self-check is not a reviewer substitute. It is the minimum internal quality gate before a separate reviewer or acceptance CR evaluates the row.

## Minimum Self-Check Criteria

Each candidate row must satisfy all of the following:

- The row still matches the accepted chapter-context row shape and required fields.
- `id` and `chapterContextId` remain deterministic and stable.
- `bookId` is canonical and `chapter` matches the actual canonical chapter number.
- `scriptureAnchors` are non-empty and remain reference-only.
- `reviewStatus` remains accurate for the current stage.
- `summary`, `basisLabel`, `confidenceLabel`, and `cautionNote` stay restrained and chapter-level.
- Related ids remain conservative and reference existing package ids only.
- Empty relation arrays must not be interpreted as proof that no relation exists.
- The row remains free of forbidden scope fields or implied runtime state.

## Required Checks Before `review-required`

Before promotion, the author must verify:

1. Shape check: all required fields are present and no unauthorized fields have been introduced.
2. Boundary check: no Bible text, commentary prose, verse-level tagging, selected-verse filtering, entity resolver state, coordinates, map-provider fields, or chronology overclaim may be introduced.
3. Wording check: the row does not claim complete context, final interpretation, exact chronology, or reviewer-approved certainty.
4. Relation check: every non-empty related-id array uses only existing package ids and avoids guessed ids.
5. Draft-state check: the wording still reflects pilot-draft caution rather than reviewed acceptance.
6. Verifier check: the package passes the current verifier without introducing avoidable warnings for the row under review.

## Conditions That Allow Promotion To `review-required`

Promotion is allowed only when all required checks pass and no unresolved blocker remains.

`review-required` means the author self-check has passed and the row is ready for a separate reviewer/acceptance CR.

Promotion is appropriate when:

- The row is structurally valid.
- The row stays within chapter-level metadata boundaries.
- The wording is cautious, concise, and non-exhaustive.
- Non-empty relation ids are verified against existing packages.
- The row contains no Bible text or verse-selection behavior.
- The row passes current verifier expectations without unresolved warnings that should have been prevented in authoring.

## Conditions That Block Promotion

Promotion must be blocked when any of the following is true:

- The row contains invalid shape, missing required fields, or unstable identity.
- The row includes invented or unverified related ids.
- The row implies exact chronology, final interpretation, or reviewed certainty.
- The row introduces forbidden scope such as Bible text, commentary prose, verse-level tagging, selected-verse filtering, entity resolver state, coordinates, or map-provider behavior.
- The row depends on future package work such as place-package linkage or Timeline Kingdom extraction to make its current wording safe.
- The row still produces verifier failures or avoidable warnings.

## Conditions That Require Row Correction While Staying `draft`

The row must remain `draft` and be corrected first when:

- A typo, mislabeled chapter, or canonical `bookId` mismatch is found.
- `scriptureAnchors` are empty, malformed, or not reference-only.
- `basisLabel`, `confidenceLabel`, or `cautionNote` overstate certainty.
- `summary` drifts into sermon prose, commentary prose, or selected-verse interpretation.
- A relation should be removed because it cannot be safely verified yet.
- The row passes shape checks but still needs wording tightening before reviewer handoff.

## What `review-required` Does Not Mean

`review-required` does not mean the row is reviewed, accepted, or runtime-ready.

It does not authorize:

- Reader UI hookup
- runtime loader hookup
- API or backend changes
- DB or schema changes
- Bible text storage or rendering
- verse-level tagging
- selected-verse-driven metadata filtering

## What `reviewed` Requires Later

`reviewed` is forbidden until a later explicit review/acceptance CR.

That later CR must confirm at minimum:

- the author self-check result is sound
- the row wording is reviewer-acceptable
- the relation choices are appropriately conservative
- the row remains within package scope
- any row-specific cautions or blockers have been resolved or explicitly accepted

## Explicit Exclusions

This gate design does not authorize:

- new pilot rows
- package version changes
- package status changes
- `draft` to `review-required` changes in this CR
- `review-required` to `reviewed` changes
- verifier code changes
- fixture changes
- Reader/runtime hookup
- API/backend/DB/schema changes
- Bible text storage/rendering
- person, paja, or original-language name-atlas state
- place package, coordinates, map, provider, or geocoding fields
- Timeline Kingdom extraction

## Validation Plan

For later self-check execution CRs, validate with:

```bash
node scripts/timeline/verify-timeline-packages.mjs
node scripts/timeline/verify-timeline-package.mjs docs/data-packages/timeline/chapter-context.skeleton.json
git diff --check
git status --short
```

The author self-check should prefer zero avoidable warnings for rows proposed for promotion.

## Next CR Recommendation

Recommended next CR:

`CR-BR-CTX-50 Chapter Context Author Self-Check Execution`

Recommended scope:

- inspect the current `4` pilot draft rows against this gate
- keep all non-passing rows at `draft`
- promote to `review-required` only if the self-check criteria are fully satisfied
- continue to defer Reader/runtime hookup, verifier changes, fixture changes, verse-level tagging, selected-verse filtering, place-package work, and Timeline Kingdom extraction
