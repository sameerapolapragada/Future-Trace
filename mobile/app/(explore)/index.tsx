import BrandLogo from '@/components/BrandLogo'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const STATS = [
  {
    id: 'years',
    value: '75+ Years',
    description: 'AI evolution tracked from 1950s to agentic workflows',
    icon: 'trending-up-outline' as const,
  },
  {
    id: 'industries',
    value: '12+ Industries',
    description: 'From healthcare to finance, software to marketing',
    icon: 'briefcase-outline' as const,
  },
  {
    id: 'waves',
    value: '8 Tech Waves',
    description: 'Rule-based AI to multi-agent autonomous systems',
    icon: 'hardware-chip-outline' as const,
  },
]

export default function ExploreHomeScreen() {
  const navigation = useNavigation()

  return (
    <ExploreScreenBackground>
      <View style={styles.header}>
        <BrandLogo size={88} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Future Trace</Text>
          <Text style={styles.tagline}>Career Intelligence for the AI Age</Text>
        </View>
      </View>

      <Pressable
        style={styles.exploreCta}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Text style={styles.exploreCtaText}>Explore timelines, industries and careers</Text>
        <Ionicons name="menu" size={20} color={horizon.drawerText} />
      </Pressable>

      <View style={styles.stats}>
        {STATS.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Ionicons name={stat.icon} size={20} color={horizon.accent} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statDesc}>{stat.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutLabel}>ABOUT US</Text>
        <Text style={styles.aboutTitle}>Navigating the AI Shift: From Uncertainty to Trajectory</Text>
        <Text style={styles.aboutBody}>
          Future Trace maps your recommended trajectory from where you are today to where the market
          is starving for talent—breaking long transitions into digestible 30-day tactical sprints.
        </Text>
        <Text style={styles.hint}>
          Open the menu for AI Evolution Timeline, Industry Adoption Waves, Jobs Affected by AI, and
          What Comes Next.
        </Text>
      </View>
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8, marginBottom: 20 },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: horizon.textPrimary, letterSpacing: -0.5 },
  tagline: { marginTop: 4, fontSize: 15, color: horizon.textSecondary },
  exploreCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: horizon.accent,
  },
  exploreCtaText: { flex: 1, marginRight: 8, fontSize: 15, fontWeight: '600', color: horizon.drawerText },
  stats: { gap: 12, marginBottom: 20 },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  statIconWrap: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    backgroundColor: horizon.accentMuted,
  },
  statValue: { fontSize: 18, fontWeight: '600', color: horizon.textPrimary, marginBottom: 4 },
  statDesc: { fontSize: 12, lineHeight: 18, color: horizon.textSecondary },
  aboutCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  aboutLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: horizon.accent,
    textTransform: 'uppercase',
  },
  aboutTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  aboutBody: { fontSize: 15, lineHeight: 22, color: horizon.textSecondary, marginBottom: 12 },
  hint: { fontSize: 12, lineHeight: 18, color: horizon.textSecondary },
})
