# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Implement the first Bible Search API.

This is backend source code work and must only happen inside:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Do not use:

```txt
backend/wcm-core/
backend/plugin/wcm-core/
app/public/wp-content/plugins/wcm-core/
```

## Required Pre-Work Before Code Changes

Before implementing Bible Search API, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. `docs/BACKEND_STRUCTURE.md`
5. `docs/DECISIONS/0008-scripture-data-model.md`
6. `docs/DECISIONS/0009-bible-storage-strategy.md`
7. `docs/DECISIONS/0012-scripture-relationship-model.md`
8. `docs/DECISIONS/0014-bible-import-pipeline-strategy.md`
9. `docs/ROADMAP/PROJECT_STATUS.md`
10. `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Verify the official plugin path exists before editing:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Bible Search API Implementation Guidance

Recommended files:

```txt
Create: backend/app/public/wp-content/plugins/wcm-core/src/Api/BibleSearchController.php
Modify: backend/app/public/wp-content/plugins/wcm-core/src/Api/ApiRegistrar.php
Modify: backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/BibleRepository.php
```

Recommended registration:

- Keep `BibleController` for single-verse lookup.
- Add `BibleSearchController` for Bible text search.
- Register both from `ApiRegistrar.php`.

Recommended route shape:

```txt
GET /wp-json/wcm/v1/bible/search
```

Recommended query params:

```txt
version=KRV
query=...
page=1
per_page=20
```

## Required Search Constraints

The first Bible Search API must:

- require `query`
- reject empty or whitespace-only queries
- enforce a minimum query length
- support `page`
- support `per_page`
- enforce a strict `per_page` maximum
- constrain searches by `version`
- return references and verse text only for the requested page
- never return a full Bible dataset
- use custom tables as production storage
- start with `LIKE` search
- avoid `FULLTEXT` dependency

`FULLTEXT` warning:

ADR-0009 mentions `FULLTEXT KEY text_search (text)`, but the current `SchemaInstaller.php` does not create a `FULLTEXT` index on `wcm_bible_verses`. Do not use `MATCH ... AGAINST` or require a `FULLTEXT` index in the first implementation.

## Suggested Response Shape

Keep the response compact and paginated:

```json
{
  "version": {
    "code": "KRV",
    "name": "개역한글",
    "language": "ko"
  },
  "query": "사랑",
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100
  },
  "results": [
    {
      "book": {
        "id": 43,
        "slug": "john",
        "name_ko": "요한복음",
        "name_en": "John"
      },
      "reference": {
        "chapter": 3,
        "verse": 16
      },
      "text": "..."
    }
  ]
}
```

## Validation For Next Code Change

After implementing Bible Search API, run from the plugin root:

```bash
composer dump-autoload
```

Run PHP syntax checks:

```bash
php -l backend/app/public/wp-content/plugins/wcm-core/src/Api/BibleSearchController.php
php -l backend/app/public/wp-content/plugins/wcm-core/src/Api/ApiRegistrar.php
php -l backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/BibleRepository.php
```

Run general checks:

```bash
git status
git diff --check
```

Test the local API host:

```bash
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/search?version=KRV&query=사랑&page=1&per_page=5"
```

## Not In Scope For The Next Task

- Do not create CPTs.
- Do not import more Bible data.
- Do not read or transform the MDB.
- Do not create a generic search engine.
- Do not implement frontend UI.
- Do not implement `src/Search/` yet.
- Do not add schema changes for `FULLTEXT` unless a separate migration task explicitly requests it.

