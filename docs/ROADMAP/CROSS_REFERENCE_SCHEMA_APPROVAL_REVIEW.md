# Cross Reference Schema Approval Review

Date: 2026-06-22

## Purpose

This document records CR-16 Cross Reference Schema Approval Review.

The review evaluates whether the CR-15 schema design is ready to proceed to a formal schema approval gate for a dedicated `wcm_cross_references` table. It does not approve or perform schema changes, migrations, database writes, imports, API implementation, backend runtime changes, frontend runtime changes, staging apply, or production apply.

## Current Phase

Phase CR-16 - Cross Reference Schema Approval Review.

Current Cross Reference state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
storage strategy reviewed: yes
schema design completed: yes
validated relationships: 341176
duplicate relationships: 0
invalid references: 0
blocking errors: 0
```

## Table Design Audit

Reviewed table:

```txt
wcm_cross_references
```

The proposed table design is appropriate for the current Cross Reference package because it stores reference relationships only and avoids Bible text duplication.

Required design properties:

- `source_*` fields identify the source reference.
- `target_*` fields identify the target reference.
- Source and target ranges are supported.
- Bible text is not stored.
- WCM canonical book slugs are used.
- Cross-book ranges remain out of scope for the first phase.
- `relationship_type`, `confidence`, and `review_status` preserve relationship and review state.
- `package_id` and `source_checksum` preserve package/source provenance.
- `relationship_identity_hash` supports duplicate prevention and import replay safety.
- `created_at` and `updated_at` support operational auditability.

Package metadata coverage:

```txt
package_id: present
source_checksum: present
source_dataset: present
source_score: present
```

Review metadata coverage:

```txt
review_status: present
confidence: present
reviewed_by: future optional
reviewed_at: future optional
notes: future optional
```

Audit finding:

```txt
sufficient
```

Condition:

Future migration design should decide whether `package_checksum` should be added in the initial schema instead of remaining an optional future field. The current `package_id` plus `source_checksum` is sufficient for source provenance, but normalized-package replay auditing would be stronger with `package_checksum`.

## Identity Strategy Audit

Reviewed identity field:

```txt
relationship_identity_hash
```

Reviewed identity input:

```txt
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
```

The identity strategy is appropriate for deterministic duplicate prevention. It makes package replay safe because re-importing the same normalized package should resolve to the same identity hashes rather than creating duplicate rows.

Audit requirements for implementation:

- Use a stable canonical serialization for hash input.
- Normalize `NULL` and absent range-end values consistently.
- Include `relationship_type` so future curated categories can coexist.
- Include `source_dataset` so multiple source packages can preserve provenance.
- Add a unique key on `relationship_identity_hash`.
- Treat reversed source/target records as distinct unless future policy explicitly defines bidirectional deduplication.

Audit finding:

```txt
sufficient
```

Condition:

CR-17 or the later migration design must specify the exact hash serialization format before implementation.

## Index Audit

Reviewed required indexes:

```txt
PRIMARY KEY (id)
UNIQUE KEY relationship_identity_hash (relationship_identity_hash)
KEY source_lookup (source_book, source_start_chapter, source_start_verse)
KEY source_range_lookup (source_book, source_start_chapter, source_start_verse, source_end_chapter, source_end_verse)
KEY target_lookup (target_book, target_start_chapter, target_start_verse)
KEY relationship_type_lookup (relationship_type)
KEY source_dataset_lookup (source_dataset)
KEY review_status_lookup (review_status)
KEY package_lookup (package_id)
```

Reviewed recommended composite indexes:

```txt
KEY source_type_score_lookup (
  source_book,
  source_start_chapter,
  source_start_verse,
  relationship_type,
  source_score
)

