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

- `.sample.json` files keep `items` empty in the current skeleton phase.
- Sample files define shape only.
- `books.66-canonical-skeleton.json` is a canonical skeleton package, not a production import package.
- Production Timeline import rows are not added in this phase.

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

Current notable package artifacts:

- `books.66-canonical-skeleton.json`
- `*.sample.json` skeleton shape files

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
- `books.66-canonical-skeleton.json` is the first package-level 66-book skeleton artifact.
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
- explicit cross-link rows currently use `fromType`, `fromId`, `toType`, and `toId`
- cross-link target types should stay within documented Timeline package target kinds
- Scripture reference strings must not be treated as package row IDs
- all 66 canonical book IDs present in `books.66-canonical-skeleton.json`
- all 66 books present in the real books package
- no Bible text stored
- no coordinates or map-provider fields anywhere in the no-coordinate phase, including nested objects and arrays
- Korean reference rows include source basis
- accordion sections include order fields
