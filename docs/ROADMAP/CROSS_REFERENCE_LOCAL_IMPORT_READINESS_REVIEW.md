# Cross Reference Local Import Readiness Review

Date: 2026-06-22

## Purpose

This document reviews whether Word Covenant Ministry is ready to proceed toward a future local-only Cross Reference import.

This is a readiness review only. It does not authorize source acquisition, data download, import, database writes, schema changes, migrations, API implementation, backend runtime changes, or frontend runtime changes.

## Current Phase

Phase CR-5 - Cross Reference Local Import Readiness Review.

Completed prior planning:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.
- CR-4 Dry-Run Specification completed.

Current source direction:

- Recommended first source: OpenBible.info Cross References.
- Fallback and validation source: Treasury of Scripture Knowledge through CrossWire/SWORD.
- High-trust theological relationships remain WCM-curated.

## Non-Actions

This review does not perform or authorize:

- data download
- source acquisition
- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Source Readiness

### OpenBible Candidate

Status: complete for source-review planning; incomplete for acquisition.

Findings:

- OpenBible.info Cross References is the recommended first source candidate.
- The source review identifies it as practical because it provides a purpose-built cross-reference dataset.
- Future use must import references and source metadata only.
- Future use must not import copied Bible text.
- Future use must preserve attribution requirements.

Required before import readiness:

- explicit approval for source acquisition.
- exact source package path or URL confirmation.
- source package checksum.
- source package file inventory.
- attribution text captured in manifest.
- source package kept outside tracked source or in an ignored generated path.

### License

Status: complete for planning; incomplete for acquired package verification.

Findings:

- OpenBible source review records Creative Commons Attribution as the relevant license posture.
- Redistribution, modification, and commercial use are conditionally acceptable under CC BY terms when attribution is preserved.
- Copyrighted Bible text must not be imported or stored.

Required before import readiness:

- license captured in `manifest.json`.
- attribution field captured in `manifest.json`.
- package policy confirms reference-only data.
- legal/source note reviewed before any public use.

### Attribution

Status: incomplete.

Findings:

- Attribution is required for OpenBible-derived data.
- The exact attribution statement has not yet been fixed in an acquired package manifest.

Required before import readiness:

- final attribution text.
- attribution display/storage policy.
- attribution included in dry-run report.

### Provenance

Status: complete for planning; incomplete for acquired package verification.

Findings:

- Source review identifies OpenBible as the maintainer/publisher.
- OpenBible data is described as drawing primarily from public-domain sources, especially Treasury of Scripture Knowledge, plus OpenBible-derived signals.
- TSK/CrossWire remains a public-domain validation/fallback source.

Required before import readiness:

- acquired package provenance recorded.
- source URL and acquisition timestamp recorded.
- checksum recorded.
- source file list recorded.

### Checksum Policy

Status: complete in specification; incomplete in execution.

Findings:

- CR-3 requires checksums in the package manifest.
- CR-4 requires checksum validation before dry-run pass.
- No package checksum exists yet because no source has been acquired.

Required before import readiness:

- `checksum.sha256` file for package files.
- manifest checksum fields.
- dry-run checksum verification.

Source readiness verdict:

```txt
incomplete
```

Reason:

Source review is complete, but source acquisition and package-level verification have not occurred.

## Package Readiness

### Manifest

Status: specification complete; actual package incomplete.

Required manifest fields:

- `package_id`
- `source_name`
- `source_url`
- `license`
- `attribution`
- `checksum`
- `record_count`
- `generated_at`
- `verified_at`

Finding:

- CR-3 and CR-4 define the manifest contract.
- No actual `manifest.json` package file exists for Cross Reference import.

### Checksum

Status: specification complete; actual package incomplete.

Finding:

- CR-4 defines checksum validation rules.
- No actual `checksum.sha256` exists for a Cross Reference package.

### JSONL Structure

Status: specification complete; actual package incomplete.

Expected file:

```txt
cross_references.jsonl
```

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

Finding:

- CR-3 defines reference-only JSONL shape.
- CR-4 defines JSONL validation rules.
- No actual package JSONL file exists yet.

### Metadata

Status: specification complete; actual package incomplete.

Finding:

- Source metadata requirements are documented.
- Actual source metadata must be collected during future source acquisition.

Package readiness verdict:

```txt
incomplete
```

Reason:

The package specification is complete, but no approved package has been acquired, generated, or validated.

## Dry Run Readiness

### Validation Rules

Status: complete for specification.

Findings:

- CR-4 defines manifest validation.
- CR-4 defines checksum validation.
- CR-4 defines JSONL row validation.
- CR-4 defines canonical reference validation.
- CR-4 defines relationship type, confidence, and review status validation.

### Duplicate Rules

Status: complete for specification.

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

### Relationship Validation

Status: complete for specification.

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

Policy-sensitive types remain curated/reviewed only.

### Reporting

Status: complete for specification.

Required dry-run report fields include:

- `rows_read`
- `rows_valid`
- `rows_rejected`
- `invalid_references`
- `unsupported_relationship_types`
- `duplicate_relationships`
- `missing_metadata`
- `license_status`
- `attribution_status`
- `blocking_errors`
- `warnings`
- `dry_run_status`

Dry-run readiness verdict:

```txt
complete for specification
incomplete for execution
```

Reason:

The dry-run rules are documented, but no dry-run tool or dry-run report has been approved or executed.

## Import Safety Review

### Local-Only Import

Status: incomplete.

Requirement:

- Import must be local-only until separate staging and production approvals exist.
- Import must require explicit `--apply` or equivalent future approval gate.
- Import must never run as part of source acquisition or dry-run.

