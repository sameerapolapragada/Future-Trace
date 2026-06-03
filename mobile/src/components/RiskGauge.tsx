import { riskLevelColor } from '@/lib/calculateMarketRiskIndex'
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Text } from '@/components/AppText'

type RiskGaugeProps = {
  value: number
  label: string
  /** Gauge diameter in px — defaults to compact 96 for dashboard cards. */
  size?: number
}

export function RiskGauge({ value, label, size = 96 }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const stroke = Math.max(8, Math.round(size * 0.09))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference
  const accent = riskLevelColor(clamped)
  const center = size / 2
  const scoreFontSize = Math.max(22, Math.round(size * 0.34))

  return (
    <View className="w-full flex-row items-center gap-4">
      <View className="relative items-center justify-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1E293B"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={accent}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View className="absolute items-center justify-center">
          <Text className="font-bold text-slate-50" style={{ fontSize: scoreFontSize, lineHeight: scoreFontSize + 2 }}>
            {clamped}
          </Text>
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Risk Index</Text>
        <Text className="mt-1 text-2xl font-bold text-slate-50">{clamped}%</Text>
        <Text className="mt-1 text-sm font-semibold text-slate-300">{label}</Text>
        <Text className="mt-1 text-xs leading-4 text-slate-500">AI Market Risk & Vulnerability</Text>
      </View>
    </View>
  )
}
