# Cross Reference Review Tool API/Admin Design

Date: 2026-06-23

## Current State

The Cross Reference local data layer is complete and validated:

- `wcm_core_db_version = 1.6.0`
- `wp_wcm_cross_references` rows: `341,176`
- duplicate `relationship_identity_hash` groups: `0`
- existing audit metadata columns exist and are nullable:
  - `reviewed_by`
  - `reviewed_at`
  - `previous_review_status`
  - `review_source`
  - `review_reason`
  - `review_notes`
- all imported OpenBible rows still have `NULL` audit metadata
- existing public Cross Reference API remains read-only and reference-only

This document designs a future authenticated review API and minimal admin UI contract. It does not implement API routes, admin UI, frontend behavior, DB writes, schema changes, import/migration changes, or public visibility changes.

## Design Goal

Allow WCM administrators/editors to review imported OpenBible Cross Reference relationships safely using the validated audit metadata schema.

The MVP review tool should support status-only review:

- approve
- reject
- suppress

It should not edit relationship types, create new relationships, import data, delete rows, or change public visibility behavior in the same phase.

## Admin Permission Model

### Recommended Capability

Initial MVP:

```txt
manage_options
```

Reason:

- WCM does not yet have a custom editorial capability model for Cross Reference review.
- `manage_options` is already used in plugin admin health checks.
- Review writes affect study surfaces and should start administrator-only.

Future capability:

```txt
wcm_review_cross_references
```

The custom capability should be introduced only when WCM defines a broader editorial role model.

### Authentication And Nonce Requirements

REST review routes must be authenticated.

Requirements:

- route permission callbacks must require `current_user_can('manage_options')` for MVP
- requests from WordPress admin UI must use REST nonce protection
- browser-admin requests should send `X-WP-Nonce`
- unauthenticated users must receive `401`
- authenticated users without capability must receive `403`

### Public Route Separation

Public Cross Reference route remains:

```txt
GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
```

Future review/admin routes should be separate and should not reuse public route callbacks.

Recommended admin namespace:

```txt
wcm/v1
```

Recommended route prefix:

```txt
/cross-references/review
```

## Review API Contract

### GET Review Queue

Proposed route:

```txt
GET /wp-json/wcm/v1/cross-references/review
```

Purpose:

Return a paginated, admin-only review queue.

Query parameters:

```txt
page
per_page
source_book
source_chapter
source_verse
target_book
review_status
source_dataset
min_source_score
sort
```

Defaults:

```txt
page = 1
per_page = 25
sort = source_score_desc
```

Maximum:

```txt
max_per_page = 100
```

Allowed `review_status` filters:

```txt
unreviewed
approved
rejected
suppressed
```

Response shape:

```json
{
  "items": [
    {
      "id": 123,
      "source_reference": {
        "book": "genesis",
        "start_chapter": 1,
        "start_verse": 1,
        "end_chapter": null,
        "end_verse": null
      },
      "target_reference": {
        "book": "john",
        "start_chapter": 1,
        "start_verse": 1,
        "end_chapter": 1,
        "end_verse": 3
      },
      "relationship_type": "theme",
      "review_status": "unreviewed",
      "source_dataset": "openbible",
      "source_score": 369,
      "confidence": "source_backed",
      "package_id": "cross_reference.openbible.normalized.2026-06-22.001",
      "relationship_identity_hash": "abc...",
      "audit": {
        "reviewed_by": null,
        "reviewed_at": null,
        "previous_review_status": null,
        "review_source": null,
        "review_reason": null,
        "review_notes": null
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 341176,
    "has_more": true
  }
}
```

### GET Single Relationship Detail

Proposed route:

```txt
GET /wp-json/wcm/v1/cross-references/review/{id}
```

Purpose:

Return one relationship with full source/provenance/audit metadata for admin review.

Response should include:

- source reference
- target reference
- relationship metadata
- source/provenance metadata
- latest audit metadata
- no Bible text by default

Bible passage previews should use existing Bible APIs from the admin UI. The review API should not duplicate Bible text.

### PATCH Review Status

Proposed route:

```txt
PATCH /wp-json/wcm/v1/cross-references/review/{id}
```

Purpose:

Update the latest review state for one relationship.

Request body:

```json
{
  "review_status": "approved",
  "review_reason": "accepted",
  "review_notes": "Optional internal note."
}
```

Allowed `review_status` values:

```txt
approved
rejected
suppressed
```

The API should not accept `unreviewed` as a normal review action in the MVP. Reverting to `unreviewed` should be a separate rollback/admin action after explicit approval.

Server-generated fields:

- `previous_review_status`
- `reviewed_by`
- `reviewed_at`
- `review_source = manual`

The client must not provide or override those fields.

Response shape:

```json
{
  "id": 123,
  "review_status": "approved",
  "previous_review_status": "unreviewed",
  "review_source": "manual",
  "review_reason": "accepted",
  "review_notes": "Optional internal note.",
  "reviewed_by": 1,
  "reviewed_at": "2026-06-23 12:00:00"
}
```

