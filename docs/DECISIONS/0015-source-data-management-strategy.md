# ADR-0015 Source Data Management Strategy

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry will use multiple Bible data sources:

- KRV
- WEB
- OSHB
- SBLGNT

These files may have different formats:

- MDB
- JSON
- XML
- USFM
- TSV
- SQLite
- ZIP archives

The project needs a clear source data archive policy before importing or transforming data.

ADR-0007 identifies `docs/data-sources/개역한글.mdb` as the current KRV source candidate. ADR-0014 defines the staged import pipeline from raw source through inspection, validation, normalized export, importer, and custom tables.

## Decision

`docs/data-sources/` is the official source data archive location.

It is used for preserving and documenting raw source files.

It is not the production data store.

Production Scripture data belongs in custom tables:

- `wcm_bible_versions`
- `wcm_bible_books`
- `wcm_bible_verses`

Recommended source archive structure:

```txt
docs/data-sources/
├── KRV/
│   ├── README.md
│   └── source files
├── WEB/
│   ├── README.md
│   └── source files
├── OSHB/
│   ├── README.md
│   └── source files
├── SBLGNT/
│   ├── README.md
│   └── source files
└── LICENSES/
    └── license notes
```

Each source README should document:

- source name
- file name
- file format
- source URL or origin
- license status
- acquisition date
- verification date
- row count or verse count if applicable
- known issues
- import readiness

No data files are moved by this decision. No WEB, OSHB, or SBLGNT source files are downloaded by this decision.

## Git Policy

Raw source data files should not be committed by default.

Do not commit:

- `*.mdb`
- `*.sqlite`
- `*.db`
- `*.zip`
- large XML dumps
- raw licensed source files

Commit only:

- `README.md` files
- license notes
- inspection reports
- validation summaries
- ADRs

Generated data should not be committed unless explicitly approved.

The repository `.gitignore` should exclude raw source data file patterns under `docs/data-sources/` while preserving documentation files such as `README.md`.

## Import Policy

Source files must follow this pipeline:

```txt
Raw Source
-> Inspection
-> Validation Report
-> Normalized Export
-> Importer
-> Custom Tables
```

No source file may be imported directly into production tables without validation.

## Validation Policy

Before import, each source must be checked for:

- book count
- chapter count
- verse count
- missing text
- duplicate verses
- unexpected metadata rows
- encoding issues
- license status

## KRV Current Status

The current KRV source candidate is:

```txt
docs/data-sources/개역한글.mdb
```

Inspection found:

- Table: `BIBLE`
- Total rows: `31,174`
- Canonical verse rows: `31,102`
- Metadata rows: `72`
- Safe export filter:

```sql
BOOK BETWEEN 1 AND 66
AND CHAPTER >= 1
AND VERSE >= 1
```

Known issue:

- Psalm 72:20 has empty `BIBLETEXT` and requires manual review before production import.

## Future Source Status

WEB, OSHB, and SBLGNT are planned source candidates.

They should not be downloaded or imported until:

- license is confirmed
- source format is documented
- validation rules are defined
- import path is approved

## Consequences

This protects the project from:

- accidental raw data commits
- license confusion
- unvalidated imports
- malformed Bible data
- future importer rewrites

Future source additions must include documentation and validation readiness before import work begins.

## Alternatives Considered

1. Store raw files anywhere in the repository: rejected because it causes confusion and accidental commits.

2. Commit all raw source files: rejected because of size, licensing, and provenance risk.

3. Import directly from raw files into DB: rejected because validation and normalization are required.
