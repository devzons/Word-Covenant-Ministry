# Project Architecture

Word Covenant Ministry uses a headless architecture with a clear split between the Next.js frontend and the Local WP backend.

## Repository Inspection Rule

Repository inspection is mandatory and takes precedence over implementation work. Before any structural, code, deployment, build configuration, or documentation change, verify the current Git root, working tree, and filesystem paths.

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Never assume paths from memory or previous conversations. If documentation and the filesystem disagree, inspect first and update documentation before changing code.

## Core Development Constitution

Architecture work must follow these constitutional rules:

- Repository Inspection Rule: inspect and verify the current repository structure before any change.
- Documentation First Rule: update documentation first when an architecture, API, deployment, backend, frontend, infrastructure, or structure change affects project knowledge.
- Project Memory Rule: repository documentation is the source of truth, not conversation history or agent memory.
- Decision Recording Rule: future-impacting architecture, structure, deployment, Cloudflare, plugin, frontend, API, and scripture engine decisions must be recorded in `docs/DECISIONS/`.
- Existing Code First Rule: search existing code first, reuse before creating, extend before replacing, refactor before duplicating, and never create duplicate implementations.
- Smallest Change Rule: fix only what was requested; do not refactor, rename, move, reformat, modernize, or change architecture unless requested.
- No Assumption Rule: never assume paths, APIs, environment variables, plugin structure, database schema, file locations, deployment settings, or existing functionality.
- Validation Before Completion Rule: run relevant validation before reporting completion.

## Project Knowledge Hierarchy

Highest authority:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/DECISIONS/*`
4. `docs/PROJECT_ARCHITECTURE.md`
5. `docs/BACKEND_STRUCTURE.md`
6. `docs/FRONTEND_STRUCTURE.md`
7. Source Code

If source code conflicts with documented architecture, inspect first, document findings, and do not assume.

## Decision Records

Architecture Decision Records live in:

```txt
docs/DECISIONS/
```

Create a decision record for architecture changes, repository structure changes, deployment changes, Cloudflare strategy changes, plugin structure changes, frontend structure changes, API architecture changes, and scripture engine changes.

## System Roles

- Frontend: Next.js application in `frontend/`
- Backend CMS: WordPress through Local WP in `backend/`
- Core plugin: `backend/app/public/wp-content/plugins/wcm-core/`
- Documentation: `docs/`
- Source data archive: `docs/data-sources/`
- Media/CDN/WAF/DNS: Cloudflare
- Frontend hosting: Vercel
- Backend local development: Local WP

## Environment Endpoints

Local frontend:

```txt
http://wordcovenantministry.local:3030
```

Local WP / backend API:

```txt
http://api.wordcovenantministry.local
```

WordPress REST API base:

```txt
http://api.wordcovenantministry.local/wp-json
```

WCM REST API namespace:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1
```

Example WCM Bible endpoint:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

If Local WP generates a different backend URL, inspect Local WP and use that generated URL.

Production frontend:

```txt
https://wordcovenantministry.org
```

Production API:

```txt
https://api.wordcovenantministry.org
```

## Official Repository Structure

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
│   └── data-sources/
├── .gitignore
├── README.md
└── AGENTS.md
```

## Active Plugin Source

The only official plugin source path is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Do not move files, create symlinks, or create another plugin source path.

Never create alternative structures such as:

```txt
backend/wcm-core
backend/plugin/wcm-core
app/plugins/wcm-core
```

unless they already exist and are documented.

Do not use these paths for active project work:

```txt
backend/wcm-core/
backend/plugin/wcm-core/
app/public/wp-content/plugins/wcm-core/
```

## Data Flow

1. Editors manage content in WordPress through Local WP.
2. `wcm-core` defines custom WordPress logic, API behavior, content modeling, SEO helpers, scripture features, and media integration.
3. Next.js reads content through WordPress APIs.
4. Cloudflare handles media delivery, CDN, WAF, and DNS concerns.
5. Vercel hosts the frontend.
