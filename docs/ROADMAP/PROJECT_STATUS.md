# Project Status

## Date

2026-06-25

## Purpose

This document records the current project state so the next developer or coding agent can continue Scripture Engine work in a new session without relying on conversation history.

`docs/ROADMAP/` did not exist before this update. It was created because `docs/DECISIONS/` is reserved for ADRs, while this document set records operational status, current implementation state, and immediate next tasks.

Documentation Gate Proportionality applies: architecture, database, API, schema, import, migration, source-data, Data Package, deployment, and production-impacting work keep the full approval gate, while narrow frontend-only UI, route-shell, browser QA, and UX polish work may use the lighter workflow after inspection and relevant validation.

## Required Session Start

Before any future code or documentation change, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. Relevant ADRs under `docs/DECISIONS/`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Conversation memory is not enough. Documentation plus filesystem inspection is required every session.

## Confirmed Official Structure

Repository root:

```txt
/Users/donmini/Local Sites/wordcovenantministry
```

Official paths:

```txt
Frontend: frontend/
Backend Plugin: backend/app/public/wp-content/plugins/wcm-core/
Docs: docs/
Source Data: docs/data-sources/
```

Important warning:

```txt
backend/wcm-core/
```

This directory exists in the local filesystem, but it is a documented non-official path. Do not use it for active plugin work. The only official plugin path is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Completed Scripture Engine Status

- Scripture Engine Foundation completed.
- KRV MDB analysis completed.
- KRV JSON export completed.
- KRV `31,102` canonical verses imported.
- Psalm 72:20 correction completed.
- KRV import verification completed.
- Bible Lookup API implemented.
- Bible Search API implemented.
- Bible Chapter API implemented.
- Book Metadata API implemented.
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.
- Verse Anchor Navigation implemented.
- Active Verse Highlight implemented.
- Chapter Boundary Navigation implemented.

## Current Phase Summary

Current phase:

```txt
CR-90Y Timeline Content Completeness Audit and Content Expansion
```

Status:

