# url-shortener

[![CI](https://github.com/KassieIII/url-shortener/actions/workflows/ci.yml/badge.svg)](https://github.com/KassieIII/url-shortener/actions/workflows/ci.yml)

Tiny, production-style URL shortener written in TypeScript on top of Express and Redis.
The goal of this project is to demonstrate a clean Node.js backend: layered code,
input validation with Zod, rate limiting, security headers, Dockerised deployment
and a CI pipeline.

## Features

- `POST /api/shorten` — create a short code (optionally with TTL)
- `GET /:code` — 302 redirect with click counter
- `GET /api/stats/:code` — return click count and metadata
- Per-IP rate limiting on the API surface
- Strict input validation (Zod) and a small custom alphabet for codes
- JSON structured logs
- Multi-stage Dockerfile + docker-compose with Redis

## Stack

Node 20 · TypeScript 5 · Express 4 · ioredis · Zod · Vitest · Docker

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

Then:

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Local development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Project layout

```
src/
  app.ts          Express app composition
  config.ts       Env validation
  index.ts        Bootstrap
  lib/            redis, logger, code generation
  routes/         shorten, redirect, stats
tests/
```

## License

MIT
