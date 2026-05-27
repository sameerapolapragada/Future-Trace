import { FontAwesome } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { colors } from '../theme/colors'

function SocialButton({
  label,
  icon,
  onPress,
  compact = false,
}: {
  label: string
  icon: ReactNode
  onPress: () => void
  compact?: boolean
}) {
  return (
    <Pressable style={[styles.socialButton, compact && styles.socialButtonCompact]} onPress={onPress}>
      <View style={styles.socialButtonContent}>
        {icon}
        <Text style={styles.socialButtonText}>{label}</Text>
      </View>
    </Pressable>
  )
}

export function SocialAuthRow({ compact = false }: { compact?: boolean }) {
  const showComingSoon = (provider: string) => {
    Alert.alert('Coming soon', `${provider} sign-in will be available after backend setup.`)
  }

  return (
    <>
      <View style={[styles.dividerRow, compact && styles.dividerRowCompact]}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <SocialButton
          label="Google"
          icon={<FontAwesome name="google" size={compact ? 18 : 21} color="#4285F4" />}
          onPress={() => showComingSoon('Google')}
          compact={compact}
        />
        <SocialButton
          label="Apple"
          icon={<FontAwesome name="apple" size={compact ? 20 : 23} color="#FFFFFF" />}
          onPress={() => showComingSoon('Apple')}
          compact={compact}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 28,
  },
  dividerRowCompact: {
    marginTop: 0,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 18,
    color: colors.dividerText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 0,
  },
  socialButton: {
    flex: 1,
    minHeight: 70,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  socialButtonCompact: {
    minHeight: 52,
    borderRadius: 14,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 14,
    color: '#E6E9EE',
    fontSize: 16,
    fontWeight: '700',
  },
})
