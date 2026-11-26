import { useEffect, useState } from 'react';
import Plate from './components/Plates.jsx';
import Contact from './components/Contact.jsx';
import { links, work, projects, university, toolkit } from './data/content.js';
import './App.css';

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'university', label: 'University' },
  { id: 'contact', label: 'Contact' },
];

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function ExternalLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function Entry({ item, flip }) {
  return (
    <article className={`entry${flip ? ' entry-flip' : ''}`} id={item.id}>
      <Plate kind={item.plate} />
      <div className="entry-body">
        <h3>{item.name}</h3>
        {item.role && <p className="entry-role">{item.role}</p>}
        <p className="entry-summary">{item.summary}</p>
        <ul className="entry-detail">
          {item.detail.map((d) => <li key={d}>{d}</li>)}
        </ul>
        <p className="stack">{item.stack.join(', ')}</p>
        {(item.links.length > 0 || item.note) && (
          <div className="entry-links">
            {item.links.map((l) => (
              <ExternalLink key={l.href} href={l.href} className="button">{l.label}</ExternalLink>
            ))}
            {item.note && <span className="entry-note">{item.note}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectCard({ item }) {
  return (
    <article className="card" id={item.id}>
      <Plate kind={item.plate} />
      <h3>{item.name}</h3>
      <p className="entry-summary">{item.summary}</p>
      <ul className="entry-detail">
        {item.detail.map((d) => <li key={d}>{d}</li>)}
      </ul>
      <p className="stack">{item.stack.join(', ')}</p>
      <div className="entry-links">
        {item.links.map((l) => (
          <ExternalLink key={l.href} href={l.href} className="button">{l.label}</ExternalLink>
        ))}
      </div>
    </article>
  );
}

export default function App() {
  const active = useActiveSection();

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="#top" className="wordmark">Lewis Grice</a>
          <nav aria-label="Sections">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" id="top">
          <h1>I build AI products, and small, careful software for myself.</h1>
          <div className="hero-copy">
            <p className="lede">
              I&apos;m on a placement year at <a href="#work">GoKarya</a>, where I build{' '}
              <a href="#nexus">Nexus</a>, a workspace where Claude drafts a consulting team&apos;s
              paperwork and people approve it. After this I go back to the University of Bath for the final
              year of my Computer Science and AI degree.
            </p>
            <p>
              Outside work I make things I want to use myself: a{' '}
              <a href="#blocksmash">puzzle game</a> without the ads, a{' '}
              <a href="#whisper">dictation app</a> that never leaves my PC, and an{' '}
              <a href="#eidolon">AI that runs locally</a>.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button button-solid">Get in touch</a>
              <ExternalLink href={links.github} className="button">GitHub</ExternalLink>
              <ExternalLink href={links.linkedin} className="button">LinkedIn</ExternalLink>
            </div>
          </div>
        </section>

        <section className="section wrap" id="work" aria-labelledby="work-h">
          <header className="section-head">
            <h2 id="work-h">Work at GoKarya</h2>
            <p>GoKarya builds AI systems for its clients. On placement I build its product and its website.</p>
          </header>
          {work.map((item, i) => <Entry key={item.id} item={item} flip={i % 2 === 1} />)}
        </section>

        <section className="section wrap" id="projects" aria-labelledby="projects-h">
          <header className="section-head">
            <h2 id="projects-h">Projects</h2>
            <p>Things I&apos;ve built in my own time. All three are open source.</p>
          </header>
          <div className="cards">
            {projects.map((item) => <ProjectCard key={item.id} item={item} />)}
          </div>
        </section>

        <section className="section wrap" id="university" aria-labelledby="uni-h">
          <header className="section-head">
            <h2 id="uni-h">University</h2>
            <p>Computer Science and AI at the University of Bath, with the final year still to come.</p>
          </header>
          <ul className="uni">
            {university.map((u) => (
              <li key={u.id}>
                <h3><ExternalLink href={u.href}>{u.name}</ExternalLink></h3>
                <p>{u.summary}</p>
                <p className="stack">{u.stack.join(', ')}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section wrap" aria-labelledby="toolkit-h">
          <header className="section-head">
            <h2 id="toolkit-h">What I work with</h2>
          </header>
          <dl className="toolkit">
            {toolkit.map((t) => (
              <div key={t.group}>
                <dt>{t.group}</dt>
                <dd>{t.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section wrap" id="contact" aria-labelledby="contact-h">
          <div className="contact">
            <header className="section-head">
              <h2 id="contact-h">Get in touch</h2>
              <p>
                For roles, projects or questions about anything here, send me a message and I&apos;ll reply
                by email. I&apos;m also on <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink> and{' '}
                <ExternalLink href={links.github}>GitHub</ExternalLink>.
              </p>
            </header>
            <Contact />
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <span>&copy; {new Date().getFullYear()} Lewis Grice</span>
        <span>
          Older university code is on <ExternalLink href={links.githubUni}>my university GitHub</ExternalLink>.
        </span>
      </footer>
    </>
  );
}
