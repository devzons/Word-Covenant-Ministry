# Gospel Harmony Cross Reference Integration Plan

## Current State

Gospel Harmony is currently a frontend-only, curated, reference-only workspace.

Implemented Gospel Harmony foundation:

- Route: `/[locale]/gospel-harmony`
- URL state: `?unit=<slug>`
- Curated fixture: `frontend/src/data/gospelHarmonyUnits.ts`
- Workspace: `frontend/src/components/scripture/GospelHarmonyWorkspace.tsx`
- Runtime Bible text loading through existing Bible APIs
- KRV text on Korean routes and WEB text on English routes
- Shared passage preview modal support
- Open in Reader links

Cross Reference is available locally:

- Imported OpenBible rows: `341,176`
- `relationship_type = theme`
- `review_status = unreviewed`
- Public Reader API: `GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}`
- Compact related passage cards
- Shared preview modal
- Reader Related Passages panel
- Word Study Related Passages MVP
- Admin-only review infrastructure

Boundary:

- Gospel Harmony fixture data is curated event/pericope data.
- OpenBible Cross References are imported discovery data.
- The two layers must not be treated as the same editorial claim.

## Integration Goal

When a user studies a Gospel Harmony event, WCM should be able to show related passages connected to the parallel Gospel accounts while keeping the meaning clear:

- Harmony data shows curated Gospel event structure.
- Cross Reference data shows source-backed related passages.
- OpenBible `theme/unreviewed` rows are discovery aids, not WCM editorial conclusions.

The first integration should help users move from a Harmony unit to bounded related passages without overwhelming the parallel Gospel reading surface.

## MVP Options

### Option A - Unit-Level Related Passages

Fetch Cross References for every Gospel account in the selected Harmony unit and merge them into one list.

Pros:

- Simple user concept: related passages for this event.
- Compact single section.

Cons:

- Risks hiding which Gospel account produced the reference.
- Can over-aggregate broad OpenBible theme links.
- Harder to preserve editorial clarity.

### Option B - Grouped By Gospel Account

Fetch Cross References for each Gospel account passage start verse and display groups under Matthew, Mark, Luke, and optional John.

Pros:

- Keeps the relationship anchored to the specific Gospel account.
- Matches current Harmony layout.
- Avoids implying a single reviewed event-level relationship.
- Reuses the existing verse-based Cross Reference API.

Cons:

- More UI surface than a single merged list.
- Requires strict per-account limits.

### Option C - Selected Account Only

Only fetch Cross References for the Gospel account or passage the user explicitly expands or selects.

Pros:

- Lowest payload and visual noise.
- Strong user intent boundary.

Cons:

- Less useful on desktop where all accounts are visible.
- Requires account-selection behavior that does not exist yet.

### Option D - Reviewed-Only Future View

Only show `approved` Cross References or future `parallel_event` relationships.

Pros:

- Strongest editorial posture.

Cons:

- Not useful yet because public visibility filtering and review completion are not implemented.
- Requires future API behavior approval.

## Recommended MVP Scope

Use a **frontend-only, lazy-loaded, per-Gospel-account MVP**.

Recommended first implementation:

- Add a `Related Passages` / `관련 구절` section to the selected Harmony unit.
- Keep it collapsed or unloaded until user intent, such as a `Load related passages` button.
- For each Gospel account in the selected unit:
  - Use the passage start verse as the source lookup.
  - Call the existing Cross Reference API.
  - Limit to a maximum of `3` related passages per account.
  - Show only accounts with results.
- Display groups by account:
  - Matthew / 마태복음
  - Mark / 마가복음
  - Luke / 누가복음
  - John / 요한복음 if present in the fixture
- Reuse the compact `CrossReferenceItemCard`.
- Reuse `CrossReferencePassagePreviewModal`.
- Preserve Open in Reader links.
- Preserve unsupported range fallback.
- Preserve focus return and body scroll cleanup.
- Preserve OpenBible attribution.

