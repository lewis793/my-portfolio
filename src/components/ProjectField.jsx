import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/motion.js';

// A particle field beside the hero that draws each project in turn, in its own colours.
// Hovering a project's words in the headline (data-form) snaps the field to that project.
const N = 1000;
const BRICK = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];

const FORMS = [
  { key: 'platform', label: 'GoKarya’s delivery platform', href: '#platform' },
  { key: 'blocks', label: 'Block Smash', href: '#blocksmash' },
  { key: 'voice', label: 'Whisper', href: '#whisper' },
  { key: 'ai', label: 'Eidolon', href: '#eidolon' },
];

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
const rnd = seeded(42);

// Primitives return [x, y, colour] in a 0..1 box.
const rectFill = (x, y, w, h, n, c) => Array.from({ length: n }, () => [x + rnd() * w, y + rnd() * h, c]);
const rectLine = (x, y, w, h, n, c) => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * 2 * (w + h);
  if (t < w) return [x + t, y, c];
  if (t < w + h) return [x + w, y + t - w, c];
  if (t < 2 * w + h) return [x + w - (t - w - h), y + h, c];
  return [x, y + h - (t - 2 * w - h), c];
});
const circleLine = (cx, cy, r, n, c, from = 0, to = Math.PI * 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = from + ((to - from) * i) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, c];
  });
const circleFill = (cx, cy, r, n, c) => Array.from({ length: n }, () => {
  const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, c];
});

// Spread a point list over exactly N particles.
function fit(points) {
  return Array.from({ length: N }, (_, i) => points[Math.floor((i / N) * points.length)]);
}

function buildForms() {
  const violet = '#7c3aed', soft = '#a78bfa', ink = 'ink';
  const platform = [
    ...rectLine(0.04, 0.14, 0.92, 0.72, 200, soft),
    ...rectLine(0.04, 0.14, 0.92, 0.07, 70, soft),
    ...Array.from({ length: 50 }, (_, i) => [0.28, 0.21 + (i / 50) * 0.65, soft]),
    ...[0.27, 0.35, 0.43, 0.51].flatMap((y, i) => rectFill(0.08, y, 0.15, 0.035, 22, i === 1 ? violet : ink)),
    ...[0.27, 0.45, 0.63].flatMap((y) => [
      ...rectLine(0.33, y, 0.58, 0.13, 70, ink),
      ...rectFill(0.37, y + 0.035, 0.26, 0.025, 18, ink),
      ...rectFill(0.77, y + 0.04, 0.1, 0.05, 26, violet),
    ]),
  ];
  const board = ['........', '.....33.', '1....33.', '11..2...', '1..22.66', '0000000.', '4400.556', '44.0.556'];
  const blocks = board.flatMap((row, y) => row.split('').flatMap((c, x) =>
    c === '.' ? rectLine(0.1 + x * 0.1 + 0.03, 0.1 + y * 0.1 + 0.03, 0.04, 0.04, 6, ink)
      : rectFill(0.1 + x * 0.1 + 0.01, 0.1 + y * 0.1 + 0.01, 0.08, 0.08, 34, BRICK[Number(c)])));
  const bars = [0.18, 0.32, 0.5, 0.26, 0.42, 0.62, 0.3, 0.52, 0.36, 0.58, 0.24, 0.44, 0.34, 0.2];
  const voice = [
    ...circleFill(0.12, 0.5, 0.045, 60, '#ff5a5f'),
    ...bars.flatMap((h, i) => rectFill(0.22 + i * 0.05, 0.5 - h / 2, 0.022, h, Math.round(20 + h * 70), ink)),
  ];
  const ai = [
    ...circleLine(0.6, 0.5, 0.27, 240, '#8fa3b5'),
    ...circleLine(0.6, 0.5, 0.27, 120, '#c4623f', -Math.PI / 4, Math.PI / 4),
    ...circleFill(0.4, 0.5, 0.27, 420, ink),
  ];
  return { platform: fit(platform), blocks: fit(blocks), voice: fit(voice), ai: fit(ai) };
}

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

