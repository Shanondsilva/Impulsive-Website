# Impulsive Website

Official static-first landing page for Impulsive, deployed with Cloudflare Pages.

## Project Structure

```text
impulsive-website/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── _headers
│   ├── _redirects
│   └── assets/
│       ├── images/
│       │   ├── impulsive-logo.png
│       │   └── spiritual-icon.png
│       ├── icons/
│       └── favicons/
├── functions/
│   └── api/
│       └── waitlist.js
├── README.md
└── SECURITY.md
```

## Local Preview

The frontend is plain static HTML, CSS, and vanilla JavaScript.

Open `frontend/index.html` directly in a browser for a quick static preview.

For a local HTTP preview from the repo root:

```powershell
cd D:\Impulsive\Impulsive-Website\frontend
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

The waitlist form posts to `/api/waitlist`, which is handled by Cloudflare Pages Functions in production. Direct file previews will not run the Function.

## Cloudflare Pages Deployment

Use these settings:

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `frontend`
- Functions folder: `functions`
- Custom domain: `useimpulsive.com`

Cloudflare Pages will serve the static files from `frontend/` and route `/api/waitlist` to `functions/api/waitlist.js`.

## Environment Variables

Set these in Cloudflare Pages project settings:

- `WAITLIST_FORWARD_URL`: provider endpoint used by the waitlist Function.
- `WAITLIST_ACCESS_KEY`: optional provider key if your waitlist provider requires one.

No provider URLs or access keys should be placed in `frontend/index.html`, `frontend/script.js`, or any other frontend file.

## Waitlist Provider

The frontend form submits to:

```text
/api/waitlist
```

The backend Function validates the email and forwards it only if `WAITLIST_FORWARD_URL` is configured.

To change provider later, update only:

```text
functions/api/waitlist.js
```

and the related Cloudflare environment variables.

## Updating Images

Website images live in:

```text
frontend/assets/images/
```

Current images:

- `impulsive-logo.png`: official Impulsive symbol used in the navigation and footer.
- `spiritual-icon.png`: Spiritual Path icon used in path cards and the phone mockup.

Keep filenames stable unless you also update the references in `frontend/index.html`.
