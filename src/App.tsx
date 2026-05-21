import React, { useEffect, useMemo, useState, useRef, type KeyboardEvent } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ReflexOverrideGame } from './components/ReflexOverrideGame';
import { RevealOnScroll } from './components/RevealOnScroll';
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
    purpose: "A safe abstract outlet for stress, rejection, or anger. The screen moves from chaos to calm.",
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

export default function App() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeWeekCard, setActiveWeekCard] = useState(0);
  const [startedAt] = useState(Date.now().toString());
  const navMenuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroPhoneRef = useRef<HTMLDivElement>(null);
  const firstWeekRef = useRef<HTMLElement>(null);
  const reflexSectionRef = useRef<HTMLElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useDarkMode();
  const selectedGame = recoveryGames[selectedGameIndex];
  const heroHeadline = "Built for habits that do not break with willpower alone.";

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

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroPhoneScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const heroPhoneY = useTransform(heroProgress, [0, 1], [0, -40]);
  const heroPhoneOpacity = useTransform(heroProgress, [0, 0.7, 1], [1, 1, 0.85]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -20]);
  const heroParallaxY = useTransform(heroProgress, [0, 1], [0, -60]);

  const { scrollYProgress: firstWeekProgress } = useScroll({
    target: firstWeekRef,
    offset: ['start start', 'end end'],
  });

  const { scrollYProgress: reflexProgress } = useScroll({
    target: reflexSectionRef,
    offset: ['start start', 'end start'],
  });
  const reflexPhoneY = useTransform(reflexProgress, [0, 1], [0, -60]);

  const activeWeekIndex = useTransform(firstWeekProgress, (value) => {
    if (value < 0.2) return 0;
    if (value < 0.4) return 1;
    if (value < 0.6) return 2;
    if (value < 0.8) return 3;
    return 4;
  });
  useMotionValueEvent(activeWeekIndex, 'change', (latest) => {
    setActiveWeekCard(Math.round(latest));
  });

  const revealEase = useMemo(() => [0.22, 1, 0.36, 1] as const, []);

  useEffect(() => {
    const loopSection = document.getElementById("urge-loop");
    const loopBadges = Array.from(document.querySelectorAll<HTMLElement>(".loop-marker"));
    let countAnimated = false;
    const runLoopCount = () => {
      if (countAnimated || reduceMotion || loopBadges.length === 0) return;
      countAnimated = true;
      loopBadges.forEach((badge) => {
        const target = Number.parseInt(badge.textContent || "0", 10) || 0;
        let current = 0;
        const tick = () => {
          current += 1;
          badge.textContent = String(current).padStart(2, "0");
          if (current < target) window.setTimeout(tick, 70);
        };
        badge.textContent = "00";
        window.setTimeout(tick, 80);
      });
    };
    let loopObserver: IntersectionObserver | null = null;
    if (loopSection) {
      loopObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) runLoopCount();
          });
        },
        { threshold: 0.3 }
      );
      loopObserver.observe(loopSection);
    }

    // Cleanup
    return () => {
      loopObserver?.disconnect();
    };
  }, [reduceMotion]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 80);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>('#mobile-menu-panel a, #mobile-menu-panel button')
    );
    focusables[0]?.focus();

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key === "Tab" && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      menuToggleRef.current?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const detailsEls = Array.from(document.querySelectorAll<HTMLDetailsElement>(".faq-item"));
    detailsEls.forEach((details, index) => {
      const summary = details.querySelector("summary");
      const panel = details.querySelector("p");
      if (!summary || !panel) return;
      const panelId = `faq-panel-${index + 1}`;
      panel.id = panelId;
      summary.setAttribute("aria-controls", panelId);
      summary.setAttribute("aria-expanded", details.open ? "true" : "false");
      const onToggle = () => {
        summary.setAttribute("aria-expanded", details.open ? "true" : "false");
      };
      details.addEventListener("toggle", onToggle);
      (details as any).__onToggle = onToggle;
    });
    return () => {
      detailsEls.forEach((details) => {
        const onToggle = (details as any).__onToggle;
        if (onToggle) details.removeEventListener("toggle", onToggle);
      });
    };
  }, []);

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

      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} data-header>
        <nav className="nav" aria-label="Primary navigation">
          <div className="nav-left">
            <a className="wordmark" href="#top" aria-label="Impulsive home">
              <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="Impulsive logo" />
              <span>Impulsive</span>
            </a>
            <div className="nav-links nav-links--desktop" aria-label="Primary site links">
              <a href="#principles" onClick={closeMenu}>Principles</a>
              <a href="#faq" onClick={closeMenu}>FAQs</a>
            </div>
          </div>
          <div className="nav-right">
            <div className="nav-menu" id="primary-menu" ref={navMenuRef}></div>
            <a className="button button-small header-cta" href="#waitlist" onClick={closeMenu}>Join Waitlist</a>
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
              className="mobile-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              onClick={handleMenuToggle}
              ref={menuToggleRef}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="mobile-menu-overlay"
              aria-label="Close menu"
              onClick={closeMenu}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="menu-title"
              className="mobile-menu-panel"
              initial={reduceMotion ? false : { x: 36, opacity: 0 }}
              animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { x: 36, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className="mobile-menu-head">
                <h2 className="mobile-menu-title" id="menu-title">Menu</h2>
                <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={closeMenu}>
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-menu-group">
                <h3>How It Works</h3>
                <div className="mobile-menu-links" aria-label="How it works links">
                  <a href="#urge-loop" onClick={closeMenu}>Recovery Loop</a>
                  <a href="#first-week" onClick={closeMenu}>First 7 Days</a>
                  <a href="#paths" onClick={closeMenu}>Guided Path Map</a>
                  <a href="#games" onClick={closeMenu}>Recovery Games</a>
                  <a href="#progression" onClick={closeMenu}>Progression</a>
                </div>
              </div>
              <div className="mobile-menu-group">
                <h3>The Product</h3>
                <div className="mobile-menu-links" aria-label="Product links">
                  <a href="#principles" onClick={closeMenu}>Principles</a>
                  <a href="#tiers" onClick={closeMenu}>Free vs Paid Tiers</a>
                  <a href="#about" onClick={closeMenu}>About</a>
                </div>
              </div>
              <div className="mobile-menu-group">
                <h3>Get Started</h3>
                <div className="mobile-menu-links" aria-label="Get started links">
                  <a href="#faq" onClick={closeMenu}>FAQs</a>
                </div>
              </div>
              <a className="button mobile-menu-cta" href="#waitlist" onClick={closeMenu}>Join Waitlist</a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main">
        <section className="hero section" id="top" aria-labelledby="hero-title" ref={heroRef}>
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac"></span>
            <span className="shape shape-blue"></span>
            <span className="shape shape-lemon"></span>
            <span className="shape shape-coral"></span>
          </div>

          <div className="container hero-grid">
            <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: heroTextY }}>
              <motion.p className="eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.5, ease: revealEase }}>Privacy-first behaviour change</motion.p>
              <h1 id="hero-title" aria-label={heroHeadline}>
                {heroHeadline.split(" ").map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    className="hero-word"
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.5, ease: revealEase }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </h1>
              <motion.p className="hero-subhead" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.88, duration: 0.5, ease: revealEase }}>Impulsive helps you slow the loop before it becomes automatic. It notices risky moments, gives one clear recovery action, and saves what helped so your pattern can get weaker over time.</motion.p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="button" href="#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="#urge-loop">See how it works</a>
              </div>
              <ul className="hero-trust-chips" aria-label="Impulsive product notes">
                <li>Built in London</li>
                <li>Early beta</li>
              </ul>
            </motion.div>

            <motion.div className="hero-visual" aria-label="Impulsive app preview" style={reduceMotion ? undefined : { y: heroParallaxY }}>
              <motion.div className="phone" role="img" aria-label="Phone mockup showing a private recovery flow with trigger detection, path choices, and a short game prompt." ref={heroPhoneRef} style={reduceMotion ? undefined : { scale: heroPhoneScale, y: heroPhoneY, opacity: heroPhoneOpacity }}>
                <div className="phone-speaker" aria-hidden="true"></div>
                <div className="app-screen">
                  <div className="app-topbar">
                    <span>Impulsive</span>
                    <span className="privacy-pill">Private</span>
                  </div>

                  <div className="phone-card phone-card--trigger" aria-label="Trigger moment preview">
                    <span className="phone-card-label">Risky moment detected</span>
                    <p className="phone-card-sub">Recommended: 90-second reset</p>
                    <div className="phone-card-actions">
                      <button type="button" tabIndex={-1} className="phone-btn phone-btn--primary">Walk away</button>
                      <button type="button" tabIndex={-1} className="phone-btn phone-btn--ghost">Continue</button>
                    </div>
                  </div>

                  <div className="phone-card phone-card--paths" aria-label="Recovery paths preview">
                    <span className="phone-card-label">Recovery paths</span>
                    <div className="phone-paths-list">
                      <div className="phone-path-row psychology">
                        <span className="phone-path-dot" aria-hidden="true"></span>
                        <span><strong>Mind</strong> · Pause the pattern</span>
                      </div>
                      <div className="phone-path-row physical">
                        <span className="phone-path-dot" aria-hidden="true"></span>
                        <span><strong>Body</strong> · Change state</span>
                      </div>
                      <div className="phone-path-row spiritual">
                        <span className="phone-path-dot" aria-hidden="true"></span>
                        <span><strong>Soul</strong> · Ground privately</span>
                      </div>
                      <div className="phone-path-row synchrology">
                        <span className="phone-path-dot" aria-hidden="true"></span>
                        <span><strong>Nexus</strong> · Learns what works</span>
                      </div>
                    </div>
                  </div>

                  <div className="phone-card phone-card--game" aria-label="Recovery game preview">
                    <span className="phone-card-label">Recovery game</span>
                    <strong className="phone-game-name">Reflex Override</strong>
                    <p className="phone-game-desc">60-second challenge to interrupt autopilot</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

                <section className="section urge-loop-section" id="urge-loop" aria-labelledby="urge-loop-title">
          <div className="container">
            <RevealOnScroll className="section-heading urge-loop-heading">
              <p className="eyebrow">Recovery loop</p>
              <h2 id="urge-loop-title">Notice, interrupt, reduce.</h2>
              <p>Impulsive is built for the moment a difficult habit starts to move faster than motivation.</p>
            </RevealOnScroll>

            <motion.div className="urge-loop-grid" aria-label="What happens when Impulsive steps in" initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.15 }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
              <motion.div className="loop-glow-wrap" style={{ "--loop-color": "#D0C3F1" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: revealEase }}>
                <article className="urge-loop-card">
                  <span className="loop-marker" aria-hidden="true">01</span>
                  <div>
                    <h3>Notice</h3>
                    <p>Spot the time, place, emotion, app, or routine that usually starts the loop.</p>
                  </div>
                </article>
              </motion.div>

              <motion.div className="loop-glow-wrap" style={{ "--loop-color": "#BDE0FE" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: revealEase }}>
                <article className="urge-loop-card">
                  <span className="loop-marker" aria-hidden="true">02</span>
                  <div>
                    <h3>Interrupt</h3>
                    <p>Get one clear recovery action before autopilot takes over.</p>
                  </div>
                </article>
              </motion.div>

              <motion.div className="loop-glow-wrap" style={{ "--loop-color": "#FEF1AB" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: revealEase }}>
                <article className="urge-loop-card">
                  <span className="loop-marker" aria-hidden="true">03</span>
                  <div>
                    <h3>Reduce</h3>
                    <p>Save what helped and slowly weaken the pattern over time.</p>
                  </div>
                </article>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="section first-week-section" id="first-week" aria-labelledby="first-week-title" ref={firstWeekRef}>
          <div className="container first-week-grid">
            <RevealOnScroll className="first-week-intro">
              <p className="eyebrow">First 7 days</p>
              <h2 id="first-week-title">Your first 7 days with Impulsive</h2>
              <p>Impulsive does not throw every feature at you on day one. It starts with one clear recovery path, learns what helps, then unlocks stronger support when your pattern becomes clearer.</p>
            </RevealOnScroll>

            <motion.ol className="first-week-timeline" aria-label="Impulsive first week onboarding steps" initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.15 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li className={`first-week-step${activeWeekCard === 0 ? ' is-active' : ''}`} style={{ "--week-color": "var(--mind-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} animate={reduceMotion ? undefined : { scale: activeWeekCard === 0 ? 1.02 : 1 }}>
                <span className="week-dot" aria-hidden="true">1</span>
                <div>
                  <p className="week-label">Day 1</p>
                  <h3>Set your pattern</h3>
                  <p>Choose what you want to reduce, when triggers usually happen, and why it matters to you.</p>
                </div>
              </motion.li>

              <motion.li className={`first-week-step${activeWeekCard === 1 ? ' is-active' : ''}`} style={{ "--week-color": "var(--mind-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} animate={reduceMotion ? undefined : { scale: activeWeekCard === 1 ? 1.02 : 1 }}>
                <span className="week-dot" aria-hidden="true">2</span>
                <div>
                  <p className="week-label">Days 1-2</p>
                  <h3>Start with Mind Core</h3>
                  <p>Impulsive begins with the simplest low-friction reset: pause, name the urge, and choose one better action.</p>
                </div>
              </motion.li>

              <motion.li className={`first-week-step${activeWeekCard === 2 ? ' is-active' : ''}`} style={{ "--week-color": "var(--body-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} animate={reduceMotion ? undefined : { scale: activeWeekCard === 2 ? 1.02 : 1 }}>
                <span className="week-dot" aria-hidden="true">3</span>
                <div>
                  <p className="week-label">Days 3-4</p>
                  <h3>Build your first recovery proof</h3>
                  <p>Basic tapering, short recovery actions, and game rotation help you see what actually interrupts the loop.</p>
                </div>
              </motion.li>

              <motion.li className={`first-week-step${activeWeekCard === 3 ? ' is-active' : ''}`} style={{ "--week-color": "var(--soul-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} animate={reduceMotion ? undefined : { scale: activeWeekCard === 3 ? 1.02 : 1 }}>
                <span className="week-dot" aria-hidden="true">4</span>
                <div>
                  <p className="week-label">Day 5</p>
                  <h3>Preview the Path Map</h3>
                  <p>Body and Soul become visible as future support options, but they are not forced on you.</p>
                </div>
              </motion.li>

              <motion.li className={`first-week-step${activeWeekCard === 4 ? ' is-active' : ''}`} style={{ "--week-color": "var(--focus-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} animate={reduceMotion ? undefined : { scale: activeWeekCard === 4 ? 1.02 : 1 }}>
                <span className="week-dot" aria-hidden="true">5</span>
                <div>
                  <p className="week-label">Day 6+</p>
                  <h3>Choose your next strength level</h3>
                  <p>Stay free or explore stronger tools when you are in a calm progress moment.</p>
                </div>
              </motion.li>
            </motion.ol>
          </div>
        </section>

        <section className="section paths-section" id="paths" aria-labelledby="paths-title">
          <div className="container">
            <RevealOnScroll className="section-heading">
              <p className="eyebrow">Guided path map</p>
              <h2 id="paths-title">Four ways Impulsive supports the recovery loop</h2>
              <p>Impulsive starts with Mind first, then unlocks stronger support through movement, reflection, focus tools, and adaptive routing.</p>
            </RevealOnScroll>
            <motion.div className="path-cards" initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.15 }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
              <div
                className={`path-card-wrapper${flippedCards.has("mind") ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flippedCards.has("mind")}
                aria-label="Mind path. Click to see how it works."
                onClick={() => togglePathFlip("mind")}
                onKeyDown={(event) => handlePathKeyDown(event, "mind")}
              >
                <motion.article className="path-card psychology card-front" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
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
                </motion.article>

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
                <motion.article className="path-card physical card-front" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
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
                </motion.article>

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
                <motion.article className="path-card spiritual card-front" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
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
                </motion.article>

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
                <motion.article className="path-card synchrology card-front" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
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
                </motion.article>

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
                  <span className="card-flip-hint card-flip-hint-back" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M11 5l-7 7 7 7" /></svg>
                    <span>Back</span>
                  </span>
                </article>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section recovery-games-section" id="games" aria-labelledby="recovery-games-title" ref={reflexSectionRef}>
          <div className="container">
            <RevealOnScroll className="section-heading recovery-games-heading">
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
            </RevealOnScroll>

            <RevealOnScroll className="game-context-note">Reflex Override is the first recovery game. Impulsive is designed with 9 short interruption games in total.</RevealOnScroll>

            <RevealOnScroll className="featured-game-card" style={{ "--game-color": selectedGame.accent } as React.CSSProperties}>
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
              <motion.div className="featured-game-visual" style={reduceMotion ? undefined : { y: reflexPhoneY }}>
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
              </motion.div>
            </RevealOnScroll>

          </div>
        </section>

        <section className="section unlock-progression-section" id="progression" aria-labelledby="unlock-progression-title">
          <div className="container">
            <RevealOnScroll className="section-heading unlock-progression-heading">
              <p className="eyebrow">Level-based recovery</p>
              <h2 id="unlock-progression-title">Start tiny. Unlock strength.</h2>
            </RevealOnScroll>

            <motion.ol
              className="progression-path"
              aria-label="Impulsive progression path"
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
            >

              <motion.li
                className="progression-step progression-step--unlocked"
                style={{ "--prog-color": "var(--mind-color)" } as React.CSSProperties}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
                }}
              >
                <div className="prog-card">
                  <span className="prog-level-label">Level 1</span>
                  <h3 className="prog-card-title">First reset</h3>
                </div>
              </motion.li>

              <motion.li
                className="progression-step progression-step--unlocked"
                style={{ "--prog-color": "var(--soul-color)" } as React.CSSProperties}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
                }}
              >
                <div className="prog-card">
                  <span className="prog-level-label">Level 2</span>
                  <h3 className="prog-card-title">Taper progress</h3>
                </div>
              </motion.li>

              <motion.li
                className="progression-step progression-step--preview"
                style={{ "--prog-color": "var(--body-color)" } as React.CSSProperties}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
                }}
              >
                <div className="prog-card">
                  <span className="prog-level-label">Level 3</span>
                  <h3 className="prog-card-title">Path preview</h3>
                </div>
              </motion.li>

              <motion.li
                className="progression-step progression-step--choice"
                style={{ "--prog-color": "var(--brand-glow)" } as React.CSSProperties}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
                }}
              >
                <div className="prog-card">
                  <span className="prog-level-label">Level 4</span>
                  <h3 className="prog-card-title">Stronger support</h3>
                </div>
              </motion.li>

            </motion.ol>
          </div>
        </section>

        <section className="section tiers-section" id="tiers" aria-labelledby="tiers-title">
          <div className="container">
            <RevealOnScroll className="section-heading tiers-heading">
              <p className="eyebrow">Product boundaries</p>
              <h2 id="tiers-title">Free help first. Stronger tools later.</h2>
              <p>Impulsive should help first, then offer stronger tools later. Basic recovery support stays available during risky moments. Upgrade choices belong in calm progress moments, not during weakness.</p>
            </RevealOnScroll>

            <motion.div className="tiers-grid" initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.15 }} variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>

              <motion.article className="tier-card tier-card--free" style={{ "--tier-color": "var(--mind-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                <div className="tier-card-top">
                  <span className="tier-badge">Free</span>
                  <span className="tier-name">Impulsive Core</span>
                </div>
                <p className="tier-copy">Mind Core, basic trigger interruption, schedule taper, standard recovery games, Standard Focus, and a private local progress ledger.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>Enough to understand the app, build trust, and start interrupting the loop.</p>
                </div>
              </motion.article>

              <motion.article className="tier-card tier-card--invite" style={{ "--tier-color": "var(--brand-glow)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--invite">Invite &amp; Unlock</span>
                </div>
                <p className="tier-copy">Selected lifetime unlocks through real activated referrals. Slower and more limited than Plus.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>A fair route for users who cannot pay but can help others discover the app.</p>
                </div>
              </motion.article>

              <motion.article className="tier-card tier-card--plus" style={{ "--tier-color": "var(--focus-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--plus">One-time Plus</span>
                </div>
                <p className="tier-copy">Stronger paths, 2-out-of-3 path selection, advanced Nexus routing, Temperature Focus, deeper reports, premium games, and extra themes.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>A permanent stronger toolbox, not a subscription trap.</p>
                </div>
              </motion.article>

              <motion.article className="tier-card tier-card--cloud" style={{ "--tier-color": "var(--body-color)" } as React.CSSProperties} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                <div className="tier-card-top">
                  <span className="tier-badge tier-badge--cloud">Later: Cloud</span>
                </div>
                <p className="tier-copy">Only if needed later: encrypted backup, multi-device sync, accountability tools, community, and cloud AI.</p>
                <div className="tier-position">
                  <span className="tier-position-label">What it gives you</span>
                  <p>Future optional infrastructure, not the launch promise.</p>
                </div>
              </motion.article>

            </motion.div>

            <div className="tiers-rule-panel">
              <span className="tiers-rule-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <div>
                <h3>Calm unlock moments</h3>
                <p>Upgrade and referral prompts belong in progress screens, Settings, Path Map, or weekly review.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section problem-section" aria-labelledby="problem-title">
          <RevealOnScroll className="container split-panel">
            <div>
              <p className="eyebrow">The problem</p>
              <h2 id="problem-title">Most habit apps make one slip feel like failure.</h2>
            </div>
            <p>Many tools ask you to stay strong after the loop is already moving. Impulsive is designed to help earlier, when one clear action can still change the next step.</p>
          </RevealOnScroll>
        </section>


        <section className="section principles-section" id="principles" aria-labelledby="principles-title">
          <RevealOnScroll className="container section-text-column">
            <article className="credibility-pane credibility-pane--principles" aria-labelledby="principles-title">
              <p className="eyebrow"><strong>PRINCIPLES</strong></p>
              <h2 id="principles-title"><strong>Built without shame loops.</strong></h2>
              <p className="credibility-principles-line"><strong>No shame streaks. No fake scores. No trigger paywalls. Private by design.</strong></p>
              <div className="credibility-chips-group" aria-label="Recovery paths">
                <p className="credibility-chips-label">Recovery paths</p>
                <div className="credibility-chips">
                  <span className="credibility-chip" style={{ "--chip-color": "var(--mind-color)" } as React.CSSProperties}>Mind</span>
                  <span className="credibility-chip" style={{ "--chip-color": "var(--body-color)" } as React.CSSProperties}>Body</span>
                  <span className="credibility-chip" style={{ "--chip-color": "var(--soul-color)" } as React.CSSProperties}>Soul</span>
                  <span className="credibility-chip" style={{ "--chip-color": "var(--focus-color)" } as React.CSSProperties}>Focus</span>
                </div>
              </div>
            </article>
          </RevealOnScroll>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <RevealOnScroll className="container section-text-column">
            <article className="credibility-pane credibility-pane--about" aria-labelledby="about-title">
              <p className="eyebrow">ABOUT</p>
              <h2 id="about-title">Built carefully for private behaviour change.</h2>
              <ul className="about-credibility-lines" aria-label="About Impulsive">
                <li className="about-credibility-item">
                  <span className="about-bullet" aria-hidden="true"></span>
                  <p><strong>Privacy-first:</strong><span className="about-bullet-desc"> sensitive recovery records stay private and local-first by default.</span></p>
                </li>
                <li className="about-credibility-item">
                  <span className="about-bullet" aria-hidden="true"></span>
                  <p><strong>Careful language:</strong><span className="about-bullet-desc"> no cure claims, fake percentages, or medical promises.</span></p>
                </li>
                <li className="about-credibility-item">
                  <span className="about-bullet" aria-hidden="true"></span>
                  <p><strong>Review-ready:</strong><span className="about-bullet-desc"> clear enough for advisors, clinicians, and endorsement reviewers to understand.</span></p>
                </li>
              </ul>
              <div className="about-footer-row about-footer-row--disclaimer">
                <p className="about-disclaimer">Impulsive is not a substitute for therapy, diagnosis, crisis support, or professional medical advice. If you are in crisis, please contact your GP, a qualified therapist, or the Samaritans on 116 123.</p>
              </div>
            </article>
          </RevealOnScroll>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <RevealOnScroll className="section-heading">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">Questions before you join.</h2>
              <p className="faq-intro">Impulsive is built for private, difficult habit loops, so the answers should be clear before anyone signs up.</p>
            </RevealOnScroll>
            <div className="faq-list">
              <details className="faq-item">
                <summary>What does Impulsive actually do?</summary>
                <p>Impulsive is a behaviour-change app designed for the moment a habit loop accelerates. When a trigger starts, it gives you structured tools to pause and redirect — breathing patterns, body-focused grounding, short recovery games, and a calm reflection log. Between sessions it shows patterns over time so you can understand your own loop more clearly.</p>
              </details>
              <details className="faq-item">
                <summary>Is my data private?</summary>
                <p>Yes. Your patterns, triggers, and reflections are designed to stay on your device by default. We do not sell your data and we do not use advertising trackers. Any future backup or sync feature would be optional, opt-in, and clearly explained before use — never enabled by default.</p>
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
          <RevealOnScroll className="container waitlist-card">
            <div>
              <p className="eyebrow">Waitlist</p>
              <h2 id="waitlist-title">Join the Impulsive waitlist.</h2>
              <p>Get notified when Impulsive is ready for wider testing or release.</p>
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
                <button className="button" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="button-spinner" aria-hidden="true" />
                      <span>Sending…</span>
                    </>
                  ) : "Join Waitlist"}
                </button>
              </div>
              {formStatus.message && (
                <p className="form-note" data-state={formStatus.type} aria-live="polite">
                  {formStatus.message}
                </p>
              )}
              <p className="waitlist-privacy-note">Your email is only used for Impulsive updates. Want to leave the waitlist? Email <a href="mailto:hello@useimpulsive.com">hello@useimpulsive.com</a>.</p>
            </form>
          </RevealOnScroll>
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
            <a href="#urge-loop">How it works</a>
            <a href="#paths">Paths</a>
            <a href="#games">Games</a>
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

    </div>
  );
}
