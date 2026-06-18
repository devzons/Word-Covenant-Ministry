# ADR-0012 Scripture Relationship Model

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry must connect Scripture to all ministry content and study engines.

Scripture is the primary relationship layer.

The platform must support relationships between:

- Scripture and sermons
- Scripture and Bible studies
- Scripture and books
- Scripture and resources
- Scripture and media
- Scripture and original language terms
- Scripture and word studies
- Scripture and pictographic observations
- Scripture and themes
- Scripture and Christological fulfillment paths

ADR-0008 defines Scripture as the foundational relationship layer. ADR-0009 establishes custom Bible storage for queryable Scripture data. ADR-0010 requires original language words to connect to Bible verses, word studies, themes, pictographic observations, and ministry content. ADR-0011 requires localized content to preserve relationships to shared Scripture domain entities.

## Decision

Scripture relationships will be modeled explicitly instead of relying only on WordPress postmeta or tags.

Future table:

```txt
wcm_scripture_relationships
```

Fields:

```txt
id
source_type
source_id
target_type
target_id
relationship_type
book_id
chapter_start
verse_start
chapter_end
verse_end
weight
notes
created_at
updated_at
```

Relationship types:

```txt
primary_passage
related_passage
cross_reference
same_theme
same_original_word
word_study
pictographic_observation
fulfillment
background
quotation
allusion
series_connection
```

No code, migrations, or data imports are implemented by this decision.

## Design Principles

1. Scripture remains the center.
2. Relationships must be queryable.
3. Relationships must be directional when needed.
4. Relationships may have weight for ranking.
5. Relationships must support future knowledge graph expansion.
6. Relationships should not depend only on text labels.
7. Content can have multiple Scripture relationships.
8. One Scripture passage can connect to many content types.

## Examples

Matthew 13 can relate to:

- sermons about the parables
- Bible studies about the kingdom
- word studies about seed
- pictographic observations where relevant
- theme paths about kingdom, seed, field, harvest
- Christological fulfillment notes

Genesis 3:15 can relate to:

- seed theme
- promise theme
- Christological fulfillment
- related sermons
- related books
- original Hebrew word studies

## Consequences

This enables:

- related content by Scripture passage
- Scripture-centered search
- Bible Knowledge Graph
- Scripture path pages
- theme tracing
- word usage tracing
- Christological pathway rendering
- AI Scripture Assistant grounding

Future implementation must define indexing, validation, migration, rollback, editor workflow, relationship provenance, and API contracts before creating the relationship table or writing relationship data.

Because relationships may be directional and weighted, future UI and API work must preserve relationship type, direction, passage range, and ranking metadata instead of reducing relationships to display labels.

## Alternatives Considered

1. Tags only: rejected because tags are too loose and not range-aware.

2. Postmeta only: rejected because range queries and relationship ranking are difficult.

3. Manual links only: rejected because the platform needs searchable, structured relationships.
