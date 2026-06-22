# Cross Reference Package Creation Specification

Date: 2026-06-22

## Purpose

This document defines the future procedure for creating a WCM Cross Reference package from the acquired OpenBible.info Cross References source.

The goal is to convert the acquired OpenBible TSV source into a reference-only, checksum-backed, dry-run-ready WCM package without importing data into WordPress and without storing copied Bible text.

This is a package creation specification only. It does not create a package, run package generation, import data, write to the database, change schema, add migrations, implement APIs, or change backend/frontend runtime behavior.

## Current Phase

Phase CR-10 - Cross Reference Package Creation Specification.

Completed prior phases:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.
- CR-4 Dry Run Specification completed.
- CR-5 Local Import Readiness Review completed.
- CR-6 Source Acquisition Review completed.
- CR-8 OpenBible source acquisition completed.
- CR-9 Normalization Plan completed.

Acquired source baseline:

```txt
source_name: OpenBible.info Cross References
source_url: https://a.openbible.info/data/cross-references.zip
source_page_url: https://www.openbible.info/labs/cross-references/
raw_source_path: /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
source_file: cross_references.txt
source_checksum_sha256: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
source_record_count: 344799
attribution: www.openbible.info CC-BY 2026-06-22
```

## Non-Actions

This specification does not perform or authorize:

- package generation
- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Package Layout

Future package creation should write to an ignored path or outside the Git repository.

Recommended layout:

```txt
cross-reference-package/
├── manifest.json
├── cross_references.jsonl
├── checksum.sha256
├── generation-report.json
└── README.md
```

Required files:

- `manifest.json` - package metadata, source metadata, counts, license, attribution, and checksum references.
- `cross_references.jsonl` - one normalized reference-only relationship per line.
- `checksum.sha256` - checksums for generated package files.
- `generation-report.json` - package creation statistics, rejections, held rows, and duplicate handling.

Optional files:

- `README.md` - human-readable package notes.
- `rejected-rows.jsonl` - rejected source rows, if generation policy chooses to preserve them outside the import-ready file.
- `held-rows.jsonl` - zero or negative-score rows held for review.
- `source-attribution.md` - source attribution and license summary.

No package file may contain copied Bible text.

## Manifest Schema

`manifest.json` must include:

```json
{
  "package_id": "cross_reference.openbible.normalized.2026-06-22.001",
  "source_package_id": "cross_reference.openbible.raw.2026-06-22.001",
  "source_name": "OpenBible.info Cross References",
  "source_url": "https://a.openbible.info/data/cross-references.zip",
  "source_page_url": "https://www.openbible.info/labs/cross-references/",
  "source_checksum": "676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161",
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "generator_version": "cross-reference-package-generator/0.1.0",
  "relationship_count": 0,
  "rejected_count": 0,
  "attribution": "www.openbible.info CC-BY 2026-06-22",
  "license": "Creative Commons Attribution",
  "source_policy": "references_only_no_bible_text",
  "relationship_types": [
    "theme"
  ],
  "review_status": "dry_run_pending"
}
```

Required manifest fields:

- `package_id`
- `source_name`
- `source_url`
- `source_checksum`
- `generated_at`
- `generator_version`
- `relationship_count`
- `rejected_count`
- `attribution`
- `license`

Recommended manifest fields:

- `source_package_id`
- `source_page_url`
- `source_file_name`
- `source_record_count`
- `package_checksum`
- `checksum_file`
- `generation_report`
- `relationship_types`
- `source_policy`
- `review_status`
- `notes`

Manifest policy:

- `package_id` must be stable for the generated package.
- `source_checksum` must match the acquired OpenBible ZIP checksum.
- `relationship_count` must equal the number of lines in `cross_references.jsonl`.
- `rejected_count` must equal generation report rejected rows.
- `license` and `attribution` must be non-empty.
- `source_policy` must state that the package is reference-only and contains no Bible text.

## JSONL Record Shape

Each JSONL row must represent one normalized relationship.

Required record shape:

