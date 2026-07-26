# Project Status

## Date

2026-06-25

## Purpose

This document records the current project state so the next developer or coding agent can continue Scripture Engine work in a new session without relying on conversation history.

`docs/ROADMAP/` did not exist before this update. It was created because `docs/DECISIONS/` is reserved for ADRs, while this document set records operational status, current implementation state, and immediate next tasks.

Documentation Gate Proportionality applies: architecture, database, API, schema, import, migration, source-data, Data Package, deployment, and production-impacting work keep the full approval gate, while narrow frontend-only UI, route-shell, browser QA, and UX polish work may use the lighter workflow after inspection and relevant validation.

Approved phase-exception note:

- Password Reset and Private Verse Notes are being implemented as an approved Phase Exception.
- Timeline and Meaning Layer work remain paused during this user-feature implementation and are not being replaced.

Current documentation objective:

- formalize `docs/PROJECTS/REVELATION_LANGUAGE_PLATFORM.md` as the umbrella architecture for Scripture meaning, original-language study, semantic relations, and publication flow
- keep `docs/PROJECTS/SCRIPTURE_RESEARCH_ARCHITECTURE.md` aligned as the operational Reader/research-workspace companion
- design `docs/PROJECTS/MEANING_LAYER_ARCHITECTURE.md` as the next semantic layer beneath the umbrella architecture
- define `docs/PROJECTS/MEANING_CARD_PILOT_SPECIFICATION.md` as the first Meaning Card pilot standard

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

`CR-BR-CTX-68 Chapter Context Second Pilot Author Self-Check and Review-Required Promotion` is now complete as a docs/data state-change step. The `6` second-pilot rows for `Matthew 5`, `Matthew 14`, `Matthew 26`, `Matthew 27`, `Luke 2`, and `Acts 2` passed author self-check for deterministic identity, canonical book ids, required field presence, chapter-level scope boundaries, conservative package-backed `relatedEventIds`, and wording safety, and they have now been promoted from `reviewStatus: "draft"` to `reviewStatus: "review-required"`. `isSkeleton: false` remains unchanged for all `6` rows, the existing `4` reviewed rows remain unchanged, `packageVersion` remains `0.3.0-pilot`, and `status` remains `pilot`. Small wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; no identity, anchor, relation-id, Reader/runtime, verifier, fixture, API / backend / DB / schema, Bible-text/API, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added.

`CR-BR-CTX-69 Chapter Context Second Pilot Acceptance QA and Reviewed Promotion` is now complete as a docs/data state-change step. The `6` second-pilot rows for `Matthew 5`, `Matthew 14`, `Matthew 26`, `Matthew 27`, `Luke 2`, and `Acts 2` passed acceptance QA for deterministic identity, canonical book ids, required field presence, reference-only scripture anchors, conservative package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, chapter-level scope boundaries, and wording safety, and they have now been promoted from `reviewStatus: "review-required"` to `reviewStatus: "reviewed"`. `isSkeleton: false` remains unchanged for all `6` rows, the existing `4` reviewed rows remain unchanged, total reviewed chapter-context rows are now `10`, `packageVersion` remains `0.3.0-pilot`, and `status` remains `pilot`. Small wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; no identity, anchor, relation-id, Reader/runtime, verifier, fixture, API / backend / DB / schema, Bible-text/API, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added.

`CR-BR-CTX-70 Chapter Context Second Pilot Reader Route QA` is now complete as a docs-only Reader QA step with route-smoke and SSR-payload evidence. The local frontend process was confirmed on port `3030`, escalated route smoke returned HTTP `200` for representative Reader routes, and SSR payload inspection confirmed that the newly reviewed second-pilot chapters now carry `chapterContextPreview` for `/ko/bible/KRV/matthew/5`, `/ko/bible/KRV/matthew/14`, `/ko/bible/KRV/luke/2`, `/ko/bible/KRV/acts/2`, plus English spot-check routes `/en/bible/KRV/matthew/5` and `/en/bible/KRV/luke/2`. Existing reviewed spot-check chapters `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/exodus/12`, and `/ko/bible/KRV/matthew/13` also continued to carry reviewed chapter-context preview data, while fallback chapters `/ko/bible/KRV/genesis/2`, `/ko/bible/KRV/matthew/6`, `/ko/bible/KRV/luke/3`, `/ko/bible/KRV/acts/3`, and `/en/bible/KRV/genesis/2` continued to return `chapterContextPreview: null`. No Reader/runtime code, data-package rows, verifier code, fixture files, API / backend / DB / schema changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added.

`CR-BR-CTX-71 Chapter Context Expanded Browser QA and Manual Acceptance` is now complete as a docs-only manual Reader acceptance closure. User-performed expanded browser QA confirmed that all `10` reviewed chapter-context routes continue to display the chapter-context preview section in the Reader `Context / 문맥` tab, that fallback chapters continue to hide the chapter-context section entirely, that book-level context remains visible and primary, that the chapter-context block remains supplemental, and that anchor lists render cleanly without duplicated Bible text, raw JSON, or lingering `draft` / `review-required` wording. Manual acceptance also confirmed that selected-verse changes do not alter chapter-context content, no console or hydration errors were observed during the checked routes, and mobile width was acceptable. No code/UI fix, data-package row change, review-status change, package-version change, verifier change, fixture change, API / backend / DB / schema change, Bible-text/API change, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-73 Chapter Context Expansion Batch 3 Scope` is now complete as a docs-only scope-definition step. The next approved Batch 3 authoring set is `6` chapters: `Genesis 37`, `Genesis 41`, `Genesis 46`, `Exodus 3`, `Acts 9`, and `Acts 10`. Confirmed package-backed `relatedEventIds` are `event-joseph-sold-skeleton`, `event-joseph-egypt-skeleton`, `event-jacobs-house-goes-to-egypt-skeleton`, `event-moses-called-burning-bush-skeleton`, `event-conversion-of-paul-skeleton`, and `event-cornelius-and-gentiles-skeleton`, with canonical single-book `relatedBookIds` of `genesis`, `exodus`, and `acts` respectively. These candidates were selected because each has a clear event-package anchor, remains safe for chapter-level preview metadata without selected-verse/entity/map/kingdom expansion, and broadens coverage beyond the current reviewed Matthew-heavy set. Deferred candidates were excluded conservatively: `Genesis 4` and `Genesis 22` lack a direct current event row, `Genesis 12`, `Exodus 1`, and `Exodus 2` were judged more mixed at chapter scope than the selected set, `Exodus 14` was deferred because the current event row uses the mismatched id `event-passover-skeleton` for the Red Sea crossing, and `Matthew 3`, `Matthew 4`, `Matthew 17`, and `Matthew 21` were deferred to avoid over-concentrating the next batch in Matthew when stronger non-Matthew anchors are already available. No chapter-context rows, Reader/runtime code, API / backend / DB / schema changes, verifier changes, fixture changes, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-74 Chapter Context Batch 3 Draft Row Authoring` is now complete as a docs/data pilot-authoring step. `6` new draft rows were added for `Genesis 37`, `Genesis 41`, `Genesis 46`, `Exodus 3`, `Acts 9`, and `Acts 10` using the approved Batch 3 scope and conservative package-backed `relatedEventIds` only. The existing `10` reviewed rows remain unchanged, all new Batch 3 rows are `reviewStatus: "draft"` with `isSkeleton: false`, `packageVersion` is now `0.4.0-pilot`, and `status` remains `pilot`. Because the current Reader loader still exposes reviewed rows only, the new draft rows do not display in Reader yet. No Reader/runtime/API/backend/schema changes, verifier changes, fixture changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction work were added.

`CR-BR-CTX-75 Chapter Context Batch 3 Draft Row QA` is now complete as a docs/data QA step focused only on the `6` new Batch 3 draft rows for `Genesis 37`, `Genesis 41`, `Genesis 46`, `Exodus 3`, `Acts 9`, and `Acts 10`. The QA pass confirmed deterministic identity, canonical `bookId` values, required field presence, expected package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, reference-only chapter anchors, draft-state wording, and verifier cleanliness with `0` warnings. No row edits were needed. All `6` rows remain `reviewStatus: "draft"` and `isSkeleton: false`, the existing `10` reviewed rows remain unchanged, and no Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/place-mapping/Timeline-Kingdom changes were added.

`CR-BR-CTX-76 Chapter Context Batch 3 Author Self-Check and Review-Required Promotion` is now complete as a docs/data state-change step. The `6` Batch 3 rows for `Genesis 37`, `Genesis 41`, `Genesis 46`, `Exodus 3`, `Acts 9`, and `Acts 10` passed author self-check for deterministic identity, required-field presence, chapter-level scope boundaries, conservative package-backed `relatedEventIds`, and wording safety, and they have now been promoted from `reviewStatus: "draft"` to `reviewStatus: "review-required"`. `isSkeleton: false` remains unchanged for all `6` rows, the existing `10` reviewed rows remain unchanged, `packageVersion` remains `0.4.0-pilot`, and `status` remains `pilot`. Minimal wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; no Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/place-mapping/Timeline-Kingdom changes were added.

`CR-BR-CTX-77 Chapter Context Batch 3 Acceptance QA and Reviewed Promotion` is now complete as a docs/data state-change step. The `6` Batch 3 `review-required` rows for `Genesis 37`, `Genesis 41`, `Genesis 46`, `Exodus 3`, `Acts 9`, and `Acts 10` passed acceptance QA for deterministic identity, required-field presence, reference-only chapter anchors, conservative package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, and reviewed-safe chapter-level wording. Each of the `6` rows has now been promoted from `reviewStatus: "review-required"` to `reviewStatus: "reviewed"` while keeping `isSkeleton: false`, `packageVersion: "0.4.0-pilot"`, and `status: "pilot"`. Minimal wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; the existing `10` reviewed rows remain unchanged, total reviewed chapter-context rows are now `16`, and no Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/place-mapping/Timeline-Kingdom changes were added.

`CR-BR-CTX-78 Chapter Context Batch 3 Reader Route QA` is now complete as a docs-only Reader QA step with route-smoke and SSR-payload evidence. A local Next dev server was started on port `3030`, representative route smoke returned HTTP `200`, and SSR payload inspection confirmed that the newly reviewed Batch 3 chapters `/ko/bible/KRV/genesis/37`, `/ko/bible/KRV/genesis/41`, `/ko/bible/KRV/genesis/46`, `/ko/bible/KRV/exodus/3`, `/ko/bible/KRV/acts/9`, `/ko/bible/KRV/acts/10`, plus English spot-check routes `/en/bible/KRV/genesis/37`, `/en/bible/KRV/exodus/3`, and `/en/bible/KRV/acts/9`, now carry non-null `chapterContextPreview` data through the existing reviewed-only loader path. Existing reviewed spot-check routes `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/matthew/5`, `/ko/bible/KRV/luke/2`, and `/ko/bible/KRV/acts/2` also continued to carry reviewed chapter-context preview data, while fallback routes `/ko/bible/KRV/genesis/38`, `/ko/bible/KRV/genesis/42`, `/ko/bible/KRV/exodus/4`, `/ko/bible/KRV/acts/11`, and `/en/bible/KRV/genesis/38` continued to return `chapterContextPreview: null`. Static code-path review also reconfirmed that chapter-context lookup remains keyed only by `bookId + chapter` on the server, while selected-verse state is still passed separately as a client-side reader hint and does not filter or mutate chapter-context data. No Reader/runtime code, data-package rows, verifier code, fixture files, API / backend / DB / schema changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added.

`CR-BR-CTX-79 Chapter Context Batch 3 Expanded Browser QA and Manual Acceptance` is now complete as a docs-only manual Reader acceptance closure. User-performed expanded browser QA confirmed that all `6` reviewed Batch 3 chapter-context routes display normally in the Reader `Context / 문맥` tab, that representative existing reviewed routes still display chapter-context preview, that fallback routes continue to hide the chapter-context preview, that book-level context remains primary while chapter context remains supplemental, that anchor lists render cleanly without duplicated Bible text or raw JSON, that no lingering `draft` / `review-required` wording remains, that selected-verse changes do not alter chapter-context content, that no console or hydration errors were observed, and that mobile width was acceptable on checked routes. No code/UI fix, data-package row change, review-status change, package-version change, Reader/runtime/API/backend/schema/verifier/fixture change, selected-verse filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-81 Reader Verse Selection Browser Regression QA` is now complete through available validation as a Reader verse-selection regression check following the body-mode hotfix in `a34a816`. Escalated local process inspection confirmed an active `next dev` server on port `3030`, escalated route smoke returned HTTP `200` for `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/matthew/5`, `/ko/bible/KRV/matthew/13`, and `/en/bible/KRV/genesis/1`, and explicit code-path review confirmed that body, original-text, and interlinear verse selection now share the same `syncActiveVerseSelection()` path for `activeVerseId` plus `#v{verse}` hash synchronization while the research workspace still receives verse selection through the existing `crossReferenceVerse -> ScriptureResearchWorkspaceProvider verse -> CrossReferencePanel` flow. Code-path review also reconfirmed that chapter-context preview remains resolved only by `bookId + chapter` on the server and is not filtered or altered by selected-verse changes. Full interactive browser automation was not available in this environment because no local browser automation toolchain was present, so this closure does not claim direct DOM-level interaction coverage beyond route smoke and static regression review. No code/UI fix, chapter-context package change, data-package row change, API / backend / DB / schema change, verifier / fixture change, selected-verse-driven chapter-context filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added in this QA step.

`CR-BR-CTX-82 Reader Verse Selection Manual Browser Acceptance` is now complete as a docs-only manual acceptance closure. User-performed local browser QA confirmed that body, original-text, and interlinear verse selection all worked normally, that active verse highlight and `#v{verse}` hash updates stayed in sync across all three reading modes, that the research-workspace related verse panel updated correctly from each mode, that cross-mode selection remained consistent, that chapter-context preview stayed chapter-level and unchanged by selected-verse changes, that no console or hydration errors were observed, and that mobile behavior was acceptable. No code change, chapter-context package change, data-package row change, review-status change, package-version change, verifier or fixture change, API / backend / DB / schema change, selected-verse-driven chapter-context filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added in this closure.

`CR-BR-CTX-83 Reader Verse Selection Accessibility and Keyboard Spot Check` is now complete through available validation as a docs-only accessibility/keyboard QA closure. Static code-path review confirmed that body-mode verse text remains a real `button` with an explicit verse-selection label, that original-text and interlinear selection continue to use the same button-based activation path, that all three reading modes share the same `syncActiveVerseSelection()` flow for active-verse highlight plus `#v{verse}` hash synchronization, that the research-workspace related verse panel still receives its selected verse through the existing workspace `verse` flow, and that chapter-context preview remains chapter-level and unchanged by selected-verse changes. Static markup review found no duplicate or nested interactive-control issue in the verse row structure, and the body-mode button styling remained text-flow-safe with no obvious layout-shift risk. Escalated route smoke returned HTTP `200` for `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/matthew/5`, and `/en/bible/KRV/genesis/1`. Full live keyboard interaction testing was not automated in this environment, so this closure records route smoke plus static accessibility review rather than a direct DOM-level keyboard pass. No code/UI fix, chapter-context package change, data-package row change, verifier / fixture change, API / backend / DB / schema change, selected-verse-driven chapter-context filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added.

