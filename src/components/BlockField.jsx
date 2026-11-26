import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/motion.js';

// A field of small blocks behind the hero. Blocks near the cursor light up in Block Smash
// colours, a click sends a shockwave out across the grid, and a few blocks blip on their own
// so the field is alive on touch screens too.
const COLOURS = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];
const CELL = 26;
const GAP = 4;

export default function BlockField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const still = reducedMotion();
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let energy = new Float32Array(0);
    let hue = new Uint8Array(0);
    let base = '#cfd4cd';
    const pointer = { x: -9999, y: -9999, active: false };
    const waves = [];
    let raf = 0, visible = true, last = performance.now();

    const readColours = () => {
      base = getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || base;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / (CELL + GAP)) + 1;
      rows = Math.ceil(h / (CELL + GAP)) + 1;
      energy = new Float32Array(cols * rows);
      hue = new Uint8Array(cols * rows).map(() => (Math.random() * COLOURS.length) | 0);
      if (still) draw(0);
    };

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      const decay = Math.pow(0.04, dt);
      for (let wv of waves) wv.r += dt * 900;
      while (waves.length && waves[0].r > Math.hypot(w, h)) waves.shift();

      // Ambient blips.
      if (!still && Math.random() < dt * 6) {
        const i = (Math.random() * energy.length) | 0;
        energy[i] = Math.max(energy[i], 0.9);
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const cx = x * (CELL + GAP) + CELL / 2;
          const cy = y * (CELL + GAP) + CELL / 2;
          let e = energy[i] * decay;
          if (pointer.active) {
            const d = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (d < 150) e = Math.max(e, 1 - d / 150);
          }
          for (const wv of waves) {
            const d = Math.abs(Math.hypot(cx - wv.x, cy - wv.y) - wv.r);
            if (d < 40) e = Math.max(e, (1 - d / 40) * wv.power);
          }
          energy[i] = e;

          const grow = e * 4;
          const s = CELL - 10 + grow;
          const px = cx - s / 2, py = cy - s / 2;
          ctx.globalAlpha = 0.55 + e * 0.45;
          ctx.fillStyle = e > 0.05 ? COLOURS[hue[i]] : base;
          if (e <= 0.05) ctx.globalAlpha = 0.5;
          else ctx.globalAlpha = Math.min(1, e * 1.2);
          ctx.beginPath();
          ctx.roundRect(px, py, s, s, 4);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    const loop = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (visible) draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const host = canvas.parentElement;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onDown = (e) => {
      if (e.target.closest('a, button')) return;
      const r = canvas.getBoundingClientRect();
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, power: 1 });
      hue.forEach((_, i) => { if (Math.random() < 0.3) hue[i] = (Math.random() * COLOURS.length) | 0; });
    };

    readColours();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    window.addEventListener('themechange', readColours);
    if (!still) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      host.addEventListener('pointerdown', onDown);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('themechange', readColours);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="block-field" aria-hidden="true" />;
}
