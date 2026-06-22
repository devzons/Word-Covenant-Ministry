# Cross Reference Normalization Plan

Date: 2026-06-22

## Purpose

This document defines the rules for converting the acquired OpenBible.info Cross References source into a future WCM canonical relationship package.

The goal is to normalize a third-party reference-only source into WCM canonical book slugs, reference range fields, source metadata, relationship metadata, and validation-ready package records without importing anything into the database.

This is a design document only. It does not create a package, run a dry-run, import data, write to the database, change schema, add migrations, implement APIs, or change frontend/backend runtime behavior.

## Current Phase

Phase CR-9 - Cross Reference Package Normalization Plan.

Completed prior phases:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.
- CR-4 Dry Run Specification completed.
- CR-5 Local Import Readiness Review completed.
- CR-6 Source Acquisition Review completed.
- CR-8 OpenBible source acquisition completed.

Acquired source facts:

```txt
source_name: OpenBible.info Cross References
source_url: https://a.openbible.info/data/cross-references.zip
source_page_url: https://www.openbible.info/labs/cross-references/
raw_source_path: /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
manifest_path: /private/tmp/wcm-cross-reference-source/openbible/manifest.json
checksum_sha256: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
record_count: 344799
attribution: www.openbible.info CC-BY 2026-06-22
```

## Non-Actions

This phase does not perform or authorize:

- package creation
- data import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Source Shape Review

The acquired ZIP contains one TSV file:

```txt
cross_references.txt
```

Header:

```txt
From Verse	To Verse	Votes	#www.openbible.info CC-BY 2026-06-22
```

Observed row examples:

```txt
Gen.1.1	Mark.13.19	58
Gen.1.1	Isa.44.24	95
Gen.1.1	Rom.1.19-Rom.1.20	59
Gen.1.1	John.1.1-John.1.3	369
```

Source fields:

| Source Column | Meaning | Normalization Target |
| --- | --- | --- |
| `From Verse` | Source reference, observed as a single verse such as `Gen.1.1` | `source_book`, `source_chapter`, `source_verse` |
| `To Verse` | Target reference, observed as a single verse or same-book range such as `John.1.1-John.1.3` | `target_book`, `target_chapter`, `target_verse`, optional range fields |
| `Votes` | Numeric OpenBible score; may be positive, zero, or negative | `source_score` and optional confidence bucket |
| Header attribution | Source attribution string | manifest `attribution` and record `source_reference` |

Observed source analysis:

```txt
rows: 344799
source ranges observed: 0
target ranges observed: 88150
duplicate source/target pairs observed: 0
positive votes: 341292
zero votes: 2262
negative votes: 1245
minimum vote: -86
maximum vote: 1279
```

Important source constraints:

- OpenBible does not provide WCM relationship type labels.
- OpenBible does not provide Bible text in this TSV.
- OpenBible scores must not be treated as doctrinal certainty.
- Negative scores must not be imported as high-confidence recommendations.
- Range support is required for target references before package creation.

## Canonical Book Mapping

All normalized records must use WCM canonical book slugs, not OpenBible abbreviations.

The normalization layer must map:

| OpenBible | WCM Slug |
| --- | --- |
| `Gen` | `genesis` |
| `Exod` | `exodus` |
| `Lev` | `leviticus` |
| `Num` | `numbers` |
| `Deut` | `deuteronomy` |
| `Josh` | `joshua` |
| `Judg` | `judges` |
| `Ruth` | `ruth` |
| `1Sam` | `1-samuel` |
| `2Sam` | `2-samuel` |
| `1Kgs` | `1-kings` |
| `2Kgs` | `2-kings` |
| `1Chr` | `1-chronicles` |
| `2Chr` | `2-chronicles` |
| `Ezra` | `ezra` |
| `Neh` | `nehemiah` |
| `Esth` | `esther` |
| `Job` | `job` |
| `Ps` | `psalms` |
| `Prov` | `proverbs` |
| `Eccl` | `ecclesiastes` |
| `Song` | `song-of-songs` |
| `Isa` | `isaiah` |
| `Jer` | `jeremiah` |
| `Lam` | `lamentations` |
| `Ezek` | `ezekiel` |
| `Dan` | `daniel` |
| `Hos` | `hosea` |
| `Joel` | `joel` |
| `Amos` | `amos` |
| `Obad` | `obadiah` |
| `Jonah` | `jonah` |
| `Mic` | `micah` |
| `Nah` | `nahum` |
| `Hab` | `habakkuk` |
| `Zeph` | `zephaniah` |
| `Hag` | `haggai` |
| `Zech` | `zechariah` |
| `Mal` | `malachi` |
| `Matt` | `matthew` |
| `Mark` | `mark` |
| `Luke` | `luke` |
| `John` | `john` |
| `Acts` | `acts` |
| `Rom` | `romans` |
| `1Cor` | `1-corinthians` |
| `2Cor` | `2-corinthians` |
| `Gal` | `galatians` |
| `Eph` | `ephesians` |
| `Phil` | `philippians` |
| `Col` | `colossians` |
| `1Thess` | `1-thessalonians` |
| `2Thess` | `2-thessalonians` |
| `1Tim` | `1-timothy` |
| `2Tim` | `2-timothy` |
| `Titus` | `titus` |
| `Phlm` | `philemon` |
| `Heb` | `hebrews` |
| `Jas` | `james` |
| `1Pet` | `1-peter` |
| `2Pet` | `2-peter` |
| `1John` | `1-john` |
| `2John` | `2-john` |
| `3John` | `3-john` |
| `Jude` | `jude` |
| `Rev` | `revelation` |

