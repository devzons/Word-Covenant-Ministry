# AGENTS.md

Project: Word Covenant Ministry

Codex, ChatGPT, Cursor, Claude Code, Copilot, and any future coding agent must preserve the repository's Local WP-backed structure and keep frontend, backend, and documentation concerns separate.

# Repository Inspection Rule (Highest Priority)

Before making any change:

1. Inspect the current repository structure.
2. Verify actual paths from the filesystem.
3. Verify the current Git repository root.
4. Verify the target file exists.
5. Verify the target directory exists.
6. Verify documentation matches reality.
7. Never assume a path from memory.
8. Never assume a path from previous conversations.
9. Never create new project structures without first verifying the existing structure.
10. If documentation and filesystem disagree, inspect first and update documentation before changing code.

Mandatory commands before structural changes:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

If a requested path does not exist:

- Stop.
- Inspect.
- Report findings.
- Ask for confirmation before creating a new structure.

Never create alternative structures such as:

```txt
backend/wcm-core
backend/plugin/wcm-core
app/plugins/wcm-core
```

unless they already exist and are documented.

Always verify the official project structure first.

Repository inspection is mandatory and takes precedence over all coding instructions.

## Confirmed Official Structure

Repository:

```txt
https://github.com/devzons/Word-Covenant-Ministry
```

Branch:

```txt
main
```

Repository root:

```txt
wordcovenantministry/
```

Official structure:

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

Frontend application:

```txt
frontend/
```

WordPress plugin source:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Documentation:

```txt
docs/
```

## Change Validation Rule

Before any commit:

```bash
git status
git diff --check
```

Before any structural change:

```bash
git rev-parse --show-toplevel
find . -maxdepth 5 -type d | sort
```

Before any plugin modification, verify this path exists:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Before any frontend modification, verify this path exists:

```txt
frontend/
```

## Development Port Standard Rule

Port 3000 is reserved and may already be in use.

Word Covenant Ministry frontend development uses:

```txt
http://wordcovenantministry.local:3030
```

Frontend standard:

```txt
Port 3030
```

Backend:

```txt
Use Local WP assigned URL.
```

Agents must follow ADR-0006 Development Port Standard.

- Do not use port 3000.
- Do not assume port 3000.
- New frontend scripts must use port 3030.
- Documentation examples must use port 3030.
- Environment examples must use port 3030.
- Future agent-generated commands must use port 3030 unless explicitly overridden.

## Architecture Protection Rule

Agents must never:

- move plugin files
- rename core directories
- create duplicate plugin locations
- invent alternative repository layouts
- refactor paths without inspection

## Directory Creation Rule

No new directory may be created without inspection.

Before creating a new directory:

1. Inspect the existing structure.
2. Verify that a suitable directory does not already exist.
3. Verify the directory belongs to the correct ownership area.
4. Explain why a new directory is required.

New directories should be exceptional.

Prefer:

- reuse existing directories
- extend existing modules
- place code in the correct ownership area

Do not create:

```txt
helpers2/
utils-new/
services-v2/
api2/
new-components/
misc/
temp/
test2/
```

or any equivalent duplicate structure.

## Plugin Structure Protection Rule

The official plugin root is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Within the plugin, new top-level directories may not be created without justification.

Preferred plugin structure:

```txt
wcm-core/
├── src/
│   ├── Core/
│   ├── Admin/
│   ├── Api/
│   ├── PostTypes/
│   ├── Taxonomies/
│   ├── Scripture/
│   ├── Media/
│   ├── Search/
│   ├── Seo/
│   └── Settings/
├── assets/
├── languages/
└── tests/
```

Before creating a new top-level plugin directory:

- inspect existing directories
- document the reason
- verify it does not belong in an existing directory

## Source Tree Preservation Rule

The source tree is part of the architecture.

Agents must preserve the structure.

Do not create alternate hierarchies.

Do not create parallel implementations.

Do not create duplicate modules.

## Structural Change Approval Rule

Any change involving:

- new top-level directory
- new architecture layer
- new module category
- major folder reorganization

must be documented first and explicitly approved before implementation.

## Documentation First Rule

Before implementing any feature, structure change, API change, deployment change, backend change, frontend change, or infrastructure change, inspect and update documentation first if the change affects project knowledge.

Project knowledge includes repository structure, source locations, public APIs, WordPress plugin behavior, frontend routing, environment variables, deployment settings, Cloudflare settings, validation commands, and workflow rules.

