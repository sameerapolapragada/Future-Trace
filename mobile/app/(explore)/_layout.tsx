import CustomDrawerContent from '@/components/CustomDrawerContent'
import ExploreMenuButton from '@/components/ExploreMenuButton'
import { usePreloadLogo } from '@/hooks/usePreloadLogo'
import { horizon } from '@/theme/colors'
import { Drawer } from 'expo-router/drawer'

export default function ExploreLayout() {
  usePreloadLogo()

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'front',
        swipeEnabled: true,
        headerStyle: { backgroundColor: horizon.background },
        headerTintColor: horizon.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        drawerStyle: { width: 300 },
        drawerActiveTintColor: horizon.drawerText,
        drawerInactiveTintColor: horizon.drawerText,
        headerRight: () => <ExploreMenuButton variant="header" />,
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Future Trace', headerShown: false }} />
      <Drawer.Screen
        name="ai-evolution-timeline"
        options={{ title: 'AI Evolution Timeline', headerShown: false }}
      />
      <Drawer.Screen
        name="interactive-timeline"
        options={{ title: 'Interactive Timeline', headerShown: false }}
      />
      <Drawer.Screen
        name="industry-adoption-waves"
        options={{ title: 'Industry Adoption Waves', headerShown: false }}
      />
      <Drawer.Screen
        name="industry-analysis"
        options={{ title: 'Industry Analysis', headerShown: false }}
      />
      <Drawer.Screen
        name="jobs-affected-by-ai"
        options={{ title: 'Jobs Affected by AI', headerShown: false }}
      />
      <Drawer.Screen
        name="career-analyses"
        options={{ title: 'Career Analyses', headerShown: false }}
      />
      <Drawer.Screen
        name="what-comes-next"
        options={{ title: 'What Comes Next', headerShown: false }}
      />
      <Drawer.Screen name="blog/index" options={{ title: 'Blog', headerShown: false }} />
      <Drawer.Screen name="blog/[slug]" options={{ title: 'Article', headerShown: false }} />
    </Drawer>
  )
}
