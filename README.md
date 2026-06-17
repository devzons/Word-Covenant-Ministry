# Word Covenant Ministry

Word Covenant Ministry is a headless ministry web platform. The frontend is a Next.js application, and the backend is a Local WP WordPress site with one active custom plugin: `wcm-core`.

## Repository Inspection Rule

Before any code modification, file creation, movement, refactor, rename, deletion, build configuration change, deployment change, or documentation update, every coding agent must inspect the repository and verify paths from the filesystem.

Mandatory inspection for structural changes:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Never assume paths from memory or previous conversations. If documentation and the filesystem disagree, inspect first and update documentation before changing code. If a requested path does not exist, stop, inspect, report findings, and ask for confirmation before creating a new structure.

Confirmed repository:

```txt
https://github.com/devzons/Word-Covenant-Ministry
```

Confirmed branch:

```txt
main
```

Confirmed repository root:

```txt
wordcovenantministry/
```

## Core Development Constitution

These rules are constitutional rules, not suggestions.

1. Repository Inspection Rule: highest priority. Inspect the repository, verify paths from the filesystem, verify the Git root, and never assume paths from memory or previous conversations.
2. Documentation First Rule: before implementing any feature, structure change, API change, deployment change, backend change, frontend change, or infrastructure change, inspect and update documentation first if the change affects project knowledge.
3. Project Memory Rule: repository documentation is the permanent memory and source of truth. Conversation history and agent memory are not sources of truth.
4. Decision Recording Rule: future-impacting architecture, structure, deployment, Cloudflare, plugin, frontend, API, and scripture engine decisions must be recorded in `docs/DECISIONS/`.
5. Existing Code First Rule: before creating any new file, class, component, controller, hook, utility, service, endpoint, or helper, search existing code first. Reuse before creating, extend before replacing, refactor before duplicating, and never create duplicate implementations.
6. Smallest Change Rule: fix only what was requested. Do not refactor unrelated code, rename unrelated files, move unrelated directories, reformat unrelated code, modernize unrelated code, or change architecture unless requested.
7. No Assumption Rule: never assume paths, APIs, environment variables, plugin structure, database schema, file locations, deployment settings, or existing functionality. Always inspect first.
8. Validation Before Completion Rule: before reporting completion, run relevant validation and report any checks that could not run.

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

Decision records belong in:

```txt
docs/DECISIONS/
```

Every decision document should contain:

```txt
Title
Status
Date
Context
Decision
Consequences
Alternatives Considered
```

## Architecture Summary

- Frontend: Next.js in `frontend/`
- Backend CMS: WordPress through Local WP in `backend/`
- Core plugin: `backend/app/public/wp-content/plugins/wcm-core/`
- Media, CDN, WAF, and DNS: Cloudflare
- Frontend hosting: Vercel
- Backend local development: Local WP

## Environment Endpoints

Local frontend:

```txt
http://wordcovenantministry.local:3030
```

Local WP backend:

```txt
http://wordcovenantministry.local
```

If Local WP generates a different backend URL, inspect Local WP and use that generated URL.

Production:

```txt
https://wordcovenantministry.org
https://api.wordcovenantministry.org
```

## Folder Structure

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
├── .gitignore
├── README.md
└── AGENTS.md
```

## Local Setup

1. Clone the repository.
2. Install frontend dependencies in `frontend/`.
3. Open the Local WP backend from `backend/`.
4. Confirm the plugin exists at `backend/app/public/wp-content/plugins/wcm-core/`.
5. Activate `wcm-core` in WordPress if it is not already active.

Do not move files or create symlinks for the plugin. The active plugin source is already inside the Local WP backend tree.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Use `.env.example` as the template for local frontend environment variables. Do not commit `.env`, `.env.local`, or other secret-bearing env files.

## Backend Setup

The backend is the Local WP backend:

```txt
backend/
```

The active custom plugin source is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

All custom WordPress logic belongs in that plugin path.

Composer namespace:

```json
{
  "autoload": {
    "psr-4": {
      "WCM\\": "src/"
    }
  }
}
```

## Git Safety Rules

Do not commit:

- Uploads or media files
- Cache or upgrade folders
- SQL dumps or database exports
- `wp-config.php`
- Secrets or `.env` files
- Local WP logs, generated SQL folders, runtime folders, or configuration folders
- Build outputs, caches, logs, or dependency folders unless explicitly required

The root `.gitignore` must keep this path trackable:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

`vendor/` inside the plugin may be ignored during early development. It may be committed later only if deployment requires bundled Composer dependencies.

## Validation Commands

Run the checks relevant to your changes:

```bash
git status
git diff --check
find backend/app/public/wp-content/plugins/wcm-core -name '*.php' -print0 | xargs -0 -n1 php -l
cd backend/app/public/wp-content/plugins/wcm-core && composer dump-autoload
```

For frontend changes:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

See the `docs/` directory for architecture, setup, structure, Git workflow, and Cloudflare media guidance.
