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
Phase 8A through later Phase 8 original-language UX, morphology presentation, beta cleanup, transliteration coverage, and gloss coverage expansion work have been completed through local development. Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration, Cross Reference verse preview modal validation, CR-37 Word Study Cross Reference integration design, CR-39 Word Study Cross Reference frontend MVP, CR-40 post-MVP unsupported-range validation/research architecture review, CR-41 review workflow design, CR-42 approval review, CR-43 review tool MVP design/readiness review, CR-44 audit metadata design, CR-45 approval review, CR-47 audit metadata schema implementation, CR-49 review tool API/admin design, CR-50 implementation approval review, CR-51 admin-only review API implementation, CR-52 validation/readiness review, CR-53 admin UI approval review, CR-54 admin UI MVP implementation, CR-55 review-tool browser validation, CR-56 Gospel Harmony architecture design, CR-57 approval review, CR-58 implementation approval review, CR-59 frontend MVP implementation/static validation, CR-60 browser validation, CR-61 Gospel Harmony Cross Reference integration planning, CR-63 Gospel Harmony Cross Reference frontend MVP implementation/static validation, CR-64 browser validation, CR-65 Scripture Research Workspace architecture design, CR-67 context model design, CR-70 context provider MVP implementation, CR-71 browser validation, and Gospel Harmony frontend foundation have passed local validation/documentation review. CR-72 research panel navigation refinement is completed through available validation; browser automation was not available in this environment during that turn. CR-73 Biblical Timeline Architecture Design is documented, CR-74 Biblical Timeline Architecture Approval Review is complete, CR-75 Biblical Timeline Conceptual Data Model Design is documented, CR-76 Biblical Timeline Conceptual Data Model Approval Review is complete, CR-77 Scripture-Anchored Timeline MVP Design is documented, CR-78 Scripture-Anchored Timeline MVP Design Approval Review is complete, CR-79 Scripture-Anchored Timeline MVP Implementation Readiness Design is documented, CR-80 Scripture-Anchored Timeline MVP Implementation Readiness Approval Review is complete, CR-81 Scripture-Anchored Timeline MVP Implementation Approval Review is complete, CR-82 Scripture-Anchored Timeline MVP Frontend Implementation has been completed locally in a frontend-only scope, CR-83 Scripture-Anchored Timeline MVP Frontend Validation has been completed through available validation, CR-84 Scripture-Anchored Timeline MVP Browser QA / UX Polish Planning is documented, CR-85 Scripture-Anchored Timeline MVP Browser QA / UX Polish Approval Review is complete, CR-86 Timeline Local Route Accessibility Investigation is complete through available validation, CR-87 Timeline Browser QA / UX Polish is complete through available validation, CR-89 Timeline UX Polish Continuation is complete through available validation, CR-90A-3 Scripture-First Timeline Workspace Design and Data Source Documentation is complete, CR-90B Timeline Workspace Layout Expansion is complete through available validation, CR-90C-1 Primeval Genealogy Bridge Preview is complete, CR-90C-2 Genesis 11 / Patriarchal Relative Timeline Preview is complete through available validation, CR-90C-3 Patriarchal Events and Early Nation Context Preview is complete through available validation, CR-90C-4 Exodus / Wilderness Scripture-Derived Timeline Preview is complete through available validation, CR-90C-5 Conquest / Judges Scripture-First Timeline Preview is complete through available validation, CR-90D Kings, Kingdoms, and Surrounding Empires Preview is complete through available validation, CR-90D-2 Kings & Kingdoms Comparison Table Preview is complete through available validation, CR-90E Psalms and Book Context Preview is complete through available validation, CR-90F Matthew Genealogy Comparison Preview is complete through available validation, CR-90Y Timeline Content Completeness Audit / Content Expansion is complete through available validation, CR-91B-2 Context Inspector Cross-Linking is complete through available validation, CR-91E Timeline Left Navigator Redesign is complete through available validation, CR-92A Korean History Reference Layer Design is documented as a documentation-only reference-layer design, CR-92B Korean History Reference Placeholder UI is complete through available validation, CR-93A Timeline Data Coverage Matrix is complete as a documentation-only audit artifact, CR-93B Timeline Data Package Design is complete as a documentation-only package-architecture design, CR-93B-2 Timeline Data Package Skeleton Files is complete as a docs/data skeleton step, CR-93C Core Biblical Event Skeleton is complete as a docs/data package step, CR-93D 66-Book Context Skeleton is complete as a docs/data package step, CR-93D-2 66-Book Frontend Preview Integration is complete through available validation, CR-93D-3 Books Canonical Section Navigation Wiring is complete through available validation, CR-93D-4 Books Center Canonical Section Accordion UI is complete through available validation, CR-93E Timeline Package Verifier Design is complete as a docs-only package-guardrail design step, CR-93E-2 Verifier Test Fixtures is complete as a docs/data-fixture step, CR-93E-3 Minimal Verifier Implementation is complete as a read-only data-tooling step, CR-93E-4 66-Book Validation is complete as a verifier-hardening step, CR-93E-5 Cross-Link and No-Coordinate Guardrail Expansion is complete as a verifier-hardening step, CR-93E-6 Verifier CI / Command Wiring is complete as a read-only command-wiring step, and CR-93F Timeline Workspace Interaction QA is complete through available validation. The Scripture Evidence Panel can now navigate among existing Events, Books / Psalms, Places, Kingdoms, and explicitly related Genealogy rows through secondary related-item chips while keeping Scripture anchors as the primary Reader links. Related item chips remain secondary navigation for study convenience. The Timeline package directory now includes skeleton sample package files under `docs/data-packages/timeline/`, `docs/data-packages/timeline/books.66-canonical-skeleton.json`, `docs/data-packages/timeline/events.core-biblical-skeleton.json`, verifier fixtures under `docs/data-packages/timeline/fixtures/`, a minimal CLI verifier at `scripts/timeline/verify-timeline-package.mjs`, and a standard local wrapper command at `scripts/timeline/verify-timeline-packages.mjs`. The 66-book requirement remains documented, the accordion-first center-column principle remains documented, and verifier requirements are now partly enforced by a local read-only CLI without runtime integration. Canonical book validation now includes stronger 66-book package detection, exact count checks, non-empty unique `bookId` checks, canonical order range and gap checks, and OT/NT distribution checks. Cross-link validation now adds explicit target-type checks, Scripture-reference-as-id rejection, duplicate-target ambiguity detection, self-link review warnings, and clearer source/target reporting in readable and JSON output. No-coordinate guardrails now recurse into nested objects and arrays and distinguish forbidden map-provider fields from ordinary source-provider labels. Supporting world/Korean reference rows now fail when they imply primary or equal interpretive authority and warn when they remain explicit review-required placeholders. The new core event skeleton package adds 34 Scripture-reference-only event rows from Creation through Revelation as a package baseline without frontend runtime integration. The new wrapper command verifies verifier syntax, canonical books, core events, valid fixtures, invalid expected-fail fixtures, warning-only fixtures, and JSON smoke output in one repeatable local run. The 66-book frontend preview now reads `books.66-canonical-skeleton.json` through the Timeline route server layer and renders a metadata-only canonical Books / Psalms preview with OT/NT grouping and canonical order in the existing workspace. The Books / Psalms left sidebar canonical section guide now scrolls and focuses stable center-column canonical section targets while preserving locale-stable IDs and metadata-only rendering. The Books / Psalms center column now uses canonical-section accordion panels with all sections collapsed on first load; left navigator section selection opens the matching accordion, scrolls to it, and focuses it; users can directly toggle section headers; and multiple canonical sections can remain open while book rows continue updating the metadata-only Scripture Evidence Panel. The Timeline Workspace interaction QA pass did not require additional frontend code changes and confirmed the current package-backed Events and Books previews, view-aware navigator, and metadata-only right panel behavior through static validation and explicit code-path review. Bible text is not rendered from the package, no backend or API call was added, and `events.core-biblical-skeleton.json` remains unlinked from the frontend runtime. Authorship, background, and dating labels remain intentionally cautious and basis-labeled. Korean history placeholder rows remain supporting-only and non-linked. The workspace now moves toward a left sidebar navigator, a main workspace area, and a right detail panel, while keeping the page Scripture-first and page-stay oriented. The lightweight Kings & Kingdoms preview view is enabled and now includes a compact comparison table. The Books / Psalms context preview view is now package-backed for the 66-book canonical skeleton while remaining metadata-only. The Genealogy preview view is enabled and now includes a compact Matthew 14 / 14 / 14 comparison table. Staging/tag/release work remains paused until the next Timeline preview branch is chosen. Browser automation tooling was not available in this environment for direct in-app browser QA, so local static validation, build verification, and explicit-code-path inspection were used in addition to source inspection. Local route smoke for `:3030` was attempted in this session but curl could not connect despite a local listener on port `3030`, so route status evidence remained unavailable from this environment. No backend or dataset import change was required.

