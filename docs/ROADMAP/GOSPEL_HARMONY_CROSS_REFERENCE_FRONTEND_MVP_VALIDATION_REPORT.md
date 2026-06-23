# Gospel Harmony Cross Reference Frontend MVP Validation Report

## Current Phase

CR-64 - Gospel Harmony Cross Reference Frontend MVP Browser Validation

## Runtime Recovery

The local frontend runtime was recovered from a stale/unreachable Node listener on port `3030`.

Pre-recovery checks:

```txt
lsof -nP -iTCP:3030 -sTCP:LISTEN
curl -I http://wordcovenantministry.local:3030
curl -I http://127.0.0.1:3030
```

Findings:

- Port `3030` had a Node listener.
- The process was confirmed as a frontend Node/Next process with cwd `frontend/`.
- Both official host and `127.0.0.1` were unreachable.
- Only the stale frontend process was stopped.
- One official frontend dev server was started with `npm run dev`.

Post-recovery checks:

```txt
http://wordcovenantministry.local:3030 -> HTTP/1.1 200 OK
http://127.0.0.1:3030 -> HTTP/1.1 200 OK
```

The recovered dev server was left running.

## Routes Checked

Validated routes:

```txt
/ko/gospel-harmony?unit=jesus-baptism
/en/gospel-harmony?unit=feeding-five-thousand
/en/gospel-harmony?unit=transfiguration
```

## Lazy Loading

Passed:

- Related Passages section was present.
- Related Passage cards did not load before user action.
- User action loaded related passages successfully.

## Grouping

Passed:

- Korean `jesus-baptism` grouped results by:
  - `마태복음`
  - `마가복음`
  - `누가복음`
- English `feeding-five-thousand` grouped results by:
  - `Matthew`
  - `Mark`
  - `Luke`
  - `John`
- English `transfiguration` grouped results by:
  - `Matthew`
  - `Mark`
  - `Luke`
- Empty groups were hidden.

## Limits

Passed:

- Maximum observed related passages per account: `3`.
- No account rendered more than `3` cards.

## Editorial Labels

Passed:

- Conservative labels remained visible:
  - `Theme` / `주제`
  - `Unreviewed` / `검토 전`
  - `OpenBible`
- Forbidden labels were not shown:
  - `parallel_event`
  - `fulfilled`
  - `prophecy`
  - `typology`

## Preview Modal

Passed:

- `View passage` / `본문 보기` opened the preview modal.
- Same-chapter preview rendered text.
- ESC close worked.
- Close button worked.
- Focus returned to the triggering button.
- Body scroll cleanup worked.
- Unsupported fallback worked for a long-range related card.

Unsupported fallback fixture:

```txt
Mark 6:31-44
```

## Open In Reader

Passed. Links preserved locale, version, `mode=reader`, and verse hash.

Examples:

```txt
/ko/bible/KRV/matthew/3?mode=reader#v13
/en/bible/WEB/matthew/14?mode=reader#v13
/en/bible/WEB/matthew/17?mode=reader#v1
```

## Failure Handling

Failure behavior was inspected but not artificially simulated.

Implemented behavior remains:

- Successful account groups remain visible.
- A lightweight warning appears when one or more account lookups fail.
- The whole section does not crash for a single failed account lookup.

## Mobile Layout

Passed:

- Mobile viewport checked at `390px`.
- No horizontal overflow was detected.
- Related Passages groups stacked without a cramped multi-column layout.

## Regression Checks

Passed:

- Bible Reader route loaded.
- Reader Related Passages tab worked and showed related cards.
- Word Study/interlinear route smoke loaded without fatal error.
- No Cross Reference backend/API behavior was changed.
- No Word Study behavior was changed.

## Console

No Gospel Harmony React/runtime errors were captured.

Known unrelated warning:

- Existing LocaleSwitcher hash hydration warning appears on Bible Reader routes only.

## Validation

Documentation validation:

```bash
git diff --check
git status --short
```

## Final Verdict

CR-64 passed.

## Next Objective

Next Gospel Harmony / Scripture Research milestone after separate approval.

## Known Constraints

- Failed-account warning behavior was inspected but not artificially simulated.
- Local frontend runtime may require stale listener recovery.
- Public Cross Reference visibility behavior remains unchanged.
- OpenBible rows remain `theme` / `unreviewed`.
