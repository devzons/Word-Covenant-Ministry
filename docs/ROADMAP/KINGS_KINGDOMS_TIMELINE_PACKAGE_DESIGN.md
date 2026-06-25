# Kings / Kingdoms Timeline Package Design

## 1. Purpose

This document defines a future Timeline data package design for the Kings / Kingdoms view.

- The purpose is to move the current Kings / Kingdoms preview away from a single frontend fixture and toward a package-backed, verifier-checked, Scripture-first model.
- This document is design only.
- It does not add real king rows, kingdom rows, chronology data, frontend integration, API behavior, or verifier implementation changes.

## 2. Scope

Included in scope:

- United Monarchy
- Divided Kingdom
- Israel / Northern Kingdom
- Judah / Southern Kingdom
- exile and fall markers as supporting reference anchors
- king records
- kingdom and kingdom-period records
- relationship design between king, kingdom, transition, and related Scripture anchors
- Scripture reference anchors only

Out of scope:

- Bible text
- sermon or interpretation essays
- coordinates
- map providers
- full external-history synchronization
- exact historical chronology claims
- Korean/world reference-row expansion
- frontend integration
- verifier implementation changes

## 3. Proposed Package Files

This CR does not create these files. It only defines likely follow-up targets.

Suggested future package files:

- `docs/data-packages/timeline/kings-kingdoms.skeleton.json`
- `docs/data-packages/timeline/fixtures/valid/kings-kingdoms.valid.sample.json`
- `docs/data-packages/timeline/fixtures/invalid/kings-kingdoms-broken-reference.invalid.sample.json`
- `docs/data-packages/timeline/fixtures/invalid/kings-kingdoms-invalid-kingdom-id.invalid.sample.json`
- `docs/data-packages/timeline/fixtures/warnings/kings-kingdoms-low-confidence-synchronism.warning.sample.json`

Status note:

- `CR-93G-2` added `docs/data-packages/timeline/kings-kingdoms.skeleton.json`.
- `CR-93G-3` adds the initial Kings / Kingdoms verifier fixture set.
- `CR-93G-4` remains the step for Kings-specific verifier hardening where current generic rules are still insufficient.

Optional later split if needed:

- `docs/data-packages/timeline/prophets.skeleton.json`
- `docs/data-packages/timeline/empires.skeleton.json`

The initial recommendation is to start with one combined Kings / Kingdoms skeleton file before splitting prophets or empires into separate packages.

## 4. Package Identity Proposal

Suggested package identity:

- `packageType`: `timeline.kings-kingdoms`
- `packageId`: `timeline.kings-kingdoms.skeleton`

Suggested envelope:

- `$schema`
- `packageId`
- `packageType`
- `packageVersion`
- `status`
- `notes`
- `records`

Suggested status values for the Kings / Kingdoms path:

- `skeleton`
- `draft`
- `review-required`

This package should remain explicitly non-final until king sequence, transition links, and chronology review policies are verified.

## 5. Record Types

Proposed `recordType` values:

- `kingdomPeriod`
- `kingdom`
- `king`
- `transition`
- `exileMarker`
- `templeMarker`
- `propheticContextMarker`

### kingdomPeriod

Purpose:

- Represents broad kingdom-flow sections in the center column.
- Supports accordion grouping and section-level navigation.

### kingdom

Purpose:

- Represents a kingdom identity such as the united monarchy, Israel, or Judah.
- Provides stable cross-link targets for kings and transitions.

### king

Purpose:

- Represents a specific ruler row.
- Holds Scripture anchors, kingdom membership, and predecessor/successor relationships.

### transition

Purpose:

- Represents a kingdom-state change such as division, fall, or return-era shift.
- Keeps transition logic separate from ordinary king rows.

### exileMarker

Purpose:

- Represents exile or fall milestones as Scripture-first structural markers.
- These remain supporting anchors, not external chronology claims.

### templeMarker

Purpose:

- Optional supporting marker for temple-related kingdom context where helpful.
- Should remain supporting rather than replacing event rows.

### propheticContextMarker

Purpose:

- Optional supporting context marker for prophet overlap.
- Should default to `reviewRequired: true` unless the relationship is explicit and stable.

## 6. Required Fields Policy

Suggested shared required fields for all records:

- `id`
- `recordType`
- `title.ko`
- `title.en`
- `displayOrder`
- `timelinePeriodId`
- `accordionGroup`
- `scriptureAnchors`
- `confidence`
- `reviewRequired`

Recommended shared supporting fields:

- `sectionId`
- `relatedBookIds`
- `basisLabel`
- `confidenceLabel`
- `cautionNote`

Suggested king-specific fields:

- `kingdomId`
- `kingdomName.ko`
- `kingdomName.en`
- `reignLabel.ko`
- `reignLabel.en`
- `approximateDateLabel.ko`
- `approximateDateLabel.en`
- `predecessorId`
- `successorId`
- `relatedTransitionIds`

Suggested kingdom-period fields:

- `periodType`
- `scope`
- `startAnchor`
- `endAnchor`
- `relatedKingIds`

Suggested transition fields:

- `fromKingdomId`
- `toKingdomId`
- `transitionLabel`
- `relatedKingIds`
- `relatedEventIds`

Field policy:

