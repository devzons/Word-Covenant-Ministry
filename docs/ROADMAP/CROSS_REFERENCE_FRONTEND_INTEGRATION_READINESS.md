# Cross Reference Frontend Integration Readiness

Date: 2026-06-22

## Purpose

This document records CR-30 Cross Reference Reader API Validation / Frontend Integration Readiness.

This phase validates the completed read-only Cross Reference Reader API contract and defines the frontend integration boundary for CR-31. It does not implement frontend UI, add components, add API routes, write data, import data, change schema, add migrations, or change staging/production.

## Current State

Completed:

- Cross Reference source acquired.
- Cross Reference package created.
- Cross Reference dry run passed.
- `wcm_cross_references` schema implemented.
- Local import completed.
- Import validation passed.
- Reader integration design completed.
- Reader API design completed.
- Read-only Reader API implemented.

Current data/API state:

```txt
imported relationships: 341176
source_dataset: openbible
relationship_type: theme
review_status: unreviewed
API route: GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
frontend data-backed integration: not implemented
```

## API Validation Summary

Validated through WP-CLI REST dispatch using the Local WP MySQL socket:

```txt
/wp-json/wcm/v1/cross-references/genesis/1/1
/wp-json/wcm/v1/cross-references/john/3/16
/wp-json/wcm/v1/cross-references/romans/8/28
```

Smoke results:

```txt
genesis 1:1: status=200, total=61, page=1, per_page=20, has_more=true
john 3:16: status=200, total=23, page=1, per_page=20, has_more=true
romans 8:28: status=200, total=43, page=1, per_page=20, has_more=true
genesis 1:1 page=2: status=200, total=61, page=2, per_page=20, has_more=true
per_page=101: status=400, code=invalid_pagination
page=0: status=400, code=invalid_pagination
relationship_type=not_a_type: status=400, code=unsupported_relationship_type
review_status=not_a_status: status=400, code=unsupported_review_status
include_text=true: status=400, code=include_text_not_supported
```

Contract observations:

- Response is reference-only.
- Response items do not include Bible text.
- Pagination metadata is present.
- Attribution metadata is present.
- `source_dataset_summary` is present.
- `relationship_type=quotation` is a supported filter value, but currently returns zero rows because the imported OpenBible package contains only `theme` rows.
- Unsupported literal filter values correctly return `400`.

## Frontend Data Contract

CR-31 should add frontend types for the API response without changing the backend contract.

Recommended TypeScript shapes:

```ts
type CrossReferenceReference = {
  book: string;
  start_chapter: number;
  start_verse: number;
  end_chapter: number;
  end_verse: number;
};

type CrossReferenceItem = {
  target_reference: CrossReferenceReference;
  relationship_type: string;
  relationship_label: string;
  review_status: string;
  source_score: number | null;
  source_dataset: string;
};

type CrossReferencePagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_more: boolean;
};

type CrossReferenceAttribution = {
  source_dataset: string;
  attribution: string;
  source_url: string;
};

type CrossReferenceResponse = {
  source_reference: CrossReferenceReference;
  items: CrossReferenceItem[];
  pagination: CrossReferencePagination;
  attribution: CrossReferenceAttribution;
  source_dataset_summary: Record<string, number>;
};
```

Recommended fetch function:

```txt
getCrossReferences(book, chapter, verse, options)
```

Recommended options:

```txt
page
per_page
relationship_type
review_status
sort
```

Frontend should preserve typed error handling for:

```txt
invalid_book
invalid_reference
invalid_pagination
unsupported_relationship_type
unsupported_review_status
include_text_not_supported
```

## Reader Integration Readiness

The Bible Study Workspace is ready for data-backed integration with conditions.

Existing integration points:

- `BibleReader` already renders a right-side research panel.
- `ResearchPanelNavigation` already includes Search, Insight, and Cross Ref sections.
- `BibleReader` already computes a candidate verse for the Cross Ref panel from active/hash or selected original/interlinear verse state.
- `CrossReferencePanel` already receives `locale`, `translation`, `book`, `chapter`, and optional `verse`.

Required CR-31 frontend changes:

- Replace the current curated local Cross Reference lookup with API-backed lookup.
- Keep existing right-panel placement.
- Add loading, empty, and error states.
- Load page 1 by default with `per_page=20`.
- Add "load more" behavior for `has_more`.
- Keep responses bounded.
- Preserve current locale and Bible version when navigating to target references.
- Continue to avoid Bible text duplication in Cross Reference data.

Mobile readiness:

- The existing research panel already collapses under the reader on smaller screens.
- CR-31 should keep the Cross Reference section compact and avoid dense unbounded lists.
- Load-more interaction is preferred over infinite scroll.

## UX Policy

Required display policy:

- Use `Related Theme` for `relationship_label`.
- Do not auto-label OpenBible rows as quotation, fulfillment, typology, or doctrinal certainty.
- Surface `review_status=unreviewed` clearly or with a concise explanatory note.
- Treat `source_score` as sorting metadata only.
- Do not render `source_score` as confidence, authority, or theological certainty.
- Keep Cross Reference links reference-first and concise.
- For empty results, show a quiet empty state rather than a placeholder that implies missing data is an error.

## Attribution Policy

Frontend integration must preserve and display attribution from the API metadata.

Required attribution content:

```txt
www.openbible.info CC-BY 2026-06-22
https://www.openbible.info/labs/cross-references/
```

Recommended placement:

- Bottom of the Cross Reference panel.
- Small muted text.
- Present only when API attribution metadata is available.

## Risks

High:

- Users may mistake unreviewed `theme` relationships for WCM-reviewed theological conclusions.
- A dense list of references can overwhelm the mobile Bible Reader.

Medium:

- If frontend ignores pagination, it may overfetch or create slow panel rendering.
- If attribution is not carried through the UI, source license obligations may be missed.
- If selected verse state is absent, chapter-level fallback could show too many unrelated references.

Low:

- API currently rejects `include_text=true`; future snippet support would need separate approval and frontend type changes.
- Current local Cross Reference placeholder data should be removed or clearly replaced during CR-31 to avoid mixed-source confusion.

## Final Verdict

```txt
Ready With Conditions
```

Conditions:

- CR-31 must keep the frontend implementation API-backed, paginated, and reference-only by default.
- CR-31 must display OpenBible attribution.
- CR-31 must preserve the UX distinction that imported OpenBible rows are unreviewed related-theme references.
- CR-31 must not add backend routes, write routes, imports, schema changes, migrations, or Bible text duplication.

## Next Objective

```txt
CR-31 Cross Reference Reader Frontend Integration
```

Recommended CR-31 scope:

- Add frontend Cross Reference API client/types.
- Replace the static curated Cross Reference panel with data-backed API results.
- Preserve search/insight tabs and existing Bible Reader layout.
- Add loading, empty, error, pagination, attribution, and target navigation behavior.

## Non-Actions

Not performed in CR-30:

- No frontend implementation.
- No UI component addition.
- No API implementation.
- No DB write.
- No import.
- No schema change.
- No migration.
- No staging or production change.
