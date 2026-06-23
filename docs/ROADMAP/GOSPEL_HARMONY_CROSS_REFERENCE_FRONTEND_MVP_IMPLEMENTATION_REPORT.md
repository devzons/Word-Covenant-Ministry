# Gospel Harmony Cross Reference Frontend MVP Implementation Report

## Current Phase

CR-63 - Gospel Harmony Cross Reference Frontend MVP Implementation

## Implementation Summary

The Gospel Harmony workspace now includes a frontend-only Related Passages section for the selected Harmony unit.

Implemented:

- Related Passages / 관련 구절 section inside the Gospel Harmony unit display.
- Lazy loading only after explicit user action.
- Existing Cross Reference API reuse.
- Start-verse-only lookup for each Gospel account passage.
- Per-account grouping for Matthew, Mark, Luke, and John when present in the fixture.
- Maximum `3` related passages per account.
- Empty account groups are hidden.
- Partial failure handling keeps successful groups visible and shows a lightweight warning.
- Shared compact Cross Reference cards are reused.
- Shared preview modal is reused.
- Open in Reader behavior is reused.
- Focus return, ESC close, body scroll cleanup, and unsupported range fallback remain owned by the shared preview modal.

Not implemented:

- Schema changes.
- API changes.
- Data import.
- Migration.
- External Gospel Harmony datasets.
- Harmony review tooling.
- Automatic `parallel_event` generation.
- Reviewed-only public filtering.
- Timeline integration.
- People/Event integration.

## Grouping Strategy

The MVP groups related passages by Gospel account rather than merging them into a single event-level list.

Lookup policy:

```txt
GET /wp-json/wcm/v1/cross-references/{book}/{startChapter}/{startVerse}?page=1&per_page=3
```

This intentionally uses the passage start verse only. Full passage-range aggregation is deferred because the current Cross Reference API is verse-based.

Display order:

```txt
Matthew
Mark
Luke
John, when present in the fixture
```

## Editorial Safety

The UI keeps Harmony data and Cross Reference data distinct:

- Gospel Harmony units remain curated event/pericope fixture data.
- OpenBible Cross References remain source-backed discovery data.
- OpenBible rows continue to display conservative `theme` / `unreviewed` labels through the shared card component.
- The section helper text states that OpenBible links are unreviewed discovery data.
- No `parallel_event`, fulfillment, prophecy, or typology labels were introduced.

## Validation Results

Commands:

```bash
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
git diff --check
```

Results:

- `npm run typecheck`: passed after running outside sandbox because TypeScript writes `frontend/tsconfig.tsbuildinfo`.
- `npm run lint`: passed.
- `npm run build`: passed after running outside sandbox because Next.js writes `frontend/.next`.
- `git diff --check`: pending final documentation validation in CR-63 closeout.

## Browser QA

Browser QA was completed in CR-64 after local runtime recovery.

Validation report:

```txt
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_FRONTEND_MVP_VALIDATION_REPORT.md
```

Passed:

- Related Passages section appears in Gospel Harmony.
- Lazy-load trigger works.
- Per-account grouping works.
- Empty groups are hidden.
- Maximum `3` related passages per account.
- Mobile layout has no horizontal overflow.
- Preview modal works.
- Unsupported fallback works.
- Open in Reader works.
- Focus return works.
- No Gospel Harmony React/runtime errors.
- Bible Reader and Related Passages regression spot-checks passed.
- Word Study/interlinear smoke route loaded.

## Final Verdict

Implementation, static validation, and browser validation passed.

## Next Objective

Next Gospel Harmony / Scripture Research milestone after separate approval.

## Known Constraints

- No backend/API/schema/import/migration work was performed.
- Related passages use each Gospel account passage start verse only.
- Public Cross Reference visibility behavior is unchanged.
- OpenBible rows remain `theme` / `unreviewed`.
- Failed-account warning behavior was inspected but not artificially simulated.
- Local frontend runtime may require stale listener recovery.
