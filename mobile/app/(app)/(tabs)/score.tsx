import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Text, TextInput } from '../../../components/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScreenEntrance } from '../../../components/ScreenEntrance'
import { ScreenBackground } from '../../../components/ScreenBackground'
import { useScoreStats } from '../../../context/ScoreContext'
import {
  allScoreJobOptions,
  mostSearchedToday,
  popularPanicJobs,
  type ScoreJobOption,
} from '../../../data/scoreJobs'
import {
  calculateExposure,
  type ExposureLevel,
  type ExposureResult,
} from '../../../lib/exposureScore'
import { colors } from '../../../theme/colors'

function exposurePercentColor(exposurePercent: number) {
  const percent = Math.max(0, Math.min(100, exposurePercent))

  // Traffic-light thresholds for AI exposure risk.
  // <= 45: green, 46–65: yellow, > 65: red
  if (percent > 65) return colors.danger
  if (percent > 45) return colors.warning
  return colors.success
}

function formatLastRefreshed(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
  const m = months[date.getMonth()] ?? 'May'
  return `${m} ${date.getDate()}, ${date.getFullYear()}`
}

function roleInsights(level: ExposureLevel) {
  if (level === 'High') {
    return {
      whatThisMeans:
        'Your role is rapidly evolving due to generative AI and autonomous workflows.',
      atRisk: ['Repetitive reporting', 'Documentation', 'Basic support workflows', 'Data entry tasks'],
      protected: ['Strategic development', 'Stakeholder communication', 'Leadership decisions', 'Creative problem solving'],
      keyInsight:
        'AI is automating routine tasks in your field, but strategic and creative work remains valuable.',
    }
  }

  if (level === 'Medium') {
    return {
      whatThisMeans:
        'AI will reshape your day-to-day work. Many tasks become faster, but judgment and coordination still matter.',
      atRisk: ['Routine analysis', 'Summaries & documentation', 'Basic content production', 'Template-based workflows'],
      protected: ['Cross-team alignment', 'Domain judgment', 'Decision-making', 'Relationship building'],
      keyInsight:
        'Leverage AI for speed, and invest in domain expertise and collaboration to stay resilient.',
    }
  }

  return {
    whatThisMeans:
      'Your role is relatively resilient. AI is more likely to augment your work than fully replace it.',
    atRisk: ['Admin overhead', 'Scheduling & coordination', 'Simple write-ups', 'Low-stakes analysis'],
    protected: ['Hands-on problem solving', 'Complex decisions', 'High-trust interactions', 'On-the-ground execution'],
    keyInsight:
      'Use AI as an assistant while you focus on high-trust and high-context work.',
  }
}

function GaugeRing({
  percent,
  accentColor,
}: {
  percent: number
  accentColor: string
}) {
  const size = 220
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percent))
  const dashOffset = circumference - (circumference * clamped) / 100

  return (
    <View style={styles.gaugeWrap}>
      <Svg width={size} height={size} style={styles.gaugeSvg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accentColor}
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.gaugeCenter}>
        <View style={styles.gaugeIconWrap}>
          <Ionicons name="alert-circle-outline" size={20} color={accentColor} />
        </View>
        <Text style={[styles.gaugePercent, { color: accentColor }]}>{clamped}%</Text>
        <Text style={styles.gaugeLabel}>AI Exposed</Text>
      </View>
    </View>
  )
}

