/** UI copy and helpers for macro (full transition) vs micro (30-day sprint) journey framing. */

export const MACRO_PROGRESS_SECTION_LABEL = 'Macro progress'
export const MICRO_SPRINT_WORKSPACE_LABEL = 'Current 30-Day Sprint'

/** Ensures the 30-day execution line ends with the macro-unlock CTA. */
export function formatSprintExecutionStatement(nextMilestone: string): string {
  const trimmed = nextMilestone.trim().replace(/[.\s]+$/, '')
  const suffix = 'to unlock your next macro milestone chapter'
  if (trimmed.toLowerCase().endsWith(suffix)) {
    return `${trimmed}.`
  }
  return `${trimmed} ${suffix}.`
}

export function formatBlueprintDurationLabel(totalMonths: number): string {
  return `Estimated Career Transition: ${totalMonths} Months`
}

export function milestoneMonthRange(
  milestoneIndex: number,
  totalMilestones: number,
  totalMonths: number
): { start: number; end: number } {
  const start = Math.floor((milestoneIndex * totalMonths) / totalMilestones) + 1
  const end = Math.floor(((milestoneIndex + 1) * totalMonths) / totalMilestones)
  return { start, end: Math.max(start, end) }
}

export function formatMilestoneChapterLabel(
  milestoneIndex: number,
  totalMilestones: number,
  totalMonths: number
): string {
  const { start, end } = milestoneMonthRange(milestoneIndex, totalMilestones, totalMonths)
  const chapter = milestoneIndex + 1
  return `Milestone ${chapter}/${totalMilestones} | Months ${start}–${end}`
}
