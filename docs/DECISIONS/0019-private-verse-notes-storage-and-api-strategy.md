# ADR-0019 Private Verse Notes Storage and API Strategy

## Status

Accepted

## Date

2026-07-24

## Context

Word Covenant Ministry now has an authenticated login foundation using WordPress sessions, a localized Reader, and a Scripture-first frontend that can keep user session state across navigation and refresh.

The next approved user feature is private verse notes for authenticated readers.

These notes are not public ministry content.
They are user-owned private data tied to an exact Scripture reference.
They require authenticated reads and writes, server-side ownership enforcement, and a durable storage strategy that will remain compatible with future user features.

The MVP scope is intentionally narrow:

- one note per user per translation and verse
- plain text only
- private only
- no sharing
- no admin read-through via public API
- no AI generation
- no attachments
- no rich text or markdown

The project therefore needs a storage and API decision that fits the existing Local WP-backed plugin architecture, the `SchemaInstaller` migration pattern, the current REST namespace, and the existing WordPress session model.

## Decision

Word Covenant Ministry will store private verse notes in a dedicated custom table rather than a custom post type or user meta.

The table will use the standard WordPress table prefix and the WCM naming convention:

```txt
${wpdb->prefix}wcm_user_verse_notes
```

The initial table schema is:

```txt
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
user_id BIGINT UNSIGNED NOT NULL
translation VARCHAR(32) NOT NULL
book_slug VARCHAR(64) NOT NULL
chapter_number INT UNSIGNED NOT NULL
verse_number INT UNSIGNED NOT NULL
note_text TEXT NOT NULL
created_at DATETIME NOT NULL
updated_at DATETIME NOT NULL
```

The ownership and reference uniqueness boundary is:

```txt
UNIQUE (user_id, translation, book_slug, chapter_number, verse_number)
```

This means one authenticated user may store at most one private note for one exact verse in one translation.

Recommended indexes are:

- primary key on `id`
- unique ownership/reference key on `(user_id, translation, book_slug, chapter_number, verse_number)`
- user recency index on `(user_id, updated_at)`
- optional reference lookup index on `(translation, book_slug, chapter_number, verse_number)` when query patterns justify it

The REST API surface will stay inside the existing `wcm/v1` namespace and remain private:

- `GET /wcm/v1/my/notes`
- `GET /wcm/v1/my/notes/by-reference`
- `POST /wcm/v1/my/notes`
- `PATCH /wcm/v1/my/notes/{id}`
- `DELETE /wcm/v1/my/notes/{id}`

The `POST /my/notes` endpoint is the approved MVP upsert boundary.
If a note already exists for the current authenticated user and the same verse reference, the server updates the existing record and returns the final DTO.
If no note exists for that user/reference pair, the server creates it and returns the new DTO.

Authenticated private note access will use WordPress cookie authentication plus REST nonce verification.

The nonce policy is:

- authenticated note reads and writes require a valid WordPress REST nonce
- frontend stores the nonce only in memory as session data
- nonce is not stored in localStorage, sessionStorage, or custom cookies
- nonce is not treated as part of the durable user DTO
- logout clears the in-memory nonce

The source of truth for authenticated note ownership is always the currently authenticated WordPress user.
The API will not accept `user_id` from the request body or query as an authority input.

Ownership enforcement rules are:

- list returns only the current user's notes
- by-reference returns only the current user's matching note
- update and delete operate only on the current user's note
- notes belonging to another user are treated as not found
- administrator status does not grant public API access to another user's private notes

Public exposure is prohibited:

- private verse notes are not exposed through public REST endpoints
- private verse notes are not modeled as public WordPress content
- private verse notes are not added to search, Reader public payloads, or timeline datasets except through the authenticated user's own requests

Validation rules for note content and reference ownership are:

- translation must match an allowed Bible version
- `book_slug` must match canonical Bible metadata
- chapter and verse must be positive integers
- the verse must exist as a canonical verse in the current Bible data
- note text is trimmed before persistence
- empty note text is rejected
- note text is stored as plain text only
- HTML and script content are sanitized out before persistence/output
- note length is limited by an explicit server-side maximum

Deletion and retention policy for the MVP is:

- users may delete their own note through the authenticated API
- the API performs hard deletion for user-requested delete
- no trash layer is added in the MVP
- no automatic user-deletion cascade is required in the MVP unless a later approved data-retention change adds it

Future migration boundary:

- future user-owned features such as favorites, highlights, or reading history must not overload this notes table
- future sharing, publication, collaboration, revision history, or moderation features require separate ADRs and likely separate schema/API boundaries
- future user-deletion retention handling or archive/export workflows require separate approval

Rollback principle:

- schema changes remain additive and versioned through `SchemaInstaller`
- API rollback should preserve the ability to ignore newer note fields where possible
- destructive rollback of user-owned note data is not automatic and requires an explicit migration or backup-based plan

The current MVP excludes:

- public notes
- shared notes
- group notes
- admin cross-user browsing
- rich text
- markdown
- attachments
- AI-generated notes
- tags
- folders
- revision history
- autosave
- collaboration
- `/my` dashboard expansion beyond the notes page

## Consequences

### Positive

- User-owned private note data is separated cleanly from public WordPress content.
- Query patterns remain efficient for per-user verse lookup and recency listing.
- The schema matches the project's existing custom-table direction for scripture-related data.
- REST nonce plus WordPress session auth preserves a stronger authenticated-write boundary than origin-only checks.

### Constraints

- A schema version bump is required for the new table.
- Notes APIs must maintain strict ownership enforcement and nonce checks.
- The frontend auth session shape must carry ephemeral nonce data in addition to the user object.
- Future public/community note features cannot reuse this MVP contract without a new decision.

### Follow-up

Future ADRs or implementation docs may be created for:

- user-owned data retention and export
- note revision history
- cross-device drafts or autosave
- favorites/highlights data model
- private note search
- private note backup and recovery policy

## Alternatives Considered

### Use a Custom Post Type

Rejected.
Private per-user verse notes are not public editorial content, do not benefit from the public WordPress content model, and would create unnecessary post-query, capability, visibility, and indexing complexity.

### Use User Meta

Rejected.
Verse-scoped notes require structured lookup by translation/book/chapter/verse, a clear uniqueness boundary, recency listing, and scalable querying that user meta does not provide cleanly for this workload.

### Reuse Public Scripture Tables

Rejected.
Public scripture data and private user-owned notes have different ownership, privacy, query, and lifecycle boundaries and should not share a storage table.
