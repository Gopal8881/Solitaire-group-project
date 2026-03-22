import React, { useEffect, useMemo, useState } from 'react';
import { financeApi } from '../services/apiClient';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Income', 'Other'];
const types = ['All', 'income', 'expense'];
const guestReportRows = [
  { _id: 'guest-r-1', name: 'Salary credited', category: 'Income', type: 'income', amount: 82000, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'guest-r-2', name: 'Groceries', category: 'Food', type: 'expense', amount: 3400, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'guest-r-3', name: 'Movie night', category: 'Entertainment', type: 'expense', amount: 950, date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'guest-r-4', name: 'Cab ride', category: 'Transport', type: 'expense', amount: 480, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'guest-r-5', name: 'Freelance payout', category: 'Income', type: 'income', amount: 12000, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];

const Reports = () => {
  const { user } = useAuth();
  const isGuest = !user;

  const [filters, setFilters] = useState({ category: 'All', type: 'All', from: '', to: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (isGuest) {
      setRows(guestReportRows.map(row => ({ ...row })));
    } else {
      setRows([]);
    }
  }, [isGuest]);

  const fetchReports = async () => {
    const applyGuestFilters = data =>
      data.filter(row => {
        const matchesCategory = filters.category === 'All' || row.category === filters.category;
        const matchesType = filters.type === 'All' || row.type === filters.type;
        const fromOk = !filters.from || new Date(row.date) >= new Date(filters.from);
        const toOk = !filters.to || new Date(row.date) <= new Date(filters.to);
        return matchesCategory && matchesType && fromOk && toOk;
      });

    try {
      setLoading(true);
      setError('');
      if (isGuest) {
        setRows(applyGuestFilters(guestReportRows));
        return;
      }
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.type !== 'All') params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const data = await financeApi.getReports(params);
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const income = rows.filter(row => row.type === 'income').reduce((sum, row) => sum + row.amount, 0);
    const expenses = rows.filter(row => row.type === 'expense').reduce((sum, row) => sum + row.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [rows]);

  const handleDownload = () => {
    if (!rows.length) return;
    const header = 'Name,Category,Type,Amount,Date';
    const csvRows = rows.map(row => [row.name, row.category, row.type, row.amount, new Date(row.date).toLocaleDateString()].join(','));
    const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'expense-manager-report.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Reports</p>
          <h1 className="text-3xl font-bold text-slate-900">Understand your money story</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchReports}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
          >
            Generate report
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!rows.length}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Download CSV
          </button>
        </div>
      </div>

      {isGuest && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You are previewing demo insights. Sign in to generate reports from your real transactions.
        </p>
      )}

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs uppercase text-slate-500">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All' : type === 'income' ? 'Income' : 'Expense'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">From</label>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">To</label>
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Income', value: totals.income, accent: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Expenses', value: totals.expenses, accent: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Net', value: totals.net, accent: 'text-slate-900', bg: 'bg-slate-100' },
        ].map(card => (
          <div key={card.label} className={`rounded-3xl border border-slate-100 ${card.bg} p-6 shadow-card`}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.accent}`}>₹{card.value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
          {loading && <span className="text-sm text-slate-500">Loading…</span>}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-3 py-6 text-center text-sm text-slate-500">
                    No data yet. Run a report to see transactions.
                  </td>
                </tr>
              )}
              {rows.map(row => (
                <tr key={row._id}>
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-3 py-3">{row.category}</td>
                  <td className="px-3 py-3 capitalize">{row.type}</td>
                  <td className="px-3 py-3">{row.type === 'income' ? '+' : '-'}₹{row.amount}</td>
                  <td className="px-3 py-3">{new Date(row.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
