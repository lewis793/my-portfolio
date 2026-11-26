import { useEffect, useRef, useState } from 'react';
import { PlateBody } from './Plates.jsx';
import { gsap, reducedMotion, scrollToTarget } from '../lib/motion.js';

// A small desktop in the hero. Each project is an icon; opening one shows its live drawing in a
// window you can drag, raise and close. Hovering a project's words in the headline opens or raises
// its window (the headline sends a `heroproject` event).
const APPS = [
  { key: 'platform', title: 'Delivery platform', at: [0.04, 0.1] },
  { key: 'whisper', title: 'Whisper', at: [0.3, 0.15] },
  { key: 'blocksmash', title: 'Block Smash', at: [0.16, 0.26] },
  { key: 'eidolon', title: 'Eidolon', at: [0.38, 0.29] },
];
const FIRST_OPEN = ['platform', 'whisper', 'blocksmash'];

function Icon({ kind }) {
  switch (kind) {
    case 'platform':
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="10" fill="#efedf6" />
          <rect x="7" y="9" width="26" height="22" rx="3" fill="#fff" stroke="#c9c2e3" />
          <rect x="7" y="9" width="8" height="22" rx="3" fill="#ebe5fb" />
          <rect x="18" y="13" width="12" height="3" rx="1.5" fill="#6d28d9" />
          <rect x="18" y="19" width="12" height="3" rx="1.5" fill="#c9c2e3" />
          <rect x="18" y="25" width="8" height="3" rx="1.5" fill="#c9c2e3" />
        </svg>
      );
    case 'blocksmash':
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="10" fill="#9b5c33" />
          <rect x="8" y="8" width="11" height="11" rx="2.5" fill="#ffcd03" />
          <rect x="21" y="8" width="11" height="11" rx="2.5" fill="#e3262f" />
          <rect x="8" y="21" width="11" height="11" rx="2.5" fill="#1e6fd9" />
          <rect x="21" y="21" width="11" height="11" rx="2.5" fill="#2bb34a" />
        </svg>
      );
    case 'whisper':
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="10" fill="#1a2133" />
          <circle cx="11" cy="20" r="3" fill="#ff5a5f" />
          {[7, 13, 9, 15, 6, 11].map((h, i) => (
            <rect key={i} x={17 + i * 3.4} y={20 - h / 2} width="2" height={h} rx="1" fill="#e8eaef" />
          ))}
        </svg>
      );
    case 'eidolon':
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="10" fill="#101012" />
          <circle cx="23" cy="20" r="8" fill="none" stroke="#8fa3b5" strokeWidth="1.5" />
          <path d="M28.7 14.3 A8 8 0 0 1 28.7 25.7" fill="none" stroke="#c4623f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="20" r="8" fill="#ece7de" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="10" fill="var(--accent)" />
          <rect x="9" y="12" width="22" height="16" rx="3" fill="none" stroke="var(--accent-ink)" strokeWidth="2" />
          <path d="M10 14 20 21 30 14" fill="none" stroke="var(--accent-ink)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
  }
}

function Clock() {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }).format(new Date());
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setNow(fmt()), 15000);
    return () => clearInterval(t);
  }, []);
  return <span className="dt-clock" title="Time in the UK">{now}</span>;
}

