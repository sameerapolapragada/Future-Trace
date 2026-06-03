import type { SkillTask, SkillTaskSkillType } from '@/types/careerRoadmap'
import type { TaskResources } from '@/types/premiumRoadmapResources'
import type { BlueprintStep, SprintResourceLink } from '@/types/sprintTask'

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

function mapSkillTypeToSprintType(skillType: SkillTaskSkillType): SkillTask['type'] {
  switch (skillType) {
    case 'Discovery':
      return 'discovery'
    case 'Metrics':
      return 'metrics'
    case 'Integration':
      return 'integration'
    default:
      return 'technical'
  }
}

function defaultGoal(label: string): string {
  return `Deliver one verifiable artifact (document, screenshot, repo link, or demo recording) that proves you completed "${label}" and can be referenced in your sprint log or portfolio.`
}

function defaultBlueprintSteps(label: string, skillType: SkillTaskSkillType): BlueprintStep[] {
  const codeLanguage = skillType === 'Integration' ? 'json' : 'bash'
  return [
    {
      title: 'Step 1',
      instruction: `Block 15 minutes to define the done state for "${label}" with one measurable output.`,
      codeSnippet: `mkdir -p ~/future-trace/sprint-work\n# Define DONE: one file or URL you will submit as proof\necho "DONE=" >> ~/future-trace/sprint-work/notes.md`,
      codeLanguage,
    },
    {
      title: 'Step 2',
      instruction:
        'Execute the core implementation or research pass; capture screenshots, commits, or notes as proof.',
      codeSnippet:
        skillType === 'Metrics'
          ? `cat <<'EOF' > metrics-checklist.json\n{\n  "task": "${label}",\n  "success_metric": "",\n  "baseline": "",\n  "target": ""\n}\nEOF`
          : `git status\ngit add .\ngit commit -m "chore: progress on ${label}"`,
      codeLanguage: skillType === 'Metrics' ? 'json' : 'bash',
    },
    {
      title: 'Step 3',
      instruction:
        'Validate the result against your sprint milestone criteria and log blockers for your next session.',
      codeSnippet: `echo "## Blockers" >> ~/future-trace/sprint-work/notes.md\necho "- " >> ~/future-trace/sprint-work/notes.md`,
      codeLanguage: 'bash',
    },
  ]
}

function defaultCuratedResources(): SprintResourceLink[] {
  return [
    { label: 'Concept Guide', url: 'https://www.nngroup.com/articles/' },
    { label: 'Official Docs', url: 'https://docs.github.com/en/get-started' },
  ]
}

function defaultResourcesForTask(task: SkillTask, index: number, milestoneTitle: string): TaskResources {
  const label = task.label
  const goal = defaultGoal(label)
  return {
    conceptExplanation: `Completing "${label}" builds a concrete signal that you can execute in a ${milestoneTitle.toLowerCase()} context—not just discuss it. This task closes a gap recruiters look for when validating your transition from operational work to destination-role ownership.`,
    actionItem: task.actionItem ?? goal,
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
  const goal =
    task.goal?.trim() ||
    task.actionItem?.trim() ||
    resources.actionItem?.trim() ||
    defaultGoal(task.label)
  const whyThisMatters = task.whyThisMatters?.trim() || resources.conceptExplanation
  const steps =
    task.steps && task.steps.length > 0
      ? task.steps
      : defaultBlueprintSteps(task.label, skillType)
  const curatedResources =
    task.curatedResources && task.curatedResources.length > 0
      ? task.curatedResources
      : defaultCuratedResources()

  return {
    ...task,
    title: task.title ?? task.label,
    type: task.type ?? mapSkillTypeToSprintType(skillType),
    skillType,
    estimatedDuration,
    duration: task.duration ?? estimatedDuration,
    actionItem: goal,
    whyThisMatters,
    goal,
    steps,
    curatedResources,
    blueprintStatus: task.blueprintStatus ?? 'ready',
    resources: {
      ...resources,
      actionItem: goal,
      actionSteps: resources.actionSteps.slice(0, 3),
      conceptReferences: resources.conceptReferences?.length
        ? resources.conceptReferences
        : curatedResources.slice(0, 1).map((link) => ({ label: link.label, url: link.url })),
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

function parseBlueprintSteps(raw: unknown): BlueprintStep[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const steps = raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      if (typeof row.title !== 'string' || typeof row.instruction !== 'string') return null
      const step: BlueprintStep = {
        title: row.title.trim(),
        instruction: row.instruction.trim(),
      }
      if (typeof row.codeSnippet === 'string' && row.codeSnippet.trim()) {
        step.codeSnippet = row.codeSnippet
      }
      if (typeof row.codeLanguage === 'string' && row.codeLanguage.trim()) {
        step.codeLanguage = row.codeLanguage
      }
      return step
    })
    .filter((step): step is BlueprintStep => step !== null)

  return steps.length > 0 ? steps : undefined
}

function parseCuratedResources(raw: unknown): SprintResourceLink[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const links = raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      if (typeof row.label !== 'string' || typeof row.url !== 'string') return null
      return { label: row.label.trim(), url: row.url.trim() }
    })
    .filter((link): link is SprintResourceLink => link !== null)

  return links.length > 0 ? links : undefined
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
  const rawResources = row.resources
  const curatedResources = Array.isArray(rawResources)
    ? parseCuratedResources(rawResources)
    : undefined
  const resources = Array.isArray(rawResources) ? undefined : parseTaskResources(rawResources)
  const actionItem =
    typeof row.actionItem === 'string'
      ? row.actionItem
      : resources?.actionItem

  const title = typeof row.title === 'string' ? row.title : undefined
  const type =
    row.type === 'technical' ||
    row.type === 'discovery' ||
    row.type === 'metrics' ||
    row.type === 'integration'
      ? row.type
      : undefined
  const duration = typeof row.duration === 'string' ? row.duration : undefined
  const whyThisMatters = typeof row.whyThisMatters === 'string' ? row.whyThisMatters : undefined
  const goal = typeof row.goal === 'string' ? row.goal : undefined
  const steps = parseBlueprintSteps(row.steps)
  const blueprintStatus =
    row.blueprintStatus === 'loading' || row.blueprintStatus === 'ready'
      ? row.blueprintStatus
      : undefined

  return {
    id,
    label,
    title,
    type,
    skillType,
    estimatedDuration,
    duration,
    whyThisMatters,
    goal,
    steps,
    curatedResources,
    actionItem,
    blueprintStatus,
    resources,
  }
}
