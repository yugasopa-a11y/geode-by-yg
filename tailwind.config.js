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
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        'surface-steel': '#2a2f3a',
        'text-primary': '#e5e5e5',
        'text-secondary': '#a3a3a3',
        'accent': '#c9a96e',
        'accent-amber': '#8B5A00',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'border-color': 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-accent/5',
    'bg-accent/10',
    'border-accent/20',
    'border-accent/40',
    'text-accent/80',
    'text-accent/50',
    'bg-accent-amber/5',
    'bg-surface-steel/10'
  ]
}
