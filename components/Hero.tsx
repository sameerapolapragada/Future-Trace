import Link from 'next/link'

export default function Hero() {
  return (
    <section className="mb-12 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
          <span className="text-sm font-semibold text-indigo-300">AI Career Shield</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
          Disruption Risk &amp; Insulation Tracker
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          Analyze your job profile vulnerability against the modern AI disruption timeline — from
          rule-based systems to transformers, agents, and multi-agent platforms.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Get Your Insulation Score
          </Link>
          <Link
            href="#timeline"
            className="rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-3 font-semibold text-slate-100 backdrop-blur-sm transition hover:border-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Explore Timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
