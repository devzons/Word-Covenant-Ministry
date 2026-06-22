# Staging Environment Discovery

## Date

2026-06-22

## Purpose

This document records the current repository-documented state of the Word Covenant Ministry staging environment.

This is an environment discovery document only. It does not run staging apply, production apply, imports, database writes, schema changes, migrations, backend runtime changes, or frontend runtime changes.

## Environment Found / Not Found

Final discovery result:

```txt
No Staging Environment Exists
```

Meaning:

```txt
No repository document or configuration file currently identifies a concrete staging frontend URL, staging WordPress URL, staging API URL, staging database, backup location, restore command, or deployment target.
```

The repository does document a required promotion model:

```txt
Local -> Staging -> Production
```

However, the current repository only defines local and production endpoints. Staging is documented as a required future gate, not as an existing configured environment.

## Discovery Inputs

Reviewed repository sources:

- `AGENTS.md`
- `docs/DEVELOPMENT_CONSTITUTION.md`
- `docs/PROJECT_ARCHITECTURE.md`
- `docs/ROADMAP/PROJECT_STATUS.md`
- `docs/ROADMAP/NEXT_TASKS.md`
- `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`
- `docs/ROADMAP/WEB_STAGING_READINESS_REVIEW.md`
- `docs/ROADMAP/WEB_STAGING_APPLY_APPROVAL_REVIEW.md`
- repository filesystem search for staging/deployment/environment references

Confirmed repository root:

```txt
/Users/donmini/Local Sites/wordcovenantministry
```

## Frontend

Confirmed frontend facts:

```txt
Frontend source: frontend/
Local frontend: http://wordcovenantministry.local:3030
Production frontend: https://wordcovenantministry.org
Frontend hosting strategy: Vercel
```

Staging frontend status:

```txt
not found
```

Missing staging frontend facts:

- Staging frontend URL.
- Staging Vercel project/environment name.
- Staging deployment branch or tag policy.
- Staging `NEXT_PUBLIC_API_URL`.
- Staging preview/production distinction.

## Backend

Confirmed backend facts:

```txt
Backend source: backend/
Active plugin source: backend/app/public/wp-content/plugins/wcm-core/
Local backend API: http://api.wordcovenantministry.local
Local REST base: http://api.wordcovenantministry.local/wp-json
Production API: https://api.wordcovenantministry.org
```

Staging backend status:

```txt
not found
```

Missing staging backend facts:

- Staging WordPress URL.
- Staging REST API base URL.
- Staging WCM API namespace URL.
- Staging plugin deployment path.
- Staging plugin version/tag deployment method.
- Staging WP-CLI context.

## Database

Confirmed database facts:

- Local WEB apply completed against the local development database.
- Local pre-apply backup was recorded in `WEB_LOCAL_APPLY_REPORT.md`.
- Staging and production apply remain unapproved.
- WEB staging readiness and approval reviews both require staging-specific backup and restore information before any apply.

Staging database status:

```txt
not found
```

Missing staging database facts:

- DB engine and version.
- DB host.
- DB name.
- DB user/privilege model.
- WP table prefix.
- Backup command.
- Backup destination.
- Restore command.
- Restore operator.
- Expected recovery time.

## Backup

Confirmed backup facts:

```txt
Local backup path: /private/tmp/wcm_web_pre_apply_20260622_132456.sql
Local backup size: 222M
Local backup scope: local database only
```

Staging backup status:

```txt
not found
```

Required before staging apply:

1. Staging DB backup command.
2. Staging backup storage location outside Git.
3. Backup verification command.
4. Backup file size and timestamp.
5. Rollback operator access confirmation.

## Restore

Confirmed restore facts:

```bash
wp db import /private/tmp/wcm_web_pre_apply_20260622_132456.sql --path=backend/app/public
```

This command is local-only and does not define staging restore.

Staging restore status:

```txt
not found
```

Required before staging apply:

1. Staging WordPress path.
2. Staging WP-CLI command context.
3. Staging restore command.
4. Rollback owner.
5. Expected recovery time.
6. Post-restore validation checklist.

## Deployment Flow

Documented target promotion flow:

```txt
Local -> Staging -> Production
```

Current actual state:

```txt
Local WEB apply: complete
Local QA: complete
Staging environment: not defined
Staging apply: not approved
Production apply: not approved
```

Required approval gates before staging apply:

1. Define staging frontend, backend, API, and database targets.
2. Confirm staging backup and restore capability.
3. Record rollback owner and expected recovery time.
4. Re-run WEB dry-run against the staging-bound source package.
5. Approve staging apply explicitly.
6. Apply only WEB version/book/verse data.
7. Validate WEB counts, approved omissions, duplicates, KRV preservation, and original-language preservation.
8. Run staging runtime QA before production review.

## Risks

### Environment Risk

No concrete staging URL, API URL, WordPress target, or database target is documented.

Impact:

```txt
The project cannot safely proceed to staging apply because there is no verified staging destination.
```

### Backup/Rollback Risk

No staging backup path, restore command, owner, or recovery time is documented.

Impact:

```txt
Rollback cannot be guaranteed for staging.
```

### Deployment Risk

The repository documents Vercel as frontend hosting and WordPress as backend, but does not identify a staging deployment method.

Impact:

```txt
Code/data promotion could diverge from the documented Local -> Staging -> Production model.
```

### Runtime Risk

Without a staging API URL and frontend URL, WEB reader/search/original-language regression QA cannot be run in staging.

Impact:

```txt
Production readiness cannot be evaluated from staging.
```

## Recommendations

Before requesting staging apply again, create or update documentation with:

1. Staging frontend URL.
2. Staging hosting platform/project/environment.
3. Staging deployment method.
4. Staging WordPress URL.
5. Staging REST API URL.
6. Staging plugin deployment path.
7. Staging DB engine and access method.
8. Staging backup command and destination.
9. Staging restore command.
10. Rollback owner and expected recovery time.
11. Staging WEB dry-run command/report location.
12. Staging smoke test checklist.

Recommended next document:

```txt
docs/ROADMAP/STAGING_ENVIRONMENT_SPEC.md
```

That future spec should be completed before any staging apply approval.

## Final Verdict

```txt
No Staging Environment Exists
```

This verdict means no concrete staging environment is discoverable from the current repository documentation or configuration files. It does not mean a staging environment cannot exist outside the repository; it means it is not currently documented and therefore cannot be used as an approved deployment target.

## Explicit Non-Actions

This discovery did not:

- run staging apply.
- run production apply.
- run import.
- write to any database.
- change schema.
- add migrations.
- change backend runtime code.
- change frontend runtime code.
- test a staging URL.
- infer undocumented staging credentials or targets.
