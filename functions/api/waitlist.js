// Not used by the current Wrangler Worker deployment.
// The active deployed waitlist endpoint lives in src/worker.js.

const MAX_BODY_BYTES = 8192;
const MIN_FORM_SECONDS = 2;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_MESSAGE = "Thanks. You're on the waitlist.";
const DUPLICATE_MESSAGE = "You're already on the waitlist.";
const INVALID_EMAIL_MESSAGE = "Please enter a valid email address.";
const GENERIC_FAILURE_MESSAGE = "Sorry, we could not add you to the waitlist right now. Please try again later.";
const CONFIRMATION_SUBJECT = "You're on the Impulsive waitlist";
const CONFIRMATION_TEXT = `Thank you for joining the Impulsive waitlist.

Impulsive is being built as a privacy-first behaviour-change support tool for people who want help pausing, redirecting, and reflecting during high-risk urge moments.

We will let you know when early access, testing, or launch updates are ready.

Impulsive is not a medical device, therapy service, or crisis service. If you feel at immediate risk or need urgent support, please contact local emergency services or a qualified support provider.

If you ever want to leave the waitlist or have your email removed, just reply to this message or write to hello@useimpulsive.com.

Thank you,
Shanon DSilva
Founder, Impulsive`;
const CONFIRMATION_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You're on the Impulsive waitlist</title>
</head>
<body style="font-family: Arial, sans-serif; color: #2D2730; line-height: 1.6;">
  <main>
    <p>Thank you for joining the Impulsive waitlist.</p>
    <p>Impulsive is being built as a privacy-first behaviour-change support tool for people who want help pausing, redirecting, and reflecting during high-risk urge moments.</p>
    <p>We will let you know when early access, testing, or launch updates are ready.</p>
    <p>Impulsive is not a medical device, therapy service, or crisis service. If you feel at immediate risk or need urgent support, please contact local emergency services or a qualified support provider.</p>
    <p>If you ever want to leave the waitlist or have your email removed, just reply to this message or write to <a href="mailto:hello@useimpulsive.com">hello@useimpulsive.com</a>.</p>
    <p>Thank you,<br />Shanon DSilva<br />Founder, Impulsive</p>
  </main>
</body>
</html>`;

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });

const normaliseEmail = (value) => String(value || "").trim().toLowerCase();
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

async function saveWaitlistSignup(env, request, payload, email) {
  const db = env.WAITLIST_DB || env.DB;

  if (!db) {
    console.error("Waitlist signup failed", { reason: "missing_d1_binding" });
    throw new Error("Missing waitlist database binding.");
  }

  const ipHash = await hashIp(getClientIp(request), env.WAITLIST_IP_HASH_SECRET);
  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO waitlist_signups (
        email,
        source,
        page,
        referrer,
        user_agent,
        ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      email,
      cleanText(payload.source || "useimpulsive.com", 120),
      cleanText(payload.page, 500),
      cleanText(payload.referrer || request.headers.get("referer"), 500),
      cleanText(request.headers.get("user-agent"), 500),
      ipHash
    )
    .run();

  return {
    db,
    duplicate: result.meta?.changes === 0
  };
}

async function sendConfirmationEmail(env, email) {
  if (!env.BREVO_API_KEY) {
    return { sent: false, skipped: true };
  }

  const fromEmail = cleanText(env.WAITLIST_FROM_EMAIL || env.BREVO_SENDER_EMAIL, 254);
  if (!fromEmail) {
    console.error("Waitlist confirmation email skipped", { reason: "missing_sender_email" });
    return { sent: false, skipped: true };
  }

  const replyToEmail = cleanText(env.WAITLIST_ADMIN_EMAIL, 254);

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
      textContent: CONFIRMATION_TEXT,
      htmlContent: CONFIRMATION_HTML
    })
  });

  if (!response.ok) {
    throw new Error("Brevo email request failed.");
  }

  return { sent: true, skipped: false };
}

async function markConfirmationSent(db, email) {
  await db
    .prepare(
      `UPDATE waitlist_signups
       SET confirmation_sent_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = ?`
    )
    .bind(email)
    .run();
}

export async function onRequest(context) {
  const { request, env } = context;

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
  if (!email) {
    return json({ ok: false, message: INVALID_EMAIL_MESSAGE }, 400);
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: INVALID_EMAIL_MESSAGE }, 400);
  }

  try {
    const result = await saveWaitlistSignup(env, request, payload, email);
    try {
      const confirmation = await sendConfirmationEmail(env, email);
      if (confirmation.sent) {
        await markConfirmationSent(result.db, email);
      }
    } catch (error) {
      console.error("Waitlist confirmation email failed", { reason: "brevo_failed", name: error?.name || "Error" });
    }

    return json({ ok: true, message: result.duplicate ? DUPLICATE_MESSAGE : SUCCESS_MESSAGE });
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