function ScoreResultScreen({
  role,
  result,
  onBack,
}: {
  role: string
  result: ExposureResult
  onBack: () => void
}) {
  const accentColor = exposurePercentColor(result.score)
  const insights = roleInsights(result.level)

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.resultScroll}
    >
      <Pressable style={styles.resultBackRow} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color={colors.link} />
        <Text style={styles.resultBackText}>Back</Text>
      </Pressable>

      <Text style={styles.resultHeaderTitle}>AI Exposure Score</Text>
      <Text style={styles.resultHeaderRole}>{role || 'Your role'}</Text>

      <View style={styles.updatedPillRow}>
        <View style={styles.updatedPill}>
          <Ionicons name="refresh-outline" size={14} color={colors.muted} />
          <Text style={styles.updatedPillText}>Updated every 30 days</Text>
        </View>
      </View>

      <Text style={styles.resultMeta}>
        Based on current AI adoption trends and automation signals
      </Text>
      <Text style={styles.resultMetaMuted}>
        Last refreshed: {formatLastRefreshed(new Date())}
      </Text>

      <View style={styles.gaugeCard}>
        <GaugeRing percent={result.score} accentColor={accentColor} />
      </View>

      <View style={styles.whatMeansCard}>
        <Text style={styles.sectionTitle}>WHAT THIS MEANS</Text>
        <Text style={styles.whatMeansBody}>{insights.whatThisMeans}</Text>
      </View>

      <Text style={styles.whyTitle}>WHY THIS SCORE?</Text>
      <View style={styles.whyRow}>
        <View style={[styles.whyBox, styles.whyAtRisk]}>
          <View style={styles.whyHeader}>
            <Ionicons name="flash-outline" size={16} color={colors.danger} />
            <Text style={[styles.whyHeaderText, { color: colors.danger }]}>AT RISK</Text>
          </View>
          {insights.atRisk.map((item) => (
            <View key={item} style={styles.whyItem}>
              <Ionicons name="close" size={14} color="rgba(248,113,113,0.75)" />
              <Text style={styles.whyItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.whyBox, styles.whyProtected]}>
          <View style={styles.whyHeader}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
            <Text style={[styles.whyHeaderText, { color: colors.success }]}>PROTECTED</Text>
          </View>
          {insights.protected.map((item) => (
            <View key={item} style={styles.whyItem}>
              <Ionicons name="checkmark" size={14} color="rgba(52, 211, 153, 0.75)" />
              <Text style={styles.whyItemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.keyInsightCard}>
        <View style={styles.keyInsightHeader}>
          <View style={styles.keyInsightBadge}>
            <Ionicons name="information-circle-outline" size={16} color={colors.accentCyan} />
          </View>
          <Text style={styles.keyInsightTitle}>KEY INSIGHT</Text>
        </View>
        <Text style={styles.keyInsightBody}>{insights.keyInsight}</Text>
      </View>
    </ScrollView>
  )
}

function AnalysisLoadingScreen({ progress }: { progress: number }) {
  const activeDot = Math.floor(progress / 34)

  return (
    <View style={styles.loadingWrap}>
      <View style={styles.loadingCircleOuter}>
        <LinearGradient
          colors={['rgba(31, 93, 255, 0.95)', 'rgba(138, 92, 246, 0.85)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.loadingCircleInner}
        >
          <Text style={styles.loadingPercent}>{progress}%</Text>
        </LinearGradient>
      </View>

      <Text style={styles.loadingText}>Calculating future job resilience...</Text>
      <View style={styles.loadingDotsRow}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.loadingDot,
              index === activeDot && styles.loadingDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

function AnalyzeJobButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.analyzeButton,
        pressed && !disabled && styles.analyzeButtonPressed,
        disabled && styles.analyzeButtonDisabled,
      ]}
    >
      <LinearGradient
        colors={[...colors.primaryGradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.analyzeButtonGradient}
      >
        <Text style={styles.analyzeButtonText}>Analyze My Job</Text>
        <Ionicons name="arrow-forward" size={15} color="rgba(255,255,255,0.92)" />
      </LinearGradient>
    </Pressable>
  )
}

function PopularJobPill({
  job,
  selected,
  onPress,
}: {
  job: ScoreJobOption
  selected: boolean
  onPress: () => void
}) {
  if (selected) {
    return (
      <Pressable onPress={onPress} style={styles.popularPillSelectedWrap}>
        <LinearGradient
          colors={[...colors.primaryGradient]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.popularPillSelected}
        >
          <Text style={styles.popularPillTextSelected}>{job.title}</Text>
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.popularPill, pressed && styles.popularPillPressed]}
      onPress={onPress}
    >
      <Text style={styles.popularPillText}>{job.title}</Text>
    </Pressable>
  )
}

function ScoreJobPicker({
  role,
  selectedJobId,
  onRoleChange,
  onHighlightJob,
  onAnalyze,
}: {
  role: string
  selectedJobId: string | null
  onRoleChange: (value: string) => void
  onHighlightJob: (job: ScoreJobOption) => void
  onAnalyze: () => void
}) {
  const footerAnim = useRef(new Animated.Value(0)).current

  const filteredPopular = useMemo(() => {
    const q = role.trim().toLowerCase()
    if (!q) return popularPanicJobs
    return popularPanicJobs.filter((job) => job.title.toLowerCase().includes(q))
  }, [role])

  const showAnalyzeButton = selectedJobId !== null || role.trim().length > 1

  useEffect(() => {
    Animated.timing(footerAnim, {
      toValue: showAnalyzeButton ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start()
  }, [footerAnim, showAnalyzeButton])

  const footerTranslateY = footerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  })

  const footerScale = footerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  })

  return (
    <View style={styles.pickerRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.pickerScroll,
          showAnalyzeButton ? styles.pickerScrollWithFooter : null,
        ]}
      >
        <Text style={styles.pickerTitle}>What's your job?</Text>
        <Text style={styles.pickerSubtitle}>We'll analyze how AI might impact your role</Text>

        <TextInput
          value={role}
          onChangeText={onRoleChange}
          placeholder="Enter your job title"
          placeholderTextColor={colors.placeholder}
          style={styles.jobInput}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (showAnalyzeButton) onAnalyze()
          }}
        />

        <Text style={styles.sectionLabel}>POPULAR JOBS</Text>
        <View style={styles.popularWrap}>
          {filteredPopular.map((job) => (
            <PopularJobPill
              key={job.id}
              job={job}
              selected={selectedJobId === job.id}
              onPress={() => onHighlightJob(job)}
            />
          ))}
        </View>

        {filteredPopular.length === 0 ? (
          <Text style={styles.emptyHint}>No matches in popular jobs — you can still analyze a custom title.</Text>
        ) : null}

        <View style={styles.trendingHeader}>
          <Ionicons name="trending-up" size={18} color={colors.accentCyan} />
          <Text style={[styles.sectionLabel, styles.trendingSectionLabel]}>MOST SEARCHED TODAY</Text>
        </View>

        {mostSearchedToday.map((job) => {
          const selected = selectedJobId === job.id
          return (
            <Pressable
              key={job.id}
              style={[styles.trendingCard, selected && styles.trendingCardSelected]}
              onPress={() => onHighlightJob(job)}
            >
              <LinearGradient
                colors={
                  selected ? [...colors.primaryGradient] : ['rgba(37, 99, 235, 0.45)', 'rgba(24, 190, 230, 0.35)']
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.trendingIcon}
              >
                <Ionicons name="trending-up" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.trendingTitle}>{job.title}</Text>
              {job.searchVolume ? <Text style={styles.trendingVolume}>{job.searchVolume}</Text> : null}
            </Pressable>
          )
        })}
      </ScrollView>

      <Animated.View
        pointerEvents={showAnalyzeButton ? 'auto' : 'none'}
        style={[
          styles.analyzeFooter,
          {
            opacity: footerAnim,
            transform: [{ translateY: footerTranslateY }, { scale: footerScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(11, 14, 20, 0.85)', 'rgba(11, 14, 20, 0.98)']}
          style={styles.analyzeFooterFade}
          pointerEvents="none"
        />
        <AnalyzeJobButton onPress={onAnalyze} disabled={!showAnalyzeButton} />
      </Animated.View>
    </View>
  )
}

export default function ScoreScreen() {
  const { recordScoreGeneration } = useScoreStats()
  const [role, setRole] = useState('')
  const [industry, setIndustry] = useState('')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [result, setResult] = useState<ExposureResult | null>(null)
  const [pendingResult, setPendingResult] = useState<ExposureResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    if (!isAnalyzing) return

    let progress = 0
    const interval = setInterval(() => {
      progress = Math.min(progress + 2, 100)
      setAnalysisProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          if (pendingResult) {
            setResult(pendingResult)
            recordScoreGeneration()
          }
          setPendingResult(null)
          setIsAnalyzing(false)
        }, 180)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [isAnalyzing, pendingResult, recordScoreGeneration])

  const handleHighlightJob = (job: ScoreJobOption) => {
    setSelectedJobId(job.id)
    setRole(job.title)
    setIndustry(job.defaultIndustry)
    setResult(null)
  }

  const handleRoleChange = (value: string) => {
    setRole(value)
    setResult(null)

    const match = allScoreJobOptions.find(
      (job) => job.title.toLowerCase() === value.trim().toLowerCase()
    )
    setSelectedJobId(match?.id ?? null)
    if (match) {
      setIndustry(match.defaultIndustry)
    }
  }

  const handleAnalyze = () => {
    const trimmedRole = role.trim()
    if (!trimmedRole) return

    setPendingResult(calculateExposure(trimmedRole, industry.trim() || 'General'))
    setAnalysisProgress(0)
    setIsAnalyzing(true)
  }

  const handleBackFromResult = () => {
    setResult(null)
  }

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          {isAnalyzing ? (
            <AnalysisLoadingScreen progress={analysisProgress} />
          ) : result ? (
            <ScoreResultScreen role={role} result={result} onBack={handleBackFromResult} />
          ) : (
            <ScreenEntrance style={styles.flex}>
              <ScoreJobPicker
                role={role}
                selectedJobId={selectedJobId}
                onRoleChange={handleRoleChange}
                onHighlightJob={handleHighlightJob}
                onAnalyze={handleAnalyze}
              />
            </ScreenEntrance>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  pickerRoot: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingCircleOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: 'rgba(70, 162, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    marginBottom: 26,
  },
  loadingCircleInner: {
    width: 212,
    height: 212,
    borderRadius: 106,
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 18, 32, 0.45)',
  },
  loadingPercent: {
    color: colors.accentLight,
    fontSize: 68,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  loadingText: {
    color: colors.subtitle,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingDotsRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  loadingDotActive: {
    backgroundColor: colors.accent,
  },
  resultScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  resultBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  resultBackText: {
    color: colors.link,
    fontSize: 16,
    fontWeight: '600',
  },
  resultHeaderTitle: {
    color: colors.title,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultHeaderRole: {
    marginTop: 6,
    color: colors.subtitle,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  updatedPillRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  updatedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  updatedPillText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  resultMeta: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  resultMetaMuted: {
    marginTop: 6,
    color: 'rgba(148, 163, 184, 0.65)',
    fontSize: 11,
    textAlign: 'center',
  },
  gaugeCard: {
    marginTop: 18,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeWrap: {
    width: 260,
    height: 260,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeSvg: {
    position: 'absolute',
  },
  gaugeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gaugePercent: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  gaugeLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  whatMeansCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.sectionLabel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  whatMeansBody: {
    marginTop: 10,
    color: colors.title,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  whyTitle: {
    color: colors.sectionLabel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  whyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  whyBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  whyAtRisk: {
    borderColor: 'rgba(248,113,113,0.18)',
    backgroundColor: 'rgba(248,113,113,0.06)',
  },
  whyProtected: {
    borderColor: 'rgba(52, 211, 153, 0.18)',
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  whyHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  whyItemText: {
    flex: 1,
    color: 'rgba(226, 232, 240, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  keyInsightCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    backgroundColor: 'rgba(37, 99, 235, 0.10)',
    padding: 16,
  },
  keyInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  keyInsightBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(24, 190, 230, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(24, 190, 230, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyInsightTitle: {
    color: colors.accentLight,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  keyInsightBody: {
    color: 'rgba(226, 232, 240, 0.92)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  pickerScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  pickerScrollWithFooter: {
    paddingBottom: 88,
  },
  pickerTitle: {
    color: colors.title,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  pickerSubtitle: {
    marginTop: 8,
    marginBottom: 22,
    color: colors.subtitle,
    fontSize: 15,
    lineHeight: 22,
  },
  jobInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.inputText,
    fontSize: 16,
    marginBottom: 28,
  },
  sectionLabel: {
    color: colors.sectionLabel,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },
  popularWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  popularPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  popularPillPressed: {
    borderColor: 'rgba(59, 130, 246, 0.35)',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  popularPillSelectedWrap: {
    borderRadius: 12,
    shadowColor: colors.accentCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 6,
  },
  popularPillSelected: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  popularPillText: {
    color: colors.title,
    fontSize: 14,
    fontWeight: '600',
  },
  popularPillTextSelected: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyHint: {
    color: colors.muted,
    fontSize: 13,
    marginTop: -18,
    marginBottom: 28,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  trendingSectionLabel: {
    marginBottom: 0,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  trendingCardSelected: {
    borderColor: 'rgba(70, 162, 255, 0.55)',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  trendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingTitle: {
    flex: 1,
    color: colors.title,
    fontSize: 16,
    fontWeight: '700',
  },
  trendingVolume: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  analyzeFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 28,
  },
  analyzeFooterFade: {
    ...StyleSheet.absoluteFillObject,
  },
  analyzeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.accentCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  analyzeButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  analyzeButtonDisabled: {
    opacity: 0.45,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: colors.link,
    fontSize: 15,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 20,
  },
  resultLabel: {
    color: colors.label,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultScore: {
    marginTop: 8,
    color: colors.title,
    fontSize: 48,
    fontWeight: '700',
  },
  resultLevel: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  resultSummary: {
    marginTop: 16,
    color: colors.subtitle,
    fontSize: 15,
    lineHeight: 22,
  },
  suggestionsTitle: {
    marginTop: 20,
    color: colors.title,
    fontSize: 16,
    fontWeight: '700',
  },
  suggestionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  bullet: {
    color: colors.link,
    fontSize: 16,
  },
  suggestionText: {
    flex: 1,
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 21,
  },
})
