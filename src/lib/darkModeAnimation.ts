const STICKMAN_SVG = `
  <svg viewBox="0 0 56 96" fill="none" width="56" height="96">
    <circle cx="28" cy="14" r="8" stroke="currentColor" stroke-width="2.2"/>
    <line x1="28" y1="22" x2="28" y2="56" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <line class="dm-arm-l" x1="28" y1="34" x2="18" y2="46" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <line class="dm-arm-r" x1="28" y1="34" x2="38" y2="46" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <line class="dm-leg"      x1="28" y1="56" x2="20" y2="78" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <line class="dm-leg back" x1="28" y1="56" x2="36" y2="78" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;

const WIRE_SVG = `
  <svg viewBox="0 0 16 150" width="16" height="150">
    <line class="dm-wire-line" x1="8" y1="0" x2="8" y2="108"
      stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 3"/>
    <circle class="dm-wire-handle" cx="8" cy="115" r="5.5"
      fill="#ffd56b" stroke="currentColor" stroke-width="1"/>
  </svg>`;

let stickman: HTMLDivElement | null = null;
let wire: HTMLDivElement | null = null;
let wireLine: SVGLineElement | null = null;
let wireHandle: SVGCircleElement | null = null;
let busy = false;
let initialized = false;
let animGeneration = 0;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function initAnimationActors(): void {
  if (initialized) return;
  initialized = true;

  stickman = document.createElement('div');
  stickman.className = 'dm-stickman';
  stickman.innerHTML = STICKMAN_SVG;
  document.body.appendChild(stickman);

  wire = document.createElement('div');
  wire.className = 'dm-wire';
  wire.innerHTML = WIRE_SVG;
  document.body.appendChild(wire);

  wireLine = wire.querySelector<SVGLineElement>('.dm-wire-line');
  wireHandle = wire.querySelector<SVGCircleElement>('.dm-wire-handle');
}

function setThemeAttr(dark: boolean): void {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

function positionWire(toggleEl: HTMLElement): void {
  if (!wire) return;
  const t = toggleEl.getBoundingClientRect();
  wire.style.left = `${t.left + t.width / 2 - 8}px`;
  wire.style.top = `${t.bottom - 2}px`;
}

function spawnSpark(x: number, y: number): void {
  const s = document.createElement('div');
  s.className = 'dm-spark';
  s.style.left = `${x}px`;
  s.style.top = `${y}px`;
  document.body.appendChild(s);
  const a = Math.random() * Math.PI * 2;
  const d = 22 + Math.random() * 38;
  s.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(0)`, opacity: 0 },
    ],
    { duration: 500 + Math.random() * 250, easing: 'cubic-bezier(.4,0,.6,1)' }
  );
  setTimeout(() => s.remove(), 800);
}

const burst = (x: number, y: number, n: number): void => {
  for (let i = 0; i < n; i++) setTimeout(() => spawnSpark(x, y), i * 25);
};

