import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#dceeff',
          200: '#b9dcff',
          300: '#85c3ff',
          400: '#4f9ef7',
          500: '#277fef',
          600: '#1664cc',
          700: '#124ea3',
          800: '#133f7f',
          900: '#123566',
        },
        success: '#10b981',
        warning: '#f97316',
        danger: '#ef4444',
      },
      boxShadow: {
        card: '0 8px 30px rgba(16, 71, 143, 0.1)',
      },
    },
  },
  plugins: [
    forms,
  ],
};
