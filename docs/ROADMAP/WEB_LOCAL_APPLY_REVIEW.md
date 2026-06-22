# WEB Local Apply Readiness Review

## Date

2026-06-22

## Purpose

This document reviews whether Word Covenant Ministry is ready to request a separately approved local-only WEB apply.

This is a readiness review only. It does not run import, does not run apply, does not write to the database, does not change schema, does not add migrations, does not change backend runtime code, and does not affect staging or production.

## Current Input State

Completed WEB preparation:

- WEB source review completed.
- WEB license review completed.
- WEB source package approved for local dry-run.
- WEB dry-run completed.
- WEB Empty Verse Policy approved.
- WEB dry-run re-executed with approved omissions.
- Dry-run status: `dry_run_passed`.
- Apply readiness from dry-run report: `conditionally ready for local apply review`.

Current approved source package:

```txt
Source: World English Bible Protestant
Edition: WEBP / ENGWEBP / engwebp
Package: engwebp_usfm.zip
Source URL: https://ebible.org/Scriptures/engwebp_usfm.zip
Checksum: 96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
```

Current dry-run result:

```txt
canonical books parsed=66
chapters parsed=1189
source verse markers parsed=31101
normalized verse rows=31096
duplicates=0
missing books=0
chapter count issues=0
unsupported books=0
unparsed markers=0
approved omissions=5
empty verse failures outside approved list=0
required spot checks=passed
```

Approved omissions:

```txt
Luke 17:36
Acts 8:37
Acts 15:34
Acts 24:7
Romans 16:25
```

## Preconditions Review

| Gate | Status | Notes |
| --- | --- | --- |
| Exact source package approved | Passed | `engwebp_usfm.zip` from eBible.org. |
| License/provenance reviewed | Passed | Public-domain WEBP source reviewed; trademark boundary recorded. |
| Checksum recorded | Passed | SHA-256 recorded in dry-run report. |
| Manifest recorded | Passed | Local-only manifest exists under `/private/tmp/wcm-web-dry-run/manifest.json`. |
| Dry-run passed | Passed | Re-execution passed after approved omissions policy. |
| Approved omissions policy | Passed | Five footnote-only markers approved for omission. |
| Local DB backup path confirmed | Pending | Must be created immediately before apply. |
| Backup restore verification | Pending | Must be verified before apply approval. |
| Rollback command/path documented | Pending | This document defines the required rollback plan, but it has not been exercised. |
| Apply-capable importer/tool reviewed | Pending | Current WEB parser is temporary dry-run tooling outside the repo; a reviewed local apply path must exist before apply. |
| Explicit local apply approval | Pending | Not granted by this review. |

## Backup Review

### Required Backup Location

Before any local apply, create a full local database backup outside tracked source.

Recommended path:

```txt
/private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Do not store the backup in Git. Do not commit SQL backups.

### Backup Creation Procedure

Backup must be created from the Local WP environment that will receive the WEB apply.

Recommended command pattern from the WordPress/Local shell:

```bash
wp db export /private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Alternative Local WP UI export is acceptable only if the resulting file path is recorded and the file is kept outside Git.

### Backup Verification

Before apply approval, verify:

```txt
backup file exists
backup file size is greater than zero
backup file timestamp is immediately before apply
backup command exited successfully
backup path is outside tracked source
backup can be read by the rollback operator
```

Recommended verification commands:

```bash
ls -lh /private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
test -s /private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Strongly recommended before any non-trivial apply:

- Restore the backup into a disposable Local/Flywheel clone.
- Confirm WordPress loads.
- Confirm KRV Bible routes still work in the clone.
- Confirm original-language tables still exist in the clone.

## Rollback Review

### Full DB Restore

Full DB restore is the primary rollback method for the first local WEB apply.

Rollback source:

```txt
/private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Recommended local rollback command pattern:

```bash
wp db import /private/tmp/wcm_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

After restore, run validation:

```txt
KRV reader API still returns Genesis 1.
KRV search API still returns expected results.
WEB version is absent unless it existed before apply.
Original-language term count remains expected.
Original-language occurrence count remains expected.
```

### WEB-Only Rollback

WEB-only rollback may be possible only if the future importer records enough version-scoped identity to safely remove WEB without affecting other versions.

Minimum requirements for WEB-only rollback:

```txt
WEB Bible version row is uniquely identified by version_code=WEB.
WEB verse rows are version-scoped and can be deleted without touching KRV.
WEB import report records inserted counts.
No cross-version relationship rows are created in the same apply.
No schema changes are included.
No original-language rows are touched.
```

Potential WEB-only rollback shape after apply, pending tool review:

```txt
delete WEB verses only
delete or deactivate WEB version row only
verify KRV remains unchanged
verify original-language data remains unchanged
```

WEB-only rollback must not be used unless the exact SQL/tooling is reviewed before execution. For the first local apply, full DB restore remains the safest rollback path.

### KRV Protection Rules

Rollback and apply must never:

- delete KRV version rows.
- update KRV verse text.
- alter KRV book metadata.
- reindex KRV search in a way that removes KRV results.
- change KRV route behavior.

Post-rollback KRV checks:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1
/wp-json/wcm/v1/search?q=씨&translation=KRV&page=1&per_page=20
```

### Original Language Data Protection Rules

WEB apply must not touch:

```txt
wcm_original_terms
wcm_original_word_occurrences
transliteration_ko
gloss_ko
term_identity_hash
```

