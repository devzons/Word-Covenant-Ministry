# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Phase 5E or separately approved Original Language persistence-import planning.

Phase 5D Original Language dry-run pipeline is complete. The next task is not an actual import by default. Real persistence import requires separate explicit approval after reviewing the zero-error dry-run results and remaining warning categories.

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Priority Order

1. Review Phase 5D full dry-run aggregate results.
2. Decide whether to approve a separate persistence-import planning phase.
3. If approved, design the write-enabled import execution plan and rollback/export strategy.
4. If approved, define repository persistence usage and resumable batch behavior.
5. If approved, define post-import verification reports.
6. Actual import only after separate explicit approval.
7. Public original-language APIs only after data import and verification are approved.
8. Later: Interlinear UI.
9. Later: Word Study UI.
10. Later: Cross References.
11. Later: Commentary Layer.

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
- STEP_TAHOT candidate files are locally available under `docs/data-sources/STEP/TAHOT/`.
- STEP_TAGNT candidate files are locally available under `docs/data-sources/STEP/TAGNT/`.
- A local `STEPBible-Data` source clone is available under `docs/data-sources/STEPBible-Data/`.
- Pinned STEP source commit for Phase 5C design is `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- License is CC BY 4.0.
- Attribution must credit STEP Bible linked to `www.STEPBible.org` and note the Tyndale House Cambridge basis.
- TAGNT first production import must use SBL-aligned filtering: include only rows whose `editions` field contains `SBL`.
- TAHOT canonical mapping must keep WCM `book_id + chapter + verse` authoritative and use an explicit Hebrew versification exception map before import.
- Hebrew prefixes, root words, suffixes, and punctuation must be modeled with `wordOrder`, `subwordOrder`, and `tokenType` when source segment data is available.
- Base Strong's values belong in `strongsNumber`; STEP disambiguation belongs in `strongsExtended`.
- Raw STEP source files remain untracked source data and must not be committed without separate approval.
- Plugin tools currently contain KRV tooling only.
- `StepTahotNormalizer`, `StepTagntNormalizer`, `OriginalLanguageVersificationResolver`, and dry-run-only `OriginalLanguageImportService` are implemented.
- Phase 5C-B1 Source Gate Hardening is complete:
  - STEP `.txt` files are recognized as `step_txt`.
  - Real TAHOT/TAGNT data header detection is implemented.
  - TAHOT/TAGNT required header validation is implemented.
  - Source metadata/report include source version, source URL, and checksum support.
  - Approved STEP path/name validation is implemented.
  - STEP CC BY 4.0 attribution validation is implemented.
  - Read-only smoke check passed for `STEP_TAHOT` and `STEP_TAGNT`.
- Phase 5D dry-run blocker fixes are complete:
  - TAGNT alternate references using `{}`, `[]`, and `()` before `#` are parsed and preserved in raw/context.
  - TAHOT non-base text types such as `X` are skipped by first-import policy.
  - TAHOT Q(K) rows are skipped and reported without variant occurrence storage.
  - Dry-run exception map handling includes `1Ch.22.17 -> 1Ch.22.16`, `1Ch.22.18 -> 1Ch.22.17`, `1Ch.22.19 -> 1Ch.22.18`, and `Rev.12.18 -> Rev.13.1`.
- Phase 5D full read-only dry-run completed with zero hard errors.
- Full dry-run aggregate:
  - TAGNT rowsRead=`142096`, rowsNormalized=`137121`, rowsSkipped=`4975`.
  - TAHOT rowsRead=`305652`, rowsNormalized=`536199`, rowsSkipped=`2267`.
  - hard errors=`0`.
- Remaining non-hard issues are `missing_morphology`, `tagnt_non_sbl_skipped`, `qere_kethiv_variant_skipped`, `tahot_non_base_text_type_skipped`, `psalm_title`, and `duplicate_occurrence` warning-level skips.
- Do not import STEP, OSHB, SBLGNT, MorphGNT, OpenGNT, or any original-language source without explicit approval.
- Do not build public original-language APIs, Interlinear UI, Strong's pages, Word Study UI, or other frontend surfaces before import and verification are separately approved.

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
- Do not implement write-enabled original-language import execution until persistence import is separately approved.
- Do not create public original-language APIs yet.
- Do not create a generic search engine.
- Do not build Interlinear UI yet.
- Do not build a Strong's page yet.
- Do not build Word Study UI yet.
- Do not implement cross references or commentary.
- Do not bundle full Bible or original-language datasets into the frontend.
