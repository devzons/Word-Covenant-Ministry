# Scripture Research Workspace Context Model Design

## Current State

The Scripture Research Workspace is currently Reader-centered.

Existing research state is distributed across several surfaces:

- Bible Reader route state: locale, Bible version, book, chapter, mode, and verse hash.
- Research panel state: active section such as Search, Insight, or Related Passages.
- Original-language state: selected occurrence/token opened from Original Text or Interlinear mode.
- Word Study state: selected Strong number or term opened through the Original Word and Strong Study panels.
- Cross Reference state: selected verse and paginated Related Passages.
- Gospel Harmony state: selected harmony unit from the `?unit=` query parameter.
- Shared preview modal state: selected target reference, current Bible version, loading/error/unsupported preview state.

This phase defines a normalized frontend context model only. It does not approve code implementation, API changes, schema changes, imports, migrations, or new routes.

## Context Model Goals

The shared research context should:

- Preserve the Bible reference as the primary navigation anchor.
- Preserve original-language terms as lexical study anchors.
- Allow Reader, Word Study, Cross Reference, and Gospel Harmony to coordinate without duplicating state ad hoc.
- Keep current Reader behavior stable during migration.
- Keep all heavy research data lazy-loaded and bounded.
- Support mobile layouts without forcing every tool to appear at once.
- Prepare for Timeline, People & Events, Notes, and Collections without implementing them now.

## Proposed Context Shape

Recommended TypeScript-style design shape for a future frontend model:

```ts
type ScriptureResearchSourceSurface =
  | "reader"
  | "search"
  | "original"
  | "interlinear"
  | "word_study"
  | "cross_reference"
  | "gospel_harmony"
  | "preview_modal";

type ScriptureResearchMode = "reader" | "original" | "interlinear";

type ScriptureResearchSection =
  | "search"
  | "insight"
  | "related-passages"
  | "word-study"
  | "harmony"
  | "timeline"
  | "notes";

type ScriptureReferenceRange = {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse?: number;
};

type SelectedOriginalTermContext = {
  termId?: number;
  occurrenceId?: number;
  strongsNumber?: string;
  source?: "STEP_TAGNT" | "STEP_TAHOT" | string;
  reference?: ScriptureReferenceRange;
};

type ScriptureResearchContext = {
  locale: "ko" | "en";
  version: string;
  book: string;
  chapter: number;
  verse?: number;
  selectedReferenceRange?: ScriptureReferenceRange;
  selectedOriginalTerm?: SelectedOriginalTermContext;
  selectedStrongNumber?: string;
  activeResearchSection: ScriptureResearchSection;
  sourceSurface: ScriptureResearchSourceSurface;
  harmonyUnitId?: string;
  mode: ScriptureResearchMode;
};
```

This shape should be treated as a design contract, not implementation approval.

## MVP Fields

MVP fields should be stable, Reader-compatible, and already available from current routes or component state.

| Field | Classification | Purpose | Notes |
| --- | --- | --- | --- |
| `locale` | Required | Determines UI language and default Bible version behavior. | URL-owned today. |
| `version` | Required | Determines runtime Bible text source for Reader, previews, and links. | URL-owned today. |
| `book` | Required | Current canonical book slug. | URL-owned today. |
| `chapter` | Required | Current chapter. | URL-owned today. |
| `mode` | Required | Current Reader mode: reader, original, or interlinear. | Query-owned today. |
| `activeResearchSection` | Required | Active workspace panel section. | Local state today; can later sync to URL if needed. |
| `verse` | Optional MVP | Current selected verse. | Derived from hash or current selection. |
| `selectedReferenceRange` | Optional MVP | Current verse/range target for preview and future range-aware tools. | Single verse can be normalized into a range. |
| `sourceSurface` | Optional MVP | Tracks where the latest context change came from. | Useful for focus return and UX decisions. |

## Optional Fields

Optional fields are useful in MVP-adjacent flows but should not be required for every Reader context.

| Field | Classification | Purpose | Notes |
| --- | --- | --- | --- |
| `selectedOriginalTerm` | Optional | Carries selected occurrence/term context from Original Text or Interlinear. | Only present after user opens original-language study. |
| `selectedStrongNumber` | Optional | Carries Strong-level grouping context. | May be duplicated inside `selectedOriginalTerm`; keep only if UX needs direct access. |
| `harmonyUnitId` | Optional | Current Gospel Harmony unit. | Present on Gospel Harmony route or future Reader-to-Harmony links. |

## Derived Fields

Derived fields should not be stored as authoritative context when they can be computed.

- `referenceLabel`: derived from locale, book labels, chapter, and verse/range.
- `readerHref`: derived from locale, version, book, chapter, mode, and verse hash.
- `isOldTestament` / `isNewTestament`: derived from canonical book metadata.
- `sourceLanguage`: derived from book/testament or original-language source.
- `hasSelectedVerse`: derived from `verse` or `selectedReferenceRange`.
- `previewSupported`: derived from range shape and preview limits.

## Future Fields

