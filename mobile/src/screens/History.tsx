import { Text } from '@/components/AppText'
import { riskLevelColor, riskLevelLabel } from '@/lib/calculateMarketRiskIndex'
import { loadScanHistory, type UserResumeScanRecord } from '@/lib/scanHistory'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

type HistoryProps = {
  refreshKey?: number
}

function riskIconName(score: number): keyof typeof Ionicons.glyphMap {
  if (score >= 70) return 'alert-circle'
  if (score >= 45) return 'warning-outline'
  return 'shield-checkmark-outline'
}

function formatScanDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function HistoryEmptyState() {
  return (
    <View style={styles.emptyHistory}>
      <Ionicons name="time-outline" size={28} color={horizon.textSecondary} />
      <Text style={styles.emptyHistoryTitle}>No analyses yet</Text>
      <Text style={styles.emptyHistoryBody}>
        Run your first transition roadmap from the New Analysis tab.
      </Text>
    </View>
  )
}

function HistoryCard({ scan }: { scan: UserResumeScanRecord }) {
  const riskColor = riskLevelColor(scan.calculated_risk_score)
  const riskLabel = riskLevelLabel(scan.calculated_risk_score)
  const iconName = riskIconName(scan.calculated_risk_score)
  const tier = scan.tier?.trim() || 'free'

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.headline} numberOfLines={2}>
          {scan.target_role_input}
        </Text>
        <View style={[styles.riskIconBadge, { backgroundColor: `${riskColor}22` }]}>
          <Ionicons name={iconName} size={18} color={riskColor} />
        </View>
      </View>

      <View style={styles.riskRow}>
        <Text style={[styles.riskScore, { color: riskColor }]}>
          Risk Score: {scan.calculated_risk_score}%
        </Text>
        <Text style={[styles.riskTier, { color: riskColor }]}>{riskLabel}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={horizon.textSecondary} />
          <Text style={styles.metaText}>{formatScanDate(scan.created_at)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="ribbon-outline" size={14} color={horizon.textSecondary} />
          <Text style={styles.metaText}>{tier === 'premium' ? 'Premium' : 'Free'} tier</Text>
        </View>
      </View>

      {scan.gaps_summary ? (
        <View style={styles.gapsRow}>
          <Ionicons name="git-branch-outline" size={14} color={horizon.textSecondary} />
          <Text style={styles.gapsText} numberOfLines={2}>
            Gaps: {scan.gaps_summary}
          </Text>
        </View>
      ) : null}

      {scan.current_role_input ? (
        <Text style={styles.fromRole} numberOfLines={1}>
          From {scan.current_role_input}
        </Text>
      ) : null}
    </View>
  )
}

export default function History({ refreshKey = 0 }: HistoryProps) {
  const [scans, setScans] = useState<UserResumeScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const records = await loadScanHistory()
      setScans(records)
    } catch {
      setError('Could not load scan history.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory, refreshKey])

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" color={horizon.accent} />
        <Text style={styles.loadingText}>Loading history…</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => void loadHistory()}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  if (scans.length === 0) {
    return <HistoryEmptyState />
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadHistory(true)}
          tintColor={horizon.accent}
        />
      }
      contentContainerStyle={styles.listContent}
    >
      {scans.map((scan) => (
        <HistoryCard key={scan.id} scan={scan} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headline: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: horizon.textPrimary,
    lineHeight: 26,
  },
  riskIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  riskScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskTier: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: horizon.textSecondary,
  },
  gapsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  gapsText: {
    flex: 1,
    fontSize: 13,
    color: horizon.textSecondary,
    lineHeight: 18,
  },
  fromRole: {
    marginTop: 8,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyHistoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  emptyHistoryBody: {
    fontSize: 14,
    color: horizon.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: horizon.textSecondary,
  },
  errorWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#F87171',
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.accent,
  },
})
