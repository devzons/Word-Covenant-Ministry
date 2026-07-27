# Study Engagement Architecture

## Purpose

Define the approved storage, permission, API, privacy, and WordPress admin architecture for study-detail engagement features before any runtime implementation.

This document is implementation-ready planning only.
It does not enable comments, create tables, register REST routes, change schema, or alter frontend behavior.

## Scope

This architecture applies only to individual `wcm_study` detail content:

- sermons
- exposition
- books
- book chapters when real chapter hierarchy exists later
- research papers

The user-facing label is:

- `나눔과 질문`
- `Discussion & Questions`

## Non-goals

This document does not approve runtime engagement features for:

- the study hub
- study archive/list pages
- study search results
- Bible Reader
- Gospel Harmony
- Original Language / Word Study
- Cross Reference
- Meaning Layer / Meaning Card
- visual-resource preparation cards

This document also does not approve:

- schema writes
- WordPress native comments support activation
- REST endpoint registration
- frontend discussion UI
- frontend view tracker
- admin dashboard implementation
- email notification implementation

## Current State

### `wcm_study` registration

Current CPT registration lives in:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/PostTypes/PostTypeRegistrar.php
```

Current facts:

- post type: `wcm_study`
- taxonomy: `wcm_study_category`
- `public: true`
- `publicly_queryable: true`
- `show_ui: true`
- `show_in_rest: true`
- `has_archive: false`
- `rewrite.slug: study`
- current supports:
  - `title`
  - `editor`
  - `excerpt`
  - `thumbnail`
  - `author`
  - `revisions`
- current `capability_type` is not customized
- current `map_meta_cap` is not customized
- current registration does not enable `comments`

### Current study REST surface

There is no custom WCM study-detail controller yet.

Frontend study routes currently consume WordPress core REST directly:

- `GET /wp/v2/wcm_study`
- `GET /wp/v2/wcm_study_category`

Current frontend files:

```txt
frontend/src/lib/api/study.ts
frontend/src/types/study.ts
```

Current study DTOs expose:

- `id`
- `slug`
- `title`
- `excerpt`
- `content`
- `date`
- `modified`
- `link`
- category ids / embedded category refs

Current study DTOs do not expose:

- discussion enabled state
- comment counts
- view counts
- popularity windows
- featured/recommended flags
- explicit Scripture-book relationships
- series metadata
- translation mapping

### Current auth and verification contract

Current auth routes live in:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Api/AuthController.php
```

Current backend auth contract already supports:

- cookie-backed login/logout/me
- registration
- email verification
- resend verification
- forgot/reset password

Verified-email state already exists in user meta:

- `wcm_requires_email_verification`
- `wcm_email_verified_at`

Relevant files:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Api/Auth/AuthConfig.php
backend/app/public/wp-content/plugins/wcm-core/src/Api/Auth/EmailVerificationService.php
backend/app/public/wp-content/plugins/wcm-core/src/Api/Auth/RegistrationService.php
```

Current frontend auth session does not expose a verified flag on `AuthUser`.

### Current permission and nonce pattern

Private writes already use the following pattern in `NotesController`:

- allowed origin check
- `is_user_logged_in()`
- valid `X-WP-Nonce`
- current-user ownership enforcement
- `404` for cross-user access

This is the approved baseline pattern for authenticated discussion writes.

### Current rate-limit convention

Current rate limiting exists only in auth:

- transient-backed counters
- hashed bucket keys
- cooldown support
- `REMOTE_ADDR` request source
- no raw IP persistence

Relevant file:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Api/Auth/AuthRateLimiter.php
```

### Current schema and migration convention

Current custom-table owner:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Database/SchemaInstaller.php
```

Current facts:

- option key: `wcm_core_db_version`
- current version: `1.7.0`
- custom tables are created through `dbDelta`
- additive migrations are performed inside `SchemaInstaller`

### Current WordPress admin extension pattern

Current study-specific admin behavior is limited to:

- custom columns and taxonomy filter on the `wcm_study` list

Current custom admin page pattern is limited to:

- `Tools > WCM Cross References`

Relevant files:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Core/Plugin.php
backend/app/public/wp-content/plugins/wcm-core/src/Admin/CrossReferenceReviewPage.php
```

### Current comment and analytics support

Audit findings:

- there is no existing WCM public discussion feature
- there is no study-specific comment controller
- there is no study-specific view analytics contract
- there is no `view_count` field in current study DTOs
- there is no current hub popularity source

### Current locale model

Study frontend requests locale-scoped content through `lang=ko|en` on WordPress REST.

The current frontend contract does not expose:

- cross-locale translation mapping
- locale-group ids
- canonical content identity across locales

Therefore the safe implementation boundary is:

- treat the current rendered study detail as the locale-specific public surface
- store engagement against the current study post id
- also persist the active locale with engagement rows for reporting, filtering, and future-proofing

## Decisions

### Comment storage

Decision:

- use WordPress native comments
- store comments in `wp_comments`
- store supplemental fields in `wp_commentmeta`
- set `comment_post_ID` to the `wcm_study` post id
- set `comment_type` to `wcm_study_comment`

Reason:

- native moderation states already exist
- parent replies already exist
- WordPress admin comments tooling already exists
- Akismet / spam workflows remain compatible
- lower implementation cost than rebuilding a full moderation system

Rejected alternative:

- custom comment table

Reason rejected:

- would duplicate moderation, threading, spam, and admin list behavior
- would increase admin UI and migration cost without a current scale justification

### Comment support activation

Decision:

- do not rely on `supports => comments` alone
- future implementation must add `comments` support and also explicitly control per-study open/closed state
- rollout should normalize existing `wcm_study` posts to `comment_status = closed` before public enablement

Reason:

- current repository does not prove existing `comment_status` distribution
- enabling support without controlled defaults could expose inconsistent legacy states

### Comment locale storage

Decision:

- store the active locale in comment meta
- meta key: `_wcm_study_locale`

Reason:

- current study routes are locale-aware
- current study contract does not expose translation relationships
- locale-tagged comments simplify moderation filters, analytics, and future cross-locale rendering rules

### Comment permission

Decision:

- read approved comments: public
- submit new root comments: logged-in + verified-email user
- submit replies: logged-in + verified-email user
- edit comment: not included in Phase 1 public contract
- delete own comment: not included in Phase 1 public contract
- delete/spam/trash/moderate: WordPress admins/editors through admin

Public Phase 1 intentionally excludes author-side edit/delete to keep moderation and audit behavior simple.

### Verified-email enforcement

Decision:

- enforce verified-email server-side before accepting discussion writes
- source of truth is backend user meta:
  - `wcm_requires_email_verification`
  - `wcm_email_verified_at`

Frontend may receive a derived `discussion.can_comment` state, but backend remains authoritative.

### Moderation

Decision:

- Phase 1 uses native WordPress moderation statuses
- first public contract only returns approved comments to anonymous readers
- new public submissions are created as `hold` / pending by default
- admin/editor approves, marks spam, or trashes through WordPress admin

Future auto-approval heuristics may be considered later, but not in Phase 1.

### Reply depth

Decision:

- maximum discussion depth: `2`
- one reply level only

Reason:

- simpler rendering
- simpler moderation
- prevents forum-style nesting

### Content rules

Decision:

- plain text only
- sanitize to plain text on write
- no HTML
- no markdown rendering
- minimum length: `2`
- maximum length: `2000`
- maximum URLs: `1`

### Abuse prevention

Decision:

- per-user discussion write limit: `3` submissions per `10` minutes
- duplicate-submission guard: reject identical normalized body for same user + same study + same parent within cooldown window
- reply depth guard on server
- parent comment must belong to the same study and be approved or pending-owned when replying

Implementation convention:

- reuse transient-backed hashed buckets similar to `AuthRateLimiter`
- create a dedicated discussion limiter/service rather than overloading auth buckets

### Per-study discussion toggle

Decision:

- primary toggle uses native `comment_status`
- open discussion state means `comment_status = open`
- closed discussion state means `comment_status = closed`

Behavior:

- existing approved comments remain readable when closed
- new root comments and replies are blocked when closed

Future optional meta is not required for Phase 1.

## Data Model

### Comment data model

Approved base:

- `wp_comments`
- `wp_commentmeta`

Required values:

- `comment_post_ID = {wcm_study_id}`
- `comment_type = wcm_study_comment`
- `comment_parent = 0` for root or parent id for reply
- `comment_approved` uses native WP moderation states

