# Cross Reference Schema Design

Date: 2026-06-22

## Purpose

This document records CR-15 Cross Reference Schema Design for storing the validated OpenBible-derived Cross Reference package.

The immediate design target is a dedicated storage schema that can safely hold `341,176` reference-only relationships with source metadata, review state, duplicate identity, and query indexes for future Reader, Word Study, Gospel Harmony, and Commentary surfaces.

This is a design document only. It does not approve or perform schema changes, migrations, database writes, imports, API implementation, backend runtime changes, frontend runtime changes, staging apply, or production apply.

## Current Phase

Phase CR-15 - Cross Reference Schema Design.

Current Cross Reference package state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
local import approval review completed: yes
storage strategy review completed: yes
storage strategy verdict: Schema Approval Required
relationships: 341176
duplicate relationships: 0
invalid references: 0
blocking errors: 0
```

## Recommended Table

Recommended table:

```txt
wcm_cross_references
```

Rationale:

- Current WCM tables do not store passage-to-passage relationships.
- WordPress CPT/postmeta is not suitable for this scale or query shape.
- Static package lookup is not suitable for runtime.
- ADR-0012's future `wcm_scripture_relationships` concept is compatible in direction but not implemented.
- A dedicated table provides the safest first production-oriented storage layer for high-volume reference-only Cross Reference data.

Long-term compatibility:

`wcm_cross_references` may later feed or bridge into a broader `wcm_scripture_relationships` graph. The first phase should keep OpenBible-derived references in a focused table to reduce risk and keep source/package provenance explicit.

## Field Design

Recommended fields:

```txt
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT

source_book VARCHAR(64) NOT NULL
source_start_chapter SMALLINT UNSIGNED NOT NULL
source_start_verse SMALLINT UNSIGNED NOT NULL
source_end_chapter SMALLINT UNSIGNED NULL
source_end_verse SMALLINT UNSIGNED NULL

target_book VARCHAR(64) NOT NULL
target_start_chapter SMALLINT UNSIGNED NOT NULL
target_start_verse SMALLINT UNSIGNED NOT NULL
target_end_chapter SMALLINT UNSIGNED NULL
target_end_verse SMALLINT UNSIGNED NULL

relationship_type VARCHAR(50) NOT NULL
source_dataset VARCHAR(50) NOT NULL
source_score INT NULL
confidence VARCHAR(50) NOT NULL DEFAULT 'source_backed'
review_status VARCHAR(50) NOT NULL DEFAULT 'unreviewed'

package_id VARCHAR(191) NOT NULL
source_checksum CHAR(64) NOT NULL
relationship_identity_hash CHAR(64) NOT NULL

