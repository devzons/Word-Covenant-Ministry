# Cross Reference Migration Design

Date: 2026-06-22

## Purpose

This document records CR-18 Cross Reference Migration Design.

The purpose is to define how WCM should safely add the `wcm_cross_references` table after schema approval, while keeping Cross Reference data import, API implementation, frontend integration, staging apply, and production apply as separate approval gates.

This is a design document only. It does not modify `SchemaInstaller`, add a migration, write to the database, import data, implement APIs, change backend runtime behavior, or change frontend runtime behavior.

## Current Phase

Phase CR-18 - Cross Reference Migration Design.

Current Cross Reference state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
storage strategy reviewed: yes
schema design completed: yes
schema approval review completed: yes
schema approval status: Approved With Conditions
validated relationships: 341176
duplicate relationships: 0
invalid references: 0
blocking errors: 0
```

## Migration Scope

Approved migration direction:

- Dedicated table: `wcm_cross_references`.
- Additive only.
- Reference-only.
- No Bible text storage.
- Unique `relationship_identity_hash` enforcement.
- Existing Bible tables unaffected.
- Existing original-language tables unaffected.
- No package data loaded during schema migration.
- No Cross Reference import during schema migration.
- Bounded API and pagination are required later before runtime exposure.
- DB backup and rollback readiness are required before any later import.

Out of migration scope:

- Cross Reference package import.
- Cross Reference REST API.
- Reader UI integration.
- Word Study integration.
- Gospel Harmony integration.
- Staging apply.
- Production apply.

## Proposed Table

Table name:

```txt
wcm_cross_references
```

With WordPress prefix in runtime databases:

```txt
{$wpdb->prefix}wcm_cross_references
```

The table stores passage-to-passage relationship metadata only. It must not store Bible text.

## Field Design And Data Types

Recommended MySQL fields:

| Field | Type | Null | Default | Purpose |
| --- | --- | --- | --- | --- |
| `id` | `BIGINT UNSIGNED` | No | auto increment | Internal primary key |
| `source_book` | `VARCHAR(64)` | No | none | WCM canonical source book slug |
| `source_start_chapter` | `SMALLINT UNSIGNED` | No | none | Source start chapter |
| `source_start_verse` | `SMALLINT UNSIGNED` | No | none | Source start verse |
| `source_end_chapter` | `SMALLINT UNSIGNED` | Yes | `NULL` | Source end chapter for ranges |
| `source_end_verse` | `SMALLINT UNSIGNED` | Yes | `NULL` | Source end verse for ranges |
| `target_book` | `VARCHAR(64)` | No | none | WCM canonical target book slug |
| `target_start_chapter` | `SMALLINT UNSIGNED` | No | none | Target start chapter |
| `target_start_verse` | `SMALLINT UNSIGNED` | No | none | Target start verse |
| `target_end_chapter` | `SMALLINT UNSIGNED` | Yes | `NULL` | Target end chapter for ranges |
| `target_end_verse` | `SMALLINT UNSIGNED` | Yes | `NULL` | Target end verse for ranges |
| `relationship_type` | `VARCHAR(50)` | No | none | Relationship type, initially `theme` for OpenBible |
| `source_dataset` | `VARCHAR(50)` | No | none | Source dataset identifier, initially `openbible` |
| `source_score` | `INT` | Yes | `NULL` | Source weight/vote score, not theological certainty |
| `confidence` | `VARCHAR(50)` | No | `source_backed` | Confidence label |
| `review_status` | `VARCHAR(50)` | No | `unreviewed` | Review workflow state |
| `package_id` | `VARCHAR(191)` | No | none | Normalized package identifier |
| `source_checksum` | `CHAR(64)` | No | none | Acquired source SHA-256 checksum |
| `relationship_identity_hash` | `CHAR(64)` | No | none | Deterministic duplicate identity |
| `created_at` | `DATETIME` | No | none | Creation timestamp |
| `updated_at` | `DATETIME` | No | none | Last update timestamp |

Recommended SQL shape for a future `SchemaInstaller` implementation:

```sql
CREATE TABLE {$crossReferencesTable} (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    source_book VARCHAR(64) NOT NULL,
    source_start_chapter SMALLINT UNSIGNED NOT NULL,
    source_start_verse SMALLINT UNSIGNED NOT NULL,
    source_end_chapter SMALLINT UNSIGNED NULL,
    source_end_verse SMALLINT UNSIGNED NULL,
    target_book VARCHAR(64) NOT NULL,
    target_start_chapter SMALLINT UNSIGNED NOT NULL,
    target_start_verse SMALLINT UNSIGNED NOT NULL,
    target_end_chapter SMALLINT UNSIGNED NULL,
    target_end_verse SMALLINT UNSIGNED NULL,
    relationship_type VARCHAR(50) NOT NULL,
    source_dataset VARCHAR(50) NOT NULL,
    source_score INT NULL,
    confidence VARCHAR(50) NOT NULL DEFAULT 'source_backed',
    review_status VARCHAR(50) NOT NULL DEFAULT 'unreviewed',
    package_id VARCHAR(191) NOT NULL,
    source_checksum CHAR(64) NOT NULL,
    relationship_identity_hash CHAR(64) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY  (id),
    UNIQUE KEY relationship_identity_hash (relationship_identity_hash),
    KEY source_lookup (source_book, source_start_chapter, source_start_verse),
    KEY target_lookup (target_book, target_start_chapter, target_start_verse),
    KEY relationship_type_lookup (relationship_type),
    KEY source_dataset_lookup (source_dataset),
    KEY review_status_lookup (review_status),
    KEY package_lookup (package_id)
) {$charsetCollate};
```

## Reference Policy

Migration-level reference rules:

- Store references only.
- Do not store Bible text.
- Use WCM canonical book slugs.
- Support single verses.
- Support source ranges.
- Support target ranges.
- Support same-book target ranges.
- First migration phase excludes cross-book ranges.
- End reference fields may be `NULL` for single-verse references.
- Import validation must reject malformed references before insert.

## Relationship Policy

Initial OpenBible import policy, for the later import phase:

```txt
relationship_type = theme
source_dataset = openbible
confidence = source_backed
review_status = unreviewed
```

Migration must not infer theological relationship categories.

The following relationship types remain future curated or source-backed classifications:

- `quotation`
- `allusion`
- `parallel_event`
- `promise_fulfillment`
- `prophecy_fulfillment`
- `typology`
- `law_gospel`
- `word_study`
- `curated_manual`

## Identity Hash Policy

Required unique identity field:

```txt
relationship_identity_hash
```

Recommended hash input:

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

The future importer must generate the hash using a stable canonical serialization. `NULL` range-end values must be serialized consistently. Re-running the same package must match existing identities and must not create duplicate rows.

The migration must enforce:

```txt
UNIQUE KEY relationship_identity_hash (relationship_identity_hash)
```

## Indexes

Required indexes for the first migration:

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

Recommended implementation consideration:

The CR-15 schema design also identified these composite indexes for the first API phase:

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

Migration approval should decide whether these composite indexes are included immediately or added during the later API implementation phase. If the first import happens before API exposure, the required baseline indexes are sufficient for import identity, package audit, source lookup, target lookup, and review filtering.

## DB Version Strategy

Current confirmed schema version in source:

```txt
SchemaInstaller::DB_VERSION = 1.4.0
SchemaInstaller::DB_VERSION_OPTION = wcm_core_db_version
```

Recommended next schema version for this additive table:

```txt
1.5.0
```

Versioning rules:

- Future implementation must increment `SchemaInstaller::DB_VERSION`.
- Future implementation must update the stored `wcm_core_db_version` only after schema installation completes.
- Migration must be idempotent.
- Migration must check whether `{$wpdb->prefix}wcm_cross_references` already exists.
- Migration must validate required columns and indexes after `dbDelta`.
- If concurrent schema work lands first, use the next available version after the then-current `DB_VERSION`.

## Idempotency Strategy

Future implementation should be safe to run repeatedly.

Required behavior:

- If the table does not exist, create it.
- If the table exists, validate expected columns.
- If indexes are missing, add or repair them through an approved migration path.
- Do not drop or truncate existing rows during schema installation.
- Do not import package rows during schema installation.
- Do not overwrite unrelated schema objects.

## Rollback Strategy

Primary local rollback:

```txt
restore local DB backup
```

Rollback rules:

- A full local DB backup is required before any later import.
- Table drop rollback is not approved by this migration design.
- Dropping `wcm_cross_references` requires a separate explicit rollback approval.
- Production rollback is out of scope.
- Staging rollback is out of scope until staging apply is separately approved.
- Package-scoped rollback after future import should use `package_id` only if separately approved and tested.

Reason:

Schema rollback can be destructive once package rows exist. The safest rollback path before and during local import validation is a full DB restore from the pre-apply backup.

## Import Separation

The schema migration must create the table only.

It must not:

- Read the OpenBible package.
- Load `cross_references.jsonl`.
- Insert relationship rows.
- Update package status.
- Expose new runtime API routes.
- Trigger frontend display changes.

Import remains a later phase after:

- migration approval
- schema implementation
- schema validation
- local DB backup
- package dry-run revalidation
- explicit local import approval

## Validation Plan

Future implementation validation must confirm:

```txt
table exists: wp_wcm_cross_references
unique relationship_identity_hash key exists
source_lookup index exists
target_lookup index exists
relationship_type_lookup index exists
source_dataset_lookup index exists
review_status_lookup index exists
package_lookup index exists
wcm_core_db_version updated
existing Bible version count unchanged
existing Bible book count unchanged
existing Bible verse count unchanged
existing original term count unchanged
existing original occurrence count unchanged
cross reference row count after migration: 0
```

Recommended validation commands for a future implementation report:

```txt
wp option get wcm_core_db_version
wp db query "SHOW TABLES LIKE 'wp_wcm_cross_references';"
wp db query "SHOW INDEX FROM wp_wcm_cross_references;"
wp db query "SELECT COUNT(*) AS cross_reference_count FROM wp_wcm_cross_references;"
```

Counts for existing tables should be captured before and after migration.

## Non-Actions

This document does not perform or authorize:

- schema implementation
- `SchemaInstaller` modification
- migration file creation
- database write
- package import
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Risks

### Schema Risk

Risk:

- The migration adds a new custom table to the official WCM database model.

Mitigation:

- Keep the migration additive.
- Use idempotent table creation.
- Validate all required indexes.

### Index Risk

Risk:

- Missing indexes would make later API lookups slow.

Mitigation:

- Treat index presence as migration validation, not optional polish.
- Decide composite API indexes before runtime exposure.

### Import Coupling Risk

Risk:

- Combining schema and import in one step would make rollback harder.

Mitigation:

- Keep migration and import strictly separate phases.

### Rollback Risk

Risk:

- Dropping a table after import may destroy reviewable package data.

Mitigation:

- Use full DB backup restore as the primary rollback path.
- Require separate approval for any table drop rollback.

## Final Recommendation

```txt
Ready For Migration Approval Review
```

The migration design is ready for review because it is additive, reference-only, import-free, and aligned with the CR-15 schema design and CR-16 schema approval review. The next gate should decide whether to approve implementation of the table creation in `SchemaInstaller`, including the final DB version target and index list.

## Next Objective

CR-19 - Cross Reference Migration Approval Review.

CR-19 should decide whether to authorize a future implementation that updates `SchemaInstaller`, increments `wcm_core_db_version`, creates `wcm_cross_references`, validates indexes, and performs no data import.

