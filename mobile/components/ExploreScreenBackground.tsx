import { horizon } from '@/theme/colors'
import { ReactNode } from 'react'
import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type ExploreScreenBackgroundProps = {
  children: ReactNode
  contentContainerStyle?: ScrollViewProps['contentContainerStyle']
}

export default function ExploreScreenBackground({
  children,
  contentContainerStyle,
}: ExploreScreenBackgroundProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: horizon.background },
  scroll: { flex: 1, backgroundColor: horizon.background },
  content: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 32 },
})
