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
npm run dev
```

Open the local URL shown in your terminal.

## Production build

```bash
npm run build
npm run preview
```

## Cloudflare Pages notes

Recommended settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`

## Waitlist production setup

Required Cloudflare Pages environment variables:

- `BREVO_API_KEY=`
- `WAITLIST_FROM_EMAIL=`
- `WAITLIST_FROM_NAME=Impulsive`
- `WAITLIST_ADMIN_TOKEN=`
- `WAITLIST_IP_HASH_SECRET=`
- `WAITLIST_DB` binding in Cloudflare Pages

### Cloudflare D1

1. Create a D1 database for waitlist signups.
2. Apply the schema file at `db/schema.sql`.
3. Bind the database to the Pages project as `WAITLIST_DB`.
4. Deploy the Pages project after binding.

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
