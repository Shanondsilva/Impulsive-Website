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

For the waitlist form to store or forward signups, add these environment variables in Cloudflare Pages if you have a forwarding endpoint:

- `WAITLIST_FORWARD_URL`
- `WAITLIST_ACCESS_KEY` if your endpoint needs one

Without `WAITLIST_FORWARD_URL`, the function still validates requests but returns a setup message instead of forwarding the signup.