```json
{
  "source_book": "genesis",
  "source_chapter": 1,
  "source_verse": 1,
  "target_book": "john",
  "target_start_chapter": 1,
  "target_start_verse": 1,
  "target_end_chapter": 1,
  "target_end_verse": 3,
  "relationship_type": "theme",
  "source_dataset": "openbible",
  "source_score": 369,
  "review_status": "unreviewed"
}
```

Recommended additional fields:

```json
{
  "id": "openbible-genesis-1-1-john-1-1-1-3",
  "confidence": "source_backed",
  "source_weight_bucket": "high_source_weight",
  "source_reference": "OpenBible.info Cross References",
  "source_package_id": "cross_reference.openbible.raw.2026-06-22.001"
}
```

Field policy:

- `source_book` and `target_book` must use WCM canonical book slugs.
- `source_chapter`, `source_verse`, `target_start_chapter`, and `target_start_verse` must be positive integers.
- `target_end_chapter` and `target_end_verse` may be `null` for single-verse targets.
- `relationship_type` must be `theme` for the initial OpenBible package.
- `source_dataset` must be `openbible`.
- `source_score` must preserve the OpenBible `Votes` value as an integer.
- `review_status` must be `unreviewed` for generated OpenBible records.
- Records must not include copied Bible text.

## Range Encoding Rules

### Single Verse

Source:

```txt
Gen.1.1 -> Mark.13.19
```

Normalized target:

```json
{
  "target_book": "mark",
  "target_start_chapter": 13,
  "target_start_verse": 19,
  "target_end_chapter": null,
  "target_end_verse": null
}
```

### Same-Book Verse Range

Source:

```txt
Gen.1.1 -> John.1.1-John.1.3
```

Normalized target:

```json
{
  "target_book": "john",
  "target_start_chapter": 1,
  "target_start_verse": 1,
  "target_end_chapter": 1,
  "target_end_verse": 3
}
```

### Same-Book Cross-Chapter Range

Source:

```txt
John.3.16-John.4.2
```

Normalized target:

```json
{
  "target_book": "john",
  "target_start_chapter": 3,
  "target_start_verse": 16,
  "target_end_chapter": 4,
  "target_end_verse": 2
}
```

Range support policy:

- Support source single verse to target single verse.
- Support source single verse to target same-book verse range.
- Support source single verse to target same-book cross-chapter range.
- Reject cross-book target ranges.
- Reject malformed ranges.
- Reject end ranges that precede start references.
- Reject references that cannot be mapped to WCM canonical books.

## Relationship Rules

Initial OpenBible package policy:

```txt
relationship_type = theme
confidence = source_backed
review_status = unreviewed
source_dataset = openbible
```

Rationale:

- OpenBible provides related references and numeric vote scores.
- OpenBible does not provide WCM relationship categories.
- `theme` is the safest broad relationship type for source-backed related-reference candidates.
- The generator must not infer doctrine or high-judgment relationship categories.

Do not auto-generate:

- `quotation`
- `allusion`
- `parallel_event`
- `promise_fulfillment`
- `prophecy_fulfillment`
- `typology`
- `law_gospel`
- `word_study`

Future curated override policy:

- A later WCM review process may override `relationship_type`.
- Curated overrides must preserve the original OpenBible source metadata.
- Curated overrides require reviewer/review status metadata in a future package or database model.

## Score Policy

OpenBible `Votes` must be preserved as `source_score`.

Recommended score bucket policy:

| Votes | `source_weight_bucket` |
| ---: | --- |
| `>= 100` | `high_source_weight` |
| `25` to `99` | `medium_source_weight` |
| `1` to `24` | `low_source_weight` |
| `0` | `neutral_source_weight` |
| `< 0` | `negative_source_weight` |

Initial creation policy:

- Generate import-ready records only for positive-score rows.
- Hold zero-score rows in the generation report or optional `held-rows.jsonl`.
- Hold negative-score rows in the generation report or optional `held-rows.jsonl`.
- Do not discard held rows silently.
- Do not treat score as theological certainty.

## Rejection Rules

Reject rows from `cross_references.jsonl` generation when any of these conditions occur:

- invalid source reference
- invalid target reference
- unsupported book abbreviation
- unsupported book outside WCM canonical 66-book structure
- malformed row
- missing score
- non-integer score
- source or target chapter is not a positive integer
- source or target verse is not a positive integer
- range end precedes range start
- cross-book range
- copied Bible text appears in a generated record

