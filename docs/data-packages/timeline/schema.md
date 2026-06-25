# Timeline Data Package Schema Notes

This file documents design-only package expectations for future Timeline data files.

## Core principles

- Scripture anchors are primary.
- Internal biblical sequence is primary over external chronology.
- All center-column views are accordion-first and top-down.
- Supporting layers must remain explicitly labeled.
- Bible text is not stored in the package.

## Expected package families

- periods
- books
- events
- psalms
- kings
- prophets
- empires
- places
- genealogy
- references
- cross-links

## Shared field expectations

- `id`
- `timelinePeriodId`
- `sectionId`
- `sectionOrder`
- `displayOrder`
- `scriptureAnchors`
- `basisLabel`
- `confidenceLabel`
- `cautionNote`
- `sourceBasisLabel`

## Design constraints

- The books package must eventually cover all 66 biblical books.
- Reference-history rows are not events.
- Korean history rows require source review labeling.
- Related IDs must resolve.
- No fuzzy cross-links.
- No coordinates in this phase.
