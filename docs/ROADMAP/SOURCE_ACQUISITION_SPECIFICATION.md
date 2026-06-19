# Source Acquisition Specification

## Creation Reason

This document was created during Phase 5C-7 because STEP_TAHOT and STEP_TAGNT source acquisition rules needed to be explicit before source-specific normalizer work.

This is a ROADMAP operating specification, not a new ADR. It records the approved source acquisition policy for the Original Language Foundation.

## Phase

```txt
Phase 5C-7 - Source Acquisition Specification
```

## Purpose

Define how original-language source files may be acquired, documented, inspected, and approved before any normalizer implementation, import service implementation, dataset download, dataset import, or database write.

## Source Selection

Hebrew source policy:

- Primary source: STEP Bible TAHOT.
- Secondary validation/reference source: OSHB.

Greek source policy:

- Primary source: STEP Bible TAGNT.
- Reference text: SBLGNT.

MorphGNT remains excluded as a primary source until ShareAlike implications are reviewed.

OpenGNT remains excluded as the first production source because of provenance and license complexity.

## Source Version Policy

Do not use floating `latest` source references.

Every source must use an exact, documented version before download, inspection, normalization, dry-run, or import.

Required version records:

- Source name.
- Exact source version or release identifier.
- Exact file name.
- Source URL.
- Download date.
- Verification date.
- Checksum after acquisition.
- License status.
- Attribution text.

Version records belong in source-specific documentation under `docs/data-sources/`, not in source code.

Pinned STEP source version for Phase 5C design:

```txt
Repository: https://github.com/STEPBible/STEPBible-Data.git
Commit: b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39
License: CC BY 4.0
```

This pinned commit is approved for header mapping and design documentation. It does not authorize dataset import, database writes, public APIs, UI work, or raw source file commits without separate approval.

## Storage Location

The official source archive root remains:

```txt
docs/data-sources/
```

Recommended STEP layout:

```txt
docs/data-sources/
└── STEP/
    ├── README.md
    ├── LICENSE.md
    ├── TAHOT/
    │   ├── README.md
    │   └── source files
    └── TAGNT/
        ├── README.md
        └── source files
```

Raw source files should not be committed by default. Commit source documentation, license notes, inspection summaries, and validation reports unless explicit approval allows raw source files.

## License Documentation

Before any source download or import, document:

- Source name.
- Source version.
- Download date.
- Source URL.
- License.
- Attribution text.
- License status: `approved`, `pending`, or `rejected`.
- Any commercial-use or redistribution constraints.

STEP_TAHOT and STEP_TAGNT must not proceed past acquisition planning until attribution requirements are documented.

STEP attribution requirement for Phase 5C design:

```txt
Data created by STEP Bible, based on work at Tyndale House Cambridge.
Credit STEP Bible linked to www.STEPBible.org.
Source repository: https://github.com/STEPBible/STEPBible-Data
License: CC BY 4.0
```

Any WCM import report, future source README, or future public attribution surface must preserve this attribution. If WCM modifies or corrects imported source data, the differences must be recorded and made available to subsequent users according to the STEP repository guidance.

## Required Before Download

Before downloading any original-language source file, document:

- Exact file name.
- Expected format, such as TSV, CSV, XML, JSON, USFM, SQLite, or other.
- Expected headers or expected XML shape.
- Expected source dataset value.
- Expected language.
- Attribution requirements.
- License status.
- Source URL.
- Reason for acquisition.

Do not download files only by broad package name or floating latest URL.

## Required Before Import

Before any import, all of the following must pass:

- `OriginalLanguageSourceInspector`.
- `SourceFileValidator`.
- `SourceLicenseValidator`.

The inspection must be header/sample oriented first. It must not write to the database.

Phase 5C-B1 source gate implementation status:

- STEP `.txt` files are recognized as `step_txt`, a tab-separated STEP text format.
- `OriginalLanguageSourceInspector` locates real TAHOT/TAGNT data header rows instead of treating intro/license lines as headers.
- `OriginalLanguageSourceInspector` extracts data-row samples after the real STEP header row.
- `OriginalLanguageSourceMetadata` records source version, source URL, and checksum.
- `OriginalLanguageImportReport` can carry source version, source URL, and checksum.
- `SourceFileValidator` validates approved STEP source path and file-name prefix.
- `SourceFileValidator` validates source-specific required headers for `STEP_TAHOT` and `STEP_TAGNT`.
- `SourceLicenseValidator` validates STEP license/provenance requirements: `approved` status, CC BY 4.0, STEP Bible or STEPBible.org attribution, Tyndale House Cambridge attribution, and the STEPBible-Data source URL.
- Read-only smoke check passed for local `STEP_TAHOT` and `STEP_TAGNT` files with zero source gate issues.
- No importer, normalizer, DB write, dataset import, public API, or UI was implemented as part of Phase 5C-B1.

## Header Mapping Gate

Before source-specific normalizer design or implementation:

- Header inspection must be complete.
- Header mapping must be complete.
- Source sample rows must be reviewed.
- Stable `sourceRef` strategy must be selected.
- Base Strong's versus extended Strong's split must be selected.

Phase 5C decision-gate mapping decisions:

- STEP_TAHOT and STEP_TAGNT are the selected primary source datasets.
- TAGNT initial import stream is SBL-aligned: include rows whose `editions` field contains `SBL`.
- TAGNT rows not containing `SBL` are excluded from the first production import and must be counted in dry-run reports.
- TAHOT uses WCM canonical `book_id + chapter + verse` as authoritative. The English/NRSV reference in the source row is the default parse input; Hebrew alternate references in brackets are preserved in source metadata/raw context and handled by an explicit exception map before import.
- Hebrew prefixes, suffixes, root words, and punctuation are modeled as separate occurrences when the source row provides segment-level data.
- Strong's base values are stored in `strongs_number`; STEP disambiguated values are stored in `strongs_extended`.

