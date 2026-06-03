/** Premium 30-day sprint task execution resources (LLM-generated). */

export interface OfficialDocumentationLink {
  label: string
  url: string
}

export interface TaskResources {
  /** Career-transition context — rendered as "Why This Matters". */
  conceptExplanation: string
  actionSteps: string[]
  /** Concrete definition-of-done deliverable — rendered as "Your Action Item". */
  actionItem?: string
  /** Deep links for concept guides (Curated Resources). */
  conceptReferences?: OfficialDocumentationLink[]
  officialDocumentation: OfficialDocumentationLink[]
}

export interface PremiumExecutionTask {
  id: string
  text: string
  completed: boolean
  resources: TaskResources
}

export interface PremiumRoadmapTasksPayload {
  tasks: PremiumExecutionTask[]
}
