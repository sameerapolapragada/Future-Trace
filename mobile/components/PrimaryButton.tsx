import { horizon } from '@/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { Text } from './AppText'

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  compact?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  compact = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[
        styles.wrapper,
        fullWidth && styles.fullWidth,
        compact ? styles.wrapperCompact : styles.wrapperDefault,
        style,
        (loading || disabled) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <LinearGradient
        colors={[...horizon.buttonGradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradient, compact ? styles.gradientCompact : styles.gradientDefault]}
      >
        {loading ? (
          <ActivityIndicator color={horizon.buttonText} />
        ) : (
          <View style={styles.content}>
            {leftIcon}
            <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={2}>
              {label}
            </Text>
            {rightIcon}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  wrapperDefault: {
    borderRadius: 12,
  },
  wrapperCompact: {
    borderRadius: 10,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.65,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientDefault: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  gradientCompact: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    color: horizon.buttonText,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  textCompact: {
    fontSize: 14,
    fontWeight: '600',
  },
})
