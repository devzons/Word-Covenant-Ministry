# Cross Reference Source Acquisition Review

Date: 2026-06-22

## Purpose

This document reviews whether Word Covenant Ministry is ready to approve future source acquisition for Cross Reference data.

This is a review and documentation artifact only. It does not download source files, acquire source packages, import data, write to the database, change schema, add migrations, implement APIs, or change backend/frontend runtime behavior.

## Current Phase

Phase CR-6 - Cross Reference Source Acquisition Review.

Completed prior planning:

- CR-2 Source Review completed.
- CR-3 Data Package Specification completed.
- CR-4 Dry Run Specification completed.
- CR-5 Local Import Readiness Review completed.

Current source direction:

- Recommended first source: OpenBible.info Cross References.
- Fallback and validation source: Treasury of Scripture Knowledge through CrossWire/SWORD.
- High-trust theological relationships remain WCM-curated.

## Non-Actions

This review does not perform or authorize:

- data download
- source acquisition execution
- import
- database write
- schema change
- migration
- API implementation
- backend runtime change
- frontend runtime change
- staging apply
- production apply

## OpenBible Review

### Official Acquisition Path

OpenBible.info publishes a Bible Cross References page at:

```txt
https://www.openbible.info/labs/cross-references/
```

The page includes a "Download all the cross-reference data" link hosted under:

```txt
a.openbible.info
```

The page describes the downloadable artifact as:

```txt
2 MB .zip
```

Acquisition status:

```txt
not acquired
```

Policy:

- Do not download until separate source acquisition approval.
- During acquisition, capture the exact final download URL, HTTP metadata if available, file name, file size, and SHA-256 checksum.
- Store the raw source outside Git or in an ignored generated/source path.

### Data Provided

OpenBible describes the dataset as about `340,000` cross references identifying commonalities between Bible passages.

The page describes relationship basis broadly as:

- themes
- words
- events
- people

Expected data shape:

- likely verse-to-verse or verse-to-reference relationships.
- source relationship categories are not expected to map directly to WCM's full relationship type list.
- no Bible text should be imported.

Package implication:

- The source should be normalized into `cross_references.jsonl`.
- Imported records should initially use conservative relationship typing, likely `theme` or `needs_review`, unless source structure proves a narrower type.
- High-judgment categories must not be inferred automatically.

### Distribution Method

Distribution appears to be a public downloadable ZIP linked from the OpenBible Cross References page.

Future acquisition should record:

- exact download URL.
- download timestamp.
- file name.
- file size.
- checksum.
- source page URL.
- license page URL.

### Attribution Requirement

OpenBible states that, unless otherwise indicated, content is licensed under a Creative Commons Attribution License.

Attribution policy:

- Attribution is required.
- Attribution text must be recorded in `manifest.json`.
- Attribution display/storage policy must be reviewed before public UI or API exposure.
- WCM must not import or display any copyrighted Scripture quotations from the OpenBible page.

### Versioning Information

The OpenBible page does not expose a clear semantic dataset version in the reviewed page text.

Future package version policy:

- Use acquisition date as package version if no upstream version exists.
- Record `source_url`, `downloaded_at`, `verified_at`, and checksum.
- Treat checksum as the authoritative source package identity.

Example package ID:

```txt
cross_reference.openbible.2026-06-22.001
```

### Update Method

The OpenBible page presents the dataset as a downloadable experiment and describes vote/source behavior, but no formal update cadence is confirmed in reviewed material.

Policy:

- Do not assume stability across downloads.
- Every acquisition must create a new package ID or package version.
- Every acquired file must have its own checksum.
- Any future update must run a new dry-run and review.

OpenBible readiness:

```txt
ready for source acquisition approval with conditions
```

Conditions:

- explicit acquisition approval.
- exact URL and checksum capture.
- no Bible text import.
- attribution captured.
- generated/raw package ignored.
- dry-run before any import readiness.

## TSK / CrossWire Review

### Official Acquisition Path

CrossWire publishes a SWORD module page for TSK:

```txt
https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK
```

The page identifies:

- Module Name: `TSK`
- Book Name: `Treasury of Scripture Knowledge`
- Module Type: `Commentary`
- Language: `en`
- Module Version: `1.4`
- Module Date: `2001-12-15`
- Install Size: `2.73 MB`
- Distribution License: `Public Domain`

