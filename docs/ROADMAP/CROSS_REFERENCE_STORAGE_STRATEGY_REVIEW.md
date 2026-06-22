# Cross Reference Storage Strategy Review

Date: 2026-06-22

## Purpose

This document records CR-14 Cross Reference Storage Strategy Review.

The core question is where WCM should store the validated OpenBible-derived Cross Reference package before any local import is approved.

This is a review and documentation phase only. It does not perform or authorize import, database writes, schema changes, migrations, API implementation, backend runtime changes, frontend runtime changes, staging apply, or production apply.

## Current Phase

Phase CR-14 - Cross Reference Storage Strategy Review.

Current Cross Reference package state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
local import approval review passed: yes
relationships: 341176
duplicate relationships: 0
invalid references: 0
blocking errors: 0
package path: /private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/
```

## Non-Actions

This review does not perform or authorize:

- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Existing Architecture Review

### Current Custom Tables

Current `SchemaInstaller` tables:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
wcm_original_terms
wcm_original_word_occurrences
```

Findings:

- `wcm_bible_versions`, `wcm_bible_books`, and `wcm_bible_verses` store Bible text by version/book/chapter/verse.
- `wcm_original_terms` and `wcm_original_word_occurrences` store original-language lexical terms and token occurrences.
- No implemented cross-reference table exists.
- No implemented generic scripture relationship table exists.
- `SchemaInstaller` does not currently create `wcm_scripture_relationships` or `wcm_cross_references`.

Verdict:

```txt
existing custom tables are not sufficient
```

Reason:

Cross references are passage-to-passage relationships with source/provenance/review metadata. They should not be stored as Bible verses or original-language occurrences.

### WordPress CPT / Metadata

Findings:

- ADR-0012 explicitly rejects loose tags/postmeta as the primary relationship layer.
- CPT/postmeta storage is not well suited for 341,176 reference relationships.
- Querying by book/chapter/verse/range would require inefficient meta queries.
- Ranking, duplicate identity, package provenance, and relationship type filtering would be difficult to enforce.

Verdict:

```txt
not suitable
```

### Existing Relationship Concepts

ADR-0012 defines a future `wcm_scripture_relationships` table concept, but no implementation exists.

The future ADR concept is directionally compatible with Cross Reference storage because it models explicit Scripture relationships instead of postmeta or tags.

However, the current Cross Reference package has high-volume, reference-only records with source-specific fields:

- `source_book`
- `source_chapter`
- `source_verse`
- `target_book`
- `target_start_chapter`
- `target_start_verse`
- `target_end_chapter`
- `target_end_verse`
- `relationship_type`
- `source_dataset`
- `source_score`
- `review_status`
- package/source metadata

Verdict:

```txt
conceptually compatible but not implemented
```

Reason:

An additive schema decision is required before import.

## Scale Review

Current package scale:

```txt
relationships: 341176
package size: approximately 171 MB
ranges_normalized: 87418
rows_held: 3507
rows_rejected: 116
```

Storage implications:

- Relationship rows must be stored in a queryable database table, not bundled into frontend code.
- Import must stream JSONL line-by-line.
- Duplicate identity must be enforced or validated.
- Source/package metadata must remain auditable.
- Bible text must not be duplicated in relationship records.

Indexing implications:

- Reader lookup needs fast source reference queries.
- Reverse lookup may be useful later for target reference discovery.
- Relationship type filtering should be indexed.
- Source dataset and review status should be queryable.
- Package provenance should be queryable for rollback and audit.

API implications:

- API responses must be bounded.
- Reader lookup should request current verse or range only.
- Result ordering should use source score or future curated rank.
- Large unbounded dataset responses must be prohibited.

## Candidate Storage Options

### Option A - Dedicated Cross Reference Table

Possible table:

```txt
wcm_cross_references
```

Possible fields:

```txt
id
source_book_id
source_chapter
source_verse
source_end_chapter
source_end_verse
target_book_id
target_start_chapter
target_start_verse
target_end_chapter
target_end_verse
relationship_type
confidence
source_dataset
source_score
source_reference
source_package_id
package_checksum
review_status
notes
created_at
updated_at
```

Recommended indexes:

```txt
source_lookup (source_book_id, source_chapter, source_verse)
source_range_lookup (source_book_id, source_chapter, source_verse, source_end_chapter, source_end_verse)
target_lookup (target_book_id, target_start_chapter, target_start_verse)
relationship_type_lookup (relationship_type)
source_dataset_lookup (source_dataset)
review_status_lookup (review_status)
package_lookup (source_package_id)
duplicate_identity unique key:
  source_book_id,
  source_chapter,
  source_verse,
  source_end_chapter,
  source_end_verse,
  target_book_id,
  target_start_chapter,
  target_start_verse,
  target_end_chapter,
  target_end_verse,
  relationship_type,
  source_dataset
```

Pros:

- Best fit for 341,176 relationship records.
- Enables efficient reader lookup by current reference.
- Keeps source/provenance metadata explicit.
- Supports import idempotency and duplicate identity.
- Avoids overloading Bible verse or original-language tables.
- Keeps future API implementation straightforward.

Cons:

