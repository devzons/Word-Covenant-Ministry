# Original Language Foundation Plan

## Date

2026-06-19

## Purpose

This ROADMAP document records the Phase 5 Original Language Foundation plan so future sessions can continue from the current Scripture Engine state without relying on conversation history.

This is not a new ADR. It concretizes ADR-0010 Original Language Data Model and ADR-0012 Scripture Relationship Model into implementation phases and entry gates.

## Current Entry Point

Current official phase:

```txt
Phase 8D - Morphology Korean Presentation
```

Next major phase:

```txt
Manual desktop/mobile browser QA, then Word Study Term panel or UX polish after explicit approval
```

Phase 5D Original Language dry-run pipeline is complete. The dry-run pipeline includes source gates, source-specific normalizers, versification resolution, dry-run import service behavior, and full STEP_TAHOT / STEP_TAGNT read-only audit results with zero hard errors.

Phase 5E tiny local persistence smokes are complete. They verify the persistence skeleton and idempotent repository matching behavior for `STEP_TAGNT` and `STEP_TAHOT` using `maxRows=3` and `batchSize=1`.

The approved controlled `STEP_TAGNT` Mat-Jhn 1,000-row local import is also complete. It used `maxRows=1000`, `batchSize=100`, and the backup path `/private/tmp/wcm_phase_5e_g_pre_tagnt_1000.sql`.

The approved full `STEP_TAGNT` Mat-Jhn local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_h_pre_tagnt_mat_jhn_full.sql`.

The approved full `STEP_TAGNT` Act-Rev local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_i_pre_tagnt_act_rev_full.sql`. Full TAGNT NT is imported.

The approved controlled `STEP_TAHOT` Gen-Deu local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_j_pre_tahot_gen_deu_full.sql`.

The approved controlled `STEP_TAHOT` Jos-Est local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_k_pre_tahot_jos_est_full.sql`.

The approved binary-stable original term identity implementation and migration are complete. `term_identity_hash` is now the authoritative original term identity, the old collation-sensitive unique `term_identity` key has been removed, and the nonunique `term_identity_text` lookup index is retained.

The approved controlled `STEP_TAHOT` Job-Sng retry local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_l4_pre_tahot_job_sng_retry.sql`.

The approved controlled `STEP_TAHOT` Isa-Mal local import is complete. It used `batchSize=250` and the backup path `/private/tmp/wcm_phase_5e_m_pre_tahot_isa_mal_full.sql`. Full TAGNT NT and full TAHOT OT are imported. Phase 6A added the Original Language Read API in commit `d8947cc` (`feat(scripture): add original language read API`). Phase 6B added the Word Study API in commit `510fc63` (`feat(scripture): add word study API`). Phase 6C added the high-level Interlinear API in commits `1930d36` and `d89e3aa`. Phase 7A documented the Original Language Reader UI planning direction. Phase 7B through Phase 7H implemented the limited frontend Original Language Reader MVP. Phase 8A frontend/navigation cleanup, Phase 8B Korean transliteration data, and Phase 8C Korean gloss data are complete. Phase 8D is current for Korean morphology presentation. This does not approve write/import endpoints, additional source imports, raw source export, occurrence dumps, distribution charts, dedicated Strong detail pages, dedicated Word Study pages, advanced search, morphology explorer, English Bible support, WEB import, morphology schema/API changes, or interpretation/pictographic/gematria APIs.

## Phase 6A Original Language Read API

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

Implemented read-only API scope:

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

## Phase 7A Original Language Reader UI Planning

Status:

```txt
Complete in commit e429cd0; superseded by Phase 7B through Phase 7H implementation
```

UI direction:

- Build a progressive original-language layer on top of the existing KRV reader.
- Keep the normal reader as the default experience.
- Show original-language depth only when the user opts in.

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

## Phase 7B-7I Original Language Reader MVP

Status:

```txt
Phase 7B through Phase 7H limited frontend implementation is complete. Phase 7I route/API smoke QA is documented. Later Phase 8 browser QA supersedes the original manual QA gate.
```

Implemented MVP features:

- Shared frontend original-language TypeScript contracts.
- Original Language, Word Study, and high-level Interlinear API client methods.
- Reader mode control with `reader`, `original`, and `interlinear` query state.
- Original mode expandable per-verse original-language previews.
- Interlinear mode selected-verse high-level interlinear view.
- Original word panel opened by token click.
- Strong study panel opened from the original word panel.
- Lazy per-verse API loading and component-level caching.
- OT source routing to `STEP_TAHOT`.
- NT source routing to `STEP_TAGNT`.

Validation completed:

- `npm run typecheck`.
- `npm run lint`.
- `git diff --check`.
- Frontend route smoke checks for reader, original, and interlinear modes returned `200`.
- Read-only API smoke checks for original-language verse, high-level interlinear verse, and Strong study returned `200`.

Historical QA limitation:

```txt
Automated browser click-through for desktop and mobile was not completed because the in-app browser Node REPL tool was unavailable and no local Playwright/Puppeteer package is installed.
```

Current QA handoff:

- Phase 8D-5 should perform browser QA for Korean and English morphology presentation.
- Browser QA should include reader/original/interlinear flows, tooltip/panel behavior, console errors, network failures, and mobile layout.
- Strong study panel back/close behavior.
- Route/query persistence.

Deferred features:

- Word Study Term panel.
- Occurrence distribution UI.
- Strong detail pages.
- Dedicated Word Study pages.
- Advanced search.
- Morphology explorer.

## Phase 8B Korean-First Original Language Presentation Data

Status:

```txt
Complete
```

Purpose:

Phase 8B defines how original-language terms should gain Korean-first display metadata for Korean readers while preserving the current original-language source data and existing response fields.

Phase 8B implemented `transliteration_ko` as additive Korean presentation data. It added nullable schema support, read-only API exposure, controlled seed import tooling, Genesis 1:1 and Matthew 1:1 reviewed seed values, and conservative reviewed seed batches.

Current known Phase 8B coverage:

```txt
terms with transliteration_ko=32
token occurrences covered=184519
occurrence coverage=27.4067%
```

### Current Limitation

The current original-language data model and public responses expose source-oriented fields:

```txt
transliteration
gloss
```

These fields are useful for source audit and basic display, but they are not Korean-first presentation fields. The existing `transliteration` value is not guaranteed to be Hangul-readable, and the existing `gloss` value is not guaranteed to be Korean. As a result, Korean readers may see original-language panels and interlinear tokens that still depend on English-oriented source glosses or academic romanization.

This limitation affects presentation only. It does not invalidate the imported STEP_TAHOT or STEP_TAGNT source data, original term identity, occurrence identity, morphology data, Strong's lookup behavior, or current read-only API contracts.

### Korean Transliteration Field Strategy

Phase 8B should preserve the existing source/import transliteration field and add Korean presentation transliteration as separate data.

Proposed future field:

```txt
transliteration_ko
```

Field rules:

- `transliteration` remains the source-oriented transliteration field.
- `transliteration_ko` is a Korean-facing Hangul pronunciation aid for display.
- `transliteration_ko` must be additive and nullable.
- `transliteration_ko` must not replace `lemma`, `lemma_normalized`, `surface_form`, `normalized_form`, `strongs_number`, or `strongs_extended`.
- `transliteration_ko` should belong to term-level presentation data unless a later source review proves occurrence-level variation is required.
- Generated or curated Korean transliteration rules require separate review before persistence.
- Phase 8B implemented infrastructure and approved reviewed seed values only; it did not implement full-corpus generation.

### Korean Gloss Field Strategy

Phase 8B originally planned Korean gloss as future presentation data. Phase 8C later implemented the approved `gloss_ko` infrastructure, seed importer, first reviewed seeds, and frontend display/fallback.

Proposed future field:

```txt
gloss_ko
```

Field rules:

- `gloss` remains the source-oriented gloss field.
- `gloss_ko` is a concise Korean lexical gloss for reader-facing display.
- `gloss_ko` must be additive and nullable.
- `gloss_ko` must not become authored interpretation, theology, commentary, pictographic observation, or grammar explanation.
- `gloss_ko` should prefer short lexical meaning suitable for token panels and Strong study summaries.
- Longer Korean explanation, definition, or ministry-authored interpretation belongs in a later Word Study or editorial content phase, not Phase 8B presentation fields.

### Additive API Response Plan

Future API work may add Korean presentation fields to existing original-language, interlinear, and word-study responses without removing or renaming current fields.

Phase 8B implemented read-only exposure for `transliteration_ko`.

Phase 8C implemented read-only exposure for `gloss_ko`.

Candidate additive response fields:

```txt
transliteration_ko
gloss_ko
```

API rules:

- Existing `transliteration` and `gloss` fields remain stable.
- Existing clients must continue to work if Korean presentation fields are absent.
- New Korean fields must be nullable or omitted when unavailable.
- Responses must not include full datasets, raw source JSON, import diagnostics, theological interpretation, pictographic fields, or gematria fields.
- API changes beyond the completed additive `transliteration_ko` and `gloss_ko` response fields require separate approval and validation because they change the public response contract.

### Frontend Fallback Rule

Frontend display should prefer Korean presentation fields when they exist, then fall back safely to current source fields.

Planned display priority:

```txt
Transliteration display:
transliteration_ko -> transliteration -> empty unavailable state

