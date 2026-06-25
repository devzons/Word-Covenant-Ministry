# Timeline Package Verifier Design

## 1. Purpose

As the Timeline data package grows, common risks become more likely:

- duplicate IDs
- missing Scripture anchors
- missing section or order fields
- fake or dangling cross-links
- Bible text being stored in package files
- coordinate or map-provider fields being added during the no-coordinate phase
- missing source basis on supporting reference rows

The future verifier exists to check that Timeline package data continues to follow the Scripture-first package rules and structural requirements.

This design preceded implementation.

- The initial minimal CLI is now implemented at `scripts/timeline/verify-timeline-package.mjs`.
- It remains read-only and fixture-oriented.
- It does not add runtime import behavior or API behavior.

Important boundaries:

- The verifier is not a theological interpreter.
- The verifier is a data-quality, structure, and safety guardrail tool.
- The verifier should help prevent world-history or Korean-history reference layers from being treated as more authoritative than Scripture.

## 2. Verification Scope

Planned verification target packages:

- `package-manifest`
- `periods`
- `sections`
- `events`
- `books`
- `psalms`
- `kings`
- `prophets`
- `empires`
- `places`
- `genealogy`
- `references`
- `cross-links`

Out of scope for the verifier:

- Bible text correctness
- theological interpretation
- exact chronology adjudication
- external source truth adjudication
- frontend rendering behavior
- DB or API import behavior

## 3. Verification Levels

### Level 1 - JSON Syntax

- All package files must be valid JSON.

### Level 2 - Package Envelope

- `$schema` exists.
- `packageType` exists.
- `packageVersion` exists.
- `status` exists.
- `items` exists and is an array where applicable.

### Level 3 - Required Fields

- Every row has `id`.
- Center-column rows have `timelinePeriodId`, `sectionId`, `displayOrder`, and `accordionGroup` where applicable.
- Scripture-based rows have `scriptureAnchors`.
- Supporting reference rows have `sourceBasisLabel` and `referenceTypeLabel`.

### Level 4 - Cross-Reference Integrity

- `related*` IDs resolve to real rows where required.
- Cross-link `fromId` and `toId` resolve.
- No dangling IDs remain in linked fields.

### Level 5 - Canonical Coverage

- The books package contains 66 canonical books when the relevant package status claims canonical skeleton or stronger.
- `bookId` values are unique.
- `canonicalOrder` values `1..66` are unique.
- No book is treated as complete unless required fields exist.

### Level 6 - Scripture-first Guardrails

- No Bible text is stored.
- Scripture anchors are references, not copied text.
- Dates, empires, places, world history, and Korean history remain supporting layers.
- Korean history reference rows require explicit reference-only and non-interpretive labeling.

### Level 7 - No-coordinate Phase Guardrails

- No `latitude`
- No `longitude`
- No `coordinates`
- No `geojson`
- No map-provider metadata

### Level 8 - Warnings and Review Flags

The verifier should warn when rows appear structurally valid but still need review, for example:

- debated authorship without `cautionNote`
- traditional dates without confidence labeling
- external source rows without `sourceBasisLabel`
- inferred rows without `basisLabel`
- exact-looking dates without `dateBasisLabel` or `dateConfidenceLabel`

## 4. Error vs Warning Policy

Errors should fail verification:

- invalid JSON
- missing package envelope fields
- duplicate IDs within a package
- duplicate `bookId` values
- books package not having 66 rows when status claims `canonical-skeleton` or stronger
- missing `scriptureAnchors` on biblical rows
- Bible text fields present
- coordinate fields present during the no-coordinate phase
- dangling cross-link targets
- Korean reference rows without `sourceBasisLabel`
- Korean reference rows missing a "not a basis for biblical interpretation" label

Warnings should not fail the initial verifier:

- missing optional related IDs
- approximate date labels that are clearly approximate
- broad background labels in skeleton or draft phases
- empty notes in the skeleton phase
- `skeleton-only` sample packages with empty `items`

## 5. Canonical 66-Book Verification

For `books.66-canonical-skeleton.json`, the future verifier should check:

- `items.length === 66`
- `66` unique `bookId` values
- `canonicalOrder` covers `1..66`
- `testament` exists
- `canonicalSection` exists
- `title.ko` and `title.en` exist
- `timelinePeriodId` exists
- `sectionId` exists
- `displayOrder` exists
- `accordionGroup` exists
- `scriptureAnchors` exists and is non-empty
- `authorshipBasisLabel` exists
- `backgroundBasisLabel` exists
- `dateConfidenceLabel` exists
- `isSkeleton === true`

Additional guardrails:

- no item should be marked complete
- no Bible text fields
- no unsupported certainty language that overstates authorship, date, or background certainty

## 6. Accordion / Center Column Verification

The verifier should check:

- `sectionId` exists for center-column rows
- `displayOrder` is numeric
- `accordionGroup` exists where required
- `sectionOrder` exists in the sections package when that package is populated
- section and row ordering can support top-down flow
- reference-history rows are not treated as ordinary biblical events
- Korean history reference rows remain supporting-only

## 7. Scripture Anchor Verification

Minimum anchor checks:

