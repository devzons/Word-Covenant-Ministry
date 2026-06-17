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

## Backend CMS

The backend is the Local WP site stored under:

```txt
backend/
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