`CR-BR-CTX-84 Reader Verse Selection Focus-State Manual Spot Check` is now complete as a docs-only manual focus-state QA closure. User-performed local browser QA confirmed that body-mode verse buttons are reachable by `Tab`, remain visually identifiable when focused, activate correctly with `Enter` / `Space`, update active highlight, synchronize `#v{verse}` hash, update the research-workspace related verse panel, and keep line layout intact while focused. Original-text and interlinear modes also retained acceptable focus and selection behavior, hash/highlight synchronization, and related-verse updates; cross-mode switching remained consistent; no focus trap or nested interactive-control issue was observed; chapter-context preview remained chapter-level and unchanged by selected-verse changes; and no console or hydration errors were seen. No code change, chapter-context package change, data-package row change, review-status change, package-version change, verifier or fixture change, API / backend / DB / schema change, selected-verse-driven chapter-context filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added in this closure.

`CR-BR-CTX-85 Chapter Context Coverage Matrix and Batch 4 Scope` is now complete as a docs-only scope-definition step. The current reviewed chapter-context coverage remains `16` rows total: OT coverage is `Genesis 5` chapters and `Exodus 2` chapters, while NT coverage is `Matthew 5` chapters, `Luke 1` chapter, and `Acts 3` chapters. Major uncovered canonical sections remain Joshua / Judges, Samuel / Kings, Psalms / Wisdom, Major Prophets, and John / Pauline Epistles / General Epistles / Revelation. Batch 4 is now approved at a conservative `7`-chapter size, still below the hard cap of `8`, with these confirmed authoring targets and package-backed relation expectations: `Joshua 6 -> event-jericho-skeleton / [joshua]`, `Judges 2 -> event-judges-period-skeleton / [judges]`, `1 Samuel 16 -> event-david-anointed-skeleton / [1-samuel]`, `1 Kings 12 -> event-kingdom-divided-skeleton / [1-kings]`, `Psalm 137 -> event-exile-lament-zion-skeleton / [psalms, lamentations]`, `Daniel 1 -> event-daniel-in-babylon-skeleton / [daniel]`, and `Revelation 1 -> event-john-on-patmos-receives-revelation-skeleton / [revelation]`. These chapters were selected because each has a direct current event-package anchor, remains safe for chapter-level preview metadata without selected-verse/entity/map/kingdom expansion, and broadens coverage beyond the current Genesis / Matthew concentration. Excluded or deferred candidates were narrowed conservatively: `Exodus 14`, `1 Samuel 8`, `1 Kings 11`, `John 3`, `Isaiah 6`, `Jeremiah 1`, and `Daniel 7` were not approved because current event ids are mismatched, indirect, or not chapter-direct; `2 Samuel 7`, `Ezra 1`, `Nehemiah 2`, `Ezekiel 1`, `Matthew 3`, `Matthew 4`, `Matthew 17`, `Matthew 21`, `Acts 13`, and `Acts 15` remain viable but were deferred to keep Batch 4 bounded and avoid overconcentrating one historical block where coverage is already stronger. No chapter-context rows, Reader/runtime code, API / backend / DB / schema changes, verifier changes, fixture changes, Bible-text/API changes, selected-verse filtering, or Timeline Kingdom extraction work were added. The next CR is the actual authoring step: `CR-BR-CTX-86 Chapter Context Batch 4 Draft Row Authoring`.

`CR-BR-CTX-86 Chapter Context Batch 4 Draft Row Authoring` is now complete as a docs/data package authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` has been updated from `0.4.0-pilot` to `0.5.0-pilot` while staying `status: "pilot"`, and `7` new Batch 4 rows have been added for `Joshua 6`, `Judges 2`, `1 Samuel 16`, `1 Kings 12`, `Psalm 137`, `Daniel 1`, and `Revelation 1`. Each new row remains `reviewStatus: "draft"` with `isSkeleton: false`, uses only the CR-BR-CTX-85 approved chapter targets and package-backed event ids, and stays chapter-level preview metadata only. Existing reviewed rows remain unchanged, the new draft rows do not display in the Reader because the current loader path still normalizes reviewed rows only, and no Reader/runtime/API/backend/schema/verifier/fixture or selected-verse-driven chapter-context filtering changes were added. The next CR is `CR-BR-CTX-87 Chapter Context Batch 4 Draft Row QA`.

`CR-BR-CTX-87 Chapter Context Batch 4 Draft Row QA` is now complete as a docs/data QA step focused only on the `7` new Batch 4 draft rows for `Joshua 6`, `Judges 2`, `1 Samuel 16`, `1 Kings 12`, `Psalm 137`, `Daniel 1`, and `Revelation 1`. The QA pass confirmed deterministic identity, canonical `bookId` values, required field presence, expected package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, reference-only chapter anchors, draft-state wording, and verifier cleanliness with `0` warnings. No row edits were needed. All `7` rows remain `reviewStatus: "draft"` and `isSkeleton: false`, the existing `16` reviewed rows remain unchanged, and no Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/place-mapping/Timeline-Kingdom changes were added. The next CR is `CR-BR-CTX-88 Chapter Context Batch 4 Author Self-Check and Review-Required Promotion`.

`CR-BR-CTX-88 Chapter Context Batch 4 Author Self-Check and Review-Required Promotion` is now complete as a docs/data state-change step. The `7` Batch 4 rows for `Joshua 6`, `Judges 2`, `1 Samuel 16`, `1 Kings 12`, `Psalm 137`, `Daniel 1`, and `Revelation 1` passed author self-check for deterministic identity, canonical book ids, required field presence, chapter-level scope boundaries, conservative package-backed `relatedEventIds`, and wording safety, and they have now been promoted from `reviewStatus: "draft"` to `reviewStatus: "review-required"`. `isSkeleton: false` remains unchanged for all `7` rows, the existing `16` reviewed rows remain unchanged, `packageVersion` remains `0.5.0-pilot`, and `status` remains `pilot`. Small wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; no identity, anchor, relation-id, Reader/runtime, verifier, fixture, API / backend / DB / schema, Bible-text/API, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added. The next CR is `CR-BR-CTX-89 Chapter Context Batch 4 Acceptance QA and Reviewed Promotion`.

`CR-BR-CTX-89 Chapter Context Batch 4 Acceptance QA and Reviewed Promotion` is now complete as a docs/data state-change step. The `7` Batch 4 rows for `Joshua 6`, `Judges 2`, `1 Samuel 16`, `1 Kings 12`, `Psalm 137`, `Daniel 1`, and `Revelation 1` passed acceptance QA for deterministic identity, canonical book ids, required field presence, reference-only scripture anchors, conservative package-backed `relatedEventIds`, empty `relatedKingdomIds` / `relatedPlaceIds`, chapter-level scope boundaries, and wording safety, and they have now been promoted from `reviewStatus: "review-required"` to `reviewStatus: "reviewed"`. `isSkeleton: false` remains unchanged for all `7` rows, the existing `16` reviewed rows remain unchanged, total reviewed chapter-context rows are now `23`, `packageVersion` remains `0.5.0-pilot`, and `status` remains `pilot`. Small wording updates were limited to status-alignment text in `confidenceLabel` and `sourceBasisLabel`; no identity, anchor, relation-id, Reader/runtime, verifier, fixture, API / backend / DB / schema, Bible-text/API, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added. The next CR is `CR-BR-CTX-90 Chapter Context Batch 4 Reader Route QA`.

`CR-BR-CTX-90 Chapter Context Batch 4 Reader Route QA` is now complete as a docs-only Reader QA step with route-smoke, SSR-payload, and static code-path evidence. Escalated local route smoke returned HTTP `200` for all checked Batch 4 reviewed routes `/ko/bible/KRV/joshua/6`, `/ko/bible/KRV/judges/2`, `/ko/bible/KRV/1-samuel/16`, `/ko/bible/KRV/1-kings/12`, `/ko/bible/KRV/psalms/137`, `/ko/bible/KRV/daniel/1`, `/ko/bible/KRV/revelation/1`, existing reviewed spot-check routes `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/exodus/12`, `/ko/bible/KRV/matthew/5`, `/ko/bible/KRV/acts/9`, and English spot-check routes `/en/bible/KRV/joshua/6`, `/en/bible/KRV/1-samuel/16`, and `/en/bible/KRV/revelation/1`. SSR payload inspection confirmed that all `7` Batch 4 reviewed routes serialize non-null `chapterContextPreview` rows with the expected reviewed ids, that existing reviewed spot-check routes still serialize their reviewed chapter-context rows, and that fallback routes `/ko/bible/KRV/joshua/7`, `/ko/bible/KRV/judges/3`, `/ko/bible/KRV/1-samuel/17`, `/ko/bible/KRV/1-kings/13`, `/ko/bible/KRV/psalms/138`, `/ko/bible/KRV/daniel/2`, `/ko/bible/KRV/revelation/2`, and `/en/bible/KRV/joshua/7` continue to return `chapterContextPreview: null`. Static code-path review also confirmed that selected verse state remains separate from chapter-context resolution, which still depends only on `bookId + chapter`. No Reader/runtime code, data-package rows, verifier code, fixture files, API / backend / DB / schema changes, Bible-text/API changes, selected-verse filtering, place mapping, or Timeline Kingdom extraction changes were added. Full interactive browser QA remains a separate later step. The next CR is `CR-BR-CTX-91 Chapter Context Batch 4 Expanded Browser QA and Manual Acceptance`.

`CR-BR-CTX-91 Chapter Context Batch 4 Expanded Browser QA and Manual Acceptance` is now complete as a docs-only manual Reader acceptance closure. User-performed browser QA confirmed that all `7` Batch 4 reviewed routes continue to display chapter-context preview in the Reader `Context / 문맥` tab, that existing reviewed spot-check routes remain visible, and that fallback routes continue to hide chapter-context preview. Manual acceptance also confirmed that book-level context remains primary, chapter context remains supplemental, anchor lists render cleanly, no duplicated Bible text or raw JSON appears, no lingering `draft` / `review-required` wording is visible, selected-verse changes do not alter chapter-context content, no console or hydration errors were observed, and mobile width was acceptable. No code/UI fix, data-package row change, review-status change, package-version change, Reader/runtime/API/backend/schema/verifier/fixture change, selected-verse filtering, Timeline deep-link expansion, or Timeline Kingdom extraction work was added. The next CR is `CR-BR-CTX-92 Chapter Context Coverage Matrix and Batch 5 Scope`.

`CR-BR-CTX-92 Chapter Context Coverage Matrix and Batch 5 Scope` is now complete as a docs-only scope-definition step. Current reviewed chapter-context coverage is now `23` rows total across `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Joshua 6`, `Judges 2`, `1 Samuel 16`, `1 Kings 12`, `Psalm 137`, `Daniel 1`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `Acts 2, 9, 10`, and `Revelation 1`. To avoid further Genesis / Matthew concentration and broaden under-covered canonical sections, Batch 5 is now approved as a conservative `6`-chapter set: `2 Samuel 7 -> event-davidic-covenant-skeleton / [2-samuel]`, `Ezra 1 -> event-return-from-exile-skeleton / [ezra]`, `Nehemiah 2 -> event-nehemiah-wall-rebuilding-skeleton / [nehemiah]`, `Ezekiel 1 -> event-ezekiel-exile-vision-skeleton / [ezekiel]`, `Acts 15 -> event-jerusalem-council-skeleton / [acts]`, and `Revelation 21 -> event-new-creation-consummation-skeleton / [revelation]`. These chapters were selected because each has a current direct event-package anchor, remains safe for chapter-level preview metadata without selected-verse/entity/map/kingdom expansion, and improves balance across Samuel / Kings, Return / Post-exile, Major Prophets, Acts, and Revelation. Candidates were excluded conservatively where anchors were absent, indirect, or too broad for a clean chapter-level row: `John 3`, `Isaiah 6`, `Jeremiah 1`, `Hebrews 1`, and `1 Corinthians 15` have no direct current core-event anchor; `Romans 1`, `James 1`, and `1 Peter 1` currently map only to broad epistolary witness markers rather than chapter-direct event rows; and `Acts 13` was deferred because the current event anchors split between `Acts 13:1-3` and the broader `Acts 13:4-14:28` missionary-journey range, making `Acts 15` the safer chapter-level pick for this batch. No chapter-context rows, Reader/runtime code, API / backend / DB / schema changes, verifier changes, fixture changes, Bible-text/API changes, selected-verse filtering, or Timeline Kingdom extraction work were added. The next CR is the actual authoring step: `CR-BR-CTX-93 Chapter Context Batch 5 Draft Row Authoring`.

`CR-BR-CTX-93 Chapter Context Batch 5 Draft Row Authoring` is now complete as a docs/data package authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now includes `6` new Batch 5 draft rows for `2 Samuel 7`, `Ezra 1`, `Nehemiah 2`, `Ezekiel 1`, `Acts 15`, and `Revelation 21` using the approved Batch 5 scope and confirmed package-backed `relatedEventIds` only: `event-davidic-covenant-skeleton`, `event-return-from-exile-skeleton`, `event-nehemiah-wall-rebuilding-skeleton`, `event-ezekiel-exile-vision-skeleton`, `event-jerusalem-council-skeleton`, and `event-new-creation-consummation-skeleton`. Existing reviewed rows remain unchanged, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, `packageVersion` is now `0.6.0-pilot`, and `status` remains `pilot`. Because the current Reader loader still exposes reviewed rows only, these new draft rows do not display in Reader yet. No Reader/runtime/API/backend/schema changes, verifier changes, fixture changes, Bible-text/API changes, selected-verse filtering, or Timeline Kingdom extraction work were added. The next CR is `CR-BR-CTX-94 Chapter Context Batch 5 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-94 Chapter Context Batch 5 Draft QA and Verifier Acceptance` is now complete as a docs-only QA closure. Package verification confirmed that `docs/data-packages/timeline/chapter-context.skeleton.json` remains at `packageVersion: "0.6.0-pilot"` and `status: "pilot"`, that existing reviewed rows remain `23`, and that the current Batch 5 draft set remains exactly `6` rows: `chapter-context-2-samuel-7`, `chapter-context-ezra-1`, `chapter-context-nehemiah-2`, `chapter-context-ezekiel-1`, `chapter-context-acts-15`, and `chapter-context-revelation-21`. All `6` Batch 5 rows remain `reviewStatus: "draft"` with `isSkeleton: false`, and their `relatedBookIds` / `relatedEventIds` continue to resolve to existing canonical book rows and current core-event package ids only. Reviewed-only Reader behavior was also rechecked without changing code: `frontend/src/components/scripture/timeline/timelineChapterContextPackage.ts` still normalizes only `reviewStatus: "reviewed"` rows, the Reader page loader in `frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx` still resolves chapter context only through `getReviewedChapterContextByBookAndChapter()`, and local route smoke plus local SSR payload inspection against the Reader dev server confirmed that sampled Batch 5 draft routes continue to return `chapterContextPreview: null` while sampled reviewed routes still serialize reviewed chapter-context rows and sampled fallback routes still remain null. No data-package rows were modified, no draft rows were promoted, and no Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/Timeline-Kingdom changes were added. The next CR is `CR-BR-CTX-95 Chapter Context Batch 5 Review Notes and Promotion Scope`.

`CR-BR-CTX-95 Chapter Context Batch 5 Review Notes and Promotion Scope` is now complete as a docs-only content-review and promotion-scope step. The current package remains unchanged at `packageVersion: "0.6.0-pilot"` with `status: "pilot"`, existing reviewed rows remain `23`, and the current Batch 5 draft set remains exactly `6` rows with `reviewStatus: "draft"` and `isSkeleton: false`: `chapter-context-2-samuel-7`, `chapter-context-ezra-1`, `chapter-context-nehemiah-2`, `chapter-context-ezekiel-1`, `chapter-context-acts-15`, and `chapter-context-revelation-21`. Row-level content review confirmed that each draft row remains conservative enough for chapter-level preview metadata: titles, summaries, scope labels, basis/confidence/caution/source-basis labels, and related theme labels stay within chapter-level metadata boundaries; no row adds Bible text, copied commentary prose, selected-verse interpretation, exact chronology claims beyond package-anchor context, runtime-ready wording, entity/person/place/map/provider/geocoding assumptions, or non-package relation ids. `relatedBookIds` remain conservative single-book references, `relatedEventIds` continue to resolve only to current package-backed core-event ids, and empty `relatedKingdomIds` / `relatedPlaceIds` remain a present-package limitation rather than a claim that no such relations could ever exist. No draft row required wording refinement before future promotion, so all `6` Batch 5 draft rows are now classified as promotion-ready for a later state-change CR. No data-package row, review-status, package-version, package-status, Reader/runtime/API/backend/schema/verifier/fixture, Bible-text, selected-verse, or Timeline-Kingdom change was added in this step. The next CR is `CR-BR-CTX-96 Chapter Context Batch 5 Promotion to Reviewed`.

`CR-BR-CTX-96 Chapter Context Batch 5 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.6.0-pilot"` to `packageVersion: "0.7.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 5 rows `chapter-context-2-samuel-7`, `chapter-context-ezra-1`, `chapter-context-nehemiah-2`, `chapter-context-ezekiel-1`, `chapter-context-acts-15`, and `chapter-context-revelation-21` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `29`, total draft rows are now `0`, and total rows remain `29`. No title, summary, scope label, anchor, related id, related theme, caution, basis, confidence, or source-basis wording was changed in this promotion step. Reviewed-only Reader behavior was rechecked without changing code: the current chapter-context normalizer still accepts only `reviewStatus: "reviewed"` rows, the Reader page loader still resolves chapter context only through `getReviewedChapterContextByBookAndChapter()`, and escalated local route-smoke plus SSR/HTML payload inspection returned HTTP `200` for the promoted Batch 5 routes and showed the expected promoted row ids/titles in the Reader route output. Existing reviewed spot-check routes also continued to surface their reviewed chapter-context row ids, while a fallback route with no chapter-context row did not show any known chapter-context title in SSR output. Full interactive browser QA, selected-verse interaction QA, console/hydration inspection, and mobile-width acceptance were not directly automated in this environment, so this CR records route/SSR validation only rather than full manual browser acceptance. No Reader/runtime/API/backend/schema/verifier/fixture/Bible-text/selected-verse/Timeline-Kingdom change was added. The next CR is `CR-BR-CTX-97 Chapter Context Batch 5 Expanded Browser Acceptance`.