created_at DATETIME NOT NULL
updated_at DATETIME NOT NULL
```

Optional future fields:

```txt
source_reference VARCHAR(191) NULL
package_checksum CHAR(64) NULL
notes TEXT NULL
reviewed_by VARCHAR(191) NULL
reviewed_at DATETIME NULL
curated_rank INT NULL
```

### Book Storage Policy

Initial schema design uses canonical WCM book slugs in `source_book` and `target_book`.

Reason:

- The package is already normalized to WCM canonical slugs.
- The API surface is slug-based.
- Slugs avoid ambiguity in portable package records.

Future optimization may add `source_book_id` and `target_book_id` foreign-key-style references to `wcm_bible_books.id` if query profiling shows the need. If IDs are added later, slugs should still remain available in API responses and import validation.

## Reference Policy

Reference policy:

- Store references only.
- Do not store Bible text.
- Use WCM canonical book slugs.
- Support source ranges.
- Support target ranges.
- Support same-book cross-chapter target ranges.
- First phase excludes cross-book ranges.
- Chapter and verse values must be positive integers.
- End references may be `NULL` for single-verse references.
- If end references are present, they must not precede the start reference.

Bible text policy:

```txt
No Bible text may be stored in wcm_cross_references.
```

Runtime display must fetch Bible text from the selected Bible version API when text snippets are explicitly approved.

## Relationship Policy

Initial OpenBible import policy:

```txt
relationship_type = theme
review_status = unreviewed
confidence = source_backed
source_dataset = openbible
```

Source score policy:

- Store OpenBible `Votes` as `source_score`.
- Treat `source_score` as source weight only.
- Do not present `source_score` as theological certainty.
- Use `source_score` for ordering only after API/UI approval.

Theological classification policy:

- Do not automatically infer `quotation`.
- Do not automatically infer `allusion`.
- Do not automatically infer `parallel_event`.
- Do not automatically infer `promise_fulfillment`.
- Do not automatically infer `prophecy_fulfillment`.
- Do not automatically infer `typology`.
- Do not automatically infer `law_gospel`.
- Narrower relationship types require curated review or source-backed classification.

## Identity / Duplicate Policy

Recommended identity input:

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

Recommended identity field:

```txt
relationship_identity_hash CHAR(64) NOT NULL
```

Recommended hash:

```txt
SHA-256 of canonical JSON or delimiter-stable canonical string
```

Duplicate policy:

- `relationship_identity_hash` must be unique.
- Import must be idempotent.
- Re-running the same package should match existing hashes, not create duplicates.
- Different relationship types may coexist only when separately reviewed.
- Reversed source/target relationships are not duplicates by default because relationship direction matters.

Package identity policy:

- `package_id` records which normalized package introduced the row.
- `source_checksum` records the acquired source checksum.
- Future `package_checksum` can record the normalized package checksum.

## Index Strategy

Required indexes:

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

Recommended composite indexes for first API phase:

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

Future optional indexes:

```txt
KEY target_type_lookup (target_book, target_start_chapter, target_start_verse, relationship_type)
KEY dataset_package_lookup (source_dataset, package_id)
```

Index notes:

- Reader lookups should primarily use `source_lookup`.
- Reverse discovery should use `target_lookup`.
- Review tooling should use `review_status_lookup`.
- Import audit should use `package_lookup`.
- API filtering should use relationship type and review status indexes.

## Scale / Performance

Current validated package:

```txt
relationships: 341176
package size: approximately 171 MB
ranges_normalized: 87418
```

Performance requirements:

- Import must stream JSONL line-by-line.
- Import must batch inserts.
- Import must not load the full package into memory.
- Query paths must use indexes.
- API responses must be bounded.
- Reader UI must query only the current verse or approved range.
- No whole-Bible cross-reference payloads.
- No full package returned through REST.
- Pagination or hard limits are required for broad lookups.
- Default ordering may use reviewed/curated priority first and `source_score` second after API approval.

Suggested first API limits after future API approval:

```txt
default_limit: 25
max_limit: 100
```

The exact API contract remains future work and is not approved by this design.

## Future Compatibility

### Reader Panel

The table should support:

- current verse lookup
- relationship type filter
- source score ordering
- reference-only responses
- optional text snippet composition through existing Bible APIs

### Word Study

The table should support future Word Study integration through passage references. It should not auto-create lexical relationships from shared Strong numbers.

Future `word_study` relationships must be curated or source-backed separately.

### Gospel Harmony

The table should support future Gospel Harmony integration through `parallel_event` relationships or curated harmony-derived packages.

OpenBible `theme` records must not be treated as harmony units without review.

### Commentary Layer

The table should support future Commentary surfaces by exposing related references and relationship metadata, while commentary content remains separate from Cross Reference source data.

### Future Curated Overrides

Future curated data may:

- add narrower relationship types
- add `curated_rank`
- mark rows as reviewed
- supersede or hide source-backed imported rows

Curated overrides should not destroy source provenance.

## Schema Change Boundary

This document does not approve schema changes.

Before implementation, WCM must separately approve:

- schema change scope
- `SchemaInstaller` modification
- `DB_VERSION` increment
- migration/rollback plan
- local backup requirement
- local dry-run/apply command sequence
- local import tooling
- post-import validation

No staging or production schema change is approved by this document.

## Risks

### Schema Risk

Risk:

- A new table changes the database model.

Mitigation:

- Make the schema additive.
- Increment `wcm_core_db_version`.
- Keep migration idempotent.
- Validate table existence and indexes before import.

### Import Risk

Risk:

- `341,176` rows can expose batch, duplicate, or memory issues.

Mitigation:

- Stream JSONL.
- Batch inserts.
- Use `relationship_identity_hash`.
- Dry-run before apply.
- Require local DB backup.

### Query Risk

Risk:

- Unbounded reader queries can be slow or noisy.

Mitigation:

- Use source lookup indexes.
- Cap API responses.
- Paginate broad lookups.
- Avoid full-chapter or whole-Bible prefetch unless separately approved.

### Interpretation Risk

Risk:

- OpenBible records could be perceived as doctrinally curated relationships.

Mitigation:

- Use `relationship_type = theme`.
- Use `review_status = unreviewed`.
- Preserve source score as source weight only.
- Require curated review for theological categories.

## Final Recommendation

```txt
Ready With Conditions
```

Conditions:

- Separate Schema Approval Review is required.
- Separate Migration Design is required.
- Separate Import Tooling Design is required.
- Separate Local Apply approval is required.
- No staging or production apply is authorized.

## Next Objective

CR-16 - Cross Reference Schema Approval Review.

That review should decide whether to authorize an additive schema implementation for `wcm_cross_references`, including `SchemaInstaller` changes, `DB_VERSION` increment, migration rollback, and validation requirements.
