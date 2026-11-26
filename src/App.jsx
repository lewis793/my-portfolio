import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import Hero from './components/Hero.jsx';
import Showcase from './components/Showcase.jsx';
import Contact from './components/Contact.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Marquee from './components/Marquee.jsx';
import { gsap, SplitText, startSmoothScroll, scrollToTarget, reducedMotion } from './lib/motion.js';
import { links, work, projects, university, toolkit } from './data/content.js';
import './App.css';
import './motion.css';
import './casestudy.css';

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'university', label: 'University' },
  { id: 'contact', label: 'Contact' },
];

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id === 'top' ? '' : e.target.id);
      }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ['top', ...NAV.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// The highlight pill glides between nav items instead of jumping.
function Nav({ active }) {
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector(`a[href="#${active}"]`);
      if (!el || el.offsetParent === null) { setPill(null); return; }
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);
  return (
    <nav aria-label="Sections" ref={navRef} className="nav">
      <span className="nav-pill" style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w, opacity: 1 } : { opacity: 0 }} />
      {NAV.map(({ id, label }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
      ))}
    </nav>
  );
}

function ExternalLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function App() {
  const active = useActiveSection();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const root = useRef(null);
  const kbd = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';

  useEffect(() => startSmoothScroll(), []);

  // In-page links scroll smoothly through Lenis.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      // A project id selects that project in the Work viewer, then scrolls to the viewer.
      if (target.getAttribute('role') === 'tab') {
        window.dispatchEvent(new CustomEvent('showproject', { detail: target.id }));
        scrollToTarget('.sc');
      } else scrollToTarget(target);
      history.replaceState(null, '', a.getAttribute('href'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useGSAP(() => {
    // Reading progress along the top edge.
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    if (reducedMotion()) return;

    // Section headings rise in line by line from behind a mask.
    const splits = gsap.utils.toArray('.section-head h2, .footer-name').map((el) => {
      return SplitText.create(el, {
        type: 'lines,chars', mask: 'lines', autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, {
          yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.022,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }),
      });
    });
    gsap.utils.toArray('.section-head p, .reveal').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.utils.toArray('.uni-list li, .contact .form').forEach((el, i) => {
      gsap.from(el, { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', delay: (i % 3) * 0.08, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    // University rules draw across.
    gsap.utils.toArray('.uni-list li').forEach((el) => {
      gsap.fromTo(el, { '--rule': 0 }, { '--rule': 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    return () => splits.forEach((s) => s.revert());
  }, { scope: root });

  return (
    <div ref={root}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />

      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="#top" className="wordmark">Lewis Grice</a>
          <Nav active={active} />
          <div className="topbar-tools">
            <button type="button" className="kbd-button" onClick={() => setPaletteOpen(true)} aria-label="Open command menu">
              <span>{kbd}</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">
        <Hero />

        <section className="section wrap" id="work" aria-labelledby="work-h">
          <header className="section-head">
            <h2 id="work-h">Work</h2>
          </header>
          <Showcase groups={[{ label: 'GoKarya', items: work }, { label: 'Personal', items: projects }]} />
        </section>

        <section className="section wrap" id="university" aria-labelledby="uni-h">
          <header className="section-head">
            <h2 id="uni-h">University</h2>
            <p>Computer Science and AI at the University of Bath.</p>
          </header>
          <ul className="uni-list">
            {university.map((u) => (
              <li key={u.id}>
                <a href={u.href} target="_blank" rel="noopener noreferrer">
                  <span className="uni-name">{u.name}</span>
                  <span className="uni-short">{u.short}</span>
                  <span className="uni-stack">{u.stack.join(', ')}</span>
                  <svg className="uni-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section section-toolkit" aria-labelledby="toolkit-h">
          <div className="wrap">
            <header className="section-head">
              <h2 id="toolkit-h">What I work with</h2>
              <p>Scroll faster and the rows speed up.</p>
            </header>
          </div>
          <div className="toolkit">
            {toolkit.map((t, i) => (
              <div className="toolkit-row" key={t.group}>
                <span className="toolkit-label wrap">{t.group}</span>
                <Marquee items={t.items} reverse={i % 2 === 1} label={t.group} />
              </div>
            ))}
          </div>
        </section>

        <section className="section wrap" id="contact" aria-labelledby="contact-h">
          <div className="contact">
            <header className="section-head">
              <h2 id="contact-h">Get in touch</h2>
              <p>
                Send a message and I&apos;ll reply by email. I&apos;m also on <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink> and{' '}
                <ExternalLink href={links.github}>GitHub</ExternalLink>.
              </p>
            </header>
            <Contact />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-name" aria-hidden="true">Lewis Grice</p>
          <div className="footer-meta">
            <span>&copy; {new Date().getFullYear()} Lewis Grice</span>
            <span>
              Press <button type="button" className="link-button" onClick={() => setPaletteOpen(true)}>{kbd}</button> to jump anywhere.
              Older university code is on <ExternalLink href={links.githubUni}>my university GitHub</ExternalLink>.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
