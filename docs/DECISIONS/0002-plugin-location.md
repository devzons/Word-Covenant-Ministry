# ADR-0002 Plugin Location

## Status

Accepted

## Date

2026-06-17

## Context

The WordPress backend is developed through Local WP, and the active custom plugin must be edited where WordPress loads it.

## Decision

The official plugin path is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

This path is the source of truth for custom WordPress plugin code.

## Consequences

Plugin changes belong in `backend/app/public/wp-content/plugins/wcm-core/`.

Agents must not create duplicate plugin roots, move plugin files, or use symlinks to alternate source locations without an approved structural decision.

## Alternatives Considered

- `backend/wcm-core/`: rejected as an alternate source location.
- `backend/plugin/wcm-core/`: rejected as an invented hierarchy.
- `app/plugins/wcm-core/`: rejected because it does not match the Local WP WordPress plugin path.
