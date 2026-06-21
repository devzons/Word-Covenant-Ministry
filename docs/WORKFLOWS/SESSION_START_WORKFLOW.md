# Session Start Workflow

## Purpose

This workflow defines the required start-of-session operating routine for Word Covenant Ministry across home Local, work Local, and new Local/Flywheel environments.

No implementation, import, export, database write, or deployment work may begin until this workflow is completed and reported.

## Scope

Use this workflow when the trigger phrase is:

```txt
Word Covenant Ministry 작업 시작
```

## Core Principles

- Repository documentation is the source of truth.
- Git status must be inspected before any work.
- `git pull` is not automatic. Safety checks come first.
- Database state must be verified before any implementation decision.
- Data Package state must be verified before any data movement decision.
- Report first. Implementation after report only.

## Required Start Sequence

### 1. Inspect Git State

Run:

```bash
git status
```

Confirm:

- current branch
- modified files
- untracked files
- ignored generated artifacts that should stay ignored

If unexpected changes exist, stop and classify them before continuing.

### 2. Safety Check Before `git pull`

Before `git pull`, confirm:

- local modifications will not be overwritten
- generated files are not staged by mistake
- no SQL, ZIP, JSONL, or backup artifacts are mixed into the working tree
- the target branch is correct

If the working tree is not clean enough for a safe pull, do not pull yet.

### 3. Pull and Confirm Merge State

If pull is safe, run:

```bash
git pull
```

After pull, confirm:

- no merge conflict markers were introduced
- no rebase or merge conflict is in progress
- official paths still match documentation

If conflicts exist, resolve the Git state before any implementation work.

### 4. Reconfirm Core Project Documents

Review at minimum:

- `AGENTS.md`
- `docs/DEVELOPMENT_CONSTITUTION.md`
- `docs/PROJECT_ARCHITECTURE.md`
- `docs/ROADMAP/PROJECT_STATUS.md`
- relevant workflow or roadmap documents for the current task

Focus on:

- current phase
- current objective
- phase boundary
- blocked work
- official structure

### 5. Verify Current DB State

Confirm the schema version option exists and record its value:

```txt
wcm_core_db_version
```

Confirm the current row-count state of:

```txt
wp_wcm_bible_books
wp_wcm_bible_versions
wp_wcm_bible_verses
wp_wcm_original_terms
wp_wcm_original_word_occurrences
```

Minimum operating expectation:

- schema version is known
- Bible tables are present
- original-language tables are present when original-language work is in scope
- counts are recorded before any data-related decision

If a required table is missing, stop and report before implementation.

### 6. Verify Data Package State

Confirm whether the latest approved Data Package exists outside the project, for example:

```txt
~/WCM-Data-Packages/
```

Confirm:

- latest package identifier
- manifest presence
- checksum file presence
- expected count metadata presence
- whether the package matches the current DB state

Generated package contents inside the repository are temporary working artifacts only and must remain ignored.

### 7. Produce the Session Start Report

Before any implementation, report:

```txt
Current Phase:
Current Objective:
Current DB Status:
Current Data Package Status:
Next Task:
```

Recommended report content:

- Current Phase: roadmap phase name
- Current Objective: active documented objective
- Current DB Status: `wcm_core_db_version` and key table counts
- Current Data Package Status: latest known package, checksum/manifest state, whether current or missing
- Next Task: the specific approved task to perform after verification

## Stop Conditions

Do not implement anything yet if any of these are true:

- `git status` shows unexplained changes
- `git pull` is unsafe
- merge conflicts exist
- DB version is unknown
- required tables are missing
- Data Package state is unknown for data-related work
- current phase and requested work do not match

## Notes

- This workflow is mandatory before implementation reporting in a new session.
- Full DB dump and Data Package are different tools. Do not treat them as interchangeable.
- Database files must not be stored under the public project tree.
