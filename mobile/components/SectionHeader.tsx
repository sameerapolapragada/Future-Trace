import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { colors } from '../theme/colors'
import { type as appType } from '../theme/typography'

type SectionHeaderProps = {
  title: string
  actionLabel?: string
  onActionPress?: () => void
  rightElement?: ReactNode
}

export function SectionHeader({ title, actionLabel, onActionPress, rightElement }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {rightElement}
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    ...appType.bold,
    color: colors.sectionLabel,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  action: {
    ...appType.semibold,
    color: colors.muted,
    fontSize: 13,
  },
})