`CR-BR-CTX-97 Chapter Context Batch 5 Expanded Browser Acceptance` was attempted but is not completed in this environment. Local runtime reachability was rechecked: the frontend dev server still listens on port `3030`, and escalated localhost fetch confirmed HTTP `200` for representative Reader routes including promoted, existing-reviewed, and fallback chapters. However full interactive browser acceptance could not be executed because no local `Playwright` or `Puppeteer` package is installed in `frontend/node_modules`, sandboxed `curl` still cannot reach the local frontend directly, and both installed GUI browsers (`Google Chrome` and `Safari`) block AppleScript DOM interaction unless `Allow JavaScript from Apple Events` is manually enabled in browser settings. Because of those environment constraints, this attempt does not claim actual interactive tab clicking, visible supplemental-block confirmation, selected-verse interaction verification, console/hydration inspection, or mobile-width acceptance. The package remains unchanged at `0.7.0-pilot` / `pilot` with `29` reviewed rows, the data package was not modified, and no Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-97R Chapter Context Batch 5 Browser Acceptance Rerun`.

`CR-BR-CTX-97M Chapter Context Batch 5 Manual Browser Acceptance` is now complete as a docs-only acceptance-record step. Browser automation blockers remain unchanged in the Codex environment: local `Playwright` / `Puppeteer` tooling is still absent, and the installed GUI browsers still require manual Apple Events JavaScript enablement before Codex can claim direct DOM automation. This CR therefore does not claim that Codex performed full browser automation. Instead, it records user-performed manual browser acceptance based on the user's explicit `manual check ok` confirmation. By that user manual check, the promoted Batch 5 Reader routes for `2 Samuel 7`, `Ezra 1`, `Nehemiah 2`, `Ezekiel 1`, `Acts 15`, and `Revelation 21` were accepted; existing reviewed route spot-checks for `Genesis 1`, `Matthew 13`, `Acts 10`, and `Revelation 1` were accepted; and the fallback route `Genesis 2` was accepted. The recorded manual acceptance notes are that the `Context / 문맥` tab opens normally, Batch 5 promoted chapter context is visible, existing reviewed chapter context remains visible, the fallback route hides the chapter-context supplemental block, book-level context remains primary, chapter context remains supplemental, no duplicated Bible text or raw JSON appears, no draft/review-required wording appears, selected-verse changes do not alter chapter context, and mobile width is acceptable by user manual check. The package remains unchanged at `0.7.0-pilot` / `pilot` with `29` reviewed rows and `0` draft rows, the data package was not modified, and no Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-98 Chapter Context Coverage Matrix and Batch 6 Scope`.

`CR-BR-CTX-98 Chapter Context Coverage Matrix and Batch 6 Scope` is now complete as a docs-only coverage and scope-definition step. The current chapter-context package remains unchanged at `0.7.0-pilot` / `pilot` with `29` reviewed rows, `0` draft rows, and `29` total rows. Reviewed coverage currently includes `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Joshua 6`, `Judges 2`, `1 Samuel 16`, `2 Samuel 7`, `1 Kings 12`, `Ezra 1`, `Nehemiah 2`, `Psalms 137`, `Daniel 1`, `Ezekiel 1`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `Acts 2, 9, 10, 15`, and `Revelation 1, 21`. To avoid further near-term concentration in `Genesis`, `Matthew`, and `Acts`, Batch 6 is now scoped toward under-covered canonical sections with explicit current event anchors. The selected Batch 6 chapters for the next authoring CR are `Isaiah 7` with conservative `relatedBookIds: ["isaiah"]` and `relatedEventIds: ["event-ahaz-and-isaiah-seven-skeleton"]`, `Jeremiah 36` with `relatedBookIds: ["jeremiah"]` and `relatedEventIds: ["event-jeremiah-scroll-jehoiakim-skeleton"]`, `John 20` with `relatedBookIds: ["john"]` and `relatedEventIds: ["event-resurrection-skeleton"]`, `Romans 1` with `relatedBookIds: ["romans"]` and `relatedEventIds: ["event-pauline-letters-to-churches-skeleton"]`, `James 1` with `relatedBookIds: ["james"]` and `relatedEventIds: ["event-apostolic-witness-skeleton"]`, and `1 Peter 1` with `relatedBookIds: ["1-peter"]` and `relatedEventIds: ["event-apostolic-witness-skeleton"]`. These chapters were selected because each has an explicit existing event anchor in `events.core-biblical-skeleton.json`, can be framed as conservative chapter-level preview metadata, does not require selected-verse filtering or entity/map/kingdom extraction, and does not duplicate the current `29` reviewed rows. The following candidates were reviewed but excluded from Batch 6 scope: `Isaiah 6`, `Jeremiah 1`, `John 3`, `Hebrews 1`, `1 Corinthians 15`, and `Romans 8` because the current event package does not provide a direct chapter-level event anchor for those chapters; `Acts 13` because `Acts` is already comparatively well covered and the current event anchor spans a broader multi-chapter missionary-journey block; `John 1` because the current `John` event anchors begin at `John 6`; `Revelation 22` because the current `new-creation` event anchor spans `Revelation 21:1-22:5` while `Revelation 21` is already covered and `Revelation` remains a lower-priority expansion area for this batch; and `Isaiah 53` because the current event package does not expose a direct matching event anchor for that chapter. Browser automation blocker status remains a separate environment issue, while Batch 5 acceptance remains closed through user-performed manual browser confirmation. No data package, Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-99 Chapter Context Batch 6 Draft Row Authoring`.

`CR-BR-CTX-99 Chapter Context Batch 6 Draft Row Authoring` is now complete as a narrow docs/data package authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances to `packageVersion: "0.8.0-pilot"` while keeping `status: "pilot"`, existing reviewed rows remain unchanged at `29`, and `6` new Batch 6 draft rows have been added for `Isaiah 7`, `Jeremiah 36`, `John 20`, `Romans 1`, `James 1`, and `1 Peter 1`. The new row ids are `chapter-context-isaiah-7`, `chapter-context-jeremiah-36`, `chapter-context-john-20`, `chapter-context-romans-1`, `chapter-context-james-1`, and `chapter-context-1-peter-1`. All `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, use the previously approved conservative self-book `relatedBookIds`, and reference only existing approved event ids: `event-ahaz-and-isaiah-seven-skeleton`, `event-jeremiah-scroll-jehoiakim-skeleton`, `event-resurrection-skeleton`, `event-pauline-letters-to-churches-skeleton`, and `event-apostolic-witness-skeleton`. The new wording remains chapter-level preview metadata only: no Bible text, copied commentary prose, selected-verse interpretation, exact chronology claim, entity/map/provider dependency, or runtime-ready wording was added. Because the current Reader loader still normalizes reviewed rows only, these new draft rows do not display in Reader yet. No Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-100 Chapter Context Batch 6 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-100 Chapter Context Batch 6 Draft QA and Verifier Acceptance` is now complete as a docs-only QA and verification step. The current chapter-context package remains unchanged at `0.8.0-pilot` / `pilot` with `29` reviewed rows, `6` draft rows, and `35` total rows. All `6` Batch 6 rows were rechecked in-place: `chapter-context-isaiah-7`, `chapter-context-jeremiah-36`, `chapter-context-john-20`, `chapter-context-romans-1`, `chapter-context-james-1`, and `chapter-context-1-peter-1` each still exist with the expected `bookId`, `chapter`, conservative self-book `relatedBookIds`, approved package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`, while the existing `29` reviewed rows remain unchanged. Related id validation reconfirmed that the Batch 6 event ids resolve in `events.core-biblical-skeleton.json` and that the referenced book ids resolve in `books.66-canonical-skeleton.json`. Static code-path review reconfirmed that `frontend/src/components/scripture/timeline/timelineChapterContextPackage.ts` still normalizes only `reviewStatus === "reviewed"` rows and that `frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx` still resolves chapter context only through `getReviewedChapterContextByBookAndChapter()`, so Batch 6 draft rows remain hidden from Reader without any code change. Environment-limited route/SSR QA also passed through escalated localhost fetch: the Batch 6 draft routes returned HTTP `200` but did not expose their draft row ids or expected chapter-context titles in SSR output, representative reviewed routes for `Genesis 1`, `Matthew 13`, `Acts 15`, and `Revelation 21` still returned HTTP `200` with expected reviewed chapter-context titles in SSR output, and fallback route `Genesis 2` returned HTTP `200` without known chapter-context output. Visible SSR text checks found no `draft`, `review-required`, or raw JSON exposure in the sampled outputs. Browser automation blockers remain an environment issue, so this CR records verifier/static/SSR acceptance only and does not claim interactive browser acceptance. No data package, Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-101 Chapter Context Batch 6 Review Notes and Promotion Scope`.

`CR-BR-CTX-101 Chapter Context Batch 6 Review Notes and Promotion Scope` is now complete as a docs-only content-review and promotion-scope step. The current chapter-context package remains unchanged at `0.8.0-pilot` / `pilot` with `29` reviewed rows, `6` draft rows, and `35` total rows. The Batch 6 draft rows `chapter-context-isaiah-7`, `chapter-context-jeremiah-36`, `chapter-context-john-20`, `chapter-context-romans-1`, `chapter-context-james-1`, and `chapter-context-1-peter-1` were reviewed row by row for chapter-level preview safety. Their titles, summaries, chapter-scope labels, basis/confidence/caution/source-basis labels, and related theme labels all remain conservative and chapter-scoped; no row adds Bible text, copied commentary prose, selected-verse interpretation, exact chronology claims beyond package-anchor context, runtime-ready wording, reviewed-state wording, or entity/person/place/map/provider/geocoding assumptions. `relatedBookIds` remain conservative self-book references, `relatedEventIds` continue to resolve only to existing package-backed event ids, empty `relatedKingdomIds` / `relatedPlaceIds` remain present-package limits rather than claims of theological or historical absence, and none of the six rows duplicates the current reviewed set. No wording refinement was required before future promotion, so all `6` Batch 6 draft rows are now classified as promotion-ready for the next state-change CR. Browser automation blocker status remains a separate environment issue, and no new browser-acceptance claim is added in this review step. No data-package row, review-status, package-version, package-status, Reader/runtime/API/backend/schema/verifier/fixture, Bible-text, selected-verse, or Timeline-Kingdom change was added. The next CR is `CR-BR-CTX-102 Chapter Context Batch 6 Promotion to Reviewed`.

`CR-BR-CTX-102 Chapter Context Batch 6 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.8.0-pilot"` to `packageVersion: "0.9.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 6 rows `chapter-context-isaiah-7`, `chapter-context-jeremiah-36`, `chapter-context-john-20`, `chapter-context-romans-1`, `chapter-context-james-1`, and `chapter-context-1-peter-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `35`, total draft rows are now `0`, and total rows remain `35`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-103 Chapter Context Batch 6 Route/SSR Acceptance`.