Post-rollback original-language checks:

```txt
terms count remains expected
occurrences count remains expected
interlinear Genesis 1:1 still returns tokens
interlinear Matthew 1:1 still returns tokens
```

Known current reference counts from project status:

```txt
original terms=16891
original occurrences=673263
```

## Post Import Validation

If a future local apply is explicitly approved and completed, run all checks below before declaring local WEB import complete.

### Database Validation

Required:

```txt
WEB version row exists.
WEB book coverage matches 66 canonical books.
WEB chapter coverage matches 1189 chapters.
WEB normalized verse rows match 31096.
Approved omissions count remains 5.
Approved omissions do not create blank verse rows.
Duplicate WEB book/chapter/verse rows count is 0.
KRV row counts remain unchanged.
Original-language row counts remain unchanged.
```

Approved omissions validation:

```txt
Luke 17:36 absent as WEB verse row
Acts 8:37 absent as WEB verse row
Acts 15:34 absent as WEB verse row
Acts 24:7 absent as WEB verse row
Romans 16:25 absent as WEB verse row
```

### Reader API Validation

Required smoke checks:

```txt
/wp-json/wcm/v1/bible/WEB/genesis/1
/wp-json/wcm/v1/bible/WEB/john/1
/wp-json/wcm/v1/bible/WEB/romans/8
/wp-json/wcm/v1/bible/WEB/revelation/22
```

Expected:

```txt
HTTP success response
version/translation identifies WEB
book/chapter metadata is correct
verse text is present
approved omitted verses are not rendered as blank rows
```

### Search API Validation

Required smoke checks:

```txt
/wp-json/wcm/v1/search?q=God&translation=WEB
/wp-json/wcm/v1/search?q=Jesus&translation=WEB
/wp-json/wcm/v1/search?q=grace&translation=WEB
```

Expected:

```txt
HTTP success response
results are scoped to WEB
result references link to valid WEB book/chapter/verse routes
approved omitted verses do not appear as empty search results
KRV search remains available separately
```

### Frontend Validation

Required smoke checks after local apply:

```txt
/en/bible/WEB/genesis/1
/en/bible/WEB/john/1
/en/bible/search?q=God&translation=WEB
/ko/bible/KRV/genesis/1
/ko/bible/search?q=씨&translation=KRV&page=1&per_page=20
```

Expected:

```txt
English WEB reader renders real WEB text.
English WEB search renders real WEB search results.
Korean KRV reader still renders KRV.
Korean KRV search still works.
No fake English Bible text is used.
```

## Reader/Search Smoke Checklist

Run after a separately approved local apply:

- `GET /wp-json/wcm/v1/bible/WEB/genesis/1`
- `GET /wp-json/wcm/v1/bible/WEB/john/1`
- `GET /wp-json/wcm/v1/search?q=God&translation=WEB`
- `/en/bible/WEB/genesis/1`
- `/en/bible/WEB/john/1`
- `/en/bible/search?q=God&translation=WEB`

Also run KRV protection checks:

- `GET /wp-json/wcm/v1/bible/KRV/genesis/1`
- `GET /wp-json/wcm/v1/search?q=씨&translation=KRV&page=1&per_page=20`
- `/ko/bible/KRV/genesis/1`
- `/ko/bible/search?q=씨&translation=KRV&page=1&per_page=20`

## Risks

### Apply Tooling Gap

The current WEB dry-run parser is temporary local tooling outside the repository. There is no committed WEB importer/apply tool in the official plugin path yet.

Risk:

```txt
Applying without a reviewed local apply tool could create non-repeatable data state.
```

Mitigation:

```txt
Before apply, use a reviewed, explicit, local-only apply path with dry-run-first behavior and no production target.
```

### Backup Not Yet Created

No pre-apply backup has been created as part of this review.

Mitigation:

```txt
Create and verify a full DB backup immediately before local apply.
```

### Rollback Not Exercised

Rollback procedure is documented but not tested in this review.

Mitigation:

```txt
Prefer full DB restore for first local apply rollback.
Optionally test restore in a disposable Local/Flywheel clone before apply.
```

### Version Count Difference

WEB dry-run normalizes `31,096` verse rows due to five approved omissions. This differs from KRV `31,102`.

Mitigation:

```txt
Treat the five omissions as known source/version differences.
Do not compare KRV and WEB by raw verse-row equality.
```

### Production Boundary

The current readiness applies only to local review.

Mitigation:

```txt
Staging and production require separate approval, runbook, backup, dry-run, apply, and rollback review.
```

## Final Verdict

```txt
Ready With Conditions
```

Conditions before local apply:

1. Explicit local apply approval is granted.
2. A full local DB backup is created immediately before apply.
3. The backup path is recorded and verified.
4. Rollback owner and rollback command are confirmed.
5. A reviewed local-only WEB apply path exists.
6. The apply path re-runs dry-run immediately before writing.
7. The apply path writes only `WEB` Bible version/book/verse data.
8. KRV and original-language protection checks are run after apply.

This document does not approve local apply. It only records that the project is ready to consider a local apply request after the listed conditions are satisfied.

## Explicit Non-Actions

This review did not:

- run local apply.
- run import.
- write to the database.
- change schema.
- add migrations.
- change backend runtime code.
- change frontend runtime code.
- touch staging.
- touch production.
- commit raw WEB source files.
- commit generated WEB packages.