export default function ProjectField() {
  const canvasRef = useRef(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const still = reducedMotion();
    const forms = buildForms();
    let ink = [30, 35, 38];
    const readInk = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) ink = hex(v);
    };
    const colourOf = (c) => (c === 'ink' ? ink : hex(c));

    const r = seeded(9);
    const parts = Array.from({ length: N }, () => ({
      x: r(), y: r(), vx: 0, vy: 0, rgb: [...ink], size: 1.6 + r() * 1.6, jitter: r() * Math.PI * 2,
    }));
    let w = 0, h = 0, raf = 0, idx = 0, held = null, timer = 0, visible = true;
    const pointer = { x: -999, y: -999 };

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = b.width; h = b.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) { snap(); draw(); }
    };
    const box = () => {
      const s = Math.min(w, h);
      return { ox: (w - s) / 2, oy: (h - s) / 2, s };
    };
    const target = () => forms[FORMS[held ?? idx].key];
    function snap() {
      const { ox, oy, s } = box();
      target().forEach(([x, y, c], i) => { const p = parts[i]; p.x = ox + x * s; p.y = oy + y * s; p.rgb = [...colourOf(c)]; });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        ctx.fillStyle = `rgb(${p.rgb[0] | 0},${p.rgb[1] | 0},${p.rgb[2] | 0})`;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
    const step = (t) => {
      if (visible) {
        const { ox, oy, s } = box();
        const pts = target();
        for (let i = 0; i < N; i++) {
          const p = parts[i];
          const [tx, ty, c] = pts[i];
          const wob = Math.sin(t / 900 + p.jitter) * 0.6;
          p.vx += (ox + tx * s + wob - p.x) * 0.018;
          p.vy += (oy + ty * s + wob - p.y) * 0.018;
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < 5000) { const d = Math.sqrt(d2) || 1, f = ((5000 - d2) / 5000) * 3; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
          p.vx *= 0.84; p.vy *= 0.84;
          p.x += p.vx; p.y += p.vy;
          const to = colourOf(c);
          p.rgb[0] += (to[0] - p.rgb[0]) * 0.06; p.rgb[1] += (to[1] - p.rgb[1]) * 0.06; p.rgb[2] += (to[2] - p.rgb[2]) * 0.06;
        }
        draw();
      }
      raf = requestAnimationFrame(step);
    };

    const cycle = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        if (held !== null) return;
        idx = (idx + 1) % FORMS.length;
        setCurrent(idx);
      }, 3200);
    };
    const onForm = (e) => {
      const i = FORMS.findIndex((f) => f.key === e.detail);
      held = i < 0 ? null : i;
      setCurrent(held ?? idx);
      if (held === null) cycle();
      if (still) { snap(); draw(); }
    };
    const host = canvas.parentElement;
    const move = (e) => { const b = canvas.getBoundingClientRect(); pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top; };
    const leave = () => { pointer.x = -999; pointer.y = -999; };
    const themed = () => { readInk(); if (still) { snap(); draw(); } };

    readInk();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    window.addEventListener('heroform', onForm);
    window.addEventListener('themechange', themed);
    if (!still) {
      snap();
      parts.forEach((p) => { p.x = Math.random() * 400; p.y = Math.random() * 400; });
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      raf = requestAnimationFrame(step);
      cycle();
    }
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('heroform', onForm);
      window.removeEventListener('themechange', themed);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);

  const f = FORMS[current];
  return (
    <figure className="field">
      <canvas ref={canvasRef} aria-hidden="true" />
      <figcaption>
        <a href={f.href} key={f.key} className="field-caption">{f.label}</a>
        <span className="field-dots" aria-hidden="true">
          {FORMS.map((x, i) => <i key={x.key} className={i === current ? 'on' : ''} />)}
        </span>
      </figcaption>
    </figure>
  );
}
