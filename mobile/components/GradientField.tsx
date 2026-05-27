import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme/colors'
import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from './AppText'

type GradientFieldProps = {
  label: string
  placeholder: string
  value: string
  onChangeText: (value: string) => void
  secureTextEntry?: boolean
  rightAccessory?: ReactNode
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  compact?: boolean
}

export function GradientField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightAccessory,
  autoCapitalize = 'none',
  compact = false,
}: GradientFieldProps) {
  return (
    <View style={[styles.fieldBlock, compact && styles.fieldBlockCompact]}>
      <Text style={[styles.fieldLabel, compact && styles.fieldLabelCompact]}>{label}</Text>
      <LinearGradient
        colors={[...colors.inputGradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.inputShell, compact && styles.inputShellCompact]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={[styles.input, compact && styles.inputCompact]}
        />
        {rightAccessory ? <View style={styles.inputAccessory}>{rightAccessory}</View> : null}
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 24,
  },
  fieldBlockCompact: {
    marginBottom: 18,
  },
  fieldLabel: {
    marginBottom: 14,
    color: colors.label,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  fieldLabelCompact: {
    marginBottom: 8,
    fontSize: 12,
    letterSpacing: 1.1,
  },
  inputShell: {
    minHeight: 78,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  inputShellCompact: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: colors.inputText,
    fontSize: 17,
    fontWeight: '600',
    paddingVertical: 22,
  },
  inputCompact: {
    fontSize: 16,
    paddingVertical: 14,
  },
  inputAccessory: {
    paddingLeft: 14,
  },
})
