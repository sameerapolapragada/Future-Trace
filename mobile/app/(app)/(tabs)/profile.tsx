import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text, TextInput } from '../../../components/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScreenEntrance } from '../../../components/ScreenEntrance'
import { ScreenBackground } from '../../../components/ScreenBackground'
import { useAuth } from '../../../context/AuthContext'
import { getPlan } from '../../../data/plans'
import { colors } from '../../../theme/colors'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
}

function ProfileRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowValue}>{children}</View>
    </View>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut, updateDisplayName } = useAuth()
  const plan = getPlan(user?.plan ?? 'free')

  const [nameDraft, setNameDraft] = useState(user?.displayName ?? '')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)

  useEffect(() => {
    setNameDraft(user?.displayName ?? '')
    setIsEditingName(false)
  }, [user?.displayName])

  const isGuest = user?.email.endsWith('@futuretrace.local') ?? false

  const emailDisplay = useMemo(() => {
    if (!user?.email) return ''
    if (isGuest) return 'Not linked — sign in to add your email'
    return user.email
  }, [user?.email, isGuest])

  const handleSaveName = async () => {
    try {
      setIsSavingName(true)
      await updateDisplayName(nameDraft)
      setIsEditingName(false)
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setIsSavingName(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    router.replace('/sign-in')
  }

  if (!user) {
    return null
  }

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenEntrance>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.screenTitle}>Profile</Text>
            <Text style={styles.screenSubtitle}>Account, plan, and preferences</Text>

            <View style={styles.heroCard}>
              <LinearGradient
                colors={[...colors.primaryGradient]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initialsFromName(user.displayName ?? 'FT')}</Text>
              </LinearGradient>
              <View style={styles.heroText}>
                <Text style={styles.heroName}>{user.displayName}</Text>
                <Text style={styles.heroEmail}>
                  {isGuest ? 'Browsing as guest' : user.email}
                </Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>ACCOUNT</Text>

              <ProfileRow
                label="Display name"
                children={
                  isEditingName ? (
                    <View style={styles.nameEditCol}>
                      <TextInput
                        value={nameDraft}
                        onChangeText={setNameDraft}
                        placeholder="Your name"
                        placeholderTextColor={colors.placeholder}
                        style={styles.nameInput}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={() => void handleSaveName()}
                      />
                      <View style={styles.nameActions}>
                        <Pressable
                          style={styles.nameActionGhost}
                          onPress={() => {
                            setNameDraft(user.displayName ?? '')
                            setIsEditingName(false)
                          }}
                          disabled={isSavingName}
                        >
                          <Text style={styles.nameActionGhostText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={styles.nameActionPrimary}
                          onPress={() => void handleSaveName()}
                          disabled={isSavingName || !nameDraft.trim()}
                        >
                          {isSavingName ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <Text style={styles.nameActionPrimaryText}>Save</Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.nameDisplayRow}
                      onPress={() => setIsEditingName(true)}
                    >
                      <Text style={styles.nameDisplay} numberOfLines={1}>
                        {user.displayName}
                      </Text>
                      <Ionicons name="pencil-outline" size={16} color={colors.link} />
                    </Pressable>
                  )
                }
              />

              <View style={styles.rowDivider} />

              <ProfileRow
                label="Email"
                children={<Text style={styles.emailValue}>{emailDisplay}</Text>}
              />
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.sectionLabel}>CURRENT PLAN</Text>
                  <Text style={styles.planName}>{plan.label}</Text>
                </View>
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{plan.priceLabel}</Text>
                </View>
              </View>
              <Text style={styles.planTagline}>{plan.tagline}</Text>

              <View style={styles.featureList}>
                {plan.features.map((feature) => (
                  <Text key={feature} style={styles.featureText}>
                    {feature}
                  </Text>
                ))}
              </View>
            </View>

            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </ScrollView>
        </ScreenEntrance>
      </SafeAreaView>
    </ScreenBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  screenTitle: {
    color: colors.title,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  screenSubtitle: {
    marginTop: 6,
    marginBottom: 22,
    color: colors.subtitle,
    fontSize: 15,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.28)',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroText: {
    flex: 1,
  },
  heroName: {
    color: colors.title,
    fontSize: 20,
    fontWeight: '700',
  },
  heroEmail: {
    marginTop: 4,
    color: colors.subtitle,
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
    marginBottom: 14,
  },
  sectionLabel: {
    color: colors.sectionLabel,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },
  row: {
    gap: 8,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  rowValue: {
    minHeight: 24,
    justifyContent: 'center',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  nameEditCol: {
    width: '100%',
    gap: 10,
  },
  nameInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.inputText,
    fontSize: 16,
  },
  nameActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  nameActionGhost: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nameActionGhostText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  nameActionPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primaryBlue,
    minWidth: 64,
    alignItems: 'center',
  },
  nameActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  nameDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  nameDisplay: {
    flex: 1,
    color: colors.title,
    fontSize: 16,
    fontWeight: '600',
  },
  emailValue: {
    color: colors.title,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  planName: {
    marginTop: 4,
    color: colors.title,
    fontSize: 22,
    fontWeight: '700',
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  planBadgeText: {
    color: colors.accentLight,
    fontSize: 12,
    fontWeight: '700',
  },
  planTagline: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    gap: 10,
  },
  featureText: {
    color: colors.title,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  signOutButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
    backgroundColor: 'rgba(248, 113, 113, 0.06)',
  },
  signOutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
})
