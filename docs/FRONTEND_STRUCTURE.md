# Frontend Structure

The frontend is the Next.js application. All frontend application code belongs in `frontend/`.

## Repository Inspection Rule

Before any frontend change, verify the repository root and confirm `frontend/` exists from the filesystem.

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

Never assume frontend paths from memory or previous conversations. If `frontend/` does not exist, stop, inspect, report findings, and ask for confirmation before creating a new structure.

## Required Structure

```txt
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── content/
│   │   ├── media/
│   │   └── scripture/
│   ├── lib/
│   │   ├── api/
│   │   ├── wordpress/
│   │   ├── cloudflare/
│   │   ├── seo/
│   │   └── utils/
│   ├── types/
│   ├── config/
│   └── styles/
├── public/
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Responsibilities

- `src/app/`: routes, layouts, metadata, sitemap, and robots handling
- `src/components/layout/`: page chrome and structural components
- `src/components/ui/`: reusable UI primitives
- `src/components/content/`: content rendering components
- `src/components/media/`: image, video, and Cloudflare media presentation
- `src/components/scripture/`: scripture-specific presentation
- `src/lib/api/`: API clients and request helpers
- `src/lib/wordpress/`: WordPress data access and normalization
- `src/lib/cloudflare/`: Cloudflare media helpers
- `src/lib/seo/`: SEO metadata helpers
- `src/lib/utils/`: general frontend utilities
- `src/types/`: shared TypeScript types
- `src/config/`: frontend configuration
- `src/styles/`: global styles and style utilities

## Boundaries

Do not add WordPress plugin PHP or backend CMS logic to `frontend/`. Frontend code consumes WordPress APIs from the Local WP backend; it does not own backend behavior.

The active WordPress plugin source is outside `frontend/` at:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

## Local API Configuration

The local frontend runs at:

```txt
http://wordcovenantministry.local:3030
```

`NEXT_PUBLIC_API_URL` should point locally to:

```txt
http://api.wordcovenantministry.local/wp-json
```

Do not use this URL for local frontend API configuration unless the local API host is explicitly changed:

```txt
http://wordcovenantministry.local/wp-json
```

Example WCM Bible endpoint:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

## Validation

```bash
cd frontend
npm run lint
npm run build
```
