# WEB Dry Run Report

## Date

2026-06-22

## Purpose

This report records the local-only WEB dry run for the approved `engwebp_usfm.zip` source package.

This dry run did not write to the database, did not run apply, did not change schema, did not add migrations, did not change backend runtime code, and did not touch production.

## Source Metadata

Source package:

```txt
World English Bible Protestant
Edition: WEBP / ENGWEBP / engwebp
Package: engwebp_usfm.zip
Source URL: https://ebible.org/Scriptures/engwebp_usfm.zip
```

Local-only package path:

```txt
/private/tmp/wcm-web-dry-run/source/engwebp_usfm.zip
```

Local-only generated dry-run files:

```txt
/private/tmp/wcm-web-dry-run/manifest.json
/private/tmp/wcm-web-dry-run/reports/web-dry-run-report.json
/private/tmp/wcm-web-dry-run/web-usfm-dry-run.php
```

The temporary dry-run parser and generated files are outside the repository and must not be committed.

## Checksum

SHA-256:

```txt
96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
```

Package size:

```txt
2,907,614 bytes
```

## Manifest Summary

Manifest fields recorded:

```txt
package_id=webp-engwebp-usfm-2026-06-11-local-dry-run
source_name=World English Bible Protestant
source_edition=WEBP / ENGWEBP / engwebp
source_url=https://ebible.org/Scriptures/engwebp_usfm.zip
downloaded_at=2026-06-22T17:58:47Z
verified_at=2026-06-22T18:01:50Z
checksum_sha256=96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
file_count=72
usfm_file_count=68
license_status=public_domain_reviewed_for_dry_run
expected_bible_version_code=WEB
expected_book_count=66
```

License/provenance note:

```txt
WEBP is described by eBible.org as public domain; the World English Bible name is trademarked.
```

## Parser Scope

The dry-run parser:

- parsed USFM files only.
- normalized verse rows in memory only.
- extracted canonical 66-book verse text.
- removed USFM footnotes, cross references, word-study markup, headings, and formatting markers.
- did not write to the database.
- did not create a production importer.
- did not create a committed backend tool.

The parser emitted local PHP startup warnings from the current PHP extension configuration (`opcache`, `xdebug`, `imagick`), but it completed and produced the report. These warnings are environment-level extension mismatch warnings, not parser validation failures.

## Counts

```txt
archive files=72
USFM files=68
canonical books parsed=66
chapters parsed=1189
verses parsed=31101
duplicates=0
missing books=0
chapter count issues=0
unsupported books=0
unparsed markers=0
```

The 68 USFM files include 66 canonical Bible books plus front matter/glossary support files. Only canonical Bible books were normalized.

## Duplicate Report

Duplicate key policy:

```txt
WEB + book_slug + chapter + verse
```

Result:

```txt
No duplicate verse keys detected.
```

## Missing Verse Report

Result:

```txt
No missing verses were detected by the current canonical chapter mapping.
```

## Empty Verse Text Report

Blocking issue:

```txt
Empty verse text detected.
```

Affected references:

```txt
luke 17:36
acts 8:37
acts 15:34
acts 24:7
romans 16:25
```

Inspection result:

These references are present in the source package as verse markers whose content is footnote-only. Because the first-phase parser intentionally removes footnotes, the normalized verse text becomes empty. The current dry-run checklist requires empty verse text to fail the dry run.

This is not approved for apply until an explicit WEB empty-verse policy is chosen, for example:

- store an empty verse placeholder with a reviewed note.
- omit these rows and record them as known textual-variant gaps.
- preserve a non-scripture footnote note outside the verse text field in a future schema-supported phase.

No policy decision is made by this report.

## Spot Checks

All required spot checks passed.

```txt
genesis 1:1
In the beginning, God created the heavens and the earth.
Source: 02-GENengwebp.usfm
Status: passed

psalms 23:1
The LORD is my shepherd;
Source: 20-PSAengwebp.usfm
Status: passed

isaiah 53:5
But he was pierced for our transgressions.
Source: 24-ISAengwebp.usfm
Status: passed

matthew 1:1
The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.
Source: 70-MATengwebp.usfm
Status: passed

john 1:1
In the beginning was the Word, and the Word was with God, and the Word was God.
Source: 73-JHNengwebp.usfm
Status: passed

romans 8:1
There is therefore now no condemnation to those who are in Christ Jesus, who don't walk according to the flesh, but according to the Spirit.
Source: 75-ROMengwebp.usfm
Status: passed

revelation 22:21
The grace of the Lord Jesus Christ be with all the saints. Amen.
Source: 96-REVengwebp.usfm
Status: passed
```

## Dry-Run Result

Final status:

```txt
dry_run_failed
```

Reason:

```txt
5 empty verse text rows were detected after first-phase USFM cleanup.
```

Confirmed non-actions:

```txt
DB write performed: no
Apply performed: no
Schema changed: no
Migration added: no
Backend runtime changed: no
Production changed: no
```

## Apply Readiness

Apply readiness:

```txt
not ready
```

The source package is parseable and the major structural counts are promising, but apply must remain blocked until the empty-verse handling policy is explicitly reviewed and approved.

## Recommendation

Recommended next step:

1. Approve a WEB empty-verse policy for footnote-only verse markers.
2. Update the future local WEB importer design to enforce that policy.
3. Re-run dry-run after policy implementation.
4. Consider local apply only if the next dry-run passes and a local rollback plan is confirmed.

Production remains out of scope.
