# Timeline Data Package Design

## 1. Purpose

This document defines a future Timeline Data Package structure for long-term Timeline Workspace maintenance.

- The current frontend manual fixture approach is useful for preview work, but it does not scale well for full biblical coverage.
- The package design exists to support Scripture-first curation across the whole biblical timeline.
- The package must support future validation, careful manual curation, and top-down accordion display.
- This document is design only. It does not authorize implementation, import, schema, API, or UI work.

Rules:

- Bible text itself is not stored in this package.
- Scripture references and anchors are stored instead.
- Every data row must carry basis and caution labels appropriate to its certainty level.
- The package is for future curated/importable Timeline data, not for a final runtime DB contract.

## 2. Authority and Display Order

Authority order:

1. Scripture Anchor
2. Internal Biblical Sequence
3. Biblical Event / Book / Kingdom / Place Context
4. Biblical supporting date / relative year
5. World history reference
6. Korean history reference

Display order rules:

- The center column must read top-down in biblical flow.
- Comparison tables or supporting panels must still sit inside period-based sections.
- Supporting layers must remain visually secondary.
- Reference-history layers must remain below biblical content in both authority and layout.

## 3. Accordion-First Center Column Principle

All center-column views must support accordion or collapsible sections.

Default center-column structure:

1. Section heading
2. Summary metadata
3. Collapsed or expanded rows
4. Scripture anchors visible inside expanded content
5. Supporting labels and caution notes shown as secondary information

Applies to:

- Events
- Books / Psalms
- Kings / Kingdoms
- Genealogy
- Places / Schematic Map
- World / Korean Reference History

Design principles:

- The center column is primarily a one-column, top-down biblical flow.
- Two-column card grids should remain limited to narrow preview use, not the long-term default.
- Layout must not break period sequence for visual convenience.
- Accordion section identity should be available from package data, not invented ad hoc in the UI.

Suggested future display fields:

- `sectionId`
- `sectionTitle`
- `sectionOrder`
- `displayOrder`
- `defaultExpanded`
- `accordionGroup`
- `timelinePeriodId`

## 4. Package Directory Proposal

Proposed structure:

```txt
docs/data-packages/timeline/
  README.md
  schema.md
  package-manifest.sample.json
  periods.sample.json
  books.sample.json
  events.sample.json
  psalms.sample.json
  kings.sample.json
  prophets.sample.json
  empires.sample.json
  places.sample.json
  genealogy.sample.json
  references.sample.json
  cross-links.sample.json
```

Rules:

- `*.sample.json` files are shape-only documentation.
- They must not be treated as approved production data.
- The initial package should be manually curated and Scripture-first.
- A future verifier or importer may exist later, but is not created in this phase.

## 5. Shared Base Fields

Suggested shared base fields across package rows:

- `id`
- `packageVersion`
- `timelinePeriodId`
- `sectionId`
- `sectionTitle`
- `sectionOrder`
- `displayOrder`
- `accordionGroup`
- `defaultExpanded`
- `title`
- `basisLabel`
- `confidenceLabel`
- `cautionNote`
- `sourceBasisLabel`
- `isSupportingReference`
- `scriptureAnchors`
- `relatedEventIds`
- `relatedBookIds`
- `relatedPlaceIds`
- `relatedKingdomIds`
- `relatedPersonLabels`

Shared field rules:

- No Bible text storage.
- Scripture references only.
- Any non-scripture support layer should have `sourceBasisLabel`.
- Uncertain rows should have confidence and caution fields.
- Supporting reference rows should explicitly declare `isSupportingReference: true`.

Suggested shared text shape:

```json
{
  "title": {
    "en": "Example only",
    "ko": "형태 예시"
  }
}
```

## 6. 66-Book Coverage Requirement

The long-term acceptance requirement for the Books package is all 66 biblical books.

Rules:

- Every biblical book must eventually have a book-context row.
- Canonical order metadata must be stored.
- Timeline display order must still prefer period, authorship/background setting, and redemptive-historical flow over plain canonical order.
- Authorship claims must not be overstated.
- Rows must distinguish explicit authorship, superscription-based attribution, traditional attribution, inferred setting, debated setting, and unknown authorship.

