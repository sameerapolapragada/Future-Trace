export type BlogArticle = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  readMinutes: number
  body: string[]
  /** Set false while drafting; only published posts appear on the blog. */
  published?: boolean
}

export function isBlogArticlePublished(article: BlogArticle): boolean {
  return article.published !== false
}