Required comment meta:

- `_wcm_study_locale`

Optional future comment meta:

- `_wcm_discussion_source`
- `_wcm_verified_at_submission`

### View tracking data model

Decision:

- do not use post meta counters as the primary system
- implement both an event table and an aggregate table

Approved tables:

```txt
${wpdb->prefix}wcm_study_view_events
${wpdb->prefix}wcm_study_view_stats
```

#### `wcm_study_view_events`

Purpose:

- unique-view deduplication
- recent-window recomputation
- moderation-safe forensic aggregate support without storing raw IP/UA

Approved initial shape:

```txt
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
study_id BIGINT UNSIGNED NOT NULL
locale VARCHAR(8) NOT NULL
viewer_key_hash CHAR(64) NOT NULL
view_date DATE NOT NULL
created_at DATETIME NOT NULL
```

Indexes:

- primary key on `id`
- unique key on `(study_id, locale, viewer_key_hash, view_date)`
- lookup key on `(study_id, locale, view_date)`
- lookup key on `(view_date)`

#### `wcm_study_view_stats`

Purpose:

- fast detail-page stats
- fast admin summary
- fast future hub ranking

Approved initial shape:

```txt
study_id BIGINT UNSIGNED NOT NULL
locale VARCHAR(8) NOT NULL
views_total BIGINT UNSIGNED NOT NULL DEFAULT 0
views_7d BIGINT UNSIGNED NOT NULL DEFAULT 0
views_30d BIGINT UNSIGNED NOT NULL DEFAULT 0
last_viewed_at DATETIME NULL
updated_at DATETIME NOT NULL
PRIMARY KEY (study_id, locale)
```

Reason for dual-table design:

- event table alone makes detail/admin ranking queries heavier
- aggregate table alone cannot safely deduplicate or recompute windows
- post meta alone is not safe for concurrency or rolling windows

## Comment Architecture

### Read model

Public discussion reads return:

- approved comments only
- paginated roots
- one reply level
- locale-filtered by the current route locale

### Write model

Write requirements:

- allowed origin
- logged-in user
- valid REST nonce
- verified email
- open discussion for the target study
- text validation
- rate-limit pass
- reply depth pass

Phase 1 write target:

- create root comment
- create reply

Phase 1 excludes:

- comment editing
- author-side delete
- reactions
- attachments

## View Tracking Architecture

### Meaningful-view definition

Decision:

a view is recorded only after a client-side engagement signal:

- at least `10` seconds on the detail page
- or meaningful scroll progress of at least `25%`

Server-side SSR/page requests do not count as views.

### Bot and prefetch handling

Decision:

- only accept explicit client POSTs from the study detail page
- ignore SSR renders
- ignore prefetch-only navigation because prefetch does not trigger the client engagement POST
- reject obvious bot user agents server-side where detectable

### Viewer identity

Decision:

- logged-in viewer identity: `user:{user_id}`
- anonymous viewer identity: normalized `REMOTE_ADDR + User-Agent`
- persist only a SHA-256 / HMAC-style hash value, never raw inputs

Reason:

- avoids introducing a new cookie contract in Phase 1
- avoids storing raw IP/UA
- keeps 24-hour dedup practical

Tradeoff:

- anonymous uniqueness is approximate for shared IP/UA situations
- this is acceptable for early popularity ranking and admin totals

### Deduplication period

Decision:

- one counted unique view per `study + locale + viewer` per `24` hours

Implementation boundary:

- enforce through the `view_date` unique key on the event table

### Retention

Decision:

- retain unique view event rows for `180` days
- retain aggregate totals indefinitely unless a later retention policy changes them

### Recompute and cleanup

Decision:

- aggregate table updated during accepted view writes
- scheduled recomputation / pruning job runs daily
- recomputation source of truth for rolling windows is the event table

## REST Contracts

All new routes remain inside `wcm/v1`.
All responses should reuse the current WCM envelope pattern:

```json
{
  "success": true,
  "data": {}
}
```

Errors should continue using:

```json
{
  "success": false,
  "code": "error_code",
  "message": "Human readable message"
}
```

### Study engagement summary

```txt
GET /wcm/v1/studies/{studyId}/engagement
```

Public.

Approved response shape:

