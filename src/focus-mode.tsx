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
    question: 'What is Impulsive Focus Mode?',
    answer:
      'Impulsive Focus Mode is a focus support feature designed to help users start a session, recover from interruption, and resume smoothly.',
  },
  {
    question: 'Is Focus Mode just a timer?',
    answer:
      'No. A normal timer helps you start. Impulsive Focus Mode is designed to also help when distraction happens, so the user can recover and return instead of abandoning the session.',
  },
  {
    question: 'What is distraction recovery?',
    answer:
      'Distraction recovery means helping the user return after they have been interrupted, without shame, frustration, or needing to restart everything from zero.',
  },
  {
    question: 'What is Temperature Focus?',
    answer:
      'Temperature Focus is an adaptive focus style where the session can feel softer, balanced, or stricter depending on what the user needs.',
  },
  {
    question: 'Is Focus Mode private?',
    answer:
      'Yes. Focus Mode follows the wider Impulsive direction: private, calm, and non-shaming support.',
  },
  {
    question: 'Can I join the waitlist?',
    answer:
      'Yes. You can join the waitlist to follow the early development of Impulsive and be notified when early access becomes available.',
  },
];

function FocusModePage() {
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
                <a href="/#faq" onClick={closeMenu}>FAQs</a>
              </div>
            </div>
            <a className="button mobile-menu-cta" href="/#waitlist" onClick={closeMenu}>Join Waitlist</a>
          </div>
        </>
      )}

      <main id="main" className="seo-page">
        <section className="section seo-hero" aria-labelledby="focus-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac" />
            <span className="shape shape-blue" />
            <span className="shape shape-lemon" />
            <span className="shape shape-coral" />
          </div>
          <div className="container seo-hero-inner">
            <RevealOnScroll className="seo-hero-copy">
              <p className="eyebrow">Focus mode for distraction</p>
              <h1 id="focus-title">Focus Mode for Distraction Recovery</h1>
              <p>
                Focus does not always break because someone is lazy or careless. Sometimes a distraction pulls the person away,
                and the hardest part is not starting again. It is returning without frustration, shame, or friction.
              </p>
              <p>
                Impulsive Focus Mode is designed to help users start a focus session, recover when interruption happens, and
                resume smoothly instead of abandoning the whole session.
              </p>
              <div className="hero-actions">
                <a className="button" href="/#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="/private-behaviour-change-support">Private support</a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="section seo-content-section">
          <div className="container seo-content-grid">
            <RevealOnScroll className="seo-article">
              <section className="seo-copy-block" aria-labelledby="laziness-title">
                <h2 id="laziness-title">Focus does not always fail because of laziness</h2>
                <p>When someone loses focus, it is easy to blame laziness. But distraction is often more complicated than that.</p>
                <p>A person may be tired, overwhelmed, bored, emotionally unsettled, or pulled into a familiar digital loop. Once the interruption starts, returning to the original task can feel harder than starting it.</p>
                <p>Focus support should not shame the user. It should help them return with less friction.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="recover-title">
                <h2 id="recover-title">What makes distraction hard to recover from</h2>
                <p>The problem with distraction is not only that it interrupts the task. It also breaks momentum.</p>
                <p>After an interruption, the user may feel behind, annoyed, guilty, or mentally scattered. That feeling can make it easier to drift into another app, another tab, or another habit loop.</p>
                <p>A good focus mode should not only block distractions. It should help the user recover from the interruption and return to the task with a clear next step.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="works-title">
                <h2 id="works-title">How Impulsive Focus Mode works</h2>
                <p>Impulsive Focus Mode is designed around a simple loop:</p>
                <div className="seo-loop-list">
                  <article>
                    <h3>Start focus:</h3>
                    <p>The user begins a focused session with clear boundaries.</p>
                  </article>
                  <article>
                    <h3>Recover:</h3>
                    <p>If distraction or interruption happens, the app guides the user through a short recovery step instead of letting the session collapse.</p>
                  </article>
                  <article>
                    <h3>Resume:</h3>
                    <p>The user returns to the session with less friction and a clearer next action.</p>
                  </article>
                </div>
                <p>The goal is not to make focus feel harsh. The goal is to make returning easier when attention breaks.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="start-title">
                <h2 id="start-title">Start focus, recover, resume</h2>
                <p>Most focus tools are built around starting a timer and blocking distractions. That can help, but it does not fully solve the moment after interruption.</p>
                <p>Impulsive Focus Mode is designed around a fuller loop:</p>
                <p>Start focus so the user knows what they are trying to protect.</p>
                <p>Recover when distraction happens, instead of treating the session as ruined.</p>
                <p>Resume smoothly so the user can return without overthinking or restarting from zero.</p>
                <p>This makes Focus Mode less about perfection and more about recovery.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="standard-title">
                <h2 id="standard-title">Standard Focus</h2>
                <p>Standard Focus is the simple version of Impulsive Focus Mode.</p>
                <p>The user chooses a focus session, blocks selected distractions, and starts working with clear boundaries. If they are interrupted, Impulsive helps them recover instead of making the session feel lost.</p>
                <p>Standard Focus is useful for study, work, admin tasks, planning, writing, and everyday focus sessions where the user wants a calm structure without extra pressure.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="temperature-title">
                <h2 id="temperature-title">Temperature Focus</h2>
                <p>Temperature Focus is the more adaptive version of Focus Mode.</p>
                <p>Instead of treating every focus session the same, Temperature Focus changes the session based on how strict, gentle, or recovery-focused the user needs it to be.</p>
                <p>Cold Focus is softer and useful when the user feels low-energy or resistant.</p>
                <p>Warm Focus is balanced and useful for normal work or study.</p>
                <p>Hot Focus is stricter and useful for deep work or high-priority tasks.</p>
                <p>The goal is to make focus feel more personal, not more punishing.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="recovery-title">
                <h2 id="recovery-title">Recovery Focus</h2>
                <p>Recovery Focus is designed for the moment after distraction.</p>
                <p>Sometimes the hardest part is not blocking the distraction. It is returning after the user has already been pulled away.</p>
                <p>Recovery Focus helps the user restart gently, choose the next small action, and continue without turning the interruption into a full failure.</p>
                <p>The purpose is simple: recover faster, resume calmly, and avoid abandoning the whole session.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="change-title">
                <h2 id="change-title">How Focus Mode connects to behaviour change</h2>
                <p>Focus Mode is not separate from behaviour change. It supports the same idea: notice the interruption, pivot into one better action, and understand what helps the user return.</p>
                <p>When someone gets distracted, the goal is not to shame them or make them restart from zero. The goal is to help them recover the session before the distraction becomes a longer loop.</p>
                <p>This makes Focus Mode part of the wider Impulsive system: private support, calmer recovery, and better patterns over time.</p>
              </section>

              <section className="seo-copy-block seo-join-block" aria-labelledby="join-title">
                <h2 id="join-title">Join the waitlist</h2>
                <p>Impulsive is currently being built for early users who want private behaviour-change support, calmer focus recovery, and a better way to return after distraction.</p>
                <p>If Focus Mode sounds useful, you can join the waitlist and follow the early development of the app.</p>
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
              <a href="#laziness-title">Not laziness</a>
              <a href="#recover-title">Distraction recovery</a>
              <a href="#works-title">How it works</a>
              <a href="#standard-title">Standard Focus</a>
              <a href="#temperature-title">Temperature Focus</a>
              <a href="#recovery-title">Recovery Focus</a>
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
      <FocusModePage />
    </SmoothScroll>
  </React.StrictMode>,
);
