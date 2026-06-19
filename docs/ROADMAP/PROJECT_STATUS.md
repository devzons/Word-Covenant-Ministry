# Project Status

## Date

2026-06-19

## Purpose

This document records the current project state so the next developer or coding agent can continue Scripture Engine work in a new session without relying on conversation history.

`docs/ROADMAP/` did not exist before this update. It was created because `docs/DECISIONS/` is reserved for ADRs, while this document set records operational status, current implementation state, and immediate next tasks.

## Required Session Start

Before any future code or documentation change, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. Relevant ADRs under `docs/DECISIONS/`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Conversation memory is not enough. Documentation plus filesystem inspection is required every session.

## Confirmed Official Structure

Repository root:

```txt
/Users/donmini/Local Sites/wordcovenantministry
```

Official paths:

```txt
Frontend: frontend/
Backend Plugin: backend/app/public/wp-content/plugins/wcm-core/
Docs: docs/
Source Data: docs/data-sources/
```

Important warning:

```txt
backend/wcm-core/
```

This directory exists in the local filesystem, but it is a documented non-official path. Do not use it for active plugin work. The only official plugin path is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Completed Scripture Engine Status

- Scripture Engine Foundation completed.
- KRV MDB analysis completed.
- KRV JSON export completed.
- KRV `31,102` canonical verses imported.
- Psalm 72:20 correction completed.
- KRV import verification completed.
- Bible Lookup API implemented.
- Bible Search API implemented.
- Bible Chapter API implemented.
- Book Metadata API implemented.
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.
- Verse Anchor Navigation implemented.
- Active Verse Highlight implemented.
- Chapter Boundary Navigation implemented.

## Current Phase Summary

Current phase:

```txt
Phase 5E - Original Language Persistence Smoke Verification
```

Status:

```txt
Small local write smokes complete
```

Completed phase:

```txt
Scripture Foundation, Search Layer, Reader Layer, Reader UX Polish, Phase 5B Original Language Data Layer, Phase 5C Source Gate / Normalizer Foundation, Phase 5D Dry-run Pipeline, and Phase 5E small local write smoke verification
```

Active objective:

```txt
Hold the original-language pipeline after approved tiny local write smokes until any controlled larger import receives separate explicit approval.
```

Next task:

```txt
Explicit approval is required before any controlled larger STEP import. Full import is not approved.
```

Blocked items:

```txt
Full original-language persistence import remains blocked. STEP_TAHOT and STEP_TAGNT dry-run processing is complete with zero hard errors, and tiny local write smokes have passed, but larger imports, public APIs, frontend work, and real import execution require a separate explicit approval phase.
```

Current phase boundary:

```txt
Phase 5E small local write smoke verification is complete. The smoke data does not authorize full STEP, OSHB, SBLGNT, or other dataset import. It also does not authorize public APIs or frontend surfaces.
```

Phase 5A source recommendation:

```txt
Hebrew primary source candidate: STEP Bible TAHOT
Hebrew secondary validation/reference: OSHB
Greek primary source candidate: STEP Bible TAGNT
Greek reference text: SBLGNT
MorphGNT: not a primary source before ShareAlike review
OpenGNT: not the first production source because of provenance/license complexity
```

## Phase 5 Entry Criteria

Next major phase:

```txt
Phase 5 - Original Language Foundation
```

Phase 5 entry sequence:

```txt
Phase 5A - Source and Schema Analysis
Phase 5B - Original Language Schema Foundation
Phase 5C - Import Foundation
Phase 5D - Dry-run Pipeline
Phase 5E - Persistence Smoke Verification
Future - Read API Foundation
```

Phase 5 rules:

- Original Language data must not extend `wcm_bible_verses`.
- Original Language data belongs in separate custom tables.
- Core tables are `wcm_original_terms` and `wcm_original_word_occurrences`.
- Future related tables include `wcm_hebrew_letters`, `wcm_word_letter_breakdowns`, `wcm_pictographic_observations`, and `wcm_scripture_relationships`.
- The canonical connection point is `book_id + chapter + verse`.
- Strong's numbers are term-level fields such as `H7225` and `G3056`.
- Morphology is occurrence-level data.
- `wcm_scripture_relationships` is a discovery/ranking graph, not authoritative occurrence storage.
- Original Language import must use a dedicated importer, not direct reuse of the KRV verse importer.
- Source license and provenance must be verified before OSHB, SBLGNT, or other source imports.
- Source license and provenance must also be verified before STEP Bible, MorphGNT, OpenGNT, or other source imports.
- Original Language data must not be bundled into the frontend.
- Schema implementation, importer implementation, dataset import, and UI implementation remain out of scope until Phase 5A gates are complete.

