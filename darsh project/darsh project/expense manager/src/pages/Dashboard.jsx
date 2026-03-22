
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { financeApi } from '../services/apiClient';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Income', 'Other'];
const buildTransactionForm = () => ({
  name: '',
  amount: '',
  category: categories[0],
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
});

const guestSummaryData = {
  income: 82000,
  expenses: 48350,
  netSavings: 33650,
};

const guestTransactionsData = [
  {
    _id: 'guest-1',
    name: 'Salary credited',
    amount: 82000,
    category: 'Income',
    type: 'income',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-2',
    name: 'Weekly groceries',
    amount: 3250,
    category: 'Food',
    type: 'expense',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-3',
    name: 'Metro pass recharge',
    amount: 1200,
    category: 'Transport',
    type: 'expense',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-4',
    name: 'Coffee with friends',
    amount: 600,
    category: 'Entertainment',
    type: 'expense',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-5',
    name: 'Electricity bill',
    amount: 7800,
    category: 'Utilities',
    type: 'expense',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-6',
    name: 'Apartment rent',
    amount: 26000,
    category: 'Other',
    type: 'expense',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'guest-7',
    name: 'EMI payment',
    amount: 9500,
    category: 'Other',
    type: 'expense',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const isGuest = !user;

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(() => buildTransactionForm());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isGuest) {
        setSummary({ ...guestSummaryData });
        setTransactions(guestTransactionsData.map(tx => ({ ...tx })));
        return;
      }
      const [summaryResponse, txResponse] = await Promise.all([financeApi.getSummary(), financeApi.getTransactions()]);
      setSummary(summaryResponse);
      setTransactions(txResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.amount) {
      setError('Please fill in all transaction fields.');
      return;
    }
    const amountValue = Number(form.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (isGuest) {
      const newTx = { ...form, amount: amountValue, _id: `guest-${Date.now()}` };
      setTransactions(prev => [newTx, ...prev]);
      setSummary(prev =>
        prev
          ? {
              ...prev,
              income: prev.income + (newTx.type === 'income' ? amountValue : 0),
              expenses: prev.expenses + (newTx.type === 'expense' ? amountValue : 0),
              netSavings: prev.netSavings + (newTx.type === 'income' ? amountValue : -amountValue),
            }
          : prev
      );
      setForm(buildTransactionForm());
      return;
    }

    try {
      setSaving(true);
      setError('');
      const created = await financeApi.createTransaction({ ...form, amount: amountValue });
      setTransactions(prev => [created, ...prev]);
      setForm(buildTransactionForm());
      loadData(); // refresh summary from server
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (isGuest) {
      setTransactions(prev => {
        const toDelete = prev.find(tx => tx._id === id);
        if (!toDelete) {
          return prev;
        }
        setSummary(current =>
          current
            ? {
                ...current,
                income: current.income - (toDelete.type === 'income' ? toDelete.amount : 0),
                expenses: current.expenses - (toDelete.type === 'expense' ? toDelete.amount : 0),
                netSavings: current.netSavings - (toDelete.type === 'income' ? toDelete.amount : -toDelete.amount),
              }
            : current
        );
        return prev.filter(tx => tx._id !== id);
      });
      return;
    }

    try {
      await financeApi.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx._id !== id));
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete transaction');
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filter === 'All' || tx.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, filter]);

  if (loading && !summary) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
        >
          Refresh data
        </button>
      </div>

      {isGuest && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You are exploring sample data. Sign in to sync real transactions from your account.
        </p>
      )}

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {summary && (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Income', value: summary.income, accent: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Expenses', value: summary.expenses, accent: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Net savings', value: summary.netSavings, accent: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Transactions', value: transactions.length, accent: 'text-slate-600', bg: 'bg-slate-100' },
          ].map(card => (
            <div key={card.label} className={`rounded-3xl border border-slate-100 ${card.bg} p-5 shadow-card`}>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold ${card.accent}`}>
                {card.label === 'Transactions' ? card.value : `₹${card.value?.toLocaleString() ?? 0}`}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Add transaction</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">Amount</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.amount}
                  onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm text-slate-500">Category</label>
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-500">Type</label>
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-500">Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.date}
                  onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Adding…' : 'Add transaction'}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-500">Search</label>
              <input
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Electricity bill"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Category</label>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                {categories.map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
          <p className="text-sm text-slate-500">{filteredTransactions.length} records</p>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {filteredTransactions.length === 0 && <p className="py-6 text-sm text-slate-500">No transactions found.</p>}
          {filteredTransactions.map(tx => (
            <div key={tx._id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{tx.name}</p>
                <p className="text-sm text-slate-500">
                  {tx.category} · {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-lg font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
              </span>
              <button type="button" className="text-sm font-medium text-red-500" onClick={() => handleDelete(tx._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;