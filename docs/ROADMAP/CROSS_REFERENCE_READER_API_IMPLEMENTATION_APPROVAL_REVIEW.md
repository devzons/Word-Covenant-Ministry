# Cross Reference Reader API Implementation Approval Review

Date: 2026-06-22

## Purpose

This document records CR-28 Cross Reference Reader API Implementation Approval Review.

The purpose is to decide whether the CR-27 read-only Cross Reference Reader API design is ready to proceed to implementation. This review evaluates route shape, repository/read-layer needs, response shape, include-text boundaries, performance, public surface, and user-facing risk before any API code is written.

This is an approval review document only. It does not implement an API, create a controller, implement a repository, change frontend behavior, write to the database, change schema, add a migration, import data, or change backend/frontend runtime behavior.

## Current Phase

```txt
CR-28 - Cross Reference Reader API Implementation Approval Review
```

Current Cross Reference state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
schema implemented: yes
local import completed: yes
import validation passed: yes
relationships: 341176
source_dataset: openbible
relationship_type: theme
review_status: unreviewed
runtime exposure: none
```

## Route Audit

Reviewed route:

```txt
GET /wcm/v1/cross-references/{book}/{chapter}/{verse}
```

### Route Shape

Finding:

The route shape is suitable for the first Reader API because the Reader panel needs selected-verse lookup. It is simple, reference-centered, and does not require a Bible version unless target text snippets are later approved.

Verdict:

```txt
sufficient
```

### Namespace Consistency

Existing WCM REST controllers use:

```txt
wcm/v1
```

Observed patterns:

- `BibleController`
- `BibleSearchController`
- `OriginalLanguageController`
- `WordStudyController`
- `InterlinearController`
- `ApiRegistrar`

The proposed route uses the same namespace and should be registered through the same controller registration pattern in a future implementation.

Verdict:

```txt
sufficient
```

### Future Compatibility

The route remains compatible with future optional behavior:

- query parameter pagination
- `relationship_type` filter
- `review_status` filter
- future `include_text=true` with required `version`
- future target-direction lookup if separately approved

The first implementation should not add range, chapter-wide, bulk, export, import, or write routes.

Verdict:

```txt
sufficient with bounded-scope condition
```

## Repository Audit

The existing codebase uses repository classes under:

```txt
wp-content/plugins/wcm-core/src/Scripture/Repositories/
```

Existing patterns:

- `BibleRepository` handles Bible version, book, verse, chapter, and search reads.
- `OriginalTermRepository` handles original term reads.
- `OriginalWordOccurrenceRepository` handles original word occurrence reads.
- API controllers should remain thin and delegate data reads to repository/service classes.

### Needed Read Layer

Future implementation should add a dedicated read-only Cross Reference repository, for example:

```txt
WCM\Scripture\Repositories\CrossReferenceRepository
```

Expected methods:

```txt
findBySourceReference(book, chapter, verse, page, perPage, filters, sort)
count or hasMore strategy for source lookup
sourceDatasetSummary for returned result set or selected lookup
```

The first phase does not need write, import, review, moderation, delete, or package export methods.

Verdict:

```txt
sufficient if implemented as read-only repository
```

### Source Lookup

Required lookup:

```txt
source_book
source_start_chapter
source_start_verse
```

The repository should use prepared SQL and the approved source lookup index strategy.

Verdict:

```txt
sufficient
```

### Pagination

Required behavior:

```txt
default per_page: 10
max per_page: 50
page: positive integer
```

Implementation should use `LIMIT per_page + 1` to compute `has_more` without requiring a full count.

Verdict:

```txt
sufficient
```

### Sorting

Default sort:

```txt
source_score DESC
target canonical order fallback
```

Implementation must not expose arbitrary sort fields or raw SQL order clauses.

Verdict:

```txt
sufficient
```

## Response Audit

CR-27 response shape includes:

```txt
source_reference
items
pagination
attribution
source_dataset_summary
```

Each item includes:

```txt
target_reference
relationship_type
relationship_label
review_status
source_score
source_dataset
```

### Source Reference

Finding:

`source_reference` provides the selected verse anchor and keeps the response centered on Reader context.

Verdict:

```txt
sufficient
```

### Items

Finding:

The item shape is small and reference-only. It avoids Bible text duplication and includes enough metadata for conservative display.

Verdict:

```txt
sufficient
```

### Pagination

Finding:

Pagination shape supports bounded Reader-panel display and "more" behavior without full-dataset exposure.

Verdict:

```txt
sufficient
```

### Attribution

Finding:

OpenBible attribution is included in the response shape. This is required to preserve CC BY attribution and support frontend display.

Verdict:

```txt
sufficient
```

### Source Dataset Summary

Finding:

`source_dataset_summary` is useful for transparency, especially when future curated or additional datasets are added. For first implementation it may summarize the current bounded result set or the selected lookup scope, but it must not trigger expensive global counts.

Condition:

Implementation must avoid unbounded aggregate scans.

Verdict:

```txt
sufficient with performance condition
```

## Include Text Audit

Default behavior:

```txt
reference only
```

Optional future behavior:

```txt
include_text=true
```

### Default Reference-Only Policy

Finding:

Default reference-only response is correct and matches the schema boundary. Cross Reference rows do not store Bible text.

Verdict:

```txt
sufficient
```

### Version Requirement

Finding:

If `include_text=true` is later implemented, the API must require `version`. Without `version`, it must return:

```txt
include_text_requires_version
```

Verdict:

```txt
sufficient
```

### Bible Text Duplication Prevention

Finding:

The design correctly requires snippet text to come from existing Bible lookup logic, not from `wcm_cross_references`.

Condition:

First implementation should not implement `include_text=true`; it should reject or ignore text inclusion until separately approved.

Verdict:

```txt
sufficient with deferral condition
```

## Performance Audit

Dataset size:

```txt
341176 rows
```

### Source Lookup Index

Finding:

CR-27 requires indexed source lookup. Future implementation must confirm actual index names and query plans against the implemented schema before coding.

Verdict:

```txt
sufficient with implementation verification condition
```

### Pagination

Finding:

Required pagination is appropriate. The default `per_page=10` and max `per_page=50` are suitable for Reader-panel use.

Verdict:

```txt
sufficient
```

### Sorting Strategy

Finding:

Sorting by `source_score DESC` with canonical target fallback matches the imported OpenBible data and avoids arbitrary expensive sort behavior.

Verdict:

```txt
sufficient
```

### Overfetch Controls

Finding:

The design blocks:

- full dataset endpoint
- chapter-wide default lookup
- unbounded `include_text`
- frontend-bundled Cross Reference payload

Verdict:

```txt
sufficient
```

## Security Audit

The future API must remain public read-only.

Required public-surface boundaries:

- no write route
- no import route
- no review/moderation route
- no raw source export
- no full package export
- no full dataset endpoint

Implementation must:

- sanitize path/query parameters
- validate book/chapter/verse
- validate pagination
- validate filters and sort options
- use prepared SQL
- avoid exposing raw SQL errors

Verdict:

```txt
sufficient
```

## Risk Review

### Overfetch

Risk:

Unbounded or chapter-wide responses could degrade Reader performance.

Mitigation:

Default selected-verse lookup only, `per_page=10`, max `50`, no full dataset endpoint.

### Mobile Payload

Risk:

Large payloads could clutter mobile and slow the right-panel/mobile stacked UI.

Mitigation:

Bounded response, compact item shape, no Bible text by default.

### Attribution Omission

Risk:

OpenBible CC BY attribution could be hidden if only row metadata is returned.

Mitigation:

Include `attribution` in API metadata or make it consistently available for frontend display.

### Unreviewed Relationship Confusion

Risk:

Users may treat `theme` + `unreviewed` rows as WCM-approved quotation, fulfillment, typology, or doctrine.

Mitigation:

Use conservative labels: `Related Theme`, `관련 주제`, `Unreviewed`, `검토 전`.

### Implementation Scope Creep

Risk:

API implementation could accidentally include snippets, review endpoints, imports, or reverse/global browsing.

Mitigation:

First implementation must be limited to selected-verse source lookup, bounded pagination, and reference-only response.

## Conditions For Implementation Approval

The design is ready for implementation only if CR-29 remains limited to:

- one read-only controller route family
- one read-only repository/read layer
- source-direction selected-verse lookup
- reference-only default response
- no `include_text=true` implementation unless separately approved
- no write/import/review endpoints
- no frontend implementation
- no DB writes other than normal read-only queries
- no schema or migration changes
- explicit validation for pagination, filters, sort, and canonical references

## Final Verdict

```txt
Ready With Conditions
```

The CR-27 API design is sound and compatible with existing WCM REST patterns, but implementation should proceed only under the conditions above. The first API implementation must be strictly read-only, reference-only, bounded, and limited to selected-verse source lookup.

## Non-Actions

This review did not perform:

- API implementation
- controller creation
- repository implementation
- frontend implementation
- DB write
- import
- schema change
- migration addition
- backend runtime change
- frontend runtime change
- staging change
- production change

## Next Objective

Proceed to:

```txt
CR-29 - Cross Reference Reader API Implementation
```

CR-29 should implement only the approved bounded read-only API scope after inspecting actual route registration, repository patterns, table indexes, and validation helpers.