## Project Memory Rule

Documentation is the permanent memory of the project.

Conversation history is not the source of truth.

Agent memory is not the source of truth.

The repository documentation is the source of truth.

If a decision will affect future development, it must be documented.

## Decision Recording Rule

The following must create a Decision Record:

- architecture changes
- repository structure changes
- deployment changes
- Cloudflare strategy changes
- plugin structure changes
- frontend structure changes
- API architecture changes
- scripture engine changes

Decision records belong in:

```txt
docs/DECISIONS/
```

## Architecture Decision Record Format

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

## Project Knowledge Hierarchy

Highest authority:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/DECISIONS/*`
4. `docs/PROJECT_ARCHITECTURE.md`
5. `docs/BACKEND_STRUCTURE.md`
6. `docs/FRONTEND_STRUCTURE.md`
7. Source Code

If source code conflicts with documented architecture:

- inspect first
- document findings
- do not assume

## Existing Code First Rule

Before creating any new file, class, component, controller, hook, utility, service, endpoint, or helper:

- Search existing code first.
- Reuse before creating.
- Extend before replacing.
- Refactor before duplicating.
- Never create duplicate implementations.

## Smallest Change Rule

Fix only what was requested.

Do not:

- refactor unrelated code
- rename unrelated files
- move unrelated directories
- reformat unrelated code
- modernize unrelated code
- change architecture unless requested

## No Assumption Rule

Never assume paths, APIs, environment variables, plugin structure, database schema, file locations, deployment settings, or existing functionality.

Always inspect first.

## Validation Before Completion Rule

Before reporting completion, run relevant validation.

For frontend changes:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

For documentation-only changes:

```bash
git status
git diff --check
```

For plugin changes:

```bash
find backend/app/public/wp-content/plugins/wcm-core -name '*.php' -print0 | xargs -0 -n1 php -l
cd backend/app/public/wp-content/plugins/wcm-core && composer dump-autoload
```

If validation cannot run because a tool, dependency, script, or service is unavailable, report exactly what was skipped and why.

## Official Structure

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

## Source Locations

- `frontend/` is the Next.js application.
- `backend/` is the Local WP backend.
- `backend/app/public/wp-content/plugins/wcm-core/` is the active WordPress plugin source.
- `docs/` contains project documentation.

## Non-Negotiable Rules

- Always preserve the official structure above.
- Repository inspection is the highest-priority rule.
- Update documentation first when a requested change affects project knowledge.
- Record future-impacting decisions in `docs/DECISIONS/`.
- Treat repository documentation, not conversation history or agent memory, as the source of truth.
- Search existing code before creating new code.
- Make the smallest change that satisfies the request.
- Never assume paths, APIs, schema, environment, or deployment details.
- Never move the plugin source out of `backend/app/public/wp-content/plugins/wcm-core/`.
- Never create a second plugin source path.
- Do not create symlinks for the plugin.
- Keep frontend and backend concerns separate.
- Frontend changes belong only in `frontend/`.
- WordPress plugin changes belong only in `backend/app/public/wp-content/plugins/wcm-core/`.
- Documentation changes belong in `docs/`.
- Before changing structure, update the docs first.

## Git Safety Rules

Never commit:

- Secrets or `.env` files
- `wp-config.php`
- SQL dumps or database exports
- Uploads, cache, upgrade files, or media library files
- Local WP logs, generated SQL folders, runtime folders, or configuration folders
- Build outputs, caches, logs, or dependency directories unless explicitly required

The root `.gitignore` must not ignore:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

It must ignore generated backend paths such as:

```txt
backend/app/public/wp-content/uploads/
backend/app/public/wp-content/cache/
backend/app/public/wp-content/upgrade/
backend/app/public/wp-content/debug.log
backend/sql/
backend/logs/
backend/conf/
backend/run/
```

## Validation Before Commit

Before committing, run checks appropriate to the files changed:

- Frontend: `cd frontend && npm run typecheck && npm run lint && npm run build`
- Backend PHP syntax when plugin files changed: `find backend/app/public/wp-content/plugins/wcm-core -name '*.php' -print0 | xargs -0 -n1 php -l`
- Composer autoload when PHP classes changed: `cd backend/app/public/wp-content/plugins/wcm-core && composer dump-autoload`
- Documentation-only: `git status && git diff --check`

If a check cannot run because dependencies or tools are missing, document that in the final response or commit notes.
