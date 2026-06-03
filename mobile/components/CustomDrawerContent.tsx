import { ExploreMenuPanel } from '@/components/ExploreMenuPanel'
import { horizon } from '@/theme/colors'
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <LinearGradient
      colors={[horizon.drawerGradientStart, horizon.drawerGradientEnd]}
      style={styles.gradient}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <ExploreMenuPanel onClose={() => props.navigation.closeDrawer()} />
      </DrawerContentScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: {
    flexGrow: 1,
  },
})
