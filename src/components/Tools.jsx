import { useState } from 'react';
import { scrollToTarget } from '../lib/motion.js';

// Tools against the projects I used them in. Built from each project's stack, so it can't claim
// anything the projects don't. Hover a row to trace it; click a project to open it in Work.
const SHORT = {
  platform: 'Platform',
  'gokarya-site': 'gokarya.com',
  blocksmash: 'Block Smash',
  whisper: 'Whisper',
  eidolon: 'Eidolon',
  dissertation: 'Dissertation',
  f1: 'F1 model',
  'one-guard': 'One Guard',
  coursework: 'Coursework',
};

export default function Tools({ groups, columns, workIds }) {
  const [row, setRow] = useState(null);
  const [col, setCol] = useState(null);
  const uses = (p) => new Set([...p.stack, ...(p.uses ?? [])]);
  const sets = columns.map(uses);
  const usedIn = (tool) => columns.filter((_, i) => sets[i].has(tool));

  const open = (p) => {
    if (workIds.includes(p.id)) {
      window.dispatchEvent(new CustomEvent('showproject', { detail: p.id }));
      scrollToTarget('.sc');
    } else if (p.href) window.open(p.href, '_blank', 'noopener');
  };

  return (
    <>
      <div className="tl-wrap">
        <table className="tl" onPointerLeave={() => { setRow(null); setCol(null); }}>
          <caption className="sr-only">Tools, and the projects I used each one in</caption>
          <thead>
            <tr>
              <td />
              {columns.map((p, ci) => (
                <th key={p.id} scope="col" className={col === ci ? 'on' : ''} onPointerEnter={() => { setCol(ci); setRow(null); }}>
                  {p.id === 'coursework' ? (
                    <span title={p.note}>{SHORT[p.id]}</span>
                  ) : (
                    <button type="button" onClick={() => open(p)} title={workIds.includes(p.id) ? 'Open in Work' : 'Open on GitHub'}>{SHORT[p.id]}</button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.label}>
              <tr className="tl-group"><th scope="rowgroup" colSpan={columns.length + 1}>{g.label}</th></tr>
              {g.tools.map((tool) => (
                <tr key={tool} className={row === tool ? 'on' : ''} onPointerEnter={() => { setRow(tool); setCol(null); }}>
                  <th scope="row">{tool}</th>
                  {columns.map((p, ci) => {
                    const yes = sets[ci].has(tool);
                    return (
                      <td key={p.id} className={col === ci ? 'col-on' : ''}>
                        {yes ? <i className="tl-dot" aria-label="Used" /> : <span className="sr-only">Not used</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Phones: one line per tool. */}
      <div className="tl-list">
        {groups.map((g) => (
          <div key={g.label}>
            <h3>{g.label}</h3>
            <ul>
              {g.tools.map((tool) => (
                <li key={tool}><b>{tool}</b> <span>{usedIn(tool).map((p) => SHORT[p.id]).join(', ')}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