## Status Transition Rules

Allowed stored statuses:

```txt
unreviewed
approved
rejected
suppressed
```

Allowed MVP transitions:

```txt
unreviewed -> approved
unreviewed -> rejected
unreviewed -> suppressed
approved -> rejected
approved -> suppressed
rejected -> approved
rejected -> suppressed
suppressed -> approved
suppressed -> rejected
```

Deferred transition:

```txt
approved/rejected/suppressed -> unreviewed
```

Reason:

- Reverting to `unreviewed` is a rollback/reopen action and should require a separate explicit UI affordance.

Rules:

- `previous_review_status` must be captured from the existing row before write.
- `reviewed_by` must be the current WordPress user ID.
- `reviewed_at` must be server time.
- `review_source` must be set to `manual`.
- Source/provenance fields must not change.
- Relationship type must not change in MVP.
- Review writes must not delete rows.

## Controlled Reason Validation

Approved first `review_reason` tokens:

```txt
accepted
not_relevant
too_broad
duplicate_like
confusing
pastorally_unhelpful
source_quality
other
```

Rules:

- `approved` may use `accepted` or `null`.
- `rejected` requires one of:
  - `not_relevant`
  - `too_broad`
  - `duplicate_like`
  - `confusing`
  - `source_quality`
  - `other`
- `suppressed` requires one of:
  - `too_broad`
  - `duplicate_like`
  - `confusing`
  - `pastorally_unhelpful`
  - `source_quality`
  - `other`

Rejected/suppressed rows must not accept empty `review_reason`.

## Review Notes

`review_notes` policy:

- optional
- internal-only
- not exposed in public APIs
- sanitized on write
- escaped on display
- maximum recommended length: `2000` characters

Admin UI should label notes as internal editorial notes.

The first MVP should not support rich text notes.

## Minimal Admin UI Concept

Recommended admin screen:

```txt
Cross Reference Review
```

Recommended location:

- WordPress admin under WCM Core / Scripture tools, after plugin admin structure is reviewed.

MVP layout:

1. Filter bar
   - source book
   - source chapter
   - source verse
   - review status
   - source dataset
   - minimum source score

2. Review list
   - source reference
   - target reference
   - relationship type
   - review status
   - source dataset
   - source score as source weight only
   - package ID
   - latest audit metadata

3. Detail panel
   - source preview using existing Bible API
   - target preview using existing Bible API
   - status buttons: Approve / Reject / Suppress
   - reason select
   - optional internal note
   - save button
   - next item navigation

UX guardrails:

- show OpenBible attribution
- show `theme` / `unreviewed` as source-backed discovery data
- never present source score as theological confidence
- no relationship type editing in MVP
- no delete button
- no raw source export
- no bulk actions in first implementation

## Public Visibility Rules

Design only. Do not implement in the review API/admin MVP.

Future public behavior:

- `unreviewed`: visible
- `approved`: visible
- `rejected`: hidden
- `suppressed`: hidden

This requires separate approval because it changes Reader and Word Study public behavior.

Before public visibility changes:

- public API status vocabulary must include `suppressed`
- frontend empty/loading/error behavior must be reviewed
- regression testing must confirm Reader and Word Study still behave correctly

## Rollback / Export Safety

Before first review write:

- create DB backup
- export review-state snapshot
- document restore command
- document single-row rollback procedure

Review-state export should include:

```txt
id
relationship_identity_hash
review_status
reviewed_by
reviewed_at
previous_review_status
review_source
review_reason
review_notes
updated_at
```

Rollback options:

1. Full DB restore.
2. Review-state restore from export.
3. Single-row status correction using `previous_review_status`.

No rollback process should delete imported Cross Reference rows or mutate source/provenance fields.

## Security Risks

Risks:

- unauthorized review writes
- CSRF against admin REST endpoint
- capability leakage to non-admin users
- internal note exposure
- invalid status or reason tokens
- stale reviewer IDs
- accidental bulk changes
- source/provenance mutation

Mitigations:

- `manage_options` permission callback for MVP
- REST nonce required for admin UI requests
- server-side status and reason allowlists
- ignore client-supplied reviewer/timestamp/source fields
- sanitize `review_notes`
- never expose `review_notes` in public routes
- no bulk actions in MVP
- no source/provenance writes in review endpoint

## Deferred Scope

Deferred:

- implementation
- admin menu/page creation
- review write API
- public visibility changes
- relationship type editing
- bulk actions
- review history table
- custom capability
- role editor integration
- taxonomy-backed review reasons
- promoted/needs-review workflows
- Gospel Harmony/Timeline/People integration

## Final Recommendation

Proceed next to CR-50 Cross Reference Review Tool API/Admin Implementation Approval Review.

The future implementation should be limited to authenticated admin review endpoints and a minimal admin UI design. Public Reader and Word Study behavior should remain unchanged until a separate visibility phase is approved.
