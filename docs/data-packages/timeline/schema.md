# Timeline Data Package Schema Notes

This file documents design-only package expectations for future Timeline data files.

## Shared package envelope

Every sample package should use the same envelope shape:

- `$schema`
- `packageType`
- `packageVersion`
- `status`
- `notes`
- `items`

Envelope rules:

- `items` stays empty in the current skeleton phase.
- Sample files define shape only.
- Production Timeline rows are not added in this phase.

## Core principles

- Scripture anchors are primary.
- Internal biblical sequence is primary over external chronology.
- All center-column views are accordion-first and top-down.
- Supporting layers must remain explicitly labeled.
- Bible text is not stored in the package.

## Expected package families

- periods
- sections
- events
- books
- psalms
- kings
- prophets
- empires
- places
- genealogy
- references
- cross-links

## Shared row fields for future real data

- `id`
- `timelinePeriodId`
- `sectionId`
- `displayOrder`
- `scriptureAnchors`
- `basisLabel`
- `confidenceLabel`
- `cautionNote`
- `sourceBasisLabel`
- `relatedEventIds`
- `relatedBookIds`
- `relatedPlaceIds`
- `relatedKingdomIds`

## Accordion-first requirements

- `sectionId` is required for rows that appear in center-column views.
- `displayOrder` is required for rows displayed in center-column flow.
- `sectionOrder` is required in the sections package.
- Center display should be top-down chronological by default.
- All major views must support collapsed and expanded sections.

## 66-book requirement

- The real books package must eventually include all 66 canonical books.
- Do not mark the books package complete until all 66 books have rows with Scripture anchors and basis labels.
- Authorship and dating labels must use basis categories such as:
  - `Scripture explicit`
  - `Superscription-based`
  - `Traditional`
  - `Textual background`
  - `Inferred`
  - `Debated`
  - `Unknown`

## No-storage and boundary rules

- No Bible text
- No coordinates during the current phase
- No external dataset rows without source review
- Korean history rows require `sourceBasisLabel` and reference-only labeling

## Future verifier requirements

- IDs unique
- all references resolve
- all 66 books present in the real books package
- no Bible text stored
- no coordinates in the no-coordinate phase
- Korean reference rows include source basis
- accordion sections include order fields
