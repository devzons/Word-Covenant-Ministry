# Next Tasks

## Date

2026-06-25

## Immediate Next Task

CR-90Y Timeline Content Completeness Audit / Content Expansion is complete through available validation. The Scripture Timeline now includes compact Books / Psalms context rows, a package-backed Kings / Kingdoms preview with accordion sections and metadata-only chronology cautions, the same Matthew 14 / 14 / 14 comparison view, and the same left sidebar navigator, a main workspace area, and a right detail panel while remaining Scripture-first and page-stay oriented. Staging and release work remain paused until the next Timeline preview branch is chosen.

CR-92A Korean History Reference Layer Design is documented.

CR-91B-2 Context Inspector Cross-Linking is complete through available validation. The Scripture Evidence Panel can now navigate among existing Events, Books / Psalms, Places, and explicitly related Kingdom or Genealogy rows through secondary related-item chips while keeping Scripture anchors as primary Reader links. No API, DB, schema, import, coordinates, map provider, or commentary layer was added. Korean history placeholder remains non-linked and supporting only.

CR-92B Korean History Reference Placeholder UI is complete through available validation. Events view period blocks now include a collapsed Korean history reference placeholder below Scripture event rows. No Korean history rows or chronology data were added. No source import, API, DB, schema, map, or chronology dataset work was added. Korean history remains supporting reference only, source and license review remain required before any real content rows, and Korean history is not a basis for biblical interpretation.

CR-92C-0 Korean History Source Review Gate is documented in `docs/ROADMAP/KOREAN_HISTORY_SOURCE_REVIEW_GATE.md`, `CR-92C-1 Korean History Source Review and Citation Policy` is documented in `docs/ROADMAP/KOREAN_HISTORY_SOURCE_POLICY.md`, `CR-92C-2 Korean History Approved Source Set` is documented in `docs/ROADMAP/KOREAN_HISTORY_APPROVED_SOURCE_SET.md`, and `CR-92C Korean History Pilot Rows` is now complete as a narrow docs/data pilot. `docs/data-packages/timeline/references.korean-pilot.json` now contains `5` manually curated broad supporting-reference rows with approved source categories, required citation metadata, supporting-only labels, and caution-labeled chronology. Bulk import, copied prose, exact-looking chronology without basis labels, and any elevation of Korean history above Scripture remain prohibited.

CR-92D Korean History Frontend Reference Preview Integration is complete through available validation. Events period blocks now load matching rows from `docs/data-packages/timeline/references.korean-pilot.json` into the existing collapsed Korean-history reference section through the Timeline route server loader path. Korean references remain supporting-only, visually secondary, outside event counts, outside search/filter results, outside the Scripture Evidence Panel, and outside any exact biblical-event synchronization. No new Korean rows, API, DB, backend, schema, import/export, coordinates, map-provider, or geocoding work were added.

CR-93A Timeline Data Coverage Matrix is complete as a documentation-only audit. `docs/ROADMAP/TIMELINE_DATA_COVERAGE_MATRIX.md` now records current Timeline fixture counts, period-level coverage, view-level readiness, canonical book-context gaps, Psalm coverage, kingdom coverage, place coverage, and the current data-architecture risk around continued growth in `timelinePreviewData.ts`. No Timeline data rows, fixture rows, API, DB, schema, import, or world-history / Korean-history dataset work were added.

CR-93B Timeline Data Package Design is complete as a documentation-only architecture step. `docs/ROADMAP/TIMELINE_DATA_PACKAGE_DESIGN.md` and `docs/data-packages/timeline/` now document the package directory proposal, the 66-book coverage requirement, the accordion-first center-column principle, shared field expectations, package-specific field guidance, and future verifier rules. No real Timeline package rows, code, API, DB, schema, or import work were added.

CR-93B-2 Timeline Data Package Skeleton Files is complete. Skeleton sample package files now exist under `docs/data-packages/timeline/` for manifest, periods, sections, events, books, psalms, kings, prophets, empires, places, genealogy, references, and cross-links. All current sample JSON files remain skeleton-only with empty `items` arrays. No real data rows, code, import, API, DB, or schema work were added.

CR-93D 66-Book Context Skeleton is complete. `docs/data-packages/timeline/books.66-canonical-skeleton.json` now contains 66 canonical book rows as a cautious package-level skeleton with Scripture anchors, basis labels, provisional timeline grouping fields, and accordion-first display fields.

CR-93D-2 66-Book Frontend Preview Integration is complete through available validation. The Timeline Books / Psalms view now reads the canonical 66-book skeleton through the Timeline route server layer and renders a metadata-only frontend preview with OT/NT grouping, OT 39 / NT 27 counts, canonical order display, locale-aware titles, and a metadata-only right panel. No Bible text rendering, Bible API calls, backend API calls, coordinates, map provider fields, API changes, DB changes, schema migration, or runtime import/export pipeline work were added.

CR-93D-3 Books Canonical Section Navigation Wiring is complete through available validation. The Books / Psalms left sidebar canonical section guide now targets stable center-column section IDs, supports click-to-scroll and focus movement, and preserves a preview-only metadata flow without Bible text rendering or backend integration. No data package rows, API, DB, backend, schema, Next config, coordinates, or map provider work were added.

CR-93D-4 Books Center Canonical Section Accordion UI is complete through available validation. The Books / Psalms center column now uses canonical-section accordion panels with all sections collapsed on first load. Left navigator section selection opens the matching section and scrolls/focuses it, while users can also directly open and close multiple canonical sections from the center column. Book rows remain compact metadata-only selectors for the right panel. No Bible text rendering, API calls, DB changes, backend changes, schema migration, data package edits, coordinates, or map-provider work were added.

CR-93G Kings / Kingdoms Timeline Package Design is complete as a docs-only design step. `docs/ROADMAP/KINGS_KINGDOMS_TIMELINE_PACKAGE_DESIGN.md` now defines a future `timeline.kings-kingdoms` package envelope, record types for kingdom flow and king rows, cautious chronology and synchronism policy, Scripture-anchor-only rules, cross-link expectations, accordion-first center-column structure, and future verifier/fixture implications. No kings skeleton JSON, frontend integration, verifier change, API, DB, backend, schema, or runtime import/export work was added.

