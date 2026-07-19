# ADR-0017 Revelation Language Platform Semantic Architecture

## Status

Accepted

## Date

2026-07-19

## Context

Word Covenant Ministry now needs a single top-level architecture that can hold together:

- Scripture reading
- original-language study
- lexical meaning analysis
- Hebrew and Greek alignment
- New Testament reception
- study notes and research collections
- papers and books
- future commentary

The repository already contains focused architecture documents for Scripture research, original-language modeling, Scripture relationships, and content domains. What it did not yet have was one umbrella decision that defines how those layers fit together under a meaning-first, Scripture-first platform constitution.

This ADR also needs to preserve several long-term guardrails:

- Strong numbers are coordinates, not meaning identities.
- Evidence must stay separate from interpretation.
- Raw data, semantic relations, and published prose must not be collapsed into one layer.
- Progressive disclosure should serve both general readers and researchers.

## Decision

Word Covenant Ministry will use the Revelation Language Platform as the top-level semantic architecture for Scripture meaning and publication.

The platform will be organized around these conceptual layers:

- Bible Reading
- Interlinear
- Meaning Card
- Usage and Context
- LXX Alignment
- New Testament Reception
- Meaning Journey
- Revelation Map
- Evidence
- Study and Publishing

The platform will follow these rules:

- Scripture remains primary.
- Meaning comes before tooling.
- Strong numbers remain external coordinates.
- Translation is a relation, not identity.
- Interpretation must stay separated from evidence and source data.
- Study output should be reusable for publication without duplicating research.

This ADR does not approve any specific database schema, API route, migration, import, or runtime UI implementation. It only establishes the architectural direction that future implementation work must follow.

## Consequences

### Positive

- The project now has one umbrella architecture for Scripture meaning and publication.
- Existing Scripture Research, original-language, cross-reference, and content docs can be treated as subordinate implementation layers.
- Future Meaning Card, Meaning Journey, Revelation Map, and study/publishing work can share one vocabulary.
- Review and evidence disciplines can be defined once and reused across features.

### Constraints

- Future implementation must keep evidence, semantic relations, and published interpretation separate.
- Strong-number-centered workflows must remain available, but they must not become the architecture's primary identity model.
- Hebrew/Greek/LXX/NT relationships must remain typed and reviewable rather than flattened into identity claims.

### Follow-up

Future ADRs or implementation documents may be created for:

- Meaning Card model details
- Meaning Journey relation rules
- Revelation Map node/edge design
- Evidence and review workflow details
- Study and Publishing pipeline implementation

## Alternatives Considered

### Keep Only The Existing Workspace-Level Architecture Docs

Rejected. The project already needed a higher-level architecture that could unify study, meaning, and publication.

### Make Strong Numbers The Primary Identity Layer

Rejected. Strong numbers are useful coordinates, but they are not a full meaning architecture.

### Collapse Evidence, Relation, And Interpretation Into One Layer

Rejected. That would blur the boundary between source data, semantic relations, and published interpretation.
