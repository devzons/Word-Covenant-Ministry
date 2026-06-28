# Scripture Evidence Panel Safe Completeness Fix Plan

## Date

2026-06-28

## Purpose

This document defines the safe frontend-only completeness-fix scope for the current Scripture Evidence Panel.

It exists to narrow the next implementation CR before any code work starts.

This is a planning document only.

It does not authorize implementation by itself.

## Safe Fix Boundary

Safe fixes are limited to the following categories:

- preserve fields that already exist in source packages by carrying them through normalizers
- display fields that already exist in normalized data
- clarify label/value presentation structure
- add explicit preview-limitation wording where a panel would otherwise feel blank
- improve related-chip display using existing linked identifiers only

The following are not part of safe-fix scope:

- new rows
- new entity types
- new packages
- new external-reference layers
- new map behavior
- data-model expansion

## Candidate Fix Groups

### A. Events

Safe-fix candidates:

- display normalized `confidenceLabel`
- review safe carry-through for package-backed `relatedKingdomIds`
- review safe carry-through for package-backed `relatedEventIds`
- review whether `scriptureReferencesOnly` currently hides package-backed date / basis / confidence metadata too aggressively

Required caution:

- chronology wording must remain caution-labeled
- no exact chronology claim
- no Bible text rendering

### B. Books / Psalms

Safe-fix candidates:

- carry `basisLabel` through the books normalizer
- carry `confidenceLabel` through the books normalizer
- review safe carry-through for `relatedKingdomIds`
- review safe carry-through for `relatedBookIds`
- render existing `relatedBookIds` where helpful in the book panel

Explicit exclusion inside this group:

- richer related-people work is a source-data gap and is not part of this safe-fix CR

### C. Kings / Kingdoms

Safe-fix candidates:

- render package-row `basisLabel`
- make existing `reignLabel`, `approximateDateLabel`, `confidenceLabel`, and `cautionNote` presentation more consistent
- clarify the difference between package-backed rows and runtime comparison rows through copy only

Explicit exclusion inside this group:

- no prophet entity addition
- no prophet selection type
- no prophet deep-link support

### D. Places

Safe-fix candidates:

- present location basis and confidence using clearer label/value rows
- keep no-coordinate / no-map-provider / no-geocoding guardrails explicit

Explicit exclusion inside this group:

- related places or related nations expansion remains outside this safe-fix plan because that is a source-data gap

## Explicitly Excluded

The following are explicitly outside this safe-fix plan:

- person entity type
- person package
- original-language / name / paja package
- Korean / world-history inspector integration
- prophet-context expansion
- place package creation
- Luke genealogy expansion
- broader Old Testament genealogy expansion
- Cloudflare media upload
- editorial admin layer
- real map
- coordinates
- geocoding
- map-provider integration
- any data package row addition
- API work
- DB work
- backend work
- schema work

## Recommended Implementation Order

Recommended order:

### CR-A: Events / Books / Kings Existing Field Carry-Through And Rendering Fixes

This should be the first implementation CR.

Reason:

- highest value for the current right panel
- mostly existing field carry-through
- lowest approval risk
- directly supports the future `Scripture Context Atlas`

### CR-B: Places Panel Basis / Confidence Clarity

Keep Places separate from the first CR.

Reason:

- Places already carries additional no-coordinate guardrail copy
- keeping Places separate reduces the size and regression surface of the first implementation CR

### CR-C: Panel Empty-State / Preview-Limitation Wording Standardization

This should follow the first two implementation passes.

Reason:

- wording standardization will be easier after entity-specific gaps are tightened

### CR-D: Modular Component Structure Design

Do this only after the smaller completeness fixes are done.

Reason:

- component restructuring is safer after the current data contract becomes more stable

## Validation Plan For Later Implementation

Later implementation CRs should use:

- `node scripts/timeline/verify-timeline-packages.mjs`
- `cd frontend && npm run typecheck`
- `cd frontend && npm run lint`
- `git diff --check`
- route smoke if the local environment allows it

## Guardrails

The following guardrails remain mandatory:

- no data package row changes
- no Bible text storage or rendering
- no API / DB / backend / schema changes
- no runtime import/export changes
- no coordinates
- no geocoding
- no map-provider
- no exact chronology overclaim
- no Korean / world-history authority elevation
- no paja authority elevation
- no Cloudflare credentials or uploads
- no SQL dump / uploads archive / credentials
- no `frontend/vendor/`
- no `composer.lock` change

## Required Next Step

The next implementation-facing step should be:

- `Scripture Evidence Panel Completeness Fixes A`

Scope recommendation for that first implementation CR:

- Events
- Books / Psalms
- Kings / Kingdoms

Do not include Places in the first implementation CR unless the scope remains clearly small after code inspection.
