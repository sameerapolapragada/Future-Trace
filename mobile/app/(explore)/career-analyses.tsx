import ExplorePageHeader from '@/components/ExplorePageHeader'
import JobsAffected from '@/components/JobsAffected'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text } from 'react-native'

export default function CareerAnalysesScreen() {
  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>Career Impact Analysis</Text>
      <Text style={styles.subtitle}>
        Explore how AI is transforming different roles and their disruption risk levels
      </Text>

      <JobsAffected />
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
