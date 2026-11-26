import { useEffect, useRef, useState } from 'react';
import { gsap, finePointer, reducedMotion } from '../lib/motion.js';

// A dot that tracks the pointer exactly and a ring that follows with lag. Over links the ring
// grows; over anything with data-cursor it grows further and shows that word.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState('hidden');
  const [enabled] = useState(() => finePointer() && !reducedMotion());

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    const move = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target.closest?.('[data-cursor], a, button, input, textarea, [role="option"]');
      if (!t) { setMode(''); setLabel(''); return; }
      if (t.matches('input, textarea')) { setMode('text'); setLabel(''); return; }
      if (t.dataset.cursor) { setMode('label'); setLabel(t.dataset.cursor); return; }
      setMode('link'); setLabel('');
    };
    const down = () => ring.current.classList.add('is-down');
    const up = () => ring.current.classList.remove('is-down');
    const out = (e) => { if (!e.relatedTarget) setMode('hidden'); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerout', out);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerout', out);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`cursor is-${mode || 'default'}`} aria-hidden="true">
      <div ref={ring} className="cursor-ring"><span>{label}</span></div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
