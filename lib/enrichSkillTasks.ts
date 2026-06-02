import type { SkillTask, SkillTaskSkillType } from '@/types/careerRoadmap'
import type { TaskResources } from '@/types/premiumRoadmapResources'

const DURATION_BY_INDEX = ['30 min', '45 min', '1 hr', '2 hrs'] as const

const SKILL_TYPE_BY_INDEX: SkillTaskSkillType[] = ['Technical', 'Technical', 'Discovery', 'Metrics']

function inferSkillType(label: string, index: number): SkillTaskSkillType {
  const lower = label.toLowerCase()
  if (/interview|discovery|stakeholder|user|problem statement|prioritize|scope|prd|narrative/.test(lower)) {
    return 'Discovery'
  }
  if (/metric|evaluat|assessment|scoring|success criteria|golden-set|rubric/.test(lower)) {
    return 'Metrics'
  }
  if (/api|integrat|schema|database|handler|wire|endpoint|config/.test(lower)) {
    return 'Integration'
  }
  if (/strategy|align|publish|present|demo|document/.test(lower)) {
    return 'Strategy'
  }
  return SKILL_TYPE_BY_INDEX[index] ?? 'Technical'
}

function defaultActionItem(label: string): string {
  return `Submit one verifiable artifact (document, screenshot, repo link, or demo recording) that proves you completed "${label}" and can be referenced in your sprint log or portfolio.`
}

function defaultResourcesForTask(task: SkillTask, index: number, milestoneTitle: string): TaskResources {
  const label = task.label
  return {
    conceptExplanation: `Completing "${label}" builds a concrete signal that you can execute in a ${milestoneTitle.toLowerCase()} context—not just discuss it. This task closes a gap recruiters look for when validating your transition from operational work to destination-role ownership.`,
    actionItem: task.actionItem ?? defaultActionItem(label),
    actionSteps: [
      `Step 1: Block 15 minutes to define the done state for "${label}" with one measurable output.`,
      `Step 2: Execute the core implementation or research pass, capturing screenshots, commits, or notes as proof.`,
      `Step 3: Validate the result against your sprint milestone criteria and log blockers for your next session.`,
    ],
    conceptReferences: [
      {
        label: 'Concept Overview',
        url: 'https://developer.mozilla.org/en-US/docs/Learn',
      },
    ],
    officialDocumentation: [
      {
        label: 'Official Docs',
        url: 'https://docs.github.com/en/get-started',
      },
    ],
  }
}

/** Ensures every task has skill metadata and structured learning resources for the accordion UI. */
export function enrichSkillTask(
  task: SkillTask,
  index: number,
  milestoneTitle: string
): SkillTask {
  const skillType = task.skillType ?? inferSkillType(task.label, index)
  const estimatedDuration = task.estimatedDuration ?? DURATION_BY_INDEX[index] ?? '45 min'
  const resources = task.resources ?? defaultResourcesForTask(task, index, milestoneTitle)
  const actionItem =
    task.actionItem?.trim() ||
    resources.actionItem?.trim() ||
    defaultActionItem(task.label)

  return {
    ...task,
    skillType,
    estimatedDuration,
    actionItem,
    resources: {
      ...resources,
      actionItem,
      actionSteps: resources.actionSteps.slice(0, 3),
      conceptReferences: resources.conceptReferences?.length
        ? resources.conceptReferences
        : [
            {
              label: 'Concept Guide',
              url: 'https://www.nngroup.com/articles/',
            },
          ],
    },
  }
}

export function enrichMilestoneTasks(tasks: SkillTask[], milestoneTitle: string): SkillTask[] {
  return tasks.map((task, index) => enrichSkillTask(task, index, milestoneTitle))
}

function parseTaskResources(raw: unknown): TaskResources | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const row = raw as Record<string, unknown>
  if (typeof row.conceptExplanation !== 'string') return undefined

  const actionSteps = Array.isArray(row.actionSteps)
    ? row.actionSteps.filter((s): s is string => typeof s === 'string')
    : []

  const parseLinks = (value: unknown) => {
    if (!Array.isArray(value)) return []
    return value
      .map((link) => {
        if (!link || typeof link !== 'object') return null
        const l = link as Record<string, unknown>
        if (typeof l.label !== 'string' || typeof l.url !== 'string') return null
        return { label: l.label, url: l.url }
      })
      .filter((link): link is { label: string; url: string } => link !== null)
  }

  const actionItem = typeof row.actionItem === 'string' ? row.actionItem : undefined

  return {
    conceptExplanation: row.conceptExplanation,
    actionSteps,
    actionItem,
    conceptReferences: parseLinks(row.conceptReferences),
    officialDocumentation: parseLinks(row.officialDocumentation),
  }
}

/** Parse a task row from stored JSON (supports legacy label-only and premium resource shape). */
export function parseSkillTask(raw: unknown): SkillTask | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>

  const id = typeof row.id === 'string' ? row.id : null
  const label =
    typeof row.label === 'string' ? row.label : typeof row.text === 'string' ? row.text : null
  if (!id || !label) return null

  const skillType =
    typeof row.skillType === 'string' ? (row.skillType as SkillTaskSkillType) : undefined
  const estimatedDuration =
    typeof row.estimatedDuration === 'string' ? row.estimatedDuration : undefined
  const resources = parseTaskResources(row.resources)
  const actionItem =
    typeof row.actionItem === 'string'
      ? row.actionItem
      : resources?.actionItem

  return { id, label, skillType, estimatedDuration, actionItem, resources }
}