Mapping policy:

- Unknown OpenBible book abbreviations are blocking validation failures.
- Mapped slugs must be validated against the WCM canonical 66-book list.
- Book mapping must be deterministic and version-independent.
- The normalizer must not infer deuterocanonical, alternate, or unsupported books.

## Reference Normalization

### Source Reference

Observed source references are single verses:

```txt
Gen.1.1
```

Normalize to:

```json
{
  "source_book": "genesis",
  "source_chapter": 1,
  "source_verse": 1,
  "source_end_chapter": null,
  "source_end_verse": null
}
```

### Target Single Verse

Example:

```txt
John.3.16
```

Normalize to:

```json
{
  "target_book": "john",
  "target_chapter": 3,
  "target_verse": 16,
  "target_end_chapter": null,
  "target_end_verse": null
}
```

### Target Verse Range

Example:

```txt
John.3.16-John.3.18
```

Normalize to:

```json
{
  "target_book": "john",
  "target_chapter": 3,
  "target_verse": 16,
  "target_end_chapter": 3,
  "target_end_verse": 18
}
```

### Target Passage Range Across Chapters

Example:

```txt
John.3.16-John.4.2
```

Normalize to:

```json
{
  "target_book": "john",
  "target_chapter": 3,
  "target_verse": 16,
  "target_end_chapter": 4,
  "target_end_verse": 2
}
```

Cross-chapter ranges are allowed only when:

- start and end book are identical.
- start chapter/verse and end chapter/verse both validate.
- end reference does not precede start reference.

Cross-book ranges are not allowed in the first WCM package. If encountered, they must be rejected or held for review.

### Passage Range Policy

The first normalization pass should support:

- single verse to single verse
- single verse to same-book verse range
- single verse to same-book cross-chapter range

The first normalization pass should not support:

- source ranges unless a future source introduces them and CR policy is updated.
- cross-book ranges.
- references that omit book, chapter, or verse.
- references that require Bible-version-specific verse numbering.

## Relationship Normalization

OpenBible provides a numeric `Votes` value. It does not provide a WCM relationship type.

Policy:

- Preserve the raw value as `source_score`.
- Do not discard negative or zero scores before dry-run unless a future package policy says so.
- Do not treat votes as theological certainty.
- Do not convert votes into `quotation`, `allusion`, `typology`, `prophecy_fulfillment`, `promise_fulfillment`, or `law_gospel`.
- Use votes only as source ranking or confidence-bucket metadata.

Recommended confidence bucket policy:

| Votes | Confidence Bucket | Import Readiness Meaning |
| ---: | --- | --- |
| `>= 100` | `high_source_weight` | High source weight, still unreviewed |
| `25` to `99` | `medium_source_weight` | Medium source weight, still unreviewed |
| `1` to `24` | `low_source_weight` | Low source weight, still unreviewed |
| `0` | `neutral_source_weight` | No positive source weight; review recommended |
| `< 0` | `negative_source_weight` | Hold or import only as review-excluded candidate |

For CR-10, decide whether the package should include negative and zero-score records. Conservative recommendation:

- include positive-score records in the first normalized package candidate.
- report zero and negative-score records separately.
- do not import zero or negative-score records until reviewed.

## Relationship Type Strategy

OpenBible does not provide relationship categories aligned with WCM.

Initial normalized records should use a conservative type:

```txt
relationship_type: theme
```

Rationale:

- OpenBible describes links as commonalities across themes, words, events, and people.
- `theme` is broad enough for source-backed related-reference candidates.
- It avoids implying direct quotation, prophecy, fulfillment, typology, or law-gospel interpretation.

Alternative held policy:

```txt
relationship_type: curated_manual
review_status: needs_review
```

This is more conservative but semantically weaker because the records are source-derived rather than WCM-manual.

Recommended CR-10 policy:

```txt
relationship_type: theme
confidence: source_backed
review_status: unreviewed
```

High-judgment relationship types remain curated-only:

- `quotation`
- `allusion`
- `parallel_event`
- `promise_fulfillment`
- `prophecy_fulfillment`
- `typology`
- `law_gospel`
- `word_study`

OpenBible records may later be reviewed into narrower types, but the normalizer must not infer them.

## Duplicate Strategy

Observed source/target pairs have no duplicates in the acquired source, but package validation must still enforce deterministic duplicate handling.

