import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Methodology & Data Transparency | Future Trace',
  description:
    'Technical documentation for the Future Trace AI insulation index, milestone scoring, and underlying O*NET, BLS, and task-capability data sources.',
}

const sections = [
  {
    title: 'Composite index overview',
    body: [
      'The Future Trace AI Insulation Index is a composite vector score that estimates how exposed a role-and-skill profile is to generative and agentic automation over a multi-year horizon.',
      'Scores are normalized to a 0–100 vulnerability scale; insulation milestones displayed in your dashboard reflect the inverse (100 minus vulnerability) so progress reads as increased career resilience.',
    ],
  },
  {
    title: 'O*NET Database (v29.x)',
    body: [
      'Role tasks are mapped to O*NET occupational taxonomy and task importance ratings. Each task receives an automation-vulnerability weight based on historical substitution patterns and emerging LLM/agent capability benchmarks.',
      'Resume and job-title inputs are aligned to the closest O*NET-SOC occupation cluster before task arrays are applied.',
    ],
  },
  {
    title: 'U.S. Bureau of Labor Statistics (BLS)',
    body: [
      'Industry-level employment projections and occupational outlook data provide macro displacement and growth modifiers.',
      'BLS trend signals adjust sector-wide risk when an industry faces above-average automation pressure or expansion in AI-adjacent roles.',
    ],
  },
  {
    title: 'Task-level capability matrices',
    body: [
      'Generative automation overlap is estimated by comparing stated skills and resume task phrases against capability matrices spanning text, code, analysis, coordination, and judgment categories.',
      'Milestone checkpoints on your insulation trend line correspond to scan timestamps where these vectors are re-evaluated against the latest matrix revision.',
    ],
  },
  {
    title: 'Limitations & updates',
    body: [
      'The index is probabilistic, not predictive of individual outcomes. Model weights and source datasets are versioned and may change as O*NET and BLS releases are incorporated.',
      'Free-tier scans are processed in memory; premium scans retain historical vectors for longitudinal milestone comparison.',
    ],
  },
] as const

export default function MethodologyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl bg-trace-bg text-trace-muted">
      <header className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-highlight"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-trace-foreground sm:text-3xl">
          Methodology &amp; Data Transparency
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Technical whitepaper — Future Trace AI Insulation Index, milestone scoring, and source
          attribution.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-trace-foreground">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-slate-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
