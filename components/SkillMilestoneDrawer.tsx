'use client'

import { MICRO_SPRINT_WORKSPACE_LABEL } from '@/lib/careerJourneyLabels'
import { completionStorageKey, milestoneKey } from '@/lib/premiumRoadmapTasks'
import { getSprintTaskViewStatus, toSprintTask } from '@/lib/sprintTaskView'
import type { SkillMilestone, SkillTask } from '@/types/careerRoadmap'
import type { SprintResourceLink } from '@/types/sprintTask'
import TaskBlueprintCodeBlock from '@/components/TaskBlueprintCodeBlock'
import TaskDetailSkeleton from '@/components/TaskDetailSkeleton'
import { Check, ChevronDown, ExternalLink, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type SkillMilestoneDrawerProps = {
  step: SkillMilestone
  stepIndex: number
  open: boolean
  completedTaskKeys: Set<string>
  onClose: () => void
  onToggleTask: (milestoneKeyValue: string, task: SkillTask, completed: boolean) => void
  togglingTaskId: string | null
}

function ResourceLinkBadge({ link }: { link: SprintResourceLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg bg-accentMuted px-2.5 py-1 text-[11px] font-medium text-accent transition hover:bg-accent/20"
      onClick={(event) => event.stopPropagation()}
    >
      {link.label}
      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
    </a>
  )
}

function formatTypeBadge(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function SprintTaskAccordionCard({
  task,
  isCompleted,
  isExpanded,
  isToggling,
  onToggleExpand,
  onToggleComplete,
}: {
  task: SkillTask
  isCompleted: boolean
  isExpanded: boolean
  isToggling: boolean
  onToggleExpand: () => void
  onToggleComplete: (completed: boolean) => void
}) {
  const viewStatus = getSprintTaskViewStatus(task)
  const sprintTask = toSprintTask(task)
  const badgeLabel = formatTypeBadge(sprintTask.type)
  const durationLabel = sprintTask.duration

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-300 ease-in-out ${
        isCompleted
          ? 'border-status-success-border bg-status-success-bg'
          : isExpanded
            ? 'border-accent/40 bg-background shadow-horizon'
            : 'border-borderMuted bg-background hover:border-accent/30 hover:bg-accentMuted/40'
      } ${isToggling ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-3 p-4">
        <input
          type="checkbox"
          checked={isCompleted}
          disabled={isToggling}
          onChange={(event) => onToggleComplete(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Mark "${sprintTask.title}" complete`}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-borderMuted text-highlight transition-all duration-200 focus:ring-cyan-400/30"
        />

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-md border border-borderMuted bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {badgeLabel}
            </span>
            <span className="text-[10px] font-medium text-textSecondary">{durationLabel}</span>
          </div>
          <span
            className={`mt-2 block text-sm leading-relaxed transition-colors duration-300 ${
              isCompleted ? 'text-textSecondary line-through' : 'text-textPrimary'
            }`}
          >
            {sprintTask.title}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={isExpanded ? 'Collapse task details' : 'Expand task details'}
          className="horizon-interactive mt-0.5 shrink-0 rounded-lg p-1 text-textSecondary hover:bg-accentMuted hover:text-textPrimary"
        >
          {isCompleted ? (
            <Check className="h-4 w-4 text-status-success-text" aria-hidden />
          ) : (
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
              aria-hidden
            />
          )}
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {isExpanded && viewStatus === 'loading' ? <TaskDetailSkeleton /> : null}

          {isExpanded && viewStatus === 'ready' ? (
            <div className="space-y-5 border-t border-borderMuted px-4 pb-4 pt-3">
              <section aria-labelledby={`why-${task.id}`}>
                <h3
                  id={`why-${task.id}`}
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-textPrimary"
                >
                  Why This Matters
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-textSecondary">
                  {sprintTask.whyThisMatters}
                </p>
              </section>

              <section
                className="my-4 rounded-xl border border-borderMuted bg-accentMuted/40 px-4 py-3.5"
                aria-labelledby={`blueprint-${task.id}`}
              >
                <h3
                  id={`blueprint-${task.id}`}
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-textPrimary"
                >
                  🛠️ Hands-On Build Blueprint
                </h3>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-textPrimary">
                  {sprintTask.goal}
                </p>

                <ol className="mt-4 space-y-4">
                  {sprintTask.steps.map((step, index) => (
                    <li key={`${task.id}-step-${index}`} className="border-t border-borderMuted/60 pt-4 first:border-t-0 first:pt-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                        {step.title.startsWith('Step') ? step.title : `Step ${index + 1}: ${step.title}`}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-textSecondary">
                        {step.instruction}
                      </p>
                      {step.codeSnippet ? (
                        <TaskBlueprintCodeBlock
                          codeSnippet={step.codeSnippet}
                          codeLanguage={step.codeLanguage}
                        />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>

              {sprintTask.resources.length > 0 ? (
                <section aria-labelledby={`resources-${task.id}`}>
                  <h3
                    id={`resources-${task.id}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] text-textPrimary"
                  >
                    Curated Resources
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sprintTask.resources.map((link) => (
                      <ResourceLinkBadge key={`${task.id}-${link.url}`} link={link} />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}

          {isExpanded && viewStatus === 'loading' ? (
            <p className="border-t border-borderMuted px-4 pb-4 pt-2 text-[11px] text-textSecondary">
              Loading hands-on blueprint…
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function SkillMilestoneDrawer({
  step,
  stepIndex,
  open,
  completedTaskKeys,
  onClose,
  onToggleTask,
  togglingTaskId,
}: SkillMilestoneDrawerProps) {
  const key = milestoneKey(step, stepIndex)
  const tasks = step.tasks ?? []
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  const completedCount = useMemo(
    () => tasks.filter((task) => completedTaskKeys.has(completionStorageKey(key, task.id))).length,
    [tasks, completedTaskKeys, key]
  )

  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  useEffect(() => {
    if (!open) {
      setExpandedTaskId(null)
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close milestone details"
        className="horizon-interactive absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-drawer-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-borderMuted bg-surface shadow-horizon-md"
      >
        <div className="flex items-start justify-between gap-4 border-b border-borderMuted px-6 py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {MICRO_SPRINT_WORKSPACE_LABEL}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-textSecondary">
              {step.phaseLabel}
            </p>
            <h2
              id="milestone-drawer-title"
              className="mt-2 text-lg font-semibold leading-snug text-textPrimary"
            >
              {step.milestone}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="horizon-interactive rounded-xl border border-borderMuted p-2 text-textSecondary hover:bg-accentMuted hover:text-textPrimary"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="border-b border-borderMuted px-6 py-5">
          <div className="flex items-center justify-between gap-3 text-xs text-textSecondary">
            <span>Milestone progress</span>
            <span className="font-semibold tabular-nums text-accent">{progressPercent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-borderMuted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-200 ease-out"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressPercent}% of milestone tasks completed`}
            />
          </div>
          <p className="mt-2 text-[11px] text-textSecondary">
            {completedCount} of {tasks.length} action points completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-textSecondary">
            Sprint task checklist
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-textSecondary">
            Tap a task to expand the hands-on build blueprint. Check off items as you complete them.
          </p>
          <ul className="mt-5 space-y-3">
            {tasks.map((task) => {
              const storageKey = completionStorageKey(key, task.id)
              const isCompleted = completedTaskKeys.has(storageKey)
              const isExpanded = expandedTaskId === task.id
              const isToggling = togglingTaskId === task.id

              return (
                <li key={task.id}>
                  <SprintTaskAccordionCard
                    task={task}
                    isCompleted={isCompleted}
                    isExpanded={isExpanded}
                    isToggling={isToggling}
                    onToggleExpand={() =>
                      setExpandedTaskId((current) => (current === task.id ? null : task.id))
                    }
                    onToggleComplete={(completed) => onToggleTask(key, task, completed)}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}
