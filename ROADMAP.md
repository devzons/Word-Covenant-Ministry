# Word Covenant Ministry Roadmap

Word Covenant Ministry is a Christ-centered Scripture platform, not a generic CMS. The platform exists to help ministry content, study tools, media, language work, and future assistance stay ordered around Scripture and its testimony concerning Christ.

This roadmap follows the project constitution:

- Repository documentation is the source of truth.
- Scripture is the primary domain model.
- Future-impacting decisions must be recorded in `docs/DECISIONS/`.
- The official frontend is `frontend/`.
- The official WordPress plugin source is `backend/app/public/wp-content/plugins/wcm-core/`.
- The project uses a headless architecture: Next.js frontend, WordPress backend, and the `wcm-core` plugin.

## Biblical Interpretation Constitution

All Scripture interpretation features must follow these principles:

- Scripture interprets Scripture.
- All Scripture testifies about Christ.
- Original language usage must be traced throughout Scripture.
- Identical Hebrew and Greek words should be tracked across biblical usage.
- Pictographic observation (paja / 파자) is a supporting tool only.
- Pictographic observation may never create doctrine independently.

Interpretation order:

```txt
Original Meaning
-> Biblical Usage
-> Context
-> Pictographic Observation
-> Revelatory Significance
-> Christological Fulfillment
```

This order must not be reversed. Pictographic observations must remain subordinate to original meaning, biblical usage, and context.

## Prioritized Implementation Order

1. Phase 1: Foundation Platform
2. Phase 2: Scripture Engine
3. Phase 3: Original Language Engine
4. Phase 4: Word Study Engine
5. Phase 5: Pictographic Observation Engine
6. Phase 6: Christological Engine
7. Phase 7: Biblical Theme Engine
8. Phase 8: Media Platform
9. Phase 9: Digital Library
10. Phase 10: Online Bible School
11. Phase 11: Bible Knowledge Graph
12. Phase 12: AI Scripture Assistant

This order is intentional. The public platform must stabilize first, Scripture must become the central relationship model before language and word-study systems are built, and AI must wait until the ministry knowledge base is structured enough to constrain answers.

## MVP Definition

The MVP is complete when Phase 1 and the first usable slice of Phase 2 are working together:

- Users can browse sermons, Bible studies, books, resources, and media from the Next.js frontend.
- WordPress and `wcm-core` provide structured content APIs.
- Content can be related to Scripture references.
- Users can search ministry content.
- A passage page can display related sermons, Bible studies, books, resources, and media for a passage such as Matthew 13.
- Cloudflare Images and R2 are integrated for media storage and delivery foundations.
- SEO and multi-language foundations are in place.

The MVP should not attempt the full Original Language Engine, Word Study Engine, Pictographic Observation Engine, Christological Engine, or AI Scripture Assistant. Those depend on the Scripture Engine being stable.

## Long-Term Vision

Word Covenant Ministry should become a Scripture-centered knowledge platform where every sermon, Bible study, book, media item, language note, word study, pictographic observation, theme, and course is connected through biblical relationships.

The long-term platform should allow a user to begin with a passage, word, theme, sermon, course, or media item and trace:

```txt
Scripture
-> Original Language
-> Biblical Usage
-> Context
-> Word Studies
-> Pictographic Observations
-> Themes
-> Christological Fulfillment
-> Ministry Content
```

The system should help users see Scripture's internal witness, biblical development, and fulfillment in Christ without replacing pastoral teaching, hermeneutical care, or human review.

## Phase 1

### Phase

Foundation Platform

### Purpose

Create a stable Word Covenant Ministry platform.

### Features

- Next.js frontend
- WordPress backend
- WCM Core plugin
- Homepage
- Sermons
- Bible Studies
- Books
- Resources
- Cloudflare Images
- Cloudflare R2
- SEO foundation
- Multi-language foundation

### Architecture Impact

This phase establishes the headless foundation:

- `frontend/` owns the public application.
- WordPress owns content editing.
- `backend/app/public/wp-content/plugins/wcm-core/` owns custom backend behavior.
- Cloudflare becomes the media and delivery foundation.
- SEO and localization patterns become shared frontend concerns.

