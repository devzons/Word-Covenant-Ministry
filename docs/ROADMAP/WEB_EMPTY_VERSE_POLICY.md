# WEB Empty Verse Policy

## Date

2026-06-22

## Purpose

This document defines the policy for handling footnote-only verse markers found in the WEB source package during local dry-run parsing.

The policy applies to WEB source records where a verse marker exists, but the verse has no body text after first-phase USFM cleanup removes footnotes, cross references, headings, and formatting markers.

This document does not authorize import, apply, schema changes, migrations, database writes, backend code changes, or production operations.

## Affected Verses

The local WEB dry run found five footnote-only verse markers:

```txt
Luke 17:36
Acts 8:37
Acts 15:34
Acts 24:7
Romans 16:25
```

These references exist in the approved WEB USFM package as verse markers, but their content is footnote-only. When footnotes are removed according to the first-phase parser policy, the normalized verse text is empty.

## Policy Decision

WCM adopts the following policy for WEB footnote-only verse markers:

1. Do not create an empty verse record.
2. Do not create placeholder text.
3. Do not create artificial verse text.
4. Do not promote footnote text into Bible verse text.
5. Allow verse omission for approved footnote-only markers.

This preserves the distinction between Bible verse text and source-critical or textual-variant notes.

## Import Behavior

During WEB parsing, if all of the following are true:

- the source has a verse marker.
- normalized verse text is empty after first-phase cleanup.
- the marker is footnote-only.
- the reference is in the approved omissions list.

Then the parser should classify the reference as:

```txt
approved_omission
```

The parser should not produce a Bible verse row for that reference.

The manifest or import report must record the approved omission with:

```txt
version_code
book
chapter
verse
reason
source_file
source_package_id
```

Reason value:

```txt
footnote_only_marker
```

## Validation Behavior

Future WEB dry-run reports should include an `approved_omissions` section.

Example:

```txt
approved_omissions:
  - Luke 17:36
  - Acts 8:37
  - Acts 15:34
  - Acts 24:7
  - Romans 16:25
```

Approved omissions are not blocking failures when:

- every omission is explicitly listed in this policy.
- no extra empty verse text exists outside the approved list.
- duplicates are absent.
- missing books and missing chapters are absent.
- required spot checks pass.
- no database write occurs during dry-run.

Any unapproved empty verse text remains a blocking dry-run failure.

## Reader Behavior

Approved omitted WEB verses should not render a blank verse in the reader.

The reader should display the available verse sequence from the WEB source. Verse numbering remains source-based, so surrounding verses keep their source verse numbers even when an approved omission is not displayed.

## Search Behavior

Approved omitted WEB verses have no verse text and therefore should not appear in search results.

Search must not synthesize placeholder text for omitted references.

## Comparison Behavior

KRV and WEB verse counts may differ for these approved omissions.

This difference is acceptable and must be treated as a known source/version difference, not as a failed import, if and only if the omitted references match the approved omissions list.

Parallel or comparison UI should not infer that the Korean Bible is missing data or that WEB has failed. It should treat these cases as known version-level verse-numbering/textual differences.

## Approval Impact

After this policy is accepted, the WEB dry-run may be repeated with the approved omissions recognized.

The next WEB dry-run may pass if:

- only approved omissions are present.
- no duplicate verse keys exist.
- no missing books exist.
- no missing chapters exist.
- required spot checks pass.
- no database write occurs.

This policy does not approve apply/import. It only permits the dry-run validator to treat the five listed footnote-only markers as approved omissions.

## Out Of Scope

This policy does not authorize:

- WEB import.
- local apply.
- production apply.
- database writes.
- schema changes.
- migrations.
- backend runtime changes.
- storage of source-critical notes.
- footnote import.
- placeholder verse display.

Any future support for source footnotes or textual-variant notes requires separate design, schema review, and approval.
