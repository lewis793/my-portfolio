import { useLayoutEffect, useRef, useState } from 'react';
import { scrollToTarget } from '../lib/motion.js';

// Tools as chips (sized by how many projects used them) above a row of project tokens. Hover or
// tap a tool and lines draw to every project it was used in; hover a project and lines draw up to
// its tools. Built from each project's stack, so it can't claim anything the projects don't.
const PROJECTS = {
  platform: { label: 'Delivery platform', colour: '#6d28d9' },
  'gokarya-site': { label: 'gokarya.com', colour: '#c4b5fd' },
  blocksmash: { label: 'Block Smash', colour: '#e3262f' },
  whisper: { label: 'Whisper', colour: '#3b4a6b' },
  eidolon: { label: 'Eidolon', colour: '#c4623f' },
  dissertation: { label: 'Dissertation', colour: 'var(--muted)' },
  f1: { label: 'F1 model', colour: 'var(--muted)' },
  'one-guard': { label: 'One Guard', colour: 'var(--muted)' },
  coursework: { label: 'Coursework', colour: 'var(--muted)' },
};

const size = (n) => (n >= 4 ? 'xl' : n === 3 ? 'l' : n === 2 ? 'm' : 's');

export default function Tools({ groups, columns, workIds }) {
  const [tool, setTool] = useState(null);
  const [project, setProject] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [lines, setLines] = useState([]);
  const box = useRef(null);
  const chipRefs = useRef({});
  const tokenRefs = useRef({});

  const sets = Object.fromEntries(columns.map((p) => [p.id, new Set([...p.stack, ...(p.uses ?? [])])]));
  const projectsFor = (t) => columns.filter((p) => sets[p.id].has(t)).map((p) => p.id);

  const activeTool = tool ?? pinned;
  const litProjects = new Set(activeTool ? projectsFor(activeTool) : project ? [project] : []);
  const litTools = new Set(activeTool ? [activeTool] : project ? [...sets[project]] : []);
  const anything = litProjects.size > 0;

  // Curved lines between the lit chip(s) and token(s), measured from the layout.
  useLayoutEffect(() => {
    const draw = () => {
      const root = box.current?.getBoundingClientRect();
      if (!root || !anything) { setLines([]); return; }
      const pairs = activeTool
        ? [...litProjects].map((p) => [activeTool, p])
        : [...litTools].filter((t) => chipRefs.current[t]).map((t) => [t, project]);
      setLines(pairs.map(([t, p]) => {
        const a = chipRefs.current[t]?.getBoundingClientRect();
        const b = tokenRefs.current[p]?.getBoundingClientRect();
        if (!a || !b) return null;
        const x1 = a.left + a.width / 2 - root.left, y1 = a.bottom - root.top;
        const x2 = b.left + b.width / 2 - root.left, y2 = b.top - root.top;
        const mid = (y2 - y1) * 0.5;
        return { key: `${t}-${p}`, d: `M${x1},${y1} C${x1},${y1 + mid} ${x2},${y2 - mid} ${x2},${y2}`, colour: PROJECTS[p].colour };
      }).filter(Boolean));
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, project]);

  const open = (p) => {
    if (workIds.includes(p.id)) {
      window.dispatchEvent(new CustomEvent('showproject', { detail: p.id }));
      scrollToTarget('.sc');
    } else if (p.href) window.open(p.href, '_blank', 'noopener');
  };

  return (
    <div className={`tk${anything ? ' is-tracing' : ''}`} ref={box}>
      <svg className="tk-lines" aria-hidden="true">
        {lines.map((l) => <path key={l.key} d={l.d} style={{ stroke: l.colour }} pathLength="1" />)}
      </svg>

      <div className="tk-groups">
        {groups.map((g) => (
          <div className="tk-group" key={g.label}>
            <h3>{g.label}</h3>
            <div className="tk-chips">
              {g.tools.map((t) => {
                const n = projectsFor(t).length;
                return (
                  <button
                    key={t}
                    ref={(el) => { chipRefs.current[t] = el; }}
                    type="button"
                    className={`tk-chip tk-${size(n)}${litTools.has(t) ? ' on' : ''}${pinned === t ? ' pinned' : ''}`}
                    aria-pressed={pinned === t}
                    aria-label={`${t}: used in ${projectsFor(t).map((id) => PROJECTS[id].label).join(', ')}`}
                    onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setTool(t); setProject(null); } }}
                    onPointerLeave={(e) => { if (e.pointerType === 'mouse') setTool(null); }}
                    onFocus={() => { setTool(t); setProject(null); }}
                    onBlur={() => setTool(null)}
                    onClick={() => setPinned((p) => (p === t ? null : t))}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="tk-projects" role="group" aria-label="Projects">
        {columns.map((p) => {
          const meta = PROJECTS[p.id];
          const clickable = p.id !== 'coursework';
          return (
            <button
              key={p.id}
              ref={(el) => { tokenRefs.current[p.id] = el; }}
              type="button"
              className={`tk-token${litProjects.has(p.id) ? ' on' : ''}`}
              style={{ '--dot': meta.colour }}
              aria-disabled={!clickable}
              title={p.id === 'coursework' ? p.note : workIds.includes(p.id) ? 'Open in Work' : 'Open on GitHub'}
              onPointerEnter={() => { setProject(p.id); setTool(null); setPinned(null); }}
              onPointerLeave={() => setProject(null)}
              onFocus={() => { setProject(p.id); setTool(null); }}
              onBlur={() => setProject(null)}
              onClick={() => clickable && open(p)}
            >
              <i />
              {meta.label}
            </button>
          );
        })}
      </div>

      <p className="tk-hint">
        {pinned ? `${pinned}: ${projectsFor(pinned).map((id) => PROJECTS[id].label).join(', ')}. Tap it again to clear.` : 'Point at a tool to see where I’ve used it, or at a project to see what it’s built with.'}
      </p>
    </div>
  );
}
