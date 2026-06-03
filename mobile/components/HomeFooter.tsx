import { StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { horizon } from '../theme/colors'

export function HomeFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.tagline}>Future Trace — Career Intelligence for the AI Age.</Text>
      <Text style={styles.copyright}>© 2026 Future Trace. All rights reserved.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: horizon.borderMuted,
  },
  tagline: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  copyright: {
    marginTop: 8,
    fontSize: 12,
    color: horizon.textSecondary,
  },
})
