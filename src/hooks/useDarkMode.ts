import { useCallback, useEffect, useState } from 'react';
import '../lib/darkModeAnimation.css';
import {
  initAnimationActors,
  runDarkModeAnimation,
  runLightModeAnimation,
} from '../lib/darkModeAnimation';

type Theme = 'light' | 'dark';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    runLightModeAnimation();
    try { localStorage.setItem('theme', 'light'); } catch {}
    initAnimationActors();
  }, []);

  const toggle = useCallback(
    async (toggleEl: HTMLElement | null) => {
      if (theme === 'dark') {
        runLightModeAnimation();
        try { localStorage.setItem('theme', 'light'); } catch {}
        setTheme('light');
      } else {
        const ok = await runDarkModeAnimation(toggleEl);
        if (ok) {
          try { localStorage.setItem('theme', 'dark'); } catch {}
          setTheme('dark');
        }
      }
    },
    [theme]
  );

  return { theme, toggle };
}
