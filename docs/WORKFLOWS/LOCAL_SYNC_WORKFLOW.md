# Local Sync Workflow

## Purpose

This workflow defines the standard synchronization routine between home Local, work Local, and a newly created Local/Flywheel environment.

## Scope

Use this workflow when the trigger phrase is:

```txt
Word Covenant Ministry 로컬 동기화
```

## Core Principles

- Git synchronizes source and documentation, not database state.
- Database movement requires explicit choice between full DB dump and Data Package.
- `--apply` is never the first step.
- Existing populated environments must be treated conservatively.

## Source of Truth Split

### Git Covers

- plugin source
- frontend source
- documentation
- tooling scripts
- small committed examples

### Git Does Not Cover

- live Local database contents
- WordPress uploaded media
- SQL backups
- generated JSONL packages
- ZIP package archives

## Standard Local-to-Local Sync

### 1. Sync Git First

Run:

```bash
git pull
```

Only do this after the session-start safety check confirms it is safe.

### 2. Decide Data Movement Method

Use one of these only after verifying the target environment state.

#### Full DB Dump

Use a full DB dump when:

- the target Local is a fresh setup
- the goal is a near-complete environment clone
- WordPress content, options, plugin data, and scripture data all need to match

Do not store DB dumps in the public project tree.

Recommended storage:

```txt
~/WCM-Backups/
```

#### Data Package

Use a Data Package when:

- the target already has the correct application code
- only approved original-language data needs to move
- reviewed `transliteration_ko` and `gloss_ko` values must be preserved
- a narrower, verifiable restore path is better than a whole DB restore

Recommended storage:

```txt
~/WCM-Data-Packages/
```

## Data Package Sync Sequence

Always use this order:

```txt
verify -> import dry-run -> apply only if required and approved
```

Rules:

- verify checksum and expected counts first
- run importer without `--apply` first
- apply only when the target state is confirmed safe

If the target already contains meaningful data, do not jump to apply.

## Existing Data Protection Rule

If the target Local/Flywheel environment already contains original-language or Bible data:

- do not assume it is safe to overwrite
- do not use `--apply` by default
- compare counts and schema version first
- confirm whether the target is intentionally empty, intentionally seeded, or mixed

If existing reviewed data is present, apply requires explicit approval.

## New Local/Flywheel Setup Procedure

For a new Local/Flywheel environment:

1. Create the new site.
2. confirm the local domain and shell access
3. pull the repository code
4. confirm official plugin path exists
5. confirm frontend path exists
6. confirm current DB is empty or intentionally fresh
7. choose full DB dump restore or Data Package route
8. if using Data Package, run verify then dry-run before any apply decision
9. validate final counts and key API smoke routes

## Full DB Dump vs Data Package

### Full DB Dump

- captures broad WordPress state
- includes options, content, and plugin tables together
- useful for whole-environment cloning
- higher overwrite risk
- requires careful search-replace and environment validation

### Data Package

- targeted for original-language data movement
- checksum and expected-count oriented
- safer for selective dataset restoration
- not a replacement for all WordPress state
- should preserve reviewed Korean presentation fields

## Stop Conditions

Stop and reassess if:

- target DB already has meaningful data
- schema version differs unexpectedly
- expected counts do not match
- checksum fails
- duplicate detection fails
- package provenance is unclear

## Notes

- A new Local/Flywheel environment is not automatically safe for apply; confirm DB state first.
- Generated package files remain ignored inside the repository.
- Backups and packages must live outside the project tree.
