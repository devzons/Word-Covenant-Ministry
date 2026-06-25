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

Optional JSON output:

```bash
node scripts/timeline/verify-timeline-package.mjs --json docs/data-packages/timeline/fixtures/warnings
```

Current supported checks:

- JSON syntax
- package envelope fields
- duplicate row IDs
- center-column required fields
- cross-link field presence and ID resolution
- canonical 66-book skeleton validation
- exact 66-row count for canonical-skeleton book packages
- non-empty unique `bookId` values for canonical-skeleton book packages
- canonicalOrder integer, range, duplicate, and gap validation
- testament value validation plus `OT=39` and `NT=27` distribution checks
- canonical title warning policy for 66-book package rows
- Bible-text field guardrails
- no-coordinate and no-map-provider guardrails
- supporting-reference authority guardrails
- warning-only review flags for approximate chronology, Korean reference review, and low-confidence cross-links

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
grep -En 'lat|latitude|lng|lon|longitude|coordinates|geojson|geometry|mapProvider|tileUrl' docs/data-packages/timeline/*.json
```

Fixture notes:

- `docs/data-packages/timeline/fixtures/valid/` contains pass fixtures
- `docs/data-packages/timeline/fixtures/invalid/` contains fail fixtures
- `docs/data-packages/timeline/fixtures/warnings/` contains warning-only fixtures
- invalid JSON syntax is documented in `fixtures/README.md`, not stored as a broken `.json` file

Reference:

- `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`
