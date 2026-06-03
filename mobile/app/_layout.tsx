import 'react-native-gesture-handler'
import 'react-native-reanimated'
import '../global.css'

import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LOGO_SOURCE } from '../assets/images'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { AuthProvider } from '../context/AuthContext'
import { ExploreMenuProvider } from '../context/ExploreMenuContext'
import { Asset } from 'expo-asset'
import { ScoreProvider } from '../context/ScoreContext'
import { useAppFonts } from '../hooks/useAppFonts'
import { installGlobalTypography } from '../lib/installGlobalTypography'

SplashScreen.preventAutoHideAsync().catch(() => undefined)

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts()

  useEffect(() => {
    Asset.fromModule(LOGO_SOURCE).downloadAsync().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (fontsLoaded) {
        try {
          installGlobalTypography()
        } catch (e) {
          console.warn('installGlobalTypography skipped', e)
        }
      }
      SplashScreen.hideAsync().catch(() => undefined)
    }
  }, [fontsLoaded, fontError])

  const ready = fontsLoaded || fontError

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FDBB2D" />
      </View>
    )
  }

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <ExploreMenuProvider>
              <ScoreProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    animationDuration: 320,
                  }}
                />
              </ScoreProvider>
            </ExploreMenuProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AppErrorBoundary>
  )
}
