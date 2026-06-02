import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { usePathname, useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type NavItem = {
  label: string
  href: `/(explore)${string}`
  icon: keyof typeof Ionicons.glyphMap
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/(explore)', icon: 'home-outline' },
  {
    label: 'AI Evolution Timeline',
    href: '/(explore)/ai-evolution-timeline',
    icon: 'hardware-chip-outline',
  },
  {
    label: 'Industry Adoption Waves',
    href: '/(explore)/industry-adoption-waves',
    icon: 'layers-outline',
  },
  {
    label: 'Jobs Affected by AI Evolution',
    href: '/(explore)/jobs-affected-by-ai',
    icon: 'briefcase-outline',
  },
  {
    label: 'What Comes Next',
    href: '/(explore)/what-comes-next',
    icon: 'sparkles-outline',
  },
]

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <LinearGradient
      colors={[horizon.drawerGradientStart, horizon.drawerGradientEnd]}
      style={styles.gradient}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <Text style={styles.exploreLabel}>EXPLORE</Text>
        <Text style={styles.brandTitle}>Future Trace</Text>
        <Text style={styles.brandSubtitle}>Career Intelligence for the AI Age</Text>

        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/(explore)'
                ? pathname === '/' || pathname === '/(explore)' || pathname.endsWith('/index')
                : pathname.includes(item.href.replace('/(explore)', ''))

            return (
              <Pressable
                key={item.href}
                onPress={() => {
                  props.navigation.closeDrawer()
                  router.push(item.href)
                }}
                style={[styles.navItem, active && styles.navItemActive]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={horizon.drawerText}
                  style={styles.navIcon}
                />
                <Text style={styles.navLabel}>{item.label}</Text>
              </Pressable>
            )
          })}
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  exploreLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: horizon.drawerText,
    opacity: 0.85,
  },
  brandTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: horizon.drawerText,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: horizon.drawerText,
    opacity: 0.9,
  },
  nav: { marginTop: 28, gap: 8 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  navItemActive: { backgroundColor: 'rgba(15, 23, 42, 0.12)' },
  navIcon: { marginRight: 10, opacity: 0.85 },
  navLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: horizon.drawerText },
})
