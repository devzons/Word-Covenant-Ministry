# Next Tasks

## Date

2026-06-18

## Immediate Next Task

Implement the Frontend Bible Reader MVP.

This is frontend source code work and must only happen inside:

```txt
frontend/
```

## Required Pre-Work Before Code Changes

Before implementing Frontend Bible Reader, read:

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

## Frontend Bible Reader Implementation Guidance

Recommended files:

```txt
Create: frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
Create: frontend/src/components/scripture/BibleReader.tsx
Create: frontend/src/lib/api/bible.ts
Create or update: frontend/src/types/bible.ts or frontend/src/types/scripture.ts
```

Recommended route shape:

```txt
/ko/bible/KRV/genesis/1
```

## Required Reader Constraints

The Frontend Bible Reader MVP must:

- fetch only the requested chapter from the backend Chapter API
- never import or bundle a full Bible dataset
- include chapter verse list
- include previous and next chapter links
- include book and chapter selectors
- include a simple search box using paginated backend search
- include API error, loading, and empty states
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

After implementing Frontend Bible Reader, run:

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

Test the local API host:

```bash
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1"
```

## Not In Scope For The Next Task

- Do not modify backend APIs unless the Reader exposes a verified blocker.
- Do not import more Bible data.
- Do not read or transform the MDB.
- Do not create a generic search engine.
- Do not implement original language, cross references, or commentary.
- Do not bundle full Bible datasets into the frontend.
