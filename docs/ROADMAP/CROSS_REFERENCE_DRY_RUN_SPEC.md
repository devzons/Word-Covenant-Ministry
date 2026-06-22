# Cross Reference Dry-Run Specification

Date: 2026-06-22

## Purpose

This document defines what must be validated before any Cross Reference package can be imported.

The dry-run stage exists to prove that a reviewed package is structurally valid, license-aware, reference-only, duplicate-aware, and compatible with WCM canonical Scripture references before any database write, schema change, API implementation, or runtime change is considered.

Dry-run is a gate between package review and future local import approval:

```txt
Source Review
-> Data Package Specification
-> Dry Run
-> Local Import Readiness Review
-> Local Import After Explicit Approval
```

## Current Phase

Phase CR-4 - Cross Reference Dry-Run Specification.

This phase is documentation only.

Completed prior phases:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.

Current source direction:

- Recommended first source: OpenBible.info Cross References.
- Fallback and validation source: Treasury of Scripture Knowledge through CrossWire/SWORD.
- High-trust theological relationships remain WCM-curated.

## Non-Actions

This document does not authorize:

- data download
- data import
- database writes
- schema changes
- migrations
- API implementation
- backend runtime changes
- frontend runtime changes
- staging changes
- production changes

## Input Files

A future dry-run should accept a prepared Cross Reference package directory.

Required files:

```txt
manifest.json
cross_references.jsonl
checksum.sha256
```

Allowed optional files:

```txt
README.md
source-attribution.md
validation-notes.md
review-notes.tsv
```

Input file policy:

- `manifest.json` contains package metadata and source policy.
- `cross_references.jsonl` contains reference-only relationship records.
- `checksum.sha256` contains checksums for package files.
- No input file may contain copied Bible text.
- No SQL dump is allowed.
- No package may be imported directly without a dry-run report.

## Manifest Requirements

`manifest.json` must include:

```json
{
  "package_id": "cross_reference.openbible.2026-06-22.001",
  "source_name": "OpenBible.info Cross References",
  "source_url": "https://www.openbible.info/labs/cross-references/",
  "license": "Creative Commons Attribution",
  "attribution": "Attribution text required by source license.",
  "checksum": "sha256-value",
  "record_count": 0,
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "verified_at": "YYYY-MM-DDTHH:MM:SSZ"
}
```

Required fields:

- `package_id`
- `source_name`
- `source_url`
- `license`
- `attribution`
- `checksum`
- `record_count`
- `generated_at`
- `verified_at`

Recommended fields:

- `source_file_name`
- `source_file_count`
- `source_checksum`
- `package_checksum`
- `source_policy`
- `relationship_types`
- `review_status`
- `notes`

Manifest validation must confirm:

- required fields are present and non-empty.
- `record_count` is a non-negative integer.
- license is explicitly recorded.
- attribution is present when the source requires it.
- source policy confirms reference-only data.
- checksum field matches `checksum.sha256` validation.
- package ID is stable enough to identify the dry-run report.

## Checksum Validation

Dry-run must validate:

- checksum file exists.
- checksum entries are parseable.
- every required package file has a checksum entry.
- calculated checksums match recorded checksums.
- manifest checksum agrees with package checksum policy.

A checksum mismatch is always a blocking error.

## JSONL Row Validation

Each row in `cross_references.jsonl` must be valid JSON and must represent one relationship.

Required row fields:

- `source_book`
- `source_chapter`
- `source_verse`
- `target_book`
- `target_chapter`
- `target_verse`
- `relationship_type`
- `confidence`
- `source_dataset`
- `review_status`

Optional range fields:

- `source_end_chapter`
- `source_end_verse`
- `target_end_chapter`
- `target_end_verse`

Optional metadata fields:

- `id`
- `source_reference`
- `notes`

Validation rules:

- JSON must parse without error.
- required fields must be present.
- chapter and verse fields must be positive integers.
- optional range fields must be null or positive integers.
- end range must not precede start range.
- source and target cannot be identical unless explicitly allowed by a future review rule.
- `notes` must not contain copied Bible text.
- `source_dataset` must match or be traceable to the package manifest.
- `review_status` must be an allowed value.

## Canonical Reference Validation

Every source and target reference must validate against WCM canonical 66-book structure.

Dry-run must confirm:

- book slug is a WCM canonical book slug.
- book belongs to the canonical Protestant 66-book structure.
- chapter is valid for the book.
- verse is valid for the book and chapter when verse-count data is available.
- optional range end is valid.
- optional range remains within a supported book unless future policy explicitly allows multi-book ranges.
- unsupported books are rejected.
- malformed references are rejected.

Canonical validation should use WCM book slugs such as:

```txt
genesis
exodus
psalms
isaiah
matthew
john
romans
revelation
```

Reference validation must remain version-independent. Cross Reference records point to canonical references, not a specific Bible translation.

## Relationship Type Validation

Allowed relationship types:

- `quotation`
- `allusion`
- `parallel_event`
- `theme`
- `promise_fulfillment`
- `prophecy_fulfillment`
- `typology`
- `law_gospel`
- `word_study`
- `curated_manual`

Validation rules:

- any relationship type outside the list is rejected.
- imported bulk source records must not automatically use curated-only theological categories.
- `promise_fulfillment`, `prophecy_fulfillment`, `typology`, and `law_gospel` require reviewed or curated status.
- `quotation` requires source evidence or reviewed status.
- broad external links may use `theme` when no narrower reviewed type is justified.

