import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Waitlist API Route
  app.post("/api/waitlist", async (req, res) => {
    const { email, company, startedAt } = req.body;
    const normalisedEmail = String(email || "").trim().toLowerCase();

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
    if (!normalisedEmail || normalisedEmail.length > 254 || !emailPattern.test(normalisedEmail)) {
      return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
    }

    // Log the signup (in a real app, you'd save to a DB or forward to a service)
    console.log(`New Waitlist Signup: ${normalisedEmail}`);

    // Mimic the forward logic
    // if (process.env.WAITLIST_FORWARD_URL) { ... }

    return res.json({ 
      ok: true, 
      message: "Thanks. You're on the waitlist.",
      forwarded: false 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.get("/how-impulsive-works.html", (req, res) => {
      res.redirect(301, "/how-impulsive-works");
    });
    app.get(["/how-impulsive-works", "/how-impulsive-works/"], async (req, res, next) => {
      try {
        const templatePath = path.join(process.cwd(), "how-impulsive-works", "index.html");
        const template = await fs.readFile(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        next(error);
      }
    });
    app.get("/private-behaviour-change-support.html", (req, res) => {
      res.redirect(301, "/private-behaviour-change-support");
    });
    app.get(["/private-behaviour-change-support", "/private-behaviour-change-support/"], async (req, res, next) => {
      try {
        const templatePath = path.join(process.cwd(), "private-behaviour-change-support", "index.html");
        const template = await fs.readFile(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        next(error);
      }
    });
    app.get("/focus-mode.html", (req, res) => {
      res.redirect(301, "/focus-mode");
    });
    app.get(["/focus-mode", "/focus-mode/"], async (req, res, next) => {
      try {
        const templatePath = path.join(process.cwd(), "focus-mode", "index.html");
        const template = await fs.readFile(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        next(error);
      }
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        const templatePath = path.join(process.cwd(), "index.html");
        const template = await fs.readFile(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        next(error);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.get("/how-impulsive-works.html", (req, res) => {
      res.redirect(301, "/how-impulsive-works");
    });
    app.get(["/how-impulsive-works", "/how-impulsive-works/"], (req, res) => {
      res.sendFile(path.join(distPath, "how-impulsive-works", "index.html"));
    });
    app.get("/private-behaviour-change-support.html", (req, res) => {
      res.redirect(301, "/private-behaviour-change-support");
    });
    app.get(["/private-behaviour-change-support", "/private-behaviour-change-support/"], (req, res) => {
      res.sendFile(path.join(distPath, "private-behaviour-change-support", "index.html"));
    });
    app.get("/focus-mode.html", (req, res) => {
      res.redirect(301, "/focus-mode");
    });
    app.get(["/focus-mode", "/focus-mode/"], (req, res) => {
      res.sendFile(path.join(distPath, "focus-mode", "index.html"));
    });
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