function tweenAttr(
  el: Element,
  attr: string,
  from: number,
  to: number,
  ms: number,
  ease?: (t: number) => number,
  isActive?: () => boolean
): Promise<void> {
  const easeFn = ease ?? ((t: number) => t * t * (3 - 2 * t));
  const t0 = performance.now();
  return new Promise<void>((resolve) => {
    function step(now: number) {
      if (isActive && !isActive()) return resolve();
      const t = Math.min(1, (now - t0) / ms);
      el.setAttribute(attr, String(from + (to - from) * easeFn(t)));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

function dropElement(el: HTMLElement): void {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 7);

  const clone = el.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: '0',
    zIndex: '9997',
    pointerEvents: 'none',
  } as CSSStyleDeclaration);
  document.body.appendChild(clone);

  el.style.opacity = '0';
  const dx = (Math.random() - 0.3) * 80;
  clone.animate(
    [
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * 0.3}px,60px) rotate(60deg)`, opacity: 1, offset: 0.3 },
      { transform: `translate(${dx}px,${window.innerHeight}px) rotate(540deg)`, opacity: 0 },
    ],
    { duration: 1100, easing: 'cubic-bezier(.45,0,.85,.4)', fill: 'forwards' }
  );
  setTimeout(() => {
    clone.remove();
    el.style.opacity = '';
  }, 1150);
}

export async function runDarkModeAnimation(toggleEl: HTMLElement | null): Promise<boolean> {
  if (busy || !toggleEl || !stickman || !wire || !wireLine || !wireHandle) return false;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setThemeAttr(true);
    return true;
  }

  busy = true;
  const gen = ++animGeneration;
  const isActive = () => gen === animGeneration;

  positionWire(toggleEl);
  wire.classList.add('show');
  await wait(280);
  if (!isActive()) return false;

  const wireR = wire.getBoundingClientRect();
  const handleR = wireHandle.getBoundingClientRect();
  const isMobile = window.innerWidth <= 640;
  const walkMs = isMobile ? 1050 : 1300;
  const targetRight = clamp(window.innerWidth - wireR.left - 36, 6, window.innerWidth - 42);
  const targetTop = clamp(handleR.top - 14, 46, Math.max(46, window.innerHeight - 96));
  stickman.style.right = `${targetRight}px`;
  stickman.style.top = `${targetTop}px`;
  await wait(walkMs);
  if (!isActive()) return false;

  stickman.classList.add('stand', 'reach');
  await wait(300);
  if (!isActive()) return false;

  stickman.classList.remove('reach');
  stickman.classList.add('pull');
  tweenAttr(wireLine, 'y2', 108, 128, 220, undefined, isActive);
  tweenAttr(wireHandle, 'cy', 115, 135, 220, undefined, isActive);
  await wait(240);
  if (!isActive()) return false;

  const wh = wireHandle.getBoundingClientRect();
  burst(wh.left + 5, wh.top + 5, 12);
  await wait(140);
  if (!isActive()) return false;

  document.querySelectorAll<HTMLElement>('[data-fallable]').forEach((el, i) =>
    setTimeout(() => { if (isActive()) dropElement(el); }, i * 90)
  );
  await wait(140);
  if (!isActive()) return false;

  setThemeAttr(true);
  await wait(55); if (!isActive()) return false; setThemeAttr(false);
  await wait(45); if (!isActive()) return false; setThemeAttr(true);
  await wait(95); if (!isActive()) return false; setThemeAttr(false);
  await wait(40); if (!isActive()) return false; setThemeAttr(true);

  stickman.classList.remove('pull');
  const easeOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  tweenAttr(wireLine, 'y2', 128, 104, 180, easeOut, isActive);
  tweenAttr(wireHandle, 'cy', 135, 111, 180, easeOut, isActive);
  await wait(220);
  if (!isActive()) return false;

  tweenAttr(wireLine, 'y2', 104, 108, 140, undefined, isActive);
  tweenAttr(wireHandle, 'cy', 111, 115, 140, undefined, isActive);
  await wait(220);
  if (!isActive()) return false;

  stickman.classList.remove('stand');
  stickman.style.right = '-80px';
  await wait(walkMs);
  if (!isActive()) return false;

  wire.classList.remove('show');
  stickman.style.right = '';
  busy = false;
  return true;
}

export function runLightModeAnimation(): void {
  animGeneration++; // Cancel any running dark mode animation
  busy = false;     // Free the lock

  setThemeAttr(false);
  document.querySelectorAll<HTMLElement>('[data-fallable]').forEach((el) => {
    el.style.opacity = '';
  });
  wireLine?.setAttribute('y2', '108');
  wireHandle?.setAttribute('cy', '115');

  if (stickman) {
    stickman.className = 'dm-stickman';
    stickman.style.right = '';
    stickman.style.top = '';
  }
  if (wire) {
    wire.classList.remove('show');
  }
}
