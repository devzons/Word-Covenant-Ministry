# ADR-0005 Scripture Engine First

## Status

Accepted

## Date

2026-06-17

## Context

Word Covenant Ministry's domain centers on Scripture. Content, teaching, media, search, and ministry resources should support Scripture relationships rather than exist as unrelated content silos.

## Decision

Scripture is the primary domain model.

Content exists to support Scripture relationships.

Scripture engine changes must be documented through decision records because they affect core content modeling, APIs, frontend rendering, search, SEO, and ministry workflows.

## Consequences

New content features should be evaluated by how they relate to Scripture.

Scripture-related backend logic belongs in the `wcm-core` plugin, especially the `src/Scripture/` area when applicable.

Scripture-related frontend rendering belongs in the frontend scripture components and WordPress data integration areas.

## Alternatives Considered

- Treat Scripture as plain text content: rejected because relationships and references are core to the ministry domain.
- Build generic content first and add Scripture later: rejected because Scripture should shape the primary data model from the start.
- Keep Scripture logic only in the frontend: rejected because Scripture relationships must be represented consistently in backend modeling and APIs.