The platform must avoid generic CMS sprawl by modeling content with future Scripture relationships in mind, even before the full Scripture Engine exists.

### Dependencies

- Confirmed repository structure.
- Active Local WP backend.
- Active `wcm-core` plugin.
- Frontend routing and content rendering.
- Cloudflare account and environment configuration.
- Basic WordPress content models for sermons, Bible studies, books, and resources.

### Success Criteria

Users can browse, search, and consume ministry content.

The frontend can render the primary content types from WordPress APIs, media can be delivered through the Cloudflare foundation, and the project has a stable deployment path.

### Future Expansion

Phase 1 must leave room for Scripture references, content relationships, language metadata, media relationships, and multi-language growth without requiring structural rewrites.

## Phase 2

### Phase

Scripture Engine

### Purpose

Make Scripture the central domain model.

### Features

- Structured Scripture references
- Scripture indexing
- Scripture relationship engine
- Related content by passage
- Scripture search
- Passage pages

Example:

```txt
Matthew 13
```

Automatically shows:

- Sermons
- Bible studies
- Books
- Resources
- Media

### Architecture Impact

Scripture becomes the primary content relationship layer.

The `wcm-core` plugin should own canonical Scripture reference parsing, normalization, indexing, relationships, and API output. The frontend should render passage pages and related content without duplicating backend relationship logic.

### Dependencies

- Stable Phase 1 content models.
- Canonical Bible book, chapter, and verse representation.
- Reference parser and normalization strategy.
- Search index strategy.
- API contract for passage pages and related content.
- Decision record for any Scripture schema or indexing model that affects future development.

### Success Criteria

Users can open a passage page and see all related ministry content. Editors can associate sermons, Bible studies, books, resources, and media with structured Scripture references.

### Future Expansion

The Scripture Engine becomes the foundation for original language entries, word studies, themes, media relationships, courses, the Bible Knowledge Graph, and the AI Scripture Assistant.

## Phase 3

### Phase

Original Language Engine

### Purpose

Support Hebrew and Greek study.

### Features

- Hebrew entries
- Greek entries
- Lemma database
- Root tracking
- Scripture usage tracking
- Original language search

Examples:

```txt
זרע
σπέρμα
```

Shows:

- Meaning
- Usage
- Related passages
- Related content

Important: do not create a generic dictionary. Focus on biblical usage.

### Architecture Impact

The Original Language Engine adds a language layer to the Scripture Engine. Hebrew and Greek entries should connect to Scripture references, lemmas, roots, and ministry content through biblical usage.

The backend should own canonical language records and usage mappings. The frontend should expose search, entry pages, and related content views.

### Dependencies

- Scripture Engine reference model.
- Biblical text usage source strategy.
- Hebrew and Greek normalization conventions.
- Lemma and root modeling.
- Search index support for Unicode Hebrew and Greek.
- Editorial workflow for reviewed language entries.

### Success Criteria

Users can search a Hebrew or Greek term and see its meaning, biblical usage, related passages, and related ministry content.

### Future Expansion

This phase supports Word Study Engine usage maps, Christological pathways, theme development, and the AI Scripture Assistant's constrained knowledge base.

## Phase 4

### Phase

Word Study Engine

### Purpose

Trace words through Scripture.

### Features

- Word studies
- Biblical usage maps
- Cross references
- Thematic relationships

Example:

```txt
ראה
"to see"
```

Trace:

- Old Testament usage
- New Testament fulfillment
- Related studies
- Related sermons

Important: word studies must move toward revelation and Christological significance.

### Architecture Impact

The Word Study Engine connects Original Language entries to Scripture usage, themes, sermons, Bible studies, books, and media. It should not duplicate the Original Language Engine; it should use that engine as its lexical foundation.

Word studies should follow the interpretation order:

```txt
Original Meaning
-> Biblical Usage
-> Context
-> Revelatory Significance
-> Christological Fulfillment
```

Pictographic observations may be linked later, but they must not control the meaning of the word study.

