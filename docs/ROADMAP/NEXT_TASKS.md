# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Phase 5C - Original Language Importer Design.

Phase 5B Original Language Data Layer implementation is complete. Phase 5C must design the importer before any dataset import. It must start with source file inspection, source header verification, import mapping, batch validation, dry-run behavior, and verification report design.

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Priority Order

1. Source Acquisition Specification
2. Approved source file acquisition
3. Header-only inspection
4. Header mapping finalization
5. StepTahotNormalizer design
6. StepTagntNormalizer design
7. Dry-run ImportService design
8. First dry-run import
9. Actual import only after separate explicit approval
10. Phase 5D Read API Foundation
11. Later: Interlinear UI
12. Later: Word Study UI
13. Later: Cross References
14. Later: Commentary Layer

## Required Pre-Work Before Code Changes

Before continuing Original Language Foundation work, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. `docs/BACKEND_STRUCTURE.md`
5. `docs/DECISIONS/0008-scripture-data-model.md`
6. `docs/DECISIONS/0009-bible-storage-strategy.md`
7. `docs/DECISIONS/0010-original-language-data-model.md`
8. `docs/DECISIONS/0012-scripture-relationship-model.md`
9. `docs/DECISIONS/0014-bible-import-pipeline-strategy.md`
10. `docs/DECISIONS/0015-source-data-management-strategy.md`
11. `docs/ROADMAP/PROJECT_STATUS.md`
12. `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`
13. `docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Verify the official backend plugin path exists before any future backend implementation:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Frontend Scripture Implementation Status

Completed backend Scripture APIs:

```txt
KRV Import
Bible Lookup API
Bible Search API
Bible Chapter API
Book Metadata API
```

Implemented Reader files:

```txt
frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
frontend/src/components/scripture/BibleReader.tsx
```

Implemented Search Results files:

```txt
frontend/src/app/[locale]/bible/search/page.tsx
frontend/src/components/scripture/BibleSearchResults.tsx
frontend/src/lib/api/bible.ts
frontend/src/types/bible.ts
```

Implemented route shapes:

```txt
/ko/bible/KRV/genesis/1
/ko/bible/search?q=태초&translation=KRV
```

Implemented Reader UX polish:

```txt
Verse Anchor Navigation
Active Verse Highlight
Chapter Boundary Navigation
Bible Reader scripture spacing/style standard
```

Official Bible Reader design standard:

```txt
docs/ROADMAP/BIBLE_READER_DESIGN_STANDARD.md
```

Default Reader spacing/style:

```txt
Verse list: ol gap-0
Verse row: py-0.5
Verse anchor offset: scroll-mt-24
Verse id format: id="v16"
Verse text: leading-7
Active highlight: bg-blue-50, border-blue-200, rounded-lg, hover:bg-blue-100
Active verse number: text-blue-700
```

Reader design intent:

- Use continuous scripture reading density instead of generic blog article spacing.
- Minimize verse-to-verse vertical spacing.
- Preserve mobile readability.
- Use subtle blue active verse highlighting for search-result navigation.
- Do not use strong yellow or red active verse highlights by default.

Confirmed chapter boundary navigation examples:

```txt
Genesis 50 -> Exodus 1
Malachi 4 -> Matthew 1
Matthew 1 -> Malachi 4 via previous
Revelation 22 next disabled
Genesis 1 previous disabled
```

## Required Frontend Scripture Constraints

Frontend Scripture pages must:

- fetch only the requested chapter from the backend Chapter API
- never import or bundle a full Bible dataset
- include chapter verse list
- include previous and next chapter links
- include book and chapter selectors
- include a simple search box using paginated backend search
- include API error and empty states
- show paginated search results from the backend Search API
- stay mobile readable

Backend Chapter API:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Backend Search API:

```txt
GET /wp-json/wcm/v1/search
```

Backend Book Metadata API:

```txt
GET /wp-json/wcm/v1/books/{version}/{book}
```

## Original Language Foundation Constraints

Phase 5 must follow these constraints:

- Hebrew primary source candidate is STEP Bible TAHOT.
- Hebrew secondary validation/reference source is OSHB.
- Greek primary source candidate is STEP Bible TAGNT.
- Greek reference text is SBLGNT.
- MorphGNT must not be used as a primary source before ShareAlike implications are reviewed.
- OpenGNT must not be used as the first production source because of provenance and license complexity.
- Do not extend `wcm_bible_verses` for original-language data.
- Store original-language data in separate custom tables.
- Start with `wcm_original_terms` and `wcm_original_word_occurrences`.
- Use `book_id + chapter + verse` as the canonical connection point.
- Store Strong's numbers at term level, for example `H7225` and `G3056`.
- Store morphology at occurrence level.
- Treat `wcm_scripture_relationships` as discovery/ranking graph storage, not authoritative occurrence storage.
- Do not directly reuse the KRV verse importer for original-language import.
- Reuse importer patterns only where appropriate.
- Do not import OSHB, SBLGNT, or any source before license/provenance verification.
- Do not import STEP Bible, MorphGNT, OpenGNT, or any source before license/provenance verification.
- Do not bundle original-language datasets into the frontend.
- Keep UI work for later phases after data/API foundation exists.

Phase 5B may not begin until:

- Exact STEP TAHOT and STEP TAGNT files are confirmed.
- License and attribution text is documented.
- Greek edition filtering is decided.
- Hebrew versification handling is decided.
- Prefix and suffix token modeling is decided.
- Strong's normalization is decided.
- Validation rules are drafted.

Phase 5B schema design review decisions:

- Core tables are `wcm_original_terms` and `wcm_original_word_occurrences`.
- Do not extend `wcm_bible_verses`.
- Keep `wcm_scripture_relationships` as future discovery/ranking graph storage, not authoritative occurrence storage.
- Store Strong's at term level.
- Store morphology at occurrence level.
- Use `source_dataset + book_id + chapter + verse` for source-specific canonical occurrence lookup.
- Do not add `version_id` to original-language occurrences in Phase 5B.
- Include `subword_order` and `token_type` for Hebrew prefix/suffix and compound token modeling.
- Include `source_ref` for import audit and rollback.

Phase 5B implementation gate decisions:

- Allowed `language_type` values are `hebrew` and `greek`.
- Allowed `token_type` values are `word`, `prefix`, `suffix`, `punctuation`, and `variant`.
- Initial allowed `source_dataset` values are `STEP_TAHOT` and `STEP_TAGNT`.
- Future allowed `source_dataset` values are `OSHB`, `SBLGNT`, `MORPHGNT`, and `OPENGNT`.
- Base Strong's values belong in `strongs_number` using values such as `H7225` and `G3056`.
- STEP extended or disambiguated values belong in `strongs_extended`.
- Prefer normalizing absent `strongs_extended` values to an empty string during implementation.
- Phase 5B is table creation only and must not change existing Bible tables, APIs, or import pipelines.
- Rollback is manual table drop only before production original-language import.
- Phase 5C importer work must apply term, occurrence, and performance validation before any data write.

Phase 5B-1 ValueObject design decisions:

- `OriginalTerm` should be a `final readonly class` with constructor-promoted properties.
- `OriginalTerm` fields are nullable `id`, required `languageType`, `lemma`, `lemmaNormalized`, string-normalized Strong's/transliteration/root fields, and nullable `gloss`/`definition`.
- `OriginalWordOccurrence` should be a `final readonly class` with constructor-promoted properties.
- `OriginalWordOccurrence` fields are nullable `id`, term/reference/order fields, token/source fields, surface/normalized/morphology fields, and nullable grammar/context fields.
- Database timestamps do not belong in the Phase 5B-1 ValueObjects.
- `versionId` does not belong in `OriginalWordOccurrence` for Phase 5B.
- Use project-style constants before PHP enums.
- Keep constructors limited to lightweight invariant validation.
- Keep duplicate identity, source-specific validation, Greek edition filtering, Hebrew versification, and batch reports in validators/importer validation.
- Normalize raw source rows before constructing ValueObjects.

Phase 5B Original Language Data Layer implementation complete:

- `wcm_original_terms` schema table.
- `wcm_original_word_occurrences` schema table.
- `OriginalTerm`.
- `OriginalWordOccurrence`.
- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.
- `OriginalTermRepository`.
- `OriginalWordOccurrenceRepository`.

Phase 5C importer design constraints:

- Phase 5C is not dataset import.
- Source Acquisition Specification is recorded in `docs/ROADMAP/SOURCE_ACQUISITION_SPECIFICATION.md`.
- Hebrew primary source is STEP Bible TAHOT.
- Hebrew secondary validation/reference source is OSHB.
- Greek primary source is STEP Bible TAGNT.
- Greek reference text is SBLGNT.
- Floating `latest` source versions are not allowed.
- Exact source version, file name, source URL, download date, license, and attribution text must be documented before source acquisition proceeds.
- Recommended STEP storage location is `docs/data-sources/STEP/TAHOT/` and `docs/data-sources/STEP/TAGNT/`.
- Inspect exact STEP TAHOT/TAGNT source files before importer implementation.
- Verify source headers before importer implementation.
- STEP_TAHOT source file is not currently available locally.
- STEP_TAGNT source file is not currently available locally.
- `docs/data-sources/` currently contains KRV-related files only.
- Plugin tools currently contain KRV tooling only.
- `StepTahotNormalizer`, `StepTagntNormalizer`, and `OriginalLanguageImportService` are blocked until approved local source files or header/sample excerpts are provided and inspected.
- Define source-to-ValueObject import mapping before writes.
- Define batch validation and dry-run report behavior before writes.
- Design validator, service, and repository usage before implementation.
- Do not import STEP, OSHB, SBLGNT, MorphGNT, OpenGNT, or any original-language source without explicit approval.
- Do not build public original-language APIs, Interlinear UI, Strong's pages, Word Study UI, or other frontend surfaces in Phase 5C design.

Phase 5C proposed classes:

- `OriginalLanguageSourceInspector`
- `OriginalLanguageSourceMetadata`
- `SourceFileValidator`
- `SourceLicenseValidator`
- `OriginalLanguageNormalizedRow`
- `OriginalLanguageNormalizer`
- `StepTahotNormalizer`
- `StepTagntNormalizer`
- `OriginalLanguageImportValidator`
- `OriginalLanguageImportIssue`
- `OriginalLanguageImportReport`
- `OriginalLanguageImportService`

Phase 5C implementation must preserve a mandatory dry-run gate:

- `dryRun` defaults to `true`.
- Dry-run performs source inspection, normalization, validation, identity key generation, optional read-only repository matching simulation, count reporting, and issue reporting.
- Dry-run performs zero writes.
- No production import may run without a prior successful dry-run and separate explicit approval.
- Repository `save()` methods write immediately, so dry-run behavior must stay in the import service layer and must not call persistence methods.

## Validation For Next Code Change

After frontend Scripture changes, run:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

Run general checks:

```bash
git status
git diff --check
```

Test the local API host and frontend routes:

```bash
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1"
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/search?q=태초&translation=KRV&page=1&per_page=20"
```

## Not In Scope For The Next Task

- Do not import original-language datasets.
- Do not run actual STEP TAHOT or STEP TAGNT import.
- Do not run OSHB import.
- Do not run SBLGNT import.
- Do not download, import, or transform STEP Bible, OSHB, SBLGNT, MorphGNT, OpenGNT, or other original-language datasets yet.
- Do not implement an original-language importer until Phase 5C design is complete and approved.
- Do not create public original-language APIs yet.
- Do not create a generic search engine.
- Do not build Interlinear UI yet.
- Do not build a Strong's page yet.
- Do not build Word Study UI yet.
- Do not implement cross references or commentary.
- Do not bundle full Bible or original-language datasets into the frontend.
