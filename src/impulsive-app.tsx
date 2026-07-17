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
    question: 'Is Impulsive an app?',
    answer:
      'Yes. Impulsive is being built as an Android app for private behaviour-change support during difficult habit moments.',
  },
  {
    question: 'Is the Impulsive app available yet?',
    answer:
      'Not fully yet. Impulsive is in development and will open to early access users first.',
  },
  {
    question: 'Is Impulsive private?',
    answer:
      'Yes. Privacy is a core product direction, especially because difficult habit moments can feel sensitive.',
  },
  {
    question: 'Is Impulsive a therapy app?',
    answer:
      'No. Impulsive is a private support tool for adults. It is not therapy or crisis support.',
  },
  {
    question: 'What is Focus Mode?',
    answer:
      'Focus Mode is part of Impulsive for starting focus, recovering from distraction, and returning to one clear next action.',
  },
];

function ImpulsiveAppPage() {
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
              <a href="/private-behaviour-change-support">Private support</a>
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
                <a href="/private-behaviour-change-support" onClick={closeMenu}>Private Support</a>
                <a href="/focus-mode" onClick={closeMenu}>Focus Mode</a>
                <a href="/#faq" onClick={closeMenu}>FAQs</a>
              </div>
            </div>
            <a className="button mobile-menu-cta" href="/#waitlist" onClick={closeMenu}>Join Waitlist</a>
          </div>
        </>
      )}

      <main id="main" className="seo-page">
        <section className="section seo-hero" aria-labelledby="app-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac" />
            <span className="shape shape-blue" />
            <span className="shape shape-lemon" />
            <span className="shape shape-coral" />
          </div>
          <div className="container seo-hero-inner">
            <RevealOnScroll className="seo-hero-copy">
              <p className="eyebrow">Impulsive app</p>
              <h1 id="app-title">Impulsive app</h1>
              <p>
                Impulsive is a private behaviour-change support app for adults who want a calmer way to handle difficult habit
                moments. It is also known as Use Impulsive, UseImpulsive, useimpulsive, and the Impulsive app.
              </p>
              <p>
                The app is being built for people who want a private pause, one clear pivot action, and a simple way to understand
                what helped afterwards.
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
              <section className="seo-copy-block" aria-labelledby="what-title">
                <h2 id="what-title">What is the Impulsive app?</h2>
                <p>Impulsive is a private behaviour-change support app for difficult habit moments. It is designed to help adults create a short pause before an automatic action, choose one better next step, and learn what helped afterwards.</p>
                <p>The same product may be searched as Impulsive, Use Impulsive, UseImpulsive, useimpulsive, or the Impulsive app. Those names all point to the same app and brand at <a href="/">useimpulsive.com</a>.</p>
                <p>Impulsive is calm by design. It avoids public pressure, shame, and complicated menus during moments when the user needs one clear action.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="for-title">
                <h2 id="for-title">Who the Impulsive app is for</h2>
                <p>The Impulsive app is for adults who want private support when a familiar behaviour starts to feel difficult to steer.</p>
                <p>That concern may come from distress, loss of control, harm, values conflict, relationship impact, or difficulty stopping despite unwanted consequences.</p>
                <p>Impulsive does not judge identity, desire, or consensual behaviour. It is concerned with moments where the person wants more space, more clarity, and a calmer next action.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="works-title">
                <h2 id="works-title">How the Impulsive app works</h2>
                <p>Impulsive is built around the current core loop: Trigger → Pause → Pivot → Control.</p>
                <div className="seo-loop-list">
                  <article>
                    <h3>Trigger:</h3>
                    <p>Notice the difficult moment as it begins, before the old pattern has fully taken over.</p>
                  </article>
                  <article>
                    <h3>Pause:</h3>
                    <p>Create space before acting, so the next move is less automatic.</p>
                  </article>
                  <article>
                    <h3>Pivot:</h3>
                    <p>Choose one short replacement action, such as a reset, movement prompt, reflection, focus step, or pivot game.</p>
                  </article>
                  <article>
                    <h3>Control:</h3>
                    <p>Track what helped and build better patterns over time, privately and without shame.</p>
                  </article>
                </div>
                <p>For a deeper overview of the product loop, read <a href="/how-impulsive-works">How Impulsive works</a>.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="private-title">
                <h2 id="private-title">What makes Impulsive private</h2>
                <p>Difficult habit moments can feel sensitive. A useful app should be available in the moment without making the user feel watched, exposed, or turned into a public score.</p>
                <p>Impulsive is being built around private progress tracking, discreet support paths, and a calm experience that can be opened when the user actually needs it.</p>
                <p>That is why the wider product direction focuses on <a href="/private-behaviour-change-support">private behaviour-change support</a> instead of public accountability or pressure.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="not-title">
                <h2 id="not-title">What Impulsive is not</h2>
                <p>Impulsive is not therapy, a crisis service, or a substitute for professional care. It does not promise perfect control or instant change.</p>
                <p>It is also not designed to shame users, punish private behaviour, or suggest that one difficult moment defines the person.</p>
                <p>Impulsive is a private app for behaviour-change support: create a pause, choose one pivot action, and understand the pattern with more clarity.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="focus-title">
                <h2 id="focus-title">Impulsive Focus Mode</h2>
                <p>Focus Mode is part of the Impulsive product direction. It helps users start focus, recover when distraction happens, and return to one clear next action.</p>
                <p>That same idea connects to difficult habit moments: the goal is not perfection, but recovery. When attention breaks or a loop starts, Impulsive helps the user come back calmly.</p>
                <p>You can read more on the dedicated <a href="/focus-mode">Impulsive Focus Mode</a> page.</p>
              </section>

              <section className="seo-copy-block seo-join-block" aria-labelledby="join-title">
                <h2 id="join-title">Join the waitlist</h2>
                <p>Impulsive is currently in development and opening to early users first.</p>
                <p>If you want private behaviour-change support for difficult habit moments, you can join the waitlist and follow the early development of the app.</p>
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
              <a href="#what-title">What it is</a>
              <a href="#for-title">Who it is for</a>
              <a href="#works-title">How it works</a>
              <a href="#private-title">Private support</a>
              <a href="#not-title">What it is not</a>
              <a href="#focus-title">Focus Mode</a>
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
            <a href="/private-behaviour-change-support">Private Support</a>
            <a href="/focus-mode">Focus Mode</a>
            <a href="/#paths">Paths</a>
          </nav>
          <nav className="footer-nav" aria-label="Support links">
            <h3>Support</h3>
            <a href="/#faq">FAQs</a>
            <a href="mailto:contact@useimpulsive.com">Contact</a>
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
            <p className="footer-disclaimer">Impulsive helps adults create a pause, choose a next step, and understand habit patterns. It is not therapy or crisis support.</p>
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
      <ImpulsiveAppPage />
    </SmoothScroll>
  </React.StrictMode>,
);
