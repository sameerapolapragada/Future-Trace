import { useExploreMenu } from '@/context/ExploreMenuContext'
import { useDrawerNavigation } from '@/hooks/useDrawerNavigation'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text } from 'react-native'

type ExploreMenuButtonProps = {
  /** Extra padding when rendered in the stack/drawer header */
  variant?: 'inline' | 'header'
}

export default function ExploreMenuButton({ variant = 'inline' }: ExploreMenuButtonProps) {
  const { drawerNav, openDrawer } = useDrawerNavigation()
  const { openMenu } = useExploreMenu()

  const handlePress = () => {
    if (drawerNav) {
      openDrawer()
      return
    }
    openMenu()
  }

  return (
    <Pressable
      style={[styles.btn, variant === 'header' && styles.btnHeader]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Open explore menu"
    >
      <LinearGradient
        colors={[...horizon.buttonGradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>Explore</Text>
        <Ionicons name="menu" size={16} color={horizon.buttonText} />
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    flexShrink: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  btnHeader: {
    marginRight: 12,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: horizon.buttonText,
  },
})
