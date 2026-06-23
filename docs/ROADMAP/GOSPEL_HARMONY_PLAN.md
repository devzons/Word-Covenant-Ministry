# Gospel Harmony Plan

## Purpose

The Gospel Harmony feature will support event-based parallel study of the Synoptic Gospels, starting with Matthew, Mark, and Luke.

The first implementation is a frontend-only foundation:

- A route for the Gospel Harmony workspace.
- A three-column placeholder layout.
- Frontend reference-only data types.
- No imported harmony-unit dataset.
- No copied Bible text.

## Current Scope

The first foundation includes:

- Route: `/[locale]/gospel-harmony`
- Korean title: `복음서 대조서`
- English title: `Gospel Harmony`
- Three columns:
  - Matthew / 마태복음
  - Mark / 마가복음
  - Luke / 누가복음
- A clear "preparing" state.
- Frontend-only TypeScript data shape for future harmony units.

## Non-Scope

This phase does not authorize:

- Schema changes.
- Migrations.
- Database writes.
- Backend changes.
- Data imports.
- WEB import.
- External harmony data collection.
- Production database changes.
- Storing copied Bible text in harmony units.

## Data Model Principle

Harmony units must not store Bible text.

Harmony units should store only event metadata and passage references:

```ts
type GospelHarmonyUnit = {
  id: string;
  title: { ko: string; en: string };
  passages: {
    matthew?: GospelHarmonyPassage;
    mark?: GospelHarmonyPassage;
    luke?: GospelHarmonyPassage;
    john?: GospelHarmonyPassage;
  };
};

type GospelHarmonyPassage = {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
};
```

Bible text should be loaded from the selected Bible version API at runtime.

Detailed architecture design is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_ARCHITECTURE_DESIGN.md
```

Frontend MVP implementation and browser validation are documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_FRONTEND_MVP_IMPLEMENTATION_REPORT.md
docs/ROADMAP/GOSPEL_HARMONY_FRONTEND_MVP_VALIDATION_REPORT.md
```

Gospel Harmony Cross Reference integration planning is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_INTEGRATION_PLAN.md
```

Gospel Harmony Cross Reference frontend MVP implementation is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_FRONTEND_MVP_IMPLEMENTATION_REPORT.md
```

Gospel Harmony Cross Reference frontend MVP browser validation is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_FRONTEND_MVP_VALIDATION_REPORT.md
```

Current data-backed version:

```txt
KRV
```

Future English support:

```txt
WEB, after Phase 9 source review and import approval
```

## UX Direction

The Gospel Harmony workspace should eventually support:

- Event-unit navigation.
- Parallel Gospel display.
- Version-aware text loading.
- KRV-first Korean study.
- WEB-supported English study after Phase 9.
- Verse links back into the Bible Reader.
- Compatibility with future KRV-WEB parallel view.

The current placeholder should not imply that harmony-unit data is already available.

## Future Phases

### Phase GH-1 - Frontend Foundation

Status: current foundation.

Deliverables:

- Route.
- Workspace shell.
- Three-column layout.
- Reference-only frontend types.
- Preparing state.

### Phase GH-2 - Harmony Unit Source Policy

Review source options for harmony-unit structure.

Rules:

- Do not scrape or import external harmony data without license/provenance review.
- Prefer curated internal units or explicitly source-backed public-domain/open-license structure.
- Record source, confidence, and review status.

### Phase GH-3 - Data Model Design

Design whether harmony units live as:

- Static reviewed fixtures.
- WordPress custom table records.
- A future curated content type.

No schema work may begin without separate approval.

### Phase GH-4 - Runtime Text Loading

Load passage text by Bible version through existing Bible APIs or approved range endpoints.

Must avoid:

- Full Bible payloads.
- Copied text in harmony-unit data.
- Unbounded API responses.

### Phase GH-5 - Parallel Study UX

Add user-facing event navigation, selected-unit state, passage links, and responsive layout behavior.

Status: complete locally through the frontend MVP and CR-60 browser validation.

### Phase GH-6 - Cross Reference Integration Planning

Design how Gospel Harmony can show bounded related passages for each Gospel account without confusing curated Harmony units with OpenBible thematic discovery data.

Status: complete as a design phase.

### Phase GH-7 - Cross Reference Frontend MVP

Add a frontend-only, lazy-loaded Related Passages section to the Gospel Harmony workspace using the existing Cross Reference API and shared preview/card components.

Status: complete locally through CR-64 browser validation.

Next gate:

```txt
Next Gospel Harmony / Scripture Research milestone after separate approval
```

## Relationship To Phase 9

Gospel Harmony can use KRV immediately for Korean study once runtime passage loading is implemented.

English Gospel Harmony depends on Phase 9:

- WEB source/license/provenance review.
- WEB import dry-run.
- Approved local WEB import.
- Reader/search compatibility QA.

Until WEB is data-backed, the UI must not fake English Bible text.
