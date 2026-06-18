# ADR-0009 Bible Storage Strategy

## Status

Accepted

## Date

2026-06-18

## Context

ADR-0005 establishes Scripture as the primary domain model. ADR-0008 defines the Scripture Data Model and identifies `BibleVersion`, `BibleVerse`, and structured Scripture references as foundational entities.

Bible text storage must support:

- KRV
- WEB
- OSHB
- SBLGNT

Bible text will be queried by version, book, chapter, verse, passage range, and future relationship engines. It must support Scripture Engine, Word Study Engine, Original Language Engine, Pictographic Observation Engine, and Christological Engine workflows without forcing those systems through generic WordPress content storage.

## Decision

Bible text storage will use custom database tables instead of WordPress CPT storage or static JSON as the authoritative storage layer.

The planned Bible storage tables are:

```txt
wcm_bible_versions
wcm_bible_books
wcm_bible_verses
```

No code, migrations, imports, exports, or generated Scripture data are implemented by this decision. Table creation and import tooling require a future implementation plan with migration, rollback, validation, and manual review steps.

## Storage Options Compared

### CPT

WordPress custom post types provide editorial UI integration, revisions, REST support, and familiar content workflows.

CPT storage is not appropriate as the authoritative Bible text store because Bible verses are structured reference data, not editorial posts. A Bible corpus contains tens of thousands of verses per version and must be queried by numeric reference, range, version, book, chapter, and verse. Storing each verse as a post would create unnecessary post table volume, postmeta joins, weak range querying, and poor long-term performance for Scripture Engine lookups.

### JSON

JSON is portable, reviewable as generated artifacts, and useful for static client bundles, seed files, fixtures, or build-time exports.

JSON is not appropriate as the authoritative Bible text store because it is weak for runtime range queries, multi-version filtering, relationship joins, validation state, editorial review state, and server-side search/index integration. JSON may be used later as a generated export format after the database source and validation workflow are approved, but it should not be the primary source of truth.

### Custom Tables

Custom tables are appropriate because Bible text is canonical structured data with stable keys and predictable query patterns.

Custom tables allow:

- direct version/book/chapter/verse lookup
- efficient passage range queries
- unique constraints for verse identity
- explicit foreign keys or application-level relationships
- future joins from Scripture references, original language data, word studies, themes, and Christological pathways
- validation workflows separate from editorial content posts

## Table Definitions

### wcm_bible_versions

Stores supported Bible versions and their activation state.

```txt
id
code
name
language
is_active
```

Supported version codes include:

```txt
KRV
WEB
OSHB
SBLGNT
```

### wcm_bible_books

Stores canonical book metadata independent of any one Bible version.

```txt
id
osis_id
slug
name
english_name
testament
canonical_order
is_active
```

The `canonical_order` field provides stable ordering across versions and enables passage navigation from Genesis through Revelation. Original language corpora may use a subset of books while retaining the same book identity model where applicable.

### wcm_bible_verses

Stores verse text by version and canonical reference.

```txt
id
version_id
book_id
chapter
verse
text
```

Each row represents one verse in one Bible version.

## Indexing Strategy

### wcm_bible_versions

```txt
PRIMARY KEY (id)
UNIQUE KEY code (code)
KEY is_active (is_active)
```

### wcm_bible_books

```txt
PRIMARY KEY (id)
UNIQUE KEY osis_id (osis_id)
UNIQUE KEY slug (slug)
UNIQUE KEY canonical_order (canonical_order)
KEY testament (testament)
KEY is_active (is_active)
```

### wcm_bible_verses

```txt
PRIMARY KEY (id)
UNIQUE KEY version_reference (version_id, book_id, chapter, verse)
KEY passage_lookup (version_id, book_id, chapter, verse)
KEY book_chapter_lookup (book_id, chapter, verse)
FULLTEXT KEY text_search (text)
```

`version_reference` prevents duplicate verses within a version.

`passage_lookup` supports common Scripture Engine queries such as a single verse, one chapter, or a contiguous range within one book.

`book_chapter_lookup` supports cross-version comparison by canonical reference.

`text_search` supports version-scoped Bible text search where the database engine supports full-text indexing. If full-text behavior is insufficient for Korean, Hebrew, or Greek tokenization, a future search decision may add a dedicated search index while preserving these tables as the authoritative data store.

## Future Version Support

KRV and WEB should use the same `wcm_bible_verses` structure for translated Bible text.

OSHB and SBLGNT should also connect through the same canonical book/chapter/verse model where verse-level text is stored, while future original-language morphology, lemma, root, and token-level data should be stored in separate language-specific tables that reference `wcm_bible_verses` or canonical Scripture references.

This keeps Bible text storage stable while allowing Original Language Engine and Word Study Engine features to add richer data without overloading the verse table.

## Consequences

Bible text becomes queryable structured data rather than generic content.

The Scripture Engine can perform efficient reference lookups and passage range queries.

Future engines can attach relationships to Scripture through stable identifiers instead of parsed strings.

WordPress CPTs remain appropriate for sermons, Bible studies, books, resources, media, and other editorial content, but not as the authoritative Bible text store.

JSON remains available as a future generated export or fixture format, but not as the authoritative storage layer.

Implementation must still define schema migrations, validation checks, rollback strategy, import provenance, and manual review for known source issues such as the empty KRV canonical verse identified in ADR-0007.

## Alternatives Considered

- CPT storage: rejected because it creates poor scalability, unnecessary post/postmeta volume, weak reference querying, and inefficient passage range lookups.
- JSON as the authoritative store: rejected because it weakens runtime querying, relationship joins, validation state, and future multi-engine integration.
- Custom tables: accepted because they match the structured, query-heavy, multi-version nature of Bible text and provide stable identifiers for future Scripture relationships.
