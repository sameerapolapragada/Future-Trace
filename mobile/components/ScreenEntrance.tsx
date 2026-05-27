import { useEffect, type ReactNode } from 'react'
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { useScreenEntrance } from '../hooks/useScreenEntrance'

type ScreenEntranceProps = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  /** Re-run entrance when this value changes (e.g. milestone id). */
  replayKey?: string
  animateOnFocus?: boolean
}

export function ScreenEntrance({
  children,
  style,
  replayKey,
  animateOnFocus = true,
}: ScreenEntranceProps) {
  const { animatedStyle, runEntrance } = useScreenEntrance({
    animateOnFocus: replayKey ? false : animateOnFocus,
  })

  useEffect(() => {
    if (replayKey) {
      runEntrance()
    }
  }, [replayKey, runEntrance])

  return <Animated.View style={[styles.container, animatedStyle, style]}>{children}</Animated.View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
