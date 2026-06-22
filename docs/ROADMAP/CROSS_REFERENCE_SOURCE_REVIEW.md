# Cross Reference Source Review

Date: 2026-06-22

## Purpose

This document records Phase CR-2 source and license review for future Word Covenant Ministry cross-reference data.

This is a review artifact only. It does not authorize data download, data import, schema changes, API implementation, backend runtime changes, frontend runtime changes, or database writes.

## Current Phase

Phase CR-2 - Cross Reference Source and License Review.

The current implemented state remains frontend foundation only:

- Bible Study Workspace includes a Cross Reference panel.
- A small curated frontend-only MVP reference set exists.
- No production cross-reference data model exists.
- No cross-reference import pipeline exists.
- No backend API exists for cross-reference data.

## Review Boundaries

Allowed in this phase:

- Candidate source survey.
- License review.
- Provenance review.
- Data shape review.
- Compatibility review against the WCM Cross Reference Plan.

Not allowed in this phase:

- Downloading source data.
- Importing cross-reference data.
- Writing to the database.
- Creating schema or migrations.
- Implementing APIs.
- Changing backend runtime behavior.
- Changing frontend runtime behavior.

## Candidate Sources

| Candidate | Summary | Initial Recommendation |
| --- | --- | --- |
| OpenBible.info Cross References | Downloadable cross-reference dataset described as about 340,000 cross references, drawing primarily from public-domain sources such as Treasury of Scripture Knowledge, with site content licensed under Creative Commons Attribution unless otherwise indicated. | Recommended First Source, with conditions |
| Treasury of Scripture Knowledge via CrossWire/SWORD | Public-domain SWORD commentary module with about 500,000 scripture references and parallel passages. | Suitable With Conditions |
| Other CrossWire/SWORD Modules | SWORD provides module packaging and metadata conventions; individual module licenses vary. | Suitable With Conditions after per-module review |
| STEP Bible Relationship Data | No specific public cross-reference dataset and license was confirmed during this review. | Not Suitable for import planning yet |
| WCM Curated Manual Set | WCM-authored relationship records created by review. | Suitable as curated overlay, not as bulk source |

## License Findings

### OpenBible.info Cross References

OpenBible describes its cross-reference dataset as about 340,000 references, with votes and source weighting, and states that the data draws primarily from public-domain sources, especially Treasury of Scripture Knowledge. The page also states that, unless otherwise indicated, all content is licensed under a Creative Commons Attribution License.

License assessment:

- License type: Creative Commons Attribution, with embedded public-domain source material noted.
- Redistribution: Allowed under CC BY terms.
- Attribution: Required.
- Commercial use: Allowed under CC BY.
- Modification: Allowed under CC BY.
- Key restriction: Do not import, store, or display any copyrighted Bible text from the page or related ESV quotations. WCM should import references and source metadata only.

OpenBible is the most practical first source candidate because it provides a purpose-built cross-reference dataset. It should still require a future source package review before any download or import.

### Treasury of Scripture Knowledge via CrossWire/SWORD

CrossWire lists the TSK module as "Treasury of Scripture Knowledge," module type "Commentary," and distribution license "Public Domain." Its module description says it contains about five-hundred thousand scripture references and parallel passages.

License assessment:

- License type: Public Domain.
- Redistribution: Allowed.
- Attribution: Not legally required for public-domain material, but WCM should still record provenance.
- Commercial use: Allowed.
- Modification: Allowed.
- Key restriction: Other CrossWire modules must not inherit this conclusion. License must be reviewed per module.

TSK is the strongest legal baseline. The main limitation is data shape: it is a commentary-style reference source, not a normalized relationship table.

### Other CrossWire/SWORD Sources

CrossWire/SWORD defines a module ecosystem with per-module configuration files, drivers, source types, and metadata. That makes it a useful source discovery channel, but not a blanket license approval.

License assessment:

- License type: Module-specific.
- Redistribution: Module-specific.
- Attribution: Module-specific.
- Commercial use: Module-specific.
- Modification: Module-specific.
- Key restriction: Every module requires independent review before use.

Only the reviewed TSK module is currently suitable for future planning.

### STEP Bible Relationship Data

No authoritative, downloadable STEP cross-reference or relationship dataset with sufficient license and provenance information was confirmed during this review.

License assessment:

- License type: Not confirmed for a cross-reference dataset.
- Redistribution: Not confirmed.
- Attribution: Not confirmed.
- Commercial use: Not confirmed.
- Modification: Not confirmed.
- Key restriction: Do not use STEP relationship data unless a specific source package and license are reviewed.

### WCM Curated Manual Set

WCM may create manually reviewed relationships without third-party license risk.

License assessment:

- License type: WCM-authored project data.
- Redistribution: Controlled by WCM.
- Attribution: Internal provenance should still be recorded.
- Commercial use: Controlled by WCM.
- Modification: Controlled by WCM review policy.

This is necessary for higher-judgment categories such as typology, law-gospel, promise fulfillment, and prophecy fulfillment.

## Provenance Findings

| Candidate | Maintainer / Publisher | Original Source | Update Pattern | Provenance Risk |
| --- | --- | --- | --- | --- |
| OpenBible.info Cross References | OpenBible.info | Primarily public-domain TSK plus OpenBible-derived topical/search/vote signals | Maintained website; exact data update cadence not confirmed | Medium |
| TSK via CrossWire | CrossWire module repository | Historical TSK compilation associated with Canne, Browne, Blayney, Scott, and others | Module version listed as 1.4 from 2001-12-15 | Low |
| Other CrossWire modules | CrossWire and module contributors | Module-specific | Module-specific | Medium to High |
| STEP Bible relationship data | Not confirmed for this use | Not confirmed | Not confirmed | High |
| WCM curated manual set | WCM | Internal review | WCM-controlled | Low license risk, high review effort |

