import React, { useState } from 'react';
import { supportApi } from '../services/apiClient';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: '', error: '' });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus({ submitting: false, success: '', error: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ submitting: false, success: '', error: 'Please complete all fields.' });
      return;
    }
    try {
      setStatus({ submitting: true, success: '', error: '' });
      const response = await supportApi.sendMessage(form);
      setStatus({ submitting: false, success: response.message ?? 'Message sent successfully!', error: '' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        submitting: false,
        success: '',
        error: err instanceof Error ? err.message : 'Unable to send message. Please try again.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <p className="text-sm text-slate-500">Contact</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">We’re here to help</h1>
          <p className="mt-3 text-slate-600">Send us a message and we’ll respond within 24 business hours.</p>

          <dl className="mt-6 space-y-3 text-sm text-slate-600">
            <div>
              <dt className="text-xs uppercase text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">support@expensemanager.com</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Phone</dt>
              <dd className="font-medium text-slate-900">+91 987 6543 210</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Hours</dt>
              <dd className="font-medium text-slate-900">Mon–Fri, 9:00 AM – 6:00 PM IST</dd>
            </div>
          </dl>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Can't wait? Browse our{' '}
            <a href="mailto:support@expensemanager.com" className="font-semibold text-brand-600">
              help center
            </a>{' '}
            while we respond.
          </div>
        </div>

        <form className="rounded-3xl border border-slate-100 bg-white p-8 shadow-card" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-500">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="mt-1 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Tell us what you need help with"
              />
            </div>
            {status.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{status.error}</p>}
            {status.success && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600">{status.success}</p>}
            <button
              type="submit"
              disabled={status.submitting}
              className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.submitting ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
