# Scripture-Anchored Timeline MVP Browser QA / UX Polish Plan

## Purpose

CR-84 plans browser QA and UX polish for the Scripture-Anchored Timeline MVP after CR-82 implementation and CR-83 available validation.

This is planning only. It does not authorize implementation changes.

## Current Validation State

- `cd frontend && npm run typecheck` passed
- `cd frontend && npm run lint` passed
- `cd frontend && npm run build` passed
- `git diff --check` passed
- the build output included `/[locale]/timeline`
- route smoke and browser validation remained limited

## Browser QA Gap

The following have not yet been visually validated in a browser:

- actual browser rendering
- desktop layout
- mobile layout
- click behavior
- Open in Reader behavior
- keyboard navigation
- focus behavior
- hydration warnings
- visual spacing and copy

## Local Route Smoke Issue

Local route smoke was checked with `lsof` and `curl`.

Findings:

- `lsof -nP -iTCP:3030 -sTCP:LISTEN` showed a `node` process listening on port `3030`
- `curl -I http://wordcovenantministry.local:3030/ko/timeline` failed to connect
- `curl -I http://wordcovenantministry.local:3030/en/timeline` failed to connect
- `curl -I http://127.0.0.1:3030/ko/timeline` failed to connect
- `curl -I http://127.0.0.1:3030/en/timeline` failed to connect

This is currently best classified as a local runtime accessibility issue, not an implementation failure, unless the server is confirmed reachable and the route still fails.

Possible contributing factors to investigate later:

- no effective listener on the expected host binding
- hostname binding or proxy behavior
- dev server restart requirement
- local runtime startup state

`frontend/package.json` is not being changed in this task.

## Browser QA Checklist

Future browser QA should verify:

- `/ko/timeline` loads
- `/en/timeline` loads
- no console errors
- no hydration warnings
- header and footer layout are correct
- Scripture Timeline tab is active
- future tabs are disabled
- filters display as MVP/static
- event selection works
- detail panel updates
- Scripture Anchor appears first
- Open in Reader links work
- dating and confidence notes are visible
- no Bible text duplication
- mobile layout is usable
- keyboard navigation is usable

## UX Polish Candidate List

Priority P0:

- route accessibility and local server startup reliability if the issue is reproducible

Priority P1:

- Open in Reader link clarity
- selected event visual state
- mobile spacing
- disabled future tab copy
- dating and confidence readability

Priority P2:

- filter bar refinement
- panel sticky behavior
- future overlay note styling
- long-term timeline view tabs

## Scope Boundaries

CR-84 does not authorize implementation.

Not approved:

- code changes
- route changes
- component edits
- `package.json` edits
- backend work
- API changes
- DB/schema/migration/import work
- generated data
- Cross Reference behavior changes
- Gospel Harmony behavior changes
- `ScriptureResearchWorkspaceProvider` changes

## Recommended Next Step

CR-85 — Scripture-Anchored Timeline MVP Browser QA / UX Polish Approval Review

After CR-85, a later phase may approve a narrow polish implementation if needed.
