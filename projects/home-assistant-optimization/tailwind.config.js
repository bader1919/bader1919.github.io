/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          100: '#fef2cc',
          200: '#fde699',
          300: '#fcd966',
          400: '#fbcc33',
          500: '#fac000', // Primary gold
          600: '#c89900',
          700: '#967300',
          800: '#644c00',
          900: '#322600'
        },
        odoo: {
          purple: '#875A7B',
          gray: '#F8F9FA'
        }
      }
    },
  },
  plugins: [],
};