import { reducedMotion } from './motion.js';

const KEY = 'theme';

export function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Switches theme with a circle that grows out of the point you clicked (View Transitions API).
// Browsers without it just switch.
export function switchTheme(origin) {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* private mode */ }
    window.dispatchEvent(new Event('themechange'));
  };
  if (!document.startViewTransition || reducedMotion()) { apply(); return next; }
  const x = origin?.x ?? innerWidth - 40;
  const y = origin?.y ?? 30;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
  return next;
}

export function restoreTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) document.documentElement.dataset.theme = saved;
  } catch { /* private mode */ }
}

