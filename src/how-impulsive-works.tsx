import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AmbientParticles } from './components/AmbientParticles';
import { RevealOnScroll } from './components/RevealOnScroll';
import { useDarkMode } from './hooks/useDarkMode';
import './index.css';
import './lib/darkModeAnimation.css';

const faqs = [
  {
    question: 'What is Impulsive?',
    answer:
      'Impulsive is a private behaviour-change support app designed to help users pause before difficult habit moments, choose one clear pivot action, and understand their pattern over time.',
  },
  {
    question: 'Is Impulsive a blocker app?',
    answer:
      'Impulsive is not only a blocker. Blocking can be part of support, but the main idea is to help the user create a pause, take one better action, and learn from the moment afterwards.',
  },
  {
    question: 'Is Impulsive therapy?',
    answer:
      'No. Impulsive is not therapy, medical treatment, diagnosis, or emergency support. It is a private support tool for behaviour change.',
  },
  {
    question: 'What does Notice, Pivot, Understand mean?',
    answer:
      'Notice means recognising the difficult habit moment. Pivot means choosing a better next action before the loop takes over. Understand means reviewing the moment afterwards without shame.',
  },
  {
    question: 'Is Impulsive private?',
    answer:
      'Privacy is a core part of the product direction. The app is being built to feel calm, discreet, and personal, especially because difficult habit moments can be sensitive.',
  },
  {
    question: 'Can I join the waitlist?',
    answer:
      'Yes. You can join the waitlist to follow the early development of Impulsive and be notified when early access becomes available.',
  },
];

