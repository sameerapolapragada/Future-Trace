import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native'

type BrandLogoProps = {
  size?: number
  style?: StyleProp<ImageStyle>
}

export default function BrandLogo({ size = 96, style }: BrandLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={require('../assets/future-trace-logo.png')}
        style={[{ width: size, height: size }, style]}
        resizeMode="contain"
        accessibilityLabel="Future Trace logo"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