Gloss display:
gloss_ko -> gloss -> empty unavailable state
```

Fallback rules:

- Do not silently label `transliteration` as Korean transliteration.
- Do not silently label `gloss` as Korean gloss.
- If only source-oriented fields are available, the UI may display them as source/original-language data, not as Korean-localized data.
- Empty unavailable states are preferred over misleading localization.
- Frontend behavior changes require separate implementation approval.

### English Bible Support Deferred To Phase 9

Phase 8B is Korean-first and should not expand the English Bible experience.

Deferred to Phase 9:

- English Bible reader original-language presentation strategy.
- English-specific gloss strategy beyond the existing source `gloss`.
- English-localized transliteration or pronunciation policy.
- English WEB-centered original-language reader behavior.
- Cross-locale SEO or metadata behavior for original-language study pages.

Korean presentation data may later inform English support, but Phase 8B must not implement or imply English Bible feature parity.

### Explicit Non-Implementation Scope

Phase 8B and Phase 8C completion does not approve:

- Full-corpus generated Korean transliteration.
- Unreviewed Korean gloss imports.
- Source data changes.
- New endpoints.
- New committed generated data.
- English Bible support.
- WEB import.
- Morphology schema/API changes.
- Theological interpretation, commentary, pictographic, or gematria fields.

## Phase 8C Korean Gloss Presentation Data

Status:

```txt
Complete
```

Completed:

- `gloss_ko` nullable schema support on `wcm_original_terms`.
- Additive read-only API exposure alongside existing `gloss`.
- Controlled `gloss_ko` seed importer.
- First `15` reviewed Korean gloss seeds.
- Frontend Korean locale displays `뜻` when `gloss_ko` exists.
- Frontend Korean locale displays `영어 뜻` when falling back to source `gloss`.
- English locale continues to display `Gloss`.

## Phase 8D Morphology Korean Presentation

Status:

```txt
Active
```

Goal:

Document and implement Korean morphology display for existing morphology codes without schema/API changes.

Phase 8D plan:

- Phase 8D-1 morphology audit completed.
- Phase 8D-2 parser policy documentation.
- Phase 8D-3 parser utility and focused tests.
- Phase 8D-4 frontend integration.
- Phase 8D-5 browser QA.

### Morphology Parser Policy

Raw morphology remains occurrence-level source data:

```txt
wcm_original_word_occurrences.morphology
```

Phase 8D must not add morphology schema fields and must not change API response contracts.

Hebrew parser approach:

- Target STEP_TAHOT ETCBC/OpenScriptures-style compact codes.
- Handle optional leading `H` or `A` language marker.
- Parse noun/adjective gender-number-state patterns such as `Ncfsa` and `HNcmsc`.
- Parse particles, prepositions, conjunctions, object indicators, and articles such as `HR`, `HC`, `HTd`, and `HTo`.
- Parse verb stem/form/person/gender/number patterns such as `HVqp3ms`.
- Parse suffix-pronoun patterns such as `Sp3ms`.

Greek parser approach:

- Extend the existing frontend morphology formatter.
- Parse STEP_TAGNT James Tauber-style hyphenated codes such as `N-NSF`, `T-NSM`, `V-AAI-3S`, and `V-2AAI-3S`.
- Parse plain STEP_TAGNT codes such as `CONJ`, `PREP`, `ADV`, `PRT`, and `PRT-N`.

Presentation labels:

- Korean labels should use clear grammar terms such as `명사`, `동사`, `여성`, `남성`, `단수`, `복수`, `주격`, `목적격`, `전치사`, `접속사`, `부정과거`, `능동태`, and `직설법`.
- English labels should remain available for `en` locale, such as `Noun`, `Verb`, `Feminine`, `Singular`, `Nominative`, `Preposition`, and `Conjunction`.
- Unknown or partially unsupported codes must fall back to the raw morphology code.
- Empty morphology on punctuation/link markers should be suppressed in frontend display.
- Raw morphology code should remain available in detailed study UI for auditability.

## Phase 5 Breakdown

### Phase 5A - Source and Schema Analysis

Goals:

- Verify STEP Bible TAHOT, STEP Bible TAGNT, OSHB, SBLGNT, or other source license and provenance.
- Inspect source format before downloading, importing, or transforming data.
- Compare available source fields against ADR-0010.
- Define schema gaps before code changes.
- Define validation rules for original-language terms and occurrences.

Phase 5A source recommendation:

- Hebrew primary source candidate: STEP Bible TAHOT.
- Hebrew secondary validation/reference source: OSHB.
- Greek primary source candidate: STEP Bible TAGNT.
- Greek reference text: SBLGNT.
- MorphGNT must not be used as a primary source before ShareAlike implications are reviewed.
- OpenGNT must not be used as the first production source because of provenance and license complexity.

Exit criteria:

- Source candidate documented.
- License/provenance verified.
- Source format and expected fields documented.
- Schema gap against ADR-0010 documented.
- Import readiness decision made.

Phase 5B entry requirements:

- Confirm exact STEP TAHOT and STEP TAGNT source files and field headers.
- Document license and attribution text for selected sources.
- Decide Greek edition filtering rules for STEP TAGNT before schema work.
- Decide Hebrew versification handling before schema work.
- Decide prefix and suffix token modeling for Hebrew and Greek source rows.
- Decide Strong's normalization rules, including original Strong's and Extended Strong's handling.
- Draft validation rules for missing lemma, missing morphology, missing Strong's number, invalid canonical reference, duplicate occurrence identity, edition membership, and source row provenance.

### Phase 5B - Original Language Data Layer

Status:

```txt
Implementation Complete
```

Goals:

- Add custom table foundation after Phase 5A approval.
- Keep original-language data separate from translated Bible text.
- Preserve canonical Scripture reference as the shared connection point.
- Add ValueObjects, validators, and repositories for the original-language data layer before importer work.

Recommended core tables:

```txt
wcm_original_terms
wcm_original_word_occurrences
```

Future tables:

```txt
wcm_hebrew_letters
wcm_word_letter_breakdowns
wcm_pictographic_observations
wcm_scripture_relationships
```

Schema rules:

- Do not extend `wcm_bible_verses` for original-language token data.
- Do not add hard foreign key constraints unless separately approved.
- Use indexes for lookup by language, Strong's number, canonical reference, and term occurrence.
- Do not use `wcm_scripture_relationships` as authoritative occurrence storage. It remains a future discovery, ranking, and knowledge-graph table.
- Do not add `version_id` to original-language occurrences in Phase 5B. Use `source_dataset` plus canonical reference instead.

#### Phase 5B Final Schema Proposal

Phase 5B core tables:

```txt
wcm_original_terms
wcm_original_word_occurrences
```

Original-language data must not extend `wcm_bible_verses`.

`wcm_scripture_relationships` remains a future discovery and ranking graph. It is not authoritative storage for original word occurrences.

##### wcm_original_terms

Final columns:

```txt
id
language_type
lemma
lemma_normalized
strongs_number
strongs_extended
transliteration
root
gloss
definition
created_at
updated_at
```

Column notes:

- `language_type`: `hebrew` or `greek`.
- `lemma_normalized`: deterministic import and search key.
- `strongs_number`: normalized base lookup value such as `H7225` or `G3056`.
- `strongs_extended`: STEP disambiguated or extended value. Implementation may store this as nullable or normalize absent values to an empty string.
- `root`: required for ADR-0010 root tracking and future Hebrew root study.
- `definition`: optional, but reserved for future STEP lexicon-derived term pages.
- Editorial `notes` are not part of the Phase 5B schema.

##### wcm_original_word_occurrences

Final columns:

```txt
id
term_id
book_id
chapter
verse
word_order
subword_order
token_type
surface_form
normalized_form
morphology
grammar_summary
grammar_note
contextual_function
source_dataset
source_ref
created_at
updated_at
```

Column notes:

- `morphology` is occurrence-level data.
- `subword_order` supports Hebrew prefixes, suffixes, and compound token expansion.
- `token_type` recommended values are `word`, `prefix`, `suffix`, `punctuation`, and `variant`.
- `source_dataset` identifies the source stream, such as `STEP_TAHOT` or `STEP_TAGNT`.
- `source_ref` stores a source row id, source word id, or deterministic import reference for audit and rollback.
- `version_id` is not included in Phase 5B.
- Occurrence identity uses `source_dataset` plus canonical reference and token order.

##### Phase 5B Index Strategy

`wcm_original_terms` indexes:

```txt
PRIMARY KEY (id)
KEY language_strongs (language_type, strongs_number)
KEY language_extended_strongs (language_type, strongs_extended)
KEY language_lemma (language_type, lemma_normalized)
KEY language_root (language_type, root)
```

`wcm_original_word_occurrences` indexes:

```txt
PRIMARY KEY (id)
KEY verse_lookup (source_dataset, book_id, chapter, verse)
KEY interlinear_lookup (source_dataset, book_id, chapter, verse, word_order, subword_order)
KEY term_lookup (term_id)
KEY term_reference_lookup (term_id, book_id, chapter, verse)
KEY source_ref_lookup (source_dataset, source_ref)
```

##### Phase 5B Unique Strategy

`wcm_original_terms` unique identity:

```txt
UNIQUE KEY term_identity (
  language_type,
  lemma_normalized,
  strongs_number,
  strongs_extended
)
```

Implementation caution:

- MySQL nullable unique behavior must be handled intentionally.
- Implementations should either normalize absent `strongs_extended` values to an empty string or guarantee uniqueness through importer validation.

`wcm_original_word_occurrences` unique identity:

```txt
UNIQUE KEY occurrence_identity (
  source_dataset,
  book_id,
  chapter,
  verse,
  word_order,
  subword_order,
  token_type
)
```

##### Phase 5B Enum And Naming Lock

`language_type` allowed values:

```txt
hebrew
greek
```

`token_type` allowed values:

```txt
word
prefix
suffix
punctuation
variant
```

Initial `source_dataset` allowed values:

```txt
STEP_TAHOT
STEP_TAGNT
```

Future `source_dataset` allowed values:

```txt
OSHB
SBLGNT
MORPHGNT
OPENGNT
```

Strong's normalization:

- Base Strong's values are stored in `strongs_number`.
- Base Strong's format examples are `H7225` and `G3056`.
- STEP extended or disambiguated values are stored in `strongs_extended`.
- Phase 5B implementation should prefer normalizing absent `strongs_extended` values to an empty string.
- MySQL nullable unique behavior must be handled intentionally if `strongs_extended` remains nullable.

Canonical reference naming:

```txt
book_id
chapter
verse
```

Order naming:

```txt
word_order
subword_order
```

Source audit naming:

```txt
source_dataset
source_ref
```

##### Phase 5B Migration And Rollback Notes

Phase 5B implementation rules:

- `SchemaInstaller`/`dbDelta` work may add only `wcm_original_terms` and `wcm_original_word_occurrences`.
- Existing `wcm_bible_versions`, `wcm_bible_books`, and `wcm_bible_verses` tables must not be changed.
- Existing Bible Lookup, Bible Search, Bible Chapter, and Book Metadata APIs must not be changed.
- Existing import pipeline behavior must not be changed.
- Destructive migration is prohibited.
- Phase 5B is table creation only.
- Rollback for Phase 5B should be documented as manual table drop only.
- Automatic destructive uninstall or rollback behavior must not be added in Phase 5B.
- Destructive rollback is allowed only before production original-language data is imported.
- After production original-language import, rollback requires a backup/export strategy.

#### Phase 5B-1 ValueObject Design Review

Phase 5B-1 defines the domain ValueObject shape that should sit between importer validation, repositories, read APIs, and future UI/API output. This phase is design-only until implementation is explicitly approved.

##### OriginalTerm ValueObject

Recommended fields:

```txt
?int id
string languageType
string lemma
string lemmaNormalized
string strongsNumber
string strongsExtended
string transliteration
string root
?string gloss
?string definition
```

ValueObject policy:

- `id` is nullable before persistence.
- `gloss` and `definition` are nullable.
- `strongsNumber`, `strongsExtended`, `transliteration`, and `root` use empty string normalization.
- `lemma`, `lemmaNormalized`, and `languageType` are required non-empty values.
- Database timestamps are not part of the ValueObject.
- The implementation should use a `final readonly class`.
- Constructor-promoted properties should match the current project ValueObject style.
- The constructor should perform lightweight invariant validation only.

##### OriginalWordOccurrence ValueObject

Recommended fields:

```txt
?int id
int termId
int bookId
int chapter
int verse
int wordOrder
int subwordOrder
string tokenType
string surfaceForm
string normalizedForm
string morphology
?string grammarSummary
?string grammarNote
?string contextualFunction
string sourceDataset
string sourceRef
```

ValueObject policy:

- `id` is nullable before persistence.
- `grammarSummary`, `grammarNote`, and `contextualFunction` are nullable.
- `normalizedForm`, `morphology`, and `sourceRef` may be empty strings.
- Numeric reference and ordering values must be validated.
- Database timestamps are not part of the ValueObject.
- `versionId` is not included in Phase 5B.
- The implementation should use a `final readonly class`.
- The ValueObject is immutable after construction.

##### Phase 5B-1 Enum Strategy

Do not use PHP enums initially.

Use project-style constants first so importer normalization, source validation, and database string values remain simple during early source integration.

Recommended constants:

```txt
OriginalTerm::LANGUAGE_HEBREW = 'hebrew'
OriginalTerm::LANGUAGE_GREEK = 'greek'

