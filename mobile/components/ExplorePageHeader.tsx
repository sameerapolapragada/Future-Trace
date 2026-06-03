import BrandLogo from '@/components/BrandLogo'
import ExploreMenuButton from '@/components/ExploreMenuButton'
import { StyleSheet, View } from 'react-native'

export default function ExplorePageHeader() {
  return (
    <View style={styles.headerTop}>
      <BrandLogo width={112} />
      <ExploreMenuButton />
    </View>
  )
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
})
