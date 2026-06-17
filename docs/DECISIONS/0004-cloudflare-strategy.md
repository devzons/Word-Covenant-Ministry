# ADR-0004 Cloudflare Strategy

## Status

Accepted

## Date

2026-06-17

## Context

The project needs a consistent strategy for edge delivery, protection, media handling, object storage, and video delivery.

## Decision

Cloudflare is the strategic platform for:

- DNS
- CDN
- WAF
- Images
- R2
- Stream

Cloudflare-related frontend code belongs in frontend Cloudflare and media areas. Cloudflare-related WordPress behavior belongs in the `wcm-core` plugin.

## Consequences

Cloudflare API tokens, account IDs, and secrets must be stored in environment variables or hosting secret stores and never committed.

Media and delivery decisions that affect future development must be recorded in `docs/DECISIONS/`.

## Alternatives Considered

- Vercel-only image and edge strategy: rejected as the sole strategy because Cloudflare owns DNS, CDN, WAF, and media services.
- WordPress media library only: rejected for long-term delivery strategy because Cloudflare services are part of the architecture.
- Ad hoc provider-specific code: rejected because media strategy should remain documented and centralized.