The module page includes a download link, but no file was downloaded in this review.

Acquisition status:

```txt
not acquired
```

### Module Structure

CrossWire/SWORD modules use `.conf` metadata files. The CrossWire module configuration documentation states that all SWORD modules require a `.conf` file and describes module data paths and drivers.

Relevant module structure implications:

- TSK is a commentary module.
- Commentary module drivers may include `RawCom`, `RawCom4`, `zCom`, or related formats.
- Module metadata and data path must be inspected after approved acquisition.
- Extraction likely requires SWORD-aware tooling or parser support.

### Extraction Possibility

Extraction appears possible but more complex than OpenBible.

Reasons:

- TSK is not presented as a normalized cross-reference JSON/CSV package.
- It is a commentary module with embedded scripture references and parallel passages.
- References may need parsing from commentary entries.
- SWORD module driver and source type must be confirmed after acquisition.

Future extraction policy:

- Use TSK first as validation/fallback, not the primary first acquisition unless OpenBible is rejected.
- If acquired, parse references only.
- Do not import commentary prose as relationship notes unless separately reviewed.
- Preserve public-domain provenance.

### Attribution Requirement

CrossWire lists TSK distribution license as Public Domain.

Attribution policy:

- Legal attribution may not be required for public-domain material.
- WCM should still record provenance and source metadata.
- If using CrossWire packaging, record CrossWire module URL and module metadata.

TSK readiness:

```txt
ready as fallback or validation source with parser-complexity conditions
```

Conditions:

- explicit acquisition approval.
- module checksum capture.
- module `.conf` inspection.
- parser feasibility review before extraction.
- no commentary prose import without separate review.

## Source Strategy Review

### Option 1: OpenBible Only

Benefits:

- Most practical first source.
- Purpose-built cross-reference dataset.
- Public download link.
- Smaller package than TSK module description suggests.
- Likely easier to normalize into JSONL.

Costs and risks:

- CC BY attribution required.
- No clear semantic versioning found in reviewed page.
- Source blends TSK and OpenBible-derived signals.
- Relationship types are broad and not WCM-specific.
- Requires strict no-Bible-text policy.

Recommended use:

```txt
first acquisition candidate
```

### Option 2: OpenBible + TSK

Benefits:

- OpenBible supplies practical normalized source.
- TSK supplies public-domain fallback and validation baseline.
- Overlap can help identify broad source consistency.
- TSK provenance is historically strong.

Costs and risks:

- Two source packages increase review complexity.
- TSK extraction requires parser work.
- Duplicate and overlap handling becomes more important.
- Public-domain TSK does not remove OpenBible attribution requirements for OpenBible-derived data.

Recommended use:

```txt
best medium-term strategy
```

### Option 3: OpenBible + TSK + Curated

Benefits:

- OpenBible provides breadth.
- TSK provides public-domain validation/fallback.
- WCM curated records provide theological precision.
- Best fit for WCM relationship types.

Costs and risks:

- Highest review workload.
- Requires clear separation between source-backed bulk links and curated high-trust links.
- Requires review workflow and policy gates.
- Future schema/API must preserve provenance and review status.

Recommended use:

```txt
long-term target strategy
```

## Package Strategy Review

### Raw Source

Policy:

- Raw source files are not tracked.
- Raw source files remain outside Git or under ignored generated/source paths.
- Raw source files must be identified by checksum.
- Raw source files must not be transformed directly into DB writes.

Required metadata:

- source URL.
- downloaded_at.
- file name.
- file size.
- SHA-256 checksum.
- license.
- attribution.

### Normalized Package

Policy:

- Normalize source into a reference-only package.
- Use JSONL for relationship rows.
- Do not store Bible text.
- Preserve source dataset and review status.

Expected files:

```txt
manifest.json
cross_references.jsonl
checksum.sha256
README.md
```

### Manifest

Required fields:

- `package_id`
- `source_name`
- `source_url`
- `license`
- `attribution`
- `checksum`
- `record_count`
- `generated_at`
- `verified_at`

Recommended fields:

- source file name.
- source file count.
- source checksum.
- package checksum.
- source policy.
- relationship types.
- review status.
- notes.

### Checksum

Policy:

- Raw source checksum identifies acquired file integrity.
- Normalized package checksum identifies generated package integrity.
- Any source update or re-normalization requires new checksum verification.

