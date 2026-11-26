import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';

// All projects in one place: a tab row grouped by where the work was done, and the selected
// project's write-up beside its live demo. Other parts of the page select a project by sending a
// `showproject` event with its id (hero links, the command menu).
const DEMOS = {
  platform: lazy(() => import('./demos/PlatformDemo.jsx')),
  gokarya: lazy(() => import('./demos/GoKaryaDemo.jsx')),
  blocksmash: lazy(() => import('./demos/BlockSmashGame.jsx')),
  whisper: lazy(() => import('./demos/WhisperDemo.jsx')),
  eidolon: lazy(() => import('./demos/EidolonDemo.jsx')),
};

export default function Showcase({ groups }) {
  const all = groups.flatMap((g) => g.items);
  const [current, setCurrent] = useState(all[0].id);
  const [visited, setVisited] = useState(() => new Set([all[0].id]));
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef(null);
  const tabsRef = useRef(null);
  const [pill, setPill] = useState(null);
  const item = all.find((p) => p.id === current);

  const select = (id) => {
    if (!all.some((p) => p.id === id)) return;
    setCurrent(id);
    setVisited((v) => (v.has(id) ? v : new Set(v).add(id)));
  };

  useEffect(() => {
    const on = (e) => select(e.detail);
    window.addEventListener('showproject', on);
    return () => window.removeEventListener('showproject', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // The indicator glides to the selected tab.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector(`[data-id="${current}"]`);
      const box = tabsRef.current;
      if (el && box) setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, W: box.scrollWidth, H: box.offsetHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [current]);

  // Arrow keys move between tabs (the ARIA tabs pattern).
  const onKeyDown = (e) => {
    const i = all.findIndex((p) => p.id === current);
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const id = all[(next + all.length) % all.length].id;
    select(id);
    tabsRef.current.querySelector(`[data-id="${id}"]`)?.focus();
  };

  return (
    <div className="sc" ref={root}>
      <div className="sc-tabs" ref={tabsRef} role="tablist" aria-label="Projects" onKeyDown={onKeyDown}>
        <span className="sc-pill" style={pill ? { width: pill.W, clipPath: `inset(${pill.y}px ${pill.W - pill.x - pill.w}px ${pill.H - pill.y - pill.h}px ${pill.x}px round 999px)` } : { opacity: 0 }} />
        {groups.map((g) => (
          <div className="sc-group" key={g.label} role="presentation">
            <span className="sc-group-label" aria-hidden="true">{g.label} <em>{g.items.length}</em></span>
            <div className="sc-tray" role="presentation">
            {g.items.map((p) => (
              <button
                key={p.id}
                id={p.id}
                data-id={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === current}
                aria-label={`${p.name} (${g.label})`}
                aria-controls={`panel-${p.id}`}
                tabIndex={p.id === current ? 0 : -1}
                className={`sc-tab${p.id === current ? ' on' : ''}`}
                onClick={() => select(p.id)}
              >
                {p.name}
              </button>
            ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sc-body">
        <div className="sc-text" role="tabpanel" id={`panel-${item.id}`} aria-labelledby={item.id} key={item.id}>
          <p className="sc-kicker">{item.kicker}</p>
          <h3 className="sc-name">{item.name}</h3>
          <dl className="sc-steps">
            {item.steps.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.text}</dd>
              </div>
            ))}
          </dl>
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

        <div className="sc-demo">
          <div className={`cs-stage cs-stage-${item.demo}`}>
            {all.filter((p) => visited.has(p.id)).map((p) => {
              const Demo = DEMOS[p.demo];
              const shown = p.id === current;
              return (
                <div key={p.id} className={`sc-slot${shown ? ' on' : ''}`} hidden={!shown}>
                  <Suspense fallback={null}>
                    <Demo active={shown && onScreen} />
                  </Suspense>
                </div>
              );
            })}
          </div>
          <p className="cs-hint" key={item.id}>{item.hint}</p>
        </div>
      </div>
    </div>
  );
}
