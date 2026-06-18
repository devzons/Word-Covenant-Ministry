# Backend Structure

The backend is the Local WP backend. The active custom WordPress plugin source lives inside the Local WP WordPress plugins directory.

## Repository Inspection Rule

Before any backend or plugin change, verify the repository root and actual filesystem structure. Do not rely on memory or previous conversations.

```bash
git rev-parse --show-toplevel
git status
find . -maxdepth 5 -type d | sort
```

If `backend/app/public/wp-content/plugins/wcm-core/` does not exist, stop, inspect, report findings, and ask for confirmation before creating any new structure.

## Official Backend Structure

```txt
backend/
├── app/
│   └── public/
│       └── wp-content/
│           └── plugins/
│               └── wcm-core/
│                   ├── wcm-core.php
│                   ├── composer.json
│                   ├── composer.lock
│                   ├── src/
│                   │   ├── Core/
│                   │   ├── Admin/
│                   │   ├── Api/
│                   │   ├── PostTypes/
│                   │   ├── Taxonomies/
│                   │   ├── Scripture/
│                   │   ├── Media/
│                   │   ├── Search/
│                   │   ├── Seo/
│                   │   └── Settings/
│                   ├── assets/
│                   ├── languages/
│                   └── tests/
├── conf/
├── logs/
└── sql/
```

## Active Plugin Path

The only official plugin path is:

```txt
backend/app/public/wp-content/plugins/wcm-core/
```

Do not move files. Do not create symlinks. Do not create another plugin source path.

Never create alternative structures such as:

```txt
backend/wcm-core
backend/plugin/wcm-core
app/plugins/wcm-core
```

unless they already exist and are documented.

Do not use these paths for active backend or plugin work:

```txt
backend/wcm-core/
backend/plugin/wcm-core/
app/public/wp-content/plugins/wcm-core/
```

## Local API URLs

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

## Namespace

Composer autoloading should use the `WCM\\` namespace:

```json
{
  "autoload": {
    "psr-4": {
      "WCM\\": "src/"
    }
  }
}
```

## Dependency Policy

`vendor/` inside the plugin may be ignored during early development. It may be committed later only if deployment requires the plugin to ship with Composer dependencies.

## Source-Control Exclusions

Keep the active plugin path trackable. Ignore generated backend files:

- `backend/app/public/wp-content/uploads/`
- `backend/app/public/wp-content/cache/`
- `backend/app/public/wp-content/upgrade/`
- `backend/app/public/wp-content/debug.log`
- `backend/sql/`
- `backend/logs/`
- `backend/conf/`
- `backend/run/`
- `*.sql`
- `*.sql.gz`
- `.env`
- `wp-config.php`
