# Scripture Engine Roadmap

## Date

2026-06-18

## Current Foundation

The Scripture Engine foundation is in place for the first KRV workflow:

- KRV source candidate inspected: `docs/data-sources/개역한글.mdb`
- Source table confirmed: `BIBLE`
- Source columns confirmed: `BOOK`, `CHAPTER`, `VERSE`, `BIBLETEXT`
- Metadata rows excluded by canonical filter.
- KRV canonical verse count confirmed and imported: `31,102`
- Psalm 72:20 corrected during JSON import.
- KRV import verification completed.
- Read-only Bible Lookup API implemented.
- Bible Search API implemented.
- Bible Chapter API implemented for Frontend Bible Reader preparation.
- Book Metadata API implemented for Reader chapter boundary navigation.
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.
- Verse Anchor Navigation implemented.
- Active Verse Highlight implemented.
- Chapter Boundary Navigation implemented.

## Phase Status

### Phase 1 Foundation

Status: Complete

Completed:

- Scripture custom table foundation.
- KRV source inspection and import pipeline.
- KRV `31,102` canonical verse import.
- KRV import verification.

### Phase 2 Search Layer

Status: Complete

Completed:

- Bible Search API.
- Paginated search response.
- Frontend Bible Search Results MVP.

### Phase 3 Reader Layer

Status: Complete

Completed:

- Bible Chapter API.
- Frontend Bible Reader MVP.
- Chapter verse list rendering.
- Reader route under `/[locale]/bible/[version]/[book]/[chapter]`.

### Phase 4 Reader UX Polish

Status: Mostly Complete

Completed:

- Book Metadata API.
- Verse Anchor Navigation.
- Active Verse Highlight.
- Chapter Boundary Navigation.

Remaining polish candidates:

- Search Result Highlighting.
- Reading History.
- Reader Preferences.

### Phase 5 Original Language Foundation

Status: In Progress

Phase 5 started with source and schema analysis, then Phase 5B established the original-language data layer. It must still not proceed to dataset import without explicit approval.

Subphases:

```txt
Phase 5A - Source and Schema Analysis
Phase 5B - Original Language Data Layer
Phase 5C - Original Language Importer Design
Phase 5D - Read API Foundation
```

Phase 5B status:

```txt
Implementation Complete
```

Phase 5B completed:

- SchemaInstaller original language tables.
- `wcm_original_terms`.
- `wcm_original_word_occurrences`.
- `OriginalTerm` ValueObject.
- `OriginalWordOccurrence` ValueObject.
- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.
- `OriginalTermRepository`.
- `OriginalWordOccurrenceRepository`.

Current next phase:

```txt
Phase 5C - Original Language Importer Design
```

Phase 5C starts with source file inspection, source headers verification, import mapping, batch validation design, dry-run import report design, `OriginalLanguageImportValidator` design, `OriginalLanguageImportService` design, and repository usage design.

Phase 5C is not approval to import datasets. Actual STEP, OSHB, SBLGNT, public API, UI, Interlinear, Strong's page, and Word Study work remain out of scope until explicitly approved.

Phase 5A entry requirements:

- Verify OSHB, SBLGNT, or other source license and provenance.
- Inspect source format before import or transformation.
- Define schema gaps against ADR-0010.
- Draft an implementation plan before schema changes.

Core storage decision:

- Do not extend `wcm_bible_verses` for original-language data.
- Store original-language data in separate custom tables.
- Use `book_id + chapter + verse` as the common canonical reference.
- Treat `wcm_scripture_relationships` as discovery/ranking graph storage, not authoritative word occurrence storage.

Recommended core tables:

```txt
wcm_original_terms
wcm_original_word_occurrences
```

Future related tables:

```txt
wcm_hebrew_letters
wcm_word_letter_breakdowns
wcm_pictographic_observations
wcm_scripture_relationships
```

Strong's strategy:

- Store Strong's numbers at term level.
- Examples: `H7225`, `G3056`.
- Use a non-unique index initially unless source validation proves uniqueness.

Morphology strategy:

- Store morphology at occurrence level.
- Same lemma may have different morphology, parsing, grammar, and contextual function in different verse contexts.

## Current Domain Model

The accepted Scripture model is defined by ADR-0008 and ADR-0009:

- `BibleVersion`
- `BibleVerse`
- `ScriptureReference`
- `ScriptureReferenceRange`
- `ScriptureRelationship`

Bible text storage uses custom tables:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

Scripture relationships are planned through ADR-0012 and will use explicit structured relationship data instead of tags or plain text labels.

## Current Plugin Structure

Official plugin path:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Current Scripture-related directories:

```txt
src/Scripture/Import/
src/Scripture/Repositories/
src/Scripture/Validators/
src/Scripture/ValueObjects/
```

Current API files:

```txt
src/Api/ApiRegistrar.php
src/Api/BibleController.php
src/Api/BibleSearchController.php
```

Current repository:

```txt
src/Scripture/Repositories/BibleRepository.php
src/Scripture/Repositories/OriginalTermRepository.php
src/Scripture/Repositories/OriginalWordOccurrenceRepository.php
```

Current search placeholder:

```txt
src/Search/.gitkeep
```

Bible Lookup, Bible Search, Bible Chapter, and Book Metadata APIs exist.

## Bible Lookup API

Current route:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}/{verse}
```

Current registration flow:

1. `Plugin.php` registers API setup through `rest_api_init`.
2. `ApiRegistrar.php` calls `BibleController()->registerRoutes()`.
3. `BibleController.php` registers the lookup route.
4. `BibleController` sanitizes and validates request params.
5. `BibleController` resolves version, book, and verse through `BibleRepository`.
6. `BibleRepository` reads from custom Bible tables.

Repository methods currently used for lookup:

```txt
getVersionByCode(string $code): ?array
getBookBySlug(string $slug): ?array
getVerse(int $versionId, int $bookId, int $chapter, int $verse): ?array
getChapterVerses(int $versionId, int $bookId, int $chapter): array
searchVerses(string $query, ?string $translation, int $page, int $perPage): array
```

## Bible Chapter API

Current route:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

This route exists to support Frontend Bible Reader chapter rendering without repeated single-verse API calls or frontend Bible dataset imports.

## Book Metadata API

Current route:

```txt
/wp-json/wcm/v1/books/{version}/{book}
```

This route exists to support Reader chapter boundary navigation without bundling Bible book metadata as a full frontend Bible dataset.

## Current Frontend Scripture Milestone

The current frontend Scripture milestone includes the Bible Reader MVP, Bible Search Results MVP, and Reader UX Polish.

Recommended implementation location:

```txt
Route: frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
Component: frontend/src/components/scripture/BibleReader.tsx
API client: frontend/src/lib/api/bible.ts
Types: frontend/src/types/bible.ts or frontend/src/types/scripture.ts
```

The Reader should consume only the needed chapter from the backend Chapter API and book chapter count from the Book Metadata API.

Search results implementation location:

```txt
Route: frontend/src/app/[locale]/bible/search/page.tsx
Component: frontend/src/components/scripture/BibleSearchResults.tsx
API client: frontend/src/lib/api/bible.ts
Types: frontend/src/types/bible.ts
```

The Search Results page should consume only paginated backend Search API responses.

## Bible Search API

```txt
GET /wp-json/wcm/v1/search
```

The first Bible Search API is implemented for paginated text search.

Do not create a dedicated frontend search engine in the Reader MVP.

Only consider a future service when search expands into:

- ranking
- highlighting
- language-specific tokenization
- multi-version comparison
- result grouping
- dedicated search index integration

Possible future service path:

```txt
src/Scripture/Services/BibleSearchService.php
```

Do not create this service in the first Bible Search API unless the need is concrete.

## Do Not Use Backend `src/Search/` Yet

Do not implement the first Bible Search API directly in:

```txt
src/Search/
```

Reason:

- `src/Search/` is currently empty except for `.gitkeep`.
- It appears reserved for a future generic search engine.
- Bible text search is tightly coupled to the Scripture domain and `wcm_bible_verses`.
- The first implementation should stay close to `BibleRepository` and the existing Bible API controller pattern.

## Bible Search API Required Constraints

The first Bible Search API must:

- require `query`
- enforce a minimum query length
- support `page`
- support `per_page`
- enforce a strict `per_page` maximum
- require or constrain `version`
- never return the full Bible dataset
- start with `LIKE` search
- avoid `FULLTEXT` dependency

Reason:

ADR-0009 mentions `FULLTEXT KEY text_search (text)`, but the current `SchemaInstaller.php` does not create a `FULLTEXT` index on `wcm_bible_verses`.

## Future Scripture Engine Work

Future milestones after Reader UX Polish:

- Phase 5A - Source and Schema Analysis.
- Verify OSHB/SBLGNT or other source license/provenance.
- Define original language schema gap against ADR-0010.
- Draft original language schema implementation plan.
- Phase 5B - Original Language Schema Foundation.
- Phase 5C - Import Foundation.
- Phase 5D - Read API Foundation.
- Later: Interlinear UI.
- Later: Word Study UI.
- Later: Cross References.
- Later: Commentary Layer.

Detailed Phase 5 plan:

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```
