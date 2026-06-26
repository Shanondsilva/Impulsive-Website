import { useCallback, useEffect, useRef, useState } from 'react';
import {
  destroyAnimationActors,
  initAnimationActors,
  runDarkModeAnimation,
  runLightModeAnimation,
} from '../lib/darkModeAnimation';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'impulsive-theme';

// Every fresh page load starts in light mode.
const readStoredTheme = (): Theme => {
  return 'light';
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
  const toggleInProgressRef = useRef(false);

  useEffect(() => {
    initAnimationActors();

    return () => {
      destroyAnimationActors();
    };
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(
    async (toggleEl?: HTMLElement | null) => {
      if (toggleInProgressRef.current) return;

      toggleInProgressRef.current = true;

      try {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';

        if (next === 'dark') {
          const animated = await runDarkModeAnimation(toggleEl ?? null);
          if (!animated) applyTheme('dark');
        } else {
          const animated = await runLightModeAnimation(toggleEl ?? null);
          if (!animated) applyTheme('light');
        }

        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // The visible theme still changes even if storage is unavailable.
        }

        setTheme(next);
      } finally {
        toggleInProgressRef.current = false;
      }
    },
    [theme],
  );

  return { theme, toggle };
}
