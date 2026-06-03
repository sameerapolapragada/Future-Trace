import ExplorePageHeader from '@/components/ExplorePageHeader'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { getBlogArticle } from '@/data/blog'
import { formatBlogArticleDate } from '@/lib/formatBlogDate'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function BlogArticleScreen() {
  const router = useRouter()
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const article = slug ? getBlogArticle(slug) : undefined

  if (!article) {
    return <Redirect href="/(explore)/blog" />
  }

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Pressable style={styles.backLink} onPress={() => router.push('/(explore)/blog')}>
        <Ionicons name="chevron-back" size={18} color={horizon.accent} />
        <Text style={styles.backLinkText}>Back to Blog</Text>
      </Pressable>

      <Text style={styles.meta}>
        {formatBlogArticleDate(article.publishedAt)} · {article.readMinutes} min read
      </Text>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.excerpt}>{article.excerpt}</Text>

      <View style={styles.body}>
        {article.body.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.accent,
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: horizon.textPrimary,
  },
  excerpt: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: horizon.textSecondary,
  },
  body: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
    gap: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#CBD5E1',
  },
})