## Import Approval Gate

Before actual import:

- Header inspection must be complete.
- Header mapping must be complete.
- Greek edition filtering must be decided.
- Hebrew versification mapping must be decided.
- Hebrew prefix/suffix token model must be decided.
- Stable `sourceRef` strategy must be decided.
- License and attribution text must be approved.
- A dry-run report must pass review.
- Explicit approval must be given for actual import.

## Current Source Acquisition State

As of Phase 5C decision finalization:

- Local STEP_TAHOT candidate files are available under `docs/data-sources/STEP/TAHOT/`.
- Local STEP_TAGNT candidate files are available under `docs/data-sources/STEP/TAGNT/`.
- A local `STEPBible-Data` clone is available under `docs/data-sources/STEPBible-Data/`.
- The local `STEPBible-Data` clone is pinned for design review at commit `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- STEP_TAHOT and STEP_TAGNT headers/sample rows have been inspected for design mapping.
- Raw source files remain untracked and must not be committed unless separately approved.
- Phase 5C-B1 source gate hardening is complete.
- `StepTahotNormalizer` is implemented for dry-run normalization.
- `StepTagntNormalizer` is implemented for dry-run normalization.
- `OriginalLanguageVersificationResolver` is implemented.
- `OriginalLanguageImportService` is implemented in dry-run-only mode.
- Actual import is blocked.
- Database writes are blocked.

Write-enabled import execution remains blocked until a separate persistence-import phase receives explicit approval.

## Phase 5D Dry-run Completion

Phase 5D dry-run pipeline status:

- `StepTagntNormalizer` implemented.
- `StepTahotNormalizer` implemented.
- `OriginalLanguageVersificationResolver` implemented.
- `OriginalLanguageImportService` implemented in dry-run-only mode.
- TAGNT alternate references using `{}`, `[]`, and `()` before `#` are parsed and preserved in raw/context.
- TAHOT non-base text types such as `X` are skipped by first-import policy.
- TAHOT Q(K) rows are skipped and reported without variant occurrence storage.
- Dry-run exception map handling includes:
  - `1Ch.22.17 -> 1Ch.22.16`
  - `1Ch.22.18 -> 1Ch.22.17`
  - `1Ch.22.19 -> 1Ch.22.18`
  - `Rev.12.18 -> Rev.13.1`

Full read-only dry-run aggregate:

```txt
TAGNT rowsRead=142096
TAGNT rowsNormalized=137121
TAGNT rowsSkipped=4975

TAHOT rowsRead=305652
TAHOT rowsNormalized=536199
TAHOT rowsSkipped=2267

hard errors=0
```

Remaining non-hard issues:

- `missing_morphology`
- `tagnt_non_sbl_skipped`
- `qere_kethiv_variant_skipped`
- `tahot_non_base_text_type_skipped`
- `psalm_title`
- `duplicate_occurrence` warning-level skips

The dry-run completion does not approve actual import, DB writes, repository persistence, public APIs, frontend work, or schema changes.

## Phase 5C Decision Policies

TAGNT SBL filtering policy:

- Use STEP TAGNT as the Greek primary source.
- Use SBLGNT as the reference text.
- For the first production import, include only TAGNT rows whose `editions` field contains `SBL`.
- Do not import non-SBL rows as `variant` occurrences in the first production import.
- Dry-run reports must count excluded non-SBL rows and variant-related warnings.

Hebrew versification policy:

- WCM canonical reference remains `book_id + chapter + verse`.
- TAHOT source references use English/NRSV versification as the default parse input.
- Hebrew alternate references in brackets must be preserved in raw/source metadata.
- Known TAHOT reference exceptions, including Psalm title verse `0` cases and English/Hebrew verse starts, require an explicit exception map before import.
- No Hebrew import may run until the exception map is validated against WCM canonical books and chapters.

Hebrew prefix/suffix token policy:

- Expand Hebrew segment data into separate occurrences when source data separates prefixes, root words, suffixes, or punctuation.
- Keep the STEP word number as `word_order`.
- Use `subword_order` for segment order within a STEP word.
- Use `token_type = prefix` for Hebrew prefixes, `word` for lexical roots/base words, `suffix` for suffixes, and `punctuation` for punctuation markers.
- Use `subword_order = 0` for unsegmented words. For segmented words, assign `subword_order` from `0` upward in source display order.

Strong's normalization policy:

- `strongs_number` stores the base lookup value only.
- Base Strong's values are uppercase `H` or `G` followed by digits, with wrappers, braces, suffix letters, and instance markers removed.
- Leading zeroes are removed during canonical normalization, so `H0430` becomes `H430` and `G0011` becomes `G11`.
- `strongs_extended` stores STEP disambiguation, preserving meaningful source suffix letters such as `H7225G` or `G2424G`.
- Occurrence instance markers such as `_A` and `_B` must not become part of term identity. Preserve them in `source_ref`, raw row context, or future occurrence-level diagnostics instead.
- Missing extended Strong's values normalize to an empty string.

## Prohibited Until Approval

Do not implement without separate approval:

- Write-enabled import execution.
- Downloader tooling.
- Actual import commands.
- Public original-language APIs.
- Interlinear UI.
- Strong's pages.
- Word Study UI.

Do not perform:

- Dataset download.
- Dataset import.
- Database writes.
- Raw source file commits without explicit approval.