## Confidence Validation

Allowed confidence values:

- `source_backed`
- `reviewed`
- `curated`
- `needs_review`
- `held_for_policy`

Validation rules:

- external bulk imports should normally use `source_backed` or `needs_review`.
- `curated` requires WCM review metadata.
- `held_for_policy` records are valid for reporting but must not be considered import-ready.
- confidence must not be treated as theological certainty.

## Review Status Validation

Allowed review status values:

- `unreviewed`
- `approved`
- `needs_review`
- `needs_policy`
- `rejected`
- `suppressed`

Validation rules:

- `needs_policy`, `rejected`, and `suppressed` records must be excluded from any future import-ready count.
- `approved` records must still pass canonical reference and duplicate validation.
- `unreviewed` records may pass package validation but should not be considered ready for public high-trust categories.

## Duplicate Detection

Primary duplicate identity:

```txt
source_reference + target_reference + relationship_type + source_dataset
```

Expanded identity fields:

```txt
source_book
source_chapter
source_verse
source_end_chapter
source_end_verse
target_book
target_chapter
target_verse
target_end_chapter
target_end_verse
relationship_type
source_dataset
```

Dry-run must report:

- exact duplicate relationships.
- duplicate rows with different IDs.
- reversed relationships where source and target are swapped.
- same source and target under multiple relationship types.
- package records that may duplicate existing curated records if comparison data is available.

Duplicate policy:

- exact duplicates are blocking unless explicitly marked as expected and resolved by the dry-run policy.
- reversed duplicates are warning-level unless a future relationship direction policy makes them blocking.
- same references under different relationship types are warning-level unless the types conflict.
- unresolved duplicate relationships prevent local import readiness.

## Dry-Run Report Fields

A dry-run report must include:

- `package_id`
- `source_name`
- `source_url`
- `license_status`
- `attribution_status`
- `checksum_status`
- `rows_read`
- `rows_valid`
- `rows_rejected`
- `invalid_references`
- `unsupported_relationship_types`
- `duplicate_relationships`
- `missing_metadata`
- `blocking_errors`
- `warnings`
- `dry_run_status`

Recommended report fields:

- `manifest_valid`
- `checksum_valid`
- `record_count_expected`
- `record_count_actual`
- `json_parse_errors`
- `invalid_source_references`
- `invalid_target_references`
- `unsupported_books`
- `range_errors`
- `curated_type_policy_violations`
- `held_for_policy_count`
- `import_ready_count`
- `excluded_count`
- `generated_at`

Recommended `dry_run_status` values:

- `dry_run_passed`
- `dry_run_passed_with_warnings`
- `dry_run_failed`

## Success Criteria

Dry-run succeeds only when:

- manifest is valid.
- checksum is valid.
- license is present.
- attribution is present.
- record count matches JSONL rows.
- JSONL rows parse successfully.
- canonical references are valid.
- relationship types are valid.
- confidence values are valid.
- review status values are valid.
- duplicate relationships are resolved or reported according to policy.
- `blocking_errors = 0`.
- no database write occurs.
- no import occurs.
- no schema or runtime change occurs.

Success does not authorize import. It only allows the project to proceed to local import readiness review.

## Failure Criteria

Dry-run fails when any of the following occur:

- missing manifest.
- invalid manifest JSON.
- missing required manifest metadata.
- checksum file missing.
- checksum mismatch.
- missing license.
- missing required attribution.
- invalid JSONL row.
- invalid source or target reference.
- unsupported book.
- unsupported relationship type.
- unsupported confidence value.
- unsupported review status value.
- duplicate relationships not reviewed or resolved.
- copied Bible text detected in relationship records.
- DB write attempted.
- import attempted.
- schema change attempted.
- runtime change attempted.

Failure must leave the package in a non-import-ready state.

## Severity Policy

Blocking errors:

- missing manifest.
- checksum mismatch.
- missing license or attribution.
- JSON parse error.
- invalid canonical reference.
- unsupported relationship type.
- unresolved exact duplicate.
- copied Bible text.
- any attempted DB write.

Warnings:

- reversed relationship duplicates.
- broad `theme` classifications from bulk sources.
- `needs_review` records.
- `held_for_policy` records.
- same source/target pair under multiple relationship types.
- optional metadata missing where not required.

## Dry-Run Workflow

Future dry-run workflow:

1. Confirm package path is outside ignored/generated source constraints or explicitly approved.
2. Read `manifest.json`.
3. Validate manifest metadata.
4. Validate `checksum.sha256`.
5. Stream `cross_references.jsonl`.
6. Validate row shape.
7. Validate canonical references.
8. Validate relationship type, confidence, source dataset, and review status.
9. Detect duplicates.
10. Produce dry-run report.
11. Stop without writing to the database.

The dry-run implementation must be memory-conscious because cross-reference packages may be large.

## Non-Actions

CR-4 does not authorize:

- source download.
- package download.
- import.
- database write.
- schema creation.
- migration.
- API creation.
- backend runtime changes.
- frontend runtime changes.
- staging apply.
- production apply.

## Final Recommendation

Proceed next to:

```txt
CR-5 - Cross Reference Local Import Readiness Review
```

CR-5 should review:

- accepted dry-run report.
- local backup and rollback requirements.
- whether a schema/storage decision is required before import.
- import-ready record count.
- excluded and policy-held records.
- source attribution display requirements.
- approval gate for local-only import.

CR-5 must remain review-only unless implementation or local import is separately approved.
