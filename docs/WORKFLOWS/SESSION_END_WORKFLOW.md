# Session End Workflow

## Purpose

This workflow defines the required end-of-session operating routine for Word Covenant Ministry so documentation, code, generated artifacts, and data-related files are classified before any commit or push decision.

## Scope

Use this workflow when the trigger phrase is:

```txt
Word Covenant Ministry 작업 종료
```

The standard local command is:

```bash
scripts/wcm-session-end.sh
```

When the user says `Word Covenant Ministry 작업 종료`, the agent should read this workflow and run `scripts/wcm-session-end.sh` or provide that command if direct execution is not possible.

## Core Principles

- End the session with a verified Git view.
- Large generated artifacts must not slip into Git.
- Database-related outputs must be classified before commit discussion.
- Commit and push remain forbidden until explicit approval.

## Required End Sequence

### 1. Inspect Full Working Tree

Run:

```bash
git status --short --ignored
```

For the standard local routine, prefer:

```bash
scripts/wcm-session-end.sh
```

Confirm:

- tracked changes
- untracked changes
- ignored generated files
- whether unexpected local artifacts appeared during the session

### 2. Check Patch Cleanliness

Run:

```bash
git diff --check
```

Confirm:

- no trailing whitespace issues
- no malformed patch hunks
- no accidental conflict markers

### 3. Check OS and Local Artifacts

Confirm whether any of these are visible in Git status:

- `.DS_Store`
- SQL dumps
- ZIP packages
- JSONL exports
- generated manifests or checksum files
- backup folders

These files must be classified before closing the session.

### 4. Verify Generated Package Ignore State

Confirm the repository still ignores generated package paths such as:

```txt
docs/data-packages/**/generated/
docs/data-packages/**/*.jsonl
docs/data-packages/**/*.zip
docs/data-packages/**/*.sha256.generated
```

If generated artifacts are visible in Git unexpectedly, stop and fix the classification before any commit discussion.

### 5. Check DB Count Snapshot

Use:

```bash
scripts/wcm-db-status.sh
```

Reconfirm row counts for the relevant tables when the session affected data planning, migration planning, or import workflow documentation:

```txt
wp_wcm_bible_books
wp_wcm_bible_versions
wp_wcm_bible_verses
wp_wcm_original_terms
wp_wcm_original_word_occurrences
```

The purpose is to confirm whether the session stayed documentation-only or whether the database state changed unexpectedly.

### 6. Classify Changed Files

Classify every changed or visible artifact into:

```txt
commit 가능
commit 금지
ignored
```

Guidance:

- `commit 가능`: approved source or documentation files only
- `commit 금지`: SQL, ZIP, JSONL, generated backups, runtime files, secrets, DB dumps
- `ignored`: generated temp artifacts that correctly remain outside Git

### 7. Decide Whether Data Package Export or ZIP Is Needed

Evaluate whether the session created a need for:

- Data Package export
- Data Package verify
- package ZIP creation
- no package action

Typical rule:

- documentation-only session: usually no export or ZIP needed
- reviewed data-state handoff session: package action may be needed later, with explicit approval

Use:

```bash
scripts/wcm-data-package-status.sh
```

### 8. Hold Commit and Push

Even after classification:

- do not commit without approval
- do not push without approval

## Final Session Report

Report:

- Git status summary
- diff check result
- `.DS_Store` or generated artifact findings
- DB count snapshot
- changed file classification
- whether Data Package export or ZIP is needed
- confirmation that commit and push were not performed

## Notes

- Generated package files are operational artifacts, not normal source files.
- DB-related files must stay outside the public project tree.
- Backups and package archives belong outside the repository, typically under `~/WCM-Backups/` and `~/WCM-Data-Packages/`.
