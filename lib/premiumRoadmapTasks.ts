import type { SkillMilestone, SkillTask } from '@/types/careerRoadmap'
import { enrichMilestoneTasks, parseSkillTask } from '@/lib/enrichSkillTasks'

const SALESFORCE_PM_TASKS: Record<string, SkillTask[]> = {
  'AI Automation Proof-of-Concept': [
    { id: 'sf-p1-t1', label: 'Build a mock local API handler' },
    { id: 'sf-p1-t2', label: 'Configure database column keys' },
    { id: 'sf-p1-t3', label: 'Wire an AI trigger into one Salesforce workflow' },
    { id: 'sf-p1-t4', label: 'Document before/after cycle time for your POC' },
  ],
  'Data & API Mechanics': [
    { id: 'sf-p2-t1', label: 'Map CRM objects to a normalized API schema' },
    { id: 'sf-p2-t2', label: 'Implement authenticated REST endpoints for read/write' },
    { id: 'sf-p2-t3', label: 'Add integration tests for critical API paths' },
    { id: 'sf-p2-t4', label: 'Publish an internal API usage guide for stakeholders' },
  ],
  'Product Discovery Foundations': [
    { id: 'sf-p3-t1', label: 'Run 5 user interviews focused on AI workflow pain points' },
    { id: 'sf-p3-t2', label: 'Synthesize findings into a one-page opportunity brief' },
    { id: 'sf-p3-t3', label: 'Prioritize top 3 problems using impact vs. effort matrix' },
    { id: 'sf-p3-t4', label: 'Draft a lightweight PRD for your first AI feature bet' },
  ],
  'AI Model Evaluation': [
    { id: 'sf-p4-t1', label: 'Define success metrics for model quality and latency' },
    { id: 'sf-p4-t2', label: 'Build a golden-set evaluation harness' },
    { id: 'sf-p4-t3', label: 'Compare two model variants with structured scoring' },
    { id: 'sf-p4-t4', label: 'Present evaluation results with a ship/no-ship recommendation' },
  ],
}

const GENERIC_PHASE_TASKS: SkillTask[][] = [
  [
    { id: 'g-p1-t1', label: 'Build a mock local API handler' },
    { id: 'g-p1-t2', label: 'Configure database column keys' },
    { id: 'g-p1-t3', label: 'Document your current workflow baseline' },
    { id: 'g-p1-t4', label: 'Demo the proof-of-concept to one stakeholder' },
  ],
  [
    { id: 'g-p2-t1', label: 'Map data flows between your core tools' },
    { id: 'g-p2-t2', label: 'Ship a read-only integration prototype' },
    { id: 'g-p2-t3', label: 'Validate schema changes in a staging environment' },
    { id: 'g-p2-t4', label: 'Write runbook notes for handoff and support' },
  ],
  [
    { id: 'g-p3-t1', label: 'Interview three internal users on friction points' },
    { id: 'g-p3-t2', label: 'Draft a problem statement with measurable outcomes' },
    { id: 'g-p3-t3', label: 'Prioritize one high-leverage MVP scope' },
    { id: 'g-p3-t4', label: 'Align scope with a hiring-manager rubric' },
  ],
  [
    { id: 'g-p4-t1', label: 'Define evaluation criteria for your target capability' },
    { id: 'g-p4-t2', label: 'Run a structured self-assessment against the rubric' },
    { id: 'g-p4-t3', label: 'Close the largest skill gap with a portfolio artifact' },
    { id: 'g-p4-t4', label: 'Publish a transition narrative for your target role' },
  ],
]

export function milestoneKey(step: SkillMilestone, index: number): string {
  const slug = step.phaseLabel.toLowerCase().replace(/\s+/g, '-')
  return `${slug}-${index}`
}

export function tasksForMilestone(step: SkillMilestone, index: number): SkillTask[] {
  if (step.tasks?.length) {
    return step.tasks
  }

  return (
    SALESFORCE_PM_TASKS[step.milestone] ??
    GENERIC_PHASE_TASKS[index] ??
    GENERIC_PHASE_TASKS[0]
  )
}

/** Ensures every pipeline step includes a nested task list for premium UI. */
export function enrichSkillPipeline(pipeline: SkillMilestone[]): SkillMilestone[] {
  return pipeline.map((step, index) => {
    const baseTasks = tasksForMilestone(step, index)
    return {
      ...step,
      tasks: enrichMilestoneTasks(baseTasks, step.milestone),
    }
  })
}

/** Read skillPipeline or skillAcquisitionPipeline from stored JSON payloads. */
export function extractSkillPipeline(record: Record<string, unknown>): SkillMilestone[] | null {
  const raw =
    record.skillPipeline ??
    record.skillAcquisitionPipeline ??
    record.recommendedRoute

  if (Array.isArray(raw) && raw.every((item) => typeof item === 'string')) {
    return raw.map((milestone, index) => ({
      milestone,
      phaseLabel: `Phase ${index + 1}`,
    }))
  }

  if (!Array.isArray(raw)) return null

  const pipeline: SkillMilestone[] = []
  for (let index = 0; index < raw.length; index += 1) {
    const item = raw[index]
    if (!item || typeof item !== 'object') return null
    const step = item as Record<string, unknown>
    if (typeof step.milestone !== 'string' || typeof step.phaseLabel !== 'string') {
      return null
    }
    const tasks = Array.isArray(step.tasks)
      ? step.tasks
          .map((task) => parseSkillTask(task))
          .filter((task): task is SkillTask => task !== null)
      : undefined

    pipeline.push({
      milestone: step.milestone,
      phaseLabel: step.phaseLabel,
      tasks,
    })
  }

  return pipeline
}

export function completionStorageKey(milestoneKeyValue: string, taskId: string): string {
  return `${milestoneKeyValue}:${taskId}`
}

export function parseCompletionStorageKey(key: string): { milestoneKey: string; taskId: string } | null {
  const separator = key.indexOf(':')
  if (separator <= 0) return null
  return {
    milestoneKey: key.slice(0, separator),
    taskId: key.slice(separator + 1),
  }
}