Do not add:

- Backend API routes.
- Schema changes.
- Data imports.
- Public visibility filtering.
- Automatic `parallel_event` generation.
- Event-level merged ranking.

## UI/UX Design

### Placement

Place the section below the parallel passage columns in the Gospel Harmony workspace.

Suggested labels:

```txt
en: Related Passages
ko: 관련 구절
```

Suggested helper copy:

```txt
en: Source-backed related passages for each Gospel account. OpenBible links are unreviewed discovery data.
ko: 각 복음서 본문과 연결된 출처 기반 관련 구절입니다. OpenBible 링크는 검토 전 탐색 데이터입니다.
```

### Desktop

Use grouped compact lists:

```txt
Related Passages

Matthew 3:13-17
  [Theme] [Unreviewed]                         OpenBible
  John 1:29                  [View passage] [Open in Reader]

Mark 1:9-11
  ...

Luke 3:21-22
  ...
```

### Mobile

Use stacked account groups.

Rules:

- No three-column related passage layout on mobile.
- Keep cards compact.
- Allow natural wrapping for action buttons.
- Keep preview and reader actions reachable without horizontal overflow.

### Empty States

Per-section empty:

```txt
en: No related passages were found for these Gospel accounts.
ko: 이 복음서 본문에 대한 관련 구절이 없습니다.
```

Per-account empty rows should usually be hidden to reduce noise.

### Loading/Error

Use one section-level loading state.

If one account fails but others succeed, prefer showing successful groups and a restrained warning rather than failing the whole section.

## Data/API Strategy

Use existing APIs only.

Source lookup input:

```txt
GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
```

MVP lookup policy:

- `book = harmony passage book`
- `chapter = startChapter`
- `verse = startVerse`
- `per_page = 3`
- `page = 1`

This intentionally uses the start verse only. Full range aggregation is deferred because the current public Cross Reference API is verse-based and a range API would require separate design and approval.

Response usage:

- `items[]` for related targets
- `pagination.total` for optional count display
- `attribution` for OpenBible attribution display
- `relationship_type`, `relationship_label`, and `review_status` for conservative labels

No Bible text should be returned by or stored in Cross Reference data. Preview text continues to be fetched by the shared modal through existing Bible chapter APIs.

## Review Status / Editorial Safety

The MVP must keep these concepts distinct:

- **Gospel Harmony unit**: curated WCM event/pericope fixture.
- **OpenBible Cross Reference**: imported source-backed thematic discovery data.
- **WCM editorial conclusion**: future reviewed status, not implied by this MVP.

Rules:

- Display `theme` as a general related-passage label, not as a doctrinal certainty.
- Display `unreviewed` or an equivalent restrained label.
- Do not call OpenBible references `parallel_event`.
- Do not show `quotation`, `fulfillment`, `typology`, or `prophecy_fulfillment` unless the data explicitly uses those reviewed relationship types in a future phase.
- Do not use Gospel Harmony presence as evidence that OpenBible references are reviewed.

Future public visibility rules may hide `rejected` and `suppressed` references, but that requires a separate approved API behavior change.

## Accessibility Considerations

The integration should preserve existing validated behavior:

- `View passage` / `본문 보기` remains a button.
- `Open in Reader` remains a link with a readable label.
- Preview modal keeps `role="dialog"` and `aria-modal="true"`.
- ESC closes the preview modal.
- Close button closes the preview modal.
- Focus returns to the triggering preview button.
- Mobile stacking avoids horizontal overflow.
- Account group headings should be semantic text headings where practical.
- Loading and error states should be text-visible, not icon-only.

## Performance Considerations

Boundaries:

- No eager loading on initial Harmony page load.
- Lazy-load only after user intent.
- Maximum source lookups per selected unit equals visible Gospel accounts in the fixture, currently up to `4`.
- Maximum results per account: `3`.
- No unbounded API calls.
- No full Cross Reference dataset response.
- No full Bible text prefetch for all cards.
- Preview modal remains lazy fetch on click.