Future fields should be reserved for later design phases only.

| Field | Future Use |
| --- | --- |
| `timelineEventId` | Future Timeline integration. |
| `personId` | Future People layer. |
| `placeId` | Future Places layer. |
| `eventId` | Future curated event model beyond Gospel Harmony fixtures. |
| `collectionId` | Future Research Collections. |
| `noteId` | Future Notes workflow. |
| `reviewFilter` | Future Cross Reference review/admin surfaces, not public Reader context. |
| `workspaceLayout` | Future multi-pane or saved layout state. |

## Context Ownership

### Reader-Owned Context

Current safest state:

- Reader route owns locale, version, book, chapter, mode, and verse hash.
- Reader components pass context down to research panels.

Advantages:

- Matches current implementation.
- Minimizes migration risk.
- Keeps Scripture text central.

Limitations:

- Word Study, Cross Reference, and Harmony can duplicate navigation logic.
- Complex future tools may need broader context than Reader local state exposes.

### Workspace-Owned Context

Future target:

- A Scripture Research Workspace provider owns normalized context.
- Reader becomes one consumer and controller of the primary reference.

Advantages:

- Better cross-tool coordination.
- Cleaner future Timeline, People, Notes, and Collections integration.
- Reduces duplicated state parsing.

Limitations:

- Higher migration risk if introduced too early.
- Can overcomplicate current Reader MVP.

### Shared Provider / Context Layer

Recommended migration model:

- Start with a thin provider wrapping the Reader workspace.
- Initialize provider from current route and Reader props.
- Keep Reader route as canonical for reference navigation.
- Gradually move cross-tool shared state into the provider.

The provider should not fetch heavy data by itself. It should hold context only; individual tools remain responsible for lazy loading.

## State Transition Rules

### User Changes Bible Version

- Update `version`.
- Preserve locale if user changed version inside the same locale context.
- Preserve book/chapter when the selected version supports the reference.
- Clear loaded preview state.
- Keep selected verse/range if still valid.
- Do not auto-load Related Passages or Word Study data.

### User Changes Locale

- Update `locale`.
- Apply route policy for version selection, such as Korean/KRV and English/WEB.
- Preserve book/chapter where possible.
- Clear locale-specific UI labels and runtime preview state.
- Do not mutate Cross Reference data or review status.

### User Changes Chapter

- Update `book` and `chapter`.
- Clear `verse` unless a hash anchor is provided.
- Clear `selectedReferenceRange` unless navigation includes a target verse.
- Clear selected original term and Strong context.
- Keep active research section if it remains meaningful, but show empty state where no verse is selected.

### User Selects a Verse

- Set `verse`.
- Normalize `selectedReferenceRange` to the selected single verse.
- Keep `book`, `chapter`, `locale`, `version`, and `mode`.
- Allow Related Passages and Insight panels to update.
- Do not auto-open preview modal.

### User Opens Original Word Panel

- Set `sourceSurface` to `original` or `interlinear`.
- Set `selectedOriginalTerm` with occurrence, term, source, and reference data available from current API response.
- Set `selectedStrongNumber` if present.
- Preserve selected verse/range.
- Do not switch active research section unless current UI explicitly does so.

### User Opens Strong Study

- Keep `selectedOriginalTerm`.
- Set or confirm `selectedStrongNumber`.
- Preserve Reader reference context.
- Load Strong data only after user action.

### User Opens Term Study

- Set `selectedOriginalTerm.termId` when a term is selected.
- Preserve Strong context if available.
- Preserve Reader reference context.
- Term Study Related Passages should lazy-load only after user intent.

### User Opens Related Passages

- Set `activeResearchSection` to `related-passages`.
- Use `selectedReferenceRange` or selected verse as the lookup basis.
- If no selected verse exists, render an empty state rather than hiding the section.
- Fetch Cross References only when the section is active or when the existing component policy explicitly loads for that panel.

### User Opens Gospel Harmony Unit

- Set `harmonyUnitId`.
- Set `sourceSurface` to `gospel_harmony`.
- Keep locale and version.
- Use Harmony unit passages as separate account-level references.
- Do not overwrite Reader book/chapter unless user chooses Open in Reader.

### User Clicks Open in Reader

- Navigate to the target Reader URL.
- Update locale/version/book/chapter/mode from the target link.
- Set verse hash from target start verse.
- Clear modal preview state.
- Clear stale selected original term unless the target link explicitly preserves term context.
- Preserve active research section only when it remains meaningful for the target.

## URL Sync Rules

### URL-Owned Fields

These fields should stay URL-synced because they define navigable state:

- `locale`
- `version`
- `book`
- `chapter`
- `mode`
- `verse` through hash, such as `#v15`
- `harmonyUnitId` through Gospel Harmony `?unit=...`

### Optional URL-Synced Fields

These may be URL-synced later, but should not be required in the first context implementation:

- `activeResearchSection`, possibly as `?panel=related-passages`
- `selectedStrongNumber`, only for future dedicated Word Study routes
- `selectedOriginalTerm.termId`, only for future dedicated Term Study routes

