# Timeline Data Coverage Matrix

## 1. Purpose

This document tracks current Timeline Workspace data coverage.

- The current Timeline data layer is still centered on preview and manual fixture rows.
- The matrix is meant to expose gaps and guide expansion priorities.
- It does not replace biblical text.
- External world-history, Korean-history, and map-reference information remain supporting layers only.
- External history is not a basis for interpreting Scripture.

## 2. Current Data Sources

Current Timeline data and rendering sources:

- Timeline fixture source:
  - `frontend/src/components/scripture/timeline/timelinePreviewData.ts`
- Compatibility export:
  - `frontend/src/components/scripture/timeline/passionWeekTimeline.ts`
- Main UI shell:
  - `frontend/src/components/scripture/timeline/TimelinePageShell.tsx`
- Events view renderer:
  - `frontend/src/components/scripture/timeline/ScriptureTimelineList.tsx`
- Right inspector:
  - `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx`

Current exported preview collections observed in `timelinePreviewData.ts`:

| Data Type | Current Source | Approx Row Count | Status |
| --- | --- | ---: | --- |
| Timeline periods | `timelinePreviewData.ts` | 10 | Preview |
| Timeline books lookup | `timelinePreviewData.ts` | 30 | Preview |
| Timeline places lookup | `timelinePreviewData.ts` | 36 | Preview |
| Timeline events | `timelinePreviewData.ts` | 65 | Expanded Preview |
| Core biblical event skeleton package | `docs/data-packages/timeline/events.core-biblical-skeleton.json` | 34 | Skeleton package created; frontend preview connected |
| Books / Psalms context rows | `timelinePreviewData.ts` | 12 | Expanded Preview |
| 66-book context skeleton package | `docs/data-packages/timeline/books.66-canonical-skeleton.json` | 66 | Skeleton package created |
| Kings / Kingdoms comparison rows | `timelinePreviewData.ts` | 21 | Expanded Preview |
| Kings / Kingdoms skeleton package | `docs/data-packages/timeline/kings-kingdoms.skeleton.json` | 20 | Skeleton package created; verifier hardened; frontend preview connected |
| Genealogy segments | `timelinePreviewData.ts` | 3 | Preview |
| Genealogy comparison rows | `timelinePreviewData.ts` | 11 | Preview |
| Schematic place rows | `timelinePreviewData.ts` | 20 | Preview |
| Korean history rows | none | 0 | Placeholder only |

Notes:

- Counts above are based on the current checked-in fixture file.
- `passionWeekTimeline.ts` is a compatibility export layer, not a second dataset.
- `events.core-biblical-skeleton.json` adds a package-level Scripture-first event baseline and now feeds the frontend Events preview through the Timeline route server loader.
- `books.66-canonical-skeleton.json` now feeds the frontend Books / Psalms preview through the Timeline route server loader.
- Korean history currently exists only as a collapsed placeholder UI in Events period groups.

## 3. Coverage Status Legend

Coverage status labels used in this document:

- `None`: no current data
- `Placeholder`: UI placeholder only
- `Preview`: representative sample rows only
- `Expanded Preview`: preview coverage is broader, but far from full
- `Partial`: major flow exists, but major omissions remain
- `Planned`: designed or discussed, not yet implemented
- `Complete`: avoid using this unless coverage is genuinely exhaustive and verified

Confidence / basis labels currently visible or implied in the preview model:

- Scripture explicit
- Scripture connected
- Superscription-based
- Traditional
- Inferred
- Approximate
- Debated
- Reference only
- Source review required

## 4. Biblical Period Coverage Matrix

Current event-row distribution by implemented Timeline period:

- `primeval`: 8 events
- `patriarchs`: 10 events
- `exodus`: 11 events
- `conquest`: 10 events
- `united-kingdom`: 5 events
- `divided-kingdom`: 4 events
- `exile`: 1 event
- `return`: 2 events
- `gospel`: 10 events
- `acts`: 4 events

Coverage matrix:

