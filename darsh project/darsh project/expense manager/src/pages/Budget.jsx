import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { financeApi } from '../services/apiClient';
import { useAuth } from '../context/AuthContext.jsx';

const emptyCategory = { name: '', allocated: '', color: '#277fef' };
const guestBudgetTemplate = {
  amount: 75000,
  savingsGoal: 25000,
  categories: [
    { name: 'Food', allocated: 15000, spent: 8200, color: '#f97316' },
    { name: 'Transport', allocated: 6000, spent: 2800, color: '#0ea5e9' },
    { name: 'Shopping', allocated: 12000, spent: 5400, color: '#c026d3' },
    { name: 'Utilities', allocated: 8000, spent: 6100, color: '#22c55e' },
    { name: 'Entertainment', allocated: 5000, spent: 2200, color: '#f43f5e' },
    { name: 'Goals', allocated: 29000, spent: 12000, color: '#2563eb' },
  ],
};

const Budget = () => {
  const { user } = useAuth();
  const isGuest = !user;

  const [budget, setBudget] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadBudget = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isGuest) {
        setBudget(JSON.parse(JSON.stringify(guestBudgetTemplate)));
        return;
      }
      const response = await financeApi.getBudget();
      setBudget(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load budget data');
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const handleBudgetUpdate = async updates => {
    if (!budget) return;
    if (isGuest) {
      setBudget(prev => (prev ? { ...prev, ...updates } : prev));
      return;
    }

    try {
      setSaving(true);
      setError('');
      const updated = await financeApi.updateBudget({ ...budget, ...updates });
      setBudget(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save budget changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async e => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.allocated) {
      setError('Please provide a category name and allocation.');
      return;
    }
    const categories = [
      ...(budget?.categories ?? []),
      {
        name: categoryForm.name,
        allocated: Number(categoryForm.allocated),
        spent: 0,
        color: categoryForm.color,
      },
    ];
    await handleBudgetUpdate({ categories });
    setCategoryForm(emptyCategory);
  };

  const handleSpend = async categoryName => {
    const categories = (budget?.categories ?? []).map(category =>
      category.name === categoryName ? { ...category, spent: Math.min(category.spent + 100, category.allocated) } : category
    );
    await handleBudgetUpdate({ categories });
  };

  const totals = useMemo(() => {
    if (!budget) return { spent: 0, remaining: 0, usage: 0 };
    const spent = (budget.categories ?? []).reduce((sum, category) => sum + category.spent, 0);
    const remaining = Math.max(budget.amount - spent, 0);
    const usage = budget.amount ? Math.min((spent / budget.amount) * 100, 100) : 0;
    return { spent, remaining, usage };
  }, [budget]);

  if (loading || !budget) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Budget</p>
          <h1 className="text-3xl font-bold text-slate-900">Plan with confidence</h1>
        </div>
        <button
          type="button"
          onClick={loadBudget}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
        >
          Refresh
        </button>
      </div>

      {isGuest && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          This is a sample budget. Sign in to sync updates with your real account.
        </p>
      )}

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <p className="text-sm text-slate-500">Monthly allocation</p>
          <p className="text-3xl font-bold text-slate-900">₹{budget.amount?.toLocaleString() ?? 0}</p>
          <div className="mt-6 space-y-5">
            {[
              { label: 'Spent', value: totals.spent, accent: 'text-red-500', bg: 'bg-red-100' },
              { label: 'Remaining', value: totals.remaining, accent: 'text-green-600', bg: 'bg-green-100' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{item.label}</span>
                  <span className={`font-semibold ${item.accent}`}>₹{item.value.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.bg}`} style={{ width: `${item.label === 'Spent' ? totals.usage : 100 - totals.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Update targets</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-slate-500">Monthly budget (₹)</label>
              <input
                type="number"
                value={budget.amount}
                onChange={e => setBudget(prev => ({ ...prev, amount: Number(e.target.value) }))}
                onBlur={() => handleBudgetUpdate({ amount: Number(budget.amount) })}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Savings goal (₹)</label>
              <input
                type="number"
                value={budget.savingsGoal}
                onChange={e => setBudget(prev => ({ ...prev, savingsGoal: Number(e.target.value) }))}
                onBlur={() => handleBudgetUpdate({ savingsGoal: Number(budget.savingsGoal) })}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <p className="text-sm text-slate-500">
              Savings progress:{' '}
              <span className="font-semibold text-brand-600">
                {budget.savingsGoal ? Math.min((totals.remaining / budget.savingsGoal) * 100, 100).toFixed(0) : 0}%
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          <span className="text-sm text-slate-500">{budget.categories?.length ?? 0} items</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(budget.categories ?? []).map(category => {
            const usage = category.allocated ? Math.min((category.spent / category.allocated) * 100, 100) : 0;
            return (
              <div key={category.name} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{category.name}</span>
                  <span>
                    ₹{category.spent}/{category.allocated}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-full rounded-full" style={{ width: `${usage}%`, backgroundColor: category.color ?? '#277fef' }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{usage.toFixed(0)}% used</span>
                  <button type="button" className="text-brand-600" onClick={() => handleSpend(category.name)}>
                    +₹100
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Category name"
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={categoryForm.name}
            onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Alloc. amount"
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={categoryForm.allocated}
            onChange={e => setCategoryForm(prev => ({ ...prev, allocated: e.target.value }))}
          />
          <div className="flex gap-2">
            <input
              type="color"
              className="h-12 flex-1 rounded-2xl border border-slate-200"
              value={categoryForm.color}
              onChange={e => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
            />
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:opacity-60"
            >
              Add
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Budget;
