import type { BlogArticle } from '../types'

/**
 * Copy this file, rename it to your slug (e.g. my-new-post.ts), fill in content,
 * then register the import in ../registry.ts.
 *
 * Keep published: false until the post is ready to go live.
 */
const article: BlogArticle = {
  slug: 'your-post-slug',
  title: 'Your Post Title',
  excerpt: 'One or two sentences for the blog index card.',
  publishedAt: '2026-06-01',
  readMinutes: 5,
  body: [
    'First paragraph.',
    'Second paragraph.',
  ],
  published: false,
}

export default article
