# ADR-0007 Bible Data Source

## Status

Accepted

## Date

2026-06-17

## Context

Word Covenant Ministry needs an initial Korean Revised Version data source candidate for Scripture Engine development.

The project inspected:

```txt
docs/data-sources/개역한글.mdb
```

The inspected MDB contains a `BIBLE` table with these verse columns:

```txt
BOOK
CHAPTER
VERSE
BIBLETEXT
```

Inspection findings:

- Total rows: `31,174`
- Metadata rows: `72` where `BOOK = 0`
- Canonical verse rows: `31,102`
- Empty canonical verse found: `BOOK=19`, `CHAPTER=72`, `VERSE=20`

The safe export filter for canonical verses is:

```sql
BOOK BETWEEN 1 AND 66
AND CHAPTER >= 1
AND VERSE >= 1
```

The empty canonical verse at `BOOK=19`, `CHAPTER=72`, `VERSE=20` must be flagged for manual review before production import.

## Decision

Use `docs/data-sources/개역한글.mdb` as the initial KRV data source candidate for Scripture Engine development.

Do not import this MDB yet.

Do not export this MDB yet.

Do not commit generated Scripture data yet.

## Consequences

Scripture Engine development can reference the inspected schema and filtering rules when designing import validation and data modeling.

Future import tooling must exclude metadata rows by applying the safe export filter.

Future import validation must detect and report the empty canonical verse at `BOOK=19`, `CHAPTER=72`, `VERSE=20` before any production import.

Generated Scripture exports remain out of scope until a separate documented import/export decision and validation workflow exists.

## Alternatives Considered

- Import the MDB immediately: rejected because the empty canonical verse requires manual review before production import.
- Export generated Scripture data immediately: rejected because the project has not yet approved an export format, validation process, or generated data commit policy.
- Treat all rows in `BIBLE` as verses: rejected because `72` rows are metadata rows where `BOOK = 0`.
