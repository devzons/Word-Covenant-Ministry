# English Bible Support Plan

## Phase

Phase 9 - English Bible Support / WEB Import Planning

## Purpose

Phase 9 will add English Bible support to Word Covenant Ministry, with WEB as the first English Bible candidate. This phase connects to the frontend route policy already prepared for locale defaults:

```txt
ko default Bible: KRV
en default Bible: WEB
```

The goal is to prepare reliable English Bible reading, search, and future KRV-WEB parallel display without importing data prematurely.

## Scope

Phase 9 planning includes:

- English Bible support planning.
- WEB as the first English Bible candidate.
- Future WEB source review.
- Future license and provenance verification.
- Future import dry-run design.
- Future reader and search support for English Bible versions.
- Future KRV-WEB parallel display foundation.

## Non-Scope

This planning document does not authorize:

- WEB data collection now.
- WEB import now.
- Schema changes now.
- Migrations now.
- Backend code changes now.
- Production database changes now.
- Copyrighted Bible versions.
- Raw Bible source files committed to Git.

## Proposed Phases

### Phase 9A - WEB Source, License, And Provenance Review

Confirm an authoritative WEB source, acquisition path, file format, license status, provenance, checksum, and attribution requirements.

Deliverables:

- WEB source review notes.
- License/provenance decision.
- Source checksum.
- Import readiness assessment.

### Phase 9B - Existing Bible Schema/API Compatibility Audit

Audit whether existing Bible tables and REST API routes can support WEB without schema changes.

Questions:

- Can `wcm_bible_versions`, `wcm_bible_books`, and `wcm_bible_verses` store WEB as another version?
- Can current chapter/search endpoints fetch `WEB` without contract changes?
- Are any book-name or metadata normalization changes required?
- Are frontend version selectors enough, or is API version metadata needed?

### Phase 9C - WEB Import Dry-Run Plan

Design dry-run-only tooling before any write operation.

Requirements:

- Canonical verse count validation.
- Duplicate verse detection.
- Missing text detection.
- Encoding validation.
- License/provenance metadata validation.
- Manifest/checksum validation.
- No production writes.

### Phase 9D - Local-Only WEB Import After Explicit Approval

After separate approval, run a local-only WEB import through the validated import path.

Requirements:

- Database backup before apply.
- Dry-run first.
- Explicit apply flag required.
- Post-import row counts.
- Reader/search smoke checks.
- No staging or production promotion until separately approved.

### Phase 9E - Reader/Search Version Selector

Expose a safe version selector after WEB data exists locally and API behavior is validated.

Requirements:

- KRV remains available.
- WEB becomes available for English reading.
- Locale and Bible version remain separate concepts.
- Empty/error states handle missing versions clearly.

### Phase 9F - KRV-WEB Parallel View

Prepare Korean-English parallel reading after both versions are data-backed.

Initial goal:

- KRV and WEB side-by-side for the same book/chapter/verse range.
- No fake English text.
- Clear loading/error states when either version is unavailable.

### Phase 9G - Gospel Harmony Compatibility

Ensure future Gospel harmony work can reference KRV and WEB consistently.

Focus:

- Reference identity by book/chapter/verse.
- Version-aware display.
- Parallel text compatibility.
- No duplicated imported text outside authoritative Bible tables.

## Data Policy

WEB must be source-backed before import.

Required source package metadata:

- Source name.
- Source URL or acquisition origin.
- License.
- Acquisition date.
- Verification date.
- Source checksum.
- Source format.
- Expected canonical verse count.
- Known issues.

Import inputs must use a manifest/checksum workflow. Generated files must be ignored unless a future decision explicitly approves committing a small fixture or sample.

Do not commit:

- Raw WEB source files.
- Full generated WEB JSON/JSONL exports.
- SQL dumps.
- ZIP/TAR/GZ packages.
- Production backups.

Allowed in Git:

- README files.
- License/provenance notes.
- Manifest examples.
- Small sample fixtures.
- Validation summaries.

## UX Policy

Locale and Bible version are related but separate concepts.

Current route policy:

```txt
/ko defaults to KRV
/en defaults to WEB
```

When locale switching on a Bible route:

- `ko` should map Bible version to `KRV`.
- `en` should map Bible version to `WEB`.
- `mode` may be preserved.
- `hash` may be preserved.
- `q` search query should be removed because Korean and English search terms are not equivalent.

Actual WEB text must not be faked. If WEB has not been imported, the reader may show the existing missing-version error state until Phase 9 data import is explicitly approved and completed.

## Dependencies

Current readiness:

- Bible Study Workspace is ready for reader + search panel UX.
- LocaleSwitcher already maps English Bible routes to `WEB`.
- KRV reader/search are data-backed.
- Original-language and interlinear tools remain independent of Bible version.

Still required:

- WEB source/license/provenance review.
- WEB import dry-run design.
- Explicit import approval.
- Local-only WEB import.
- Reader/search version behavior QA after WEB data exists.

## Validation And Promotion Policy

Future WEB import work must follow the existing Scripture source and import policies:

- ADR-0014 Bible Import Pipeline Strategy.
- ADR-0015 Source Data Management Strategy.
- ADR-0016 Deployment Version-Control Strategy.

Minimum promotion path:

```txt
Planning -> Source Review -> Dry Run -> Local Import -> Local QA -> Staging Approval -> Production Approval
```

Production import is not authorized by this plan.

## Current Decision

Document Phase 9 only.

No WEB data is collected. No WEB import is performed. No schema, migration, backend, API, frontend runtime, or production database behavior is changed by this document.
