import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text, TextInput } from '../../../components/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScreenEntrance } from '../../../components/ScreenEntrance'
import { ScreenBackground } from '../../../components/ScreenBackground'
import {
  timelineDisplayItems,
  type TimelineDisplayItem,
} from '../../../data/timelineDisplay'
import { colors } from '../../../theme/colors'

type FilterOption = {
  label: string
  milestoneId?: string
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Rule-Based AI', milestoneId: 'rule-based' },
  { label: 'Expert Systems', milestoneId: 'expert-systems' },
  { label: 'Machine Learning', milestoneId: 'machine-learning' },
  { label: 'Neural Networks', milestoneId: 'neural-networks' },
  { label: 'Deep Learning', milestoneId: 'deep-learning' },
  { label: 'Transformers', milestoneId: 'transformers' },
  { label: 'Generative AI', milestoneId: 'generative-ai' },
  { label: 'RAG', milestoneId: 'rag' },
  { label: 'AI Agents', milestoneId: 'ai-agents' },
  { label: 'Multi-Agent', milestoneId: 'multi-agent' },
]

const RECENT_SEARCHES = [
  { label: 'Deep Learning', milestoneId: 'deep-learning' },
  { label: 'Transformers', milestoneId: 'transformers' },
  { label: 'AI Agents', milestoneId: 'ai-agents' },
]

const TRENDING_TOPICS = [
  { label: 'Generative AI', milestoneId: 'generative-ai' },
  { label: 'Transformers', milestoneId: 'transformers' },
  { label: 'AI Agents', milestoneId: 'ai-agents' },
  { label: 'Deep Learning', milestoneId: 'deep-learning' },
]

function periodStartYear(period: string) {
  const match = period.match(/\d{4}/)
  return match?.[0] ?? period
}

function matchesQuery(item: TimelineDisplayItem, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    item.title.toLowerCase().includes(q) ||
    item.era.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.period.toLowerCase().includes(q)
  )
}

function ResultCard({
  item,
  onPress,
}: {
  item: TimelineDisplayItem
  onPress: () => void
}) {
  return (
    <Pressable style={styles.resultCard} onPress={onPress}>
      <View style={styles.resultTopAccent} />
      <View style={styles.resultBody}>
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{periodStartYear(item.period)}</Text>
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.eraPill}>
            <Text style={styles.eraText}>{item.era}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null)

  const results = useMemo(() => {
    if (activeFilterId) {
      const match = timelineDisplayItems.find((item) => item.id === activeFilterId)
      return match ? [match] : []
    }
    const q = query.trim()
    if (!q) return []
    return timelineDisplayItems.filter((item) => matchesQuery(item, q))
  }, [query, activeFilterId])

  const showResults = activeFilterId !== null || query.trim().length > 0

  const openMilestone = (id: string) => {
    router.push(`/milestone/${id}`)
  }

  const selectFilter = (option: FilterOption) => {
    if (option.milestoneId) {
      setActiveFilterId(option.milestoneId)
      setQuery(option.label)
    }
  }

  const selectQuickSearch = (label: string, milestoneId: string) => {
    setActiveFilterId(milestoneId)
    setQuery(label)
  }

  const clearSearch = () => {
    setQuery('')
    setActiveFilterId(null)
  }

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenEntrance>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <LinearGradient
              colors={[...colors.primaryGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerIcon}
            >
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>Search</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.placeholder} />
            <TextInput
              placeholder="Search AI milestones..."
              placeholderTextColor={colors.placeholder}
              style={styles.searchInput}
              value={query}
              onChangeText={(text) => {
                setQuery(text)
                setActiveFilterId(null)
              }}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query.length > 0 ? (
              <Pressable onPress={clearSearch} hitSlop={10}>
                <Ionicons name="close-circle" size={22} color={colors.placeholder} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilterId === option.milestoneId
              return (
                <Pressable
                  key={option.label}
                  style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                  onPress={() => selectFilter(option)}
                >
                  <Text style={[styles.filterText, isActive ? styles.filterTextActive : null]}>
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>

          {showResults ? (
            <>
              <Text style={styles.resultCount}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </Text>
              {results.length > 0 ? (
                results.map((item) => (
                  <ResultCard
                    key={item.id}
                    item={item}
                    onPress={() => openMilestone(item.id)}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No milestones match your search.</Text>
              )}
            </>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
              {RECENT_SEARCHES.map((item) => (
                <Pressable
                  key={item.label}
                  style={styles.recentCard}
                  onPress={() => selectQuickSearch(item.label, item.milestoneId)}
                >
                  <Ionicons name="search-outline" size={22} color="#6B7280" />
                  <Text style={styles.recentText}>{item.label}</Text>
                </Pressable>
              ))}

              <View style={styles.sectionHeaderTrending}>
                <Ionicons name="trending-up-outline" size={20} color="#38BDF8" />
                <Text style={styles.sectionTitle}>Trending Topics</Text>
              </View>

              <View style={styles.trendingGrid}>
                {TRENDING_TOPICS.map((topic) => (
                  <Pressable
                    key={topic.label}
                    onPress={() => selectQuickSearch(topic.label, topic.milestoneId)}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(15,30,58,0.9)',
                        'rgba(11,22,40,0.85)',
                        'rgba(8,18,32,0.8)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.trendingCard}
                    >
                      <Text style={styles.trendingText}>{topic.label}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </ScrollView>
        </ScreenEntrance>
      </SafeAreaView>
    </ScreenBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.title,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 58,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.inputText,
    fontSize: 16,
    fontWeight: '600',
  },
  filterRow: {
    gap: 10,
    paddingBottom: 18,
  },
  filterChip: {
    borderRadius: 22,
    paddingHorizontal: 18,
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(96,165,250,0.35)',
    borderColor: 'rgba(147,197,253,0.45)',
  },
  filterText: {
    color: '#A7AFBC',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#F8FAFC',
  },
  resultCount: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  resultTopAccent: {
    height: 3,
    backgroundColor: '#3B82F6',
  },
  resultBody: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  yearBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(37,99,235,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    color: colors.title,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  resultDescription: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  eraPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eraText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 2,
  },
  sectionHeaderTrending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    color: colors.title,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 74,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  recentText: {
    color: colors.title,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  trendingCard: {
    width: 158,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    minHeight: 72,
    padding: 14,
    justifyContent: 'center',
  },
  trendingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
})