OriginalWordOccurrence::TOKEN_WORD = 'word'
OriginalWordOccurrence::TOKEN_PREFIX = 'prefix'
OriginalWordOccurrence::TOKEN_SUFFIX = 'suffix'
OriginalWordOccurrence::TOKEN_PUNCTUATION = 'punctuation'
OriginalWordOccurrence::TOKEN_VARIANT = 'variant'
```

`source_dataset` allowed values should be managed by a validator or constants. Initial values remain `STEP_TAHOT` and `STEP_TAGNT`; future values remain `OSHB`, `SBLGNT`, `MORPHGNT`, and `OPENGNT`.

##### Phase 5B-1 Validation Strategy

ValueObject constructor validation:

- Enforce basic invariants only.
- Validate required non-empty fields.
- Validate numeric references and ordering ranges.
- Validate known `languageType`, `tokenType`, and source dataset values when constants are available.
- Avoid source-specific or batch-level decisions in constructors.

Dedicated validator responsibilities:

- Duplicate term identity detection.
- Duplicate occurrence identity detection.
- Confirm `book_id` exists in `wcm_bible_books`.
- Greek edition filtering.
- Hebrew versification handling.
- Source-specific morphology preservation.
- `sourceRef` policy.

Importer validation responsibilities:

- Source file headers.
- Source row counts.
- Source provenance.
- Batch deduplication.
- Validation report generation.
- Fail-closed behavior.

##### Phase 5B-1 Import Flow

Recommended flow:

```txt
Raw Source
-> Source Inspection
-> Normalization
-> Validator
-> OriginalTerm
-> OriginalWordOccurrence
-> Repository
```

Normalization must happen before ValueObject construction. Raw STEP, OSHB, SBLGNT, MorphGNT, or OpenGNT source rows should not construct ValueObjects directly until references, Strong's values, token types, source dataset values, and empty-string defaults are normalized.

##### Phase 5B-1 Future Compatibility

The ValueObject shape supports:

- Strong's Lookup through `OriginalTerm.strongsNumber`.
- Word Study through `OriginalTerm` and occurrence lookup by `termId`.
- Interlinear display through ordered occurrences by `wordOrder` and `subwordOrder`.
- Cross References through canonical `bookId`, `chapter`, and `verse`.
- Commentary links through future relationship records.
- Hebrew Root Study through `OriginalTerm.root`.
- Pictographic Observations through future term-linked tables.

`wcm_scripture_relationships` remains a future discovery and ranking graph. It must not become authoritative original-language occurrence storage.

##### Phase 5B-1 Risks

- Over-validating constructors can make importer diagnostics weaker.
- PHP enums may be too rigid before source data quirks are fully known.
- Nullable `id` handling must be consistent between import candidates and hydrated persisted rows.
- Empty-string normalization for Strong's and source fields must be consistent across normalization, validation, repository writes, and repository hydration.
- Adding timestamps to ValueObjects too early would mix persistence metadata into domain objects.

##### Phase 5C Import Validation Rules Draft

Term validation:

- `language_type` must be one of the allowed values.
- `lemma` is required.
- `lemma_normalized` is required.
- `strongs_number`, when present, must match `^H\d+$` or `^G\d+$`.
- `strongs_extended` may be an empty string.
- Duplicate `term_identity` records must be rejected or merged deterministically.

Occurrence validation:

- `source_dataset` must be one of the allowed values.
- `book_id` must exist in `wcm_bible_books`.
- `chapter` must be greater than or equal to `1`.
- `verse` must be greater than or equal to `1`.
- `word_order` must be greater than or equal to `1`.
- `subword_order` must be greater than or equal to `0`.
- `token_type` must be one of the allowed values.
- `surface_form` is required for `word`, `prefix`, `suffix`, and `variant` tokens.
- `morphology` may be empty, but it must be preserved when the source provides it.
- `source_ref` is required when the source provides a stable id.
- Duplicate `occurrence_identity` records must be rejected.
- No import may run before the Greek edition filtering decision.
- No import may run before the Hebrew versification handling decision.

Performance validation:

- Occurrence import must be batch-based.
- Common Strong's occurrence queries must be paginated.
- Original-language datasets must not be bundled into the frontend.
- Original-language APIs must not return full original-language datasets.

##### Query Patterns

Verse Reader and future interlinear:

```txt
source_dataset + book_id + chapter + verse
-> occurrences ordered by word_order, subword_order
-> terms
```

Strong's lookup:

```txt
language_type + strongs_number
-> terms
-> occurrences
-> paginated references
```

Word Study:

```txt
term_id
-> occurrences
-> grouped references
```

Future interlinear display:

```txt
verse
-> ordered occurrences
-> terms
-> morphology/gloss display
```

##### Import Mapping

STEP Hebrew TAHOT term mapping:

```txt
language_type = hebrew
lemma -> lemma
normalized lemma -> lemma_normalized
base Strong's -> strongs_number
Extended Strong's -> strongs_extended
transliteration -> transliteration
root -> root
gloss -> gloss
definition -> definition
```

STEP Hebrew TAHOT occurrence mapping:

```txt
canonical reference -> book_id, chapter, verse
token order -> word_order
prefix/base/suffix sequence -> subword_order
token role -> token_type
surface Hebrew form -> surface_form
normalized Hebrew form -> normalized_form
morph code -> morphology
expanded parse if available or derived -> grammar_summary
source_dataset = STEP_TAHOT
source row id, word id, or deterministic import ref -> source_ref
```

STEP Greek TAGNT term mapping:

```txt
language_type = greek
lemma -> lemma
normalized lemma -> lemma_normalized
base Strong's -> strongs_number
STEP disambiguated Strong's -> strongs_extended
transliteration -> transliteration
gloss -> gloss
definition -> definition
```

STEP Greek TAGNT occurrence mapping:

```txt
canonical reference -> book_id, chapter, verse
token order -> word_order
subword_order = 0 unless needed
token_type = word unless source requires another value
surface Greek form -> surface_form
normalized Greek form -> normalized_form
morph code -> morphology
expanded parse if available or derived -> grammar_summary
source_dataset = STEP_TAGNT
source row id, word id, or deterministic import ref -> source_ref
```

##### Phase 5B Schema Risks

- Omitting `subword_order` or `token_type` will likely require a migration for Hebrew prefix, suffix, and compound token modeling.
- Omitting `strongs_extended` loses STEP disambiguation and makes base Strong's lookup too coarse.
- Omitting `source_ref` weakens import audit, validation reports, and rollback.
- Common Strong's or common term occurrence queries must be paginated.
- Greek import must not begin before Greek edition filtering is decided.
- Hebrew import must not begin before Hebrew versification handling is decided.
- `source_dataset` must remain part of occurrence uniqueness because multiple source datasets may be supported later.

#### Phase 5B Implementation Completion

Completed implementation:

- `SchemaInstaller` original-language tables.
- `wcm_original_terms`.
- `wcm_original_word_occurrences`.
- `OriginalTerm` ValueObject.
- `OriginalWordOccurrence` ValueObject.
- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.
- `OriginalTermRepository`.
- `OriginalWordOccurrenceRepository`.

Phase 5B implementation did not approve or perform any original-language dataset import.

### Phase 5C - Original Language Importer Design

Status:

```txt
Complete
```

Goals:

- Inspect exact STEP TAHOT and STEP TAGNT source files.
- Verify source headers and source row shapes.
- Confirm license and attribution text.
- Design original-language import mapping.
- Design batch validation before writes.
- Design dry-run import behavior.
- Design verification report output.
- Design `OriginalLanguageImportValidator`.
- Design `OriginalLanguageImportService`.
- Design repository usage for term and occurrence persistence.
- Only then proceed to importer implementation after explicit approval.

Pipeline shape:

```txt
Source file
-> Source Inspection
-> Source Metadata / License Gate
-> Header / Shape Validation
-> Row Normalization
-> Batch Validation
-> Dry-run Report
-> Explicit Approval
-> Term Persistence
-> Occurrence Persistence
-> Verification Report
```

#### Existing KRV Import Structure

Current KRV import flow:

```txt
MDB export
-> generated JSON
-> ImportRow
-> KrvImportValidator
-> VerseImportService
-> BibleRepository::upsertVerse()
-> verification
```

KRV import structure:

- `tools/export-krv-mdb.php` reads the source MDB and writes generated JSON.
- `tools/import-krv-json.php` bootstraps WordPress from CLI and imports normalized JSON rows.
- `ImportRow` represents normalized KRV import rows.
- `KrvImportValidator` validates row shape, book/chapter/verse ranges, and text.
- `VerseImportService` validates rows, resolves version/book records, constructs `BibleVerse`, and writes through `BibleRepository::upsertVerse()`.
- `ImportReport` records total, imported, skipped, failed rows, and issues.
- `tools/verify-krv-import.php` verifies row counts, empty text counts, and sample verses after import.

KRV import does not currently provide a true dry-run mode. Original Language import must not copy that limitation; it needs a stronger dry-run gate before persistence.

#### Proposed Phase 5C Classes

Design candidates:

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

These classes were designed during Phase 5C. Source gates, normalized row contracts, source-specific normalizers, the versification resolver, and the dry-run import service were then implemented through the approved Phase 5C/5D limited implementation steps. Write-enabled persistence import remains out of scope.

#### Source Inspection Design

Source inspection must:

- Confirm the local file path exists.
- Confirm the declared `source_dataset`.
- Confirm file format and encoding.
- Inspect headers and small samples only.
- Confirm required columns.
- Record source filename, checksum, license/attribution text, and row count estimate.
- Fail closed when license or provenance is missing.
- Perform no DB writes.

#### Normalization Design

Normalization must happen before ValueObject construction.

Normalize:

- `language_type`.
- `source_dataset`.
- Base Strong's values such as `H7225` and `G3056`.
- `strongs_extended`.
- Empty optional scalar fields to empty strings.
- Nullable descriptive fields to `null`.
- Canonical reference to `book_id`, `chapter`, and `verse`.
- Source row id or word id to `sourceRef`.
- Source token order to `wordOrder` and `subwordOrder`.
- Source token role to `tokenType`.

#### Validation Design

Use existing validators:

- `OriginalTermValidator`.
- `OriginalWordOccurrenceValidator`.

Add later:

- `OriginalLanguageImportValidator`.
- `SourceFileValidator`.
- `SourceLicenseValidator`.

Import validation must cover:

- Headers.
- Source provenance and license gate.
- Duplicate term identity within a batch.
- Duplicate occurrence identity within a batch.
- Book mapping existence.
- Greek edition filtering decision.
- Hebrew versification decision.
- `sourceRef` policy.
- Morphology preservation.

#### Import Service Design

`OriginalLanguageImportService` must:

- Default to `dryRun = true`.
- Support chunked batch processing.
- Perform no writes in dry-run mode.
- Look up terms by identity.
- Look up occurrences by identity.
- Insert or update only after validation passes.
- Fail closed on blocking errors.
- Return a report for every run.
- Avoid silent skips; every skip needs a report code.

Dry-run must stay outside repositories because repository `save()` methods write immediately.

#### Dry-run Design

Dry-run must:

- Inspect source.
- Normalize rows.
- Validate terms and occurrences.
- Build identity keys.
- Optionally simulate repository matching with read-only checks.
- Produce counts and issue lists.
- Perform zero writes.
- Be mandatory before production import.

#### Import Report Shape

`OriginalLanguageImportReport` should include:

- `source_dataset`.
- `source_file`.
- `license_status`.
- `source_version`.
- `source_url`.
- `checksum`.
- `rows_read`.
- `rows_valid`.
- `rows_invalid`.
- `terms_created`.
- `terms_matched`.
- `occurrences_created`.
- `occurrences_skipped`.
- `duplicate_terms`.
- `duplicate_occurrences`.
- `missing_lemma`.
- `missing_strongs`.
- `missing_morphology`.
- `invalid_reference`.
- `warnings`.
- `errors`.
- `ok`.

#### STEP_TAHOT Rules

STEP TAHOT import design must:

- Preserve morphology exactly when provided.
- Model Hebrew prefixes and suffixes with `subwordOrder` and `tokenType`.
- Preserve Extended Strong's in `strongsExtended`.
- Use WCM canonical `book_id + chapter + verse` as authoritative.
- Parse the source English/NRSV reference as the default canonical reference input.
- Preserve Hebrew alternate references in source metadata/raw row context.
- Block import until the Hebrew versification exception map is validated.
- Require deterministic `sourceRef`.
- Validate word and subword ordering.

#### STEP_TAGNT Rules

STEP TAGNT import design must:

- Use SBL-aligned filtering for the first production import.
- Include only rows whose `editions` field contains `SBL`.
- Exclude non-SBL rows from the first production import and count them in dry-run reports.
- Defer importing non-SBL variants as `tokenType = variant` until a later approved variant phase.
- Preserve morphology exactly when provided.
- Preserve STEP disambiguated Strong's in `strongsExtended`.
- Use `subwordOrder = 0` unless source data requires expansion.
- Validate canonical mapping before writes.

#### Phase 5C-6 STEP Header Mapping Analysis

Local source availability:

- STEP_TAHOT candidate files are locally available under `docs/data-sources/STEP/TAHOT/`.
- STEP_TAGNT candidate files are locally available under `docs/data-sources/STEP/TAGNT/`.
- A local STEP source clone is available under `docs/data-sources/STEPBible-Data/`.
- The local STEP source clone is pinned for Phase 5C design review at commit `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- `docs/data-sources/` contains KRV files, STEP candidate files, and a local `STEPBible-Data` source clone.
- Plugin tooling currently contains KRV tooling only:
  - `tools/export-krv-mdb.php`
  - `tools/import-krv-json.php`
  - `tools/verify-krv-import.php`
