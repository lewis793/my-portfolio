import { useState } from 'react';

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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
      <div className="form-row">
        <label>
          Name
          <input required maxLength={60} autoComplete="name" value={form.name} onChange={set('name')} />
        </label>
        <label>
          Email
          <input required type="email" maxLength={256} autoComplete="email" value={form.email} onChange={set('email')} />
        </label>
      </div>
      <label>
        Message
        <textarea required maxLength={LIMIT} rows={6} value={form.message} onChange={set('message')} aria-describedby="count" />
      </label>
      <div className="form-foot">
        <button type="submit" className="button button-solid" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <span id="count" className="count">{form.message.length}/{LIMIT}</span>
      </div>
      <p className={`form-status is-${status.state}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}
