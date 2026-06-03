import { statusColors } from '@/theme/colors'

/** Tailwind class bundles for status badges on light canvas backgrounds. */
export const statusBadgeClasses = {
  success: 'badge-status-success',
  warning: 'badge-status-warning',
  anomaly: 'badge-status-anomaly',
} as const

export function exposureRiskBadgeClass(label: 'Safe' | 'At Risk' | 'Vulnerable'): string {
  const base = 'rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide'
  if (label === 'Vulnerable') {
    return `${base} ${statusBadgeClasses.anomaly}`
  }
  if (label === 'At Risk') {
    return `${base} ${statusBadgeClasses.warning}`
  }
  return `${base} ${statusBadgeClasses.success}`
}

export { statusColors }
