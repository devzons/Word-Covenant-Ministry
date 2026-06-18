# Source Acquisition Specification

## Creation Reason

This document was created during Phase 5C-7 because STEP_TAHOT and STEP_TAGNT source files are not available locally, exact headers are not confirmed, and source-specific normalizer work must remain blocked until source acquisition rules are explicit.

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

## Header Mapping Gate

Before source-specific normalizer design or implementation:

- Header inspection must be complete.
- Header mapping must be complete.
- Source sample rows must be reviewed.
- Stable `sourceRef` strategy must be selected.
- Base Strong's versus extended Strong's split must be selected.

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

## Current Blocked State

As of Phase 5C-7:

- STEP_TAHOT source file is not available locally.
- STEP_TAGNT source file is not available locally.
- Exact STEP_TAHOT headers are not confirmed.
- Exact STEP_TAGNT headers are not confirmed.
- `StepTahotNormalizer` is blocked.
- `StepTagntNormalizer` is blocked.
- `OriginalLanguageImportService` is blocked.
- Actual import is blocked.
- Database writes are blocked.

## Prohibited Until Approval

Do not implement:

- `StepTahotNormalizer`.
- `StepTagntNormalizer`.
- `OriginalLanguageImportService`.
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
