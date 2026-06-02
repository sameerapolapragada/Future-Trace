import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { careerRoles } from '@/data/careerImpact'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text, View } from 'react-native'

function riskColor(level: string): string {
  switch (level) {
    case 'high':
      return '#FB7185'
    case 'medium':
      return '#FB923C'
    default:
      return horizon.highlight
  }
}

export default function JobsAffectedByAIScreen() {
  return (
    <ExploreScreenBackground>
      <Text style={styles.intro}>
        Career roles ranked by AI disruption exposure and automation potential.
      </Text>
      {careerRoles.map((role) => (
        <View key={role.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.role}>{role.role}</Text>
            <Text style={[styles.risk, { color: riskColor(role.riskLevel) }]}>
              {role.riskLevel === 'high'
                ? 'High Risk'
                : role.riskLevel === 'medium'
                  ? 'Medium Risk'
                  : 'Low Risk'}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${role.impactPercent}%`, backgroundColor: riskColor(role.riskLevel) },
              ]}
            />
          </View>
          <Text style={styles.percent}>{role.impactPercent}% AI impact exposure</Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  role: { fontSize: 16, fontWeight: '600', color: horizon.textPrimary, flex: 1 },
  risk: { fontSize: 11, fontWeight: '600' },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: horizon.borderMuted,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  percent: { marginTop: 6, fontSize: 11, color: horizon.textSecondary },
})
