const EXPORT_FIELDS = [
  "id",
  "email",
  "source",
  "page",
  "status",
  "created_at",
  "confirmation_sent_at"
];

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });

const getBearerToken = (request) => {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const toCsv = (rows) => {
  const header = EXPORT_FIELDS.join(",");
  const body = rows.map((row) => EXPORT_FIELDS.map((field) => escapeCsvValue(row[field])).join(","));
  return [header, ...body].join("\n");
};

export async function onRequest(context) {
  const { request, env } = context;
  const adminToken = env.WAITLIST_ADMIN_TOKEN;
  const providedToken = getBearerToken(request);

  if (!adminToken || !providedToken || providedToken !== adminToken) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }

  const db = env.WAITLIST_DB || env.DB;
  if (!db) {
    console.error("Waitlist export failed", { reason: "missing_d1_binding" });
    return json({ ok: false, message: "Export unavailable." }, 503);
  }

  try {
    const result = await db
      .prepare(
        `SELECT id, email, source, page, status, created_at, confirmation_sent_at
         FROM waitlist_signups
         ORDER BY created_at DESC`
      )
      .all();

    return new Response(toCsv(result.results || []), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Disposition": "attachment; filename=\"waitlist-signups.csv\""
      }
    });
  } catch (error) {
    console.error("Waitlist export failed", { reason: "query_failed", name: error?.name || "Error" });
    return json({ ok: false, message: "Export unavailable." }, 500);
  }
}
