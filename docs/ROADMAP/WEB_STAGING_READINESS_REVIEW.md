# WEB Staging Readiness Review

## Date

2026-06-22

## Purpose

This document reviews whether the local WEB import state is ready to move toward a separately approved staging apply.

This is a review document only. It does not run staging apply, production apply, import, database writes, schema changes, migrations, backend runtime changes, or frontend runtime changes.

## Current State

Completed locally:

- WEB source and license review.
- WEB import execution specification.
- WEB dry-run checklist.
- WEB dry-run report.
- WEB Empty Verse Policy approval.
- WEB local apply readiness review.
- WEB local apply report.
- Local WEB reader/search smoke checks.

Current boundary:

```txt
Local WEB apply: complete
Staging WEB apply: not approved / blocked
Production WEB apply: not approved / blocked
```

## 1. Source Audit

| Item | Reviewed State | Audit Result |
| --- | --- | --- |
| Edition | World English Bible Protestant, `WEBP / ENGWEBP / engwebp` | complete |
| Source package | `engwebp_usfm.zip` | complete |
| Source URL | `https://ebible.org/Scriptures/engwebp_usfm.zip` | complete |
| License/provenance | Public-domain WEBP source reviewed; trademark boundary recorded | complete |
| Checksum | `96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8` | complete |
| Manifest | Local manifest recorded at `/private/tmp/wcm-web-dry-run/manifest.json` | complete for local; must be reproduced or transferred safely for staging |
| Generated/source data policy | Raw ZIP, extracted USFM, generated reports, and import artifacts remain outside Git | complete |

Source audit verdict:

```txt
complete for local evidence
ready with staging condition: staging operator must use the same approved package/checksum/manifest metadata
```

## 2. Import Audit

Reviewed inputs:

- `docs/ROADMAP/WEB_DRY_RUN_REPORT.md`
- `docs/ROADMAP/WEB_EMPTY_VERSE_POLICY.md`
- `docs/ROADMAP/WEB_LOCAL_APPLY_REVIEW.md`
- `docs/ROADMAP/WEB_LOCAL_APPLY_REPORT.md`

Dry-run result:

