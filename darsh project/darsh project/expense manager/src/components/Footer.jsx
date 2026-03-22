import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/reports', label: 'Reports' },
];

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white/70">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>© {new Date().getFullYear()} ExpenseManager. All rights reserved.</span>
      <div className="flex flex-wrap gap-4">
        {links.map(link => (
          <Link key={link.to} to={link.to} className="transition hover:text-brand-500">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
