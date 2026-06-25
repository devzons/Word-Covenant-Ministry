# Timeline Package Verifier

Current status:

- Minimal CLI implemented
- Read-only verification only
- No runtime import or transformation behavior
- Fixture directory available under `fixtures/`

Purpose:

- Validate Timeline package structure and safety rules
- Guard against duplicate IDs, missing Scripture anchors, fake cross-links, Bible text storage, and no-coordinate violations
- Keep supporting reference layers from being treated as interpretive authority over Scripture

Current command:

```bash
node scripts/timeline/verify-timeline-package.mjs docs/data-packages/timeline
```

Standard wrapper command:

```bash
node scripts/timeline/verify-timeline-packages.mjs
```

Optional JSON output:

```bash
node scripts/timeline/verify-timeline-package.mjs --json docs/data-packages/timeline/fixtures/warnings
```

Current supported checks:

- JSON syntax
- package envelope fields
- duplicate row IDs
- center-column required fields
- cross-link field presence, ID resolution, target-type validation, Bible-reference-as-id rejection, and duplicate-target ambiguity detection
- canonical 66-book skeleton validation
- exact 66-row count for canonical-skeleton book packages
- non-empty unique `bookId` values for canonical-skeleton book packages
- canonicalOrder integer, range, duplicate, and gap validation
- testament value validation plus `OT=39` and `NT=27` distribution checks
- canonical title warning policy for 66-book package rows
- Bible-text field guardrails
- recursive no-coordinate and no-map-provider guardrails, including nested objects and arrays
- supporting-reference authority guardrails for Korean/world reference layers
- warning-only review flags for approximate chronology, supporting-reference review, missing cross-link target type, and low-confidence cross-links

Current wrapper coverage:

- verifier CLI syntax check
- `books.66-canonical-skeleton.json` pass
- `events.core-biblical-skeleton.json` pass
- `fixtures/valid` pass
- `fixtures/invalid` expected fail with exit code `1`
- `fixtures/warnings` pass with `errorCount === 0` and `warningCount >= 1`
- JSON smoke parse for `events.core-biblical-skeleton.json`

Kings / Kingdoms fixture expectations:

- `timeline.kings-kingdoms` fixtures currently use the implemented verifier envelope shape with `items`
- valid fixtures should show minimal `kingdomPeriod`, `kingdom`, `king`, and `transition` samples with reference-only `scriptureAnchors`
- invalid fixtures should immediately fail when they use banned Bible-text fields, banned coordinate/map-provider fields, or broken explicit cross-link IDs
- warning fixtures should cover approximate chronology wording and low-confidence synchronism proxies without failing the overall package check

Pending `CR-93G-4` Kings / Kingdoms verifier rules:

- `kingdomId` resolution inside `timeline.kings-kingdoms` rows
- `predecessorId` and `successorId` resolution inside king rows
- `previousStateId` and `nextStateId` resolution inside transition rows
- allowed kingdom scope or kingdom-name validation
- exact chronology without review gating
- low-confidence synchronism warning behavior beyond generic cross-link review
- optional `reignLabel` warning behavior

Current implementation note:

- Kings / Kingdoms fixtures are now present, but several Kings-specific semantics remain documentation targets until `CR-93G-4` hardens the CLI.

Current cross-link inventory:

- `timeline.cross-links` rows currently use `fromType`, `fromId`, `toType`, `toId`
- supporting metadata currently uses `relationLabel`, `basisLabel`, and `confidenceLabel`
- shared schema fields such as `relatedEventIds`, `relatedBookIds`, `relatedPlaceIds`, and `relatedKingdomIds` remain documented package fields, but the current CLI explicitly resolves `timeline.cross-links`

Current cross-link guardrail policy:

- `toType` should use explicit allowed values such as `book`, `event`, `person`, `genealogy`, `place`, `kingdom`, `scriptureEvidence`, or `supportingReference`
- missing `toType` currently warns instead of failing
- cross-link IDs must resolve to real package row IDs
- Scripture reference strings such as `Genesis 1:1` are not treated as package row IDs
- duplicate target IDs make cross-link resolution ambiguous and fail verification
- self-links currently warn for review rather than failing

Current no-coordinate policy:

- coordinate and map-provider field names are rejected recursively, including nested arrays and supporting-reference objects
- generic `provider` or `sourceProvider` fields are not rejected unless they clearly carry map-provider values such as `mapbox`

Current supporting-reference authority policy:

- Korean/world references must remain supporting-only
- labels that imply primary, equal, scripture-equivalent, or interpretive authority fail verification
- review-required placeholder/supporting rows warn when source basis still needs follow-up

Current 66-book package detection:

- `packageType: "timeline.books"`
- `status: "canonical-skeleton"`
- or canonical package identifiers such as the checked-in `books.66-canonical-skeleton.json`

Alternative shape if implementation direction changes later:

```bash
php tools/timeline/verify-timeline-package.php docs/data-packages/timeline
```

Manual spot checks still remain useful:

```bash
python3 -m json.tool docs/data-packages/timeline/books.66-canonical-skeleton.json > /tmp/books-66-check.json
```

```bash
python3 - <<'PY'
import json
from pathlib import Path
p = Path("docs/data-packages/timeline/books.66-canonical-skeleton.json")
data = json.loads(p.read_text())
items = data.get("items", [])
assert len(items) == 66
assert len({item.get("bookId") for item in items}) == 66
print("books skeleton manual check passed")
PY
```

```bash
grep -n '"text"' docs/data-packages/timeline/books.66-canonical-skeleton.json
```

```bash
grep -En 'lat|latitude|lng|lon|longitude|coordinates|coordinate|geo|geojson|geometry|point|marker|bounds|viewport|mapProvider|mapbox|googleMaps|googleMap|naverMap|kakaoMap' docs/data-packages/timeline/*.json
```

```bash
node scripts/timeline/verify-timeline-package.mjs docs/data-packages/timeline/fixtures/invalid
```

Fixture notes:

- `docs/data-packages/timeline/fixtures/valid/` contains pass fixtures
- `docs/data-packages/timeline/fixtures/invalid/` contains fail fixtures
- `docs/data-packages/timeline/fixtures/warnings/` contains warning-only fixtures
- invalid JSON syntax is documented in `fixtures/README.md`, not stored as a broken `.json` file

Current CI wiring status:

- no repository GitHub Actions workflow exists yet
- local wrapper command is ready
- CI wiring remains deferred to a later approved step

Reference:

- `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`
