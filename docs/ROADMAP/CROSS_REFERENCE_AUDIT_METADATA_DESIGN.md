# Cross Reference Audit Metadata Design

Date: 2026-06-23

## Current State

The Cross Reference local data layer is implemented and validated:

- table: `wp_wcm_cross_references`
- imported relationships: `341,176`
- source dataset: `openbible`
- relationship type: `theme`
- review status: `unreviewed`
- duplicate identities: `0`
- invalid references: `0`

Current schema supports reference-only relationship storage, source metadata, package metadata, and review status.

Current fields include:

```txt
id
source_book
source_start_chapter
source_start_verse
source_end_chapter
source_end_verse
target_book
target_start_chapter
target_start_verse
target_end_chapter
target_end_verse
relationship_type
source_dataset
source_score
confidence
review_status
package_id
source_checksum
relationship_identity_hash
created_at
updated_at
```

Current schema does not include review audit metadata:

```txt
reviewed_by
reviewed_at
review_reason
review_notes
previous_review_status
```

## Purpose

This document defines the audit and schema layer required before future Cross Reference review tooling can write review decisions.

The goal is trustworthy review state, not broad editorial tooling.

This document is design only. It does not authorize schema changes, migrations, DB writes, API changes, frontend changes, imports, or production/staging changes.

## Audit Design Summary

Review writes must be auditable because they change what users may see in Reader, Word Study, and future research surfaces.

Every review write should answer:

- who made the decision
- when the decision was made
- what status was chosen
- what status existed before the change
- why the decision was made, especially for rejection or suppression
- which source relationship identity was affected

Review tooling must preserve:

- original source reference
- target reference
- `source_dataset`
- `package_id`
- `source_checksum`
- `relationship_identity_hash`
- `source_score`

No review workflow may store Bible text in the Cross Reference table or review audit table.

## Required Metadata

### `reviewed_by`

Status: required for review writes.

Recommended type:

```txt
BIGINT UNSIGNED NULL
```

Recommended meaning:

- WordPress user ID of the reviewer.
- Nullable only for existing imported rows and system states before review.

Reason:

- Review decisions must be traceable.
- String names are less stable than user IDs.

### `reviewed_at`

Status: required for review writes.

Recommended type:

```txt
DATETIME NULL
```

Recommended meaning:

- Timestamp of the latest review decision.
- Nullable for unreviewed imported rows.

Reason:

- Review recency matters for future curation, rollback, and audit.

### `review_reason`

Status: required for `rejected` and `suppressed`; optional for `approved`.

Recommended type:

```txt
VARCHAR(191) NULL
```

Recommended first values:

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

Reason:

- Rejection and suppression should be accountable.
- Controlled tokens are easier to filter and report than free text.

## Optional Metadata

### `review_notes`

Status: optional.

Recommended type:

```txt
TEXT NULL
```

Purpose:

- Short internal editorial note.
- Not public by default.

Risk:

- Free text needs sanitization and permission controls.

### `previous_review_status`

Status: optional if using additive fields only; recommended if no separate audit table exists.

Recommended type:

```txt
VARCHAR(50) NULL
```

Purpose:

- Simple rollback for the latest status change.

Limitation:

- Only preserves one previous state.
- Not sufficient for long-term review history.

### `review_source`

Status: optional.

Recommended type:

```txt
VARCHAR(50) NULL
```

Possible values:

```txt
manual
bulk_manual
system_migration
```

Purpose:

- Distinguish direct editor review from controlled system updates.

## Future-Only Metadata

Future-only metadata:

```txt
curated_rank
visibility_scope
review_batch_id
reviewed_relationship_type
editorial_category
```

These are not required for the status-only MVP.

Reasons to defer:

- ranking and visibility require editorial policy
- relationship-type review is deferred
- batch review adds rollback complexity
- future Gospel Harmony/Timeline integrations may need separate models

## Schema Proposal

Two schema options are viable.

### Option A - Add Latest Review Fields To `wcm_cross_references`

Add fields:

```txt
reviewed_by BIGINT UNSIGNED NULL
reviewed_at DATETIME NULL
review_reason VARCHAR(191) NULL
review_notes TEXT NULL
previous_review_status VARCHAR(50) NULL
review_source VARCHAR(50) NULL
```

Advantages:

- simplest MVP
- direct lookup for public visibility and admin display
- no joins required for current review state
- easier to implement with current table

Disadvantages:

- no full history
- later audit table may still be needed
- repeated changes overwrite previous metadata unless separately backed up

### Option B - Add `wcm_cross_reference_reviews`

Future audit table:

```txt
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
cross_reference_id BIGINT UNSIGNED NOT NULL
relationship_identity_hash CHAR(64) NOT NULL
previous_review_status VARCHAR(50) NOT NULL
new_review_status VARCHAR(50) NOT NULL
review_reason VARCHAR(191) NULL
review_notes TEXT NULL
reviewed_by BIGINT UNSIGNED NOT NULL
reviewed_at DATETIME NOT NULL
review_source VARCHAR(50) NOT NULL DEFAULT 'manual'
created_at DATETIME NOT NULL
```

Recommended indexes:

```txt
PRIMARY KEY (id)
KEY cross_reference_lookup (cross_reference_id)
KEY identity_lookup (relationship_identity_hash)
KEY reviewed_by_lookup (reviewed_by)
KEY reviewed_at_lookup (reviewed_at)
KEY status_transition_lookup (previous_review_status, new_review_status)
```