- No STEP source download was performed during this decision update.
- No STEP import was performed.

Header mapping status:

- STEP_TAHOT header/sample shape has been inspected from the pinned local STEP source.
- STEP_TAGNT header/sample shape has been inspected from the pinned local STEP source.
- `StepTahotNormalizer` has been implemented for dry-run normalization.
- `StepTagntNormalizer` has been implemented for dry-run normalization.
- `OriginalLanguageImportService` has been implemented in dry-run-only mode.

Pinned source and license status:

```txt
Repository: https://github.com/STEPBible/STEPBible-Data.git
Pinned commit: b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39
License: CC BY 4.0
Attribution: Credit STEP Bible linked to www.STEPBible.org; data is based on work at Tyndale House Cambridge.
```

Raw STEP source files remain untracked and must not be committed unless separately approved.

#### Phase 5C-B1 Source Gate Hardening

Status:

```txt
Complete
```

Implemented source gate behavior:

- STEP `.txt` source files are recognized as `step_txt`.
- `step_txt` is treated as tab-separated STEP text format.
- `OriginalLanguageSourceInspector` locates real TAHOT/TAGNT data header rows instead of intro/license lines.
- `OriginalLanguageSourceInspector` extracts sample data rows after the real STEP header.
- `SourceFileValidator` validates source-specific required headers for `STEP_TAHOT` and `STEP_TAGNT`.
- `OriginalLanguageSourceMetadata` includes source version, source URL, and checksum support.
- `OriginalLanguageImportReport` includes source version, source URL, and checksum support.
- `SourceFileValidator` validates approved STEP source path and expected file-name prefixes.
- `SourceLicenseValidator` validates STEP CC BY 4.0 attribution, STEP Bible/STEPBible.org attribution, Tyndale House Cambridge attribution, approved license status, and STEPBible-Data source URL.

