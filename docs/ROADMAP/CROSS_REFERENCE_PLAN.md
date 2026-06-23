# Cross Reference Plan

## Purpose

Cross Reference support will help Word Covenant Ministry connect Scripture passages that interpret, echo, quote, fulfill, or thematically illuminate one another.

The goal is not to create a generic link list. The goal is to support Scripture interpreting Scripture with clear relationship types, reviewable sources, and UI that keeps users anchored in the biblical text.

## Relationship Types

Initial relationship types may include:

- `quotation` - a direct quotation or near quotation.
- `allusion` - a recognizable echo or literary reference.
- `parallel_event` - the same event recorded in more than one passage.
- `theme` - shared biblical theme or doctrine.
- `promise_fulfillment` - promise and fulfillment relationship.
- `prophecy_fulfillment` - prophetic text and fulfillment relationship.
- `typology` - typological pattern, person, place, office, or event.
- `law_gospel` - relationship between command, covenant, and fulfillment.
- `word_study` - lexical or original-language relationship.
- `curated_manual` - manually reviewed relationship that does not fit a narrower type.

Relationship labels should remain conservative. A relationship means "related for study," not "identical meaning."

## Data Model Philosophy

Cross references should store references, not copied Bible text.

Reference records should point to canonical book/chapter/verse ranges and load text at runtime from the selected Bible version API.

Core principles:

- No duplicated Bible text in cross-reference records.
- Version-aware display through existing Bible text APIs.
- Reviewable relationship type and confidence.
- Source/provenance tracked before import.
- Curated or source-backed relationships only.
- No production data import without dry-run validation and approval.

Possible future fields:

```txt
id
source_book
source_start_chapter
source_start_verse
source_end_chapter
source_end_verse
target_book
target_start_chapter
target_start_verse
target_end_chapter
target_end_verse
relationship_type
confidence
source_reference
notes
review_status
created_at
updated_at
```

This is a future concept only. It does not authorize schema work.

## Cross Reference UI

The Bible Reader now includes an API-backed Related Passages panel for the selected verse in the Bible Study Workspace.

Implemented local MVP direction:

- Keep the main Bible text primary.
- Show compact related references in the right-side research panel.
- Use conservative imported labels only. OpenBible imported rows are shown as `theme` / Related Theme and `unreviewed`.
- Let users preview related passages without leaving the current reading context.
- Let users open the target reference in the Bible Reader when they want the full context.
- Avoid overwhelming normal reading mode with dense study data.

Mobile UI should keep cross references below the passage or in a drawer-style panel. Desktop UI may use the existing Bible Study Workspace right panel pattern.

## Word Study Integration

Cross references can support Word Study without merging lexical data and passage relationships into one concept.

Possible integration:

- Strong Study Panel may show passages where related terms appear.
- Hebrew-Greek bridge relationships may suggest related passages.
- Original-language term pages may link to key cross references.
- Cross references may include a relationship type such as `word_study`.

Boundary:

- Do not auto-create cross references from shared Strong numbers alone.
- Do not auto-equate Hebrew and Greek terms.
- Curated or source-backed review remains required.

## Gospel Harmony Integration

Gospel Harmony and Cross References overlap but should remain distinct.

Gospel Harmony focuses on event-unit parallel display across the Gospels.

Cross References can point to:

- Parallel Gospel passages.
- Old Testament backgrounds for Gospel events.
- Prophecy/fulfillment relationships.
- Thematic or typological connections.

Future Gospel Harmony units may generate or expose `parallel_event` relationships, but harmony-unit data should still store references only and avoid copied Bible text.

## Future API Concepts

Possible future read-only API routes:

```txt
GET /wcm/v1/cross-references/{version}/{book}/{chapter}/{verse}
GET /wcm/v1/cross-references/range/{version}/{book}/{start_chapter}/{start_verse}/{end_chapter}/{end_verse}
GET /wcm/v1/cross-references/types
```

Implemented local MVP API route:

```txt
GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
```

Response design should:

- Return references and relationship metadata.
- Optionally include short Bible text snippets only through existing version-aware Bible lookup logic.
- Paginate when result sets can grow.
- Never return large unbounded datasets.
- Preserve source and review metadata where appropriate.

Current API implementation is read-only, bounded, reference-only by default, and includes OpenBible attribution metadata. It does not expose write, review, import, raw-source export, or full-package export routes.

## Phase Roadmap

### Phase CR-1 - Planning

Document purpose, relationship types, UI direction, and integration points.

Status: complete.

### Phase CR-2 - Source And License Review

Identify possible source-backed cross-reference datasets or internal curated workflow.

Requirements:

- License/provenance review.
- Source attribution.
- Data shape inspection.
- Import risk report.

Status: complete. OpenBible.info Cross References was selected as the first source, with TSK/CrossWire as a validation/reference source.

### Phase CR-3 - Data Model Design

Design tables or content model for reference-only relationships.

No schema changes without explicit approval.

Status: complete through CR-15/CR-18 design documents and CR-21 local schema implementation.

### Phase CR-4 - Dry-Run Import Tooling And Package Validation

Prepare dry-run-only validation for reviewed cross-reference data.

Validation should check:

- Valid canonical references.
- Supported relationship types.
- Duplicate relationship detection.
- Source/provenance metadata.
- Expected counts.

Status: complete. Package creation and dry run passed with `341,176` generated relationships and zero duplicate relationships or invalid references.

### Phase CR-5 - Local Import After Approval

Run local-only import after explicit approval.

No production writes without separate deployment approval.

Status: complete locally. `341,176` OpenBible relationships were imported into `wp_wcm_cross_references` with `relationship_type=theme` and `review_status=unreviewed`.

### Phase CR-6 - Reader API And UI Integration

Add cross-reference display to the Bible Study Workspace.

Status: complete locally through CR-36. Reader API, Related Passages UI, verse preview modal, unsupported range fallback, Open in Reader navigation, and focus return validation passed.

### Phase CR-7 - Word Study And Gospel Harmony Integration

Expose curated cross-reference relationships inside Word Study and Gospel Harmony surfaces.

Status: next. CR-37 begins Word Study Cross Reference Integration Design.

## Out Of Scope

This plan does not authorize:

- Implementation.
- Schema changes.
- Migrations.
- Database writes.
- Data import.
- Backend API changes.
- External data collection.
- Production deployment.
- Auto-generated cross references.
- Copyrighted or unverified reference datasets.
- Duplicating Bible text in cross-reference records.