`CR-BR-CTX-103 Chapter Context Batch 6 Route/SSR Acceptance` is now complete as a docs-only route/SSR validation step. The current chapter-context package remains unchanged at `0.9.0-pilot` / `pilot` with `35` reviewed rows, `0` draft rows, and `35` total rows. Local runtime reachability remains environment-limited in the sandbox: `lsof` still confirmed a live frontend listener on port `3030`, while sandboxed `curl` to `wordcovenantministry.local:3030` and `127.0.0.1:3030` still failed. Using escalated localhost fetch for SSR evidence, the promoted Batch 6 Reader routes `/ko/bible/KRV/isaiah/7`, `/ko/bible/KRV/jeremiah/36`, `/ko/bible/KRV/john/20`, `/ko/bible/KRV/romans/1`, `/ko/bible/KRV/james/1`, and `/ko/bible/KRV/1-peter/1` each returned HTTP `200` and exposed their expected reviewed chapter-context titles in SSR output. Existing reviewed route spot-checks for `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/matthew/13`, `/ko/bible/KRV/acts/15`, and `/ko/bible/KRV/revelation/21` also returned HTTP `200` and continued to surface their expected reviewed chapter-context titles. Fallback route `/ko/bible/KRV/genesis/2` returned HTTP `200` and did not expose any known chapter-context output. Visible SSR text checks found no `draft`, `review-required`, or raw JSON exposure in the sampled outputs. Browser automation blocker status remains a separate environment issue, so this CR records route/SSR acceptance only and does not claim interactive browser acceptance. No data package, Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-104 Chapter Context Coverage Matrix and Batch 7 Scope`.

`CR-BR-CTX-104 Chapter Context Coverage Matrix and Batch 7 Scope` is now complete as a docs-only coverage and scope-definition step. The current chapter-context package remains unchanged at `0.9.0-pilot` / `pilot` with `35` reviewed rows, `0` draft rows, and `35` total rows. Reviewed coverage now includes `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Joshua 6`, `Judges 2`, `1 Samuel 16`, `2 Samuel 7`, `1 Kings 12`, `Ezra 1`, `Nehemiah 2`, `Psalms 137`, `Isaiah 7`, `Jeremiah 36`, `Daniel 1`, `Ezekiel 1`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `James 1`, `1 Peter 1`, and `Revelation 1, 21`. To avoid further immediate concentration in `Genesis`, `Matthew`, and `Acts`, Batch 7 is now scoped toward later-kingdom/exile, post-exile, minor-prophet, Johannine, and general-epistle coverage where the current event package exposes direct chapter anchors. The selected Batch 7 chapters for the next authoring CR are `2 Kings 17` with conservative `relatedBookIds: ["2-kings"]` and `relatedEventIds: ["event-northern-kingdom-exile-skeleton"]`, `2 Kings 25` with `relatedBookIds: ["2-kings"]` and `relatedEventIds: ["event-southern-kingdom-exile-skeleton"]`, `Esther 4` with `relatedBookIds: ["esther"]` and `relatedEventIds: ["event-esther-deliverance-skeleton"]`, `Malachi 3` with `relatedBookIds: ["malachi"]` and `relatedEventIds: ["event-malachi-post-exile-rebuke-skeleton"]`, `John 6` with `relatedBookIds: ["john"]` and `relatedEventIds: ["event-feeding-five-thousand-skeleton"]`, and `Jude 1` with `relatedBookIds: ["jude"]` and `relatedEventIds: ["event-apostolic-witness-skeleton"]`. These chapters were selected because each has an explicit current event anchor whose Scripture reference begins in the target chapter, remains safe for chapter-level preview metadata without selected-verse logic or entity/map/geocoding expansion, does not duplicate the current reviewed set, and broadens canonical distribution. The following candidate summaries were excluded from Batch 7 scope: `Deuteronomy 6`, `Ruth 1`, `Jonah 1`, `Micah 5`, `John 11`, `Romans 8`, `1 Corinthians 15`, `Galatians 3`, `Ephesians 1`, `Philippians 2`, `Hebrews 1`, `Hebrews 11`, `2 Peter 1`, and `Revelation 22` because the current event package does not expose a direct matching chapter-level event anchor for those chapters; and `John 19` because although `event-crucifixion-skeleton` directly anchors `John 19:16-37`, the current reviewed set already has dense passion/resurrection coverage through `Matthew 26`, `Matthew 27`, and `John 20`, so `John 6` was preferred for broader Johannine distribution in this batch. Browser automation blocker status remains a separate environment issue. No data package, Reader/runtime/API/backend/schema/verifier/fixture change was added. The next CR is `CR-BR-CTX-105 Chapter Context Batch 7 Draft Row Authoring`.

`CR-BR-CTX-105 Chapter Context Batch 7 Draft Row Authoring` is now complete as a narrow docs/data package authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.9.0-pilot"` to `packageVersion: "0.10.0-pilot"` while keeping `status: "pilot"`, existing reviewed rows remain unchanged at `35`, and `6` new Batch 7 draft rows were added for `2 Kings 17`, `2 Kings 25`, `Esther 4`, `Malachi 3`, `John 6`, and `Jude 1` using only the CR-BR-CTX-104-approved self-book `relatedBookIds` and existing package-backed `relatedEventIds`. All `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `41`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader until later review/promotion. No existing reviewed row was modified, and no Reader/runtime/API/backend/schema/verifier/fixture change was introduced. The next CR is `CR-BR-CTX-106 Chapter Context Batch 7 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-106 Chapter Context Batch 7 Draft QA and Verifier Acceptance` is now complete as a docs-only QA and verifier-acceptance step. The current chapter-context package remains unchanged at `0.10.0-pilot` / `pilot` with `35` reviewed rows, `6` draft rows, and `41` total rows. All `6` Batch 7 rows were rechecked in place: `chapter-context-2-kings-17`, `chapter-context-2-kings-25`, `chapter-context-esther-4`, `chapter-context-malachi-3`, `chapter-context-john-6`, and `chapter-context-jude-1` each still exist with the expected `bookId`, `chapter`, conservative self-book `relatedBookIds`, approved package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`, while the existing `35` reviewed rows remain unchanged. Content sanity review confirmed that the new rows remain chapter-level preview metadata only, contain no Bible text or copied commentary prose, avoid selected-verse interpretation and exact chronology expansion, and add no map/geocoding/entity dependency. Static code-path review reconfirmed that `frontend/src/components/scripture/timeline/timelineChapterContextPackage.ts` still normalizes only `reviewStatus === "reviewed"` rows, so Batch 7 draft rows remain hidden from Reader without any code change. Environment-limited localhost route/SSR checks returned HTTP `200` for the Batch 7 draft routes and confirmed that their draft titles or ids do not appear in SSR output, while representative reviewed routes for `Isaiah 7`, `John 20`, and `Revelation 21` still surface their reviewed chapter-context titles and fallback route `Genesis 2` remains without known chapter-context output. No data package, Reader/runtime/API/backend/schema/verifier/fixture change was introduced. The next CR is `CR-BR-CTX-107 Chapter Context Batch 7 Promotion to Reviewed`.

`CR-BR-CTX-107 Chapter Context Batch 7 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.10.0-pilot"` to `packageVersion: "0.11.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 7 rows `chapter-context-2-kings-17`, `chapter-context-2-kings-25`, `chapter-context-esther-4`, `chapter-context-malachi-3`, `chapter-context-john-6`, and `chapter-context-jude-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `41`, total draft rows are now `0`, and total rows remain `41`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. Environment-limited localhost route/SSR checks then returned HTTP `200` for all promoted Batch 7 routes and confirmed that `/ko/bible/KRV/2-kings/17`, `/ko/bible/KRV/2-kings/25`, `/ko/bible/KRV/esther/4`, `/ko/bible/KRV/malachi/3`, `/ko/bible/KRV/john/6`, and `/ko/bible/KRV/jude/1` now surface their expected reviewed chapter-context titles in SSR output, while existing reviewed route spot-checks for `/ko/bible/KRV/isaiah/7`, `/ko/bible/KRV/john/20`, and `/ko/bible/KRV/revelation/21` continue to surface their expected reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remains without known chapter-context output. No raw JSON or `review-required` wording was detected in the sampled SSR outputs. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-108 Chapter Context Coverage Matrix and Batch 8 Scope`.

`CR-BR-CTX-108 Chapter Context Coverage Matrix and Batch 8 Scope` is now complete as a docs-only coverage and scope-definition step. The current chapter-context package remains unchanged at `0.11.0-pilot` / `pilot` with `41` reviewed rows, `0` draft rows, and `41` total rows. Reviewed coverage now includes `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Joshua 6`, `Judges 2`, `1 Samuel 16`, `2 Samuel 7`, `1 Kings 12`, `2 Kings 17, 25`, `Ezra 1`, `Nehemiah 2`, `Esther 4`, `Psalms 137`, `Isaiah 7`, `Jeremiah 36`, `Daniel 1`, `Ezekiel 1`, `Malachi 3`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 6, 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `James 1`, `1 Peter 1`, `Jude 1`, and `Revelation 1, 21`. To keep expanding under-covered canonical sections without returning immediately to heavier `Genesis`, `Matthew`, or `Acts` concentration, Batch 8 is now scoped toward Torah outside `Genesis` / `Exodus`, remaining historical books, minor-prophet coverage, and Pauline epistles where the current event package exposes direct chapter anchors. The selected Batch 8 chapters for the next authoring CR are `Numbers 13` with conservative `relatedBookIds: ["numbers"]` and `relatedEventIds: ["event-kadesh-barnea-spies-skeleton"]`, `Deuteronomy 34` with `relatedBookIds: ["deuteronomy"]` and `relatedEventIds: ["event-moses-death-skeleton"]`, `Ruth 4` with `relatedBookIds: ["ruth"]` and `relatedEventIds: ["event-ruth-and-boaz-skeleton"]`, `1 Kings 18` with `relatedBookIds: ["1-kings"]` and `relatedEventIds: ["event-elijah-at-carmel-skeleton"]`, `Hosea 1` with `relatedBookIds: ["hosea"]` and `relatedEventIds: ["event-jeroboam-ii-and-prophetic-context-skeleton"]`, and `Galatians 1` with `relatedBookIds: ["galatians"]` and `relatedEventIds: ["event-pauline-letters-to-churches-skeleton"]`. These chapters were selected because each has an explicit current event anchor whose Scripture reference begins in the target chapter, none duplicates the current reviewed set, each remains safe for chapter-level preview metadata without selected-verse logic or map/geocoding/entity expansion, and together they broaden canonical distribution across Torah, historical narrative, prophets, and epistles. The following candidate summaries were excluded from Batch 8 scope: `Leviticus 16`, `Job 1`, `Proverbs 1`, `Joel 2`, `Obadiah 1`, `Micah 6`, `Romans 8`, `1 Corinthians 15`, `Galatians 3`, `Ephesians 1`, `Philippians 2`, `Colossians 1`, `Hebrews 1`, `Hebrews 11`, and `2 Peter 1` because the current event package does not expose a direct matching chapter-level event anchor for those chapters; `Numbers 14` because its direct anchor overlaps the same Kadesh-Barnea / wilderness-judgment complex and `Numbers 13` was preferred as the cleaner first chapter entry for that unit; `2 Chronicles 36` because although `event-return-from-exile-skeleton` anchors `2 Chronicles 36:22-23`, the current reviewed set already covers the same exile-to-return transition through `2 Kings 25` and `Ezra 1`; `Amos 5`, `Jonah 3`, and `Zechariah 9` because the current package anchors `Amos 1`, not `Amos 5`, and does not expose direct matching chapter-level event anchors for `Jonah 3` or `Zechariah 9`; and `John 19` because although `event-crucifixion-skeleton` directly anchors `John 19:16-37`, the current reviewed set already has concentrated passion/resurrection coverage through `Matthew 26`, `Matthew 27`, `John 20`, and now also `John 6` for Johannine distribution. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-109 Chapter Context Batch 8 Draft Row Authoring`.

`CR-BR-CTX-109 Chapter Context Batch 8 Draft Row Authoring` is now complete as a narrow docs/data package authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.11.0-pilot"` to `packageVersion: "0.12.0-pilot"` while keeping `status: "pilot"`, existing reviewed rows remain unchanged at `41`, and `6` new Batch 8 draft rows were added for `Numbers 13`, `Deuteronomy 34`, `Ruth 4`, `1 Kings 18`, `Hosea 1`, and `Galatians 1` using only the approved Batch 8 self-book `relatedBookIds` and existing package-backed `relatedEventIds`. All `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `47`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No existing reviewed row was modified, and no Reader/runtime/API/backend/schema change was introduced. The next CR is `CR-BR-CTX-110 Chapter Context Batch 8 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-110 Chapter Context Batch 8 Draft QA and Verifier Acceptance` is now complete as a docs-only QA and verifier-acceptance step. The chapter-context package remains `0.12.0-pilot` / `pilot` with `41` reviewed rows, `6` draft rows, and `47` total rows. All `6` Batch 8 rows still match the approved Batch 8 scope with the expected `bookId`, `chapter`, conservative self-book `relatedBookIds`, approved package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`, while existing reviewed rows remain unchanged. Content sanity review confirmed that the new rows remain chapter-level metadata only, contain no Bible text or copied commentary prose, avoid selected-verse interpretation and exact chronology expansion, and add no map/geocoding/entity dependency. Static code-path review reconfirmed that the current chapter-context normalizer still exposes only `reviewStatus === "reviewed"` rows, and environment-limited localhost SSR checks confirmed that the Batch 8 draft routes return HTTP `200` without exposing their draft chapter-context titles while representative reviewed routes for `2 Kings 17`, `John 6`, and `Revelation 21` continue to surface their reviewed chapter-context titles. Fallback route `Genesis 2` remains without known chapter-context output. No data package, Reader/runtime/API/backend/schema change was introduced. The next CR is `CR-BR-CTX-111 Chapter Context Batch 8 Promotion to Reviewed`.

