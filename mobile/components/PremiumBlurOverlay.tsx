import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

type PremiumBlurOverlayProps = {
  style?: StyleProp<ViewStyle>
}

/**
 * Frosted-glass style overlay without expo-blur native views.
 * Avoids ExpoBlurView crashes when the dev client was not rebuilt after adding expo-blur
 * or when running under New Architecture without the native module linked.
 */
export function PremiumBlurOverlay({ style }: PremiumBlurOverlayProps) {
  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <View style={styles.layerBase} />
      <View style={styles.layerSheen} />
      <View style={styles.layerNoise} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  layerBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.82)',
  },
  layerSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  layerNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
})
