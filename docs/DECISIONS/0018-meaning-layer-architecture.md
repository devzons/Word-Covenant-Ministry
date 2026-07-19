# ADR-0018 Meaning Layer Architecture

## Status

Accepted

## Date

2026-07-19

## Context

Word Covenant Ministry now has a top-level Revelation Language Platform architecture and an operational Scripture Research Architecture companion.

What it still lacked was a precise middle layer for meaning itself.

Strong numbers are useful coordinates, but they do not define meaning identity.
Lexicons and dictionaries are useful supports, but they do not by themselves describe passage-bound meaning.
Semantic networks are useful, but they become dangerous if they are not grounded in reviewed meaning objects.

The project needs a meaning-first layer that can support:

- passage-specific meaning claims
- lexical senses
- canonical usage
- LXX alignment
- New Testament reception
- theme tracing
- publication reuse

## Decision

Word Covenant Ministry will introduce a Meaning Layer Architecture under the Revelation Language Platform.

The Meaning Layer will use the following identity policy:

- `meaning_id` is the primary identity for the meaning object
- `sense_id` is subordinate and lexical
- `theme_id` is subordinate and thematic
- `relation_id` is subordinate and relational
- Strong numbers remain external coordinates, not primary identity

The Meaning Layer will keep these responsibilities separate:

- Meaning Card for the reviewed meaning object
- Meaning Journey for meaning flow across Scripture and reception
- Theme Layer for biblical patterns and canonical themes
- Revelation Map for redemptive-historical flow
- Evidence Layer for source grounding and review discipline

This ADR does not approve a schema, migration, API, import, or runtime UI implementation.

## Consequences

### Positive

- The platform now has a clear meaning-centered identity strategy.
- Strong numbers remain available without becoming the core identity model.
- Meaning, theme, and flow can be represented without collapsing everything into a single semantic tag layer.
- Research and publication can reuse the same reviewed meaning objects.

### Constraints

- Future implementation must keep evidence and interpretation separate.
- Meaning objects must stay passage-grounded and review-aware.
- Theme and Revelation Map layers must not flatten distinct meanings into slogans.
- Automatic candidate generation must remain subordinate to human review.

### Follow-up

Future ADRs or implementation docs may be created for:

- meaning table and field design
- evidence table design
- confidence calculation details
- theme relation rules
- publication reuse workflow
- review and dispute handling

## Alternatives Considered

### Keep Only Strong-Centered Lexicon Work

Rejected. Strong is a coordinate system, not a meaning system.

### Use Semantic ID As The Primary Identity

Rejected. Semantic ID is too vague and can blur nodes, edges, and publication artifacts.

### Collapse Meaning, Theme, And Relation Into One Layer

Rejected. That would blur the difference between local meaning, canonical pattern, and flow relation.