KEY source_review_score_lookup (
  source_book,
  source_start_chapter,
  source_start_verse,
  review_status,
  source_score
)
```

Coverage by query need:

| Query need | Covered by |
| --- | --- |
| Reader source lookup | `source_lookup`, `source_range_lookup` |
| Reverse target lookup | `target_lookup` |
| Relationship filtering | `relationship_type_lookup`, `source_type_score_lookup` |
| Source dataset audit | `source_dataset_lookup` |
| Review workflow | `review_status_lookup`, `source_review_score_lookup` |
| Package audit/rollback | `package_lookup` |
| Duplicate prevention | `relationship_identity_hash` unique key |

Audit finding:

```txt
sufficient with conditions
```

Conditions:

- Migration implementation must verify MySQL index lengths under the active charset/collation.
- Future API implementation must use bounded source lookups and avoid unbounded whole-book or whole-Bible relationship queries.
- Query profiling should confirm whether the recommended composite score indexes are enough before adding broader indexes.

## Scale Audit

Validated package scale:

```txt
relationships: 341176
package size: approximately 171 MB
ranges_normalized: 87418
```

The proposed dedicated table is appropriate for this scale. The row count is too large for WordPress CPT/postmeta and too large for frontend static payloads, but it is reasonable for an indexed custom table with reference-only rows.

Scale requirements:

- Imports must stream JSONL.
- Inserts must be batched.
- Import must validate identity hashes before writing.
- Runtime API queries must be bounded.
- Reader requests should query the active verse or approved reference range only.
- Broad exploration must use pagination or hard limits.
- UI must not prefetch all relationships for a chapter, book, or full Bible.

Audit finding:

```txt
sufficient with conditions
```

Conditions:

- Local import tooling must prove memory-safe processing before staging or production consideration.
- API design must require default and maximum limits before runtime exposure.
- Rollback must be package-aware because the initial import size is large enough that manual row correction is not acceptable.

## Compatibility Audit

### Reader

The schema supports Reader and Bible Study Workspace lookup by source reference. It can power a Cross Reference panel without storing Bible text.

Finding:

```txt
compatible
```

### Word Study

The schema can support future Word Study integration through passage references. It should not auto-create lexical relationships from shared Strong numbers or infer word-level theology from Cross Reference rows.

Finding:

```txt
compatible with boundary
```

### Gospel Harmony

The schema can support future `parallel_event` records, but OpenBible `theme` records must not be treated as harmony units without curated review.

Finding:

```txt
compatible with review requirement
```

### Commentary Layer

The schema can provide related references to commentary surfaces while commentary content remains separate.

Finding:

```txt
compatible
```

## Schema Impact Audit

Expected schema impact if later approved:

- Add one dedicated custom table: `wcm_cross_references`.
- Keep existing Bible tables unchanged.
- Keep original-language tables unchanged.
- Keep Word Study and Gospel Harmony frontend data unchanged.
- Require `SchemaInstaller` update.
- Require `wcm_core_db_version` increment.
- Require migration validation and rollback documentation.

Impact finding:

```txt
additive only
```

Boundary:

This review does not authorize the schema change. CR-17 must explicitly approve schema implementation before any `SchemaInstaller` modification, DB version increment, migration, import, or DB write.

## Risk Review

### Schema Risk

Risk:

- A new custom table expands the official database model.

Mitigation:

- Keep the table additive.
- Use idempotent schema creation.
- Increment `wcm_core_db_version`.
- Validate table and index existence before import.

### Migration Risk

Risk:

- An incomplete migration could create a table without required indexes or unique identity enforcement.

Mitigation:

- Treat index creation as part of migration success.
- Validate `relationship_identity_hash` uniqueness before import.
- Add schema validation commands to the local apply checklist.

### Import Risk

Risk:

- Importing `341,176` relationships can expose duplicate, memory, timeout, or partial-write issues.

Mitigation:

- Require local DB backup.
- Run package dry-run immediately before apply.
- Stream rows.
- Batch writes.
- Stop on blocking validation errors.
- Record package metadata.

### Performance Risk

Risk:

- Unbounded API queries could make Reader or research panels slow.

Mitigation:

- Require indexed source lookups.
- Cap API response size.
- Paginate broad lookups.
- Do not expose whole-package responses.

### Rollback Risk

Risk:

- A large import is difficult to undo safely without package-aware rollback.

Mitigation:

- Require full local DB backup before first apply.
- Require package-scoped rollback strategy using `package_id`.
- Preserve `relationship_identity_hash` for deterministic deletion/replay.

## Approval Conditions

Before schema implementation, CR-17 should explicitly decide:

- Whether `package_checksum` belongs in the initial table.
- The exact `relationship_identity_hash` serialization format.
- The final index list for the first migration.
- The `wcm_core_db_version` target.
- The schema validation command/report format.
- The local backup requirement before import.
- The rollback rule for package-scoped imported rows.

## Final Verdict

```txt
Ready For Schema Approval
```

The CR-15 schema design is coherent, additive, reference-only, compatible with the validated package scale, and aligned with future Reader, Word Study, Gospel Harmony, and Commentary needs. The remaining items are approval-gate decisions, not blockers to entering CR-17.

## Next Objective

CR-17 - Cross Reference Schema Approval.

CR-17 should decide whether to authorize additive schema implementation for `wcm_cross_references`, including `SchemaInstaller` changes, `wcm_core_db_version` increment, migration validation, and rollback requirements.

