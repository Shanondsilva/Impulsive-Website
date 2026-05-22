const MAX_BODY_BYTES = 8192;
const MIN_FORM_SECONDS = 2;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_MESSAGE = "Thanks. You're on the waitlist.";
const SUCCESS_MESSAGE_EMAIL_SENT = "Thanks. You're on the waitlist. Please check your email for confirmation.";
const INVALID_EMAIL_MESSAGE = "Please enter a valid email address.";
const GENERIC_FAILURE_MESSAGE = "Sorry, we could not add you to the waitlist right now. Please try again later.";
const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://useimpulsive.com/sitemap.xml
`;
const CONFIRMATION_SUBJECT = "You're on the Impulsive waitlist";
const buildConfirmationText = (firstName) => {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  return `${greeting}

Thanks for joining the Impulsive waitlist. You're on the list.

Impulsive is a privacy-first behaviour change app designed to help people navigate difficult habit loops and high-risk moments.

As a solo developer, your early support genuinely means a lot. Thank you for being early.

Shanon
Founder, Impulsive

If you ever want to leave the waitlist, reply to this email or contact hello@useimpulsive.com.`;
};
const buildConfirmationHtml = (firstName) => {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Impulsive waitlist</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F3EE;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F3EE;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#2D2730;">Impulsive</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border-radius:12px;padding:48px;border:1px solid #EDE8E0;">
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#2D2730;">${greeting}</p>
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#2D2730;">Thanks for joining the Impulsive waitlist. You're on the list.</p>
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#2D2730;">Impulsive is a privacy-first behaviour change app designed to help people navigate difficult habit loops and high-risk moments.</p>
              <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#2D2730;">As a solo developer, your early support genuinely means a lot. Thank you for being early.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:32px;height:2px;background-color:#93E9BE;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#2D2730;letter-spacing:0.02em;">Shanon</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#7A6E7E;">Founder, Impulsive</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9E96A2;text-align:center;">You're receiving this because you joined the Impulsive waitlist at useimpulsive.com.<br />To be removed, reply to this email or write to hello@useimpulsive.com.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// Cloudflare Workers Static Assets does not apply public/_headers automatically.
// Security headers are attached here so they cover /, /privacy.html, /terms.html,
// asset responses, and waitlist JSON responses.
//
// CSP notes:
// - 'unsafe-inline' for script-src is required because index.html contains an inline
//   theme-detection script and two inline JSON-LD blocks.
// - 'unsafe-inline' for style-src is required because the React app uses inline style
//   attributes (style={{ ... }}) for per-card CSS variables, and the legal pages also
//   use a small amount of inline styling.
// - Google Fonts is allow-listed for style-src and font-src.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join("; ")
};

function applySecurityHeaders(headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
}

const json = (payload, status = 200) => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(payload), { status, headers });
};

const normaliseEmail = (value) => String(value || "").trim().toLowerCase();
const normalizeFirstName = (value) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 60) : null;
};
const cleanText = (value, maxLength = 500) => {
  const text = String(value || "").trim();
  return text ? text.slice(0, maxLength) : null;
};

const isMissingWaitlistStorage = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("no such table") ||
    message.includes("waitlist_signups") ||
    message.includes("missing waitlist database binding")
  );
};

async function parseRequest(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const rawBody = await request.text();
    return rawBody.trim() ? JSON.parse(rawBody) : {};
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

const getClientIp = (request) => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor ? forwardedFor.split(",")[0].trim() : "";
};

const hashIp = async (ip, secret) => {
  if (!ip || !secret) return null;

  const input = new TextEncoder().encode(`${secret}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const withAssetCacheHeaders = (response) => {
  const contentType = response.headers.get("content-type") || "";
  const headers = new Headers(response.headers);

  applySecurityHeaders(headers);

  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "no-cache, max-age=0, must-revalidate");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

