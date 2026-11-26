// Small drawings of each project, in that project's own colours. While on screen, each one acts
// out what the real product does. They are decorative (aria-hidden): the text beside them carries
// the meaning, and the real links sit under the text.
import { useEffect, useRef, useState } from 'react';
import { useInView, useLoop, useTilt, reducedMotion, gsap } from '../lib/motion.js';

const BRICK = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];

/* ------------------------------------------------------------------ Block Smash */
// Row 5 is one block from a clear. The red piece in the tray drops into the gap, the row
// flashes and bursts, and the score counts up.
const BOARD = [
  '........',
  '.....33.',
  '1....33.',
  '11..2...',
  '1..22.66',
  '0000000.',
  '4400.556',
  '44.0.556',
].join('');
const GAP_CELL = 5 * 8 + 7;
const ROW = [40, 41, 42, 43, 44, 45, 46, 47];

function BlockSmash({ active }) {
  const [stage, setStage] = useState(0); // 0 idle, 1 placed, 2 flash, 3 cleared
  const [score, setScore] = useState(1240);
  useLoop(active && !reducedMotion(), async (wait) => {
    setStage(0); setScore(1240);
    await wait(1400);
    setStage(1);
    await wait(380);
    setStage(2);
    await wait(420);
    setStage(3);
    for (let s = 1240; s <= 1320; s += 8) { setScore(s); await wait(28); }
    await wait(2200);
  });

  return (
    <>
      <div className="bs-score">{score.toLocaleString('en-GB')}</div>
      <div className={`bs-combo${stage === 3 ? ' on' : ''}`}>Clear!</div>
      <div className="bs-board">
        {BOARD.split('').map((c, i) => {
          const filled = c !== '.' || (i === GAP_CELL && stage >= 1);
          const colour = i === GAP_CELL ? BRICK[0] : BRICK[Number(c)];
          const inRow = ROW.includes(i);
          const cls = [
            'bs-cell',
            filled && 'bs-block',
            i === GAP_CELL && stage === 1 && 'bs-drop',
            inRow && stage === 2 && 'bs-flash',
            inRow && stage === 3 && 'bs-gone',
          ].filter(Boolean).join(' ');
          return <span key={i} className={cls} style={filled ? { '--c': colour, '--d': `${(i % 8) * 30}ms` } : undefined} />;
        })}
      </div>
      <div className="bs-tray">
        <div className={`bs-piece${stage >= 1 ? ' bs-used' : ''}`} style={{ '--c': BRICK[0] }}><span /></div>
        <div className="bs-piece bs-l" style={{ '--c': BRICK[5] }}><span /><span /><span /><span /></div>
        <div className="bs-piece bs-bar" style={{ '--c': BRICK[2] }}><span /><span /><span /></div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Whisper */
const SPOKEN = "Hi Sam, the review moved to Thursday at 2pm. I'll send the notes straight after.";

function Whisper({ active }) {
  const [text, setText] = useState(reducedMotion() ? SPOKEN : '');
  const [listening, setListening] = useState(false);
  useLoop(active && !reducedMotion(), async (wait) => {
    setText('');
    setListening(true);
    await wait(900);
    const words = SPOKEN.split(' ');
    for (let i = 1; i <= words.length; i++) {
      setText(words.slice(0, i).join(' '));
      await wait(110 + Math.random() * 120);
    }
    setListening(false);
    await wait(2600);
  });
  return (
    <>
      <div className="wh-window">
        <div className="wh-titlebar"><i /><i /><i /></div>
        <p className="wh-text">{text}<span className="wh-caret" /></p>
      </div>
      <div className={`wh-bar${listening ? ' is-listening' : ''}`}>
        <span className="wh-dot" />
        <span className="wh-wave">
          {[6, 11, 16, 9, 13, 18, 8, 14, 10, 17, 7, 12, 15, 6].map((h, i) => (
            <i key={i} style={{ '--i': i, '--h': `${h}px` }} />
          ))}
        </span>
        <span className="wh-keys">{listening ? 'Listening' : 'Ctrl + Win'}</span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Eidolon */
const REPLY = "Short and warm. You'd thank them, say yes to Tuesday, and skip the sign-off.";

function Eidolon({ active }) {
  const still = reducedMotion();
  const [step, setStep] = useState(still ? 3 : 0); // 0 empty, 1 question, 2 thinking, 3 streaming
  const [shown, setShown] = useState(still ? REPLY.split(' ').length : 0);
  useLoop(active && !still, async (wait) => {
    setStep(0); setShown(0);
    await wait(600);
    setStep(1);
    await wait(900);
    setStep(2);
    await wait(1300);
    setStep(3);
    const n = REPLY.split(' ').length;
    for (let i = 1; i <= n; i++) { setShown(i); await wait(70 + Math.random() * 60); }
    await wait(3000);
  });
  return (
    <>
      <div className="ei-head">
        <svg viewBox="0 0 40 28" className="ei-mark">
          <circle cx="24" cy="14" r="10" fill="none" stroke="#8fa3b5" strokeWidth="1.6" />
          <path d="M31.07 6.93 A10 10 0 0 1 31.07 21.07" fill="none" stroke="#c4623f" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="15" cy="14" r="10" fill="#ece7de" />
        </svg>
        <span className="ei-local">Local</span>
      </div>
      <div className="ei-chat">
        <p className={`ei-me${step >= 1 ? ' in' : ''}`}>How would I usually reply to this?</p>
        {step === 2 && <p className="ei-thinking"><i /><i /><i /></p>}
        {step === 3 && (
          <p className="ei-ai">
            {REPLY.split(' ').slice(0, shown).map((w, i) => <span key={i}>{w} </span>)}
          </p>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ GoKarya platform */
const DRAFTS = [
  ['Requirement', 'Quotes need a second approver over 50k', 'Kickoff call'],
  ['Decision', 'Keep the existing lead routing rules', 'Email thread'],
  ['Risk', 'Data migration window overlaps quarter end', 'Workshop notes'],
];

function Platform({ active }) {
  // Per row: 0 waiting, 1 pressed, 2 approved, 3 gone
  const [rows, setRows] = useState([0, 0, 0]);
  useLoop(active && !reducedMotion(), async (wait) => {
    setRows([0, 0, 0]);
    await wait(1500);
    for (let r = 0; r < 3; r++) {
      setRows((p) => p.map((v, i) => (i === r ? 1 : v)));
      await wait(260);
      setRows((p) => p.map((v, i) => (i === r ? 2 : v)));
      await wait(800);
      setRows((p) => p.map((v, i) => (i === r ? 3 : v)));
      await wait(600);
    }
    await wait(2200);
  });
  const left = rows.filter((v) => v < 3).length;
  return (
    <div className="nx-app">
      <div className="nx-side">
        <b>GoKarya</b>
        <span>My work</span>
        <span className="on">Inbox</span>
        <span>Calendar</span>
        <span>Projects</span>
        <span>Meetings</span>
      </div>
      <div className="nx-main">
        <div className="nx-title">Waiting for review <em key={left}>{left}</em></div>
        {DRAFTS.map(([kind, text, src], i) => (
          <div className={`nx-row s${rows[i]}`} key={text}>
            <span className="nx-kind">{kind}</span>
            <span className="nx-text">{text}<small>Drafted from {src}</small></span>
            <span className="nx-approve">{rows[i] >= 2 ? 'Approved' : 'Approve'}</span>
          </div>
        ))}
        <div className={`nx-empty${left === 0 ? ' on' : ''}`}>All caught up</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ GoKarya */
// Particles morph between drawings of GoKarya's three industries and scatter from the cursor.
const N = 260;
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
function formations(w, h) {
  const r = seeded(11);
  const cx = w * 0.68, cy = h * 0.42, S = Math.min(w, h);
  const cloud = Array.from({ length: N }, () => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    return [cx + Math.cos(a) * d * S * 0.36 * (1 + 0.25 * Math.sin(a * 3)), cy + Math.sin(a) * d * S * 0.27];
  });
  // Data centre: four racks of server slots.
  const racks = Array.from({ length: N }, (_, i) => {
    const rack = i % 4, slot = Math.floor(i / 4) % 16, col = Math.floor(i / 64) % 4;
    return [cx - S * 0.3 + rack * S * 0.17 + col * S * 0.03, cy - S * 0.27 + slot * S * 0.034];
  });
  // Real estate: a tower elevation of windows.
  const tower = Array.from({ length: N }, (_, i) => {
    const c = i % 10, row = Math.floor(i / 10);
    const narrow = row < 6 ? 2 : 0;
    const x = Math.min(Math.max(c, narrow), 9 - narrow);
    return [cx - S * 0.2 + x * S * 0.045, cy + S * 0.3 - row * S * 0.024];
  });
  // Life sciences: a double helix.
  const helix = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * Math.PI * 6, strand = i % 2 ? Math.PI : 0;
    return [cx - S * 0.42 + (i / N) * S * 0.84, cy + Math.sin(t + strand) * S * 0.16];
  });
  return [
    { name: 'The company brain', pts: cloud },
    { name: 'Data centers', pts: racks },
    { name: 'Real estate', pts: tower },
    { name: 'Life sciences', pts: helix },
  ];
}

function GoKarya({ active }) {
  const canvasRef = useRef(null);
  const [label, setLabel] = useState('The company brain');
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const r = seeded(3);
    const parts = Array.from({ length: N }, () => ({ x: 0, y: 0, vx: 0, vy: 0, s: 0.6 + r() * 1.6, amber: r() < 0.035, o: 0.4 + r() * 0.6 }));
    let w = 0, h = 0, forms = [], current = 0, raf = 0, started = false;
    const pointer = { x: -999, y: -999 };
    const resize = () => {
      const b = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = b.width; h = b.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      forms = formations(w, h);
      if (!started) {
        forms[0].pts.forEach(([x, y], i) => { parts[i].x = x; parts[i].y = y; });
        started = true;
      }
      draw();
    };
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        ctx.globalAlpha = p.o;
        ctx.fillStyle = p.amber ? '#E8A340' : '#C4B5FD';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const step = () => {
      if (!forms.length) { raf = requestAnimationFrame(step); return; }
      const pts = forms[current].pts;
      parts.forEach((p, i) => {
        const [tx, ty] = pts[i];
        p.vx += (tx - p.x) * 0.012;
        p.vy += (ty - p.y) * 0.012;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 3600) { const f = (3600 - d2) / 3600 * 2.4; const d = Math.sqrt(d2) || 1; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
      });
      draw();
      raf = requestAnimationFrame(step);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const host = canvas.parentElement;
    const move = (e) => { const b = canvas.getBoundingClientRect(); pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top; };
    const leave = () => { pointer.x = -999; pointer.y = -999; };
    let timer = 0;
    if (active && !reducedMotion()) {
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      raf = requestAnimationFrame(step);
      timer = setInterval(() => {
        current = (current + 1) % forms.length;
        setLabel(forms[current].name);
      }, 2800);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      ro.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [active]);
  return (
    <>
      <canvas ref={canvasRef} className="gk-field" />
      <p className="gk-head">We build the systems, products, and teams that put AI to work.</p>
      <span className="gk-label" key={label}>{label}</span>
    </>
  );
}

/* ------------------------------------------------------------------ Frame */
const PLATES = { blocksmash: BlockSmash, whisper: Whisper, eidolon: Eidolon, platform: Platform, gokarya: GoKarya };

export default function Plate({ kind, href, cursor }) {
  const P = PLATES[kind];
  const [viewRef, active] = useInView({ threshold: 0.3 });
  const tiltRef = useTilt(6);
  const setRefs = (el) => { viewRef.current = el; tiltRef.current = el; };
  const open = () => href && window.open(href, '_blank', 'noopener');

  useEffect(() => {
    const el = viewRef.current;
    if (!el || reducedMotion()) return;
    gsap.fromTo(el, { clipPath: 'inset(12% 12% 12% 12% round 28px)', scale: 1.04 }, {
      clipPath: 'inset(0% 0% 0% 0% round 14px)', scale: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  }, [viewRef]);

  if (!P) return null;
  return (
    <div
      ref={setRefs}
      className={`plate plate-${kind}${href ? ' is-link' : ''}`}
      aria-hidden="true"
      onClick={open}
      data-cursor={href ? cursor : undefined}
    >
      <P active={active} />
      <span className="glare" />
    </div>
  );
}
