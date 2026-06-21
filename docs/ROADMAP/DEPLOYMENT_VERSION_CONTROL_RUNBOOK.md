# Deployment Version-Control Runbook

## Date

2026-06-21

## Status

Operational planning document. No implementation is created by this runbook.

## Purpose

This runbook defines how Word Covenant Ministry should release code, validate schema migrations, apply reviewed seed data migrations, promote changes from local to staging to production, and roll back safely.

The strategy is governed by:

```txt
docs/DECISIONS/0016-deployment-version-control-strategy.md
```

## Release Identifiers

Use annotated semantic Git tags for code releases:

```txt
v0.9.0-beta.1
v0.9.0-beta.2
v0.8.6
v0.8.7
```

Rules:

- Tags must be created only after validation passes on `main`.
- Patch tags such as `v0.8.7` are used for emergency fixes after a previous release such as `v0.8.6`.
- The `wcm-core.php` plugin header version should match the backend plugin release version.
- The plugin version and Git tag should move together.
- Release notes should record frontend commit, backend plugin version, schema `db_version`, seed sets, and validation results.

## Schema Migration Policy

WCM uses `SchemaInstaller` and a stored database version option such as:

```txt
wcm_core_db_version
```

Rules:

- Every schema change increments `db_version`.
- Schema migrations must be additive and idempotent when possible.
- Runtime code must not depend on a new schema until schema validation passes.
- Destructive schema changes require an explicit migration and rollback plan before implementation.

## Seed Set Versioning

Reviewed seed data migrations are versioned separately from code and schema.

Stable seed IDs may use current phase names:

```txt
phase8f-transliteration-push
phase8f-gloss-60
phase8f-gloss-60-policy
```

Future seed ID format:

```txt
seed.original_language.gloss_ko.2026-06-21.001
```

Each seed set should record:

```txt
seed_set
version
checksum
target_table
target_field
expected_count
applied_count
policy_notes
```

Seed tools must dry-run first. Apply is allowed only when expected count, target identity, checksum, and overwrite rules pass.

## Future Seed Migration Tracking

A future live database table should track applied seed migrations:

```txt
wcm_seed_migrations
```

Proposed fields:

```txt
id
seed_set
version
checksum
target_table
target_field
expected_count
applied_count
status
applied_at
applied_by
git_commit
notes
```

Allowed status values:

```txt
dry_run_passed
applied
rolled_back
failed
```

Future row-level rollback should use either:

```txt
wcm_seed_migration_rows
```

or a generated backup file before apply.

The row-level rollback record must preserve previous values for every updated row.

## Local Workflow

1. Confirm worktree state:

```bash
git status
git diff --check
```

2. Run code validation appropriate to changed files.
3. Run schema validation if `SchemaInstaller` changed.
4. Run seed dry-run for every changed seed set.
5. Apply seed sets only in local after dry-run validates exact expected counts.
6. Run API smoke tests against Local WP or internal WordPress REST dispatch.
7. Record seed counts, coverage, and held rows in the task report.

## Staging Workflow

1. Deploy the same Git commit or release tag intended for production.
2. Restore or sync a production-like database snapshot.
3. Run dependency installation for the plugin release:

```bash
composer install
```

4. Validate schema version and run schema migration if needed.
5. Run seed dry-run.
6. Apply seed sets only if dry-run output matches local.
7. Run API smoke tests and critical frontend route smoke tests.
8. Confirm release notes include tag, plugin version, `db_version`, seed sets, checksums, and validation output.

## Production Checklist

Before production:

- Confirm approved release tag.
- Confirm plugin version matches backend release version.
- Confirm staging passed with the same tag and same seed-set checksum.
- Confirm database backup is restorable.
- Confirm rollback owner and rollback window.

Production steps:

1. Put deployment in the approved maintenance window if needed.
2. Backup production database.
3. Deploy the same annotated Git tag that passed staging.
4. Run plugin dependency installation:

```bash
composer install
```

5. Validate `SchemaInstaller` and current `wcm_core_db_version`.
6. Run seed dry-run for each approved seed set.
7. Apply seed sets only after dry-run validates expected count and checksum.
8. Run API smoke tests.
9. Run critical frontend smoke tests.
10. Record release evidence.

Minimum API smoke checks:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1/1
/wp-json/wcm/v1/interlinear/STEP_TAHOT/genesis/1/1
/wp-json/wcm/v1/interlinear/STEP_TAGNT/matthew/1/1
/wp-json/wcm/v1/word-study/strongs/H430
/wp-json/wcm/v1/word-study/strongs/G2316
```

## Rollback Workflow

Code rollback:

- Redeploy the previous Git tag.
- Confirm the plugin version matches the rollback tag.
- Run smoke tests.

Schema rollback:

- Do not assume automatic rollback.
- Use the explicit rollback migration plan approved for that schema change.
- Prefer additive migrations so older code can tolerate newer columns when possible.

Seed rollback:

- Prefer restoring the pre-apply database backup.
- If row-level rollback tracking exists, restore previous values from `wcm_seed_migration_rows`.
- If only a backup file exists, restore affected rows from the generated backup file.
- Mark the seed migration as `rolled_back` once tracking exists.

## Release Evidence

Every production release should retain:

- Git tag.
- Commit hash.
- Plugin version.
- Frontend build identifier if applicable.
- Schema `db_version`.
- Seed set IDs.
- Seed set checksums.
- Dry-run output.
- Apply output.
- API smoke test results.
- Rollback notes.

## Boundaries

This runbook does not implement:

- PHP deployment automation.
- WordPress admin UI.
- Schema migration tables.
- Seed migration tracking tables.
- Runtime behavior changes.

Future implementation requires explicit approval.
