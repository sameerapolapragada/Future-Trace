import type { CareerRole, RiskLevel } from '@/data/careerImpact'
import { careerRoles } from '@/data/careerImpact'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { enableAndroidLayoutAnimation } from '@/lib/layoutAnimation'
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

enableAndroidLayoutAnimation()

const riskCategories: { level: RiskLevel; label: string }[] = [
  { level: 'high', label: 'High Risk' },
  { level: 'medium', label: 'Medium Risk' },
  { level: 'low', label: 'Low Risk' },
]

function riskStyles(level: RiskLevel) {
  switch (level) {
    case 'high':
      return {
        badgeBorder: 'rgba(248, 113, 113, 0.45)',
        badgeText: '#F87171',
        bar: '#EF4444',
        header: '#F87171',
        border: horizon.borderMuted,
      }
    case 'medium':
      return {
        badgeBorder: 'rgba(251, 146, 60, 0.45)',
        badgeText: '#FB923C',
        bar: '#F59E0B',
        header: '#FB923C',
        border: 'rgba(253, 187, 45, 0.55)',
      }
    case 'low':
      return {
        badgeBorder: 'rgba(253, 187, 45, 0.45)',
        badgeText: horizon.accent,
        bar: horizon.accent,
        header: horizon.accent,
        border: horizon.borderMuted,
      }
  }
}

function MetricBar({ label, value, barColor }: { label: string; value: number; barColor: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricTrack}>
        <View style={[styles.metricFill, { width: `${value}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  )
}

function EvolutionTimeline({ role }: { role: CareerRole }) {
  const phases = [
    { label: 'Early AI', phase: role.evolution.earlyAI, dot: '#64748B', title: '#94A3B8' },
    { label: 'Current AI', phase: role.evolution.currentAI, dot: '#38BDF8', title: horizon.accent },
    {
      label: 'Agentic Future',
      phase: role.evolution.agenticFuture,
      dot: '#22D3EE',
      title: horizon.highlight,
    },
  ] as const

  return (
    <View style={styles.evolution}>
      <Text style={styles.evolutionTitle}>Evolution Timeline</Text>
      <View style={styles.evolutionTrack}>
        <View style={styles.evolutionLine} />
        {phases.map(({ label, phase, dot, title }) => (
          <View key={label} style={styles.phaseRow}>
            <View style={[styles.phaseDot, { backgroundColor: dot }]} />
            <View style={styles.phaseContent}>
              <Text style={[styles.phaseLabel, { color: title }]}>
                {label} ({phase.era})
              </Text>
              <Text style={styles.phaseItems}>{phase.items.join(', ')}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

function RoleAccordion({ role }: { role: CareerRole }) {
  const [open, setOpen] = useState(false)
  const stylesForRisk = riskStyles(role.riskLevel)

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((prev) => !prev)
  }

  return (
    <View style={styles.roleAccordion}>
      <Pressable
        onPress={toggle}
        style={styles.roleHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.roleIconBox}>
          <Ionicons name="briefcase-outline" size={16} color={horizon.accent} />
        </View>
        <Text style={styles.roleName}>{role.role}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={horizon.textSecondary}
        />
      </Pressable>

      {open ? (
        <View style={styles.roleBody}>
          <MetricBar label="Disruption Risk" value={role.disruptionRisk} barColor={stylesForRisk.bar} />
          <MetricBar
            label="Automation Potential"
            value={role.automationPotential}
            barColor={horizon.highlight}
          />
          <EvolutionTimeline role={role} />
        </View>
      ) : null}
    </View>
  )
}

function RiskCategoryAccordion({ level, label }: { level: RiskLevel; label: string }) {
  const [open, setOpen] = useState(false)
  const stylesForRisk = riskStyles(level)
  const roles = careerRoles.filter((role) => role.riskLevel === level)

  if (roles.length === 0) return null

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((prev) => !prev)
  }

  return (
    <View style={[styles.categoryAccordion, { borderColor: stylesForRisk.border }]}>
      <Pressable onPress={toggle} style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, { color: stylesForRisk.header }]}>{label}</Text>
        <Text style={styles.categoryCount}>
          {roles.length} {roles.length === 1 ? 'role' : 'roles'}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={horizon.textSecondary}
        />
      </Pressable>

      {open ? (
        <View style={styles.categoryBody}>
          {roles.map((role) => (
            <RoleAccordion key={role.id} role={role} />
          ))}
        </View>
      ) : null}
    </View>
  )
}

export default function JobsAffected() {
  return (
    <View style={styles.list}>
      {riskCategories.map(({ level, label }) => (
        <RiskCategoryAccordion key={level} level={level} label={label} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  categoryAccordion: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: horizon.surface,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryBody: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
    padding: 12,
  },
  roleAccordion: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    overflow: 'hidden',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  roleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  roleBody: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  metric: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: horizon.textSecondary,
  },
  metricTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: horizon.borderMuted,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 3,
  },
  evolution: {
    marginTop: 4,
  },
  evolutionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  evolutionTrack: {
    position: 'relative',
    marginTop: 12,
    gap: 16,
    paddingLeft: 4,
  },
  evolutionLine: {
    position: 'absolute',
    left: 8,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: 'rgba(14, 116, 144, 0.35)',
  },
  phaseRow: {
    flexDirection: 'row',
    gap: 12,
  },
  phaseDot: {
    marginTop: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  phaseContent: {
    flex: 1,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  phaseItems: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
  },
})
