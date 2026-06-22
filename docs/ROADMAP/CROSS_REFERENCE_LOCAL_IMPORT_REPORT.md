# Cross Reference Local Import Report

Date: 2026-06-22

## Purpose

This document records CR-24 Cross Reference Local Import for the normalized OpenBible.info Cross Reference package.

This phase performed a local-only import into the approved dedicated `wp_wcm_cross_references` table. It did not implement APIs, change frontend behavior, integrate Reader/Word Study/Gospel Harmony, apply staging changes, or apply production changes.

## Current Phase

Phase CR-24 - Cross Reference Local Import.

## Non-Actions

This local import did not perform:

- production change
- staging change
- API implementation
- frontend change
- Reader integration
- Word Study integration
- Gospel Harmony integration
- Bible table changes
- Original Language table changes
- Bible text storage in cross-reference rows

## Package Metadata

```txt
package_path: /private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/
package_id: cross_reference.openbible.normalized.2026-06-22.001
source_name: OpenBible.info Cross References
source_url: https://a.openbible.info/data/cross-references.zip
source_checksum: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
package_checksum: b17aa57c60fcbf775e6044471643d624c34a9d16a302dc0361d7e52d64f4da92
license: Creative Commons Attribution
attribution: www.openbible.info CC-BY 2026-06-22
relationship_type: theme
source_dataset: openbible
review_status: unreviewed
```

Package files:

```txt
manifest.json
cross_references.jsonl
checksum.sha256
generation-report.json
dry-run-report.json
```

Checksum validation:

```txt
manifest.json: valid
cross_references.jsonl: valid
generation-report.json: valid
```

## Backup

Fresh local DB backup was created before import.

```txt
backup_path: /private/tmp/wcm_cr24_pre_cross_reference_import.sql
backup_size_bytes: 238552824
backup_size_display: 228M
```

## Rollback Information

Primary rollback procedure:

```bash
MYSQL_UNIX_PORT="/Users/donmini/Library/Application Support/Local/run/PsSc-gQtJ/mysql/mysqld.sock" \
wp --path=/Users/donmini/Local\ Sites/wordcovenantministry/backend/app/public \
db import /private/tmp/wcm_cr24_pre_cross_reference_import.sql
```

Rollback policy:

- Prefer full local DB restore from the fresh pre-import backup.
- Do not use staging or production rollback in this phase.
- Do not alter Bible or Original Language tables manually.
- A package-scoped cleanup may be considered only as a local emergency fallback after explicit approval:

```sql
DELETE FROM wp_wcm_cross_references
WHERE package_id = 'cross_reference.openbible.normalized.2026-06-22.001';
```

The package-scoped cleanup is not a substitute for the backup/restore rollback plan.

## Import Execution

Import method:

```txt
local-only temporary importer
script_path: /private/tmp/wcm_cr24_import_cross_references.php
target_table: wp_wcm_cross_references
mode: apply
batch_size: 750
streaming_jsonl: yes
idempotent_identity: relationship_identity_hash
```

The importer mapped package fields into the schema as follows:

```txt
source_chapter -> source_start_chapter
source_verse -> source_start_verse
target_start_chapter -> target_start_chapter
target_start_verse -> target_start_verse
target_end_chapter -> target_end_chapter
target_end_verse -> target_end_verse
```

`relationship_identity_hash` was generated from the canonical source reference, target reference/range, relationship type, and source dataset.

## Dry Run Result

The import script was run first without `--apply`.

```txt
mode: dry_run
rows_read: 341176
rows_valid: 341176
rows_imported: 0
rows_skipped: 0
duplicates: 0
rows_rejected: 0
db_write_performed: false
runtime_seconds: 1.2723
peak_memory_bytes: 2097152
```

Dry run result:

```txt
passed
```

## Apply Result

```txt
mode: apply
rows_read: 341176
rows_valid: 341176
rows_imported: 341176
rows_skipped: 0
duplicates: 0
rows_rejected: 0
batch_size: 750
runtime_seconds: 14.3028
peak_memory_bytes: 4194304
db_write_performed: true
target_table: wp_wcm_cross_references
```

Import result:

```txt
passed
```

## Existing Data Integrity

Post-import validation:

```txt
KRV verses: 31102
WEB verses: 31096
original_terms: 16891
original_occurrences: 673263
wcm_core_db_version: 1.5.0
```

Findings:

- KRV verse count remained unchanged.
- WEB verse count remained unchanged.
- Original Language term count remained unchanged.
- Original Language occurrence count remained unchanged.
- Import wrote only to `wp_wcm_cross_references`.

## Cross Reference Statistics

```txt
total_rows: 341176
duplicate_identities: 0
```

Source dataset distribution:

```txt
openbible: 341176
```

Review status distribution:

```txt
unreviewed: 341176
```

Relationship type distribution:

```txt
theme: 341176
```

Package metadata distribution:

```txt
package_id: cross_reference.openbible.normalized.2026-06-22.001
source_checksum: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
rows: 341176
```

## Sample Lookups

Genesis 1:1 sample, ordered by source score:

```txt
genesis 1:1 -> john 1:1 | theme | 369
genesis 1:1 -> hebrews 11:3 | theme | 270
genesis 1:1 -> isaiah 45:18 | theme | 244
genesis 1:1 -> revelation 4:11 | theme | 201
genesis 1:1 -> hebrews 1:10 | theme | 186
```

John 3:16 sample, ordered by source score:

```txt
john 3:16 -> romans 5:8 | theme | 974
john 3:16 -> 1-john 4:9 | theme | 690
john 3:16 -> romans 8:32 | theme | 503
john 3:16 -> john 3:15 | theme | 494
john 3:16 -> john 11:25 | theme | 448
```

## Validation Results

Commands/checks completed:

```txt
php -l /private/tmp/wcm_cr24_import_cross_references.php
dry-run import script
apply import script
WP-CLI row count checks
WP-CLI duplicate identity check
WP-CLI source_dataset distribution
WP-CLI review_status distribution
WP-CLI relationship_type distribution
WP-CLI package metadata distribution
WP-CLI existing data count checks
git diff --check
git status --short
```

Validation status:

```txt
passed
```

## Final Verdict

```txt
import_passed
```

## Next Objective

CR-25 - Cross Reference Import Validation.

CR-25 should validate the imported data further before any API implementation, frontend integration, staging apply, or production apply is considered.
