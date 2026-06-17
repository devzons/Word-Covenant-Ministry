# ADR-0006 Development Port Standard

## Status

Accepted

## Date

2026-06-17

## Context

Port 3000 is reserved and may already be in use. Word Covenant Ministry needs a consistent local frontend development port so documentation, scripts, environment examples, and future agent-generated commands do not assume the default Next.js port.

## Decision

Word Covenant Ministry frontend development uses:

```txt
http://wordcovenantministry.local:3030
```

Frontend standard:

```txt
Port 3030
```

Backend:

```txt
Use Local WP assigned URL.
```

The standard local backend URL is currently documented as:

```txt
http://wordcovenantministry.local
```

If Local WP generates a different backend URL, inspect Local WP and use that assigned URL.

## Consequences

- Do not use port 3000.
- Do not assume port 3000.
- New frontend scripts must use port 3030.
- Documentation examples must use port 3030.
- Environment examples must use port 3030.
- Future agent-generated commands must use port 3030 unless explicitly overridden.

## Alternatives Considered

- Use the default Next.js port 3000: rejected because port 3000 is reserved and may already be in use.
- Leave the frontend port implicit: rejected because future agents and scripts could assume port 3000.
- Use arbitrary available ports: rejected because the project needs a stable documented development endpoint.
