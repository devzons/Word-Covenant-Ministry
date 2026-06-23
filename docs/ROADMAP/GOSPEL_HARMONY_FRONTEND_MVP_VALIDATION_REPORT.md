# Gospel Harmony Frontend MVP Validation Report

## Current Phase

CR-60 - Gospel Harmony Frontend MVP Browser Validation

## Runtime Recovery

The local frontend runtime was recovered from a stale Next.js listener.

Findings:

- Port `3030` had a Node listener.
- The stale process was confirmed as `next-server (v16.2.9)` in the `frontend/` directory.
- Initial sandboxed `curl` checks failed.
- After recovery, the official frontend host worked:

```txt
http://wordcovenantministry.local:3030
```

Escalated reachability checks returned `HTTP/1.1 200 OK` for:

```txt
http://wordcovenantministry.local:3030
http://127.0.0.1:3030
```

The recovered local dev server was left running.

## Routes Checked

Validated routes:

```txt
/ko/gospel-harmony
/en/gospel-harmony
/ko/gospel-harmony?unit=jesus-baptism
/en/gospel-harmony?unit=feeding-five-thousand
/en/gospel-harmony?unit=transfiguration
/en/gospel-harmony?unit=invalid-test
/en/bible/WEB/genesis/1?mode=reader#v1
/ko/bible/KRV/matthew/3?mode=reader#v13
```

## URL State

Passed:

- `?unit=jesus-baptism` selected the Korean baptism unit.
- `?unit=feeding-five-thousand` selected the English feeding unit.
- `?unit=transfiguration` selected the English transfiguration unit.
- Reload preserved selected unit state.
- Invalid unit fallback selected the first unit, `Baptism of Jesus`.
- Browser URL remained stable.

## Layout QA

Desktop passed:

- Event list visible.
- Parallel Gospel content visible.
- Matthew, Mark, and Luke columns rendered.

Mobile passed:

- Event list and passages did not create horizontal overflow.
- Mobile layout avoided cramped three-column display.
- Passage controls remained accessible.

## Runtime Bible Text

Passed:

- KRV runtime text loaded on `/ko`.
- WEB runtime text loaded on `/en`.
- Bible text was fetched from existing Bible APIs.
- Harmony fixture data did not store copied Bible text.

## Preview Modal

Passed:

- `View passage` / `본문 보기` opened the preview modal.
- WEB same-chapter preview worked for `Matthew 14:13-21`.
- KRV same-chapter preview worked for `마태복음 3:13-17`.
- Long-range unsupported fallback worked for `Matthew 27:32-56`.
- ESC close worked.
- Close button worked.
- Focus returned to the triggering `View passage` / `본문 보기` button.
- Body scroll cleanup worked.
- Open in Reader remained available from the modal.

Known limitation:

- The current curated fixture has no cross-chapter Gospel Harmony range.
- Cross-chapter fallback was not directly fixture-tested.
- Unsupported fallback was validated with an over-10-verse same-chapter range.

## Open In Reader

Passed:

```txt
/ko/bible/KRV/matthew/3?mode=reader#v13
/en/bible/WEB/matthew/14?mode=reader#v13
```

Reader routes loaded after navigation.

## Regression Checks

Passed:

- Bible Reader route loaded.
- Reader Related Passages tab activated.
- Related Passages preview action remained visible.
- No Cross Reference behavior changes were made in CR-60.
- No Word Study behavior changes were made in CR-60.
- No Review Tool behavior changes were made in CR-60.

## Console

No new React/runtime console errors were captured during browser validation.

## Validation

Documentation validation:

```bash
git diff --check
git status --short
```

## Final Verdict

CR-60 passed.

## Next Objective

Gospel Harmony Cross Reference integration planning after separate approval.

## Known Constraints

- No schema/API/import/migration work was performed.
- No external harmony dataset was introduced.
- Gospel Harmony remains curated fixture data.
- Cross-chapter preview fallback still needs a dedicated fixture or future range test.
