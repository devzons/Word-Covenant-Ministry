# Cross Reference Review Workflow Design

Date: 2026-06-23

## Current State

The Cross Reference MVP is complete in local development:

- OpenBible.info Cross References were acquired, normalized, dry-run validated, imported locally, and validated.
- `wp_wcm_cross_references` contains `341,176` reference-only relationships.
- Imported rows currently use `relationship_type = theme`, `review_status = unreviewed`, `source_dataset = openbible`, and `confidence = source_backed`.
- The Reader Related Passages panel and Word Study Related Passages MVP both consume the read-only Cross Reference API.
- The shared compact card and verse preview modal are validated for KRV/WEB previews, unsupported-range fallback, focus return, and Open in Reader navigation.

Current storage supports:

- canonical source and target references
- source and target ranges
- `relationship_type`
- `source_dataset`
- `source_score`
- `confidence`
- `review_status`
- `package_id`
- `source_checksum`
- `relationship_identity_hash`
- timestamps

Current storage does not include reviewer identity, reviewer notes, reviewed timestamp, editorial rank, or curated override fields.

## Problem Statement

OpenBible relationships are useful as a broad source-backed discovery layer, but they are not WCM editorial conclusions. Deeper integrations such as Gospel Harmony, Timeline, People/Events, Thematic Exploration, and Commentary need a review model that can distinguish broad imported theme links from curated, approved, suppressed, or promoted relationships.

Without a review workflow:

- users may overread unreviewed imported theme links
- future features may accidentally treat source votes as theological certainty
- rejected or low-quality links cannot be suppressed
- important reviewed links cannot be promoted above imported noise
- relationship types such as quotation, fulfillment, typology, and parallel event cannot be assigned responsibly

## Review Workflow Goal

The review workflow should let WCM preserve the full imported source-backed dataset while creating a curated layer for trusted study surfaces.

Goals:

- keep imported OpenBible rows visible only with clear `unreviewed` labeling until reviewed
- allow editors to approve, reject, suppress, or promote relationships
- allow reviewed rows to receive more precise relationship types
- preserve source provenance and package metadata
- avoid automatic doctrinal classification
- support bounded Reader, Word Study, Gospel Harmony, Timeline, and future Commentary use

## Review Status Model

Recommended model:

```txt
unreviewed
needs_review
approved
rejected
suppressed
promoted
```

### MVP Statuses

`unreviewed`

- Default status for imported OpenBible rows.
- May remain visible in Reader and Word Study with clear labeling.
- Must not be treated as WCM editorial approval.

`approved`

- Editor reviewed and accepted the relationship for normal user-facing display.
- May sort above `unreviewed`.
- May be eligible for future curated surfaces.

`rejected`

- Editor reviewed and determined the relationship should not be used.
- Hidden from normal user-facing display.
- Retained for audit and source replay safety.

`suppressed`

- Relationship is not necessarily false, but should not be shown in current UX.
- Useful for noisy, confusing, duplicate-like, or pastorally unhelpful rows.
- Hidden from normal user-facing display.

### Future Statuses

`needs_review`

- Editor or automated audit flagged the row for closer review.
- Useful for high-impact rows, disputed links, or imported rows with low confidence.

`promoted`

- Approved relationship that is especially useful for study.
- Eligible for higher placement in Reader, Word Study, Gospel Harmony, Timeline, or curated research pages.
- Requires explicit editorial decision.

### Existing API Compatibility

The current API allows these statuses:

```txt
unreviewed
reviewed
approved
held
rejected
```

Recommended future alignment:

- Keep `unreviewed`, `approved`, and `rejected`.
- Replace or deprecate `reviewed` in favor of explicit `approved` / `rejected` / `suppressed`.
- Replace or map `held` to `needs_review`.
- Add `suppressed` and `promoted` only after API and admin review approval.

## Relationship Type Model

Recommended relationship type vocabulary:

```txt
theme
quotation
allusion
prophecy
fulfillment
typology
parallel
contrast
word_study
gospel_harmony
timeline_event
```

### MVP Types

`theme`

- Current OpenBible default.
- Broad related passage relationship.
- Should remain labeled conservatively as Related Passages / Related Theme.

`quotation`