- Exact year fields are avoided in the skeleton stage.
- Labels are preferred over numeric chronology claims.
- Empty or unknown chronology should remain explicit rather than inferred.

## 7. Scripture Anchor Policy

Scripture evidence remains primary.

Rules:

- `scriptureAnchors` are reference-only.
- Bible text, verse text, quoted text, and copied passage strings are forbidden.
- Kings / Kingdoms package rows must ground claims in Scripture references rather than copied biblical wording.
- Scripture reference strings are not internal row IDs.
- `relatedBookIds` should align with the 66-book skeleton `bookId` values where possible.
- Historical labels, reign labels, and kingdom labels stay secondary to Scripture anchors.

## 8. Chronology and Uncertainty Policy

Kings / Kingdoms chronology is sensitive and must stay cautious.

Policy:

- Exact year fields are avoided in the skeleton phase.
- `reignLabel` and `approximateDateLabel` are preferred over fixed-year claims.
- Uncertain chronology must use `reviewRequired: true`.
- `confidence` or `confidenceLabel` should be required or strongly recommended on chronology-sensitive rows.
- Disputed chronology must not be presented as settled.
- Israel / Judah synchronisms should be modeled carefully and flagged when uncertain.
- Historical chronology remains secondary to Scripture reference anchors.
- External chronology should not override internal biblical sequence.

Examples of allowed design direction:

- “approximate reign context”
- “review required”
- “traditional ordering”
- “sequence follows Scripture flow”

Examples of disallowed design direction at skeleton stage:

- fixed exact year assertions without review policy
- presenting synchronisms as final when they remain debated
- elevating historical chronology above Scripture anchors

## 9. Cross-Link Policy

Planned relationship directions:

- `king -> kingdom`
- `king -> predecessor`
- `king -> successor`
- `king -> transition`
- `king -> related biblical event`
- `kingdomPeriod -> related king`
- `kingdomPeriod -> related event`
- `kingdomPeriod -> related books`
- `transition -> previous kingdom state`
- `transition -> next kingdom state`

Cross-link rules:

- Internal links use package row IDs.
- Bible references are not internal IDs.
- Broken internal links should become verifier errors in later CRs.
- Low-confidence links should be warning-level or explicitly `reviewRequired`.
- Cross-links to external world/Korean history rows are out of scope for this package.

## 10. Accordion-First Center-Column UI Proposal

The Kings / Kingdoms package should support the existing Timeline center-column rule:

- top-down
- Scripture-first
- accordion-first

Suggested future section structure:

1. United Monarchy
2. Divided Kingdom Overview
3. Northern Kingdom / Israel
4. Southern Kingdom / Judah
5. Exile / Fall Markers
6. Return-era Kingdom Context, if later needed

Suggested UI relationship:

- Left navigator: section-level movement
- Center column: section accordion panels
- Inner rows: kingdom and king metadata rows
- Right panel: selected king or kingdom metadata-only evidence

The package should therefore provide stable `sectionId`, `accordionGroup`, and `displayOrder` values from the start.

## 11. Guardrails

Required guardrails:

- No Bible text storage
- No Bible text rendering
- Verse reference only
- No coordinates
- No map provider
- Korean/world reference layers remain supporting-only
- Scripture evidence remains primary
- Frontend preview, when later added, must remain metadata-only
- API, DB, backend, and schema changes are out of scope
- Exact chronology claims must be review-gated

Additional caution:

- Prophet, empire, and synchronism labels must not overclaim certainty.
- Temple or exile markers should remain supporting structure, not alternative event authority.

## 12. Verifier Implications

This CR does not change the verifier.

Future verifier implications for a Kings / Kingdoms package may include:

- required field validation for `timeline.kings-kingdoms`
- `kingdomId` resolution checks
- predecessor/successor resolution checks
- duplicate king ID errors
- broken internal cross-link errors
- allowed kingdom value validation for core kingdom identities
- chronology rows without `reviewRequired` warning or error policy where appropriate
- continued reuse of existing no-Bible-text and no-coordinate guardrails

## 13. Fixture Implications

This CR does not create fixtures.

Suggested future valid fixtures:

- minimal united monarchy sample
- minimal divided kingdom sample
- minimal king-to-kingdom linkage sample

Suggested future invalid fixtures:

- broken predecessor link
- invalid `kingdomId`
- Bible text included
- exact chronology assertion without review policy
- coordinates included

Suggested future warning fixtures:

- approximate date without review flag
- low-confidence synchronism
- missing optional reign label

## 14. Recommended Implementation Phases

Recommended next sequence:

1. `CR-93G-2 Kings / Kingdoms Skeleton Package`
2. `CR-93G-3 Kings / Kingdoms Verifier Fixtures`
3. `CR-93G-4 Kings / Kingdoms Verifier Rule Hardening`, if needed
4. `CR-93G-5 Kings / Kingdoms Frontend Preview Integration`
5. `CR-93G-6 Kings / Kingdoms Interaction QA`

This order keeps package design, guardrails, preview integration, and QA separated.

## 15. Known Limitations

- No real data rows are added in this CR.
- Chronology is not finalized.
- No frontend integration is added in this CR.
- No external historical comparison is added.
- No maps or coordinates are added.
- No Bible text is stored.
- Prophet and empire modeling may still split into separate packages later if the combined package becomes too dense.
