/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arama: {
          50: '#fdf8f6',
          100: '#fbeee9',
          200: '#f5dcd2',
          300: '#edbfab',
          400: '#e39578',
          500: '#d96b43', // primary warm amber/terracotta for Arama restaurant
          600: '#c5532b',
          700: '#a54221',
          800: '#87371f',
          900: '#70311d',
          950: '#3d180e',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        sans: ['var(--font-tajawal)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
