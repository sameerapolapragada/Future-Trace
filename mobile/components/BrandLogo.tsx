import { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Asset } from 'expo-asset'

/** Canonical bundled logo — also copied to future-trace-logo.png for legacy imports. */
const logoModule = require('../assets/brand-logo.png')

const LOGO_WIDTH = 510
const LOGO_HEIGHT = 274

type BrandLogoProps = {
  width?: number
}

export default function BrandLogo({ width = 112 }: BrandLogoProps) {
  const height = Math.round((width * LOGO_HEIGHT) / LOGO_WIDTH)
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Asset.fromModule(logoModule)
      .downloadAsync()
      .then((asset) => {
        if (!cancelled) setUri(asset.localUri ?? asset.uri)
      })
      .catch(() => {
        if (!cancelled) setUri(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <View style={[styles.wrap, { width, height }]} collapsable={false}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width, height }}
          resizeMode="contain"
          fadeDuration={0}
          accessible
          accessibilityLabel="Future Trace logo"
        />
      ) : (
        <Image
          source={logoModule}
          style={{ width, height }}
          resizeMode="contain"
          fadeDuration={0}
          accessible
          accessibilityLabel="Future Trace logo"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
})