| Biblical Period | Event Coverage | Books / Psalms Coverage | Kings / Kingdoms Coverage | Genealogy Coverage | Places Coverage | World / Korean Reference Coverage | Gaps | Recommended Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primeval / Creation / Early Genesis | Expanded Preview | None | None | None | Preview | None / Placeholder | No dedicated book rows; no reference layer rows | Add core event skeleton policy before more detail rows |
| Patriarchs | Expanded Preview | Preview | None | Preview | Preview | None / Placeholder | Sparse place set; no kingdom layer; no external reference rows | Expand canonical book context and place coverage carefully |
| Exodus / Wilderness | Expanded Preview | Preview | None | None | Preview | None / Placeholder | Limited books context and place spread | Add core event skeleton continuity and more place links |
| Conquest / Judges / Ruth | Expanded Preview | None | Preview | Preview | Preview | None / Placeholder | Ruth/Judges context remains thin; place rows are sparse | Add book-context rows before adding many events |
| United Kingdom | Preview | Preview | Expanded Preview | Preview | Partial | World context labels only / Korean placeholder | Event count is modest relative to supporting tables; package row model not yet implemented | Start with a cautious kingdom package skeleton rather than more ad hoc fixture growth |
| Divided Kingdom | Preview | None | Expanded Preview with skeleton baseline | Preview | Partial | World context labels only / Korean placeholder | Event rows still lag behind kingdom comparison density; prophets are not broadly covered; frontend package integration is still pending | Add verifier fixtures and package-hardening before frontend preview integration |
| Exile | Preview | Expanded Preview | Preview | Preview | Preview | Babylon / Persia support only; Korean placeholder | Very few event rows; no broader exile skeleton | Add core exile event skeleton and supporting book rows |
| Return / Post-exile | Preview | Expanded Preview | Preview | None | Preview | Persia support only; Korean placeholder | Genealogy and place links remain thin | Expand return-period linkage before new reference layers |
| Intertestamental Reference Layer | None | None | None | None | None | Planned / Placeholder only | No implemented intertestamental layer | Decide data-package structure before introducing this layer |
| Gospels | Expanded Preview | None | Preview | Preview | None | None / Placeholder | Event preview exists, but gospel book-context layer is absent | Decide whether gospel harmony and timeline data should converge |
| Acts / Early Church | Preview | None | None | None | None | None / Placeholder | Very limited Acts rows; place and book context missing | Add minimal Acts skeleton before deeper detail |
| Epistles | None | None | None | None | None | None | Not represented in period model | Add period policy before adding rows |
| Revelation | None | None | None | None | None | None | Not represented in period model | Add period policy before adding rows |
| Post-biblical Church History Reference | None | None | None | None | None | Planned only | No implemented reference layer | Keep out of scope until source policy is documented |

## 5. View Coverage Matrix

| View | Current Purpose | Data Source | Current Coverage | Strengths | Gaps | Next Data Work |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | High-level Scripture-first flow summary | `timelinePreviewData.ts` via `TimelinePageShell.tsx` | Preview | Quick period summary using current event set | No standalone overview dataset; depends on event coverage quality | Improve underlying event skeleton first |
| Events | Primary narrative timeline grouped by period | `events.core-biblical-skeleton.json` via `TimelinePageShell.tsx` route loader | Expanded Preview in frontend; core event package preview connected; schematic highlight baseline connected; QA recorded | Period grouping, event selection, Scripture Evidence Panel integration, a 34-row package-backed event baseline, same-period/section highlight derived from current selection, and documented fallback behavior for invalid selection state | Many periods still need finer curation, denser related links, and richer supporting metadata | Expand event-package depth while keeping the current preview metadata-only |
| Books / Psalms | Book background and Psalm context | `timelineBookContextRows` plus `books.66-canonical-skeleton.json` | Expanded Preview in frontend; 66-book package preview connected; schematic highlight baseline connected; QA recorded | Clear book-context cards; package-level 66-book skeleton now renders as a metadata-only preview; left canonical section guide now targets stable center sections; center canonical sections now behave as accordion panels with collapsed-by-default first load and open/focus wiring from the navigator; selected-book state can now drive section-level schematic highlight without new query params; current QA confirms highlight and accordion restore do not conflict in the inspected code paths | Psalms and book intros remain minimal; package-backed preview is still metadata-only and not a full contextual database | Keep runtime fixture stable while planning deeper package integration |
| Kings / Kingdoms | Comparison of rulers, kingdoms, prophets, empires | `timelineKingdomComparisonRows` plus `kings-kingdoms.skeleton.json` | Expanded frontend preview; skeleton package created; verifier fixtures created; verifier hardening complete; package-backed frontend preview connected; interaction QA completed; schematic highlight baseline connected; QA recorded | Strongest non-event supporting table; inspector cross-links exist; package design, skeleton baseline, fixture baseline, Kings-specific verifier checks, package-backed frontend preview, left section navigation, center accordion behavior, explicit relation highlighting, and caution-gated chronology emphasis are now in place | Full king sequence and prophet coverage remain incomplete; chronology remains intentionally cautious and metadata-only; live route smoke remained unavailable in this environment | Expand data depth cautiously while preserving the current metadata-only and review-gated chronology policy |
| Genealogy | Matthew-oriented comparison rows | `timelineGenealogySegments`, `timelineGenealogyComparisonRows` | Preview | Clear Matthew 14 / 14 / 14 framing; explicit row linking exists | Luke genealogy and broader OT genealogies are absent | Define wider genealogy coverage model |
| Places / Schematic Map | Concept-zone place reference without coordinates | `timelineSchematicPlaceRows` | Preview with schematic placeholder highlight; final QA recorded | Schematic concept-zone approach is clear; no coordinate overclaim; the center column now includes a schematic-only placeholder highlight summary derived from current selection and existing metadata; no coordinates, map provider, or geocoding are introduced; final QA addendum is recorded in `SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` | Many biblical places missing; no gospel/Acts place spread; still no package-backed places dataset; placeholder remains summary-only rather than full relation rendering | Keep future highlights schematic-only and metadata-derived before expanding place coverage |
| Korean History Reference placeholder | Supporting-only reference placeholder under event periods | `ScriptureTimelineList.tsx` placeholder UI | Placeholder | Authority boundary is explicit; default collapsed | No rows, no source review, no chronology, no links | Keep placeholder-only until source review is approved |
| Scripture Evidence Panel / Context Inspector | Right-side contextual evidence and cross-linking | Existing preview collections via lookup maps | Expanded Preview | Can navigate among existing Events, Books / Psalms, Places, Kingdoms, and explicit Genealogy rows; v1 deep-link restore now supports Events, Books / Psalms, and Kings / Kingdoms through `view` plus `inspectType` / `inspectId` query state; QA is documented in `CONTEXT_INSPECTOR_DEEP_LINKS_QA.md`; CR-91D-3 derives schematic highlight state from the same selection baseline without adding new query params; Places now consume that baseline through a schematic-only placeholder summary surface; final CR-91D QA is documented | Quality still depends on sparse underlying data; Genealogy and Places do not yet support deep-link restore; live route smoke remained environment-limited; Places still lack a package-backed dataset and full relation rendering | Keep the no-coordinate / no-Bible-text guardrails while deferring real Places package work |