Primary duplicate identity:

```txt
source_reference + target_reference + source_dataset
```

Expanded identity:

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
source_dataset
```

If future packages allow multiple relationship types for the same source and target, then `relationship_type` may be added to the duplicate identity. For the OpenBible generic import candidate, `relationship_type` should be stable and should not mask duplicates.

Duplicate handling policy:

- Exact duplicate rows in one source package are blocking errors unless explicitly reported as expected duplicates.
- Directional duplicates are not the same as reverse relationships.
- Reverse links may be generated only by a separate explicit policy; the normalizer must not create reverse links automatically.
- Multiple targets for the same source are expected.

## Metadata Preservation

Every normalized record or package manifest must preserve:

- `package_id`
- `source_dataset`
- `source_name`
- `source_url`
- `source_page_url`
- `source_checksum`
- `attribution`
- `license`
- `acquired_at`
- `generated_at`

Recommended package manifest fields:

```json
{
  "package_id": "cross_reference.openbible.normalized.2026-06-22.001",
  "source_package_id": "cross_reference.openbible.raw.2026-06-22.001",
  "source_dataset": "openbible",
  "source_name": "OpenBible.info Cross References",
  "source_url": "https://a.openbible.info/data/cross-references.zip",
  "source_page_url": "https://www.openbible.info/labs/cross-references/",
  "license": "Creative Commons Attribution",
  "attribution": "www.openbible.info CC-BY 2026-06-22",
  "source_checksum_sha256": "676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161",
  "record_count": 0,
  "source_policy": "references_only_no_bible_text",
  "review_status": "dry_run_pending"
}
```

Recommended normalized JSONL record shape:

```json
{
  "source_book": "genesis",
  "source_chapter": 1,
  "source_verse": 1,
  "source_end_chapter": null,
  "source_end_verse": null,
  "target_book": "john",
  "target_chapter": 1,
  "target_verse": 1,
  "target_end_chapter": 1,
  "target_end_verse": 3,
  "relationship_type": "theme",
  "confidence": "source_backed",
  "source_score": 369,
  "source_weight_bucket": "high_source_weight",
  "source_dataset": "openbible",
  "source_reference": "OpenBible.info Cross References",
  "review_status": "unreviewed"
}
```

The record must not contain copied Bible text.

## Validation Rules

### Canonical Reference Validation

Validation must confirm:

- OpenBible abbreviation maps to one WCM canonical book slug.
- mapped book is in the canonical 66-book set.
- chapter is valid for the mapped book.
- verse is valid for the mapped book/chapter when verse-count data is available.
- optional end chapter and end verse are valid.
- range end does not precede range start.
- cross-book ranges are rejected for the first package.

### Relationship Validation

Validation must confirm:

- `relationship_type` is an allowed WCM relationship type.
- OpenBible-generated rows use only the approved generic relationship type.
- curated-only relationship types are absent from unreviewed OpenBible package rows.
- `confidence` is an allowed value.
- `source_score` is numeric.
- `source_weight_bucket` matches the source score policy.
- `review_status` is allowed.

### Metadata Validation

Validation must confirm:

- manifest required fields are present.
- source checksum matches the acquired source.
- normalized package checksum exists when a package is created in a future phase.
- record count matches JSONL line count.
- attribution is present.
- license is present.
- package is marked reference-only.
- no SQL dump or raw Bible text is present.

### Source Shape Validation

Validation must confirm:

- TSV header matches expected OpenBible shape.
- each row has exactly three relationship data fields.
- source reference parses.
- target reference parses.
- score parses as integer.
- unsupported rows are counted and reported.

## Dry Run Preparation

CR-10 should specify the future package creation step. The package creation output should be:

```txt
cross-reference-package/
├── manifest.json
├── cross_references.jsonl
├── checksum.sha256
├── normalization-report.json
└── README.md
```

Minimum `normalization-report.json` fields:

```txt
rows_read
rows_normalized
rows_rejected
source_ranges
target_ranges
cross_chapter_ranges
unsupported_book_abbreviations
unsupported_reference_shapes
zero_score_records
negative_score_records
duplicate_relationships
source_checksum
package_checksum
```

CR-10 should decide:

- whether zero-score and negative-score records are included in the package or held in a rejected/held report.
- whether package records use `theme` or a future `openbible_generic` relationship type.
- whether the package file is written under an ignored path or outside the repository.
- whether tiny sample JSONL records are committed for documentation.

Future dry-run must validate the normalized package before any import readiness review.

## Final Recommendation

Proceed to:

```txt
CR-10 - Cross Reference Package Creation Specification
```

CR-10 should document exactly how to create the normalized package from the acquired OpenBible source, including output paths, checksum generation, held-record policy, package report fields, and dry-run handoff.

No package should be generated until CR-10 is approved. No import, DB write, schema change, migration, API, backend runtime change, frontend runtime change, staging apply, or production apply is authorized by this plan.

