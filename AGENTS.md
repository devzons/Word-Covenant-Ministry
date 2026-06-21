# AGENTS.md

Project: Word Covenant Ministry

Codex, ChatGPT, Cursor, Claude Code, Copilot, and any future coding agent must preserve the repository's Local WP-backed structure and keep frontend, backend, and documentation concerns separate.

# Agent Role Rule

ChatGPT is the Project Lead.

Codex is the Implementation Agent.

Both roles must follow this project constitution, inspect the repository before work, and use repository documentation instead of conversation memory as the source of truth.

# Workflow Trigger Rule

When a user issues one of the following trigger phrases, the agent must read the linked workflow document first and follow it before performing the requested operational work.

- `Word Covenant Ministry 작업 시작`
  - Read `docs/WORKFLOWS/SESSION_START_WORKFLOW.md` first.
- `Word Covenant Ministry 작업 종료`
  - Read `docs/WORKFLOWS/SESSION_END_WORKFLOW.md` first.
- `Word Covenant Ministry 로컬 동기화`
  - Read `docs/WORKFLOWS/LOCAL_SYNC_WORKFLOW.md` first.
- `Word Covenant Ministry Data Package`
  - Read `docs/WORKFLOWS/DATA_PACKAGE_WORKFLOW.md` first.
- `Word Covenant Ministry 라이브 배포`
  - Read `docs/WORKFLOWS/LIVE_DEPLOYMENT_WORKFLOW.md` first.

# Mandatory New Session Start Rule

This rule applies to ChatGPT, Codex, Cursor, Claude Code, Copilot, and any future coding agent.

At the start of every new ChatGPT, Codex, Cursor, Claude Code, Copilot, or future agent session, before the first analysis, code modification, documentation update, file creation, deletion, rename, refactor, import, export, database change, API change, or frontend change, the agent must:

1. Read `AGENTS.md`.
2. Read `docs/DEVELOPMENT_CONSTITUTION.md`.
3. Read `docs/PROJECT_ARCHITECTURE.md`.
4. Read `docs/DECISIONS/*`.
5. Read `docs/ROADMAP/PROJECT_STATUS.md`.
6. Read `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`.
7. Read `docs/ROADMAP/NEXT_TASKS.md`.
8. Read the relevant domain document:
   - frontend work: `docs/FRONTEND_STRUCTURE.md`
   - backend work: `docs/BACKEND_STRUCTURE.md`
   - data/import work: `docs/DECISIONS/0014-bible-import-pipeline-strategy.md` and `docs/DECISIONS/0015-source-data-management-strategy.md`
   - Scripture work: `docs/DECISIONS/0008-scripture-data-model.md`, `docs/DECISIONS/0009-bible-storage-strategy.md`, `docs/DECISIONS/0010-original-language-data-model.md`, and `docs/DECISIONS/0012-scripture-relationship-model.md`
   - content/CPT work: `docs/DECISIONS/0013-content-domain-model.md`
9. Inspect the actual filesystem.
10. Verify the Git repository root.
11. Run `git status`.
12. Verify the target path exists.
13. Compare documentation against actual structure.
14. Report Current Phase, Completed Work, Current Objective, Next Objective, and Known Constraints.
15. Only then make changes.

Required commands before first implementation in a new session:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Conversation memory is not enough.
Previous chat history is not enough.
Agent assumptions are not enough.
Documentation plus filesystem inspection is required at the start of every new session.

# Same Session Continuation Rule

Within the same ChatGPT, Codex, Cursor, Claude Code, Copilot, or future agent session, follow-up tasks do not require rereading every ADR and ROADMAP document by default.

For same-session continuation, the agent must still inspect the relevant scope before changing anything:

1. Run `git status`.
2. Verify the target file or directory exists.
3. Read the relevant target files before editing.
4. Read only the relevant documentation when the task changes project state, architecture, API behavior, database schema, frontend routes, source data handling, import pipeline behavior, or roadmap status.
5. Preserve the official repository structure and target path rules.

Examples:

- Styling tweak: inspect `git status`, the target component, and any directly relevant design document.
- Backend endpoint change: inspect `git status`, relevant backend docs, route/controller files, and target repository/service files.
- Schema or import change: inspect `git status`, relevant ROADMAP or ADR documents, `SchemaInstaller` or import files, and target files.
- New phase transition: inspect `git status` and the ROADMAP documents before updating status or implementing work.