- Requires additive schema approval.
- Requires migration and rollback plan.
- Requires importer implementation.
- Requires future API/repository implementation.

Verdict:

```txt
recommended
```

### Option B - WordPress CPT

Pros:

- Uses familiar WordPress storage.
- Could provide admin editing later.

Cons:

- Poor fit for hundreds of thousands of relationship rows.
- Meta query performance is unsuitable for reference/range lookups.
- Duplicate identity and package provenance are harder to enforce.
- Would mix structured Scripture data with editorial content.
- Conflicts with ADR-0012 direction to avoid postmeta-only relationship modeling.

Verdict:

```txt
not recommended
```

### Option C - Existing Relationship Infrastructure

Current state:

```txt
not implemented
```

Pros if implemented later:

- Could unify cross references with broader Scripture relationships.
- Aligns with ADR-0012 long-term knowledge graph direction.
- Could connect sermons, word studies, commentary, themes, and Scripture references.

Cons now:

- No current table exists.
- The generic ADR-0012 field set needs refinement for source-to-target passage ranges.
- High-volume OpenBible records may require narrower indexes than a broad graph table.
- Import cannot proceed until this infrastructure exists.

Verdict:

```txt
not currently available
```

Recommendation:

If WCM later chooses a broad `wcm_scripture_relationships` table, it should still include the same source/target reference fields, source package metadata, duplicate identity, and indexes required by Option A. For the immediate OpenBible package, a dedicated `wcm_cross_references` table is clearer and lower risk.

### Option D - Static Package + Runtime Lookup

Pros:

- Avoids database schema changes.
- Package is already generated and validated.
- Useful for dry-run, review, and offline inspection.

Cons:

- 171 MB JSONL is not suitable for frontend bundling.
- Runtime file scanning would be too slow for reader requests.
- Requires separate file deployment and cache invalidation policy.
- Harder to paginate, rank, filter, and audit in production.
- Does not fit WordPress API-backed architecture.

Verdict:

```txt
not recommended for runtime
```

Static package should remain the source package and import artifact, not the production query store.

## Schema Impact Review

Can Cross Reference import proceed with no schema change?

```txt
no
```

Reason:

No current table can safely store 341,176 passage-to-passage relationships with relationship type, source score, source package metadata, review status, and duplicate identity.

Is additive schema required?

```txt
yes
```

Reason:

A new custom table is required for normalized, indexed, reference-only cross-reference records.

Is migration required?

```txt
yes
```

Reason:

`SchemaInstaller` must create the table and increment `wcm_core_db_version` in a future approved schema phase. The migration must be additive and idempotent.

Schema impact verdict:

```txt
Schema Approval Required
```

## Query Pattern Review

### Reader

Expected query:

```txt
current book/chapter/verse -> related target references
```

Requirements:

- Fast lookup by source reference.
- Optional filter by relationship type.
- Bounded result count.
- Sort by review status, source score, and future curated rank.
- Return references and metadata only.
- Bible text should be fetched separately by existing Bible APIs if needed.

### Word Study

Expected query:

```txt
term occurrence references -> related cross references
```

Requirements:

- Lookup by occurrence verse or passage.
- Potential future relationship type `word_study`.
- Do not auto-create lexical relationships from shared Strong numbers.
- Preserve curated/source-backed boundary.

### Gospel Harmony

Expected query:

```txt
current Gospel passage or harmony unit -> related parallel_event/cross-reference records
```

Requirements:

- Support passage ranges.
- Keep Gospel Harmony unit data distinct from Cross Reference source records.
- Avoid interpreting generic `theme` records as `parallel_event` without curated review.

## Performance Review

Relationship count:

```txt
341176
```

Performance requirements:

- Store in a custom table with targeted indexes.
- Use numeric `book_id` values for joins to `wcm_bible_books`.
- Avoid storing Bible text.
- Avoid unbounded API responses.
- Paginate or cap response size.
- Batch imports.
- Stream JSONL imports.
- Use duplicate identity checks before insert.
- Consider source score ordering for OpenBible-derived results.

Suggested first API behavior after future approval:

- Current verse lookup only.
- Default limit, for example 20-50 records.
- Optional relationship type filter.
- Optional include text snippets only through existing Bible lookup services.
- No full-chapter cross-reference prefetch unless separately approved and capped.

## Recommendation

Final recommendation:

```txt
Schema Approval Required
```

Implementation direction after approval:

```txt
Additive Schema Recommended
```

Recommended storage option:

```txt
Option A - Dedicated Cross Reference Table
```

Rationale:

- Existing tables are not sufficient.
- CPT/postmeta is not appropriate for this scale or query shape.
- Static package lookup is not appropriate for runtime.
- ADR-0012's future relationship model is compatible in principle, but no implemented relationship infrastructure exists.
- A dedicated table provides the lowest-risk path for the validated OpenBible package and can later bridge into a broader Scripture relationship graph.

## Next Objective

CR-15 - Cross Reference Schema Design.

Before any import, WCM must explicitly approve:

- table name and fields
- index strategy
- duplicate identity policy
- package/source metadata storage
- schema version increment
- migration rollback plan
- local-only import tooling scope
- no staging/production apply without separate approval
