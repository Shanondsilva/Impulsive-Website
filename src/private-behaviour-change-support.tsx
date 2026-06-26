import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AmbientParticles } from './components/AmbientParticles';
import { BrandLogo } from './components/BrandLogo';
import { RevealOnScroll } from './components/RevealOnScroll';
import { SmoothScroll } from './components/SmoothScroll';
import { useDarkMode } from './hooks/useDarkMode';
import './index.css';
import './lib/darkModeAnimation.css';

const faqs = [
  {
    question: 'What is private behaviour change support?',
    answer:
      'Private behaviour change support is help that gives someone a calmer way to pause, choose a better next step, and understand a difficult habit pattern without public pressure or shame.',
  },
  {
    question: 'Why does privacy matter for behaviour change?',
    answer:
      'Privacy matters because difficult habit moments can feel sensitive. If support feels exposed or judgmental, people may avoid using it when they need it most.',
  },
  {
    question: 'Is Impulsive a therapy app?',
    answer:
      'No. Impulsive is not therapy, medical treatment, diagnosis, or emergency support. It is a private support tool for behaviour change.',
  },
  {
    question: 'How does Impulsive help during a difficult moment?',
    answer:
      'Impulsive is designed to help the user notice the moment, choose one clear pivot action, and understand the pattern afterwards without shame.',
  },
  {
    question: 'Is Impulsive only a blocker?',
    answer:
      'No. Blocking can be part of support, but Impulsive is focused on helping the user create a better response pattern before the habit loop takes over.',
  },
  {
    question: 'Can I join the waitlist?',
    answer:
      'Yes. You can join the waitlist to follow the early development of Impulsive and be notified when early access becomes available.',
  },
];

function PrivateBehaviourChangeSupportPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useDarkMode();

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

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>('#mobile-menu-panel a, #mobile-menu-panel button'),
    );
    focusables[0]?.focus();

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
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
            <a className="wordmark" href="/" aria-label="Impulsive home">
              <BrandLogo />
              <span>Impulsive</span>
            </a>
            <div className="nav-links nav-links--desktop" aria-label="Primary site links">
              <a href="/how-impulsive-works">How it works</a>
              <a href="/#principles">Principles</a>
              <a href="/#faq">FAQs</a>
            </div>
          </div>
          <div className="nav-right">
            <a className="button button-small header-cta" href="/#waitlist">Join Waitlist</a>
            <button
              ref={themeToggleRef}
              className="theme-toggle"
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => toggle(themeToggleRef.current)}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'dark' ? <Sun /> : <Moon />}
              </span>
              <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              onClick={() => setMenuOpen(!menuOpen)}
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
              <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={closeMenu}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-menu-group mobile-menu-group--nav-only">
              <h3>Explore</h3>
              <div className="mobile-menu-links" aria-label="Explore links">
                <a href="/" onClick={closeMenu}>Home</a>
                <a href="/how-impulsive-works" onClick={closeMenu}>How Impulsive Works</a>
                <a href="/#principles" onClick={closeMenu}>Principles</a>
                <a href="/#faq" onClick={closeMenu}>FAQs</a>
              </div>
            </div>
            <a className="button mobile-menu-cta" href="/#waitlist" onClick={closeMenu}>Join Waitlist</a>
          </div>
        </>
      )}

      <main id="main" className="seo-page">
        <section className="section seo-hero" aria-labelledby="private-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac" />
            <span className="shape shape-blue" />
            <span className="shape shape-lemon" />
            <span className="shape shape-coral" />
          </div>
          <div className="container seo-hero-inner">
            <RevealOnScroll className="seo-hero-copy">
              <p className="eyebrow">Private behaviour change support</p>
              <h1 id="private-title">Private Behaviour Change Support</h1>
              <p>
                Changing a difficult habit is rarely as simple as telling yourself to stop. In the real moment, people often
                need something calmer, more private, and easier to act on.
              </p>
              <p>
                Impulsive is being built as private behaviour change support for difficult habit moments. The goal is to help
                users pause before the loop takes over, choose one clear pivot action, and understand their pattern without shame.
              </p>
              <div className="hero-actions">
                <a className="button" href="/#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="/how-impulsive-works">How Impulsive works</a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="section seo-content-section">
          <div className="container seo-content-grid">
            <RevealOnScroll className="seo-article">
              <section className="seo-copy-block" aria-labelledby="willpower-title">
                <h2 id="willpower-title">Behaviour change needs more than willpower</h2>
                <p>Most people do not struggle with difficult habits because they lack intelligence or motivation. The problem is that a habit loop can become fast, familiar, and automatic.</p>
                <p>By the time the person notices what is happening, the behaviour may already feel close. That is why willpower alone often feels weak in the exact moment it is needed most.</p>
                <p>Private behaviour change support should help earlier. It should create a pause before the automatic action, reduce overwhelm, and guide the person toward one better next step.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="privacy-title">
                <h2 id="privacy-title">Why privacy matters</h2>
                <p>Difficult habit moments can feel personal, sensitive, or embarrassing. If support feels exposed, judgmental, or too public, people may avoid using it when they need it most.</p>
                <p>Private behaviour change support should feel calm and discreet. The user should not feel watched, shamed, or turned into a public score.</p>
                <p>Impulsive is being designed around that idea: support should be useful in the moment, but still private enough that the user feels safe opening it.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="moment-title">
                <h2 id="moment-title">The difficult moment before the habit loop</h2>
                <p>The most important moment is often the short space before the habit takes over.</p>
                <p>This is when the person may feel bored, stressed, tired, restless, lonely, distracted, or pulled toward something familiar. The behaviour may not have happened yet, but the loop has already started.</p>
                <p>Private behaviour change support should focus on this moment. The goal is to help the user notice what is happening early enough to choose a different next step.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="support-title">
                <h2 id="support-title">How private support can help</h2>
                <p>Private support works best when it is simple enough to use during the moment itself.</p>
                <p>Instead of giving the user a long list of options, the support should guide them toward one clear action. That action could be a short reset, a focus step, a movement prompt, a reflection, or another small interruption that creates distance from the automatic loop.</p>
                <p>The purpose is not to make the user feel perfect. The purpose is to help them pause, regain a little control, and make the next action more intentional.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="impulsive-title">
                <h2 id="impulsive-title">How Impulsive supports behaviour change</h2>
                <p>Impulsive is designed around a simple loop: Notice, Pivot, Understand.</p>
                <div className="seo-loop-list">
                  <article>
                    <h3>Notice</h3>
                    <p>Notice means recognising that a difficult habit moment is starting.</p>
                  </article>
                  <article>
                    <h3>Pivot</h3>
                    <p>Pivot means choosing one clear next action before the loop takes over.</p>
                  </article>
                  <article>
                    <h3>Understand</h3>
                    <p>Understand means reviewing what happened afterwards without shame, so the user can learn their pattern over time.</p>
                  </article>
                </div>
                <p>This makes Impulsive different from tools that only focus on blocking or punishment. The aim is to help the user build a better response pattern privately and gradually.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="different-title">
                <h2 id="different-title">What makes Impulsive different</h2>
                <p>Impulsive is not designed to scare users, shame them, or overwhelm them with too many choices.</p>
                <p>The product is built around a calmer idea: when a difficult habit moment starts, the user should receive one clear private pivot before the automatic loop becomes stronger.</p>
                <p>Impulsive combines behaviour-change support, focus recovery, privacy, and gradual learning. Over time, the app should help the user understand which moments, patterns, and responses matter most.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="not-title">
                <h2 id="not-title">What Impulsive is not</h2>
                <p>Impulsive is not a medical device, diagnosis tool, therapy replacement, or emergency support service. It does not claim to cure, treat, or prevent any condition.</p>
                <p>It is also not designed to shame users, punish them, or make them feel like one difficult moment means they have failed.</p>
                <p>Impulsive is private behaviour change support. Its purpose is to help users pause before a difficult habit moment, choose one better action, and understand their pattern with more clarity.</p>
              </section>

              <section className="seo-copy-block seo-join-block" aria-labelledby="join-title">
                <h2 id="join-title">Join the waitlist</h2>
                <p>Impulsive is currently being built for early users who want private, calm, and non-shaming support during difficult habit moments.</p>
                <p>If this kind of support feels useful, you can join the waitlist and follow the early development of the app.</p>
                <a className="button" href="/#waitlist">Join the waitlist</a>
              </section>

              <section className="seo-copy-block" aria-labelledby="faqs-title">
                <h2 id="faqs-title">FAQs</h2>
                <div className="faq-list">
                  {faqs.map((item) => (
                    <details className="faq-item" key={item.question}>
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </RevealOnScroll>

            <aside className="seo-side-panel" aria-label="Page navigation">
              <p className="eyebrow">Page guide</p>
              <a href="#willpower-title">More than willpower</a>
              <a href="#privacy-title">Why privacy matters</a>
              <a href="#moment-title">Before the habit loop</a>
              <a href="#support-title">How support helps</a>
              <a href="#impulsive-title">How Impulsive supports</a>
              <a href="#join-title">Join the waitlist</a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a className="wordmark" href="/" aria-label="Impulsive home">
              <BrandLogo />
              <span>Impulsive</span>
            </a>
            <p className="footer-tagline">Private behaviour-change support for adults.</p>
            <p className="footer-location">Built in London</p>
          </div>
          <nav className="footer-nav" aria-label="Product links">
            <h3>Product</h3>
            <a href="/">Home</a>
            <a href="/impulsive-app">Impulsive App</a>
            <a href="/how-impulsive-works">How Impulsive Works</a>
            <a href="/#paths">Paths</a>
            <a href="/#games">Games</a>
          </nav>
          <nav className="footer-nav" aria-label="Support links">
            <h3>Support</h3>
            <a href="/#faq">FAQs</a>
            <a href="mailto:hello@useimpulsive.com">Contact</a>
          </nav>
          <nav className="footer-nav" aria-label="Legal links">
            <h3>Legal</h3>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a href="/help.html">Help</a>
          </nav>
        </div>
        <div className="container footer-base">
          <div className="footer-base-text">
            <p className="footer-disclaimer">Impulsive helps adults create a pause, choose a next step, and understand habit patterns. It is not therapy, a diagnosis tool, or crisis support.</p>
            <p className="footer-removal-note">Want to leave the waitlist or request deletion of your email? Email <a href="mailto:hello@useimpulsive.com">hello@useimpulsive.com</a>.</p>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Impulsive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SmoothScroll>
      <PrivateBehaviourChangeSupportPage />
    </SmoothScroll>
  </React.StrictMode>,
);
