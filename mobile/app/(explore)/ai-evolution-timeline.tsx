import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { timelinePreviewItems } from '@/data/timelinePreview'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text, View } from 'react-native'

function formatEra(era: string): string {
  return era.toLowerCase() === 'future' ? 'FUTURE' : era
}

export default function AIEvolutionTimelineScreen() {
  return (
    <ExploreScreenBackground>
      <Text style={styles.intro}>
        Eight technology waves from symbolic AI through multi-agent autonomous systems.
      </Text>
      <View style={styles.grid}>
        {timelinePreviewItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.era}>{formatEra(item.era)}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.tag}>{item.tag}</Text>
          </View>
        ))}
      </View>
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  intro: { fontSize: 15, lineHeight: 22, color: horizon.textSecondary, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%',
    minHeight: 108,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 12,
  },
  era: { fontSize: 10, fontWeight: '600', color: horizon.accent, letterSpacing: 0.8 },
  cardTitle: { marginTop: 6, fontSize: 14, fontWeight: '600', color: horizon.textPrimary },
  tag: { marginTop: 'auto', paddingTop: 8, fontSize: 11, color: horizon.textSecondary },
})
