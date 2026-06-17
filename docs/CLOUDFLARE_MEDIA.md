# Cloudflare Media

Cloudflare is responsible for media delivery, CDN behavior, WAF, and DNS for Word Covenant Ministry.

## Responsibilities

- Serve optimized media assets where appropriate.
- Protect public traffic with WAF rules.
- Manage DNS for frontend and backend-facing domains.
- Cache stable public assets at the edge.

## Repository Boundary

Do not commit uploaded media files to this repository. WordPress uploads and generated image sizes belong outside Git.

Ignored media paths include:

```txt
backend/app/public/wp-content/uploads/
backend/app/public/wp-content/cache/
backend/app/public/wp-content/upgrade/
```

## Frontend Integration

Cloudflare media helpers belong in:

```txt
frontend/src/lib/cloudflare/
frontend/src/components/media/
```

The frontend should render media through stable URLs and configuration, not hard-coded local upload paths.

## Backend Integration

WordPress media and Cloudflare-related plugin logic belongs in:

```txt
backend/app/public/wp-content/plugins/wcm-core/src/Media/
```

Do not place media integration code in generated uploads, cache, upgrade, logs, SQL, runtime, or configuration folders.

## Secrets

Cloudflare API tokens and account IDs must be stored in local environment variables or hosting provider secret stores. Do not commit them.
