import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from '../../../components/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScreenEntrance } from '../../../components/ScreenEntrance'
import { SectionHeader } from '../../../components/SectionHeader'
import { ScreenBackground } from '../../../components/ScreenBackground'
import { useScoreStats } from '../../../context/ScoreContext'
import { latestAiShift, timelineLastUpdated, timelineOverview } from '../../../data/homeFeed'
import { scoreCountLabel } from '../../../lib/formatScoreCount'
import { colors } from '../../../theme/colors'

function StatusPill({
  dotColor,
  backgroundColor,
  textColor,
  label,
}: {
  dotColor: string
  backgroundColor: string
  textColor: string
  label: string
}) {
  return (
    <View style={[styles.statusPill, { backgroundColor }]}>
      <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
      <Text style={[styles.statusPillText, { color: textColor }]}>{label}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const router = useRouter()
  const { scoresGeneratedCount } = useScoreStats()

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenEntrance>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          <Text style={styles.heroTitle}>Future Trace</Text>
          <Text style={styles.heroSubtitle}>
            Explore how artificial intelligence evolved from symbolic systems to autonomous AI
            agents.
          </Text>

          <View style={styles.heroActions}>
            <Pressable
              style={styles.primaryCta}
              onPress={() => router.navigate('/timeline')}
            >
              <Text style={styles.primaryCtaText}>Start Exploring</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </Pressable>

            <Pressable
              style={styles.secondaryCta}
              onPress={() => router.push('/score')}
            >
              <Text style={styles.secondaryCtaText}>Check AI Score</Text>
            </Pressable>
          </View>

          <SectionHeader
            title="LATEST AI SHIFT"
            rightElement={
              <StatusPill
                dotColor={colors.accentCyan}
                backgroundColor={colors.pillBlueBg}
                textColor={colors.linkAlt}
                label={latestAiShift.updatedLabel}
              />
            }
          />

          <Pressable onPress={() => router.push('/timeline')}>
            <LinearGradient
              colors={[...colors.cardNavy]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shiftCard}
            >
              <View style={styles.shiftTag}>
                <Ionicons name="sparkles" size={12} color={colors.linkAlt} />
                <Text style={styles.shiftTagText}>{latestAiShift.tag}</Text>
              </View>
              <Text style={styles.shiftTitle}>{latestAiShift.title}</Text>
              <Text style={styles.shiftSummary}>{latestAiShift.summary}</Text>
              <View style={styles.shiftFooter}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{latestAiShift.category}</Text>
                </View>
                <Text style={styles.impactText}>{latestAiShift.impact}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} style={styles.shiftChevron} />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.sectionSpacer} />

          <SectionHeader title="AI CAREER TOOL" />

          <Pressable onPress={() => router.push('/score')}>
            <LinearGradient
              colors={[...colors.cardNavy]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.careerCard}
            >
              <Text style={styles.careerTitle}>Will AI Replace Your Job?</Text>
              <Text style={styles.careerSubtitle}>
                Discover how exposed your career is to AI automation.
              </Text>
              <View style={styles.scoreRow}>
                <View style={styles.scoreButton}>
                  <Text style={styles.scoreButtonText}>Get Your Score</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.title} />
                </View>
                {scoresGeneratedCount > 0 ? (
                  <Text style={styles.scoreCount}>{scoreCountLabel(scoresGeneratedCount)}</Text>
                ) : null}
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.sectionSpacer} />

          <SectionHeader
            title="TIMELINE OVERVIEW"
            actionLabel="Swipe >"
            onActionPress={() => router.push('/timeline')}
          />

          <View style={styles.timelineUpdatedRow}>
            <StatusPill
              dotColor={colors.accentCyan}
              backgroundColor={colors.pillBlueBg}
              textColor={colors.linkAlt}
              label={timelineLastUpdated}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineTrack}
          >
            {timelineOverview.map((point, index) => (
              <Pressable
                key={point.id}
                style={styles.timelinePoint}
                onPress={() => router.push(`/milestone/${point.id}`)}
              >
                <View style={styles.timelineDot} />
                {index < timelineOverview.length - 1 ? (
                  <View style={styles.timelineConnector} />
                ) : null}
                <Text style={styles.timelineYear}>{point.year}</Text>
                <Text style={styles.timelineLabel} numberOfLines={2}>
                  {point.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          </ScrollView>
        </ScreenEntrance>
      </SafeAreaView>
    </ScreenBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  heroTitle: {
    marginTop: 8,
    color: colors.title,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    marginTop: 12,
    color: colors.subtitle,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: '95%',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    marginBottom: 28,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryCta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  secondaryCtaText: {
    color: colors.linkAlt,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSpacer: {
    height: 28,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  shiftCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  shiftTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.pillBlueMuted,
    marginBottom: 14,
  },
  shiftTagText: {
    color: colors.linkAlt,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shiftTitle: {
    color: colors.title,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  shiftSummary: {
    marginTop: 10,
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 21,
  },
  shiftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  categoryPillText: {
    color: colors.subtitle,
    fontSize: 12,
    fontWeight: '600',
  },
  impactText: {
    color: colors.linkAlt,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  shiftChevron: {
    marginLeft: 'auto',
  },
  careerCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  careerTitle: {
    color: colors.title,
    fontSize: 22,
    fontWeight: '700',
  },
  careerSubtitle: {
    marginTop: 8,
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 21,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
  },
  scoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  scoreButtonText: {
    color: colors.title,
    fontSize: 14,
    fontWeight: '700',
  },
  scoreCount: {
    color: colors.accentCyan,
    fontSize: 13,
    fontWeight: '600',
  },
  timelineUpdatedRow: {
    marginBottom: 18,
  },
  timelineTrack: {
    paddingRight: 20,
    alignItems: 'flex-start',
  },
  timelinePoint: {
    width: 92,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primaryBlue,
    marginBottom: 10,
  },
  timelineConnector: {
    position: 'absolute',
    top: 7,
    left: 54,
    width: 76,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  timelineYear: {
    color: colors.title,
    fontSize: 15,
    fontWeight: '700',
  },
  timelineLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
})