- Direct quotation or near quotation.
- Requires explicit review or source-backed classification.

`allusion`

- Recognizable literary echo.
- Requires review because it can be subjective.

`parallel`

- Same or closely parallel event/textual unit.
- Useful for Gospel Harmony and parallel accounts.

`word_study`

- Relationship driven by a reviewed lexical/original-language connection.
- Must not be auto-generated from shared Strong numbers alone.

### Future-Only Types

`prophecy`

- Source passage that is prophetically oriented.
- Should not be applied automatically.

`fulfillment`

- Target passage that fulfills a promise or prophecy.
- Requires explicit editorial/theological review.

`typology`

- Pattern/person/place/event relationship.
- Requires high editorial confidence and notes.

`contrast`

- Intentional contrast between passages.
- Requires careful curation.

`gospel_harmony`

- Relationship generated or curated from Gospel Harmony units.
- Should remain distinct from general `theme`.

`timeline_event`

- Relationship tied to a chronology or event model.
- Future architecture only.

### Current API Compatibility

The current API accepts:

```txt
quotation
allusion
parallel_event
theme
promise_fulfillment
prophecy_fulfillment
typology
law_gospel
word_study
curated_manual
```

Recommended future alignment:

- Keep current API values until a migration/review approval exists.
- Map design vocabulary carefully before any schema/API change.
- Do not rename existing values in storage without a migration plan.
- Treat `parallel_event` as the current equivalent of future `parallel`.
- Treat `promise_fulfillment` and `prophecy_fulfillment` as narrower forms that require explicit review.

## Source / Provenance Model

Every relationship should retain:

- `source_dataset`
- `package_id`
- `source_checksum`
- `relationship_identity_hash`
- source URL / attribution in package or API metadata
- import batch identity
- created and updated timestamps

Future review metadata should include:

- `reviewed_by`
- `reviewed_at`
- `review_notes`
- `review_source`
- `curated_rank`
- `visibility_scope`

These fields are not present in the current table and require a separate schema design and approval if needed.

## Visibility Rules

### Reader Related Passages

Current behavior may continue:

- Show `unreviewed` OpenBible rows with conservative labels.
- Display source attribution.
- Do not show source score as certainty.
- Hide `rejected` and `suppressed` after those statuses are supported.
- Sort future `promoted` / `approved` rows above `unreviewed`.

### Word Study Related Passages

MVP behavior may continue:

- Use sample occurrences only.
- Show bounded Related Passages from existing verse API.
- Preserve `theme` / `unreviewed` labeling.
- Hide `rejected` and `suppressed` after those statuses are supported.
- Prefer `word_study`, `approved`, or `promoted` rows only after explicit review support exists.

### Future Gospel Harmony

Recommended:

- Prefer `parallel_event` / future `parallel` and `gospel_harmony` relationships.
- Do not use generic `theme` rows as harmony evidence.
- Surface OT background/thematic links separately from parallel Gospel event rows.

### Future Timeline

Recommended:

- Use only reviewed event-oriented relationships.
- Do not infer timeline events from OpenBible `theme` rows.
- Require event IDs or curated event references before Timeline integration.

### Future People / Event Pages

Recommended:

- Use `approved` or `promoted` rows by default.
- Allow a clearly labeled unreviewed exploration mode later if useful.
- Keep source attribution visible.

## Review UI Concept

Future admin/editor workflow:

- list references by source passage
- filter by relationship type, review status, source dataset, package ID, and source score
- inspect target passage with version-aware Bible preview
- approve, reject, suppress, or mark needs review
- change relationship type only after review
- add editorial notes
- promote especially useful relationships
- bulk suppress low-quality/noisy rows
- audit by package/source checksum

Recommended review screens:

1. Source Verse Review
   - source reference
   - related targets sorted by source score
   - inline preview
   - status/type controls

2. High-Impact Queue
   - rows with high source score or common source passages
   - likely first editorial review target

3. Suppression Queue
   - noisy links flagged from user/admin feedback
   - bulk suppression support

4. Promoted Passage Queue
   - approved rows selected for Reader, Word Study, Harmony, or future research hub prominence

## API Implications

The current read-only API can support MVP display because it already filters by `relationship_type` and `review_status`.

