import { useCallback, useEffect, useState } from 'react';
import {
  initAnimationActors,
  runDarkModeAnimation,
  runLightModeAnimation,
} from '../lib/darkModeAnimation';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'impulsive-theme';

// Light is the default. Dark only applies if the user has explicitly chosen it.
const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#08071A' : '#FFF9F1');
};

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    initAnimationActors();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(
    async (toggleEl?: HTMLElement | null) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      if (next === 'dark') {
        const animated = await runDarkModeAnimation(toggleEl ?? null);
        if (!animated) applyTheme('dark');
      } else {
        runLightModeAnimation();
        applyTheme('light');
      }

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The visible theme still changes even if storage is unavailable.
      }

      setTheme(next);
    },
    [theme],
  );

  return { theme, toggle };
}
