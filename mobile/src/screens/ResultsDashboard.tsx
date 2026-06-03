import { PrimaryButton } from '@/components/PrimaryButton'
import {
  buildRiskNarrative,
  calculateMarketRiskIndex,
  riskLevelLabel,
} from '@/lib/calculateMarketRiskIndex'
import { MOCK_PIVOT_ROLES, type PivotRoleCard } from '@/src/data/mockPivotRoles'
import { RiskGauge } from '@/src/components/RiskGauge'
import { PremiumBlurOverlay } from '@/components/PremiumBlurOverlay'
import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type PlanOption = 'subscription' | 'token'

export type ResultsDashboardProps = {
  currentRole: string
  targetRole: string
  /** Optional override; otherwise derived from roles. */
  riskIndex?: number
  onSelectSubscription: () => void
  onSelectToken: () => void
}

/** Upper scorecard cap — ~25% of viewport height. */
const FREE_ZONE_HEIGHT_RATIO = 0.25
const GAUGE_SIZE_RATIO = 0.18

function PivotRoleCardView({ role }: { role: PivotRoleCard }) {
  return (
    <View className="mb-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <Text className="text-base font-semibold text-slate-100">{role.title}</Text>
      <Text className="mt-2 text-sm text-slate-400">Salary Range</Text>
      <Text className="text-sm font-medium text-slate-200">{role.salaryRange}</Text>
      <Text className="mt-3 text-sm text-slate-400">Match Score</Text>
      <Text className="text-lg font-bold text-amber-400">{role.matchPercent}%</Text>
      <Text className="mt-3 text-sm text-slate-400">Skills Missing</Text>
      {role.skillsMissing.map((skill) => (
        <Text key={skill} className="mt-1 text-sm text-slate-300">
          • {skill}
        </Text>
      ))}
    </View>
  )
}

type PlanSelectorProps = {
  selected: PlanOption
  onSelect: (plan: PlanOption) => void
  onSelectSubscription: () => void
  onSelectToken: () => void
}

function PlanSelector({
  selected,
  onSelect,
  onSelectSubscription,
  onSelectToken,
}: PlanSelectorProps) {
  return (
    <View className="mt-5 gap-3">
      <Pressable
        onPress={() => onSelect('subscription')}
        className={`rounded-xl border p-4 ${
          selected === 'subscription'
            ? 'border-amber-400 bg-amber-400/10'
            : 'border-slate-700 bg-slate-900/60'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-wider text-amber-400">Recommended</Text>
          <Text className="text-sm font-bold text-slate-100">$6.99/mo</Text>
        </View>
        <Text className="mt-2 text-sm font-semibold text-slate-100">Plan A · Live Market Radar Sub</Text>
        <Text className="mt-1 text-xs leading-5 text-slate-400">
          Continuous background tracking, weekly re-scans, push alerts.
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onSelect('token')}
        className={`rounded-xl border p-4 ${
          selected === 'token'
            ? 'border-slate-500 bg-slate-800/80'
            : 'border-slate-800 bg-slate-950/40'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">One-time</Text>
          <Text className="text-sm font-bold text-slate-300">$2.99</Text>
        </View>
        <Text className="mt-2 text-sm font-semibold text-slate-200">Plan B · Single-Use Unlock Pass</Text>
        <Text className="mt-1 text-xs leading-5 text-slate-500">
          Grants 1 instant wallet token credit.
        </Text>
      </Pressable>

      <PrimaryButton
        label={selected === 'subscription' ? 'Start Live Market Radar' : 'Buy Single-Use Unlock'}
        onPress={selected === 'subscription' ? onSelectSubscription : onSelectToken}
        compact
      />
    </View>
  )
}

export default function ResultsDashboard({
  currentRole,
  targetRole,
  riskIndex: riskIndexOverride,
  onSelectSubscription,
  onSelectToken,
}: ResultsDashboardProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>('subscription')
  const { height: windowHeight } = useWindowDimensions()

  const freeZoneMaxHeight = Math.round(windowHeight * FREE_ZONE_HEIGHT_RATIO)
  const gaugeSize = Math.min(112, Math.max(80, Math.round(windowHeight * GAUGE_SIZE_RATIO)))

  const riskIndex = useMemo(
    () => riskIndexOverride ?? calculateMarketRiskIndex(currentRole, targetRole),
    [currentRole, targetRole, riskIndexOverride]
  )

  const riskNarrative = useMemo(
    () => buildRiskNarrative(currentRole, targetRole, riskIndex),
    [currentRole, targetRole, riskIndex]
  )

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* FREE ZONE — compact scorecard (~25% viewport max) */}
        <View
          className="h-auto shrink-0 px-4 py-6"
          style={{ maxHeight: freeZoneMaxHeight }}
        >
          <Text className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Free Analysis
          </Text>

          <View className="mt-3 flex-row gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-xs text-slate-500">Current</Text>
              <Text className="mt-0.5 text-sm font-semibold text-slate-100" numberOfLines={2}>
                {currentRole || '—'}
              </Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-xs text-slate-500">Target</Text>
              <Text className="mt-0.5 text-sm font-semibold text-slate-100" numberOfLines={2}>
                {targetRole || '—'}
              </Text>
            </View>
          </View>

          <View className="mt-4 h-auto rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI Market Risk & Vulnerability Index
            </Text>
            <View className="mt-3">
              <RiskGauge value={riskIndex} label={riskLevelLabel(riskIndex)} size={gaugeSize} />
            </View>
            <Text className="mt-3 text-xs leading-5 text-slate-400" numberOfLines={3}>
              {riskNarrative}
            </Text>
          </View>
        </View>

        {/* PREMIUM ZONE — fills remaining ~75% viewport */}
        <View className="min-h-0 flex-1 px-4 pb-4">
          <View className="shrink-0 flex-row items-center gap-2">
            <Ionicons name="lock-closed" size={16} color="#FDBB2D" />
            <Text className="flex-1 text-base font-bold text-slate-100">
              Your 3 Immediate High-Paying Pivot Roles
            </Text>
          </View>
          <Text className="mt-1 shrink-0 text-xs text-slate-500">
            Premium intelligence — unlock to reveal salary-calibrated escape routes.
          </Text>

          <View className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl">
            <ScrollView
              className="flex-1"
              contentContainerClassName="px-1 pt-1 pb-4"
              showsVerticalScrollIndicator={false}
            >
              {MOCK_PIVOT_ROLES.map((role) => (
                <PivotRoleCardView key={role.id} role={role} />
              ))}
            </ScrollView>

            <PremiumBlurOverlay
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius: 16,
              }}
            />

            <View
              className="absolute inset-0 justify-center px-3"
              pointerEvents="box-none"
            >
              <View className="w-full rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-5">
                <View className="items-center">
                  <View className="h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
                    <Ionicons name="sparkles" size={18} color="#FDBB2D" />
                  </View>
                  <Text className="mt-3 text-center text-base font-bold text-slate-50">
                    Reveal Your Escape Hatches
                  </Text>
                  <Text className="mt-1.5 text-center text-xs leading-5 text-slate-400">
                    Unlock the three highest-paying pivot paths calibrated to your profile.
                  </Text>
                </View>

                <PlanSelector
                  selected={selectedPlan}
                  onSelect={setSelectedPlan}
                  onSelectSubscription={onSelectSubscription}
                  onSelectToken={onSelectToken}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
