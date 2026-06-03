import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState, type ReactNode } from 'react'
import { enableAndroidLayoutAnimation } from '@/lib/layoutAnimation'
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { Text } from './AppText'
import { colors } from '../theme/colors'

enableAndroidLayoutAnimation()

type CollapsibleMilestoneSectionProps = {
  title: string
  subtitle?: string
  subtitleAccent?: boolean
  iconName?: keyof typeof Ionicons.glyphMap
  iconBg?: string
  children: ReactNode
  variant?: 'default' | 'gradient' | 'tech' | 'next'
  style?: StyleProp<ViewStyle>
}

function SectionIcon({
  name,
  bg,
}: {
  name: keyof typeof Ionicons.glyphMap
  bg: string
}) {
  return (
    <View style={[styles.sectionIcon, { backgroundColor: bg }]}>
      <Ionicons name={name} size={20} color="#FFFFFF" />
    </View>
  )
}

export function CollapsibleMilestoneSection({
  title,
  subtitle,
  subtitleAccent = false,
  iconName,
  iconBg = colors.primaryBlue,
  children,
  variant = 'default',
  style,
}: CollapsibleMilestoneSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded((value) => !value)
  }

  const header = (
    <Pressable
      onPress={toggle}
      style={styles.headerPressable}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${title}, ${expanded ? 'collapse' : 'expand'} section`}
    >
      <View style={styles.sectionHeaderRow}>
        {iconName ? <SectionIcon name={iconName} bg={iconBg} /> : null}
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? (
            <Text
              style={[
                styles.sectionSubtitle,
                subtitleAccent ? styles.sectionSubtitleAccent : null,
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.chevronWrap}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.muted}
          />
        </View>
      </View>
    </Pressable>
  )

  const body = expanded ? <View style={styles.body}>{children}</View> : null

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[...colors.whyCardGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.whyCard, style]}
      >
        {header}
        {body}
      </LinearGradient>
    )
  }

  if (variant === 'next') {
    return (
      <LinearGradient
        colors={['rgba(37,99,235,0.18)', 'rgba(24,190,230,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.nextSection, style]}
      >
        {header}
        {body}
      </LinearGradient>
    )
  }

  if (variant === 'tech') {
    return (
      <View style={[styles.techCard, style]}>
        {header}
        {body}
      </View>
    )
  }

  return (
    <View style={[styles.sectionBlock, style]}>
      {header}
      {body}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionBlock: {
    marginBottom: 12,
  },
  whyCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  techCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  nextSection: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
    marginBottom: 8,
  },
  headerPressable: {
    borderRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.title,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    marginTop: 4,
    color: colors.sectionLabel,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sectionSubtitleAccent: {
    color: colors.accentCyan,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  body: {
    marginTop: 14,
  },
})