## 6. Canonical Book Context Coverage

This section reflects current frontend context rows plus the package-level 66-book skeleton, not full-book introductions.

| Canonical Section | Books Currently Represented | Missing / Weak Areas | Recommended Priority |
| --- | --- | --- | --- |
| Torah | Canonical skeleton rows now exist for all five books; frontend rows still absent | Frontend does not render the package yet | Medium |
| Historical Books | Canonical skeleton rows now exist for all historical books; frontend rows remain selective | Runtime book-context view still shows only a small subset | High |
| Wisdom / Poetry | Canonical skeleton rows now exist; frontend remains selective | Psalms runtime context remains very partial | High |
| Psalms | Canonical skeleton row exists; selective Psalm-specific preview rows still limited | Not a complete Psalm background dataset | High |
| Major Prophets | Canonical skeleton rows now exist for all five books | Frontend context rows remain sparse | High |
| Minor Prophets | Canonical skeleton rows now exist for all twelve books | Runtime context rows remain sparse | High |
| Gospels | Canonical skeleton rows now exist for Matthew, Mark, Luke, John | Frontend gospel book-context layer is still absent | High |
| Acts | Canonical skeleton row exists | Frontend Acts context remains event-led only | High |
| Pauline Epistles | Canonical skeleton rows now exist for all thirteen epistles | No runtime rendering yet | Medium |
| General Epistles | Canonical skeleton rows now exist for all eight general epistles | No runtime rendering yet | Medium |
| Revelation | Canonical skeleton row exists | No runtime rendering yet | Medium |

## 7. Psalms Coverage Matrix

Current Timeline book-context rows include only a small Psalm subset.

| Psalm Group | Current Rows | Basis Type | Coverage Status | Gaps |
| --- | --- | --- | --- | --- |
| Davidic flight superscription Psalms | Psalm 3 | Superscription-based / Scripture connected | Preview | Very small subset |
| Davidic repentance / court-context Psalms | Psalm 51 | Superscription-based / Scripture connected | Preview | Very small subset |
| Mosaic Psalm | Psalm 90 | Superscription-based | Preview | Single-row coverage only |
| Exile Psalm | Psalm 137 | Scripture connected / textual setting | Preview | Single-row coverage only |
| Other superscription Psalms | None in current book-context rows | None | None | Not yet represented |
| Non-superscription Psalms | None in current book-context rows | None | None | Not yet represented |

Important note:

- The current file does not provide a complete Psalm background database.
- Some place cross-links already reference future Psalm-context IDs, but those do not change the current row count in `timelineBookContextRows`.

## 8. Kings / Prophets / Empires Coverage Matrix

Current kingdom comparison rows total `21`.