Future world-history or Korean-history reference layers remain deferred. If they are introduced later, they must stay reference-only and source-labeled rather than becoming interpretive authority over Scripture.

CR-93G Kings / Kingdoms Timeline Package Design is now documented in `docs/ROADMAP/KINGS_KINGDOMS_TIMELINE_PACKAGE_DESIGN.md` as a docs-only package-design step. CR-93G-2 Kings / Kingdoms Skeleton Package is now complete as a docs/data package step. `docs/data-packages/timeline/kings-kingdoms.skeleton.json` now provides a minimal Scripture-reference-only skeleton baseline for kingdom periods, kingdom rows, representative kings, transitions, exile markers, and a temple marker. CR-93G-3 Kings / Kingdoms Verifier Fixtures is now complete as a docs/data-fixture step. Kings / Kingdoms valid, invalid, and warning fixture files now exist under `docs/data-packages/timeline/fixtures/` to anchor current generic verifier behavior and document pending Kings-specific hardening targets for CR-93G-4. The package stays metadata-only, stores no Bible text, uses no coordinates or map-provider fields, keeps chronology approximate and review-gated, and is not connected to the frontend runtime yet. No verifier logic, frontend integration, API, DB, backend, schema, or runtime import/export work was added in this step.
```

Completed phase:

```txt
Scripture Foundation, Search Layer, Reader Layer, Reader UX Polish, Phase 5B Original Language Data Layer, Phase 5C Source Gate / Normalizer Foundation, Phase 5D Dry-run Pipeline, Phase 5E original-language import completion, Phase 6A Original Language Read API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7A Original Language Reader UI Planning, Phase 7B through Phase 7H Original Language Reader MVP, Phase 8A frontend/menu/navigation and interlinear UX cleanup, Phase 8B Korean transliteration presentation data, Phase 8C Korean gloss presentation data, Phase 8D morphology Korean presentation, Phase 8E/8F Korean original-language coverage expansion, Phase 8G through Phase 8K original-language UX audit and beta cleanup, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration/verse preview modal validation, CR-39 Word Study Cross Reference frontend MVP, CR-40 post-MVP unsupported-range validation/research architecture review, CR-41 review workflow design, CR-42 approval review, CR-43 review tool MVP design/readiness review, CR-44 audit metadata design, CR-45 approval review, CR-47 audit metadata schema implementation, CR-49 API/admin design, CR-50 approval review, CR-51 admin-only review API implementation, CR-52 validation/readiness review, CR-53 admin UI approval review, CR-54 admin UI MVP implementation, CR-55 review-tool browser validation, CR-56/CR-57/CR-58 Gospel Harmony design and approval reviews, CR-59 Gospel Harmony frontend MVP implementation/static validation, CR-60 browser validation, CR-61 Gospel Harmony Cross Reference integration planning, CR-63 Gospel Harmony Cross Reference frontend MVP implementation/static validation, CR-64 browser validation, and Gospel Harmony frontend foundation
```

Active objective:

```txt
Proceed from the new Kings / Kingdoms fixture baseline into verifier-rule hardening only where the current generic checks remain insufficient, while keeping the current preview layers Scripture-first and metadata-only.
```

Next task:

```txt
Proceed to CR-93G-4 Kings / Kingdoms Verifier Rule Hardening, if needed, followed by frontend preview integration only after the data package path is verified.
```

Blocked items:

```txt
Full TAGNT NT and full TAHOT OT persistence imports are complete. Phase 6A read-only API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7A planning, Phase 7B through Phase 7H frontend implementation, Phase 8A frontend/navigation cleanup, Phase 8B Korean transliteration data, Phase 8C Korean gloss data, Phase 8D morphology presentation, Phase 8E/8F reviewed Korean original-language coverage expansion, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow through Scripture Insight, Distribution, Occurrence Explorer, and sample-occurrence Related Passages, Cross Reference data layer/API/Reader integration, verse preview modal validation, Gospel Harmony frontend foundation, Gospel Harmony Cross Reference integration planning, Gospel Harmony Cross Reference frontend MVP implementation/static validation, Gospel Harmony Cross Reference frontend MVP browser validation, CR-71 Scripture Research Workspace Context Provider Browser Validation, CR-72 Research Panel Navigation Refinement validation, and WEB local apply are complete through local development. Write/import endpoints, additional source imports, advanced search, morphology explorer, WEB staging/production promotion, Gospel Harmony schema/API/import work, morphology schema/API changes, production deployment automation, and seed migration tracking tables require separate approval.
```

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
