# Scripture Research Workspace Architecture Design

## Current State

Word Covenant Ministry now has the major Scripture research surfaces working in local development:

- Bible Reader with reader, original, and interlinear modes.
- Bible Search and Bible Study Workspace research navigation.
- Original Word, Strong Study, and Term Study workflows.
- Cross Reference data layer, public read API, Reader integration, Word Study integration, shared compact cards, shared preview modal, and review infrastructure.
- Gospel Harmony frontend MVP with runtime Bible text loading.
- Gospel Harmony Related Passages MVP using existing Cross Reference APIs.

These systems are still organized as separate surfaces. The Bible Reader is the central route, but deeper research workflows can move across drawers, right panels, modal previews, Gospel Harmony pages, and future admin/editor tools. CR-65 defines the next-generation workspace architecture that can unify these surfaces without changing schema, APIs, or runtime behavior in this phase.

## Workspace Goals

The Scripture Research Workspace should keep Scripture reading central while making research paths visible and repeatable.

Primary goals:

- Preserve Bible references as the main navigation anchor.
- Preserve original-language terms as the lexical study anchor.
- Connect Reader, Original Language, Word Study, Cross Reference, and Gospel Harmony without duplicating Bible text.
- Reuse existing preview, card, and Reader-link behavior.
- Keep all heavy data access lazy, bounded, and API-backed.
- Support Korean and English reading contexts through current locale/version routing.
- Prepare for Timeline, People & Events, Notes, and Research Collections without implementing them now.

## UX Model Options

### Option A: Expanded Reader Right Panel

The existing Bible Study Workspace right panel remains the main research hub. Current sections such as Search, Insight, and Related Passages can expand into a broader workspace navigation model.

Advantages:

- Fits the existing Reader-centered architecture.
- Keeps the current chapter visible during research.
- Reuses `ResearchPanelNavigation`, `CrossReferencePanel`, `ReaderSearchPanel`, and `PassageInsightPanel` patterns.

Limitations:

- Dense research workflows can crowd the right panel.
- Word Study and Gospel Harmony may need deeper views than a narrow panel can comfortably hold.

### Option B: Dedicated Research Workspace Route

Add a future route for multi-pane research, such as a Scripture Research Workspace that can coordinate Reader, Word Study, Related Passages, and Harmony views.

Advantages:

- Better for complex multi-step research.
- Can support saved workspace state later.
- More room for Timeline, People & Events, and Notes.

Limitations:

- Adds navigation complexity.
- Risks becoming a separate silo if not anchored to Bible references.
- Should not replace the Reader as the primary study surface.

### Option C: Contextual Drawers and Modals Only

Continue using contextual drawers and preview modals from existing surfaces.

Advantages:

- Minimal UI change.
- Works well for quick lookup flows.

Limitations:

- Harder to show relationships among Reader, Word Study, Cross Reference, and Harmony at once.
- Users can lose orientation across nested panels.

## Recommended Architecture

Use a hybrid architecture:

1. Keep the Bible Reader as the default Scripture Research Workspace.
2. Expand the research panel into a modular section framework.
3. Keep Word Study and Gospel Harmony as connected secondary surfaces.
4. Reuse shared reference UI for cards, preview modal, and Reader navigation.
5. Add a future dedicated research route only after the Reader-centered workflow stabilizes.

Recommended workspace layers:

- **Primary text layer:** Bible Reader chapter view with reader/original/interlinear modes.
- **Context layer:** selected verse, selected original-language token, selected term, selected harmony unit.
- **Research panel layer:** Search, Passage Insight, Related Passages, future Harmony Links, future Notes.
- **Detail layer:** Original Word Panel, Strong Study, Term Study, preview modal, future detail drawers.
- **Navigation layer:** Open in Reader links, target reference anchors, harmony unit URLs.

This keeps the user anchored in Scripture while allowing progressive disclosure for research depth.

## Reader Integration

Reader integration should remain the primary entry point.

Current Reader capabilities to preserve:

- `/{locale}/bible/{version}/{book}/{chapter}` route.
- `mode=reader`, `mode=original`, and `mode=interlinear`.
- Verse hash navigation such as `#v15`.
- Research panel sections for Search, Insight, and Related Passages.
- Cross Reference preview modal and Open in Reader links.

Future Reader workspace improvements should:

- Make selected verse state more explicit across panels.
- Avoid hiding research navigation when no verse is selected.
- Keep empty states calm and actionable.
- Avoid loading Related Passages, Word Study, or Harmony data until user intent is clear.
- Prefer "Related Passages" language over stronger theological labels for unreviewed OpenBible references.

## Word Study Integration

Word Study should remain a progressive lexical workflow:

1. Interlinear or Original Text token.
2. Original Word Panel.
3. Strong Study.
4. Term Study.
5. Related Passages from bounded sample occurrences.

The current Term Study Related Passages MVP should remain bounded:

- Uses existing APIs.
- Uses `sample_occurrences`.
- Limits occurrence groups and related targets.
- Reuses shared compact cards and preview modal.

Future workspace integration should allow a user to keep the Reader context visible while opening Term Study details. A future dedicated Word Study route can provide deeper filters and full occurrence browsing, but the Reader drawer remains the fastest in-context path.

## Cross Reference Integration

Cross References are reference-only relationships, not copied Bible text.

Current integrated surfaces:

- Reader Related Passages.
- Word Study Related Passages.
- Gospel Harmony Related Passages.
- Shared compact card UI.
- Shared preview modal.
- Review Tool infrastructure.

Workspace rules:

- OpenBible `theme` / `unreviewed` data remains discovery data.
- Public UI must not imply WCM editorial approval unless review status and visibility rules explicitly support it.
- Rejected or suppressed visibility behavior requires a separate approved phase before public filtering changes.
- Preview modal text must continue to load from the Bible API at runtime.

Architectural gap:

- `PassageInsightPanel` still uses curated/static cross-reference counting from `frontend/src/data/crossReferences.ts`. A future phase should align Insight counts with the imported Cross Reference API or explicitly label curated-only counts.

## Harmony Integration

Gospel Harmony should remain event/pericope-based and reference-only.

Current Harmony capabilities:

- URL-selectable units with `?unit=<slug>`.
- KRV/WEB runtime text loading through existing Bible APIs.
- Preview modal and Open in Reader behavior.
- Related Passages grouped by Gospel account using start-verse Cross Reference lookup.

Workspace integration should:

- Let Reader references link to relevant Harmony units later.
- Keep curated Harmony unit data distinct from OpenBible thematic discovery data.
- Avoid automatic `parallel_event` generation from OpenBible rows.
- Use conservative labels when showing unreviewed related passages in Harmony.

Future improvements may add a Harmony link section in the Reader research panel, but only after a Harmony-to-reference lookup strategy is designed.

## Future Timeline Compatibility

Timeline should be a future relationship layer anchored to events, passages, people, and dates or sequence markers.

Compatibility rules:

- Do not overload Cross Reference rows as timeline events.
- Gospel Harmony units can later become event candidates, but the first MVP should not force that schema.
- Timeline should reference Bible passages and curated event IDs, not copied Bible text.
- Timeline dates, sequence labels, and confidence should be explicit and reviewable.

The Workspace should reserve navigation patterns for future Timeline links, such as "Related Events" or "Timeline Context," without displaying placeholders before implementation.

## Future People & Events Compatibility

People & Events should be a future curated layer, not inferred from OpenBible Cross References.

Compatibility rules:

- People, places, and events should have their own reviewed identifiers.
- Links from Reader, Word Study, Cross Reference, and Harmony should point to those identifiers only after curated data exists.
- Cross Reference review tooling may inform future People/Event curation, but should not automatically create people or event records.
- Preview modal and Open in Reader links can be reused for passage references attached to people/events.

## MVP Scope

The first Workspace MVP should be a design-to-implementation bridge, not a new data platform.

Recommended MVP scope:

- Refine the existing Bible Study Workspace research panel architecture.
- Formalize a shared "research context" model in frontend state:
  - locale
  - Bible version
  - book
  - chapter
  - selected verse
  - mode
  - selected original term when available
- Keep current sections visible and stable:
  - Search
  - Insight
  - Related Passages
- Identify future section slots without rendering unimplemented tools:
  - Harmony
  - Word Study
  - Timeline
  - Notes
- Reuse existing cards, preview modal, and Open in Reader behavior.
- Do not add new APIs, schema, imports, or public visibility changes.

## Deferred Scope

Deferred items:

- Dedicated Scripture Research Workspace route.
- Saved research sessions or collections.
- Timeline schema/API/UI.
- People & Events schema/API/UI.
- Notes system.
- Public reviewed-only Cross Reference filtering.
- Cross Reference relationship-type editing in public UI.
- Term-wide Cross Reference aggregation across all occurrences.
- Harmony-to-Reader automatic unit lookup.
- Multi-pane desktop workspace with draggable/resizable panels.
- New backend endpoints for combined research payloads.

## Risks

- **Cognitive overload:** Too many research tools in one panel can obscure the Scripture text.
- **Editorial confusion:** Unreviewed OpenBible references may be mistaken for WCM conclusions if labeling is too strong.
- **Performance risk:** Combined research views can overfetch Cross References, Word Study data, and Harmony text if not lazy-loaded.
- **Mobile clutter:** Right-panel concepts can become cramped on small screens.
- **State complexity:** Reader mode, selected verse, selected term, and selected harmony unit can conflict if not modeled explicitly.
- **Data boundary risk:** Preview and research surfaces must not duplicate Bible text or raw source data.

## Recommended Phases

### CR-66: Workspace Architecture Approval Review

Review this design and decide whether the hybrid Reader-centered architecture is approved.

### CR-67: Workspace Context Model Design

Design frontend-only context contracts for locale, version, selected verse, mode, selected original term, and active research section.

Status: completed in `docs/ROADMAP/SCRIPTURE_RESEARCH_WORKSPACE_CONTEXT_MODEL_DESIGN.md`.

### CR-68: Research Panel Navigation Refinement

Refine `ResearchPanelNavigation` for future section extensibility while preserving current Search, Insight, and Related Passages behavior.

### CR-69: Workspace UX Validation

Browser-test Reader, Word Study, Related Passages, and Gospel Harmony handoffs on desktop and mobile.

### Later

Design Timeline, People & Events, Notes, and Research Collections only after the core workspace context remains stable.

## Validation Plan

For design-only CR-65:

- `git diff --check`
- `git status --short`

Future implementation validation should include:

- `cd frontend && npm run typecheck`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`
- Browser QA on:
  - Reader Search / Insight / Related Passages
  - Interlinear to Word Study
  - Word Study Related Passages
  - Gospel Harmony Related Passages
  - Preview modal focus return
  - Mobile layout

## Final Recommendation

Proceed with a Reader-centered Scripture Research Workspace architecture.

Do not create a new data model or standalone research platform yet. The next milestone should approve the architecture, then design a frontend research context model that connects existing surfaces without changing backend APIs, schema, imports, or public Cross Reference behavior.
