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
        background: '#050505',
        surface: '#0a0a0a',
        'surface-2': '#121212',
        'surface-steel': '#1e222a',
        'text-primary': '#f5f5f5',
        'text-secondary': '#9a9a9a',
        'text-tertiary': '#666666',
        'accent': '#d4b88a',
        'accent-amber': '#b8860b',
        'glass-bg': 'rgba(255, 255, 255, 0.02)',
        'glass-border': 'rgba(255, 255, 255, 0.06)',
        'border-color': 'rgba(255, 255, 255, 0.08)',
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
}
