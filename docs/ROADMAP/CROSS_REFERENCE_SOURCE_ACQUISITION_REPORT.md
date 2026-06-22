# Cross Reference Source Acquisition Report

Date: 2026-06-22

## Purpose

This document records CR-8 Cross Reference Source Acquisition Execution for the approved OpenBible.info Cross References source.

This acquisition report records the raw source location, checksum, attribution, inventory, and validation facts. It does not authorize or perform import, database writes, schema changes, migrations, API implementation, backend runtime changes, or frontend runtime changes.

## Current Phase

Phase CR-8 - Cross Reference Source Acquisition Execution.

Approved source:

- OpenBible.info Cross References.

Approved validation source:

- TSK / CrossWire as a future auxiliary validation source.

## Non-Actions

This phase did not perform:

- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- dry-run import validation
- local import
- staging import
- production import

## Source Metadata

```txt
source_name: OpenBible.info Cross References
source_page_url: https://www.openbible.info/labs/cross-references/
source_url: https://a.openbible.info/data/cross-references.zip
acquisition_date: 2026-06-22T19:22:01Z
version: 2026-06-22
license: Creative Commons Attribution
attribution: www.openbible.info CC-BY 2026-06-22
raw_source_path: /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
manifest_path: /private/tmp/wcm-cross-reference-source/openbible/manifest.json
```

OpenBible source page notes:

- The page describes about `340,000` cross references.
- The page says the data draws primarily from public-domain sources, especially Treasury of Scripture Knowledge.
- The downloadable source is described as a `2 MB .zip`.
- The page states that, unless otherwise indicated, content is licensed under a Creative Commons Attribution License.
- Scripture quotations on the page are identified separately as ESV copyrighted material; WCM did not acquire or import Bible text as part of this phase.

## Checksum

Raw source SHA-256:

```txt
676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161
```

Checksum command:

```bash
shasum -a 256 /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
```

## File Inventory

Raw package:

```txt
file_name: cross-references.zip
package_size_bytes: 1980966
package_size_human: approximately 1.9 MB
archive_file_count: 1
```

Archive entries:

| Name | Uncompressed Size | Lines | Relationship Records |
| --- | ---: | ---: | ---: |
| `cross_references.txt` | `8,301,371` bytes | `344,800` | `344,799` |

Record count note:

- `cross_references.txt` contains a header row.
- Total line count is `344,800`.
- Relationship record count is `344,799`.

Header preview:

```txt
From Verse	To Verse	Votes	#www.openbible.info CC-BY 2026-06-22
```

Sample source rows observed for format confirmation only:

```txt
Gen.1.1	Mark.13.19	58
Gen.1.1	Isa.44.24	95
Gen.1.1	Ps.124.8	70
Gen.1.1	Jer.51.15	87
```

These rows were not imported, normalized, or written to the database.

## Manifest

Local source manifest created at:

```txt
/private/tmp/wcm-cross-reference-source/openbible/manifest.json
```

Manifest summary:

```json
{
  "package_id": "cross_reference.openbible.raw.2026-06-22.001",
  "source_name": "OpenBible.info Cross References",
  "source_url": "https://a.openbible.info/data/cross-references.zip",
  "source_page_url": "https://www.openbible.info/labs/cross-references/",
  "acquisition_date": "2026-06-22T19:22:01Z",
  "version": "2026-06-22",
  "license": "Creative Commons Attribution",
  "attribution": "www.openbible.info CC-BY 2026-06-22",
  "checksum_sha256": "676f75dc31d543f43b7f5fca7219d25a478d8d7634563ca450c593dcc3aa2161",
  "file_count": 1,
  "file_name": "cross-references.zip",
  "package_size_bytes": 1980966,
  "record_count": 344799,
  "source_policy": "raw_source_acquired_only_no_import_no_db_write"
}
```

The manifest is stored beside the raw source under `/private/tmp`. It is not committed.

## Validation

### Checksum Generated

Status:

```txt
passed
```

SHA-256 checksum was generated for the acquired source ZIP.

### Source Readable

Status:

```txt
passed
```

ZIP integrity check:

```txt
No errors detected in compressed data of /private/tmp/wcm-cross-reference-source/openbible/cross-references.zip.
```

### Source Archived

Status:

```txt
passed
```

Raw source was stored outside Git at:

```txt
/private/tmp/wcm-cross-reference-source/openbible/cross-references.zip
```

### File Inventory Captured

Status:

```txt
passed
```

Archive inventory confirms one file:

```txt
cross_references.txt
```

### Attribution Recorded

Status:

```txt
passed
```

Attribution was recorded from the source header:

```txt
www.openbible.info CC-BY 2026-06-22
```

### No DB Write

Status:

```txt
passed
```

No database command, import command, or WordPress write action was run.

### No Schema Change

Status:

```txt
passed
```

No schema files were modified.

### No Migration

Status:

```txt
passed
```

No migration was added or executed.

### No Runtime Change

Status:

```txt
passed
```

No backend or frontend runtime file was changed.

## TSK / CrossWire Auxiliary Source Review

TSK / CrossWire remains approved as an auxiliary validation source, but it was not downloaded in CR-8.

Reason:

- The current execution goal was OpenBible source acquisition.
- TSK extraction has higher parser complexity because it is a SWORD commentary module rather than a normalized cross-reference data file.
- Future acquisition should be separately approved if OpenBible dry-run needs validation against TSK.

Known TSK acquisition page:

```txt
https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK
```

Known TSK facts from prior review:

- Module Name: `TSK`
- Book Name: `Treasury of Scripture Knowledge`
- Module Type: `Commentary`
- Version: `1.4`
- Date: `2001-12-15`
- Distribution License: `Public Domain`

## Git Policy Confirmation

Tracked:

- this acquisition report

Not tracked:

- raw source ZIP
- local source manifest
- generated package files
- future normalized JSONL files
- exports
- backups

Raw source path is outside the repository:

```txt
/private/tmp/wcm-cross-reference-source/openbible/
```

## Final Verdict

```txt
Acquisition Complete
```

OpenBible raw source acquisition is complete for local source custody.

The project is not yet approved for:

- package normalization
- dry-run validation
- import
- database writes
- schema changes
- API implementation
- frontend/backend runtime integration

## Next Objective

Recommended next phase:

```txt
CR-9 - Cross Reference Package Normalization Plan
```

CR-9 should define how `cross_references.txt` will be transformed into a WCM reference-only `cross_references.jsonl` package, including canonical book slug mapping, vote handling, relationship type defaults, attribution preservation, checksum generation, and dry-run prerequisites.
