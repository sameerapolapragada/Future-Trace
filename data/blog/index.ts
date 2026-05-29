import { blogPostRegistry } from './registry'
import { isBlogArticlePublished, type BlogArticle } from './types'

export type { BlogArticle } from './types'

export const blogArticles = blogPostRegistry

export function getPublishedBlogArticles(): BlogArticle[] {
  return blogPostRegistry
    .filter(isBlogArticlePublished)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getBlogArticle(slug: string): BlogArticle | undefined {
  const article = blogPostRegistry.find((entry) => entry.slug === slug)
  if (!article || !isBlogArticlePublished(article)) {
    return undefined
  }
  return article
}

export function getAllBlogArticlesIncludingDrafts(): BlogArticle[] {
  return [...blogPostRegistry].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}