### Dependencies

- Scripture Engine.
- Original Language Engine.
- Cross-reference strategy.
- Thematic relationship model.
- Editorial review process.

### Success Criteria

Users can trace a biblical word through usage, related passages, related sermons, and fulfillment-oriented teaching without losing the distinction between lexical meaning, biblical usage, and theological significance.

### Future Expansion

Word studies become major nodes in the Bible Knowledge Graph and provide reviewed context for the AI Scripture Assistant.

## Phase 5

### Phase

Pictographic Observation Engine

### Purpose

Support Hebrew pictographic observation.

### Features

- Hebrew letter observation
- Pictographic notes
- Related studies

Important constitutional rule: pictographic observation is supplementary.

The system must present:

1. Original Meaning
2. Biblical Usage
3. Context
4. Pictographic Observation

in that order.

Never reverse the order.

Never generate doctrine from pictographs.

### Architecture Impact

Pictographic observations should be modeled as supporting annotations, not primary lexical definitions and not doctrinal sources.

The backend must represent pictographic notes as subordinate to language entries, word studies, and Scripture context. The frontend must visually and structurally present them after original meaning, biblical usage, and context.

### Dependencies

- Original Language Engine.
- Word Study Engine.
- Editorial safeguards.
- UI patterns that enforce interpretation order.
- Content review rules that prevent doctrine from being generated from pictographs.

### Success Criteria

Users can view Hebrew letter observations and pictographic notes only as supporting observations beneath original meaning, biblical usage, and context.

### Future Expansion

Pictographic observations can enrich word studies, teaching notes, and media references, but they remain subordinate in the knowledge graph and AI assistant.

## Phase 6

### Phase

Christological Engine

### Purpose

Connect biblical themes to Christ.

### Features

- Theme tracking
- Fulfillment relationships
- Christological pathways

Examples:

- Seed
- Lamb
- Temple
- Covenant
- Light
- Shepherd

The system should show:

```txt
Theme
-> Biblical Development
-> Christological Fulfillment
```

### Architecture Impact

The Christological Engine connects Scripture references, themes, word studies, and content to fulfillment in Christ. It must be grounded in Scripture, not isolated topical association.

This phase adds fulfillment relationships and pathway views that can be rendered in the frontend and exposed through backend APIs.

### Dependencies

- Scripture Engine.
- Word Study Engine.
- Biblical Theme model.
- Editorial review of fulfillment relationships.
- Interpretation constitution embedded in content workflow.

### Success Criteria

Users can trace a theme or word from biblical development to Christological fulfillment with supporting passages and related ministry content.

### Future Expansion

Christological pathways become high-value nodes for courses, books, teaching series, theme pages, and AI assistant answers.

## Phase 7

### Phase

Biblical Theme Engine

### Purpose

Trace themes across Scripture.

### Features

- Covenant
- Kingdom
- Seed
- Sacrifice
- Temple
- Shepherd
- Light
- Water
- Bread
- Rest

Show:

```txt
Genesis
-> Prophets
-> Gospels
-> Epistles
-> Christ
```

### Architecture Impact

The Biblical Theme Engine adds structured theme nodes and biblical development sequences. Themes should connect to Scripture, Original Language entries, Word Studies, Christological pathways, sermons, Bible studies, books, and media.

Theme modeling must avoid generic tagging. Themes are theological-biblical relationships that require reviewed structure and supporting passages.

### Dependencies

- Scripture Engine.
- Word Study Engine.
- Christological Engine.
- Theme taxonomy or entity model.
- Relationship weighting or ordering strategy.

### Success Criteria

Users can trace a biblical theme across the canon and see how related passages, words, sermons, studies, books, and media develop the theme toward Christ.

### Future Expansion

Theme pages become navigation hubs for the Bible Knowledge Graph, online courses, curated studies, and AI assistant retrieval.

## Phase 8

### Phase

Media Platform

### Purpose

Create a unified media system.

### Features

- YouTube integration
- Cloudflare Stream
- Audio
- Transcript
- Media relationships