Rejected rows must be counted in `rejected_count` and reported in `generation-report.json`.

Held rows are distinct from rejected rows:

- zero-score rows may be held.
- negative-score rows may be held.
- held rows should be counted separately from hard rejections.
- held rows are not import-ready.

## Duplicate Rules

Duplicate identity for generated OpenBible package:

```txt
source_book
source_chapter
source_verse
target_book
target_start_chapter
target_start_verse
target_end_chapter
target_end_verse
source_dataset
```

Duplicate handling:

- If duplicates are discovered, keep the row with the highest `source_score`.
- Count removed duplicates in `duplicates_removed`.
- Report duplicate groups in `generation-report.json`.
- Do not generate reverse relationships automatically.
- Do not use `relationship_type` to mask duplicate OpenBible rows, because the initial type is fixed as `theme`.

## Generation Report

Package creation must output `generation-report.json`.

Required report fields:

```json
{
  "rows_read": 344799,
  "rows_generated": 0,
  "rows_rejected": 0,
  "ranges_normalized": 0,
  "duplicates_removed": 0,
  "held_zero_score_rows": 0,
  "held_negative_score_rows": 0,
  "invalid_references": 0,
  "unsupported_books": 0,
  "cross_book_ranges": 0,
  "malformed_rows": 0,
  "source_checksum": "676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161",
  "package_checksum": "sha256-generated-package-checksum",
  "generation_status": "not_run"
}
```

Report requirements:

- `rows_read` must equal source relationship rows read from OpenBible.
- `rows_generated` must equal JSONL line count.
- `rows_rejected` must equal hard rejected rows.
- `ranges_normalized` must count target records with end range fields.
- `duplicates_removed` must count removed duplicate rows.
- Held zero/negative score rows must be reported separately.
- The report must state whether package creation passed or failed.
- The report must state that no DB write occurred.

## Checksum Policy

Two checksum levels are required.

### Source Checksum

The source checksum verifies the acquired raw OpenBible ZIP:

```txt
676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
```

Package creation must:

- verify the raw source checksum before reading.
- record the raw source checksum in `manifest.json`.
- fail before generation if the source checksum does not match.

### Package Checksum

The package checksum verifies generated files.

`checksum.sha256` must include checksums for:

- `manifest.json`
- `cross_references.jsonl`
- `generation-report.json`
- optional generated package files if present.

`manifest.json` should include:

- `source_checksum`
- `package_checksum`
- `checksum_file`

Dry-run in CR-11 must reject checksum mismatch.

## Git Policy

Tracked files may include:

- documentation
- manifest examples
- tiny sample JSONL files
- validation report summaries
- package creation specifications

Ignored or untracked files must include:

- raw OpenBible ZIP source
- generated normalized packages
- generated JSONL packages
- generated checksum files
- generated exports
- database backups
- SQL dumps

Policy:

- Raw source must stay outside Git or under ignored paths.
- Generated packages must stay outside Git or under ignored paths.
- Full `cross_references.jsonl` must not be committed.
- A tiny `sample-*.jsonl` may be committed only if explicitly approved.
- `git status` must be checked before any commit to prevent generated files from entering source control.

## Dry Run Preparation

CR-11 should use this package shape as its input:

```txt
cross-reference-package/
├── manifest.json
├── cross_references.jsonl
├── checksum.sha256
└── generation-report.json
```

CR-11 dry-run must validate:

- manifest required fields.
- source checksum.
- package checksums.
- JSONL parseability.
- canonical book mapping.
- chapter and verse validity.
- range validity.
- relationship type validity.
- review status validity.
- duplicate relationship identity.
- generated count consistency.
- held/rejected rows are not in import-ready JSONL.
- no DB write.

CR-11 should not import data. It should only create and validate the normalized package after package creation is explicitly approved.

## Final Recommendation

Proceed to:

```txt
CR-11 - Cross Reference Package Creation
```

CR-11 may create the normalized package only after explicit approval. It must still not import data, write to the database, change schema, add migrations, implement APIs, or change backend/frontend runtime behavior.

