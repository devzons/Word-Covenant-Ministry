# Cross Reference Review Tool API/Admin Implementation Report

Date: 2026-06-23

## Current Phase

CR-51 - Cross Reference Review Tool API/Admin Implementation

## Implementation Summary

The Cross Reference review-tool MVP now has an admin-only, read/write REST surface for latest-state review metadata.

Implemented endpoints:

```txt
GET   /wp-json/wcm/v1/cross-references/review
GET   /wp-json/wcm/v1/cross-references/review/{id}
PATCH /wp-json/wcm/v1/cross-references/review/{id}
```

The public Cross Reference endpoint remains unchanged:

```txt
GET /wp-json/wcm/v1/cross-references/{book}/{chapter}/{verse}
```

## Scope Implemented

- Review queue lookup with bounded pagination.
- Review detail lookup by relationship ID.
- Review status update for approved MVP statuses:
  - `approved`
  - `rejected`
  - `suppressed`
- Review filters for admin queue:
  - `source_book`
  - `source_chapter`
  - `source_verse`
  - `target_book`
  - `review_status`
  - `source_dataset`
  - `min_source_score`
- Admin route sorting:
  - `source_score_desc`
  - `canonical`
- Server-owned audit fields:
  - `reviewed_by`
  - `reviewed_at`
  - `previous_review_status`
  - `review_source`

## Review Validation Rules

- `rejected` requires `review_reason`.
- `suppressed` requires `review_reason`.
- `approved` may use `accepted` or no reason.
- `other` requires non-empty `review_notes`.
- `review_notes` are sanitized and capped at 2000 characters.
- Client values for `reviewed_by`, `reviewed_at`, `previous_review_status`, and `review_source` are ignored.
- `review_source` is currently written as `manual`.

## Permission And Security

Admin review routes require:

```txt
is_user_logged_in()
current_user_can('manage_options')
```

The PATCH route also requires a valid WordPress REST nonce through:

```txt
X-WP-Nonce
```

Invalid or missing nonces return `rest_nonce_invalid`.

Internal audit metadata and `review_notes` are exposed only on admin review routes. They are not added to the public Cross Reference response.

## Validation Results

PHP syntax checks passed for:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Api/CrossReferenceController.php
backend/app/public/wp-content/plugins/wcm-core/src/Scripture/Repositories/CrossReferenceRepository.php
backend/app/public/wp-content/plugins/wcm-core/src/Database/SchemaInstaller.php
```

Local REST route registration:

```txt
/wcm/v1/cross-references/review: registered
/wcm/v1/cross-references/review/(?P<id>\d+): registered
```

Permission checks:

```txt
admin GET review queue: 200
anonymous GET review queue: 401
missing nonce PATCH: 403
```

Review write validation:

```txt
rejected without reason: 400
other without notes: 400
unsupported write status: 400
approved with unsupported reason: 400
valid rejected write in transaction: 200
```

The valid write test was wrapped in a database transaction and rolled back.

Rollback confirmation:

```txt
cross_reference_rows: 341176
duplicate_identity_groups: 0
non_null_audit_rows: 0
```

Public API checks:

```txt
genesis/1/1: status=200, total=61, audit_leaked=no
john/3/16: status=200, total=23, audit_leaked=no
romans/8/28: status=200, total=43, audit_leaked=no
```

## Non-Actions

This phase did not implement:

- Relationship type editing.
- Bulk actions.
- Review history table.
- Public visibility filtering.
- Reader changes.
- Word Study changes.
- Import reruns.
- Migration reruns.
- Public API response changes.
- Frontend review UI.

## Final Verdict

CR-51 implementation passed local backend validation.

## Next Objective

CR-52 - Cross Reference Review Tool API Validation / Admin UI Readiness Review
