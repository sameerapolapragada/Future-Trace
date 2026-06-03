import { industries } from '@/data/industries'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

type IconConfig = {
  name: keyof typeof Ionicons.glyphMap
  color: string
  backgroundColor: string
}

function getIconConfig(id: string): IconConfig {
  switch (id) {
    case 'healthcare':
      return { name: 'heart-outline', color: '#FB7185', backgroundColor: 'rgba(251, 113, 133, 0.1)' }
    case 'finance':
      return {
        name: 'bar-chart-outline',
        color: horizon.highlight,
        backgroundColor: horizon.highlightMuted,
      }
    case 'crm-sales':
      return { name: 'people-outline', color: '#7DD3FC', backgroundColor: 'rgba(125, 211, 252, 0.1)' }
    case 'customer-support':
      return { name: 'headset-outline', color: horizon.accent, backgroundColor: horizon.accentMuted }
    case 'education':
      return { name: 'book-outline', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)' }
    case 'legal':
      return { name: 'scale-outline', color: '#CBD5E1', backgroundColor: 'rgba(203, 213, 225, 0.1)' }
    case 'software-engineering':
      return { name: 'laptop-outline', color: horizon.accent, backgroundColor: 'rgba(56, 189, 248, 0.1)' }
    case 'marketing':
      return { name: 'megaphone-outline', color: '#FB923C', backgroundColor: 'rgba(251, 146, 60, 0.1)' }
    default:
      return { name: 'people-outline', color: '#94A3B8', backgroundColor: 'rgba(148, 163, 184, 0.1)' }
  }
}

function IndustryCard({ id, name }: { id: string; name: string }) {
  const icon = getIconConfig(id)

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: icon.backgroundColor }]}>
        <Ionicons name={icon.name} size={16} color={icon.color} />
      </View>
      <Text style={styles.cardTitle}>{name}</Text>
    </View>
  )
}

export default function IndustryAdoptionWavesGrid() {
  return (
    <View style={styles.grid}>
      {industries.map((industry) => (
        <View key={industry.id} style={styles.gridItem}>
          <IndustryCard id={industry.id} name={industry.name} />
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
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconBox: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 6,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: horizon.textPrimary,
  },
})
