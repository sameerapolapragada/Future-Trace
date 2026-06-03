import ExplorePageHeader from '@/components/ExplorePageHeader'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { milestones } from '@/data/timeline'
import { horizon } from '@/theme/colors'
import ExploreTimeline from '@/components/ExploreTimeline'
import { StyleSheet, Text } from 'react-native'

export default function InteractiveTimelineScreen() {
  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />
      <Text style={styles.intro}>
        Explore how AI evolved from symbolic systems and machine learning to transformers,
        generative AI, RAG, AI agents, and multi-agent systems.
      </Text>
      <ExploreTimeline milestones={milestones} />
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: horizon.textSecondary,
    marginBottom: 16,
  },
})
