# Cross Reference Dry Run Report

Status: Completed
Date: 2026-06-22
Phase: CR-12 - Cross Reference Dry Run Execution

## Purpose

This report records the dry-run validation result for the normalized OpenBible.info Cross Reference package before any local import is considered.

This phase validates the package only. It does not import cross reference data, write to the database, change schema, add migrations, implement API behavior, or change frontend/backend runtime behavior.

## Package

- Package path: `/private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/`
- Package ID: `cross_reference.openbible.normalized.2026-06-22.001`
- Source: OpenBible.info Cross References
- Source URL: `https://a.openbible.info/data/cross-references.zip`
- Source checksum: `676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161`
- Package checksum: `b17aa57c60fcbf775e6044471643d624c34a9d16a302dc0361d7e52d64f4da92`
- License: Creative Commons Attribution
- Attribution: `www.openbible.info CC-BY 2026-06-22`

## Report Files

- Machine-readable dry-run report: `/private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/dry-run-report.json`
- Manifest: `/private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/manifest.json`
- Package rows: `/private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/cross_references.jsonl`
- Checksum file: `/private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/checksum.sha256`

Package outputs remain outside Git and are not import artifacts.

## Validation Summary

| Check | Result |
| --- | ---: |
| rows_read | 341,176 |
| rows_valid | 341,176 |
| rows_rejected | 116 |
| rows_held | 3,507 |
| duplicate_relationships | 0 |
| invalid_references | 0 |
| unsupported_relationship_types | 0 |
| missing_metadata | 0 |
| checksum_status | valid |
| license_status | present |
| attribution_status | present |
| blocking_errors | 0 |
| dry_run_status | dry_run_passed |

## Validation Details

- Manifest validation passed.
- `checksum.sha256` validation passed for `manifest.json`, `cross_references.jsonl`, and `generation-report.json`.
- JSONL row validation passed for all generated rows.
- Canonical reference validation passed against the WCM 66-book KRV reference set.
- Relationship type validation passed. The normalized OpenBible package uses `theme`.
- Duplicate identity validation passed. Identity is based on source reference, target reference/range, relationship type, and source dataset.
- Metadata validation passed. License and attribution are present.
- Bible text storage validation passed. JSONL records contain references only and do not include Bible text fields.

## Warnings

- 116 source rows were rejected during package generation and are not in the JSONL package.
- 3,507 source rows were held during package generation and are not in the JSONL package.
- The generated package is large and must remain outside Git.

These warnings are non-blocking because the generated package itself validates cleanly.

## Non-Actions

- No import was performed.
- No database write was performed.
- No schema change was made.
- No migration was added.
- No API implementation was added.
- No backend runtime behavior changed.
- No frontend runtime behavior changed.

## Final Verdict

`dry_run_passed`

The normalized OpenBible cross reference package is valid for the next review gate. Local import is still not approved by this report.

## Next Objective

CR-13 - Cross Reference Local Import Approval Review.

Before any import, the project must review backup, rollback, target schema/API scope, and local-only apply conditions.
