import Link from 'next/link'

export default function WhatComesNext() {
  const items = [
    {
      title: 'AI copilots',
      desc: 'Assist users by integrating domain knowledge with conversational interfaces to speed decision-making.'
    },
    {
      title: 'AI agents',
      desc: 'Autonomous agents that plan, call tools, and complete multi-step tasks with minimal supervision.'
    },
    {
      title: 'Multi-agent systems',
      desc: 'Collections of specialized agents coordinating to solve complex, distributed problems.'
    },
    {
      title: 'Autonomous workflows',
      desc: 'End-to-end processes where agents execute, monitor, and optimize business outcomes automatically.'
    },
    {
      title: 'AI governance',
      desc: 'Policies, auditing, and organizational practices to ensure safe, fair, and compliant deployments.'
    },
    {
      title: 'Decision traceability',
      desc: 'Recording model inputs, reasoning, and actions for auditing and post-hoc review.'
    },
    {
      title: 'Human-in-the-loop review',
      desc: 'Coupling automated systems with human oversight for high-stakes or ambiguous decisions.'
    }
  ]

  return (
    <section aria-labelledby="what-comes-next" className="mb-12">
      <div className="mb-6">
        <h2 id="what-comes-next" className="text-2xl sm:text-3xl font-bold text-slate-100">
          What Comes Next?
        </h2>
        <p className="mt-2 text-slate-400">
          Overview of the next phase in AI evolution and the practical priorities ahead.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition-all hover:border-slate-700"
            >
              <h3 className="font-semibold text-slate-100">{it.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{it.desc}</p>
            </div>
          ))}
        </div>

        <aside className="flex items-center justify-center">
          <div className="w-full rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-700 to-violet-800 p-6 shadow-lg shadow-indigo-950/40">
            <h3 className="text-xl font-bold text-white">
              The next challenge is not just smarter AI. It is trustworthy AI.
            </h3>
            <p className="mt-3 text-sm text-indigo-100/90">
              Building systems that are transparent, auditable, and aligned with human values.
            </p>

            <div className="mt-6">
              <Link
                href="/privacy"
                className="inline-block rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Privacy &amp; Data Governance
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
