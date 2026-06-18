# Bible Reader Design Standard

## Creation Reason

This document records the official default Bible Reader spacing and active verse style after the Reader UX spacing tightening work. It exists so future Reader, Search Result, and Scripture UI changes preserve scripture reading density instead of reverting to generic blog article spacing.

## Date

2026-06-18

## Scope

This standard applies to the Bible Reader verse list in:

```txt
frontend/src/components/scripture/BibleReader.tsx
```

## Default Verse List Standard

Verse list:

```txt
ol gap-0
```

Rules:

- Use no artificial vertical spacing between verses.
- Do not use generic article spacing such as `gap-4`, `space-y-4`, or similar loose spacing for verse rows.
- Keep the passage flowing continuously like a printed Bible.

## Default Verse Row Standard

Verse row:

```txt
py-0.5
scroll-mt-24
id per verse, for example id="v16"
```

Rules:

- Keep each verse anchor stable.
- Preserve `scroll-mt-24` so search result navigation and hash navigation land with readable viewport offset.
- Preserve per-verse ids such as `v1`, `v16`, and `v31`.

## Default Verse Text Standard

Verse text:

```txt
leading-7
```

Rules:

- Keep body text readable on mobile.
- Avoid oversized line-height that makes the reader feel like a blog article instead of scripture text.

## Active Verse Highlight Standard

Active verse highlight must preserve:

```txt
bg-blue-50
border-blue-200
rounded-lg
hover:bg-blue-100
verse number: text-blue-700
```

Rules:

- Search result navigation should highlight the destination verse with a subtle blue tone.
- Do not use strong yellow or red highlights for the default active verse state.
- Do not remove the rounded active verse container.
- Do not remove hover feedback from active verses.

## Design Intent

- The Bible Reader should read continuously like a Bible.
- Verse-to-verse spacing should be minimal.
- Mobile readability must remain intact.
- Search-result destination verses should be emphasized with a subtle blue tone.
- Strong yellow or red active highlights are prohibited by default.
- The Reader density standard is scripture reading density, not general blog article spacing.

## Current Applied Result

Before:

```txt
ol gap-4
verse row py-1
leading-8
```

After:

```txt
ol gap-0
verse row py-0.5
leading-7
```

## Verified State

The applied Reader spacing/style was verified with:

```txt
typecheck passed
lint passed
build passed
git diff --check passed
```
