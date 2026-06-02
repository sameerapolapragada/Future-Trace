import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { industries } from '@/data/industries'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text, View } from 'react-native'

export default function IndustryAdoptionWavesScreen() {
  return (
    <ExploreScreenBackground>
      <Text style={styles.intro}>
        How AI adoption is unfolding across major industries—from early automation to agentic
        futures.
      </Text>
      {industries.map((industry) => (
        <View key={industry.id} style={styles.card}>
          <Text style={styles.name}>{industry.name}</Text>
          <Text style={styles.sectionLabel}>CURRENT AI</Text>
          {industry.currentAI.slice(0, 3).map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.sectionLabel}>AGENTIC FUTURE</Text>
          {industry.agenticFuture.slice(0, 2).map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>
      ))}
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  intro: { fontSize: 15, lineHeight: 22, color: horizon.textSecondary, marginBottom: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 14,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '600', color: horizon.textPrimary },
  sectionLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: horizon.accent,
  },
  bullet: { marginLeft: 4, marginBottom: 2, fontSize: 12, color: horizon.textSecondary },
})
