import { EXPLORE_NAV_ITEMS } from '@/data/exploreNav'
import { useAuth } from '@/context/AuthContext'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type ExploreMenuPanelProps = {
  onClose: () => void
}

export function ExploreMenuPanel({ onClose }: ExploreMenuPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isGuest = user?.email.endsWith('@futuretrace.local') ?? true
  const isSignedIn = Boolean(user && !isGuest)

  const handleAuthPress = () => {
    onClose()
    if (isSignedIn) {
      signOut()
      router.replace('/(explore)/')
      return
    }
    router.push('/sign-in')
  }

  return (
    <View style={styles.content}>
      <Text style={styles.exploreLabel}>EXPLORE</Text>
      <Text style={styles.brandTitle}>Future Trace</Text>
      <Text style={styles.brandSubtitle}>Career Intelligence for the AI Age</Text>

      <View style={styles.nav}>
        {EXPLORE_NAV_ITEMS.map((item) => {
          const active =
            item.href === '/(explore)'
              ? pathname === '/' || pathname === '/(explore)' || pathname.endsWith('/index')
              : pathname.includes(item.href.replace('/(explore)', ''))

          return (
            <Pressable
              key={item.href}
              onPress={() => {
                onClose()
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

      <View style={styles.authDivider} />

      <Pressable onPress={handleAuthPress} style={styles.navItem}>
        <Ionicons
          name={isSignedIn ? 'log-out-outline' : 'log-in-outline'}
          size={18}
          color={horizon.drawerText}
          style={styles.navIcon}
        />
        <Text style={styles.navLabel}>{isSignedIn ? 'Sign out' : 'Sign in'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
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
  authDivider: {
    height: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    marginTop: 20,
    marginBottom: 12,
  },
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
