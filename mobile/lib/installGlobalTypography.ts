import React from 'react'
import { Text, TextInput } from 'react-native'
import { withAppFont } from '../theme/typography'

type Patched = { __appFontPatched?: boolean; render?: (props: unknown, ref: unknown) => React.ReactNode }

function patchTextComponent(Component: Patched & typeof Text) {
  if (Component.__appFontPatched) {
    return
  }

  const originalRender = Component.render
  if (typeof originalRender !== 'function') {
    return
  }

  Component.render = function render(props: { style?: unknown }, ref: unknown) {
    return originalRender.call(this, { ...props, style: withAppFont(props.style as never) }, ref)
  }
  Component.__appFontPatched = true
}

export function installGlobalTypography() {
  patchTextComponent(Text as Patched & typeof Text)
  patchTextComponent(TextInput as Patched & typeof TextInput)
}
