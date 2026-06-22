# Research Workflow Audit

Status: Audit only  
Date: 2026-06-22  
Scope: Bible Study Workspace, Word Study, Search, Cross Reference, Gospel Harmony

## Purpose

This audit reviews the current Scripture research workflows from a user perspective. It does not approve new data, new APIs, schema changes, imports, or backend work. The goal is to identify friction and simplification opportunities before expanding the research surface further.

## Summary

The current research foundation is usable for beta-level study: Bible reading, search, original text, interlinear study, Strong study, term study, distribution, occurrences, curated cross references, and Gospel Harmony foundations are all present. The main risk is not missing capability, but accumulated navigation depth and competing panels that can make the research flow feel heavier than the Scripture reading task.

Priority should be given to clearer navigation labels, fewer repeated controls, consistent back behavior, and reducing the number of user decisions needed to move from reading to a useful study result.

## 1. Word Study Workflow

### Current Flow

1. User opens a Bible chapter.
2. User switches to interlinear mode or original text mode.
3. User clicks an original-language token.
4. Original Word Panel opens.
5. User enters Strong Study from the selected word.
6. Strong Study lists grouped terms under the Strong number.
7. User opens Term Study for a specific term.
8. Term Study shows basic term fields, Scripture Insight, and actions for Distribution or Occurrences.
9. User can move to Distribution or Occurrence Explorer, then return to Term Study.

### Friction Points

- The path from a Bible verse to all occurrences is deep: token -> word panel -> Strong Study -> Term Study -> Occurrences.
- Strong Study and Term Study both contain counts and term metadata, which can feel repetitive.
- The difference between Strong Study and Term Study is not obvious to a non-technical reader.
- Distribution and Occurrence Explorer are sibling views, but the user may not understand when to use each.
- Back buttons are present, but the drawer does not yet expose a compact breadcrumb of the full path.

### Redundant UI

- Term counts appear at multiple layers.
- Transliteration and gloss appear in word, Strong, and term contexts.
- "View Distribution" and "View all occurrences" appear as peer actions, but similar summary data is already visible in Scripture Insight.

### Suggested Simplifications

- Add a compact breadcrumb-like context row in the drawer: Word -> Strong -> Term -> Distribution/Occurrences.
- Rename "Strong Study" copy to explain it as a grouped Strong-number view, or reduce its prominence when only one term exists.
- Keep Term Study as the primary hub; Distribution and Occurrences should feel like subviews, not separate tools.
- Consider showing the most useful next action first: for many terms, "전체 출현 보기" may be more immediately useful than "분포 보기".
- Collapse repeated metadata after the user enters deeper views.

### Priority Ranking

High. This is the most powerful workflow, but also the deepest and easiest to make confusing.

## 2. Search Workflow

### Current Flow

1. User opens Bible Study Workspace.
2. Search panel is available in the right research panel.
3. User enters a query; one-character Korean searches are allowed.
4. Results show as a compact concordance list.
5. Clicking a result navigates the reader to the target chapter and verse.
6. The query is preserved in the URL and the search results reload after navigation.

### Friction Points

- Search is in the right panel, while the main Bible text is on the left; this is good on desktop but becomes sequential on mobile.
- Result click changes the main passage, but the user may miss that the right panel still represents the previous query.
- Search result highlighting helps, but there is no scope reminder that search is whole KRV Bible, not current chapter.
- There is no explicit "clear search" control beyond emptying and submitting the input.

### Redundant UI

- Search exists both as a dedicated page and as a workspace panel.
- The search panel and search page share similar behavior but are not visually identical.

### Suggested Simplifications

- Add a small static scope label later: "KRV 전체 검색" / "Searches all KRV".
- Consider a visible clear button inside the panel.
- Keep the compact concordance list; it is a good fit for Bible study.
- Avoid adding filters until users clearly need them.
- Keep the dedicated search page as a focused fallback, but make the workspace panel the primary research flow.

### Priority Ranking

Medium. The core flow works, but a scope label and clear action would reduce confusion.

## 3. Cross Reference Workflow

### Current Flow

1. User opens a Bible chapter in the Bible Study Workspace.
2. User selects the "참조 / Cross Ref" section in the research panel.
3. The panel checks the current chapter or selected verse against curated reference ranges.
4. Matching references show labels, relationship type badges, notes when present, and target links.
5. Clicking a target opens the referenced passage in reader mode.

### Friction Points

- The current matching context is implicit. Users may not know whether references are chapter-based or verse-based.
- Empty state can feel like the feature is incomplete, especially because the curated dataset is intentionally small.
- Relationship type badges are accurate but technical.
- Moving to a target passage sends the user to reader mode, which is safe but may feel like it loses study context.

### Redundant UI

- Passage Insight shows a Cross Reference count, while Cross Ref shows the actual list. This is acceptable, but the relationship between the two should remain clear.
- Cross Reference and Gospel Harmony both handle passage relationships, but from different organizing principles.

