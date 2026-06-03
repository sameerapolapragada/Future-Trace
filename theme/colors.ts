/** Future Trace logo palette */

export const horizonColors = {
  background: '#000000',
  surface: '#0F172A',
  borderMuted: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accent: '#FDBB2D',
  accentHover: '#E85D04',
  accentMuted: 'rgba(253, 187, 45, 0.14)',
  accentGradient: 'linear-gradient(135deg, #FDBB2D 0%, #E85D04 100%)',
  highlight: '#22D3EE',
  highlightHover: '#06B6D4',
  highlightMuted: 'rgba(34, 211, 238, 0.14)',
  pageGradient: '#000000',
} as const

/** @deprecated Use horizonColors — kept for backward compatibility */
export const traceColors = {
  background: horizonColors.background,
  surface: horizonColors.surface,
  surfaceRaised: '#0F172A',
  foreground: horizonColors.textPrimary,
  muted: horizonColors.textSecondary,
  accent: horizonColors.accent,
  accentHover: horizonColors.accentHover,
  accentGlow: '#FDBB2D',
  accentDeep: '#E85D04',
  border: horizonColors.borderMuted,
  card: horizonColors.surface,
} as const

export const statusColors = {
  success: {
    bg: 'rgba(34, 211, 238, 0.12)',
    border: '#22D3EE',
    text: '#67E8F9',
  },
  warning: {
    bg: 'rgba(253, 187, 45, 0.12)',
    border: '#FDBB2D',
    text: '#FCD34D',
  },
  anomaly: {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: '#EF4444',
    text: '#FCA5A5',
  },
} as const
