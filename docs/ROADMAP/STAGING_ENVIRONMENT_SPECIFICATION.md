# Staging Environment Specification

## Date

2026-06-22

## Purpose

This document specifies the proposed staging environment for Word Covenant Ministry so WEB staging promotion can be reviewed safely before any staging apply or production promotion.

This is a specification document only. It does not create staging infrastructure, change DNS, run deployment, run import, run apply, write to a database, change schema, add migrations, or change runtime behavior.

## Current Finding

`docs/ROADMAP/STAGING_ENVIRONMENT_DISCOVERY.md` found:

```txt
No Staging Environment Exists
```

Current documented endpoints:

```txt
Local frontend: http://wordcovenantministry.local:3030
Local API: http://api.wordcovenantministry.local/wp-json
Production frontend: https://wordcovenantministry.org
Production API: https://api.wordcovenantministry.org
```

Current promotion boundary:

```txt
WEB local apply: complete
WEB local QA: complete
Staging apply: not approved
Production apply: not approved
```

## Proposed Staging URLs

Proposed staging frontend:

```txt
https://staging.wordcovenantministry.org
```

Proposed staging WordPress/API host:

```txt
https://api-staging.wordcovenantministry.org
```

Proposed staging WordPress REST base:

```txt
https://api-staging.wordcovenantministry.org/wp-json
```

Proposed staging WCM API namespace:

```txt
https://api-staging.wordcovenantministry.org/wp-json/wcm/v1
```

DNS status:

```txt
not created by this document
```

These URLs are proposed defaults. They must not be treated as live targets until DNS, hosting, TLS, WordPress, frontend deployment, and API routing are explicitly configured and verified.

## Frontend Hosting

Proposed hosting model:

```txt
Platform: Vercel or the same frontend hosting platform used for production
Staging URL: staging.wordcovenantministry.org
Source: same repository
Deployment input: reviewed Git commit or annotated release tag
```

Required staging frontend configuration:

```txt
NEXT_PUBLIC_API_URL=https://api-staging.wordcovenantministry.org/wp-json
```

Frontend staging requirements:

- Must be isolated from production frontend.
- Must not point to production API unless explicitly approved for a read-only smoke test.
- Must deploy the same commit/tag that is under staging review.
- Must preserve locale route policy:
  - `/ko` defaults to KRV.
  - `/en` routes to WEB after WEB is available in the target backend.
- Must run frontend smoke checks after deployment.

## Backend Hosting

Proposed backend model:

```txt
Staging WordPress: separate staging backend instance
Staging API: api-staging.wordcovenantministry.org
Plugin path: wp-content/plugins/wcm-core/
Plugin source: backend/app/public/wp-content/plugins/wcm-core/
```

Backend staging requirements:

- Must be isolated from production WordPress.
- Must use a staging database, not production DB.
- Must deploy the same approved plugin commit/tag intended for staging validation.
- Must record plugin version and Git commit/tag.
- Must run dependency installation if needed:

```bash
composer install
```

- Must validate `wcm_core_db_version` before any data apply.

## Database Isolation

Required staging database model:

```txt
Staging DB must be separate from production DB.
Staging DB may be seeded from a production-like snapshot only after backup/source approval.
Staging WEB apply must never target production.
```

Minimum staging DB facts to record before apply:

- DB engine and version.
- DB host.
- DB name.
- DB user/privilege model.
- WP table prefix.
- Baseline `wcm_core_db_version`.
- Baseline KRV verse count.
- Baseline original term count.
- Baseline original occurrence count.
- Whether WEB already exists in staging before apply.

## Source/Data Policy

Approved WEB source metadata from local review:

```txt
Source: World English Bible Protestant
Edition: WEBP / ENGWEBP / engwebp
Package: engwebp_usfm.zip
Source URL: https://ebible.org/Scriptures/engwebp_usfm.zip
Checksum SHA-256: 96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
```

Staging source policy:

- Use the same approved source package and checksum.
- Do not download a different package without a new source review.
- Keep raw source ZIP, extracted USFM, generated reports, SQL backups, and import artifacts outside Git or under ignored paths.
- Do not commit generated WEB source/import files.
- Record staging manifest path and checksum before dry-run.

## Backup Policy

Before any staging apply, create a full staging database backup.

Required backup properties:

```txt
scope=staging database only
location=outside Git
created_at=immediately before staging apply
verified=non-empty file and readable by rollback operator
```

Recommended naming pattern:

```txt
wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

Example command shape:

```bash
wp db export /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql --path=/path/to/staging/wordpress
```

Required verification:

```bash
ls -lh /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
test -s /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql
```

## Restore Policy

Primary restore method:

```txt
full staging DB restore
```

Example command shape:

```bash
wp db import /path/outside/git/wcm_staging_web_pre_apply_YYYYMMDD_HHMMSS.sql --path=/path/to/staging/wordpress
```

Restore must be followed by:

1. Cache/object cache clear if applicable.
2. KRV reader API smoke.
3. KRV search API smoke.
4. Original-language interlinear API smoke.
5. WEB expected pre-apply state verification.
6. Written rollback result.

WEB-only rollback is not approved by this specification. It may be considered later only if reviewed tooling can delete/deactivate WEB-scoped rows without touching KRV, original-language, schema, or production data.

## Rollback Policy

Rollback owner:

```txt
must be assigned before staging apply
```

Expected recovery time:

```txt
must be estimated before staging apply
```

Rollback trigger examples:

- Staging dry-run result differs from local approved result.
- WEB post-apply count differs from `31096` without approved explanation.
- Duplicate WEB verse keys are detected.
- Approved omissions are inserted as blank rows.
- KRV count changes unexpectedly.
- Original-language term or occurrence counts change unexpectedly.
- Reader/search API smoke fails after apply.
- Frontend staging points to the wrong API.

Preferred rollback:

```txt
restore the pre-apply staging DB backup
```

## WEB Staging Apply Preconditions

Staging apply may be requested only after all conditions below are met:

1. Staging frontend URL exists and is reachable.
2. Staging API URL exists and is reachable.
3. Staging WordPress instance is identified.
4. Staging DB is isolated from production.
5. Staging DB backup command is verified.
6. Staging DB restore command is documented.
7. Rollback owner is assigned.
8. Expected recovery time is documented.
9. Same approved WEB source package/checksum is available.
10. Staging dry-run is re-executed immediately before apply.
11. Dry-run result matches:

```txt
canonical_books_parsed=66
chapters_parsed=1189
normalized_verse_rows=31096
duplicates=0
approved_omissions=5
empty_verse_failures_outside_approved_list=0
```

12. Explicit staging apply approval is granted after dry-run.
13. Apply writes only WEB version/book/verse data.
14. No schema, migration, backend runtime, or frontend runtime change is bundled with the WEB staging apply.

## Staging QA Checklist

### API Checks

WEB reader:

```txt
/wp-json/wcm/v1/bible/WEB/genesis/1
/wp-json/wcm/v1/bible/WEB/psalms/23
/wp-json/wcm/v1/bible/WEB/matthew/1
/wp-json/wcm/v1/bible/WEB/john/1
/wp-json/wcm/v1/bible/WEB/romans/8
/wp-json/wcm/v1/bible/WEB/revelation/22
```

WEB search:

```txt
/wp-json/wcm/v1/search?q=God&translation=WEB
/wp-json/wcm/v1/search?q=Jesus&translation=WEB
/wp-json/wcm/v1/search?q=Spirit&translation=WEB
/wp-json/wcm/v1/search?q=Lord&translation=WEB
```

KRV protection:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1
/wp-json/wcm/v1/search?q=씨&translation=KRV&page=1&per_page=20
```

Original-language protection:

```txt
/wp-json/wcm/v1/interlinear/STEP_TAHOT/genesis/1/1
/wp-json/wcm/v1/interlinear/STEP_TAGNT/matthew/1/1
```

### Frontend Checks

```txt
/en/bible/WEB/genesis/1
/en/bible/WEB/john/1
/en/bible/search?q=God&translation=WEB
/ko/bible/KRV/genesis/1
/ko/bible/KRV/genesis/1?mode=original
/ko/bible/KRV/genesis/1?mode=interlinear
/ko/gospel-harmony
```

### Data Checks

Required post-apply counts:

```txt
WEB verses=31096
WEB books=66
WEB chapters=1189
WEB duplicate verse keys=0
approved omissions=5 absent as blank rows
KRV verses unchanged
original terms unchanged
original occurrences unchanged
```

## Production Promotion Preconditions

Production promotion remains blocked until all conditions below are satisfied:

1. Staging environment exists and is documented.
2. Staging WEB apply passes.
3. Staging QA report is written.
4. Browser click-through QA is complete on staging.
5. Production apply approval is requested separately.
6. Production backup and restore procedure is documented.
7. Production maintenance/rollback window is defined.
8. Production dry-run is re-executed before production apply.
9. Production apply uses the same approved source/checksum and reviewed process.

Direct local-to-production WEB apply remains prohibited.

## Risks

### Environment Risk

The proposed staging URLs do not currently exist in repository documentation or configuration.

Mitigation:

- Treat this document as infrastructure setup guidance only.
- Verify DNS, hosting, TLS, and WordPress/API availability before apply review.

### Data Risk

Staging may be seeded from production-like data but must remain isolated from production.

Mitigation:

- Confirm DB host/name before any dry-run/apply.
- Capture pre/post counts.
- Use full DB backup as rollback baseline.

### Deployment Risk

Frontend and backend may be deployed by different systems.

Mitigation:

- Record frontend commit/tag, backend plugin commit/tag, plugin version, and API URL in the staging apply report.

### Rollback Risk

Rollback is not safe unless backup and restore are tested or at least command-verified before apply.

Mitigation:

- Require backup verification and rollback owner before staging apply.

## Non-Actions

This specification does not:

- create DNS records.
- create Vercel environments.
- create WordPress staging.
- create a staging database.
- run staging apply.
- run production apply.
- run import.
- write to any database.
- change schema.
- add migrations.
- change backend runtime code.
- change frontend runtime code.

## Final Recommendation

```txt
Ready For Infrastructure Setup Review
```

The project now has a proposed staging specification that can be reviewed for infrastructure setup. It is not ready for staging apply until the staging environment is actually provisioned, documented, backed up, dry-run validated, and separately approved.
