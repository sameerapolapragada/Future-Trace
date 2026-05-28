/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
}