```json
{
  "success": true,
  "data": {
    "stats": {
      "viewsTotal": 0,
      "views30d": 0,
      "commentsApproved": 0
    },
    "discussion": {
      "enabled": true,
      "canComment": false,
      "reason": "login_required"
    }
  }
}
```

`reason` values should be constrained to explicit frontend-safe states such as:

- `ok`
- `login_required`
- `email_verification_required`
- `discussion_closed`
- `nonce_required`

### View tracking write

```txt
POST /wcm/v1/studies/{studyId}/view
```

Public write endpoint with strict server filtering.

Approved request shape:

```json
{
  "locale": "ko",
  "signal": "dwell_10s"
}
```

Allowed `signal` values in Phase 1:

- `dwell_10s`
- `scroll_25`

Approved response shape:

```json
{
  "success": true,
  "data": {
    "counted": true,
    "stats": {
      "viewsTotal": 0,
      "views30d": 0
    }
  }
}
```

This endpoint should be idempotent for the current 24-hour dedup window.

### Discussion reads

```txt
GET /wcm/v1/studies/{studyId}/comments
```

Public.

Approved query params:

- `locale`
- `page`
- `per_page`

Approved response shape:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 0,
        "parentId": null,
        "authorName": "Name",
        "content": "Plain text body",
        "createdAt": "2026-07-27T00:00:00Z",
        "status": "approved",
        "replies": []
      }
    ],
    "page": 1,
    "perPage": 20,
    "total": 0
  }
}
```

### Discussion write

```txt
POST /wcm/v1/studies/{studyId}/comments
```

Authenticated + verified-email + nonce required.

Approved request shape:

```json
{
  "locale": "ko",
  "parentId": null,
  "content": "Plain text body"
}
```

Approved response shape:

```json
{
  "success": true,
  "data": {
    "comment": {
      "id": 0,
      "parentId": null,
      "content": "Plain text body",
      "status": "pending",
      "createdAt": "2026-07-27T00:00:00Z"
    }
  }
}
```

### Deferred routes

Deferred until later phases:

- `PATCH /wcm/v1/study-comments/{commentId}`
- `DELETE /wcm/v1/study-comments/{commentId}`

## Frontend Integration

Primary integration target:

```txt
frontend/src/components/content/study/StudyContentArticle.tsx
```

Approved insertion order for future implementation:

1. article body
2. previous/next content navigation
3. engagement summary
4. `나눔과 질문 / Discussion & Questions`

Approved future frontend components:

- `StudyEngagementSummary`
- `StudyDiscussion`
- `StudyCommentList`
- `StudyCommentItem`
- `StudyCommentComposer`
- `StudyViewTracker`

Approved future data dependencies:

- current study post id
- current locale
- auth session
- REST nonce from auth session
- engagement summary endpoint
- public discussion list endpoint
- authenticated discussion create endpoint
- public/sticky per-study discussion enabled state

Frontend note:

the current `AuthUser` DTO does not expose verified status.
Phase 2 should either:

- add a derived `verified` boolean to `/auth/me`
- or rely on `engagement.discussion.canComment` and `reason`

Preferred decision:

- add a derived `verified` boolean to `/auth/me`
- still keep backend write permission authoritative

## WordPress Admin

### Necessity verdict

Decision:

- a WordPress admin operations surface is required
- do not build a separate Next.js admin app

### Admin location

Decision:

keep study engagement operations inside the existing WordPress admin and the `wcm_study` menu area.

Approved target structure:

```txt
말씀연구 / Study Content
├─ 전체 자료
├─ 새 자료 추가
├─ 분류
├─ 나눔과 질문
├─ 조회 통계
└─ 현황
```

### Discussion moderation

Decision:

- reuse native WordPress comment moderation behavior
- filter it to `comment_type = wcm_study_comment`
- constrain it to `wcm_study` content

Preferred implementation direction:

- submenu entry under `wcm_study`
- dedicated filtered wrapper or redirected native comment screen

### Admin Phase 1 scope

Approved Phase 1 admin surfaces:

- filtered discussion moderation queue
- simple study engagement overview page
- study list columns for discussion/view metrics once aggregate table exists

Overview metrics after data exists:

- published study count
- pending discussion count
- approved discussion count
- total views last 30 days
- top studies last 30 days
- recent discussion activity

### Admin permissions

Decision:

- discussion moderation: `moderate_comments`
- study-specific open/close discussion toggle: use the post-edit capability already governing that `wcm_study`
- engagement overview and stats pages: `edit_others_posts` minimum, with `manage_options` acceptable for early narrower rollout if needed

No new moderator role is approved in Phase 1.

### Pending-comment badge

Decision:

- approved for Phase 3 admin implementation
- badge should display pending count for `wcm_study_comment` only

## Privacy and Abuse Prevention

### Privacy decisions

- do not store raw IP permanently
- do not store raw User-Agent permanently
- do not expose per-viewer history in admin
- store only hashed viewer keys
- use aggregate reporting for admin/dashboard views

### Anonymous identity decision

Decision:

- do not introduce a dedicated anonymous-id cookie in Phase 1
- derive anonymous viewer hash server-side from request characteristics and secret salt

Reason:

- lower consent and banner complexity
- smaller architecture surface

### Abuse-prevention decisions

- discussion write rate limiting required
- pending-by-default moderation required
- one-link maximum in comment body
- plain-text-only required
- reply depth limited to 2

## Migration

### Phase 1 migration strategy

Phase 1 is view tracking only.

Required schema additions in the future implementation phase:

- `wcm_study_view_events`
- `wcm_study_view_stats`

Schema rules:

- additive only
- versioned through `SchemaInstaller`
- explicit `DB_VERSION` bump

### Phase 2 migration strategy

Phase 2 is discussion backend and moderation.

Required runtime changes in that phase:

- add `comments` support to `wcm_study`
- discussion REST routes
- admin filters/submenus

Required data normalization:

- normalize all existing `wcm_study` posts to explicit `comment_status = closed`
- default new discussion state to closed until an editor opens it per study

### Verification before rollout

Before enabling public discussion writes:

- verify current `comment_status` distribution for existing `wcm_study` rows
- verify editor/admin capability behavior on local runtime
- verify locale behavior for comment visibility on actual localized study posts
- verify that `edit-comments.php` filtering can stay cleanly scoped to `wcm_study_comment`

## Rollback

### View tracking rollback

- code rollback may disable new endpoints safely
- aggregate tables may remain in place
- event/stat tables should not be destructively dropped automatically
- if a bug occurs, stop recording new view events first, then repair/recompute aggregates

### Discussion rollback

- safest rollback path is close discussion on all `wcm_study` posts
- keep existing comments readable unless a later legal/privacy issue requires hiding
- do not auto-delete discussion rows during rollback
- schema rollback is explicit, not automatic

## Validation

Future implementation validation must include:

- PHP syntax
- `composer dump-autoload`
- REST permission tests
- verified vs unverified user behavior
- nonce enforcement
- rate-limit behavior
- duplicate-view dedup behavior
- locale filtering
- admin moderation filters
- admin pending badge
- frontend detail regression checks

## Implementation Phases

### Phase 1

`Study View Tracking Foundation`

Implement:

- view event table
- view aggregate table
- `POST /studies/{id}/view`
- `GET /studies/{id}/engagement`
- study detail engagement summary read

Do not implement yet:

- public hub popularity sections
- admin overview page
- comments

### Phase 2

`Study Discussion Backend and Moderation`

Implement:

- `wcm_study` comments support
- forced `comment_status` normalization to closed
- native comment storage with `comment_type = wcm_study_comment`
- locale comment meta
- public read endpoint
- authenticated verified-email write endpoint
- WordPress admin moderation filter

### Phase 3

`Study Engagement Admin Overview`

Implement:

- study engagement overview page
- pending discussion badge
- study list metrics columns
- top studies / recent discussion summaries from aggregate data

### Phase 4

`Study Discussion Frontend`

Implement:

- engagement summary component
- discussion list
- composer
- verified/login/closed gating states

### Phase 5

`Study Hub Popular and Active Sections`

Implement:

- most-read studies from `views_30d`
- most-discussed studies from approved comment counts

## Open Questions

The following points are not blockers for architecture approval but still require runtime verification during implementation:

- exact current `comment_status` values for existing `wcm_study` rows
- whether production will eventually want locale-merged discussion across translated studies
- whether editor role should see full view stats or only administrators in the first admin rollout
- whether Akismet or another spam service is available in the active WordPress environment