| Category | Current Coverage | Missing Major Items | Needed Next Work |
| --- | --- | --- | --- |
| United Kingdom | Samuel-to-monarchy transition, Saul, David, Solomon | Full supporting sequence and fuller event alignment | Add fuller event and psalm alignment |
| Northern Israel | Jeroboam, Ahab, Hoshea, Omri/Ahab, Jehu, Jeroboam II | Large parts of the northern sequence remain absent | Add broader sequence policy |
| Judah | Rehoboam, Hezekiah, Asa, Jehoshaphat, Uzziah/Azariah, Ahaz, Manasseh, Josiah, Jehoiakim, Jehoiachin/Jeconiah, Zedekiah | Still not a full Judah sequence | Complete sequence before increasing side labels |
| Assyria | Supporting empire context only | No dedicated empire row model | Keep as supporting context unless a better model is designed |
| Babylon | Supporting empire context only | No dedicated empire row model | Same |
| Persia | Cyrus return row plus supporting labels | Post-exilic imperial coverage remains selective | Add only where Scripture context is explicit |
| Prophets | Samuel, Nathan, Elijah, Isaiah, Jeremiah, Hosea, Amos appear as support tags in places or kingdom rows | Many prophets absent; cross-links remain selective | Expand only with explicit row-level support |

## 9. Places / Map Coverage Matrix

Current schematic place rows total `20`.

Current concept-zone distribution:

- `judah`: 6
- `wilderness`: 3
- `mesopotamia`: 2
- `aram-assyria`: 2
- `canaan`: 2
- `babylon`: 1
- `persia`: 1
- `philistia`: 1
- `east-jordan`: 1
- `egypt`: 1
- `unknown`: 0

| Concept Zone | Current Places | Coverage Status | Gaps |
| --- | --- | --- | --- |
| Egypt | Egypt | Preview | Thin coverage |
| Wilderness / Sinai | Sinai, En-gedi, Wilderness of Judah | Preview | Exodus route and broader wilderness spread missing |
| Canaan / Judah | Jerusalem, Nob, Adullam, Hebron, Bethlehem, Jericho, Shechem | Partial | Many core covenant-land places still missing |
| Philistia | Gath | Preview | Very thin |
| East Jordan / Moab | Moab | Preview | Very thin |
| Aram / Assyria | Aram, Assyria | Preview | Sparse |
| Babylon / Mesopotamia | Ur, Shinar, Babylon | Preview | Sparse and mostly early/exile-focused |
| Persia | Susa | Preview | Very thin |
| Unknown / uncertain | None | None | No uncertain-location row model yet |

Important notes:

- No coordinates are stored.
- No external map provider is integrated.
- Modern-reference labels are secondary and source-cautious.
- Source and license review remain required before any coordinate-based map work.

## 10. World / Korean Reference Coverage

World history:

- Assyria, Babylon, and Persia appear as supporting context labels.
- A synchronized world-history reference layer is not implemented.
- World context remains supporting only.

Korean history:

- `CR-92A` design is documented.
- `CR-92B` placeholder UI is implemented.
- No Korean history rows are present.
- No chronology dataset, source import, or map layer has been added.
- Source review is required before any pilot rows.
- Korean history is not a basis for biblical interpretation.

## 11. Data Architecture Risk

Current risk:

- `frontend/src/components/scripture/timeline/timelinePreviewData.ts` is carrying too many responsibilities at once.
- Manual TS fixture growth is workable for preview work, but it becomes harder to validate as coverage expands.
- Cross-linking now depends on fixture IDs, which raises maintenance cost as row counts grow.

Comparison:

### A. Continue frontend fixture expansion

Pros:

- Fast to edit
- Low ceremony
- Easy to ship small preview changes

Cons:

- Harder to audit completeness
- Larger TypeScript fixture file
- More fragile ID maintenance
- Harder future import/export transition

### B. Move to a Timeline Data Package

Proposed future direction:

```txt
docs/data-packages/timeline/
  events.json
  books.json
  psalms.json
  kings.json
  places.json
  genealogy.json
  references.json
  schema.md
```

Recommendation:

- `CR-93B` should decide the future Timeline data package structure before a large new row push.
- If the project stays on TS fixtures for a while, section markers and validator notes should become stricter.

## 12. Recommended Next Phases

Recommended next phases:

1. `CR-93B Timeline Data Package Design`
2. `CR-93C Core Biblical Event Skeleton`
3. `CR-93D Books / Psalms Coverage Expansion Plan`
4. `CR-93E Kings / Prophets / Empires Completion Plan`
5. `CR-93F Places Coverage Expansion Plan`
6. `CR-93G Reference History Source Review`

## 13. Acceptance Criteria

- Current data sources are identified.
- Current counts or approximate counts are recorded.
- Period-level matrix is included.
- View-level matrix is included.
- The document clearly states that coverage is incomplete.
- The document avoids overclaiming.
- A next data-architecture decision is recommended.
- No code or new data rows are added.
- Roadmap status is updated.