Current finding:

- No import tooling is approved in this phase.
- No local import should proceed until a valid package and dry-run report exist.

### DB Backup Requirement

Status: required before any local import.

Minimum requirement:

- create local DB backup before import.
- record backup path.
- verify backup file exists and is readable.
- document restore command.

### Rollback Requirement

Status: required before any local import.

Minimum requirement:

- restore full local DB backup if import corrupts data.
- if future storage supports import batch IDs, support batch-level rollback.
- protect KRV, WEB, original-language terms, original-language occurrences, and existing Scripture data from accidental changes.

### Restore Procedure Requirement

Status: required before any local import.

Minimum requirement:

- documented restore command.
- restore verification steps.
- post-restore API smoke checks.
- confirmation that existing Bible and original-language counts remain intact.

Import safety verdict:

```txt
incomplete
```

Reason:

Backup, restore, rollback, and storage strategy must be reviewed again after a real package and dry-run report exist.

## Relationship Scale Review

### Package Size

Expected scale:

- OpenBible source review describes about `340,000` cross references.
- TSK/CrossWire source review describes about `500,000` scripture references and parallel passages.

Risk:

- Package files may be large enough to require streaming validation.
- Generated packages should stay outside Git or under ignored generated paths.

### Record Count

Expected range:

```txt
hundreds of thousands of relationship records
```

Risk:

- Local import may require batching.
- UI/API must not return unbounded results.
- Duplicate detection must be memory-conscious.

### Memory Concerns

Required future approach:

- stream JSONL rows.
- avoid loading the full relationship set into memory when possible.
- use hash-based duplicate detection with bounded reporting.
- summarize duplicate groups instead of emitting huge full payloads.

### Duplicate Concerns

Expected duplicate types:

- exact duplicate source-target pairs.
- reversed source-target pairs.
- same source-target pair with multiple relationship types.
- OpenBible records overlapping future WCM-curated records.
- OpenBible records overlapping TSK-derived validation records.

Relationship scale verdict:

```txt
ready for source acquisition review with streaming-validation requirement
```

## Integration Readiness

### Reader

Status: frontend foundation exists; backend/data integration not ready.

Future integration:

- Bible Study Workspace Cross Reference panel can consume future reference results.
- Public UI should show compact references and relationship labels.
- API must stay paginated or bounded.

### Word Study

Status: conceptual integration documented; data integration not ready.

Future integration:

- Word Study may show source-backed or curated passage relationships.
- Shared Strong numbers alone must not auto-create cross references.
- Hebrew-Greek relationships remain separate and curated/source-backed.

### Gospel Harmony

Status: frontend foundation exists; data integration not ready.

Future integration:

- Gospel Harmony may expose `parallel_event` relationships.
- Harmony units must still store references, not Bible text.
- Gospel Harmony and Cross Reference should remain distinct but interoperable.

Integration readiness verdict:

```txt
partial
```

Reason:

Frontend foundations exist, but backend storage, API, package ingestion, and public runtime integration are not approved.

## Risks

### Source Risk

- OpenBible package has not been acquired or inspected.
- Actual package shape may differ from assumptions.
- TSK validation source may require parser work if used for comparison.

### License Risk

- OpenBible requires attribution.
- WCM must avoid importing copied Bible text.
- Any non-OpenBible or non-TSK source requires separate license review.

### Provenance Risk

- OpenBible blends public-domain TSK and OpenBible-derived signals.
- Source update cadence is not fully fixed in current docs.
- Package metadata must record exact acquisition time and checksum.

### Data Quality Risk

- Bulk cross references may be broad topical links rather than precise quotation/allusion relationships.
- Relationship types may be too coarse for user-facing theological labels.
- High-judgment categories must remain curated.

### Import Risk

- Record count may be large.
- Duplicate detection may be expensive.
- Future schema/storage design is not yet approved.
- Backup/rollback plans are not yet tied to an actual import tool.
- Public API must avoid unbounded response payloads.

## Readiness Summary

| Area | Verdict | Reason |
| --- | --- | --- |
| Source readiness | incomplete | Source review exists, but no source acquisition or package checksum exists. |
| Package readiness | incomplete | Manifest/JSONL/checksum specs exist, but no actual package exists. |
| Dry-run readiness | specification complete, execution incomplete | Validation rules exist, but no dry-run report exists. |
| Import safety | incomplete | Backup/rollback/restore must be reviewed against actual package and future storage design. |
| Relationship scale | ready for source acquisition review with conditions | Expected scale is understood, but requires streaming validation. |
| Integration readiness | partial | Frontend foundations exist; storage/API/import remain unapproved. |

## Final Verdict

```txt
Ready For Source Acquisition Review
```

The project is not ready for local import. It is ready to proceed to a controlled source acquisition review phase, if separately approved.

Required conditions before local import readiness can be reconsidered:

1. Explicit source acquisition approval.
2. Acquired package kept outside tracked source or in an ignored generated path.
3. Manifest created with source, license, attribution, checksum, and record count.
4. JSONL package generated without Bible text.
5. Dry-run tooling or process approved.
6. Dry-run report produced and passed.
7. Local backup, rollback, and restore plan confirmed against the future import target.
8. Storage/schema/API strategy approved separately if database persistence is required.

## Next Objective

Recommended next phase:

```txt
CR-6 - Cross Reference Source Acquisition Review
```

CR-6 should remain review-only unless the user explicitly approves source acquisition. It should define the exact source package location, checksum capture process, attribution text, and package generation policy.

No download or source acquisition should occur until CR-6 is explicitly approved.
