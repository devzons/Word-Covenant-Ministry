# Cross Reference Local Import Readiness Review V2

Date: 2026-06-22

## Purpose

This document records CR-22 Cross Reference Local Import Readiness Review after the approved additive schema implementation for `wcm_cross_references`.

This is a review phase only. It does not perform or authorize import execution, database writes, relationship inserts, API implementation, frontend changes, backend runtime changes, staging apply, or production apply.

## Current Phase

Phase CR-22 - Cross Reference Local Import Readiness Review.

Current state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
schema implemented: yes
db_version: 1.5.0
wcm_cross_references exists: yes
cross_reference_rows: 0
package_relationships: 341176
```

## Non-Actions

This review does not perform or authorize:

- import
- database write
- relationship insert
- API implementation
- frontend change
- backend runtime change
- staging apply
- production apply

## Schema Readiness Audit

Verdict:

```txt
complete
```

Validated local schema state:

```txt
wcm_core_db_version: 1.5.0
table: wp_wcm_cross_references
row_count: 0
```

Validated indexes:

```txt
PRIMARY
relationship_identity_hash (unique)
source_lookup
target_lookup
relationship_type_lookup
source_dataset_lookup
review_status_lookup
package_lookup
```

Findings:

- The dedicated `wp_wcm_cross_references` table exists.
- The table is reference-only and does not store Bible text.
- The unique `relationship_identity_hash` key exists for duplicate prevention.
- Source, target, relationship type, source dataset, review status, and package lookup indexes exist.
- The table is empty, confirming that schema implementation did not import package data.

## Package Readiness Audit

Verdict:

```txt
complete
```

Package metadata:

```txt
package_path: /private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/
package_id: cross_reference.openbible.normalized.2026-06-22.001
source_name: OpenBible.info Cross References
source_url: https://a.openbible.info/data/cross-references.zip
source_checksum: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
package_checksum: b17aa57c60fcbf775e6044471643d624c34a9d16a302dc0361d7e52d64f4da92
relationship_count: 341176
rejected_count: 116
held_count: 3507
duplicates_removed: 0
ranges_normalized: 87418
license: Creative Commons Attribution
attribution: www.openbible.info CC-BY 2026-06-22
relationship_type: theme
source_dataset: openbible
```

Package files:

```txt
manifest.json
cross_references.jsonl
checksum.sha256
generation-report.json
dry-run-report.json
```

Findings:

- Manifest exists and records package/source metadata.
- Package checksum exists and was validated during CR-12 dry run.
- Generation report exists.
- Dry-run report exists.
- The package remains outside Git under `/private/tmp`.
- Package records are reference-only and do not contain Bible text.

## Dry Run Readiness Audit

Verdict:

```txt
complete
```

Dry-run result:

```txt
dry_run_status: dry_run_passed
rows_read: 341176
rows_valid: 341176
duplicate_relationships: 0
invalid_references: 0
unsupported_relationship_types: 0
missing_metadata: 0
checksum_status: valid
license_status: present
attribution_status: present
blocking_errors: 0
db_write_performed: false
import_performed: false
```

Findings:

- Package checksum validation passed.
- Manifest validation passed.
- JSONL row validation passed.
- Canonical reference validation passed.
- Relationship type validation passed.
- Duplicate identity validation passed.
- Metadata, license, and attribution validation passed.
- No database write was performed during dry run.

## Import Strategy Audit

Verdict:

```txt
ready with required controls
```

Required import strategy for a future local import:

- Import must be local-only.
- Import must stream `cross_references.jsonl` line by line.
- Import must not load the full 171 MB package into memory.
- Import must use bounded batch inserts.
- Import must require explicit `--apply`; default mode must be dry-run.
- Import must verify package checksum immediately before apply.
- Import must validate manifest metadata before apply.
- Import must compute or verify deterministic `relationship_identity_hash` for each row.
- Import must use `relationship_identity_hash` for idempotency.
- Existing matching identities must be skipped or matched, not duplicated.
- Import report must record rows read, inserted, skipped, duplicated, rejected, failed batches, runtime, memory usage, package ID, source checksum, and package checksum.

Recommended initial local import controls:

```txt
batch_size: 500-1000
memory_policy: streaming only
retry_policy: rerun should be idempotent
failure_policy: stop on blocking validation errors
```

## Rollback Audit

Verdict:

```txt
ready with conditions
```

Known local backup path from CR-21 schema implementation:

```txt
/private/tmp/wcm_cr21_pre_schema.sql
```

Required backup before any future import:

- Create a fresh local DB backup immediately before import.
- Record the backup path in the import report.
- Verify that the backup file exists and is non-empty.
- Do not rely only on the CR-21 pre-schema backup for package import rollback.

Required rollback procedure:

```txt
wp --path=/Users/donmini/Local\ Sites/wordcovenantministry/backend/app/public db import {backup_path}
```

WEB-only or KRV-only rollback is not appropriate for this phase because the cross-reference import targets a dedicated table. Primary rollback should be full local DB restore from the immediate pre-import backup.

Optional local-only emergency cleanup after explicit approval:

```txt
DELETE FROM wp_wcm_cross_references
WHERE package_id = 'cross_reference.openbible.normalized.2026-06-22.001';
```

This package-scoped cleanup should not replace the full backup/restore plan and should not be used for staging or production without separate approval.

## Scale Audit

Package scale:

```txt
source rows: 344799
generated relationships: 341176
package size: approximately 171 MB
ranges normalized: 87418
held rows: 3507
rejected rows: 116
```

Scale findings:

- 341,176 rows is suitable for a dedicated indexed table, not frontend static payloads.
- Import must be streaming and batch-oriented.
- `relationship_identity_hash` unique enforcement is required for replay safety.
- Future APIs must be bounded and paginated.
- Reader lookups should use source indexes and should not return unbounded results.
- Broad discovery endpoints must require limits and pagination before runtime exposure.

Expected local import risk:

```txt
medium
```

Reason:

- Data volume is significant but within normal local database import scale if streamed and batched.
- Unique identity and baseline indexes are already in place.
- Runtime API/UI exposure is not part of the import phase.

## Data Integrity Audit

Verdict:

```txt
complete
```

Validated local counts:

```txt
KRV verses: 31102
WEB verses: 31096
original_terms: 16891
original_occurrences: 673263
cross_reference_rows: 0
```

Findings:

- Bible data remains unchanged.
- WEB data remains unchanged.
- Original Language terms remain unchanged.
- Original Language occurrences remain unchanged.
- Cross Reference schema exists but contains no relationship rows.

## Future Integration Readiness

Future integration targets:

- Bible Reader research panel.
- Word Study surfaces.
- Gospel Harmony surfaces.

Readiness findings:

- Storage is ready for future local import review.
- API design is still required before runtime exposure.
- Reader integration must remain bounded by current verse/range.
- Word Study integration needs a curated bridge between references and original-language terms; OpenBible rows alone do not provide original-language term links.
- Gospel Harmony integration should use only relationship types that are source-backed or WCM-curated; generic OpenBible `theme` rows should not be presented as parallel event data.

## Risk Review

### Import Risk

Risk level:

```txt
medium
```

Mitigation:

- Dry-run first.
- Verify checksum before apply.
- Stream JSONL line by line.
- Batch inserts.
- Enforce unique identity.
- Produce an import report.

### Rollback Risk

Risk level:

```txt
medium
```

Mitigation:

- Create a fresh pre-import DB backup.
- Verify backup before import.
- Prefer full DB restore for rollback.
- Keep package-scoped deletion as local-only fallback after explicit approval.

### Performance Risk

Risk level:

```txt
medium
```

Mitigation:

- Keep import local-only.
- Use batch sizes that can be reduced if memory/runtime issues appear.
- Keep API/runtime exposure for a later phase.
- Add API-specific indexes later if profiling requires them.

### Future API Risk

Risk level:

```txt
medium
```

Mitigation:

- Do not expose unbounded endpoints.
- Require pagination and hard limits.
- Use source lookup indexes.
- Avoid returning Bible text from cross-reference records.
- Treat `source_score` as ordering metadata, not theological certainty.

## Final Verdict

```txt
Ready For Local Import Approval
```

## Next Objective

CR-23 - Cross Reference Local Import Approval.

CR-23 must explicitly approve or reject local import execution. Until then, no import, relationship insert, API implementation, frontend change, staging apply, or production apply is authorized.
