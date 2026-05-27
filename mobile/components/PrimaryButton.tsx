import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme/colors'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import { Text } from './AppText'

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  compact?: boolean
}

export function PrimaryButton({ label, onPress, loading, disabled, compact = false }: PrimaryButtonProps) {
  return (
    <Pressable
      style={[styles.primaryButton, compact && styles.primaryButtonCompact, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <LinearGradient
        colors={[...colors.primaryGradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.primaryButtonGradient, compact && styles.primaryButtonGradientCompact]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.primaryButtonText, compact && styles.primaryButtonTextCompact]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: 22,
    shadowColor: '#18BEE6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryButtonCompact: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  disabled: {
    opacity: 0.7,
  },
  primaryButtonGradient: {
    minHeight: 74,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonGradientCompact: {
    minHeight: 52,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButtonTextCompact: {
    fontSize: 16,
  },
})
