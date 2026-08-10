import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AmbientParticles } from './AmbientParticles';
import { BrandLogo } from './BrandLogo';
import { RevealOnScroll } from './RevealOnScroll';
import { useDarkMode } from '../hooks/useDarkMode';

type Section = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type CurrentInfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
};

export function CurrentInfoPage({ eyebrow, title, intro, sections }: CurrentInfoPageProps) {
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={menuOpen ? 'menu-open' : ''}>
      <AmbientParticles active={theme === 'dark'} />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} data-header>
        <nav className="nav" aria-label="Primary navigation">
          <div className="nav-left">
            <a className="wordmark" href="/" aria-label="Impulsive home"><BrandLogo /><span>Impulsive</span></a>
            <div className="nav-links nav-links--desktop"><a href="/how-impulsive-works">How it works</a><a href="/impulsive-app">Product</a><a href="/privacy.html">Privacy</a></div>
          </div>
          <div className="nav-right">
            <a className="button button-small header-cta" href="/impulsive-app">Android release</a>
            <button ref={themeToggleRef} className="theme-toggle" type="button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'} onClick={() => toggle(themeToggleRef.current)}>
              <span className="theme-toggle-icon" aria-hidden="true">{theme === 'dark' ? <Sun /> : <Moon />}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu-panel" onClick={() => setMenuOpen((value) => !value)} ref={menuToggleRef}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </nav>
      </header>
      {menuOpen && <><button type="button" className="mobile-menu-overlay" aria-label="Close menu" onClick={closeMenu} /><div id="mobile-menu-panel" role="dialog" aria-modal="true" className="mobile-menu-panel"><div className="mobile-menu-head"><h2 className="mobile-menu-title">Menu</h2><button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={closeMenu}><X size={24} /></button></div><div className="mobile-menu-links"><a href="/" onClick={closeMenu}>Home</a><a href="/how-impulsive-works" onClick={closeMenu}>How it works</a><a href="/impulsive-app" onClick={closeMenu}>Product</a><a href="/privacy.html" onClick={closeMenu}>Privacy</a></div></div></>}

      <main id="main" className="seo-page">
        <section className="section seo-hero" aria-labelledby="page-title">
          <div className="container seo-hero-inner">
            <RevealOnScroll className="seo-hero-copy"><p className="eyebrow">{eyebrow}</p><h1 id="page-title">{title}</h1><p>{intro}</p><div className="hero-actions"><a className="button" href="/">Back to Impulsive</a><a className="button button-secondary" href="/privacy.html">Privacy Policy</a></div></RevealOnScroll>
          </div>
        </section>
        <section className="section seo-content-section">
          <div className="container seo-content-grid">
            <RevealOnScroll className="seo-article">
              {sections.map((section) => <section className="seo-copy-block" key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="wordmark" href="/"><BrandLogo /><span>Impulsive</span></a><p className="footer-tagline">Private behaviour-change support for adults.</p><p className="footer-location">Developed in the United Kingdom by IMPULSIVE LTD</p></div><nav className="footer-nav"><h3>Product</h3><a href="/impulsive-app">Impulsive App</a><a href="/how-impulsive-works">How it works</a><a href="/focus-mode">Focus support</a></nav><nav className="footer-nav"><h3>Legal</h3><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/delete-account">Delete account</a></nav></div><div className="container footer-base"><p className="footer-disclaimer">Impulsive is not therapy, medical treatment, diagnosis or crisis support.</p><p className="footer-copyright">&copy; {new Date().getFullYear()} IMPULSIVE LTD.</p></div></footer>
    </div>
  );
}
