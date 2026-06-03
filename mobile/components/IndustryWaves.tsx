import type { IndustryCard } from '@/data/industries'
import { industries } from '@/data/industries'
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

type IconConfig = {
  name: keyof typeof Ionicons.glyphMap
  color: string
}

function getIndustryIcon(id: string): IconConfig {
  switch (id) {
    case 'healthcare':
      return { name: 'heart-outline', color: '#FB7185' }
    case 'finance':
      return { name: 'bar-chart-outline', color: horizon.highlight }
    case 'crm-sales':
      return { name: 'people-outline', color: horizon.highlight }
    case 'customer-support':
      return { name: 'headset-outline', color: horizon.accent }
    case 'education':
      return { name: 'book-outline', color: horizon.accent }
    case 'legal':
      return { name: 'document-text-outline', color: '#CBD5E1' }
    case 'software-engineering':
      return { name: 'code-slash-outline', color: horizon.highlight }
    case 'marketing':
      return { name: 'megaphone-outline', color: '#FB923C' }
    default:
      return { name: 'people-outline', color: '#94A3B8' }
  }
}

function BulletSection({
  title,
  items,
  titleColor,
}: {
  title: string
  items: string[]
  titleColor: string
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
      <View style={styles.bulletList}>
        {items.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function IndustryAccordion({ industry }: { industry: IndustryCard }) {
  const [open, setOpen] = useState(false)
  const icon = getIndustryIcon(industry.id)

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((prev) => !prev)
  }

  return (
    <View style={styles.accordion}>
      <Pressable
        onPress={toggle}
        style={styles.accordionHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.iconBox}>
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>
        <Text style={styles.industryName}>{industry.name}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={horizon.textSecondary}
        />
      </Pressable>

      {open ? (
        <View style={styles.accordionBody}>
          <View style={styles.twoColumn}>
            <BulletSection title="Early AI" items={industry.earlyAI} titleColor="#22D3EE" />
            <BulletSection title="Current AI" items={industry.currentAI} titleColor={horizon.accent} />
          </View>
          <View style={styles.twoColumn}>
            <BulletSection title="Main risks" items={industry.mainRisks} titleColor="#FB923C" />
            <BulletSection
              title="Main opportunities"
              items={industry.mainOpportunities}
              titleColor={horizon.highlight}
            />
          </View>
          <BulletSection
            title="Agentic Future"
            items={industry.agenticFuture}
            titleColor={horizon.highlight}
          />
        </View>
      ) : null}
    </View>
  )
}

export default function IndustryWaves() {
  return (
    <View style={styles.list}>
      {industries.map((industry) => (
        <IndustryAccordion key={industry.id} industry={industry} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  accordion: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  industryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  twoColumn: {
    gap: 16,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  bulletList: {
    marginTop: 8,
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    marginTop: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748B',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: horizon.textSecondary,
  },
})