# Re-read Trigger Rule

Even within the same session, the agent must reread the full new-session set or the relevant subset when any of these triggers occur:

- A new phase begins.
- Architecture changes.
- Database schema changes.
- API contract changes.
- Repository structure changes.
- Source data or import pipeline changes.
- Documentation conflicts with the filesystem or implementation.
- `git status` shows unexpected changes.
- The agent is not confident about current state.
- The user says "새 창", "새 세션", "다시 시작", "new session", or equivalent.

# Mandatory Project State Verification Rule

At the start of every new session, before starting the first task, the agent must verify the current project state from:

1. `docs/ROADMAP/PROJECT_STATUS.md`
2. `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`
3. `docs/ROADMAP/NEXT_TASKS.md`

`docs/ROADMAP/PROJECT_STATUS.md` is the source of truth for the current project state, current phase, completed work, active objective, next objective, and blockers.

Before the first code modification, documentation update, file creation, API change, frontend change, or backend change in a new session, the agent must report:

- current phase
- completed phase
- active objective
- next task
- blocked items if any
- whether the requested work belongs to the current phase

For same-session continuation, repeat this report only when the task changes phase, project state, architecture, API contracts, database schema, import pipeline, roadmap status, or when a re-read trigger applies.

# Phase Gate Rule

Before first implementation or documentation changes in a new session, the agent must compare the requested work against the current phase documented in `docs/ROADMAP/PROJECT_STATUS.md`.

For same-session continuation, compare against the already verified phase context unless the work changes phase, changes roadmap status, or a re-read trigger applies.

If the requested work belongs to a future phase instead of the current phase, the agent must:

1. Stop.
2. Explain the dependency.
3. Ask for approval before proceeding.

# New Window / New Session Rule

In every new ChatGPT, Codex, Cursor, Claude Code, or Copilot session, conversation memory and previous chat history are not trusted as source of truth.

The agent must reread repository documentation and reconstruct current state from ROADMAP documents before work begins.

Default new-session startup order:

1. Read `AGENTS.md`.
2. Read `docs/DEVELOPMENT_CONSTITUTION.md`.
3. Read `docs/PROJECT_ARCHITECTURE.md`.
4. Read `docs/DECISIONS/*`.
5. Read `docs/ROADMAP/PROJECT_STATUS.md`.
6. Read `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`.
7. Read `docs/ROADMAP/NEXT_TASKS.md`.
8. Inspect filesystem.
9. Verify git root.
10. Run `git status`.
11. Report current phase before implementation.

This full startup order is for a new window, new Codex session, new ChatGPT session, or explicit restart. It is not required for every small follow-up task in the same active session unless a re-read trigger applies.

# Roadmap Documentation Rule

When project progress changes, update `docs/ROADMAP/`.

ROADMAP updates are required for:

- phase completion
- new phase start
- current work objective changes
- blockers
- API implementation location decisions
- frontend route decisions
- Scripture Engine roadmap changes
- Search, Reader, Original Language, Cross Reference, or Commentary phase changes

Authority relationship:

- `AGENTS.md` and `docs/DEVELOPMENT_CONSTITUTION.md` are the top-level rules.
- `docs/ROADMAP/*` is the source of truth for current status and next work.

# No Code Change Without Inspection Rule

No code may be modified until the repository structure and relevant documentation have been inspected in the current session.

If an agent cannot inspect the repository, it must not pretend that it did.
It must provide instructions or a Codex prompt instead.

# ChatGPT and Codex Shared Responsibility Rule

Both ChatGPT and Codex must follow the same project constitution.

ChatGPT may use current verified session context for same-session continuation, but must reread the full new-session set when a new session begins or a re-read trigger applies.

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

For same-session continuation, Codex may rely on already verified session context and inspect only the relevant files and docs required for the requested change, plus `git status`, unless a re-read trigger applies.

# Repository Inspection Rule (Highest Priority)

At the start of every new session before first implementation, and during same-session continuation for the relevant target scope:

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
http://api.wordcovenantministry.local
```

Agents must follow ADR-0006 Development Port Standard.

- Do not use port 3000.
- Do not assume port 3000.
- New frontend scripts must use port 3030.
- Documentation examples must use port 3030.
- Environment examples must use port 3030.
- Future agent-generated commands must use port 3030 unless explicitly overridden.

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