Advantages:

- full review history
- better auditability
- safer rollback
- supports future multi-review workflow

Disadvantages:

- more implementation complexity
- review UI must join or query history
- requires clearer retention and display policy

## Recommended MVP Schema Direction

Recommended approach:

1. Add latest-review fields to `wcm_cross_references` for MVP simplicity.
2. Design `wcm_cross_reference_reviews` as the future audit-history table.
3. Do not implement review writes until latest-review fields are approved and migrated.

Reason:

- The first review tool is status-only.
- Reader and Word Study need efficient current-state filtering.
- Full multi-review history is valuable but not required for the first local MVP.

## Multi-Review Strategy

Future multi-review support should use a separate review history table.

Potential model:

- one latest state on `wcm_cross_references`
- many review events in `wcm_cross_reference_reviews`
- public APIs read latest state
- admin/audit screens read history

Do not attempt multi-review workflow in the MVP.

## Migration Strategy

Future migration should be additive only.

Recommended migration sequence:

1. Confirm DB version and current row count.
2. Create a DB backup.
3. Add nullable latest-review columns to `wcm_cross_references`.
4. Add indexes only if query needs are clear.
5. Leave existing `review_status = unreviewed` rows unchanged.
6. Do not backfill fake reviewer metadata.
7. Update DB version.
8. Validate:
   - row count remains `341,176`
   - duplicate identities remain `0`
   - existing Bible counts unchanged
   - original-language counts unchanged
   - new columns exist
   - no review writes performed during migration

Recommended new indexes for latest-review fields:

```txt
KEY reviewed_by_lookup (reviewed_by)
KEY reviewed_at_lookup (reviewed_at)
KEY review_reason_lookup (review_reason)
```

Index caution:

- Add only indexes needed by approved admin screens.
- Avoid over-indexing before real query patterns are known.

## Rollback Strategy

Rollback must be designed before review writes.

Schema rollback:

- primary rollback: restore DB backup
- column drop rollback: separate approval only
- production rollback: out of scope until staging/prod promotion exists

Review-state rollback:

- export relationship ID, identity hash, current status, and previous status before bulk changes
- for single-row errors, restore prior status from `previous_review_status` or audit table
- for broad errors, restore from DB backup or review-state export

Rollback rules:

- never delete imported cross-reference rows to undo review decisions
- never modify source/provenance metadata during rollback
- never reimport the package as a review rollback mechanism

## Visibility and API Impact

The audit metadata migration alone should not change public visibility.

Future public visibility behavior should be a separate implementation phase:

- `unreviewed`: visible with conservative labeling
- `approved`: visible
- `rejected`: hidden
- `suppressed`: hidden

The current public API does not support `suppressed` as an allowed filter value. API status vocabulary must be updated before `suppressed` review writes are exposed through filters.

No API changes are approved by this document.

## Risks

- Additive fields without a review history table preserve only the latest state.
- Free-text notes can create sanitization, privacy, and moderation issues.
- Adding `suppressed` before API vocabulary alignment can break filter behavior.
- Review writes without backup/export make rollback weak.
- Over-indexing a large table can increase migration time.
- Reviewer user IDs may become stale if user accounts are deleted.

## Final Recommendation

Proceed next with CR-45 Cross Reference Audit Metadata Schema Approval Review.

Recommended MVP metadata:

```txt
reviewed_by
reviewed_at
review_reason
review_notes
previous_review_status
review_source
```

Implementation should be additive, local-first, and separate from public visibility changes.

## CR-45 Approval Outcome

CR-45 approved this design with conditions.

Approved MVP metadata model:

```txt
reviewed_by
reviewed_at
previous_review_status
review_source
review_reason
review_notes
```

Approval conditions:

- `reviewed_by`, `reviewed_at`, `previous_review_status`, and `review_source` are required for MVP review writes.
- `review_reason` is required for `rejected` and `suppressed`; optional for `approved`.
- `review_reason` must be a controlled token, not free text, in the MVP.
- `review_notes` may be free text but must be optional, internal-only, sanitized, and permission-protected.
- `review_source` should default to `manual`.
- Existing imported rows must not receive fake reviewer metadata.
- Public visibility behavior must not change during metadata migration.
- API status vocabulary must align before `suppressed` is used in filters or public behavior.

Approval report:

```txt
docs/ROADMAP/CROSS_REFERENCE_AUDIT_METADATA_APPROVAL_REPORT.md
```

## CR-47 Implementation Outcome

CR-47 implemented the approved latest-state audit metadata schema locally.

Implemented fields on `wcm_cross_references`:

```txt
reviewed_by BIGINT UNSIGNED NULL
reviewed_at DATETIME NULL
previous_review_status VARCHAR(50) NULL
review_source VARCHAR(50) NULL
review_reason VARCHAR(191) NULL
review_notes TEXT NULL
```

Implementation boundaries:

- `wcm_core_db_version` is now `1.6.0`.
- Existing imported rows were not mutated.
- No fake reviewer metadata was backfilled.
- No review-history table was created.
- Public API response shape and public visibility behavior were unchanged.

Implementation report:

```txt
docs/ROADMAP/CROSS_REFERENCE_AUDIT_METADATA_SCHEMA_IMPLEMENTATION_REPORT.md
```
