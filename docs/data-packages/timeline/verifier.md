# Timeline Package Verifier

Current status:

- Not implemented
- Design only
- No executable verifier script yet

Purpose:

- Validate Timeline package structure and safety rules
- Guard against duplicate IDs, missing Scripture anchors, fake cross-links, Bible text storage, and no-coordinate violations
- Keep supporting reference layers from being treated as interpretive authority over Scripture

Future command shape:

```bash
node scripts/timeline/verify-timeline-package.mjs docs/data-packages/timeline
```

Alternative shape if implementation direction changes later:

```bash
php tools/timeline/verify-timeline-package.php docs/data-packages/timeline
```

Current manual checks:

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

Reference:

- `docs/ROADMAP/TIMELINE_PACKAGE_VERIFIER_DESIGN.md`