Phase 5B entry requirements:

- Confirm exact STEP TAHOT and STEP TAGNT files and field headers.
- Document license and attribution text.
- Decide Greek edition filtering.
- Decide Hebrew versification handling.
- Decide prefix and suffix token modeling.
- Decide Strong's normalization.
- Draft validation rules.

Phase 5B schema design review summary:

- Core schema remains limited to `wcm_original_terms` and `wcm_original_word_occurrences`.
- `wcm_bible_verses` must not be extended for original-language data.
- `wcm_scripture_relationships` remains a future discovery/ranking graph, not authoritative occurrence storage.
- `wcm_original_terms` stores lexical identity, including normalized lemma, base Strong's, STEP extended Strong's, root, gloss, and optional definition.
- `wcm_original_word_occurrences` stores source-specific canonical occurrences, including `source_dataset`, `source_ref`, `word_order`, `subword_order`, `token_type`, surface/normalized form, morphology, and grammar fields.
- Phase 5B does not add `version_id` to original-language occurrences.
- Next implementation preparation must finalize enum values, migration/rollback notes, validation rules, and then prepare schema work.

Phase 5B implementation gate summary:

- Enum and naming decisions are fixed in `docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md`.
- Initial `source_dataset` values are `STEP_TAHOT` and `STEP_TAGNT`.
- Future `source_dataset` values are `OSHB`, `SBLGNT`, `MORPHGNT`, and `OPENGNT`.
- Phase 5B implementation is table creation only for `wcm_original_terms` and `wcm_original_word_occurrences`.
- Existing Bible tables, existing Bible APIs, and existing import pipeline behavior must not be changed during Phase 5B.
- Phase 5C importer work must not begin until validation rules are applied.

Phase 5B implementation complete:

```txt
SchemaInstaller original language tables: complete
OriginalTerm ValueObject: complete
OriginalWordOccurrence ValueObject: complete
OriginalTermValidator: complete
OriginalWordOccurrenceValidator: complete
OriginalTermRepository: complete
OriginalWordOccurrenceRepository: complete
```

Phase 5C next phase:

```txt
Phase 5C - Original Language Importer Design
```

Phase 5C is design-first. It must define source file inspection, source header verification, import mapping, batch validation, dry-run behavior, verification report shape, validator/service responsibilities, and repository usage before any importer implementation or dataset import.

Phase 5C importer design analysis summary:

- Existing KRV import flow is `MDB export -> generated JSON -> ImportRow -> KrvImportValidator -> VerseImportService -> BibleRepository::upsertVerse() -> verification`.
- Existing KRV import does not include a true dry-run mode.
- Original Language import must add a stronger dry-run gate before persistence.
- Proposed Original Language flow is `Source file -> Source Inspection -> Source Metadata / License Gate -> Header / Shape Validation -> Row Normalization -> Batch Validation -> Dry-run Report -> Explicit Approval -> Term Persistence -> Occurrence Persistence -> Verification Report`.
- Dry-run must inspect, normalize, validate, build identity keys, optionally simulate read-only repository matching, produce counts and issues, and perform zero writes.
- `OriginalLanguageImportService` must default to dry-run behavior until implementation receives explicit approval.
- Phase 5C decision finalization found local STEP_TAHOT and STEP_TAGNT candidate files under `docs/data-sources/STEP/`.
- A local `STEPBible-Data` source clone exists under `docs/data-sources/STEPBible-Data/`.
- The STEP source is pinned for Phase 5C design review at commit `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- STEP license is CC BY 4.0.
- STEP attribution must credit STEP Bible linked to `www.STEPBible.org` and note the Tyndale House Cambridge basis.
- Plugin tools currently contain KRV tooling only.
- STEP_TAHOT and STEP_TAGNT headers/sample shapes have been inspected for design mapping.
- TAGNT first production import must be SBL-aligned by including rows whose `editions` field contains `SBL`.
- TAHOT must map to WCM canonical `book_id + chapter + verse`; Hebrew alternate references require an explicit exception map before import.
- Hebrew prefixes, root words, suffixes, and punctuation must use the existing `wordOrder`, `subwordOrder`, and `tokenType` model when source segment data is available.
- Base Strong's values belong in `strongsNumber`; STEP disambiguation belongs in `strongsExtended`.
- Raw STEP source files are untracked source data and must not be committed without separate approval.
- `StepTahotNormalizer`, `StepTagntNormalizer`, and dry-run-only `OriginalLanguageImportService` are implemented.
- Phase 5C-7 source acquisition policy is recorded in `docs/ROADMAP/SOURCE_ACQUISITION_SPECIFICATION.md`.
- Source versions must be exact and documented; floating `latest` source references are not allowed.
- Recommended STEP storage location is `docs/data-sources/STEP/TAHOT/` and `docs/data-sources/STEP/TAGNT/`.
- Source acquisition must document exact file name, source URL, source version, download date, license, and attribution text before any download or import.
- Phase 5C-B1 Source Gate Hardening is complete:
  - STEP `.txt` files are recognized as `step_txt`.
  - `OriginalLanguageSourceInspector` locates the real TAHOT/TAGNT data header rows instead of intro/license lines.
  - `SourceFileValidator` validates required TAHOT/TAGNT headers.
  - Source metadata and import report objects include source version, source URL, and checksum support.
  - Approved STEP source path and file-name validation is implemented.
  - STEP CC BY 4.0, STEP Bible/STEPBible.org, and Tyndale House Cambridge attribution validation is implemented.
  - Read-only smoke check passed for `STEP_TAHOT` and `STEP_TAGNT` with `issues=0`.
  - No importer, normalizer, DB write, API, dataset import, or public UI was implemented.
- Phase 5D Dry-run Pipeline is complete:
  - `StepTagntNormalizer` is implemented.
  - `StepTahotNormalizer` is implemented.
  - `OriginalLanguageVersificationResolver` is implemented.
  - `OriginalLanguageImportService` dry-run mode is implemented.
  - TAGNT alternate reference support accepts `{}`, `[]`, and `()` markers before `#` and preserves alternate reference context.
  - TAHOT first-import policy skips non-base text types such as `X`.
  - TAHOT Q(K) rows are skipped and reported without variant occurrence storage.
  - Dry-run exception map handling includes `1Ch.22.17 -> 1Ch.22.16`, `1Ch.22.18 -> 1Ch.22.17`, `1Ch.22.19 -> 1Ch.22.18`, and `Rev.12.18 -> Rev.13.1`.
  - Full read-only dry-run completed with zero hard errors.
- Phase 5E local write smoke verification is complete:
  - Persistence skeleton committed in `24a0d24`.
  - Local DB connectivity was restored through Local Site Shell.
  - Original-language tables were confirmed: `wp_wcm_original_terms` and `wp_wcm_original_word_occurrences`.
  - Small `STEP_TAGNT` write smoke passed with `maxRows=3` and `batchSize=1`: first run created `3` terms and `3` occurrences; rerun matched `3` terms and `3` occurrences; duplicates=`0`.
  - Small `STEP_TAHOT` write smoke passed with `maxRows=3` and `batchSize=1`: first run created `4` terms and `4` occurrences; rerun matched `4` terms and `4` occurrences; Hebrew expansion confirmed; duplicates=`0`.
  - Current local DB smoke state contains `7` original-language terms and `7` original-language occurrences.
  - Full import has not been run.
  - Public original-language API and frontend surfaces have not been added.
  - Next larger import step requires separate explicit approval.

Phase 5D full dry-run aggregate results:

```txt
TAGNT rowsRead=142096
TAGNT rowsNormalized=137121
TAGNT rowsSkipped=4975

TAHOT rowsRead=305652
TAHOT rowsNormalized=536199
TAHOT rowsSkipped=2267

hard errors=0
```

Remaining non-hard dry-run issues:

- `missing_morphology`
- `tagnt_non_sbl_skipped`
- `qere_kethiv_variant_skipped`
- `tahot_non_base_text_type_skipped`
- `psalm_title`
- `duplicate_occurrence` warning-level skips

Still prohibited:

