/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        trace: {
          bg: 'var(--trace-background)',
          surface: 'var(--trace-surface)',
          raised: 'var(--trace-surface-raised)',
          foreground: 'var(--trace-foreground)',
          muted: 'var(--trace-muted)',
          DEFAULT: 'var(--trace-accent)',
          hover: 'var(--trace-accent-hover)',
          glow: 'var(--trace-accent-glow)',
          deep: 'var(--trace-accent-deep)',
          border: 'var(--trace-border)',
          card: 'var(--trace-card)',
        },
        pwa: {
          background: 'var(--pwa-background)',
          foreground: 'var(--pwa-foreground)',
          muted: 'var(--pwa-muted)',
          accent: 'var(--pwa-accent)',
          'accent-emerald': 'var(--pwa-accent-emerald)',
          card: 'var(--pwa-card)',
          'card-border': 'var(--pwa-card-border)',
        },
      },
      backgroundColor: {
        'pwa-bg': 'var(--pwa-background)',
        'pwa-card': 'var(--pwa-card)',
      },
      borderColor: {
        'pwa-card': 'var(--pwa-card-border)',
        trace: 'var(--trace-border)',
      },
      boxShadow: {
        trace: '0 0 24px rgba(14, 165, 233, 0.25)',
        'trace-lg': '0 0 40px rgba(14, 165, 233, 0.35)',
      },
      keyframes: {
        'auth-logo-enter': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'auth-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'home-logo-enter': {
          '0%': { transform: 'scale(0.82)' },
          '100%': { transform: 'scale(1)' },
        },
        'home-title-enter': {
          '0%': { transform: 'translateX(-14px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'auth-logo-enter': 'auth-logo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'auth-fade-up': 'auth-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'home-logo-enter': 'home-logo-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
        'home-title-enter': 'home-title-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
