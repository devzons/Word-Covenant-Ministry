# Local Setup

This project uses Next.js for the frontend and Local WP for WordPress backend development.

## Prerequisites

- Node.js and npm for the frontend
- Local WP for the WordPress backend
- PHP and Composer for plugin development

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend reads from the WordPress backend through configured API URLs. Use `frontend/.env.example` as the template for local values, and never commit real `.env` files.

Local frontend URL:

```txt
http://wordcovenantministry.local:3030
```

Local frontend API configuration should point `NEXT_PUBLIC_API_URL` to:

```txt
http://api.wordcovenantministry.local/wp-json
```

Do not use this URL for local frontend API configuration unless the local API host is explicitly changed:

```txt
http://wordcovenantministry.local/wp-json
```

## Backend CMS

The backend is the Local WP site stored under:

```txt
backend/
```

Confirmed Local WP / backend API URL:

```txt
http://api.wordcovenantministry.local
```

WordPress REST API base:

```txt
http://api.wordcovenantministry.local/wp-json
```

WCM REST API namespace:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1
```

Example WCM Bible endpoint:

```txt
http://api.wordcovenantministry.local/wp-json/wcm/v1/bible/KRV/genesis/1/1
```

The active plugin source is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Do not move plugin files. Do not create symlinks. Activate `wcm-core` from the WordPress admin if needed.

## Backend Plugin

```bash
cd backend/app/public/wp-content/plugins/wcm-core
composer install
composer dump-autoload
```

`vendor/` may be ignored during early development. It may be committed later only if deployment requires bundled Composer dependencies.

## Local Files Not In Git

Do not commit:

- `backend/app/public/wp-content/uploads/`
- `backend/app/public/wp-content/cache/`
- `backend/app/public/wp-content/upgrade/`
- `backend/app/public/wp-content/debug.log`
- `backend/sql/`
- `backend/logs/`
- `backend/conf/`
- `backend/run/`
- SQL dumps
- `wp-config.php`
- secret-bearing env files
