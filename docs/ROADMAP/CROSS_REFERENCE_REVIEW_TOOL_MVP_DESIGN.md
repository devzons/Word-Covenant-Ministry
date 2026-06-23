# Cross Reference Review Tool MVP Design

Date: 2026-06-23

## Current State

The Cross Reference MVP is complete locally:

- `wp_wcm_cross_references` contains `341,176` OpenBible relationships.
- Imported rows are reference-only and store no Bible text.
- Current imported values are `relationship_type = theme`, `review_status = unreviewed`, `source_dataset = openbible`, and `confidence = source_backed`.
- Reader Related Passages and Word Study Related Passages consume the existing read-only API.
- The current API supports bounded source-verse lookup and filters for `relationship_type` and `review_status`.

Current schema already includes:

- source and target reference fields
- `relationship_type`
- `source_dataset`
- `source_score`
- `confidence`
- `review_status`
- `package_id`
- `source_checksum`
- `relationship_identity_hash`
- `created_at`
- `updated_at`

Current schema does not include:

- reviewer identity
- reviewed timestamp
- review notes
- review reason
- review history

## Purpose

This document defines the minimum viable Cross Reference review tool. The goal is to let WCM review imported OpenBible relationships without creating broad editorial tooling, changing public behavior prematurely, or introducing complex theological classification workflows.

The first review tool should manage review status only.

## MVP Review Workflow

The MVP workflow is status-only:

1. Editor opens a review queue.
2. Editor filters imported references by source passage, source dataset, review status, and source score.
3. Editor previews the source and target passages using existing Bible API behavior.
4. Editor chooses one status:
   - `approved`
   - `rejected`
   - `suppressed`
5. The tool records reviewer metadata.
6. The source/provenance fields remain unchanged.

The workflow should not change relationship type in the first MVP.

### Allowed MVP Statuses

`unreviewed`

- Default imported state.
- Source-backed discovery data.
- Not WCM editorial approval.

`approved`

- Reviewed and accepted for normal display.
- May later sort above `unreviewed`.

`rejected`

- Reviewed and determined unsuitable.
- Retained for audit and import replay safety.
- Hidden from public surfaces after visibility rules are implemented.

`suppressed`

- Not necessarily false, but hidden because it is noisy, confusing, duplicate-like, pastorally unhelpful, or not useful in the current UI.
- Retained for audit.

### Excluded MVP Statuses

The MVP must not include:

- `promoted`
- `needs_review`

Reason:

- `promoted` requires a ranking/curation policy.
- `needs_review` requires queue-management behavior beyond the first status-only tool.

## Relationship Type Policy

The MVP should not edit relationship types.

Current imported OpenBible rows should remain:

```txt
relationship_type = theme
```

If a later phase permits relationship-type editing, it must use the existing API-compatible vocabulary first:

```txt
theme
quotation
allusion
parallel_event
promise_fulfillment
prophecy_fulfillment
typology
law_gospel
word_study
curated_manual
```

The first review tool must not introduce new type values such as:

- `prophecy`
- `fulfillment`
- `parallel`
- `gospel_harmony`
- `timeline_event`

## Minimal Admin UI Concept

The MVP admin tool should be small and purpose-built.

Recommended screen: Cross Reference Review Queue.

Required filters:

- source book
- source chapter
- source verse
- `review_status`
- `source_dataset`
- minimum source score

Recommended row display:

- source reference
- target reference
- relationship type
- current review status
- source dataset
- source score as source weight only
- package ID
- source checksum shortened for display
- View source passage
- View target passage

Recommended actions:

- Approve
- Reject
- Suppress

Recommended guardrails:

- require a review reason for `rejected` and `suppressed`
- confirmation for bulk actions
- no relationship type changes in MVP
- no delete action
- no raw source export
- no Bible text storage

## Required Metadata

Status-only review should not proceed without audit metadata.

Required future metadata:

```txt
reviewed_by
reviewed_at
review_reason
```

Recommended optional metadata:

