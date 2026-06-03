import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native'
import { Text } from './AppText'
import { PrimaryButton } from './PrimaryButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'

function profileAvatarInitials(fullName: string, email: string) {
  const trimmed = fullName.trim()
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return trimmed.slice(0, 2).toUpperCase()
  }
  return (email[0] ?? '?').toUpperCase()
}

function formatMemberSince(iso: string | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function formatLastScan(iso: string | null | undefined) {
  if (!iso) return 'Never'
  const date = new Date(iso)
  const today = new Date()
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today'
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
}) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={horizon.accent} />
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}

function PreferenceRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  value: boolean
  onValueChange: (next: boolean) => void
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceLeft}>
        <Ionicons name={icon} size={16} color={horizon.textSecondary} style={styles.preferenceIcon} />
        <View style={styles.preferenceText}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          <Text style={styles.preferenceSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#334155', true: horizon.accent }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#334155"
      />
    </View>
  )
}

function ActionRow({
  icon,
  iconColor,
  title,
  subtitle,
  titleColor,
  backgroundColor,
  borderColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  title: string
  subtitle: string
  titleColor?: string
  backgroundColor?: string
  borderColor?: string
  onPress: () => void
}) {
  return (
    <Pressable
      style={[
        styles.actionRow,
        backgroundColor ? { backgroundColor } : null,
        borderColor ? { borderColor } : null,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <View style={styles.actionRowText}>
        <Text style={[styles.actionRowTitle, titleColor ? { color: titleColor } : null]}>{title}</Text>
        <Text style={[styles.actionRowSubtitle, titleColor ? { color: `${titleColor}B3` } : null]}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={titleColor ?? horizon.textSecondary} />
    </Pressable>
  )
}

export function ProfileSettingsScreen() {
  const router = useRouter()
  const { user, signOut, updateProfileSettings } = useAuth()

  const [fullName, setFullName] = useState(user?.displayName ?? '')
  const [currentRole, setCurrentRole] = useState(user?.currentRole ?? '')
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications ?? true)
  const [weeklyReports, setWeeklyReports] = useState(user?.weeklyReports ?? false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    setFullName(user.displayName ?? '')
    setCurrentRole(user.currentRole ?? '')
    setEmailNotifications(user.emailNotifications)
    setWeeklyReports(user.weeklyReports)
  }, [user])

  if (!user) {
    return null
  }

  const isPremium = user.plan === 'pro'
  const emailDisplay = user.email

  const handleSave = async () => {
    try {
      setSaving(true)
      setSuccess(false)
      await updateProfileSettings({
        displayName: fullName,
        currentRole,
        emailNotifications,
        weeklyReports,
      })
      setSuccess(true)
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    Alert.alert(
      'Export My Data',
      'Your data export will be prepared and sent to your email address when this feature is connected.'
    )
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete My Account',
      'This will permanently remove your profile and associated records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            signOut()
            router.replace('/sign-in')
          },
        },
      ]
    )
  }

  const handleSignOut = () => {
    signOut()
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>Profile Settings</Text>
          <Text style={styles.screenSubtitle}>Manage your account settings and preferences</Text>

          {success ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>Profile updated successfully.</Text>
            </View>
          ) : null}

          <View style={styles.profileCard}>
            <LinearGradient
              colors={[horizon.drawerGradientStart, horizon.drawerGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profileAvatarInitials(fullName || user.displayName || '', user.email)}
              </Text>
            </LinearGradient>

            <Text style={styles.profileName}>{fullName || user.displayName}</Text>
            <Text style={styles.profileEmail}>{emailDisplay}</Text>

            <View style={styles.accountBadge}>
              <Ionicons name="shield-checkmark" size={14} color={horizon.accent} />
              <Text style={styles.accountBadgeText}>
                {isPremium ? 'Premium Account' : 'Free Account'}
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Scans this month</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Member since</Text>
              <Text style={styles.statValue}>{formatMemberSince(user.memberSince)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Last scan</Text>
              <Text style={styles.statValue}>{formatLastScan(user.lastScanAt)}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="person-outline"
              title="Personal Information"
              subtitle="Update your personal details"
            />

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor="#64748B"
                autoCapitalize="words"
                autoCorrect={false}
                style={styles.fieldInput}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.readonlyInputWrap}>
                <TextInput
                  value={emailDisplay}
                  editable={false}
                  style={[styles.fieldInput, styles.readonlyInput]}
                />
                <Ionicons name="lock-closed-outline" size={16} color="#64748B" style={styles.lockIcon} />
              </View>
              <Text style={styles.fieldHint}>Email cannot be changed</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Current Role</Text>
              <TextInput
                value={currentRole}
                onChangeText={setCurrentRole}
                placeholder="e.g. Product Manager"
                placeholderTextColor="#64748B"
                autoCapitalize="words"
                style={styles.fieldInput}
              />
            </View>

            <PrimaryButton
              label="Save Changes"
              onPress={() => void handleSave()}
              loading={saving}
              disabled={!fullName.trim()}
              style={styles.saveButton}
            />
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="settings-outline"
              title="Preferences"
              subtitle="Customize your experience"
            />

            <PreferenceRow
              icon="notifications-outline"
              title="Email Notifications"
              subtitle="Receive updates about your scans"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
            <PreferenceRow
              icon="mail-outline"
              title="Weekly Reports"
              subtitle="Get weekly career insights"
              value={weeklyReports}
              onValueChange={setWeeklyReports}
            />
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="shield-checkmark-outline"
              title="Data Privacy & Portability"
              subtitle="GDPR / CCPA Compliant"
            />

            <Text style={styles.privacyBody}>
              Export a portable copy of your personal data, or permanently delete your account and
              associated records from our systems.
            </Text>

            <View style={styles.actionList}>
              <ActionRow
                icon="download-outline"
                iconColor={horizon.accent}
                title="Export My Data"
                subtitle="Download all your PII records"
                onPress={handleExport}
              />
              <ActionRow
                icon="trash-outline"
                iconColor="#F87171"
                title="Delete My Account"
                subtitle="Permanently remove your profile"
                titleColor="#F87171"
                backgroundColor="rgba(248, 113, 113, 0.08)"
                borderColor="rgba(248, 113, 113, 0.25)"
                onPress={handleDelete}
              />
            </View>
          </View>

          <View style={styles.signOutCard}>
            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={18} color={horizon.textPrimary} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: horizon.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: horizon.textPrimary,
  },
  screenSubtitle: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
    color: horizon.textSecondary,
  },
  successBanner: {
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 187, 45, 0.3)',
    backgroundColor: horizon.accentMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successText: {
    fontSize: 14,
    color: horizon.accent,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 14,
    color: horizon.textSecondary,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.accentMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  accountBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: horizon.accent,
  },
  statsDivider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: horizon.borderMuted,
    marginTop: 20,
    marginBottom: 4,
  },
  statRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: horizon.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '500',
    color: horizon.textPrimary,
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: horizon.textPrimary,
  },
  readonlyInputWrap: {
    position: 'relative',
  },
  readonlyInput: {
    paddingRight: 40,
    opacity: 0.85,
  },
  lockIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  fieldHint: {
    marginTop: 6,
    fontSize: 11,
    color: '#64748B',
  },
  saveButton: {},
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  preferenceLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  preferenceIcon: {
    marginTop: 2,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: horizon.textPrimary,
  },
  preferenceSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  privacyBody: {
    fontSize: 12,
    lineHeight: 18,
    color: horizon.textSecondary,
  },
  actionList: {
    marginTop: 16,
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionRowText: {
    flex: 1,
  },
  actionRowTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: horizon.textPrimary,
  },
  actionRowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  signOutCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
})