```txt
status=dry_run_passed
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

Approved omissions:

```txt
Luke 17:36
Acts 8:37
Acts 15:34
Acts 24:7
Romans 16:25
```

Local apply result:

```txt
status=local_apply_passed
WEB version row=updated/activated
WEB verses inserted=31096
WEB books=66
WEB chapters=1189
WEB duplicate verse keys=0
```

Import audit verdict:

```txt
complete for local apply evidence
ready with staging condition: dry-run must be re-executed immediately before any staging apply
```

## 3. Data Integrity Audit

Local pre-apply counts recorded:

```txt
KRV verses=31102
WEB verses=0
original terms=16891
original occurrences=673263
```

Local post-apply counts recorded:

```txt
KRV verses=31102
WEB verses=31096
original terms=16891
original occurrences=673263
```

Data integrity findings:

- KRV verse count remained unchanged.
- Original term count remained unchanged.
- Original occurrence count remained unchanged.
- WEB import was version-scoped.
- Approved omissions were not inserted as blank WEB rows.
- Duplicate WEB verse keys remained `0`.

Data integrity audit verdict:

```txt
complete for local evidence
ready with staging condition: staging must capture pre/post KRV, WEB, original term, and original occurrence counts
```

## 4. Rollback Audit

Local backup path:

```txt
/private/tmp/wcm_web_pre_apply_20260622_132456.sql
```

Local backup state:

```txt
created=yes
path outside Git=yes
size=222M
non-empty=yes
```

Local restore command:

```bash
wp db import /private/tmp/wcm_web_pre_apply_20260622_132456.sql --path=backend/app/public
```

Staging rollback requirements before any apply:

1. Create a staging DB backup immediately before staging apply.
2. Record the exact staging backup path and size.
3. Confirm the backup is outside Git and accessible to the rollback operator.
4. Record the staging restore command for that environment.
5. Confirm rollback owner and stop criteria before apply.
6. Prefer full DB restore as the first staging rollback method.

WEB-only rollback may be possible only if reviewed staging tooling deletes WEB-scoped rows without touching KRV or original-language data. It must not be improvised during an incident.

Rollback audit verdict:

```txt
sufficient for local apply evidence
insufficient for staging until staging-specific backup path, restore command, and rollback owner are recorded
```

## 5. Runtime Audit

Local documented smoke coverage:

| Area | Local Evidence | Staging Requirement |
| --- | --- | --- |
| Reader | WEB Genesis 1 and John 1 API/frontend smoke passed | Verify WEB Genesis 1, Psalms 23, Matthew 1, John 1, Romans 8, Revelation 22 |
| Search | WEB `God` API/frontend smoke passed; local QA reported `God`, `Jesus`, `Spirit`, `Lord` search checks | Verify search counts, pagination, and result navigation |
| Original Text | Original-language APIs remain independent of WEB | Verify KRV original mode still works |
| Interlinear | Genesis 1:1 TAHOT and Matthew 1:1 TAGNT paths remain independent of WEB | Verify KRV interlinear and Word Study still work |
| Word Study | Original terms/occurrences unchanged in local report | Verify Strong -> Term -> Insight -> Distribution -> Occurrence workflow |
| Cross Reference | Frontend foundation is data-light and reference-based | Verify placeholder/MVP panel has no runtime errors |
| Gospel Harmony | Frontend foundation is API-backed and reference-based | Verify workspace has no runtime errors |

Known runtime constraint:

```txt
Interactive browser automation was not recorded as a staging-grade gate in the local apply report. Before production promotion, staging should include real browser click-through for reader, search, original/interlinear, word panel, cross reference, and gospel harmony flows.
```

Runtime audit verdict:

```txt
ready with conditions
```

## 6. Promotion Audit

Required promotion path:

```txt
Local -> Staging -> Production
```

### Local Gate

Passed locally:

- Source/license review complete.
- Checksum recorded.
- Manifest recorded.
- Dry-run passed.
- Empty Verse Policy approved.
- Local backup created.
- Local apply passed.
- Local API/frontend smoke checks passed.
- KRV and original-language data counts unchanged.

### Staging Gate

Required before staging apply:

1. Explicit staging apply approval.
2. Same approved source package, checksum, and manifest metadata.
3. Staging DB backup created and verified.
4. Staging rollback owner and restore command recorded.
5. Dry-run re-executed against the staging-bound source package.
6. Apply writes only WEB version/book/verse data.
7. Post-apply counts verify:
   - WEB version exists.
   - WEB verses = `31096`.
   - WEB books = `66`.
   - WEB chapters = `1189`.
   - approved omissions = `5`.
   - duplicate WEB verse keys = `0`.
   - KRV verses unchanged.
   - original terms unchanged.
   - original occurrences unchanged.
8. Reader, search, original text, interlinear, word study, cross reference, and gospel harmony smoke checks pass.

### Missing Operational Facts To Be Provided Before Approval

The following staging facts still need to be documented before staging approval can be considered:

1. staging WordPress host/path
2. staging DB access / WP-CLI context
3. staging API base URL
4. staging frontend URL / API binding
5. staging backup command
6. backup storage location/category
7. restore command
8. rollback owner
9. recovery time / rollback window
10. staging dry-run command
11. staging dry-run report location
12. staging browser/runtime smoke owner
13. staging post-apply validation checklist owner

These items may be recorded only in non-secret form.

Allowed examples:

- host label
- environment identifier
- command pattern
- path pattern
- owner role
- report path pattern
- backup storage category

Forbidden examples:

- DB passwords
- tokens
- API secrets
- private keys
- raw credentials
- unprotected backup URLs

### Production Gate

Required before production apply:

1. Staging apply report passed.
2. Staging browser QA completed.
3. Production apply explicitly approved.
4. Production maintenance/rollback window defined.
5. Production DB backup created and verified.
6. Production dry-run re-executed.
7. Production rollback owner and stop criteria confirmed.
8. Post-production API/frontend smoke checks recorded.

Direct local-to-production import remains prohibited.

## 7. Risk Assessment

### Source Risks

- WEB edition names can be confused (`WEB`, `WEBP`, `ENGWEBP`, related WEB variants).
- Source package availability or checksum may drift if the remote package changes.
- Public-domain text and trademark boundary must remain accurately documented.

Mitigation:

- Use the recorded package URL, edition, and SHA-256 checksum.
- Preserve manifest metadata in staging and production reports.
- Do not use a different WEB source package without a new review.

### Runtime Risks

- Staging environment may have different API URL, CORS, cache, or rewrite behavior.
- Browser-level interactions were not fully proven by the local apply report.
- WEB routes are now data-backed locally, but staging frontend/backend routing must be verified after apply.

Mitigation:

- Run staging API and frontend smoke checks.
- Include manual browser click-through before production promotion.

### Data Risks

- WEB has `31,096` normalized rows, while KRV has `31,102`; this is expected because of approved WEB omissions and source/version differences.
- Improper rollback could remove KRV rows or original-language rows if not scoped correctly.
- Improvised WEB-only rollback could be unsafe.

Mitigation:

- Compare version-scoped counts, not KRV/WEB raw equality.
- Use full staging DB backup as primary rollback.
- Verify KRV and original-language counts before and after staging apply.

### Deployment Risks

- Staging may not have the same Local WP paths, WP-CLI path, DB credentials, or file permissions as local.
- Generated source/import files could be accidentally committed if placed under tracked paths.
- Staging apply might be mistaken for production readiness.

Mitigation:

- Keep generated/source files outside Git or in ignored paths.
- Record staging-specific commands and paths.
- Require separate production approval after staging passes.

## Final Verdict

```txt
Ready With Conditions
```

Rationale:

- Source, dry-run, empty-verse policy, and local apply evidence are complete.
- Local data integrity checks show KRV and original-language data preserved.
- Staging apply is reasonable to consider only after explicit staging approval.
- Staging-specific backup, rollback command, dry-run re-execution, and browser QA are still required before any production promotion.

This review does not approve staging apply or production apply.

## Explicit Non-Actions

This review did not:

- run staging apply.
- run production apply.
- run import.
- write to any database.
- change schema.
- add migrations.
- change backend runtime code.
- change frontend runtime code.
- commit raw WEB source files.
- commit generated WEB packages.
