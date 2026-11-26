import { useCallback, useEffect, useRef, useState } from 'react';

// A small playable Block Smash. Same rules as the real game's dealer: pieces are uniformly random
// (crypto.getRandomValues), and a piece is only re-drawn if it couldn't fit anywhere on the board.
const SIZE = 8;
const COLOURS = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];
const SHAPES = [
  [[0, 0]],
  [[0, 0], [0, 1]], [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]], [[0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
];

const rand = (n) => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
};

// The opening board: row 5 is one block short of a clear, and the first piece in the tray fits it.
const START = ['........', '.....33.', '1....33.', '11..2...', '1..22.66', '0000000.', '4400.556', '44.0.556']
  .join('').split('').map((c) => (c === '.' ? -1 : Number(c)));
const START_TRAY = [
  { shape: SHAPES[0], colour: 0 },
  { shape: SHAPES[12], colour: 5 },
  { shape: SHAPES[3], colour: 2 },
];

const fits = (board, shape, r, c) =>
  shape.every(([dr, dc]) => {
    const rr = r + dr, cc = c + dc;
    return rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && board[rr * SIZE + cc] < 0;
  });
const fitsAnywhere = (board, shape) => {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (fits(board, shape, r, c)) return true;
  return false;
};
const extent = (shape) => [Math.max(...shape.map((p) => p[0])) + 1, Math.max(...shape.map((p) => p[1])) + 1];

function deal(board) {
  return Array.from({ length: 3 }, () => {
    let shape = SHAPES[rand(SHAPES.length)];
    for (let i = 0; i < 40 && !fitsAnywhere(board, shape); i++) shape = SHAPES[rand(SHAPES.length)];
    return { shape, colour: rand(COLOURS.length) };
  });
}

function Piece({ piece, cell = 14 }) {
  const [h, w] = extent(piece.shape);
  return (
    <span className="bg-piece" style={{ gridTemplateRows: `repeat(${h}, ${cell}px)`, gridTemplateColumns: `repeat(${w}, ${cell}px)` }}>
      {piece.shape.map(([r, c]) => (
        <i key={`${r}-${c}`} style={{ gridRow: r + 1, gridColumn: c + 1, background: COLOURS[piece.colour] }} />
      ))}
    </span>
  );
}

