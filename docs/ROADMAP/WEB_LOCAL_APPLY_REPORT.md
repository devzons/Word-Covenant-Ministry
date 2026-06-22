# WEB Local Apply Report

## Date

2026-06-22

## Purpose

This report records the approved local-only WEB apply for Word Covenant Ministry.

The apply was limited to the local development database. It did not change schema, did not add migrations, did not change backend runtime code, did not change frontend runtime code, did not run staging apply, and did not touch production.

## Source Package

```txt
Source: World English Bible Protestant
Edition: WEBP / ENGWEBP / engwebp
Package: engwebp_usfm.zip
Source URL: https://ebible.org/Scriptures/engwebp_usfm.zip
Local source path: /private/tmp/wcm-web-dry-run/source/engwebp_usfm.zip
Checksum SHA-256: 96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
```

Generated local-only files remain outside the repository and must not be committed:

```txt
/private/tmp/wcm-web-dry-run/web-usfm-dry-run.php
/private/tmp/wcm-web-dry-run/web-usfm-local-apply.php
/private/tmp/wcm-web-dry-run/reports/web-dry-run-report.json
/private/tmp/wcm-web-dry-run/reports/web-local-apply-report.json
```

## Backup

Pre-apply local DB backup:

```txt
/private/tmp/wcm_web_pre_apply_20260622_132456.sql
```

Backup verification:

```txt
created: yes
path outside Git: yes
size: 222M
non-empty: yes
```

## Immediate Dry Run

Dry-run was re-executed immediately before apply.

```txt
status=dry_run_passed
db_write_performed=false
apply_performed=false
canonical_books_parsed=66
chapters_parsed=1189
source_verse_markers_parsed=31101
normalized_verse_rows=31096
duplicates=0
missing_books=0
chapter_count_issues=0
unsupported_books=0
unparsed_markers=0
approved_omissions=5
empty_verse_failures_outside_approved_list=0
```

## Apply Result

Final apply status:

```txt
local_apply_passed
```

Applied changes:

```txt
WEB version row: updated/activated
WEB verse rows inserted: 31096
schema_changed=false
migration_added=false
backend_runtime_changed=false
frontend_runtime_changed=false
production_changed=false
```

Pre-apply counts:

```txt
KRV verses=31102
WEB verses=0
original terms=16891
original occurrences=673263
```

Post-apply counts:

```txt
KRV verses=31102
WEB verses=31096
WEB books=66
WEB chapters=1189
WEB duplicate verse keys=0
original terms=16891
original occurrences=673263
```

## Approved Omissions

The approved footnote-only verse markers were not inserted as blank verse rows:

```txt
Luke 17:36 present=false
Acts 8:37 present=false
Acts 15:34 present=false
Acts 24:7 present=false
Romans 16:25 present=false
```

## API Smoke Tests

Reader API:

```txt
/wp-json/wcm/v1/bible/WEB/genesis/1 -> HTTP 200
/wp-json/wcm/v1/bible/WEB/john/1 -> HTTP 200
```

Search API:

```txt
/wp-json/wcm/v1/search?q=God&translation=WEB -> HTTP 200
```

Response checks:

```txt
Genesis 1:1 = In the beginning, God created the heavens and the earth.
John 1:1 = In the beginning was the Word, and the Word was with God, and the Word was God.
WEB search total for God = 3692
First WEB search result = genesis 1:1
```

## Frontend Smoke Tests

```txt
/en/bible/WEB/genesis/1 -> HTTP 200, WEB Genesis text present
/en/bible/WEB/john/1 -> HTTP 200, WEB John text present
/en/bible/search?q=God&translation=WEB -> HTTP 200, search page contains query/results text
```

## Rollback Information

Primary rollback path:

```bash
wp db import /private/tmp/wcm_web_pre_apply_20260622_132456.sql --path=backend/app/public
```

Rollback scope:

```txt
local database only
no production rollback defined
no staging rollback needed
```

WEB-only rollback may be possible by deleting WEB-scoped verse rows and deactivating/removing the WEB version row, but the full DB backup remains the safest first rollback path for this local apply.

## Final Verdict

```txt
WEB local apply passed.
```

Known constraints:

- Staging apply is not approved.
- Production apply is not approved.
- No schema migration was added.
- No backend runtime importer was committed.
- Generated WEB source and temporary apply files remain outside Git.