CR-93G-2 Kings / Kingdoms Skeleton Package is complete as a docs/data package step. `docs/data-packages/timeline/kings-kingdoms.skeleton.json` now adds a minimal Scripture-reference-only skeleton baseline for kingdom periods, kingdoms, representative kings, transitions, exile markers, and a temple marker. The package remains frontend-unlinked, stores no Bible text, uses no coordinates or map-provider fields, and keeps chronology approximate and review-gated. Kings / Kingdoms verifier fixtures remain deferred to CR-93G-3, and verifier rule hardening remains deferred to CR-93G-4 if needed.

CR-93G-3 Kings / Kingdoms Verifier Fixtures is complete as a docs/data-fixture step. Kings / Kingdoms valid, invalid, and warning fixture files now exist under `docs/data-packages/timeline/fixtures/` to anchor current generic verifier behavior and to document Kings-specific hardening targets.

CR-93G-4 Kings / Kingdoms Verifier Rule Hardening is complete as a read-only verifier step. The CLI now recognizes `timeline.kings-kingdoms`, validates allowed record types and required Kings fields, resolves `kingdomId` plus predecessor/successor and transition relations, enforces exact chronology review gating, and warns on missing optional `reignLabel`. The Kings / Kingdoms skeleton package still stores no Bible text, uses no coordinates or map-provider fields, remains frontend-unlinked, and required no API, DB, backend, schema, or runtime import/export changes.

CR-93G-5 Kings / Kingdoms Frontend Preview Integration is complete through available validation. The Timeline route now loads `docs/data-packages/timeline/kings-kingdoms.skeleton.json` through the server-loader package pattern, the Kings / Kingdoms center column now renders package-backed accordion sections, the left navigator now targets those package sections, and the right Scripture Evidence Panel now shows metadata-only detail for kingdom periods, kingdoms, kings, transitions, and markers. Bible text remains unrendered, chronology remains review-gated, and no API, DB, backend, schema, verifier, or data-package row changes were required.

CR-93G-6 Kings / Kingdoms Interaction QA is complete through available validation. The current package-backed Kings / Kingdoms preview, section navigator, accordion behavior, and metadata-only right panel were checked through static validation, explicit code-path review, and attempted local route smoke. No required frontend fixes were identified in this pass. Bible text remains unrendered, chronology remains caution-labeled and review-gated, and no data package rows, verifier rules, API, DB, backend, schema, or runtime import/export behavior changed.

CR-91C Context Inspector Deep Links Scope Definition is complete as a docs-only design step. `docs/ROADMAP/CONTEXT_INSPECTOR_DEEP_LINKS_DESIGN.md` now defines the deep-link purpose, the recommended `view` plus `inspectType` / `inspectId` URL policy, the first-pass support boundary for Events, Books / Psalms, and Kings / Kingdoms, route-load selection restore expectations, metadata-only right-panel guardrails, and the acceptance criteria for later implementation. No frontend code, data package row, verifier, API, DB, backend, schema, or runtime import/export change was added in this step.

CR-91C-2 Events / Books / Kings Deep Link Implementation is complete through available validation. The Timeline route and shell now restore metadata-only Context Inspector selection from `view`, `inspectType`, and `inspectId` for Events, Books / Psalms, and Kings / Kingdoms, update the URL through query replacement during in-view selection changes, open the matching Books / Psalms or Kings / Kingdoms accordion section during restore, and safely fall back to no selection when the deep-link state is invalid or mismatched. Bible text remains unrendered, Scripture anchors remain reference-only, coordinates and map-provider state remain absent, and no API, DB, backend, schema, verifier, or data-package row change was added.

CR-91C-3 Deep Link QA and Docs Sync is complete through available validation. `docs/ROADMAP/CONTEXT_INSPECTOR_DEEP_LINKS_QA.md` now records the checked URLs for Events, Books / Psalms, and Kings / Kingdoms, confirms invalid and mismatched query fallback behavior, documents query replacement and accordion auto-open expectations, and records the current route-smoke limitation for local `:3030` access. No required frontend fixes were identified in this QA pass. Bible text remains unrendered, Scripture anchors remain reference-only, coordinates and map-provider state remain absent, and no API, DB, backend, schema, verifier, or data-package row change was added.

CR-91D-5 Interaction QA and Docs Sync is complete through available validation. `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` now records the checked Events, Books / Psalms, and Kings / Kingdoms highlight behavior, invalid-selection fallback expectations, regression review, accessibility-focused code review, route-smoke limitation, and the code-path review result for the earlier React `useEffect` dependency-array-size warning risk. No required frontend fixes were identified in this QA pass. Schematic highlights remain metadata-derived UI affordances only, with no Bible text rendering, no coordinates, no map-provider state, no geocoding, no exact chronology inference, and no API, DB, backend, schema, verifier, or data-package row change.

CR-91D-4 Places / Schematic View Placeholder Highlight is now complete through available validation. The Places / Schematic Map view now exposes a schematic-only placeholder surface that summarizes the current Context Inspector selection and existing metadata, explicitly keeps coordinates, map-provider state, geocoding, and Bible text out of scope, and leaves any future Places package integration deferred. No API, DB, backend, schema, verifier, or data-package row change was required.

CR-91D-6 Schematic Flow Highlights Final QA / Docs Sync is now complete through available validation. `docs/ROADMAP/SCHEMATIC_FLOW_HIGHLIGHTS_QA.md` now includes a final addendum for Events, Books / Psalms, Kings / Kingdoms, and Places / Schematic Map placeholder behavior, plus final regression review for deep-link alignment, stale-state fallback, accessibility-focused code paths, route-smoke limitation, and the earlier React `useEffect` dependency-array-size warning risk. No required frontend fixes were identified in this final pass. The CR-91D branch remains metadata-only, with no Bible text rendering, no coordinates, no map-provider state, no geocoding, no exact chronology inference, and no API, DB, backend, schema, verifier, or data-package row change.

CR-93F Timeline Workspace Interaction QA is complete through available validation. The current package-backed Events and Books / Psalms previews, active-view-aware left navigator, and metadata-only right panel were checked through static validation, explicit code-path review, and attempted local route smoke. No required frontend fixes were identified in this pass. Bible text remains unrendered, no coordinates or map-provider fields were introduced, and no API, DB, backend, schema, or package-row changes were added.

