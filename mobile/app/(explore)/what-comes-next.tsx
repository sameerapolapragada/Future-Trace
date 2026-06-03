import ExplorePageHeader from '@/components/ExplorePageHeader'
import WhatComesNextContent from '@/components/WhatComesNextContent'
import ExploreScreenBackground from '@/components/ExploreScreenBackground'
import { horizon } from '@/theme/colors'
import { StyleSheet, Text } from 'react-native'

export default function WhatComesNextScreen() {
  return (
    <ExploreScreenBackground contentContainerStyle={styles.scrollContent}>
      <ExplorePageHeader />

      <Text style={styles.title}>What Comes Next?</Text>
      <Text style={styles.subtitle}>
        Overview of the next steps in AI evolution and the challenges ahead
      </Text>

      <WhatComesNextContent />
    </ExploreScreenBackground>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: horizon.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
})
