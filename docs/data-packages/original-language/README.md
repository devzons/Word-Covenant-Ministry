# Original Language Data Package

This directory documents the official Word Covenant Ministry Data Package format for restoring original-language terms and word occurrences across Local/Flywheel environments.

Full generated package files are not committed to Git. Store generated packages under an ignored path such as:

```txt
docs/data-packages/original-language/generated/
storage/exports/original-language/
storage/imports/original-language/
```

Committed files in this directory are examples only:

```txt
manifest.example.json
sample-original-terms.jsonl
sample-original-word-occurrences.jsonl
```

## Package Files

A generated package contains:

```txt
manifest.json
original-terms.jsonl
original-word-occurrences.jsonl
checksums.sha256
```

The package is JSONL-based. SQL dumps are not part of the official package format.

## Tooling

Run from the plugin directory:

```bash
cd backend/app/public/wp-content/plugins/wcm-core

php tools/export-original-language-package.php --output=../../../../../../docs/data-packages/original-language/generated
php tools/verify-original-language-package.php --package=../../../../../../docs/data-packages/original-language/generated
php tools/import-original-language-package.php --package=../../../../../../docs/data-packages/original-language/generated
```

The importer defaults to dry-run. Database writes require explicit `--apply`.

Do not run `--apply` against production. Production import requires a separately approved deployment and rollback plan.

## Safety Rules

- Use `term_identity_hash` as the cross-environment term restore key.
- Preserve reviewed `transliteration_ko` and `gloss_ko` values.
- Do not overwrite reviewed Korean fields with conflicting package values.
- Verify checksums before import.
- Verify `expected_count` before import.
- Verify duplicate `term_identity_hash` and occurrence identity before import.
- Keep generated package files out of Git.

