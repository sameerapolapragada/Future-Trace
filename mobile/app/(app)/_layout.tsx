import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

export default function AppLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Redirect href="/sign-in" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="milestone/[id]"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          animationDuration: 320,
        }}
      />
    </Stack>
  )
}