- `scriptureAnchors` is an array
- each anchor has either a `bookId` or a canonical book reference shape
- each anchor has either `label` or `reference`
- no full Bible text is stored in anchors

Deferred for later:

- exact verse existence validation against the Scripture Engine

## 8. No Bible Text Storage Rule

The future verifier should reject fields such as:

- `text`
- `verseText`
- `bibleText`
- `scriptureText`
- `contentText`

unless a future explicit whitelist exists for non-Bible label metadata.

Package rule:

- Timeline package files store references, labels, and structure metadata, not biblical text bodies.

## 9. No-coordinate Rule

The future verifier should reject fields such as:

- `lat`
- `latitude`
- `lng`
- `lon`
- `longitude`
- `coordinates`
- `geojson`
- `geometry`
- `mapProvider`
- `tileUrl`

This rule remains active during the current no-coordinate phase.

## 10. Reference History Guardrails

World-history and Korean-history reference rows should require:

- `isSupportingReference: true`
- `sourceBasisLabel`
- `confidenceLabel`
- `referenceTypeLabel`
- `cautionNote`
- an explicit non-interpretive label

Korean history special rules:

- must not be counted as biblical events
- must not be represented as Scripture events
- must remain collapsed/reference-only in UI when later integrated
- should carry exact, traditional, approximate, or debated labeling as appropriate

## 11. Cross-Link Verification

The future verifier should check:

- `fromType` exists
- `fromId` exists
- `toType` exists
- `toId` exists
- `relationLabel` exists
- `basisLabel` exists
- `confidenceLabel` exists
- no fuzzy inferred links are encoded as if they were explicit links
- no links point to placeholder-only Korean history rows unless a later phase explicitly approves that

## 12. Package Status Rules

Allowed planned package status values:

- `skeleton-only`
- `canonical-skeleton`
- `draft`
- `reviewed`
- `import-ready`
- `deprecated`

Rules:

- `skeleton-only` may have empty `items`
- `canonical-skeleton` should satisfy skeleton completeness rules
- `import-ready` should require stricter validation
- `complete` should not be used yet

## 13. Future CLI Contract

The future verifier command may look like one of these:

```bash
node scripts/timeline/verify-timeline-package.mjs docs/data-packages/timeline
```

or

```bash
php tools/timeline/verify-timeline-package.php docs/data-packages/timeline
```

Recommended output structure:

- `PASS` or `FAIL`
- error count
- warning count
- file path
- row id when applicable
- message
- severity
- suggested fix

Recommended exit codes:

- `0`: pass with no errors
- `1`: validation errors found
- `2`: verifier configuration or runtime error

## 14. Suggested Implementation Language

Options:

### Node.js

Pros:

- close to the existing JSON and frontend-adjacent package ecosystem
- easy to validate JSON package files
- good fit for future CI use

Cons:

- should remain lightweight and not drift into a broad toolchain

### PHP

Pros:

- familiar to the backend/plugin ecosystem

Cons:

- the Timeline package is currently docs-only and frontend-adjacent
- less natural fit for package-first JSON validation at this stage

Recommendation:

- start with a lightweight Node.js verifier when implementation is approved
- do not implement it in CR-93E

## 15. Implementation Phases

- `CR-93E`: verifier design only
- `CR-93E-2`: add verifier test fixtures with intentional pass/fail/warning samples
- `CR-93E-3`: implement minimal JSON and package-envelope verifier
- `CR-93E-4`: add 66-book validation
- `CR-93E-5`: add cross-link and no-coordinate guardrails
- `CR-93E-6`: add CI or documented verification command

Implemented current minimum in `CR-93E-3`:

- CLI path: `scripts/timeline/verify-timeline-package.mjs`
- target modes: single file or directory
- outputs: readable summary or `--json`
- current checks: JSON parse, envelope fields, duplicate IDs, cross-link resolution, 66-book skeleton rules, Bible-text guardrails, no-coordinate guardrails, Scripture-first supporting-reference guardrails, and warning-only review flags

Known current limitations:

- The CLI does not enforce every future schema field yet.
- The CLI does not validate exact Scripture verse existence.
- The CLI does not integrate with CI yet.
- The CLI is intentionally read-only and does not import or transform package data.

## 16. Fixture Design Follow-up

The verifier design should be anchored by repository fixtures before implementation.

Recommended fixture directories:

```txt
docs/data-packages/timeline/fixtures/
  README.md
  valid/
  invalid/
  warnings/
```

Required fixture classes:

- valid minimal package envelope
- valid accordion-first center-column sample
- valid explicit cross-link sample
- valid supporting reference sample
- invalid missing package envelope
- invalid missing required field
- invalid duplicate ID
- invalid broken cross-link
- invalid canonical-skeleton book problems
- invalid Bible text storage
- invalid coordinate or map-provider fields
- invalid supporting reference authority breach
- warning-only approximate or uncertain chronology cases
- warning-only Korean reference review cases
- warning-only low-confidence cross-link cases

## 17. Acceptance Criteria

- verifier design doc created
- verification levels defined
- error and warning policy defined
- 66-book verification requirements defined
- accordion-first verification requirements defined
- no-Bible-text and no-coordinate guardrails defined
- Korean and world-reference guardrails defined
- future CLI contract defined
- no code or real data rows added
- roadmap updated
