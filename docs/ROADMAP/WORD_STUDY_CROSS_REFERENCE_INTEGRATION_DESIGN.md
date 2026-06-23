# Word Study Cross Reference Integration Design

Date: 2026-06-23

## Current State

Word Study is available inside the Original Word Panel flow:

```txt
Original Word Panel
-> Strong Study Panel
-> Term Study Panel
-> Scripture Insight
-> Distribution
-> Occurrence Explorer
```

Current frontend components:

- `frontend/src/components/scripture/OriginalWordPanel.tsx`
- `frontend/src/components/scripture/StrongStudyPanel.tsx`
- `frontend/src/components/scripture/TermStudyPanel.tsx`
- `frontend/src/components/scripture/TermDistributionPanel.tsx`
- `frontend/src/components/scripture/TermOccurrenceExplorer.tsx`
- `frontend/src/components/scripture/CrossReferencePanel.tsx`

Current Word Study API helpers:

- `getWordStudyStrong(strongsNumber)`
- `getWordStudyTerm(termId, page, perPage)`
- `getWordStudyTermDistribution(termId)`
- `getOriginalLanguageTermOccurrences(termId, page, perPage)`

Current Cross Reference API helper:

- `getCrossReferences({ book, chapter, verse, page, perPage })`

Current Cross Reference data state:

```txt
table: wp_wcm_cross_references
relationships: 341,176
source_dataset: openbible
relationship_type: theme
review_status: unreviewed
API: GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
```

CR-36 validated the API-backed Related Passages panel and verse preview modal, including focus return to the triggering `View passage` / `본문 보기` button.

## Integration Goal

Word Study should help users move from an original-language term to related passages without implying that a shared word automatically creates a doctrinal relationship.

The integration should answer:

- Where does this term occur?
- Which occurrence passages have existing source-backed Cross References?
- Which related passages can be previewed in the current Bible version?
- Which references are unreviewed OpenBible theme links versus future curated WCM links?

## MVP Scope

Status: implemented and locally validated in CR-39.

The first Word Study Cross Reference MVP should remain frontend-only if possible and use existing APIs:

1. Add a compact "Related Passages" section inside `TermStudyPanel`.
2. Use the term's existing `sample_occurrences` first.
3. For each sample occurrence with a parseable book/chapter/verse, call the existing Cross Reference API for that verse.
4. Display a small, bounded list of occurrence-linked related passages.
5. Reuse the existing Cross Reference item vocabulary:
   - Related Theme / 주제
   - Unreviewed / 검토 전
   - OpenBible attribution
6. Reuse the existing verse preview modal policy:
   - lazy fetch Bible text
   - current Bible version
   - single verse and same-chapter range
   - unsupported range fallback
   - Open in Reader link

Implemented MVP limits:

- Maximum occurrence seeds: `3` sample occurrences.
- Maximum related items per occurrence: `3`.
- No automatic term-wide aggregation.
- No new backend API.
- No schema change.
- No Cross Reference import or data mutation.

## Non-MVP Scope

The following should be deferred:

- Term-wide Cross Reference aggregation across all occurrences.
- New `/word-study/terms/{termId}/cross-references` API.
- New Cross Reference relationship types from lexical matching.
- Automatic `word_study` relationships.
- Hebrew-Greek bridge-driven relationship generation.
- Cross Reference review workflow.
- Curated relationship editing.
- Gospel Harmony integration.
- Timeline, People, Events, or Commentary integrations.
- Staging/production data changes.

## Data Model Review

Existing Word Study data:

- `wcm_original_terms` stores term-level lexical data.
- `wcm_original_word_occurrences` stores occurrence-level reference data, source refs, morphology, and term links.
- Term Study API returns:
  - `term`
  - `summary`
  - `sample_occurrences`
  - `page`
  - `per_page`
- Occurrence Explorer API can page through full term occurrences.
- Distribution API returns book/chapter occurrence counts.

Existing Cross Reference data:

- `wcm_cross_references` stores reference-only relationships.
- It does not store Bible text.
- Imported OpenBible rows are:
  - `relationship_type=theme`
  - `review_status=unreviewed`
  - `source_dataset=openbible`

No new schema is required for a sample-occurrence MVP because Cross References can be looked up by occurrence reference.

## API Design Options

### Option A - Frontend Composition With Existing APIs

Flow:

```txt
TermStudyPanel
-> getWordStudyTerm(termId)
-> sample_occurrences
-> getCrossReferences(book, chapter, verse)
```

Pros:

- No backend change.
- No schema change.
- Fastest safe MVP.
- Uses validated Cross Reference API and modal behavior.

Cons:

- Multiple API requests.
- Limited to sample occurrences.
- Not a complete term-level Cross Reference view.

Recommendation for MVP: use Option A.

### Option B - Occurrence Explorer Driven Lookup

Flow:

```txt
TermOccurrenceExplorer page
-> visible occurrence refs
-> Cross Reference lookup for selected occurrence
```

Pros:

- User intent is clearer because the user chooses an occurrence.
- Bounded API traffic.

Cons:

- Adds interaction steps.
- Does not provide a compact term summary.

Recommendation: useful as a secondary phase after Option A.

### Option C - Future Backend Aggregation API

Possible future route:

```txt
GET /wp-json/wcm/v1/word-study/terms/{termId}/cross-references
```

Response should be bounded and grouped:

```txt
term
occurrence_summary
items grouped by source occurrence
pagination
attribution
```

Rules:

- Read-only.
- No Bible text by default.
- Bounded `per_page`.
- Server-side cap on occurrence scan size.
- Sort by occurrence importance or canonical order, then Cross Reference `source_score`.

Pros:

- Efficient.
- Stable frontend contract.
- Can support term-wide aggregation.

Cons:

- Requires backend implementation and performance review.
- Requires careful query planning over potentially high-frequency terms.

Recommendation: defer until after frontend MVP proves useful.

## Frontend UX Design

### Term Study Summary Placement

Add a compact section below Scripture Insight and above action buttons:

```txt
Related Passages
These are related passages for sampled occurrences of this term.
```

Korean:

```txt
관련 구절
이 단어의 일부 출현 구절에 연결된 관련 구절입니다.
```

Each group should show:

- occurrence reference
- surface form
- top related targets
- source/review badge
- preview and reader actions

### Avoiding Overwhelm

Default display:

- Show only `3` occurrence groups.
- Show only `3` related passages per occurrence.
- Provide a "View occurrences" link to the existing Occurrence Explorer.
- Avoid "all related passages" language until a future backend aggregation API exists.

### Preview Behavior

Use the same policy as CR-36:

- Preview modal fetches Bible text lazily from existing Bible API.
- Current Reader version controls preview text:
  - KRV routes preview KRV.
  - WEB routes preview WEB.
- Cross Reference data remains reference-only.
- Unsupported range fallback remains visible and non-crashing.
- Open in Reader preserves locale/version and navigates to `mode=reader#v{verse}`.

## Related Passages Compact Card UX Proposal

### Current Card Layout

Current `CrossReferencePanel.tsx` card structure:

```txt
[Theme] [Unreviewed]

Acts 7:8

[View passage] [Open in Reader]

Source: OpenBible
```

Current classes:

- Card: `rounded-md border border-zinc-200 bg-white p-3`
- Badge row: `flex flex-wrap items-center gap-2`
- Reference: `mt-3 text-sm font-semibold text-zinc-950`
- Actions: `mt-3 flex flex-wrap gap-2`
- Source: `mt-2 text-xs text-zinc-500`

Actions are correctly typed:

- `View passage` / `본문 보기`: `<button>`
- `Open in Reader` / `성경 본문으로 이동`: Next `<Link>`

Focus return depends on the preview button remaining a real button and passing `event.currentTarget`.

### Proposed Compact Card Layout

Desktop:

```txt
[Theme] [Unreviewed]
Acts 7:8                          [View passage] [Open in Reader]
Source: OpenBible
```

Korean:

```txt
[주제] [검토 전]
사도행전 7:8                     [본문 보기] [성경 본문으로 이동]
출처: OpenBible
```

Mobile:

```txt
[Theme] [Unreviewed]
Acts 7:8
[View passage] [Open in Reader]
Source: OpenBible
```

Recommended structure:

```txt
li
  badge row
  reference/action row
    reference
    action group
  source
```

Recommended Tailwind approach:

- `li`: keep `rounded-md border border-zinc-200 bg-white p-3`
- reference/action row: `mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`
- reference: `min-w-0 text-sm font-semibold text-zinc-950`
- action group: `flex flex-wrap gap-2 sm:justify-end`
- buttons/links: keep current accessible button/link semantics

### Desktop Behavior

- Reference and actions share one row.
- Actions align right.
- Reference remains visually prominent.
- Card height is reduced by one vertical block.

### Mobile Behavior

- Row wraps naturally.
- Reference appears above actions when space is tight.
- Buttons remain full text labels, not icons.
- No horizontal scrolling required.

### Accessibility Notes

Must preserve:

- `View passage` as a `<button>`.
- `Open in Reader` as a link with `aria-label`.
- `event.currentTarget` focus return path for preview modal.
- Visible focus rings.
- Keyboard tab order:
  - preview button
  - Open in Reader link
  - next card controls

### Risk Assessment

Risk is low if only layout classes and markup grouping change.

Do not change:

- modal state
- `onPreview` signature
- target href generation
- attribution
- unsupported range fallback
- preview cache
- API helper

Smallest safe implementation plan:

1. Modify only `CrossReferenceItemView` in `frontend/src/components/scripture/CrossReferencePanel.tsx`.
2. Move reference and action group into one responsive flex row.
3. Keep badge row and source line unchanged.
4. Keep all button/link handlers unchanged.
5. Re-run CR-36 focus-return browser checks.

