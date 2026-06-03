import ExplorePageHeader from '@/components/ExplorePageHeader'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { getPublishedBlogArticles } from '@/data/blog'
import { formatBlogListDate } from '@/lib/formatBlogDate'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function BlogScreen() {
  const router = useRouter()
  const articles = getPublishedBlogArticles()

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>Blog</Text>
      <Text style={styles.subtitle}>
        Insights on smarter AI, trust, governance, and career resilience
      </Text>

      <View style={styles.list}>
        {articles.map((article) => (
          <Pressable
            key={article.slug}
            style={styles.card}
            onPress={() => router.push(`/(explore)/blog/${article.slug}`)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.meta}>
                {formatBlogListDate(article.publishedAt)} · {article.readMinutes} min read
              </Text>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.excerpt}>{article.excerpt}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={horizon.textSecondary} />
          </Pressable>
        ))}
      </View>
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: horizon.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  list: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    fontSize: 11,
    color: '#64748B',
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: horizon.textPrimary,
  },
  excerpt: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: horizon.textSecondary,
  },
})
