import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { ScoreProvider } from '../context/ScoreContext'
import { useAppFonts } from '../hooks/useAppFonts'
import { installGlobalTypography } from '../lib/installGlobalTypography'

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts()

  useEffect(() => {
    if (fontsLoaded) {
      installGlobalTypography()
    }
  }, [fontsLoaded])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <AuthProvider>
      <ScoreProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 320,
          }}
        />
      </ScoreProvider>
    </AuthProvider>
  )
}
