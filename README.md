# Impulsive Website

Updated Vite React version of the Impulsive landing page.

## What changed

- Converted the older static `frontend` build into the newer Vite React structure from the updated file.
- Kept the Impulsive landing page content, pastel theme, mobile menu, reveal animations, and waitlist form.
- Replaced externally hosted image links with local assets in `public/` so the site works without image-hosting dependencies.
- Preserved the Cloudflare Pages waitlist function from the original repository at `functions/api/waitlist.js`.
- Added Cloudflare deployment headers and redirects in `public/_headers` and `public/_redirects` so they are copied into `dist` during build.

## Local setup

```bash
npm install
npm run db:apply:local
npm run dev
```

Open `http://127.0.0.1:8787`. This uses Wrangler so `/api/waitlist` runs through the same Cloudflare Worker and D1 binding as production.

`npm run dev:vite` starts the older Vite/Express development server. Do not use that command to test waitlist storage because its `/api/waitlist` route is only a local stub.

## Production build

```bash
npm run build
npm run preview
```

## Cloudflare deployment notes

This project is deployed as a Cloudflare Worker with static assets, configured in `wrangler.toml`.

Before deploying a new D1 database, apply the schema:

```bash
npm run db:apply:remote
```

If the remote D1 database was created before `page`, `referrer`, `status`, `updated_at`, and `confirmation_sent_at` existed, run:

```bash
npm run db:migrate:remote
npm run db:normalise:remote
```

## Waitlist production setup

Required Cloudflare environment variables and bindings:

- `WAITLIST_DB` D1 binding
- `WAITLIST_IP_HASH_SECRET`

Optional email confirmation variables:

- `BREVO_API_KEY`
- `WAITLIST_FROM_EMAIL`
- `WAITLIST_FROM_NAME=Impulsive`
- `WAITLIST_ADMIN_EMAIL`

Optional waitlist export variable:

- `WAITLIST_ADMIN_TOKEN`

### Cloudflare D1

1. Create a D1 database for waitlist signups.
2. Apply the schema file at `db/schema.sql`.
3. Bind the database to the Worker as `WAITLIST_DB`.
4. Run `npm run db:apply:remote` for a new database, or `npm run db:migrate:remote` then `npm run db:normalise:remote` for an older existing database.
5. Deploy after the binding and schema are in place.

### Brevo

1. Create or log into Brevo.
2. Verify the sender email or domain.
3. Create a transactional API key.
4. Add `BREVO_API_KEY` to Cloudflare Pages environment variables.
5. Add `WAITLIST_FROM_EMAIL` and `WAITLIST_FROM_NAME`.

### Google Search Console

1. Verify `https://useimpulsive.com`.
2. Submit `https://useimpulsive.com/sitemap.xml`.
3. Use URL Inspection for the homepage and request indexing.
4. Check that `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/ai/home.md` return HTTP 200.
5. Search `site:useimpulsive.com` after Google recrawls.

This does not guarantee ranking. The goal is to make the site indexable and strong for branded search first, then long-tail search later.
