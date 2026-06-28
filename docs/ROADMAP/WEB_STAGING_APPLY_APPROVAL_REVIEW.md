# WEB Staging Apply Approval Review

## Date

2026-06-22

## Purpose

This document reviews whether Word Covenant Ministry is ready to approve a WEB staging apply after the local WEB apply and staging readiness review.

This is a review document only. It does not run staging apply, production apply, import, database writes, schema changes, migrations, backend runtime changes, or frontend runtime changes.

## Current State

Completed:

- WEB source/license review.
- WEB dry-run and approved empty-verse policy.
- WEB local apply readiness review.
- WEB local apply.
- WEB local reader/search smoke checks.
- WEB staging readiness review.

Current boundary:

```txt
Local WEB apply: complete
Staging readiness review: complete
Staging WEB apply: not approved / blocked
Production WEB apply: not approved / blocked
```

## 1. Staging Environment Audit

The staging readiness review establishes that local evidence is strong enough to consider staging, but it does not record staging-specific operational facts.

| Staging Area | Required Before Apply | Current Review Result |
| --- | --- | --- |
| Staging WordPress | Target WordPress host/path identified and reachable | insufficient |
| Staging DB | DB access, credentials, and WP-CLI context confirmed | insufficient |
| Staging API | Staging REST API base URL confirmed | insufficient |
| Staging Frontend | Staging frontend URL and API binding confirmed | insufficient |
| Backup capability | Staging DB backup command and storage location verified | insufficient |
| Restore capability | Staging DB restore command verified | insufficient |
| Rollback capability | Rollback owner, procedure, and timing defined | insufficient |

Staging environment verdict:

```txt
not approved / blocked
```

Reason:

```txt
The repo documents local WEB apply success and staging readiness conditions, but it does not yet record concrete staging WordPress, DB, API, frontend, backup, restore, or rollback operational details.
```

## 2. Promotion Audit

Required promotion path:

```txt
Local -> Staging -> Production
```

### Local Gate

Local gate status:

```txt
passed
```

Evidence:

- Source package approved.
- License/provenance reviewed.
- Checksum recorded.
- Dry-run passed.
- Empty Verse Policy approved.
- Local DB backup created.
- Local apply passed.
- WEB reader/search local smoke checks passed.
- KRV count unchanged.
- Original-language term and occurrence counts unchanged.

### Staging Gate

Staging gate status:

```txt
not approved / blocked
```

Missing approval prerequisites:

1. Staging target environment details.
2. Staging WordPress host/path.
3. Staging DB access / WP-CLI context.
4. Staging API base URL.
5. Staging frontend URL and API binding.
6. Staging backup command and storage path.
7. Staging backup verification method.
8. Staging restore command.
9. Rollback owner.
10. Expected recovery time and rollback window.
11. Staging dry-run command and report location.
12. Staging browser/runtime smoke owner.
13. Staging post-apply validation checklist ownership.

### Production Gate

Production gate status:

```txt
not approved / blocked
```

Production remains blocked until a separately approved staging apply succeeds and staging QA is recorded.

Promotion audit verdict:

```txt
Local gate passed; staging gate remains not approved / blocked until the missing operational facts are recorded.
```

## 3. Backup Audit

Local backup evidence:

```txt
Path: /private/tmp/wcm_web_pre_apply_20260622_132456.sql
Size: 222M
Status: created and non-empty
Scope: local database only
```

Required staging backup procedure before staging apply:

```bash
wp db export /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Required staging backup storage rules:

- Store outside Git.
- Do not store under public web root unless protected.
- Record exact path.
- Record file size.
- Record timestamp.
- Verify file is non-empty.
- Confirm rollback operator can access it.

Required staging backup verification:

```bash
ls -lh /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
test -s /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Backup audit verdict:

```txt
not approved / blocked
```

Reason:

```txt
The staging backup path, command context, verification output, and operator access are not yet recorded.
```

## 4. Rollback Audit

Local rollback evidence:

```bash
wp db import /private/tmp/wcm_web_pre_apply_20260622_132456.sql --path=backend/app/public
```

Required staging restore command:

```bash
wp db import /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql --path=/staging/wordpress/path
```

Required staging restore procedure:

1. Stop staging apply or traffic as needed.
2. Confirm rollback owner approves restore.
3. Import the pre-apply staging database backup.
4. Clear object/page/API cache if applicable.
5. Verify KRV reader/search.
6. Verify WEB absence or expected pre-apply state.
7. Verify original-language tables and counts.
8. Record rollback result.

