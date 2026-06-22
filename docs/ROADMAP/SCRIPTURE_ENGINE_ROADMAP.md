# Scripture Engine Roadmap

## Date

2026-06-22

## Current Foundation

The Scripture Engine foundation is in place for the first KRV workflow:

- KRV source candidate inspected: `docs/data-sources/개역한글.mdb`
- Source table confirmed: `BIBLE`
- Source columns confirmed: `BOOK`, `CHAPTER`, `VERSE`, `BIBLETEXT`
- Metadata rows excluded by canonical filter.
- KRV canonical verse count confirmed and imported: `31,102`
- Psalm 72:20 corrected during JSON import.
- KRV import verification completed.
- Read-only Bible Lookup API implemented.
- Bible Search API implemented.
- Bible Chapter API implemented for Frontend Bible Reader preparation.
- Book Metadata API implemented for Reader chapter boundary navigation.
- Frontend Bible Reader MVP implemented.
- Frontend Bible Search Results MVP implemented.
- Verse Anchor Navigation implemented.
- Active Verse Highlight implemented.
- Chapter Boundary Navigation implemented.
- Original Language Reader MVP implemented through Phase 7H.
- Phase 8A frontend/menu/navigation and interlinear UX cleanup completed.
- Phase 8B Korean transliteration presentation data completed.
- Phase 8C Korean gloss presentation data completed.
- Phase 8D morphology Korean presentation completed.
- Phase 8E/8F reviewed Korean original-language coverage expansion completed through local development.
- Bible Study Workspace completed with integrated right-side research panel foundation.
- Search Workspace completed with compact concordance-style results and one-character KRV search support.
- Original Text view completed as source-text reading mode distinct from Interlinear.
- Word Study Panel completed through Strong Study, Term Study, Scripture Insight, Distribution, and Occurrence Explorer.
- Cross Reference frontend foundation added as a placeholder research panel layer.
- Gospel Harmony frontend foundation added as a placeholder workspace.
- English Bible Support has completed local WEB apply only; staging and production WEB promotion remain unapproved.
- Current stabilization focus is Scripture Research UX QA, documentation alignment, and commit preparation.

## Deployment and Seed Migration Policy

WCM release, schema, and seed migration strategy is documented in:

```txt
docs/DECISIONS/0016-deployment-version-control-strategy.md
docs/ROADMAP/DEPLOYMENT_VERSION_CONTROL_RUNBOOK.md
```

Release code should use annotated semantic Git tags such as:

```txt
v0.9.0-beta.1
v0.9.0-beta.2
v0.8.6
v0.8.7
```

The `wcm-core.php` plugin header version should match the backend plugin release version. Plugin version and Git tag should move together.

Schema changes remain tied to `SchemaInstaller` and a stored database version option such as `wcm_core_db_version`. Every schema change must increment `db_version`, and migrations should be additive and idempotent when possible.

Original-language seed imports must use stable seed IDs and dry-run/apply workflow. Current seed ID examples:

```txt
phase8f-transliteration-push
phase8f-gloss-60
phase8f-gloss-60-policy
```

Future seed ID format:

```txt
seed.original_language.gloss_ko.2026-06-21.001
```

Seed sets should record `seed_set`, `version`, `checksum`, `target_table`, `target_field`, `expected_count`, `applied_count`, and policy notes.

A future live database tracking table should record applied seed migrations:

```txt
wcm_seed_migrations
```

Proposed statuses:

```txt
dry_run_passed
applied
rolled_back
failed
```

Future rollback support should use `wcm_seed_migration_rows` or a generated backup file before apply to preserve prior row values.

## Phase Status

### Phase 1 Foundation

Status: Complete

Completed:

- Scripture custom table foundation.
- KRV source inspection and import pipeline.
- KRV `31,102` canonical verse import.
- KRV import verification.

### Phase 2 Search Layer

Status: Complete

Completed:

- Bible Search API.
- Paginated search response.
- Frontend Bible Search Results MVP.

