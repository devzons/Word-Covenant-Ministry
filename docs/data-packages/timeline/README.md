# Timeline Data Package

This directory contains skeleton Timeline data package files.

Current status:

- Skeleton-only
- Design-only
- Not production data
- No approved import files
- Canonical 66-book skeleton package now exists in `books.66-canonical-skeleton.json`
- Core biblical event skeleton package now exists in `events.core-biblical-skeleton.json`
- No world-history content rows yet
- Korean-history pilot supporting-reference rows now exist in `references.korean-pilot.json`

Rules:

- All files in this directory are design or skeleton artifacts.
- Real data rows may be added only in later approved phases.
- The books package must eventually cover all 66 canonical books.
- `books.66-canonical-skeleton.json` is the first canonical 66-book skeleton package.
- The 66-book skeleton is now connected to the Timeline Books / Psalms view as a preview-only frontend read.
- The core biblical event skeleton is now connected to the Timeline Events view as a preview-only frontend read.
- `events.core-biblical-skeleton.json` now provides an 85-row Genesis-to-Revelation baseline for the connected Events preview.
- Kings / Kingdoms package design is documented in `docs/ROADMAP/KINGS_KINGDOMS_TIMELINE_PACKAGE_DESIGN.md`, and a first skeleton package now exists in `kings-kingdoms.skeleton.json`.
- The Kings / Kingdoms skeleton is now connected to the Timeline Kings / Kingdoms view as a preview-only frontend read through the route server loader pattern.
- Kings / Kingdoms verifier fixtures now exist under `docs/data-packages/timeline/fixtures/`.
- Kings / Kingdoms verifier hardening is now implemented for package-type detection, allowed record types, kingdom/succession/transition link resolution, exact-chronology review gating, and optional reign-label warnings.
- The frontend preview remains metadata-only and does not render Bible text from package files.
- Skeleton rows are not complete book introductions, and no book should be treated as complete yet.
- Skeleton event rows remain a cautious package baseline and should not be treated as final chronology.
- The connected Events preview now depends on `id` plus `eventId` identity for core-event package hardening.
- A verifier design now exists in `verifier.md` and `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`.
- A minimal read-only verifier CLI now exists at `scripts/timeline/verify-timeline-package.mjs`.
- A standard wrapper command now exists at `scripts/timeline/verify-timeline-packages.mjs`.
- The verifier currently covers JSON/package checks, 66-book canonical validation, cross-link resolution, and package guardrails.
- `references.korean-pilot.json` now provides a manual `5`-row Korean-history pilot package with supporting-only labels, required citation metadata, no copied prose, a collapsed Events-view preview-only frontend read, and no exact biblical synchronization.
- The wrapper verifies canonical books, core events, Kings / Kingdoms skeleton, valid fixtures, invalid expected-fail fixtures, warning-only fixtures, and JSON smoke output in one run.
- Center-column package display must support top-down chronological accordion sections.
- Scripture anchors are primary.
- Dates, geography, world history, Korean history, tradition, and authorship labels are supporting layers.
- Bible text must not be stored here.
- Coordinates must not be added during the no-coordinate phase.
- Sample files must not be treated as production data.

Standard local command:

```bash
node scripts/timeline/verify-timeline-packages.mjs
```