- Full STEP TAHOT or STEP TAGNT import.
- OSHB import.
- SBLGNT import.
- Public original-language API.
- Original-language UI, Interlinear UI, Strong's page, or Word Study UI.
- Any additional DB writes beyond separately approved local smoke or controlled import steps.
- Frontend changes.

Detailed Phase 5 plan:

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Bible Lookup API

Current endpoint:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}/{verse}
```

Example:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

Implementation structure:

- `src/Core/Plugin.php` registers API setup on `rest_api_init`.
- `src/Api/ApiRegistrar.php` calls `BibleController()->registerRoutes()`.
- `src/Api/BibleController.php` registers the lookup route.
- `BibleController` sanitizes and validates request parameters.
- `BibleController` uses `BibleRepository` for data access.
- `BibleRepository` uses `getVersionByCode`, `getBookBySlug`, and `getVerse` to query custom Bible tables.

## Current Bible Chapter API

Current endpoint:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Example:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1
```

Implementation structure:

- `src/Api/BibleController.php` registers the chapter route.
- `BibleController` sanitizes and validates version, book slug, and chapter params.
- `BibleController` uses `BibleRepository::getChapterVerses()` for chapter verse retrieval.
- The endpoint returns one chapter only and does not return a full Bible dataset.

## Current Book Metadata API

Current endpoint:

```txt
/wp-json/wcm/v1/books/{version}/{book}
```

Example:

```txt
/wp-json/wcm/v1/books/KRV/genesis
```

The endpoint returns book metadata used by the Reader for chapter boundary navigation:

```json
{
  "translation": "KRV",
  "book": "genesis",
  "name": "창세기",
  "chapter_count": 50
}
```

## Current Reader UX Status

The Reader now supports:

- Verse Anchor Navigation.
- Active Verse Highlight.
- Chapter Boundary Navigation.
- Bible Reader default scripture spacing/style standard.

Confirmed chapter boundary navigation examples:

- Genesis 1 previous is disabled.
- Genesis 50 next goes to Exodus 1.
- Malachi 4 next goes to Matthew 1.
- Matthew 1 previous goes to Malachi 4.
- Revelation 22 next is disabled.

Bible Reader default design standard:

```txt
docs/ROADMAP/BIBLE_READER_DESIGN_STANDARD.md
```

Current applied Reader spacing/style:

```txt
Verse list: ol gap-0
Verse row: py-0.5, scroll-mt-24, per-verse ids such as id="v16"
Verse text: leading-7
Active highlight: bg-blue-50, border-blue-200, rounded-lg, hover:bg-blue-100
Active verse number: text-blue-700
```

Design intent:

- Preserve a continuous Bible-like reading flow.
- Minimize artificial vertical spacing between verses.
- Maintain mobile readability.
- Highlight search-result destination verses with a subtle blue tone.
- Do not use strong yellow or red active verse highlights by default.
- Treat the Reader as scripture text density, not general blog article spacing.

Current applied spacing change:

```txt
Before: ol gap-4, verse row py-1, leading-8
After:  ol gap-0, verse row py-0.5, leading-7
```

Verified Reader spacing/style state:

```txt
typecheck passed
lint passed
build passed
git diff --check passed
```

## Current Scripture Source Structure

Current relevant plugin paths:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Import/
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/ValueObjects/
backend/app/public/wp-content/plugins/wcm-core/src/Api/BibleController.php
backend/app/public/wp-content/plugins/wcm-core/src/Api/ApiRegistrar.php
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/BibleRepository.php
backend/app/public/wp-content/plugins/wcm-core/src/Search/.gitkeep
```

`src/Search/` currently contains only `.gitkeep`. No search implementation exists there.

## Current Bible Storage Notes

Production Scripture data belongs in custom tables:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

ADR-0009 mentions a future `FULLTEXT KEY text_search (text)`, but the current `SchemaInstaller.php` `wcm_bible_verses` schema does not include a `FULLTEXT` index. Do not make the first Bible Search API depend on `FULLTEXT`.

## Validation State

Before this document update:

- `git rev-parse --show-toplevel` returned `/Users/donmini/Local Sites/wordcovenantministry`.
- `git status` was clean.
- Actual filesystem inspection confirmed the official plugin path and the non-official `backend/wcm-core/` directory.
