import { careerRolesPreview, type CareerRole, CareerRoleIcon, RiskLevel } from '@/data/careerImpact'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

function getRoleIcon(icon: CareerRoleIcon): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case 'laptop':
      return 'laptop-outline'
    case 'smartphone':
      return 'phone-portrait-outline'
    case 'chart':
      return 'bar-chart-outline'
    case 'target':
      return 'locate-outline'
    case 'headphones':
      return 'headset-outline'
    case 'scale':
      return 'scale-outline'
    case 'code':
      return 'code-slash-outline'
    case 'shield':
      return 'shield-checkmark-outline'
    default:
      return 'laptop-outline'
  }
}

function riskStyles(level: RiskLevel) {
  switch (level) {
    case 'high':
      return { bar: '#FB7185', label: '#FB7185', status: 'High Risk', trending: true }
    case 'medium':
      return { bar: '#FB923C', label: '#FB923C', status: 'Medium Risk', trending: false }
    case 'low':
      return { bar: horizon.highlight, label: horizon.highlight, status: 'Low Risk', trending: false }
  }
}

export function CareerImpactCard({
  role,
  onPress,
}: {
  role: CareerRole
  onPress?: () => void
}) {
  const styles = riskStyles(role.riskLevel)
  const iconName = getRoleIcon(role.icon)

  return (
    <Pressable style={cardStyles.card} onPress={onPress}>
      <View style={cardStyles.iconBox}>
        <Ionicons name={iconName} size={20} color="#CBD5E1" />
      </View>

      <View style={cardStyles.dotRow}>
        <View style={cardStyles.dot} />
      </View>

      <Text style={cardStyles.roleTitle}>{role.role}</Text>

      <View style={cardStyles.barTrack}>
        <View style={[cardStyles.barFill, { width: `${role.disruptionRisk}%`, backgroundColor: styles.bar }]} />
      </View>

      <View style={cardStyles.riskRow}>
        <Ionicons
          name={styles.trending ? 'trending-up' : 'arrow-forward'}
          size={12}
          color={styles.label}
        />
        <Text style={[cardStyles.riskLabel, { color: styles.label }]}>{styles.status}</Text>
      </View>
    </Pressable>
  )
}

type JobsAffectedByAIGridProps = {
  onRolePress?: (role: CareerRole) => void
}

export default function JobsAffectedByAIGrid({ onRolePress }: JobsAffectedByAIGridProps) {
  const roles = careerRolesPreview

  return (
    <View style={gridStyles.grid}>
      {roles.map((role) => (
        <View key={role.id} style={gridStyles.gridItem}>
          <CareerImpactCard
            role={role}
            onPress={onRolePress ? () => onRolePress(role) : undefined}
          />
        </View>
      ))}
    </View>
  )
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 148,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotRow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: horizon.highlight,
    backgroundColor: horizon.textPrimary,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: horizon.textPrimary,
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: horizon.borderMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
})

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
})
