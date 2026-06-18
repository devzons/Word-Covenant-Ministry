# ADR-0010 Original Language Data Model

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry must support:

- Hebrew Old Testament
- Greek New Testament
- lemma lookup
- Strong numbers
- morphology
- root tracking
- word occurrences
- word studies
- Hebrew letter observation
- gematria
- pictographic observation
- Christological pathways

The original language system must serve Scripture interpretation, not academic display only.

ADR-0008 establishes Scripture as the foundational relationship layer. ADR-0009 establishes custom Bible text tables and states that original-language morphology, lemma, root, and token-level data should be stored in separate language-specific tables that reference Bible verses or canonical Scripture references.

No OSHB or SBLGNT datasets are imported by this decision.

No code, migrations, or generated data are implemented by this decision.

## Decision

Original language data will be stored in custom tables separate from CPT and separate from translated Bible verse text.

Original language words must connect to:

- Bible verses
- word studies
- themes
- pictographic observations
- related ministry content

## Future Tables

### wcm_original_terms

```txt
id
language_type: hebrew | greek
lemma
normalized_lemma
transliteration
strongs_number
root
gloss
definition
notes
created_at
updated_at
```

### wcm_original_word_occurrences

```txt
id
term_id
version_id
book_id
chapter
verse
word_order
surface_form
morphology
parsing
grammar_summary
grammar_note
contextual_function
context_snippet
created_at
updated_at
```

Grammar fields are part of the Original Language Engine data model:

- `grammar_summary`: concise grammatical identification for display, such as verbal stem, tense/aspect, mood, voice, person, number, gender, case, or syntactic role.
- `grammar_note`: short explanatory note that helps readers understand how the grammar affects the verse context.
- `contextual_function`: the word's function in the immediate clause, phrase, or sentence.

Grammar is a supporting layer. It helps explain how a term functions in context, but it does not replace lexical meaning, biblical usage, or contextual interpretation.

No separate Grammar Engine will be created. Grammar belongs inside the Original Language Engine.

Examples:

- Hebrew verbs: identify stem, aspect/conjugation, person, number, gender, and contextual function, such as a qal perfect verb functioning as the main action of the clause.
- Greek nouns: identify case, number, gender, article relationship, and contextual function, such as a nominative noun functioning as the subject or a genitive noun functioning possessively.
- Greek verbs: identify tense-form, voice, mood, person, number, and contextual function, such as an aorist active indicative functioning as the main finite verb or a present participle functioning adjectivally.

### wcm_hebrew_letters

```txt
id
letter
final_form
name
transliteration
numeric_value
pictographic_observation
caution_note
```

### wcm_word_letter_breakdowns

```txt
id
term_id
letter_position
letter
letter_name
numeric_value
observation_note
```

### wcm_pictographic_observations

```txt
id
term_id
related_post_id
observation
limitation
scripture_context
christological_note
created_at
updated_at
```

## Interpretation Order Rule

The UI and API must preserve this order:

1. Original Meaning
2. Biblical Usage
3. Context
4. Grammar
5. Pictographic Observation
6. Revelatory Significance
7. Christological Fulfillment

Grammar must be presented after original meaning, biblical usage, and context. It must be presented before pictographic observation, revelatory significance, and Christological fulfillment.

Pictographic observation must never be shown before original meaning, biblical usage, context, and grammar.

## Gematria Rule

Gematria may be stored and displayed as an observation aid only.

Gematria must not generate doctrine.

## Pictographic Rule

Pictographic observation is supplementary.

It may support reflection but may not create independent interpretation.

## Consequences

This model enables:

- original word hover popups
- lemma pages
- Strong number lookup
- Hebrew letter breakdown
- gematria display
- word usage maps
- word study engine
- pictographic observation engine
- Christological engine

Original language work remains structurally subordinate to Scripture, biblical usage, and context.

Future implementation must define migrations, rollback, source provenance, import validation, editorial review, and UI/API ordering safeguards before importing OSHB, SBLGNT, or other original-language datasets.

## Alternatives Considered

1. Store everything in postmeta: rejected because it will not scale and will be hard to query.

2. Store original language data in static JSON only: rejected as final storage, but acceptable for import/export pipeline.

3. Store original language terms as CPT only: rejected because original terms and occurrences require fast relational queries.
