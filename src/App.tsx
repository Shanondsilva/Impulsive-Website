import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AmbientParticles } from './components/AmbientParticles';
import { BrandLogo } from './components/BrandLogo';
import { PageBlobs } from './components/PageBlobs';
import { RevealOnScroll } from './components/RevealOnScroll';
import { useDarkMode } from './hooks/useDarkMode';

const currentGames = [
  { name: 'Snake', description: 'Guide the snake, collect fruit, and stay with one moving goal.' },
  { name: 'Block Cascade', description: 'A time-boxed block round with a clear finish state.' },
  { name: 'SkyStack', description: 'Place sliding blocks and build a steady tower.' },
  { name: 'Rhythm Tiles', description: 'Redirect attention with a paced rhythm challenge.' },
];

const productFeatures = [
  {
    title: 'My Moment Plan',
    text: 'Prepare a simple next step before a difficult moment. Impulsive keeps track of the exact plan revision so later history refers to the plan you actually prepared.',
  },
  {
    title: 'Familiar Steps',
    text: 'A previous route is suggested again only after enough comparable, favourable history exists. Weak, stale or unsuitable evidence does not force a personal suggestion.',
  },
  {
    title: 'Short structured support',
    text: 'Create space before acting through a short pause, reset content, a prepared plan or a brief attention-shifting activity. The aim is interruption and redirection, not endless engagement.',
  },
  {
    title: 'Protection when you choose it',
    text: 'Optional app and website protection can add friction around selected digital triggers. Protection supports the behaviour-change journey rather than defining the whole product.',
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useDarkMode();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
      menuToggleRef.current?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={menuOpen ? 'menu-open' : ''}>
      <AmbientParticles active={theme === 'dark'} />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} data-header>
        <nav className="nav" aria-label="Primary navigation">
          <div className="nav-left">
            <a className="wordmark" href="#top" aria-label="Impulsive home">
              <BrandLogo />
              <span>Impulsive</span>
            </a>
            <div className="nav-links nav-links--desktop" aria-label="Primary site links">
              <a href="#how-it-works">How it works</a>
              <a href="#product">Product</a>
              <a href="#privacy">Privacy</a>
              <a href="#about">About</a>
              <a href="#faq">FAQs</a>
            </div>
          </div>
          <div className="nav-right">
            <a className="button button-small header-cta" href="/impulsive-app">Android release</a>
            <button
              ref={themeToggleRef}
              className="theme-toggle"
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => toggle(themeToggleRef.current)}
            >
              <span className="theme-toggle-icon" aria-hidden="true">{theme === 'dark' ? <Sun /> : <Moon />}</span>
              <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              onClick={() => setMenuOpen((value) => !value)}
              ref={menuToggleRef}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <>
          <button type="button" className="mobile-menu-overlay" aria-label="Close menu" onClick={closeMenu} />
          <div id="mobile-menu-panel" role="dialog" aria-modal="true" aria-labelledby="menu-title" className="mobile-menu-panel" data-lenis-prevent>
            <div className="mobile-menu-head">
              <h2 className="mobile-menu-title" id="menu-title">Menu</h2>
              <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={closeMenu}><X size={24} /></button>
            </div>
            <div className="mobile-menu-group mobile-menu-group--nav-only">
              <h3>Explore</h3>
              <div className="mobile-menu-links">
                <a href="#how-it-works" onClick={closeMenu}>How it works</a>
                <a href="#product" onClick={closeMenu}>Product</a>
                <a href="#privacy" onClick={closeMenu}>Privacy</a>
                <a href="#about" onClick={closeMenu}>About</a>
                <a href="#faq" onClick={closeMenu}>FAQs</a>
              </div>
            </div>
            <a className="button mobile-menu-cta" href="/impulsive-app" onClick={closeMenu}>Android release</a>
          </div>
        </>
      )}

      <main id="main">
        <PageBlobs />
        <section className="hero section" id="top" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac" />
            <span className="shape shape-blue" />
            <span className="shape shape-lemon" />
            <span className="shape shape-coral" />
          </div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Privacy-first behaviour-change support</p>
              <h1 id="hero-title">A private pause before the habit takes over.</h1>
              <p className="hero-subhead">Impulsive helps adults interrupt difficult digital habit moments, create space before acting, redirect through a short structured intervention and build more deliberate patterns over time.</p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="button" href="/impulsive-app">View the Android release</a>
                <a className="button button-secondary" href="#how-it-works">See how it works</a>
              </div>
              <ul className="hero-trust-chips" aria-label="Impulsive product notes">
                <li>Released through Google Play</li>
                <li>Private by design</li>
                <li>No shame or streak pressure</li>
                <li>Not therapy or medical treatment</li>
              </ul>
            </div>

            <div className="hero-visual" aria-label="Impulsive app preview">
              <div className="orbit-card card-calm">One clear next step</div>
              <div className="orbit-card card-trigger">Protection supports the journey</div>
              <div className="phone" role="img" aria-label="Illustrative Impulsive app preview showing a prepared Moment Plan and a Familiar Step.">
                <div className="phone-speaker" aria-hidden="true" />
                <div className="app-screen">
                  <div className="app-topbar"><span>Impulsive</span><span className="privacy-pill">Private</span></div>
                  <section className="today-plan">
                    <p>My Moment Plan</p>
                    <h2>Your next step is ready</h2>
                    <div className="plan-row"><span>Prepared action</span><strong>Move the phone out of reach</strong></div>
                  </section>
                  <section className="intervention">
                    <div><span className="mini-label">Familiar Step</span><strong>Shown only when enough comparable history qualifies</strong></div>
                    <button type="button" tabIndex={-1}>Choose</button>
                  </section>
                  <section className="progress">
                    <div className="progress-copy"><span>Private history</span><strong>Recommendation and your actual choice stay separate</strong></div>
                  </section>
                  <aside className="focus-note"><span>Your control stays central</span><strong>Insufficient or stale evidence falls back instead of forcing a personal suggestion.</strong></aside>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section urge-loop-section" id="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <RevealOnScroll className="section-heading urge-loop-heading">
              <p className="eyebrow">How it works</p>
              <h2 id="how-title">Prepare. Pause. Learn carefully.</h2>
              <p>Impulsive is designed around what happens before, during and after a difficult digital habit moment.</p>
            </RevealOnScroll>
            <div className="urge-loop-grid">
              <article className="urge-loop-card"><span className="loop-marker">01</span><div><h3>Prepare</h3><p>Create a My Moment Plan in advance so a clear next step is available when the moment is harder.</p></div></article>
              <article className="urge-loop-card"><span className="loop-marker">02</span><div><h3>Pause and choose</h3><p>Use a short structured intervention, a prepared plan or another eligible route. The system recommendation and your actual choice are recorded separately.</p></div></article>
              <article className="urge-loop-card"><span className="loop-marker">03</span><div><h3>Learn carefully</h3><p>Completion, feedback and later observation remain distinct. A Familiar Step can reappear only after enough comparable favourable history qualifies.</p></div></article>
            </div>
          </div>
        </section>

        <section className="section paths-section" id="product" aria-labelledby="product-title">
          <div className="container">
            <RevealOnScroll className="section-heading">
              <p className="eyebrow">Current product</p>
              <h2 id="product-title">Support that goes beyond simply blocking access.</h2>
              <p>Protection can add friction, but the product is centred on helping a user prepare, interrupt a difficult moment, choose a next step and build trustworthy personal history.</p>
            </RevealOnScroll>
            <div className="path-cards">
              {productFeatures.map((feature) => (
                <article className="path-card psychology card-front" key={feature.title}>
                  <div className="card-topline"><span className="soft-icon symbol-icon" aria-hidden="true">✦</span><span className="status-pill">Current</span></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section recovery-games-section" id="games" aria-labelledby="games-title">
          <div className="container">
            <RevealOnScroll className="section-heading recovery-games-heading">
              <p className="eyebrow">Short attention shifts</p>
              <h2 id="games-title">Brief games are one intervention route, not the product itself.</h2>
              <p>The current game catalogue uses short, time-boxed activities to redirect attention during a difficult moment. The objective is to create space and return to a deliberate next step.</p>
            </RevealOnScroll>
            <div className="path-cards">
              {currentGames.map((game) => (
                <article className="path-card physical card-front" key={game.name}>
                  <div className="card-topline"><span className="soft-icon symbol-icon" aria-hidden="true">●</span><span className="status-pill">90 sec</span></div>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section principles-section" id="privacy" aria-labelledby="privacy-title">
          <RevealOnScroll className="container section-text-column">
            <article className="credibility-pane credibility-pane--principles animated-foundation-card">
              <p className="eyebrow"><strong>PRIVACY</strong></p>
              <h2 id="privacy-title"><strong>Sensitive behavioural information stays local by default.</strong></h2>
              <p>Impulsive stores sensitive behavioural and recovery information on the device by default. Eligible users can choose optional encrypted recovery routes. Account, subscription, security and diagnostic services process limited information where needed to provide those functions.</p>
              <p><a className="button button-secondary" href="/privacy.html">Read the Privacy Policy</a></p>
            </article>
          </RevealOnScroll>
        </section>

        <section className="section tiers-section" id="access" aria-labelledby="access-title">
          <div className="container">
            <RevealOnScroll className="section-heading tiers-heading">
              <p className="eyebrow">Current access</p>
              <h2 id="access-title">Core support first. Optional paid features through Google Play.</h2>
              <p>Impulsive is distributed on Android through Google Play. Where a Plus subscription is offered, billing is handled through Google Play. The exact offer shown in Google Play controls the price and purchase terms available to that user.</p>
            </RevealOnScroll>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <RevealOnScroll className="container about-article-container">
            <article className="about-article animated-foundation-card">
              <header className="about-article__header"><h2 id="about-title">About Impulsive</h2></header>
              <div className="about-article__content">
                <p>Impulsive was founded and developed by Shanon Dsilva through IMPULSIVE LTD. The product began from a practical question: what can help at the difficult moment itself, rather than relying only on restriction, willpower or a later progress screen?</p>
                <p>The resulting product uses preparation, short interruption, user choice and cautiously qualified personal history. Visible features such as blocking, games or privacy are not presented as individually new. The focus is on how those parts work together to support a more deliberate next action.</p>
                <p>Product development has also been informed by feedback from practitioners working in psychosexual therapy, behavioural support and related fields. Their input has influenced tone, grounding, discreet presentation and product-development decisions. This practitioner engagement is not presented as clinical validation or evidence of treatment efficacy.</p>
                <p className="about-article__disclaimer">Impulsive is a behaviour-change support tool for adults. It is not a medical device, therapy service, diagnosis tool, crisis-support service or clinically validated treatment.</p>
              </div>
            </article>
          </RevealOnScroll>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <RevealOnScroll className="section-heading">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">Clear answers about the current product.</h2>
            </RevealOnScroll>
            <div className="faq-list">
              <details className="faq-item"><summary>Is Impulsive just a blocker?</summary><p>No. Optional app and website protection can add friction around selected triggers, but the core product supports preparation, interruption, choice and later evidence-qualified reuse through My Moment Plans and Familiar Steps.</p></details>
              <details className="faq-item"><summary>What is a Familiar Step?</summary><p>A Familiar Step is a previous route that becomes eligible for reuse only after enough comparable and favourable history exists. If the evidence is insufficient, stale, unsupported or unsuitable, Impulsive falls back instead of forcing that suggestion.</p></details>
              <details className="faq-item"><summary>Is Impulsive available now?</summary><p>Yes. Impulsive has launched through Google Play for Android. Availability can depend on the Google Play release or testing access that applies to a particular account or region.</p></details>
              <details className="faq-item"><summary>Is my information private?</summary><p>Sensitive behavioural and recovery information is stored on your device by default. Optional encrypted cloud recovery and services such as authentication, billing, app integrity and crash diagnostics can involve limited off-device processing. The Privacy Policy explains the current data flows.</p></details>
              <details className="faq-item"><summary>Is Impulsive therapy or medical treatment?</summary><p>No. Impulsive is a behaviour-change support tool. It does not diagnose, treat, cure or prevent a medical or mental-health condition and is not emergency or crisis support.</p></details>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a className="wordmark" href="#top" aria-label="Impulsive home"><BrandLogo /><span>Impulsive</span></a>
            <p className="footer-tagline">Private behaviour-change support for adults.</p>
            <p className="footer-location">Developed in the United Kingdom by IMPULSIVE LTD</p>
          </div>
          <nav className="footer-nav" aria-label="Product links"><h3>Product</h3><a href="/impulsive-app">Impulsive App</a><a href="/how-impulsive-works">How it works</a><a href="/focus-mode">Focus support</a></nav>
          <nav className="footer-nav" aria-label="Support links"><h3>Support</h3><a href="#faq">FAQs</a><a href="mailto:hello@useimpulsive.com">Contact</a></nav>
          <nav className="footer-nav" aria-label="Legal links"><h3>Legal</h3><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/delete-account">Delete account</a></nav>
        </div>
        <div className="container footer-base">
          <div className="footer-base-text"><p className="footer-disclaimer">Impulsive helps adults create a pause, choose a next step and understand difficult habit patterns. It is not therapy, diagnosis or crisis support.</p></div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} IMPULSIVE LTD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
