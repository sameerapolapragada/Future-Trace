/** Structured career transition output — core free-tier value proposition. */
import type { TaskResources } from '@/types/premiumRoadmapResources'
import type { BlueprintStep, SprintResourceLink, SprintTaskType } from '@/types/sprintTask'

export interface IntelligenceProfile {
  strengths: string[]
  emergingAdvantages: string[]
  structuralVulnerabilities: string[]
  highYieldOpportunityZones: string[]
}

export type SkillTaskSkillType = 'Technical' | 'Discovery' | 'Metrics' | 'Integration' | 'Strategy'

export interface SkillTask {
  id: string
  /** Display title in drawer header (falls back to label). */
  label: string
  title?: string
  /** Hands-on blueprint task type (lowercase). */
  type?: SprintTaskType
  skillType?: SkillTaskSkillType
  /** Human-readable estimate, e.g. "45 min". */
  estimatedDuration?: string
  duration?: string
  whyThisMatters?: string
  goal?: string
  steps?: BlueprintStep[]
  /** Curated resource links for drawer footer. */
  curatedResources?: SprintResourceLink[]
  /** Definition-of-done deliverable (legacy; maps to goal). */
  actionItem?: string
  /** Legacy LLM resource bundle; normalized to blueprint in the drawer. */
  resources?: TaskResources
  /** Set when blueprint content is being fetched from the API. */
  blueprintStatus?: 'loading' | 'ready'
}

export interface SkillMilestone {
  /** Tactical capability the user builds in this phase. */
  milestone: string
  /** Short phase label shown beneath the node (e.g. "Phase 1"). */
  phaseLabel: string
  /** Premium roadmap micro-tasks for interactive check-off UI. */
  tasks?: SkillTask[]
}

/** Alias used in premium roadmap UI and legacy payloads. */
export type SkillPipelineStep = SkillMilestone

export interface CareerRoadmap {
  currentPosition: string
  destinationPosition: string
  estimatedJourneyMonths: number
  /** First 30-day action sprint copy (UI: "Your First 30-Day Action Sprint"). */
  nextMilestone: string
  /** Asymmetrical advantage framing (UI: "Primary Leverage Point"). */
  biggestObstacle: string
  skillAcquisitionPipeline: SkillMilestone[]
  /** Active skill sprint label (UI: "Next up" — e.g. 1-Month Skill Sprint). */
  immediate30DayTarget?: string
  intelligenceProfile?: IntelligenceProfile
}

export type ScanAnalysisPayload = {
  jobTitle: string
  summary: string
  roadmap: CareerRoadmap
  /** Retained for premium history / internal metrics; omitted from free-tier UI. */
  score?: number
  fullSummary?: string
  isPremium: boolean
}
