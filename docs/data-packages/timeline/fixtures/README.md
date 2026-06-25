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

### Invalid

- `invalid/missing-package-envelope.invalid.sample.json`
  - Missing required package envelope fields
- `invalid/missing-required-field.invalid.sample.json`
  - Missing required center-column field
- `invalid/duplicate-id.invalid.sample.json`
  - Duplicate row IDs
- `invalid/broken-cross-link.invalid.sample.json`
  - Cross-link target does not resolve
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
- `invalid/map-provider.invalid.sample.json`
  - Forbidden map provider field present
- `invalid/reference-authority-breach.invalid.sample.json`
  - Supporting reference row improperly presented as interpretive authority

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
