# Cross Reference Local Import Approval Review

Date: 2026-06-22

## Purpose

This document records CR-13 Cross Reference Local Import Approval Review for the normalized OpenBible.info Cross Reference package.

This is an approval review only. It does not perform or authorize import execution, database writes, schema changes, migrations, API implementation, backend runtime changes, frontend runtime changes, staging apply, or production apply.

## Current Phase

Phase CR-13 - Cross Reference Local Import Approval Review.

Completed prior phases:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.
- CR-4 Dry Run Specification completed.
- CR-5 Local Import Readiness Review completed.
- CR-6 Source Acquisition Review completed.
- CR-8 OpenBible source acquisition completed.
- CR-9 Normalization Plan completed.
- CR-10 Package Creation Specification completed.
- CR-11 Package Creation completed.
- CR-12 Dry Run Execution completed with `dry_run_passed`.

## Non-Actions

This review does not perform or authorize:

- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Source Audit

Verdict:

```txt
complete
```

Source metadata:

```txt
source_name: OpenBible.info Cross References
source_url: https://a.openbible.info/data/cross-references.zip
source_page_url: https://www.openbible.info/labs/cross-references/
source_checksum: 676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
license: Creative Commons Attribution
attribution: www.openbible.info CC-BY 2026-06-22
raw_source_path: /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
```

Findings:

- Source URL is recorded.
- Source checksum is recorded.
- License is recorded as Creative Commons Attribution.
- Attribution is recorded from the acquired source package/header.
- Provenance is recorded as OpenBible.info Cross References.
- Raw source remains outside Git.
- No Bible text was acquired for import.

## Package Audit

Verdict:

```txt
complete
```

Package metadata:

```txt
package_path: /private/tmp/wcm-cross-reference-package/openbible-normalized-2026-06-22/
package_id: cross_reference.openbible.normalized.2026-06-22.001
package_checksum: b17aa57c60fcbf775e6044471643d624c34a9d16a302dc0361d7e52d64f4da92
relationship_count: 341176
rejected_count: 116
held_count: 3507
duplicates_removed: 0
ranges_normalized: 87418
records_file: cross_references.jsonl
records_file_size: approximately 171 MB
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

- Manifest exists.
- Package checksum is recorded.
- Generation report exists.
- Package is reference-only.
- Relationship type is normalized as `theme`.
- Source dataset is preserved as `openbible`.
- OpenBible score is preserved as `source_score`.
- Review status is preserved as `unreviewed`.
- Package remains outside Git.

## Dry Run Audit

Verdict:

```txt
complete
```

Dry-run result:

```txt
dry_run_status: dry_run_passed
rows_read: 341176
rows_valid: 341176
rows_rejected: 116
rows_held: 3507
duplicate_relationships: 0
invalid_references: 0
unsupported_relationship_types: 0
missing_metadata: 0
checksum_status: valid
license_status: present
attribution_status: present
blocking_errors: 0
```

Findings:

- Manifest validation passed.
- Checksum validation passed.
- JSONL row validation passed.
- Canonical reference validation passed.
- Relationship type validation passed.
- Duplicate relationship validation passed.
- Metadata/license/attribution validation passed.
- Bible text storage validation passed.
- No database write was performed.

## Import Safety Review

Verdict:

```txt
ready with required local-only controls
```

Required controls before any future local import:

- Explicit approval for CR-14 must be granted before import.
- Import must be local-only.
- Full local database backup must be created before import.
- Backup path must be recorded in the import report.
- Backup restore command and restore procedure must be documented before import.
- Rollback plan must be reviewed before import.
- Import tool must support dry-run before apply.
- Apply must require an explicit `--apply` or equivalent flag.
- Package checksum must be reverified immediately before apply.
- Import must preserve source metadata, license, attribution, package ID, and checksum.
- Import must not write Bible text into cross-reference records.
- Staging and production apply remain separately gated and unapproved.

Open item:

- Target storage implementation and exact local import command must be reviewed in the CR-14 approval step before any write action. This review approves readiness for the approval gate, not import execution.

## Scale Review

Relationship scale:

```txt
generated relationships: 341176
package size: approximately 171 MB
normalized ranges: 87418
held rows: 3507
rejected rows: 116
```

Impact considerations:

- Import should be batch-oriented.
- Import should avoid loading the full JSONL package into memory.
- Import should use stable duplicate identity checks.
- Import should use indexed lookup strategy if target tables are created in a future approved schema step.
- Import report should record rows read, inserted, skipped, duplicated, rejected, runtime, memory usage, and checksum.
- Reader/API integration should remain disabled until separate API approval.

Memory considerations:

- The package is large enough that streaming JSONL processing is required.
- Import tooling should process rows line-by-line.
- Future local import should avoid creating a frontend bundle or static runtime payload from this package.

## Future Integration Review

Future integration targets:

- Bible Reader right-side research panel.
- Word Study surfaces where a relationship type is `word_study` or later curated around original-language terms.
- Gospel Harmony surfaces where relationships are `parallel_event` or are derived from approved harmony units.

Integration boundaries:

- No runtime UI/API integration is authorized by this review.
- OpenBible-derived relationships use `theme` as a conservative source-backed default.
- More specific relationship types require future curated review or source-backed classification.
- Cross Reference records should store references and metadata only, not Bible text.

## Risk Review

### Data Risk

Risk level:

```txt
medium
```

Reasons:

- The package is large.
- OpenBible data is source-backed but not WCM-curated.
- Initial relationship type is generic `theme`.
- Held and rejected source rows require traceability but do not block the validated package.

Mitigation:

- Preserve source metadata.
- Preserve `source_score`.
- Keep `review_status = unreviewed`.
- Keep relationship type generic until curated review.

### Import Risk

Risk level:

```txt
medium
```

Reasons:

- Import would introduce hundreds of thousands of relationship records.
- Target storage and indexing must be explicitly approved.
- Import must be idempotent and batch-safe.

Mitigation:

- Require dry-run before apply.
- Require backup before apply.
- Require checksum verification before apply.
- Require duplicate identity validation.

### Rollback Risk

Risk level:

```txt
medium
```

Reasons:

- A full relationship import can affect many rows.
- Rollback depends on backup/restore unless future row-level migration tracking is implemented.

Mitigation:

- Require full local DB backup before import.
- Record backup path and restore command.
- Prefer local-only apply before any staging review.

### Performance Risk

Risk level:

```txt
medium
```

Reasons:

- 341,176 records can affect query performance if indexed poorly.
- Reader UI/API must avoid unbounded relationship responses.

Mitigation:

- Future schema must include lookup indexes by source reference and relationship type.
- Future API must paginate or cap response sizes.
- Future frontend must request only the current verse or range.

## Approval Gate

This review supports moving to the next approval gate only:

```txt
CR-14 - Cross Reference Local Import Approval
```

CR-14 must decide whether to approve a local-only import plan, including:

- target table/schema scope
- importer implementation scope
- backup path
- rollback method
- dry-run/apply command sequence
- post-import validation checklist
- confirmation that staging and production remain blocked

## Final Verdict

```txt
Ready For Local Import Approval
```

The source, package, and dry-run are complete enough to proceed to CR-14 approval review. This verdict does not authorize import execution.

## Next Objective

CR-14 - Cross Reference Local Import Approval.

No import may run until CR-14 explicitly approves the local-only import scope and safety controls.