### Not URL-Synced in MVP

These should remain in component/provider state:

- Preview modal open/closed state.
- Preview modal loading/error/result state.
- Pagination pages for embedded Related Passages.
- Internal focus-return targets.
- Internal review/admin filters.
- Temporary drawer expansion state.

## Tool Boundary Rules

### Reader

Reader is reference-driven.

It owns or consumes:

- locale
- version
- book
- chapter
- mode
- verse hash

Reader should not own Word Study internals or Gospel Harmony event internals long term.

### Word Study

Word Study is term-driven.

It consumes:

- selected original term
- Strong number
- term ID
- sample occurrences
- locale/version for previews and Reader links

It should not generate Cross Reference relationships or infer theology from occurrence data.

### Cross Reference

Cross Reference is reference-driven.

It consumes:

- source reference
- locale/version for preview and Reader links
- active panel/user intent

It should preserve reference-only data boundaries and conservative labels for OpenBible `theme` / `unreviewed` rows.

### Gospel Harmony

Gospel Harmony is event/pericope-driven.

It consumes:

- harmony unit ID
- curated passage references
- locale/version for runtime text
- Cross Reference lookup only when user requests Related Passages

Harmony should remain separate from OpenBible thematic references and should not auto-generate `parallel_event` relationships.

### Future Timeline / People & Events

Timeline and People/Events are future consumers.

They may consume:

- reference ranges
- harmony unit IDs
- future curated event/person/place IDs

They should not be introduced into MVP context as required fields.

## Performance Rules

### Loads Immediately

Immediate loads may include:

- Current Bible chapter text.
- Basic book/chapter metadata.
- Current reader mode data needed for visible mode only.
- Minimal research panel shell/navigation.

### Loads After User Action

Lazy-load after user intent:

- Cross Reference Related Passages.
- Term Study Related Passages.
- Gospel Harmony Related Passages.
- Preview modal Bible passage text.
- Strong Study details.
- Term Study details.
- Search query results.

### Never Auto-Load in MVP

Do not auto-load:

- Full Cross Reference datasets.
- All occurrences for a term.
- All Gospel Harmony related references.
- Timeline or People/Event data.
- Review/admin data in public workspace.
- Bible text for every visible related card.

## Mobile UX Rules

Mobile workspace behavior should:

- Keep Scripture text first.
- Stack research sections below the text or inside explicit drawers.
- Avoid side-by-side multi-column research layouts.
- Keep preview modal bounded and scrollable.
- Avoid showing several heavy research panels at once.
- Keep active research section obvious.
- Keep Open in Reader links reachable.
- Preserve focus return after modal close.
- Prefer "Load" or "Expand" actions before fetching secondary data.

## Migration Path

### Step 1: Document Context Contract

CR-67 defines the contract and field classifications.

### Step 2: Keep Reader as Source of Truth

In the first implementation phase, continue deriving context from Reader route and current Reader component props.

### Step 3: Add Thin Frontend Context Provider

Introduce a provider only after approval. It should hold normalized context but not fetch data.

### Step 4: Move Research Panel Consumers Gradually

Update Search, Insight, and Related Passages to consume context from the provider while preserving props during transition.

### Step 5: Add Word Study Context Bridge

Allow Original Word, Strong Study, and Term Study panels to publish selected term context without changing APIs.

### Step 6: Add Harmony Context Bridge

Allow Gospel Harmony to publish selected unit context when entered from Harmony surfaces or future Reader links.

### Step 7: Evaluate Dedicated Workspace Route Later

Only after the shared context stabilizes should WCM consider a dedicated Scripture Research Workspace route.

## Risks

- **State duplication:** Reader props and provider context can drift if migration is not incremental.
- **URL mismatch:** Hash, mode query, and active panel state can conflict if URL sync is too aggressive.
- **Mobile overload:** A shared context can tempt the UI to display too many sections at once.
- **Performance regressions:** Context changes can accidentally trigger eager fetches.
- **Editorial confusion:** Cross Reference and Harmony data must remain clearly distinguished.
- **Focus management:** Modal and drawer interactions must keep focus return behavior intact.

## Validation Plan

For this design-only phase:

- `git diff --check`
- `git status --short`

For future implementation:

- `cd frontend && npm run typecheck`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`
- Browser QA:
  - Reader navigation and mode changes.
  - Verse hash selection.
  - Search, Insight, and Related Passages panel transitions.
  - Original/Interlinear token selection.
  - Strong Study and Term Study panel flow.
  - Term Study Related Passages lazy load.
  - Gospel Harmony unit navigation.
  - Preview modal focus return.
  - Mobile layout with no horizontal overflow.

## Final Recommendation

Approve a gradual migration from Reader-owned state to a shared frontend Scripture Research Workspace context provider.

The first implementation should be frontend-only and should not change APIs, schema, imports, migrations, or public Cross Reference visibility. The provider should normalize context and coordinate existing tools, while individual tools continue to lazy-load their own bounded data after user intent.