export default function BlockSmashGame() {
  const [board, setBoard] = useState(START);
  const [tray, setTray] = useState(START_TRAY);
  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState(null); // [r, c] anchor for the ghost
  const [clearing, setClearing] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState('');
  const [over, setOver] = useState(false);
  const boardRef = useRef(null);
  const drag = useRef(null);

  const piece = selected != null ? tray[selected] : null;

  const anchorFor = useCallback((clientX, clientY, p) => {
    const rect = boardRef.current.getBoundingClientRect();
    const cs = rect.width / SIZE;
    const r = Math.floor((clientY - rect.top) / cs);
    const c = Math.floor((clientX - rect.left) / cs);
    if (r < 0 || c < 0 || r >= SIZE || c >= SIZE) return null;
    const [h, w] = extent(p.shape);
    return [r - Math.floor((h - 1) / 2), c - Math.floor((w - 1) / 2)];
  }, []);

  const place = useCallback((idx, at) => {
    const p = tray[idx];
    if (!p || !at || !fits(board, p.shape, at[0], at[1])) return false;
    const next = [...board];
    p.shape.forEach(([dr, dc]) => { next[(at[0] + dr) * SIZE + at[1] + dc] = p.colour; });
    const full = [];
    for (let r = 0; r < SIZE; r++) if ([...Array(SIZE)].every((_, c) => next[r * SIZE + c] >= 0)) for (let c = 0; c < SIZE; c++) full.push(r * SIZE + c);
    for (let c = 0; c < SIZE; c++) if ([...Array(SIZE)].every((_, r) => next[r * SIZE + c] >= 0)) for (let r = 0; r < SIZE; r++) full.push(r * SIZE + c);
    const cleared = [...new Set(full)];
    const lines = Math.round(full.length / SIZE);
    let gained = p.shape.length + lines * lines * 10;

    let rest = tray.map((t, i) => (i === idx ? null : t));
    const after = [...next];
    cleared.forEach((i) => { after[i] = -1; });
    if (rest.every((t) => !t)) rest = deal(after);

    setBoard(next);
    setTray(rest);
    setHover(null);
    const firstLeft = rest.findIndex(Boolean);
    setSelected(firstLeft < 0 ? null : firstLeft);
    if (cleared.length) {
      setClearing(cleared);
      setCombo(lines > 1 ? `${lines} lines!` : 'Clear!');
      setTimeout(() => { setBoard(after); setClearing([]); }, 320);
      setTimeout(() => setCombo(''), 1100);
    }
    setScore((s) => s + gained);
    if (!rest.some((t) => t && fitsAnywhere(after, t.shape))) setTimeout(() => setOver(true), 450);
    return true;
  }, [board, tray]);

  // Dragging a piece from the tray onto the board (mouse or touch).
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      d.moved = d.moved || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6;
      if (d.moved) setHover(anchorFor(e.clientX, e.clientY, tray[d.idx]));
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      if (!d || !d.moved) return;
      if (!place(d.idx, anchorFor(e.clientX, e.clientY, tray[d.idx]))) setHover(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [anchorFor, place, tray]);

  const restart = () => {
    const empty = Array(SIZE * SIZE).fill(-1);
    setBoard(empty); setTray(deal(empty)); setSelected(0); setScore(0); setOver(false); setHover(null);
  };

  const ghost = new Set();
  let ghostOk = false;
  if (piece && hover) {
    ghostOk = fits(board, piece.shape, hover[0], hover[1]);
    piece.shape.forEach(([dr, dc]) => {
      const r = hover[0] + dr, c = hover[1] + dc;
      if (r >= 0 && c >= 0 && r < SIZE && c < SIZE) ghost.add(r * SIZE + c);
    });
  }

  return (
    <div className="bg-game">
      <div className="bg-top">
        <span className="bg-score">{score.toLocaleString('en-GB')}</span>
        <span className={`bg-combo${combo ? ' on' : ''}`}>{combo || 'Clear!'}</span>
      </div>
      <div
        ref={boardRef}
        className="bg-board"
        role="grid"
        aria-label="Block Smash board"
        onPointerMove={(e) => { if (!drag.current && piece) setHover(anchorFor(e.clientX, e.clientY, piece)); }}
        onPointerLeave={() => { if (!drag.current) setHover(null); }}
        onClick={(e) => { if (selected != null) place(selected, anchorFor(e.clientX, e.clientY, tray[selected])); }}
      >
        {board.map((v, i) => {
          const g = ghost.has(i);
          const cls = ['bg-cell', v >= 0 && 'bg-filled', clearing.includes(i) && 'bg-clearing', g && (ghostOk ? 'bg-ghost' : 'bg-bad')].filter(Boolean).join(' ');
          const colour = v >= 0 ? COLOURS[v] : g && ghostOk ? COLOURS[piece.colour] : undefined;
          return <span key={i} className={cls} style={colour ? { '--c': colour } : undefined} />;
        })}
        {over && (
          <div className="bg-over">
            <p>No room for any piece.</p>
            <button type="button" onClick={(e) => { e.stopPropagation(); restart(); }}>Play again</button>
          </div>
        )}
      </div>
      <div className="bg-tray">
        {tray.map((t, i) => (
          <button
            key={i}
            type="button"
            className={`bg-slot${selected === i ? ' is-selected' : ''}`}
            disabled={!t}
            aria-label={t ? `Piece ${i + 1}, ${t.shape.length} blocks` : 'Used'}
            aria-pressed={selected === i}
            onPointerDown={(e) => { if (!t) return; setSelected(i); drag.current = { idx: i, x: e.clientX, y: e.clientY, moved: false }; }}
          >
            {t && <Piece piece={t} />}
          </button>
        ))}
      </div>
    </div>
  );
}
