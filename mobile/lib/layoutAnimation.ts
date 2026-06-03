import { Platform, UIManager } from 'react-native'

/** Enable LayoutAnimation on legacy Android only (no-op + warns on New Architecture). */
export function enableAndroidLayoutAnimation() {
  if (Platform.OS !== 'android') return

  // New Architecture exposes nativeFabricUIManager; legacy API is a no-op there.
  const isNewArchitecture = Boolean(
    (global as typeof global & { nativeFabricUIManager?: unknown }).nativeFabricUIManager
  )
  if (isNewArchitecture) return

  const setExperimental = (
    UIManager as typeof UIManager & {
      setLayoutAnimationEnabledExperimental?: (enabled: boolean) => void
    }
  ).setLayoutAnimationEnabledExperimental

  setExperimental?.(true)
}
