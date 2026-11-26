import { useEffect, useRef, useState } from 'react';

// Pick a question; the reply streams in word by word, the way a local model answers.
const PROMPTS = [
  { q: 'Reply to Sam saying Tuesday works', a: 'Tuesday works for me. See you then, Sam.' },
  { q: 'How do I usually sign off?', a: "You mostly don't. Your messages just end, sometimes with a quick 'cheers'." },
  { q: 'Summarise my week from my notes', a: "I can't read your notes yet. That's the knowledge base, which is next on the roadmap. For now I only know what you tell me here." },
];

export default function EidolonDemo() {
  const [turns, setTurns] = useState([]); // { q, a, shown, thinking }
  const busy = turns.some((t) => t.thinking || t.shown < t.a.split(' ').length);
  const timers = useRef([]);
  const log = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }); }, [turns]);

  const ask = (p) => {
    if (busy) return;
    const idx = turns.length;
    setTurns((t) => [...t.slice(-2), { ...p, shown: 0, thinking: true }]);
    const at = Math.min(idx, 2);
    const words = p.a.split(' ').length;
    timers.current.push(setTimeout(() => {
      setTurns((t) => t.map((x, i) => (i === at ? { ...x, thinking: false } : x)));
      for (let w = 1; w <= words; w++) {
        timers.current.push(setTimeout(() => setTurns((t) => t.map((x, i) => (i === at ? { ...x, shown: w } : x))), w * 70));
      }
    }, 900));
  };

  return (
    <div className="ed">
      <div className="ed-head">
        <svg viewBox="0 0 40 28" className="ed-mark" aria-hidden="true">
          <circle cx="24" cy="14" r="10" fill="none" stroke="#8fa3b5" strokeWidth="1.6" />
          <path d="M31.07 6.93 A10 10 0 0 1 31.07 21.07" fill="none" stroke="#c4623f" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="15" cy="14" r="10" fill="#ece7de" />
        </svg>
        <span className="ed-local">
          <svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="currentColor" /><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
          Local
        </span>
      </div>

      <div className="ed-log" ref={log} aria-live="polite" data-lenis-prevent>
        {turns.length === 0 && <p className="ed-empty">Your likeness, kept close. Ask it something.</p>}
        {turns.map((t, i) => (
          <div key={i} className="ed-turn">
            <p className="ed-me">{t.q}</p>
            {t.thinking ? (
              <p className="ed-thinking" aria-label="Thinking"><i /><i /><i /></p>
            ) : (
              <p className="ed-ai">{t.a.split(' ').slice(0, t.shown).map((w, j) => <span key={j}>{w} </span>)}</p>
            )}
          </div>
        ))}
      </div>

      <div className="ed-prompts">
        {PROMPTS.map((p) => (
          <button key={p.q} type="button" onClick={() => ask(p)} disabled={busy}>{p.q}</button>
        ))}
      </div>
    </div>
  );
}
