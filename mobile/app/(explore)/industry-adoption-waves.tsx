import ExplorePageHeader from '@/components/ExplorePageHeader'
import IndustryAdoptionWavesGrid from '@/components/IndustryAdoptionWavesGrid'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'

export default function IndustryAdoptionWavesScreen() {
  const router = useRouter()

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>Industry Adoption Waves</Text>
      <Text style={styles.subtitle}>How industries adopted AI over time</Text>

      <IndustryAdoptionWavesGrid />

      <Pressable
        style={styles.footerLink}
        onPress={() => router.push('/(explore)/industry-analysis')}
      >
        <Text style={styles.footerLinkText}>Explore full industry analysis</Text>
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
