import { useCallback, useEffect, useState } from 'react';
import { initAnimationActors, runDarkModeAnimation, runLightModeAnimation } from '../lib/darkModeAnimation';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'impulsive-theme';
const DEFAULT_VERSION_KEY = 'impulsive-theme-default-version';
const CURRENT_DEFAULT_VERSION = 'light-default-2026-05-19';

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  try {
    const defaultVersion = localStorage.getItem(DEFAULT_VERSION_KEY);
    if (defaultVersion !== CURRENT_DEFAULT_VERSION) {
      localStorage.setItem(STORAGE_KEY, 'light');
      localStorage.setItem(DEFAULT_VERSION_KEY, CURRENT_DEFAULT_VERSION);
      return 'light';
    }

    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (isTheme(storedTheme)) return storedTheme;

    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep light as the safe default.
  }

  const rootTheme = document.documentElement.dataset.theme;
  if (isTheme(rootTheme ?? null)) return rootTheme as Theme;

  return 'light';
};

const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute('content', theme === 'dark' ? '#08071A' : '#FFF9F1');
};

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    initAnimationActors();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(async (toggleEl?: HTMLElement | null) => {
    const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';

    if (nextTheme === 'dark') {
      const animated = await runDarkModeAnimation(toggleEl ?? null);
      if (!animated) applyTheme('dark');
    } else {
      runLightModeAnimation();
      applyTheme('light');
    }

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
      localStorage.setItem(DEFAULT_VERSION_KEY, CURRENT_DEFAULT_VERSION);
    } catch {
      // The visible theme can still change even if storage is unavailable.
    }

    setTheme(nextTheme);
  }, []);

  return { theme, toggle };
}
