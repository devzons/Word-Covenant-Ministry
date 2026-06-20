# Hebrew-Greek Bridge Plan

## Date

2026-06-20

## Status

Future planning only. No implementation is approved by this document.

## Purpose

Word Covenant Ministry must eventually support a curated relationship layer between Old Testament Hebrew/Aramaic original-language terms and New Testament Greek original-language terms.

This bridge supports study across the whole canon while preserving the boundary between separate Strong's numbering systems.

## Problem

Old Testament Strong's numbers and New Testament Strong's numbers are separate systems:

- Old Testament Hebrew/Aramaic Strong's values use `Hxxxx`.
- New Testament Greek Strong's values use `Gxxxx`.
- They are not directly equivalent identifier systems.
- `H430` is not technically the same ID system as `G2316`.

The current original-language model correctly stores Strong's values on original terms, but a future study layer must not assume that a Hebrew Strong's number and a Greek Strong's number are identical just because the English or Korean glosses appear similar.

## Need

The project must support a curated relationship layer connecting Hebrew/Aramaic terms to Greek New Testament terms when there is a meaningful biblical, translation, lexical, theological, or revelatory relationship.

This relationship layer is for study discovery. It must not collapse Hebrew and Greek Strong's identifiers into one namespace.

## Examples

```txt
H430 אֱלֹהִים / 엘로힘 / 하나님
↔ G2316 θεός / 테오스 / 하나님
```

```txt
H3068 יהוה
↔ G2962 κύριος
```

```txt
H2233 זֶרַע / 씨
↔ G4690 σπέρμα / 씨
```

These examples are study relationships, not proof that the source terms are identical in every context.

## Relationship Types

Possible future relationship types:

- `lxx_translation`
- `nt_quotation`
- `lexical_equivalent`
- `theological_theme`
- `christological_fulfillment`
- `curated_manual`

Each relationship type should communicate why two terms are related and how cautiously the UI should present the connection.

## Boundary

Do not auto-equate Hebrew/Aramaic and Greek Strong's numbers.

Required rules:

- All Hebrew-Greek links must be curated or source-backed.
- A relationship means "related for study," not "identical."
- Strong's number prefixes must remain meaningful: `H` and `G` are separate namespaces.
- Gloss similarity alone is not enough to create a link.
- Korean gloss or transliteration similarity is not enough to create a link.
- Automated suggestions may be used only as review inputs in a future phase, not as authoritative links.

## Future Data Model Idea

Possible future table:

```txt
wcm_original_term_relationships
```

Possible fields:

```txt
id
source_term_id
target_term_id
relationship_type
confidence
source_reference
notes
review_status
created_at
updated_at
```

Model notes:

- `source_term_id` and `target_term_id` should reference `wcm_original_terms.id`.
- Direction should be meaningful but not necessarily exclusive; a UI may show reverse relationships when appropriate.
- `relationship_type` should use a controlled vocabulary.
- `confidence` should support careful presentation and filtering.
- `source_reference` should cite a source such as an LXX alignment, NT quotation, curated review note, or internal study source.
- `review_status` should prevent unreviewed relationships from appearing as approved study links.

## Future UI Idea

The Strong Study Panel may eventually show a section such as:

```txt
Related Hebrew/Greek Terms

H430 Elohim
Related Greek:
G2316 Theos
```

UI rules:

- Label the section as related terms, not equivalent terms.
- Show relationship type when useful.
- Keep raw Strong's identifiers visible for auditability.
- Avoid implying that the Hebrew and Greek terms always have the same semantic range.

## Project Importance

This layer supports:

- Old Testament to New Testament continuity
- LXX bridge study
- Scripture interpreting Scripture
- Christ-centered revelation flow
- future Revelation Lexicon

## Phase Placement

Do not implement this now.

Place this after the current Phase 8 original-language MVP stabilization work.

Suggested future phase:

```txt
Phase 10 - Hebrew-Greek Bridge and Revelation Lexicon Foundation
```

Phase 10 should not begin until it has explicit approval and its sources, relationship types, review workflow, data model, and UI scope are documented.

## Deferred Work

Not approved in this document:

- Database schema changes.
- API changes.
- Frontend UI changes.
- Data imports.
- Automatic Hebrew-Greek Strong's mapping.
- LXX alignment import.
- Revelation Lexicon implementation.

