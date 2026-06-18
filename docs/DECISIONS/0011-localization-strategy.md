# ADR-0011 Localization Strategy

## Status

Accepted

## Date

2026-06-18

## Context

Word Covenant Ministry needs a stable localization strategy for Korean and English public content.

The project follows a headless architecture where Next.js owns the public frontend and WordPress owns content management. The frontend already uses a locale route segment, and future Scripture, content, media, SEO, and search features need predictable language-specific URLs.

The localization strategy must support:

- Korean public routes
- English public routes
- language-specific SEO metadata
- translated ministry content
- safe fallback behavior when translated content is unavailable

## Decision

The official public URL structure is:

```txt
/ko
/en
```

Korean content uses `/ko`.

English content uses `/en`.

The project will not use separate domains, subdomains, query strings, or browser-only language switching as the primary localization URL strategy.

## Routing

All localized public routes should live under the locale prefix:

```txt
/ko/{path}
/en/{path}
```

Examples:

```txt
/ko
/en
/ko/sermons
/en/sermons
/ko/bible-studies
/en/bible-studies
/ko/scripture/genesis/1
/en/scripture/genesis/1
```

The locale prefix is part of the canonical route identity.

Any unprefixed public route should redirect to a locale-prefixed route or resolve through an explicitly documented locale selection flow. Unprefixed routes should not become a separate canonical content surface.

## SEO Implications

Each localized page should have one canonical URL for its locale.

Korean pages should use `/ko/...` canonical URLs.

English pages should use `/en/...` canonical URLs.

Localized equivalents should use `hreflang` alternates:

```txt
ko
en
x-default
```

SEO metadata should be localized where translated content exists:

- title
- description
- Open Graph title
- Open Graph description
- structured data text fields where applicable

Search engines should not see fallback content as a duplicate translated page. If a page falls back from one locale to another, the fallback state must be explicit in metadata strategy so canonical and alternate links do not misrepresent untranslated content as fully localized content.

## Content Translation Model

WordPress remains the content management source.

Each translatable content item should support separate Korean and English content values for:

- title
- slug
- excerpt
- body/content
- SEO metadata
- media captions or transcript text where applicable

Translated content should preserve relationships to shared domain entities:

- Scripture references
- Bible books
- Bible verses
- original language terms
- themes
- media assets
- related sermons, Bible studies, books, and resources

Localized content may have different slugs per language, but it must retain a stable relationship to the same underlying content concept when the Korean and English entries are translations of each other.

Scripture references are structured data and should not be translated as free-text strings only. Display labels may localize, but the underlying book/chapter/verse references remain shared.

## Fallback Behavior

Fallback behavior must be explicit and safe.

If a requested translation exists, render that locale's content.

If a requested translation does not exist:

- Prefer showing a clear unavailable state for content where translation accuracy matters.
- Use fallback content only when the page type explicitly allows it.
- Do not silently present fallback text as if it were translated.
- Do not emit misleading localized SEO metadata for untranslated fallback content.
- Keep Scripture references and relationship data available even when editorial text is untranslated.

Default fallback direction:

```txt
/ko -> Korean content
/en -> English content
```

Korean is not automatically a substitute for English, and English is not automatically a substitute for Korean. Page-specific fallback behavior must be documented before implementation when it affects public SEO, routing, or content workflows.

## Consequences

The frontend routing model remains predictable and SEO-friendly.

Future content APIs must expose locale-aware fields or translation relationships.

Sitemaps must include locale-prefixed URLs and language alternates.

Navigation must generate links under the active locale.

Content editors must understand whether a page is translated, untranslated, or intentionally shared across languages.

Scripture Engine and future study engines must separate canonical structured references from localized display labels.

## Alternatives Considered

- Separate domains or subdomains for each language: rejected because it adds operational and SEO complexity before the project needs it.
- Query-string localization such as `?lang=ko`: rejected because it creates weaker canonical URLs and less predictable sharing/search behavior.
- Browser-only language detection without locale-prefixed URLs: rejected because it weakens SEO, caching, and deterministic routing.
- Unprefixed default language routes plus prefixed secondary language routes: rejected because `/ko` and `/en` should be equally explicit canonical surfaces.