Read-only smoke check:

```txt
STEP_TAHOT format=step_txt headers=12 samples=5 issues=0
STEP_TAGNT format=step_txt headers=13 samples=5 issues=0
```

Phase 5C-B1 did not implement:

- `StepTahotNormalizer`.
- `StepTagntNormalizer`.
- `OriginalLanguageImportService`.
- Dataset import.
- Database writes.
- Public original-language APIs.
- Original-language UI.

Pending STEP_TAHOT candidate mapping:

```txt
sourceDataset = STEP_TAHOT
languageType = hebrew
source reference -> bookCode, chapter, verse
source ordering -> wordOrder, subwordOrder
prefix/suffix/word/variant role -> tokenType
base Strong's -> strongsNumber normalized as H####
STEP disambiguation -> strongsExtended
source morphology -> morphology, preserved exactly
stable source word id preferred -> sourceRef
```

Pending STEP_TAGNT candidate mapping:

```txt
sourceDataset = STEP_TAGNT
languageType = greek
source reference -> bookCode, chapter, verse
source ordering -> wordOrder
subwordOrder = 0 unless source expansion requires otherwise
tokenType = word by default, variant when retained
base Strong's -> strongsNumber normalized as G####
STEP disambiguation -> strongsExtended
source morphology -> morphology, preserved exactly
stable source word id preferred -> sourceRef
```

