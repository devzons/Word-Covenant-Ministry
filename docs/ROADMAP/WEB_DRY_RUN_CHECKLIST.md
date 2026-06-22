# WEB Dry Run Checklist

## Date

2026-06-22

## Purpose

This checklist fixes the preparation requirements for a local-only WEB dry run. It does not authorize import/apply, schema changes, migrations, backend runtime changes, source file commits, or production database changes.

Current status:

```txt
WEB Local Dry Run: approved in principle
Source package approval: pending
Apply/import: not approved
```

## 1. Approved Source Package Requirements

Before dry-run execution, the source package must be approved by exact identity.

Required:

- Candidate edition: `WEBP / ENGWEBP / engwebp`.
- Preferred package: `engwebp_usfm.zip`.
- Fallback package: `engwebp_usfx.zip`.
- Exact source URL approved.
- Source maintainer/provenance recorded.
- License status recorded.
- Local storage path approved.
- Package kept outside tracked source or under an ignored path.

Not allowed:

- Floating "latest" source reference.
- Unapproved mirror.
- Untracked source package accidentally staged for Git.
- SQL package as first import source.

## 2. Required Checksum Process

Checksum must be generated immediately after acquisition and recorded before dry-run.

Required:

- SHA-256 checksum for the downloaded package.
- SHA-256 checksum recorded in manifest.
- File list generated from extracted package.
- Optional per-file checksums if package expands into multiple source files.
- Dry-run must fail if checksum does not match manifest.

No package download is performed by this checklist.

## 3. Manifest Structure

Required manifest fields:

```txt
package_id
source_name
source_edition
source_url
downloaded_at
verified_at
checksum_sha256
file_list
license_status
license_note
provenance_note
importer_version
expected_bible_version_code
expected_book_count
expected_chapter_counts_policy
expected_verse_count_policy
```

Expected values:

```txt
expected_bible_version_code=WEB
expected_book_count=66
source_edition=WEBP / ENGWEBP / engwebp
```

## 4. USFM Parser Requirements

The first dry-run parser should target USFM.

Required behavior:

- Read approved local USFM package only.
- Extract book identifier.
- Extract chapter markers.
- Extract verse markers.
- Produce one normalized row per verse.
- Preserve verse text only.
- Trim leading/trailing whitespace.
- Preserve punctuation.
- Ignore section headings in first phase.
- Ignore footnotes in first phase.
- Ignore red-letter metadata in first phase.
- Do not import formatting markers in first phase.

Fallback:

- USFX may be evaluated only if USFM parsing is unsafe or ambiguous.

## 5. Validation Report Format

Dry-run output must produce a reviewable report.

Required sections:

```txt
summary
source_manifest
checksum_status
book_counts
chapter_counts
verse_counts
duplicates
missing_verses
empty_text
unsupported_markers
spot_checks
warnings
blocking_errors
import_readiness
```

Required final status:

```txt
dry_run_passed
dry_run_failed
```

The dry-run report must clearly state that no database writes were performed.

## 6. Expected Counts Report

The dry-run must report:

- Total books parsed.
- Total chapters parsed.
- Total verses parsed.
- Verse count by book.
- Chapter count by book.
- Any book missing from the canonical 66-book set.
- Any unexpected extra book.

Expected:

```txt
books=66
```

The expected chapter count should match the canonical Protestant Bible structure already used by WCM reader routes.

## 7. Duplicate Report

Duplicate detection must use:

```txt
version_code + book_slug + chapter + verse
```

Report fields:

- duplicate key.
- count.
- source files.
- source line/marker if available.
- example text snippets.

Any duplicate verse key is blocking unless explicitly reviewed and resolved.

## 8. Missing Verse Report

Missing verse detection should compare parsed output against approved canonical expectations when available.

Report fields:

- book.
- chapter.
- verse.
- expected source.
- status.

Any missing verse requires review before apply approval.

## 9. Spot Check Report

Required spot checks:

```txt
genesis 1:1
psalms 23:1
isaiah 53:5
matthew 1:1
john 1:1
romans 8:1
revelation 22:21
```

Each spot check must include:

- reference.
- parsed text sample.
- source file.
- source marker or line if available.
- pass/fail status.

Spot checks are not a substitute for full validation.

## 10. Dry Run Success Criteria

Dry-run may pass only when:

- Manifest exists and is valid.
- Package checksum matches manifest.
- License/provenance metadata is present.
- Source format is recognized.
- `WEB` version code is used consistently.
- 66 canonical books are parsed.
- Chapter count report is complete.
- Verse count report is complete.
- No duplicate verse keys exist.
- No empty verse text exists.
- Required spot checks pass.
- No database write occurred.
- Blocking errors count is zero.

## 11. Dry Run Failure Criteria

Dry-run must fail when:

- Manifest is missing.
- Checksum mismatch occurs.
- License/provenance metadata is missing.
- Source package path is unapproved.
- Source format is unsupported.
- Book mapping fails.
- Duplicate verse keys are found.
- Empty verse text is found.
- Required spot checks fail.
- Parser cannot distinguish verse text from headings/footnotes.
- Any database write is attempted.

## 12. Apply Gate Checklist

Apply remains blocked until all of the following are true:

- Dry-run report has passed.
- Dry-run report has been reviewed.
- Exact source package is approved.
- Manifest is approved.
- Checksum is approved.
- Expected counts are approved.
- Duplicate/missing/empty reports are accepted.
- Local database backup path is confirmed.
- Rollback plan is confirmed.
- Explicit local apply approval is given.

Apply is still local-only after approval.

Production apply remains out of scope.

## Non-Actions

This checklist does not:

- download WEB.
- import WEB.
- store source packages.
- write to the database.
- change schema.
- add migrations.
- change backend code.
- create import tools.
- approve production operations.