### Phase 3 Reader Layer

Status: Complete

Completed:

- Bible Chapter API.
- Frontend Bible Reader MVP.
- Chapter verse list rendering.
- Reader route under `/[locale]/bible/[version]/[book]/[chapter]`.

### Phase 4 Reader UX Polish

Status: Mostly Complete

Completed:

- Book Metadata API.
- Verse Anchor Navigation.
- Active Verse Highlight.
- Chapter Boundary Navigation.

Remaining polish candidates:

- Search Result Highlighting.
- Reading History.
- Reader Preferences.

### Phase 5 Original Language Foundation

Status: Full Original Language Import Complete

Phase 5 started with source and schema analysis, then Phase 5B established the original-language data layer. Phase 5C completed source gate and normalizer foundation work. Phase 5D completed the dry-run import pipeline with zero hard errors.

Phase 5E verified the persistence skeleton through tiny local write smokes for `STEP_TAGNT` and `STEP_TAHOT`. It also completed the separately approved controlled `STEP_TAGNT` Mat-Jhn 1,000-row local import, full `STEP_TAGNT` Mat-Jhn local import, full `STEP_TAGNT` Act-Rev local import, controlled `STEP_TAHOT` Gen-Deu local import, controlled `STEP_TAHOT` Jos-Est local import, binary-stable original term identity migration, controlled `STEP_TAHOT` Job-Sng retry local import, and controlled `STEP_TAHOT` Isa-Mal local import. Full TAGNT NT and full TAHOT OT are imported. The project must still not proceed to public original-language APIs or frontend original-language features without separate explicit approval.

Subphases:

```txt
Phase 5A - Source and Schema Analysis
Phase 5B - Original Language Data Layer
Phase 5C - Source Gate and Normalizer Foundation
Phase 5D - Dry-run Import Pipeline
Phase 5E - Persistence Smoke Verification
Future - Read API Foundation
```

Phase 5B status:

```txt
Implementation Complete
```

Phase 5B completed:

- SchemaInstaller original language tables.
- `wcm_original_terms`.
- `wcm_original_word_occurrences`.
- `OriginalTerm` ValueObject.
- `OriginalWordOccurrence` ValueObject.
- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.
- `OriginalTermRepository`.
- `OriginalWordOccurrenceRepository`.

Phase 5C status:

```txt
Complete
```

Phase 5C completed:

- STEP source gate hardening.
- STEP `.txt` recognition as `step_txt`.
- Real TAHOT/TAGNT header detection.
- TAHOT/TAGNT required header validation.
- Source metadata and report support for source version, source URL, and checksum.
- STEP CC BY 4.0 attribution validation.
- `OriginalLanguageNormalizedRow`.
- `OriginalLanguageNormalizerInterface`.
- `StepTagntNormalizer`.
- `StepTahotNormalizer`.

Phase 5D status:

```txt
Complete
```

Phase 5D completed:

- `OriginalLanguageVersificationResolver`.
- `OriginalLanguageImportService` in dry-run-only mode.
- TAGNT alternate reference parsing for `{}`, `[]`, and `()` markers before `#`.
- TAHOT non-base text type skip policy.
- TAHOT Q(K) skip policy.
- Dry-run exception handling for `1Ch.22.17-19` and `Rev.12.18`.
- Full read-only dry-run audit with zero hard errors.

Phase 5D full dry-run aggregate:

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

Current next phase:

```txt
Scripture Research UX stabilization and commit preparation
```

OSHB, SBLGNT, additional Bible imports, WEB staging/production promotion, write/import endpoints, Cross Reference data/API, Gospel Harmony data/API, advanced search, morphology explorer, morphology schema/API changes, production deployment automation, and seed migration tracking table implementation remain out of scope until explicitly approved.

Phase 9 English Bible support and WEB import planning is documented in:

