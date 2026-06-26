import { type ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type SmoothScrollProps = {
  children: ReactNode;
};

function getAnchorOffset() {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const configuredHeaderHeight = Number.parseFloat(
    rootStyles.getPropertyValue('--header-height'),
  );
  const headerHeight = Number.isFinite(configuredHeaderHeight)
    ? configuredHeaderHeight
    : 76;

  return -(headerHeight + 20);
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.9,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false,
      touchMultiplier: 1,
      anchors: {
        offset: getAnchorOffset(),
      },
      stopInertiaOnNavigate: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
