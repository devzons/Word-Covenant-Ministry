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
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.

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
```

Current search placeholder:

```txt
src/Search/.gitkeep
```

Bible Lookup, Bible Search, and Bible Chapter APIs exist.

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

## Current Frontend Scripture Milestone

The current frontend Scripture milestone includes the Bible Reader MVP and Bible Search Results MVP.

Recommended implementation location:

```txt
Route: frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
Component: frontend/src/components/scripture/BibleReader.tsx
API client: frontend/src/lib/api/bible.ts
Types: frontend/src/types/bible.ts or frontend/src/types/scripture.ts
```

The Reader should consume only the needed chapter from the backend Chapter API.

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

Future milestones after the frontend Bible Reader and Search Results MVPs:

- Passage range lookup.
- Scripture relationship table design and migration.
- Scripture relationship API contract.
- Original language table design and migration.
- WEB source inspection and import plan.
- OSHB and SBLGNT source inspection and licensing review.
- Scripture-centered frontend refinement.
