# WCM Korean Transliteration Standard

## Date

2026-06-20

## Status

Phase 8F working standard. This document defines the current Korean display standard for original-language transliteration review and seed imports.

## Purpose

Word Covenant Ministry uses Korean transliteration to help Korean readers pronounce and recognize Hebrew, Aramaic, and Greek original-language terms.

This is not Korean Bible translation. It is original-language reading support.

## Core Principle

Use consistent Korean phonetic rendering of the source-language reading.

Do not use traditional Korean Bible-name substitution as the default rule.

Examples:

- Use a Moshe-style original reading, not a Moses-style Korean translation name by default.
- Use a Dawid-style original reading, not necessarily a traditional Korean Bible name by default.
- Proper-name exceptions require explicit policy approval.

## Hebrew Consonant Basis

WCM uses the following Korean consonant-name basis when reviewing Hebrew and Aramaic transliteration:

```txt
알렙
베이트
기멀
달렛
헤이
바브
자인
헤이트
테이트
요드
카프
라메드
멤
눈
사멕
아인
페이
짜디
코프
레이쉬
씬
쉰
타브
```

These names guide Korean phonetic rendering. They do not replace term-level review when a word has an established WCM reading.

## Hebrew Vowel Policy

Use readable Korean vowels that approximate the source reading:

- `a` / patah-qamets style: `아`
- `e` / segol-tsere style: `에`
- `i`: `이`
- `o`: `오`
- `u`: `우`
- reduced or very short vowels may be rendered lightly when needed for readability.

The goal is stable reading support, not academic precision at the expense of usability.

## Shewa Policy

Vocal shewa may be rendered with a light `으`, `에`, or omitted depending on the reviewed reading.

Rules:

- Do not force every shewa into a full Korean syllable.
- Preserve readability for Korean users.
- Keep common reviewed patterns stable once seeded.

## Sin/Shin Policy

Distinguish when the source reading is clear:

- `שׂ` / sin: `스` or `시` family when needed.
- `שׁ` / shin: `쉬` / `샤` / `쉐` family according to vowel.

When source transliteration already provides `s` or `sh`, follow that reading.

## Ayin/Alef Policy

Alef and ayin often do not map to a strong Korean consonant.

Rules:

- Initial alef/ayin may be represented by the vowel onset: `아`, `에`, `이`, `오`, `우`.
- Internal alef/ayin may be reflected by a vowel break when needed.
- Do not invent a heavy consonant sound where the reading is vowel-led.

## Final Forms Policy

Hebrew final forms do not change the Korean pronunciation by themselves.

Final-form letters are rendered according to the same consonant sound as their non-final forms:

- final kaf follows kaf reading
- final mem follows mem reading
- final nun follows nun reading
- final pe follows pe reading
- final tsadi follows tsadi reading

## Proper-Name Policy

Proper names should follow original-language Korean reading by default.

Do not substitute traditional Korean Bible names unless an explicit exception is approved.

Examples:

```txt
משה -> 모쉐
דוד -> 다비드
ירושלים -> 예루샬라임
```

Exception examples that require explicit policy:

- pastoral display preference
- long-established Korean church usage
- public-facing non-study labels
- ambiguity where source reading and traditional name diverge sharply

## Greek Transliteration Policy

Greek transliteration follows a church/seminary-friendly Korean reading of Koine Greek while preserving source-language identity.

Current placeholder guidance:

- alpha: `아`
- beta: `브` / `바` family by vowel
- gamma: `그` / `가` family by vowel
- delta: `드` / `다` family by vowel
- epsilon/eta: generally `에`
- theta: `테` / `트` family
- iota: `이`
- kappa/chi: `크` / `카` family
- lambda: `르` / `라` family
- mu: `므` / `마` family
- nu: `느` / `나` family
- omicron/omega: generally `오`
- pi/phi: `프` / `파` family
- rho: `르` / `라` family
- sigma: `스` / `사` family
- tau: `트` / `타` family
- upsilon: `위` or `우` according to reviewed reading

Greek policy remains a placeholder until a fuller Phase 8F/Phase 10 review standard is approved.

## Examples

WCM standard examples:

```txt
בראשית -> 베레시트
אלהים -> 엘로힘
משה -> 모쉐
דוד -> 다비드
ירושלים -> 예루샬라임
Ιησους -> 예수스
```

Notes:

- Existing reviewed seeds may preserve earlier approved forms until a separate normalization pass is approved.
- Broad replacement of existing reviewed seeds is not allowed without explicit approval.
- This standard guides new transliteration review and imports.

## Import Boundary

Seed imports must:

- populate only `transliteration_ko` when running transliteration-only work
- preserve existing reviewed `transliteration_ko` values
- not write `gloss_ko`
- exclude punctuation/link markers
- exclude pseudo morphology rows
- exclude divine-name/title rows until policy is approved
- exclude unresolved article/pronoun/function rows until policy is approved

