/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        'text-primary': '#e5e5e5',
        'text-secondary': '#a3a3a3',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'border-color': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
