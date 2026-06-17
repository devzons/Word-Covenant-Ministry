# ADR-0003 Headless Architecture

## Status

Accepted

## Date

2026-06-17

## Context

Word Covenant Ministry needs a web architecture that separates the public frontend experience from CMS editing and backend domain logic.

## Decision

The project follows a headless architecture:

- Frontend: Next.js
- Backend: WordPress
- Core Plugin: `wcm-core`

Next.js owns the public application experience. WordPress owns content management. `wcm-core` owns custom WordPress behavior, domain modeling, APIs, scripture features, search, SEO, media integration, and settings.

## Consequences

Frontend concerns belong in `frontend/`. WordPress plugin concerns belong in `backend/app/public/wp-content/plugins/wcm-core/`.

The frontend consumes WordPress APIs instead of embedding WordPress runtime logic.

## Alternatives Considered

- Traditional WordPress theme frontend: rejected because the project requires a dedicated Next.js frontend.
- Next.js-only CMS: rejected because WordPress remains the backend CMS.
- Multiple custom plugins: rejected for now because `wcm-core` is the official core plugin.
