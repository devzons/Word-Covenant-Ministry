# ADR-0013 Content Domain Model

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry is a Scripture-centered platform.

Content exists to serve Scripture relationships and Christ-centered interpretation.

The platform needs WordPress content types for ministry-authored content, but Scripture remains the primary domain model.

ADR-0008 establishes Scripture as the foundational relationship layer. ADR-0009 establishes custom tables for Bible text. ADR-0010 establishes custom tables for original language data and places grammar inside the Original Language Engine. ADR-0012 establishes explicit Scripture relationships through `wcm_scripture_relationships`.

## Decision

Human-authored ministry content will use WordPress Custom Post Types.

Scripture data and relationship data will use custom tables.

CPTs are for authored content.

Custom tables are for Scripture, Bible text, original language, and relationship indexing.

No code, migrations, CPT registrations, taxonomies, imports, exports, or generated data are implemented by this decision.

## Initial Custom Post Types

### sermon

Purpose:

Sermons and preached messages.

Core fields:

- title
- slug
- language
- summary
- content
- speaker
- media
- primary_scripture_reference
- related_scripture_references
- series
- topics
- published_at

### bible_study

Purpose:

Long-form Bible studies, exposition, and written teaching.

Core fields:

- title
- slug
- language
- summary
- content
- primary_scripture_reference
- related_scripture_references
- topics
- series
- published_at

### book

Purpose:

Books, manuscripts, publications, and book projects.

Core fields:

- title
- slug
- language
- description
- author
- cover_image
- table_of_contents
- purchase_url
- sample_file
- related_scripture_references
- topics
- published_at

### resource

Purpose:

PDFs, charts, handouts, study notes, downloads.

Core fields:

- title
- slug
- language
- description
- resource_type
- file
- related_scripture_references
- topics
- published_at

### series

Purpose:

Groups sermons, studies, books, and resources.

Core fields:

- title
- slug
- language
- description
- cover_image
- order
- related_scripture_references
- topics

### word_study

Purpose:

Studies of Hebrew and Greek terms through Scripture.

Core fields:

- title
- slug
- language
- original_term_id
- lemma
- transliteration
- strongs_number
- summary
- content
- scripture_references
- related_terms
- topics

### theme_study

Purpose:

Biblical themes traced through Scripture.

Examples:

- Seed
- Covenant
- Kingdom
- Lamb
- Temple
- Shepherd
- Light
- Water
- Bread
- Rest

Core fields:

- title
- slug
- language
- theme_key
- summary
- content
- scripture_path
- related_scripture_references
- christological_note
- topics

### pictographic_study

Purpose:

Hebrew pictographic observation studies.

Core fields:

- title
- slug
- language
- original_term_id
- hebrew_word
- summary
- content
- original_meaning
- biblical_usage
- context_note
- pictographic_observation
- limitation_note
- christological_note
- related_scripture_references

Rules:

- Pictographic study must never create doctrine independently.
- Pictographic study must follow the interpretation order from ADR-0010.
- Grammar remains inside Original Language Engine, not its own CPT.

## Taxonomies

Initial taxonomies:

- topic
- speaker
- scripture_book
- language
- content_series
- resource_type

## Relationship To Scripture

Each CPT may connect to Scripture through:

- primary_scripture_reference
- related_scripture_references
- wcm_scripture_relationships

Structured Scripture references and `wcm_scripture_relationships` are authoritative for Scripture-aware querying. Text labels may be used for display, but they must not be the only relationship record when Scripture-aware search, passage pages, ranking, or knowledge graph behavior is required.

## Design Principles

1. Content is authored in WordPress.
2. Scripture is stored and indexed outside CPT.
3. Content must connect to Scripture structurally.
4. Avoid storing Scripture references as plain text only.
5. Avoid making Bible verses WordPress posts.
6. Avoid duplicating content models.
7. Keep CPTs focused and extensible.
8. Keep Scripture-first architecture.

## Consequences

This model supports:

- sermon archive
- Bible study archive
- book library
- resource library
- Word Study Engine
- Theme Engine
- Pictographic Observation Engine
- Scripture-centered related content
- Future AI Scripture Assistant

Future implementation must define CPT registration details, REST API contracts, editor fields, validation rules, migration plans, rollback plans, permissions, localization behavior, and how CPT fields synchronize with `wcm_scripture_relationships`.

Because Scripture remains the primary domain model, CPT implementation must not store Bible verses as posts or rely on plain-text Scripture references as the authoritative relationship layer.

## Alternatives Considered

1. Store all content as standard posts: rejected because different content types need different fields and relationships.

2. Store Bible verses as CPTs: rejected because Bible text requires fast custom-table queries.

3. Store word studies only as custom tables: rejected because word studies are authored teaching content and need WordPress editorial workflow.
