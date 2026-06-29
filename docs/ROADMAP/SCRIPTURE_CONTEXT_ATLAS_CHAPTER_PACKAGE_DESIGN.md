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
  scope: "chapter-level-preview-metadata";
  notes: string[];
  items: ScriptureContextAtlasChapterRow[];
};
```

Recommended JSON-oriented envelope:

```json
{
  "$schema": "./schema.md",
  "packageId": "scripture-context-atlas.chapter-context",
  "packageType": "scripture-context-atlas.chapter-context",
  "packageVersion": "0.1.0-skeleton",
  "status": "skeleton",
  "scope": "chapter-level-preview-metadata",
  "notes": [
    "This file is a chapter-level context skeleton only.",
    "It does not store Bible text.",
    "It does not perform verse-level tagging.",
    "It is not connected to the Reader yet."
  ],
  "items": []
}
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

Envelope-field policy:

- `$schema`
  - allowed and recommended for consistency with current timeline package files
- `packageId`
  - recommended because existing package files already use stable package identifiers
- `packageType`
  - required
- `packageVersion`
  - required
  - recommended SemVer-like skeleton value such as `0.1.0-skeleton`
- `status`
  - required
  - initial file should use `skeleton`
- `scope`
  - required
  - should remain explicit that this package is chapter-level preview metadata only
- `notes`
  - recommended
  - should state major guardrails in plain language
- `items`
  - required

Envelope-field exclusions:

- do not add `generatedAt`
- do not add `createdAt`
- do not add environment-specific metadata
- do not add runtime-loader hints
- do not add translation-scoped envelope flags in v1

## Skeleton File Policy

Recommended skeleton file path:

```txt
docs/data-packages/timeline/chapter-context.skeleton.json
```

Recommended initial-file policy:

- do not create real chapter rows in the first skeleton file
- start with `items: []`
- keep the first file schema-oriented and contract-oriented
- do not include illustrative sample rows in the production skeleton file
- if examples are needed later, prefer dedicated verifier fixtures rather than mixed-purpose production skeleton rows

Current decision:

- this CR now creates the empty skeleton file only
- the created file remains envelope-only with `items: []`
- any non-empty `items` rows require a later separate approval step

Frontend connection policy:

- do not connect chapter-context package loading to the Reader yet
- keep the file docs/data-only until a separate CR approves both file creation and Reader fallback behavior
- package-row creation and frontend connection are separate decisions

Current file state:

- `docs/data-packages/timeline/chapter-context.skeleton.json` now exists
- it contains envelope metadata only
- it contains no sample rows
- it contains no real rows
- it is not connected to Reader or Timeline runtime
- verifier implementation support remains a separate future step

Naming convention policy:

- use `chapter-context.skeleton.json` for the first package file
- future non-skeleton variants should preserve the same root name and change only maturity suffixes or versioning policy if later approved
- do not introduce parallel names such as `reader-chapter-context.json` or `chapter-context-preview.json` unless separately approved

Deterministic-diff policy:

