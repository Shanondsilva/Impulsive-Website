import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { AmbientParticles } from './AmbientParticles';
import { BrandLogo } from './BrandLogo';
import { useDarkMode } from '../hooks/useDarkMode';

type AccountDeletionLayoutProps = {
  children: ReactNode;
};

export function AccountDeletionLayout({ children }: AccountDeletionLayoutProps) {
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useDarkMode();

  return (
    <div className="account-deletion-page">
      <AmbientParticles active={theme === 'dark'} />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header account-deletion-header">
        <nav className="nav" aria-label="Primary navigation">
          <a className="wordmark" href="/" aria-label="Impulsive home">
            <BrandLogo />
            <span>Impulsive</span>
          </a>
          <div className="account-deletion-nav-links">
            <a href="/help">Help</a>
            <a href="/privacy.html">Privacy</a>
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
          </div>
        </nav>
      </header>

      {children}

      <footer className="site-footer account-deletion-footer">
        <div className="container account-deletion-footer-inner">
          <div>
            <a className="wordmark" href="/" aria-label="Impulsive home">
              <BrandLogo />
              <span>Impulsive</span>
            </a>
            <p className="footer-tagline">Private behaviour-change support for adults.</p>
          </div>
          <nav className="account-deletion-footer-links" aria-label="Support and legal links">
            <a href="/help">Help</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a href="mailto:contact@useimpulsive.com">Contact</a>
          </nav>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Impulsive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