Decision-gate resolutions before source-specific normalizers:

- Exact STEP source version is pinned to `STEPBible-Data` commit `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- License is CC BY 4.0.
- Attribution must credit STEP Bible linked to `www.STEPBible.org` and note the Tyndale House Cambridge basis.
- TAGNT primary edition stream is SBL-aligned using rows whose `editions` field contains `SBL`.
- TAGNT non-SBL rows are excluded from the first production import and reported by dry-run.
- TAHOT maps to WCM canonical `book_id + chapter + verse` using the source English/NRSV reference as default input.
- TAHOT Hebrew alternate references are preserved in raw/source metadata and require an exception map before import.
- Hebrew prefix/suffix modeling uses separate occurrences with `wordOrder`, `subwordOrder`, and `tokenType`.
- Strong's normalization stores base lookup values in `strongsNumber` and STEP disambiguation in `strongsExtended`.
- Stable `sourceRef` should prefer the deterministic source reference plus source word number and text type. If a stronger source word id is confirmed, use it instead.

Implementation gate:

- `StepTahotNormalizer`, `StepTagntNormalizer`, and dry-run-only `OriginalLanguageImportService` are now implemented.
- Write-enabled persistence skeleton was later committed in `24a0d24` and verified only through approved tiny local write smokes.
- Do not run full STEP import.
- Do not write to the database beyond separately approved smoke or controlled import steps.
- Do not proceed to any larger persistence/import execution until the Project Lead explicitly approves a separate controlled import phase.

#### Phase 5C-7 Source Acquisition Specification

Official source acquisition policy:

```txt
docs/ROADMAP/SOURCE_ACQUISITION_SPECIFICATION.md
```

Source selection:

- Hebrew primary source: STEP Bible TAHOT.
- Hebrew secondary validation/reference source: OSHB.
- Greek primary source: STEP Bible TAGNT.
- Greek reference text: SBLGNT.

Source version policy:

- Do not use floating `latest` source references.
- Exact source version or release identifier must be selected before download, inspection, dry-run, or import.
- Exact file name, source URL, source version, download date, verification date, checksum, license status, and attribution text must be documented.
- Source version records belong under `docs/data-sources/`, not in source code.

Recommended storage location:

```txt
docs/data-sources/
└── STEP/
    ├── README.md
    ├── LICENSE.md
    ├── TAHOT/
    │   ├── README.md
    │   └── source files
    └── TAGNT/
        ├── README.md
        └── source files