- avoid generated timestamps such as `generatedAt`
- avoid writer-specific metadata
- prefer stable envelope metadata that does not change on every save

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
  reviewStatus: "skeleton" | "draft" | "review-required" | "reviewed" | "blocked" | "deprecated";
  sourceBasisLabel: TimelineText;
  relatedBookIds: string[];
  relatedEventIds: string[];
  relatedKingdomIds: string[];
  relatedPlaceIds: string[];
  relatedThemeLabels: TimelineText[];
  isSkeleton: boolean;
};
```

Required-field policy:

- required
  - `chapterContextId`
  - `bookId`
  - `chapter`
  - `title`
  - `summary`
  - `chapterScopeLabel`
  - `scriptureAnchors`
  - `basisLabel`
  - `confidenceLabel`
  - `cautionNote`
  - `reviewStatus`
  - `sourceBasisLabel`
  - `relatedBookIds`
  - `relatedEventIds`
  - `relatedKingdomIds`
  - `relatedPlaceIds`
  - `relatedThemeLabels`
  - `isSkeleton`

Optional-field policy:

- no additional operational fields are recommended in the first contract
- later optional fields must be separately approved

Label-shape policy:

```ts
type TimelineText = {
  ko: string;
  en: string;
};
```

- all end-user-facing labels should use `{ ko, en }`
- do not allow single-language strings for UI-facing row labels in the main package contract

`scriptureAnchors` policy:

```ts
type ChapterContextScriptureAnchor = {
  bookId: string;
  label: TimelineText;
  reference: string;
  scope: "chapter" | "passage";
};
```

- at least one anchor is required
- anchor scope must remain `chapter` or `passage`
- do not allow `verse` scope in the chapter-level contract

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
  - immediate contextual reason for the row
- `confidenceLabel`
  - cautious or reviewed display state
- `cautionNote`
  - no-overclaim language
- `reviewStatus`
  - explicit readiness state
- `sourceBasisLabel`
  - Scripture / curation / package-review basis behind the row
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

Confidence-level policy:

- keep `confidenceLabel` as required display text
- do not add a normalized machine enum in the first contract
- preferred wording remains:
  - `skeleton preview`
  - `review required`
  - `cautious contextual grouping`
  - `reviewed chapter summary`

Relation-array policy:

- empty arrays are allowed for:
  - `relatedBookIds`
  - `relatedEventIds`
  - `relatedKingdomIds`
  - `relatedPlaceIds`
  - `relatedThemeLabels`
- empty arrays must not be interpreted as proof that no relation exists
- they mean only that no reviewed relation has been attached in the current package

`basisLabel` vs `sourceBasisLabel` policy:

- `basisLabel`
  - explains the immediate contextual reason for the row
  - example: `Scripture anchor grouping / chapter-level preview`
- `sourceBasisLabel`
  - explains the curation/source basis behind the row
  - example: `Scripture-first manual curation / review required`

`cautionNote` policy:

- required for every row
- must use no-overclaim wording
- should explain uncertainty, preview scope, or review limits when relevant

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

No-overclaim rules:

- do not say `this chapter means`
- do not say `the entities in this chapter are`
- do not say `the selected verse contains`
- prefer:
  - `chapter-level preview`
  - `chapter-scope context`
  - `review-required`
  - `related metadata at chapter scope`

## Review-State Rules

Recommended allowed values:

- `skeleton`
- `draft`
- `review-required`
- `reviewed`
- `blocked`
- `deprecated`

Recommended meaning:

- `skeleton`
  - schema and placeholder maturity only
  - not for normal Reader display
- `draft`
  - authored but not yet ready for user-facing display
- `review-required`
  - preview-capable only if a later CR explicitly allows preview display
- `reviewed`
  - eligible for future Reader display
- `blocked`
  - insufficient basis or policy conflict
  - must not display
- `deprecated`
  - replaced or withdrawn
  - must not display

Recommended first-file policy:

- keep file-level `status: "skeleton"` for the empty initial package
- row-level `reviewStatus` becomes relevant only after later approved row creation

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
- `Verse-level people, places, and kingdom tagging remain future reviewed phases.`

KO:

- `이 장에 대한 chapter-level atlas metadata는 아직 연결되지 않았습니다.`
- `현재 패널은 계속 책 수준 preview metadata만 사용하고 있습니다.`
- `절 단위 인물, 장소, 왕국 태깅은 이후 검토 단계입니다.`

Selected-verse boundary copy direction:

EN:

- `Chapter-level context remains separate from selected-verse study state.`

KO:

- `장 수준 문맥은 선택 절 상태와 별개입니다.`

Fallback-copy guidance:

- do not say:
  - `This chapter has no related context.`
  - `이 장에는 관련 문맥이 없습니다.`
  - `All context for this chapter is shown here.`
  - `이 장의 모든 문맥이 여기에 표시됩니다.`
- prefer:
  - `Chapter-level Context Atlas data is not connected yet.`
  - `The current context is book-level preview metadata.`
  - `Verse-level people, places, and kingdom tagging remain future reviewed phases.`

## Future Verifier Guardrails

Package recognition policy:

- future verifier must recognize `packageType: "scripture-context-atlas.chapter-context"`
- current envelope-only skeleton with `status: "skeleton"` and `items: []` is valid and must not fail
- future non-skeleton package states may use stricter empty-items handling
- recommended empty-items behavior:
  - `status: "skeleton"`: allow
  - `status: "draft"`: warn
  - `status: "review-required"`: warn
  - `status: "reviewed"`: fail
  - `status: "blocked"`: allow if intentionally empty
  - `status: "deprecated"`: allow if intentionally empty
- `packageVersion` should follow the current package convention and remain SemVer-like with allowed maturity suffixes such as `0.1.0-skeleton`
- deterministic metadata policy remains strict:
  - fail on `generatedAt`
  - fail on `createdAt`
  - fail on runtime-loader hints
  - fail on environment-specific metadata

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

Recommended fail conditions:

- fail on missing `packageType`
- fail on wrong `packageType`
- fail on missing `packageId`
- fail on missing `packageVersion`
- fail on missing `status`
- fail on missing `scope`
- fail if `scope` is not `chapter-level-preview-metadata`
- fail on missing `items`
- fail if `items` is not an array
- fail on Bible text fields
- fail on coordinates / geocoding / map-provider fields
- fail on verse-level tagging fields
- fail on `selectedVerse`, `startVerse`, or `endVerse`
- fail on runtime-loader hint fields
- fail on environment-specific metadata
- fail on translation-scoped package flags
- fail on invalid `bookId`
- fail on invalid chapter bounds
- fail on duplicate `chapterContextId`
- fail on duplicate `bookId + chapter`
- fail on invalid related ids
- fail on missing `basisLabel`
- fail on missing `confidenceLabel`
- fail on missing `cautionNote`
- fail on missing `reviewStatus`

Recommended warning policy:

- warn when `status` is non-skeleton and `items` remains empty unless the state is intentionally `blocked` or `deprecated`
- warn if wording implies exact chronology
- warn if wording implies auto-extracted entity resolution
- warn if summary becomes commentary-like prose instead of metadata summary
- warn if wording is overconfident relative to weak basis
- warn if empty `scriptureAnchors` appear in draft-like rows
- warn if `relatedPlaceIds` wording implies real-map claims
- warn if person/paja/name-like fields appear before approval
- warn on sermon/application-like wording
- warn on broad summary claims with weak or generic basis
- warn when too many related ids appear without a stronger basis note
- warn on exhaustive-sounding phrases such as `all context` or `complete context`

Forbidden field policy:

- fail on Bible text fields such as:
  - `text`
  - `verseText`
  - `bibleText`
  - `passageText`
- fail on verse-level tagging or occurrence fields such as:
  - `selectedVerse`
  - `startVerse`
  - `endVerse`
  - `verse`
  - `verseRange`
  - `entityOccurrences`
  - `personOccurrences`
  - `originalLanguageOccurrences`
  - `strongOccurrences`
- fail on coordinate/map fields such as:
  - `lat`
  - `lng`
  - `latitude`
  - `longitude`
  - `coordinates`
  - `geoJson`
  - `mapProvider`
  - `geocodingProvider`
- fail on speculative atlas fields such as:
  - `pajaInterpretation`
  - `nameMystery`
  - `doctrinalConclusion`
- fail on Reader runtime state fields such as:
  - `activeVerse`
  - `selectedReferenceRange`
  - `uiState`

Relationship validation policy:

- `relatedBookIds` must resolve to canonical book ids
- `relatedEventIds` must resolve to event package row ids
- `relatedKingdomIds` must resolve to kingdom package row ids
- `relatedPlaceIds` must resolve to schematic place ids
- invalid relation ids should fail
- empty arrays remain allowed
- empty arrays must be interpreted as `no reviewed relation attached yet`, not `no relation exists`
- `relatedThemeLabels` remain label-only and are not id-validation targets
- `relatedPersonIds` should fail until a separate person-package contract is approved

Review and confidence behavior:

- `reviewStatus` must be one of:
  - `skeleton`
  - `draft`
  - `review-required`
  - `reviewed`
  - `blocked`
  - `deprecated`
- `confidenceLabel` must remain bilingual
- empty-string bilingual labels should fail
- overconfident certainty language should warn by default
- exact-certainty language should fail only when it crosses into unsupported exact-chronology or verse-resolution claims

Fixture-design recommendation:

- do not add fixtures in this CR
- the next fixture-design step should define at least:
  - valid empty skeleton envelope
  - valid minimal reviewed row
  - invalid Bible text field
  - invalid coordinate field
  - invalid verse-tagging field
  - invalid duplicate `bookId + chapter` row
  - invalid related id
  - warning overconfident wording
  - warning empty scripture anchors
  - warning commentary-like summary

## Future Verifier Fixture Design

Fixture taxonomy:

- `valid`
  - fixtures that must pass with `errorCount === 0`
- `invalid`
  - fixtures that must fail with one or more errors
- `warnings`
  - fixtures that must pass with `errorCount === 0` and one or more warnings

Each fixture category should document:

- fixture purpose
- expected verifier result
- rule covered
- why it matters
- whether the file should be created in the next CR

Required fixture category candidates:

- `valid empty skeleton envelope`
  - expected result: pass
  - rule covered: skeleton package recognition, empty `items` allowance for `status: "skeleton"`
  - why it matters: protects the current package baseline
  - next-CR creation: yes
- `valid minimal reviewed row`
  - expected result: pass
  - rule covered: minimum reviewed row contract
  - why it matters: proves the chapter-context contract can describe one valid chapter row without drifting into verse-level semantics
  - next-CR creation: yes
- `invalid missing envelope field`
  - expected result: fail
  - rule covered: required envelope-field enforcement
  - why it matters: prevents incomplete package files from silently passing
  - next-CR creation: yes
- `invalid wrong packageType`
  - expected result: fail
  - rule covered: package recognition policy
  - why it matters: prevents chapter fixtures from being misclassified as existing timeline package types
  - next-CR creation: yes
- `invalid Bible text field`
  - expected result: fail
  - rule covered: Bible-text exclusion
  - why it matters: protects the no-Bible-text package boundary
  - next-CR creation: yes
- `invalid coordinate / map-provider field`
  - expected result: fail
  - rule covered: no-coordinate / no-map-provider boundary
  - why it matters: keeps chapter-context distinct from map/entity infrastructure
  - next-CR creation: yes
- `invalid verse-level tagging field`
  - expected result: fail
  - rule covered: verse-level tagging exclusion
  - why it matters: protects the chapter-level vs verse-level boundary
  - next-CR creation: yes
- `invalid runtime UI state field`
  - expected result: fail
  - rule covered: no Reader runtime-state fields
  - why it matters: prevents package files from drifting into app-state serialization
  - next-CR creation: yes
- `invalid duplicate chapterContextId`
  - expected result: fail
  - rule covered: row identity uniqueness
  - why it matters: keeps row identity stable and deterministic
  - next-CR creation: yes
- `invalid duplicate bookId + chapter row`
  - expected result: fail
  - rule covered: canonical chapter uniqueness
  - why it matters: prevents ambiguous chapter context selection
  - next-CR creation: yes
- `invalid related id`
  - expected result: fail
  - rule covered: relation-id resolution
  - why it matters: prevents broken cross-package references
  - next-CR creation: yes
- `invalid reviewStatus`
  - expected result: fail
  - rule covered: review-state enum enforcement
  - why it matters: keeps review/display policy machine-checkable
  - next-CR creation: yes
- `invalid missing basis/confidence/caution`
  - expected result: fail
  - rule covered: required row metadata
  - why it matters: protects no-overclaim and review labeling
  - next-CR creation: yes
- `warning overconfident wording`
  - expected result: warn
  - rule covered: confidence-language caution
  - why it matters: overclaim is one of the highest theological/UX risks
  - next-CR creation: yes
- `warning exact chronology language`
  - expected result: warn
  - rule covered: chronology caution policy
  - why it matters: exact-sounding timeline language can exceed reviewed basis even without explicit year fields
  - next-CR creation: yes
- `warning empty scriptureAnchors`
  - expected result: warn
  - rule covered: weak anchor hygiene
  - why it matters: helps distinguish structurally valid but weak rows from fully grounded rows
  - next-CR creation: yes
- `warning commentary-like summary`
  - expected result: warn
  - rule covered: metadata-only summary boundary
  - why it matters: chapter context must not drift into commentary prose
  - next-CR creation: yes
- `warning sermon/application-like wording`
  - expected result: warn
  - rule covered: no sermon/application prose boundary
  - why it matters: keeps the atlas descriptive rather than exhortational
  - next-CR creation: yes
- `warning exhaustive wording`
  - expected result: warn
  - rule covered: no exhaustive-claim wording
  - why it matters: phrases like `all context` or `complete context` overstate review coverage
  - next-CR creation: yes
- `warning relatedPlaceIds wording that implies real-map claims`
  - expected result: warn
  - rule covered: schematic-place-only boundary
  - why it matters: prevents chapter-context from implying coordinate-backed place resolution
  - next-CR creation: yes

Fixture naming convention:

- keep fixture files under:
  - `docs/data-packages/timeline/fixtures/valid/`
  - `docs/data-packages/timeline/fixtures/invalid/`
  - `docs/data-packages/timeline/fixtures/warnings/`
- follow the current repository fixture convention:
  - `<name>.valid.sample.json`
  - `<name>.invalid.sample.json`
  - `<name>.warning.sample.json`
- recommended chapter-context examples:
  - `chapter-context-empty-skeleton.valid.sample.json`
  - `chapter-context-minimal-reviewed-row.valid.sample.json`
  - `chapter-context-missing-envelope-field.invalid.sample.json`
  - `chapter-context-wrong-package-type.invalid.sample.json`
  - `chapter-context-bible-text.invalid.sample.json`
  - `chapter-context-coordinate-field.invalid.sample.json`
  - `chapter-context-verse-tagging-field.invalid.sample.json`
  - `chapter-context-runtime-ui-state.invalid.sample.json`
  - `chapter-context-duplicate-id.invalid.sample.json`
  - `chapter-context-duplicate-book-chapter.invalid.sample.json`
  - `chapter-context-invalid-related-id.invalid.sample.json`
  - `chapter-context-invalid-review-status.invalid.sample.json`
  - `chapter-context-missing-basis-confidence-caution.invalid.sample.json`
  - `chapter-context-overconfident-wording.warning.sample.json`
  - `chapter-context-exact-chronology.warning.sample.json`
  - `chapter-context-empty-scripture-anchors.warning.sample.json`
  - `chapter-context-commentary-like-summary.warning.sample.json`
  - `chapter-context-sermon-like-summary.warning.sample.json`
  - `chapter-context-exhaustive-wording.warning.sample.json`
  - `chapter-context-related-place-map-implication.warning.sample.json`

Fixture content policy:

- fixtures must remain minimal and rule-focused
- invalid fixtures may include forbidden fields only for test purposes and must remain clearly invalid
- fixtures must not include generated timestamps or environment-specific metadata
- fixtures must preserve deterministic diffs
- fixtures are not production rows
- fixtures must never be loaded by Reader runtime
- fixtures must remain under `docs/data-packages/timeline/fixtures/`

Valid fixture design:

- `valid empty skeleton envelope`
  - package status: `skeleton`
  - `items: []`
  - expected pass
- `valid minimal reviewed row`
  - one minimal `reviewed` row
  - no Bible text
  - no verse-level fields
  - no coordinates
  - minimal safe relationships only
  - expected pass
- relation-target policy for valid fixtures:
  - prefer existing canonical `bookId`
  - prefer existing real package ids for `relatedEventIds` and `relatedKingdomIds` when practical
  - if fixture-local ids are ever introduced later, that needs explicit verifier-fixture policy and should not be assumed by default

Invalid fixture design:

- `invalid Bible text field`
  - include one forbidden Bible-text field only
- `invalid coordinate field`
  - include one coordinate or map-provider field only
- `invalid verse-tagging field`
  - include one verse-level field such as `verse` or `selectedVerse`
- `invalid duplicate bookId + chapter`
  - include two rows sharing the same canonical chapter identity
- `invalid related id`
  - include at least one unresolved related id
- `invalid missing required field`
  - omit exactly one required field for clarity
- `invalid reviewStatus`
  - use one unsupported `reviewStatus` value
- `invalid wrong packageType`
  - keep the rest of the envelope valid so package recognition failure is isolated

Warning fixture design:

- `warning overconfident wording`
  - should warn, not fail, because wording can exceed caution policy without breaking structure
- `warning exact chronology language`
  - should warn, not fail, unless unsupported exact-year fields are also introduced
- `warning empty scriptureAnchors`
  - should warn, not fail, when used to test weak-yet-parseable row content
- `warning commentary-like summary`
  - should warn, not fail, because the issue is tone/scope drift rather than missing structure
- `warning sermon/application-like wording`
  - should warn, not fail, because it tests descriptive-vs-exhortational copy boundaries
- `warning exhaustive wording`
  - should warn, not fail, because it tests overclaim language rather than schema invalidity
- `warning relatedPlaceIds real-map implication`
  - should warn, not fail, because the issue is claim inflation around places, not broken ids

Future verifier integration notes:

- future wrapper coverage should add chapter-context fixtures to the same three buckets:
- `CR-BR-CTX-27` now adds the first chapter-context fixture sample files under:
  - `docs/data-packages/timeline/fixtures/valid/`
  - `docs/data-packages/timeline/fixtures/invalid/`
  - `docs/data-packages/timeline/fixtures/warnings/`
- these fixtures are docs/data-only verifier samples and must never be treated as production chapter rows
- Reader runtime and Timeline runtime must not load chapter-context fixture files
- current verifier still does not implement chapter-context-specific rules; the new files only establish fixture inputs for a later implementation step
- future wrapper coverage should add chapter-context fixtures to the same three buckets:
  - valid fixtures must pass
  - invalid fixtures must fail
  - warning fixtures must pass with warnings
- future JSON smoke should eventually include the chapter-context package itself
- current verifier does not yet implement chapter-context-specific rules
- verifier implementation should remain a separate CR after fixture design approval and, preferably, after fixture files exist

`CR-BR-CTX-29` implementation result:

- chapter-context package recognition is now implemented
- chapter-context envelope validation is now implemented for `packageId`, `scope`, and deterministic-envelope exclusions
- approved `status: "skeleton"` plus `items: []` handling is now implemented
- minimum chapter-row baseline is now implemented for:
  - required fields
  - integer `chapter`
  - canonical `bookId`
  - chapter-bounds validation
  - bilingual label presence on key label fields
  - boolean `isSkeleton`
  - duplicate `chapterContextId`
  - duplicate `bookId + chapter`
- existing generic guardrails continue to enforce Bible-text, coordinate/map-provider, and verse-tagging invalid cases
- deep relationship-id validation is still deferred
- expanded chapter-context wording warnings are still deferred

Observed post-implementation boundary:

- valid empty skeleton fixture now passes directly
- valid minimal reviewed-row fixture now passes directly
- `chapter-context-invalid-related-id.invalid.sample.json` still passes individually because deep relationship-id validation remains deferred in this CR
- `chapter-context-overconfident-wording.warning.sample.json` still reports zero warnings individually because chapter-context wording warnings remain deferred in this CR
- wrapper-level regression still passes because the current valid / invalid / warning directory-level expectations remain satisfied

## Recommended Next CR

Recommended next CR:

```txt
CR-BR-CTX-30 Chapter Context Verifier Relationship and Warning Rule Readiness
```

Objective:

- audit the remaining chapter-context enforcement gaps before deeper verifier logic is implemented

Scope:

- docs-only
- compare the post-CR-BR-CTX-29 verifier behavior against the chapter-context fixtures
- decide whether relationship-id validation can be added without overreaching beyond the approved scope
- decide whether chapter-context wording warnings should remain generic or gain package-specific rules
- confirm whether current directory-level wrapper expectations remain sufficient

Files likely touched:

- `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`
- `docs/ROADMAP/PROJECT_STATUS.md`
- `docs/ROADMAP/NEXT_TASKS.md`

Explicitly not included:

- no verifier code changes
- no real chapter rows
- no Reader or Timeline runtime hookup
- no API / backend / DB / schema work
- no verse-level tagging model
- no person / paja / map implementation
- no direct relationship-rule implementation yet
- no warning-wording implementation yet

Validation plan:

- `git diff --check`
- `git diff --stat`
- `git status --short`

Risk level:

- low

Browser QA needed:

- no

## Overall Verdict

The chapter-level context problem is currently a data-contract and skeleton-policy problem, not a UI problem.

The current verifier can now recognize chapter-context packages and enforce the smallest safe envelope/baseline slice without runtime integration.

The next safe step is to audit the remaining relationship-id and wording-warning gaps before a broader second implementation slice begins.
