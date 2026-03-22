import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊', private: true },
  { to: '/budget', label: 'Budget', icon: '🎯', private: true },
  { to: '/reports', label: 'Reports', icon: '📈', private: true },
  { to: '/about', label: 'About', icon: 'ℹ️' },
  { to: '/contact', label: 'Contact', icon: '📞' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const activeClass = path => (location.pathname === path ? 'text-brand-500' : 'text-slate-600');
  const visibleLinks = navLinks.filter(link => (link.private ? Boolean(user) : true));

  return (
    <header className={`sticky top-0 z-40 transition duration-300 ${isScrolled ? 'backdrop-blur bg-white/90 shadow-lg' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="relative flex items-center gap-2 text-lg font-semibold text-slate-900" onClick={closeMenu}>
          <span className="text-2xl">💰</span>
          ExpenseManager
          <span className="absolute -bottom-1 left-0 h-1 w-1/2 rounded-full bg-brand-400 blur-md"></span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {visibleLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`group relative flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition hover:text-brand-500 ${activeClass(link.to)}`}
            >
              <span>{link.icon}</span>
              {link.label}
              <span className="absolute inset-x-2 -bottom-1 h-0.5 translate-y-1 rounded-full bg-brand-400 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                {user.name}
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-500"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-slate-200 text-slate-700 shadow-card transition lg:hidden"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="bg-white px-4 pb-6 pt-2 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-2">
            {visibleLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${location.pathname === link.to ? 'border-brand-200 bg-brand-50 text-brand-600' : 'border-slate-100 text-slate-600 hover:border-brand-100 hover:bg-brand-50/60 hover:text-brand-600'}`}
                onClick={closeMenu}
              >
                <span className="flex items-center gap-2">
                  <span>{link.icon}</span>
                  {link.label}
                </span>
                {location.pathname === link.to && <span className="text-xs font-medium text-brand-500">Active</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            {user ? (
              <button
                type="button"
                className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-xl border border-brand-100 bg-brand-500 py-3 text-center text-sm font-semibold text-white shadow-card"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;