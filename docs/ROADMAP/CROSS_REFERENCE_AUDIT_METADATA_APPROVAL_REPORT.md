# Cross Reference Audit Metadata Approval Report

Date: 2026-06-23

## Current Phase

CR-45 - Cross Reference Audit Metadata Schema Approval Review.

## Purpose

This document records the CR-45 approval review for the Cross Reference audit metadata design.

This is documentation only. It does not implement frontend behavior, backend behavior, API changes, DB/schema changes, imports, migrations, staging changes, or production changes.

## Approval Status

Approved with conditions.

The CR-44 audit metadata design is approved as the basis for future implementation planning, subject to the conditions below.

## Approved Metadata Model

Required for MVP review writes:

```txt
reviewed_by
reviewed_at
previous_review_status
review_source
```

Conditionally required:

```txt
review_reason
```

Rules:

- `review_reason` is required for `rejected`.
- `review_reason` is required for `suppressed`.
- `review_reason` is optional for `approved`.

Optional:

```txt
review_notes
```

## Controlled Review Reason Tokens

`review_reason` must be a controlled token in the MVP, not free text.

Approved first tokens:

```txt
accepted
not_relevant
too_broad
duplicate_like
confusing
pastorally_unhelpful
source_quality
other
```

Future taxonomy support should be anticipated, but no taxonomy implementation is approved in this phase.

## Required Revisions And Conditions

- `review_reason` should be a controlled token, not free text, in the MVP.
- `review_notes` may be free text but must be optional, internal-only, sanitized, and permission-protected.
- `previous_review_status` is required if no review history table exists in the MVP.
- `review_source` should be included from the start, with default value `manual`.
- API status vocabulary must align before `suppressed` is used in filters or public behavior.
- Existing imported rows must not receive fake reviewer metadata.
- Schema direction must be additive and latest-state-only for the MVP.
- Public visibility behavior must not change during the metadata migration.

## Deferred Metadata Model

Deferred:

- `wcm_cross_reference_reviews` review history table
- `curated_rank`
- `visibility_scope`
- `review_batch_id`
- relationship-type review/editing
- multi-review workflow
- bulk actions
- public reviewed-only filtering
- future `review_reason` taxonomy implementation

The future review-history table remains the preferred long-term direction once review volume, multi-review workflow, or bulk actions become real requirements.

## Audit And Security Notes

Audit requirements:

- Review writes must identify who made the decision.
- Review writes must record when the decision was made.
- Review writes must preserve the previous status.
- Review writes must preserve source and package metadata.
- Review writes must never store Bible text in Cross Reference tables.

Security requirements for future implementation:

- Review writes must be admin/editor-only.
- Free-text `review_notes` must be sanitized.
- Internal notes must not be exposed in public APIs by default.
- Bulk actions require confirmation and rollback planning.

## Editorial Notes

The approval does not change WCM's public interpretation policy:

- OpenBible `theme` / `unreviewed` rows remain source-backed discovery data, not WCM conclusions.
- `approved` means the relationship is accepted for display, not that it exhausts the meaning of either passage.
- Rejection and suppression decisions require traceable reasons.
- Relationship-type editing remains deferred.

## Final Recommendation

Proceed to CR-46 Cross Reference Audit Metadata Schema Implementation Approval Review.

Future implementation should remain:

- additive
- latest-state-only
- local-first
- separate from public visibility changes
- separate from admin review UI implementation

## Non-Actions

This phase did not perform:

- frontend implementation
- backend implementation
- API change
- DB write
- schema change
- migration
- import
- staging change
- production change
