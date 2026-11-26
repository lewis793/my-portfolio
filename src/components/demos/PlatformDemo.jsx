import { useState } from 'react';

// A working slice of GoKarya's delivery platform, with invented data. Inbox: approve drafts and
// hover one to see the quote it came from. Calendar and Projects show the breadth of the app.
const DRAFTS = [
  { id: 1, kind: 'Requirement', text: 'Quotes over 50k need a second approver', src: 'Kickoff call', quote: '“Anything over fifty thousand has to go past a second person before it reaches the customer.”' },
  { id: 2, kind: 'Decision', text: 'Keep the existing lead routing rules', src: 'Email from the client’s ops lead', quote: '“Let’s not touch routing this phase, the sales team only just got used to it.”' },
  { id: 3, kind: 'Risk', text: 'Data migration overlaps quarter end', src: 'Workshop notes', quote: '“Finance freezes changes for the last week of the quarter.”' },
  { id: 4, kind: 'Question', text: 'Who signs off the new approval flow?', src: 'Design review', quote: '“We’ll need someone on their side to own the approval rules.”' },
];
const MEETINGS = [
  { day: 0, start: 1, len: 2, title: 'Kickoff', prep: '3 open questions to raise' },
  { day: 1, start: 3, len: 1, title: 'Design review', prep: 'Approval flow diagram ready' },
  { day: 2, start: 0, len: 1, title: 'Stand-up', prep: 'Nothing waiting on you' },
  { day: 3, start: 2, len: 2, title: 'Sprint planning', prep: '8 stories ready to estimate' },
  { day: 4, start: 4, len: 1, title: 'Client check-in', prep: '1 risk to talk through' },
];
const COLUMNS = ['To do', 'In progress', 'Done'];
const START_CARDS = [
  { id: 'DEM-12', title: 'Second approver on quotes', col: 0 },
  { id: 'DEM-9', title: 'Import price books', col: 1 },
  { id: 'DEM-14', title: 'Quote PDF template', col: 0 },
  { id: 'DEM-7', title: 'Sandbox set-up', col: 2 },
];

function Inbox() {
  const [rows, setRows] = useState(DRAFTS.map((d) => ({ ...d, state: 'waiting' })));
  const [peek, setPeek] = useState(null);
  const waiting = rows.filter((r) => r.state !== 'gone');
  const approve = (id) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, state: 'approved' } : r)));
    setTimeout(() => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, state: 'gone' } : r))), 700);
  };
  return (
    <div className="pd-view">
      <div className="pd-title">Waiting for review <em key={waiting.length}>{waiting.length}</em></div>
      {waiting.length === 0 ? (
        <div className="pd-empty">
          <p>All caught up.</p>
          <button type="button" onClick={() => setRows(DRAFTS.map((d) => ({ ...d, state: 'waiting' })))}>Bring the drafts back</button>
        </div>
      ) : (
        <ul className="pd-list">
          {waiting.map((r) => (
            <li key={r.id} className={`pd-row is-${r.state}`} onPointerEnter={() => setPeek(r.id)} onPointerLeave={() => setPeek(null)}>
              <span className="pd-kind">{r.kind}</span>
              <span className="pd-text">
                {r.text}
                <small>Drafted from {r.src}</small>
              </span>
              <button type="button" className="pd-approve" onClick={() => approve(r.id)} disabled={r.state !== 'waiting'} onFocus={() => setPeek(r.id)} onBlur={() => setPeek(null)}>
                {r.state === 'approved' ? 'Approved' : 'Approve'}
              </button>
              {peek === r.id && r.state === 'waiting' && <span className="pd-quote" role="tooltip">{r.quote}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Calendar() {
  const [open, setOpen] = useState(0);
  const m = MEETINGS[open];
  return (
    <div className="pd-view">
      <div className="pd-title">This week</div>
      <div className="pd-cal">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => <span key={d} className="pd-day">{d}</span>)}
        {MEETINGS.map((mt, i) => (
          <button
            key={mt.title}
            type="button"
            className={`pd-meet${open === i ? ' is-open' : ''}`}
            style={{ gridColumn: mt.day + 1, gridRow: `${mt.start + 2} / span ${mt.len}` }}
            onClick={() => setOpen(i)}
          >
            {mt.title}
          </button>
        ))}
      </div>
      <div className="pd-prep"><b>{m.title}</b> Prep: {m.prep}. The transcript and follow-ups land here after the call.</div>
    </div>
  );
}

function Board() {
  const [cards, setCards] = useState(START_CARDS);
  const move = (id) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, col: (c.col + 1) % 3 } : c)));
  return (
    <div className="pd-view">
      <div className="pd-title">Client board</div>
      <div className="pd-board">
        {COLUMNS.map((col, ci) => (
          <div key={col} className="pd-col">
            <span className="pd-col-head">{col} <em>{cards.filter((c) => c.col === ci).length}</em></span>
            {cards.filter((c) => c.col === ci).map((c) => (
              <button key={c.id} type="button" className="pd-card" onClick={() => move(c.id)} title="Move to the next column">
                <small>{c.id}</small>
                {c.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { key: 'inbox', label: 'Inbox', View: Inbox },
  { key: 'calendar', label: 'Calendar', View: Calendar },
  { key: 'projects', label: 'Projects', View: Board },
];

export default function PlatformDemo() {
  const [tab, setTab] = useState('inbox');
  const View = TABS.find((t) => t.key === tab).View;
  return (
    <div className="pd">
      <nav className="pd-side" aria-label="Platform demo sections">
        <b>GoKarya</b>
        {TABS.map((t) => (
          <button key={t.key} type="button" className={tab === t.key ? 'on' : ''} aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="pd-main" key={tab}>
        <View />
      </div>
    </div>
  );
}
