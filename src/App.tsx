import React, { useEffect, useState, useRef, type KeyboardEvent } from 'react';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState(Date.now().toString());
  
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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
          <a className="wordmark" href="#top" aria-label="Impulsive home">
            <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="Impulsive logo" />
            <span>Impulsive</span>
          </a>
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
              <h1 id="hero-title">Built for habits that do not break with willpower.</h1>
              <p className="hero-subhead">Impulsive helps you slow the loop, understand your patterns, and take one better action at the right moment through calm, private, structured behaviour change.</p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="button" href="#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="#how-it-works">See how it works</a>
              </div>
              <p className="trust-line">Private by design. Built in London. Launching soon.</p>
            </div>

            <div className="hero-visual reveal" aria-label="Impulsive app preview">
              <div className="orbit-card card-calm">Level path, not open chaos</div>
              <div className="orbit-card card-trigger">No paywall in a trigger</div>
              <div className="phone">
                <div className="phone-speaker" aria-hidden="true"></div>
                <div className="app-screen">
                  <div className="app-topbar">
                    <span>Impulsive</span>
                    <span className="privacy-pill">Private</span>
                  </div>

                  <section className="today-plan" aria-label="Today's plan preview">
                    <p>Today's plan</p>
                    <h2>Start with Psychological Core</h2>
                    <div className="plan-row">
                      <span>Trigger window</span>
                      <strong>7:45-9:15pm</strong>
                    </div>
                  </section>

                  <section className="intervention">
                    <div>
                      <span className="mini-label">Calm intervention</span>
                      <strong>90-second reset</strong>
                    </div>
                    <button type="button" aria-label="Calm intervention preview" tabIndex={-1}>Start</button>
                  </section>

                  <section className="progress">
                    <div className="progress-copy">
                      <span>Progress / taper bar</span>
                      <strong>Level 3 of 8</strong>
                    </div>
                    <div className="progress-track" aria-hidden="true"><span></span></div>
                  </section>

                  <section className="phone-paths" aria-label="Recovery path preview">
                    <article className="phone-path psychology">
                      <span className="app-icon symbol-icon" aria-hidden="true">&#10022;</span>
                      <div>
                        <strong>Mind</strong>
                        <small>Default path</small>
                      </div>
                    </article>
                    <article className="phone-path physical">
                      <span className="app-icon image-icon" aria-hidden="true">
                        <img src="/images/icons/impulsive-body.png" alt="" />
                      </span>
                      <div>
                        <strong>Body</strong>
                        <small>Unlocks later</small>
                      </div>
                    </article>
                    <article className="phone-path spiritual">
                      <span className="app-icon image-icon" aria-hidden="true">
                        <img src="/images/icons/impulsive-soul.png" alt="" />
                      </span>
                      <div>
                        <strong>Soul</strong>
                        <small>Optional unlock</small>
                      </div>
                    </article>
                    <article className="phone-path synchrology">
                      <span className="app-icon image-icon" aria-hidden="true">
                        <img src="/images/icons/impulsive-nexus.png" alt="" />
                      </span>
                      <div>
                        <strong>Nexus</strong>
                        <small>Adaptive engine</small>
                      </div>
                    </article>
                  </section>

                  <aside className="focus-note">
                    <span>Focus Mode</span>
                    <strong>Start focus, recover, resume smoothly.</strong>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section paths-section" id="paths" aria-labelledby="paths-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Guided path map</p>
              <h2 id="paths-title">Choose the support that fits the moment.</h2>
              <p>Impulsive starts simple with Psychological Core, learns your trigger pattern, then unlocks stronger support when you have enough progress to use it well.</p>
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
                    <span className="soft-icon symbol-icon" aria-hidden="true">&#10022;</span>
                    <span className="status-pill">Starts first</span>
                  </div>
                  <h3>Mind</h3>
                  <p>A calm first layer that helps you pause, name the pattern, and choose one better action before the loop takes over.</p>
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
                  <p className="card-back-tag">When something pulls at you, Mind helps you stop, look at it, and choose a calmer next move.</p>
                  <p className="card-back-section-h">How it works</p>
                  <ol className="card-back-steps">
                    <li>You notice the urge as a wave coming through, not a command you have to follow.</li>
                    <li>You name what is actually pulling at you. Boredom, loneliness, something you saw earlier.</li>
                    <li>You pick one small thing to do instead. A breath exercise, urge surfing, or a few honest lines in a journal.</li>
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
                    <span className="soft-icon image-icon" aria-hidden="true">
                      <img src="/images/icons/impulsive-body.png" alt="" />
                    </span>
                    <span className="status-pill">Unlocks later</span>
                  </div>
                  <h3>Body</h3>
                  <p>A movement-based reset that helps you change state, leave the trigger environment, and interrupt the moment through action.</p>
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
                  <p className="card-back-tag">Sometimes you cannot think your way out of an urge. You have to move out of it. That is what Body is for.</p>
                  <p className="card-back-section-h">How it works</p>
                  <ol className="card-back-steps">
                    <li>You leave the room you got triggered in. The app does a quiet check that you actually moved.</li>
                    <li>You start a short walk. Five, ten, or fifteen minutes, depending on how strong the urge is.</li>
                    <li>The walk is checked in a private, simple way. Time, motion, and where you went. Nothing is shared.</li>
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
              <article className="path-card spiritual reveal">
                <div className="card-topline">
                  <span className="soft-icon image-icon" aria-hidden="true">
                    <img src="/images/icons/impulsive-soul.png" alt="" />
                  </span>
                  <span className="status-pill">Optional</span>
                </div>
                <h3>Soul</h3>
                <p>An optional grounding path for reflection, values, prayer, or recommitment without shame or pressure.</p>
              </article>
              <article className="path-card synchrology reveal">
                <div className="card-topline">
                  <span className="soft-icon image-icon" aria-hidden="true">
                    <img src="/images/icons/impulsive-nexus.png" alt="" />
                  </span>
                  <span className="status-pill">Engine</span>
                </div>
                <h3>Nexus</h3>
                <p>The adaptive engine that learns what works and coordinates the right support across your recovery paths.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section problem-section" aria-labelledby="problem-title">
          <div className="container split-panel reveal">
            <div>
              <p className="eyebrow">The problem</p>
              <h2 id="problem-title">Most habit apps make one slip feel like failure.</h2>
            </div>
            <p>Many tools rely on pressure, streaks, hard blocking, and shame. Impulsive is designed differently. It helps users pause, redirect, and review progress without turning a difficult moment into an identity.</p>
          </div>
        </section>

        <section className="section solution-section" aria-labelledby="solution-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">The Impulsive loop</p>
              <h2 id="solution-title">A calmer recovery loop.</h2>
            </div>
            <div className="feature-grid">
              <article className="feature-card reveal">
                <span className="number">01</span>
                <h3>Notice the pattern</h3>
                <p>Understand your recurring cues, time windows, emotions, and environments with private reflection.</p>
              </article>
              <article className="feature-card reveal">
                <span className="number">02</span>
                <h3>Interrupt the moment</h3>
                <p>Use a soft prompt, short exercise, movement reset, or focus shift when the habit loop begins to accelerate.</p>
              </article>
              <article className="feature-card reveal">
                <span className="number">03</span>
                <h3>Reduce the loop over time</h3>
                <p>Review what helped, taper intensity, and keep moving without streak pressure or perfection rules.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section progression-section" aria-labelledby="progression-title">
          <div className="container progression-panel reveal">
            <div>
              <p className="eyebrow">Progression, not overwhelm</p>
              <h2 id="progression-title">Start tiny. Unlock strength.</h2>
              <p>The first experience is one trigger interruption, one recommended action, one progress bar, and one clear next unlock. Premium and referrals belong in calm progress moments, never when someone is trying to get help quickly.</p>
            </div>
            <ol className="level-map" aria-label="Impulsive level path preview">
              <li><span>1</span>Psychological Core</li>
              <li><span>3</span>Schedule taper card</li>
              <li><span>5</span>Path preview</li>
              <li><span>8</span>Full Nexus engine</li>
            </ol>
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

        <section className="section focus-section" aria-labelledby="focus-title">
          <div className="container focus-panel reveal">
            <div>
              <p className="eyebrow">Supporting feature</p>
              <h2 id="focus-title">Focus Mode helps you return without friction.</h2>
            </div>
            <p>Focus Mode supports the loop around recovery: start focus, recover from interruption, and resume smoothly. It stays separate from Nexus, the adaptive engine that coordinates your recovery paths behind the scenes.</p>
          </div>
        </section>

        <section className="section principles-section" id="principles" aria-labelledby="principles-title">
          <div className="container principles-panel reveal">
            <div>
              <p className="eyebrow">Principles</p>
              <h2 id="principles-title">What Impulsive will never do.</h2>
            </div>
            <ul className="principles-list">
              <li>
                <strong>No humiliation.</strong>
                <span>We never use shame, gamification, or punishment to push behaviour. Slips are data, not failures.</span>
              </li>
              <li>
                <strong>No panic design.</strong>
                <span>No red flashes, alarming notifications, or "you broke your streak" pressure tactics.</span>
              </li>
              <li>
                <strong>No fake recovery scores.</strong>
                <span>We do not invent percentages or fake metrics that pretend to measure something we cannot.</span>
              </li>
              <li>
                <strong>No paywall during a trigger moment.</strong>
                <span>The help you need at a hard moment is always free. Premium lives in calm progress, never in crisis.</span>
              </li>
              <li>
                <strong>No addiction to the app itself.</strong>
                <span>We measure success by you needing us less, not by you opening the app more.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="container about-panel reveal">
            <div>
              <p className="eyebrow">About</p>
              <h2 id="about-title">Built carefully, in London.</h2>
            </div>
            <div className="about-copy">
              <p>Impulsive is being built in London for people working through difficult, compulsive habits. The product is being shaped in conversation with clinicians, researchers, and people with lived experience of habit recovery.</p>
              <ul className="about-points">
                <li>
                  <strong>Privacy by default.</strong>
                  <span>No third-party advertising trackers. Your patterns, triggers, and reflections stay yours.</span>
                </li>
                <li>
                  <strong>Designed alongside clinical care.</strong>
                  <span>Impulsive is not a replacement for therapy. It is built to sit alongside professional support.</span>
                </li>
                <li>
                  <strong>Honest about what we do.</strong>
                  <span>If you are in crisis, please contact your GP, a qualified therapist, or the Samaritans on 116 123.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Common questions</p>
              <h2 id="faq-title">Things people ask before joining.</h2>
            </div>
            <div className="faq-list">
              <details className="faq-item reveal">
                <summary>Is my data private?</summary>
                <p>Yes. Impulsive is privacy-first. Your patterns, triggers, and reflections stay on your device by default. We do not sell data and we do not use third-party advertising trackers.</p>
              </details>
              <details className="faq-item reveal">
                <summary>How is this different from a habit tracker or a blocker app?</summary>
                <p>Trackers measure streaks. Blockers add friction. Impulsive is designed for the moment a loop starts to accelerate. It helps you pause, redirect, and review what worked, without shame metrics or hard blocks that tend to break under pressure.</p>
              </details>
              <details className="faq-item reveal">
                <summary>Is Impulsive a replacement for therapy?</summary>
                <p>No. Impulsive is designed to sit alongside professional support, not replace it. If you are in crisis or want clinical care, please speak to a qualified therapist, your GP, or contact the Samaritans on 116 123.</p>
              </details>
              <details className="faq-item reveal">
                <summary>When will Impulsive be available?</summary>
                <p>We are building carefully and testing with a small group first. Join the waitlist and we will notify you when access opens.</p>
              </details>
              <details className="faq-item reveal">
                <summary>How will pricing work?</summary>
                <p>The core help — the parts you need at a hard moment — will always be free. Premium features will live in calm progress moments, never in crisis.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="section waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
          <div className="container waitlist-card reveal">
            <div>
              <p className="eyebrow">Waitlist</p>
              <h2 id="waitlist-title">Join the waitlist.</h2>
              <p>Add your email and we will let you know when Impulsive opens up. We are building it carefully, in London, for people who want a calmer, more structured way to work on difficult habits.</p>
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
                  {isSubmitting ? "Sending..." : "Join the waitlist"}
                </button>
              </div>
              {formStatus.message && (
                <p className="form-note" data-state={formStatus.type} aria-live="polite">
                  {formStatus.message}
                </p>
              )}
              {!formStatus.message && (
                <p className="form-note" aria-live="polite">
                  Add your email and we will let you know when Impulsive is ready.
                </p>
              )}
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
            <p className="footer-tagline">Privacy-first behaviour change. Built in London.</p>
          </div>
          <nav className="footer-nav" aria-label="Product links">
            <h3>Product</h3>
            <a href="#how-it-works">How it works</a>
            <a href="#paths">Paths</a>
            <a href="#principles">Principles</a>
            <a href="#faq">FAQ</a>
          </nav>
          <nav className="footer-nav" aria-label="Company links">
            <h3>Company</h3>
            <a href="#about">About</a>
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
          <p>&copy; {new Date().getFullYear()} Impulsive. All rights reserved.</p>
          <p>useimpulsive.com</p>
        </div>
      </footer>
    </div>
  );
}
