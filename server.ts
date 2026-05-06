import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Waitlist API Route
  app.post("/api/waitlist", async (req, res) => {
    const { email, company, startedAt } = req.body;

    // Honeypot check
    if (company && String(company).trim()) {
      return res.status(400).json({ ok: false, message: "Request rejected." });
    }

    // Rate limiting / Bot check (simple)
    const startTime = Number(startedAt || "0");
    if (startTime > 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed < 2) {
        return res.status(429).json({ ok: false, message: "Please try again in a moment." });
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ ok: false, message: "Email address is required." });
    }

    // Log the signup (in a real app, you'd save to a DB or forward to a service)
    console.log(`New Waitlist Signup: ${email}`);

    // Mimic the forward logic
    // if (process.env.WAITLIST_FORWARD_URL) { ... }

    return res.json({ 
      ok: true, 
      message: "You are on the early beta request list.",
      forwarded: false 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
