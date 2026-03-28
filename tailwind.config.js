/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0a0e1a',
        'bg-card': '#111827',
        'bg-hover': '#1e293b',
        'cyan': '#00F0FF',
        'electric': '#0066FF',
        'neon': '#39FF14',
        'hotpink': '#FF006E',
        'amber': '#F7C948',
      },
      fontFamily: {
        brand: ['Orbitron', 'monospace'],
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
