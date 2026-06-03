import ExplorePageHeader from '@/components/ExplorePageHeader'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { HomeAboutSection } from '@/components/HomeAboutSection'
import { HomeFooter } from '@/components/HomeFooter'
import { HomeWhatComesNextHighlights } from '@/components/HomeWhatComesNextHighlights'
import { PrimaryButton } from '@/components/PrimaryButton'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const STATS = [
  { id: 'years', value: '75+ Years', icon: 'trending-up-outline' as const },
  { id: 'industries', value: '12+ Industries', icon: 'briefcase-outline' as const },
  { id: 'waves', value: '8 Tech Waves', icon: 'hardware-chip-outline' as const },
]

type MarketingHomeScreenProps = {
  /** Where the career match CTA navigates. Defaults to sign-in for guests. */
  careerMatchHref?: '/sign-in' | '/score'
}

export function MarketingHomeScreen({
  careerMatchHref = '/sign-in',
}: MarketingHomeScreenProps) {
  const router = useRouter()

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <ExplorePageHeader />

        <Text style={styles.title}>Future Trace</Text>
        <Text style={styles.tagline}>Career Intelligence for the AI Age</Text>
      </View>

      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <View key={stat.id} style={styles.statChip}>
            <Ionicons name={stat.icon} size={14} color={horizon.accent} />
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label="Check your AI Career Match"
        onPress={() => router.push(careerMatchHref)}
        rightIcon={<Ionicons name="chevron-forward" size={16} color={horizon.buttonText} />}
        style={styles.careerMatchButton}
      />

      <View style={styles.sectionSpacer} />

      <HomeAboutSection />

      <View style={styles.sectionSpacer} />

      <HomeWhatComesNextHighlights />

      <HomeFooter />
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: horizon.textPrimary,
    flexShrink: 1,
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  sectionSpacer: {
    height: 16,
  },
  careerMatchButton: {
    marginTop: 16,
  },
})
