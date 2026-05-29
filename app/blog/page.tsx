import { getPublishedBlogArticles } from '@/data/blog'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Future Trace',
  description: 'Articles on trustworthy AI, career impact, governance, and what comes next in the AI age.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BlogPage() {
  const articles = getPublishedBlogArticles()

  return (
    <div className="bg-black text-slate-300">
      <header className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 transition hover:text-sky-300"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-100">Blog</h1>
        <p className="mt-1 text-sm text-slate-400">
          Insights on smarter AI, trust, governance, and career resilience
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group rounded-xl border border-sky-900/30 bg-trace-surface/40 p-4 transition hover:border-sky-800/50 hover:bg-trace-surface/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">
                  {formatDate(article.publishedAt)} · {article.readMinutes} min read
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-100 group-hover:text-sky-300">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{article.excerpt}</p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-600 transition group-hover:text-sky-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
