import { timelinePreviewItems, type TimelinePreviewItem } from '@/data/timelinePreview'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

type IconConfig = {
  name: keyof typeof Ionicons.glyphMap
  color: string
  backgroundColor: string
}

function getIconConfig(type: TimelinePreviewItem['icon']): IconConfig {
  switch (type) {
    case 'symbolic':
      return { name: 'grid-outline', color: '#FB923C', backgroundColor: 'rgba(251, 146, 60, 0.1)' }
    case 'ml':
      return {
        name: 'bar-chart-outline',
        color: horizon.highlight,
        backgroundColor: horizon.highlightMuted,
      }
    case 'transformers':
      return { name: 'refresh-outline', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)' }
    case 'generative':
      return { name: 'sparkles-outline', color: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.1)' }
    case 'rag':
      return { name: 'hardware-chip-outline', color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
    case 'agents':
      return { name: 'locate-outline', color: '#FB7185', backgroundColor: 'rgba(251, 113, 133, 0.1)' }
    case 'workflows':
      return { name: 'link-outline', color: '#94A3B8', backgroundColor: 'rgba(148, 163, 184, 0.1)' }
    case 'future':
      return { name: 'globe-outline', color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.1)' }
    default:
      return { name: 'grid-outline', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)' }
  }
}

function formatEra(era: string) {
  return era.toLowerCase() === 'future' ? 'FUTURE' : era
}

function MilestoneCard({ item }: { item: TimelinePreviewItem }) {
  const icon = getIconConfig(item.icon)

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: icon.backgroundColor }]}>
          <Ionicons name={icon.name} size={16} color={icon.color} />
        </View>
        <Text style={styles.era}>{formatEra(item.era)}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardTag}>{item.tag}</Text>
    </View>
  )
}

export default function AIEvolutionTimelineMilestones() {
  return (
    <View style={styles.grid}>
      {timelinePreviewItems.map((item) => (
        <View key={item.id} style={styles.gridItem}>
          <MilestoneCard item={item} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  card: {
    minHeight: 108,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconBox: {
    borderRadius: 8,
    padding: 6,
  },
  era: {
    flexShrink: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: horizon.accent,
    textAlign: 'right',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: horizon.textPrimary,
  },
  cardTag: {
    marginTop: 2,
    fontSize: 11,
    color: horizon.textSecondary,
  },
})