```txt
docs/ROADMAP/ENGLISH_BIBLE_SUPPORT_PLAN.md
docs/ROADMAP/WEB_IMPORT_READINESS_REVIEW.md
docs/ROADMAP/WEB_IMPORT_EXECUTION_SPEC.md
docs/ROADMAP/WEB_LOCAL_APPLY_REPORT.md
```

WEB local apply passed after source/provenance review, license review, checksum/manifest, local dry-run, expected count validation, generated file ignore policy, rollback plan, and explicit local apply approval. No WEB staging apply, production apply, schema change, migration, backend runtime change, or production database write is authorized by the roadmap.

Gospel Harmony planning is documented in:

```txt
docs/ROADMAP/GOSPEL_HARMONY_PLAN.md
```

### Phase 6A - Original Language Read API

Status:

```txt
Phase 6A-3 completed in commit d8947cc: feat(scripture): add original language read API
```

Current data state:

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
- Lowercase aliases may be accepted only if normalized internally to canonical source values.
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

Next phase:

```txt
Phase 8D - Morphology Korean Presentation
```

Next gate after separate approval:

1. Frontend original-language reader implementation.
2. Strong's or Word Study frontend pages.

### Phase 6B - Word Study API

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

```txt
term id
language_type
lemma
lemma_normalized
strongs_number
strongs_extended
transliteration
gloss
occurrence counts
book/chapter distribution
limited safe occurrence samples
```

Hold back from public responses:

```txt
raw source JSON
import diagnostics
definition
grammar_note
grammar_summary
term_identity_hash
theological interpretation
pictographic/gematria
variant internals
```

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

### Phase 6C - Interlinear API

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

### Phase 7A - Original Language Reader UI Planning

Status:

```txt
Complete in commit e429cd0; superseded by Phase 7B through Phase 7H implementation
```

UI direction:

- Add a progressive original-language layer on top of the existing KRV reader.
- Keep the normal reader as the default.
- Reveal original-language depth only when the user opts in.

Reader modes:

- `Reader`
- `Original`
- `Interlinear`

UX rules:

- Chapter load fetches only normal Bible chapter data.
- Original-language and interlinear data are fetched per verse on demand.
- Whole-chapter interlinear prefetch is excluded.
- OT source defaults to `STEP_TAHOT`.
- NT source defaults to `STEP_TAGNT`.

UI behavior:

- Original mode uses verse-level expandable token preview.
- Interlinear mode uses a focused selected-verse interlinear layout.
- Token click opens a desktop side panel.
- Token click opens a mobile bottom sheet.

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

- Keep existing reader route: `/{locale}/bible/{version}/{book}/{chapter}`.
- Use query modes: `?mode=reader`, `?mode=original`, and `?mode=interlinear`.
- Optional later routes: `/{locale}/bible/strongs/{strongsNumber}` and `/{locale}/bible/word-study/{termId}`.

Implementation order after explicit approval:

1. Frontend original-language types/API client. Complete.
2. Reader mode URL state. Complete.
3. Per-verse interlinear fetch. Complete.
4. Token click panel. Complete.
5. Strong overview panel. Complete as MVP Strong Study Panel.
6. Term detail panel. Deferred.

Explicit exclusions:

- No authored interpretation.
- No pictographic/gematria UI.
- No full chapter interlinear prefetch.
- No frontend pages for Strong or Word Study unless separately approved.

### Phase 7B-7H - Original Language Reader MVP

Status:

```txt
Limited frontend MVP implemented
```

Completed:

- `frontend/src/types/original-language.ts`.
- `frontend/src/lib/api/original-language.ts`.
- `ReaderModeControl` with `?mode=reader`, `?mode=original`, and `?mode=interlinear`.
- `VerseOriginalLanguagePreview` for lazy per-verse original-language previews.
- `InterlinearVerse` for selected-verse high-level interlinear display.
- `OriginalWordPanel` for token details.
- `StrongStudyPanel` for Strong overview summaries and grouped terms.

Performance guardrails:

