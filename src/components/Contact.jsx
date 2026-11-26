import { useState } from 'react';
import { gsap, reducedMotion, useMagnetic } from '../lib/motion.js';

const BRICK = ['#e3262f', '#ffcd03', '#2bb34a', '#1e6fd9', '#ff7a1a', '#9b5de5', '#00b2c8', '#f45ba1'];

// Blocks burst out of the button and fall away.
function burst(from) {
  if (!from || reducedMotion()) return;
  const r = from.getBoundingClientRect();
  for (let i = 0; i < 36; i++) {
    const b = document.createElement('span');
    b.className = 'confetti';
    b.style.background = BRICK[i % BRICK.length];
    b.style.left = `${r.left + r.width / 2}px`;
    b.style.top = `${r.top + r.height / 2}px`;
    document.body.appendChild(b);
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const v = 160 + Math.random() * 220;
    gsap.timeline({ onComplete: () => b.remove() })
      .to(b, { x: Math.cos(a) * v, y: Math.sin(a) * v, rotation: (Math.random() - 0.5) * 540, duration: 0.6, ease: 'power3.out' })
      .to(b, { y: `+=${260 + Math.random() * 200}`, opacity: 0, rotation: '+=180', duration: 1, ease: 'power2.in' });
  }
}

// EmailJS public keys: these are meant to be shipped to the browser.
const EMAILJS = {
  service_id: 'service_8crgin3',
  template_id: 'template_glhbr1h',
  user_id: 'ZNsqzrpzLvjkGnzYn',
};

const LIMIT = 500;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const button = useMagnetic(0.25);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  // The message box starts one line tall and grows with what's typed, up to about five lines.
  const grow = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    set('message')(e);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', text: 'Sending…' });
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...EMAILJS,
          template_params: { from_name: form.name, from_email: form.email, message: form.message },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setForm({ name: '', email: '', message: '' });
      burst(button.current);
      setStatus({ state: 'sent', text: 'Message sent. I’ll reply to the email you gave.' });
    } catch (err) {
      console.error(err);
      setStatus({
        state: 'error',
        text: 'The message didn’t send. Check your connection and try again, or message me on LinkedIn.',
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="f-name">
        Name
        <input required maxLength={60} autoComplete="name" value={form.name} onChange={set('name')} />
      </label>
      <label className="f-email">
        Email
        <input required type="email" maxLength={256} autoComplete="email" value={form.email} onChange={set('email')} />
      </label>
      <label className="f-msg">
        <span>
          Message
          {form.message.length > 0 && <span id="count" className="count">{form.message.length}/{LIMIT}</span>}
        </span>
        <textarea required maxLength={LIMIT} rows={1} value={form.message} onChange={grow} aria-describedby="count" />
      </label>
      <button ref={button} type="submit" className="button button-solid f-send" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send'}
      </button>
      <p className={`form-status is-${status.state}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}