```txt
Phase 8A through later Phase 8 original-language UX, morphology presentation, beta cleanup, transliteration coverage, and gloss coverage expansion work have been completed through local development. Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration, Cross Reference verse preview modal validation, CR-37 Word Study Cross Reference integration design, CR-39 Word Study Cross Reference frontend MVP, CR-40 post-MVP unsupported-range validation/research architecture review, CR-41 review workflow design, CR-42 approval review, CR-43 review tool MVP design/readiness review, CR-44 audit metadata design, CR-45 approval review, CR-47 audit metadata schema implementation, CR-49 review tool API/admin design, CR-50 implementation approval review, CR-51 admin-only review API implementation, CR-52 validation/readiness review, CR-53 admin UI approval review, CR-54 admin UI MVP implementation, CR-55 review-tool browser validation, CR-56 Gospel Harmony architecture design, CR-57 approval review, CR-58 implementation approval review, CR-59 frontend MVP implementation/static validation, CR-60 browser validation, CR-61 Gospel Harmony Cross Reference integration planning, CR-63 Gospel Harmony Cross Reference frontend MVP implementation/static validation, CR-64 browser validation, CR-65 Scripture Research Workspace architecture design, CR-67 context model design, CR-70 context provider MVP implementation, CR-71 browser validation, and Gospel Harmony frontend foundation have passed local validation/documentation review. CR-72 research panel navigation refinement is completed through available validation; browser automation was not available in this environment during that turn. CR-73 Biblical Timeline Architecture Design is documented, CR-74 Biblical Timeline Architecture Approval Review is complete, CR-75 Biblical Timeline Conceptual Data Model Design is documented, CR-76 Biblical Timeline Conceptual Data Model Approval Review is complete, CR-77 Scripture-Anchored Timeline MVP Design is documented, CR-78 Scripture-Anchored Timeline MVP Design Approval Review is complete, CR-79 Scripture-Anchored Timeline MVP Implementation Readiness Design is documented, CR-80 Scripture-Anchored Timeline MVP Implementation Readiness Approval Review is complete, CR-81 Scripture-Anchored Timeline MVP Implementation Approval Review is complete, CR-82 Scripture-Anchored Timeline MVP Frontend Implementation has been completed locally in a frontend-only scope, CR-83 Scripture-Anchored Timeline MVP Frontend Validation has been completed through available validation, CR-84 Scripture-Anchored Timeline MVP Browser QA / UX Polish Planning is documented, CR-85 Scripture-Anchored Timeline MVP Browser QA / UX Polish Approval Review is complete, CR-86 Timeline Local Route Accessibility Investigation is complete through available validation, CR-87 Timeline Browser QA / UX Polish is complete through available validation, CR-89 Timeline UX Polish Continuation is complete through available validation, CR-90A-3 Scripture-First Timeline Workspace Design and Data Source Documentation is complete, CR-90B Timeline Workspace Layout Expansion is complete through available validation, CR-90C-1 Primeval Genealogy Bridge Preview is complete, CR-90C-2 Genesis 11 / Patriarchal Relative Timeline Preview is complete through available validation, CR-90C-3 Patriarchal Events and Early Nation Context Preview is complete through available validation, CR-90C-4 Exodus / Wilderness Scripture-Derived Timeline Preview is complete through available validation, CR-90C-5 Conquest / Judges Scripture-First Timeline Preview is complete through available validation, CR-90D Kings, Kingdoms, and Surrounding Empires Preview is complete through available validation, CR-90D-2 Kings & Kingdoms Comparison Table Preview is complete through available validation, CR-90E Psalms and Book Context Preview is complete through available validation, CR-90F Matthew Genealogy Comparison Preview is complete through available validation, CR-90Y Timeline Content Completeness Audit / Content Expansion is complete through available validation, CR-91B-2 Context Inspector Cross-Linking is complete through available validation, CR-91E Timeline Left Navigator Redesign is complete through available validation, CR-92A Korean History Reference Layer Design is documented as a documentation-only reference-layer design, CR-92B Korean History Reference Placeholder UI is complete through available validation, CR-93A Timeline Data Coverage Matrix is complete as a documentation-only audit artifact, CR-93B Timeline Data Package Design is complete as a documentation-only package-architecture design, CR-93B-2 Timeline Data Package Skeleton Files is complete as a docs/data skeleton step, CR-93C Core Biblical Event Skeleton is complete as a docs/data package step, CR-93C-2 Core Event Skeleton Expansion / Hardening is complete as a frontend-connected package expansion step, CR-93D 66-Book Context Skeleton is complete as a docs/data package step, CR-93D-2 66-Book Frontend Preview Integration is complete through available validation, CR-93D-3 Books Canonical Section Navigation Wiring is complete through available validation, CR-93D-4 Books Center Canonical Section Accordion UI is complete through available validation, CR-93E Timeline Package Verifier Design is complete as a docs-only package-guardrail design step, CR-93E-2 Verifier Test Fixtures is complete as a docs/data-fixture step, CR-93E-3 Minimal Verifier Implementation is complete as a read-only data-tooling step, CR-93E-4 66-Book Validation is complete as a verifier-hardening step, CR-93E-5 Cross-Link and No-Coordinate Guardrail Expansion is complete as a verifier-hardening step, CR-93E-6 Verifier CI / Command Wiring is complete as a read-only command-wiring step, and CR-93F Timeline Workspace Interaction QA is complete through available validation. The Scripture Evidence Panel can now navigate among existing Events, Books / Psalms, Places, Kingdoms, and explicitly related Genealogy rows through secondary related-item chips while keeping Scripture anchors as the primary Reader links. Related item chips remain secondary navigation for study convenience. The Timeline package directory now includes skeleton sample package files under `docs/data-packages/timeline/`, `docs/data-packages/timeline/books.66-canonical-skeleton.json`, `docs/data-packages/timeline/events.core-biblical-skeleton.json`, verifier fixtures under `docs/data-packages/timeline/fixtures/`, a minimal CLI verifier at `scripts/timeline/verify-timeline-package.mjs`, and a standard local wrapper command at `scripts/timeline/verify-timeline-packages.mjs`. The 66-book requirement remains documented, the accordion-first center-column principle remains documented, and verifier requirements are now partly enforced by a local read-only CLI without runtime integration. Canonical book validation now includes stronger 66-book package detection, exact count checks, non-empty unique `bookId` checks, canonical order range and gap checks, and OT/NT distribution checks. Cross-link validation now adds explicit target-type checks, Scripture-reference-as-id rejection, duplicate-target ambiguity detection, self-link review warnings, and clearer source/target reporting in readable and JSON output. No-coordinate guardrails now recurse into nested objects and arrays and distinguish forbidden map-provider fields from ordinary source-provider labels. Supporting world/Korean reference rows now fail when they imply primary or equal interpretive authority and warn when they remain explicit review-required placeholders. The new core event skeleton package adds 85 Scripture-reference-only core event rows from Creation through Revelation as a frontend-connected package baseline with normalized `eventId` identity. The new wrapper command verifies verifier syntax, canonical books, core events, valid fixtures, invalid expected-fail fixtures, warning-only fixtures, and JSON smoke output in one repeatable local run. The 66-book frontend preview now reads `books.66-canonical-skeleton.json` through the Timeline route server layer and renders a metadata-only canonical Books / Psalms preview with OT/NT grouping and canonical order in the existing workspace. The Books / Psalms left sidebar canonical section guide now scrolls and focuses stable center-column canonical section targets while preserving locale-stable IDs and metadata-only rendering. The Books / Psalms center column now uses canonical-section accordion panels with all sections collapsed on first load; left navigator section selection opens the matching accordion, scrolls to it, and focuses it; users can directly toggle section headers; and multiple canonical sections can remain open while book rows continue updating the metadata-only Scripture Evidence Panel. The Timeline Workspace interaction QA pass did not require additional frontend code changes and confirmed the current package-backed Events and Books previews, view-aware navigator, and metadata-only right panel behavior through static validation and explicit code-path review. Bible text is not rendered from the package, no backend or API call was added, and `events.core-biblical-skeleton.json` now remains intentionally frontend-connected as the Events preview baseline. Authorship, background, and dating labels remain intentionally cautious and basis-labeled. Korean history placeholder rows remain supporting-only and non-linked. The workspace now moves toward a left sidebar navigator, a main workspace area, and a right detail panel, while keeping the page Scripture-first and page-stay oriented. The lightweight Kings & Kingdoms preview view is enabled and now includes a compact comparison table. The Books / Psalms context preview view is now package-backed for the 66-book canonical skeleton while remaining metadata-only. The Genealogy preview view is enabled and now includes a compact Matthew 14 / 14 / 14 comparison table. Staging/tag/release work remains paused until the next Timeline preview branch is chosen. Browser automation tooling was not available in this environment for direct in-app browser QA, so local static validation, build verification, and explicit-code-path inspection were used in addition to source inspection. Local route smoke for `:3030` was attempted in this session but curl could not connect despite a local listener on port `3030`, so route status evidence remained unavailable from this environment. No backend or dataset import change was required.

Future world-history or Korean-history reference layers remain deferred. If they are introduced later, they must stay reference-only and source-labeled rather than becoming interpretive authority over Scripture.

CR-93C-3 Core Event Frontend QA is now complete through available validation. `docs/ROADMAP/CORE_EVENT_FRONTEND_QA.md` now records the Events package loader path, normalization flow, event-card `aria-pressed` selection behavior, right-panel metadata-only flow, no-Bible-text guardrail, no-coordinate / no-map-provider / no-geocoding guardrails, verifier-wrapper coverage, available frontend validation results, and the current local route-smoke limitation. No required frontend fixes were identified in this QA pass. `node scripts/timeline/verify-timeline-packages.mjs`, `npm run typecheck`, and `npm run lint` passed. `npm run build` remained environment-limited in this session because Next.js Turbopack failed while creating a new process and binding to a port, so that result is recorded as an environment constraint rather than a confirmed Events-preview code defect. No data-package row, API, DB, backend, schema, or runtime import/export change was added.

CR-93D-2 66-Book Frontend Preview Integration follow-up QA gate is now complete through available validation. A same-session cross-package regression check reviewed the Books / Psalms package loader, the `books.66-canonical-skeleton.json` route-loader connection, the Books normalization path, canonical section grouping, accordion behavior, row selection flow, right-panel metadata-only behavior, and the coexistence of the Events, Books, and Kings / Kingdoms package loaders in the shared Timeline route. No regression evidence was found. `node scripts/timeline/verify-timeline-packages.mjs`, `npm run typecheck`, and `npm run lint` passed. Local route smoke remained unavailable from this environment. Because no regression was found, CR-93D-2 follow-up implementation is not needed and the next local source-of-truth priority moves to `CR-92D-2 Korean Reference Period Assignment Hardening`. No frontend, backend, API, DB, schema, runtime import/export, Bible-text, coordinate, map-provider, or geocoding change was added.

CR-92D-2 Korean Reference Period Assignment Hardening is now complete through available validation. The current `5` Korean pilot rows were reviewed against the per-period Events preview and kept within the supporting-only guardrail. `4` rows remain broadly assigned to biblical periods through existing `relatedBiblicalPeriodIds`, while `korean-three-kingdoms-formation-reference` remains intentionally unassigned because it is a post-biblical supporting reference rather than a biblical-period synchronism target. The collapsed Korean-history placeholder wording now distinguishes intentional post-biblical non-assignment from actual assignment-review gaps. No new Korean rows, approved source/citation/provenance changes, Bible text, coordinates, map-provider fields, geocoding, API, DB, backend, schema, or runtime import/export work were added.

CR-92E Korean Reference Inspector Policy Design is now documented in `docs/ROADMAP/KOREAN_HISTORY_INSPECTOR_POLICY_DESIGN.md` as a docs-only design step. The new note keeps Korean history below Scripture anchors and biblical metadata, limits any future right-panel participation to a secondary supporting-reference section only, prohibits Korean-history deep-link support and Korean-history-first inspector selection in v1, keeps Korean-history rows outside default search/filter/count/result-set participation, requires visible source/citation/provenance plus caution/confidence/date-basis labels, and preserves the current post-biblical non-linking boundary for `korean-three-kingdoms-formation-reference`. Implementation remains deferred to a later CR. No frontend, backend, API, DB, schema, runtime import/export, or package-row change was added.

CR-90Y-5 Genealogy Detail Refinement is now complete through available validation. The current genealogy preview remains runtime fixture-backed through `timelineGenealogySegments` and `timelineGenealogyComparisonRows`, with no package migration and no new package rows. The Matthew 1 `14 / 14 / 14` preview copy and genealogy right-panel metadata were refined to emphasize that the current surface is a metadata-only preview of Matthew 1 textual structure plus selected Old Testament comparison markers, not an exhaustive genealogy reconstruction or exact chronology proof. Omission and name-variant observations remain visible but are now phrased more cautiously as selective textual/genealogical observations. No Luke genealogy expansion, broader Old Testament genealogy expansion, deep-link support, API, DB, backend, schema, runtime import/export, Bible text, coordinates, map-provider fields, or geocoding were added.

CR-90Y-4B Kings / Prophets Cross-Link Refinement is now complete through available validation. The current refinement stayed inside the existing metadata-only Timeline preview by tightening wording around runtime kingdom comparison rows, package-backed Kings / Kingdoms detail, and right-panel related chips. Prophet labels remain supporting context tags rather than a selectable primary entity, package-backed kingdom detail now exposes existing related event chips from current metadata, and no new king rows, prophet rows, prophetic-context rows, deep-link support, inspector selection types, API, DB, backend, schema, runtime import/export, Bible text, coordinates, map-provider fields, or geocoding were added.

CR-91 Place / Map Preview is now complete through available validation as a schematic/no-coordinate refinement step. The current Places / Schematic Map view remains runtime fixture-backed through `timelineSchematicPlaceRows`, not package-backed, and the right-panel place detail remains metadata-only. Preview copy, place-panel copy, and selected place-row notes were refined to make the current boundary explicit: this is not a real map, route reconstruction, coordinate layer, map-provider integration, or geocoding feature. No places package integration, coordinates, latitude/longitude fields, map-provider state, geocoding, deep-link support, API, DB, backend, schema, runtime import/export, or Bible text were added.

`Kings / Kingdoms Deeper Expansion Scope Definition` is now documented in `docs/ROADMAP/KINGS_KINGDOMS_DEEPER_EXPANSION_SCOPE.md` as a docs-only scope gate. The current Kings / Kingdoms package baseline remains `20` rows in `docs/data-packages/timeline/kings-kingdoms.skeleton.json` with a `5 / 3 / 2 / 7 / 1 / 2` record-type distribution across `kingdomPeriod`, `kingdom`, `transition`, `king`, `templeMarker`, and `exileMarker`, while the frontend remains mixed because package-backed Kings / Kingdoms preview still coexists with runtime `timelineKingdomComparisonRows` supporting comparison data. The current verifier baseline already covers Bible-text and coordinate/map-provider guardrails, relation validation, and exact-chronology review gating. This scope-definition step does not authorize any package-row additions, runtime-to-package promotion, prophet-package work, or prophetic-context expansion. The next required step remains a separate row-level authorization review before any deeper data expansion begins.

`Prophet-Context Expansion Authorization Review` is now documented in `docs/ROADMAP/PROPHET_CONTEXT_EXPANSION_AUTHORIZATION_REVIEW.md` as a docs-only authorization gate. The current baseline still has `20` active Kings / Kingdoms package rows, `0` connected `propheticContextMarker` rows, no connected prophets package, and an empty `docs/data-packages/timeline/prophets.sample.json` skeleton. Runtime prophet-context material remains limited to `timelineKingdomComparisonRows`, `prophetTags`, and selected event/place metadata. The new review classifies current runtime prophet-context candidates into `review-ready candidate`, `needs-more-source-review`, `separate-approval-required`, and `blocked-for-now` without authorizing any package-row additions, runtime-to-package promotion, prophet-package implementation, inspector selection-type expansion, or deep-link support. Fuller prophet-context implementation remains deferred until separate approval and a later row-level authorization step.

CR-93G Kings / Kingdoms Timeline Package Design is now documented in `docs/ROADMAP/KINGS_KINGDOMS_TIMELINE_PACKAGE_DESIGN.md` as a docs-only package-design step. CR-93G-2 Kings / Kingdoms Skeleton Package is now complete as a docs/data package step. `docs/data-packages/timeline/kings-kingdoms.skeleton.json` now provides a minimal Scripture-reference-only skeleton baseline for kingdom periods, kingdom rows, representative kings, transitions, exile markers, and a temple marker. CR-93G-3 Kings / Kingdoms Verifier Fixtures is now complete as a docs/data-fixture step. Kings / Kingdoms valid, invalid, and warning fixture files now exist under `docs/data-packages/timeline/fixtures/`. CR-93G-4 Kings / Kingdoms Verifier Rule Hardening is now complete as a read-only verifier step. The verifier now recognizes `timeline.kings-kingdoms`, validates allowed record types, checks required Kings fields, resolves `kingdomId` and succession links, validates transition and related-king targets, and fails exact chronology fields that bypass review gating while warning on missing optional `reignLabel`. CR-93G-5 Kings / Kingdoms Frontend Preview Integration is now complete through available validation. The Timeline route now loads `kings-kingdoms.skeleton.json` through the same server-loader pattern used by the Books and Events package previews, the Kings / Kingdoms center column now renders package-backed accordion sections instead of relying on the old comparison table alone, the left navigator now exposes section-level package navigation, and the right Scripture Evidence Panel now renders metadata-only kingdom/king/transition detail from the skeleton package while keeping Scripture references primary and Bible text unrendered. The package stays metadata-only, stores no Bible text, uses no coordinates or map-provider fields, keeps chronology approximate and review-gated, and required no API, DB, backend, schema, or runtime import/export changes. CR-93G-6 Kings / Kingdoms Interaction QA is now complete through available validation. Static validation, build verification, and explicit code-path inspection confirmed the current package-backed Kings / Kingdoms preview, left section navigator, center accordion, and metadata-only right panel behavior without requiring additional frontend fixes. Bible text remains unrendered, chronology remains caution-labeled and review-gated, and no data package rows, verifier rules, API, DB, backend, schema, or runtime import/export behavior changed in this QA pass.

CR-91C Context Inspector Deep Links Scope Definition is now documented in `docs/ROADMAP/CONTEXT_INSPECTOR_DEEP_LINKS_DESIGN.md` as a docs-only design step. The new note defines the deep-link purpose, recommends a `view` plus `inspectType` / `inspectId` query policy, scopes the first implementation pass to Events, Books / Psalms, and Kings / Kingdoms, and fixes the metadata-only restore guardrails before frontend work begins. It does not add frontend code, data package rows, verifier changes, API, DB, backend, schema, or runtime import/export behavior. Bible text remains unrendered, coordinates and map-provider state remain out of scope, and invalid deep-link state is required to fall back safely without stale right-panel content.

CR-91C-2 Events / Books / Kings Deep Link Implementation is now complete through available validation. The Timeline route and shell now restore metadata-only Context Inspector selection from `view`, `inspectType`, and `inspectId` for Events, Books / Psalms, and Kings / Kingdoms; item selection updates the address-bar query without adding per-row browser-history noise; invalid or mismatched deep-link state falls back safely to the active view with no stale right-panel content; and matching Books / Psalms or Kings / Kingdoms accordion sections open during restore. The supported v1 inspect types are `event`, `book`, and `kingdom`. Bible text remains unrendered, Scripture anchors remain reference-only, coordinates and map-provider state remain absent, exact chronology is not promoted to final data, and no API, DB, backend, schema, verifier, or data-package row change was required.

CR-91C-3 Deep Link QA and Docs Sync is now complete through available validation. `docs/ROADMAP/CONTEXT_INSPECTOR_DEEP_LINKS_QA.md` now records the checked URLs, supported restore matrix, invalid-query fallback behavior, query-replacement interaction policy, regression review, and the confirmed metadata-only guardrails for the current Events, Books / Psalms, and Kings / Kingdoms deep-link flow. No required frontend fixes were identified in this QA pass. Live route smoke remained unavailable from this environment because curl could not connect to the local `:3030` route, so the QA result is based on static validation, successful frontend build checks, and explicit code-path inspection.

CR-91D Schematic Flow Highlights Scope Definition is now documented in `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_DESIGN.md` as a docs-only design step. The new note defines schematic flow highlights as metadata-derived UI emphasis rather than real map behavior, keeps the feature Scripture-first and metadata-only, scopes the first implementation pass to Events, Books / Psalms, and Kings / Kingdoms with a deferred schematic-only Places surface, and records that no coordinates, map-provider state, Bible text rendering, backend calls, or external-history authority elevation are allowed. This step does not add frontend code, data-package rows, verifier changes, API, DB, backend, schema, or runtime import/export behavior.

CR-91D-2 Schematic Highlight Data Contract / UI State Design is now documented in `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_STATE_CONTRACT.md` as a docs-only design step. The new note defines highlight inputs, the metadata-derived UI state shape, supported item types, allowed reason and strength taxonomy, Events / Books / Kings derivation policy, fallback behavior, and future component ownership boundaries. It also records that the earlier React `useEffect` dependency-array-size warning remains an implementation prerequisite or known risk rather than being fixed in this docs-only step. No frontend code, data-package rows, verifier changes, API, DB, backend, schema, or runtime import/export behavior were changed.

CR-91D-3 Events / Books / Kings Highlight Implementation is now complete through available validation. The Timeline Workspace now derives schematic highlight state from the existing Context Inspector selection and current package metadata for the package-backed Events, Books / Psalms, and Kings / Kingdoms previews. Selected rows remain primary, explicit metadata relations now receive softer related or caution emphasis, current Books and Kings accordion sections can reflect section-level highlight state, and the right panel continues to explain the metadata-only basis without rendering Bible text or introducing coordinates. No new highlight query parameter was added; the existing `view`, `inspectType`, and `inspectId` deep-link baseline remains the source of truth. No API, DB, backend, schema, verifier, or data-package row change was required. Places / Schematic Map highlight behavior remains deferred to CR-91D-4.

CR-91D-5 Interaction QA and Docs Sync is now complete through available validation. `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` now records the checked Events, Books / Psalms, and Kings / Kingdoms highlight behavior, invalid-selection fallback expectations, regression review, accessibility-focused code review, the current route-smoke limitation for local `:3030` access, and the code-path review result for the earlier React `useEffect` dependency-array-size warning risk. No required frontend fixes were identified in this QA pass. The schematic highlight flow remains metadata-only, adds no Bible text, no coordinates, no map-provider state, no geocoding, no exact chronology inference, and no API, DB, backend, schema, verifier, or data-package row change.

CR-91D-4 Places / Schematic View Placeholder Highlight is now complete through available validation. The Places / Schematic Map view now includes a schematic-only placeholder highlight surface that summarizes the current Context Inspector selection and existing metadata without introducing real-map behavior. The new surface makes the no-coordinate, no-map-provider, no-geocoding, and no-Bible-text guardrails explicit, keeps the existing preview rows and metadata-only right panel intact, and leaves any future Places package integration deferred. No API, DB, backend, schema, verifier, or data-package row change was required.

CR-91D-6 Schematic Flow Highlights Final QA / Docs Sync is now complete through available validation. `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` now carries a final addendum covering Events, Books / Psalms, Kings / Kingdoms, and the new Places / Schematic Map placeholder surface, plus final regression review for deep links, stale-state fallback, accessibility-oriented code paths, route-smoke limitation, and the earlier React `useEffect` dependency-array-size warning risk. No required frontend fixes were identified in this final pass. The full CR-91D branch now remains metadata-only, adds no Bible text, no coordinates, no map-provider state, no geocoding, no exact chronology inference, and no API, DB, backend, schema, verifier, or data-package row change.

CR-92C-0 Korean History Source Review Gate is now documented in `docs/ROADMAP/KOREAN_HISTORY_SOURCE_REVIEW_GATE.md` as a docs-only readiness step. The gate confirms that `CR-92C Korean History Pilot Rows after source review` must not start yet because no approved Korean-history source set or finalized citation/source-basis policy is documented in the current roadmap. Pilot-row creation remains blocked pending explicit source review completion, while all Korean-history references remain supporting-only, non-interpretive, source-labeled, and below Scripture authority. No timeline row, package row, frontend, verifier, API, DB, backend, schema, or runtime import/export change was added.

CR-92C-1 Korean History Source Review and Citation Policy is now documented in `docs/ROADMAP/KOREAN_HISTORY_SOURCE_POLICY.md` as a docs-only policy-definition step. The new note defines Korean-history source categories, approval levels, citation metadata requirements, row-level source-basis labels, chronology label policy, and quotation/copyright boundaries while preserving the supporting-only, Scripture-below authority position. No Korean-history rows were added, no package JSON data changed, and no frontend, verifier, API, DB, backend, schema, or runtime import/export change was made. `CR-92C` remains pending explicit user or project approval of selected Korean-history sources before any pilot rows can begin.

CR-92C-2 Korean History Approved Source Set is now documented in `docs/ROADMAP/KOREAN_HISTORY_APPROVED_SOURCE_SET.md` as a docs-only source-approval step. The new note approves a narrow pilot source set for manually curated Korean-history supporting-reference rows, limited to broad low-risk period references and strict citation metadata requirements. No Korean-history rows were added, no package JSON data changed, and no frontend, verifier, API, DB, backend, schema, or runtime import/export change was made. `CR-92C` may now proceed only as a narrow `3-5` row manual pilot with approved source categories, supporting-only labels, caution-labeled chronology, and no bulk import.

CR-92C Korean History Pilot Rows is now complete as a docs/data package pilot step. `docs/data-packages/timeline/references.korean-pilot.json` now contains `5` manually curated broad Korean-history supporting-reference rows covering prehistoric and Bronze Age background, Gojoseon traditional reference, Han Commanderies, Proto-Three-Kingdoms / Samhan, and Three Kingdoms formation background. The pilot remains supporting-only, stores no Bible text, uses no coordinates, map-provider, or geocoding fields, avoids exact biblical event synchronization, and keeps chronology caution-labeled rather than final. No frontend, verifier, API, DB, backend, schema, or runtime import/export behavior changed in this step.

CR-92D Korean History Frontend Reference Preview Integration is now complete through available validation. The Events view now reads `docs/data-packages/timeline/references.korean-pilot.json` through the Timeline route server loader pattern and renders matching Korean-history pilot rows inside the existing collapsed per-period reference section. These rows remain visually secondary, supporting-only, and explicitly labeled as not a basis for biblical interpretation. They do not count as biblical events, do not affect Events search/filter behavior, do not drive the right Scripture Evidence Panel, and do not add any Bible text, coordinates, map-provider state, geocoding, API, DB, backend, schema, or runtime import/export behavior. One post-biblical pilot row remains intentionally unassigned to biblical periods and therefore stays outside current per-period rendering.
```

