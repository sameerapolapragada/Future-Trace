import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { trustChallengeBullets, whatComesNextItems } from '@/data/whatComesNext'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text, View } from 'react-native'

function tagLabel(tag?: string): string {
  switch (tag) {
    case 'now':
      return 'Now'
    case 'emerging':
      return 'Emerging'
    case 'critical':
      return 'Critical'
    default:
      return ''
  }
}

export default function WhatComesNextScreen() {
  return (
    <ExploreScreenBackground>
      <Text style={styles.intro}>
        The next wave of AI capabilities—and the trust challenges professionals must master.
      </Text>
      {whatComesNextItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.tag ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tagLabel(item.tag)}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      ))}
      <View style={styles.trustCard}>
        <Text style={styles.trustLabel}>NEXT CHALLENGE</Text>
        <Text style={styles.trustTitle}>Understand Your Career Trajectory</Text>
        {trustChallengeBullets.map((bullet) => (
          <Text key={bullet} style={styles.bullet}>
            • {bullet}
          </Text>
        ))}
      </View>
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  intro: { fontSize: 15, lineHeight: 22, color: horizon.textSecondary, marginBottom: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: horizon.textPrimary },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: horizon.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: horizon.accentMuted,
  },
  tagText: { fontSize: 10, fontWeight: '600', color: horizon.accent },
  desc: { fontSize: 12, lineHeight: 18, color: horizon.textSecondary },
  trustCard: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 14,
  },
  trustLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: horizon.accent,
  },
  trustTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  bullet: { marginBottom: 4, fontSize: 12, color: horizon.textSecondary },
})
