import { useCallback, useEffect, useState } from 'react';
import { initAnimationActors, runDarkModeAnimation, runLightModeAnimation } from '../lib/darkModeAnimation';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'impulsive-theme';

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  try {
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
    } catch {
      // The visible theme can still change even if storage is unavailable.
    }

    setTheme(nextTheme);
  }, []);

  return { theme, toggle };
}
