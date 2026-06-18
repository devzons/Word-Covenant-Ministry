# Git Workflow

Use Git in a way that keeps generated Local WP files, secrets, and runtime assets out of the repository while preserving the active plugin source.

## Repository Inspection Rule

Before any code modification, file creation, movement, refactor, rename, deletion, build configuration change, deployment change, or documentation update, inspect and verify the current repository structure.

For structural changes, run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

If a requested path does not exist, stop, inspect, report findings, and ask for confirmation before creating a new structure.

## Core Development Constitution

Every Git workflow must honor these constitutional rules:

- Repository Inspection Rule: inspect first and verify paths from the filesystem.
- Documentation First Rule: update documentation first when a change affects project knowledge.
- Existing Code First Rule: search existing code before creating new files, classes, components, controllers, hooks, utilities, services, endpoints, or helpers.
- Smallest Change Rule: fix only what was requested and avoid unrelated refactors, renames, moves, formatting, modernization, or architecture changes.
- No Assumption Rule: never assume paths, APIs, environment variables, plugin structure, database schema, file locations, deployment settings, or existing functionality.
- Validation Before Completion Rule: run relevant validation before reporting completion.

## Before Starting Work

```bash
git status --short
```

Review existing changes before editing. Do not overwrite unrelated work.

## During Work

- Keep frontend changes in `frontend/`.
- Keep WordPress plugin changes in `backend/app/public/wp-content/plugins/wcm-core/`.
- Keep documentation changes in `docs/`.
- Update docs before changing the repository structure.
- Do not move files or create symlinks for the plugin.
- Avoid unrelated formatting or refactors.
- Preserve the confirmed local URL strategy: frontend at `http://wordcovenantministry.local:3030`, backend API at `http://api.wordcovenantministry.local`, and WordPress REST at `http://api.wordcovenantministry.local/wp-json`.
- Frontend local `NEXT_PUBLIC_API_URL` should use `http://api.wordcovenantministry.local/wp-json`, not `http://wordcovenantministry.local/wp-json`, unless explicitly changed.

## Before Commit

Inspect the diff:

```bash
git diff --stat
git diff
```

Run relevant validation:

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

Before any plugin modification, verify `backend/app/public/wp-content/plugins/wcm-core/` exists. Before any frontend modification, verify `frontend/` exists.

## Never Commit

- `backend/app/public/wp-content/uploads/`
- `backend/app/public/wp-content/cache/`
- `backend/app/public/wp-content/upgrade/`
- `backend/app/public/wp-content/debug.log`
- `backend/sql/`
- `backend/logs/`
- `backend/conf/`
- `backend/run/`
- SQL dumps or database exports
- `wp-config.php`
- Secrets, keys, certificates, or `.env` files
- Build outputs, caches, logs, or dependency directories unless required

## Must Remain Trackable

The root `.gitignore` must not ignore:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

`vendor/` inside the plugin may be ignored during early development. It may be committed later only if deployment requires bundled Composer dependencies.

## Architecture Protection

Agents must never move plugin files, rename core directories, create duplicate plugin locations, invent alternative repository layouts, or refactor paths without inspection.
