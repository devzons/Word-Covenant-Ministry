# Cross Reference Data Package Specification

Date: 2026-06-22

## Purpose

Cross Reference data must be portable, reviewable, attributable, and safe to validate before it reaches any WordPress database table or runtime API.

The Cross Reference Package exists to define a reference-only exchange format for future source-backed and curated Scripture relationships. It prevents WCM from treating third-party source files, SQL dumps, frontend fixtures, or copied Bible text as the authoritative cross-reference layer.

The package is needed because Cross Reference data will eventually connect:

- Bible Reader passages
- Bible Study Workspace research panels
- Word Study and original-language workflows
- Gospel Harmony relationships
- future Commentary and Hebrew-Greek Bridge surfaces

All relationship records must point to canonical Scripture references. They must not store Bible text.

## Current Phase

Phase CR-3 - Cross Reference Data Package Specification.

This phase is documentation only. It follows:

- Phase CR-1 Cross Reference planning.
- Phase CR-2 Cross Reference Source and License Review.

The CR-2 recommendation is:

- Recommended first source: OpenBible.info Cross References, with conditions.
- Validation source: Treasury of Scripture Knowledge through CrossWire/SWORD.
- Curated overlay: WCM-authored reviewed relationships for high-trust theological categories.

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
- production changes

## Source Policy

### OpenBible

OpenBible.info Cross References is the recommended first source candidate for a future package review.

Policy:

- Use only after explicit source package approval.
- Import references and source metadata only.
- Do not import Bible text.
- Preserve Creative Commons Attribution requirements.
- Record source URL, license, source checksum, and package checksum.
- Treat imported relationship types conservatively until reviewed.
- Do not automatically classify records as `typology`, `promise_fulfillment`, `prophecy_fulfillment`, or `law_gospel`.

Initial relationship type policy:

```txt
Imported OpenBible records should default to a conservative review type such as theme or curated_manual candidate until CR-4 dry-run rules define exact classification.
```

### Treasury of Scripture Knowledge

Treasury of Scripture Knowledge through CrossWire/SWORD is the validation source and public-domain fallback candidate.

Policy:

- Use only after explicit source package approval.
- Confirm the exact CrossWire module metadata before package creation.
- Preserve public-domain provenance even when attribution is not legally required.
- Use as a comparison source for OpenBible-derived links where practical.
- Expect parser complexity because TSK is a commentary module, not a normalized relationship table.

Initial relationship type policy:

```txt
TSK-derived records should be treated as related-reference candidates unless reviewed into a narrower type.
```

### Future Curated Sources

Future curated sources include WCM-authored manual review worksheets, reviewed Gospel Harmony relationships, Hebrew-Greek Bridge relationships, and editorially approved theological pathways.

Policy:

- Curated records must include reviewer or review status metadata.
- Curated records may use narrower relationship types.
- Theological relationship types require explicit review.
- Curated records should be packageable with the same metadata and checksum rules as external sources.

Curated-only relationship types by default:

- `promise_fulfillment`
- `prophecy_fulfillment`
- `typology`
- `law_gospel`

## Package Structure

Future package structure should be reference-only and generated outside normal runtime code.

Recommended structure:

```txt
cross-reference-package/
├── manifest.json
├── relationships.jsonl
├── checksums.sha256
└── README.md
```

Optional future files:

```txt
source-attribution.md
validation-report.json
review-notes.tsv
```

Generated packages and large source files must not be committed unless separately approved. Documentation, manifest examples, and tiny sample files may be committed when useful.

## Package Metadata

`manifest.json` should include:

```json
{
  "package_id": "cross_reference.openbible.2026-06-22.001",
  "source_name": "OpenBible.info Cross References",
  "source_url": "https://www.openbible.info/labs/cross-references/",
  "license": "Creative Commons Attribution",
  "version": "reviewed-source-version-or-date",
  "checksum": "sha256-of-source-or-package",
  "downloaded_at": "YYYY-MM-DDTHH:MM:SSZ",
  "verified_at": "YYYY-MM-DDTHH:MM:SSZ",
  "record_count": 0,
  "relationship_types": [
    "theme"
  ],
  "source_policy": "references_only_no_bible_text",
  "attribution_required": true,
  "review_status": "dry_run_pending",
  "notes": "No Bible text is stored in this package."
}
```

Required metadata fields:

- `package_id`
- `source_name`
- `source_url`
- `license`
- `version`
- `checksum`
- `downloaded_at`
- `verified_at`
- `record_count`

Recommended metadata fields:

- `source_file_name`
- `source_file_count`
- `source_checksum`
- `package_checksum`
- `source_policy`
- `attribution_required`
- `relationship_types`
- `review_status`
- `expected_duplicates`
- `notes`

## Relationship Record Shape

Relationship records must be JSONL records. Each line must represent one source-to-target relationship.

Bible text must not appear in the record.

Minimum record shape:

```json
{
  "source_book": "genesis",
  "source_chapter": 3,
  "source_verse": 15,
  "target_book": "romans",
  "target_chapter": 16,
  "target_verse": 20,
  "relationship_type": "theme",
  "confidence": "source_backed",
  "source_dataset": "openbible",
  "review_status": "unreviewed"
}
```

Recommended full record shape:

