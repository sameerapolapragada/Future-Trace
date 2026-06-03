import { Asset } from 'expo-asset'
import { useEffect, useState } from 'react'
import { LOGO_SOURCE } from '../assets/images'

let preloadPromise: Promise<void> | null = null

function preloadLogoOnce() {
  if (!preloadPromise) {
    preloadPromise = Asset.fromModule(LOGO_SOURCE)
      .downloadAsync()
      .then(() => undefined)
      .catch(() => {
        preloadPromise = null
      })
  }
  return preloadPromise
}

/** Ensures logo bytes are cached before paint (fixes Expo Go reload on Android). */
export function usePreloadLogo() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    preloadLogoOnce().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