CR-91E Timeline Left Navigator Redesign is complete through available validation. The left sidebar is now active-view aware and works as a contextual Timeline Navigator instead of a shared filter surface across all views. Events filters remain functional and are clearly scoped to Events. Books / Psalms navigator now acknowledges and summarizes the active 66-book package preview. Places navigator now makes the schematic-map and no-coordinate boundary explicit. No data rows, API, DB, schema, import, or non-approved package integration were added. Korean history remains placeholder/reference only.

CR-93E Timeline Package Verifier Design is complete. `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md` and `docs/data-packages/timeline/verifier.md` now define future verification levels, error/warning policy, 66-book checks, accordion-first checks, no-Bible-text guardrails, no-coordinate guardrails, Korean/world reference guardrails, and a future CLI contract. No verifier script, frontend code, data rows, import, API, DB, or schema work was added.

CR-93E-2 Verifier Test Fixtures is complete. `docs/data-packages/timeline/fixtures/` now contains synthetic valid, invalid, and warning-only JSON fixtures for future verifier implementation. The fixtures are documentation and test-data only; they are not runtime imports and not approved production package rows. Invalid JSON syntax remains documented in fixture README rather than committed as a broken `.json` file. No verifier script, frontend code, API, DB, schema, runtime integration, or real biblical data expansion was added.

CR-93E-3 Minimal Verifier Implementation is complete. `scripts/timeline/verify-timeline-package.mjs` now provides a read-only CLI for single-file and directory verification with readable-summary and `--json` output modes. Current checks cover JSON parse, package envelope fields, duplicate IDs, center-column required fields, cross-link resolution, 66-book skeleton validation, Bible-text guardrails, no-coordinate guardrails, supporting-reference authority guardrails, and warning-only review flags. No frontend code, API, DB, schema, import, runtime integration, or real biblical data expansion was added.

CR-93E-4 66-Book Validation is complete. The verifier now hardens canonical 66-book package detection, exact row-count checks, non-empty unique `bookId` checks, canonical order integer/range/duplicate/gap checks, and OT/NT distribution checks. Additional invalid fixtures now cover 65-row, duplicate-order, out-of-range-order, and wrong-testament-count cases. No frontend code, runtime integration, API, DB, schema, import, or real biblical data expansion was added.

CR-93E-5 Cross-Link and No-Coordinate Guardrail Expansion is complete. The verifier now hardens cross-link target-type checks, rejects Bible-reference-looking IDs when used as package row IDs, fails ambiguous duplicate-target resolution, warns on self-links and missing target types, recursively scans nested objects and arrays for forbidden coordinate or map-provider fields, and tightens supporting-reference authority guardrails for Korean/world reference layers. Additional invalid and warning fixtures now cover these cases. No frontend code, runtime integration, API, DB, schema, import, or real biblical data expansion was added.

CR-93C Core Biblical Event Skeleton is complete. `docs/data-packages/timeline/events.core-biblical-skeleton.json` now contains a minimal Scripture-reference-only event baseline with 85 core rows from Creation through Revelation. The package is read-only, verifier-checked, and now connected to the Timeline Events view through a preview-only route server loader. No Bible text, coordinates, map provider fields, Korean/world historical rows, API, DB, schema migration, or runtime import/export pipeline work were added.

CR-93E-6 Verifier CI / Command Wiring is complete. `scripts/timeline/verify-timeline-packages.mjs` now provides a single local wrapper command that checks verifier syntax, the canonical books package, the core events package, valid fixtures, invalid expected-fail fixtures, warning-only fixtures, and JSON smoke output. No root `package.json`, GitHub Actions workflow, frontend code, runtime integration, API, DB, schema migration, or import behavior was added. Repository CI wiring remains deferred because there is no existing `.github/workflows/` convention in this repository.

Future world-history or Korean-history reference layers remain deferred. If they are introduced later, they must stay reference-only and source-labeled rather than becoming interpretive authority over Scripture.

Documentation Gate Proportionality applied to this narrow frontend-only UI step because the work stayed out of architecture, API, database, schema, import, migration, Data Package, and production-impacting scope.

Phase 5D Original Language dry-run pipeline is complete. Phase 5E tiny local write smokes are complete. Full TAGNT NT and full TAHOT OT are imported. Phase 6A Original Language Read API, Phase 6B Word Study API, Phase 6C high-level Interlinear API, Phase 7B through Phase 7H frontend MVP implementation, Phase 8A through later Phase 8 beta cleanup and Korean original-language coverage expansion, Bible Study Workspace, Search Workspace, Original Text view, Word Study panel flow, Cross Reference data layer/API/Reader integration/verse preview modal validation, CR-39 Word Study Cross Reference frontend MVP, CR-40 post-MVP unsupported-range validation/research architecture review, CR-41 review workflow design, CR-42 approval review, CR-43 review tool MVP design/readiness review, CR-44 audit metadata design, CR-45 approval review, CR-47 audit metadata schema implementation, CR-49 review tool API/admin design, CR-50 approval review, CR-51 admin-only review API implementation, CR-52 validation/readiness review, CR-53 admin UI approval review, CR-54 admin UI MVP implementation, CR-55 browser validation, CR-56/CR-57/CR-58 Gospel Harmony design and approval reviews, CR-59 Gospel Harmony frontend MVP implementation/static validation, CR-60 browser validation, CR-61 Gospel Harmony Cross Reference integration planning, CR-63 Gospel Harmony Cross Reference frontend MVP implementation/static validation, CR-64 browser validation, CR-65 Scripture Research Workspace architecture design, CR-66 approval review, CR-67 context model design, CR-68 approval review, CR-69 approval review, CR-70 context provider MVP implementation, CR-71 browser validation, and Gospel Harmony frontend foundation are complete through local development. Current work is CR-90Y Timeline Content Completeness Audit / Content Expansion, completed through available validation.

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

## Current Priority Order

