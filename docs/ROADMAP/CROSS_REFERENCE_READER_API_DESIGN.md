# Cross Reference Reader API Design

Date: 2026-06-22

## Purpose

This document records CR-27 Cross Reference Reader API Design.

The purpose is to design a future read-only API for querying Cross References from the Bible Reader based on the selected verse. The API must support the data-backed Cross Reference panel planned in CR-26 while preserving WCM's reference-only boundary:

- Cross Reference rows store references and metadata only.
- Bible text remains in the existing Bible storage/API layer.
- OpenBible rows are currently `theme` relationships with `review_status = unreviewed`.
- The API must not imply quotation, fulfillment, typology, or WCM editorial approval for unreviewed imported rows.

This document is design only. It does not implement an API, controller, repository, frontend behavior, database write, import, schema change, migration, backend runtime change, or frontend runtime change.

## Current State

Current validated Cross Reference data state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
schema implemented: yes
local import completed: yes
import validation passed: yes
imported relationships: 341176
source_dataset: openbible
relationship_type: theme
review_status: unreviewed
duplicate relationship identities: 0
invalid references: 0
```

Reader integration state:

```txt
Reader integration design: completed
Reader API: not implemented
Reader frontend data-backed panel: not implemented
```

## Route Design

Recommended route:

```txt
GET /wcm/v1/cross-references/{book}/{chapter}/{verse}
```

Example:

```txt
GET /wp-json/wcm/v1/cross-references/john/3/16
```

### Version Parameter Review

The recommended first API does not require a Bible version path parameter because Cross Reference records are version-independent references.

The selected Bible version belongs to the Reader navigation layer unless the API is explicitly approved to return target text snippets.

If snippets are approved later, use one of these forms:

```txt
GET /wcm/v1/cross-references/{book}/{chapter}/{verse}?version=WEB&include_text=true
GET /wcm/v1/cross-references/{version}/{book}/{chapter}/{verse}?include_text=true
```

Policy:

- `include_text` defaults to false.
- `include_text=true` requires a valid `version`.
- Without `version`, `include_text=true` must return `include_text_requires_version`.
- Version is not needed for reference-only responses.

### Reference-Only Response Review

Default response must be reference-only:

- source reference
- target references
- relationship metadata
- attribution metadata
- pagination metadata

Default response must not include Bible text.

### Target Text Snippet Review

Target text snippets are optional future behavior.

If implemented later:

- snippets must use existing Bible API/lookup logic
- snippets must respect the requested Bible version
- snippets must be bounded and short
- snippets must not be duplicated into `wcm_cross_references`
- missing snippet text must not make the reference item fail

## Query Parameters

Supported first-phase query parameters:

```txt
page
per_page
relationship_type
review_status
include_text
sort
```

Recommended defaults:

```txt
page=1
per_page=10
include_text=false
sort=source_score_desc
```

Recommended maximums:

```txt
max_per_page=50
```

### Pagination Policy

Rules:

- `page` must be a positive integer.
- `per_page` must be a positive integer.
- Default `per_page` is `10`.
- Maximum `per_page` is `50`.
- Invalid pagination should return `invalid_pagination`.
- The API must never return the full Cross Reference dataset.
- The API may use `has_more` instead of an expensive total count if needed.

### Relationship Type Filter

Allowed relationship types should align with the Cross Reference Plan:

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

Current imported OpenBible rows are all:

```txt
theme
```

Unsupported values must return `unsupported_relationship_type`.

### Review Status Filter

Initial supported values:

```txt
unreviewed
reviewed
approved
held
rejected
```

Current imported OpenBible rows are all:

```txt
unreviewed
```

Unsupported values must return `unsupported_review_status`.

### Include Text Parameter

Default:

```txt
include_text=false
```

Policy:

- `include_text=false` returns references only.
- `include_text=true` is future optional behavior only.
- `include_text=true` requires a valid Bible version.
- `include_text=true` must never read text from `wcm_cross_references`.
- `include_text=true` must use existing Bible API/lookup logic.

### Sort Parameter

Initial supported values:

```txt
source_score_desc
canonical
```

Default:

```txt
source_score_desc
```

Unsupported values should return `invalid_sort`.

## Response Shape

Default top-level response:

```json
{
  "source_reference": {
    "book": "john",
    "chapter": 3,
    "verse": 16
  },
  "items": [],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "has_more": false,
    "total": null
  },
  "attribution": {
    "source": "OpenBible.info Cross References",
    "license": "CC BY",
    "url": "https://www.openbible.info/labs/cross-references/"
  },
  "source_dataset_summary": {
    "openbible": 0
  }
}
```

Item shape:

```json
{
  "target_reference": {
    "book": "romans",
    "start_chapter": 5,
    "start_verse": 8,
    "end_chapter": null,
    "end_verse": null
  },
  "relationship_type": "theme",
  "relationship_label": {
    "ko": "관련 주제",
    "en": "Related Theme"
  },
  "review_status": "unreviewed",
  "source_score": 974,
  "source_dataset": "openbible"
}
```

Optional metadata may include:

```json
{
  "id": 123,
  "confidence": "source_backed",
  "review_label": {
    "ko": "검토 전",
    "en": "Unreviewed"
  },
  "package_id": "cross_reference.openbible.normalized.2026-06-22.001"
}
```

Optional future text snippet fields:

```json
{
  "target_text": "But God commends his own love toward us...",
  "target_version": "WEB"
}
```

## Text Snippet Policy

Default:

```txt
Bible text is not included.
```

Optional future behavior:

```txt
include_text=true
```

Requirements:

- `include_text=true` requires `version`.
- If `version` is missing, return `include_text_requires_version`.
- Target text must be loaded through existing Bible API/lookup logic.
- Target text must not be copied into `wcm_cross_references`.
- Snippets must be short and bounded.
- Text lookup failures should omit `target_text` for that item instead of failing the whole Cross Reference response.

## Sorting Policy

Default sort:

```txt
source_score DESC
target canonical order fallback
```

Recommended SQL/order intent:

```txt
source_score DESC
target_book canonical order ASC
target_start_chapter ASC
target_start_verse ASC
id ASC
```

`source_score` policy:

- It is source ranking metadata.
- It is not theological certainty.
- It should not be presented as a doctrinal confidence score.

Fallback sort:

```txt
canonical
```

Canonical fallback means target book canonical order, target chapter, target verse, then stable row id.

## Validation / Error Handling

Required validation errors:

```txt
invalid_book
invalid_reference
invalid_pagination
unsupported_relationship_type
unsupported_review_status
include_text_requires_version
```

Additional useful errors:

```txt
invalid_sort
invalid_version
```

Validation rules:

- `book` must be a WCM canonical book slug.
- `chapter` must be a positive integer.
- `verse` must be a positive integer.
- The requested reference should be validated against canonical Bible reference data where practical.
- `page` must be a positive integer.
- `per_page` must be a positive integer and no more than `50`.
- `relationship_type` must be allowlisted when provided.
- `review_status` must be allowlisted when provided.
- `include_text=true` requires `version`.
- `sort` must be allowlisted.

Invalid request behavior:

```txt
400
```

Valid reference with no rows:

```txt
200
items=[]
```

Recommended error response:

```json
{
  "code": "invalid_pagination",
  "message": "Invalid pagination parameters.",
  "details": {
    "field": "per_page",
    "reason": "per_page must be between 1 and 50"
  }
}
```

## Performance Policy

Required:

- indexed source lookup
- bounded response
- pagination required
- no full dataset endpoint
- max `per_page` cap
- no unbounded `include_text`
- no chapter-wide response by default
- no frontend-bundled Cross Reference package

Initial query strategy:

```txt
WHERE source_book = ?
AND source_start_chapter = ?
AND source_start_verse = ?
ORDER BY source_score DESC, target_book ASC, target_start_chapter ASC, target_start_verse ASC, id ASC
LIMIT per_page + 1
OFFSET (page - 1) * per_page
```

Use `per_page + 1` to compute `has_more` without requiring a full count.

Expected indexes:

```txt
source_lookup
source_type_score_lookup
source_review_score_lookup
```

Before implementation, inspect actual schema/index names in `SchemaInstaller` and the local database.

## Security / Public Surface

The future API must be read-only.

Do not add:

- write route
- import route
- review/moderation route
- raw source export
- full package export
- full dataset endpoint

Implementation requirements for a future phase:

- sanitize path and query parameters
- validate numeric values
- use prepared SQL
- cap pagination
- avoid raw SQL errors
- return only public reference metadata

## Attribution Policy

OpenBible attribution must be preserved.

The API should support frontend display by returning attribution metadata, or by exposing stable metadata in a documented field:

```json
{
  "attribution": {
    "source": "OpenBible.info Cross References",
    "license": "CC BY",
    "url": "https://www.openbible.info/labs/cross-references/"
  }
}
```

Policy:

- Attribution must remain visible in API metadata or available for frontend display.
- CC BY attribution must be preserved.
- Source dataset identity should remain visible through `source_dataset`.
- The API should not obscure that current rows are OpenBible-derived and unreviewed.

## Backward Compatibility

This API would be additive.

It must not change:

- Bible Reader API responses.
- Bible Search API responses.
- Original Language API responses.
- Interlinear API responses.
- Word Study API responses.
- Existing frontend route behavior.

## Future Implementation Tests

Future implementation should test:

- `GET /wcm/v1/cross-references/genesis/1/1`
- `GET /wcm/v1/cross-references/john/3/16`
- `GET /wcm/v1/cross-references/romans/8/28`
- valid reference with no rows returns `200` and `items=[]`
- invalid book returns `invalid_book`
- invalid reference returns `invalid_reference`
- invalid pagination returns `invalid_pagination`
- unsupported relationship type returns `unsupported_relationship_type`
- unsupported review status returns `unsupported_review_status`
- `include_text=true` without version returns `include_text_requires_version`
- `per_page` cannot exceed `50`
- no Bible text is included by default
- no DB write occurs

## Risks

### User Confuses Theme With Fulfillment

Current OpenBible rows are `theme` and `unreviewed`. UI/API labels must remain conservative.

### API Overfetch

The imported dataset has `341,176` rows. Unbounded routes are not acceptable.

### Attribution Loss

OpenBible attribution must remain available in the API metadata or frontend display.

### Text Duplication

Snippet support could accidentally duplicate Bible text unless it is explicitly version-aware and lookup-based.

### Future Review Workflow Pressure

Reader display may increase the need for curated review states. Review/moderation endpoints are out of scope for this API design.

## Non-Actions

This document does not authorize or perform:

- API implementation
- Controller implementation
- Repository implementation
- frontend implementation
- DB write
- import
- schema change
- migration
- backend runtime change
- frontend runtime change
- raw source export
- full package export
- staging apply
- production apply

## Final Recommendation

Proceed to:

```txt
CR-28 - Cross Reference Reader API Implementation Approval Review
```

CR-28 should review whether the API design is approved for implementation, verify the existing WordPress REST/controller/repository patterns, confirm actual table/index names, and define the exact implementation scope before any API code is written.