`CR-BR-CTX-111 Chapter Context Batch 8 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.12.0-pilot"` to `packageVersion: "0.13.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 8 rows `chapter-context-numbers-13`, `chapter-context-deuteronomy-34`, `chapter-context-ruth-4`, `chapter-context-1-kings-18`, `chapter-context-hosea-1`, and `chapter-context-galatians-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `47`, total draft rows are now `0`, and total rows remain `47`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. Environment-limited localhost SSR checks then returned HTTP `200` for all promoted Batch 8 routes and confirmed that `/ko/bible/KRV/numbers/13`, `/ko/bible/KRV/deuteronomy/34`, `/ko/bible/KRV/ruth/4`, `/ko/bible/KRV/1-kings/18`, `/ko/bible/KRV/hosea/1`, and `/ko/bible/KRV/galatians/1` now surface their expected reviewed chapter-context titles in SSR output, while existing reviewed route spot-checks for `/ko/bible/KRV/2-kings/17`, `/ko/bible/KRV/john/6`, and `/ko/bible/KRV/revelation/21` continue to surface their expected reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remains without known chapter-context output. No raw JSON or `review-required` wording was detected in the sampled SSR outputs. Staging/live QA was not performed in this CR and remains reserved for the final completion phase. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-112 Chapter Context Coverage Matrix and Batch 9 Scope`.

`CR-BR-CTX-112 Chapter Context Coverage Matrix and Batch 9 Scope` is now complete as a docs-only scope-definition step. The chapter-context package remains `0.13.0-pilot` / `pilot` with `47` reviewed rows, `0` draft rows, and `47` total rows. Current reviewed coverage now spans `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Numbers 13`, `Deuteronomy 34`, `Joshua 6`, `Judges 2`, `Ruth 4`, `1 Samuel 16`, `2 Samuel 7`, `1 Kings 12, 18`, `2 Kings 17, 25`, `Ezra 1`, `Nehemiah 2`, `Esther 4`, `Psalms 137`, `Isaiah 7`, `Jeremiah 36`, `Daniel 1`, `Ezekiel 1`, `Hosea 1`, `Malachi 3`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 6, 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `Galatians 1`, `James 1`, `1 Peter 1`, `Jude 1`, and `Revelation 1, 21`. To keep expanding under-covered canonical sections without returning to heavier `Genesis`, `Matthew`, or `Acts` concentration, the confirmed Batch 9 authoring scope is `Numbers 14` -> `event-wilderness-journey-skeleton`, `Joshua 24` -> `event-covenant-renewal-shechem-skeleton`, `1 Samuel 3` -> `event-samuel-called-skeleton`, `1 Kings 8` -> `event-solomon-temple-skeleton`, `Amos 1` -> `event-jeroboam-ii-and-prophetic-context-skeleton`, and `1 Corinthians 1` -> `event-pauline-letters-to-churches-skeleton`, with conservative self-book `relatedBookIds` for each row. Excluded candidates include `Leviticus 16`, `Deuteronomy 6`, `Job 1`, `Proverbs 1`, `Ecclesiastes 1`, `Isaiah 53`, `Jeremiah 31`, `Ezekiel 37`, `Joel 2`, `Amos 5`, `Jonah 3`, `Micah 6`, `Zechariah 9`, `Romans 8`, `1 Corinthians 15`, `Galatians 3`, `Ephesians 1`, `Philippians 2`, `Colossians 1`, `Hebrews 1`, `Hebrews 11`, `2 Peter 1`, and `Revelation 22` because the current event package does not expose a direct matching chapter-level anchor for those chapters; `John 19` because current reviewed coverage is already dense in passion/resurrection material through `Matthew 26`, `Matthew 27`, `John 20`, and `Revelation 21`; `2 Chronicles 36` because its direct anchor overlaps the exile-to-return transition already covered through `2 Kings 25` and `Ezra 1`; and `2 Samuel 11` because the current event package does not expose a direct matching chapter-level event row. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-113 Chapter Context Batch 9 Draft Row Authoring`.

`CR-BR-CTX-113 Chapter Context Batch 9 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.13.0-pilot"` to `packageVersion: "0.14.0-pilot"` while keeping `status: "pilot"`, and `6` new Batch 9 draft rows have been added for `Numbers 14`, `Joshua 24`, `1 Samuel 3`, `1 Kings 8`, `Amos 1`, and `1 Corinthians 1` using only the approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `47`, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `53`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-114 Chapter Context Batch 9 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-114 Chapter Context Batch 9 Draft QA and Verifier Acceptance` is now complete as a docs-only QA and verifier-acceptance step. The chapter-context package remains `0.14.0-pilot` / `pilot` with `47` reviewed rows, `6` draft rows, and `53` total rows. All `6` Batch 9 rows still match the approved Batch 9 scope with the expected `bookId`, `chapter`, conservative self-book `relatedBookIds`, approved package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`, while existing reviewed rows remain unchanged. Content sanity review confirmed that the new rows remain chapter-level metadata only, contain no Bible text or copied commentary prose, avoid selected-verse interpretation and exact chronology expansion, and add no map/geocoding/entity dependency. Static code-path review reconfirmed that the current chapter-context normalizer still exposes only `reviewStatus === "reviewed"` rows, and localhost SSR checks confirmed that the Batch 9 draft routes return HTTP `200` without exposing their draft chapter-context titles while representative reviewed routes for `Numbers 13`, `1 Kings 18`, and `Galatians 1` continue to surface their reviewed chapter-context titles. Fallback route `Genesis 2` remains without known chapter-context output. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-115 Chapter Context Batch 9 Promotion to Reviewed`.

`CR-BR-CTX-115 Chapter Context Batch 9 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.14.0-pilot"` to `packageVersion: "0.15.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 9 rows `chapter-context-numbers-14`, `chapter-context-joshua-24`, `chapter-context-1-samuel-3`, `chapter-context-1-kings-8`, `chapter-context-amos-1`, and `chapter-context-1-corinthians-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `53`, total draft rows are now `0`, and total rows remain `53`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. Localhost SSR checks then returned HTTP `200` for all promoted Batch 9 routes and confirmed that `/ko/bible/KRV/numbers/14`, `/ko/bible/KRV/joshua/24`, `/ko/bible/KRV/1-samuel/3`, `/ko/bible/KRV/1-kings/8`, `/ko/bible/KRV/amos/1`, and `/ko/bible/KRV/1-corinthians/1` now surface their expected reviewed chapter-context titles in SSR output, while existing reviewed route spot-checks for `/ko/bible/KRV/numbers/13`, `/ko/bible/KRV/1-kings/18`, and `/ko/bible/KRV/galatians/1` continue to surface their expected reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remains without known chapter-context output. No `review-required` wording was detected in the sampled SSR outputs. Staging/live QA was not performed in this CR and remains reserved for the final completion phase. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-116 Chapter Context Coverage Matrix and Batch 10 Scope`.

`CR-BR-CTX-116 Chapter Context Reviewed Label Cleanup` is now complete as a narrow docs/data wording-cleanup step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.15.0-pilot"` to `packageVersion: "0.15.1-pilot"` while keeping `status: "pilot"`, `53` reviewed rows, `0` draft rows, and `53` total rows unchanged. This cleanup removed visible draft-state wording from reviewed chapter-context metadata labels only, including the repeated reviewed-row `confidenceLabel` and `sourceBasisLabel` strings that still exposed `draft` after earlier promotion steps, plus the stale package note that still mentioned draft expansion rows. No `reviewStatus` values changed, no ids changed, no anchors changed, no related ids changed, no row order changed, and no `isSkeleton` values changed. Localhost SSR checks returned HTTP `200` for representative reviewed routes `/ko/bible/KRV/numbers/14`, `/ko/bible/KRV/joshua/24`, `/ko/bible/KRV/1-samuel/3`, `/ko/bible/KRV/1-kings/8`, `/ko/bible/KRV/amos/1`, `/ko/bible/KRV/1-corinthians/1`, `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/john/20`, and `/ko/bible/KRV/revelation/21`, and those sampled outputs no longer exposed the prior `draft` labels or any `review-required` wording while still surfacing the expected reviewed chapter-context titles; fallback route `/ko/bible/KRV/genesis/2` remained without known chapter-context output. Reader/runtime/API/backend/schema remained unchanged. Staging/live QA was not performed in this CR and remains reserved for the final completion phase. The next CR is `CR-BR-CTX-117 Chapter Context Coverage Matrix and Batch 10 Scope`.

`CR-BR-CTX-117 Chapter Context Coverage Matrix and Batch 10 Scope` is now complete as a docs-only scope-definition step. The chapter-context package remains `0.15.1-pilot` / `pilot` with `53` reviewed rows, `0` draft rows, and `53` total rows. Current reviewed coverage now spans `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12`, `Numbers 13, 14`, `Deuteronomy 34`, `Joshua 6, 24`, `Judges 2`, `Ruth 4`, `1 Samuel 3, 16`, `2 Samuel 7`, `1 Kings 8, 12, 18`, `2 Kings 17, 25`, `Ezra 1`, `Nehemiah 2`, `Esther 4`, `Psalms 137`, `Isaiah 7`, `Jeremiah 36`, `Daniel 1`, `Ezekiel 1`, `Hosea 1`, `Amos 1`, `Malachi 3`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 6, 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `1 Corinthians 1`, `Galatians 1`, `James 1`, `1 Peter 1`, `Jude 1`, and `Revelation 1, 21`. To keep expanding under-covered canonical sections with direct chapter-level anchors, the confirmed Batch 10 authoring scope is `Exodus 14` -> `event-passover-skeleton`, `Joshua 3` -> `event-entry-into-land-skeleton`, `Lamentations 1` -> `event-exile-lament-zion-skeleton`, `Haggai 1` -> `event-temple-rebuilding-resumes-skeleton`, `Zechariah 1` -> `event-temple-rebuilding-resumes-skeleton`, and `Malachi 1` -> `event-malachi-post-exile-rebuke-skeleton`, with conservative self-book `relatedBookIds` for each row. Excluded candidates include `Leviticus 16`, `Deuteronomy 6`, `Job 1`, `Psalms 2`, `Psalms 22`, `Proverbs 1`, `Ecclesiastes 1`, `Isaiah 53`, `Jeremiah 31`, `Ezekiel 37`, `Joel 2`, `Jonah 3`, `Micah 6`, `Romans 8`, `1 Corinthians 15`, `2 Corinthians 5`, `Ephesians 1`, `Philippians 2`, `Colossians 1`, `Hebrews 1`, `Hebrews 11`, `2 Peter 1`, and `Revelation 22` because the current event package does not expose a direct matching chapter-level anchor for those chapters; `John 11` because the current event package does not expose a direct chapter-level event anchor for that chapter; `John 19` because current reviewed coverage is already dense in passion/resurrection material through `Matthew 26`, `Matthew 27`, `John 20`, and `Revelation 21`; `Joshua 24` because it is already reviewed; `Judges 4`, `Ezra 5`, `Ezra 6`, `Ezra 7`, `Nehemiah 6`, `Isaiah 1`, and `Isaiah 36-37` because they have usable anchors but were held behind stronger Batch 10 balance priorities after Torah, Poetry/Lament, and Minor Prophets were weighed together; and `2 Chronicles 36` because its direct anchor still overlaps the exile-to-return transition already covered through `2 Kings 25`, `Ezra 1`, and now `Lamentations 1`. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-118 Chapter Context Batch 10 Draft Row Authoring`.

`CR-BR-CTX-118 Chapter Context Batch 10 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.15.1-pilot"` to `packageVersion: "0.16.0-pilot"` while keeping `status: "pilot"`, and `6` new Batch 10 draft rows have been added for `Exodus 14`, `Joshua 3`, `Lamentations 1`, `Haggai 1`, `Zechariah 1`, and `Malachi 1` using only the approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `53`, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `59`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-119 Chapter Context Batch 10 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-119 Chapter Context Batch 10 Draft QA and Verifier Acceptance` is now complete as a docs-only QA and verifier-acceptance step. The chapter-context package remains `0.16.0-pilot` / `pilot` with `53` reviewed rows, `6` draft rows, and `59` total rows. All `6` Batch 10 rows still match the approved Batch 10 scope with the expected `bookId`, `chapter`, conservative self-book `relatedBookIds`, approved package-backed `relatedEventIds`, `reviewStatus: "draft"`, and `isSkeleton: false`, while existing reviewed rows remain unchanged. Content sanity review confirmed that the new rows remain chapter-level metadata only, contain no Bible text or copied commentary prose, avoid selected-verse interpretation and exact chronology expansion, and add no map/geocoding/entity dependency. Static code-path review reconfirmed that the current chapter-context normalizer still exposes only `reviewStatus === "reviewed"` rows, and localhost SSR checks confirmed that the Batch 10 draft routes return HTTP `200` without exposing their draft chapter-context titles while representative reviewed routes for `Numbers 14`, `Joshua 24`, and `1 Corinthians 1` continue to surface their reviewed chapter-context titles. Fallback route `Genesis 2` remains without known chapter-context output. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-120 Chapter Context Batch 10 Promotion to Reviewed`.

`CR-BR-CTX-120 Chapter Context Batch 10 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.16.0-pilot"` to `packageVersion: "0.17.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 10 rows `chapter-context-exodus-14`, `chapter-context-joshua-3`, `chapter-context-lamentations-1`, `chapter-context-haggai-1`, `chapter-context-zechariah-1`, and `chapter-context-malachi-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `59`, total draft rows are now `0`, and total rows remain `59`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. Localhost SSR checks then returned HTTP `200` for all promoted Batch 10 routes and confirmed that `/ko/bible/KRV/exodus/14`, `/ko/bible/KRV/joshua/3`, `/ko/bible/KRV/lamentations/1`, `/ko/bible/KRV/haggai/1`, `/ko/bible/KRV/zechariah/1`, and `/ko/bible/KRV/malachi/1` now surface their expected reviewed chapter-context titles in raw SSR output, while visible-text checks showed no `draft`, no `review-required`, and no raw JSON exposure. Existing reviewed route spot-checks for `/ko/bible/KRV/numbers/14`, `/ko/bible/KRV/joshua/24`, and `/ko/bible/KRV/1-corinthians/1` continue to surface their expected reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remains without known chapter-context output. Staging/live QA was not performed in this CR and remains reserved for the final completion phase. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-121 Chapter Context Coverage Matrix and Batch 11 Scope`.

`CR-BR-CTX-121 Chapter Context Coverage Matrix and Batch 11 Scope` is now complete as a docs-only scope-definition step. The chapter-context package remains `0.17.0-pilot` / `pilot` with `59` reviewed rows, `0` draft rows, and `59` total rows. Current reviewed coverage now spans `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12, 14`, `Numbers 13, 14`, `Deuteronomy 34`, `Joshua 3, 6, 24`, `Judges 2`, `Ruth 4`, `1 Samuel 3, 16`, `2 Samuel 7`, `1 Kings 8, 12, 18`, `2 Kings 17, 25`, `Ezra 1`, `Nehemiah 2`, `Esther 4`, `Psalms 137`, `Isaiah 7`, `Jeremiah 36`, `Lamentations 1`, `Daniel 1`, `Ezekiel 1`, `Hosea 1`, `Amos 1`, `Haggai 1`, `Zechariah 1`, `Malachi 1, 3`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 6, 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `1 Corinthians 1`, `Galatians 1`, `James 1`, `1 Peter 1`, `Jude 1`, and `Revelation 1, 21`. To keep expanding remaining historical-book and prophet coverage with direct chapter-level anchors, the confirmed Batch 11 authoring scope is `Judges 4` -> `event-deborah-and-barak-skeleton`, `Ezra 5` -> `event-temple-rebuilding-resumes-skeleton`, `Ezra 6` -> `event-second-temple-restoration-skeleton`, `Ezra 7` -> `event-ezra-arrives-skeleton`, `Nehemiah 6` -> `event-nehemiah-wall-rebuilding-skeleton`, and `Isaiah 1` -> `event-uzziah-and-isaiah-context-skeleton`, with conservative self-book `relatedBookIds` for each row. Excluded candidates include `Leviticus 16`, `Deuteronomy 6`, `Job 1`, `Psalms 2`, `Psalms 22`, `Proverbs 1`, `Ecclesiastes 1`, `Isaiah 53`, `Jeremiah 31`, `Ezekiel 37`, `Joel 2`, `Jonah 3`, `Micah 6`, `Zechariah 9`, `John 11`, `Romans 8`, `1 Corinthians 15`, `2 Corinthians 5`, `Ephesians 1`, `Philippians 2`, `Colossians 1`, `Hebrews 1`, `Hebrews 11`, `2 Peter 1`, and `Revelation 22` because the current event package does not expose a direct matching chapter-level anchor for those chapters; `John 19` because direct anchor coverage exists but current reviewed coverage is already dense in passion/resurrection material through `Matthew 26`, `Matthew 27`, `John 20`, and `Revelation 21`; `Isaiah 36-37` because the shared `event-hezekiah-and-assyria-skeleton` anchor remains usable but was deferred behind a cleaner single-chapter prophetic entry in `Isaiah 1`; and `2 Chronicles 36` because its direct anchor still overlaps the exile-to-return transition already covered through `2 Kings 25`, `Ezra 1`, `Lamentations 1`, and the newly selected Ezra / Nehemiah return-stage chapters. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-122 Chapter Context Batch 11 Draft Row Authoring`.

