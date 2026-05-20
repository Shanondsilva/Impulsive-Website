import React, { useEffect, useState, useRef, type KeyboardEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ReflexOverrideGame } from './components/ReflexOverrideGame';
import { useDarkMode } from './hooks/useDarkMode';

type RecoveryGame = {
  name: string;
  purpose: string;
  length: string;
  record: string;
  safeExit: string;
  accent: string;
};

const recoveryGames: RecoveryGame[] = [
  {
    name: "Reflex Override",
    purpose: "A fast reaction game for peak-risk moments. Tap, swipe, and avoid decoys to pull the brain out of autopilot.",
    length: "45-90 seconds.",
    record: "Best reaction time, longest combo, personal best, urge drop.",
    safeExit: "The strongest score requires finishing the round and choosing Walk Away.",
    accent: "var(--focus-color)",
  },
  {
    name: "Fluid Regulation Simulator",
    purpose: "A calming touch game where movement creates flowing light, particles, or liquid. The goal is to slow down and stabilise.",
    length: "60-180 seconds.",
    record: "Best flow score, calmest session, longest smooth flow, biggest urge drop.",
    safeExit: "The highest reward comes from reaching a calm finish and leaving.",
    accent: "var(--body-color)",
  },
  {
    name: "Urge Survival Mode",
    purpose: "The urge becomes visible as a short challenge. Defend, survive, reduce the urge bar, then choose a safe exit.",
    length: "60-120 seconds.",
    record: "Best survival score, fastest urge defeat, strongest recovery streak.",
    safeExit: "The game ends with a recovery choice, not endless fighting.",
    accent: "var(--mind-color)",
  },
  {
    name: "Precision Focus Challenge",
    purpose: "Trace, balance, and align with control. It shifts the mind from craving into careful attention.",
    length: "45-120 seconds.",
    record: "Best precision score, cleanest trace, longest steady hold, fewest errors.",
    safeExit: "Recovery language must stay calm. No harsh failure messages.",
    accent: "var(--soul-color)",
  },
  {
    name: "Dopamine Redirect Runner",
    purpose: "A short, high-energy runner for users who need intensity, not calm. It must be time-boxed, not endless.",
    length: "60-150 seconds.",
    record: "Furthest distance, best combo, highest clean run, best safe exit after runner.",
    safeExit: "No endless runner mode inside recovery flow.",
    accent: "var(--focus-color)",
  },
  {
    name: "Breath-Control Combat",
    purpose: "A breathing rhythm game where steady breathing powers a shield or aura. Touch rhythm first, microphone later if needed.",
    length: "90-180 seconds.",
    record: "Best calm combat score, longest stable rhythm, shield uptime, biggest urge drop.",
    safeExit: "Reward steadiness, not frantic tapping.",
    accent: "var(--brand-glow)",
  },
  {
    name: "Pattern Break Puzzle",
    purpose: "Quick pattern tasks that break repetitive craving loops and force the brain into recognition and problem solving.",
    length: "45-120 seconds.",
    record: "Best puzzle score, fastest correct streak, highest level reached, fewest mistakes.",
    safeExit: "Keep it short and emotionally neutral.",
    accent: "var(--mind-color)",
  },
  {
    name: "Rage Discharge Mode",
    purpose: "A safe abstract outlet for stress, shame, rejection, or anger. The screen moves from chaos to calm.",
    length: "30-90 seconds.",
    record: "Best discharge score, fastest clear, biggest urge drop, best safe exit after discharge.",
    safeExit: "Do not encourage aggression. Message should be: energy discharged, control restored.",
    accent: "var(--focus-color)",
  },
  {
    name: "Identity Progression",
    purpose: "The meta-system that turns safe exits, urge drops, and personal records into proof that the user is changing.",
    length: "Always-on layer after games and on the dashboard.",
    record: "Control Points, Path XP, Identity Level, Recovery Proof, Best Week, Best Day.",
    safeExit: "Never fake progress. Only real safe exits, urge drops, and completed sessions count.",
    accent: "var(--brand-glow)",
  },
];