### Storage Location Policy

Recommended local-only paths:

```txt
storage/imports/cross-references/
storage/exports/cross-references/
```

or repo-external local paths:

```txt
/private/tmp/wcm-cross-reference-source/
/private/tmp/wcm-cross-reference-package/
```

Policy:

- Use ignored paths for generated/raw packages.
- Commit only documentation, tiny examples, and validation summaries when approved.
- Do not commit full source ZIPs or full JSONL packages.

## Git Policy Review

### Tracked

Allowed to track:

- documentation
- source review reports
- acquisition review reports
- manifest examples
- validation summary reports
- tiny sample JSONL examples when approved
- README files

### Ignored

Must remain ignored or outside Git:

- raw source downloads
- ZIP packages
- generated cross-reference JSONL packages
- full validation payloads
- exports
- backups
- SQL dumps
- temporary parser output

Recommended future ignore patterns if Cross Reference package paths are added:

```txt
storage/imports/cross-references/
storage/exports/cross-references/
docs/data-packages/cross-references/**/*.jsonl
docs/data-packages/cross-references/**/*.zip
docs/data-packages/cross-references/**/*.tar
docs/data-packages/cross-references/**/*.gz
docs/data-packages/cross-references/**/*.sha256.generated
```

Allowed exceptions:

```txt
!docs/data-packages/cross-references/**/README.md
!docs/data-packages/cross-references/**/manifest.example.json
!docs/data-packages/cross-references/**/sample-*.jsonl
```

No `.gitignore` change is made by this review.

## Risk Review

### License Risk

- OpenBible requires attribution.
- OpenBible page includes ESV quotation notice; WCM must not import Bible text.
- Other sources require separate license review.

Mitigation:

- manifest license and attribution required.
- references-only normalization.
- no copied Bible text in JSONL.

### Attribution Risk

- Attribution must be preserved in future UI/API/docs as required.
- Missing attribution would block import readiness.

Mitigation:

- capture attribution text during acquisition.
- include attribution in manifest.
- require dry-run attribution status.

### Provenance Risk

- OpenBible combines public-domain TSK and OpenBible-derived signals.
- Exact update cadence is not confirmed.
- TSK module provenance is clearer but extraction is harder.

Mitigation:

- checksum every acquired source.
- treat acquisition date/checksum as version identity.
- keep TSK as validation/fallback source.

### Source Drift Risk

- Future OpenBible downloads may differ from the currently reviewed page.
- Download URL, package contents, or license note may change.

Mitigation:

- record exact source URL and timestamp.
- record checksum and file list.
- rerun source review if license/source page changes.

### Package Generation Risk

- Normalizer may accidentally include Bible text or prose notes.
- Relationship type inference may overstate certainty.
- Large record sets may produce duplicate or memory issues.

Mitigation:

- reference-only schema.
- relationship types default conservative.
- streaming dry-run.
- duplicate detection required.
- high-judgment theological types curated only.

## Final Recommendation

```txt
Ready For Source Acquisition Approval
```

WCM is ready to request explicit approval for controlled OpenBible source acquisition, with conditions.

Conditions:

1. Acquisition must be explicit and separate from this review.
2. Downloaded/raw source must not be committed.
3. Exact URL, file name, file size, timestamp, and checksum must be recorded.
4. License and attribution must be captured in manifest metadata.
5. Source package must be treated as references-only input.
6. No import, DB write, schema change, API implementation, or runtime change may occur during acquisition.
7. Normalized package generation and dry-run execution require separate approval.
8. TSK/CrossWire may be acquired later as validation/fallback after separate approval.

## Next Objective

Recommended next phase:

```txt
CR-7 - Cross Reference Source Acquisition Approval
```

CR-7 should authorize, or decline, a controlled no-import acquisition of the OpenBible source package.

If approved, CR-7 should produce:

- raw source path.
- exact source URL.
- file name.
- file size.
- downloaded_at.
- SHA-256 checksum.
- license note.
- attribution note.
- confirmation that no import or DB write occurred.

No source acquisition or download should occur until CR-7 is explicitly approved.

## Sources Reviewed

- OpenBible.info Cross References: https://www.openbible.info/labs/cross-references/
- CrossWire TSK module page: https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK
- CrossWire SWORD configuration documentation: https://wiki.crosswire.org/DevTools:conf_Files
