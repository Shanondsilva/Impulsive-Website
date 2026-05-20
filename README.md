# Impulsive Website

The pre-launch landing page and waitlist for Impulsive, a privacy-first behaviour-change support tool.

## Stack

- Vite + React + TypeScript (`src/`)
- Static assets in `public/`
- Cloudflare Worker with Static Assets binding (`src/worker.js`, `wrangler.toml`)
- Cloudflare D1 for the waitlist database
- Brevo (optional) for transactional confirmation email

The legacy static site is kept under `frontend/` for reference only — see [`frontend/LEGACY.txt`](frontend/LEGACY.txt). It is not part of the current build.

## Local setup

```bash
npm install
npm run db:apply:local
npm run dev
```

`npm run dev` builds the React app and runs Wrangler with the local D1 binding so `/api/waitlist` behaves the same as production.

For quick frontend-only iteration without Wrangler, `npm run dev:vite` starts an Express + Vite middleware server on `http://localhost:3000`. Its `/api/waitlist` route is a local stub — it always returns success and does not write to a database. Use Wrangler-based `npm run dev` to test the real waitlist flow.

## Production build

```bash
npm run build
npm run preview
```

## Cloudflare deployment

This project deploys as a Cloudflare Worker with Static Assets. Configuration is in `wrangler.toml`.

Security headers (including CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Frame-Options) are applied directly inside `src/worker.js` via `applySecurityHeaders()`, because Cloudflare Workers Static Assets does not automatically apply the `public/_headers` file. The `_headers` file is kept as a fallback in case the project is ever served via Cloudflare Pages.

### Verifying security headers in production

```bash
curl -I https://useimpulsive.com/
curl -I https://useimpulsive.com/privacy.html
curl -I https://useimpulsive.com/terms.html
```

Each response should include `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy`.

### D1 (waitlist database)

1. Create a D1 database for waitlist signups.
2. Apply the schema file at `db/schema.sql`.
3. Bind the database to the Worker as `WAITLIST_DB`.
4. Run `npm run db:apply:remote` for a new database, or `npm run db:migrate:remote` then `npm run db:normalise:remote` for an older existing database.
5. Deploy after the binding and schema are in place.

### Required Worker bindings

- `WAITLIST_DB` — D1 binding
- `WAITLIST_IP_HASH_SECRET` — secret used to hash the submitter IP before storage

### Optional Worker variables

Transactional confirmation email (Brevo):

- `BREVO_API_KEY`
- `WAITLIST_FROM_EMAIL`
- `WAITLIST_FROM_NAME` (defaults to "Impulsive")
- `WAITLIST_ADMIN_EMAIL`

Admin waitlist export:

- `WAITLIST_ADMIN_TOKEN`

## Abuse protection (TODO before broad public traffic)

The waitlist endpoint currently relies on a honeypot field, a minimum form-fill time, a hashed-IP rate column, and a small body size limit. Before broad public traffic, add Cloudflare Turnstile on the form or a Cloudflare rate limiting / WAF rule on `/api/waitlist`.

## Search Console

1. Verify `https://useimpulsive.com`.
2. Submit `https://useimpulsive.com/sitemap.xml`.
3. Use URL Inspection for the homepage and request indexing.
4. Confirm `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/ai/home.md` return HTTP 200.
