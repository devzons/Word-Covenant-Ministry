# WEB Import Readiness Review

## Date

2026-06-22

## Purpose

This document records the readiness review required before Word Covenant Ministry starts any English Bible Support / WEB import work.

It has two goals:

1. Confirm the approval gates required before importing WEB.
2. Document the current gap between the frontend route policy and actual data availability.

Current route policy already reserves:

```txt
/en/bible/WEB/...
```

However, WEB Bible text has not been imported. The route policy is therefore prepared, but the data layer is not yet data-backed for WEB.

## Readiness Conclusion

WEB import is not approved yet.

Current judgment:

```txt
Import readiness: not ready
Reason: exact source, license text, provenance metadata, checksum, manifest, and dry-run plan have not been approved.
```

This review does not authorize downloading WEB data, importing WEB data, changing schema, adding migrations, changing backend runtime code, or writing to any production database.

## WEB Candidate Review Items

Before WEB can be imported, the following must be confirmed and documented.

### Source Provenance

Required:

- Exact source name.
- Exact source URL or acquisition origin.
- Exact source release/version if available.
- Acquisition date.
- Verification date.
- Source maintainer or publisher metadata.

Do not use an ambiguous "latest" source without recording the exact file or release used.

### License Verification

Required:

- Full license text or authoritative license URL.
- Redistribution status.
- Attribution requirements.
- Commercial/non-commercial restrictions, if any.
- Confirmation that WCM may store and display the text.

Copyrighted Bible versions remain out of scope unless a separate license decision approves them.

### Source Format

Required:

- File format, such as USFM, XML, JSON, TSV, SQLite, or other.
- Encoding.
- Book/chapter/verse fields or parser strategy.
- Whether paragraph headings, footnotes, section titles, or metadata rows are present.
- Whether verse text is segmented or merged.

### Checksum And Manifest

Required:

- Source checksum.
- Generated package checksum.
- Manifest with source metadata, expected counts, and import policy.
- Generated files kept outside tracked source or ignored by Git.

### Book/Chapter/Verse Normalization

Required:

- Canonical 66-book mapping.
- Slug mapping compatible with existing reader routes.
- Chapter and verse count validation.
- Duplicate verse detection.
- Missing or empty verse detection.
- Known versification differences recorded before import.

### Import Dry-run Requirement

WEB must pass a local dry-run before any apply step.

Dry-run must report:

- version code.
- source file/package.
- expected verse count.
- parsed verse count.
- duplicate verse keys.
- missing/empty text.
- unsupported book/chapter/verse references.
- license/provenance metadata status.
- whether any existing version rows would be touched.

## Existing KRV Pipeline Reuse

The current KRV import tooling provides useful patterns:

```txt
backend/app/public/wp-content/plugins/wcm-core/tools/export-krv-mdb.php
backend/app/public/wp-content/plugins/wcm-core/tools/import-krv-json.php
backend/app/public/wp-content/plugins/wcm-core/tools/verify-krv-import.php
```

Potentially reusable concepts:

- Bible version row in `wcm_bible_versions`.
- Book mapping in `wcm_bible_books`.
- Verse storage in `wcm_bible_verses`.
- Chapter lookup API compatibility.
- Search API compatibility after verses exist.
- Verification command pattern.
- Fail-closed import validation.

KRV-specific assumptions must not be copied blindly:

- KRV source is MDB; WEB source may use a different format.
- KRV version code and row count are not WEB row count.
- KRV Psalm 72:20 correction policy does not apply to WEB.
- WEB license/provenance must be reviewed independently.

## Compatibility Questions

Before implementation, confirm:

- Can current Bible tables store `WEB` as an additional version without schema changes?
- Does current reader API work for `/wcm/v1/bible/WEB/{book}/{chapter}` after import?
- Does current search API work with `translation=WEB` after import?
- Does book metadata return correct WEB metadata without frontend changes?
- Are English display names already sufficient for the reader and search surfaces?
- Is a version selector required before beta users see English routes?

## Risk Factors

### License Ambiguity

WEB is a candidate, but WCM must record the exact source and license before use. If license terms are unclear, import must stop.

### Source Format Mismatch

WEB may not match the KRV MDB-to-JSON pipeline. A source-specific parser/exporter may be required.

### Verse Numbering Differences

WEB chapter/verse structure must be validated against WCM canonical book/chapter/verse assumptions before import.

### Accidental Raw Source Commit

Raw WEB source files, generated packages, SQL dumps, ZIP/TAR/GZ files, and large JSON/JSONL outputs must not be committed.

### Production DB Accidental Change

WEB import must be local-only until a separate staging/production promotion plan is approved.

## Approval Requirements Before Import

All of the following are required before import work starts:

- Exact source URL and metadata confirmed.
- License text recorded.
- Provenance notes recorded.
- Local-only dry-run plan approved.
- Generated package/output paths confirmed as ignored.
- Rollback plan documented.
- Expected verse count documented.
- Duplicate/missing verse validation planned.
- No production write path enabled.

## Proposed Execution Sequence

1. Review WEB source and license.
2. Record source/provenance/license metadata.
3. Prepare local package outside tracked source.
4. Generate or record checksum and manifest.
5. Run local dry-run only.
6. Verify counts, duplicate keys, empty text, and book/chapter/verse normalization.
7. Request explicit approval for local apply.
8. Apply local import only after approval.
9. Run local reader/search smoke tests.
10. Defer staging/production promotion to a later separately approved task.

## Explicit Non-Actions

This review does not perform or authorize:

- WEB data download.
- WEB import.
- Schema changes.
- Migration creation.
- Backend runtime code changes.
- Frontend runtime code changes.
- Production database changes.
- Raw source commit.
- Generated package commit.

## Current Status

English Bible Support remains planned only.

The frontend route policy may point English Bible routes toward `WEB`, but actual WEB content requires future source/license approval, dry-run tooling or source-specific import preparation, and explicit local import approval.
