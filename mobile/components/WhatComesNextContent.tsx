import { HomeWhatComesNextHighlights } from '@/components/HomeWhatComesNextHighlights'
import {
  whatComesNextItems,
  type WhatComesNextItem,
  type WhatComesNextTag,
} from '@/data/whatComesNext'
import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

function tagStyles(tag: WhatComesNextTag) {
  switch (tag) {
    case 'now':
      return {
        border: 'rgba(34, 211, 238, 0.4)',
        background: 'rgba(8, 51, 68, 0.4)',
        text: '#22D3EE',
      }
    case 'emerging':
      return {
        border: 'rgba(56, 189, 248, 0.4)',
        background: horizon.accentMuted,
        text: horizon.accent,
      }
    case 'critical':
      return {
        border: 'rgba(249, 115, 22, 0.4)',
        background: 'rgba(67, 20, 7, 0.4)',
        text: '#FB923C',
      }
  }
}

function tagLabel(tag: WhatComesNextTag) {
  switch (tag) {
    case 'now':
      return 'Now'
    case 'emerging':
      return 'Emerging'
    case 'critical':
      return 'Critical'
  }
}

function getItemIcon(type: WhatComesNextItem['icon']): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'copilot':
      return 'people-outline'
    case 'agent':
      return 'hardware-chip-outline'
    case 'multi-agent':
      return 'link-outline'
    case 'workflow':
      return 'cog-outline'
    case 'governance':
      return 'scale-outline'
    case 'traceability':
      return 'search-outline'
    case 'human-loop':
      return 'person-circle-outline'
    default:
      return 'hardware-chip-outline'
  }
}

function WhatComesNextRow({ item }: { item: WhatComesNextItem }) {
  const tagStyle = item.tag ? tagStyles(item.tag) : null

  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Ionicons name={getItemIcon(item.icon)} size={16} color={horizon.accent} />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.titleRow}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {item.tag && tagStyle ? (
            <View
              style={[
                styles.tag,
                { borderColor: tagStyle.border, backgroundColor: tagStyle.background },
              ]}
            >
              <Text style={[styles.tagText, { color: tagStyle.text }]}>{tagLabel(item.tag)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.rowDescription}>{item.description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#64748B" style={styles.chevron} />
    </View>
  )
}

export default function WhatComesNextContent() {
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {whatComesNextItems.map((item) => (
          <WhatComesNextRow key={item.id} item={item} />
        ))}
      </View>

      <HomeWhatComesNextHighlights />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  iconBox: {
    marginTop: 2,
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  rowDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: horizon.textSecondary,
  },
  chevron: {
    marginTop: 4,
  },
})
