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
        <h2 id="what-comes-next" className="text-2xl sm:text-3xl font-bold text-slate-900">What Comes Next?</h2>
        <p className="mt-2 text-slate-600">Overview of the next phase in AI evolution and the practical priorities ahead.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.title} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
              <h3 className="font-semibold text-slate-900">{it.title}</h3>
              <p className="mt-1 text-slate-600 text-sm leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <aside className="flex items-center justify-center">
          <div className="w-full bg-gradient-to-br from-sky-600 to-violet-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold">The next challenge is not just smarter AI. It is trustworthy AI.</h3>
            <p className="mt-3 text-sm opacity-90">Building systems that are transparent, auditable, and aligned with human values.</p>

            <div className="mt-6">
              <Link href="/governance-placeholder" className="inline-block bg-white text-sky-700 font-semibold px-4 py-2 rounded-md shadow-sm hover:opacity-95">
                Explore AI Governance
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