`CR-BR-CTX-122 Chapter Context Batch 11 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.17.0-pilot"` to `packageVersion: "0.18.0-pilot"` while keeping `status: "pilot"`, and `6` new Batch 11 draft rows have been added for `Judges 4`, `Ezra 5`, `Ezra 6`, `Ezra 7`, `Nehemiah 6`, and `Isaiah 1` using only the approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `59`, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `65`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-123 Chapter Context Batch 11 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-123 Chapter Context Batch 11 Draft QA and Verifier Acceptance` is now complete as a docs-only QA acceptance step. The chapter-context package remains `0.18.0-pilot` / `pilot` with `59` reviewed rows, `6` draft rows, and `65` total rows. The Batch 11 draft rows `chapter-context-judges-4`, `chapter-context-ezra-5`, `chapter-context-ezra-6`, `chapter-context-ezra-7`, `chapter-context-nehemiah-6`, and `chapter-context-isaiah-1` were rechecked in-package and each still carries `reviewStatus: "draft"`, `isSkeleton: false`, the approved self-book `relatedBookIds`, and the approved package-backed `relatedEventIds`. Short content sanity review confirmed chapter-level metadata wording only, with no Bible text, no copied commentary prose, no selected-verse interpretation, no exact chronology expansion, and no map/geocoding/entity dependency. Static loader inspection confirms draft rows remain hidden because only `reviewStatus: "reviewed"` rows are surfaced to the Reader package. Local localhost SSR checks returned HTTP `200` for the Batch 11 draft routes `/ko/bible/KRV/judges/4`, `/ko/bible/KRV/ezra/5`, `/ko/bible/KRV/ezra/6`, `/ko/bible/KRV/ezra/7`, `/ko/bible/KRV/nehemiah/6`, and `/ko/bible/KRV/isaiah/1` without exposing the new draft titles in raw SSR HTML, while reviewed spot-check routes `/ko/bible/KRV/exodus/14`, `/ko/bible/KRV/joshua/3`, and `/ko/bible/KRV/malachi/1` still surfaced their reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remained without known chapter-context output. No data package rows were modified, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-124 Chapter Context Batch 11 Promotion to Reviewed`.

`CR-BR-CTX-124 Chapter Context Batch 11 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.18.0-pilot"` to `packageVersion: "0.19.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 11 rows `chapter-context-judges-4`, `chapter-context-ezra-5`, `chapter-context-ezra-6`, `chapter-context-ezra-7`, `chapter-context-nehemiah-6`, and `chapter-context-isaiah-1` have each been promoted from `reviewStatus: "draft"` to `reviewStatus: "reviewed"` with `isSkeleton: false` unchanged. Existing reviewed rows remain unchanged, total reviewed chapter-context rows are now `65`, total draft rows are now `0`, and total rows remain `65`. No title, summary, chapter-scope label, anchor, basis/confidence/caution/source-basis wording, related id, related theme, or other content field was changed in this promotion step. Localhost SSR checks then returned HTTP `200` for all promoted Batch 11 routes and confirmed that `/ko/bible/KRV/judges/4`, `/ko/bible/KRV/ezra/5`, `/ko/bible/KRV/ezra/6`, `/ko/bible/KRV/ezra/7`, `/ko/bible/KRV/nehemiah/6`, and `/ko/bible/KRV/isaiah/1` now surface their expected reviewed chapter-context titles in raw SSR output, while visible-text checks showed no `draft`, no `review-required`, and no raw JSON exposure. Existing reviewed route spot-checks for `/ko/bible/KRV/exodus/14`, `/ko/bible/KRV/joshua/3`, and `/ko/bible/KRV/malachi/1` continue to surface their expected reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remains without known chapter-context output. Staging/live QA was not performed in this CR and remains reserved for the final completion phase. The current Reader/runtime/API/backend/schema remains unchanged. The next CR is `CR-BR-CTX-125 Chapter Context Coverage Matrix and Batch 12 Scope`.

`CR-BR-CTX-125 Chapter Context Coverage Matrix and Batch 12 Scope` is now complete as a docs-only scope-definition step. The chapter-context package remains `0.19.0-pilot` / `pilot` with `65` reviewed rows, `0` draft rows, and `65` total rows. Current reviewed coverage now spans `Genesis 1, 3, 37, 41, 46`, `Exodus 3, 12, 14`, `Numbers 13, 14`, `Deuteronomy 34`, `Joshua 3, 6, 24`, `Judges 2, 4`, `Ruth 4`, `1 Samuel 3, 16`, `2 Samuel 7`, `1 Kings 8, 12, 18`, `2 Kings 17, 25`, `Ezra 1, 5, 6, 7`, `Nehemiah 2, 6`, `Esther 4`, `Psalms 137`, `Isaiah 1, 7`, `Jeremiah 36`, `Lamentations 1`, `Daniel 1`, `Ezekiel 1`, `Hosea 1`, `Amos 1`, `Haggai 1`, `Zechariah 1`, `Malachi 1, 3`, `Matthew 5, 13, 14, 26, 27`, `Luke 2`, `John 6, 20`, `Acts 2, 9, 10, 15`, `Romans 1`, `1 Corinthians 1`, `Galatians 1`, `James 1`, `1 Peter 1`, `Jude 1`, and `Revelation 1, 21`. After rescanning the full `events.core-biblical-skeleton.json` package for remaining direct chapter anchors not already reviewed, the confirmed Batch 12 authoring scope is `Exodus 19` -> `event-sinai-covenant-skeleton`, `Judges 6` -> `event-gideon-skeleton`, `1 Kings 6` -> `event-solomon-temple-skeleton`, `2 Kings 14` -> `event-jeroboam-ii-and-prophetic-context-skeleton`, `2 Chronicles 26` -> `event-uzziah-and-isaiah-context-skeleton`, and `Isaiah 36` -> `event-hezekiah-and-assyria-skeleton`, each with conservative self-book `relatedBookIds`. Excluded candidates include `Isaiah 37` because the same direct anchor remains usable but was deferred to avoid doubling the same event/book cluster in one batch; `John 19` because direct anchor coverage exists but passion/resurrection coverage is already dense; `2 Chronicles 36` because the exile/return transition is already heavily represented by `2 Kings 25`, `Ezra 1`, `Lamentations 1`, and the Ezra/Nehemiah reviewed set; `2 Kings 9`, `2 Kings 10`, `2 Kings 18`, `2 Kings 19`, `2 Kings 22`, and `2 Kings 23` because they remain usable but were deprioritized behind a more balanced cross-book selection; and remaining Genesis, Matthew, and Acts direct anchors because those books are already comparatively dense in reviewed chapter-context coverage. The remaining safe direct-anchor pool is becoming more limited and increasingly clustered in already-covered books, overlapping event spans, or dense thematic zones, so future coverage-expansion batches may need to be smaller or accept more overlap. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-126 Chapter Context Batch 12 Draft Row Authoring`.

`CR-BR-CTX-126 Chapter Context Batch 12 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.19.0-pilot"` to `packageVersion: "0.20.0-pilot"` while keeping `status: "pilot"`, and `6` new Batch 12 draft rows have been added for `Exodus 19`, `Judges 6`, `1 Kings 6`, `2 Kings 14`, `2 Chronicles 26`, and `Isaiah 36` using only the approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `65`, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `71`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-127 Chapter Context Batch 12 Draft QA and Verifier Acceptance`.

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

`CR-BR-CTX-127 Chapter Context Batch 12 Draft QA and Verifier Acceptance` is now complete as a docs-only QA acceptance step. The chapter-context package remains `0.20.0-pilot` / `pilot` with `65` reviewed rows, `6` draft rows, and `71` total rows. The Batch 12 draft rows `chapter-context-exodus-19`, `chapter-context-judges-6`, `chapter-context-1-kings-6`, `chapter-context-2-kings-14`, `chapter-context-2-chronicles-26`, and `chapter-context-isaiah-36` were rechecked in-package and each still carries `reviewStatus: "draft"`, `isSkeleton: false`, the approved self-book `relatedBookIds`, and the approved package-backed `relatedEventIds`. Short content sanity review confirmed chapter-level metadata wording only, with no Bible text, no copied commentary prose, no selected-verse interpretation, no exact chronology expansion, and no map/geocoding/entity dependency. Static loader inspection confirms draft rows remain hidden because only `reviewStatus: "reviewed"` rows are surfaced to the Reader package. Local localhost SSR checks returned HTTP `200` for the Batch 12 draft routes `/ko/bible/KRV/exodus/19`, `/ko/bible/KRV/judges/6`, `/ko/bible/KRV/1-kings/6`, `/ko/bible/KRV/2-kings/14`, `/ko/bible/KRV/2-chronicles/26`, and `/ko/bible/KRV/isaiah/36` without exposing the new draft titles in raw SSR HTML, while reviewed spot-check routes `/ko/bible/KRV/judges/4`, `/ko/bible/KRV/ezra/6`, and `/ko/bible/KRV/isaiah/1` still surfaced their reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remained without known chapter-context output. No data package rows were modified, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-128 Chapter Context Batch 12 Promotion to Reviewed`.

`CR-BR-CTX-128 Chapter Context Batch 12 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.20.0-pilot"` to `packageVersion: "0.21.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 12 rows `chapter-context-exodus-19`, `chapter-context-judges-6`, `chapter-context-1-kings-6`, `chapter-context-2-kings-14`, `chapter-context-2-chronicles-26`, and `chapter-context-isaiah-36` were promoted from `draft` to `reviewed` with `isSkeleton: false` unchanged. Total reviewed rows are now `71`, total draft rows are now `0`, and total rows remain `71`. No title/summary/scope/anchor/related-id/content wording changes were made. Localhost SSR checks returned HTTP `200` for the promoted Batch 12 routes and confirmed that they now surface their expected reviewed chapter-context titles in raw SSR HTML, while visible-text checks showed no `draft`, no `review-required`, and no raw JSON exposure. Existing reviewed route spot-checks for `Judges 4`, `Ezra 6`, and `Isaiah 1` remained visible, and fallback route `Genesis 2` remained without known chapter-context output. No staging/live QA was performed in this CR; that remains reserved for the final completion phase. No data package content fields were changed beyond `packageVersion` and the six `reviewStatus` values, and no Reader/runtime/API/backend/schema change was introduced. The next CR is `CR-BR-CTX-129 Chapter Context Coverage Matrix and Batch 13 Scope`.

`CR-BR-CTX-129 Chapter Context Coverage Matrix and Batch 13 Scope` is now complete as a docs-only scope-definition step. The chapter-context package remains `0.21.0-pilot` / `pilot` with `71` reviewed rows, `0` draft rows, and `71` total rows. A direct scan of the current chapter-context package and `events.core-biblical-skeleton.json` found no remaining unused anchors with `scope: "chapter"`, so the remaining candidate pool is now limited to single-chapter `scope: "passage"` anchors that still stay inside one chapter. From that smaller pool, the confirmed Batch 13 authoring scope is `Genesis 11` -> `event-babel-skeleton`, `Exodus 40` -> `event-tabernacle-skeleton`, `1 Samuel 10` -> `event-monarchy-begins-skeleton`, `2 Kings 9` -> `event-jehu-dynastic-transition-skeleton`, `Jeremiah 39` -> `event-southern-kingdom-exile-skeleton`, and `Luke 3` -> `event-john-the-baptist-ministry-skeleton`, each with conservative self-book `relatedBookIds`. Excluded candidates include `Isaiah 37` because it reuses the same `event-hezekiah-and-assyria-skeleton` cluster already represented by reviewed `Isaiah 36`; `John 19` because it is a direct single-chapter anchor but passion/resurrection coverage is already dense; `2 Chronicles 36` because it is only the final decree verses of a chapter already overlapped by strong exile/return coverage; `2 Kings 10` because it is the same Jehu transition cluster as `2 Kings 9`; `2 Kings 18-19` and `2 Kings 22-23` because the current anchors span multiple chapters rather than a single direct chapter target; and remaining Genesis, Matthew, and Acts single-chapter anchors because those books are already comparatively dense in reviewed coverage and would add less canonical balance than the selected set. The remaining safe direct-anchor pool is materially more limited than earlier batches and is increasingly concentrated in already-covered books, overlap-heavy event spans, or narrow partial-chapter passages, so later expansion batches may need to be smaller or shift to a coverage-completion review. No data package, Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-130 Chapter Context Batch 13 Draft Row Authoring`.

`CR-BR-CTX-130 Chapter Context Batch 13 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.21.0-pilot"` to `packageVersion: "0.22.0-pilot"` while keeping `status: "pilot"`, and `6` new Batch 13 draft rows have been added for `Genesis 11`, `Exodus 40`, `1 Samuel 10`, `2 Kings 9`, `Jeremiah 39`, and `Luke 3` using only the approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `71`, all `6` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `6`, and total rows are now `77`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-131 Chapter Context Batch 13 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-131 Chapter Context Batch 13 Draft QA and Verifier Acceptance` is now complete as a docs-only QA acceptance step. The chapter-context package remains `0.22.0-pilot` / `pilot` with `71` reviewed rows, `6` draft rows, and `77` total rows. The Batch 13 draft rows `chapter-context-genesis-11`, `chapter-context-exodus-40`, `chapter-context-1-samuel-10`, `chapter-context-2-kings-9`, `chapter-context-jeremiah-39`, and `chapter-context-luke-3` were rechecked in-package and each still carries `reviewStatus: "draft"`, `isSkeleton: false`, the approved self-book `relatedBookIds`, and the approved package-backed `relatedEventIds`. Short content sanity review confirmed chapter-level metadata wording only, with no Bible text, no copied commentary prose, no selected-verse interpretation, no exact chronology expansion, and no map/geocoding/entity dependency. Static loader inspection confirms draft rows remain hidden because only `reviewStatus: "reviewed"` rows are surfaced to the Reader package. Local localhost SSR checks returned HTTP `200` for the Batch 13 draft routes `/ko/bible/KRV/genesis/11`, `/ko/bible/KRV/exodus/40`, `/ko/bible/KRV/1-samuel/10`, `/ko/bible/KRV/2-kings/9`, `/ko/bible/KRV/jeremiah/39`, and `/ko/bible/KRV/luke/3` without exposing the new draft titles in raw SSR HTML, while reviewed spot-check routes `/ko/bible/KRV/exodus/19`, `/ko/bible/KRV/isaiah/36`, and `/ko/bible/KRV/john/20` still surfaced their reviewed chapter-context titles and fallback route `/ko/bible/KRV/genesis/2` remained without known chapter-context output. No data package rows were modified, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-132 Chapter Context Batch 13 Promotion to Reviewed`.

