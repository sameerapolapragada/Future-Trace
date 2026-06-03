import ResultsDashboard from '@/src/screens/ResultsDashboard'
import { useLocalSearchParams } from 'expo-router'
import { Alert } from 'react-native'

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    currentRole?: string
    targetRole?: string
    riskIndex?: string
  }>()

  const currentRole = typeof params.currentRole === 'string' ? params.currentRole : ''
  const targetRole = typeof params.targetRole === 'string' ? params.targetRole : ''
  const parsedRiskIndex =
    typeof params.riskIndex === 'string' && params.riskIndex.length > 0
      ? Number(params.riskIndex)
      : undefined
  const riskIndex =
    typeof parsedRiskIndex === 'number' && Number.isFinite(parsedRiskIndex)
      ? parsedRiskIndex
      : undefined

  return (
    <ResultsDashboard
      currentRole={currentRole}
      targetRole={targetRole}
      riskIndex={riskIndex}
      onSelectSubscription={() => {
        Alert.alert(
          'Live Market Radar Sub',
          'App Store subscription checkout will connect here ($6.99/mo).'
        )
      }}
      onSelectToken={() => {
        Alert.alert(
          'Single-Use Unlock Pass',
          'App Store one-time purchase will connect here ($2.99).'
        )
      }}
    />
  )
}
