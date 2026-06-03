import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useRef } from 'react'
import { Animated, Easing, Image, Pressable, StyleSheet } from 'react-native'
import { LOGO_SOURCE, logoHeightForWidth } from '../assets/images'

const LOGO_DISPLAY_WIDTH = 200

const SPRING_APPROACH = { friction: 7, tension: 42, useNativeDriver: true as const }
const SPRING_SETTLE = { friction: 8, tension: 50, useNativeDriver: true as const }
const APPROACH_MS = 880

export function AuthLogoEntrance() {
  const router = useRouter()
  const scale = useRef(new Animated.Value(0.12)).current
  const translateX = useRef(new Animated.Value(140)).current
  const translateY = useRef(new Animated.Value(-72)).current
  const rotate = useRef(new Animated.Value(0.22)).current

  const runEntrance = useCallback(() => {
    scale.setValue(0.12)
    translateX.setValue(140)
    translateY.setValue(-72)
    rotate.setValue(0.22)

    Animated.sequence([
      Animated.delay(160),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.08, ...SPRING_APPROACH }),
        Animated.timing(translateX, {
          toValue: -6,
          duration: APPROACH_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 4,
          duration: APPROACH_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: -0.04,
          duration: APPROACH_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, ...SPRING_SETTLE }),
        Animated.spring(translateX, { toValue: 0, ...SPRING_SETTLE }),
        Animated.spring(translateY, { toValue: 0, ...SPRING_SETTLE }),
        Animated.spring(rotate, { toValue: 0, ...SPRING_SETTLE }),
      ]),
    ]).start()
  }, [rotate, scale, translateX, translateY])

  useFocusEffect(
    useCallback(() => {
      runEntrance()
    }, [runEntrance])
  )

  const rotateDeg = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-42deg', '42deg'],
  })

  return (
    <Pressable
      onPress={() => router.replace('/(explore)/')}
      accessibilityRole="button"
      accessibilityLabel="Go to home"
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.wrap,
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
              { rotate: rotateDeg },
            ],
          },
        ]}
      >
        <Image
          source={LOGO_SOURCE}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Future Trace logo"
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_DISPLAY_WIDTH,
    height: logoHeightForWidth(LOGO_DISPLAY_WIDTH),
    backgroundColor: 'transparent',
  },
})