## Data Shape Findings

### OpenBible.info

Likely source shape:

- Verse-to-verse references.
- Large bulk dataset.
- May include source/vote weighting or implied relationship strength.
- Relationship type is not expected to match WCM categories directly.

WCM import implication:

- Import initially as reference relationships only.
- Preserve source attribution.
- Treat relationship type conservatively, likely `curated_manual` or a generic imported type until reviewed.
- Do not infer `prophecy_fulfillment`, `typology`, or `law_gospel` automatically.

### TSK via CrossWire/SWORD

Likely source shape:

- Commentary entries keyed by verse.
- Embedded scripture references and parallel passages.
- No explicit confidence level.
- No explicit WCM relationship type.

WCM import implication:

- Parser would need to extract references from commentary entries.
- Relationship type should remain generic until reviewed.
- Good candidate for source-backed `theme`, `parallel_event`, or `curated_manual` candidates after review, but not as automatic theological classification.

### Other CrossWire/SWORD Sources

Likely source shape:

- Depends on module driver and source type.
- Some modules may be commentary, OSIS, ThML, GBF, or plaintext.
- Cross-reference-style data may appear in notes or encoded scripture references.

WCM import implication:

- Per-module parser and license review required.
- Not suitable as a generic bulk source category.

### STEP Bible

Likely source shape:

- Not confirmed for a public cross-reference package.

WCM import implication:

- No implementation planning should rely on STEP relationship data until source and license are verified.

### WCM Curated Manual Set

Likely source shape:

- Directly authored WCM relationship records.
- Can include relationship type, confidence, source notes, and review status.

WCM import implication:

- Best source for high-trust theological categories.
- Low volume unless a review workflow is built.

## WCM Compatibility Review

| WCM Relationship Type | OpenBible | TSK / CrossWire TSK | WCM Curated Manual |
| --- | --- | --- | --- |
| quotation | Needs review; do not infer automatically | Needs review; do not infer automatically | Supported |
| allusion | Possible but requires review | Possible but requires review | Supported |
| parallel_event | Possible for event links after review | Possible for parallel passages after review | Supported |
| theme | Broadly compatible as imported related-reference candidates | Broadly compatible as related-reference candidates | Supported |
| promise_fulfillment | Do not infer automatically | Do not infer automatically | Supported |
| prophecy_fulfillment | Do not infer automatically | Do not infer automatically | Supported |
| typology | Do not infer automatically | Do not infer automatically | Supported |
| law_gospel | Do not infer automatically | Do not infer automatically | Supported |
| word_study | Possible only when source evidence supports lexical relationship | Possible only after review | Supported |
| curated_manual | Supported as import review status or overlay | Supported as import review status or overlay | Supported |

## Risks

### License Risk

- OpenBible uses CC BY terms and includes references to copyrighted ESV quotations on the page. WCM must not import Bible text from OpenBible.
- CrossWire modules are not all public domain. TSK is reviewed as public domain, but other modules require separate license review.
- STEP relationship data is not approved because no specific licensed dataset was confirmed.

### Provenance Risk

- OpenBible blends multiple inputs and vote signals. WCM must record OpenBible as source and keep attribution.
- TSK is historically established, but the exact reference extraction process from the SWORD module would need reproducible tooling.

### Data Quality Risk

- Bulk cross-reference sources may include loose topical connections that are not suitable for high-trust theological labels.
- Source records may not distinguish quotation, allusion, typology, prophecy, fulfillment, or lexical relationships.
- Automatic relationship typing would overstate certainty.

### Import Complexity Risk

- OpenBible may be easier to normalize but still requires package inspection.
- SWORD TSK requires module parsing and reference extraction.
- Both sources require duplicate detection, canonical book mapping, reference-range normalization, and review status tracking.

## Recommendation

Final recommendation: Recommended First Source.

The recommended first source for future CR-3 source-package review is OpenBible.info Cross References, with these required conditions:

1. Download must wait for explicit approval.
2. Import must wait for separate schema/API/data approval.
3. WCM must import references only, not Bible text.
4. CC BY attribution must be stored and displayed where required.
5. OpenBible source metadata and checksum must be recorded in a package manifest.
6. Relationship types must default to conservative imported candidates until reviewed.
7. Theological categories such as `typology`, `promise_fulfillment`, `prophecy_fulfillment`, and `law_gospel` must remain curated-only.

TSK via CrossWire should be retained as the safest public-domain fallback and validation source. It is especially useful if WCM chooses to prioritize public-domain-only source material, but it likely requires more parser work than OpenBible.

## Next Objective

Recommended next step:

Phase CR-3 - Cross Reference Data Package Specification.

That phase should define:

- package manifest requirements
- license and attribution fields
- reference-range JSONL shape
- source checksum policy
- duplicate detection
- canonical book mapping
- dry-run validation report
- import gate requirements
- review status and relationship-type policy

No source download or import should occur until CR-3 is approved.

## Sources Reviewed

- OpenBible.info Cross References: https://www.openbible.info/labs/cross-references/
- Creative Commons Attribution 3.0: https://creativecommons.org/licenses/by/3.0/
- Creative Commons Attribution 4.0: https://creativecommons.org/licenses/by/4.0/
- CrossWire TSK module page: https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK
- CrossWire SWORD configuration documentation: https://wiki.crosswire.org/DevTools:conf_Files