Media should connect to:

- Scripture
- Word studies
- Themes
- Books

### Architecture Impact

Media becomes a first-class content type connected to Scripture and study systems. Cloudflare Stream and other media integrations must follow ADR-0004.

Transcripts should become searchable and linkable to Scripture references, themes, words, and studies.

### Dependencies

- Foundation Platform.
- Cloudflare strategy.
- Scripture Engine.
- Media metadata model.
- Transcript ingestion and review workflow.
- Search indexing.

### Success Criteria

Users can watch, listen, read transcripts, and discover related Scripture, studies, themes, books, and courses from a unified media experience.

### Future Expansion

Media transcripts become important retrieval sources for the Bible Knowledge Graph and AI Scripture Assistant.

## Phase 9

### Phase

Digital Library

### Purpose

Create a permanent ministry library.

### Features

- Books
- Manuscripts
- PDFs
- Research notes
- Study charts
- Download center

### Architecture Impact

The Digital Library formalizes durable ministry documents and research artifacts. Library items should connect to Scripture references, language entries, word studies, themes, sermons, Bible studies, and media.

Cloudflare R2 should be considered for durable file storage, with WordPress owning metadata and the frontend owning public presentation.

### Dependencies

- Foundation Platform.
- Cloudflare R2 strategy.
- Scripture Engine.
- Search and metadata model.
- Download permissions and public/private rules.

### Success Criteria

Users can browse, search, read, and download approved ministry library resources with Scripture and theme relationships.

### Future Expansion

Library resources become course materials, Knowledge Graph nodes, and reviewed sources for the AI Scripture Assistant.

## Phase 10

### Phase

Online Bible School

### Purpose

Structured biblical education.

### Features

- Courses
- Lessons
- Progress tracking
- Quizzes
- Certificates

### Architecture Impact

The Online Bible School adds structured learning flows on top of the Scripture, media, theme, and library layers.

Courses should be content assemblies, not isolated LMS silos. Lessons should connect to Scripture passages, themes, word studies, media, books, and assessments.

### Dependencies

- Foundation Platform.
- Media Platform.
- Digital Library.
- Scripture Engine.
- User account and progress strategy.
- Assessment and certificate model.

### Success Criteria

Users can enroll in structured courses, complete lessons, track progress, take quizzes, and receive certificates while staying connected to Scripture and ministry content.

### Future Expansion

Courses can generate guided learning paths through the Bible Knowledge Graph and provide curated contexts for AI assistance.

## Phase 11

### Phase

Bible Knowledge Graph

### Purpose

Create Scripture-centered relationships.

### Features

Relationships:

```txt
Scripture
<-> Themes
<-> Original Language
<-> Word Studies
<-> Pictographic Studies
<-> Sermons
<-> Bible Studies
<-> Books
<-> Media
```

This becomes the central knowledge layer.

### Architecture Impact

The Bible Knowledge Graph consolidates relationships from earlier phases into a central graph layer. It should represent reviewed relationships among Scripture, themes, language, word studies, pictographic observations, sermons, Bible studies, books, media, library resources, and courses.

This layer must preserve interpretive hierarchy. Not all relationships have equal authority; Scripture, original meaning, biblical usage, and context must govern interpretive weight.

### Dependencies

- Scripture Engine.
- Original Language Engine.
- Word Study Engine.
- Pictographic Observation Engine.
- Christological Engine.
- Biblical Theme Engine.
- Media Platform.
- Digital Library.
- Online Bible School.
- Relationship model, indexing, and query strategy.

### Success Criteria

Users can move from any major content node to related Scripture, themes, language entries, word studies, media, books, studies, and courses through reviewed Scripture-centered relationships.

### Future Expansion

The Bible Knowledge Graph becomes the primary retrieval and reasoning layer for the AI Scripture Assistant.

## Phase 12

### Phase

AI Scripture Assistant

### Purpose

Provide ministry-specific biblical assistance.

### Features

The assistant must use:

- Scripture Engine
- Original Language Engine
- Word Study Engine
- Pictographic Observation Engine
- Christological Engine

