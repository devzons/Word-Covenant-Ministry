# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Implement Phase 5B - Original Language Schema Foundation.

Phase 5B implementation must create only the approved original-language schema foundation. It must not import datasets, create importers, change existing Bible tables, or change existing Bible APIs.

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Priority Order

1. Implement Phase 5B Schema Foundation
2. Add `wcm_original_terms` table
3. Add `wcm_original_word_occurrences` table
4. Add indexes and unique keys
5. Validate dbDelta output
6. Add syntax checks
7. Then Phase 5C importer design
8. Phase 5D Read API Foundation
9. Later: Interlinear UI
10. Later: Word Study UI
11. Later: Cross References
12. Later: Commentary Layer

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
```

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

- Do not implement backend schema before Phase 5A is complete.
- Do not import more Bible data.
- Do not download, import, or transform STEP Bible, OSHB, SBLGNT, MorphGNT, OpenGNT, or other original-language datasets yet.
- Do not implement an original-language importer yet.
- Do not create a generic search engine.
- Do not build Interlinear UI yet.
- Do not build Word Study UI yet.
- Do not implement cross references or commentary.
- Do not bundle full Bible or original-language datasets into the frontend.