Completed phase:

```txt
Scripture Foundation, Search Layer, Reader Layer, Reader UX Polish, Phase 5B Original Language Data Layer, Phase 5C Source Gate / Normalizer Foundation, Phase 5D Dry-run Pipeline, Phase 5E original-language import completion, Phase 6A Original Language Read API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7A Original Language Reader UI Planning, Phase 7B through Phase 7H Original Language Reader MVP, Phase 8A frontend/menu/navigation and interlinear UX cleanup, Phase 8B Korean transliteration presentation data, Phase 8C Korean gloss presentation data, Phase 8D morphology Korean presentation, Phase 8E/8F Korean original-language coverage expansion, Phase 8G through Phase 8K original-language UX audit and beta cleanup, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration/verse preview modal validation, CR-39 Word Study Cross Reference frontend MVP, CR-40 post-MVP unsupported-range validation/research architecture review, CR-41 review workflow design, CR-42 approval review, CR-43 review tool MVP design/readiness review, CR-44 audit metadata design, CR-45 approval review, CR-47 audit metadata schema implementation, CR-49 API/admin design, CR-50 approval review, CR-51 admin-only review API implementation, CR-52 validation/readiness review, CR-53 admin UI approval review, CR-54 admin UI MVP implementation, CR-55 review-tool browser validation, CR-56/CR-57/CR-58 Gospel Harmony design and approval reviews, CR-59 Gospel Harmony frontend MVP implementation/static validation, CR-60 browser validation, CR-61 Gospel Harmony Cross Reference integration planning, CR-63 Gospel Harmony Cross Reference frontend MVP implementation/static validation, CR-64 browser validation, and Gospel Harmony frontend foundation
```

Active objective:

```txt
Use the completed CR-91D schematic baseline as closed, validated Timeline UI infrastructure and continue from the broader approved content-expansion roadmap.
```

Next task:

```txt
Return to the broader Timeline content expansion priorities, starting with the currently documented post-CR-91D roadmap order.
```

Blocked items:

```txt
Full TAGNT NT and full TAHOT OT persistence imports are complete. Phase 6A read-only API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7A planning, Phase 7B through Phase 7H frontend implementation, Phase 8A frontend/navigation cleanup, Phase 8B Korean transliteration data, Phase 8C Korean gloss data, Phase 8D morphology presentation, Phase 8E/8F reviewed Korean original-language coverage expansion, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow through Scripture Insight, Distribution, Occurrence Explorer, and sample-occurrence Related Passages, Cross Reference data layer/API/Reader integration, verse preview modal validation, Gospel Harmony frontend foundation, Gospel Harmony Cross Reference integration planning, Gospel Harmony Cross Reference frontend MVP implementation/static validation, Gospel Harmony Cross Reference frontend MVP browser validation, CR-71 Scripture Research Workspace Context Provider Browser Validation, CR-72 Research Panel Navigation Refinement validation, and WEB local apply are complete through local development. Write/import endpoints, additional source imports, advanced search, morphology explorer, WEB staging/production promotion, Gospel Harmony schema/API/import work, morphology schema/API changes, production deployment automation, and seed migration tracking tables require separate approval.
```

WEB staging and production promotion remain explicitly not approved / blocked. Existing staging review documents keep local WEB apply evidence intact while recording that staging WordPress/path identifiers, DB/WP-CLI context patterns, API/frontend targets, backup/restore command patterns, rollback ownership, recovery window, staging dry-run/report ownership, and staging browser/runtime smoke ownership are still missing. No staging dry-run, staging apply, production dry-run, or production apply is authorized until those non-secret operational facts are documented and a later explicit approval step is completed.

Local commit-readiness reconciliation is now complete. The current worktree is clean, no pending local commit remains for the earlier Scripture UX / Word Study / Cross Reference / Gospel Harmony / roadmap commit reminder, and the relevant local work has already been recorded in recent commits. The next operational concern is push / release readiness reconciliation rather than another local commit.

`Scripture Context Atlas Redesign Scope` is now documented in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_REDESIGN_SCOPE.md` as a docs-only design step. The current Timeline workspace is being reframed as a future Scripture-reading-first context atlas in which Bible text remains primary, existing Timeline package/runtime metadata is reused as right-panel context supply, schematic map policy remains no-coordinate and no-provider, original-language and paja work remain subordinate to Scripture context, and Korean/world-history layers remain supporting-only. Implementation is deferred. The next required step before any prototype is a right-panel completeness audit.

`Scripture Evidence Panel Modular Triage Plan` is now documented in `docs/ROADMAP/SCRIPTURE_EVIDENCE_PANEL_MODULAR_TRIAGE_PLAN.md` as a docs-only planning step. The current right-panel audit has now been split into rendering gaps, normalizer gaps, source-data gaps, intentional preview limitations, and approval-required expansion categories so that future implementation can stay narrow and modular. The current direction is to treat the Scripture Evidence Panel as the future modular right-side context surface for the broader Scripture Context Atlas while deferring implementation, data expansion, media/editorial work, and all approval-gated external-reference or map work.

`Scripture Evidence Panel Safe Completeness Fix Plan` is now documented in `docs/ROADMAP/SCRIPTURE_EVIDENCE_PANEL_SAFE_COMPLETENESS_FIX_PLAN.md` as a docs-only implementation-planning step. The current safe-fix boundary now limits the next implementation CR to frontend-only and normalizer-only carry-through work using fields that already exist in current package or preview sources. The first recommended implementation CR should cover only Events, Books / Psalms, and Kings / Kingdoms panel completeness fixes, while Places panel clarity and broader wording standardization remain deferred to later small CRs.

`Scripture Evidence Panel Completeness Fixes A` is now complete through available validation as a safe frontend-only implementation step. The current Events, Books / Psalms, and Kings / Kingdoms right-panel surfaces now preserve and render more existing source/package metadata without adding any data package rows or new entity types. Existing package-backed fields such as event confidence, event related kingdom/event links, book basis/confidence labels, book related book/kingdom links, and kings package basis metadata are now carried through and shown more explicitly inside the current Scripture Evidence Panel. No Bible text storage or rendering was added, no API / DB / backend / schema / runtime import-export behavior changed, and chronology remains caution-labeled supporting metadata rather than exact proof. Places panel basis/confidence clarity remains the next recommended small CR, while person, original-language/name/paja, Korean/world-history inspector integration, prophet-context expansion, and map expansion all remain deferred.

`Places panel basis/confidence clarity` is now complete through available validation as a second small frontend-only completeness step. The Places / Schematic Map right-panel surface now shows existing `locationBasisLabel` and `locationConfidenceLabel` as explicit label/value rows rather than leaving them buried in note-style text, while `cautionNote` and the broader conceptual note remain clearly secondary caution/reference copy. The place panel also now states its coordinate-free schematic scope more structurally without introducing real-map UI, coordinates, map-provider state, geocoding, route reconstruction, deep-link expansion, package migration, or any API / DB / backend / schema / runtime import-export change. Person, original-language/name/paja, Korean/world-history inspector integration, prophet-context expansion, and map expansion all remain deferred.

`Panel empty-state / preview-limitation wording standardization` is now complete through available validation as a third small frontend-only clarity step. The right Scripture Evidence Panel now uses more consistent short copy where sections would otherwise feel blank or where current preview boundaries need to stay explicit. The no-selection state, empty related-item areas, thinly linked book context, package-backed kingdom relation boundaries, genealogy preview limitations, and sparse place relation cases now explain that the current surface is limited to connected preview metadata and that broader expansions remain deferred or approval-gated. No data package rows, new entity types, Bible text rendering, coordinates, map-provider behavior, geocoding, API / DB / backend / schema changes, or runtime import-export behavior were added.

`Timeline Detail Panel Primitive Extraction` is now complete through available validation as a behavior-preserving frontend-only structure refactor. Shared right-panel primitives now live under `frontend/src/components/scripture/timeline/timeline-detail-panel/`, including `PanelSection`, `SectionNote`, `ContextRow`, `ContextTagGroup`, `RelatedItemButton`, `RelatedItemSection`, `ScriptureAnchorsSection`, and `Tag`, with shared `panelCopy.ts` and `panelTypes.ts` modules extracted as leaf dependencies. `TimelineEventDetailPanel.tsx` now leans more clearly toward container / selection-router / entity-render orchestration responsibility, while entity-specific panel extraction remains deferred to later staged CRs. No data package rows, UI behavior changes, Bible text, API / DB / backend / schema changes, map-provider or coordinate work, or Cloudflare/media work were added.

`Event / Book Evidence Panel Extraction` is now complete through available validation as a second behavior-preserving frontend-only structure refactor step. `EventEvidencePanel.tsx` and `BookEvidencePanel.tsx` now hold the existing Events and Books / Psalms entity rendering logic as leaf components under `frontend/src/components/scripture/timeline/timeline-detail-panel/`, while `TimelineEventDetailPanel.tsx` continues to act as the selection router and orchestration layer for the overall right-panel inspector surface. Shared helper extraction now includes `panelHelpers.ts` for `dedupeById`, `isKingsPackageEvidenceRow`, and `getKingdomEvidenceLabel` so that the leaf components do not import back from the container file. Kingdom, Kings package, Genealogy, and Place panel extraction remain deferred to later staged CRs. No data package rows, UI behavior changes, Bible text, API / DB / backend / schema changes, map-provider or coordinate work, or Cloudflare/media work were added.

`CR-BR-CTX-01 Bible Reader Context Panel Shell with Book-Level Metadata` is now complete through available validation as the first reader-first `Scripture Context Atlas` integration step. The Bible Reader research panel now includes a `Context / 문맥` tab and a new `BibleReaderContextPanel` that renders metadata-only, book-level context using the existing canonical books package through the current `normalizeCanonicalBooksPackage` path. This reader integration remains explicitly limited to book-level metadata: it may show the currently selected verse number as local reader state, but it does not perform verse-level entity tagging, person/place/king/name inference, original-language atlas linking, map integration, or Korean/world-history inspector integration. Timeline remains the advanced/data-validation surface, and Timeline Kingdom extraction remains deferred. No Bible text storage changes, API / DB / backend / schema changes, Timeline package row changes, coordinate/map-provider work, or Cloudflare/media work were added.

`CR-BR-CTX-03 Bible Reader Context Panel Related Metadata Preview` is now complete through available validation as a second reader-first `Scripture Context Atlas` integration step. The current `BibleReaderContextPanel` now includes a compact related-metadata preview section sourced only from current book-level Timeline relationships. Existing related book, event, place, and kingdom identifiers are resolved through read-only canonical-books, core-events, kings/kingdoms, and schematic-place metadata into label-only preview chips for the current book context, while the panel explicitly states that this preview is book-level metadata only and does not mean the selected verse has been entity-tagged. No Bible API changes, backend / DB / schema changes, Timeline package row changes, person/original-language/name/paja work, map/provider/geocoding work, Korean/world-history inspector integration, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-04 Reader Context Panel Selection Copy QA` is now complete through available validation as a narrow frontend-only QA hardening step. The Reader `Context / 문맥` tab now uses more explicit boundary copy so that the selected verse display reads as a reader-state hint rather than an entity-resolution result, and the future-phase note now names people, places, kingdoms, names, and maps as still deferred verse-level layers. The four-tab research-panel navigation also now uses a `2 x 2` mobile grid before the `sm` breakpoint so the `Context / Search / Insight / Related Passages` tabs remain more readable on small screens. No Bible API changes, backend / DB / schema changes, Timeline package row changes, entity resolver work, person/original-language/name/paja work, map/provider/geocoding work, Korean/world-history inspector integration, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-05` through `CR-BR-CTX-13` are now closed as QA-only follow-up passes. In those Codex execution contexts, static validation and explicit code-path review continued to pass, but direct browser/route QA remained unavailable because the environment could not access local loopback routes even while a local dev server process was listening on port `3030`. Those CRs did not change frontend behavior, APIs, backend behavior, DB/schema state, or Timeline data package rows; they only confirmed the environment blocker and preserved the existing reader-first scope boundaries.

Reader Context Panel manual browser QA is now complete based on user-reported local browser verification. The user reported `all ok` for the local Reader Context Panel browser pass on the real local browser host, including the book-level `Context / 문맥` tab flow, related metadata preview or safe empty state, selected-verse boundary copy, existing `Search / Insight / Related Passages` tabs, mobile `2 x 2` research-tab layout, and the absence of `/timeline` regression. This acceptance remains explicitly recorded as user-reported local browser QA rather than Codex-executed browser automation. Timeline remains the advanced/data-validation surface, Timeline Kingdom extraction remains deferred, and no API / backend / DB / schema / Timeline data package row changes were required for this QA closure.

`CR-BR-CTX-16 Reader Context Panel Next Scope Readiness Audit` is now complete as a docs-only audit step. The current Reader Context Panel remains safely limited to book-level context, book-level related metadata preview, and selected-verse reader-state hints. The audit concluded that chapter-level real context would currently overclaim beyond the available data boundary, and that selected-verse-driven metadata filtering would read too much like verse-level entity tagging. The next highest-value candidate is not reader-side entity resolution but secondary advanced-Timeline navigation from supported related metadata targets.

`CR-BR-CTX-17 Reader Context Panel Advanced Timeline Link Audit and Design` is now complete as a docs-only readiness gate in `docs/ROADMAP/READER_CONTEXT_PANEL_TIMELINE_LINK_DESIGN.md`. The current Reader related-metadata shape is still label-only, but the current Timeline route already supports metadata-only deep-link restore for `event`, `book`, and `kingdom` through `view`, `inspectType`, and `inspectId`. The design therefore recommends a later small frontend-only implementation CR that keeps Reader chips non-interactive, adds only secondary `Open in advanced Timeline` actions for supported targets, and continues to defer place links, genealogy links, Korean-history reference links, reader-side entity resolver behavior, verse-level tagging, person/paja/original-language name atlas work, map work, API / backend / DB / schema changes, Timeline data package row changes, and Timeline Kingdom extraction.

`CR-BR-CTX-18 Reader Context Panel Advanced Timeline Link Implementation` is now complete through available validation as a narrow frontend-only Reader enhancement step. The current `BibleReaderContextPanel` still keeps related metadata chips non-interactive and book-level only, but supported related metadata items may now expose a secondary `Open in advanced Timeline / 고급 Timeline에서 보기` link for `event`, `book`, and `kingdom` targets only. These hrefs are generated in the Reader page loader against the existing Timeline deep-link contract, while `place`, `genealogy`, and Korean-reference deep links remain unsupported and deferred. The panel now also states more explicitly that these links open current book-level preview metadata in the advanced Timeline validation view and do not imply selected-verse entity tagging. No Bible API / backend / DB / schema changes, Timeline data package row changes, reader-side entity resolver behavior, verse-level tagging, map/provider/geocoding work, or Timeline Kingdom extraction work were added.

Advanced Timeline link browser QA for `CR-BR-CTX-18` is now complete based on user-reported local browser verification. On the user's real local browser host, `wordcovenantministry.local:3030` frontend routes and `api.wordcovenantministry.local` backend/API responsibilities were both confirmed as working normally, the Reader `Context / 문맥` panel rendered correctly, related `event`, `book`, and `kingdom` advanced Timeline links restored correctly into the Timeline validation surface, `place` correctly remained non-linked, and `/timeline` regression was not observed. This acceptance remains explicitly recorded as user-reported local browser QA rather than Codex-executed browser automation. Earlier Codex route-smoke failures are recorded as execution-environment local-socket access limits rather than product-code defects. No Bible API / backend / DB / schema changes, Timeline data package row changes, unsupported place / genealogy / Korean-reference deep-link work, or Timeline Kingdom extraction work were required for this QA closure.

`CR-BR-CTX-20 Reader Context Panel Post-Link Scope Decision` is now complete as a docs-only readiness and scope-decision step. The current Reader Context Panel v1 scope is accepted as complete at the current book-level boundary: `Context / 문맥` tab, book-level metadata, book-level related metadata preview, selected-verse reader-state hint copy, and supported advanced Timeline links for `event`, `book`, and `kingdom` with `place` intentionally non-linked. The audit concluded that the safest decision is to close Reader Context Panel v1 scope here rather than add more UI surface immediately. Source / basis / confidence refinement remains a safe optional polish path, chapter-level copy remains limited to placeholder-only messaging, and supported Timeline-link regression can be covered by future QA checklists, but none of those is currently more valuable than moving to the next Reader-first planning boundary. Verse-level tagging, selected-verse-driven metadata filtering, reader-side entity resolution, person/paja/original-language name atlas work, place/genealogy/Korean-reference deep links, map/coordinates/geocoding/provider work, Korean/world-history inspector integration, Timeline Kingdom extraction, and any API / backend / DB / schema / Timeline data package row changes remain deferred.

`CR-BR-CTX-21 Scripture Context Atlas Data Readiness Planning` is now complete as a docs-only planning step in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_DATA_READINESS_PLAN.md`. The planning result confirms that current Reader Context Panel v1 capability should remain closed at the accepted book-level boundary, that source / basis / confidence refinement remains only an optional polish path, and that chapter-level placeholder copy alone is not the strongest next move. The current best next planning step is a chapter-level atlas data-package design CR that defines what reviewed chapter-level context would need before any future Reader claim goes beyond book-level metadata. Verse-level tagging, person entities, paja/name atlas work, place/genealogy/Korean-reference deep links, map/provider/geocoding work, Korean/world-history inspector integration, Timeline Kingdom extraction, and any API / backend / DB / schema / Timeline data package row changes remain deferred.

