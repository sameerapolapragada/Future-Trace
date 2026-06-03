import type { Milestone } from '@/data/timeline'
import { horizon } from '@/theme/colors'
import {
  matchesTimelineFilter,
  matchesTimelineQuery,
  timelineCategoryIcon,
  TIMELINE_FILTERS,
  type TimelineFilter,
} from '@/lib/timelineUtils'
import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState, type ReactNode } from 'react'
import { enableAndroidLayoutAnimation } from '@/lib/layoutAnimation'
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

enableAndroidLayoutAnimation()

type ExploreTimelineProps = {
  milestones: Milestone[]
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailHeading}>{title}</Text>
      {children}
    </View>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function MilestoneCard({
  milestone,
  isOpen,
  onToggle,
}: {
  milestone: Milestone
  isOpen: boolean
  onToggle: () => void
}) {
  const iconName = timelineCategoryIcon(milestone.technologyCategory)

  return (
    <View style={[styles.card, isOpen && styles.cardOpen]}>
      <Pressable
        onPress={onToggle}
        style={styles.cardHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${milestone.title}, ${isOpen ? 'collapse' : 'expand'} details`}
      >
        <View style={styles.cardHeaderMain}>
          <View style={styles.iconBox}>
            <Ionicons name={iconName} size={20} color={horizon.textPrimary} />
          </View>
          <View style={styles.cardHeaderText}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>{milestone.title}</Text>
              <Text style={styles.year}>{milestone.year}</Text>
            </View>
            <Text style={styles.shortDescription} numberOfLines={isOpen ? undefined : 2}>
              {milestone.shortDescription}
            </Text>
            <View style={styles.categoryPill}>
              <Ionicons name={iconName} size={12} color={horizon.textSecondary} />
              <Text style={styles.categoryText}>{milestone.technologyCategory}</Text>
            </View>
          </View>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={horizon.textSecondary}
            style={styles.chevron}
          />
        </View>
      </Pressable>

      {isOpen ? (
        <View style={styles.expanded}>
          <DetailBlock title="Why it mattered">
            <Text style={styles.detailBody}>{milestone.whyItMattered}</Text>
          </DetailBlock>

          <DetailBlock title="Future implication">
            <Text style={styles.detailBody}>{milestone.futureImplication}</Text>
          </DetailBlock>

          <DetailBlock title="Industries impacted">
            <BulletList items={milestone.industriesImpacted} />
          </DetailBlock>

          <DetailBlock title="Jobs affected">
            <BulletList items={milestone.jobsAffected} />
          </DetailBlock>
        </View>
      ) : null}
    </View>
  )
}

export default function ExploreTimeline({ milestones }: ExploreTimelineProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<TimelineFilter>('All')
  const [query, setQuery] = useState('')

  const visible = useMemo(
    () => milestones.filter((m) => matchesTimelineFilter(m, filter) && matchesTimelineQuery(m, query)),
    [milestones, filter, query],
  )

  const toggleCard = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <View>
      <View style={styles.controls}>
        <Text style={styles.controlsLabel}>Filter by technology</Text>
        <View style={styles.filterRow}>
          {TIMELINE_FILTERS.map((item) => {
            const active = filter === item
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={[styles.controlsLabel, styles.searchLabel]}>Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search year, title, industry, job role, technology..."
          placeholderTextColor={horizon.textSecondary}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.list}>
        {visible.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            isOpen={openId === milestone.id}
            onToggle={() => toggleCard(milestone.id)}
          />
        ))}

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyBody}>Try adjusting your filters or search query.</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  controls: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 14,
    marginBottom: 16,
  },
  controlsLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: horizon.textSecondary,
  },
  searchLabel: {
    marginTop: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
  },
  filterChipActive: {
    borderColor: horizon.accent,
    backgroundColor: horizon.accentMuted,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: horizon.textSecondary,
  },
  filterChipTextActive: {
    color: horizon.accent,
  },
  searchInput: {
    marginTop: 8,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 12,
    fontSize: 14,
    color: horizon.textPrimary,
  },
  list: {
    gap: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    overflow: 'hidden',
  },
  cardOpen: {
    borderColor: horizon.accent,
  },
  cardHeader: {
    padding: 14,
  },
  cardHeaderMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: horizon.textPrimary,
    flexShrink: 1,
  },
  year: {
    fontSize: 12,
    fontWeight: '600',
    color: horizon.textSecondary,
  },
  shortDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: horizon.textSecondary,
  },
  categoryPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: horizon.textSecondary,
  },
  chevron: {
    marginTop: 4,
  },
  expanded: {
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 14,
  },
  detailBlock: {
    gap: 6,
  },
  detailHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  detailBody: {
    fontSize: 13,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  bulletList: {
    gap: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    marginTop: 1,
    fontSize: 13,
    lineHeight: 20,
    color: horizon.highlight,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  emptyBody: {
    marginTop: 4,
    fontSize: 13,
    color: horizon.textSecondary,
    textAlign: 'center',
  },
})