- Reader mode fetches normal chapter data only.
- Original mode fetches original-language data per expanded verse.
- Interlinear mode fetches only the selected verse.
- No whole-chapter interlinear or original-language prefetch.
- No frontend dataset bundling.

### Phase 7I - Original Language Reader MVP QA

Status:

```txt
Route/API smoke QA documented; later Phase 8 browser QA supersedes remaining manual QA.
```

Route/API smoke QA completed:

- Reader, original, and interlinear frontend route requests returned `200`.
- Genesis 1:1 original-language API returned `12` occurrences.
- Genesis 1:1 high-level interlinear API returned `12` tokens.
- Matthew 1:1 high-level interlinear API returned `8` tokens.
- `H7225` Word Study Strong API returned grouped terms and summary counts.

Validation completed:

- `npm run typecheck`.
- `npm run lint`.
- `git diff --check`.

QA limitation:

- Automated desktop/mobile browser click-through was not completed because the in-app browser Node REPL tool was unavailable and no local Playwright/Puppeteer package is installed.
- Console error verification, failed-request inspection from browser devtools, panel open/close visual checks, mobile bottom-sheet behavior, loading-state timing, token click behavior, Strong click behavior, and route/query persistence still need manual browser QA.

Deferred features:

- Word Study Term panel.
- Occurrence distribution UI.
- Strong detail pages.
- Dedicated Word Study pages.
- Advanced search.
- Morphology explorer.

### Phase 8A - Frontend Foundation And Interlinear UX Cleanup

Status:

```txt
Complete
```

Completed:

- Frontend menu and page foundation.
- Mobile navigation.
- Locale switcher behavior.
- Home, footer, and landing page updates.
- Interlinear UX cleanup.
- Removed duplicate Korean verse text from the interlinear block.
- Removed remaining interlinear display headings so the block shows verse content, original-language tokens, and transliteration without section labels.
- Localized Bible reference display by locale.

### Phase 8B - Korean Transliteration Presentation Data

Status:

```txt
Complete
```

Completed:

- Added nullable `transliteration_ko` infrastructure to `wcm_original_terms`.
- Exposed `transliteration_ko` additively in original-language, interlinear, and word-study responses.
- Preserved existing `transliteration` unchanged.
- Added controlled seed import path.
- Imported reviewed Genesis 1:1 and Matthew 1:1 Korean transliteration seeds.
- Imported conservative reviewed seed batches.
- Frontend Korean locale uses `transliteration_ko` when available and falls back to source `transliteration` without pretending it is Korean.

Current known coverage:

```txt
terms with transliteration_ko=32
token occurrences covered=184519
occurrence coverage=27.4067%
```

Deferred:

- English Bible support remains Phase 9 work.
- No `gloss_ko` work belongs to Phase 8B.

### Phase 8C - Korean Gloss Presentation Data

Status:

```txt
Complete
```

Completed:

- Added nullable `gloss_ko` infrastructure to `wcm_original_terms`.
- Exposed `gloss_ko` additively in original-language, interlinear, and word-study responses.
- Preserved existing English/source `gloss` unchanged.
- Added controlled `gloss_ko` seed importer.
- Imported the first `15` reviewed Korean gloss seeds.
- Frontend Korean locale displays `뜻` when `gloss_ko` exists.
- Frontend Korean locale displays `영어 뜻` when falling back to source `gloss`.
- English locale continues to display `Gloss`.

### Phase 8D - Morphology Korean Presentation

Status:

```txt
Active
```

Goal:

Document and implement Korean morphology display for existing morphology codes without schema/API changes.

Plan:

- Phase 8D-1 morphology audit completed.
- Phase 8D-2 parser policy documentation.
- Phase 8D-3 parser utility and focused tests.
- Phase 8D-4 frontend integration.
- Phase 8D-5 browser QA.

Morphology parser policy:

- `morphology` remains occurrence-level source data.
- Phase 8D must not add morphology schema fields.
- Phase 8D must not change API response contracts.
- Hebrew parser should handle STEP_TAHOT ETCBC/OpenScriptures-style compact codes, including optional leading `H` or `A`, noun/adjective gender-number-state patterns, particles/prepositions/conjunctions, verb stem/form/person/gender/number patterns, and suffix-pronoun patterns.
- Greek parser should extend the current frontend formatter for STEP_TAGNT James Tauber-style codes, including hyphenated codes like `N-NSF` and `V-AAI-3S`, and plain codes like `CONJ`, `PREP`, `ADV`, `PRT`, and `PRT-N`.
- Korean labels should use clear grammar terms such as `명사`, `동사`, `여성`, `단수`, `주격`, `전치사`, `접속사`, `부정과거`, `능동태`, and `직설법`.
- English labels remain available for `en` locale.
- Unknown or partially unsupported codes fall back to the raw code.
- Empty morphology on punctuation/link markers should be suppressed in frontend display.
- Raw morphology code remains available in detailed study UI for auditability.

Phase 5E local write smoke summary:

```txt
Persistence skeleton commit: 24a0d24
Local DB connectivity: restored through Local Site Shell
Confirmed tables: wp_wcm_original_terms, wp_wcm_original_word_occurrences

STEP_TAGNT smoke:
maxRows=3
batchSize=1
first run created terms=3 occurrences=3
rerun matched terms=3 occurrences=3
duplicates=0

STEP_TAHOT smoke:
maxRows=3
batchSize=1
first run created terms=4 occurrences=4
rerun matched terms=4 occurrences=4
Hebrew expansion confirmed
duplicates=0

Pre-controlled-import local DB smoke state:
terms=7
occurrences=7
```

Phase 5E controlled TAGNT Mat-Jhn 1,000-row import summary:

```txt
Backup path: /private/tmp/wcm_phase_5e_g_pre_tagnt_1000.sql
sourceDataset=STEP_TAGNT
maxRows=1000
batchSize=100

Pre counts:
terms=7
occurrences=7
STEP_TAGNT=3
STEP_TAHOT=4
duplicate term groups=0
duplicate occurrence groups=0

First successful run:
rowsRead=1000
rowsValid=988
rowsNormalized=988
rowsSkipped=12
termsCreated=273
termsMatched=242
occurrencesCreated=985
occurrencesMatched=3
errors=0
warnings=0
failedBatches=0

Rerun idempotency:
termsCreated=0
occurrencesCreated=0
termsMatched=515
occurrencesMatched=988

Post counts:
terms=280
occurrences=992
STEP_TAGNT=988
STEP_TAHOT=4
duplicate term groups=0
duplicate occurrence groups=0
```

Full TAGNT Mat-Jhn import was later completed under separate explicit approval. The read-only Original Language API was later added in Phase 6A-3. Frontend surfaces have not been added.

Phase 5E full TAGNT Mat-Jhn import summary:

```txt
Backup path: /private/tmp/wcm_phase_5e_h_pre_tagnt_mat_jhn_full.sql
sourceDataset=STEP_TAGNT
batchSize=250

First successful run:
rowsRead=66984
rowsNormalized=64205
rowsSkipped=2779
termsCreated=2731
occurrencesCreated=63217
occurrencesMatched=988
errors=0
failedBatches=0
runtime=10.6752s

Rerun idempotency:
termsCreated=0
occurrencesCreated=0
occurrencesMatched=64205

Post counts:
terms=3011
occurrences=64209
STEP_TAGNT=64205
STEP_TAHOT=4

Coverage:
Matthew=18297
Mark=11091
Luke=19408
John=15409

duplicate groups=0
blank TAGNT morphology rows=0
```

TAGNT Act-Rev import was later completed under separate explicit approval. TAHOT Gen-Deu was later completed under separate explicit approval. Other TAHOT files, full OT, public original-language API, and frontend surfaces have not been run.

Phase 5E full TAGNT Act-Rev import summary:

