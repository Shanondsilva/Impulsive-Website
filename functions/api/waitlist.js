const MAX_BODY_BYTES = 8192;
const MIN_FORM_SECONDS = 2;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });

const normaliseEmail = (value) => String(value || "").trim().toLowerCase();

async function parseRequest(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

async function forwardWaitlistSignup(env, email) {
  if (!env.WAITLIST_FORWARD_URL) {
    return {
      forwarded: false,
      message: "Waitlist request validated. Configure WAITLIST_FORWARD_URL in Cloudflare Pages to store signups."
    };
  }

  const body = new FormData();
  body.set("email", email);
  body.set("source", "useimpulsive.com");

  if (env.WAITLIST_ACCESS_KEY) {
    body.set("access_key", env.WAITLIST_ACCESS_KEY);
  }

  const response = await fetch(env.WAITLIST_FORWARD_URL, {
    method: "POST",
    body
  });

  if (!response.ok) {
    throw new Error("The waitlist provider did not accept the signup.");
  }

  return {
    forwarded: true,
    message: "You are on the early beta request list."
  };
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
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
    return json({ ok: false, message: "Email address is required." }, 400);
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  try {
    const result = await forwardWaitlistSignup(env, email);
    return json({ ok: true, message: result.message, forwarded: result.forwarded });
  } catch {
    return json({ ok: false, message: "Unable to save the signup right now." }, 502);
  }
}