This compact card change was implemented and reused in CR-39 through a shared card component.

## Accessibility Considerations

Word Study Cross Reference UI must:

- Use real buttons for preview actions.
- Use links for Reader navigation.
- Preserve focus return after modal close.
- Avoid unlabeled icon-only controls.
- Keep review status visible but not alarmist.
- Keep OpenBible attribution visible.
- Provide loading, empty, and error states.
- Avoid dense nested scroll traps inside the drawer.

## Performance Considerations

MVP frontend composition must stay bounded:

- Limit sampled occurrences.
- Limit Cross Reference requests per render.
- Abort or ignore stale requests on term change.
- Avoid looking up every occurrence of high-frequency terms.
- Avoid prefetching preview text for all targets.
- Reuse existing lazy modal fetch.

Future backend aggregation must:

- Use indexed occurrence reference lookup.
- Use indexed Cross Reference source lookup.
- Page results.
- Cap scan size.
- Avoid unbounded term-wide joins.

## Risks

- High-frequency terms may produce too many occurrence-linked references.
- Users may interpret OpenBible `theme` links as WCM-reviewed theology.
- Multiple frontend API calls may create loading noise in the drawer.
- Source references may not always map cleanly from occurrence data to canonical book/chapter/verse.
- Mobile drawer space is limited.
- Adding Cross References too high in Term Study may distract from term identity and distribution.

Mitigations:

- Use small limits.
- Label imported links as unreviewed/source-backed.
- Prefer occurrence-grouped display.
- Keep detailed exploration in Occurrence Explorer.
- Defer aggregation to a later API review.

## Recommended Implementation Phases

### CR-38 - Word Study Cross Reference Frontend MVP Approval Review

Review the frontend-only Option A plan:

- sample occurrences only
- existing Cross Reference API only
- existing modal behavior reused
- no backend/API/schema/data changes

Status: complete.

### CR-39 - Word Study Cross Reference Frontend MVP

Implement a bounded Term Study section:

- load Cross References for up to `3` sample occurrences
- display up to `3` related targets per occurrence
- reuse preview modal behavior or extract shared preview UI only if required
- preserve CR-36 focus return

Status: complete.

Implementation summary:

- Added Term Study Related Passages section.
- Extracted shared compact card and passage preview modal components.
- Reused existing Cross Reference API and Bible chapter API.
- Threaded current Reader translation into Word Study flow so KRV and WEB previews use the current version.
- Fixed Escape handling so closing the preview modal does not close the parent Word Study drawer.
- Browser QA passed for lazy loading, KRV/WEB previews, focus return, body scroll cleanup, Open in Reader links, and compact labels.

Known limitation:

- Strict unsupported-range fallback was not encountered in sampled Term Study QA. Reader Related Passages QA confirmed supported same-chapter ranges, but a dedicated strict unsupported-range fixture remains a CR-40 follow-up.

### CR-40 - Word Study Cross Reference Validation

Validate:

- Hebrew term from Genesis 1
- Greek term from John 3 or Matthew 1
- KRV preview
- WEB preview
- unsupported fallback
- focus return
- no console errors
- no excessive API calls

Status: next.

Recommended CR-40 focus:

- Post-MVP UX review.
- Dedicated unsupported-range fixture validation.
- Scripture Research integration planning for the next approved surface.

### Future - Aggregation API Design

Design a backend endpoint only after frontend MVP proves useful.

## Validation Plan

Documentation validation:

```txt
git diff --check
git status --short
```

Future implementation validation:

```txt
cd frontend && npm run typecheck
cd frontend && npm run lint
git diff --check
```

Future browser QA:

- Term Study opens from Hebrew Interlinear.
- Term Study opens from Greek Interlinear.
- Related Passages section loads bounded occurrence groups.
- Preview modal works.
- Focus return works.
- Open in Reader works.
- Unsupported range fallback works.
- Drawer remains usable on mobile.

## Open Questions

- Should the MVP show related passages in Term Study summary by default, or behind a "Related Passages" button?
- Should occurrence groups be sorted by canonical order, sample occurrence order, or Cross Reference availability?
- Should future aggregation include all term occurrences or only curated/high-impact occurrences?
- Should future `word_study` relationships be generated manually, by curated bridge data, or by occurrence review workflow?
- Should high-frequency function words suppress Word Study Cross References by default?

## Final Recommendation

CR-39 Word Study Cross Reference Frontend MVP has passed local validation.

Implemented MVP:

- Frontend-only.
- Existing APIs only.
- Bounded sample occurrence lookup.
- Shared preview modal behavior reused.
- No backend/API/schema/import/data changes.

Current next recommendation:

- Proceed to CR-40 post-MVP review, unsupported-range fixture validation, and Scripture Research integration planning.
