# Website Fix List — Impulsive — 2026-05-19

Audit for Innovator Founder visa advisor review readiness.

---

## Critical

1. **Privacy and Terms pages are placeholder stubs.**
   Both `/privacy.html` and `/terms.html` contain the text `"Placeholder. The full privacy policy / terms will be published before the product launches."` This text is visible and publicly indexed (`robots: index, follow`). An advisor or reviewer will open these links. Placeholder legal pages undermine credibility and may create compliance risk. Replace with real, properly structured policies before sending the site to any advisor.

2. **Waitlist confirmation email says "single developer" — inconsistent with Innovator Founder framing.**
   The live confirmation email sent to every waitlist signup (in `src/worker.js`) contains: *"Thank you for your support. It means a lot to me as a single developer."* If this is an Innovator Founder visa application, the advisor review may surface this email. It contradicts founder/company framing. Update the confirmation email copy to be professional and founder-appropriate.

3. **Mobile menu has no backdrop or close-on-outside-click.**
   The mobile menu (`menu-open` class) opens as a dropdown card over the page but there is no backdrop overlay and no handler to close it when the user taps outside. On small screens this means the only way to close the menu is to tap a nav link or the hamburger button again. This is a usability gap visible on any mobile device.

---

## Important

1. **Privacy page icon path is broken on legal pages.**
   `/privacy.html` and `/terms.html` reference the favicon at `/assets/images/impulsive-logo-vector.svg`. The file exists at `public/assets/images/impulsive-logo-vector.svg` so the path resolves correctly in production. However, the main site's `index.html` references favicons at `/assets/favicons/favicon-32x32.png` — the inconsistency means the legal pages show the SVG logo as favicon while the main site uses PNG favicons. Not broken but inconsistent.

2. **Waitlist on localhost does not persist or check for duplicates.**
   The dev server (`server.ts`) always returns `{ ok: true }` for any valid email. It does not check for duplicates. The production Cloudflare Worker (`src/worker.js`) does check duplicates and returns `"You're already on the waitlist."` — so the localhost experience does not match production. Submitting the same email twice on localhost shows two success messages. Not a bug in production, but confusing during local demos.

3. **`Cloud Sync` is referenced in an FAQ answer as a named opt-in feature that does not yet exist.**
   The FAQ says: *"The only time data leaves your device is if you opt into Cloud Sync — an explicit choice."* Cloud Sync is not mentioned elsewhere in the feature set, pricing tiers, or About section. To an advisor reading carefully this looks like a feature promise. Either name it consistently across the product section or soften the wording to something like *"any optional future backup"*.

4. **Urge-loop grid may be too compressed at 4 columns on small laptops (1024–1280px).**
   Cards are now set to 4 columns on desktop. At around 1100–1200px the cards become narrow (under ~220px each) and card copy may overflow or clip. The tablet breakpoint (≤1024px) correctly drops to 2 columns, so the issue is specifically the 1025–1280px range on laptop screens. Visually check this range.

5. **Dark mode toggle animation (stickman) runs on every toggle including fast repeat clicks.**
   The `busy` flag in `darkModeAnimation.ts` blocks re-entry during the animation, which is correct. However if the user clicks the toggle once, then switches back before the stickman finishes walking off-screen, the `busy` flag may stick. This is a minor edge case but worth testing on real interaction.

---

## Nice later

1. **No unsubscribe or data deletion path is mentioned anywhere.**
   The waitlist form collects email and submits to a D1 database. There is no mention on the site of how a user can remove themselves from the waitlist. The Terms page stub says "you can unsubscribe at any time" but gives no mechanism. Add a single line with a mailto link for removal requests.

2. **Footer `#focus` link navigates to the Focus Mode section, which is deep in the page.**
   Useful, but `Focus Mode` is not in the primary nav. First-time visitors clicking the footer link may find it surprising. Consider whether it should be in the primary nav or removed from the footer nav.

3. **`Nexus` AI routing claims should be labelled clearly as a future/locked feature.**
   The Paths section presents Nexus as a named feature. The progression section marks it as locked (level 7+). The description — *"Nexus uses trigger patterns, past success, urge ratings, and fallback history"* — could be read as describing working AI. Visually it is marked locked/future. Adding a small "Coming later" badge on the Paths card itself (not just in the progression section) would prevent advisor confusion.

4. **Console will show a Vite HMR WebSocket message in dev mode.** No action needed for production, but note that the localhost dev server does not suppress HMR logs on the client. This is normal but visible if the site is demo'd in DevTools open.

5. **Legal page `Back to Impulsive` link uses `/` (root) which will work in production but redirects to the SPA root correctly only because of `_redirects` / `wrangler.toml` SPA handling.** Worth verifying the back link works correctly in the Cloudflare Pages preview environment before showing the site to an advisor.

---

## Device / browser tested

- Source code audit: all files read locally (`src/App.tsx`, `src/index.css`, `src/worker.js`, `server.ts`, `public/privacy.html`, `public/terms.html`)
- Dev server: `http://localhost:3000` confirmed running (Vite HMR active)
- No automated browser screenshots taken this session — manual browser verification recommended

## Screenshots needed

- [ ] Mobile (375px) — hero, mobile menu open state, waitlist form
- [ ] Tablet (768px) — urge-loop 2-col grid, nav
- [ ] Laptop (1280px) — urge-loop 4-col grid, card widths
- [ ] Desktop (1440px) — hero, full page scroll
- [ ] Dark mode — full page, urge-loop section specifically
- [ ] Waitlist form — success state, error state (invalid email), submitting state

## Whether waitlist works

- **Localhost:** Works for valid email. Returns success for every valid submit (no DB, no duplicate check). Does not send confirmation email in dev.
- **Production (Cloudflare Worker):** Full logic implemented — validates email, checks for duplicates, sends confirmation email, writes to D1 database. Appears correctly implemented.

## Whether legal pages work

- Both `/privacy.html` and `/terms.html` are accessible and render with correct styling.
- **Both contain visible placeholder text.** This is the primary risk for advisor review. Must be replaced before sharing the URL.
- Footer links to both pages are correctly wired.

## Whether the website is safe to send to an advisor today

**Not yet — two blockers:**

1. The Privacy and Terms pages say "Placeholder" in plain text. Any advisor will click these links.
2. The waitlist confirmation email says "single developer" which may undermine the Innovator Founder framing.

**Once those two are fixed:** the site is well-structured, has no fake metrics, no medical cure claims, a clear medical disclaimer, a Samaritans crisis reference, and honest "early beta" and "behaviour-change support tool" framing throughout. It reads as credible and carefully built.
