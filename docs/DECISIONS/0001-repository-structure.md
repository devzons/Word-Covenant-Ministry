# ADR-0001 Repository Structure

## Status

Accepted

## Date

2026-06-17

## Context

The project needs one documented repository structure that all agents and contributors can verify before making changes.

## Decision

The official repository structure is:

```txt
wordcovenantministry/
├── frontend/
├── backend/
│   └── app/
│       └── public/
│           └── wp-content/
│               └── plugins/
│                   └── wcm-core/
├── docs/
├── AGENTS.md
├── README.md
└── .gitignore
```

`frontend/` contains the Next.js application. `backend/` contains the Local WP backend. `docs/` contains project documentation and decision records.

## Consequences

Agents must inspect the filesystem before changing paths. New structures require documentation and approval before implementation.

The repository may contain Local WP runtime files locally, but generated runtime content must not redefine the official source ownership model.

## Alternatives Considered

- Store the plugin under `backend/wcm-core/`: rejected because the active plugin source is inside Local WP.
- Store the plugin under `backend/plugin/wcm-core/`: rejected because it creates an alternate plugin hierarchy.
- Split frontend and backend into separate repositories: deferred because the current project is managed as one repository.
