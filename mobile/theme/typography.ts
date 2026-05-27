import { Platform, StyleSheet, type TextStyle } from 'react-native'

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const

const WEB_FONT_STACK = 'Plus Jakarta Sans'

export function resolveFontFamily(style?: TextStyle | TextStyle[] | null): string {
  if (Platform.OS === 'web') {
    return WEB_FONT_STACK
  }

  const flat = StyleSheet.flatten(style)
  const weight = flat?.fontWeight

  if (
    weight === 'bold' ||
    weight === '700' ||
    weight === '800' ||
    weight === '900' ||
    weight === 700 ||
    weight === 800 ||
    weight === 900
  ) {
    return fonts.bold
  }

  if (weight === '600' || weight === 600) {
    return fonts.semibold
  }

  if (weight === '500' || weight === 500) {
    return fonts.medium
  }

  return fonts.regular
}

/** Apply app fonts; keeps iOS/Android on custom files instead of system faux-bold. */
export function withAppFont(style?: TextStyle | TextStyle[] | null): TextStyle | TextStyle[] {
  if (Platform.OS === 'web') {
    return StyleSheet.flatten([style, { fontFamily: WEB_FONT_STACK }]) ?? { fontFamily: WEB_FONT_STACK }
  }

  const family = resolveFontFamily(style)
  const flat = StyleSheet.flatten(style) ?? {}

  return {
    ...flat,
    fontFamily: family,
    fontWeight: 'normal',
  }
}

export const appFontFamily = Platform.select({
  web: WEB_FONT_STACK,
  default: fonts.regular,
})!

export const type = {
  regular: { fontFamily: appFontFamily, fontWeight: 'normal' as const },
  medium: {
    fontFamily: Platform.OS === 'web' ? WEB_FONT_STACK : fonts.medium,
    fontWeight: 'normal' as const,
  },
  semibold: {
    fontFamily: Platform.OS === 'web' ? WEB_FONT_STACK : fonts.semibold,
    fontWeight: 'normal' as const,
  },
  bold: {
    fontFamily: Platform.OS === 'web' ? WEB_FONT_STACK : fonts.bold,
    fontWeight: 'normal' as const,
  },
}
