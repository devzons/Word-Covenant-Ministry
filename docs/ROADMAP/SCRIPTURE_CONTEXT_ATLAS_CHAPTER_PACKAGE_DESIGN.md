# Scripture Context Atlas Chapter Package Design

## Date

2026-06-28

## Purpose

This document defines the future chapter-level data contract for the Reader-first `Scripture Context Atlas`.

This is a docs-only design step.

It does not authorize:

- frontend implementation
- backend implementation
- API / DB / schema changes
- Timeline data package row changes
- real chapter-context package rows
- verse-level tagging implementation
- selected-verse-driven metadata filtering
- reader-side entity resolver behavior
- person / paja / original-language name atlas implementation
- map / coordinates / geocoding / provider work
- Korean/world-history inspector integration
- Timeline Kingdom extraction

## Chapter-Level Package Purpose

The future chapter-level package exists to support a later Reader UI that can say:

- `current chapter context`
- `chapter-level overview metadata`
- `chapter-level related context`

without pretending that:

- the Bible text has been copied into the package
- the chapter has been auto-analyzed into verse-level entities
- the selected verse has been resolved into people / places / kingdoms

This package is therefore an intermediate layer between:

- current book-level context
- future verse-level tagging or entity-resolution systems

It is not:

- Bible text storage
- commentary storage
- sermon/application prose
- verse-level tagging
- automatic NLP/entity extraction output

## Package Identity

Recommended file name:

```txt
docs/data-packages/timeline/chapter-context.skeleton.json
```

Recommended package type:

```txt
scripture-context-atlas.chapter-context
```

Recommended package envelope:

```ts
type ScriptureContextAtlasChapterPackage = {
  packageId: "scripture-context-atlas.chapter-context";
  packageType: "scripture-context-atlas.chapter-context";
  packageVersion: string;
  status: "skeleton" | "pilot" | "reviewed";
  notes: string[];
  items: ScriptureContextAtlasChapterRow[];
};
```

Recommended row identity:

```ts
type ScriptureContextAtlasChapterRow = {
  chapterContextId: string;
  bookId: string;
  chapter: number;
  ...
};
```

Recommended identity policy:

- `chapterContextId` must be stable and deterministic
- recommended format:
  - `chapter-context-<bookId>-<chapter>`
- `bookId` must use canonical Reader/Timeline book ids
- `chapter` must be a positive integer within canonical book bounds

`translationScope` policy:

- do not include translation-specific scope in v1
- chapter context should remain reference-based and translation-agnostic
- translation-specific behavior belongs in the Reader text layer, not the context package layer

Canonical/display ordering policy:

- sort primarily by canonical book order
- sort secondarily by `chapter`
- a dedicated `displayOrder` field is not required if deterministic sort can be derived from `bookId + chapter`
- if added later, `displayOrder` must remain derived and not become an independent chronology claim

## Recommended Minimum Row Shape

Recommended minimum row shape:

```ts
type ScriptureContextAtlasChapterRow = {
  chapterContextId: string;
  bookId: string;
  chapter: number;
  title: TimelineText;
  summary: TimelineText;
  chapterScopeLabel: TimelineText;
  scriptureAnchors: Array<{
    bookId: string;
    label: TimelineText;
    reference: string;
    scope: "chapter" | "passage";
  }>;
  basisLabel: TimelineText;
  confidenceLabel: TimelineText;
  cautionNote: TimelineText;
  reviewStatus: "skeleton" | "draft" | "review-required" | "reviewed";
  sourceBasisLabel: TimelineText;
  relatedBookIds: string[];
  relatedEventIds: string[];
  relatedKingdomIds: string[];
  relatedPlaceIds: string[];
  relatedThemeLabels: TimelineText[];
  isSkeleton: boolean;
};
```

Field purpose:

- `chapterContextId`
  - stable identity
- `bookId`
  - canonical Reader/Timeline book identity
- `chapter`
  - chapter number only, not verse-range identity
- `title`
  - concise chapter-level title
- `summary`
  - short metadata-only overview, not commentary prose
- `chapterScopeLabel`
  - explicit label such as `chapter-level preview` / `장 수준 preview`
- `scriptureAnchors`
  - chapter-level or bounded-passage references only
- `basisLabel`
  - why the row exists
- `confidenceLabel`
  - how cautious or reviewed the row is
- `cautionNote`
  - no-overclaim language
- `reviewStatus`
  - explicit readiness state
- `sourceBasisLabel`
  - Scripture / curation / package-review basis
- `relatedBookIds`
  - canonical book ids only
- `relatedEventIds`
  - event package row ids only
- `relatedKingdomIds`
  - kingdom package row ids only
- `relatedPlaceIds`
  - schematic place ids only
- `relatedThemeLabels`
  - optional label-only helper, not doctrinal taxonomy
- `isSkeleton`
  - package maturity marker

## Explicit Exclusions

The chapter-level package must not contain:

- Bible verse text
- copied commentary prose
- sermon application
- verse-level entity tagging
- person occurrence tagging
- Strong / lemma occurrence tagging
- paja interpretation
- doctrinal conclusions generated from labels
- coordinates
- latitude / longitude
- geocoding fields
- map-provider fields
- route reconstruction claims
- Korean/world-history synchronism claims
- exact chronology claims unless separately reviewed

Also excluded:

- `selectedVerse`
- `startVerse`
- `endVerse`
- entity-resolution state
- click-state or UI-state fields

Those belong to later, separate systems if ever approved.

## Book-Level vs Chapter-Level Boundary