The assistant should answer from the ministry knowledge base rather than generic internet data.

### Architecture Impact

The AI Scripture Assistant should be a controlled retrieval and response layer over reviewed ministry knowledge. It must not bypass the interpretation constitution.

Answers should cite or point to ministry-owned sources where possible: Scripture references, word studies, language entries, sermons, Bible studies, books, media, and decision-approved theological structures.

The assistant must maintain this order:

```txt
Original Meaning
-> Biblical Usage
-> Context
-> Pictographic Observation
-> Revelatory Significance
-> Christological Fulfillment
```

It must never generate doctrine from pictographic observations.

### Dependencies

- Bible Knowledge Graph.
- Reviewed source content.
- Search and retrieval layer.
- Guardrails for interpretation order.
- Citation and source-linking strategy.
- Human review process for sensitive theological content.
- Privacy and data retention decisions.

### Success Criteria

Users can ask ministry-specific biblical questions and receive answers grounded in Scripture, reviewed ministry content, original language usage, word studies, themes, and Christological fulfillment.

The assistant avoids generic internet synthesis and clearly separates original meaning, biblical usage, context, pictographic observation, revelatory significance, and Christological fulfillment.

### Future Expansion

The assistant can support guided studies, course help, sermon discovery, passage exploration, language study, and pastoral research workflows while remaining under the documented interpretation constitution.

## Architectural Dependencies Between Phases

```txt
Phase 1 Foundation Platform
-> Phase 2 Scripture Engine
-> Phase 3 Original Language Engine
-> Phase 4 Word Study Engine
-> Phase 5 Pictographic Observation Engine
-> Phase 6 Christological Engine
-> Phase 7 Biblical Theme Engine
-> Phase 8 Media Platform
-> Phase 9 Digital Library
-> Phase 10 Online Bible School
-> Phase 11 Bible Knowledge Graph
-> Phase 12 AI Scripture Assistant
```

Key dependency rules:

- Phase 2 must precede language, word study, theme, media relationship, library relationship, course relationship, graph, and AI work.
- Phase 3 must precede serious word-study automation.
- Phase 5 must not precede original meaning, biblical usage, and context modeling.
- Phase 6 and Phase 7 depend on reviewed Scripture relationships and should not become loose topical tagging.
- Phase 11 depends on the earlier engines because the graph should connect reviewed knowledge, not invent relationships.
- Phase 12 depends on Phase 11 because AI needs a reviewed knowledge layer and interpretive guardrails.

## Risks And Recommendations

### Risks

- Generic CMS drift: content types could become disconnected from Scripture.
- Duplicate architecture: agents could create alternate plugin paths, helper folders, or parallel modules.
- Premature AI: an assistant built before reviewed engines may produce generic or unsupported answers.
- Pictographic overreach: pictographic observations could be mistaken for doctrine if not structurally subordinated.
- Weak language modeling: Hebrew and Greek entries could become a generic dictionary instead of biblical usage tracking.
- Search fragmentation: content search, Scripture search, language search, and media transcript search could become disconnected.
- Cloudflare sprawl: Images, R2, Stream, DNS, CDN, and WAF configuration could become undocumented or inconsistent.
- Editorial bottlenecks: the more relationships the system supports, the more human review is needed.

### Recommendations

- Preserve Scripture as the central domain model in every phase.
- Create decision records before changing architecture, schema, plugin structure, API contracts, deployment strategy, Cloudflare strategy, or scripture engine behavior.
- Build small vertical slices: one passage page, one word study, one language entry, one theme pathway, one media transcript workflow.
- Treat pictographic observation as a displayed annotation layer, never as a doctrinal engine.
- Make relationship provenance visible: every connection should have a source, reason, or editorial status.
- Keep WordPress plugin logic inside `backend/app/public/wp-content/plugins/wcm-core/`.
- Keep frontend rendering and interaction logic inside `frontend/`.
- Prefer reviewed ministry content over external or generic data sources.
- Delay AI until the Scripture Engine, language data, word studies, themes, and knowledge graph are reliable.

