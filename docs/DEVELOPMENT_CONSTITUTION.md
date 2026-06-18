# Development Constitution

These rules protect the official Local WP-backed structure and prevent generated files or secrets from entering source control.

# Mandatory Session Start Rule

This rule applies to ChatGPT, Codex, Cursor, Claude Code, Copilot, and any future coding agent.

At the start of every new coding session, before any code modification, documentation update, file creation, deletion, rename, refactor, import, export, database change, API change, or frontend change, the agent must:

1. Read `AGENTS.md`.
2. Read `docs/DEVELOPMENT_CONSTITUTION.md`.
3. Read `docs/PROJECT_ARCHITECTURE.md`.
4. Read the relevant domain document:
   - frontend work: `docs/FRONTEND_STRUCTURE.md`
   - backend work: `docs/BACKEND_STRUCTURE.md`
   - data/import work: `docs/DECISIONS/0014-bible-import-pipeline-strategy.md` and `docs/DECISIONS/0015-source-data-management-strategy.md`
   - Scripture work: `docs/DECISIONS/0008-scripture-data-model.md`, `docs/DECISIONS/0009-bible-storage-strategy.md`, `docs/DECISIONS/0010-original-language-data-model.md`, and `docs/DECISIONS/0012-scripture-relationship-model.md`
   - content/CPT work: `docs/DECISIONS/0013-content-domain-model.md`
5. Inspect the actual filesystem.
6. Verify the Git repository root.
7. Run `git status`.
8. Verify the target path exists.
9. Compare documentation against actual structure.
10. Only then make changes.

Required commands before any code change:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Conversation memory is not enough.
Previous chat history is not enough.
Agent assumptions are not enough.
Documentation plus filesystem inspection is required every session.

# No Code Change Without Inspection Rule

No code may be modified until the repository structure and relevant documentation have been inspected in the current session.

If an agent cannot inspect the repository, it must not pretend that it did.
It must provide instructions or a Codex prompt instead.

# ChatGPT and Codex Shared Responsibility Rule

Both ChatGPT and Codex must follow the same project constitution.

ChatGPT must not give implementation prompts that violate:

- the confirmed repository structure
- official plugin path
- local URL strategy
- documentation-first rule
- inspection-first rule
- file size and performance rule
- source data management strategy

Codex must not modify code until it has inspected:

- `AGENTS.md`
- `docs/DEVELOPMENT_CONSTITUTION.md`
- relevant docs
- actual file structure
- git status

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

Source data archive:

```txt
docs/data-sources/
```

Do not use these paths for active project work:

```txt
backend/wcm-core/
backend/plugin/wcm-core/
app/public/wp-content/plugins/wcm-core/
```

## Local URL Strategy Rule

Confirmed local development URLs:

```txt
Frontend: http://wordcovenantministry.local:3030
Local WP / Backend API: http://api.wordcovenantministry.local
WordPress REST API base: http://api.wordcovenantministry.local/wp-json
WCM REST API namespace: http://api.wordcovenantministry.local/wp-json/wcm/v1
```

Example WCM Bible endpoint:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

Frontend local `NEXT_PUBLIC_API_URL` must point to:

```txt
http://api.wordcovenantministry.local/wp-json
```

Do not use this URL for local frontend API configuration unless the local API host is explicitly changed:

```txt
http://wordcovenantministry.local/wp-json
```

Production frontend:

```txt
https://wordcovenantministry.org
```

Future production API:

```txt
https://api.wordcovenantministry.org
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

## Best Practice and Scalability Rule

All code must follow best practices and be designed for long-term scalability.

Requirements:

- clear, maintainable code
- typed interfaces where applicable
- explicit data shapes
- separated responsibilities
- reusable utilities
- no duplicate logic
- no unnecessary abstractions
- small focused files
- safe failure behavior
- input validation
- no hardcoded secrets
- no hardcoded environment assumptions
- APIs and data models should be extendable
- avoid quick hacks and temporary shortcuts

Temporary workarounds are allowed only when necessary and must be documented with:

- TODO
- reason
- risk
- future removal plan

This rule applies to:

- frontend
- backend plugin
- APIs
- Scripture Engine
- media integration
- Cloudflare integration
- documentation

## File Size and Performance Rule

All generated files, imports, exports, API responses, and frontend bundles must be designed with file size and performance in mind.

Requirements:

- Do not commit large generated data files by default.
- Do not bundle full Bible datasets into the frontend.
- Do not return full Bible datasets from API endpoints.
- Use custom tables as production storage for Bible text.
- Use reference-based lookup for Bible passages.
- Use pagination or chunking for large result sets.
- Use batch processing for large imports.
- Use streaming or memory-conscious readers where practical.
- Keep generated JSON files ignored unless explicitly approved.
- Review file size before committing any new file larger than 1MB.
- Document the reason before committing any file larger than 5MB.
- Never commit raw Bible source files unless explicitly approved.
- Prefer DB storage over static frontend payloads for Scripture data.
- Avoid duplicate generated exports.

This rule applies to:

- KRV
- WEB
- OSHB
- SBLGNT
- import/export tools
- frontend API clients
- REST API endpoints
- media metadata
- generated JSON
- future search indexes

## Security First Rule

Security is a feature, not an afterthought.

Requirements:

- validate all inputs
- sanitize all outputs
- escape rendered content
- follow WordPress security best practices
- follow Next.js security best practices
- principle of least privilege
- never expose secrets
- never commit secrets
- environment variables must be used for sensitive values
- fail safely
- log safely

Security takes precedence over convenience.

## Migration Safety Rule

Never make breaking changes without a migration plan.

This applies to:

- database schema changes
- API changes
- CPT changes
- taxonomy changes
- scripture model changes

Before implementation, agents must:

1. identify affected systems
2. document migration path
3. document rollback plan
4. document risks

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

## Required Practices

- Preserve the official project structure.
- Inspect and verify the repository before any code modification, file creation, movement, refactor, rename, deletion, build configuration change, deployment change, or documentation update.
- Update documentation first when a requested change affects project knowledge.
- Record future-impacting decisions in `docs/DECISIONS/`.
- Treat repository documentation, not conversation history or agent memory, as the source of truth.
- Search existing code before creating new code.
- Make the smallest change that satisfies the request.
- Never assume paths, APIs, schema, environment, or deployment details.
- Keep frontend and backend concerns separate.
- Put frontend changes only in `frontend/`.
- Put custom WordPress plugin changes only in `backend/app/public/wp-content/plugins/wcm-core/`.
- Put project documentation in `docs/`.
- Update docs before changing repository structure.
- Run relevant validation checks before committing.

## Prohibited Changes

- Do not move the active plugin source out of `backend/app/public/wp-content/plugins/wcm-core/`.
- Do not create a second plugin source path.
- Do not create symlinks for the plugin.
- Do not commit uploads, media library files, cache folders, or upgrade folders.
- Do not commit Local WP logs, generated SQL folders, runtime folders, or configuration folders.
- Do not commit `wp-config.php`.
- Do not commit `.env` files, secrets, keys, or certificates.
- Do not commit SQL dumps or database exports.

## Backend Source Rule

The backend is the Local WP backend:

```txt
backend/
```

The active custom plugin source is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

All custom WordPress behavior must live there.

## Checks Before Commit

Run checks that match the changed files:

```bash
git status
git diff --check
cd frontend && npm run lint
cd frontend && npm run build
find backend/app/public/wp-content/plugins/wcm-core -name '*.php' -print0 | xargs -0 -n1 php -l
cd backend/app/public/wp-content/plugins/wcm-core && composer dump-autoload
```

For frontend changes, the required frontend validation is:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

If a check is not available locally, record why it was skipped.