const SECTION_NAV = [
  { id: 'top',           label: 'Home' },
  { id: 'urge-loop',     label: 'When it starts' },
  { id: 'first-week',    label: 'First 7 days' },
  { id: 'paths',         label: 'Paths' },
  { id: 'games',         label: 'Games' },
  { id: 'progression',   label: 'Progression' },
  { id: 'invite-unlock', label: 'Invite & Unlock' },
  { id: 'tiers',         label: 'Tiers' },
  { id: 'how-it-works',  label: 'How it works' },
  { id: 'focus',         label: 'Focus Mode' },
  { id: 'principles',    label: 'Principles' },
  { id: 'about',         label: 'About' },
  { id: 'waitlist',      label: 'Waitlist' },
] as const;


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('top');
  const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState(Date.now().toString());
  const formRef = useRef<HTMLFormElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useDarkMode();
  const selectedGame = recoveryGames[selectedGameIndex];

  const togglePathFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handlePathKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePathFlip(id);
    }
  };

  useEffect(() => {
    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Intersection Observer for reveals
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((item) => observer.observe(item));

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ids = SECTION_NAV.map(s => s.id);
    const updateActive = () => {
      const threshold = window.innerHeight * 0.4;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveSectionId(current);
    };
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = String(formData.get("email") || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });

      const rawBody = await response.text();
      let result: { ok?: boolean; message?: string } = {};

      if (rawBody.trim()) {
        try {
          result = JSON.parse(rawBody);
        } catch {
          throw new Error("Sorry, the server returned an unexpected response. Please try again in a moment.");
        }
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Sorry, we could not add you to the waitlist right now. Please try again later.");
      }

      formRef.current.reset();
      setFormStatus({ message: result.message || "Thanks. You're on the waitlist.", type: "success" });
    } catch (error: any) {
      setFormStatus({ message: error.message || "Unable to join the waitlist right now. Please try again later.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={menuOpen ? "menu-open" : ""}>
      <a className="skip-link" href="#main">Skip to content</a>

      <button
        type="button"
        className="nav-backdrop"
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
        hidden={!menuOpen}
      />

      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} data-header>
        <nav className="nav" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Impulsive home">
            <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="Impulsive logo" />
            <span>Impulsive</span>
          </a>
          <div className="nav-right">
            <div className="nav-menu" id="primary-menu">
              <div className="nav-links" aria-label="Site links">
                <a href="#how-it-works" onClick={closeMenu}>How it works</a>
                <a href="#paths" onClick={closeMenu}>Paths</a>
                <a href="#principles" onClick={closeMenu}>Principles</a>
                <a href="#about" onClick={closeMenu}>About</a>
                <a href="#waitlist" onClick={closeMenu}>Waitlist</a>
              </div>
              <a className="button button-small" href="#waitlist" onClick={closeMenu}>Join Waitlist</a>
            </div>
            <button
              ref={themeToggleRef}
              className="theme-toggle"
              type="button"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "dark"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => toggle(themeToggleRef.current)}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === "dark" ? <Sun /> : <Moon />}
              </span>
              <span className="theme-toggle-label">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              onClick={handleMenuToggle}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      <main id="main">
        <section className="hero section" id="top" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac"></span>
            <span className="shape shape-blue"></span>
            <span className="shape shape-lemon"></span>
            <span className="shape shape-coral"></span>
          </div>

          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">Privacy-first behaviour change</p>
              <h1 id="hero-title">Built for habits that do not break with willpower alone.</h1>
              <p className="hero-subhead">Impulsive helps you slow the loop before it becomes automatic. It notices risky moments, gives one clear recovery action, and saves what helped so your pattern can get weaker over time.</p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="button" href="#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="#how-it-works">See how it works</a>
              </div>
              <ul className="hero-trust-chips" aria-label="Impulsive product notes">
                <li>Private by design</li>
                <li>No paywall in a trigger</li>
                <li>Built in London</li>
                <li>Early beta</li>
              </ul>
            </div>

            <div className="hero-visual reveal" aria-label="Impulsive app preview">
              <div className="orbit-card card-calm">One clear recovery action</div>
              <div className="orbit-card card-trigger">No paywall in a trigger</div>
              <p className="mockup-disclaimer" aria-label="Mockup disclaimer">Prototype preview with example data.</p>
              <div className="phone">
                <div className="phone-speaker" aria-hidden="true"></div>
                <div className="app-screen">
                  <div className="app-topbar">
                    <span>Impulsive</span>
                    <span className="privacy-pill">Private</span>
                  </div>

                  <section className="today-plan" aria-label="Today's plan preview">
                    <p>Risky moment detected</p>
                    <h2>Recommended: 90-second Mind reset</h2>
                    <div className="plan-row">
                      <span>Trigger window</span>
                      <strong>7:45-9:15pm</strong>
                    </div>
                    <div className="scorecard-proof" aria-label="Recovery action saved">
                      <span>
                        <small>Urge before</small>
                        <strong>8/10</strong>
                      </span>
                      <span>
                        <small>Urge after</small>
                        <strong>5/10</strong>
                      </span>
                    </div>
                  </section>

                  <section className="intervention">
                    <div>
                      <span className="mini-label">One clear recovery action</span>
                      <strong>90-second Mind reset</strong>
                    </div>
                    <button type="button" aria-label="Calm intervention preview" tabIndex={-1}>Done</button>
                  </section>

                  <section className="progress">
                    <div className="progress-copy">
                      <span>Saved progress</span>
                      <strong>Level 3 progress</strong>
                    </div>
                    <div className="progress-meta">Mind Core active</div>
                    <div className="progress-track" aria-hidden="true"><span></span></div>
                  </section>

                  <section className="mockup-scorecard" aria-label="Private recovery scorecard preview">
                    <div className="scorecard-row">
                      <span>Today</span>
                      <strong>2 risky moments interrupted</strong>
                    </div>
                    <div className="scorecard-row">
                      <span>Safe exits</span>
                      <strong>1</strong>
                    </div>
                    <div className="scorecard-row">
                      <span>Best reset</span>
                      <strong>90 seconds</strong>
                    </div>
                  </section>

                  <aside className="focus-note">
                    <span>Safe exit saved</span>
                    <strong>What helped is stored privately for next time.</strong>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>

                <section className="section urge-loop-section" id="urge-loop" aria-labelledby="urge-loop-title">
          <div className="container">
            <div className="section-heading urge-loop-heading reveal">
              <p className="eyebrow">The real app loop</p>
              <h2 id="urge-loop-title">When the urge starts</h2>
              <p>Impulsive is not just motivation after the damage is done. It is built to step in before the loop becomes automatic.</p>
            </div>

            <div className="urge-loop-grid" aria-label="What happens when Impulsive steps in">
              <article className="urge-loop-card reveal" style={{ "--loop-color": "#D0C3F1" } as React.CSSProperties}>
                <span className="loop-marker" aria-hidden="true">01</span>
                <div>
                  <h3>Impulsive notices the risky moment</h3>
                  <p>A trigger window, monitored app, risky browser path, or user-reported urge starts the recovery flow.</p>
                </div>
              </article>

              <article className="urge-loop-card reveal" style={{ "--loop-color": "#BDE0FE" } as React.CSSProperties}>
                <span className="loop-marker" aria-hidden="true">02</span>
                <div>
                  <h3>You get one clear action</h3>
                  <p>Impulsive recommends one primary action first: Mind reset, Body movement, Soul reflection, Focus recovery, or a recovery game.</p>
                </div>
              </article>

              <article className="urge-loop-card reveal" style={{ "--loop-color": "#FEF1AB" } as React.CSSProperties}>
                <span className="loop-marker" aria-hidden="true">03</span>
                <div>
                  <h3>The app saves what worked</h3>
                  <p>Urge before, urge after, action completed, safe exit, and recovery notes are stored privately.</p>
                </div>
              </article>

              <article className="urge-loop-card reveal" style={{ "--loop-color": "#93E9BE" } as React.CSSProperties}>
                <span className="loop-marker" aria-hidden="true">04</span>
                <div>
                  <h3>The loop gets weaker over time</h3>
                  <p>Progress unlocks stronger tools and the scheduled habit window can slowly reduce with real completion evidence.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section first-week-section" id="first-week" aria-labelledby="first-week-title">
          <div className="container first-week-grid">
            <div className="first-week-intro reveal">
              <p className="eyebrow">First 7 days</p>
              <h2 id="first-week-title">Your first 7 days with Impulsive</h2>
              <p>Impulsive does not throw every feature at you on day one. It starts with one clear recovery path, learns what helps, then unlocks stronger support when your pattern becomes clearer.</p>
            </div>

            <ol className="first-week-timeline" aria-label="Impulsive first week onboarding steps">
              <li className="first-week-step reveal" style={{ "--week-color": "var(--mind-color)" } as React.CSSProperties}>
                <span className="week-dot" aria-hidden="true">1</span>
                <div>
                  <p className="week-label">Day 1</p>
                  <h3>Set your pattern</h3>
                  <p>Choose what you want to reduce, when triggers usually happen, and why it matters to you.</p>
                </div>
              </li>

              <li className="first-week-step reveal" style={{ "--week-color": "var(--mind-color)" } as React.CSSProperties}>
                <span className="week-dot" aria-hidden="true">2</span>
                <div>
                  <p className="week-label">Days 1-2</p>
                  <h3>Start with Mind Core</h3>
                  <p>Impulsive begins with the simplest low-friction reset: pause, name the urge, and choose one better action.</p>
                </div>
              </li>

              <li className="first-week-step reveal" style={{ "--week-color": "var(--body-color)" } as React.CSSProperties}>
                <span className="week-dot" aria-hidden="true">3</span>
                <div>
                  <p className="week-label">Days 3-4</p>
                  <h3>Build your first recovery proof</h3>
                  <p>Basic tapering, short recovery actions, and game rotation help you see what actually interrupts the loop.</p>
                </div>
              </li>

              <li className="first-week-step reveal" style={{ "--week-color": "var(--soul-color)" } as React.CSSProperties}>
                <span className="week-dot" aria-hidden="true">4</span>
                <div>
                  <p className="week-label">Day 5</p>
                  <h3>Preview the Path Map</h3>
                  <p>Body and Soul become visible as future support options, but they are not forced on you.</p>
                </div>
              </li>

              <li className="first-week-step reveal" style={{ "--week-color": "var(--focus-color)" } as React.CSSProperties}>
                <span className="week-dot" aria-hidden="true">5</span>
                <div>
                  <p className="week-label">Day 6+</p>
                  <h3>Choose your next strength level</h3>
                  <p>Stay free, explore Plus, or use Invite & Unlock when you are in a calm progress moment.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="section paths-section" id="paths" aria-labelledby="paths-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Guided path map</p>
              <h2 id="paths-title">Four ways Impulsive supports the recovery loop</h2>
              <p>Impulsive starts with Mind first, then unlocks stronger support through movement, reflection, focus tools, and adaptive routing.</p>
            </div>
            <div className="path-cards">
              <div
                className={`path-card-wrapper${flippedCards.has("mind") ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has("mind")}
                aria-label="Mind path. Click to see how it works."
                onClick={() => togglePathFlip("mind")}
                onKeyDown={(event) => handlePathKeyDown(event, "mind")}
              >
                <article className="path-card psychology card-front reveal">
                  <div className="card-topline">
                    <span className="soft-icon symbol-icon" aria-hidden="true" data-fallable="">&#10022;</span>
                    <span className="status-pill">Starts first</span>
                  </div>
                  <h3>Mind</h3>
                  <p>Start with one calm mental reset before the loop takes over.</p>
                  <ul className="path-detail-list" aria-label="Mind details">
                    <li>Default first path</li>
                    <li>Low-friction reset</li>
                    <li>Indoor, late-night, stress, boredom, or social-media triggers</li>
                  </ul>
                  <span className="card-flip-hint" aria-hidden="true">
                    <span>How it works</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
                  </span>
                </article>

                <article className="path-card psychology card-back" aria-hidden={!flippedCards.has("mind")}>
                  <div className="card-topline">
                    <span className="soft-icon symbol-icon" aria-hidden="true">&#10022;</span>
                    <span className="status-pill">Starts first</span>
                  </div>
                  <h3>Mind</h3>
                  <p className="card-back-tag">Pause, name the urge, choose one better action, and save what helped.</p>
                  <p className="card-back-section-h">How it works</p>
                  <ol className="card-back-steps">
                    <li>You notice the urge as a wave coming through, not a command you have to follow.</li>
                    <li>You name what is actually pulling at you: stress, boredom, late-night scrolling, or another trigger.</li>
                    <li>You choose one better action and save what helped for next time.</li>
                  </ol>
                  <div className="card-back-diagram">
                    <svg viewBox="0 0 240 170" width="100%" role="img" aria-label="A trigger leads to a pause, then naming the pattern, then choosing a calmer next move. The old loop fades each time you do this.">
                      <defs>
                        <marker id="arr-mind-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#2D2730" strokeWidth="1.5" strokeLinecap="round" /></marker>
                      </defs>
                      <rect x="78" y="6" width="84" height="26" rx="8" fill="rgba(255,255,255,0.9)" stroke="#2D2730" strokeWidth="0.6" />
                      <text x="120" y="23" textAnchor="middle" fontSize="11" fontWeight="500" fill="#2D2730">Trigger</text>
                      <line x1="120" y1="34" x2="120" y2="48" stroke="#2D2730" strokeWidth="1" markerEnd="url(#arr-mind-back)" />
                      <circle cx="120" cy="76" r="24" fill="#FFFFFF" stroke="#2D2730" strokeWidth="1.6" />
                      <circle cx="120" cy="76" r="30" fill="none" stroke="#2D2730" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.45" />
                      <text x="120" y="74" textAnchor="middle" fontSize="11" fontWeight="500" fill="#2D2730">Pause</text>
                      <text x="120" y="86" textAnchor="middle" fontSize="9" fill="#5D5360">notice it</text>
                      <line x1="120" y1="102" x2="120" y2="116" stroke="#2D2730" strokeWidth="1" markerEnd="url(#arr-mind-back)" />
                      <rect x="68" y="118" width="104" height="22" rx="6" fill="rgba(255,255,255,0.85)" stroke="#2D2730" strokeWidth="0.6" />
                      <text x="120" y="133" textAnchor="middle" fontSize="11" fontWeight="500" fill="#2D2730">Name and choose</text>
                      <line x1="120" y1="142" x2="120" y2="154" stroke="#2D2730" strokeWidth="1" markerEnd="url(#arr-mind-back)" />
                      <text x="120" y="166" textAnchor="middle" fontSize="10" fill="#5D5360" fontStyle="italic">a calmer next move</text>
                      <path d="M 174 156 Q 218 80 168 14" stroke="#5D5360" strokeWidth="0.5" fill="none" strokeDasharray="2 3" opacity="0.5" />
                      <text x="208" y="86" fontSize="8" fill="#5D5360" fontStyle="italic" textAnchor="middle">old loop</text>
                      <text x="208" y="96" fontSize="8" fill="#5D5360" fontStyle="italic" textAnchor="middle">fades</text>
                    </svg>
                  </div>
                  <span className="card-flip-hint card-flip-hint-back" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M11 5l-7 7 7 7" /></svg>
                    <span>Back</span>
                  </span>
                </article>
              </div>
              <div
                className={`path-card-wrapper${flippedCards.has("body") ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has("body")}
                aria-label="Body path. Click to see how it works."
                onClick={() => togglePathFlip("body")}
                onKeyDown={(event) => handlePathKeyDown(event, "body")}
              >
                <article className="path-card physical card-front reveal">
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true" data-fallable="">
                      <img src="/images/icons/impulsive-body.png" alt="" />
                    </span>
                    <span className="status-pill">Unlocks later</span>
                  </div>
                  <h3>Body</h3>
                  <p>When your room, bed, or phone becomes the trigger, Body helps you move before the urge takes over.</p>
                  <ul className="path-detail-list" aria-label="Body details">
                    <li>Movement-based reset</li>
                    <li>Exit-room or walk support</li>
                    <li>Built for changing state quickly</li>
                  </ul>
                  <span className="card-flip-hint" aria-hidden="true">
                    <span>How it works</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
                  </span>
                </article>

                <article className="path-card physical card-back" aria-hidden={!flippedCards.has("body")}>
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true">
                      <img src="/images/icons/impulsive-body.png" alt="" />
                    </span>
                    <span className="status-pill">Unlocks later</span>
                  </div>
                  <h3>Body</h3>
                  <p className="card-back-tag">Sometimes thinking is not enough. Body helps you leave the exact environment where the loop usually wins.</p>
                  <p className="card-back-section-h">How it works</p>
                  <ol className="card-back-steps">
                    <li>Step away from the room, bed, phone, or place where the urge usually wins.</li>
                    <li>Start a short reset and complete the movement proof.</li>
                    <li>Save the progress privately so Impulsive can learn what helps you change state quickly.</li>
                  </ol>
                  <div className="card-back-diagram">
                    <svg viewBox="0 0 240 190" width="100%" role="img" aria-label="A person leaves an indoor trigger zone, steps through a door, and walks outside on a path.">
                      <defs>
                        <marker id="arr-body-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#2D2730" strokeWidth="1.5" strokeLinecap="round" /></marker>
                      </defs>
                      <rect x="50" y="6" width="140" height="50" rx="8" fill="rgba(255,255,255,0.7)" stroke="#2D2730" strokeWidth="0.8" strokeDasharray="3 3" />
                      <text x="120" y="22" textAnchor="middle" fontSize="10" fontWeight="500" fill="#2D2730">Indoor trigger zone</text>
                      <text x="120" y="34" textAnchor="middle" fontSize="9" fill="#5D5360">where the loop wins</text>
                      <circle cx="120" cy="46" r="3.5" fill="#2D2730" />
                      <line x1="120" y1="49" x2="120" y2="52" stroke="#2D2730" strokeWidth="1.2" />
                      <line x1="120" y1="60" x2="120" y2="80" stroke="#2D2730" strokeWidth="1.2" markerEnd="url(#arr-body-back)" />
                      <text x="160" y="74" fontSize="9" fill="#5D5360">leave</text>
                      <rect x="100" y="86" width="40" height="34" rx="4" fill="rgba(255,255,255,0.9)" stroke="#2D2730" strokeWidth="0.8" />
                      <line x1="120" y1="86" x2="120" y2="120" stroke="#2D2730" strokeWidth="0.8" />
                      <circle cx="125" cy="103" r="1.2" fill="#2D2730" />
                      <text x="120" y="132" textAnchor="middle" fontSize="9" fill="#5D5360">step out</text>
                      <line x1="120" y1="138" x2="120" y2="150" stroke="#2D2730" strokeWidth="1.2" markerEnd="url(#arr-body-back)" />
                      <path d="M 30 170 Q 80 156 120 164 T 210 170" stroke="#2D2730" strokeWidth="1.4" fill="none" />
                      <circle cx="55" cy="166" r="2.5" fill="#2D2730" />
                      <circle cx="85" cy="161" r="2.5" fill="#2D2730" />
                      <circle cx="115" cy="163" r="2.5" fill="#2D2730" />
                      <circle cx="145" cy="166" r="2.5" fill="#2D2730" />
                      <circle cx="175" cy="168" r="2.5" fill="#2D2730" />
                      <text x="120" y="185" textAnchor="middle" fontSize="9" fill="#5D5360">5, 10, or 15 minute walk</text>
                    </svg>
                  </div>
                  <span className="card-flip-hint card-flip-hint-back" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M11 5l-7 7 7 7" /></svg>
                    <span>Back</span>
                  </span>
                </article>
              </div>
              <div
                className={`path-card-wrapper${flippedCards.has("soul") ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has("soul")}
                aria-label="Soul path. Click to see how it works."
                onClick={() => togglePathFlip("soul")}
                onKeyDown={(event) => handlePathKeyDown(event, "soul")}
              >
                <article className="path-card spiritual card-front reveal">
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true" data-fallable="">
                      <img src="/images/icons/impulsive-soul.png" alt="" />
                    </span>
                    <span className="status-pill">Optional</span>
                  </div>
                  <h3>Soul</h3>
                  <p>For users who want faith, values, prayer, or reflection to be part of recovery without pressure.</p>
                  <ul className="path-detail-list" aria-label="Soul details">
                    <li>Optional</li>
                    <li>Never forced</li>
                    <li>Faith, values, prayer, reflection, recommitment</li>
                  </ul>
                  <span className="card-flip-hint" aria-hidden="true">
                    <span>How it works</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
                  </span>
                </article>

                <article className="path-card spiritual card-back" aria-hidden={!flippedCards.has("soul")}>
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true">
                      <img src="/images/icons/impulsive-soul.png" alt="" />
                    </span>
                    <span className="status-pill">Optional</span>
                  </div>
                  <h3>Soul</h3>
                  <p className="card-back-tag">Soul is optional. It appears only if enabled, then gives a short grounding action without pressure.</p>
                  <p className="card-back-section-h">How it works</p>
                  <ol className="card-back-steps">
                    <li>You enable Soul only if faith, values, prayer, or reflection belongs in your recovery.</li>
                    <li>Impulsive suggests a short grounding action: prayer, reflection, passage reading, or recommitment.</li>
                    <li>If you slip, Soul helps you restart without shame.</li>
                  </ol>
                  <div className="card-back-diagram">
                    <svg viewBox="0 0 240 180" width="100%" role="img" aria-label="A line of sight from the present moment, through prayer, passage, and reflection, to a steady future self.">
                      <circle cx="120" cy="22" r="14" fill="rgba(255,255,255,0.85)" stroke="#2D2730" strokeWidth="1.2" />
                      <text x="120" y="26" textAnchor="middle" fontSize="10" fontWeight="500" fill="#2D2730">Now</text>
                      <text x="120" y="46" textAnchor="middle" fontSize="9" fill="#5D5360">a hard moment</text>
                      <line x1="120" y1="56" x2="120" y2="138" stroke="#2D2730" strokeWidth="1" strokeDasharray="2 3" />
                      <circle cx="120" cy="74" r="3" fill="#2D2730" />
                      <text x="135" y="77" fontSize="9" fill="#5D5360">prayer</text>
                      <circle cx="120" cy="96" r="3" fill="#2D2730" />
                      <text x="135" y="99" fontSize="9" fill="#5D5360">passage</text>
                      <circle cx="120" cy="118" r="3" fill="#2D2730" />
                      <text x="135" y="121" fontSize="9" fill="#5D5360">reflection</text>
                      <circle cx="120" cy="156" r="18" fill="rgba(255,255,255,0.9)" stroke="#2D2730" strokeWidth="1.5" />
                      <text x="120" y="155" textAnchor="middle" fontSize="9" fontWeight="500" fill="#2D2730">Future</text>
                      <text x="120" y="165" textAnchor="middle" fontSize="9" fontWeight="500" fill="#2D2730">self</text>
                    </svg>
                  </div>
                  <span className="card-flip-hint card-flip-hint-back" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M11 5l-7 7 7 7" /></svg>
                    <span>Back</span>
                  </span>
                </article>
              </div>
              <div
                className={`path-card-wrapper${flippedCards.has("nexus") ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has("nexus")}
                aria-label="Nexus path. Click to see how it works."
                onClick={() => togglePathFlip("nexus")}
                onKeyDown={(event) => handlePathKeyDown(event, "nexus")}
              >
                <article className="path-card synchrology card-front reveal">
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true" data-fallable="">
                      <img src="/images/icons/impulsive-nexus.png" alt="" />
                    </span>
                    <span className="status-pill status-pill--future">Coming later</span>
                  </div>
                  <h3>Nexus</h3>
                  <p>An adaptive engine that is designed to learn what helps and route the next best support, planned for a future release.</p>
                  <ul className="path-detail-list" aria-label="Nexus details">
                    <li>Not a public path menu</li>
                    <li>Will coordinate Mind, Body, Soul, Focus, and games</li>
                    <li>Designed to become more personal over time</li>
                  </ul>
                  <span className="card-flip-hint" aria-hidden="true">
                    <span>How it will work</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
                  </span>
                </article>

                <article className="path-card synchrology card-back" aria-hidden={!flippedCards.has("nexus")}>
                  <div className="card-topline">
                    <span className="soft-icon image-icon" aria-hidden="true">
                      <img src="/images/icons/impulsive-nexus.png" alt="" />
                    </span>
                    <span className="status-pill status-pill--future">Coming later</span>
                  </div>
                  <h3>Nexus</h3>
                  <p className="card-back-tag">Nexus is designed to use private trigger patterns, past success, urge ratings, and fallback history to recommend one clear action. It is a planned future feature, not a current live capability.</p>
                  <p className="card-back-section-h">How it will work</p>
                  <ol className="card-back-steps">
                    <li>It will read the private pattern: trigger windows, past success, urge ratings, and fallback history.</li>
                    <li>It will coordinate Mind, Body, Soul, Focus, and recovery games behind the scenes.</li>
                    <li>It will recommend one clear action instead of showing every option at once.</li>
                    <li>It is designed to help Impulsive become more personal over time.</li>
                  </ol>
                  <div className="card-back-diagram">
                    <svg viewBox="0 0 240 200" width="100%" role="img" aria-label="A four step ladder showing Mind only at levels one and two, previews at three to five, two of three paths at six and seven, and full Nexus at level eight and beyond.">
                      <line x1="40" y1="20" x2="40" y2="180" stroke="#2D2730" strokeWidth="1.4" />
                      <circle cx="40" cy="170" r="6" fill="rgba(255,255,255,0.95)" stroke="#2D2730" strokeWidth="1.2" />
                      <text x="56" y="168" fontSize="9" fill="#5D5360">Levels 1-2</text>
                      <text x="56" y="180" fontSize="10" fontWeight="500" fill="#2D2730">Mind only</text>
                      <circle cx="40" cy="124" r="6" fill="rgba(255,255,255,0.95)" stroke="#2D2730" strokeWidth="1.2" />
                      <text x="56" y="122" fontSize="9" fill="#5D5360">Levels 3-5</text>
                      <text x="56" y="134" fontSize="10" fontWeight="500" fill="#2D2730">Mind plus previews</text>
                      <circle cx="40" cy="78" r="6" fill="rgba(255,255,255,0.95)" stroke="#2D2730" strokeWidth="1.2" />
                      <text x="56" y="76" fontSize="9" fill="#5D5360">Levels 6-7</text>
                      <text x="56" y="88" fontSize="10" fontWeight="500" fill="#2D2730">Pick 2 of 3 paths</text>
                      <circle cx="40" cy="30" r="8" fill="#2D2730" stroke="#2D2730" strokeWidth="1.4" />
                      <text x="56" y="28" fontSize="9" fill="#5D5360">Level 8+</text>
                      <text x="56" y="40" fontSize="10" fontWeight="500" fill="#2D2730">Full Nexus</text>
                      <text x="56" y="52" fontSize="9" fill="#5D5360">all three paths active</text>
                      <text x="200" y="174" fontSize="9" fill="#5D5360" textAnchor="middle">M . .</text>
                      <text x="200" y="128" fontSize="9" fill="#5D5360" textAnchor="middle">M ~ ~</text>
                      <text x="200" y="82" fontSize="9" fill="#5D5360" textAnchor="middle">M B S</text>
                      <text x="200" y="34" fontSize="9" fill="#5D5360" textAnchor="middle">M B S</text>
                      <text x="120" y="196" textAnchor="middle" fontSize="9" fill="#5D5360" fontStyle="italic">progress earns choice</text>
                    </svg>
                  </div>
                  <span className="card-flip-hint card-flip-hint-back" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M11 5l-7 7 7 7" /></svg>
                    <span>Back</span>
                  </span>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section recovery-games-section" id="games" aria-labelledby="recovery-games-title">
          <div className="container">
            <div className="section-heading recovery-games-heading reveal">
              <p className="eyebrow">RECOVERY GAMES</p>
              <h2 id="recovery-games-title">Recovery games that interrupt the loop</h2>
              <p>When advice is not enough, Impulsive gives the brain a short, recordable challenge. The goal is not endless play. The goal is to break autopilot, create a visible win, and return safely.</p>
              <div className="game-flow-strip" aria-label="Recovery game flow">
                <span>Trigger detected</span>
                <span aria-hidden="true">→</span>
                <span>60-second challenge</span>
                <span aria-hidden="true">→</span>
                <span>Walk Away saves the win</span>
              </div>
            </div>

            <article className="featured-game-card reveal" style={{ "--game-color": selectedGame.accent } as React.CSSProperties}>
              <div className="featured-game-copy">
                <span className="game-kicker">{selectedGameIndex === 0 ? "Featured first build" : "Selected recovery tool"}</span>
                <h3>{selectedGame.name}</h3>
                <span className="game-purpose-label">Purpose</span>
                <p>{selectedGameIndex === 0 ? "A fast reaction game for peak-risk moments. Tap the correct targets, avoid decoys, build control, then finish with a safe exit." : selectedGame.purpose}</p>
                <dl className="game-facts">
                  <div>
                    <dt>Session</dt>
                    <dd>{selectedGame.length}</dd>
                  </div>
                  <div>
                    <dt>Records</dt>
                    <dd>{selectedGameIndex === 0 ? "reaction time, combo, urge drop" : selectedGame.record}</dd>
                  </div>
                  <div className="safe-exit-fact">
                    <dt>Best score</dt>
                    <dd>{selectedGameIndex === 0 ? "requires Walk Away" : selectedGame.safeExit}</dd>
                  </div>
                </dl>
                <button className="game-save-button" type="button">Walk Away to save</button>
              </div>
              <div className="featured-game-visual">
                {selectedGameIndex === 0 ? (
                  <ReflexOverrideGame />
                ) : (
                  <>
                    <div className="reflex-board">
                      <span className="reflex-orbit orbit-one"></span>
                      <span className="reflex-orbit orbit-two"></span>
                      <span className="reflex-scan"></span>
                      <span className="reflex-chip reflex-chip-score">Combo x4</span>
                      <span className="reflex-chip reflex-chip-risk">Trigger 8/10</span>
                      <span className="reflex-target target-main"></span>
                      <span className="reflex-target target-soft"></span>
                      <span className="reflex-target target-calm"></span>
                      <span className="reflex-target target-focus"></span>
                      <span className="reflex-target target-decoy"></span>
                      <span className="reflex-path"></span>
                    </div>
                    <div className="safe-exit-chip">Walk Away to save</div>
                  </>
                )}
              </div>
            </article>

            <div className="game-card-grid" aria-label="Recovery game library">
              {recoveryGames.map((game, gameIndex) => {
                return (
                <button
                  className={`game-card is-visible${selectedGameIndex === gameIndex ? " is-selected" : ""}`}
                  key={game.name}
                  type="button"
                  style={{ "--game-color": game.accent } as React.CSSProperties}
                  aria-pressed={selectedGameIndex === gameIndex}
                  onClick={() => setSelectedGameIndex(gameIndex)}
                >
                  <span>
                    <small>Short interruption tool</small>
                    <strong>{game.name}</strong>
                  </span>
                  <span className="game-card-action" aria-hidden="true">→</span>
                </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section recovery-proof-section" aria-labelledby="recovery-proof-title">
          <div className="container">
            <div className="section-heading recovery-proof-heading reveal">
              <p className="eyebrow">Private scorecard</p>
              <h2 id="recovery-proof-title">Your private recovery proof</h2>
              <p>Impulsive does not guess your progress. It saves small private proof: what interrupted the moment, whether the urge dropped, and whether you safely exited.</p>
            </div>

            <div className="recovery-proof-layout">
              <article className="weekly-proof-card reveal" aria-label="Weekly proof card preview">
                <div className="proof-card-header">
                  <div>
                    <span>Weekly Proof Card</span>
                    <h3>This week, privately saved</h3>
                  </div>
                  <span className="proof-status-pill">Self-vs-self</span>
                </div>

                <div className="safe-exit-hero">
                  <span>Most valuable proof</span>
                  <strong>Safe exit saved</strong>
                  <p>Finishing the intervention and walking away matters more than the raw score.</p>
                </div>

                <div className="proof-signal-row" aria-label="Saved recovery moment example">
                  <span>Urge before: 8/10</span>
                  <span>Urge after: 5/10</span>
                  <span>Personal best beaten</span>
                  <span>3 risky moments interrupted this week</span>
                </div>

                <dl className="weekly-proof-grid">
                  <div>
                    <dt>Risky moments interrupted</dt>
                    <dd>3 this week</dd>
                  </div>
                  <div>
                    <dt>Average urge change</dt>
                    <dd>8/10 to 5/10</dd>
                  </div>
                  <div>
                    <dt>Strongest action</dt>
                    <dd>90-second Mind reset</dd>
                  </div>
                  <div>
                    <dt>Private record</dt>
                    <dd>Personal best beaten</dd>
                  </div>
                </dl>
              </article>

              <div className="proof-metric-grid" aria-label="Private recovery proof metrics">
                <article className="proof-metric-card reveal">
                  <span>01</span>
                  <h3>Personal Best</h3>
                  <p>Your strongest score for a recovery game or reset.</p>
                </article>
                <article className="proof-metric-card reveal">
                  <span>02</span>
                  <h3>Previous Record</h3>
                  <p>See whether this attempt was stronger than the last one.</p>
                </article>
                <article className="proof-metric-card reveal">
                  <span>03</span>
                  <h3>Urge Drop</h3>
                  <p>A quick before-and-after rating shows whether your state changed.</p>
                </article>
                <article className="proof-metric-card proof-safe-card reveal">
                  <span>04</span>
                  <h3>Safe Exit Rate</h3>
                  <p>The most important proof: how often you finish and walk away.</p>
                </article>
                <article className="proof-metric-card reveal">
                  <span>05</span>
                  <h3>Rescue Count</h3>
                  <p>How many risky moments ended with a safer choice after an intervention.</p>
                </article>
                <article className="proof-metric-card reveal">
                  <span>06</span>
                  <h3>Weekly Proof Card</h3>
                  <p>A simple weekly summary of risky moments interrupted, safe exits, average urge drop, and strongest recovery action.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section unlock-progression-section" id="progression" aria-labelledby="unlock-progression-title">
          <div className="container">
            <div className="section-heading unlock-progression-heading reveal">
              <p className="eyebrow">Level-based recovery</p>
              <h2 id="unlock-progression-title">Progress that unlocks stronger support</h2>
              <p>Impulsive starts small on purpose. As the app learns what helps you interrupt the loop, stronger paths, focus tools, games, and Nexus routing become available.</p>
            </div>

            <ol className="progression-path" aria-label="Impulsive progression path">

              <li className="progression-step progression-step--unlocked reveal" style={{ "--prog-color": "var(--mind-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">1</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 1</span>
                    <span className="prog-status-pill">Mind</span>
                  </div>
                  <h3 className="prog-card-title">First interruption</h3>
                  <p className="prog-card-copy">Trigger interruption and one guided Mind reset.</p>
                </div>
              </li>

              <li className="progression-step progression-step--unlocked reveal" style={{ "--prog-color": "var(--body-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">2</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 2</span>
                    <span className="prog-status-pill">Free</span>
                  </div>
                  <h3 className="prog-card-title">More recovery actions</h3>
                  <p className="prog-card-copy">Unlock one extra recovery action or recovery game.</p>
                </div>
              </li>

              <li className="progression-step progression-step--unlocked reveal" style={{ "--prog-color": "var(--soul-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">3</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 3</span>
                    <span className="prog-status-pill">Free</span>
                  </div>
                  <h3 className="prog-card-title">Taper progress</h3>
                  <p className="prog-card-copy">See a basic schedule taper card based on completed recovery actions.</p>
                </div>
              </li>

              <li className="progression-step progression-step--unlocked reveal" style={{ "--prog-color": "var(--focus-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">4</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 4</span>
                    <span className="prog-status-pill">Free</span>
                  </div>
                  <h3 className="prog-card-title">Standard Focus</h3>
                  <p className="prog-card-copy">Start focus sessions, recover from distraction, and resume smoothly.</p>
                </div>
              </li>

              <li className="progression-step progression-step--preview reveal" style={{ "--prog-color": "var(--body-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">5</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 5</span>
                    <span className="prog-status-pill prog-status-pill--preview">Preview</span>
                  </div>
                  <h3 className="prog-card-title">Path Map preview</h3>
                  <p className="prog-card-copy">Preview Body and Soul as future support options without pressure.</p>
                </div>
              </li>

              <li className="progression-step progression-step--choice reveal" style={{ "--prog-color": "var(--brand-glow)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge" aria-hidden="true">6</span>
                  <span className="prog-connector" aria-hidden="true"></span>
                </div>
                <div className="prog-card">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 6</span>
                    <span className="prog-status-pill prog-status-pill--calm">Your choice</span>
                  </div>
                  <h3 className="prog-card-title">Calm unlock moment</h3>
                  <p className="prog-card-copy">Stay free, buy Plus, or explore Invite &amp; Unlock from a calm progress screen.</p>
                </div>
              </li>

              <li className="progression-step progression-step--locked reveal" style={{ "--prog-color": "var(--nexus-color)" } as React.CSSProperties}>
                <div className="prog-milestone">
                  <span className="prog-badge prog-badge--nexus" aria-hidden="true">7</span>
                </div>
                <div className="prog-card prog-card--locked">
                  <div className="prog-card-head">
                    <span className="prog-level-label">Level 8+</span>
                    <span className="prog-status-pill prog-status-pill--engine">Nexus</span>
                  </div>
                  <h3 className="prog-card-title">Nexus routing</h3>
                  <p className="prog-card-copy">Nexus coordinates stronger multi-path support based on what actually helps.</p>
                </div>
              </li>

            </ol>

            <p className="progression-footnote reveal">Unlocks appear after progress, not during vulnerable moments.</p>
          </div>
        </section>

        <section className="section invite-unlock-section" id="invite-unlock" aria-labelledby="invite-unlock-title">
          <div className="container">
            <div className="section-heading invite-unlock-heading">
              <p className="eyebrow">Invite &amp; Unlock</p>
              <h2 id="invite-unlock-title">Invite &amp; Unlock</h2>
              <p>Not everyone needs to pay to unlock more support. Impulsive can let users earn selected lifetime unlocks by inviting people who genuinely need it. Only real activation counts.</p>
            </div>

            <div className="invite-unlock-layout">

              <div className="invite-ladder-wrap">
                <ol className="invite-ladder" aria-label="Invite and unlock referral milestones">

                  <li className="invite-step" style={{ "--invite-color": "var(--nexus-color)" } as React.CSSProperties}>
                    <div className="invite-milestone">
                      <span className="invite-count" aria-hidden="true">5</span>
                      <span className="invite-count-label">activated</span>
                      <span className="invite-rung" aria-hidden="true"></span>
                    </div>
                    <div className="invite-card reveal">
                      <span className="invite-unlock-label">Unlocks</span>
                      <h3 className="invite-card-title">Nexus preview</h3>
                      <p className="invite-card-copy">Start seeing how Impulsive coordinates recovery paths behind the scenes.</p>
                    </div>
                  </li>

                  <li className="invite-step" style={{ "--invite-color": "var(--soul-color)" } as React.CSSProperties}>
                    <div className="invite-milestone">
                      <span className="invite-count" aria-hidden="true">10</span>
                      <span className="invite-count-label">activated</span>
                      <span className="invite-rung" aria-hidden="true"></span>
                    </div>
                    <div className="invite-card reveal">
                      <span className="invite-unlock-label">Unlocks</span>
                      <h3 className="invite-card-title">Soul path</h3>
                      <p className="invite-card-copy">Unlock optional grounding, prayer, reflection, and recommitment support if enabled.</p>
                    </div>
                  </li>

                  <li className="invite-step" style={{ "--invite-color": "var(--body-color)" } as React.CSSProperties}>
                    <div className="invite-milestone">
                      <span className="invite-count" aria-hidden="true">20</span>
                      <span className="invite-count-label">activated</span>
                    </div>
                    <div className="invite-card reveal">
                      <span className="invite-unlock-label">Unlocks</span>
                      <h3 className="invite-card-title">Body path</h3>
                      <p className="invite-card-copy">Unlock stronger movement-based resets for leaving the trigger environment and changing state.</p>
                    </div>
                  </li>

                </ol>
              </div>

              <div className="invite-rule-cards">

                <article className="invite-rule-card reveal">
                  <span className="invite-rule-icon" aria-hidden="true">&#10003;</span>
                  <h3>Only real activation counts</h3>
                  <p>Fake clicks, empty signups, repeated installs, or abuse should not unlock recovery tools. A referral counts only when the invited person genuinely joins and reaches the required activation point.</p>
                </article>

                <article className="invite-rule-card reveal">
                  <span className="invite-rule-icon" aria-hidden="true">&#9670;</span>
                  <h3>Plus still stays stronger</h3>
                  <p>Invite &amp; Unlock is slower and more limited than Plus. Advanced protection, deeper insights, cloud features, VPN/DNS protection, and full Premium tools stay separate.</p>
                </article>

                <article className="invite-rule-card reveal">
                  <span className="invite-rule-icon" aria-hidden="true">&#9675;</span>
                  <h3>Never during a trigger</h3>
                  <p>Invite prompts appear only in calm places like Path Map, Settings, weekly review, or milestone screens. They do not appear during trigger interception, lapse recovery, or urgent help.</p>
                </article>

              </div>
            </div>

            <p className="invite-cta-note">Explore unlocks after progress</p>
          </div>
        </section>

        <section className="section tiers-section" id="tiers" aria-labelledby="tiers-title">
          <div className="container">
            <div className="section-heading tiers-heading">
              <p className="eyebrow">Product boundaries</p>
              <h2 id="tiers-title">Free help first. Stronger tools later.</h2>
              <p>Impulsive should help first, then offer stronger tools later. Basic recovery support stays available during risky moments. Upgrade choices belong in calm progress moments, not during weakness.</p>
            </div>

            <div className="tiers-grid">

              <article className="tier-card tier-card--free" style={{ "--tier-color": "var(--mind-color)" } as React.CSSProperties}>
                <div className="tier-card-top">
                  <span className="tier-badge">Free</span>
                  <span className="tier-name">Impulsive Core</span>
                </div>
                <p className="tier-copy">Mind Core, basic trigger interruption, schedule taper, standard recovery games, Standard Focus, and a private local progress ledger.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>Enough to understand the app, build trust, and start interrupting the loop.</p>
                </div>
              </article>

              <article className="tier-card tier-card--invite" style={{ "--tier-color": "var(--brand-glow)" } as React.CSSProperties}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--invite">Invite &amp; Unlock</span>
                </div>
                <p className="tier-copy">Selected lifetime unlocks through real activated referrals. Slower and more limited than Plus.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>A fair route for users who cannot pay but can help others discover the app.</p>
                </div>
              </article>

              <article className="tier-card tier-card--plus" style={{ "--tier-color": "var(--focus-color)" } as React.CSSProperties}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--plus">One-time Plus</span>
                </div>
                <p className="tier-copy">Stronger paths, 2-out-of-3 path selection, advanced Nexus routing, Temperature Focus, deeper reports, premium games, and extra themes.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>A permanent stronger toolbox, not a subscription trap.</p>
                </div>
              </article>

              <article className="tier-card tier-card--cloud" style={{ "--tier-color": "var(--body-color)" } as React.CSSProperties}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--cloud">Later: Cloud</span>
                </div>
                <p className="tier-copy">Only if needed later: encrypted backup, multi-device sync, accountability tools, community, and cloud AI.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>Future optional infrastructure, not the launch promise.</p>
                </div>
              </article>

            </div>

            <div className="tiers-rule-panel">
              <span className="tiers-rule-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <div>
                <h3>No paywall during a trigger</h3>
                <p>Payment and referral prompts belong after progress, inside Settings, Path Map, or weekly review. They should not appear during trigger interception, lapse recovery, emergency override, or urgent help.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section problem-section" aria-labelledby="problem-title">
          <div className="container split-panel reveal">
            <div>
              <p className="eyebrow">The problem</p>
              <h2 id="problem-title">Most habit apps make one slip feel like failure.</h2>
            </div>
            <p>Many tools rely on pressure, streaks, hard blocking, and shame. Impulsive is designed differently, with shame-free support for impulse control that helps users pause, redirect, and review progress without turning a difficult moment into an identity.</p>
          </div>
        </section>


        <section className="section how-section" id="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">How it works</p>
              <h2 id="how-title">Designed for the moment before the decision.</h2>
            </div>
            <ol className="step-flow">
              <li className="step-card reveal">
                <span>Step 1</span>
                <h3>Set your pattern</h3>
                <p>Name the habit loop, its likely trigger windows, and a realistic taper target.</p>
              </li>
              <li className="step-card reveal">
                <span>Step 2</span>
                <h3>Receive a calm intervention</h3>
                <p>Get one private recommendation first, with fallback support if the moment needs a different route.</p>
              </li>
              <li className="step-card reveal">
                <span>Step 3</span>
                <h3>Review without shame</h3>
                <p>Reflect on what happened and what helped, without punishment, inflated scores, or public pressure.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section focus-section" id="focus" aria-labelledby="focus-title">
          <div className="container">
            <div className="section-heading focus-section-heading">
              <p className="eyebrow">Focus mode</p>
              <h2 id="focus-title">Focus Mode that helps you come back</h2>
              <p>Impulsive Focus is not just a timer. It helps you start, blocks the distractions you choose, gives a recovery flow if you get interrupted, and helps you resume without shame.</p>
            </div>

            <div className="focus-loop" role="img" aria-label="The Focus Mode loop: Start focus, get interrupted, recover, then resume smoothly">
              <div className="focus-loop-step">
                <span className="focus-loop-dot focus-loop-dot--start" aria-hidden="true"></span>
                <span className="focus-loop-label">Start</span>
              </div>
              <span className="focus-loop-connector" aria-hidden="true"></span>
              <div className="focus-loop-step">
                <span className="focus-loop-dot focus-loop-dot--interrupt" aria-hidden="true"></span>
                <span className="focus-loop-label">Interrupt</span>
              </div>
              <span className="focus-loop-connector" aria-hidden="true"></span>
              <div className="focus-loop-step">
                <span className="focus-loop-dot focus-loop-dot--recover" aria-hidden="true"></span>
                <span className="focus-loop-label">Recover</span>
              </div>
              <span className="focus-loop-connector" aria-hidden="true"></span>
              <div className="focus-loop-step">
                <span className="focus-loop-dot focus-loop-dot--resume" aria-hidden="true"></span>
                <span className="focus-loop-label">Resume</span>
              </div>
            </div>

            <div className="focus-mode-grid">

              <article className="focus-mode-card focus-mode-card--standard reveal" style={{ "--mode-color": "var(--focus-color)" } as React.CSSProperties}>
                <div className="focus-mode-card-top">
                  <span className="focus-mode-badge">Standard</span>
                  <span className="focus-mode-available">Always available</span>
                </div>
                <h3>Standard Focus</h3>
                <p>Choose a focus time, block selected distractions, mute interruptions, recover if distracted, and resume smoothly.</p>
                <div className="focus-mode-best">
                  <span>Best for</span>
                  <p>Daily work, study, simple routines, and normal productivity sessions.</p>
                </div>
              </article>

              <div className="focus-temp-row">
                <p className="focus-temp-label">Temperature modes</p>
                <div className="focus-temp-cards">
                  <article className="focus-mode-card focus-mode-card--cold reveal" style={{ "--mode-color": "var(--body-color)" } as React.CSSProperties}>
                    <span className="focus-temp-badge focus-temp-badge--cold">Cold</span>
                    <h3>Cold Focus</h3>
                    <p>A gentle, low-pressure start for low-energy days.</p>
                    <div className="focus-mode-best">
                      <span>Best for</span>
                      <p>Getting started when motivation is low.</p>
                    </div>
                  </article>
                  <article className="focus-mode-card focus-mode-card--warm reveal" style={{ "--mode-color": "var(--soul-color)" } as React.CSSProperties}>
                    <span className="focus-temp-badge focus-temp-badge--warm">Warm</span>
                    <h3>Warm Focus</h3>
                    <p>Balanced blocking, normal recovery flow, and everyday focus support.</p>
                    <div className="focus-mode-best">
                      <span>Best for</span>
                      <p>Normal work sessions and repeatable routines.</p>
                    </div>
                  </article>
                  <article className="focus-mode-card focus-mode-card--hot reveal" style={{ "--mode-color": "var(--focus-color)" } as React.CSSProperties}>
                    <span className="focus-temp-badge focus-temp-badge--hot">Hot</span>
                    <h3>Hot Focus</h3>
                    <p>Stricter blocking, harder exit flow, and stronger interruption handling.</p>
                    <div className="focus-mode-best">
                      <span>Best for</span>
                      <p>Deep work, high-priority tasks, and serious focus sessions.</p>
                    </div>
                  </article>
                </div>
              </div>

              <article className="focus-mode-card focus-mode-card--recovery reveal" style={{ "--mode-color": "var(--brand-glow)" } as React.CSSProperties}>
                <div className="focus-mode-card-top">
                  <span className="focus-mode-badge focus-mode-badge--recovery">Recovery</span>
                  <span className="focus-mode-available focus-mode-available--recovery">Emotionally safe re-entry</span>
                </div>
                <h3>Recovery Focus</h3>
                <p>A short re-entry flow after distraction, built to help you restart without shame or overload.</p>
                <div className="focus-mode-best">
                  <span>Best for</span>
                  <p>Coming back after scrolling, slipping, procrastinating, or losing momentum.</p>
                </div>
              </article>

            </div>
          </div>
        </section>

        <section className="section principles-section" id="principles" aria-labelledby="principles-title">
          <div className="container">
            <div className="section-heading principles-section-heading">
              <p className="eyebrow">Principles</p>
              <h2 id="principles-title">Built without shame loops</h2>
              <p>Impulsive is designed for vulnerable moments, so the product rules matter. The app should support recovery without panic, humiliation, fake scores, or pressure to pay when someone is already struggling.</p>
            </div>
            <ul className="principle-cards" aria-label="Impulsive product principles">
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">01</span>
                <h3>No humiliation</h3>
                <p>No public shame, guilt language, or punishment screens after a slip.</p>
              </li>
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">02</span>
                <h3>No panic design</h3>
                <p>No red flashing warnings, fear-based countdowns, or dramatic failure states.</p>
              </li>
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">03</span>
                <h3>No fake recovery scores</h3>
                <p>Progress should come from saved actions, urge changes, safe exits, and real completion proof.</p>
              </li>
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">04</span>
                <h3>No paywall in a trigger</h3>
                <p>Basic help stays available during risky moments. Upgrade prompts belong in calm progress screens.</p>
              </li>
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">05</span>
                <h3>No addictive economy</h3>
                <p>Recovery games are short and time-boxed. They should guide the user back to real life, not trap them inside another loop.</p>
              </li>
              <li className="principle-card reveal">
                <span className="principle-num" aria-hidden="true">06</span>
                <h3>No public shame leaderboard</h3>
                <p>Sensitive recovery records stay private. Progress is self-vs-self, not a ranking against other people.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="container">
            <div className="section-heading about-section-heading">
              <p className="eyebrow">About</p>
              <h2 id="about-title">Built carefully for private behaviour change</h2>
              <p>Impulsive is being built with a privacy-first, local-first direction and careful product boundaries. The goal is to support difficult moments without shame, panic design, or exaggerated claims.</p>
            </div>
            <div className="credibility-grid">
              <article className="credibility-card reveal">
                <span className="credibility-num" aria-hidden="true">01</span>
                <h3>Privacy-first direction</h3>
                <p>Sensitive recovery records should stay private and local by default unless future backup is clearly enabled by the user.</p>
              </article>
              <article className="credibility-card reveal">
                <span className="credibility-num" aria-hidden="true">02</span>
                <h3>Local-first product logic</h3>
                <p>Progress, game records, urge ratings, safe exits, and recovery notes are designed around private on-device tracking first.</p>
              </article>
              <article className="credibility-card reveal">
                <span className="credibility-num" aria-hidden="true">03</span>
                <h3>Careful language</h3>
                <p>Impulsive avoids cure claims, fake recovery percentages, and medical promises. It explains behaviour support honestly.</p>
              </article>
              <article className="credibility-card reveal">
                <span className="credibility-num" aria-hidden="true">04</span>
                <h3>Ready for proper review</h3>
                <p>The product is structured so clinicians, advisors, reviewers, or endorsing bodies can understand the recovery loop, boundaries, and safety logic clearly.</p>
              </article>
            </div>
            <div className="about-footer-row">
              <p className="about-london-note">Built in London as an early-stage recovery support product.</p>
              <p className="about-disclaimer">Impulsive is not a substitute for therapy, diagnosis, crisis support, or professional medical advice. If you are in crisis, please contact your GP, a qualified therapist, or the Samaritans on 116 123.</p>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">Questions before you join.</h2>
              <p className="faq-intro">Impulsive is built for private, difficult habit loops, so the answers should be clear before anyone signs up.</p>
            </div>
            <div className="faq-list">
              <details className="faq-item">
                <summary>What does Impulsive actually do?</summary>
                <p>Impulsive is a behaviour-change app designed for the moment a habit loop accelerates. When a trigger starts, it gives you structured tools to pause and redirect — breathing patterns, body-focused grounding, short recovery games, and a calm reflection log. Between sessions it shows you patterns over time so you can understand your own loop without judgment.</p>
              </details>
              <details className="faq-item">
                <summary>Is my data private?</summary>
                <p>Yes. Your patterns, triggers, and reflections are designed to stay on your device by default. We do not sell your data and we do not use advertising trackers. Any future backup or sync feature would be optional, opt-in, and clearly explained before use — never enabled by default.</p>
              </details>
              <details className="faq-item">
                <summary>Will I be asked to pay during a trigger?</summary>
                <p>No. Never. Payment prompts, upgrade banners, and referral nudges are blocked during trigger moments, lapses, and the recovery flow. Financial pressure during a hard moment is harmful. The free tools work fully when you need them most.</p>
              </details>
              <details className="faq-item">
                <summary>Is Impulsive a replacement for therapy?</summary>
                <p>No. Impulsive is a behaviour-change support tool, not therapy, diagnosis, or clinical treatment. It is designed to sit alongside professional support. If you are in crisis or need clinical care, please contact your GP, a qualified therapist, or the Samaritans on 116 123.</p>
              </details>
              <details className="faq-item">
                <summary>What is the waitlist for?</summary>
                <p>Impulsive is in development and launching to a small group first. The waitlist lets us notify you when access opens. We are not collecting email addresses to send marketing. You will hear from us when the app is ready for you.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="section waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
          <div className="container waitlist-card reveal">
            <div>
              <p className="eyebrow">Waitlist</p>
              <h2 id="waitlist-title">Join the Impulsive waitlist.</h2>
              <p>Get notified when Impulsive is ready for wider testing or release. No spam, no public recovery data, and no pressure during vulnerable moments.</p>
            </div>
            <form
              className="waitlist-form"
              onSubmit={handleFormSubmit}
              ref={formRef}
            >
              <label htmlFor="email">Email address</label>
              <label className="hp-field" htmlFor="company" aria-hidden="true">Company</label>
              <input className="hp-field" id="company" name="company" type="text" tabIndex={-1} autoFocus={false} autoComplete="off" aria-hidden="true" />
              <input type="hidden" name="startedAt" value={startedAt} />
              <div className="form-row">
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                <button className="button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Join Waitlist"}
                </button>
              </div>
              {formStatus.message && (
                <p className="form-note" data-state={formStatus.type} aria-live="polite">
                  {formStatus.message}
                </p>
              )}
              <p className="waitlist-privacy-note">Your email is only used for Impulsive updates. Want to leave the waitlist? Email <a href="mailto:hello@useimpulsive.com">hello@useimpulsive.com</a>.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a className="wordmark" href="#top" aria-label="Impulsive home">
              <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="" />
              <span>Impulsive</span>
            </a>
            <p className="footer-tagline">Privacy-first behaviour change.</p>
            <p className="footer-location">Built in London</p>
          </div>
          <nav className="footer-nav" aria-label="Product links">
            <h3>Product</h3>
            <a href="#how-it-works">How it works</a>
            <a href="#paths">Paths</a>
            <a href="#games">Games</a>
            <a href="#focus">Focus Mode</a>
            <a href="#invite-unlock">Invite &amp; Unlock</a>
          </nav>
          <nav className="footer-nav" aria-label="Support links">
            <h3>Support</h3>
            <a href="#faq">FAQ</a>
            <a href="#waitlist">Waitlist</a>
            <a href="mailto:hello@useimpulsive.com">Contact</a>
          </nav>
          <nav className="footer-nav" aria-label="Legal links">
            <h3>Legal</h3>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </nav>
        </div>
        <div className="container footer-base">
          <div className="footer-base-text">
            <p className="footer-disclaimer">Impulsive is an early-stage behaviour-change support product. It is not a replacement for professional medical or mental health care.</p>
            <p className="footer-removal-note">Want to leave the waitlist or request deletion of your email? Email <a href="mailto:hello@useimpulsive.com">hello@useimpulsive.com</a>.</p>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Impulsive. All rights reserved.</p>
        </div>
      </footer>

      <nav className="section-nav" aria-label="Page sections">
        {SECTION_NAV.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`section-nav-item${activeSectionId === id ? ' is-active' : ''}`}
            aria-label={`Go to ${label}`}
            aria-current={activeSectionId === id ? 'true' : undefined}
          >
            <span className="section-nav-label" aria-hidden="true">{label}</span>
            <span className="section-nav-dot" aria-hidden="true" />
          </a>
        ))}
      </nav>
    </div>
  );
}