Recommended first implementation maximum:

```txt
4 account lookups x 3 related passages = 12 visible cards
```

If that feels heavy in browser QA, reduce the initial MVP to Matthew/Mark/Luke only or selected-account-only loading.

## Deferred Scope

Defer:

- New backend range Cross Reference API.
- Event-level merged Cross Reference ranking.
- Full passage-range aggregation across every verse in a Harmony passage.
- Reviewed-only public filtering.
- Automatic `parallel_event` relationship generation.
- Writing Harmony-derived Cross References.
- Gospel Harmony schema/API/import work.
- Gospel Harmony review/admin workflow.
- Timeline integration.
- People/Event integration.
- Thematic exploration layer.
- Relationship type editing from the Harmony UI.
- Bulk review actions.

## Risks

### Editorial Risk

Users may assume OpenBible `theme/unreviewed` references are WCM-reviewed Harmony evidence.

Mitigation:

- Keep labels conservative.
- Keep helper copy clear.
- Avoid `parallel_event` wording for OpenBible rows.

### Information Overload

Harmony already displays multiple Gospel passages. Adding related passages can make the page dense.

Mitigation:

- Lazy-load after user intent.
- Group by Gospel account.
- Limit results per account.
- Hide empty account groups.

### Range Coverage Risk

Start-verse lookup may miss references tied to later verses in a long passage.

Mitigation:

- Document the MVP limitation.
- Defer range aggregation/API design.

### Review Status Risk

Current public API returns unreviewed OpenBible rows. Future review status changes may require UI adjustments.

Mitigation:

- Keep API behavior unchanged in MVP.
- Prepare UI copy for review-aware labels.

### Mobile Risk

Parallel text plus related cards may become too long on mobile.

Mitigation:

- Place Related Passages below passage columns.
- Use compact cards.
- Avoid side-by-side related layouts on mobile.

## Recommended Implementation Phases

### CR-62 - Implementation Approval Review

Review this plan before code changes.

Approval questions:

- Is per-account lazy loading the correct MVP?
- Should John be included when fixture data has John?
- Is `3` related passages per account acceptable?
- Is unreviewed OpenBible visibility acceptable for this surface?

### CR-63 - Frontend MVP Implementation

Frontend-only implementation:

- Add Harmony Related Passages section.
- Use existing Cross Reference API.
- Use existing compact cards and shared preview modal.
- No backend/API/schema/import changes.

### CR-64 - Browser Validation

Validate:

- `/ko/gospel-harmony?unit=jesus-baptism`
- `/en/gospel-harmony?unit=feeding-five-thousand`
- lazy-load behavior
- per-account grouping
- preview modal
- Open in Reader
- mobile layout
- no Cross Reference/Word Study regressions

### Future - Range/API Review

If the start-verse MVP is insufficient, design a range-aware Cross Reference API separately.

## Validation Plan

Future implementation validation should include:

```bash
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
git diff --check
```

Browser QA:

- Harmony unit loads.
- Related Passages section is initially unloaded/collapsed.
- User action triggers lookups.
- Matthew/Mark/Luke groups render.
- John group renders only when fixture includes John and UI approval includes John.
- Empty state works.
- Error state works.
- Preview modal works.
- Unsupported range fallback works.
- Open in Reader preserves locale/version.
- No React console errors.
- Reader Related Passages still works.
- Word Study Related Passages still works.

## Final Recommendation

Proceed to CR-62, a Gospel Harmony Cross Reference Frontend MVP Implementation Approval Review.

Recommended MVP:

- Frontend-only.
- Existing APIs only.
- Lazy-loaded after user intent.
- Per-Gospel-account grouping.
- Maximum `3` related passages per account.
- Reuse existing compact cards and preview modal.
- Preserve OpenBible `theme/unreviewed` editorial labeling.
- No schema/API/import/public visibility behavior changes.
