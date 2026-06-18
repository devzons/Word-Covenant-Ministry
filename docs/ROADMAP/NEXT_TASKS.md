# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Verify the Frontend Bible Reader and Frontend Bible Search Results MVPs in the browser.

This is frontend source code work and must only happen inside:

```txt
frontend/
```

## Required Pre-Work Before Code Changes

Before continuing frontend Scripture work, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. `docs/FRONTEND_STRUCTURE.md`
5. `docs/DECISIONS/0008-scripture-data-model.md`
6. `docs/DECISIONS/0009-bible-storage-strategy.md`
7. `docs/DECISIONS/0011-localization-strategy.md`
8. `docs/DECISIONS/0012-scripture-relationship-model.md`
9. `docs/ROADMAP/PROJECT_STATUS.md`
10. `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Verify the frontend path exists before editing:

```txt
frontend/
```

## Frontend Scripture Implementation Status

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

- Do not modify backend APIs unless the Reader exposes a verified blocker.
- Do not import more Bible data.
- Do not read or transform the MDB.
- Do not create a generic search engine.
- Do not implement original language, cross references, or commentary.
- Do not bundle full Bible datasets into the frontend.
