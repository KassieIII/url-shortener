# Architecture

## Overview

A minimal but production-shaped URL shortener with three concerns deliberately
separated: HTTP transport (`routes/`), domain logic (`lib/codes.ts`,
`lib/code-validate.ts`) and infrastructure (`lib/redis.ts`, `lib/logger.ts`).

```
HTTP request
    │
    ▼
┌────────────────────┐
│  src/app.ts        │  helmet · cors · rate-limit · pino-http
└────────────────────┘
    │
    ▼
┌────────────────────┐
│  src/routes/*      │  Zod request validation
└────────────────────┘
    │
    ▼
┌────────────────────┐
│  src/lib/codes.ts  │  generateCode (nanoid + custom alphabet)
└────────────────────┘
    │
    ▼
┌────────────────────┐
│  src/lib/redis.ts  │  GET / SET / INCR (clicks)
└────────────────────┘
```

## Why a separate `code-validate.ts`

`src/lib/codes.ts` imports `config`, which calls `envSchema.parse(process.env)`
at module load time. Importing `codes.ts` from a unit test would crash if the
host machine's `BASE_URL` is invalid. The pure regex validator therefore lives
in `lib/code-validate.ts` (zero deps) so tests can exercise it without booting
the configuration layer.

## Storage layout

| Key                | Value      | Purpose                       |
| ------------------ | ---------- | ----------------------------- |
| `url:<code>`       | target URL | Lookup on redirect            |
| `clicks:<code>`    | integer    | `INCR`-emented per redirect   |

TTL is intentionally not set — durability is delegated to Redis persistence
(`appendonly yes` recommended in production).

## Trade-offs

- **No database**. Redis is the single store. Fine for the demo scope; a real
  service would persist URLs in Postgres and use Redis as a hot cache.
- **No auth**. The public API is open by design (rate-limited per IP). Adding
  API keys would be a one-middleware change.
- **Synchronous click counting**. `INCR` is fire-and-forget on the redirect
  path; the response is sent before the increment is acknowledged.
