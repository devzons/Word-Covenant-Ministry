# Cross Reference Import Validation Report

Date: 2026-06-22

## Purpose

This document records CR-25 Cross Reference Import Validation after the CR-24 local-only import of the normalized OpenBible.info Cross Reference package.

This phase performs read-only validation only. It does not write to the database, rerun import, implement APIs, change frontend behavior, change backend runtime behavior, change schema, or add migrations.

## Current Phase

Phase CR-25 - Cross Reference Import Validation.

## Non-Actions

This validation did not perform:

- DB write
- import rerun
- API implementation
- frontend change
- backend runtime change
- schema change
- migration addition
- staging change
- production change

## Row Count Results

Expected package relationship count:

```txt
341176
```

Database row count:

```txt
total_rows: 341176
package_id: cross_reference.openbible.normalized.2026-06-22.001
package_row_count: 341176
```

Result:

```txt
passed
```

The package relationship count and database row count match.

## Duplicate Validation

Duplicate identity query:

```txt
duplicate_relationship_identity_hashes: 0
```

Result:

```txt
passed
```

No duplicate `relationship_identity_hash` values were found.

## Distribution Validation

Source dataset distribution:

```txt
openbible: 341176
```

Relationship type distribution:

```txt
theme: 341176
```

Review status distribution:

```txt
unreviewed: 341176
```

Result:

```txt
passed
```

All imported rows match the approved initial OpenBible import policy.

## Metadata Validation

Missing metadata counts:

```txt
missing_package_id: 0
missing_source_checksum: 0
missing_identity_hash: 0
missing_source_score: 0
```

Package metadata distribution:

```txt
package_id: cross_reference.openbible.normalized.2026-06-22.001
source_checksum: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
rows: 341176
```

Result:

```txt
passed
```

All rows contain package metadata, source checksum, identity hash, and source score.

## Reference Validation

Reference field validation:

```txt
empty_source_book: 0
empty_target_book: 0
non_positive_start_refs: 0
non_positive_end_refs: 0
```

Range validation:

```txt
invalid_source_end_ranges: 0
invalid_target_end_ranges: 0
```

Book slug validation:

```txt
unsupported_source_books: 0
unsupported_target_books: 0
```

Canonical start reference validation:

```txt
missing_source_start_refs: 0
missing_target_start_refs: 0
```

Canonical end reference validation:

```txt
missing_source_end_refs: 0
missing_target_end_refs: 0
```

Result:

```txt
passed
```

All sampled and aggregate reference validations passed against WCM canonical book slugs and KRV canonical verse references.

## Spot Checks

### Genesis 1:1 Source Lookup

Row count:

```txt
genesis_1_1_source_count: 61
```

Top sample rows by source score:

```txt
genesis 1:1 -> john 1:1-3 | theme | unreviewed | score 369
genesis 1:1 -> hebrews 11:3 | theme | unreviewed | score 270
genesis 1:1 -> isaiah 45:18 | theme | unreviewed | score 244
genesis 1:1 -> revelation 4:11 | theme | unreviewed | score 201
genesis 1:1 -> hebrews 1:10 | theme | unreviewed | score 186
```

Result:

```txt
passed
```

### John 3:16 Source Lookup

Row count:

```txt
john_3_16_source_count: 23
```

Top sample rows by source score:

```txt
john 3:16 -> romans 5:8 | theme | unreviewed | score 974
john 3:16 -> 1-john 4:9-10 | theme | unreviewed | score 690
john 3:16 -> romans 8:32 | theme | unreviewed | score 503
john 3:16 -> john 3:15 | theme | unreviewed | score 494
john 3:16 -> john 11:25-26 | theme | unreviewed | score 448
```

Result:

```txt
passed
```

### Romans 8:28 Source Lookup

Row count:

```txt
romans_8_28_source_count: 43
```

Top sample rows by source score:

```txt
romans 8:28 -> 1-peter 5:10 | theme | unreviewed | score 570
romans 8:28 -> james 1:12 | theme | unreviewed | score 460
romans 8:28 -> genesis 50:20 | theme | unreviewed | score 383
romans 8:28 -> romans 5:3-5 | theme | unreviewed | score 312
romans 8:28 -> 1-corinthians 2:9 | theme | unreviewed | score 265
```

Result:

```txt
passed
```

### John 3:16 Target Lookup

Row count:

```txt
john_3_16_target_count: 70
```

Top sample rows by source score:

```txt
romans 5:8 -> john 3:16 | theme | unreviewed | score 160
romans 8:32 -> john 3:16 | theme | unreviewed | score 77
1-john 4:9 -> john 3:16 | theme | unreviewed | score 51
1-corinthians 2:9 -> john 3:16 | theme | unreviewed | score 48
1-john 3:1 -> john 3:16 | theme | unreviewed | score 46
```

Result:

```txt
passed
```

## Existing Data Integrity

Existing data counts after CR-25 read-only validation:

```txt
KRV verses: 31102
WEB verses: 31096
Original terms: 16891
Original occurrences: 673263
```

Result:

```txt
passed
```

Bible and Original Language counts remain at the expected values.

## Validation Commands

Read-only checks included:

```txt
git status --short
git diff --check
WP-CLI row count validation
WP-CLI duplicate identity validation
WP-CLI distribution validation
WP-CLI metadata validation
WP-CLI reference integrity validation
WP-CLI spot checks
WP-CLI existing data integrity checks
```

## Final Verdict

```txt
validation_passed
```

## Next Objective

CR-26 - Cross Reference Reader Integration Design.

CR-26 should remain design-first. API implementation, frontend integration, backend runtime changes, staging apply, and production apply remain separate future approval gates.
