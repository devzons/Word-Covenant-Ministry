# Original Language Foundation Plan

## Date

2026-06-18

## Purpose

This ROADMAP document records the Phase 5 Original Language Foundation plan so future sessions can continue from the current Scripture Engine state without relying on conversation history.

This is not a new ADR. It concretizes ADR-0010 Original Language Data Model and ADR-0012 Scripture Relationship Model into implementation phases and entry gates.

## Current Entry Point

Current official phase:

```txt
Phase 4 - Reader UX Polish
```

Next major phase:

```txt
Phase 5 - Original Language Foundation
```

Phase 5 must begin with analysis and source validation. It must not begin with importing OSHB, SBLGNT, or other original-language datasets.

## Phase 5 Breakdown

### Phase 5A - Source and Schema Analysis

Goals:

- Verify OSHB, SBLGNT, or other source license and provenance.
- Inspect source format before downloading, importing, or transforming data.
- Compare available source fields against ADR-0010.
- Define schema gaps before code changes.
- Define validation rules for original-language terms and occurrences.

Exit criteria:

- Source candidate documented.
- License/provenance verified.
- Source format and expected fields documented.
- Schema gap against ADR-0010 documented.
- Import readiness decision made.

### Phase 5B - Original Language Schema Foundation

Goals:

- Add custom table foundation after Phase 5A approval.
- Keep original-language data separate from translated Bible text.
- Preserve canonical Scripture reference as the shared connection point.

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

### Phase 5C - Import Foundation

Goals:

- Create an original-language import pipeline separate from the KRV verse importer.
- Reuse KRV importer patterns only where helpful.
- Validate before writing to custom tables.

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

