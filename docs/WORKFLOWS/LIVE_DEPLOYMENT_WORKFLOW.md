# Live Deployment Workflow

## Purpose

This workflow defines the standard operating routine for promoting Word Covenant Ministry to the live environment.

## Scope

Use this workflow when the trigger phrase is:

```txt
Word Covenant Ministry 라이브 배포
```

## Core Principles

- Backup first, always.
- Production data changes must be deliberate and reversible.
- Full DB import is exceptional, not routine.
- Data Package workflow is preferred for approved original-language data movement on an active live site.
- Direct production DB edits are forbidden.

## Backup First Rule

Before any deployment or data apply step:

- create a restorable backup
- confirm backup location
- confirm rollback owner
- confirm rollback window

Recommended backup storage:

```txt
~/WCM-Backups/
```

Do not store production DB files in the public project tree.

## Production Data Movement Rules

### Full DB Import

Allowed only when:

- first installation
- clearly empty environment
- explicitly confirmed recovery or rebuild case

Full DB import is not the default method for an active live environment.

### Data Package

Preferred when:

- code is already deployed or about to be deployed
- only approved original-language data needs to move
- reviewed field preservation matters
- the live site is already operating

## Required Apply Sequence

Always follow:

```txt
verify -> dry-run -> apply
```

Rules:

- verify checksum and manifest first
- confirm expected counts second
- run dry-run before any write
- apply only after explicit approval and backup confirmation

## Direct Production DB Change Ban

Do not:

- hand-edit production DB rows
- run ad hoc overwrite SQL
- bypass schema validation
- bypass package verification

All production-affecting data work must be reviewable and repeatable.

## Search-Replace Caution

If a full DB restore or environment clone is involved:

- verify site URL replacements carefully
- confirm API host values
- confirm frontend-to-backend URL expectations
- confirm serialized WordPress data safety

Do not assume search-replace is harmless.

## Rollback Plan

Before apply, document:

- rollback trigger
- rollback owner
- rollback source
- rollback steps
- validation after rollback

Typical rollback sources:

- pre-deploy DB backup
- pre-apply DB backup
- previous approved release tag

## Final Validation

After deployment or approved data apply, confirm:

- `wcm_core_db_version`
- final table counts
- package expected counts against live state
- critical API smoke routes
- Bible chapter rendering

Minimum content check:

- open a Bible chapter page
- confirm chapter content loads
- confirm verse structure is intact

Recommended smoke routes:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1/1
/wp-json/wcm/v1/interlinear/STEP_TAHOT/genesis/1/1
/wp-json/wcm/v1/interlinear/STEP_TAGNT/matthew/1/1
```

## Stop Conditions

Stop before apply if:

- no backup exists
- target environment is not clearly identified
- counts do not match expectation
- checksum fails
- dry-run reports conflicts
- rollback plan is missing

## Notes

- Production DB must not be treated like a disposable Local environment.
- Full DB dump and Data Package serve different purposes and must be chosen intentionally.
- For active live environments, Data Package is the preferred controlled path for original-language data movement.
