import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Expense Tracking',
    body: 'Log and categorize spending in seconds.',
    icon: '📒',
  },
  {
    title: 'Smart Budgets',
    body: 'Stay on target with friendly alerts.',
    icon: '🎯',
  },
  {
    title: 'Insightful Reports',
    body: 'Understand trends with beautiful charts.',
    icon: '📈',
  },
];

const steps = [
  'Create your secure account.',
  'Add income and expenses in real-time.',
  'Set budgets for every category.',
  'Watch insights update instantly.',
];

const testimonials = [
  {
    body: 'ExpenseManager helped me reclaim 20% of my salary each month.',
    name: 'Priya S.',
  },
  {
    body: 'The dashboards make money conversations simple for our family.',
    name: 'Alex T.',
  },
];

const Home = () => (
  <div className="relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-30">
      <div className="gradient blur-3xl" />
    </div>

    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:pt-20 md:grid-cols-2 md:items-center">
      <div className="space-y-6">
        <p className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-brand-600 shadow-card">
          Smarter budgets. Happier wallets.
        </p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Track every rupee, reach every goal.
        </h1>
        <p className="text-lg text-slate-600">
          ExpenseManager unifies tracking, budgeting, and reporting so you can make confident financial decisions without spreadsheets.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/auth" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-700">
            Get started
          </Link>
          <Link to="/about" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:border-brand-200">
            Learn more
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Current month</p>
            <p className="text-3xl font-bold text-slate-900">₹68,420</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">+8.4%</span>
        </div>
        <div className="mt-6 space-y-4">
          {['Income', 'Expenses', 'Savings'].map((label, idx) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{label}</span>
                <span>{['₹82,000', '₹13,580', '₹68,420'][idx]}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${[100, 45, 80][idx]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white/80">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
        {features.map(feature => (
          <div key={feature.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 text-3xl">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-8 shadow-card md:p-12">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <ol className="mt-6 grid gap-4 text-slate-600 md:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-xl bg-white/80 p-4 text-sm shadow-card">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
        {testimonials.map(testimonial => (
          <div key={testimonial.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <p className="text-lg text-slate-700">“{testimonial.body}”</p>
            <p className="mt-4 font-semibold text-slate-900">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;