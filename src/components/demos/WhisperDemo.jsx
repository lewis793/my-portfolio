import { useEffect, useRef, useState } from 'react';

// Hold to dictate: the raw transcript appears as you "speak", and letting go shows the cleaned-up
// text that Whisper's local language model would type for you. Each utterance is a list of
// [what was heard, what gets typed] pieces, so stopping early still cleans what was said.
const UTTERANCES = [
  [['um so', ''], ['the review', 'The review'], ['uh', ''], ['moved to thursday', 'moved to Thursday'], ['at two pm', 'at 2pm.'], ['and um', ''], ["i'll send the notes", "I'll send the notes"], ['straight after', 'straight after.']],
  [['okay so', ''], ['can you', 'Can you'], ['like', ''], ['check the numbers', 'check the numbers'], ['before friday', 'before Friday?'], ['thanks', 'Thanks!']],
  [['hey sam', 'Hey Sam,'], ['just', ''], ['a heads up', 'just a heads up:'], ['the build', 'the build'], ['is uh', 'is'], ['green again', 'green again.']],
];

export default function WhisperDemo() {
  const [phase, setPhase] = useState('idle'); // idle | listening | cleaning
  const [heard, setHeard] = useState('');
  const [doc, setDoc] = useState(['Notes for Thursday']);
  const utter = useRef(0);
  const typed = useRef(0);
  const timer = useRef(0);
  const root = useRef(null);
  const phaseRef = useRef('idle');
  const setPhaseBoth = (p) => { phaseRef.current = p; setPhase(p); };

  const start = () => {
    if (phaseRef.current !== 'idle') return;
    typed.current = 0;
    setHeard('');
    setPhaseBoth('listening');
    const u = UTTERANCES[utter.current];
    const tick = () => {
      if (typed.current >= u.length) return;
      typed.current += 1;
      setHeard(u.slice(0, typed.current).map((p) => p[0]).join(' '));
      timer.current = setTimeout(tick, 260 + Math.random() * 180);
    };
    timer.current = setTimeout(tick, 250);
  };

  const stop = () => {
    if (phaseRef.current !== 'listening') return;
    clearTimeout(timer.current);
    const u = UTTERANCES[utter.current];
    const n = typed.current;
    if (n === 0) { setPhaseBoth('idle'); return; }
    setPhaseBoth('cleaning');
    let clean = u.slice(0, n).map((p) => p[1]).filter(Boolean).join(' ');
    if (clean && !/[.!?]$/.test(clean)) clean += '.';
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    setTimeout(() => {
      if (clean) setDoc((d) => [...d.slice(-2), clean]);
      setPhaseBoth('idle');
      utter.current = (utter.current + 1) % UTTERANCES.length;
    }, 700);
  };

  // Space works too, while the demo is on screen and nothing else has focus.
  const actions = useRef({ start, stop });
  actions.current = { start, stop };
  useEffect(() => {
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.5 });
    io.observe(root.current);
    const typing = () => /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    const down = (e) => { if (e.code === 'Space' && visible && !typing() && !e.repeat) { e.preventDefault(); actions.current.start(); } };
    const up = (e) => { if (e.code === 'Space' && visible && !typing()) { e.preventDefault(); actions.current.stop(); } };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { io.disconnect(); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="wd" ref={root}>
      <div className="wd-window">
        <div className="wd-titlebar"><i /><i /><i /><span>notes.txt</span></div>
        <div className="wd-doc" aria-live="polite">
          {doc.map((line, i) => <p key={`${i}-${line}`} className={i === doc.length - 1 && doc.length > 1 ? 'is-new' : ''}>{line}</p>)}
          <span className="wd-caret" />
        </div>
      </div>

      <p className={`wd-heard${heard ? ' on' : ''}`}>
        <span>Heard</span>
        {heard || 'Nothing yet'}
      </p>

      <button
        type="button"
        className={`wd-bar is-${phase}`}
        onPointerDown={(e) => { e.preventDefault(); start(); }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.repeat) start(); }}
        onKeyUp={(e) => { if (e.key === 'Enter') stop(); }}
        aria-label="Hold to dictate"
      >
        <span className="wd-dot" />
        <span className="wd-wave" aria-hidden="true">
          {[6, 11, 16, 9, 13, 18, 8, 14, 10, 17, 7, 12, 15, 6, 10, 13].map((h, i) => (
            <i key={i} style={{ '--i': i, '--h': `${h}px` }} />
          ))}
        </span>
        <span className="wd-state">
          {phase === 'listening' ? 'Listening… let go to finish' : phase === 'cleaning' ? 'Cleaning up' : 'Hold to talk'}
        </span>
      </button>
    </div>
  );
}
