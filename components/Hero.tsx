import Link from 'next/link'

export default function Hero() {
  return (
    <section className="mb-12 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accentMuted px-3 py-1">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span className="text-sm font-semibold text-accent">Future Trace</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-trace-foreground sm:text-5xl lg:text-6xl">
          Future Trace
        </h1>

        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-trace-muted sm:text-xl">
          Career Intelligence for the AI Age
        </p>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-trace-muted">
          Analyze your job profile vulnerability against the modern AI disruption timeline — from
          rule-based systems to transformers, agents, and multi-agent platforms.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="btn-primary px-6 py-3 shadow-lg shadow-orange-900/40 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black"
          >
            Get Your Insulation Score
          </Link>
          <Link
            href="#timeline"
            className="rounded-lg border border-trace-border bg-trace-surface px-6 py-3 font-semibold text-trace-foreground backdrop-blur-sm transition hover:border-trace-border hover:bg-trace-surface focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-white"
          >
            Explore Timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
