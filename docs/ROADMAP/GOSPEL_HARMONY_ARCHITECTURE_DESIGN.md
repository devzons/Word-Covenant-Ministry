# Gospel Harmony Architecture Design

## Current State

Word Covenant Ministry already has a Gospel Harmony frontend foundation:

- Route: `/[locale]/gospel-harmony`
- Workspace component: `frontend/src/components/scripture/GospelHarmonyWorkspace.tsx`
- Reference-only fixture data: `frontend/src/data/gospelHarmonyUnits.ts`
- Current display: Matthew, Mark, and Luke columns with runtime Bible text loading
- Current source posture: curated local MVP data, no external harmony dataset import

The current fixture contains a small set of Gospel events and stores passage references only. Bible text is loaded at runtime from the existing Bible API. This preserves the same Scripture data boundary used by Reader, Search, Cross References, and Word Study.

Cross Reference infrastructure is now available locally:

- OpenBible relationships imported as `relationship_type=theme`
- Reader Related Passages integration complete
- Word Study Related Passages MVP complete
- Shared compact passage card and preview modal behavior available
- Review infrastructure exists for Cross Reference relationships

Gospel Harmony should build on these foundations without treating imported thematic Cross References as reviewed harmony units.

## Architecture Goals

Gospel Harmony should allow users to study parallel Gospel accounts in a Christ-centered Scripture research workflow while keeping the Bible text primary.

Goals:

- Represent Gospel events as reviewed reference-only units.
- Load KRV and WEB text at runtime from Bible APIs.
- Keep harmony data separate from copied Bible text.
- Distinguish curated parallel-event structure from broad thematic Cross References.
- Support Reader, Cross Reference, Word Study, Original Language, and future Timeline integration.
- Keep mobile and desktop study workflows readable.
- Preserve source, review, and provenance information for harmony data.

Non-goals:

- No schema change in this design phase.
- No external data acquisition in this design phase.
- No import, migration, or DB write in this design phase.
- No automatic doctrinal classification from imported Cross Reference rows.
- No copied Bible text in harmony unit records.

## Data Model Options

### Option A - Frontend Curated Fixture

Store a small reviewed harmony-unit list in frontend source code.

Pros:

- Lowest implementation risk.
- No schema or API change.
- Good for validating UX and reference model.

Cons:

- Not scalable for full harmony coverage.
- No admin review workflow.
- Requires code changes for data edits.

### Option B - Static Reviewed Package

Store a generated or curated JSON package outside runtime DB, with manifest/checksum policy.

Pros:

- Keeps source review and package validation explicit.
- Avoids immediate schema work.
- Easier to replace after source review.

Cons:

- Still awkward for editorial review.
- Frontend bundle size risk if shipped directly.
- Needs careful placement to avoid bundling large data.

### Option C - Dedicated Harmony Tables

Create dedicated tables for harmony units and unit passages after approval.

Pros:

- Scales to full harmony data.
- Supports review metadata and editorial workflow.
- Enables indexed lookup from Reader passage to harmony units.

Cons:

- Requires schema approval, migration design, rollback plan, and import/review tooling.
- More implementation complexity.

### Option D - Cross Reference Derived View

Use Cross Reference rows with `parallel_event` as the Harmony source.

Pros:

- Reuses Cross Reference storage and APIs.
- Aligns event parallels with relationship data.

Cons:

- Harmony units need ordered event grouping, titles, categories, and per-Gospel passage membership.
- OpenBible `theme/unreviewed` rows are not sufficient for Gospel Harmony.
- A derived view risks blurring curated harmony structure with broad references.

## Recommended Data Model

Use a **Harmony Unit** as the canonical object.

A Harmony Unit is a reviewed event or teaching pericope. It owns metadata and contains passage references for one or more Gospel accounts. Verse ranges are members of the unit, not the unit itself.

Recommended canonical shape:

```ts
type GospelHarmonyUnit = {
  id: string;
  sequence: number;
  title: { ko: string; en: string };
  category?: { ko: string; en: string };
  review_status: "draft" | "reviewed" | "suppressed";
  source_dataset: "wcm_curated" | string;
  source_version?: string;
  passages: Partial<Record<GospelHarmonyBook, GospelHarmonyPassage>>;
};

type GospelHarmonyBook = "matthew" | "mark" | "luke" | "john";

type GospelHarmonyPassage = {
  book: GospelHarmonyBook;
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse?: number;
};
```

Reference policy:

- Store book/chapter/verse ranges only.
- Use WCM canonical book slugs.
- Do not store Bible text.
- Support absent Gospel accounts without placeholder text.
- Treat John as supported in the model, even if the MVP UI starts with Matthew, Mark, and Luke.
- Avoid cross-book ranges.
- Support same-chapter ranges first; cross-chapter ranges require explicit preview/range policy.

Future DB direction, after approval:

- `wcm_gospel_harmony_units`
- `wcm_gospel_harmony_passages`

This design does not approve those tables. It only names the likely future shape.

## Reader Integration

Reader integration should be reference-driven.

Initial direction:

- When the current Reader passage is inside a Gospel Harmony passage range, show a small Harmony entry point in the Bible Study Workspace.
- Entry point label examples:
  - ko: `복음서 대조 보기`
  - en: `View Gospel Harmony`
- Navigate to `/[locale]/gospel-harmony?unit={unit_id}`.
- Preserve locale and Bible version policy.
- Keep Reader as the primary Scripture surface.

Future direction:

- Add a Research panel section for Harmony only after the workspace navigation model is approved.
- Allow selected verse lookup to return matching harmony units.
- Allow passage preview via the shared preview modal when appropriate.

## Cross Reference Integration

Cross Reference and Gospel Harmony should remain distinct.

Rules:

- Cross Reference rows connect passages.
- Gospel Harmony units group passages into reviewed Gospel events or teaching units.
- Imported OpenBible `theme/unreviewed` rows must not be promoted into harmony units automatically.
- Future reviewed Harmony units may expose `parallel_event` Cross Reference relationships after separate approval.
- Rejected or suppressed Cross Reference rows should not affect Harmony units unless explicit integration rules are approved.

Recommended future flow:

1. Curate or source-review Harmony units.
2. Validate unit passages against WCM canonical references.
3. Optionally generate reviewed `parallel_event` Cross Reference rows from approved Harmony units.
4. Keep provenance clear: Harmony-derived rows should identify the harmony dataset, not OpenBible.

## Word Study Integration

Word Study should connect to Gospel Harmony only when a term occurrence is inside a harmony passage.

MVP-compatible idea:

- Term Study can show that a sampled occurrence belongs to a Gospel Harmony unit.
- The link opens the Harmony unit, not a generated doctrine claim.
- No automatic lexical-to-event inference.

Deferred:

- Term-wide aggregation of harmony units.
- Ranking harmony units by lexical importance.
- Creating `word_study` relationships from shared Gospel events.

## Original Language Integration

Gospel Harmony should not embed full interlinear data inside each column in the MVP.

Recommended approach:

- Each harmony passage links to the Reader.
- Reader can be opened in `mode=original` or `mode=interlinear`.
- Future UI may offer a compact `Open Interlinear` action per passage.
- Original-language token panels remain owned by Reader/Interlinear flows.

This avoids duplicating complex original-language UI inside the Harmony workspace.

## Future Timeline Integration

Harmony Units are a natural event anchor for future Timeline, People, and Events work.

Future fields may include:

- approximate sequence order
- ministry period
- location
- people involved
- event category
- chronology confidence
- source/reviewer metadata

These fields should not be added until Timeline architecture is approved.

## MVP Scope

Recommended next implementation MVP, after approval:

- Keep the existing frontend-only fixture.
- Formalize Harmony Unit shape around event/pericope references.
- Add URL-selectable unit state, such as `?unit=feeding-five-thousand`.
- Make runtime Bible version selection explicit:
  - `/ko` defaults to KRV.
  - `/en` can use WEB where local data exists.
- Keep Matthew/Mark/Luke visible first.
- Keep John supported in data but optional in first UI.
- Preserve reference-only data.
- Add Reader links for each passage.
- Reuse shared passage preview patterns only if they can be extracted without changing Cross Reference behavior.

No backend/API/schema/import work is part of the MVP unless separately approved.

## Deferred Scope

Deferred work:

- External Gospel Harmony source acquisition.
- License/provenance review for third-party harmony datasets.
- Harmony package creation and dry run.
- Dedicated DB schema and migration.
- Harmony read API.
- Admin review tooling for Harmony units.
- Automatic `parallel_event` Cross Reference generation.
- Timeline, People, and Events integration.
- Full four-column Matthew/Mark/Luke/John layout.
- Cross-chapter range preview.
- KRV-WEB side-by-side parallel columns.
- Commentary-layer integration.

## Risks

### Source Risk

External harmony datasets may have unclear license, provenance, or editorial assumptions. WCM should prefer curated internal units until a source review is complete.

### Theological Risk

Harmony grouping is interpretive. The UI must avoid implying certainty where Gospel event sequencing or grouping is debated.

### Cross Reference Risk

OpenBible `theme/unreviewed` relationships are useful for discovery but should not become WCM-reviewed parallel-event conclusions without review.

### UX Risk

Parallel passages can become long and visually dense, especially on mobile. The MVP should keep event lists, selected-unit display, and passage links clear.

### Version Risk

KRV and WEB may have verse-count or wording differences. Harmony units must remain reference-based and should handle missing verses or unavailable version data gracefully.

### Performance Risk

Harmony views should fetch bounded passage ranges or chapters, not full Bible payloads. Future API work should avoid unbounded multi-chapter responses.

## Recommended Implementation Phases

### GH-6 - Architecture Approval Review

Review this architecture and decide whether the Harmony Unit model is approved.

### GH-7 - Frontend Harmony Workspace Refinement

Frontend-only refinement:

- URL-selectable unit state.
- Explicit version selection policy.
- Cleaner event navigation.
- Reader links and optional preview behavior.

No schema or API changes.

### GH-8 - Source / License Review

Review whether WCM should remain curated-only or adopt an external harmony source.

### GH-9 - Data Package Specification

Define package layout, manifest, checksum, and validation rules for harmony units.

### GH-10 - Schema / API Design

Design dedicated Harmony tables and read APIs only if the curated fixture no longer meets project needs.

### GH-11 - Reader / Cross Reference Integration

Add approved Harmony entry points to Reader and optional reviewed `parallel_event` Cross Reference integration.

### GH-12 - Timeline / People / Events Planning

Use reviewed Harmony units as one event source for future research layers.

## Validation Plan

For this design phase:

```bash
git diff --check
git status --short
```

For future frontend-only implementation:

```bash
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
git diff --check
```

Future browser QA:

- `/ko/gospel-harmony`
- `/en/gospel-harmony`
- Unit selection via URL query.
- Matthew/Mark/Luke passage display.
- Reader links preserve locale and version.
- Mobile event list and parallel columns remain usable.
- Missing passage states render without errors.

## Final Recommendation

Use a reviewed **Harmony Unit** as the canonical Gospel Harmony object.

Keep Harmony data reference-only, curated-first, and separate from Cross Reference `theme/unreviewed` data. The next phase should be GH-6 / CR-57 Gospel Harmony Architecture Approval Review before implementation. If approved, the first implementation should remain frontend-only and improve the existing workspace without schema, API, or import changes.
