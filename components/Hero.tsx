import Link from 'next/link'

export default function Hero() {
  return (
    <section className="mb-12 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-600" />
          <span className="text-sm font-medium text-sky-700">Free AI Evolution Intelligence Hub</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
          See How AI Evolved from 1950 to 2035
        </h1>

        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          An interactive timeline explaining how AI moved from rule-based systems to machine learning,
          transformers, generative AI, AI agents, and multi-agent systems.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#timeline"
            className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
          >
            Explore Timeline
          </Link>
          <Link
            href="#what-comes-next"
            className="px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg shadow-sm hover:bg-slate-200 transition-colors"
          >
            What Comes Next?
          </Link>
        </div>
      </div>
    </section>
  )
}
