# Korean History Source Review Gate

## Purpose

`CR-92C-0` records whether Korean history pilot rows are allowed to proceed before any real supporting-reference row is added.

This gate exists because `CR-92C` is explicitly defined as:

- `CR-92C Korean History Pilot Rows after source review`

The goal of this note is to confirm:

- whether an approved source set exists
- whether citation and source-basis policy is approved
- whether pilot rows can be added safely without elevating Korean history above Scripture

This is a readiness and gate document only.
It does not add pilot rows, package rows, frontend behavior, verifier rules, API behavior, DB behavior, or schema changes.

## Current CR-92C Definition Found In Docs

Current roadmap references define `CR-92C` as:

- add `3-5` manually curated Korean reference rows as a pilot
- keep all rows clearly marked `supporting/reference only`
- require `source basis`

Current design and roadmap references also state:

- Korean history reference data cannot be imported without source and license review
- source and license review remain required before any real content rows
- Korean history is not a basis for biblical interpretation

## Source Policy Documents Reviewed

Primary source-policy references:

- `docs/ROADMAP/KOREAN_HISTORY_REFERENCE_LAYER_DESIGN.md`
- `docs/ROADMAP/TIMELINE_DATA_COVERAGE_MATRIX.md`
- `docs/ROADMAP/TIMELINE_DATA_PACKAGE_DESIGN.md`
- `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`
- `docs/data-packages/timeline/schema.md`
- `docs/data-packages/timeline/verifier.md`
- `docs/ROADMAP/NEXT_TASKS.md`

## Source Set Review Result

### Approved Source Set

No approved Korean history source set was found in the current roadmap or package documentation.

No document currently fixes:

- approved source titles
- approved source URLs or repositories
- approved public-domain or open-license source list
- approved official institutional source list
- final citation format for Korean history pilot rows
- final rule for which source metadata fields are required per row

### Current Status Classification

Current source approval status:

- `blocked`

Reason:

- source review is explicitly required before real Korean history content rows
- approved source set is not documented
- citation policy is not finalized
- source-basis policy is only partial
- the current phase wording and implementation order are inconsistent unless a gate is added first

## Current Policy Baseline

The following policy is already documented and remains binding:

1. Korean history is supporting-only.
2. Scripture evidence remains primary.
3. Korean history must never override biblical sequence.
4. Korean history must never determine biblical interpretation.
5. Korean history must never be displayed as equal to Scripture anchors.
6. Bible text must not be stored or rendered.
7. Coordinates, map providers, and geocoding remain out of scope.
8. Exact chronology must not be presented as settled final truth.
9. Debated or traditional chronology requires caution labeling.
10. Every future Korean history row must carry source basis.

## Pilot Row Eligibility Checklist

Pilot rows may proceed only when all of the following are true:

- an approved source set is documented
- source-license status is documented
- citation format is documented
- row-level `sourceBasisLabel` policy is documented
- supporting-only label is explicit
- non-interpretive caution label is explicit
- no Bible text is stored
- no coordinates are stored
- no map-provider or geocoding fields are stored
- no exact chronology final claim is asserted
- uncertain or debated data is marked with `reviewRequired` and/or cautious confidence labels

Current result:

- this checklist is not yet satisfied

## Proposed Pilot Row Shape

This is a readiness shape only.
It does not authorize row creation in this CR.

Suggested future row fields:

- `id`
- `recordType`
- `title.ko`
- `title.en`
- `referenceTypeLabel`
- `sourceBasisLabel`
- `citationLabel`
- `dateLabel`
- `approximateDateLabel`
- `relatedTimelineIds`
- `relatedBookIds`
- `authorityRole`
- `reviewRequired`
- `confidenceLabel`
- `cautionNote`
- `isSupportingReference`

Suggested policy:

- `authorityRole` must remain `supporting`
- `isSupportingReference` must remain `true`
- `relatedBookIds` should be optional and only used when the relationship is explicit and non-interpretive
- `citationLabel` should identify the approved source basis, not copied source text
- `dateLabel` or `approximateDateLabel` must remain cautious and non-final

## Source Metadata Expectations

Before pilot rows are approved, the project should document at least:

- source title
- source type
- provenance or origin
- license status
- citation format
- row-safe summary policy
- whether short source labels are stored directly in rows
- whether long descriptive text is disallowed to avoid copyright copying

Current finding:

- these expectations are implied, but not yet fully approved as a Korean-history-specific source set policy

## Guardrail Checklist

Mandatory guardrails for future Korean history pilot rows:

- supporting-only
- Scripture evidence primary
- no Bible text
- no coordinates
- no map provider
- no geocoding
- no external historical authority elevation
- no exact chronology finalization
- invalid or uncertain source requires `reviewRequired`
- no interpretive or doctrinal claim encoded as a historical relation

## Decision

Decision:

- `CR-92C` pilot rows are blocked until an approved Korean history source set and citation policy are documented.

Current readiness result:

- no approved source set found
- no finalized citation/source-basis policy found
- no row creation should proceed in this step

## Recommended Next Step

Recommended next step:

1. Complete and approve a Korean history source set and citation policy step.
2. Update roadmap status to show `CR-92C` as blocked pending source review completion.
3. Only then start `CR-92C Korean History Pilot Rows`.

If a future task wants to unlock `CR-92C`, it should first document:

- approved source list
- citation format
- row-safe metadata policy
- review-required handling for debated chronology

## Out Of Scope

- Korean history pilot row creation
- data package row creation or modification
- frontend integration
- verifier changes
- API, DB, backend, or schema changes
- coordinates, map-provider, or geocoding features
- exact chronology adjudication