async function saveWaitlistSignup(env, request, payload, email, firstName) {
  if (!env.WAITLIST_DB) {
    console.error("Waitlist signup failed", { reason: "missing_d1_binding" });
    throw new Error("Missing waitlist database binding.");
  }

  const ipHash = await hashIp(getClientIp(request), env.WAITLIST_IP_HASH_SECRET);
  const result = await env.WAITLIST_DB
    .prepare(
      `INSERT OR IGNORE INTO waitlist_signups (
        email,
        source,
        page,
        referrer,
        user_agent,
        ip_hash,
        first_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      email,
      cleanText(payload.source || "useimpulsive.com", 120),
      cleanText(payload.page, 500),
      cleanText(payload.referrer || request.headers.get("referer"), 500),
      cleanText(request.headers.get("user-agent"), 500),
      ipHash,
      firstName
    )
    .run();

  const duplicate = result.meta?.changes === 0;

  if (duplicate && firstName) {
    await env.WAITLIST_DB
      .prepare(
        `UPDATE waitlist_signups
         SET first_name = ?, updated_at = CURRENT_TIMESTAMP
         WHERE email = ? AND first_name IS NULL`
      )
      .bind(firstName, email)
      .run();
  }

  return { duplicate };
}

async function sendConfirmationEmail(env, email, firstName) {
  if (!env.BREVO_API_KEY) {
    return { sent: false, skipped: true };
  }

  const fromEmail = cleanText(env.WAITLIST_FROM_EMAIL || env.BREVO_SENDER_EMAIL, 254);
  if (!fromEmail) {
    console.error("Waitlist confirmation email skipped", { reason: "missing_sender_email" });
    return { sent: false, skipped: true };
  }

  const replyToEmail = cleanText(env.WAITLIST_REPLY_TO_EMAIL || env.WAITLIST_ADMIN_EMAIL, 254);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        email: fromEmail,
        name: cleanText(env.WAITLIST_FROM_NAME || env.BREVO_SENDER_NAME, 120) || "Impulsive"
      },
      to: [{ email }],
      ...(replyToEmail ? { replyTo: { email: replyToEmail } } : {}),
      subject: CONFIRMATION_SUBJECT,
      textContent: buildConfirmationText(firstName),
      htmlContent: buildConfirmationHtml(firstName)
    })
  });

  if (!response.ok) {
    throw new Error("Brevo email request failed.");
  }

  return { sent: true, skipped: false };
}

async function markConfirmationSent(env, email) {
  await env.WAITLIST_DB
    .prepare(
      `UPDATE waitlist_signups
       SET confirmation_sent_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = ?`
    )
    .bind(email)
    .run();

  // Clear any previous send error; column added in migration v4 — safe to ignore if absent
  try {
    await env.WAITLIST_DB
      .prepare(`UPDATE waitlist_signups SET confirmation_error = NULL WHERE email = ?`)
      .bind(email)
      .run();
  } catch {
    // confirmation_error column not yet migrated — no action needed
  }
}

async function safeMarkConfirmationError(env, email, errorText) {
  try {
    await env.WAITLIST_DB
      .prepare(
        `UPDATE waitlist_signups
         SET confirmation_error = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE email = ?`
      )
      .bind(String(errorText || "failed").slice(0, 200), email)
      .run();
  } catch {
    // confirmation_error column not yet migrated — no action needed
  }
}

// TODO: Before broad public traffic, add Cloudflare Turnstile verification on the
// waitlist form or attach a Cloudflare rate-limiting / WAF rule to this endpoint.
// Today the endpoint relies on: HTTPS-only canonical host, body-size cap,
// honeypot field, minimum form-fill time, and IP-hash storage.
async function handleWaitlist(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Request is too large." }, 413);
  }

  let payload;
  try {
    payload = await parseRequest(request);
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  if (String(payload.company || "").trim()) {
    return json({ ok: false, message: "Request rejected." }, 400);
  }

  const startedAt = Number(payload.startedAt || "0");
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    if (elapsedSeconds >= 0 && elapsedSeconds < MIN_FORM_SECONDS) {
      return json({ ok: false, message: "Please try again in a moment." }, 429);
    }
  }

  const email = normaliseEmail(payload.email);
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: INVALID_EMAIL_MESSAGE }, 400);
  }

  const firstName = normalizeFirstName(payload.firstName);

  try {
    const result = await saveWaitlistSignup(env, request, payload, email, firstName);

    let shouldSendEmail = !result.duplicate;
    if (result.duplicate) {
      // Only resend if no confirmation has been recorded yet
      const row = await env.WAITLIST_DB
        .prepare("SELECT confirmation_sent_at FROM waitlist_signups WHERE email = ?")
        .bind(email)
        .first();
      shouldSendEmail = !row?.confirmation_sent_at;
    }

    let emailSent = false;
    if (shouldSendEmail) {
      try {
        const confirmation = await sendConfirmationEmail(env, email, firstName);
        if (confirmation.sent) {
          await markConfirmationSent(env, email);
          emailSent = true;
        }
      } catch (error) {
        console.error("Waitlist confirmation email failed", {
          reason: "brevo_failed",
          name: error?.name || "Error"
        });
        await safeMarkConfirmationError(env, email, error?.message || "send_failed");
      }
    }

    return json({ ok: true, message: emailSent ? SUCCESS_MESSAGE_EMAIL_SENT : SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Waitlist signup failed", {
      reason: isMissingWaitlistStorage(error) ? "storage_not_configured" : "save_failed",
      name: error?.name || "Error",
      message: error?.message || "Unknown waitlist storage error"
    });
    if (isMissingWaitlistStorage(error)) {
      return json({ ok: false, message: "Waitlist storage is not configured. Please try again later." }, 503);
    }
    return json({ ok: false, message: GENERIC_FAILURE_MESSAGE }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonicalHost = "useimpulsive.com";
    const isLocalHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";

    if (!isLocalHost && (url.protocol !== "https:" || url.hostname !== canonicalHost)) {
      url.protocol = "https:";
      url.hostname = canonicalHost;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/robots.txt") {
      const headers = new Headers({
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      });
      applySecurityHeaders(headers);
      return new Response(ROBOTS_TXT, { headers });
    }

    if (url.pathname === "/api/waitlist" || url.pathname === "/api/waitlist/") {
  return handleWaitlist(request, env);
}

    return withAssetCacheHeaders(await env.ASSETS.fetch(request));
  }
};
