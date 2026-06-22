# Cross Reference Reader Frontend Validation Report

Date: 2026-06-22

## Purpose

This document records CR-32 Cross Reference Reader Frontend Validation.

This phase validates the CR-31 frontend integration as far as the local runtime environment allows. It does not implement features, change APIs, write data, import data, change schema, add migrations, or touch staging/production.

## Runtime Recovery Result

### Initial CR-32 Attempt

Port `3030` status:

```txt
port owner: PID 49097
process: next-server (v16.2.9)
working directory: /Users/donmini/Local Sites/wordcovenantministry/frontend
started: Wed Jun 17 16:44:55 2026
```

Access checks:

```txt
http://wordcovenantministry.local:3030/ko/bible/KRV/genesis/1: connection failed
http://127.0.0.1:3030/ko/bible/KRV/genesis/1: connection failed
```

Backend API HTTP status:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1: connection failed
http://api.wordcovenantministry.local/wp-json/wcm/v1/cross-references/genesis/1/1: connection failed
```

Runtime action taken:

- No process was killed.
- No production or staging process was touched.
- No backend runtime was started or changed.
- No DB write was performed.

Assessment:

The port owner appears to be a stale or unhealthy local Next runtime for this project. Because the backend HTTP API is also unreachable, browser validation cannot fully verify data-backed Bible and Cross Reference rendering until local frontend and backend HTTP services are restored.

### Runtime Recovery Retry

Runtime audit:

```txt
stale process: PID 49097
process: next-server (v16.2.9)
working directory: /Users/donmini/Local Sites/wordcovenantministry/frontend
classification: stale local frontend process
production/staging process: no
```

Recovery action:

```txt
terminated PID 49097
started frontend dev server with npm run dev
frontend URL: http://wordcovenantministry.local:3030
new listener: node on 127.0.0.1:3030
```

Frontend recovery result:

```txt
http://wordcovenantministry.local:3030/ko/bible/KRV/genesis/1: status=200
http://127.0.0.1:3030/ko/bible/KRV/genesis/1: status=200
```

Backend recovery result:

```txt
http://api.wordcovenantministry.local/wp-json: status=200
```

Cross Reference API smoke:

```txt
/wp-json/wcm/v1/cross-references/genesis/1/1: total=61, items=20, has_more=true
/wp-json/wcm/v1/cross-references/john/3/16: total=23, items=20, has_more=true
/wp-json/wcm/v1/cross-references/romans/8/28: total=43, items=20, has_more=true
```

Runtime limitation:

The Codex in-app browser workflow requires a Node REPL browser-control tool. That tool was not exposed in this session, and local Playwright was not installed in `frontend/node_modules`. Therefore rendered interactive browser checks were not available. HTTP route smoke and source/API validation were completed instead.

## Route Smoke Results

Requested routes:

```txt
/en/bible/WEB/genesis/1
/ko/bible/KRV/genesis/1
/en/bible/WEB/john/3
/en/bible/WEB/romans/8
```

Result:

```txt
HTTP route smoke passed after runtime recovery
```

HTTP status results:

```txt
/en/bible/WEB/genesis/1: status=200
/ko/bible/KRV/genesis/1: status=200
/en/bible/WEB/john/3: status=200
/en/bible/WEB/romans/8: status=200
```

Rendered HTML checks:

```txt
/en/bible/WEB/genesis/1: WEB Genesis text present, Cross Ref tab label present
/ko/bible/KRV/genesis/1: KRV Genesis text present, Korean 참조 tab label present
/en/bible/WEB/john/3: WEB John 3 text present, Cross Ref tab label present
/en/bible/WEB/romans/8: WEB Romans 8 text present, Cross Ref tab label present
```

Interactive browser result:

```txt
not completed
```

Reason:

The required in-app browser automation tool surface was unavailable in this session.

Build-time route validation:

```txt
/{locale}/bible/{version}/{book}/{chapter}: present in Next build output
```

## Functional Validation

Interactive browser functional checks not completed because browser automation was unavailable:

- Genesis 1:1 selected verse Cross Ref display.
- John 3:16 selected verse Cross Ref display.
- Romans 8:28 selected verse Cross Ref display.
- OpenBible attribution visual confirmation.
- Review status visual confirmation.
- Confirmation that `source_score` is hidden in the rendered UI.
- Confirmation that Bible text is not duplicated in the rendered Cross Ref panel.

Static/source validation from CR-31 remains true:

- `CrossReferencePanel` uses the Cross Reference API helper.
- The API helper calls `/wcm/v1/cross-references/{book}/{chapter}/{verse}`.
- The panel does not request `include_text`.
- The panel does not render `source_score`.
- The panel labels imported rows as Related Theme and Unreviewed.
- The panel displays attribution from API metadata.
- The panel builds target links without embedding Bible text.

API-backed functional validation:

```txt
Genesis 1:1 source lookup returns 61 related theme rows.
John 3:16 source lookup returns 23 related theme rows.
Romans 8:28 source lookup returns 43 related theme rows.
API responses are reference-only and include OpenBible attribution.
```

## Pagination Validation

Interactive browser validation not completed because browser automation was unavailable.

Static/source validation from CR-31:

- Initial request uses `per_page=20`.
- Load More requests the next bounded page.
- Load More appends returned items.
- Load More is hidden when `has_more` is false.
- Loading More disables the button and uses localized loading copy.

Required future browser checks:

- Genesis 1:1 total `61`.
- First page displays related items.
- Load More appends page 2.
- Load More eventually disappears when `has_more=false`.

API pagination validation:

```txt
Genesis 1:1 first page: items=20, total=61, has_more=true
John 3:16 first page: items=20, total=23, has_more=true
Romans 8:28 first page: items=20, total=43, has_more=true
```

## Navigation Validation

Browser click validation not completed because browser automation was unavailable.

Static/source validation from CR-31:

Target links use:

```txt
/{locale}/bible/{translation}/{target_book}/{target_start_chapter}?mode=reader#v{target_start_verse}
```

This preserves:

- locale
- current Bible version
- target verse hash anchor

It intentionally uses `mode=reader` for Cross Reference navigation.

## Empty / Error State Validation

Interactive browser validation not completed because browser automation was unavailable.

Static/source validation from CR-31:

- No selected verse state is present.
- Loading state is present.
- Empty state is present.
- Error state is present.
- Load-more loading state is present.

API failure state was not forced in browser because browser automation was unavailable and no code/runtime changes were permitted.

## Mobile / Accessibility Notes

Browser/mobile validation not completed because browser automation was unavailable.

Static/source validation from CR-31:

- Target references are rendered as links with readable `aria-label` text.
- Load More is a keyboard-accessible button.
- Load More is disabled while loading.
- The Cross Ref panel remains inside the existing responsive Bible Study Workspace right-panel structure.
- Attribution is rendered as visible text with a source link.

Required future browser checks:

- Narrow viewport overflow.
- Load More button accessibility on mobile.
- Attribution wrapping and visibility.
- Keyboard tab order through Cross Ref links and Load More.

## Validation Commands

Completed:

## CR-32 Tab Visibility Fix Addendum

User follow-up reported that the Cross Ref tab was not visible in the actual Bible Reader UI, so the earlier HTTP-based "Cross Ref tab label present" result must not be treated as full browser validation.

Source audit findings:

- `CrossReferencePanel` is imported by `BibleReader`.
- `ResearchPanelSection` includes `cross-reference`.
- `visibleResearchSections` includes `cross-reference`.
- `BibleReader` renders `CrossReferencePanel` when `activeResearchSection === "cross-reference"`.
- The `mode` query controls reader/original/interlinear mode and does not conflict with the research panel state.
- Missing selected verse only affects the Cross Reference panel body; it does not remove the tab.

Root cause:

The Cross Reference tab was wired, but the tab label was compact (`Cross Ref` / `참조`) and rendered inside a fixed three-column nav. In constrained panel widths, this made the tab easy to miss or visually cramped. The prior HTTP smoke checked markup presence, not actual user-facing visibility.

Fix:

- Changed the research tab label to `Related Passages` / `관련 구절`.
- Changed the research nav from a fixed three-column grid to a wrapping flex layout so all tabs remain visible.
- Updated the Cross Reference panel title and empty/loading/error copy to use `Related Passages` / `관련 구절`.
- Kept `Theme` / `주제` only as secondary relationship metadata.

Validation status:

The fix requires browser re-validation after build/runtime checks. CR-32 should remain open until the visible tab is confirmed in the actual rendered UI.

```txt
git diff --check: passed
cd frontend && npm run typecheck: passed
cd frontend && npm run lint: passed
cd frontend && npm run build: passed
```

Build output confirmed:

```txt
/{locale}/bible/{version}/{book}/{chapter}
```

## Final Verdict

```txt
validation_passed_with_limitations
```

Reason:

Runtime recovery succeeded, frontend/backend HTTP smoke checks passed, required Cross Reference API totals were confirmed, and static validation passes. Full interactive browser validation remains limited because the browser automation tool surface was unavailable in this session.

## Next Objective

```txt
Complete interactive browser validation when browser automation is available.
```

After runtime recovery, continue to:

```txt
CR-33 Word Study Cross Reference Integration Design
```

only after the remaining browser automation limitation is resolved or explicitly accepted.

## Known Constraints

- A stale local frontend process was killed after it was identified as a project-local `next-server`; no production or staging process was touched.
- No DB write was performed.
- No import was performed.
- No API, schema, migration, staging, or production change was made.
- The Cross Reference imported dataset remains `relationship_type=theme` and `review_status=unreviewed`.