```txt
Backup path: /private/tmp/wcm_phase_5e_i_pre_tagnt_act_rev_full.sql
sourceDataset=STEP_TAGNT
batchSize=250

First successful run:
rowsRead=75112
rowsNormalized=72916
rowsSkipped=2196
termsCreated=2562
occurrencesCreated=72909
occurrencesSkipped=7
duplicateOccurrences=7 warning-level skips
errors=0
failedBatches=0
runtime=12.2309s

Rerun idempotency:
termsCreated=0
occurrencesCreated=0
occurrencesMatched=72909
errors=0

Post counts:
terms=5573
occurrences=137118
STEP_TAGNT=137114
STEP_TAHOT=4

Full TAGNT NT imported:
Mat-Jhn already completed
Act-Rev completed

duplicate groups=0
blank TAGNT morphology rows=0
```

Phase 5E controlled TAHOT Gen-Deu import summary:

```txt
Backup path: /private/tmp/wcm_phase_5e_j_pre_tahot_gen_deu_full.sql
sourceDataset=STEP_TAHOT
batchSize=250

First successful run:
rowsRead=79990
rowsValid=79737
rowsNormalized=142021
rowsSkipped=253
qere_kethiv_variant_skipped=76
tahot_non_base_text_type_skipped=177
psalm_title=0
termsCreated=4011
occurrencesCreated=142014
occurrencesMatched=4
occurrencesSkipped=3
missingMorphology=6412
errors=0
failedBatches=0
runtime=22.3522s
peakMemory=52232192

Rerun idempotency:
termsCreated=0
occurrencesCreated=0
occurrencesMatched=142018

Post counts:
terms=9584
occurrences=279132
STEP_TAGNT=137114
STEP_TAHOT=142018

Coverage:
Genesis=36666
Exodus=29477
Leviticus=21448
Numbers=28655
Deuteronomy=25772

duplicate groups=0
```

Phase 5E full original language import summary:

```txt
Term identity hash migration:
term_identity_hash added to wcm_original_terms
old collation-sensitive unique term_identity key removed
nonunique term_identity_text lookup index retained
binary-stable SHA-256 identity authoritative
migration backup: /private/tmp/wcm_phase_5e_l3_pre_term_identity_hash_migration.sql
migration terms=14049 unchanged
migration occurrences=469045 unchanged
empty_hash_terms=0
duplicate_hash_groups=0

Job-Sng backup path: /private/tmp/wcm_phase_5e_l4_pre_tahot_job_sng_retry.sql
Job-Sng rowsRead=39090
Job-Sng rowsValid=38360
Job-Sng rowsNormalized=67815
Job-Sng rowsSkipped=730
Job-Sng qere_kethiv_variant_skipped=213
Job-Sng tahot_non_base_text_type_skipped=41
Job-Sng psalm_title=476
Job-Sng termsCreated=1161
Job-Sng occurrencesCreated=67815
Job-Sng missingMorphology=3749
Job-Sng errors=0
Job-Sng failedBatches=0
Job-Sng runtime=10.6089s
Job-Sng peakMemory=61161472
Job-Sng idempotency termsCreated=0
Job-Sng idempotency occurrencesCreated=0
Job-Sng idempotency occurrencesMatched=67815

Isa-Mal backup path: /private/tmp/wcm_phase_5e_m_pre_tahot_isa_mal_full.sql
Phase 5E-M completed
sourceDataset=STEP_TAHOT
batchSize=250

Isa-Mal first successful run:
rowsRead=79313
rowsValid=78752
rowsNormalized=136403
rowsSkipped=561
qere_kethiv_variant_skipped=522
tahot_non_base_text_type_skipped=39
termsCreated=1681
occurrencesCreated=136403
missingMorphology=5569
errors=0
failedBatches=0
runtime=19.8509s
peakMemory=75317248

Isa-Mal rerun idempotency:
termsCreated=0
occurrencesCreated=0
occurrencesMatched=136403

Final counts:
terms=16891
occurrences=673263
STEP_TAGNT=137114
STEP_TAHOT=536149

Job-Sng coverage:
Job=14807
Psalms=34226
Proverbs=11501
Ecclesiastes=5075
Song of Songs=2206

Isa-Mal coverage:
Isaiah=28536
Jeremiah=37565
Lamentations=2599
Ezekiel=32848
Daniel=10362
Hosea=4070
Joel=1620
Amos=3416
Obadiah=495
Jonah=1238
Micah=2372
Nahum=911
Habakkuk=1124
Zephaniah=1279
Haggai=1067
Zechariah=5433
Malachi=1468

full TAGNT NT complete
full TAHOT OT complete
OT books with TAHOT=39
OT books missing TAHOT=0
H1004A / בֵּית collation conflict resolved by hash identity
duplicate hash groups=0
duplicate term groups=0
duplicate occurrence groups=0
```