`CR-BR-CTX-22 Scripture Context Atlas Chapter-Level Data Package Design` is now complete as a docs-only design step in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. This design defines the future chapter-level `Scripture Context Atlas` package contract before any implementation, package rows, or Reader UI expansion begins. The recommended contract keeps chapter context explicitly limited to chapter-level overview metadata only: it does not store Bible text, does not act as commentary prose, and does not authorize verse-level tagging, selected-verse filtering, or reader-side entity resolution. The proposed row identity is `chapterContextId + bookId + chapter`, the minimum contract requires explicit `basis`, `confidence`, `caution`, and `reviewStatus` fields, related ids remain limited to canonical books, reviewed event rows, kingdom rows, and schematic place ids, and future verifier guardrails are defined to reject Bible text, coordinate/map-provider fields, unsupported exactness claims, and verse-level tagging fields. No API / backend / DB / schema changes, Timeline data package row changes, or chapter-context implementation work were added, and Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-23 Chapter Context Package Skeleton Design Note` is now complete as a docs-only skeleton-policy refinement step in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. The chapter-level package contract is now refined down to file-level skeleton policy: the preferred file remains `docs/data-packages/timeline/chapter-context.skeleton.json`, the preferred package type remains `scripture-context-atlas.chapter-context`, the first file should begin with an empty `items: []` array, and no sample or real rows should be created until a later separate approval step. The note now also fixes envelope-field policy, deterministic-diff rules, required vs optional row fields, bilingual label shape, review-state meaning, fallback-copy guidance, and future verifier fail/warn expectations for Bible-text, map/coordinate, verse-tagging, duplicate-row, invalid-id, and overclaim cases. No skeleton file was created in this CR, no package rows were added, and no API / backend / DB / schema / Timeline data package row changes or Timeline Kingdom extraction work were added.

`CR-BR-CTX-24 Chapter Context Skeleton File Creation` is now complete as a docs/data-only package-envelope step. `docs/data-packages/timeline/chapter-context.skeleton.json` now exists as the first chapter-context skeleton file using the approved `scripture-context-atlas.chapter-context` contract. The file remains strictly envelope-only with `items: []`, contains no sample rows and no real chapter rows, is not connected to Reader or Timeline runtime, and does not change verifier implementation. No API / backend / DB / schema changes, Timeline data package row changes, Reader UI changes, runtime loader changes, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-25 Chapter Context Verifier Rule Design` is now complete as a docs-only verifier-contract step in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. The chapter-context design note now defines how a future verifier should recognize `scripture-context-atlas.chapter-context` packages, when empty `items` arrays are acceptable by package status, which envelope and row conditions must fail, which wording and metadata conditions should warn, which forbidden fields must always fail, how relation ids should resolve, and how review/confidence behavior should be interpreted before any implementation begins. This CR also records the recommended next fixture-design categories for a later verifier-coverage step. No verifier code, no fixtures, no chapter rows, no Reader runtime connection, and no API / backend / DB / schema / Timeline data package row changes were added, and Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-26 Chapter Context Verifier Fixtures Design` is now complete as a docs-only fixture-taxonomy step in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. The chapter-context verifier contract is now translated into concrete fixture categories covering valid, invalid, and warning-only cases, along with naming conventions aligned to the existing `docs/data-packages/timeline/fixtures/valid|invalid|warnings/*.sample.json` structure. The design now records purpose, expected result, and rule coverage for required fixture categories such as empty skeleton envelope, minimal reviewed row, missing envelope field, wrong package type, Bible-text/coordinate/verse-tagging/runtime-state violations, duplicate identity cases, invalid related ids, invalid review status, missing basis/confidence/caution, and wording-based warnings. No fixture files, no verifier code, no chapter rows, no Reader runtime hookup, and no API / backend / DB / schema / Timeline data package row changes were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-27 Chapter Context Verifier Fixture Files` is now complete as a docs/data-only fixture-sample step. The first chapter-context verifier sample files now exist under the existing `docs/data-packages/timeline/fixtures/valid/`, `invalid/`, and `warnings/` directories. The created set includes valid empty-skeleton and minimal-reviewed-row fixtures, invalid fixtures for Bible-text, coordinate/map, verse-tagging, duplicate chapter identity, and unresolved related-id cases, and warning fixtures for overconfident wording, empty Scripture anchors, and commentary-like summaries. These files are fixture inputs only, not production chapter rows, and must not be loaded by Reader or Timeline runtime. No verifier code, no production chapter rows, no Reader runtime hookup, and no API / backend / DB / schema / Timeline data package row changes were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-28 Chapter Context Verifier Implementation Readiness` is now complete as a docs-only readiness audit in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. The current verifier architecture and wrapper expectations have now been compared against the new chapter-context fixture set. The audit confirms that the existing verifier already provides reusable generic parsing, envelope checks, row-shape checks, recursive guardrails, issue reporting, and wrapper-level valid / invalid / warning orchestration, but that chapter-context still needs package-specific recognition and chapter-context-specific envelope / required-field rules before the fixtures are fully enforced for their intended reasons. The safest next implementation slice is therefore not a full all-at-once verifier rollout, but a narrow first code step for package recognition, envelope rules, approved `status: "skeleton"` plus `items: []` handling, and minimum chapter-row required-field validation. No verifier code, no fixture files, no production chapter rows, no Reader runtime hookup, and no API / backend / DB / schema / Timeline data package row changes were added in this audit step. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-29 Chapter Context Verifier Package Recognition and Envelope Rules` is now complete as the first narrow verifier implementation slice. The verifier now recognizes `scripture-context-atlas.chapter-context`, applies chapter-context-specific envelope checks for `packageId`, `scope`, and deterministic-envelope exclusions, explicitly allows the approved `status: "skeleton"` plus `items: []` package baseline, and applies a minimum chapter-row baseline for required fields, integer `chapter`, canonical `bookId`, chapter-bounds validation, bilingual label presence on key fields, boolean `isSkeleton`, duplicate `chapterContextId`, and duplicate `bookId + chapter` detection. Existing generic guardrails continue to enforce Bible-text, coordinate/map-provider, and verse-tagging invalid cases without broad rewrite. Deep relationship-id validation and expanded chapter-context wording warnings remain deferred, which means the unresolved-related-id invalid fixture and overconfident-wording warning fixture are not yet individually enforced for their intended reasons even though the overall wrapper regression remains green. No production chapter rows, no Reader runtime hookup, and no API / backend / DB / schema / Timeline data package row changes were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-30 Chapter Context Verifier Relationship and Warning Rule Readiness` is now complete as a docs-only readiness audit in `docs/ROADMAP/SCRIPTURE_CONTEXT_ATLAS_CHAPTER_PACKAGE_DESIGN.md`. The current post-CR-BR-CTX-29 verifier state has now been compared directly against the existing chapter-context relation and warning fixtures. The audit concludes that relationship-id validation is materially more ready than wording-warning enforcement: `relatedBookIds`, `relatedEventIds`, and `relatedKingdomIds` now have stable package-backed target sources and are appropriate for the next narrow implementation slice, while `relatedPlaceIds` still depends on runtime schematic place fixture data rather than a package-backed place contract and therefore needs a narrower treatment or deferral. The audit also confirms that the current warning fixtures still report zero warnings individually, so wrapper-level green status is not yet enough evidence for chapter-context-specific wording enforcement. The recommended next step is therefore a relationship-rules implementation CR focused on package-backed target ids first, while broader warning heuristics remain deferred to a later narrow readiness or implementation step. No verifier code, no fixture files, no production chapter rows, no Reader runtime hookup, and no API / backend / DB / schema / Timeline data package row changes were added in this audit step. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-47 Chapter Context Pilot Rows Draft Authoring` is now complete as a docs/data pilot-authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` has been transitioned in place from the empty skeleton envelope to a `0.2.0-pilot` chapter-context pilot package with `4` manual draft rows for `Genesis 1`, `Genesis 3`, `Exodus 12`, and `Matthew 13`. All `4` rows remain `reviewStatus: "draft"` with `isSkeleton: false`, stay chapter-level metadata only, use non-empty reference-only `scriptureAnchors`, and avoid Reader/runtime hookup. No verifier code, fixture files, Reader UI connection, runtime loader connection, API changes, backend changes, DB/schema changes, Bible-text storage/rendering changes, place-package work, or Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-48 Chapter Context Pilot Draft Row QA` is now complete as a QA-only review pass on the current `4` pilot draft rows. The QA result is pass with no row edits required, no verifier warnings, and no review-state changes. The package remained `0.2.0-pilot` with all `4` rows still `reviewStatus: "draft"` and `isSkeleton: false` at the end of that QA step. No Reader/runtime hookup, verifier changes, fixture changes, API/backend/DB/schema changes, Bible-text storage/rendering changes, place-package work, or Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-49 Chapter Context Author Self-Check and Review-Required Promotion` is now complete as a narrow docs/data package status-promotion step. The current `4` pilot rows for `Genesis 1`, `Genesis 3`, `Exodus 12`, and `Matthew 13` passed the author self-check for identity, required fields, chapter-level scope boundaries, conservative related-id usage, and restrained wording. Each of the `4` rows has now been promoted from `reviewStatus: "draft"` to `reviewStatus: "review-required"` while keeping `isSkeleton: false`, `packageVersion: "0.2.0-pilot"`, and `status: "pilot"`. Minimal wording updates were applied only where row copy still said `draft` or `초안` in ways that would conflict with the promoted state. No rows were marked `reviewed`, no new pilot rows were added, and no Reader/runtime hookup, verifier changes, fixture changes, API / backend / DB / schema changes, Bible-text storage/rendering changes, place-package work, or Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-50 Chapter Context Review-Required Acceptance QA and Reviewed Promotion` is now complete as a narrow docs/data acceptance step. The current `4` `review-required` pilot rows for `Genesis 1`, `Genesis 3`, `Exodus 12`, and `Matthew 13` passed acceptance QA for deterministic identity, required-field presence, chapter-level scope boundaries, conservative package-backed relation usage, and restrained wording. Each of the `4` rows has now been promoted from `reviewStatus: "review-required"` to `reviewStatus: "reviewed"` while keeping `isSkeleton: false`, `packageVersion: "0.2.0-pilot"`, and `status: "pilot"`. Minimal wording updates were applied only where package or row copy still said `review-required` in ways that would conflict with the reviewed state. No new pilot rows were added, and no Reader/runtime hookup, verifier changes, fixture changes, API / backend / DB / schema changes, Bible-text storage/rendering changes, place-package work, or Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-51 Chapter Context Loader and Adapter Readiness Review` is now complete as a docs-only code-path readiness review with no implementation changes. The current code inspection confirms that Timeline package loading already follows a server-side `readFile` plus local `normalize*Package` pattern in `frontend/src/app/[locale]/timeline/page.tsx`, while the Reader already follows a separate server-side package-read and adapter flow in `frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx` through `loadBookContextData()` and `createRelatedMetadataPreview()`, with rendering isolated to `frontend/src/components/scripture/BibleReaderContextPanel.tsx`. The smallest future chapter-context implementation path is therefore frontend-only and server-side: add a dedicated chapter-context package normalizer module, extend the Reader page loader to read `chapter-context.skeleton.json`, look up rows by `bookId + chapter`, expose only `reviewed` rows, keep chapter-level data separate from existing book-level context, and preserve no-row fallback without any selected-verse filtering. No Reader UI hookup, no runtime route hookup, no API / backend / DB / schema changes, no verifier or fixture changes, no reviewed-row content changes, and no Timeline Kingdom extraction work were added in this readiness review. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-52 Chapter Context Reader Loader Implementation` is now complete as a narrow frontend-only server-loader step. A new `frontend/src/components/scripture/timeline/timelineChapterContextPackage.ts` module now provides defensive chapter-context normalization plus reviewed-only lookup by `bookId + chapter`, and the Reader page server layer in `frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx` now reads `docs/data-packages/timeline/chapter-context.skeleton.json` alongside existing Timeline packages and prepares the matching reviewed chapter-context row at the server boundary. The current implementation does not pass chapter context into client props, does not change `BibleReader` or `BibleReaderContextPanel` rendering, preserves a safe `null` fallback when no reviewed row exists, and does not introduce selected-verse filtering, verse-level tagging, Reader UI hookup, runtime route hookup, verifier changes, fixture changes, API / backend / DB / schema changes, or Timeline Kingdom extraction work. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-65 Chapter Context Pilot Expansion Scope` is now complete as a docs-only scope-definition step for the next authoring pass. The next approved expansion set is `6` chapter rows: `Matthew 5`, `Matthew 14`, `Matthew 26`, `Matthew 27`, `Luke 2`, and `Acts 2`. These were chosen because the current `events.core-biblical-skeleton.json` already contains direct or closely aligned event anchors for `event-public-ministry-skeleton`, `event-feeding-five-thousand-skeleton`, `event-last-supper-skeleton`, `event-crucifixion-skeleton`, `event-incarnation-birth-skeleton`, `event-pentecost-skeleton`, and `event-early-church-jerusalem-skeleton`, and because each chapter remains safe for chapter-level preview metadata without selected-verse filtering, entity resolution, place mapping, or kingdom extraction. Expected conservative relation targets for the next authoring CR are: `Matthew 5 -> [event-public-ministry-skeleton]`, `Matthew 14 -> [event-feeding-five-thousand-skeleton]`, `Matthew 26 -> [event-last-supper-skeleton]`, `Matthew 27 -> [event-crucifixion-skeleton]`, `Luke 2 -> [event-incarnation-birth-skeleton]`, and `Acts 2 -> [event-pentecost-skeleton, event-early-church-jerusalem-skeleton]`. `Genesis 2` and `Exodus 13` were explicitly not selected for this batch because the current event package does not expose a single equally direct chapter anchor for them, making a first expansion pass less uniform than the approved NT-heavy set. No package rows, no Reader/runtime code, no verifier or fixture logic, and no API / backend / DB / schema changes were added.

`CR-BR-CTX-66 Chapter Context Second Pilot Row Authoring` is now complete as a docs/data pilot-authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` has been advanced to `packageVersion: "0.3.0-pilot"` while keeping `status: "pilot"`, and `6` second-pilot draft rows have been added for `Matthew 5`, `Matthew 14`, `Matthew 26`, `Matthew 27`, `Luke 2`, and `Acts 2`. The existing `4` reviewed rows for `Genesis 1`, `Genesis 3`, `Exodus 12`, and `Matthew 13` remain unchanged. All new rows use deterministic identity, canonical book ids, non-empty reference-only chapter anchors, conservative package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`. Because the current Reader loader still filters to `reviewStatus === "reviewed"`, these new rows do not display in the Reader yet. No Reader/runtime code, verifier code, fixture files, API / backend / DB / schema changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-67 Chapter Context Second Pilot Draft Row QA` is now complete as a docs/data QA step focused only on the `6` newly added second-pilot draft rows. `chapter-context-matthew-5`, `chapter-context-matthew-14`, `chapter-context-matthew-26`, `chapter-context-matthew-27`, `chapter-context-luke-2`, and `chapter-context-acts-2` were checked for deterministic identity, canonical book ids, required field presence, conservative package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, reference-only scripture anchors, wording safety, and verifier cleanliness. No row edits were needed: all `6` rows remain `reviewStatus: "draft"` and `isSkeleton: false`, the existing `4` reviewed rows remain unchanged, and the current Reader reviewed-only loader behavior remains unchanged. No Reader/runtime code, verifier code, fixture files, API / backend / DB / schema changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-53 Chapter Context Reader Adapter Handoff Implementation` is now complete as a narrow frontend-only client-boundary handoff step. The Reader page server layer now carries the reviewed chapter-context lookup result forward as an optional `chapterContextPreview` prop, and `frontend/src/components/scripture/BibleReader.tsx` now accepts that optional handoff shape without rendering it or connecting it to selected-verse logic. The handoff remains `null` when no reviewed row exists, remains translation/version-agnostic, carries no Bible text, does not replace existing book context, and does not change `BibleReaderContextPanel` or Context-tab rendering. No Reader UI display, no Context-tab chapter-context section, no selected-verse filtering, no verifier or fixture change, no data-package row change, no API / backend / DB / schema change, and no Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-54 Chapter Context Read-Only Context Tab Display` is now complete as a narrow frontend-only Reader UI step. `frontend/src/components/scripture/BibleReader.tsx` now passes the optional `chapterContextPreview` handoff through to `frontend/src/components/scripture/BibleReaderContextPanel.tsx`, and the Reader `Context / 문맥` tab now renders a small read-only `Chapter Context Preview / 장 문맥 미리보기` section only when reviewed chapter-context data exists for the current `bookId + chapter`. The new section stays below the existing book-level context, shows only chapter-level preview metadata plus reference-only anchor labels/reference/scope, does not display Bible text, does not add Timeline links, does not change selected-verse logic, and falls back to the existing Context-tab behavior when no reviewed chapter-context row exists. No Bible API calls, no runtime loader expansion, no verifier or fixture change, no data-package row change, no API / backend / DB / schema change, and no Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-55 Chapter Context Reader Browser QA and Route Validation` is now complete as a QA-focused validation step with environment-limited browser evidence. Static validation, verifier checks, and code-path review confirm that the current Reader page still loads reviewed-only chapter-context rows by `bookId + chapter`, passes `chapterContextPreview` through the Reader boundary, renders the supplemental chapter-context section only when that prop is non-null, keeps the existing book-level context intact, and does not connect chapter context to selected-verse filtering, Bible text rendering, or extra API calls. In the Codex execution environment used for that CR, `lsof` confirmed a local listener on port `3030`, but sandboxed `curl` to both `wordcovenantministry.local:3030` and `127.0.0.1:3030` still failed, so direct route/browser QA was recorded as environment-limited rather than as a confirmed product defect. No UI fix was required, no data-package row change, no verifier or fixture change, no API / backend / DB / schema change, and no Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-56 Chapter Context Local Browser Verification Closure` is now complete as a docs-only QA-closure step with verified local route smoke and still-limited browser DOM automation. The local frontend environment was rechecked: `frontend/package.json` still defines `next dev --turbopack --hostname 0.0.0.0 --port 3030`, `lsof` still showed a live Node listener on `*:3030`, and escalated local process inspection confirmed an active `next dev` server. Escalated route smoke to `127.0.0.1:3030` returned HTTP `200` for the checked Reader routes, which resolves the earlier connection ambiguity as a Codex sandbox restriction rather than a frontend route failure. Payload inspection across the pilot and fallback routes confirmed the expected reviewed-only handoff behavior: `chapterContextPreview` carried reviewed rows for `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/genesis/3`, `/ko/bible/KRV/exodus/12`, `/ko/bible/KRV/matthew/13`, and `/en/bible/KRV/genesis/1`, while `/ko/bible/KRV/genesis/2`, `/ko/bible/KRV/exodus/13`, `/ko/bible/KRV/matthew/14`, and `/en/bible/KRV/genesis/2` carried `chapterContextPreview: null`. Existing book-level `bookContext` payload remained present on the checked routes, selected-verse filtering remained absent by code-path review, and no Bible-text/API/backend/schema expansion was added. Attempted real-browser DOM inspection through Chrome and Safari AppleScript remained blocked because both browsers have `Allow JavaScript from Apple Events` disabled, so full interactive browser automation is still not claimed here. No code/UI fix was required, no data-package row change, no verifier or fixture change, no API / backend / DB / schema change, and no Timeline Kingdom extraction work were added. Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-57 Chapter Context Preview Accessibility and UX Polish Review` is now complete as a narrow frontend-only review and polish step. The current Reader `Context / 문맥` tab was rechecked for heading clarity, fallback behavior, metadata grouping, and the visual balance between the primary book-level context and the supplemental chapter-level preview. A small polish was applied in `frontend/src/components/scripture/BibleReaderContextPanel.tsx` only: the chapter-context note now states more explicitly that the section is supplemental, the chapter-context block now sits inside a subtler nested card so it reads as secondary metadata rather than a peer replacement for the book context, and the chapter-anchor rendering now uses list semantics instead of a plain stacked `div` structure. Existing selected-verse behavior remains unchanged, the fallback still hides the chapter section entirely when `chapterContextPreview` is `null`, and no Bible text/API/backend/schema/data-package/verifier/fixture change was added. Escalated route smoke still returned HTTP `200` for representative pilot and fallback routes after the polish, and Timeline Kingdom extraction remains deferred.

`CR-BR-CTX-58 Chapter Context Interactive Browser QA Follow-Up` is now complete as a no-change QA follow-up step with partial pass, environment-limited evidence. Route smoke and SSR payload inspection continued to confirm that the `4` pilot chapters carry reviewed `chapterContextPreview` data while fallback chapters still return `null`, and the current Reader code path still keeps chapter-context display supplemental, reviewed-only, and independent from selected-verse filtering. Full interactive DOM/browser automation was still not claimed in that CR because local browser settings continued to block Apple Events JavaScript inspection. No UI fix, verifier change, fixture change, data-package row change, API / backend / DB / schema change, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-59 Chapter Context Manual Browser Acceptance on Local Host` is now complete as a manual local-browser acceptance closure with no code changes. User-performed browser QA confirmed that the Reader page loads normally, the `Context / 문맥` tab opens correctly, all `4` pilot chapters display the chapter-context preview section, fallback chapters do not display an empty chapter-context card, existing book-level context remains visible and primary, the chapter-context block reads as supplemental metadata, anchor lists render cleanly, no Bible text or raw JSON is duplicated in the chapter-context section, and verse clicks do not alter chapter-context content. Mobile width was reported as acceptable or not additionally checked. No UI fix, verifier change, fixture change, data-package row change, API / backend / DB / schema change, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-60 Chapter Context Keyboard and Screen Reader QA` is now complete as a narrow frontend-only accessibility review with a small semantic fix. Route smoke still returned HTTP `200` for representative pilot and fallback routes, verifier and frontend validation still passed, and static code-path review confirmed that the chapter-context preview remains reviewed-only, supplemental to book-level context, and independent from selected-verse filtering. The accessibility review identified that the chapter-context block and its anchor subsection relied on visual label copy but did not expose strong enough heading semantics for assistive technology. `frontend/src/components/scripture/BibleReaderContextPanel.tsx` now adds an explicit screen-reader heading for the chapter-context section and upgrades the chapter-anchor subsection title to a real heading with `aria-labelledby` linkage to the list container while preserving the existing non-clickable metadata presentation. No data-package row change, verifier change, fixture change, API / backend / DB / schema change, Bible-text change, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-63 Local VoiceOver-Enabled Acceptance Closure` is now complete as a docs-only manual accessibility-acceptance closure. User-performed local VoiceOver verification reported PASS for `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/genesis/2`, `/en/bible/KRV/genesis/1`, and `/en/bible/KRV/genesis/2`. Keyboard access to the `Context / 문맥` tab remained intact, the chapter-context heading was announced clearly as supplemental rather than as a replacement for book-level context, the anchor subsection was announced clearly as a labeled list, fallback chapters exposed no empty chapter-context section or empty list, no duplicated Bible text or raw JSON was announced, no `draft` or `review-required` wording remained, and selected-verse movement did not alter chapter-context content. No code/UI fix, data-package row change, verifier change, fixture change, API / backend / DB / schema change, Bible-text/API change, or Timeline Kingdom extraction work was added.

Current phase boundary:

```txt
Full TAGNT NT and full TAHOT OT are imported. Phase 6A Original Language Read API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7B through Phase 7H frontend reader implementation, Phase 8A frontend/navigation cleanup, Phase 8B Korean transliteration data, Phase 8C Korean gloss data, Phase 8D morphology presentation, Phase 8E/8F reviewed Korean original-language coverage expansion, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration/verse preview modal validation, CR-39 Word Study Cross Reference frontend MVP, Gospel Harmony frontend foundation, Gospel Harmony Cross Reference integration planning, Gospel Harmony Cross Reference frontend MVP implementation/static validation, Gospel Harmony Cross Reference frontend MVP browser validation, and WEB local apply are complete through local development. This does not authorize OSHB, SBLGNT, additional Bible imports, staging WEB apply, production WEB apply, or other dataset import. It also does not authorize write/import endpoints, raw source export, variant UI, advanced search, morphology explorer, morphology DB columns, morphology API fields, Gospel Harmony schema/API/import work, interpretation/pictographic/gematria APIs, production deployment automation, or seed migration tracking table implementation.
```

Phase 5A source recommendation:

```txt
Hebrew primary source candidate: STEP Bible TAHOT
Hebrew secondary validation/reference: OSHB
Greek primary source candidate: STEP Bible TAGNT
Greek reference text: SBLGNT
MorphGNT: not a primary source before ShareAlike review
OpenGNT: not the first production source because of provenance/license complexity
```

## Phase 8A-8C Completion Summary

Phase 8A completed frontend foundation and Korean-first reader cleanup:

- Frontend menu and page foundation.
- Mobile navigation.
- Locale switcher behavior.
- Home, footer, and landing page updates.
- Interlinear UX cleanup, including removal of duplicate Korean verse text inside the interlinear block and removal of section headings from interlinear display.

Phase 8B completed Korean transliteration presentation data:

- `transliteration_ko` nullable schema support on `wcm_original_terms`.
- Additive read-only API exposure in original-language, interlinear, and word-study responses.
- Controlled seed importer pattern.
- Reviewed Genesis 1:1 and Matthew 1:1 seed import.
- Conservative seed batches and bulk reviewed imports for high-frequency reviewed terms.
- Current known coverage after approved local seeds: approximately `63.5%` occurrence coverage.
- Existing `transliteration` remains unchanged.
- English Bible support remains deferred to Phase 9.

Phase 8C completed Korean gloss presentation data:

- `gloss_ko` nullable schema support on `wcm_original_terms`.
- Additive read-only API exposure in original-language, interlinear, and word-study responses.
- Controlled `gloss_ko` seed importer.
- Reviewed Korean gloss seed batches imported through the Phase 8F sixty-percent policy-label push.
- Current known coverage after approved local seeds: `60.0207%` occurrence coverage.
- Frontend Korean gloss display uses `gloss_ko` when available.
- Frontend Korean fallback labels English source gloss as `영어 뜻`.
- English locale continues to label source gloss as `Gloss`.

## Phase 8D Morphology Korean Presentation

Current phase:

```txt
Completed
```

Active objective:

```txt
Phase 8D documented and implemented Korean/English morphology display for existing morphology codes without schema/API changes.
```

Phase 8D plan:

- Phase 8D-1 morphology audit completed.
- Phase 8D-2 parser policy documentation.
- Phase 8D-3 parser utility and focused tests.
- Phase 8D-4 frontend integration in interlinear tooltip, Original Word Panel, and related original-language displays.
- Phase 8D-5 browser QA for Korean and English morphology presentation.

Morphology parser policy:

- Raw `morphology` remains occurrence-level source data.
- No schema change is required for Phase 8D.
- No API change is required for Phase 8D.
- Hebrew parser should handle STEP_TAHOT ETCBC/OpenScriptures-style compact codes, including optional leading `H` or `A`, noun/adjective gender-number-state patterns, particles/prepositions/conjunctions, verb stem/form/person/gender/number patterns, and suffix-pronoun patterns.
- Greek parser should extend the existing frontend formatter for STEP_TAGNT James Tauber-style morphology, including hyphenated codes such as `N-NSF` and `V-AAI-3S`, plus plain codes such as `CONJ`, `PREP`, `ADV`, `PRT`, and `PRT-N`.
- Korean labels must be explicit presentation labels, for example `명사`, `동사`, `여성`, `단수`, `주격`, `전치사`, `접속사`, `부정과거`, `능동태`, and `직설법`.
- English labels must remain available for `en` locale, for example `Noun`, `Verb`, `Feminine`, `Singular`, `Nominative`, `Preposition`, and `Conjunction`.
- Unknown or partially unsupported codes must fall back to the raw morphology code without inventing unsupported grammar labels.
- Empty morphology on punctuation/link markers should be suppressed in frontend display.
- Raw morphology code should remain available in detailed study UI for auditability, even when an expanded Korean or English label is shown.

## Phase 6A Original Language Read API

Status:

```txt
Phase 6A-3 completed in commit d8947cc: feat(scripture): add original language read API
```

Current original-language data state:

```txt
terms=16891
occurrences=673263
STEP_TAGNT=137114
STEP_TAHOT=536149
duplicate hash groups=0
duplicate term groups=0
duplicate occurrence groups=0
```

Implemented read-only scope:

- No write/import endpoints.
- No frontend.
- No full dataset dumps.
- No raw source export.
- No variant or qere-kethiv UI yet.
- No interpretation, pictographic, or gematria API yet.

Implemented routes:

```txt
GET /original-language/{source}/{book}/{chapter}/{verse}
GET /original-language/interlinear/{source}/{book}/{chapter}/{verse}
GET /original-language/terms/{term_id}
GET /original-language/terms/{term_id}/occurrences
GET /original-language/strongs/{strongs_number}
```

Source rules:

- Canonical source values are `STEP_TAGNT` and `STEP_TAHOT`.
- Lowercase aliases may be accepted only if normalized internally.
- `source_dataset` is distinct from Bible version.

Pagination rules:

- Default `per_page=20`.
- Maximum `per_page=100`.
- Negative `page` or `per_page` values return `400 invalid_pagination`.
- Pagination is required for term occurrences and Strong's occurrence-style lists.

Safe public response fields:

```txt
id
language_type
source_dataset
source_ref
word_order
subword_order
token_type
surface_form
normalized_form
lemma
lemma_normalized
strongs_number
strongs_extended
transliteration
morphology
gloss
contextual_function
```

Hold back from public responses:

```txt
raw source JSON
import diagnostics
unapproved variant internals
```

Next gate after separate approval:

1. Frontend original-language reader implementation.
2. Strong's or Word Study frontend pages.

Phase 6A-3 validation:

```txt
Matthew 1:1 => 8 occurrences
Genesis 1:1 => 12 occurrences
H1004 => 14 terms
G2424 => 5 terms
term lookup => success
term occurrences => success
```

Security validation:

- Read-only routes only.
- No write routes.
- No admin routes.
- No import routes.
- No raw source JSON.

## Phase 6B Word Study API

Status:

```txt
Phase 6B completed in commit 510fc63: feat(scripture): add word study API
```

Current corpus state:

```txt
terms=16891
occurrences=673263
STEP_TAGNT=137114
STEP_TAHOT=536149
```

Completed read-only scope:

- Read-only.
- Data-driven only.
- No interpretation API.
- No pictographic or gematria API.
- No authored theological explanation.
- No raw source JSON.
- No frontend.

Implemented endpoints:

```txt
GET /word-study/strongs/{strongs_number}
GET /word-study/terms/{term_id}
GET /word-study/terms/{term_id}/distribution
```

Validation:

```txt
H1004 => 14 terms, 2041 occurrences
G2424 => 5 terms, 901 occurrences
```

Deferred endpoints:

- Lemma lookup.
- Hebrew root lookup.
- Related terms by base Strong.
- Occurrence-level Strong's dump.

Response policy:

- Strong's overview includes `language_type`, `strongs_number`, `total_terms`, `total_occurrences`, terms grouped by `strongs_extended`, and book distribution.
- Term detail includes term data, `total_occurrences`, `book_count`, `chapter_count`, and limited `sample_occurrences`.
- Term distribution includes book/chapter distribution.

Safe public fields:

- Term ID.
- `language_type`.
- `lemma`.
- `lemma_normalized`.
- `strongs_number`.
- `strongs_extended`.
- `transliteration`.
- `gloss`.
- Occurrence counts.
- Book/chapter distribution.
- Limited safe occurrence samples.

Hold back from public responses:

- Raw source JSON.
- Import diagnostics.
- `definition`.
- `grammar_note`.
- `grammar_summary`.
- `term_identity_hash`.
- Theological interpretation.
- Pictographic/gematria.
- Variant internals.

Pagination rules:

- Default `per_page=20`.
- Maximum `per_page=100`.
- Negative `page` or `per_page` values return `400 invalid_pagination`.

Security validation:

- Read-only routes only.
- No raw source JSON.
- No import diagnostics.
- No theological interpretation fields.
- No pictographic or gematria fields.

## Phase 6C Interlinear API

Status:

```txt
Phase 6C completed in commits 1930d36 and d89e3aa
```

Implemented:

- `InterlinearService`.
- `InterlinearController`.
- `ApiRegistrar` route registration.

High-level endpoint:

```txt
GET /wp-json/wcm/v1/interlinear/{source}/{book}/{chapter}/{verse}
```

Existing lower-level endpoint remains available as token-only:

```txt
GET /wp-json/wcm/v1/original-language/interlinear/{source}/{book}/{chapter}/{verse}
```

Response purpose:

- Combine canonical Bible verse text with original-language tokens.
- Preserve token order by `word_order` and `subword_order`.
- Include term data, Strong's base and extended values, morphology, transliteration, and gloss.

Source rules:

- Accept `STEP_TAGNT`, `step_tagnt`, and `tagnt` aliases.
- Accept `STEP_TAHOT`, `step_tahot`, and `tahot` aliases.
- Normalize internally to canonical `source_dataset` values.

Safety constraints:

- Read-only.
- No raw source JSON.
- No `term_identity_hash`.
- No import diagnostics.
- No interpretation.
- No pictographic or gematria API fields.
- No frontend in this phase.

Validation:

```txt
Matthew 1:1 => 8 tokens
Genesis 1:1 => 12 tokens
Psalm 119:1 => 10 tokens
Esther 8:9 => 90 tokens
```

Current corpus:

```txt
terms=16891
occurrences=673263
STEP_TAGNT=137114
STEP_TAHOT=536149
```

Next phase:

```txt
Phase 8D - Morphology Korean Presentation
```

## Phase 7A Original Language Reader UI Planning

Status:

```txt
Complete in commit e429cd0; superseded by Phase 7B through Phase 7H implementation
```

UI direction:

- Add a progressive original-language layer on top of the existing KRV reader.
- Keep the normal reader as the default experience.
- Reveal original-language depth only when the user opts in.

Reader modes:

```txt
Reader
Original
Interlinear
```

UX rules:

- Chapter load fetches only normal Bible chapter data.
- Original and interlinear data are fetched per verse on demand.
- Do not prefetch whole-chapter interlinear data.
- Old Testament source defaults to `STEP_TAHOT`.
- New Testament source defaults to `STEP_TAGNT`.

UI behavior:

- Original mode provides verse-level expandable token previews.
- Interlinear mode provides a focused selected-verse interlinear layout.
- Token click opens a side panel on desktop.
- Token click opens a bottom sheet on mobile.

API usage:

```txt
GET /wp-json/wcm/v1/interlinear/{source}/{book}/{chapter}/{verse}
GET /wp-json/wcm/v1/word-study/strongs/{strongs_number}
GET /wp-json/wcm/v1/word-study/terms/{term_id}
```

Proposed components:

- `BibleReaderToolbar`
- `ReaderModeControl`
- `BibleVerseRow`
- `VerseOriginalLanguagePreview`
- `InterlinearVerse`
- `InterlinearToken`
- `OriginalWordPanel`

## Phase 7B-7H Original Language Reader MVP

Status:

```txt
Limited frontend MVP implemented
```

Completed commits:

- `e800df2` - frontend original-language types.
- `c0e805d` - frontend original-language API client.
- `b14ce63` - reader mode control and `?mode=` URL state.
- `a5e4c03` - verse original-language preview.
- `da2e719` - interlinear selected-verse view.
- `f5e6f0e` - original word panel.
- `dbd63c2` - Strong study panel.

MVP features completed:

- Reader mode remains the default.
- Reader mode URL state supports `?mode=reader`, `?mode=original`, and `?mode=interlinear`.
- Reader route preserves locale, version, book, chapter, and mode during chapter/reference navigation.
- Original mode lazily fetches one verse at a time through `GET /wp-json/wcm/v1/original-language/{source}/{book}/{chapter}/{verse}`.
- Interlinear mode lazily fetches only the selected verse through `GET /wp-json/wcm/v1/interlinear/{source}/{book}/{chapter}/{verse}`.
- OT source selection uses `STEP_TAHOT`.
- NT source selection uses `STEP_TAGNT`.
- Original word panel opens from original preview and interlinear tokens.
- Strong study panel opens from the Strong's number inside the original word panel through `GET /wp-json/wcm/v1/word-study/strongs/{strongs_number}`.
- No frontend bundling of Bible or original-language datasets.

Phase 7I validation status:

- `npm run typecheck` passed.
- `npm run lint` passed.
- `git diff --check` passed before documentation edits.
- Local frontend route smoke checks returned `200`:
  - `/en/bible/KRV/genesis/1?mode=reader`
  - `/en/bible/KRV/genesis/1?mode=original`
  - `/en/bible/KRV/genesis/1?mode=interlinear`
  - `/en/bible/KRV/matthew/1?mode=interlinear`
- Read-only API smoke checks returned `200`:
  - `STEP_TAHOT` Genesis 1:1 original-language verse returned `12` occurrences.
  - `STEP_TAHOT` Genesis 1:1 interlinear verse returned `12` tokens.
  - `STEP_TAGNT` Matthew 1:1 interlinear verse returned `8` tokens.
  - `H7225` Strong study returned `2` grouped terms and `51` occurrences.

QA limitation:

```txt
Automated desktop/mobile browser click-through was not completed in this environment because the in-app browser Node REPL tool was unavailable and no local Playwright/Puppeteer package is installed. Console error verification, panel open/close visual verification, loading-state timing, mobile bottom-sheet behavior, and token/Strong click behavior still need manual browser QA.
```

Known limitations:

- Original and interlinear data fetches are client-side and currently rely on the local API host being reachable.
- Original preview, interlinear view, original word panel, and Strong study panel are MVP surfaces only.
- Strong study panel shows grouped terms and summary counts, but no charts or occurrence drilldown.
- Empty/error states exist, but they need manual browser verification.
- Mobile and desktop responsive behavior needs a final human browser pass.

Deferred features:

- Word Study Term panel.
- Occurrence distribution UI.
- Strong detail pages.
- Dedicated Word Study pages.
- Advanced search.
- Morphology explorer.
- `StrongOverviewPanel`
- `WordStudyPanel`

Routing strategy:

- Keep existing reader route: `/{locale}/bible/{version}/{book}/{chapter}`.
- Use query modes: `?mode=reader`, `?mode=original`, `?mode=interlinear`.
- Optional later routes: `/{locale}/bible/strongs/{strongsNumber}` and `/{locale}/bible/word-study/{termId}`.

Implementation order after separate approval:

1. Frontend original-language types and API client.
2. Reader mode URL state.
3. Per-verse interlinear fetch.
4. Token click panel.
5. Strong overview panel.
6. Term detail panel.

Explicit exclusions:

- No authored interpretation.
- No pictographic or gematria UI.
- No full chapter interlinear prefetch.
- No frontend pages for Strong's or Word Study unless separately approved.

## Phase 5 Entry Criteria

Next major phase:

```txt
Phase 5 - Original Language Foundation
```

Phase 5 entry sequence:

```txt
Phase 5A - Source and Schema Analysis
Phase 5B - Original Language Schema Foundation
Phase 5C - Import Foundation
Phase 5D - Dry-run Pipeline
Phase 5E - Persistence Smoke Verification
Future - Read API Foundation
```

Phase 5 rules:

- Original Language data must not extend `wcm_bible_verses`.
- Original Language data belongs in separate custom tables.
- Core tables are `wcm_original_terms` and `wcm_original_word_occurrences`.
- Future related tables include `wcm_hebrew_letters`, `wcm_word_letter_breakdowns`, `wcm_pictographic_observations`, and `wcm_scripture_relationships`.
- The canonical connection point is `book_id + chapter + verse`.
- Strong's numbers are term-level fields such as `H7225` and `G3056`.
- Morphology is occurrence-level data.
- `wcm_scripture_relationships` is a discovery/ranking graph, not authoritative occurrence storage.
- Original Language import must use a dedicated importer, not direct reuse of the KRV verse importer.
- Source license and provenance must be verified before OSHB, SBLGNT, or other source imports.
- Source license and provenance must also be verified before STEP Bible, MorphGNT, OpenGNT, or other source imports.
- Original Language data must not be bundled into the frontend.
- Schema implementation, importer implementation, dataset import, and UI implementation remain out of scope until Phase 5A gates are complete.

Phase 5B entry requirements:

- Confirm exact STEP TAHOT and STEP TAGNT files and field headers.
- Document license and attribution text.
- Decide Greek edition filtering.
- Decide Hebrew versification handling.
- Decide prefix and suffix token modeling.
- Decide Strong's normalization.
- Draft validation rules.

Phase 5B schema design review summary:

- Core schema remains limited to `wcm_original_terms` and `wcm_original_word_occurrences`.
- `wcm_bible_verses` must not be extended for original-language data.
- `wcm_scripture_relationships` remains a future discovery/ranking graph, not authoritative occurrence storage.
- `wcm_original_terms` stores lexical identity, including normalized lemma, base Strong's, STEP extended Strong's, root, gloss, and optional definition.
- `wcm_original_word_occurrences` stores source-specific canonical occurrences, including `source_dataset`, `source_ref`, `word_order`, `subword_order`, `token_type`, surface/normalized form, morphology, and grammar fields.
- Phase 5B does not add `version_id` to original-language occurrences.
- Next implementation preparation must finalize enum values, migration/rollback notes, validation rules, and then prepare schema work.

Phase 5B implementation gate summary:

- Enum and naming decisions are fixed in `docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md`.
- Initial `source_dataset` values are `STEP_TAHOT` and `STEP_TAGNT`.
- Future `source_dataset` values are `OSHB`, `SBLGNT`, `MORPHGNT`, and `OPENGNT`.
- Phase 5B implementation is table creation only for `wcm_original_terms` and `wcm_original_word_occurrences`.
- Existing Bible tables, existing Bible APIs, and existing import pipeline behavior must not be changed during Phase 5B.
- Phase 5C importer work must not begin until validation rules are applied.

Phase 5B implementation complete:

```txt
SchemaInstaller original language tables: complete
OriginalTerm ValueObject: complete
OriginalWordOccurrence ValueObject: complete
OriginalTermValidator: complete
OriginalWordOccurrenceValidator: complete
OriginalTermRepository: complete
OriginalWordOccurrenceRepository: complete
```

Phase 5C next phase:

```txt
Phase 5C - Original Language Importer Design
```

Phase 5C is design-first. It must define source file inspection, source header verification, import mapping, batch validation, dry-run behavior, verification report shape, validator/service responsibilities, and repository usage before any importer implementation or dataset import.

Phase 5C importer design analysis summary:

- Existing KRV import flow is `MDB export -> generated JSON -> ImportRow -> KrvImportValidator -> VerseImportService -> BibleRepository::upsertVerse() -> verification`.
- Existing KRV import does not include a true dry-run mode.
- Original Language import must add a stronger dry-run gate before persistence.
- Proposed Original Language flow is `Source file -> Source Inspection -> Source Metadata / License Gate -> Header / Shape Validation -> Row Normalization -> Batch Validation -> Dry-run Report -> Explicit Approval -> Term Persistence -> Occurrence Persistence -> Verification Report`.
- Dry-run must inspect, normalize, validate, build identity keys, optionally simulate read-only repository matching, produce counts and issues, and perform zero writes.
- `OriginalLanguageImportService` must default to dry-run behavior until implementation receives explicit approval.
- Phase 5C decision finalization found local STEP_TAHOT and STEP_TAGNT candidate files under `docs/data-sources/STEP/`.
- A local `STEPBible-Data` source clone exists under `docs/data-sources/STEPBible-Data/`.
- The STEP source is pinned for Phase 5C design review at commit `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- STEP license is CC BY 4.0.
- STEP attribution must credit STEP Bible linked to `www.STEPBible.org` and note the Tyndale House Cambridge basis.
- Plugin tools currently contain KRV tooling only.
- STEP_TAHOT and STEP_TAGNT headers/sample shapes have been inspected for design mapping.
- TAGNT first production import must be SBL-aligned by including rows whose `editions` field contains `SBL`.
- TAHOT must map to WCM canonical `book_id + chapter + verse`; Hebrew alternate references require an explicit exception map before import.
- Hebrew prefixes, root words, suffixes, and punctuation must use the existing `wordOrder`, `subwordOrder`, and `tokenType` model when source segment data is available.
- Base Strong's values belong in `strongsNumber`; STEP disambiguation belongs in `strongsExtended`.
- Raw STEP source files are untracked source data and must not be committed without separate approval.
- `StepTahotNormalizer`, `StepTagntNormalizer`, and dry-run-only `OriginalLanguageImportService` are implemented.
- Phase 5C-7 source acquisition policy is recorded in `docs/ROADMAP/SOURCE_ACQUISITION_SPECIFICATION.md`.
- Source versions must be exact and documented; floating `latest` source references are not allowed.
- Recommended STEP storage location is `docs/data-sources/STEP/TAHOT/` and `docs/data-sources/STEP/TAGNT/`.
- Source acquisition must document exact file name, source URL, source version, download date, license, and attribution text before any download or import.
- Phase 5C-B1 Source Gate Hardening is complete:
  - STEP `.txt` files are recognized as `step_txt`.
  - `OriginalLanguageSourceInspector` locates the real TAHOT/TAGNT data header rows instead of intro/license lines.
  - `SourceFileValidator` validates required TAHOT/TAGNT headers.
  - Source metadata and import report objects include source version, source URL, and checksum support.
  - Approved STEP source path and file-name validation is implemented.
  - STEP CC BY 4.0, STEP Bible/STEPBible.org, and Tyndale House Cambridge attribution validation is implemented.
  - Read-only smoke check passed for `STEP_TAHOT` and `STEP_TAGNT` with `issues=0`.
  - No importer, normalizer, DB write, API, dataset import, or public UI was implemented.
- Phase 5D Dry-run Pipeline is complete:
  - `StepTagntNormalizer` is implemented.
  - `StepTahotNormalizer` is implemented.
  - `OriginalLanguageVersificationResolver` is implemented.
  - `OriginalLanguageImportService` dry-run mode is implemented.
  - TAGNT alternate reference support accepts `{}`, `[]`, and `()` markers before `#` and preserves alternate reference context.
  - TAHOT first-import policy skips non-base text types such as `X`.
  - TAHOT Q(K) rows are skipped and reported without variant occurrence storage.
  - Dry-run exception map handling includes `1Ch.22.17 -> 1Ch.22.16`, `1Ch.22.18 -> 1Ch.22.17`, `1Ch.22.19 -> 1Ch.22.18`, and `Rev.12.18 -> Rev.13.1`.
  - Full read-only dry-run completed with zero hard errors.
- Phase 5E local write smoke verification is complete:
  - Persistence skeleton committed in `24a0d24`.
  - Local DB connectivity was restored through Local Site Shell.
  - Original-language tables were confirmed: `wp_wcm_original_terms` and `wp_wcm_original_word_occurrences`.
  - Small `STEP_TAGNT` write smoke passed with `maxRows=3` and `batchSize=1`: first run created `3` terms and `3` occurrences; rerun matched `3` terms and `3` occurrences; duplicates=`0`.
  - Small `STEP_TAHOT` write smoke passed with `maxRows=3` and `batchSize=1`: first run created `4` terms and `4` occurrences; rerun matched `4` terms and `4` occurrences; Hebrew expansion confirmed; duplicates=`0`.
  - Controlled `STEP_TAGNT` Mat-Jhn 1,000-row local import passed with `maxRows=1000` and `batchSize=100`.
  - Backup path before controlled import: `/private/tmp/wcm_phase_5e_g_pre_tagnt_1000.sql`.
  - Controlled import pre counts: `7` terms, `7` occurrences, `STEP_TAGNT=3`, `STEP_TAHOT=4`, duplicate term groups=`0`, duplicate occurrence groups=`0`.
  - Controlled import first successful run: `rowsRead=1000`, `rowsValid=988`, `rowsNormalized=988`, `termsCreated=273`, `termsMatched=242`, `occurrencesCreated=985`, `occurrencesMatched=3`, `rowsSkipped=12`, `errors=0`, `warnings=0`, `failedBatches=0`.
  - Controlled import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=988`.
  - Controlled import post counts: `280` terms, `992` occurrences, `STEP_TAGNT=988`, `STEP_TAHOT=4`, duplicate term groups=`0`, duplicate occurrence groups=`0`.
  - Full `STEP_TAGNT` Mat-Jhn local import passed with `batchSize=250`.
  - Backup path before full Mat-Jhn import: `/private/tmp/wcm_phase_5e_h_pre_tagnt_mat_jhn_full.sql`.
  - Full Mat-Jhn import first successful run: `rowsRead=66984`, `rowsNormalized=64205`, `rowsSkipped=2779`, `termsCreated=2731`, `occurrencesCreated=63217`, `occurrencesMatched=988`, `errors=0`, `failedBatches=0`, `runtime=10.6752s`.
  - Full Mat-Jhn import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=64205`.
  - Full Mat-Jhn post counts: `3011` terms, `64209` occurrences, `STEP_TAGNT=64205`, `STEP_TAHOT=4`.
  - Full Mat-Jhn coverage: `Matthew=18297`, `Mark=11091`, `Luke=19408`, `John=15409`.
  - Full Mat-Jhn duplicate groups=`0`; blank TAGNT morphology rows=`0`.
  - Full `STEP_TAGNT` Act-Rev local import passed with `batchSize=250`.
  - Backup path before Act-Rev import: `/private/tmp/wcm_phase_5e_i_pre_tagnt_act_rev_full.sql`.
  - Act-Rev import first successful run: `rowsRead=75112`, `rowsNormalized=72916`, `rowsSkipped=2196`, `termsCreated=2562`, `occurrencesCreated=72909`, `occurrencesSkipped=7`, `duplicateOccurrences=7` warning-level skips, `errors=0`, `failedBatches=0`, `runtime=12.2309s`.
  - Act-Rev import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=72909`, `errors=0`.
  - Full TAGNT NT post counts: `5573` terms, `137118` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=4`.
  - Full TAGNT NT imported: Mat-Jhn already completed; Act-Rev completed.
  - Full TAGNT NT duplicate groups=`0`; blank TAGNT morphology rows=`0`.
  - Controlled `STEP_TAHOT` Gen-Deu local import passed with `batchSize=250`.
  - Backup path before Gen-Deu import: `/private/tmp/wcm_phase_5e_j_pre_tahot_gen_deu_full.sql`.
  - Gen-Deu import first successful run: `rowsRead=79990`, `rowsValid=79737`, `rowsNormalized=142021`, `rowsSkipped=253`, `qere_kethiv_variant_skipped=76`, `tahot_non_base_text_type_skipped=177`, `psalm_title=0`, `termsCreated=4011`, `occurrencesCreated=142014`, `occurrencesMatched=4`, `occurrencesSkipped=3`, `missingMorphology=6412`, `errors=0`, `failedBatches=0`, `runtime=22.3522s`, `peakMemory=52232192`.
  - Gen-Deu import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=142018`.
  - Gen-Deu post counts: `9584` terms, `279132` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=142018`.
  - Gen-Deu coverage: `Genesis=36666`, `Exodus=29477`, `Leviticus=21448`, `Numbers=28655`, `Deuteronomy=25772`.
  - Gen-Deu duplicate groups=`0`.
  - Controlled `STEP_TAHOT` Jos-Est local import passed with `batchSize=250`.
  - Backup path before Jos-Est import: `/private/tmp/wcm_phase_5e_k_pre_tahot_jos_est_full.sql`.
  - Jos-Est import first successful run: `rowsRead=107259`, `rowsValid=106536`, `rowsNormalized=189960`, `rowsSkipped=723`, `qere_kethiv_variant_skipped=512`, `tahot_non_base_text_type_skipped=211`, `termsCreated=4465`, `occurrencesCreated=189913`, `occurrencesSkipped=47`, `duplicateOccurrences=47` warning-level skips, `missingMorphology=8658`, `errors=0`, `failedBatches=0`, `runtime=30.4797s`, `peakMemory=58523648`.
  - Jos-Est import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=189913`.
  - Jos-Est post counts: `14049` terms, `469045` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=331931`.
  - Jos-Est coverage: `Joshua=18058`, `Judges=17501`, `Ruth=2258`, `1 Samuel=23439`, `2 Samuel=19418`, `1 Kings=22983`, `2 Kings=21349`, `1 Chronicles=19158`, `2 Chronicles=24016`, `Ezra=6600`, `Nehemiah=9638`, `Esther=5495`.
  - Jos-Est duplicate groups=`0`.
  - Phase 5E-L2 binary-stable original term identity implementation is complete:
    - `term_identity_hash` added to `wcm_original_terms`.
    - Old collation-sensitive unique `term_identity` key removed.
    - Nonunique `term_identity_text` lookup index retained.
    - Binary-stable SHA-256 identity is authoritative for original terms.
  - Phase 5E-L3 term identity hash migration is complete:
    - backup path: `/private/tmp/wcm_phase_5e_l3_pre_term_identity_hash_migration.sql`
    - counts unchanged: `14049` terms and `469045` occurrences.
    - `empty_hash_terms=0`.
    - `duplicate_hash_groups=0`.
  - Controlled `STEP_TAHOT` Job-Sng retry local import passed with `batchSize=250`.
  - Backup path before Job-Sng retry import: `/private/tmp/wcm_phase_5e_l4_pre_tahot_job_sng_retry.sql`.
  - Job-Sng retry first successful run: `rowsRead=39090`, `rowsValid=38360`, `rowsNormalized=67815`, `rowsSkipped=730`, `qere_kethiv_variant_skipped=213`, `tahot_non_base_text_type_skipped=41`, `psalm_title=476`, `termsCreated=1161`, `occurrencesCreated=67815`, `missingMorphology=3749`, `errors=0`, `failedBatches=0`, `runtime=10.6089s`, `peakMemory=61161472`.
  - Job-Sng retry rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=67815`.
  - Job-Sng retry post counts: `15210` terms, `536860` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=399746`.
  - Job-Sng coverage: `Job=14807`, `Psalms=34226`, `Proverbs=11501`, `Ecclesiastes=5075`, `Song of Songs=2206`.
  - H1004A / `בֵּית` collation conflict resolved by hash identity.
  - Duplicate hash groups=`0`; duplicate term groups=`0`; duplicate occurrence groups=`0`.
  - Phase 5E-M completed.
  - Controlled `STEP_TAHOT` Isa-Mal local import passed with `batchSize=250`.
  - Backup path before Isa-Mal import: `/private/tmp/wcm_phase_5e_m_pre_tahot_isa_mal_full.sql`.
  - Isa-Mal import first successful run: `rowsRead=79313`, `rowsValid=78752`, `rowsNormalized=136403`, `rowsSkipped=561`, `qere_kethiv_variant_skipped=522`, `tahot_non_base_text_type_skipped=39`, `termsCreated=1681`, `occurrencesCreated=136403`, `missingMorphology=5569`, `errors=0`, `failedBatches=0`, `runtime=19.8509s`, `peakMemory=75317248`.
  - Isa-Mal import rerun was idempotent: `termsCreated=0`, `occurrencesCreated=0`, `occurrencesMatched=136403`.
  - Final original-language import counts: `16891` terms, `673263` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=536149`.
  - Full TAGNT NT is complete.
  - Full TAHOT OT is complete: OT books with TAHOT=`39`, OT books missing TAHOT=`0`.
  - Duplicate hash groups=`0`; duplicate term groups=`0`; duplicate occurrence groups=`0`.
  - Phase 6A read-only Original Language API is complete.
  - Frontend work has not been run.
  - Next phase candidate is Word Study API.

Phase 5D full dry-run aggregate results:

```txt
TAGNT rowsRead=142096
TAGNT rowsNormalized=137121
TAGNT rowsSkipped=4975

TAHOT rowsRead=305652
TAHOT rowsNormalized=536199
TAHOT rowsSkipped=2267

hard errors=0
```

Remaining non-hard dry-run issues:

- `missing_morphology`
- `tagnt_non_sbl_skipped`
- `qere_kethiv_variant_skipped`
- `tahot_non_base_text_type_skipped`
- `psalm_title`
- `duplicate_occurrence` warning-level skips

Still prohibited:

- Full STEP TAHOT or STEP TAGNT import.
- OSHB import.
- SBLGNT import.
- Public original-language API.
- Original-language UI, Interlinear UI, Strong's page, or Word Study UI.
- Any additional DB writes beyond separately approved local smoke or controlled import steps.
- Frontend changes.

Detailed Phase 5 plan:

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Bible Lookup API

Current endpoint:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}/{verse}
```

Example:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

Implementation structure:

- `src/Core/Plugin.php` registers API setup on `rest_api_init`.
- `src/Api/ApiRegistrar.php` calls `BibleController()->registerRoutes()`.
- `src/Api/BibleController.php` registers the lookup route.
- `BibleController` sanitizes and validates request parameters.
- `BibleController` uses `BibleRepository` for data access.
- `BibleRepository` uses `getVersionByCode`, `getBookBySlug`, and `getVerse` to query custom Bible tables.

## Current Bible Chapter API

Current endpoint:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Example:

```txt
/wp-json/wcm/v1/bible/KRV/genesis/1
```

Implementation structure:

- `src/Api/BibleController.php` registers the chapter route.
- `BibleController` sanitizes and validates version, book slug, and chapter params.
- `BibleController` uses `BibleRepository::getChapterVerses()` for chapter verse retrieval.
- The endpoint returns one chapter only and does not return a full Bible dataset.

## Current Book Metadata API

Current endpoint:

```txt
/wp-json/wcm/v1/books/{version}/{book}
```

Example:

```txt
/wp-json/wcm/v1/books/KRV/genesis
```

The endpoint returns book metadata used by the Reader for chapter boundary navigation:

```json
{
  "translation": "KRV",
  "book": "genesis",
  "name": "창세기",
  "chapter_count": 50
}
```

## Current Reader UX Status

The Reader now supports:

- Verse Anchor Navigation.
- Active Verse Highlight.
- Chapter Boundary Navigation.
- Bible Reader default scripture spacing/style standard.

Confirmed chapter boundary navigation examples:

- Genesis 1 previous is disabled.
- Genesis 50 next goes to Exodus 1.
- Malachi 4 next goes to Matthew 1.
- Matthew 1 previous goes to Malachi 4.
- Revelation 22 next is disabled.

Bible Reader default design standard:

```txt
docs/ROADMAP/BIBLE_READER_DESIGN_STANDARD.md
```

Current applied Reader spacing/style:

```txt
Verse list: ol gap-0
Verse row: py-0.5, scroll-mt-24, per-verse ids such as id="v16"
Verse text: leading-7
Active highlight: bg-blue-50, border-blue-200, rounded-lg, hover:bg-blue-100
Active verse number: text-blue-700
```

Design intent:

- Preserve a continuous Bible-like reading flow.
- Minimize artificial vertical spacing between verses.
- Maintain mobile readability.
- Highlight search-result destination verses with a subtle blue tone.
- Do not use strong yellow or red active verse highlights by default.
- Treat the Reader as scripture text density, not general blog article spacing.

Current applied spacing change:

```txt
Before: ol gap-4, verse row py-1, leading-8
After:  ol gap-0, verse row py-0.5, leading-7
```

Verified Reader spacing/style state:

```txt
typecheck passed
lint passed
build passed
git diff --check passed
```

## Current Scripture Source Structure

Current relevant plugin paths:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Import/
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/ValueObjects/
backend/app/public/wp-content/plugins/wcm-core/src/Api/BibleController.php
backend/app/public/wp-content/plugins/wcm-core/src/Api/ApiRegistrar.php
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/BibleRepository.php
backend/app/public/wp-content/plugins/wcm-core/src/Search/.gitkeep
```

`src/Search/` currently contains only `.gitkeep`. No search implementation exists there.

## Current Bible Storage Notes

Production Scripture data belongs in custom tables:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

ADR-0009 mentions a future `FULLTEXT KEY text_search (text)`, but the current `SchemaInstaller.php` `wcm_bible_verses` schema does not include a `FULLTEXT` index. Do not make the first Bible Search API depend on `FULLTEXT`.

## Validation State

Before this document update:

- `git rev-parse --show-toplevel` returned `/Users/donmini/Local Sites/wordcovenantministry`.
- `git status` was clean.
- Actual filesystem inspection confirmed the official plugin path and the non-official `backend/wcm-core/` directory.

Timeline MVP release notes, the staging readiness checklist, and the staging environment plan are now documented, and staging readiness review remains the next decision point.

Staging readiness review completed through available local validation: frontend build passed, and escalated route smoke returned HTTP 200 for `/ko/timeline` and `/en/timeline` on both `wordcovenantministry.local:3030` and `127.0.0.1:3030`. No deployment or beta tag was created. The staging environment plan is documented. Next step is to confirm the staging target and run staging validation before any release tag decision.