1. CR-93C-3 Core Event Frontend QA.
2. CR-93D-2 66-Book Frontend Preview Integration follow-up only if new cross-package QA exposes regressions.
3. CR-92D-2 Korean Reference Period Assignment Hardening.
4. CR-92E Korean Reference Inspector Policy Design.
5. CR-90Y-5 Genealogy Detail Refinement.
6. CR-90Y-4B Kings / Prophets Cross-Link Refinement.
7. CR-91 Place / Map Preview.
8. Later: deeper Kings / Kingdoms data expansion after current preview baseline.
9. Phase 9 English Bible support: WEB Source/License Review, WEB Import Readiness Review, WEB Import Execution Spec, WEB Dry Run Checklist, WEB Empty Verse Policy, WEB Dry Run Report, WEB Local Apply Readiness Review, and WEB Local Apply Report are documented. WEB local apply passed in the local development database. Staging apply and production apply remain unapproved.
10. Commit the completed Scripture UX, Word Study, Cross Reference, Gospel Harmony, and roadmap/status documentation when approved.
11. After explicit approval, implement seed migration tracking and release automation support.
12. Later: Strong detail pages or dedicated Word Study pages.
13. Later: advanced search.
14. Later: morphology explorer.
15. Later: Commentary Layer.
16. Future, after original-language MVP stabilization and separate approval: Phase 10 Hebrew-Greek Bridge and Revelation Lexicon Foundation.

Phase 9 English Bible support planning is documented in:

```txt
docs/ROADMAP/ENGLISH_BIBLE_SUPPORT_PLAN.md
docs/ROADMAP/WEB_IMPORT_READINESS_REVIEW.md
docs/ROADMAP/WEB_IMPORT_EXECUTION_SPEC.md
docs/ROADMAP/WEB_DRY_RUN_CHECKLIST.md
docs/ROADMAP/WEB_DRY_RUN_REPORT.md
docs/ROADMAP/WEB_EMPTY_VERSE_POLICY.md
docs/ROADMAP/WEB_LOCAL_APPLY_REVIEW.md
docs/ROADMAP/WEB_LOCAL_APPLY_REPORT.md
```

Gospel Harmony planning is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_PLAN.md
docs/ROADMAP/GOSPEL_HARMONY_ARCHITECTURE_DESIGN.md
docs/ROADMAP/GOSPEL_HARMONY_FRONTEND_MVP_IMPLEMENTATION_REPORT.md
docs/ROADMAP/GOSPEL_HARMONY_FRONTEND_MVP_VALIDATION_REPORT.md
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_INTEGRATION_PLAN.md
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_FRONTEND_MVP_IMPLEMENTATION_REPORT.md
docs/ROADMAP/GOSPEL_HARMONY_CROSS_REFERENCE_FRONTEND_MVP_VALIDATION_REPORT.md
```

Scripture Research Workspace planning is documented in:

```txt
docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_ARCHITECTURE_DESIGN.md
docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_CONTEXT_MODEL_DESIGN.md
docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_CONTEXT_PROVIDER_IMPLEMENTATION_REPORT.md
```

Future Hebrew-Greek bridge planning is documented in:

```txt
docs/ROADMAP/HEBREW_GREEK_BRIDGE_PLAN.md
```

Boundary:

- Do not auto-equate Hebrew/Aramaic `Hxxxx` Strong's values with Greek `Gxxxx` Strong's values.
- Any Hebrew-Greek relationship must be curated or source-backed.
- A relationship means "related for study," not "identical."

## Phase 5E Smoke Status

Completed local write-smoke status:

- Persistence skeleton committed in `24a0d24`.
- Local DB connectivity restored through Local Site Shell.
- Original-language tables confirmed:
  - `wp_wcm_original_terms`
  - `wp_wcm_original_word_occurrences`
- Small `STEP_TAGNT` write smoke passed:
  - `maxRows=3`
  - `batchSize=1`
  - first run created `3` terms and `3` occurrences
  - rerun matched `3` terms and `3` occurrences
  - duplicates=`0`
- Small `STEP_TAHOT` write smoke passed:
  - `maxRows=3`
  - `batchSize=1`
  - first run created `4` terms and `4` occurrences
  - rerun matched `4` terms and `4` occurrences
  - Hebrew expansion confirmed
  - duplicates=`0`
- Controlled `STEP_TAGNT` Mat-Jhn 1,000-row local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_g_pre_tagnt_1000.sql`
  - `maxRows=1000`
  - `batchSize=100`
  - pre counts: `7` terms, `7` occurrences, `STEP_TAGNT=3`, `STEP_TAHOT=4`
  - first successful run: `rowsRead=1000`, `rowsValid=988`, `rowsNormalized=988`
  - first successful run created `273` terms and `985` occurrences
  - first successful run matched `242` terms and `3` occurrences
  - rerun created `0` terms and `0` occurrences
  - rerun matched `515` terms and `988` occurrences
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
- Current local DB controlled import state:
  - `280` terms
  - `992` occurrences
  - `STEP_TAGNT=988`
  - `STEP_TAHOT=4`
