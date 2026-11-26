import { useState } from 'react';
import { PlateBody } from '../Plates.jsx';

// The gokarya.com hero in miniature: pick an industry to reshape the particles, and move through
// the field to scatter them.
const INDUSTRIES = ['Data centers', 'Real estate', 'Life sciences'];

export default function GoKaryaDemo({ active = true }) {
  const [forced, setForced] = useState(null);
  return (
    <div className="gd">
      <PlateBody kind="gokarya" active={active} forced={forced} />
      <div className="gd-picks" role="group" aria-label="Choose an industry">
        {INDUSTRIES.map((name, i) => (
          <button key={name} type="button" aria-pressed={forced === i + 1} className={forced === i + 1 ? 'on' : ''} onClick={() => setForced(forced === i + 1 ? null : i + 1)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
