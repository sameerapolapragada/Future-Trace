import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme/colors'
import type { ReactNode } from 'react'
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native'

export function ScreenBackground({
  children,
  style,
  gradientColors = colors.backgroundGradient,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  gradientColors?: readonly [string, string, ...string[]]
}) {
  return (
    <LinearGradient
      colors={[...gradientColors]}
      start={{ x: 0.12, y: 0 }}
      end={{ x: 0.88, y: 1 }}
      style={[styles.screen, style]}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})