- Full `STEP_TAGNT` Mat-Jhn local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_h_pre_tagnt_mat_jhn_full.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=66984`, `rowsNormalized=64205`, `rowsSkipped=2779`
  - first successful run created `2731` terms and `63217` occurrences
  - first successful run matched `988` occurrences
  - errors=`0`
  - failedBatches=`0`
  - runtime=`10.6752s`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `64205` occurrences
  - post counts: `3011` terms, `64209` occurrences, `STEP_TAGNT=64205`, `STEP_TAHOT=4`
  - coverage: `Matthew=18297`, `Mark=11091`, `Luke=19408`, `John=15409`
  - duplicate groups=`0`
  - blank TAGNT morphology rows=`0`
- Full `STEP_TAGNT` Act-Rev local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_i_pre_tagnt_act_rev_full.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=75112`, `rowsNormalized=72916`, `rowsSkipped=2196`
  - first successful run created `2562` terms and `72909` occurrences
  - first successful run skipped `7` duplicate occurrence candidates
  - duplicateOccurrences=`7` warning-level skips
  - errors=`0`
  - failedBatches=`0`
  - runtime=`12.2309s`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `72909` occurrences
  - idempotency rerun errors=`0`
  - post counts: `5573` terms, `137118` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=4`
  - Full TAGNT NT imported: Mat-Jhn already completed; Act-Rev completed
  - duplicate groups=`0`
  - blank TAGNT morphology rows=`0`
- Controlled `STEP_TAHOT` Gen-Deu local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_j_pre_tahot_gen_deu_full.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=79990`, `rowsValid=79737`, `rowsNormalized=142021`, `rowsSkipped=253`
  - skipped reasons: `qere_kethiv_variant_skipped=76`, `tahot_non_base_text_type_skipped=177`, `psalm_title=0`
  - first successful run created `4011` terms and `142014` occurrences
  - first successful run matched `4` occurrences
  - first successful run skipped `3` duplicate occurrence candidates
  - missingMorphology=`6412` warning-level
  - errors=`0`
  - failedBatches=`0`
  - runtime=`22.3522s`
  - peakMemory=`52232192`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `142018` occurrences
  - post counts: `9584` terms, `279132` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=142018`
  - coverage: `Genesis=36666`, `Exodus=29477`, `Leviticus=21448`, `Numbers=28655`, `Deuteronomy=25772`
  - duplicate groups=`0`
- Controlled `STEP_TAHOT` Jos-Est local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_k_pre_tahot_jos_est_full.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=107259`, `rowsValid=106536`, `rowsNormalized=189960`, `rowsSkipped=723`
  - skipped reasons: `qere_kethiv_variant_skipped=512`, `tahot_non_base_text_type_skipped=211`
  - first successful run created `4465` terms and `189913` occurrences
  - first successful run skipped `47` duplicate occurrence candidates
  - duplicateOccurrences=`47` warning-level skips
  - missingMorphology=`8658` warning-level
  - errors=`0`
  - failedBatches=`0`
  - runtime=`30.4797s`
  - peakMemory=`58523648`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `189913` occurrences
  - post counts: `14049` terms, `469045` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=331931`
  - coverage: `Joshua=18058`, `Judges=17501`, `Ruth=2258`, `1 Samuel=23439`, `2 Samuel=19418`, `1 Kings=22983`, `2 Kings=21349`, `1 Chronicles=19158`, `2 Chronicles=24016`, `Ezra=6600`, `Nehemiah=9638`, `Esther=5495`
  - duplicate groups=`0`
- Phase 5E-L2 binary-stable original term identity implementation is complete:
  - `term_identity_hash` added to `wcm_original_terms`
  - old collation-sensitive unique `term_identity` key removed
  - nonunique `term_identity_text` lookup index retained
  - binary-stable SHA-256 identity is authoritative for original terms
- Phase 5E-L3 term identity hash migration is complete:
  - backup path: `/private/tmp/wcm_phase_5e_l3_pre_term_identity_hash_migration.sql`
  - counts unchanged: `14049` terms and `469045` occurrences
  - `empty_hash_terms=0`
  - `duplicate_hash_groups=0`
- Controlled `STEP_TAHOT` Job-Sng retry local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_l4_pre_tahot_job_sng_retry.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=39090`, `rowsValid=38360`, `rowsNormalized=67815`, `rowsSkipped=730`
  - skipped reasons: `qere_kethiv_variant_skipped=213`, `tahot_non_base_text_type_skipped=41`, `psalm_title=476`
  - first successful run created `1161` terms and `67815` occurrences
  - missingMorphology=`3749` warning-level
  - errors=`0`
  - failedBatches=`0`
  - runtime=`10.6089s`
  - peakMemory=`61161472`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `67815` occurrences
  - post counts: `15210` terms, `536860` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=399746`
  - coverage: `Job=14807`, `Psalms=34226`, `Proverbs=11501`, `Ecclesiastes=5075`, `Song of Songs=2206`
  - H1004A / `בֵּית` collation conflict resolved by hash identity
  - duplicate hash groups=`0`
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
- Phase 5E-M completed.
- Controlled `STEP_TAHOT` Isa-Mal local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_m_pre_tahot_isa_mal_full.sql`
  - `batchSize=250`
  - first successful run: `rowsRead=79313`, `rowsValid=78752`, `rowsNormalized=136403`, `rowsSkipped=561`
  - skipped reasons: `qere_kethiv_variant_skipped=522`, `tahot_non_base_text_type_skipped=39`
  - first successful run created `1681` terms and `136403` occurrences
  - missingMorphology=`5569` warning-level
  - errors=`0`
  - failedBatches=`0`
  - runtime=`19.8509s`
  - peakMemory=`75317248`
  - idempotency rerun created `0` terms and `0` occurrences
  - idempotency rerun matched `136403` occurrences
  - final counts: `16891` terms, `673263` occurrences, `STEP_TAGNT=137114`, `STEP_TAHOT=536149`
  - full TAGNT NT complete
  - full TAHOT OT complete
  - OT books with TAHOT=`39`
  - OT books missing TAHOT=`0`
  - duplicate hash groups=`0`
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
- Phase 6A-1 documents the Original Language Read API contract.
- Phase 6A-2 added original-language repository read methods.
- Phase 6A-3 added the read-only Original Language REST API in commit `d8947cc`.
- Phase 6B added the read-only Word Study API in commit `510fc63`.
- Phase 6C added the high-level Interlinear API in commits `1930d36` and `d89e3aa`.
- Phase 7A documented Original Language Reader UI planning in commit `e429cd0`.
- Phase 7B through Phase 7H implemented the limited frontend Original Language Reader MVP.
- Next QA candidate: manual desktop/mobile click-through for reader, original, interlinear, original word panel, and Strong study panel.
- Later phase candidates: Word Study Term panel, occurrence distribution UI, Strong detail pages, dedicated Word Study pages, advanced search, and morphology explorer.

## Phase 6A Original Language Read API

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

Phase 6A-3 implementation status:

- Completed in commit `d8947cc`.
- Commit message: `feat(scripture): add original language read API`.
- Read-only REST API only.
- No write/import endpoints.
- No admin routes.
- No frontend.
- No raw source JSON.

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
- Lowercase aliases may be accepted only if normalized internally to canonical values.
- `source_dataset` is distinct from Bible version.

Pagination rules:

- Default `per_page=20`.
- Maximum `per_page=100`.
- Negative `page` or `per_page` values return `400 invalid_pagination`.
- Pagination is required for term occurrences and Strong's occurrence-style lists.

Safe public response fields:

- `id`
- `language_type`
- `source_dataset`
- `source_ref`
- `word_order`
- `subword_order`
- `token_type`
- `surface_form`
- `normalized_form`
- `lemma`
- `lemma_normalized`
- `strongs_number`
- `strongs_extended`
- `transliteration`
- `morphology`
- `gloss`
- `contextual_function`

Hold back from public responses:

- raw source JSON
- import diagnostics
- unapproved variant internals

Phase 6A-3 validation:

```txt
Matthew 1:1 => 8 occurrences
Genesis 1:1 => 12 occurrences
H1004 => 14 terms
G2424 => 5 terms
term lookup => success
term occurrences => success
```

Next gate:

1. Original Language Reader MVP manual browser QA.
2. Word Study Term panel, occurrence distribution UI, Strong detail pages, and dedicated Word Study pages require separate explicit approval.

## Phase 6B Word Study API

Implementation status:

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

Completed Phase 6B scope:

- Read-only API implementation.
- Data-driven only.
- No DB writes.
- No imports.
- No frontend.
- No interpretation API.
- No pictographic or gematria API.
- No authored theological explanation.
- No raw source JSON.

Implemented endpoints:

```txt
GET /wp-json/wcm/v1/word-study/strongs/{strongs_number}
GET /wp-json/wcm/v1/word-study/terms/{term_id}
GET /wp-json/wcm/v1/word-study/terms/{term_id}/distribution
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

Phase 8D current objective:

```txt
Document and implement Korean morphology display for existing morphology codes without schema/API changes.
```

Phase 8D plan:

- Phase 8D-1 morphology audit completed.
- Phase 8D-2 parser policy documentation.
- Phase 8D-3 parser utility and focused tests.
- Phase 8D-4 frontend integration.
- Phase 8D-5 browser QA.

Parser policy summary:

- Hebrew parser targets STEP_TAHOT ETCBC/OpenScriptures-style compact codes.
- Greek parser targets STEP_TAGNT James Tauber-style hyphenated and plain codes.
- Korean labels must be explicit grammar labels; English labels remain available for `en`.
- Unknown codes fall back to the raw morphology code.
- Empty punctuation/link morphology display is suppressed.
- Raw codes remain available for auditability.

## Phase 7A Original Language Reader UI Planning

Status:

```txt
Phase 7A planning is complete. Phase 7B through Phase 7H limited frontend implementation is complete. Phase 7I manual browser QA remains.
```

UI direction:

- Build a progressive original-language layer on top of the existing KRV reader.
- Keep the normal reader as the default experience.
- Show original-language depth only when the user explicitly opts in.

Reader modes:

- `Reader`
- `Original`
- `Interlinear`

UX rules:

- Chapter load fetches only normal Bible chapter data.
- Original-language and interlinear data are fetched per verse on demand.
- Do not prefetch whole-chapter interlinear data.
- OT source defaults to `STEP_TAHOT`.
- NT source defaults to `STEP_TAGNT`.

UI behavior:

- Original mode shows verse-level expandable token previews.
- Interlinear mode shows a focused selected-verse interlinear layout.
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
- `StrongOverviewPanel`
- `WordStudyPanel`

Routing strategy:

- Keep the existing route: `/{locale}/bible/{version}/{book}/{chapter}`.
- Use query modes: `?mode=reader`, `?mode=original`, and `?mode=interlinear`.
- Optional later routes: `/{locale}/bible/strongs/{strongsNumber}` and `/{locale}/bible/word-study/{termId}`.

Implementation order after explicit approval:

1. Frontend original-language types/API client.
2. Reader mode URL state.
3. Per-verse interlinear fetch.
4. Token click panel.
5. Strong overview panel.
6. Term detail panel.

Explicit exclusions:

- No authored interpretation.
- No pictographic/gematria UI.
- No full chapter interlinear prefetch.
- No frontend pages for Strong or Word Study unless separately approved.

## Required Pre-Work Before Code Changes

Before continuing Original Language Foundation work, read:

1. `AGENTS.md`
2. `docs/DEVELOPMENT_CONSTITUTION.md`
3. `docs/PROJECT_ARCHITECTURE.md`
4. `docs/BACKEND_STRUCTURE.md`
5. `docs/DECISIONS/0008-scripture-data-model.md`
6. `docs/DECISIONS/0009-bible-storage-strategy.md`
7. `docs/DECISIONS/0010-original-language-data-model.md`
8. `docs/DECISIONS/0012-scripture-relationship-model.md`
9. `docs/DECISIONS/0014-bible-import-pipeline-strategy.md`
10. `docs/DECISIONS/0015-source-data-management-strategy.md`
11. `docs/ROADMAP/PROJECT_STATUS.md`
12. `docs/ROADMAP/SCRIPTURE_ENGINE_ROADMAP.md`
13. `docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md`

Then run:

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Verify the official backend plugin path exists before any future backend implementation:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Frontend Scripture Implementation Status

Completed backend Scripture APIs:

```txt
KRV Import
Bible Lookup API
Bible Search API
Bible Chapter API
Book Metadata API
```

Implemented Reader files:

```txt
frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
frontend/src/components/scripture/BibleReader.tsx
```

Implemented Search Results files:

```txt
frontend/src/app/[locale]/bible/search/page.tsx
frontend/src/components/scripture/BibleSearchResults.tsx
frontend/src/lib/api/bible.ts
frontend/src/types/bible.ts
```

Implemented route shapes:

```txt
/ko/bible/KRV/genesis/1
/ko/bible/search?q=태초&translation=KRV
```

Implemented Reader UX polish:

```txt
Verse Anchor Navigation
Active Verse Highlight
Chapter Boundary Navigation
Bible Reader scripture spacing/style standard
```

Official Bible Reader design standard:

```txt
docs/ROADMAP/BIBLE_READER_DESIGN_STANDARD.md
```

Default Reader spacing/style:

```txt
Verse list: ol gap-0
Verse row: py-0.5
Verse anchor offset: scroll-mt-24
Verse id format: id="v16"
Verse text: leading-7
Active highlight: bg-blue-50, border-blue-200, rounded-lg, hover:bg-blue-100
Active verse number: text-blue-700
```

Reader design intent:

- Use continuous scripture reading density instead of generic blog article spacing.
- Minimize verse-to-verse vertical spacing.
- Preserve mobile readability.
- Use subtle blue active verse highlighting for search-result navigation.
- Do not use strong yellow or red active verse highlights by default.

Confirmed chapter boundary navigation examples:

```txt
Genesis 50 -> Exodus 1
Malachi 4 -> Matthew 1
Matthew 1 -> Malachi 4 via previous
Revelation 22 next disabled
Genesis 1 previous disabled
```

## Required Frontend Scripture Constraints

Frontend Scripture pages must:

- fetch only the requested chapter from the backend Chapter API
- never import or bundle a full Bible dataset
- include chapter verse list
- include previous and next chapter links
- include book and chapter selectors
- include a simple search box using paginated backend search
- include API error and empty states
- show paginated search results from the backend Search API
- stay mobile readable

Backend Chapter API:

```txt
GET /wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

