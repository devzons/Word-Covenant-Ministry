# Timeline Verifier Fixtures

This directory contains synthetic verifier fixtures for future Timeline package validation work.

Rules:

- These files are not frontend runtime imports.
- These files are not approved production package data.
- These files exist only to anchor future verifier behavior.
- Bible text must not be stored here.
- Coordinates and map-provider fields are intentionally used only in invalid fixtures that should fail verification.

Directory layout:

- `valid/`
- `invalid/`
- `warnings/`

## Expected Use

The future verifier should run against fixture files to confirm:

- pass cases
- fail cases
- warning-only cases

## Invalid JSON Syntax

An invalid JSON syntax example is documented here rather than stored as a `.json` file, because fixture JSON files in the repository must remain valid JSON.

Future invalid-syntax test idea:

```txt
{ "packageType": "timeline.events", "items": [ }
```

Expected result:

- verifier fails at JSON syntax stage
- severity: error

## Fixture Index

### Valid

- `valid/minimal-package.valid.sample.json`
  - Minimal valid package envelope
- `valid/accordion-center-column.valid.sample.json`
  - Valid center-column row with accordion-first fields
- `valid/cross-links.valid.sample.json`
  - Valid explicit cross-link sample using resolvable IDs
- `valid/reference-history.valid.sample.json`
  - Valid world/Korean supporting reference sample with non-interpretive labels
- `valid/books-66-reference.valid.sample.json`
  - Reference fixture that points to `../books.66-canonical-skeleton.json` as the canonical 66-book validation target
- `valid/kings-kingdoms-minimal.valid.sample.json`
  - Minimal Kings / Kingdoms package sample using the current verifier-compatible `items` envelope
- `valid/kings-kingdoms-links.valid.sample.json`
  - Valid Kings / Kingdoms-related cross-link sample using resolvable existing package IDs

### Invalid

- `invalid/missing-package-envelope.invalid.sample.json`
  - Missing required package envelope fields
- `invalid/missing-required-field.invalid.sample.json`
  - Missing required center-column field
- `invalid/duplicate-id.invalid.sample.json`
  - Duplicate row IDs
- `invalid/broken-cross-link.invalid.sample.json`
  - Cross-link target does not resolve
- `invalid/cross-link-unknown-target-type.invalid.sample.json`
  - Cross-link target type is not allowed
- `invalid/cross-link-bible-reference-as-id.invalid.sample.json`
  - Cross-link target ID looks like a Scripture reference instead of a package row ID
- `invalid/cross-link-ambiguous-duplicate-id.invalid.sample.json`
  - Cross-link target ID is ambiguous because the same row ID appears more than once
- `invalid/books-missing-book-id.invalid.sample.json`
  - Canonical skeleton row missing `bookId`
- `invalid/books-duplicate-book-id.invalid.sample.json`
  - Duplicate `bookId` values
- `invalid/books-count-65.invalid.sample.json`
  - Canonical skeleton package has only 65 rows
- `invalid/books-duplicate-order.invalid.sample.json`
  - Canonical skeleton package repeats one `canonicalOrder`
- `invalid/books-order-out-of-range.invalid.sample.json`
  - Canonical skeleton package contains out-of-range `canonicalOrder`
- `invalid/books-testament-count.invalid.sample.json`
  - Canonical skeleton package has wrong OT / NT distribution
- `invalid/bible-text.invalid.sample.json`
  - Forbidden Bible text-like field present
- `invalid/coordinates.invalid.sample.json`
  - Forbidden coordinate fields present
- `invalid/nested-coordinates.invalid.sample.json`
  - Forbidden coordinate fields present inside nested objects or arrays
- `invalid/map-provider.invalid.sample.json`
  - Forbidden map provider field present
- `invalid/nested-map-provider.invalid.sample.json`
  - Forbidden map provider value present inside nested objects or arrays
- `invalid/reference-authority-breach.invalid.sample.json`
  - Supporting reference row improperly presented as interpretive authority
- `invalid/kings-kingdoms-broken-kingdom-id.invalid.sample.json`
  - Broken kingdom target ID via a Kings / Kingdoms cross-link sample
- `invalid/kings-kingdoms-broken-predecessor.invalid.sample.json`
  - Proxy broken predecessor target for future Kings / Kingdoms hardening
- `invalid/kings-kingdoms-bible-text.invalid.sample.json`
  - Forbidden Bible-text-like field inside a Kings / Kingdoms sample
- `invalid/kings-kingdoms-coordinates.invalid.sample.json`
  - Forbidden coordinate field inside a Kings / Kingdoms sample
- `invalid/kings-kingdoms-exact-chronology-without-review.invalid.sample.json`
  - Exact chronology field without review gating should fail

### Warnings

- `warnings/approximate-date.warning.sample.json`
  - Approximate date without explicit review flag
- `warnings/chronology-uncertainty.warning.sample.json`
  - Chronology uncertainty needing clearer review labeling
- `warnings/missing-display-label.warning.sample.json`
  - Missing optional display label in a warning-only scenario
- `warnings/korean-reference-review.warning.sample.json`
  - Korean supporting reference needing review
- `warnings/low-confidence-cross-link.warning.sample.json`
  - Low-confidence explicit cross-link that should warn, not fail
- `warnings/cross-link-missing-target-type.warning.sample.json`
  - Cross-link omits explicit target type and should warn for review
- `warnings/supporting-reference-placeholder-review.warning.sample.json`
  - Supporting reference placeholder remains secondary but still needs source review
- `warnings/kings-kingdoms-approximate-date-review.warning.sample.json`
  - Approximate Kings / Kingdoms chronology label without stronger review wording
- `warnings/kings-kingdoms-low-confidence-synchronism.warning.sample.json`
  - Low-confidence Kings / Kingdoms synchronism proxy that should warn
- `warnings/kings-kingdoms-missing-reign-label.warning.sample.json`
  - Optional `reignLabel` warning target

## Kings / Kingdoms Fixture Notes

Kings / Kingdoms fixtures anchor two separate layers:

- current generic verifier coverage
- future `timeline.kings-kingdoms`-specific hardening

Current verifier can immediately enforce:

- JSON syntax
- package envelope shape
- duplicate IDs
- forbidden Bible-text-like fields
- forbidden coordinate or map-provider fields
- generic cross-link target resolution where explicit `timeline.cross-links` rows are used
- allowed Kings / Kingdoms `recordType` values
- `kingdomId` resolution inside king rows
- `predecessorId` / `successorId` resolution inside king rows
- `previousStateId` / `nextStateId` resolution inside transition rows
- exact chronology field review gating
- optional `reignLabel` warning behavior

Still-deferred or intentionally conservative Kings / Kingdoms semantics:

- broader kingdom scope taxonomy beyond current fixture/package values
- deeper synchronism heuristics beyond explicit low-confidence markers
- any future frontend/runtime integration checks

Guardrails remain unchanged:

- no Bible text
- no coordinates
- no map-provider fields
- no exact chronology claims as settled package truth
