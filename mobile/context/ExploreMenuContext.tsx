import { ExploreMenuPanel } from '@/components/ExploreMenuPanel'
import { horizon } from '@/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ExploreMenuContextValue = {
  openMenu: () => void
  closeMenu: () => void
}

const ExploreMenuContext = createContext<ExploreMenuContextValue | null>(null)

export function ExploreMenuProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const insets = useSafeAreaInsets()

  const openMenu = useCallback(() => setVisible(true), [])
  const closeMenu = useCallback(() => setVisible(false), [])

  const value = useMemo(() => ({ openMenu, closeMenu }), [openMenu, closeMenu])

  return (
    <ExploreMenuContext.Provider value={value}>
      {children}
      <Modal visible={visible} animationType="slide" transparent onRequestClose={closeMenu}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeMenu} accessibilityLabel="Close menu" />
          <LinearGradient
            colors={[horizon.drawerGradientStart, horizon.drawerGradientEnd]}
            style={[styles.panel, { paddingTop: insets.top }]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <ExploreMenuPanel onClose={closeMenu} />
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </ExploreMenuContext.Provider>
  )
}

export function useExploreMenu() {
  const context = useContext(ExploreMenuContext)
  if (!context) {
    throw new Error('useExploreMenu must be used within ExploreMenuProvider')
  }
  return context
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  panel: {
    width: 300,
    maxWidth: '85%',
  },
})
