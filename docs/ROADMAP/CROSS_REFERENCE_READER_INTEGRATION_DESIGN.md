# Cross Reference Reader Integration Design

Date: 2026-06-22

## Purpose

This document records CR-26 Cross Reference Reader Integration Design.

The purpose is to define how WCM should expose imported Cross Reference data inside the Bible Reader while keeping Scripture text primary, preserving source/review metadata, and preventing users from confusing broad `theme` relationships with direct quotations, fulfillments, or doctrinal certainty.

This is a design document only. It does not implement an API, frontend UI, database write, import, schema change, migration, backend runtime behavior, or frontend runtime behavior.

## Current State

Cross Reference data state:

```txt
source acquired: yes
package created: yes
dry run passed: yes
schema implemented: yes
local import completed: yes
import validation passed: yes
imported relationships: 341176
relationship_type: theme
review_status: unreviewed
source_dataset: openbible
```

## Data Boundary

Cross Reference records are reference-only.

Rules:

- `wcm_cross_references` stores source and target references, relationship metadata, package metadata, review state, and source score.
- `wcm_cross_references` does not store Bible text.
- Bible text must be loaded through the existing Bible API for the selected Bible version.
- Target references should remain version-aware at display time.
- A Cross Reference record means "related for study," not "same meaning," "quotation," or "fulfillment."
- `source_score` is source ranking metadata only.

Initial Reader integration must not present `source_score` as theological certainty or pastoral approval.

## UX Placement

Primary placement:

```txt
Bible Study Workspace right research panel
```

Current right panel direction:

- Search tab remains for Bible search.
- Cross Reference tab should move from placeholder/foundation state to a data-backed panel.
- Passage Insight may show a count of available references, but the full list belongs in the Cross Reference panel.

Desktop layout:

- Keep Bible text on the left.
- Display Cross References in the right research panel.
- Use the selected verse as the primary lookup anchor.
- Keep the result list compact and scannable.

Mobile layout:

- Keep Scripture text first.
- Display Cross References below the passage or inside the existing mobile stacked research panel.
- If a drawer pattern is used later, it must preserve focus, close behavior, and scroll containment.

Selected verse behavior:

- If a verse hash or selected verse is available, query references for that verse.
- If no selected verse exists, the panel may show a quiet prompt to select a verse.
- Chapter-level fallback should be avoided for the first API/UI phase because it can overfetch and clutter the panel.

Placeholder replacement direction:

- Existing "Cross references are being prepared" copy should be replaced only after API support exists.
- The replacement panel should show a loading state, error state, empty state, and bounded result list.

## Display Policy

Current imported data policy:

```txt
relationship_type = theme
review_status = unreviewed
source_dataset = openbible
```

Display rules:

- Label OpenBible rows conservatively as "Related theme" or equivalent localized copy.
- Do not label imported OpenBible `theme` rows as quotation, fulfillment, typology, prophecy, promise, or parallel event.
- Do not imply WCM editorial review for `review_status = unreviewed`.
- Optionally show subtle source/review metadata in detail text:
  - source: OpenBible
  - status: unreviewed
- Do not show raw `source_score` as a user-facing certainty score.
- Use `source_score` only for ordering.

Possible Korean labels:

```txt
관련 주제
검토 전
출처: OpenBible
```

Possible English labels:

```txt
Related Theme
Unreviewed
Source: OpenBible
```

## Initial Display Rules

Lookup:

- Query by selected source verse:
  - `source_book`
  - `source_start_chapter`
  - `source_start_verse`
- First phase should not query full chapters by default.
- First phase should not perform reverse target lookup by default.

Ordering:

```txt
source_score DESC
target_book canonical order ASC
target_start_chapter ASC
target_start_verse ASC
```

Default limit:

```txt
10
```

Maximum limit:

```txt
50
```

Pagination:

- API should support pagination or cursor/page parameters.
- UI first phase may show top 10 plus a "More" action when total count exceeds the default limit.
- "More" should request another bounded page, not fetch all rows.

Same-chapter handling:

- Same-chapter references may be visually grouped or marked, but they should not automatically outrank higher source-score references unless a future UX decision approves that behavior.
- Initial ordering should stay source-score based to reflect source ranking consistently.

Target reference display:

- Display canonical localized book name, chapter, verse, and optional range.
- Do not show raw slugs as the primary label when localized book names are available.
- Example:
  - `John 1:1-3`
  - `요한복음 1:1-3`

Target text snippet:

- First API design should treat snippets as optional.
- If target text is included, it must be fetched from the selected Bible version through Bible text lookup logic.
- Snippets should be short and bounded.
- UI must still work without snippets.

Empty state:

- Korean: `선택한 절에 대한 교차 참조가 아직 없습니다.`
- English: `No cross references are available for the selected verse.`

Loading state:

- Korean: `교차 참조를 불러오는 중입니다...`
- English: `Loading cross references...`

Error state:

- Korean: `교차 참조를 불러오지 못했습니다.`
- English: `Unable to load cross references.`

## Navigation Rules

Target reference click behavior:

- Navigate to the Bible Reader for the target reference.
- Preserve current locale.
- Preserve current Bible version.
- Use hash anchor for the target start verse when possible.

Recommended route shape:

```txt
/{locale}/bible/{version}/{target_book}/{target_start_chapter}?mode=reader#v{target_start_verse}
```

Mode query:

- For target navigation, defaulting to `mode=reader` is safest because cross references are passage navigation, not original-language mode navigation.
- If the current mode is `reader`, preserve it.
- If the current mode is `original` or `interlinear`, the UI may choose either:
  - preserve current mode for continuity, or
  - switch to `reader` for cross-reference reading clarity.
- Recommended first phase: use `mode=reader` for target references.

Search query:

- Do not preserve Bible search query `q` when navigating from Cross Reference target links.
- Cross Reference navigation is not search continuation.

Hash anchor:

- Use `#v{target_start_verse}`.
- For ranges, anchor to the start verse.

## API Needs

No API is implemented by this document.

Possible route options:

```txt
GET /wcm/v1/cross-references/{version}/{book}/{chapter}/{verse}
GET /wcm/v1/cross-references/{book}/{chapter}/{verse}
```

Recommended first API shape:

```txt
GET /wcm/v1/cross-references/{book}/{chapter}/{verse}
```

Reason:

- Cross Reference records are version-independent references.
- Bible text is not stored in `wcm_cross_references`.
- Version should be needed only if API includes optional target text snippets.

Alternative if snippets are included:

```txt
GET /wcm/v1/cross-references/{version}/{book}/{chapter}/{verse}
```

Version decision:

- If the response returns references only, omit version.
- If the response includes target text snippets, require version or a `version` query parameter.
- Frontend can fetch target text separately if this keeps the Cross Reference API simpler.

Recommended response fields:

```txt
id
source
target
relationship_type
relationship_label
source_dataset
source_score
confidence
review_status
package_id
pagination
```

Optional response fields:

```txt
target_text
target_version
localized_target_label
```

Pagination:

```txt
page: default 1
per_page: default 10
per_page max: 50
```

Sort:

```txt
sort=source_score_desc
```

Future sort options may include:

- canonical order
- reviewed first
- curated rank

API validation:

- Validate book slug against canonical books.
- Validate chapter/verse as positive integers.
- Validate `per_page` maximum.
- Reject unbounded requests.
- Do not expose full dataset responses.

## Performance Policy

Required backend query policy for future implementation:

- Use `source_lookup` index.
- Query only current selected verse by default.
- Limit response size.
- Paginate or cap all result sets.
- Sort by `source_score DESC` within bounded lookup.
- Do not scan all 341,176 rows for Reader display.
- Do not return full package data.
- Do not bundle cross-reference package into frontend assets.

Recommended defaults:

```txt
default_per_page: 10
max_per_page: 50
hard_max_unpaginated_rows: 50
```

Result count:

- API may include `total` only if counting is efficient enough for the selected verse lookup.
- If total count adds measurable cost, return `has_more` instead.

Caching:

- First phase can rely on normal REST/API caching behavior.
- Any persistent caching strategy should be a later performance decision after profiling.

## Accessibility And Mobile

Accessibility requirements:

- Cross Reference tab must be reachable by keyboard.
- Each target reference must be a real link or button with a clear accessible label.
- Link label should include target reference and relationship label.
- Do not rely on color alone for relationship or review status.
- Loading, error, and empty states should be text-visible.
- Focus should remain stable when changing pages of references.

Suggested accessible link label:

```txt
Open related theme reference: John 1:1-3
관련 주제 참조 열기: 요한복음 1:1-3
```

Mobile requirements:

- Keep Bible text first.
- Keep Cross Reference rows compact.
- Avoid multi-column target cards on mobile.
- Use stacked list rows with clear tap targets.
- Avoid dense metadata unless expanded.
- Ensure long references wrap cleanly.

## UX Risks

### Too Many References

Risk:

Some verses may have many references, causing visual overload.

Mitigation:

- Default to top 10.
- Provide bounded "More" behavior.
- Use concise rows.

### Unreviewed Relationship Confusion

Risk:

Users may assume imported rows are WCM-reviewed or doctrinally certified.

Mitigation:

- Display `Related Theme`, not stronger labels.
- Optionally show `Unreviewed` in a subdued metadata line.
- Reserve stronger relationship labels for future curated/source-backed rows.

### Doctrinal Certainty Confusion

Risk:

Users may interpret `source_score` as truth score or theological certainty.

Mitigation:

- Do not expose source score as a certainty score.
- Use it only for ordering.
- Use neutral copy.

### API Overfetch

Risk:

The imported dataset is large, and unbounded endpoints could become slow.

Mitigation:

- Enforce max `per_page`.
- Query selected verse only.
- Never expose full dataset.

### Mobile Clutter

Risk:

Cross Reference metadata can clutter the mobile reader.

Mitigation:

- Use short labels.
- Hide secondary metadata by default.
- Keep the panel below Scripture text or in a compact drawer.

## Non-Actions

This document does not authorize or perform:

- API implementation
- frontend implementation
- DB write
- import
- schema change
- migration
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## Final Recommendation

Proceed to:

```txt
CR-27 - Cross Reference Reader API Design
```

CR-27 should define the read-only API contract, request validation, response shape, pagination, sorting, and version/snippet policy before any implementation is approved.
