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
        /* Clean Horizon semantic tokens */
        background: 'var(--horizon-background)',
        surface: 'var(--horizon-surface)',
        borderMuted: 'var(--horizon-border-muted)',
        textPrimary: 'var(--horizon-text-primary)',
        textSecondary: 'var(--horizon-text-secondary)',
        accent: {
          DEFAULT: 'var(--horizon-accent)',
          hover: 'var(--horizon-accent-hover)',
          muted: 'var(--horizon-accent-muted)',
        },
        accentMuted: 'var(--horizon-accent-muted)',
        accentHover: 'var(--horizon-accent-hover)',
        highlight: {
          DEFAULT: 'var(--horizon-highlight)',
          hover: 'var(--horizon-highlight-hover)',
          muted: 'var(--horizon-highlight-muted)',
        },
        /* Legacy trace (aliases) */
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
        brand: {
          DEFAULT: '#FDBB2D',
          hover: '#E85D04',
          light: 'rgba(253, 187, 45, 0.14)',
          muted: '#F59E0B',
          deep: '#C2410C',
        },
        status: {
          success: {
            bg: 'var(--status-success-bg)',
            border: 'var(--status-success-border)',
            text: 'var(--status-success-text)',
          },
          warning: {
            bg: 'var(--status-warning-bg)',
            border: 'var(--status-warning-border)',
            text: 'var(--status-warning-text)',
          },
          anomaly: {
            bg: 'var(--status-anomaly-bg)',
            border: 'var(--status-anomaly-border)',
            text: 'var(--status-anomaly-text)',
          },
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
        horizon: '0 4px 24px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.04)',
        'horizon-md': '0 8px 32px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.05)',
        trace: '0 4px 24px rgba(0, 0, 0, 0.35)',
        'trace-lg': '0 8px 32px rgba(0, 0, 0, 0.45)',
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
