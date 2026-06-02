import { getBlogArticle, getPublishedBlogArticles } from '@/data/blog'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getPublishedBlogArticles().map((article) => ({ slug: article.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getBlogArticle(params.slug)
  if (!article) return { title: 'Article | Future Trace' }

  return {
    title: `${article.title} | Future Trace`,
    description: article.excerpt,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BlogArticlePage({ params }: Props) {
  const article = getBlogArticle(params.slug)
  if (!article) notFound()

  return (
    <article className="bg-trace-bg text-trace-muted">
      <header className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-highlight"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Blog
        </Link>
        <p className="mt-4 text-xs text-slate-500">
          {formatDate(article.publishedAt)} · {article.readMinutes} min read
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-trace-foreground">{article.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{article.excerpt}</p>
      </header>

      <div className="space-y-4 border-t border-trace-border pt-6">
        {article.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}