function HowImpulsiveWorksPage() {
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
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
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
              <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="Impulsive app logo" />
              <span>Impulsive</span>
            </a>
            <div className="nav-links nav-links--desktop" aria-label="Primary site links">
              <a href="/#principles">Principles</a>
              <a href="/#about">About</a>
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
          <div id="mobile-menu-panel" role="dialog" aria-modal="true" aria-labelledby="menu-title" className="mobile-menu-panel">
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
                <a href="/#principles" onClick={closeMenu}>Principles</a>
                <a href="/#about" onClick={closeMenu}>About</a>
                <a href="/#faq" onClick={closeMenu}>FAQs</a>
              </div>
            </div>
            <a className="button mobile-menu-cta" href="/#waitlist" onClick={closeMenu}>Join Waitlist</a>
          </div>
        </>
      )}

      <main id="main" className="seo-page">
        <section className="section seo-hero" aria-labelledby="how-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="shape shape-lilac" />
            <span className="shape shape-blue" />
            <span className="shape shape-lemon" />
            <span className="shape shape-coral" />
          </div>
          <div className="container seo-hero-inner">
            <RevealOnScroll className="seo-hero-copy">
              <p className="eyebrow">How Impulsive works</p>
              <h1 id="how-title">How Impulsive Works</h1>
              <p>
                Impulsive is built for difficult habit moments where willpower alone is not enough. Instead of shaming you,
                overwhelming you, or forcing a harsh block, Impulsive helps you pause, choose one clear pivot action, and
                understand your pattern privately.
              </p>
              <p>
                The app is designed around a simple loop: notice the moment, pivot before the habit takes over, and understand
                what happened afterwards.
              </p>
              <div className="hero-actions">
                <a className="button" href="/#waitlist">Join the waitlist</a>
                <a className="button button-secondary" href="/">Back to home</a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="section seo-content-section">
          <div className="container seo-content-grid">
            <RevealOnScroll className="seo-article">
              <section className="seo-copy-block" aria-labelledby="pause-title">
                <h2 id="pause-title">A private pause before the habit takes over</h2>
                <p>Most habit apps focus on blocking, streaks, pressure, or punishment after something has already gone wrong. Impulsive is designed for the moment before the loop takes over.</p>
                <p>When a difficult habit moment appears, the goal is not to shame the user or overload them with choices. The goal is to create a short private pause, show one clear pivot action, and help the user move through the moment with more control.</p>
                <p>Impulsive is not built around perfection. It is built around interruption, reflection, and gradual behaviour change.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="loop-title">
                <h2 id="loop-title">The core loop: Notice, Pivot, Understand</h2>
                <p>Impulsive is built around a simple behaviour-change loop:</p>
                <div className="seo-loop-list">
                  <article>
                    <h3>Notice:</h3>
                    <p>The first step is recognising that a difficult habit moment is starting. This could happen through a risky app open, a known trigger window, boredom, stress, late-night scrolling, or a moment where the user feels pulled toward an old pattern.</p>
                  </article>
                  <article>
                    <h3>Pivot:</h3>
                    <p>Instead of leaving the user alone with the urge, Impulsive gives one clear pivot action. This may be a short reset, a focus action, a movement prompt, a reflection, or a small recovery game designed to interrupt autopilot.</p>
                  </article>
                  <article>
                    <h3>Understand:</h3>
                    <p>After the moment passes, the app helps the user review what happened without shame. The goal is to learn the pattern, not punish the person.</p>
                  </article>
                </div>
              </section>

              <section className="seo-copy-block" aria-labelledby="moment-title">
                <h2 id="moment-title">What happens during a difficult habit moment</h2>
                <p>When a difficult habit moment starts, the user does not need a complicated menu. They need one calm next step.</p>
                <p>Impulsive is designed to reduce the gap between urge and action. Instead of relying only on motivation, the app can guide the user into a short reset, a clear pivot action, or a focused interruption that helps them move away from the automatic loop.</p>
                <p>The aim is simple: pause the moment, choose one better action, and keep enough distance to make a more intentional decision.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="blockers-title">
                <h2 id="blockers-title">Why Impulsive is different from normal blockers</h2>
                <p>Normal blockers often work by cutting access completely. That can help in some situations, but it does not always teach the user what to do in the moment when the urge appears.</p>
                <p>Impulsive is different because it is not only trying to block behaviour. It is trying to help the user build a new response pattern.</p>
                <p>The app focuses on three things:</p>
                <ol>
                  <li>Create a pause before the automatic action.</li>
                  <li>Offer one clear pivot instead of too many choices.</li>
                  <li>Help the user understand the pattern afterwards.</li>
                </ol>
                <p>The goal is not fear, shame, or punishment. The goal is private behaviour-change support that becomes more useful over time.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="privacy-title">
                <h2 id="privacy-title">Privacy-first support</h2>
                <p>Impulsive is built around privacy because difficult habit moments are personal. The app should feel calm, discreet, and safe to use without embarrassment.</p>
                <p>The goal is not to expose the user, judge them, or turn their private struggle into a public score. The goal is to help them create a better response in the moment and understand their pattern over time.</p>
                <p>For the early version, Impulsive is designed to keep the experience simple, private, and focused on behaviour-change support rather than public accountability or social pressure.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="for-title">
                <h2 id="for-title">Who Impulsive is for</h2>
                <p>Impulsive is for people who want private support during difficult habit moments. It is for someone who feels they repeat a behaviour they do not fully want, especially when they are tired, stressed, bored, alone, distracted, or pulled into a familiar loop.</p>
                <p>It may be useful for people who want help with pausing, resetting, focusing, or changing their response before a habit takes over.</p>
                <p>Impulsive is not about judging the person. It is about giving them a calmer way to notice the moment, choose a better next step, and understand their pattern over time.</p>
              </section>

              <section className="seo-copy-block" aria-labelledby="not-title">
                <h2 id="not-title">What Impulsive is not</h2>
                <p>Impulsive is not a medical device, diagnosis tool, therapy replacement, or emergency support service. It does not claim to cure, treat, or prevent any condition.</p>
                <p>It is also not designed to shame users, punish them, or make them feel like one difficult moment means failure.</p>
                <p>Impulsive is a private behaviour-change support app. Its purpose is to help users pause before a difficult habit moment, choose one better action, and understand their pattern with more clarity.</p>
              </section>

              <section className="seo-copy-block seo-join-block" aria-labelledby="join-title">
                <h2 id="join-title">Join the waitlist</h2>
                <p>Impulsive is currently being built for early users who want a calmer, more private way to work through difficult habit moments.</p>
                <p>If the idea feels useful, you can join the waitlist and follow the early development of the app.</p>
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
              <a href="#pause-title">Private pause</a>
              <a href="#loop-title">Notice, Pivot, Understand</a>
              <a href="#moment-title">Difficult moments</a>
              <a href="#blockers-title">Different from blockers</a>
              <a href="#privacy-title">Privacy-first support</a>
              <a href="#join-title">Join the waitlist</a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a className="wordmark" href="/" aria-label="Impulsive home">
              <img src="/images/icons/impulsive-logo-transparent-clean.png" alt="" />
              <span>Impulsive</span>
            </a>
            <p className="footer-tagline">Private behaviour-change support for adults.</p>
            <p className="footer-location">Built in London</p>
          </div>
          <nav className="footer-nav" aria-label="Product links">
            <h3>Product</h3>
            <a href="/#urge-loop">How it works</a>
            <a href="/#paths">Paths</a>
            <a href="/#games">Games</a>
            <a href="/#progression">Progression</a>
            <a href="/#tiers">Free vs Paid Tiers</a>
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
    <HowImpulsiveWorksPage />
  </React.StrictMode>,
);
