# Project Status

## Date

2026-06-18

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
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.

## Current Phase Summary

Current phase:

```txt
Phase 4 - Frontend Bible Search Results MVP
```

Completed phase:

```txt
Scripture Engine Foundation, KRV Bible Lookup API, Bible Search API, Bible Chapter API, and Frontend Bible Reader MVP
```

Active objective:

```txt
Render paginated frontend Bible search results using the backend Bible Search API.
```

Next task:

```txt
Verify the Frontend Bible Reader and Bible Search Results MVPs in the browser against the Local WP API.
```

Blocked items:

```txt
None documented.
```

Current phase boundary:

```txt
Frontend Bible Search Results MVP belongs to the current phase. Generic search engine, original language import, cross references, and commentary features are future phases.
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