`CR-BR-CTX-132 Chapter Context Batch 13 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.22.0-pilot"` to `packageVersion: "0.23.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 13 rows `chapter-context-genesis-11`, `chapter-context-exodus-40`, `chapter-context-1-samuel-10`, `chapter-context-2-kings-9`, `chapter-context-jeremiah-39`, and `chapter-context-luke-3` were promoted from `draft` to `reviewed` with `isSkeleton: false` unchanged. Total reviewed rows are now `77`, total draft rows are now `0`, and total rows remain `77`. No title/summary/scope/anchor/related-id/content wording changes were made. Localhost SSR checks returned HTTP `200` for the promoted Batch 13 routes and confirmed that they now surface their expected reviewed chapter-context titles in SSR output, while checks showed no `draft` wording and no `review-required` wording in the reviewed route output. Existing reviewed route spot-checks for `Exodus 19`, `Isaiah 36`, and `John 20` remained visible, and fallback route `Genesis 2` remained without known chapter-context output. No staging/live QA was performed in this CR; that remains reserved for the final completion phase. No data package content fields were changed beyond `packageVersion` and the six `reviewStatus` values, and no Reader/runtime/API/backend/schema change was introduced. The next CR is `CR-BR-CTX-133 Chapter Context Coverage Completion Review`.

`CR-BR-CTX-133 Chapter Context Coverage Completion Review` is now complete as a docs-only coverage and recommendation step. The chapter-context package remains `0.23.0-pilot` / `pilot` with `77` reviewed rows, `0` draft rows, and `77` total rows. Direct reviewed coverage derived from `chapter-context.skeleton.json` now stands at `Torah: 14`, `Former Prophets / Historical books: 27`, `Writings / Wisdom / Poetry: 1`, `Major Prophets: 8`, `Minor Prophets: 6`, `Gospels: 9`, `Acts: 4`, `Pauline Epistles: 3`, `General Epistles: 3`, and `Revelation: 2`, spanning `37` distinct biblical books. A full scan of `events.core-biblical-skeleton.json` confirms that no unused `scope: "chapter"` anchors remain; the remaining pool is entirely single-chapter `scope: "passage"` anchors. The strongest remaining low-to-moderate-risk candidates are now narrow and clustered: `Exodus 1`, `Exodus 2`, `Exodus 24`, `Esther 9`, and possibly `Deuteronomy 29`, with `2 Kings 10` and `2 Chronicles 36` still technically usable but already overlap-heavy with reviewed Jehu-transition and exile/return material. The rest of the unused single-chapter anchor pool is dominated by overlap-heavy passages in already dense books or themes, especially additional `Genesis`, `Matthew`, `Acts`, and `John 19`, plus thin or partial-chapter anchors that add less chapter-level preview value. Because the remaining safe pool is now materially thinner, increasingly passage-scoped, and less balanced than earlier batches, the recommendation is to transition from continued pilot batching into pilot completion/handoff rather than force a Batch 14 expansion. No data package rows were modified, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-134 Chapter Context Pilot Completion and Handoff`.

`CR-BR-CTX-134 Chapter Context Pilot Completion and Handoff` is now complete as a docs-only pilot closeout step. The chapter-context package remains `0.23.0-pilot` / `pilot` with `77` reviewed rows, `0` draft rows, and `77` total rows, and no data package edits were required. Reader loader behavior remains unchanged: `timelineChapterContextPackage.ts` still surfaces reviewed rows only, so no runtime, API, backend, schema, or adapter change was introduced in this CR. The pilot expansion phase is now closed at the current reviewed set because no unused `scope: "chapter"` anchors remain in `events.core-biblical-skeleton.json`, and the remaining direct-anchor pool is now mostly single-chapter `scope: "passage"` material that is increasingly thin, overlap-heavy, and concentrated in already dense books or event clusters. Batch 14 is therefore not recommended by default. Remaining technically usable direct anchors such as `Exodus 1`, `Exodus 2`, `Exodus 24`, `Esther 9`, `Deuteronomy 29`, `2 Kings 10`, `2 Chronicles 36`, `John 19`, and additional `Genesis` / `Matthew` / `Acts` passage anchors were left unbatched because they add less canonical balance or carry heavier overlap than the completed pilot set. No staging/live QA was performed in this CR because that remains reserved for the final completion phase. The recommended next CR is `CR-BR-CTX-135 Chapter Context Pilot Local Final Acceptance and Sync Readiness`.

`CR-BR-CTX-135 Chapter Context Pilot Local Final Acceptance and Sync Readiness` is now complete as a docs-only local acceptance step. The chapter-context package remains `0.23.0-pilot` / `pilot` with `77` reviewed rows, `0` draft rows, and `77` total rows, and package verification confirmed that no `draft` rows or `review-required` rows remain in `chapter-context.skeleton.json`. Reader eligibility rules remain unchanged: `timelineChapterContextPackage.ts` still normalizes only `reviewStatus: "reviewed"` rows, and `BibleReaderContextPanel.tsx` continues to render chapter-context preview metadata only when a reviewed preview row is supplied by the reader pipeline. Local runtime checks confirmed a dev server listening on port `3030`, HTTP `200` from `127.0.0.1:3030`, and HTTP `200` from `wordcovenantministry.local:3030` under escalated local checks. Representative localhost route acceptance across Torah, Historical books, Prophets, Gospels / Acts, Epistles, and Revelation returned HTTP `200` for the sampled reviewed routes `/ko/bible/KRV/genesis/1`, `/ko/bible/KRV/exodus/19`, `/ko/bible/KRV/numbers/14`, `/ko/bible/KRV/deuteronomy/34`, `/ko/bible/KRV/joshua/24`, `/ko/bible/KRV/judges/4`, `/ko/bible/KRV/1-samuel/10`, `/ko/bible/KRV/2-kings/25`, `/ko/bible/KRV/ezra/6`, `/ko/bible/KRV/nehemiah/6`, `/ko/bible/KRV/isaiah/36`, `/ko/bible/KRV/jeremiah/39`, `/ko/bible/KRV/ezekiel/1`, `/ko/bible/KRV/malachi/3`, `/ko/bible/KRV/matthew/13`, `/ko/bible/KRV/luke/3`, `/ko/bible/KRV/john/20`, `/ko/bible/KRV/acts/15`, `/ko/bible/KRV/romans/1`, `/ko/bible/KRV/galatians/1`, `/ko/bible/KRV/1-corinthians/1`, `/ko/bible/KRV/james/1`, and `/ko/bible/KRV/revelation/21`; the reviewed chapter-context titles remained present in the local SSR response payloads and visible-text checks showed no `draft` wording or visible `review-required` wording. Fallback route `/ko/bible/KRV/genesis/2` also returned HTTP `200` and remained without known chapter-context output. Local sync-readiness bookkeeping confirmed that the branch is `38` commits ahead of `origin/main`, with changed-file scope against `origin/main` limited to `docs/ROADMAP/PROJECT_STATUS.md`, `docs/ROADMAP/NEXT_TASKS.md`, and `docs/data-packages/timeline/chapter-context.skeleton.json`. No push was performed, no data package edit was required for this CR, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The recommended next CR is `CR-BR-CTX-136 Local Sync Decision and Push Readiness`.

`CR-BR-CTX-136 Local Sync Decision and Push Readiness` is now complete as a docs-only sync-readiness review step. Local `main` remains clean and is now `39` commits ahead of `origin/main`. The changed-file scope against `origin/main` still resolves to only `docs/ROADMAP/PROJECT_STATUS.md`, `docs/ROADMAP/NEXT_TASKS.md`, and `docs/data-packages/timeline/chapter-context.skeleton.json`, so no Reader/runtime/API/backend/schema files are changed versus remote. The chapter-context package remains `0.23.0-pilot` / `pilot` with `77` reviewed rows, `0` draft rows, and `77` total rows, and package validation continues to pass. A read-only deployment-trigger scan found no `vercel.json`, `netlify.toml`, `firebase.json`, `wrangler.toml`, or `.github` workflow files in the repository, while deployment and staging process documents do exist under `docs/ROADMAP/`, `docs/WORKFLOWS/`, and `docs/DECISIONS/0016-deployment-version-control-strategy.md`. Based on repository contents alone, `git push origin main` is code-safe from a scope perspective because the diff is limited to roadmap documentation and the reviewed chapter-context data package, but deployment-trigger likelihood remains `unknown` rather than `no` because the repository documents external deployment workflows even though no in-repo automation file was detected in this scan. The push recommendation is `safe to push` when user-approved, with no need for a backup branch first under the current diff scope. No push was performed in this CR, and no staging/live QA was performed because that remains reserved for the final completion phase. If push is approved later, the next CR is `CR-BR-CTX-137 Remote Sync Confirmation`; otherwise the next CR is `CR-BR-CTX-137 Next Local Work Planning`.

`CR-BR-CTX-137 Remote Sync Confirmation` is now complete as a docs-only remote-sync confirmation step. Local `main` and `origin/main` now resolve to the same HEAD `8e404296bae58c48d84c60588f351bc00db749d3`, ahead/behind is `0 0`, and the working tree is clean. This confirms that the chapter-context pilot branch state reviewed in `CR-BR-CTX-136` has now been remotely synchronized without force push and without any live deployment step. The chapter-context package remains unchanged at `0.23.0-pilot` / `pilot` with `77` total rows, `77` reviewed rows, and `0` draft rows. No chapter-context package rows were added, promoted, or edited in this CR, and no frontend, backend, API, DB, schema, verifier, Auth, Password Reset, Personal Notes, or Header files were changed. Remote sync is therefore complete for the current chapter-context pilot state. The next candidate CR is `CR-BR-CTX-138 Chapter Context Post-Sync Scope Decision`, a docs-only decision step to reassess whether any remaining direct single-chapter passage anchors justify another narrowly scoped batch after the now-synced `77`-row reviewed pilot, while explicitly guarding against overlap-heavy overconcentration in already dense books such as `Genesis`, `Matthew`, and `Acts`.

`CR-BR-CTX-138 Chapter Context Post-Sync Scope Decision` is now complete as a minimal post-sync decision step. A fresh direct scan of the current `0.23.0-pilot` package against `events.core-biblical-skeleton.json` confirms that the remaining direct single-chapter passage pool still exists, but it is narrower and more overlap-sensitive than earlier batches. Current reviewed coverage remains `77` rows with `0` draft rows at the start of this decision, distributed as `Torah: 14`, `Historical Books: 27`, `Wisdom / Poetry: 1`, `Major Prophets: 8`, `Minor Prophets: 6`, `Gospels / Acts: 13`, `Pauline Epistles: 3`, `General Epistles: 3`, and `Revelation: 2`. The densest books remain `Genesis=6`, `Exodus=5`, `Matthew=5`, `1 Kings=4`, `2 Kings=4`, `Acts=4`, and `Ezra=4`, so additional `Genesis`, `Matthew`, and `Acts` expansion is no longer the safest default. The approved narrow next batch is `Exodus 1` -> `event-israel-enslaved-in-egypt-skeleton`, `Exodus 2` -> `event-moses-born-skeleton`, `Exodus 24` -> `event-sinai-covenant-skeleton`, and `Esther 9` -> `event-esther-deliverance-skeleton`, each with conservative self-book `relatedBookIds`. `Deuteronomy 29` is deferred because the current anchor is only `Deuteronomy 29:5`, which is too thin for a strong chapter-level preview row. `2 Kings 10` and `2 Chronicles 36` remain deferred because they reuse already represented event clusters, and the remaining `Genesis`, `Matthew`, `Acts`, `John 19`, `Luke 22`, and `Luke 24` candidates remain lower-yield because they are concentrated in already dense books or partial-chapter event windows. No Reader/runtime/API/backend/schema change was introduced in this CR. The next CR is `CR-BR-CTX-139 Chapter Context Batch 14 Draft Row Authoring`.

`CR-BR-CTX-139 Chapter Context Batch 14 Draft Row Authoring` is now complete as a narrow docs/data authoring step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.23.0-pilot"` to `packageVersion: "0.24.0-pilot"` while keeping `status: "pilot"`, and `4` new Batch 14 draft rows have been added for `Exodus 1`, `Exodus 2`, `Exodus 24`, and `Esther 9` using only approved self-book `relatedBookIds` and package-backed `relatedEventIds`. Existing reviewed rows remain unchanged at `77`, all `4` new rows remain `reviewStatus: "draft"` with `isSkeleton: false`, total draft rows are now `4`, and total rows are now `81`. Because the current Reader loader still exposes reviewed rows only, these new draft rows remain hidden from Reader. No Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed in this CR because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-140 Chapter Context Batch 14 Draft QA and Verifier Acceptance`.

`CR-BR-CTX-140 Chapter Context Batch 14 Draft QA and Verifier Acceptance` is now complete as a docs-only QA acceptance step. The chapter-context package remained `0.24.0-pilot` / `pilot` with `77` reviewed rows, `4` draft rows, and `81` total rows during QA. The Batch 14 draft rows `chapter-context-exodus-1`, `chapter-context-exodus-2`, `chapter-context-exodus-24`, and `chapter-context-esther-9` were rechecked in-package and each still carried `reviewStatus: "draft"`, `isSkeleton: false`, the approved self-book `relatedBookIds`, and the approved package-backed `relatedEventIds`. Identity checks confirmed unique row ids and unique `bookId + chapter` pairs, verifier checks confirmed allowed review statuses plus forbidden Bible-text / coordinate / map-provider field enforcement, and static loader inspection reconfirmed that only `reviewStatus: "reviewed"` rows are surfaced to the Reader package. Local localhost SSR checks returned HTTP `200` for Batch 14 draft routes such as `/ko/bible/KRV/exodus/1` and `/ko/bible/KRV/esther/9` while keeping `chapterContextPreview: null` in the draft route payload, reviewed spot-check route `/ko/bible/KRV/exodus/19` still surfaced its reviewed chapter-context payload, and fallback route `/ko/bible/KRV/genesis/2` remained without known chapter-context output. No data package rows were modified in this QA CR, no Reader/runtime/API/backend/schema change was introduced, and no staging/live QA was performed because that remains reserved for the final completion phase. The next CR is `CR-BR-CTX-141 Chapter Context Batch 14 Promotion to Reviewed`.

`CR-BR-CTX-141 Chapter Context Batch 14 Promotion to Reviewed` is now complete as a narrow docs/data state-change step. `docs/data-packages/timeline/chapter-context.skeleton.json` now advances from `packageVersion: "0.24.0-pilot"` to `packageVersion: "0.25.0-pilot"` while keeping `status: "pilot"`, and the approved Batch 14 rows `chapter-context-exodus-1`, `chapter-context-exodus-2`, `chapter-context-exodus-24`, and `chapter-context-esther-9` were promoted from `draft` to `reviewed` with `isSkeleton: false` unchanged. Total reviewed rows are now `81`, total draft rows are now `0`, and total rows remain `81`. No title/summary/scope/anchor/related-id/content wording changes were made. Localhost SSR checks returned HTTP `200` for the promoted Batch 14 routes and confirmed that reviewed route payloads now surface their expected chapter-context titles, while checks showed no `draft` wording and no `review-required` wording in the reviewed route output. Existing reviewed route spot-check for `Exodus 19` remained visible, and fallback route `Genesis 2` remained without known chapter-context output. No staging/live QA was performed in this CR; that remains reserved for the final completion phase. No data package content fields were changed beyond `packageVersion` and the four `reviewStatus` values, and no Reader/runtime/API/backend/schema change was introduced. The next CR is `CR-BR-CTX-142 Chapter Context Coverage Reassessment After Batch 14`.

