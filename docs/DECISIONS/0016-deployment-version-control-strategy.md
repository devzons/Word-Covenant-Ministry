# ADR-0016 Deployment Version-Control Strategy

## Status

Accepted

## Date

2026-06-21

## Context

Word Covenant Ministry now has coordinated frontend code, WordPress plugin code, custom database schema managed by `SchemaInstaller`, and reviewed original-language seed data migrations.

The project needs a formal release strategy so code releases, plugin versions, schema migrations, and seed data migrations can move safely from local development to staging and production.

Deployment must preserve the Local WP-backed repository structure, avoid ad hoc production SQL, and keep seed imports reviewable, repeatable, and rollback-ready.

## Decision

WCM releases will use annotated semantic Git tags as the release anchor.

Examples:

```txt
v0.9.0-beta.1
v0.9.0-beta.2
v0.8.6
v0.8.7
```

Patch tags such as `v0.8.7` are reserved for emergency fixes after a prior release such as `v0.8.6`.

The `wcm-core.php` plugin header version must match the backend plugin release version. The plugin version and Git release tag must move together. If the frontend and backend are deployed as part of the same product release, release notes must record the frontend commit, backend plugin version, and Git tag.

Schema changes remain managed by `SchemaInstaller` and its `db_version` concept. The live WordPress database must store the applied schema version in an option such as:

```txt
wcm_core_db_version
```

Every schema change must increment `db_version`. Schema migrations should be additive and idempotent when possible. A deployment must run schema validation before runtime code depends on new columns, tables, or indexes.

Reviewed seed data migrations must be versioned separately from code and schema. Stable seed IDs should be used for each reviewed set.

Current examples:

```txt
phase8f-transliteration-push
phase8f-gloss-60
phase8f-gloss-60-policy
```

Future seed ID format:

```txt
seed.original_language.gloss_ko.2026-06-21.001
```

Each seed set must record:

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

A future migration tracking table should record live seed application state:

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

Future row-level rollback support should use either a `wcm_seed_migration_rows` table or a generated backup file before apply. Row-level tracking should preserve enough prior value data to restore affected rows when a reviewed seed import must be rolled back.

Deployment promotion order is:

```txt
Local -> Staging -> Production
```

Production deployment checklist:

1. Backup database and deployment artifact state.
2. Deploy the same annotated Git tag that passed staging.
3. Run `composer install` or equivalent dependency installation for the plugin release.
4. Validate `SchemaInstaller` and current `db_version`.
5. Run seed dry-run for every approved seed set.
6. Apply seed sets only after dry-run validates the expected count and checksum.
7. Run API smoke tests.
8. Record release tag, plugin version, schema version, seed sets, checksums, and validation output in release notes.

Rollback policy:

- Code rollback uses the previous Git tag and matching plugin version.
- Schema rollback requires an explicit migration plan. Destructive schema rollback is not automatic.
- Seed rollback uses a pre-apply database backup or stored prior row values from row-level seed tracking.

## Consequences

Releases become reproducible because code, schema version, and seed sets have separate but linked version identifiers.

Production operators can tell which seed sets were applied by inspecting `wcm_seed_migrations` once that future tracking table is implemented.

Seed imports must remain dry-run first and must validate expected counts, target identity, and existing values before apply.

Emergency code rollback remains simple through Git tags, but schema and seed rollback require pre-planned data recovery.

This decision documents the strategy only. It does not create migration tables, change runtime behavior, add PHP code, or modify deployment automation.

## Alternatives Considered

Use Git commits without release tags: rejected because production releases need stable, human-readable identifiers.

Use only plugin version without Git tags: rejected because frontend, docs, and seed tooling also need release traceability.

Track seed migrations only in commit history: rejected because the live database needs to know which seed sets were applied.

Allow production SQL by hand: rejected because WCM seed and schema changes must remain reviewable, dry-run validated, and repeatable.