export default function Desktop() {
  const deskRef = useRef(null);
  const winRefs = useRef({});
  const iconRefs = useRef({});
  const zTop = useRef(10);
  const [wins, setWins] = useState(() =>
    Object.fromEntries(APPS.map((a) => [a.key, { open: false, z: 1, x: a.at[0], y: a.at[1] }])));
  const still = reducedMotion();

  const raise = (key) => {
    zTop.current += 1;
    const z = zTop.current;
    setWins((w) => ({ ...w, [key]: { ...w[key], z } }));
  };

  const animateOpen = (key) => {
    const el = winRefs.current[key];
    const icon = iconRefs.current[key];
    if (!el || still) return;
    const from = icon?.getBoundingClientRect();
    const to = el.getBoundingClientRect();
    const dx = from ? from.left + from.width / 2 - (to.left + to.width / 2) : 0;
    const dy = from ? from.top + from.height / 2 - (to.top + to.height / 2) : 30;
    gsap.fromTo(el, { x: dx, y: dy, scale: 0.15, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' });
  };

  const open = (key) => {
    zTop.current += 1;
    const z = zTop.current;
    let wasOpen = false;
    setWins((w) => {
      wasOpen = w[key].open;
      return { ...w, [key]: { ...w[key], open: true, z } };
    });
    requestAnimationFrame(() => {
      if (!wasOpen) animateOpen(key);
      else if (!still) gsap.fromTo(winRefs.current[key], { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'expo.out' });
    });
  };

  const close = (key) => {
    const el = winRefs.current[key];
    const done = () => setWins((w) => ({ ...w, [key]: { ...w[key], open: false } }));
    if (!el || still) { done(); return; }
    gsap.to(el, { scale: 0.85, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => { gsap.set(el, { clearProps: 'all' }); done(); } });
  };

  // Open the first windows one after another once the page has settled.
  useEffect(() => {
    const timers = FIRST_OPEN.map((k, i) => setTimeout(() => open(k), (still ? 0 : 900) + i * (still ? 0 : 260)));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Headline hover opens or raises a window.
  useEffect(() => {
    const onProject = (e) => { if (e.detail) open(e.detail); };
    window.addEventListener('heroproject', onProject);
    return () => window.removeEventListener('heroproject', onProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag a window by its title bar, kept inside the desktop.
  const startDrag = (key) => (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    const desk = deskRef.current.getBoundingClientRect();
    const el = winRefs.current[key];
    const box = el.getBoundingClientRect();
    const offX = e.clientX - box.left;
    const offY = e.clientY - box.top;
    const maxX = 1 - box.width / desk.width;
    const maxY = 1 - box.height / desk.height;
    raise(key);
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    const move = (ev) => {
      const x = Math.min(Math.max((ev.clientX - offX - desk.left) / desk.width, 0), Math.max(maxX, 0));
      const y = Math.min(Math.max((ev.clientY - offY - desk.top) / desk.height, 0.07), Math.max(maxY, 0.07));
      setWins((w) => ({ ...w, [key]: { ...w[key], x, y } }));
    };
    const up = () => {
      el.classList.remove('is-dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const topKey = Object.entries(wins).filter(([, w]) => w.open).sort((a, b) => b[1].z - a[1].z)[0]?.[0];

  return (
    <div className="desktop" ref={deskRef} role="group" aria-label="My projects as a small desktop">
      <div className="dt-bar">
        <span className="dt-brand"><i aria-hidden="true" />lewis</span>
        <Clock />
      </div>

      <ul className="dt-icons">
        {APPS.map((a) => (
          <li key={a.key}>
            <button type="button" ref={(el) => { iconRefs.current[a.key] = el; }} onClick={() => open(a.key)} aria-label={`Open ${a.title}`}>
              <Icon kind={a.key} />
              <span>{a.title}</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => scrollToTarget('#contact')} aria-label="Go to the contact form">
            <Icon kind="mail" />
            <span>Say hello</span>
          </button>
        </li>
      </ul>

      {APPS.map((a) => {
        const w = wins[a.key];
        if (!w.open) return null;
        return (
          <section
            key={a.key}
            ref={(el) => { winRefs.current[a.key] = el; }}
            className={`dt-win${topKey === a.key ? ' is-top' : ''}`}
            style={{ left: `min(${w.x * 100}%, 100% - var(--win-w) * 100%)`, top: `${w.y * 100}%`, zIndex: w.z }}
            aria-label={a.title}
            onPointerDown={() => topKey !== a.key && raise(a.key)}
          >
            <header className="dt-title" onPointerDown={startDrag(a.key)}>
              <span>{a.title}</span>
              <button type="button" className="dt-close" onClick={() => close(a.key)} aria-label={`Close ${a.title}`}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </header>
            <PlateBody kind={a.key} active />
          </section>
        );
      })}
    </div>
  );
}
