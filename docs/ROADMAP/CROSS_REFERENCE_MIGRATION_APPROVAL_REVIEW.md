# Cross Reference Migration Approval Review

Date: 2026-06-22

## Purpose

This document records CR-19 Cross Reference Migration Approval Review.

The review evaluates whether the CR-18 migration design is ready to proceed to a formal migration approval gate for adding `wcm_cross_references` through a future `SchemaInstaller` change.

This is an approval review document only. It does not modify `SchemaInstaller`, implement a migration, write to the database, import data, implement APIs, change backend runtime behavior, or change frontend runtime behavior.

## Current Phase

Phase CR-19 - Cross Reference Migration Approval Review.

Current Cross Reference state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
storage strategy reviewed: yes
schema design completed: yes
schema approval completed: yes
migration design completed: yes
proposed table: wcm_cross_references
current db_version: 1.4.0
proposed db_version: 1.5.0
validated relationships: 341176
duplicate relationships: 0
invalid references: 0
blocking errors: 0
```

## Migration Scope Audit

Reviewed migration scope:

- Add one dedicated custom table: `wcm_cross_references`.
- Additive only.
- Existing Bible tables unchanged.
- Existing original-language tables unchanged.
- No change to `wcm_bible_versions`.
- No change to `wcm_bible_books`.
- No change to `wcm_bible_verses`.
- No change to `wcm_original_terms`.
- No change to `wcm_original_word_occurrences`.
- No Cross Reference data import during migration.
- No API or frontend runtime exposure during migration.

Audit finding:

```txt
sufficient
```

Reason:

The migration scope is narrow and table-only. It does not alter existing table contracts or require existing data backfill. This keeps the migration low risk compared with a schema change that mutates Bible or original-language storage.

Required condition for later implementation:

Future implementation must verify the Cross Reference table row count is `0` after schema migration and before any import phase.

## DB Version Audit

Current confirmed version:

```txt
SchemaInstaller::DB_VERSION = 1.4.0
wcm_core_db_version = 1.4.0
```

Proposed version:

```txt
1.5.0
```

Audit finding:

```txt
sufficient
```

Reason:

Adding `wcm_cross_references` introduces a new custom table and should increment the stored schema version. Moving from `1.4.0` to `1.5.0` is appropriate for an additive schema expansion that does not break existing tables.

Conditions:

- If another schema change is merged before CR-20 implementation, use the next available version after the then-current `SchemaInstaller::DB_VERSION`.
- The version option must be updated only after `dbDelta` and post-install schema validation complete.
- The implementation report must record old version, new version, and validation output.

## Table Audit

Reviewed table:

```txt
wcm_cross_references
```

Required field set from CR-18:

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

Field audit:

| Requirement | Finding |
| --- | --- |
| Reference-only storage | satisfied |
| No Bible text | satisfied |
| Source reference range support | satisfied |
| Target reference range support | satisfied |
| Relationship type support | satisfied |
| Source dataset support | satisfied |
| Source score preservation | satisfied |
| Review status support | satisfied |
| Package provenance support | satisfied |
| Source checksum preservation | satisfied |
| Duplicate identity support | satisfied |
| Operational timestamps | satisfied |

Audit finding:

```txt
sufficient
```

Condition:

The later implementation should keep `package_checksum` out of the first table unless CR-20 explicitly adds it. CR-18 keeps the initial migration lean and records `package_id` plus `source_checksum` as the required package/source audit fields.

## Identity Hash Audit

Reviewed identity field:

```txt
relationship_identity_hash
```

Reviewed identity purpose:

- deterministic duplicate prevention
- import idempotency
- package replay safety
- package-scoped rollback support after future import approval

Audit finding:

```txt
sufficient
```

Conditions:

- The future importer must use the exact same canonical hash serialization documented in migration/import tooling.
- `NULL` range-end values must serialize consistently.
- The schema must enforce a unique key on `relationship_identity_hash`.

## Index Audit

Required indexes:

```txt
PRIMARY KEY (id)
UNIQUE KEY relationship_identity_hash (relationship_identity_hash)
KEY source_lookup (source_book, source_start_chapter, source_start_verse)
KEY target_lookup (target_book, target_start_chapter, target_start_verse)
KEY relationship_type_lookup (relationship_type)
KEY source_dataset_lookup (source_dataset)
KEY review_status_lookup (review_status)
KEY package_lookup (package_id)
```

Index audit by need:

| Need | Index | Finding |
| --- | --- | --- |
| Primary row identity | `PRIMARY KEY (id)` | sufficient |
| Duplicate prevention | `relationship_identity_hash` unique key | sufficient |
| Reader source lookup | `source_lookup` | sufficient for first migration |
| Reverse lookup | `target_lookup` | sufficient for first migration |
| Relationship filtering | `relationship_type_lookup` | sufficient |
| Dataset audit | `source_dataset_lookup` | sufficient |
| Review workflow | `review_status_lookup` | sufficient |
| Package audit/rollback | `package_lookup` | sufficient |

Audit finding:

```txt
sufficient
```

Condition:

Composite score/ranking indexes may be added later with API implementation if query profiling requires them. They are not blocking for a table-only migration, provided no unbounded runtime API is exposed with the migration.

## Rollback Audit

Reviewed rollback strategy:

- Primary local rollback: restore pre-change DB backup.
- Table drop rollback: not approved without separate explicit rollback approval.
- Production rollback: out of scope.
- Staging rollback: out of scope until staging apply is separately approved.
- Future package rollback: package-scoped strategy by `package_id` only after import tooling approval.

Audit finding:

```txt
sufficient with conditions
```

Conditions:

- A local DB backup must be created before future schema implementation.
- Backup path must be recorded in the implementation report.
- Restore command/procedure must be documented before local apply.
- Migration validation must confirm existing Bible and original-language counts are unchanged.

Migration failure recovery:

If the schema migration fails before import, restore from the pre-change local DB backup. Do not attempt ad hoc table drops or manual index repair unless separately approved.

## Import Separation Audit

Required boundary:

```txt
migration != import
```

The migration phase must not:

- read OpenBible raw source
- read generated normalized package files
- insert Cross Reference rows
- update package/import status
- create API routes
- expose frontend runtime behavior

Audit finding:

```txt
sufficient
```

Reason:

CR-18 clearly separates table creation from source package import. This reduces rollback risk and allows schema validation before the 341,176-row package is considered for local import.

## Risk Review

### Migration Risk

Risk:

- `dbDelta` may not create every index exactly as intended.

Mitigation:

- Post-migration validation must inspect table and index state.
- Missing indexes must be treated as migration failure.

### Rollback Risk

Risk:

- Destructive rollback could remove future package data if applied after import.

Mitigation:

- Use DB backup restore as the primary rollback path.
- Do not approve table drop rollback in this phase.

### Performance Risk

Risk:

- The baseline table may later be queried without the composite score/ranking indexes.

Mitigation:

- Do not expose runtime API in the migration phase.
- Add bounded API limits and query profiling before API exposure.
- Add composite indexes later if profiling requires them.

### Future Maintenance Risk

Risk:

- A dedicated `wcm_cross_references` table could later overlap with a broader `wcm_scripture_relationships` graph.

Mitigation:

- Keep the table source-specific, provenance-rich, and bridgeable.
- Preserve canonical references and relationship metadata.
- Do not auto-classify OpenBible `theme` records as narrower theological categories.

## Approval Conditions

Before implementation, CR-20 should explicitly approve:

- Final table field list.
- Final index list.
- DB version target.
- Whether composite API indexes are deferred.
- Pre-migration backup requirement.
- Post-migration validation commands.
- Confirmation that migration creates zero Cross Reference rows.
- Confirmation that no import/API/frontend work is included.

## Final Verdict

```txt
Ready For Migration Approval
```

The CR-18 migration design is ready for approval because it is additive, table-only, reference-only, import-free, and scoped to the dedicated `wcm_cross_references` storage requirement. The remaining conditions are implementation-gate controls for CR-20, not blockers to migration approval.

## Next Objective

CR-20 - Cross Reference Migration Approval.

CR-20 should decide whether to authorize a future implementation that updates `SchemaInstaller`, increments `wcm_core_db_version` from `1.4.0` to the approved next version, creates `wcm_cross_references`, validates required indexes, and performs no data import.

