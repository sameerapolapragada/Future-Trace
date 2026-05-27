import { useFocusEffect } from 'expo-router'
import { useCallback, useRef } from 'react'
import { Animated, type ViewStyle } from 'react-native'

type UseScreenEntranceOptions = {
  slideDistance?: number
  animateOnFocus?: boolean
}

export function useScreenEntrance({
  slideDistance = 28,
  animateOnFocus = true,
}: UseScreenEntranceOptions = {}) {
  const translateY = useRef(new Animated.Value(slideDistance)).current
  const scale = useRef(new Animated.Value(0.96)).current

  const runEntrance = useCallback(() => {
    translateY.setValue(slideDistance)
    scale.setValue(0.96)

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }),
    ]).start()
  }, [slideDistance, scale, translateY])

  useFocusEffect(
    useCallback(() => {
      if (animateOnFocus) {
        runEntrance()
      }
    }, [animateOnFocus, runEntrance])
  )

  const animatedStyle: Animated.WithAnimatedValue<ViewStyle> = {
    transform: [{ translateY }, { scale }],
  }

  return { animatedStyle, runEntrance }
}
