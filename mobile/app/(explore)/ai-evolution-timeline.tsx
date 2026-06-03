import ExplorePageHeader from '@/components/ExplorePageHeader'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import AIEvolutionTimelineMilestones from '@/components/AIEvolutionTimelineMilestones'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'

export default function AIEvolutionTimelineScreen() {
  const router = useRouter()

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>AI Evolution Timeline</Text>
      <Text style={styles.subtitle}>Key milestones in AI development</Text>

      <AIEvolutionTimelineMilestones />

      <Pressable
        style={styles.footerLink}
        onPress={() => router.push('/(explore)/interactive-timeline')}
      >
        <Text style={styles.footerLinkText}>Explore the full interactive timeline</Text>
        <Ionicons name="chevron-forward" size={16} color={horizon.accent} />
      </Pressable>
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
  footerLink: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.accent,
  },
})
