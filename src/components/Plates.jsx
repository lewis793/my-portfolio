// Small drawings of each project, in that project's own colours.
// They are decorative (aria-hidden); the text beside them carries the meaning.

const BRICK = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];

// An 8x8 board mid-game: row 5 is one block from a clear, the last piece is waiting below.
const BOARD = [
  '........',
  '.....33.',
  '1....33.',
  '11..2...',
  '1..22.66',
  '0000000.',
  '4400.556',
  '44.0.556',
];

function BlockSmash() {
  return (
    <div className="plate plate-blocksmash" aria-hidden="true">
      <div className="bs-score">1,240</div>
      <div className="bs-board">
        {BOARD.join('').split('').map((c, i) => (
          <span key={i} style={c === '.' ? undefined : { '--c': BRICK[Number(c)] }} className={c === '.' ? 'bs-cell' : 'bs-cell bs-block'} />
        ))}
      </div>
      <div className="bs-tray">
        <div className="bs-piece" style={{ '--c': BRICK[0] }}><span /></div>
        <div className="bs-piece bs-l" style={{ '--c': BRICK[5] }}><span /><span /><span /><span /></div>
        <div className="bs-piece bs-bar" style={{ '--c': BRICK[2] }}><span /><span /><span /></div>
      </div>
    </div>
  );
}

function Whisper() {
  return (
    <div className="plate plate-whisper" aria-hidden="true">
      <div className="wh-window">
        <div className="wh-titlebar"><i /><i /><i /></div>
        <p className="wh-text">
          Hi Sam, the review moved to Thursday at 2pm. I&apos;ll send the notes straight after<span className="wh-caret" />
        </p>
      </div>
      <div className="wh-bar">
        <span className="wh-dot" />
        <span className="wh-wave">
          {[6, 11, 16, 9, 13, 18, 8, 14, 10, 17, 7, 12, 15, 6].map((h, i) => (
            <i key={i} style={{ '--i': i, '--h': `${h}px` }} />
          ))}
        </span>
        <span className="wh-keys">Ctrl + Win</span>
      </div>
    </div>
  );
}

function Eidolon() {
  return (
    <div className="plate plate-eidolon" aria-hidden="true">
      <div className="ei-head">
        <svg viewBox="0 0 40 28" className="ei-mark">
          <circle cx="24" cy="14" r="10" fill="none" stroke="#8fa3b5" strokeWidth="1.6" />
          <path d="M31.07 6.93 A10 10 0 0 1 31.07 21.07" fill="none" stroke="#c4623f" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="15" cy="14" r="10" fill="#ece7de" />
        </svg>
        <span className="ei-local">Local</span>
      </div>
      <div className="ei-chat">
        <p className="ei-me">How would I usually reply to this?</p>
        <p className="ei-ai">
          Short and warm. You&apos;d thank them, say yes to Tuesday, and skip the sign-off.
        </p>
      </div>
    </div>
  );
}

function Nexus() {
  const rows = [
    ['Requirement', 'Quotes need a second approver over 50k', 'Kickoff call'],
    ['Decision', 'Keep the existing lead routing rules', 'Email thread'],
    ['Risk', 'Data migration window overlaps quarter end', 'Workshop notes'],
  ];
  return (
    <div className="plate plate-nexus" aria-hidden="true">
      <div className="nx-app">
        <div className="nx-side">
          <b>Nexus</b>
          <span className="on">Inbox</span>
          <span>Requirements</span>
          <span>Meetings</span>
          <span>Ask</span>
        </div>
        <div className="nx-main">
          <div className="nx-title">Waiting for review <em>3</em></div>
          {rows.map(([kind, text, src]) => (
            <div className="nx-row" key={text}>
              <span className="nx-kind">{kind}</span>
              <span className="nx-text">{text}<small>Drafted from {src}</small></span>
              <span className="nx-approve">Approve</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// A loose cloud of dots, placed with a seeded generator so it draws the same every time.
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
const DOTS = (() => {
  const r = seeded(7);
  return Array.from({ length: 170 }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    return {
      x: 290 + Math.cos(a) * d * 100 * (1 + 0.25 * Math.sin(a * 3)),
      y: 98 + Math.sin(a) * d * 70,
      rad: 0.6 + r() * 1.6,
      amber: r() < 0.04,
      o: 0.35 + r() * 0.65,
    };
  });
})();

function GoKarya() {
  return (
    <div className="plate plate-gokarya" aria-hidden="true">
      <svg viewBox="0 0 400 240" className="gk-field">
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.rad} fill={d.amber ? '#E8A340' : '#C4B5FD'} opacity={d.o} />
        ))}
      </svg>
      <p className="gk-head">We build the systems, products, and teams that put AI to work.</p>
    </div>
  );
}

const PLATES = { blocksmash: BlockSmash, whisper: Whisper, eidolon: Eidolon, nexus: Nexus, gokarya: GoKarya };

export default function Plate({ kind }) {
  const P = PLATES[kind];
  return P ? <P /> : null;
}
