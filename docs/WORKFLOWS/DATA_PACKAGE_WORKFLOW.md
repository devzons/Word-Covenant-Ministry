# Data Package Workflow

## Purpose

This workflow defines the standard operating routine for the Word Covenant Ministry Original Language Data Package system.

## Scope

Use this workflow when the trigger phrase is:

```txt
Word Covenant Ministry Data Package
```

The standard status helper is:

```bash
scripts/wcm-data-package-status.sh
```

## Data Package Objective

The Original Language Data Package exists to move approved original-language data between environments without relying on a full SQL dump.

It is designed for:

- reviewed original-language dataset transport
- checksum-based verification
- expected-count validation
- dry-run-first import
- preservation of reviewed Korean presentation values

It is not:

- a frontend payload
- a Git-tracked large artifact
- a replacement for schema migration
- a substitute for a full WordPress DB backup

## Storage Policy

Generated package files must not be committed to Git.

The repository `generated/` area is temporary only and must remain ignored.

Package archives belong outside the repository:

```txt
/Users/donyu/WCM-Data-Packages/
/Users/donmini/WCM-Data-Packages/
```

Backups belong outside the repository:

```txt
~/WCM-Backups/
```

DB files must not be stored under the public project tree.

If `docs/data-packages/original-language/generated` is missing or incomplete, `scripts/wcm-data-package-status.sh` should report:

```txt
Data package not present; this is okay if DB is already populated
```

If the generated package is present, the same script should run the package verifier and report the result without running import or `--apply`.

If verifier execution fails because of PHP or Local/Flywheel DB connectivity, the script should still exit successfully and report the verifier failure reason for manual review.

## Generated Git Policy

Do not commit:

- `*.sql`
- `*.zip`
- `*.jsonl`
- generated manifests
- generated checksum files
- temporary export folders

Only documentation, examples, and small approved samples belong in Git.

## Standard Commands

Run from:

```bash
backend/app/public/wp-content/plugins/wcm-core/
```

### Export

```bash
php tools/export-original-language-package.php --output=../../../../../../docs/data-packages/original-language/generated
```

### Verify

```bash
php tools/verify-original-language-package.php --package=../../../../../../docs/data-packages/original-language/generated
```

### Import Dry-Run

```bash
php tools/import-original-language-package.php --package=../../../../../../docs/data-packages/original-language/generated
```

### Import Apply

```bash
php tools/import-original-language-package.php --package=../../../../../../docs/data-packages/original-language/generated --apply
```

`--apply` is a database write operation and must not be run by default.

## Required Validation Order

Always follow this order:

```txt
export -> verify -> import dry-run -> import --apply only if explicitly approved
```

## Required Checks

Before any apply decision, confirm:

- checksum is valid
- manifest exists
- `expected_count` matches
- duplicate detection passes
- term identity mapping is valid
- occurrence identity mapping is valid

Minimum validation focus:

```txt
checksum
expected_count
duplicate
```

## Korean Reviewed Field Protection

Reviewed values must be preserved.

Do not overwrite reviewed:

```txt
transliteration_ko
gloss_ko
```

If package input conflicts with already reviewed values, stop and review before apply.

## Full DB Dump vs Data Package

### Full DB Dump

- whole-environment backup or restore method
- includes broader WordPress state
- better for full environment recovery or first-site cloning

### Data Package

- selective original-language dataset movement method
- narrower operational surface
- easier checksum and expected-count verification
- preferred for reviewed original-language handoff across environments

## Package Archive Strategy

Preferred archive locations:

```txt
/Users/donyu/WCM-Data-Packages/
/Users/donmini/WCM-Data-Packages/
```

Recommended archive contents:

- package directory
- ZIP archive if needed for transfer
- manifest
- checksum file
- short release note or handoff note

## GitHub Storage Strategy

Do not commit large package artifacts to the repository.

Preferred retention strategy:

- GitHub Release attachment
- external storage repository or archive location
- local package archive outside the project

The Git repository should keep the specification and samples, not the generated bulk package.
