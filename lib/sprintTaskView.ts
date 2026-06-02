import type { SkillTask, SkillTaskSkillType } from '@/types/careerRoadmap'
import type { TaskResources } from '@/types/premiumRoadmapResources'
import type { BlueprintStep, SprintResourceLink, SprintTaskType, Task } from '@/types/sprintTask'

const CODE_FENCE_RE = /```(\w+)?\s*\n([\s\S]*?)```/

function mapSkillTypeToSprintType(skillType?: SkillTaskSkillType): SprintTaskType {
  switch (skillType) {
    case 'Discovery':
      return 'discovery'
    case 'Metrics':
      return 'metrics'
    case 'Integration':
      return 'integration'
    case 'Technical':
    case 'Strategy':
    default:
      return 'technical'
  }
}

function collectResourceLinks(resources?: TaskResources): SprintResourceLink[] {
  if (!resources) return []

  const links: SprintResourceLink[] = []
  for (const link of resources.conceptReferences ?? []) {
    links.push({ label: link.label, url: link.url })
  }
  for (const link of resources.officialDocumentation ?? []) {
    links.push({ label: link.label, url: link.url })
  }

  const seen = new Set<string>()
  return links.filter((link) => {
    if (seen.has(link.url)) return false
    seen.add(link.url)
    return true
  })
}

function parseLegacyActionStep(step: string, index: number): BlueprintStep {
  const fence = step.match(CODE_FENCE_RE)
  if (fence) {
    const instruction = step.replace(CODE_FENCE_RE, '').replace(/^Step\s*\d+:\s*/i, '').trim()
    return {
      title: `Step ${index + 1}`,
      instruction: instruction || `Complete step ${index + 1}`,
      codeSnippet: fence[2].trim(),
      codeLanguage: fence[1]?.trim() || 'bash',
    }
  }

  const titled = step.match(/^Step\s*(\d+):\s*(.+)$/i)
  if (titled) {
    return {
      title: `Step ${titled[1]}`,
      instruction: titled[2].trim(),
    }
  }

  return {
    title: `Step ${index + 1}`,
    instruction: step.trim(),
  }
}

function legacyResourcesToBlueprint(
  task: SkillTask,
  resources: TaskResources
): Pick<Task, 'whyThisMatters' | 'goal' | 'steps' | 'resources'> {
  const goal =
    task.goal?.trim() ||
    resources.actionItem?.trim() ||
    task.actionItem?.trim() ||
    `Deliver a verifiable artifact that proves you completed "${task.label}".`

  return {
    whyThisMatters: resources.conceptExplanation,
    goal,
    steps: resources.actionSteps.slice(0, 6).map(parseLegacyActionStep),
    resources: collectResourceLinks(resources),
  }
}

function hasStructuredBlueprint(task: SkillTask): boolean {
  return Boolean(
    task.whyThisMatters?.trim() &&
      task.goal?.trim() &&
      Array.isArray(task.steps) &&
      task.steps.length > 0
  )
}

/** Converts stored SkillTask (+ optional legacy resources) into drawer Task view. */
export function toSprintTask(task: SkillTask): Task {
  const resources = task.resources
  const curated =
    task.curatedResources?.length ? task.curatedResources : collectResourceLinks(resources)

  if (hasStructuredBlueprint(task)) {
    return {
      id: task.id,
      title: task.title?.trim() || task.label,
      type: task.type ?? mapSkillTypeToSprintType(task.skillType),
      duration: task.duration ?? task.estimatedDuration ?? '45 min',
      whyThisMatters: task.whyThisMatters!.trim(),
      goal: task.goal!.trim(),
      steps: task.steps!,
      resources: curated,
    }
  }

  if (resources) {
    const blueprint = legacyResourcesToBlueprint(task, resources)
    return {
      id: task.id,
      title: task.title?.trim() || task.label,
      type: task.type ?? mapSkillTypeToSprintType(task.skillType),
      duration: task.duration ?? task.estimatedDuration ?? '45 min',
      ...blueprint,
      resources: curated.length ? curated : blueprint.resources,
    }
  }

  return {
    id: task.id,
    title: task.title?.trim() || task.label,
    type: task.type ?? mapSkillTypeToSprintType(task.skillType),
    duration: task.duration ?? task.estimatedDuration ?? '45 min',
    whyThisMatters: task.whyThisMatters?.trim() ?? '',
    goal: task.goal?.trim() ?? '',
    steps: task.steps ?? [],
    resources: curated,
  }
}

export type SprintTaskViewStatus = 'ready' | 'loading'

export function getSprintTaskViewStatus(task: SkillTask): SprintTaskViewStatus {
  const view = toSprintTask(task)
  if (view.whyThisMatters && view.goal && view.steps.length > 0) {
    return 'ready'
  }
  if (task.blueprintStatus === 'loading') {
    return 'loading'
  }
  return view.whyThisMatters || view.goal || view.steps.length > 0 ? 'ready' : 'loading'
}
