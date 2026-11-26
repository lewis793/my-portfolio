import { useEffect, useMemo, useRef, useState } from 'react';
import { scrollToTarget } from '../lib/motion.js';
import { switchTheme } from '../lib/theme.js';
import { links, work, projects, university } from '../data/content.js';

// Ctrl+K / Cmd+K: jump to any section or project, open a link, or switch theme.
function buildCommands() {
  const go = (id) => () => scrollToTarget(`#${id}`);
  const open = (href) => () => window.open(href, '_blank', 'noopener');
  return [
    { group: 'Go to', label: 'Top', run: go('top') },
    { group: 'Go to', label: 'Work at GoKarya', run: go('work') },
    { group: 'Go to', label: 'Projects', run: go('projects') },
    { group: 'Go to', label: 'University', run: go('university') },
    { group: 'Go to', label: 'Get in touch', run: go('contact') },
    ...[...work, ...projects].map((p) => ({ group: 'Projects', label: p.name, hint: p.stack.slice(0, 3).join(', '), run: go(p.id) })),
    ...university.map((u) => ({ group: 'University', label: u.name, run: open(u.href) })),
    { group: 'Links', label: 'Play Block Smash', run: open('https://lewis793.github.io/blocksmash/') },
    { group: 'Links', label: 'GitHub', run: open(links.github) },
    { group: 'Links', label: 'LinkedIn', run: open(links.linkedin) },
    { group: 'Links', label: 'gokarya.com', run: open('https://gokarya.com') },
    { group: 'Settings', label: 'Switch light or dark mode', run: () => switchTheme() },
  ];
}

export default function CommandPalette({ open, setOpen }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef(null);
  const returnFocus = useRef(null);
  const commands = useMemo(buildCommands, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands
      .map((c) => {
        const hay = `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase();
        let score = hay.indexOf(q);
        if (score < 0) {
          // Loose match: the letters appear in order.
          let pos = 0, start = -1;
          for (const ch of q) { pos = hay.indexOf(ch, pos); if (pos < 0) return null; if (start < 0) start = pos; pos++; }
          if (pos - start > q.length * 2) return null;
          score = 100 + pos;
        }
        return { ...c, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score);
  }, [query, commands]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setQuery('');
      setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    } else {
      returnFocus.current?.focus?.();
    }
  }, [open]);

  const run = (c) => {
    setOpen(false);
    setTimeout(c.run, 60);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[index]) { e.preventDefault(); run(results[index]); }
    else if (e.key === 'Tab') e.preventDefault();
  };

  useEffect(() => {
    document.getElementById(`cmd-${index}`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!open) return null;
  let lastGroup = '';
  return (
    <div className="palette-backdrop" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={onKeyDown}>
        <input
          ref={input}
          className="palette-input"
          placeholder="Jump to a project, section or link"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[index] ? `cmd-${index}` : undefined}
        />
        <ul className="palette-list" id="palette-list" role="listbox" data-lenis-prevent>
          {results.length === 0 && <li className="palette-empty">Nothing matches “{query}”. Try a project name.</li>}
          {results.map((c, i) => {
            const head = c.group !== lastGroup && !query ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.group + c.label} role="presentation">
                {head && <div className="palette-group">{head}</div>}
                <div
                  id={`cmd-${i}`}
                  role="option"
                  aria-selected={i === index}
                  className="palette-item"
                  onPointerMove={() => setIndex(i)}
                  onClick={() => run(c)}
                >
                  <span>{c.label}</span>
                  {c.hint && <small>{c.hint}</small>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="palette-foot"><span>↑↓ to move</span><span>Enter to open</span><span>Esc to close</span></div>
      </div>
    </div>
  );
}