Backend Search API:

```txt
GET /wp-json/wcm/v1/search
```

Backend Book Metadata API:

```txt
GET /wp-json/wcm/v1/books/{version}/{book}
```

## Original Language Foundation Constraints

Phase 5 must follow these constraints:

- Hebrew primary source candidate is STEP Bible TAHOT.
- Hebrew secondary validation/reference source is OSHB.
- Greek primary source candidate is STEP Bible TAGNT.
- Greek reference text is SBLGNT.
- MorphGNT must not be used as a primary source before ShareAlike implications are reviewed.
- OpenGNT must not be used as the first production source because of provenance and license complexity.
- Do not extend `wcm_bible_verses` for original-language data.
- Store original-language data in separate custom tables.
- Start with `wcm_original_terms` and `wcm_original_word_occurrences`.
- Use `book_id + chapter + verse` as the canonical connection point.
- Store Strong's numbers at term level, for example `H7225` and `G3056`.
- Store morphology at occurrence level.
- Treat `wcm_scripture_relationships` as discovery/ranking graph storage, not authoritative occurrence storage.
- Do not directly reuse the KRV verse importer for original-language import.
- Reuse importer patterns only where appropriate.
- Do not import OSHB, SBLGNT, or any source before license/provenance verification.
- Do not import STEP Bible, MorphGNT, OpenGNT, or any source before license/provenance verification.
- Do not bundle original-language datasets into the frontend.
- Keep UI work for later phases after data/API foundation exists.

Phase 5B may not begin until:

- Exact STEP TAHOT and STEP TAGNT files are confirmed.
- License and attribution text is documented.
- Greek edition filtering is decided.
- Hebrew versification handling is decided.
- Prefix and suffix token modeling is decided.
- Strong's normalization is decided.
- Validation rules are drafted.

Phase 5B schema design review decisions:

- Core tables are `wcm_original_terms` and `wcm_original_word_occurrences`.
- Do not extend `wcm_bible_verses`.
- Keep `wcm_scripture_relationships` as future discovery/ranking graph storage, not authoritative occurrence storage.
- Store Strong's at term level.
- Store morphology at occurrence level.
- Use `source_dataset + book_id + chapter + verse` for source-specific canonical occurrence lookup.
- Do not add `version_id` to original-language occurrences in Phase 5B.
- Include `subword_order` and `token_type` for Hebrew prefix/suffix and compound token modeling.
- Include `source_ref` for import audit and rollback.

Phase 5B implementation gate decisions:

- Allowed `language_type` values are `hebrew` and `greek`.
- Allowed `token_type` values are `word`, `prefix`, `suffix`, `punctuation`, and `variant`.
- Initial allowed `source_dataset` values are `STEP_TAHOT` and `STEP_TAGNT`.
- Future allowed `source_dataset` values are `OSHB`, `SBLGNT`, `MORPHGNT`, and `OPENGNT`.
- Base Strong's values belong in `strongs_number` using values such as `H7225` and `G3056`.
- STEP extended or disambiguated values belong in `strongs_extended`.
- Prefer normalizing absent `strongs_extended` values to an empty string during implementation.
- Phase 5B is table creation only and must not change existing Bible tables, APIs, or import pipelines.
- Rollback is manual table drop only before production original-language import.
- Phase 5C importer work must apply term, occurrence, and performance validation before any data write.

Phase 5B-1 ValueObject design decisions:

- `OriginalTerm` should be a `final readonly class` with constructor-promoted properties.
- `OriginalTerm` fields are nullable `id`, required `languageType`, `lemma`, `lemmaNormalized`, string-normalized Strong's/transliteration/root fields, and nullable `gloss`/`definition`.
- `OriginalWordOccurrence` should be a `final readonly class` with constructor-promoted properties.
- `OriginalWordOccurrence` fields are nullable `id`, term/reference/order fields, token/source fields, surface/normalized/morphology fields, and nullable grammar/context fields.
- Database timestamps do not belong in the Phase 5B-1 ValueObjects.
- `versionId` does not belong in `OriginalWordOccurrence` for Phase 5B.
- Use project-style constants before PHP enums.
- Keep constructors limited to lightweight invariant validation.
- Keep duplicate identity, source-specific validation, Greek edition filtering, Hebrew versification, and batch reports in validators/importer validation.
- Normalize raw source rows before constructing ValueObjects.

Phase 5B Original Language Data Layer implementation complete:

- `wcm_original_terms` schema table.
- `wcm_original_word_occurrences` schema table.
- `OriginalTerm`.
- `OriginalWordOccurrence`.
- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.
- `OriginalTermRepository`.
- `OriginalWordOccurrenceRepository`.

Phase 5C importer design constraints:

