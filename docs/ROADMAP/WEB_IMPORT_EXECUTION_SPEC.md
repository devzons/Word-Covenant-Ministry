# WEB Import Execution Specification

## Date

2026-06-22

## Purpose

This document fixes the local-only execution procedure that must exist before any World English Bible import can be implemented or run.

The import itself remains blocked until a separate explicit approval is given. This specification does not authorize source download, source package storage, parser implementation, backend code changes, schema changes, migrations, database writes, or production operations.

## Candidate Source

Primary candidate:

```txt
engwebp_usfm.zip
```

Fallback candidate:

```txt
engwebp_usfx.zip
```

Candidate edition:

```txt
World English Bible Protestant
Abbreviation: WEBP
eBible ID: ENGWEBP / engwebp
Runtime WCM version code after approval: WEB
```

Source URL status:

```txt
placeholder until explicitly approved
```

No file may be downloaded as part of this specification.

## Local-Only Source Package Location

WEB source packages must be kept outside tracked source, or under an explicitly ignored local path.

Allowed examples after approval:

```txt
/private/tmp/wcm-web-source/
storage/imports/web/
docs/data-sources/WEB/local-untracked/
```

Git policy:

- Do not commit raw WEB source files.
- Do not commit downloaded ZIP files.
- Do not commit extracted USFM/USFX files.
- Do not commit generated JSON/JSONL/SQL/import packages.
- Commit only documentation, license/provenance notes, manifest examples, tiny fixtures if separately approved, and validation summaries.

## Manifest Requirements

Every local WEB source package must have a manifest before dry-run.

Required fields:

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

Expected Bible version code:

```txt
WEB
```

The manifest must record the exact edition:

```txt
WEBP / ENGWEBP / engwebp
```

## Parser Strategy

Primary parser strategy:

```txt
USFM first
```

The first WEB import parser should:

- Read source files from the approved local package.
- Extract book identity.
- Extract chapter markers.
- Extract verse markers.
- Preserve verse text only.
- Normalize one output row per `version_code + book + chapter + verse`.
- Ignore section headings for first import unless explicitly supported later.
- Ignore footnotes for first import unless explicitly supported later.
- Ignore red-letter metadata.
- Ignore formatting markers beyond what is needed to produce plain verse text.
- Preserve punctuation in verse text.

Fallback parser strategy:

```txt
USFX
```

USFX may be used if USFM parsing proves unsafe or ambiguous, but requires the same manifest, dry-run, validation, and approval gates.

## Normalization Rules

Required normalized row shape:

```txt
version_code
book_slug
chapter
verse
text
source_file
source_reference
source_package_id
```

Rules:

- `version_code` must be `WEB`.
- Book identifiers must map to existing WCM canonical slugs.
- Canonical 66-book Protestant Bible order is expected.
- `chapter` must be a positive integer.
- `verse` must be a positive integer.
- Verse text must be trimmed.
- Internal punctuation must be preserved.
- Empty verse text must be rejected.
- Duplicate `book_slug + chapter + verse` rows must be rejected.
- Non-verse metadata must not become Bible verse text.
- Footnote content must not be merged into verse text in the first import.
- Section headings must not be imported as verse text in the first import.

## Validation Rules

The dry-run validator must report all of the following:

- Source package path.
- Manifest path.
- Manifest checksum status.
- Bible version code.
- Book count.
- Chapter count by book.
- Verse count by book.
- Total verse count.
- Duplicate verse keys.
- Missing verse references when expected counts are available.
- Empty verse text.
- Unsupported book identifiers.
- Unparsed source markers.
- License/provenance metadata status.
- Whether an existing `WEB` version already exists in the local database.

Expected book count:

```txt
66
```

Expected chapter counts should match the canonical Protestant Bible structure already used by WCM reader routes.

Required sample spot checks:

```txt
genesis 1:1
psalms 23:1
isaiah 53:5
matthew 1:1
john 1:1
romans 8:1
revelation 22:21
```

Spot checks must record:

- reference.
- parsed text sample.
- source file.
- validation status.

## Dry-Run Sequence

Dry-run must be the default behavior.

Sequence:

1. Read manifest.
2. Verify source package checksum.
3. Parse source files.
4. Normalize rows.
5. Validate canonical book/chapter/verse mapping.
6. Validate duplicate/missing/empty verse issues.
7. Produce dry-run report.
8. Exit without database writes.

Dry-run must not:

- write to the database.
- create a data package unless separately approved.
- modify source files.
- modify schema.
- create migrations.
- change backend runtime behavior.

## Apply Sequence

Apply is local-only and requires explicit approval after dry-run review.

Required preconditions:

- Source URL approved.
- License/provenance approved.
- Manifest approved.
- Dry-run report passed.
- Local database backup completed.
- Rollback command/path documented.
- `--apply` or equivalent explicit flag approved.

Apply sequence:

1. Confirm local environment.
2. Confirm database backup path.
3. Re-run dry-run immediately before apply.
4. Insert or update Bible version row for `WEB`.
5. Insert WEB verse rows.
6. Do not overwrite another Bible version.
7. Verify imported row count.
8. Run reader API smoke tests.
9. Run search API smoke tests.
10. Record import report with manifest checksum and Git commit.

Reader/search smoke candidates:

```txt
/wp-json/wcm/v1/bible/WEB/genesis/1
/wp-json/wcm/v1/bible/WEB/john/1
/wp-json/wcm/v1/search?q=God&translation=WEB&page=1&per_page=20
```

Frontend smoke candidates after local apply:

```txt
/en/bible/WEB/genesis/1
/en/bible/WEB/john/1
/en/bible/search?q=God&translation=WEB&page=1&per_page=20
```

## Rollback

Rollback in this phase is local-only.

Allowed rollback options:

1. Restore the local database backup taken immediately before apply.
2. Remove WEB version and WEB verses from local DB only, if the importer records enough identity information to do so safely.

Rollback must not:

- delete KRV data.
- delete original-language data.
- affect production.
- run without an explicit local rollback command/review.

No production rollback is defined in this phase because production import is not authorized.

## Promotion Policy

Promotion order:

```txt
local dry-run -> local apply -> local QA -> staging approval -> staging apply -> production approval -> production apply
```

Direct production import is prohibited.

Staging and production require separate runbooks and approvals after local import is proven.

## Relationship To Existing KRV Tools

Existing KRV tools:

```txt
backend/app/public/wp-content/plugins/wcm-core/tools/export-krv-mdb.php
backend/app/public/wp-content/plugins/wcm-core/tools/import-krv-json.php
backend/app/public/wp-content/plugins/wcm-core/tools/verify-krv-import.php
```

Reusable principles:

- explicit source path.
- normalized intermediate rows.
- fail-closed validation.
- version-specific import.
- post-import verification.

Not reusable as-is:

- MDB extraction.
- KRV-specific validator.
- KRV-specific known empty verse handling.
- KRV version code assumptions.

WEB must have source-specific parsing and validation before apply.

## Non-Actions

This specification does not:

- download WEB.
- import WEB.
- store a source package.
- create a parser.
- change backend code.
- change schema.
- add migrations.
- write to local DB.
- write to production DB.
- approve staging or production promotion.