Suggested future book fields:

- `bookId`
- `canonicalOrder`
- `canonicalSection`
- `canonicalTitle`
- `timelinePeriodId`
- `timelineSectionId`
- `authorLabel`
- `authorshipBasisLabel`
- `backgroundSettingLabel`
- `backgroundBasisLabel`
- `dateLabel`
- `dateConfidenceLabel`
- `scriptureAnchors`
- `relatedEvents`
- `relatedPlaces`
- `relatedKingdoms`
- `cautionNote`
- `displayOrder`
- `accordionGroup`

Required 66-book design matrix:

| Canonical Section | Books | Package Requirement | Timeline Display Requirement | Authorship Caution |
| --- | --- | --- | --- | --- |
| Torah | Genesis, Exodus, Leviticus, Numbers, Deuteronomy | All 5 books require context rows and canonical order metadata | Group near primeval, patriarchs, and exodus flow sections | Do not overstate composition detail beyond supported basis labels |
| Historical Books | Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther | All 12 books require context rows and relation fields for events, places, and kingdoms | Display by historical flow, not only by canonical adjacency | Use textual, traditional, or debated authorship labels where needed |
| Wisdom / Poetry | Job, Psalms, Proverbs, Ecclesiastes, Song of Songs | All 5 books require context rows; Psalms also needs Psalm-level package support | Display by background setting where safe, with canonical location retained | Job, Proverbs, Ecclesiastes, Song of Songs may require uncertain or traditional labels |
| Major Prophets | Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel | All 5 books require context rows with exile/kingdom link fields | Display inside kingdom, exile, and return flow sections where appropriate | Separate textual background from authorship tradition where needed |
| Minor Prophets | Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi | All 12 books require context rows and prophet-period linkage | Display under kingdom or return-era accordion sections, not only as a canonical list | Mark debated placement or authorship caution explicitly |
| Gospels / Acts | Matthew, Mark, Luke, John, Acts | All 5 books require context rows and Gospel/Acts period mapping | Display in gospel and early church sections top-down | Avoid overstating chronology or composition detail |
| Pauline Epistles | Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon | All 13 books require context rows with Acts-era relationship fields | Display by mission and church-history flow, not canon order alone | Keep authorship and dating cautions where discussion exists |
| General Epistles | Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude | All 8 books require context rows | Display inside early church flow sections | Hebrews especially requires careful basis labeling |
| Revelation | Revelation | Requires its own context row and end-of-canon mapping | Display at the end of the New Testament flow with caution-aware labels | Do not overclaim date or background certainty |

Notes:

- This document names all 66 books as a package requirement.
- It does not create real rows for them.
- “Complete” is not claimed in this phase.

## 7. Events Package Design

Suggested fields:

- `eventId`
- `title`
- `summary`
- `timelinePeriodId`
- `sectionId`
- `sectionTitle`
- `sectionOrder`
- `displayOrder`
- `defaultExpanded`
- `scriptureAnchors`
- `relativeYearLabel`
- `dateLabel`
- `dateBasisLabel`
- `dateConfidenceLabel`
- `people`
- `placeIds`
- `kingdomTags`
- `empireTags`
- `prophetTags`
- `relatedBookIds`
- `relatedPlaceIds`
- `cautionNote`

Accordion requirements:

- Events are grouped by biblical period.
- Default expanded behavior should be configurable at section level.
- Search should open matching sections later.
- Event counts must exclude reference-history rows.

## 8. Psalms Package Design

Psalms can remain part of the book package but also need Psalm-context support as a dedicated package.

Suggested fields:

- `psalmId`
- `psalmNumber`
- `title`
- `canonicalBookId`
- `superscriptionLabel`
- `superscriptionBasisLabel`
- `backgroundSettingLabel`
- `backgroundBasisLabel`
- `relatedNarrativeAnchors`
- `relatedEventIds`
- `relatedPlaceIds`
- `authorshipLabel`
- `authorshipBasisLabel`
- `cautionNote`

Rules:

- Superscription-based rows must be labeled as such.
- Narrative connection must not be overstated as certainty.
- Non-superscription Psalms must not be forced into artificial historical settings.

## 9. Kings / Prophets / Empires Package Design