```json
{
  "id": "openbible-genesis-3-15-romans-16-20",
  "source_book": "genesis",
  "source_chapter": 3,
  "source_verse": 15,
  "source_end_chapter": null,
  "source_end_verse": null,
  "target_book": "romans",
  "target_chapter": 16,
  "target_verse": 20,
  "target_end_chapter": null,
  "target_end_verse": null,
  "relationship_type": "theme",
  "confidence": "source_backed",
  "source_dataset": "openbible",
  "source_reference": "OpenBible.info Cross References",
  "review_status": "unreviewed",
  "notes": null
}
```

Field policy:

- `source_book` and `target_book` must use WCM canonical book slugs.
- `source_chapter`, `source_verse`, `target_chapter`, and `target_verse` must be positive integers.
- End-range fields may be `null` for single-verse references.
- End-range fields must not precede start references.
- `relationship_type` must be one of the approved Cross Reference Plan values.
- `confidence` must not imply certainty beyond the source evidence.
- `source_dataset` must identify the originating package or curated source.
- `review_status` must distinguish imported, reviewed, held, and rejected records.
- `notes` must not contain copied Bible text.

## Relationship Types

Allowed package relationship types must align with the Cross Reference Plan:

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

Classification policy:

- External bulk sources should not automatically assign high-judgment theological categories.
- Direct `quotation` records require source evidence or manual review.
- `parallel_event` may be used for reviewed Gospel or narrative parallels.
- `theme` may be used for broad source-backed references when no narrower reviewed type is available.
- `curated_manual` may be used when WCM review records the relationship without a narrower type.
- `promise_fulfillment`, `prophecy_fulfillment`, `typology`, and `law_gospel` require curated review.

## Confidence Values

Initial package confidence values:

- `source_backed`
- `reviewed`
- `curated`
- `needs_review`
- `held_for_policy`

Rules:

- External imports should normally start as `source_backed` or `needs_review`.
- WCM-reviewed records may be `reviewed` or `curated`.
- Policy-sensitive records should be `held_for_policy`.
- Confidence is not a theological authority label. It records review state and source support.

## Review Status Values

Initial review statuses:

- `unreviewed`
- `approved`
- `needs_review`
- `needs_policy`
- `rejected`
- `suppressed`

Rules:

- Bulk source records should not enter public UI as high-trust curated theology until reviewed.
- `rejected` and `suppressed` records should remain auditable in validation reports, not silently disappear from review history.
- `needs_policy` records must not be imported into public runtime tables without explicit policy approval.

## Validation Rules

### Source Metadata Validation

Dry-run validation must verify:

- `package_id` is present.
- `source_name` is present.
- `source_url` is present.
- `license` is present.
- `checksum` is present.
- `record_count` matches the number of JSONL relationship records.
- attribution requirements are recorded.
- source policy confirms reference-only data.

### Canonical Reference Validation

Each relationship record must validate:

- source book exists in WCM canonical book slugs.
- target book exists in WCM canonical book slugs.
- chapters are positive integers.
- verses are positive integers.
- source and target references exist in the target canonical reference system where available.
- end ranges do not precede start ranges.
- unsupported books are rejected.
- missing or malformed references are blocking failures.

### Relationship Validation

Each relationship record must validate:

- relationship type is in the approved list.
- confidence value is in the approved list.
- review status is in the approved list.
- source dataset is present.
- notes do not contain Bible text.
- no record claims a curated-only type without reviewed or curated status.

### Duplicate Detection

Duplicate identity should be based on:

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

Validation should report:

- exact duplicate records
- reversed duplicates where source and target are swapped
- duplicate target references under multiple relationship types
- source package records that duplicate existing curated records

Duplicates may be warning-level or blocking depending on the future CR-4 dry-run policy, but they must always be reported.

## Dry Run Policy

The future CR workflow should remain gated:

```txt
Review
-> Package
-> Dry Run
-> Approval
-> Local Import
```

Dry-run must:

- parse the package without writing to the database.
- verify checksums.
- verify expected record count.
- validate canonical references.
- validate relationship types.
- detect duplicates.
- report unsupported books.
- report malformed records.
- report curated-only type violations.
- produce an import readiness verdict.

Dry-run must not:

- create database tables.
- insert records.
- update records.
- call runtime APIs.
- change frontend behavior.
- generate public UI data.

## Apply Gate

Local import is out of scope for this document. A future import phase must require:

- accepted CR-4 dry-run report.
- explicit approval for local import.
- backup and rollback plan.
- schema or storage decision if database persistence is needed.
- source attribution display policy.
- review status policy for public UI exposure.

No staging or production import is implied by local import approval.

## Git And Artifact Policy

Do not commit:

- downloaded source archives
- large generated cross-reference packages
- SQL dumps
- raw Bible text
- generated import reports with large record payloads

Allowed:

- specification documents
- source review documents
- manifest examples
- tiny sample JSONL records
- validation summary reports

Generated package paths should be ignored or kept outside the repository unless separately approved.

## Final Recommendation

Proceed next to:

```txt
CR-4 - Cross Reference Dry-Run Specification
```

CR-4 should define the exact dry-run report format, validation severity levels, source package inspection checklist, duplicate handling policy, and approval gate for a future local-only import.

CR-4 must still be documentation and tooling design unless separately approved for implementation. No data download or import should occur during CR-4 without explicit approval.
