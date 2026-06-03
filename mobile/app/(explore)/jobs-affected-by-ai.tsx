import ExplorePageHeader from '@/components/ExplorePageHeader'
import JobsAffectedByAIGrid from '@/components/JobsAffectedByAIGrid'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'

export default function JobsAffectedByAIScreen() {
  const router = useRouter()

  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>Jobs Affected by AI Evolution</Text>
      <Text style={styles.subtitle}>Click on any role to see detailed impact analysis</Text>

      <JobsAffectedByAIGrid onRolePress={() => router.push('/(explore)/career-analyses')} />

      <Pressable
        style={styles.footerLink}
        onPress={() => router.push('/(explore)/career-analyses')}
      >
        <Text style={styles.footerLinkText}>View all career analyses</Text>
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
    marginBottom: 16,
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
