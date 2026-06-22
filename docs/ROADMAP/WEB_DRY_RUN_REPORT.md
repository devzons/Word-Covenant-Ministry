# WEB Dry Run Report

## Date

2026-06-22

## Purpose

This report records the local-only WEB dry-run re-execution after approval of the WEB Empty Verse Policy.

This dry run did not write to the database, did not run apply, did not change schema, did not add migrations, did not change backend runtime code, and did not touch production.

## Source Package

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
verified_at=2026-06-22T18:15:27Z
checksum_sha256=96f740d3ea2107cc3d8be80aa3e0da8d00e37a3f0926dca59eb7ec652e932cc8
file_count=72
usfm_file_count=68
license_status=public_domain_reviewed_for_dry_run
expected_bible_version_code=WEB
expected_book_count=66
importer_version=temporary-local-dry-run-2026-06-22-approved-omissions
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
- classified approved footnote-only verse markers as `approved_omission`.
- did not create Bible verse rows for approved omissions.
- did not write to the database.
- did not create a production importer.
- did not create a committed backend tool.

The parser emitted local PHP startup warnings from the current PHP extension configuration (`opcache`, `xdebug`, `imagick`), but syntax check and dry-run execution completed. These warnings are environment-level extension mismatch warnings, not parser validation failures.

## Counts

```txt
archive files=72
USFM files=68
canonical books parsed=66
chapters parsed=1189
source verse markers parsed=31101
normalized verse rows=31096
duplicates=0
missing books=0
chapter count issues=0
unsupported books=0
unparsed markers=0
approved omissions=5
empty verse failures outside approved list=0
```

The 68 USFM files include 66 canonical Bible books plus front matter/glossary support files. Only canonical Bible books were normalized.

The source package contains `31,101` canonical verse markers. The dry-run produced `31,096` normalized verse rows because five approved footnote-only markers were omitted according to `WEB_EMPTY_VERSE_POLICY.md`.

## Duplicate Report

Duplicate key policy:

```txt
WEB + book_slug + chapter + verse
```

Result:

```txt
No duplicate verse keys detected.
```

## Missing Report

Result:

```txt
No missing books detected.
No chapter count issues detected.
No missing verses were detected by the current canonical chapter mapping.
```

## Approved Omissions

Approved omissions:

```txt
Luke 17:36  reason=footnote_only_marker  source=72-LUKengwebp.usfm
Acts 8:37  reason=footnote_only_marker  source=74-ACTengwebp.usfm
Acts 15:34 reason=footnote_only_marker  source=74-ACTengwebp.usfm
Acts 24:7  reason=footnote_only_marker  source=74-ACTengwebp.usfm
Romans 16:25 reason=footnote_only_marker source=75-ROMengwebp.usfm
```

These references are listed in:

```txt
docs/ROADMAP/WEB_EMPTY_VERSE_POLICY.md
```

The parser did not create verse rows for these references.

## Empty Verse Failures

Result:

```txt
Empty verse failures outside approved list=0
```

Any future unapproved empty verse remains a blocking dry-run failure.

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

## Non-Actions Confirmed

```txt
DB write performed: no
Apply performed: no
Schema changed: no
Migration added: no
Backend runtime changed: no
Production changed: no
```

## Dry-Run Result

Final status:

```txt
dry_run_passed
```

Reason:

```txt
All structural validation checks passed, and the only empty verse markers were the five approved footnote-only omissions.
```

## Apply Readiness

Apply readiness:

```txt
conditionally ready for local apply review
```

Local apply is still not approved. This result only means the dry-run report is now suitable for review as a precondition to a future, separately approved local apply decision.

Staging and production remain out of scope.

## Recommendation

Recommended next step:

1. Review this passed dry-run report.
2. Confirm local rollback requirements.
3. Request explicit local apply approval only if the project is ready to write WEB data to the local database.

Do not run local apply, staging apply, production apply, schema changes, migrations, or backend runtime changes without separate approval.