`CR-BR-CTX-142 Chapter Context Coverage Reassessment After Batch 14` is now complete as a minimal coverage-decision step. As of Sunday, July 26, 2026, the chapter-context package remains `0.25.0-pilot` / `pilot` with `81` total rows, `81` reviewed rows, and `0` draft rows. Fresh package-vs-events recalculation confirms `OT=60` and `NT=21`, with section distribution now at `Torah: 17`, `Historical Books: 28`, `Wisdom / Poetry: 1`, `Major Prophets: 8`, `Minor Prophets: 6`, `Gospels / Acts: 13`, `Pauline Epistles: 3`, `General Epistles: 3`, and `Revelation: 2`. The densest books are now `Exodus=8`, `Genesis=6`, `Matthew=5`, `1 Kings=4`, `2 Kings=4`, `Acts=4`, and `Ezra=4`, while the remaining unused direct single-chapter passage pool has narrowed to `2 Chronicles 36`, `John 19`, `Luke 22`, and `Luke 24`, with `Deuteronomy 29` still too thin. None of those remaining candidates is approved for Batch 15: `2 Chronicles 36` and `John 19` reuse already represented exile-return or passion clusters, `Luke 22` reuses the existing Last Supper cluster already represented by `Matthew 26`, and `Luke 24` is only the closing ascension verses of a broader chapter. Chapter-context expansion is therefore closed again at the current `81`-row reviewed baseline rather than forcing a lower-yield Batch 15. No chapter-context package row, Reader/runtime/API/backend/schema/verifier file, or reviewed-only loader behavior was changed in this CR. The next candidate CR is `CR-BR-CTX-143 Timeline Phase Reprioritization After Chapter Context Closure`.

`CR-BR-CTX-143 Timeline Phase Reprioritization After Chapter Context Closure` is now complete as a short implementation-selection step. Fresh Timeline runtime/package inspection confirmed that the currently connected package-backed surfaces remain `events.core-biblical-skeleton`, `books.66-canonical-skeleton`, `kings-kingdoms.skeleton`, `references.korean-pilot`, and the reviewed-only `chapter-context` loader, while runtime fixture-backed detail surfaces still include genealogy segments/comparison rows, schematic place rows, and part of the kingdom comparison mix inside the Timeline inspector. The higher-priority package-migration candidates were not executed in this CR because `places` and `genealogy` remain sample-only package contracts and the roadmap still treats runtime-to-package promotion as a separate approval-gated step. With no reproduced verifier defect and no narrower runtime bug taking priority, the next executable implementation CR was set to a behavior-preserving frontend extraction: `CR-BR-CTX-144 Timeline Detail Panel Place Evidence Extraction`.

`CR-BR-CTX-144 Timeline Detail Panel Place Evidence Extraction` is now complete as a narrow frontend-only structure improvement. The place inspector rendering that previously remained inline inside `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx` has been extracted into `frontend/src/components/scripture/timeline/timeline-detail-panel/PlaceEvidencePanel.tsx`, preserving the existing runtime fixture-backed place metadata, cross-links, guardrail copy, and selection behavior while reducing the container's remaining in-file surface area. No Timeline package JSON, no runtime fixture rows, no loader contract, no API/backend/schema path, and no chapter-context state changed in this CR. `npm run typecheck` and `npm run lint` both passed. `npm run build` did not complete because Turbopack failed under the current sandbox with `creating new process` / `binding to a port` / `Operation not permitted`, so no feature-specific compile error was found. The next candidate CR is `CR-BR-CTX-145 Timeline Detail Panel Genealogy Evidence Extraction`.

`CR-BR-CTX-145 Timeline Detail Panel Genealogy Evidence Extraction` is now complete as a narrow frontend-only structure improvement. The genealogy inspector rendering that previously remained inline inside `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx` has been extracted into `frontend/src/components/scripture/timeline/timeline-detail-panel/GenealogyEvidencePanel.tsx`, preserving the existing runtime genealogy fixture data, Matthew-1 comparison wording, Scripture anchors, related chips, selection callbacks, and metadata-only boundary without changing selection type routing, deep-link/query behavior, or any loader/package/runtime-fixture values. No Timeline package JSON, no runtime fixture rows, no loader contract, no API/backend/schema path, and no chapter-context state changed in this CR. `npm run typecheck` and `npm run lint` both passed. `npm run build` again stopped at the existing Turbopack sandbox limitation with `creating new process` / `binding to a port` / `Operation not permitted`, so no feature-specific compile error was found. After this extraction, the remaining clearly large inline inspector blocks are the kingdom renderers, so the next candidate CR is `CR-BR-CTX-146 Timeline Detail Panel Kingdom Evidence Extraction`.

`CR-BR-CTX-146 Timeline Detail Panel Kingdom Evidence Extraction` is now complete as a narrow frontend-only structure improvement. The remaining runtime kingdom comparison renderer and the kings-package metadata renderer that previously remained inline inside `frontend/src/components/scripture/timeline/TimelineEventDetailPanel.tsx` have been extracted into `frontend/src/components/scripture/timeline/timeline-detail-panel/KingdomEvidencePanel.tsx` using an explicit runtime/package variant split rather than a new normalized data shape. Selection routing, stale-selection fallback, `kingdomComparisonById` lookup ownership, and deep-link/query behavior remain in the container, while the new leaf preserves the existing section order, Scripture anchors, related item callbacks, package caution copy, runtime genealogy cross-links, and metadata-only boundaries without changing any runtime fixture values or package rows. No Timeline package JSON, no runtime fixture rows, no loader contract, no API/backend/schema path, and no chapter-context state changed in this CR. `npm run typecheck` and `npm run lint` both passed. `npm run build` again stopped at the existing Turbopack sandbox limitation with `creating new process` / `binding to a port` / `Operation not permitted`, so no feature-specific compile error was found. `TimelineEventDetailPanel.tsx` is now reduced from `221` lines before this CR to `220` lines after the extraction while no entity-specific inline renderer functions remain in the file, so the next candidate CR is `CR-BR-CTX-147 Timeline Detail Panel Extraction Closure and Next Implementation Selection`.

`CR-BR-CTX-147 Timeline Detail Panel Extraction Closure and Next Implementation Selection` is now complete as a short implementation-selection step. As of Sunday, July 26, 2026, `TimelineEventDetailPanel.tsx` no longer contains entity-specific inline evidence renderer functions: Events, Books, Places, Genealogy, and Kingdoms now render through dedicated leaf components, while the container remains responsible for selection lookup, stale-selection fallback, callback wiring, and overall inspector orchestration. Additional panel extraction is therefore closed rather than continued mechanically. Runtime fixture to package migration for `places` and `genealogy` remains approval-gated, and no verifier defect was reproduced in this pass. The highest-priority executable follow-up was a real Timeline shell selection/deep-link defect, so the approved next implementation CR was `CR-BR-CTX-148 Timeline Genealogy and Place Deep-Link Restore Fix`.

`CR-BR-CTX-148 Timeline Genealogy and Place Deep-Link Restore Fix` is now complete as a narrow frontend-only Timeline shell fix. `frontend/src/components/scripture/timeline/TimelinePageShell.tsx` now extends the existing `view` + `inspectType` + `inspectId` query contract to the already-supported `genealogy` and `place` inspector selection types, so those views now serialize their selected item into the URL and restore selection back from the query using the same metadata-only invalid-state fallback pattern already used for `event`, `book`, and `kingdom`. No Timeline package rows, no runtime fixture rows, no loader contracts, no API/backend/schema path, and no chapter-context state changed. `npm run typecheck` and `npm run lint` passed, and an escalated `npm run build` also passed after the earlier sandbox-only build limitation. Local route smoke still could not connect to `wordcovenantministry.local:3030`, so HTTP route validation remained unavailable in this environment. The next candidate CR is `CR-BR-CTX-149 Timeline Runtime Fixture Package Migration Approval Review`.

`CR-BR-CTX-149 Timeline Runtime Fixture Package Migration Approval Review` is now complete as a narrow approval-and-selection step. A fresh runtime/package audit confirmed that `places` and `genealogy` remain the two relevant runtime fixture-backed Timeline candidates, but they do not carry the same migration readiness. `places` currently exists as a single schematic fixture array with `20` stable row ids, direct `inspectType=place` / `inspectId=row.id` deep-link usage, no coordinates, no map-provider fields, no geocoding, and no external-source dependency; its sample package contract could therefore be promoted without changing the metadata-only boundary. `genealogy` remains deferred because its current runtime model is split across `timelineGenealogySegments` plus `timelineGenealogyComparisonRows`, and that combined structure still needs a clearer package contract review before migration can preserve the current selective comparison behavior without introducing a new person/name system or over-claiming exhaustive genealogy coverage. Based on that approval comparison, the approved same-session implementation CR was `CR-BR-CTX-150 Timeline Places Package Migration`.

`CR-BR-CTX-150 Timeline Places Package Migration` is now complete as a narrow package-backed Timeline migration. The new package file `docs/data-packages/timeline/places.schematic-pilot.json` now carries `packageType: "timeline.places"`, `packageVersion: "0.1.0-pilot"`, and `20` schematic place rows converted directly from the prior runtime fixture while preserving the existing row ids, `placeId` values, Scripture references, related event/book/kingdom metadata, schematic-only caution boundary, and no-coordinate/no-map/no-geocoding policy. `frontend/src/app/[locale]/timeline/page.tsx` now loads that package server-side, normalizes it through `timelinePlacesPackage.ts`, and passes the resulting rows into `TimelinePageShell`, while the prior inline `timelineSchematicPlaceRows` fixture export has been removed from `timelinePreviewData.ts`. Reader-side related metadata preview now reads the same places package instead of importing the old runtime fixture directly, so `inspectType=place` deep-link identity remains unchanged across Timeline and Reader surfaces. `scripts/timeline/verify-timeline-packages.mjs` now includes the places package in the standard verifier pass. `npm run typecheck`, `npm run lint`, `node scripts/timeline/verify-timeline-packages.mjs`, and an escalated `npm run build` all passed; local route smoke still could not connect to `wordcovenantministry.local:3030`, so HTTP route validation remained unavailable in this environment. The next candidate CR is `CR-BR-CTX-151 Timeline Genealogy Package Migration Approval Review`.

`CR-BR-CTX-151 Timeline Genealogy Package Migration Approval Review` is now complete as a narrow approval-and-contract step. As of Sunday, July 26, 2026, the current genealogy runtime fixture was re-audited and confirmed to consist of `3` supporting `timelineGenealogySegments` plus `11` deep-linkable `timelineGenealogyComparisonRows`, with `inspectType=genealogy` already keyed to the comparison-row ids. The approved migration model is a single `timeline.genealogy` package with explicit `recordType: "segment" | "comparison"` rows so that the existing comparison ids, segment ids, selective Matthew 1 comparison scope, and metadata-only caution boundary can all be preserved without introducing a new person entity system, name-normalization system, or exhaustive chronology claim. No external-source review or additional user approval was required because the source-of-truth remained the existing repository runtime fixture, and the approved same-session implementation CR was `CR-BR-CTX-152 Timeline Genealogy Package Migration`.

`CR-BR-CTX-152 Timeline Genealogy Package Migration` is now complete as a narrow package-backed Timeline migration. The new package file `docs/data-packages/timeline/genealogy.matthew-pilot.json` now carries `packageType: "timeline.genealogy"`, `packageVersion: "0.1.0-pilot"`, `status: "pilot"`, `14` total rows, `3` `recordType: "segment"` rows, and `11` `recordType: "comparison"` rows converted directly from the prior runtime fixtures while preserving the existing segment ids, comparison ids, Matthew 1 comparison labels, Scripture anchors, selective omission/name-variant notes, related book/event metadata, and `inspectType=genealogy` deep-link identity. `frontend/src/app/[locale]/timeline/page.tsx` now loads the genealogy package server-side, normalizes it through `timelineGenealogyPackage.ts`, and passes the resulting segment/comparison arrays into `TimelinePageShell`, while the old `timelineGenealogySegments` and `timelineGenealogyComparisonRows` runtime fixture exports have been removed from `timelinePreviewData.ts`. `GenealogyEvidencePanel` and `EventEvidencePanel` now consume genealogy package-backed rows through lookup maps rather than direct runtime imports. `scripts/timeline/verify-timeline-package.mjs` now enforces genealogy `recordType` requirements plus `comparison.segmentId` resolution inside the same package, and `scripts/timeline/verify-timeline-packages.mjs` now includes the genealogy package in the standard verifier pass. `node scripts/timeline/verify-timeline-packages.mjs`, the expected-fail invalid genealogy verifier check, `npm run typecheck`, `npm run lint`, and an escalated `npm run build` all passed; local route smoke still could not connect to `wordcovenantministry.local:3030`, so HTTP route validation remained unavailable in this environment. The next candidate CR is `CR-BR-CTX-153 Timeline Remaining Runtime Fixture Audit After Genealogy Migration`.

`CR-BR-CTX-153 Timeline Remaining Runtime Fixture Audit After Genealogy Migration` is now complete as a narrow Timeline cleanup-and-closure step. A fresh export/import audit confirmed that the remaining runtime fixture surface in `timelinePreviewData.ts` now falls into three categories: active UI lookup constants (`timelinePeriods`, `timelineBooks`, `timelinePlaces`), active supporting comparison/preview rows (`timelineBookContextRows`, `timelineKingdomComparisonRows`), and one dead migrated export (`passionWeekTimelineEvents`). The dead runtime events export and its re-export were removed because the connected Timeline now reads events only from `events.core-biblical-skeleton.json`, and no active frontend consumer still referenced the old array. The remaining runtime book-context and kingdom-comparison rows are intentionally retained for now because they still serve live Timeline comparison/detail consumers and are not one-to-one duplicates of the current metadata-only packages; deeper promotion of those rows remains separately approval-gated. Timeline package-backed status is now stable across events, books, kings/kingdoms, places, genealogy, Korean supporting references, and reviewed-only chapter context, with no new Timeline package contract opened in this CR. `node scripts/timeline/verify-timeline-packages.mjs`, `npm run typecheck`, and `npm run lint` passed, and an escalated `npm run build` passed after the known sandbox-only process limitation. Local route smoke still could not connect to `wordcovenantministry.local:3030`, so HTTP route validation remained unavailable in this environment. The Timeline workstream is now in a clean pause-ready baseline, and the next work candidate is `Personal Notes Responsive UI Polish Phase Exception`.