```txt
review_notes
review_source
previous_review_status
```

Storage options:

1. Add fields to `wcm_cross_references`.
2. Add a separate `wcm_cross_reference_reviews` audit table.

Recommended direction:

- Use a separate audit table if review history is required.
- Use additive fields only if the MVP needs only the latest review state.
- Do not implement either without a separate schema design and approval.

## Visibility Rules

Initial public behavior should remain unchanged until visibility implementation is explicitly approved.

When visibility rules are implemented:

- `unreviewed`: visible with conservative labeling and OpenBible attribution.
- `approved`: visible and eligible to sort above `unreviewed`.
- `rejected`: hidden from public Reader and Word Study surfaces.
- `suppressed`: hidden from public Reader and Word Study surfaces.

Public surfaces:

- Reader Related Passages should not show rejected/suppressed rows.
- Word Study Related Passages should not show rejected/suppressed rows.
- Future Gospel Harmony, Timeline, and People/Event pages should prefer approved rows.

Sorting policy:

- First implementation may keep current source-score order.
- Later implementation may sort `approved` before `unreviewed`.
- Source score must not be displayed as theological certainty.

## Rollback Strategy

Review tooling introduces DB writes and must have rollback support before implementation.

Required rollback protections:

- DB backup before first local review writes.
- Restore command documented before apply.
- Review-state export before bulk actions.
- No physical row deletion.
- Rejected/suppressed rows remain recoverable by status update.
- Source/package metadata must remain unchanged.

Rollback paths:

1. Restore full DB backup.
2. Revert review statuses from a review-state backup.
3. For single-row mistakes, change status back to previous value through admin tooling after audit support exists.

## Future Extensibility

Future phases may add:

- relationship type editing
- promoted/curated ranking
- needs-review queues
- bulk review by source passage
- reviewer notes
- review history
- Gospel Harmony review workflow
- Timeline/People/Event review workflow
- public reviewed-only filter controls

These are explicitly deferred from the MVP.

## API Implications

The current public API is read-only and should remain read-only.

Future review tooling needs authenticated admin-only APIs:

- list review queue
- update review status
- record review metadata
- reject/suppress with reason

Public API changes should be separate:

- support `suppressed` after the API status vocabulary is expanded
- hide rejected/suppressed rows by default
- preserve bounded pagination
- preserve reference-only responses

No API implementation is approved by this document.

## Data / Migration Considerations

The current table can store review status values, but the current API only recognizes:

```txt
unreviewed
reviewed
approved
held
rejected
```

The MVP requires `suppressed`, so a future API/schema design must align allowed status values before implementation.

Review metadata requires new storage. That must be additive and separately approved.

No migration is approved by this document.

## Risks

- Review writes without audit metadata would make editorial decisions hard to trace.
- Suppression without reason could hide useful relationships without accountability.
- Public UI may still imply OpenBible data is WCM-approved if labels are unclear.
- Admin write APIs increase permission and security risk.
- Bulk actions could hide many records accidentally.
- Adding unsupported status values before API alignment could break filters.

## MVP Validation Plan

Future implementation should validate:

- only authorized users can update status
- `unreviewed`, `approved`, `rejected`, and `suppressed` are accepted
- review metadata is recorded
- source metadata remains unchanged
- relationship identity remains unchanged
- rejected/suppressed rows are hidden only after public visibility implementation approval
- Reader and Word Study continue to paginate bounded results
- rollback procedure can restore review state

## Deferred Scope

Deferred:

- relationship type editing
- promoted state
- needs-review state
- review history UI
- broad editorial workflow
- Gospel Harmony integration
- Timeline integration
- People/Event integration
- public user feedback
- bulk actions in first release
- production review tooling

## Final Recommendation

Proceed next with CR-44 Cross Reference Review Tool Schema/Audit Metadata Design.

The minimum viable review tool should be status-only and admin-only. It should not edit relationship types, change public visibility behavior, or add broad editorial workflow until review metadata and rollback safety are designed and approved.
