# ADR-0014 Bible Import Pipeline Strategy

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry needs a safe, reviewable path from inspected Bible source files into the Scripture Engine custom tables.

ADR-0007 identifies the initial KRV source candidate:

```txt
docs/data-sources/개역한글.mdb
```

The MDB contains the `BIBLE` table with these verse columns:

```txt
BOOK
CHAPTER
VERSE
BIBLETEXT
```

ADR-0007 also records:

- total rows: `31,174`
- metadata rows: `72` where `BOOK = 0`
- canonical verse rows: `31,102`
- empty canonical verse: `BOOK=19`, `CHAPTER=72`, `VERSE=20`

ADR-0009 establishes custom tables as the authoritative Bible text storage layer:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

The project needs an import pipeline strategy before any production import, generated JSON commit, or custom table write occurs.

## Decision

Bible imports will use a staged pipeline:

```txt
Source file
-> JSON export layer
-> Validation
-> Custom table import
```

For the initial KRV import candidate, the pipeline is:

```txt
KRV Import Pipeline

MDB
-> JSON
-> Validation
-> Custom Table Import
```

The MDB is the inspected source candidate. JSON is an intermediate export and review layer, not the authoritative production storage layer. The custom Bible tables remain the authoritative runtime storage once an import has passed validation and review.

No code, migrations, imports, exports, generated JSON, database writes, or generated Scripture data commits are implemented by this decision.

## MDB Source

The initial source is:

```txt
docs/data-sources/개역한글.mdb
```

The source table is:

```txt
BIBLE
```

The source columns are:

```txt
BOOK
CHAPTER
VERSE
BIBLETEXT
```

The safe canonical export filter is:

```sql
BOOK BETWEEN 1 AND 66
AND CHAPTER >= 1
AND VERSE >= 1
```

Rows where `BOOK = 0` are metadata rows and must not be imported as Bible verses.

The empty canonical verse at `BOOK=19`, `CHAPTER=72`, `VERSE=20` must be flagged for manual review before production import.

## JSON Export Layer

The JSON layer exists to make source extraction reviewable before database import.

The JSON export should contain normalized canonical verse records with explicit metadata:

```txt
version_code
book_id
chapter
verse
text
source_file
source_table
source_row_identifier
```

The JSON layer may be used for:

- human review
- validation reports
- reproducible import inputs
- fixtures for future import tests
- comparison between source extraction and database import results

The JSON layer must not become the authoritative runtime Bible text store. ADR-0009 keeps custom tables as the authoritative storage layer.

Generated JSON must not be committed until a future decision explicitly approves generated Scripture data commit policy, file locations, review requirements, and licensing constraints.

## Validation Rules

Validation must run before custom table import.

Minimum validation rules:

- accept only canonical rows where `BOOK BETWEEN 1 AND 66`
- require `CHAPTER >= 1`
- require `VERSE >= 1`
- reject metadata rows where `BOOK = 0`
- reject duplicate `(version_code, book_id, chapter, verse)` records
- verify the canonical KRV verse count is `31,102`
- verify source total and filtered row counts against ADR-0007 inspection findings
- require non-empty `version_code`
- require numeric `book_id`, `chapter`, and `verse`
- require valid `book_id` values that map to canonical Bible books
- detect empty or whitespace-only verse text
- flag `BOOK=19`, `CHAPTER=72`, `VERSE=20` for manual review
- produce a validation report before import

Empty canonical verse text is a blocking issue for production import unless explicitly reviewed and approved with a documented resolution.

## Import Workflow

The import workflow must be explicit and repeatable:

1. Inspect the source file and confirm the expected MDB path, table, columns, and row counts.
2. Export canonical rows from MDB to the JSON layer using the safe canonical filter.
3. Normalize JSON records to the target Scripture model.
4. Run validation against JSON before any database write.
5. Review validation report, especially empty verses, duplicates, unexpected counts, and invalid references.
6. Prepare the target Bible version record in `wcm_bible_versions`.
7. Confirm canonical book mappings in `wcm_bible_books`.
8. Import validated records into a staging table or transaction-protected import process.
9. Verify imported row counts and spot-check known passages.
10. Promote the import only after validation, manual review, and rollback readiness are complete.

Production imports must not write directly from MDB to final custom tables without the JSON validation layer.

## Error Handling

The pipeline must fail closed.

Import must stop when validation finds:

- unexpected source schema
- missing required columns
- unexpected row counts
- invalid book, chapter, or verse values
- duplicate verse keys
- empty canonical verse text without manual approval
- JSON parse errors
- database constraint violations
- partial import failures

Errors must be reported with enough detail to identify:

- source file
- source table
- source row or record identifier
- version code
- book
- chapter
- verse
- error type
- remediation status

The importer must not silently skip invalid canonical verses. Any skipped canonical row must be recorded in a validation or import report.

## Rollback Strategy

Bible imports must be rollback-safe.

Future implementation must support at least one of these rollback approaches:

- import into staging tables before replacing active version data
- wrap the import in a database transaction where supported
- tag imported rows with an import batch identifier
- delete or deactivate a failed import batch without affecting other versions
- restore from a pre-import database backup

Rollback validation must confirm:

- no partial KRV verse set remains active after failure
- `wcm_bible_versions` does not point users to incomplete imported data
- existing Bible versions remain unaffected
- relationship tables are not left pointing to missing verse records

The import process must not overwrite an existing active Bible version unless a migration and rollback plan has been reviewed.

## Consequences

This strategy gives the project a controlled path from MDB source data to custom Bible tables without treating raw source files or generated JSON as runtime storage.

The JSON layer makes extraction reviewable and validation repeatable.

Validation prevents metadata rows, malformed references, duplicates, unexpected counts, and known empty canonical verses from entering production silently.

Rollback requirements reduce the risk of partial or corrupt Bible imports.

Future implementation must still define exact tooling, generated file locations, database migrations, import batch tracking, report formats, permissions, operational commands, and manual review workflow before any import is performed.

## Alternatives Considered

1. Import directly from MDB into custom tables: rejected because it bypasses a reviewable intermediate layer and makes validation, repeatability, and debugging weaker.

2. Use JSON as the authoritative Bible store: rejected because ADR-0009 establishes custom tables as the authoritative runtime storage layer.

3. Commit generated JSON immediately: rejected because generated Scripture data requires a separate commit policy, review process, licensing review, and file location decision.
