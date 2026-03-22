import React from 'react';

const stats = [
  { label: 'Active users', value: '50K+' },
  { label: 'Monthly tracked', value: '₹80Cr+' },
  { label: 'Automation score', value: '98%' },
  { label: 'Support availability', value: '24/7' },
];

const values = [
  { icon: '🔒', title: 'Security first', body: 'Bank-grade encryption and privacy at every layer.' },
  { icon: '💡', title: 'Simplicity', body: 'We obsess over clean flows so money doesn’t feel complex.' },
  { icon: '🚀', title: 'Momentum', body: 'We ship weekly improvements inspired by community feedback.' },
  { icon: '🤝', title: 'Trust', body: 'Transparent pricing and human support when you need it.' },
];

const About = () => (
  <div className="mx-auto max-w-5xl px-4 py-12">
    <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
      <p className="text-sm text-slate-500">About us</p>
      <h1 className="mt-2 text-4xl font-semibold text-slate-900">ExpenseManager</h1>
      <p className="mt-4 text-slate-600">
        We started ExpenseManager to replace spreadsheets with a calmer way to plan money. Today thousands of individuals and families rely on our
        platform to keep expenses organized, goals in sight, and conversations around finances easier.
      </p>
    </section>

    <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
      <h2 className="text-2xl font-semibold text-slate-900">Why expense management matters</h2>
      <p className="mt-4 text-slate-600">
        Understanding where money flows each week unlocks better decisions. We combine real-time tracking, proactive nudges, and actionable insights so you
        can:
      </p>
      <ul className="mt-4 space-y-2 text-slate-600">
        <li>• Capture every rupee effortlessly</li>
        <li>• Build budgets that reflect your priorities</li>
        <li>• Visualize trends instantly with live charts</li>
        <li>• Export clean reports for taxes or advisors</li>
      </ul>
    </section>

    <section className="mt-8 grid gap-4 md:grid-cols-4">
      {stats.map(stat => (
        <div key={stat.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </section>

    <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
      <h2 className="text-2xl font-semibold text-slate-900">Our values</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {values.map(value => (
          <div key={value.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
            <p className="text-2xl">{value.icon}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{value.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{value.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-8 rounded-3xl border border-brand-100 bg-brand-50/50 p-8 text-slate-900 shadow-card">
      <h2 className="text-2xl font-semibold">Our mission</h2>
      <p className="mt-3 text-slate-700">
        Everyone deserves financial clarity. We exist to help you understand money at a glance, plan with intent, and stay motivated as life evolves. Join
        the community and build the future you want—without spreadsheet stress.
      </p>
    </section>
  </div>
);

export default About;
