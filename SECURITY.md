# Security

This project is a Cloudflare Worker with Static Assets, deployed from `wrangler.toml`. Backend logic for the waitlist endpoint lives in `src/worker.js`. The site is rendered from a Vite + React + TypeScript build in `src/`, with static assets in `public/`.

## Secrets

Do not place secrets, API keys, or private endpoints in frontend code. Secrets belong only in Cloudflare Worker environment variables and secret bindings.

Worker secrets and bindings used:

- `WAITLIST_DB` — D1 binding for the waitlist database
- `WAITLIST_IP_HASH_SECRET` — secret used to one-way hash submitter IPs before storage
- `BREVO_API_KEY` — optional, for transactional confirmation email
- `WAITLIST_FROM_EMAIL`, `WAITLIST_FROM_NAME`, `WAITLIST_ADMIN_EMAIL` — optional sender configuration
- `WAITLIST_ADMIN_TOKEN` — optional, for admin waitlist export

If a provider key is ever exposed, rotate it in the provider dashboard and update the Worker variable.

## Security headers

Security headers are applied directly inside `src/worker.js` (`applySecurityHeaders`), because Cloudflare Workers Static Assets does not automatically apply `public/_headers`. The `_headers` file is kept as a Pages fallback only.

Headers applied to all asset responses, the waitlist JSON responses, and the `/robots.txt` response:

- `Content-Security-Policy` (allows the inline theme script, inline JSON-LD, and React inline styles; allow-lists Google Fonts)
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation, payment, USB, interest-cohort all denied)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

## Waitlist backend

The active waitlist endpoint is `/api/waitlist`, handled inside `src/worker.js`. It includes:

- POST-only method enforcement
- server-side email validation
- JSON responses with security headers
- honeypot spam check
- minimum form-fill time (anti-bot)
- body size limit
- request canonicalisation to `https://useimpulsive.com`
- IP hashing before storage using `WAITLIST_IP_HASH_SECRET`

`functions/api/waitlist.js` is kept for reference only — it is not deployed by the current Worker configuration.

## Remaining recommendations

- Before broad public traffic, add Cloudflare Turnstile on the waitlist form or a Cloudflare rate-limiting / WAF rule on `/api/waitlist`.
- Enable Cloudflare WAF and Bot Fight Mode for the zone where appropriate.
- Keep third-party dependencies minimal. Review the CSP before adding any third-party script.
- Do not add analytics, tracking pixels, or third-party scripts without reviewing CSP and privacy impact.
- Rotate provider keys if exposed.
- Treat form submissions as untrusted input in any downstream system.

This hardening reduces common risk. It does not make the website impossible to attack.
