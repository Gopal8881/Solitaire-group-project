import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Auth = () => {
  const navigate = useNavigate();
  const { user, login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = e => {
    if (error) clearError();
    setLocalError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setLocalError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const payload = { email: form.email, password: form.password, ...(isLogin ? {} : { name: form.name }) };
    const action = isLogin ? login : register;
    const result = await action(payload);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">Secure & Private</p>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back to ExpenseManager</h1>
        <p className="text-slate-600">Sign in to sync your transactions, manage real-time budgets, and keep financial health on track.</p>
      </div>
      <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setLocalError('');
              clearError();
            }}
            className={`rounded-full py-2 transition ${isLogin ? 'bg-white text-brand-600 shadow-card' : ''}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setLocalError('');
              clearError();
            }}
            className={`rounded-full py-2 transition ${!isLogin ? 'bg-white text-brand-600 shadow-card' : ''}`}
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-slate-600">Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Riya Sharma"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-600">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {(localError || error) && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{localError || error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
