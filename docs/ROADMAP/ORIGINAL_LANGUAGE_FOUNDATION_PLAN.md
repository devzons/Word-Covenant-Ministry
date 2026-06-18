# Original Language Foundation Plan

## Date

2026-06-18

## Purpose

This ROADMAP document records the Phase 5 Original Language Foundation plan so future sessions can continue from the current Scripture Engine state without relying on conversation history.

This is not a new ADR. It concretizes ADR-0010 Original Language Data Model and ADR-0012 Scripture Relationship Model into implementation phases and entry gates.

## Current Entry Point

Current official phase:

```txt
Phase 5C - Original Language Importer Design
```

Next major phase:

```txt
Phase 5C - Original Language Importer Design
```

Phase 5B Original Language Data Layer implementation is complete. Phase 5C must begin with importer design, source file inspection, source header verification, import mapping, batch validation, dry-run design, and verification report design. It must not begin with importing OSHB, SBLGNT, STEP Bible, MorphGNT, OpenGNT, or other original-language datasets.

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
Next
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
Raw source
-> Inspection
-> Normalized token export
-> Validation
-> Term upsert
-> Occurrence upsert
-> Verification report
```

Import rules:

- Do not import source data before license/provenance approval.
- Do not silently skip invalid canonical references.
- Do not bundle generated original-language data into the frontend.
- Generated exports remain ignored unless explicitly approved.
- Do not implement an importer before Phase 5C design is complete and approved.
- Do not run actual STEP TAHOT or STEP TAGNT import during Phase 5C design.
- Do not run OSHB or SBLGNT import during Phase 5C design.
- Do not create public original-language APIs during Phase 5C design.
- Do not build Interlinear UI, Strong's pages, or Word Study UI during Phase 5C design.

### Phase 5D - Read API Foundation

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

## Frontend Rule

Do not bundle original-language datasets into the frontend.

Frontend clients must request only the needed verse, passage, term, or paginated occurrence set through backend APIs.

## UI Scope

Phase 5A through Phase 5D are data and API foundation phases.

Later UI phases may include:

- Interlinear UI
- Word Study UI
- Strong's lookup UI
- Cross Reference UI
- Commentary Layer