Required rollback owner:

```txt
Not recorded
```

Required expected recovery time:

```txt
Not recorded
```

Rollback audit verdict:

```txt
not approved / blocked
```

Reason:

```txt
The local rollback path is documented, but a staging-specific restore command, responsible operator, and recovery estimate are not yet documented.
```

## 5. Runtime Audit

Local runtime evidence from the local apply report:

| Runtime Area | Local Evidence | Staging Approval Requirement |
| --- | --- | --- |
| Reader | WEB Genesis 1 and John 1 API/frontend smoke checks passed | Verify WEB Genesis 1, Psalms 23, Matthew 1, John 1, Romans 8, Revelation 22 |
| Search | WEB `God` search API/frontend smoke passed | Verify `God`, `Jesus`, `Spirit`, `Lord`, pagination, and result navigation |
| Original Language | Original term and occurrence counts unchanged | Verify KRV original text, interlinear, and term lookup workflows |
| Word Study | Original-language data preserved | Verify Strong -> Term -> Insight -> Distribution -> Occurrence |
| Cross Reference | Frontend foundation is reference-based | Verify panel loads and has no staging runtime errors |
| Gospel Harmony | Frontend foundation is reference/API-based | Verify workspace loads and has no staging runtime errors |

Runtime audit verdict:

```txt
not approved / blocked
```

Reason:

```txt
The runtime paths are known and local smoke checks passed, but staging runtime URLs, API bindings, cache behavior, and browser checks are not yet recorded.
```

## 6. Risk Review

### Data Risk

Risk:

- WEB row count differs from KRV because WEB has approved omitted markers.
- A staging apply could accidentally overwrite or duplicate existing WEB rows if staging already contains partial data.
- KRV and original-language data must remain untouched.

Mitigation:

- Capture pre-apply staging counts.
- Re-run dry-run immediately before apply.
- Verify WEB `31096`, approved omissions `5`, duplicate keys `0`.
- Verify KRV `31102`, original terms `16891`, and original occurrences `673263` remain unchanged unless staging has documented expected differences.

### Deployment Risk

Risk:

- Staging paths, DB credentials, WP-CLI context, cache, and API URLs may differ from local.
- Temporary source/import files may be misplaced under tracked or public paths.

Mitigation:

- Record staging-specific paths and commands before apply.
- Keep source and generated files outside Git.
- Verify `git status` before and after staging procedure.

### Runtime Risk

Risk:

- Staging frontend may point at the wrong API.
- CORS, REST routes, search, cache, or rewrite behavior may differ from local.
- Manual browser click-through has not yet been recorded as passed on staging.

Mitigation:

- Run API smoke checks before frontend QA.
- Run browser checks for reader, search, original/interlinear, word study, cross reference, and gospel harmony after staging apply.

### Rollback Risk

Risk:

- No staging restore command, owner, or recovery estimate is currently recorded.
- WEB-only rollback is unsafe without reviewed tooling.

Mitigation:

- Require full DB backup and full restore plan before apply.
- Treat WEB-only rollback as out of scope unless separately reviewed.

## 7. Approval Gate

### Secret Handling Boundary

The staging gate may record only non-secret operational identifiers.

Allowed:

- host label
- environment identifier
- command pattern
- path pattern
- owner role
- report path pattern
- backup storage category

Forbidden:

- DB passwords
- tokens
- API secrets
- private keys
- raw credentials
- unprotected backup URLs

Final approval gate verdict:

```txt
Not Approved / Blocked
```

Conditions required before actual staging apply:

1. Explicit staging apply approval after this review.
2. Staging WordPress/API/frontend targets recorded.
3. Staging DB backup command and storage path recorded.
4. Backup file created and verified immediately before apply.
5. Staging restore command recorded.
6. Rollback owner and expected recovery time recorded.
7. Staging dry-run re-executed and passed immediately before apply.
8. Staging apply writes only WEB Bible version/book/verse data.
9. Post-apply validation confirms WEB counts, approved omissions, duplicates, KRV preservation, and original-language preservation.
10. Staging runtime smoke checks pass before any production review.

This document does not approve staging apply. It records that staging apply remains blocked until the listed operational facts are documented without secrets and a later explicit approval step is completed.

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