- Phase 5C is not dataset import.
- Source Acquisition Specification is recorded in `docs/ROADMAP/SOURCE_ACQUISITION_SPECIFICATION.md`.
- Hebrew primary source is STEP Bible TAHOT.
- Hebrew secondary validation/reference source is OSHB.
- Greek primary source is STEP Bible TAGNT.
- Greek reference text is SBLGNT.
- Floating `latest` source versions are not allowed.
- Exact source version, file name, source URL, download date, license, and attribution text must be documented before source acquisition proceeds.
- Recommended STEP storage location is `docs/data-sources/STEP/TAHOT/` and `docs/data-sources/STEP/TAGNT/`.
- STEP_TAHOT candidate files are locally available under `docs/data-sources/STEP/TAHOT/`.
- STEP_TAGNT candidate files are locally available under `docs/data-sources/STEP/TAGNT/`.
- A local `STEPBible-Data` source clone is available under `docs/data-sources/STEPBible-Data/`.
- Pinned STEP source commit for Phase 5C design is `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- License is CC BY 4.0.
- Attribution must credit STEP Bible linked to `www.STEPBible.org` and note the Tyndale House Cambridge basis.
- TAGNT first production import must use SBL-aligned filtering: include only rows whose `editions` field contains `SBL`.
- TAHOT canonical mapping must keep WCM `book_id + chapter + verse` authoritative and use an explicit Hebrew versification exception map before import.
- Hebrew prefixes, root words, suffixes, and punctuation must be modeled with `wordOrder`, `subwordOrder`, and `tokenType` when source segment data is available.
- Base Strong's values belong in `strongsNumber`; STEP disambiguation belongs in `strongsExtended`.
- Raw STEP source files remain untracked source data and must not be committed without separate approval.
- Plugin tools currently contain KRV tooling only.
- `StepTahotNormalizer`, `StepTagntNormalizer`, `OriginalLanguageVersificationResolver`, and dry-run-only `OriginalLanguageImportService` are implemented.
- Phase 5C-B1 Source Gate Hardening is complete:
  - STEP `.txt` files are recognized as `step_txt`.
  - Real TAHOT/TAGNT data header detection is implemented.
  - TAHOT/TAGNT required header validation is implemented.
  - Source metadata/report include source version, source URL, and checksum support.
  - Approved STEP path/name validation is implemented.
  - STEP CC BY 4.0 attribution validation is implemented.
  - Read-only smoke check passed for `STEP_TAHOT` and `STEP_TAGNT`.
- Phase 5D dry-run blocker fixes are complete:
  - TAGNT alternate references using `{}`, `[]`, and `()` before `#` are parsed and preserved in raw/context.
  - TAHOT non-base text types such as `X` are skipped by first-import policy.
  - TAHOT Q(K) rows are skipped and reported without variant occurrence storage.
  - Dry-run exception map handling includes `1Ch.22.17 -> 1Ch.22.16`, `1Ch.22.18 -> 1Ch.22.17`, `1Ch.22.19 -> 1Ch.22.18`, and `Rev.12.18 -> Rev.13.1`.
- Phase 5D full read-only dry-run completed with zero hard errors.
- Full dry-run aggregate:
  - TAGNT rowsRead=`142096`, rowsNormalized=`137121`, rowsSkipped=`4975`.
  - TAHOT rowsRead=`305652`, rowsNormalized=`536199`, rowsSkipped=`2267`.
  - hard errors=`0`.
- Remaining non-hard issues are `missing_morphology`, `tagnt_non_sbl_skipped`, `qere_kethiv_variant_skipped`, `tahot_non_base_text_type_skipped`, `psalm_title`, and `duplicate_occurrence` warning-level skips.
- Do not run any additional STEP, OSHB, SBLGNT, MorphGNT, OpenGNT, or original-language import without explicit approval.
- Do not build public original-language APIs, Interlinear UI, Strong's pages, Word Study UI, or other frontend surfaces before import and verification are separately approved.

Phase 5C proposed classes:

- `OriginalLanguageSourceInspector`
- `OriginalLanguageSourceMetadata`
- `SourceFileValidator`
- `SourceLicenseValidator`
- `OriginalLanguageNormalizedRow`
- `OriginalLanguageNormalizer`
- `StepTahotNormalizer`
- `StepTagntNormalizer`
- `OriginalLanguageImportValidator`
- `OriginalLanguageImportIssue`
- `OriginalLanguageImportReport`
- `OriginalLanguageImportService`

Phase 5C implementation must preserve a mandatory dry-run gate:

- `dryRun` defaults to `true`.
- Dry-run performs source inspection, normalization, validation, identity key generation, optional read-only repository matching simulation, count reporting, and issue reporting.
- Dry-run performs zero writes.
- No production import may run without a prior successful dry-run and separate explicit approval.
- Repository `save()` methods write immediately, so dry-run behavior must stay in the import service layer and must not call persistence methods.

## Validation For Next Code Change

After frontend Scripture changes, run:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

Run general checks:

```bash
git status
git diff --check
```

Test the local API host and frontend routes:

```bash
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1"
curl "http://api.wordcovenantministry.local/wp-json/wcm/v1/search?q=태초&translation=KRV&page=1&per_page=20"
```

## Not In Scope For The Next Task

- Do not run full original-language dataset imports.
- Do not run full STEP TAHOT or STEP TAGNT import.
- Do not run OSHB import.
- Do not run SBLGNT import.
- Do not download, import, or transform STEP Bible, OSHB, SBLGNT, MorphGNT, OpenGNT, or other original-language datasets yet.
- Do not run additional write-enabled original-language import execution until the next controlled import step is separately approved.
- Do not create write/import original-language APIs yet.
- Do not create a generic search engine.
- Do not build occurrence distribution UI yet.
- Do not build Strong detail pages yet.
- Do not build dedicated Word Study pages yet.
- Do not build advanced search yet.
- Do not build morphology explorer yet.
- Do not implement cross references or commentary.
- Do not bundle full Bible or original-language datasets into the frontend.

Timeline MVP release notes, the staging readiness checklist, and the staging environment plan are documented. Next objective: confirm staging frontend/API URLs and environment values, then run staging validation before any beta-tag decision.

Staging readiness review completed through available local validation: frontend build passed, and escalated route smoke returned HTTP 200 for `/ko/timeline` and `/en/timeline` on both `wordcovenantministry.local:3030` and `127.0.0.1:3030`. No deployment or beta tag was created. The staging environment plan is documented. Next objective: confirm staging target details, then run staging validation before deciding on any beta tag.
