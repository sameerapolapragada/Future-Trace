/** Standardized cache key for pooled master_milestone_blueprints rows. */
export function buildMilestoneBlueprintSlug(
  currentRole: string,
  targetRole: string,
  phaseNumber: number | string
): string {
  return `${currentRole}-${targetRole}-phase-${phaseNumber}`.toLowerCase().replace(/ /g, '-')
}

export function resolvePhaseNumber(
  phaseNumber: unknown,
  phaseLabel?: string
): number {
  if (typeof phaseNumber === 'number' && Number.isFinite(phaseNumber) && phaseNumber > 0) {
    return Math.floor(phaseNumber)
  }

  if (typeof phaseNumber === 'string' && phaseNumber.trim()) {
    const parsed = parseInt(phaseNumber, 10)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }

  const match = phaseLabel?.match(/phase\s*(\d+)/i)
  if (match) {
    const fromLabel = parseInt(match[1], 10)
    if (Number.isFinite(fromLabel) && fromLabel > 0) return fromLabel
  }

  throw new Error('phaseNumber or a phaseLabel like "Phase 1" is required')
}
