import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { PrimaryButton } from './PrimaryButton'
import { trustChallengeBullets } from '../data/whatComesNext'
import { horizon } from '../theme/colors'

export function HomeWhatComesNextHighlights() {
  const router = useRouter()

  return (
    <View style={styles.challengeCard}>
      <Ionicons name="shield-outline" size={32} color={horizon.accent} />
      <Text style={styles.challengeTitle}>
        The Next Challenge is Making Smarter AI, Not Just Trustworthy AI
      </Text>
      <Text style={styles.challengeSubtitle}>
        Building systems capable of reasoning, learning autonomously, and acting with sound
        judgment beyond human supervision.
      </Text>
      <View style={styles.bulletList}>
        {trustChallengeBullets.map((bullet) => (
          <View key={bullet} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        label="Learn More"
        onPress={() => router.push('/(explore)/blog')}
        compact
        style={styles.learnMoreButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  challengeCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 20,
  },
  challengeTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: horizon.textPrimary,
  },
  challengeSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  bulletList: {
    marginTop: 16,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    marginTop: 7,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: horizon.highlight,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  learnMoreButton: {
    marginTop: 20,
  },
})
