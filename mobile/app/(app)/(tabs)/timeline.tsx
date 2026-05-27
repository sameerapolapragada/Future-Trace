import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
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
  type TimelineDotColor,
} from '../../../data/timelineDisplay'
import { colors } from '../../../theme/colors'

const DOT_COLORS: Record<TimelineDotColor, string> = {
  grey: '#6B7280',
  blue: '#3B82F6',
  purple: '#A855F7',
}

function TimelineRow({
  item,
  isLast,
  onPress,
}: {
  item: TimelineDisplayItem
  isLast: boolean
  onPress: () => void
}) {
  return (
    <View style={styles.row}>
      <View style={styles.railColumn}>
        <View style={[styles.dot, { backgroundColor: DOT_COLORS[item.dotColor] }]} />
        {!isLast ? <View style={styles.railLine} /> : null}
      </View>

      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.cardTopRow}>
          <Text style={styles.period}>{item.period}</Text>
          <View style={styles.eraPill}>
            <Text style={styles.eraText}>{item.era}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </Pressable>
    </View>
  )
}

export default function TimelineScreen() {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return timelineDisplayItems
    return timelineDisplayItems.filter(
      (item) =>
        item.period.toLowerCase().includes(q) ||
        item.era.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenEntrance>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>AI Evolution</Text>
            <Text style={styles.subtitle}>The evolution of artificial intelligence</Text>
          </View>
          <Pressable
            style={styles.searchButton}
            onPress={() => setSearchOpen((open) => !open)}
            hitSlop={8}
          >
            <Ionicons name="search-outline" size={22} color={colors.title} />
          </Pressable>
        </View>

        <View style={styles.headerDivider} />

        {searchOpen ? (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search timeline..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            autoFocus
          />
        ) : null}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={styles.listFlex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <TimelineRow
              item={item}
              isLast={index === filtered.length - 1}
              onPress={() => router.push(`/milestone/${item.id}`)}
            />
          )}
          ListFooterComponent={
            filtered.length > 0 ? (
              <Text style={styles.footer}>The journey continues...</Text>
            ) : (
              <Text style={styles.empty}>No milestones match your search.</Text>
            )
          }
        />
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
  listFlex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.title,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    color: colors.subtitle,
    fontSize: 15,
    lineHeight: 21,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 16,
    marginBottom: 20,
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.inputText,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  railColumn: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 18,
    zIndex: 1,
  },
  railLine: {
    position: 'absolute',
    top: 30,
    bottom: -14,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    left: 13,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  period: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '700',
  },
  eraPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eraText: {
    color: colors.subtitle,
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    color: colors.title,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    marginTop: 8,
    marginLeft: 40,
    marginBottom: 8,
    color: colors.muted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
  },
})