### Suggested Simplifications

- Add a compact context label later: "현재 절 기준" / "현재 장 기준".
- Keep notes short and neutral; avoid interpretation language.
- Maintain reference-only data; do not store Bible text in cross reference datasets.
- Consider linking Passage Insight's reference count to the Cross Ref tab in a future pass.
- Keep relationship type labels visible but consider localized user-facing labels later.

### Priority Ranking

Medium. The MVP is useful, but empty/context states need refinement as data grows.

## 4. Gospel Harmony Workflow

### Current Flow

1. User opens Gospel Harmony.
2. User selects an event from the event list.
3. Parallel references for Matthew, Mark, and Luke appear in columns.
4. Each linked passage opens the Bible Study Workspace at the referenced chapter and verse.
5. John references are retained in data for future expansion but are not part of the first display focus.

### Friction Points

- Gospel Harmony is separate from the Bible Study Workspace, while Cross Reference is inside it.
- The event list is useful, but it may feel detached from the current passage being read.
- Only references are displayed, not Bible text, so users must click away to inspect each passage.
- The 3-column layout is clear on desktop but can become long on mobile.

### Redundant UI

- Gospel Harmony and Cross Reference can both point to related Gospel passages.
- "Open Passage" repeats across columns and can visually dominate when the data itself is just a reference range.

### Suggested Simplifications

- Keep Gospel Harmony as an event-centered tool, distinct from Cross Reference.
- Later, add a read-only preview toggle only if it can use existing Bible APIs without storing text in the dataset.
- Consider a compact mobile layout with event summary followed by stacked passage links.
- Keep first-phase data small and curated.
- Do not add commentary or interpretation language in the harmony units.

### Priority Ranking

Low to Medium. The foundation is clear, but it is not yet part of the main reading workflow.

## 5. Bible Study Workspace Navigation

### Current Flow

1. User opens a Bible chapter.
2. Main content stays on the left on desktop.
3. Research panel sits on the right with Search, Insight, and Cross Ref sections.
4. Reader modes control Scripture display: reader, original text, interlinear.
5. Mobile stacks the research panel below the reader.

### Friction Points

- There are now two navigation systems on the page: reader mode controls and research panel tabs.
- The distinction between "Original Text / Interlinear" and "Study panel tabs" is logical but may not be obvious.
- On mobile, the right panel becomes a lower panel; users may not discover it after reading long chapters.
- Insight is data-only and intentionally neutral, but the label "통찰 / Insight" may imply interpretation.

### Redundant UI

- Passage Insight and chapter header both show current location/version context.
- Reader mode and research panel sections both influence what the user sees, but in different screen areas.

### Suggested Simplifications

- Keep reader mode controls strictly about the main Bible text.
- Keep research panel tabs strictly about tools attached to the passage.
- Consider renaming Passage Insight if users expect interpretation; "본문 정보 / Passage Info" may be more accurate.
- Add a sticky or compact mobile affordance later to reveal the study panel.
- Avoid adding more research panel tabs until Search, Insight, and Cross Ref behavior is stable.

### Priority Ranking

High. This is the central workspace that connects every research tool.

## Top Friction Points

1. Word Study is powerful but too deep for first-time users.
2. Strong Study vs Term Study distinction is not self-evident.
3. Bible Study Workspace has two control systems: reader modes and research tabs.
4. Cross Reference context is implicit: users may not know whether results are verse-based or chapter-based.
5. Mobile users may miss the research panel because it appears below the main chapter content.

## Top Suggested Simplifications

1. Add a drawer breadcrumb/context row for Word -> Strong -> Term -> Distribution/Occurrences.
2. Make Term Study the obvious hub and reduce repeated metadata in deeper subviews.
3. Add a simple search scope label: KRV 전체 검색 / Searches all KRV.
4. Add Cross Reference context copy: current verse vs current chapter.
5. Consider renaming "Insight" to "Passage Info" or "본문 정보" if it remains strictly data-only.

## Priority Ranking

Critical:

- None found. The workflows are usable and do not reveal a launch-blocking navigation failure.

High:

- Simplify Word Study navigation depth.
- Clarify Bible Study Workspace navigation roles.
- Improve mobile discovery of the study panel.

Medium:

- Add search scope and clear-search affordance.
- Clarify Cross Reference matching context.
- Reduce repeated term metadata across Strong and Term views.

Low:

- Refine Gospel Harmony mobile presentation.
- Localize user-facing relationship type labels later.
- Consider optional passage previews only after English Bible and source-backed data policies are complete.

## Constraints Confirmed

- No code changes were part of this audit.
- No backend changes are recommended as immediate blockers.
- No schema, migration, or data import is required for the next UI simplification pass.
- Future improvements should preserve the reference-only model for Cross Reference and Gospel Harmony.
