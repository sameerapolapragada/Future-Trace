import CustomDrawerContent from '@/components/CustomDrawerContent'
import { horizon } from '@/theme/colors'
import { Drawer } from 'expo-router/drawer'

export default function ExploreLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: horizon.background },
        headerTintColor: horizon.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        drawerStyle: { width: 300 },
        drawerActiveTintColor: horizon.drawerText,
        drawerInactiveTintColor: horizon.drawerText,
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Future Trace' }} />
      <Drawer.Screen name="ai-evolution-timeline" options={{ title: 'AI Evolution Timeline' }} />
      <Drawer.Screen
        name="industry-adoption-waves"
        options={{ title: 'Industry Adoption Waves' }}
      />
      <Drawer.Screen name="jobs-affected-by-ai" options={{ title: 'Jobs Affected by AI' }} />
      <Drawer.Screen name="what-comes-next" options={{ title: 'What Comes Next' }} />
    </Drawer>
  )
}