Book-level context:

- canonical location
- authorship / background / dating labels
- book-scope related metadata
- stable book identity

Chapter-level context:

- short overview for one chapter
- chapter-bounded Scripture anchors
- chapter-bounded related metadata
- chapter-level caution / basis / confidence

Chapter-level must not replace book-level.

Recommended future Reader policy:

- book-level context remains the parent context
- chapter-level context is a subordinate section
- if no chapter-level row exists, the Reader falls back to explicit copy rather than silent omission

## Chapter-Level vs Verse-Level Boundary

Chapter-level context:

- overview metadata for a chapter
- related context that is safe at chapter scope
- no claim that a selected verse has been resolved

Verse-level tagging:

- would require explicit verse references
- would require entity types and ids
- would require review status and ambiguity handling
- would require separate model and policy

Required boundary statement:

- chapter-level context must never appear to be selected-verse tagging
- Reader copy must explicitly say chapter context is chapter-scope metadata only

## Source / Basis / Confidence Policy

Required source policy:

- chapter rows must remain Scripture-reference-first
- manual curation is allowed only as metadata summarization, not commentary replacement
- every row must surface basis and confidence labels

Recommended basis categories:

- `Scripture anchor grouping`
- `Canonical / textual flow`
- `Reviewed package curation`
- `Preview skeleton`

Recommended confidence language:

- `skeleton preview`
- `review required`
- `cautious contextual grouping`
- `reviewed chapter summary`

Recommended caution policy:

- use approximate / cautious language
- avoid exact chronology
- avoid inference language that sounds like automated extraction
- avoid doctrinal overclaim

Recommended review states:

- `skeleton`
- `draft`
- `review-required`
- `reviewed`

No-overclaim rules:

- do not say `this chapter means`
- do not say `the entities in this chapter are`
- do not say `the selected verse contains`
- prefer:
  - `chapter-level preview`
  - `chapter-scope context`
  - `review-required`
  - `related metadata at chapter scope`

## Relationship Policy

Allowed relations:

- `relatedEventIds`
  - must reference event package row ids only
- `relatedBookIds`
  - must reference canonical book ids only
- `relatedKingdomIds`
  - must reference kingdom package row ids only
- `relatedPlaceIds`
  - must reference schematic place ids only

Person policy:

- do not add `relatedPersonIds` yet
- do not add person labels as pseudo-entities
- person support should wait for a separate person-entity design

Paja / name / map policy:

- keep all future-only
- do not reserve operational fields in the first chapter package contract
- document them as separately approved future expansions

Theme policy:

- `relatedThemeLabels` may exist only as light label helpers
- they must not become a doctrinal taxonomy engine
- no theme ids are required in v1 chapter-package design

## Future Reader UI Use

Recommended future Reader use:

- keep current book-level section
- add a separate `Current chapter context / 현재 장 문맥` section below it
- render chapter-level summary and anchors only when a chapter row exists
- otherwise show explicit fallback copy

Recommended fallback copy direction:

EN:

- `Chapter-level atlas metadata is not connected for this chapter yet.`
- `The current panel is still using book-level preview metadata only.`

KO:

- `이 장에 대한 chapter-level atlas metadata는 아직 연결되지 않았습니다.`
- `현재 패널은 계속 책 수준 preview metadata만 사용하고 있습니다.`

Selected-verse boundary copy direction:

EN:

- `Chapter-level context remains separate from selected-verse study state.`

KO:

- `장 수준 문맥은 선택 절 상태와 별개입니다.`

## Future Verifier Guardrails

Recommended future verifier checks:

- package type must match `scripture-context-atlas.chapter-context`
- no Bible text fields
- no coordinate fields
- no map-provider fields
- `bookId` must be canonical
- `chapter` must be within canonical book bounds
- `chapterContextId` must be unique
- related ids must resolve against allowed target sets
- `reviewStatus` must be present
- `basisLabel` must be present
- `confidenceLabel` must be present
- `cautionNote` must be present
- `scriptureAnchors` must not be empty
- no verse-level tagging fields such as:
  - `verse`
  - `startVerse`
  - `endVerse`
  - `entityType`
  - `entityId`
  - `occurrenceId`
- duplicate row detection
- unsupported exact-claim warning

Recommended warning policy:

- warn if wording implies exact chronology
- warn if wording implies auto-extracted entity resolution
- warn if summary becomes commentary-like prose instead of metadata summary

## Recommended Next CR

Recommended next CR:

```txt
CR-BR-CTX-23 Chapter Context Package Skeleton Design Note
```

Objective:

- finalize the chapter-level package contract and file-level skeleton policy before any future package skeleton file or Reader UI work starts

Scope:

- docs-only
- refine field definitions
- confirm identity policy
- confirm verifier expectations
- confirm fallback copy boundary

Files likely touched:

- `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`
- `docs/ROADMAP/PROJECT_STATUS.md`
- `docs/ROADMAP/NEXT_TASKS.md`

Explicitly not included:

- no JSON rows
- no package loader code
- no Reader UI implementation
- no API / backend / DB / schema work
- no verse-level tagging model
- no person / paja / map implementation

Validation plan:

- `git diff --check`
- `git diff --stat`
- `git status --short`

Risk level:

- low

Browser QA needed:

- no

## Overall Verdict

The chapter-level context problem is currently a data-contract problem, not a UI problem.

The next safe step is to define the chapter-level package contract clearly enough that future skeleton files, verifier rules, and Reader UI can be added without drifting into verse-level tagging or commentary behavior.
