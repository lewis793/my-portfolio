import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import BlockField from './BlockField.jsx';
import { gsap, SplitText, ScrollTrigger, reducedMotion, finePointer, useMagnetic } from '../lib/motion.js';
import { links } from '../data/content.js';

const BASE = { wght: 650, wdth: 88 };
const PEAK = { wght: 800, wdth: 100 };
const RADIUS = 220;

function Magnetic({ className, children, ...rest }) {
  const ref = useMagnetic(0.3);
  return <a ref={ref} className={className} {...rest}>{children}</a>;
}

const STATS = [
  { to: 670, suffix: '+', label: 'commits to Nexus in two months' },
  { to: 61, suffix: '/63', label: 'Whisper cleanup tests passing' },
  { to: 46, suffix: '', label: 'F1 races in the strategy model' },
  { from: 99, to: 0, suffix: '', label: 'ads in Block Smash' },
];

export default function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  useGSAP(() => {
    const still = reducedMotion();
    // autoSplit waits for the webfont and re-splits on resize, so lines break where the real font breaks.
    const split = SplitText.create(title.current, {
      type: 'lines,words,chars', mask: 'lines', linesClass: 'kt-line', charsClass: 'kt-char', autoSplit: true,
      onSplit(self) {
        gsap.set(title.current, { visibility: 'visible' });
        if (still) return undefined;
        return gsap.from(self.chars, { yPercent: 120, rotate: 6, duration: 1.2, ease: 'expo.out', stagger: 0.018 });
      },
    });
    if (still) return () => split.revert();

    gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.5 })
      .from('.hero-copy > *', { y: 24, opacity: 0, duration: 1, stagger: 0.08 })
      .from('.stat', { y: 30, opacity: 0, duration: 1, stagger: 0.06 }, '-=0.8');

    // Counters run once the strip scrolls into view.
    gsap.utils.toArray('.stat-num').forEach((el) => {
      const from = Number(el.dataset.from), to = Number(el.dataset.to);
      const obj = { v: from };
      gsap.to(obj, {
        v: to, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-GB'); },
      });
    });

    // The headline drifts up and fades as the hero scrolls away.
    gsap.to('.hero-inner', {
      yPercent: -12, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => split.revert();
  }, { scope: root });

  // Letters near the cursor swell in weight and width (Bricolage's variable axes).
  useEffect(() => {
    if (reducedMotion() || !finePointer()) return;
    const host = root.current;
    let chars = [];
    let state = [];
    const pointer = { x: -9999, y: -9999 };
    const collect = () => {
      chars = [...host.querySelectorAll('.hero h1 .kt-char')];
      state = chars.map(() => ({ t: 0 }));
    };
    const id = setTimeout(collect, 50);
    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    let resting = true;
    const tick = () => {
      if (resting && pointer.x < -9000) return;
      if (!chars.length || !chars[0].isConnected) collect();
      // Read every position first, then write, so the browser lays out once per frame.
      const centres = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
      resting = true;
      chars.forEach((c, i) => {
        const [x, y] = centres[i];
        const target = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / RADIUS) ** 1.6;
        const s = state[i];
        s.t += (target - s.t) * 0.14;
        if (Math.abs(target - s.t) > 0.002) resting = false;
        if (Math.abs(s.t - (s.applied ?? 0)) < 0.002) return;
        s.applied = s.t;
        const wght = BASE.wght + (PEAK.wght - BASE.wght) * s.t;
        const wdth = BASE.wdth + (PEAK.wdth - BASE.wdth) * s.t;
        c.style.fontVariationSettings = `'wght' ${wght.toFixed(1)}, 'wdth' ${wdth.toFixed(1)}`;
      });
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);
    return () => {
      clearTimeout(id);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  useEffect(() => () => ScrollTrigger.refresh(), []);

  return (
    <section className="hero" id="top" ref={root}>
      <BlockField />
      <div className="hero-inner wrap">
        <h1 ref={title}>I build AI products, and small, careful software for myself.</h1>
        <div className="hero-copy">
          <p className="lede">
            I&apos;m on a placement year at <a href="#work">GoKarya</a>, where I build{' '}
            <a href="#nexus">Nexus</a>, a workspace where Claude drafts a consulting team&apos;s
            paperwork and people approve it. After this I go back to the University of Bath for the final
            year of my Computer Science and AI degree.
          </p>
          <p>
            Outside work I make things I want to use myself: a <a href="#blocksmash">puzzle game</a>{' '}
            without the ads, a <a href="#whisper">dictation app</a> that never leaves my PC, and an{' '}
            <a href="#eidolon">AI that runs locally</a>.
          </p>
          <div className="hero-actions">
            <Magnetic href="#contact" className="button button-solid">Get in touch</Magnetic>
            <Magnetic href={links.github} target="_blank" rel="noopener noreferrer" className="button" data-cursor="Open">GitHub</Magnetic>
            <Magnetic href={links.linkedin} target="_blank" rel="noopener noreferrer" className="button" data-cursor="Open">LinkedIn</Magnetic>
          </div>
        </div>
        <dl className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <span className="stat-num" data-from={s.from ?? 0} data-to={s.to}>
                  {reducedMotion() ? s.to : s.from ?? 0}
                </span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
        <p className="hero-hint" aria-hidden="true">Click anywhere on the blocks</p>
      </div>
    </section>
  );
}
