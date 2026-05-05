# Security

This project is a static-first Cloudflare Pages site with a small Pages Function for waitlist submissions.

## Secrets

Do not place secrets, provider keys, API tokens, or private endpoints in frontend files.

Frontend files include:

- `frontend/index.html`
- `frontend/styles.css`
- `frontend/script.js`
- anything under `frontend/assets/`

Waitlist provider configuration must be stored as Cloudflare Pages environment variables:

- `WAITLIST_FORWARD_URL`
- `WAITLIST_ACCESS_KEY` if required by the provider

If a provider key is ever exposed, rotate it in the provider dashboard and update the Cloudflare environment variable.

## Hardening Included

Security headers are configured in:

```text
frontend/_headers
```

The current headers include:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

The waitlist backend logic is in:

```text
functions/api/waitlist.js
```

It includes:

- POST-only method handling
- server-side email validation
- JSON responses
- honeypot spam check
- small payload size limit
- basic too-fast submission check
- provider forwarding through environment variables only

## Remaining Recommendations

- Enable Cloudflare WAF if available for the zone.
- Enable Cloudflare Bot Fight Mode or equivalent bot protections if appropriate.
- Keep dependencies at zero or minimal.
- Review the Content Security Policy after adding any third-party service.
- Do not add analytics, tracking pixels, or third-party scripts without reviewing CSP and privacy impact.
- Rotate provider keys if they are exposed.
- Treat form submissions as untrusted input in any downstream system.

This hardening reduces common risk. It does not make the website impossible to attack.
