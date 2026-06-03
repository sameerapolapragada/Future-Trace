import ExplorePageHeader from '@/components/ExplorePageHeader'
import IndustryWaves from '@/components/IndustryWaves'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text } from 'react-native'

export default function IndustryAnalysisScreen() {
  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>Industry Adoption Waves</Text>
      <Text style={styles.subtitle}>
        How different industries adopted AI and what to expect next
      </Text>

      <IndustryWaves />
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
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
})