Future API needs:

- support `suppressed`, `needs_review`, and `promoted` status values after approval
- default user-facing APIs should exclude `rejected` and `suppressed`
- admin APIs need authenticated write routes for review actions
- admin APIs need audit-safe status/type updates
- public APIs should not expose reviewer notes unless explicitly approved
- public APIs should continue returning bounded, paginated, reference-only responses

No API implementation is approved by this document.

## Data / Migration Considerations

Current schema already supports:

- `relationship_type`
- `review_status`
- `source_dataset`
- `source_score`
- `confidence`
- `package_id`
- `source_checksum`
- unique identity hash

Current schema does not support:

- reviewer identity
- reviewed timestamp
- editorial notes
- curated rank
- visibility scope
- review history

MVP review may begin with existing `review_status` and `relationship_type` only, but any real admin workflow should likely add review metadata in a separate additive migration.

Migration rules:

- additive only
- no Bible text storage
- no source package reimport during review migration
- DB backup required before schema or bulk review changes
- rejected/suppressed rows should remain in the table for audit and replay safety
- rollback should restore from backup or replay review-state backup, not delete source data

## Editorial / Theological Review Criteria

Review should follow WCM principles:

- Scripture interprets Scripture.
- Christ-centered reading should be careful, textual, and not arbitrary.
- Imported OpenBible rows are discovery aids, not final authority.
- Quotation requires direct textual evidence.
- Allusion requires a recognizable echo, not merely shared vocabulary.
- Prophecy/fulfillment requires explicit textual and theological review.
- Typology requires a defensible pattern and should not be inferred from source score.
- Theme links should remain broad and modestly labeled.
- Word Study links should not be generated from Strong numbers alone.
- Hebrew-Greek relationships must be curated or source-backed and must not imply identity.

## MVP Scope

Recommended MVP review scope:

- Design a read-only review queue first.
- Review only a small high-impact set, such as Genesis 1:1, John 3:16, Romans 8:28, and selected Gospel passages.
- Use existing fields where possible: `review_status`, `relationship_type`, `source_score`, and `source_dataset`.
- Keep public Reader/Word Study behavior unchanged until review filtering is explicitly approved.
- Record review decisions in documentation or a controlled local process until admin write tooling is approved.

## Deferred Scope

Deferred:

- admin write UI
- authenticated review API
- review metadata migration
- bulk editing
- public filtering changes
- curated promoted sorting
- Gospel Harmony integration
- Timeline and People/Event integration
- user feedback workflow
- review history/audit table

## Risks

- Imported theme links may be mistaken for WCM editorial endorsement.
- Broad thematic data can overwhelm Reader and Word Study views.
- Over-specific relationship labels may imply certainty before review.
- Review tooling introduces write-surface security and audit requirements.
- Changing status/type values without a migration plan can break filters.
- Promoted links may bias interpretation if criteria are not documented.

## Recommended Implementation Phases

### CR-42 - Review Workflow Approval Review

Approve the review model, status vocabulary, relationship vocabulary, and public visibility policy.

### CR-43 - Review Queue Read-Only Design

Design a read-only admin/research queue using existing data.

### CR-44 - Review Metadata Schema Design

Design optional additive fields or a review history table for reviewer identity, notes, timestamps, and audit history.

### CR-45 - Review API Approval Review

Review authenticated write API requirements, permissions, nonce/auth handling, and rollback expectations.

### CR-46 - Review Tool MVP

Implement a small authenticated admin/editor review workflow after explicit approval.

### CR-47 - Public Visibility Policy Implementation

Apply approved/suppressed/promoted filtering rules to public Reader and Word Study surfaces after review tooling exists.

## Validation Plan

Future validation should include:

- status/type filter tests
- public API excludes rejected/suppressed rows
- admin API cannot write without permission
- review writes preserve source metadata
- source row identity remains stable
- Reader and Word Study continue bounded pagination
- rejected/suppressed/promoted examples pass browser QA
- backup/rollback procedure documented before bulk review changes

## Final Recommendation

Proceed next with CR-42 Cross Reference Review Workflow Approval Review.

Do not implement admin tools, API writes, schema changes, or visibility changes until the review workflow model is approved.
