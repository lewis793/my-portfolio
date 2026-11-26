import { useEffect, useState } from 'react';
import { currentTheme, switchTheme } from '../lib/theme.js';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener('themechange', sync);
    return () => window.removeEventListener('themechange', sync);
  }, []);
  const onClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(switchTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
  };
  const dark = theme === 'dark';
  return (
    <button type="button" className="icon-button theme-toggle" onClick={onClick} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id="moon"><rect width="24" height="24" fill="#fff" /><circle className="tt-bite" cx={dark ? 17 : 30} cy={dark ? 7 : -6} r="6" fill="#000" /></mask>
        <circle className="tt-core" cx="12" cy="12" r={dark ? 8 : 5} mask="url(#moon)" fill="currentColor" />
        <g className="tt-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={dark ? 0 : 1}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
