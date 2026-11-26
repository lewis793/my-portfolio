import { useEffect, useRef } from 'react';
import { gsap, getLenis, reducedMotion } from '../lib/motion.js';

// An endless row that speeds up and leans with scroll speed, then settles back.
export default function Marquee({ items, reverse = false, label }) {
  const track = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = track.current;
    const tween = gsap.fromTo(el, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: 40, ease: 'none', repeat: -1 });
    const skew = gsap.quickTo(el, 'skewX', { duration: 0.4, ease: 'power3.out' });
    const tick = () => {
      const v = getLenis()?.velocity ?? 0;
      tween.timeScale(1 + Math.min(Math.abs(v) * 0.25, 6));
      skew(Math.max(-12, Math.min(12, -v * 0.6)));
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); tween.kill(); };
  }, [reverse]);

  const row = items.map((t) => <span key={t} className="mq-item">{t}</span>);
  return (
    <div className="marquee" aria-label={label} role="group">
      <div className="mq-track" ref={track} aria-hidden="true">
        <div className="mq-half">{row}</div>
        <div className="mq-half">{row}</div>
      </div>
      <p className="sr-only">{items.join(', ')}</p>
    </div>
  );
}
