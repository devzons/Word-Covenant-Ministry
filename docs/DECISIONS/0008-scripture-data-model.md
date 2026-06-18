# ADR-0008 Scripture Data Model

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry is a Scripture-centered platform.

Scripture is the primary domain model.

Content is secondary.

The platform must support:

- KRV
- WEB
- OSHB
- SBLGNT

It must also support:

- Scripture Engine
- Word Study Engine
- Original Language Engine
- Pictographic Observation Engine
- Christological Engine

ADR-0005 establishes Scripture as the primary domain model. ADR-0007 identifies `docs/data-sources/개역한글.mdb` as the initial KRV data source candidate for Scripture Engine development, while explicitly deferring import, export, and generated Scripture data commits.

## Decision

The Scripture model will be built before CPT implementation.

Scripture becomes the foundational relationship layer.

## Core Entities

### BibleVersion

```txt
id
code
name
language
is_active
```

Examples:

```txt
KRV
WEB
OSHB
SBLGNT
```

### BibleVerse

```txt
id
version_id
book_id
chapter
verse
text
```

### ScriptureReference

```txt
id
book_id
chapter_start
verse_start
chapter_end
verse_end
```

Examples:

```txt
Genesis 1:1
Matthew 13:31-32
Romans 8
```

### ScriptureReferenceRange

Represents multi-verse references.

### ScriptureRelationship

Allows future linking:

```txt
Scripture
<-> Content

Scripture
<-> Original Language

Scripture
<-> Themes

Scripture
<-> Christological Fulfillment
```

## Future Custom Tables

### wcm_bible_versions

```txt
id
code
name
language
is_active
```

### wcm_bible_verses

```txt
id
version_id
book_id
chapter
verse
text
```

### wcm_scripture_references

```txt
id
book_id
chapter_start
verse_start
chapter_end
verse_end
```

## Design Principles

1. Scripture first.
2. Content second.
3. References are structured data.
4. Text references are not authoritative.
5. Scripture relationships should be queryable.
6. Original language data must connect through Scripture.
7. Word studies must connect through Scripture.
8. Christological pathways must connect through Scripture.

## Consequences

Future systems will depend on this model:

- Sermons
- Bible Studies
- Books
- Resources
- Original Language
- Word Studies
- Pictographic Studies
- Themes
- AI Scripture Assistant

Because this decision defines the future Scripture schema direction, implementation must still include a migration plan, rollback plan, validation workflow, and manual review process before creating custom tables or importing Scripture data.

## Alternatives Considered

- Traditional WordPress postmeta-only storage: rejected because it has poor scalability, weak Scripture querying, and weak relationship modeling.
