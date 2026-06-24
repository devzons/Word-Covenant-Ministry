# Staging Environment Plan

## Purpose

This plan records the staging decisions required before any deployment, beta tag, or release candidate workflow for the Timeline MVP.

## Current Status

- Timeline MVP local readiness is complete.
- No staging frontend host is documented yet.
- No staging backend/API host is documented yet.
- No staging branch/tag strategy is documented yet.
- No staging env values are documented yet.
- No tag or deployment is approved yet.

## Required Staging Decisions

- staging frontend host/domain
- hosting platform, likely Vercel if approved
- staging branch/commit strategy
- staging API base URL
- staging frontend environment variables
- whether staging backend exists
- whether WEB data is available for `/en` Reader links
- staging validation owner/checklist

## Recommended Staging Strategy

- Use the current validated `main` commit as the staging candidate.
- Deploy to staging/preview first.
- Do not create a beta tag until staging validation passes.
- If staging passes, consider an annotated beta tag: `v0.9.0-beta.1`.

## Required Environment Variables

Names only:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ENV`
- `NEXT_PUBLIC_CLOUDFLARE_IMAGE_ACCOUNT_HASH`

Expected staging meaning:

- `NEXT_PUBLIC_APP_URL` should point to the staging frontend URL.
- `NEXT_PUBLIC_API_URL` should point to the staging WordPress REST API base.
- `NEXT_PUBLIC_ENV` should be `staging`.
- Cloudflare hash should be set only if staging image delivery uses Cloudflare Images.

## Timeline MVP Staging Dependencies

- `/[locale]/timeline` is frontend-only.
- Open in Reader links depend on existing Bible Reader routes and Bible data.
- `/ko/timeline` depends on KRV Reader availability.
- `/en/timeline` may depend on WEB availability or an explicit fallback policy.
- No new backend/API/DB work is required for Timeline MVP itself.

## Staging Validation Checklist

- `/ko/timeline` loads
- `/en/timeline` loads
- Open in Reader links work
- mobile layout works
- no console errors
- no hydration warnings
- no unexpected API/network errors

## Non-Scope

- no deployment
- no tag
- no push
- no production change
- no DB/import/schema work
- no generated data
- no secret values in docs

## Recommended Next Step

Confirm the staging frontend URL and staging API URL, then perform staging validation.
