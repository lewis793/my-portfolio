import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import Desktop from './Desktop.jsx';
import { gsap, SplitText, ScrollTrigger, reducedMotion, finePointer, useMagnetic } from '../lib/motion.js';
import { links } from '../data/content.js';

const BASE = { wght: 600 };
const PEAK = { wght: 700 };
const RADIUS = 220;

function Magnetic({ className, children, ...rest }) {
  const ref = useMagnetic(0.3);
  return <a ref={ref} className={className} {...rest}>{children}</a>;
}

// A project's words in the headline. SplitText rebuilds the headline's DOM, so React handlers on
// these links would be lost; Hero listens for hover and focus on the headline instead.
function Form({ k, href, children }) {
  return <a href={href} className="form-word" data-project={k}>{children}</a>;
}

// About me, from LinkedIn. `count` makes the number tick up when it comes into view.
const STATS = [
  { value: 'New York', label: 'AI Engineer intern at GoKarya, on site since September 2026' },
  { value: '67.8%', count: { to: 67.8, decimals: 1, suffix: '%' }, label: 'average so far in my Computer Science and AI master’s at Bath' },
  { value: 'A*A*AA', label: 'A levels in Maths, Further Maths, Computer Science and Business' },
  { value: '5 years', label: 'customer service at Alton Towers, part time alongside school and uni' },
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
      .from('.hero-copy > *, .desktop', { y: 24, opacity: 0, duration: 1, stagger: 0.08 })
      .from('.stat', { y: 30, opacity: 0, duration: 1, stagger: 0.06 }, '-=0.8');

    // Counters run once the strip scrolls into view.
    gsap.utils.toArray('.stat-num').forEach((el) => {
      const to = Number(el.dataset.to), dec = Number(el.dataset.dec || 0), suffix = el.dataset.suffix || '';
      // The real value is in the page until the count starts, so it never sits at 0.
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to, duration: 2, ease: 'power3.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        onUpdate: () => { el.textContent = obj.v.toFixed(dec) + suffix; },
      });
    });

    // The headline drifts up and fades as the hero scrolls away.
    gsap.to('.hero-inner', {
      yPercent: -12, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => split.revert();
  }, { scope: root });

  // Letters near the cursor swell in weight (Familjen Grotesk's variable weight axis).
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
        c.style.fontVariationSettings = `'wght' ${wght.toFixed(1)}`;
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

  // Hovering or focusing a project's words opens its window on the desktop.
  useEffect(() => {
    const h1 = title.current;
    let last = null;
    const send = (e) => {
      const key = e.target.closest?.('[data-project]')?.dataset.project ?? null;
      if (key === last) return;
      last = key;
      // SplitText can cut one link into several pieces, so light up every piece of the phrase.
      h1.querySelectorAll('[data-project]').forEach((el) => el.classList.toggle('is-on', el.dataset.project === key));
      if (key) window.dispatchEvent(new CustomEvent('heroproject', { detail: key }));
    };
    const reset = () => {
      last = null;
      h1.querySelectorAll('.is-on').forEach((el) => el.classList.remove('is-on'));
    };
    h1.addEventListener('pointerover', send);
    h1.addEventListener('focusin', send);
    h1.addEventListener('focusout', reset);
    h1.addEventListener('pointerleave', reset);
    return () => {
      h1.removeEventListener('pointerover', send);
      h1.removeEventListener('focusin', send);
      h1.removeEventListener('focusout', reset);
      h1.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-inner wrap">
        <h1 ref={title}>
          I&apos;m Lewis. I build <span className="nobr"><Form k="platform" href="#platform">AI products</Form>,</span>{' '}
          <Form k="whisper" href="#whisper">apps</Form> and <span className="nobr"><Form k="blocksmash" href="#blocksmash">games</Form>.</span>
        </h1>
        <div className="hero-copy">
          <p className="hero-note">AI Engineer intern at GoKarya in New York, then back to Bath for the final year of my master&apos;s.</p>
          <div className="hero-actions">
            <Magnetic href="#contact" className="button button-solid">Get in touch</Magnetic>
            <Magnetic href={links.github} target="_blank" rel="noopener noreferrer" className="button">GitHub</Magnetic>
            <Magnetic href={links.linkedin} target="_blank" rel="noopener noreferrer" className="button">LinkedIn</Magnetic>
          </div>
        </div>
        <Desktop />
        <dl className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                {s.count && !reducedMotion() ? (
                  <span className="stat-num" data-to={s.count.to} data-dec={s.count.decimals} data-suffix={s.count.suffix} aria-label={s.value}>
                    {s.value}
                  </span>
                ) : s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
