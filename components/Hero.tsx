import Link from 'next/link'

export default function Hero() {
  return (
    <section className="mb-12 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-sky-300" />
          <span className="text-sm font-semibold text-sky-200">Future Trace</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
          Future Trace
        </h1>

        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 sm:text-xl">
          Career Intelligence for the AI Age
        </p>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          Analyze your job profile vulnerability against the modern AI disruption timeline — from
          rule-based systems to transformers, agents, and multi-agent platforms.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-950/40 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Get Your Insulation Score
          </Link>
          <Link
            href="#timeline"
            className="rounded-lg border border-sky-900/40 bg-trace-surface/50 px-6 py-3 font-semibold text-slate-100 backdrop-blur-sm transition hover:border-sky-800/50 hover:bg-trace-surface focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Explore Timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
