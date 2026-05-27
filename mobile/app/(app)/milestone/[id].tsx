import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { type Href, useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Pressable, StyleSheet, View } from 'react-native'
import { Text } from '../../../components/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CollapsibleMilestoneSection } from '../../../components/CollapsibleMilestoneSection'
import { ScreenEntrance } from '../../../components/ScreenEntrance'
import { getMilestoneDetail, type MilestoneDetail } from '../../../data/milestoneDetails'
import { colors } from '../../../theme/colors'

function resolveMilestoneId(id: string | string[] | undefined) {
  if (Array.isArray(id)) return id[0] ?? ''
  return id ?? ''
}

function MilestoneDetailContent({
  detail,
  onClose,
  onNextMilestone,
}: {
  detail: MilestoneDetail
  onClose: () => void
  onNextMilestone: (nextId: string) => void
}) {
  const isHighImpact = detail.impactLevel === 'high'
  const isTransformative = detail.impactLevel === 'transformative'
  const isRevolutionary = detail.impactLevel === 'revolutionary'
  const hasAccentImpact = isHighImpact || isTransformative || isRevolutionary
  const tagBorderColor = 'rgba(59, 130, 246, 0.45)'
  const tagTextColor = colors.accentLight

  return (
    <ScreenEntrance replayKey={detail.id}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.topBar}>
        <View style={styles.spacer} />
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={22} color={colors.title} />
        </Pressable>
      </View>

      {hasAccentImpact ? (
        <LinearGradient
          colors={
            isTransformative || isRevolutionary
              ? [...colors.impactGradientStrong]
              : [...colors.impactGradient]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.impactPillHigh}
        >
          {isTransformative ? (
            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
          ) : (
            <View style={[styles.impactDot, { backgroundColor: '#FFFFFF' }]} />
          )}
          <Text style={[styles.impactText, { color: '#FFFFFF' }]}>{detail.impactBadge}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.impactPill}>
          <View style={styles.impactDot} />
          <Text style={styles.impactText}>{detail.impactBadge}</Text>
        </View>
      )}

      <Text
        style={[
          styles.period,
          { color: detail.periodColor ?? colors.accent },
        ]}
      >
        {detail.period}
      </Text>
          <Text style={styles.mainTitle}>{detail.title}</Text>
          <View style={styles.eraPill}>
            <Text style={styles.eraText}>{detail.era}</Text>
          </View>
          <Text style={styles.summary}>{detail.summary}</Text>

          <CollapsibleMilestoneSection
            variant="gradient"
            title={detail.whyChanged.title}
            subtitle={detail.whyChanged.subtitle}
          >
            {detail.whyChanged.points.map((point) => (
              <View key={point.label} style={styles.bulletBlock}>
                <View style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: point.color }]} />
                  <Text style={[styles.bulletHeading, { color: point.color }]}>{point.heading}</Text>
                </View>
                <Text style={styles.bulletBody}>{point.body}</Text>
              </View>
            ))}
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            title="Before vs After"
            subtitle="THE TRANSFORMATION"
            subtitleAccent={hasAccentImpact}
            iconName="trending-up"
          >
            <View style={styles.compareRow}>
              <View style={[styles.compareCard, styles.compareBefore]}>
                <View style={styles.compareLabelRow}>
                  <Ionicons name="close-circle" size={18} color="#F87171" />
                  <Text style={styles.compareLabel}>BEFORE</Text>
                </View>
                {detail.beforeAfter.before.map((line) => (
                  <Text key={line} style={styles.compareItem}>
                    • {line}
                  </Text>
                ))}
              </View>
              <View style={styles.compareArrow}>
                <Ionicons name="arrow-forward" size={18} color="#60A5FA" />
              </View>
              <View style={[styles.compareCard, styles.compareAfter]}>
                <View style={styles.compareLabelRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.accentCyan} />
                  <Text style={styles.compareLabel}>AFTER</Text>
                </View>
                {detail.beforeAfter.after.map((line) => (
                  <Text key={line} style={styles.compareItem}>
                    • {line}
                  </Text>
                ))}
              </View>
            </View>
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            variant="tech"
            title="Technical Breakthrough"
            subtitle="INNOVATION DETAILS"
            iconName="hardware-chip-outline"
          >
            <Text style={styles.techBody}>{detail.technicalBreakthrough}</Text>
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            title="Key Technologies Introduced"
            subtitle="CORE INNOVATIONS"
            subtitleAccent
            iconName="git-network-outline"
          >
            <View style={styles.tagWrap}>
              {detail.keyTechnologies.map((tag) => (
                <View key={tag} style={[styles.tag, { borderColor: tagBorderColor }]}>
                  <Text style={[styles.tagText, { color: tagTextColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            title="Real World Examples"
            subtitle="IN PRODUCTION TODAY"
            iconName="code-slash"
          >
            {detail.realWorldExamples.map((example) => (
              <View key={example.title} style={styles.exampleCard}>
                <View style={styles.exampleIcon}>
                  <Ionicons name="cube-outline" size={18} color={colors.accentLight} />
                </View>
                <View style={styles.exampleText}>
                  <Text style={styles.exampleTitle}>{example.title}</Text>
                  <Text style={styles.exampleDesc}>{example.description}</Text>
                </View>
              </View>
            ))}
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            title="Industries Transformed"
            subtitle="REAL-WORLD IMPACT"
            iconName="globe-outline"
          >
            <View style={styles.tagWrap}>
              {detail.industries.map((industry) => (
                <View key={industry} style={styles.industryChip}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.accentCyan} />
                  <Text style={styles.industryText}>{industry}</Text>
                </View>
              ))}
            </View>
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            title="Looking Forward"
            subtitle="FUTURE IMPLICATIONS"
            iconName="bulb-outline"
          >
            <Text style={styles.forwardBody}>{detail.lookingForward}</Text>
          </CollapsibleMilestoneSection>

          <CollapsibleMilestoneSection
            variant="next"
            title="What Came Next?"
            subtitle="FUTURE PREDICTIONS & IMPLICATIONS"
            subtitleAccent
            iconName="rocket-outline"
          >
            {detail.whatCameNext.map((item) => (
              <View key={item.title} style={styles.nextItem}>
                <Text style={[styles.nextItemTitle, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.nextItemBody}>{item.body}</Text>
              </View>
            ))}
          </CollapsibleMilestoneSection>

          {detail.nextMilestone ? (
            <Pressable
              style={styles.continueRow}
              onPress={() => onNextMilestone(detail.nextMilestone!.id)}
            >
              <View style={styles.continueText}>
                <Text style={styles.continueLabel}>TIMELINE CONTINUES</Text>
                <Text style={styles.continueTitle}>
                  {detail.nextMilestone.period} — {detail.nextMilestone.title}
                </Text>
              </View>
              <View style={styles.continueArrow}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            </Pressable>
          ) : null}
    </ScrollView>
    </ScreenEntrance>
  )
}

export default function MilestoneDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const milestoneId = resolveMilestoneId(id)
  const detail = getMilestoneDetail(milestoneId)

  if (!detail) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Milestone detail coming soon.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.fallbackLink}>Go back</Text>
        </Pressable>
      </View>
    )
  }

  const goToNextMilestone = (nextId: string) => {
    router.replace(`/milestone/${nextId}` as Href)
  }

  return (
    <View key={milestoneId} style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <MilestoneDetailContent
          detail={detail}
          onClose={() => router.back()}
          onNextMilestone={goToNextMilestone}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  spacer: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.impactFoundationalBg,
    marginBottom: 16,
  },
  impactPillHigh: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  impactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentSky,
  },
  impactText: {
    color: colors.accentLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  period: {
    color: '#94A3B8',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  mainTitle: {
    color: colors.title,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  eraPill: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eraText: {
    color: colors.subtitle,
    fontSize: 13,
    fontWeight: '600',
  },
  summary: {
    marginTop: 16,
    marginBottom: 20,
    color: colors.subtitle,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  bulletBlock: {
    marginTop: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bulletHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bulletBody: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
    paddingLeft: 16,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  compareBefore: {
    borderColor: 'rgba(248,113,113,0.4)',
  },
  compareAfter: {
    borderColor: colors.compareAfter,
  },
  compareLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  compareLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  compareItem: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  compareArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59,130,246,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techBody: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tagText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '600',
  },
  exampleCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 10,
  },
  exampleIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleText: {
    flex: 1,
  },
  exampleTitle: {
    color: colors.title,
    fontSize: 15,
    fontWeight: '700',
  },
  exampleDesc: {
    marginTop: 4,
    color: colors.subtitle,
    fontSize: 13,
    lineHeight: 18,
  },
  industryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  industryText: {
    color: colors.title,
    fontSize: 13,
    fontWeight: '600',
  },
  forwardBody: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  nextItem: {
    marginBottom: 16,
  },
  nextItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  nextItemBody: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    backgroundColor: 'rgba(37,99,235,0.12)',
  },
  continueText: {
    flex: 1,
    paddingRight: 12,
  },
  continueLabel: {
    color: colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  continueTitle: {
    marginTop: 4,
    color: colors.title,
    fontSize: 16,
    fontWeight: '700',
  },
  continueArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackText: {
    color: colors.subtitle,
    fontSize: 16,
    marginBottom: 12,
  },
  fallbackLink: {
    color: colors.linkAlt,
    fontSize: 16,
    fontWeight: '700',
  },
})