```

Required before download:

- Exact file name.
- Expected format.
- Expected headers or source shape.
- Expected source dataset value.
- Attribution requirements.
- License status.
- Source URL.

Required before import:

- `OriginalLanguageSourceInspector` passes.
- `SourceFileValidator` passes.
- `SourceLicenseValidator` passes.
- Header inspection is complete.
- Header mapping is complete.
- Greek edition filtering is decided.
- Hebrew versification mapping is decided.
- Hebrew prefix/suffix token model is decided.
- Stable `sourceRef` strategy is decided.
- Explicit approval is given for actual import.

Completed after explicit limited implementation approval:

- `StepTahotNormalizer`.
- `StepTagntNormalizer`.
- `OriginalLanguageImportService`.

Still blocked until separate persistence-import approval:

- Full STEP import.
- Additional database writes beyond separately approved smoke or controlled import steps.

#### Phase 5C Decision Gate Finalization

Source acquisition status:

- Local STEP candidate files are present under `docs/data-sources/STEP/`.
- A local `STEPBible-Data` source clone is present under `docs/data-sources/STEPBible-Data/`.
- The pinned STEP source commit for Phase 5C design is `b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39`.
- Raw STEP files are source data, not implementation code, and must not be committed without separate approval.

License and attribution:

- License: CC BY 4.0.
- Attribution: credit STEP Bible linked to `www.STEPBible.org`.
- Provenance note: data is created by STEP Bible and based on work at Tyndale House Cambridge.
- Any future source README, import report, public attribution surface, or distribution note must preserve this attribution.

Greek edition filtering decision:

- Use TAGNT as the primary Greek source.
- Use SBLGNT as the reference text.
- Initial import stream is SBL-aligned: import only TAGNT rows where `editions` contains `SBL`.
- Do not import non-SBL rows as `variant` in the first production import.
- Dry-run reports must count excluded non-SBL rows and any rows with variant-related warnings.

Hebrew versification decision:

- WCM canonical reference remains `book_id + chapter + verse`.
- TAHOT English/NRSV reference is the default parse input for canonical mapping.
- Hebrew alternate references in brackets are preserved in raw/source metadata.
- Psalm title verse `0` cases and English/Hebrew verse-start differences require an explicit exception map before import.

Hebrew prefix/suffix token decision:

- Use expanded occurrence modeling when TAHOT separates prefixes, root words, suffixes, or punctuation.
- Preserve the source word number as `wordOrder`.
- Assign `subwordOrder` from `0` upward in source display order within the same STEP word.
- Use `tokenType = prefix`, `word`, `suffix`, or `punctuation` according to the source segment role.
- Use `subwordOrder = 0` for unsegmented words.

Strong's normalization decision:

- Store base lookup Strong's in `strongsNumber`.
- Store STEP disambiguation in `strongsExtended`.
- Remove braces, wrappers, suffix letters, and instance markers from base Strong's.
- Remove leading zeroes in base Strong's canonical form, for example `H0430` becomes `H430` and `G0011` becomes `G11`.
- Preserve meaningful STEP disambiguation suffixes in `strongsExtended`, for example `H7225G` or `G2424G`.
- Do not include occurrence instance markers such as `_A` or `_B` in term identity.

#### Phase 5C Risks

- KRV importer lacks a dry-run pattern.
- STEP source files are currently untracked source data and must not be committed without approval.
- License and attribution text must be carried into source documentation and import reports before import.
- Hebrew prefix/suffix modeling can corrupt ordering if it happens too late.
- Greek edition filtering can duplicate or mix readings if not decided first.
- Repository `save()` methods write immediately, so dry-run must stay outside repositories.
- Large occurrence imports need chunking and resumable reports.

#### Recommended Phase 5C Implementation Order

1. Finalize Source Acquisition Specification.
2. Confirm raw STEP source file commit/ignore policy.
3. Run header-only source inspection with `OriginalLanguageSourceInspector`.
4. Validate source metadata with `SourceFileValidator` and `SourceLicenseValidator`.
5. Design `StepTahotNormalizer` from the finalized header map and decision-gate policies.
6. Design `StepTagntNormalizer` from the finalized header map and SBL filtering policy.
7. Design dry-run-only `OriginalLanguageImportService`.
8. Run first dry-run import only after approval.
9. Run actual import only after separate explicit approval.

Import rules:

- Do not import source data before license/provenance approval.
- Do not silently skip invalid canonical references.
- Do not bundle generated original-language data into the frontend.
- Generated exports remain ignored unless explicitly approved.
- Do not run additional write-enabled import execution before a separate controlled import step is approved.
- Do not run full STEP TAHOT or STEP TAGNT import without separate approval.
- Do not run OSHB or SBLGNT import without separate approval.
- Do not create public original-language APIs before import and verification are approved.
- Do not build Interlinear UI, Strong's pages, or Word Study UI during the data/import foundation phases.

### Phase 5D - Original Language Dry-run Pipeline

Status:

```txt
Complete
```

Completed implementation:

- `StepTagntNormalizer`.
- `StepTahotNormalizer`.
- `OriginalLanguageVersificationResolver`.
- `OriginalLanguageImportService` in dry-run-only mode.

Dry-run behavior completed:

- Source inspection and source/license validation are used before row processing.
- STEP rows stream after the detected STEP data header.
- TAGNT non-SBL rows are skipped and counted.
- TAHOT Psalm title rows are skipped and counted.
- Unresolved references are treated as hard errors during dry-run.
- Missing morphology remains warning-only.
- Duplicate occurrence candidates are warning-level skips during dry-run.
- No repositories are called.
- No DB writes occur.
- No public API or frontend surface is created.

Blocker fixes completed in Phase 5D-E:

- TAGNT alternate references using `{}`, `[]`, and `()` before `#` are accepted.
- TAGNT alternate reference marker, type, and value are preserved in raw/context.
- TAGNT canonical resolution uses the primary reference unless an explicit exception map overrides it.
- TAHOT first-import policy includes base `L` rows and skips non-base text types such as `X`.
- TAHOT Q(K) rows are skipped and reported with `qere_kethiv_variant_skipped`.
- TAHOT non-base rows are reported with `tahot_non_base_text_type_skipped`.
- No variant table or variant occurrence storage was added.
- Dry-run exception map handling includes:
  - `1Ch.22.17 -> 1Ch.22.16`
  - `1Ch.22.18 -> 1Ch.22.17`
  - `1Ch.22.19 -> 1Ch.22.18`
  - `Rev.12.18 -> Rev.13.1`

Full dry-run aggregate results:

```txt
TAGNT rowsRead=142096
TAGNT rowsNormalized=137121
TAGNT rowsSkipped=4975

TAHOT rowsRead=305652
TAHOT rowsNormalized=536199
TAHOT rowsSkipped=2267

hard errors=0
```

Remaining non-hard issues:

- `missing_morphology`
- `tagnt_non_sbl_skipped`
- `qere_kethiv_variant_skipped`
- `tahot_non_base_text_type_skipped`
- `psalm_title`
- `duplicate_occurrence` warning-level skips

Phase 5D did not perform:

- Actual STEP import.
- DB writes.
- Repository persistence calls.
- Public original-language API work.
- Frontend work.
- Schema changes.

Any larger persistence import requires a separate explicit approval phase.

### Phase 5E - Original Language Persistence Smoke Verification

Status:

```txt
Complete
```

Completed local verification:

- Persistence skeleton committed in `24a0d24`.
- Local DB connectivity restored through Local Site Shell.
- Original-language tables confirmed:
  - `wp_wcm_original_terms`
  - `wp_wcm_original_word_occurrences`
