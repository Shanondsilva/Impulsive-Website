import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Lenis from 'lenis';
import App from './App.tsx';
import './index.css';
import './lib/darkModeAnimation.css';

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotionQuery.matches) {
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  };

  window.requestAnimationFrame(raf);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
