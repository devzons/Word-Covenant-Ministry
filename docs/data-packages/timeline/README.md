# Timeline Data Package

This directory contains skeleton Timeline data package files.

Current status:

- Skeleton-only
- Design-only
- Not production data
- No approved import files
- Canonical 66-book skeleton package now exists in `books.66-canonical-skeleton.json`
- Core biblical event skeleton package now exists in `events.core-biblical-skeleton.json`
- No world-history or Korean-history content rows yet

Rules:

- All files in this directory are design or skeleton artifacts.
- Real data rows may be added only in later approved phases.
- The books package must eventually cover all 66 canonical books.
- `books.66-canonical-skeleton.json` is the first canonical 66-book skeleton package.
- The 66-book skeleton is not imported into the frontend yet.
- The core biblical event skeleton is not imported into the frontend yet.
- Skeleton rows are not complete book introductions, and no book should be treated as complete yet.
- Skeleton event rows are not a complete biblical timeline dataset and should not be treated as final chronology.
- A verifier design now exists in `verifier.md` and `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`.
- A minimal read-only verifier CLI now exists at `scripts/timeline/verify-timeline-package.mjs`.
- The verifier currently covers JSON/package checks, 66-book canonical validation, cross-link resolution, and package guardrails.
- Center-column package display must support top-down chronological accordion sections.
- Scripture anchors are primary.
- Dates, geography, world history, Korean history, tradition, and authorship labels are supporting layers.
- Bible text must not be stored here.
- Coordinates must not be added during the no-coordinate phase.
- Sample files must not be treated as production data.