- `importApprovedSource()` confirmed to run preflight before write transaction.
- Small `STEP_TAGNT` local DB write smoke passed:
  - `maxRows=3`
  - `batchSize=1`
  - first run created `3` terms and `3` occurrences
  - rerun matched `3` terms and `3` occurrences
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
- Small `STEP_TAHOT` local DB write smoke passed:
  - `maxRows=3`
  - `batchSize=1`
  - first run created `4` terms and `4` occurrences
  - rerun matched `4` terms and `4` occurrences
  - Hebrew expansion confirmed
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
- Controlled `STEP_TAGNT` Mat-Jhn 1,000-row local import passed:
  - backup path: `/private/tmp/wcm_phase_5e_g_pre_tagnt_1000.sql`
  - `maxRows=1000`
  - `batchSize=100`
  - pre counts: `7` original-language terms and `7` original-language occurrences
  - pre source counts: `STEP_TAGNT=3`, `STEP_TAHOT=4`
  - first successful run: `rowsRead=1000`, `rowsValid=988`, `rowsNormalized=988`, `rowsSkipped=12`
  - first successful run created `273` terms and `985` occurrences
  - first successful run matched `242` terms and `3` occurrences
  - rerun created `0` terms and `0` occurrences
  - rerun matched `515` terms and `988` occurrences
  - duplicate term identity groups=`0`
  - duplicate occurrence identity groups=`0`
  - post counts: `280` original-language terms and `992` original-language occurrences
  - post source counts: `STEP_TAGNT=988`, `STEP_TAHOT=4`
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
  - post counts: `3011` terms and `64209` occurrences
  - post source counts: `STEP_TAGNT=64205`, `STEP_TAHOT=4`
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
  - post counts: `5573` terms and `137118` occurrences
  - post source counts: `STEP_TAGNT=137114`, `STEP_TAHOT=4`
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
  - post counts: `9584` terms and `279132` occurrences
  - post source counts: `STEP_TAGNT=137114`, `STEP_TAHOT=142018`
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
  - post counts: `14049` terms and `469045` occurrences
  - post source counts: `STEP_TAGNT=137114`, `STEP_TAHOT=331931`
  - coverage: `Joshua=18058`, `Judges=17501`, `Ruth=2258`, `1 Samuel=23439`, `2 Samuel=19418`, `1 Kings=22983`, `2 Kings=21349`, `1 Chronicles=19158`, `2 Chronicles=24016`, `Ezra=6600`, `Nehemiah=9638`, `Esther=5495`
  - duplicate groups=`0`
- Phase 5E-L2 binary-stable original term identity implementation completed:
  - `term_identity_hash` added to `wcm_original_terms`
  - old collation-sensitive unique `term_identity` key removed
  - nonunique `term_identity_text` lookup index retained
  - binary-stable SHA-256 identity is authoritative for original terms
- Phase 5E-L3 term identity hash migration completed:
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
  - post counts: `15210` terms and `536860` occurrences
  - post source counts: `STEP_TAGNT=137114`, `STEP_TAHOT=399746`
  - coverage: `Job=14807`, `Psalms=34226`, `Proverbs=11501`, `Ecclesiastes=5075`, `Song of Songs=2206`
  - H1004A / `בֵּית` collation conflict resolved by hash identity
  - duplicate hash groups=`0`
  - duplicate term groups=`0`
  - duplicate occurrence groups=`0`
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
  - final counts: `16891` terms and `673263` occurrences
  - final source counts: `STEP_TAGNT=137114`, `STEP_TAHOT=536149`
  - full TAGNT NT complete
  - full TAHOT OT complete
  - OT books with TAHOT=`39`
  - OT books missing TAHOT=`0`
  - duplicate hash groups=`0`
  - duplicate term groups=`0`
  - duplicate occurrence groups=`0`

Phase 5E did not perform:

- Full STEP import.
- OSHB import.
- SBLGNT import.
- Public original-language API work.
- Frontend work.
- Commit creation.

Next gate:

```txt
Original Language Read API, Word Study API, high-level Interlinear API, and limited Original Language Reader MVP frontend implementation are complete. Manual desktop/mobile browser QA remains the next gate before expanding the Word Study UI.
```

### Future - Read API Foundation

Goals:

- Add read-only API support after schema and import foundations exist.
- Keep UI work for later phases.

Candidate future endpoints:

```txt
/wp-json/wcm/v1/original-language/{version}/{book}/{chapter}/{verse}
/wp-json/wcm/v1/original-language/strongs/{strongs_number}
/wp-json/wcm/v1/original-language/terms/{term_id}/occurrences
```

API rules:

- Return only requested passages or paginated result sets.
- Do not return full original-language datasets.
- Preserve interpretation order from ADR-0010.
- Keep grammar inside the Original Language Engine.

## Storage Strategy

Original Language data must not be stored in `wcm_bible_verses`.

Authoritative original-language storage belongs in separate custom tables:

```txt
wcm_original_terms
wcm_original_word_occurrences
```

The common connection point is canonical Scripture reference:

```txt
book_id + chapter + verse
```

`wcm_scripture_relationships` is not authoritative occurrence storage. It is a future discovery, ranking, and knowledge-graph layer.

## Strong's Strategy

Strong's numbers belong at the term level.

Examples:

```txt
H7225
G3056
```

Recommended field:

```txt
wcm_original_terms.strongs_number
```

Initial index recommendation:

```txt
KEY strongs_number (strongs_number)
```

Do not assume `strongs_number` is globally unique across all source variants. Start with a non-unique index unless a source-specific validation decision proves uniqueness.

Strong's normalization must be decided before Phase 5B schema implementation. STEP Bible Extended Strong's values should preserve enough source detail for later lexical disambiguation while still supporting normalized lookup values such as `H7225` and `G3056`.

## Morphology Strategy

Morphology belongs at the occurrence level.

Reason:

The same lemma can appear with different morphology, parsing, grammar, and contextual function in different verses or even multiple times within the same verse.

Recommended fields from ADR-0010:

```txt
wcm_original_word_occurrences.morphology
wcm_original_word_occurrences.parsing
wcm_original_word_occurrences.grammar_summary
wcm_original_word_occurrences.grammar_note
wcm_original_word_occurrences.contextual_function
```

## Relationship Strategy

Recommended relationship flow:

```txt
Bible verse reference
-> original word occurrence
-> original term
-> Strong's number / lexicon entry
-> word study / theme / cross reference / commentary
```

Relationship table role:

- Use `wcm_scripture_relationships` for discovery and ranking.
- Do not use it as the primary store for word occurrences.
- Use relationship types such as `same_original_word`, `word_study`, `same_theme`, and `cross_reference` after authoritative source data exists.

Future Hebrew-Greek bridge:

- Old Testament Hebrew/Aramaic Strong's values (`Hxxxx`) and New Testament Greek Strong's values (`Gxxxx`) are separate systems and must not be auto-equated.
- The project needs a future curated relationship layer for source-backed study relationships between Hebrew/Aramaic and Greek original terms.
- Example study relationships include `H430` אֱלֹהִים with `G2316` θεός, `H3068` יהוה with `G2962` κύριος, and `H2233` זֶרַע with `G4690` σπέρμα.
- A relationship means "related for study," not "identical."
- Suggested future phase: Phase 10 - Hebrew-Greek Bridge and Revelation Lexicon Foundation.
- Detailed plan: `docs/ROADMAP/HEBREW_GREEK_BRIDGE_PLAN.md`.

## Frontend Rule

Do not bundle original-language datasets into the frontend.

Frontend clients must request only the needed verse, passage, term, or paginated occurrence set through backend APIs.

## UI Scope

Phase 5A through Phase 5D are data and API foundation phases.

Later UI expansion phases may include:

- Word Study Term panel
- Occurrence distribution UI
- Strong detail pages
- Dedicated Word Study pages
- Advanced search
- Morphology explorer
- Cross Reference UI
- Commentary Layer