Possible package split:

- `kings.sample.json`
- `prophets.sample.json`
- `empires.sample.json`
- `kingdom-comparisons.sample.json`

Suggested fields:

- `rulerId`
- `kingdom`
- `reignLabel`
- `timelinePeriodId`
- `sectionId`
- `displayOrder`
- `scriptureAnchors`
- `prophetIds`
- `empireContextIds`
- `synchronismNote`
- `basisLabel`
- `confidenceLabel`

Rules:

- A full king sequence is a later data phase, not this phase.
- Empires remain supporting context, not primary event identities.
- External dates remain secondary to Scripture-connected sequence.

## 10. Places / Schematic Map Package Design

Suggested fields:

- `placeId`
- `title`
- `timelinePeriodId`
- `sectionId`
- `displayOrder`
- `modernReferenceLabel`
- `modernReferenceStatusLabel`
- `conceptRegionLabel`
- `conceptZoneId`
- `conceptFlowGroup`
- `locationBasisLabel`
- `locationConfidenceLabel`
- `scriptureAnchors`
- `cautionNote`
- `relatedEventIds`
- `relatedBookContextIds`

Rules:

- No coordinates in this package phase.
- No map provider.
- Modern labels remain secondary.
- Concept-map grouping should remain top-down and accordion-friendly.

## 11. Genealogy Package Design

Suggested fields:

- `genealogyId`
- `segmentId`
- `timelinePeriodId`
- `sectionId`
- `displayOrder`
- `matthewName`
- `oldTestamentComparison`
- `comparisonLabel`
- `scriptureAnchors`
- `omissionNote`
- `nameVariantNote`
- `basisLabel`
- `relatedEventIds`

Future scope:

- Matthew 1
- Luke 3
- Genesis genealogies
- Chronicles genealogies

Rules:

- Avoid “error” language.
- Distinguish omission, compression, name variant, and comparison note carefully.

## 12. Reference History Package Design

This package covers future world and Korean reference rows.

Suggested fields:

- `referenceId`
- `region`
- `timelinePeriodId`
- `sectionId`
- `displayOrder`
- `title`
- `dateLabel`
- `dateBasisLabel`
- `confidenceLabel`
- `sourceBasisLabel`
- `referenceTypeLabel`
- `cautionNote`
- `isSupportingReference`

Rules:

- Korean history rows require source review before any real content.
- Reference rows are not timeline events.
- Reference rows must be collapsible beneath biblical period content.
- They must not be included in event count or normal search/filter unless explicitly approved later.

## 13. Cross-Link Package Design

Future cross-link file:

- `cross-links.sample.json`

Suggested fields:

- `fromType`
- `fromId`
- `toType`
- `toId`
- `relationLabel`
- `basisLabel`
- `confidenceLabel`
- `cautionNote`

Rules:

- No fuzzy inferred links.
- Explicit IDs only.
- Scripture anchors remain primary.

## 14. Validation / Verifier Requirements

A future verifier should check:

- all IDs are unique
- all 66 canonical books are present in the books package
- required `scriptureAnchors` exist where required
- no Bible text is stored
- no coordinates are present during the no-coordinate phase
- all non-scripture support rows include supporting labels
- Korean history rows include `sourceBasisLabel`
- accordion fields such as `sectionOrder` and `displayOrder` exist where required
- related IDs resolve
- no fake cross-links are introduced

## 15. Migration Strategy

Suggested phases:

- `CR-93B`: design only
- `CR-93B-2`: package skeleton files only
- `CR-93C`: core biblical event skeleton package
- `CR-93D`: 66-book context skeleton package
- `CR-93E`: Psalms superscription package expansion
- `CR-93F`: Kings / Prophets package expansion
- `CR-93G`: Places package expansion
- `CR-93H`: verifier/importer design
- Later: optional DB/API import after explicit approval

## 16. Acceptance Criteria

- The design includes the 66-book requirement.
- The design includes the accordion-first center-column principle.
- The design includes a package directory proposal.
- The design includes shared and package-specific field guidance.
- The design includes verifier requirements.
- The design prevents overclaiming.
- No real data is added.
- No code is changed.
- Roadmap status is updated.
