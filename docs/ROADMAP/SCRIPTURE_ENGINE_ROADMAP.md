# Scripture Engine Roadmap

## Date

2026-06-19

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
Phase 6C-1 - Interlinear API Contract Documentation
```

OSHB, SBLGNT, frontend UI, additional Interlinear API implementation/UI, and Strong's page work remain out of scope until explicitly approved.

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
Phase 6C-1 - Interlinear API Contract Documentation
```

Implementation order after separate approval:

1. High-level Interlinear API implementation requires explicit approval.
2. Keep frontend blocked until API contracts are stable and explicitly approved.

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

### Phase 6C - Interlinear API Contract

Status:

```txt
Documentation only; implementation not started
```

Canonical high-level endpoint:

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
- No import diagnostics.
- No interpretation.
- No pictographic or gematria API fields.
- No frontend in this phase.

Implementation order after explicit approval:

1. `InterlinearService`.
2. `InterlinearController`.
3. `ApiRegistrar` route registration.
4. REST smoke checks.

Planned smoke checks:

```txt
STEP_TAGNT/matthew/1/1
STEP_TAHOT/genesis/1/1
STEP_TAHOT/psalms/119/1
STEP_TAHOT/esther/8/9
```

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

The read-only Original Language API and Word Study API are complete. Frontend surfaces have not been run. Phase 6C Interlinear API implementation requires separate explicit approval.

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

Future milestones after Reader UX Polish:

- Phase 5A - Source and Schema Analysis.
- Verify OSHB/SBLGNT or other source license/provenance.
- Define original language schema gap against ADR-0010.
- Draft original language schema implementation plan.
- Phase 5B - Original Language Schema Foundation.
- Phase 5C - Import Foundation.
- Phase 5D - Dry-run Pipeline.
- Phase 5E - Persistence Smoke Verification.
- Future - Read API Foundation.
- Later: Interlinear UI.
- Later: Word Study UI.
- Later: Cross References.
- Later: Commentary Layer.

Detailed Phase 5 plan:

```txt
docs/ROADMAP/ORIGINAL_LANGUAGE_FOUNDATION_PLAN.md
```
