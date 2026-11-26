import { lazy, Suspense, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, getLenis, reducedMotion, useInView } from '../lib/motion.js';

// One project as a full-screen chapter. On wide screens it pins while you scroll through three
// steps (what it is, the hard part, where it's at), with an interactive demo beside it. On phones
// and with reduced motion it doesn't pin: the steps simply stack above the demo.
const DEMOS = {
  platform: lazy(() => import('./demos/PlatformDemo.jsx')),
  gokarya: lazy(() => import('./demos/GoKaryaDemo.jsx')),
  blocksmash: lazy(() => import('./demos/BlockSmashGame.jsx')),
  whisper: lazy(() => import('./demos/WhisperDemo.jsx')),
  eidolon: lazy(() => import('./demos/EidolonDemo.jsx')),
};

export default function CaseStudy({ item }) {
  const root = useRef(null);
  const trigger = useRef(null);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [demoRef, near] = useInView({ rootMargin: '400px 0px' });
  // Load the demo as it comes near, then keep it (a game in progress survives scrolling away).
  const [loaded, setLoaded] = useState(false);
  if (near && !loaded) setLoaded(true);
  const Demo = DEMOS[item.demo];

  useGSAP(() => {
    if (reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 961px) and (min-height: 620px)', () => {
      setPinned(true);
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top 60px',
        end: '+=130%',
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => setStep(Math.min(item.steps.length - 1, Math.floor(self.progress * item.steps.length))),
      });
      return () => { setPinned(false); setStep(0); trigger.current = null; };
    });
    return () => mm.revert();
  }, { scope: root });

  // Clicking a step scrolls to the point where that step shows.
  const goTo = (i) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((st.end - st.start) * (i + 0.5)) / item.steps.length;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <article className={`cs${pinned ? ' is-pinned' : ''}`} id={item.id} ref={root} aria-labelledby={`${item.id}-h`}>
      <div className="cs-text">
        <p className="cs-kicker">{item.kicker}</p>
        <h3 id={`${item.id}-h`} className="cs-name">{item.name}</h3>

        <div className="cs-steps">
          {item.steps.map((s, i) => (
            <div key={s.label} className={`cs-step${!pinned || i === step ? ' is-on' : ''}`} aria-hidden={pinned && i !== step}>
              {!pinned && <h4>{s.label}</h4>}
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        {pinned && (
          <ol className="cs-nav" aria-label={`${item.name}: steps`}>
            {item.steps.map((s, i) => (
              <li key={s.label}>
                <button type="button" className={i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined} onClick={() => goTo(i)}>
                  <span className="cs-bar"><i style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} /></span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        )}

        <ul className="tags" aria-label="Built with">
          {item.stack.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="entry-links">
          {item.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="button">{l.label}</a>
          ))}
          {item.note && <span className="entry-note">{item.note}</span>}
        </div>
      </div>

      <div className="cs-demo" ref={demoRef}>
        <div className={`cs-stage cs-stage-${item.demo}`}>
          {loaded && (
            <Suspense fallback={<div className="cs-loading" />}>
              <Demo active={near} />
            </Suspense>
          )}
        </div>
        <p className="cs-hint">{item.hint}</p>
      </div>
    </article>
  );
}