The read-only Original Language API, Word Study API, high-level Interlinear API, and limited Original Language Reader MVP frontend implementation are complete. Manual desktop/mobile browser QA remains the next gate before expanding Word Study UI.

Phase 5A entry requirements:

- Verify OSHB, SBLGNT, or other source license and provenance.
- Inspect source format before import or transformation.
- Define schema gaps against ADR-0010.
- Draft an implementation plan before schema changes.

Core storage decision:

- Do not extend `wcm_bible_verses` for original-language data.
- Store original-language data in separate custom tables.
- Use `book_id + chapter + verse` as the common canonical reference.
- Treat `wcm_scripture_relationships` as discovery/ranking graph storage, not authoritative word occurrence storage.

Recommended core tables:

```txt
wcm_original_terms
wcm_original_word_occurrences
```

Future related tables:

```txt
wcm_hebrew_letters
wcm_word_letter_breakdowns
wcm_pictographic_observations
wcm_scripture_relationships
```

Strong's strategy:

- Store Strong's numbers at term level.
- Examples: `H7225`, `G3056`.
- Use a non-unique index initially unless source validation proves uniqueness.

Morphology strategy:

- Store morphology at occurrence level.
- Same lemma may have different morphology, parsing, grammar, and contextual function in different verse contexts.

## Current Domain Model

The accepted Scripture model is defined by ADR-0008 and ADR-0009:

- `BibleVersion`
- `BibleVerse`
- `ScriptureReference`
- `ScriptureReferenceRange`
- `ScriptureRelationship`

Bible text storage uses custom tables:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

Scripture relationships are planned through ADR-0012 and will use explicit structured relationship data instead of tags or plain text labels.

## Current Plugin Structure

Official plugin path:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Current Scripture-related directories:

```txt
src/Scripture/Import/
src/Scripture/Repositories/
src/Scripture/Validators/
src/Scripture/ValueObjects/
```

Current API files:

```txt
src/Api/ApiRegistrar.php
src/Api/BibleController.php
src/Api/BibleSearchController.php
```

Current repository:

```txt
src/Scripture/Repositories/BibleRepository.php
src/Scripture/Repositories/OriginalTermRepository.php
src/Scripture/Repositories/OriginalWordOccurrenceRepository.php
```

Current search placeholder:

```txt
src/Search/.gitkeep
```

Bible Lookup, Bible Search, Bible Chapter, and Book Metadata APIs exist.

## Bible Lookup API

Current route:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}/{verse}
```

Current registration flow:

1. `Plugin.php` registers API setup through `rest_api_init`.
2. `ApiRegistrar.php` calls `BibleController()->registerRoutes()`.
3. `BibleController.php` registers the lookup route.
4. `BibleController` sanitizes and validates request params.
5. `BibleController` resolves version, book, and verse through `BibleRepository`.
6. `BibleRepository` reads from custom Bible tables.

Repository methods currently used for lookup:

```txt
getVersionByCode(string $code): ?array
getBookBySlug(string $slug): ?array
getVerse(int $versionId, int $bookId, int $chapter, int $verse): ?array
getChapterVerses(int $versionId, int $bookId, int $chapter): array
searchVerses(string $query, ?string $translation, int $page, int $perPage): array
```

## Bible Chapter API

Current route:

```txt
/wp-json/wcm/v1/bible/{version}/{book}/{chapter}
```

This route exists to support Frontend Bible Reader chapter rendering without repeated single-verse API calls or frontend Bible dataset imports.

## Book Metadata API

Current route:

```txt
/wp-json/wcm/v1/books/{version}/{book}
```

This route exists to support Reader chapter boundary navigation without bundling Bible book metadata as a full frontend Bible dataset.

## Current Frontend Scripture Milestone

The current frontend Scripture milestone includes the Bible Reader MVP, Bible Search Results MVP, and Reader UX Polish.

Recommended implementation location:

```txt
Route: frontend/src/app/[locale]/bible/[version]/[book]/[chapter]/page.tsx
Component: frontend/src/components/scripture/BibleReader.tsx
API client: frontend/src/lib/api/bible.ts
Types: frontend/src/types/bible.ts or frontend/src/types/scripture.ts
```

The Reader should consume only the needed chapter from the backend Chapter API and book chapter count from the Book Metadata API.

Search results implementation location:

```txt
Route: frontend/src/app/[locale]/bible/search/page.tsx
Component: frontend/src/components/scripture/BibleSearchResults.tsx
API client: frontend/src/lib/api/bible.ts
Types: frontend/src/types/bible.ts
```

The Search Results page should consume only paginated backend Search API responses.

## Bible Search API

```txt
GET /wp-json/wcm/v1/search
```

The first Bible Search API is implemented for paginated text search.

Do not create a dedicated frontend search engine in the Reader MVP.

Only consider a future service when search expands into:

- ranking
- highlighting
- language-specific tokenization
- multi-version comparison
- result grouping
- dedicated search index integration

Possible future service path:

```txt
src/Scripture/Services/BibleSearchService.php
```

Do not create this service in the first Bible Search API unless the need is concrete.

## Do Not Use Backend `src/Search/` Yet

Do not implement the first Bible Search API directly in:

```txt
src/Search/
```

Reason:

- `src/Search/` is currently empty except for `.gitkeep`.
- It appears reserved for a future generic search engine.
- Bible text search is tightly coupled to the Scripture domain and `wcm_bible_verses`.
- The first implementation should stay close to `BibleRepository` and the existing Bible API controller pattern.

## Bible Search API Required Constraints

The first Bible Search API must:

- require `query`
- enforce a minimum query length
- support `page`
- support `per_page`
- enforce a strict `per_page` maximum
- require or constrain `version`
- never return the full Bible dataset
- start with `LIKE` search
- avoid `FULLTEXT` dependency

Reason:

ADR-0009 mentions `FULLTEXT KEY text_search (text)`, but the current `SchemaInstaller.php` does not create a `FULLTEXT` index on `wcm_bible_verses`.

## Future Scripture Engine Work

Current and future milestones:

- Phase 8D Korean morphology presentation parser documentation and implementation.
- Phase 8D browser QA for Korean and English morphology display.
- Word Study Term panel.
- Occurrence distribution UI.
- Strong detail pages.
- Dedicated Word Study pages.
- Advanced search.
- Morphology explorer.
- Gospel Harmony frontend foundation and future event-unit planning. Planning: `docs/ROADMAP/GOSPEL_HARMONY_PLAN.md`.
- Phase 9 English Bible support and WEB import, after separate approval. Planning: `docs/ROADMAP/ENGLISH_BIBLE_SUPPORT_PLAN.md`.
- Phase 10 Hebrew-Greek Bridge and Revelation Lexicon Foundation, after Phase 8 original-language MVP stabilization and separate approval.
- Later: Cross References.
- Later: Commentary Layer.

Detailed Phase 5 plan:

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```

Future Hebrew-Greek bridge planning:

```txt
docs/ROADMAP/HEBREW_GREEK_BRIDGE_PLAN.md
```
