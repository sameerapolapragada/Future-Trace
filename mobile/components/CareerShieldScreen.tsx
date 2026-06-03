import { horizon } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { persistScanAfterAnalysis, runMobileMatcher } from '@/lib/scanHistory'
import History from '@/src/screens/History'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Text } from './AppText'
import { PrimaryButton } from './PrimaryButton'
import { SafeAreaView } from 'react-native-safe-area-context'

const RESUME_CHAR_LIMIT = 5000

type ShieldTab = 'analysis' | 'history'

function HowItWorksCard() {
  const steps = [
    'Upload your resume or paste your skills',
    'Enter your current and target job titles',
    'Get your AI Career Transition Roadmap with milestones and route',
  ]

  return (
    <View style={styles.howItWorksCard}>
      <Text style={styles.howItWorksTitle}>How It Works</Text>
      {steps.map((step, index) => (
        <View key={step} style={styles.howItWorksRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  )
}

function ShieldTabs({
  active,
  onChange,
}: {
  active: ShieldTab
  onChange: (tab: ShieldTab) => void
}) {
  return (
    <View style={styles.tabsRow}>
      <Pressable
        style={[styles.tab, active === 'analysis' && styles.tabActive]}
        onPress={() => onChange('analysis')}
      >
        <Text style={[styles.tabText, active === 'analysis' && styles.tabTextActive]}>
          New Analysis
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, active === 'history' && styles.tabActive]}
        onPress={() => onChange('history')}
      >
        <Text style={[styles.tabText, active === 'history' && styles.tabTextActive]}>History</Text>
      </Pressable>
    </View>
  )
}

export default function CareerShieldScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<ShieldTab>('analysis')
  const [resumeText, setResumeText] = useState('')
  const [currentJobTitle, setCurrentJobTitle] = useState('')
  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  const handleUploadPress = () => {
    Alert.alert(
      'Upload resume',
      'Paste your resume or LinkedIn summary below for now. File upload from your device is coming soon.'
    )
    setUploadedFileName(null)
  }

  const handleGenerate = async () => {
    const trimmedTarget = targetJobTitle.trim()
    const trimmedResume = resumeText.trim()
    const currentRole = currentJobTitle.trim() || 'Current Role'

    if (!trimmedTarget) {
      Alert.alert('Target job required', 'Enter the role you are transitioning toward.')
      return
    }

    if (!trimmedResume && !uploadedFileName) {
      Alert.alert('Resume required', 'Paste your resume or skills summary to continue.')
      return
    }

    if (trimmedResume.length > 0 && trimmedResume.length < 40) {
      Alert.alert('More detail needed', 'Add a bit more resume or skills content to analyze.')
      return
    }

    setLoading(true)

    try {
      const result = await runMobileMatcher({
        currentRole,
        targetRole: trimmedTarget,
        resumeText: trimmedResume,
      })

      await persistScanAfterAnalysis({
        currentRole,
        targetRole: trimmedTarget,
        calculatedRiskScore: result.market_risk_score,
      })
      setHistoryRefreshKey((key) => key + 1)

      router.push({
        pathname: '/results',
        params: {
          currentRole,
          targetRole: trimmedTarget,
          riskIndex: String(result.market_risk_score),
        },
      })
    } catch (error) {
      Alert.alert(
        'Analysis failed',
        error instanceof Error ? error.message : 'Something went wrong. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Ionicons name="shield-outline" size={24} color={horizon.accent} />
                <Text style={styles.headerTitle}>AI Career Shield</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                Analyze your AI exposure risk and career resilience.
              </Text>
            </View>

            <ShieldTabs active={tab} onChange={setTab} />

            {tab === 'history' ? (
              <History refreshKey={historyRefreshKey} />
            ) : loading ? (
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color={horizon.accent} />
                <Text style={styles.loadingTitle}>Analyzing your profile</Text>
                <Text style={styles.loadingSubtitle}>
                  Mapping your skills to your target role…
                </Text>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.card}>
                  <View style={styles.cardHeadingRow}>
                    <Ionicons name="document-text-outline" size={16} color={horizon.accent} />
                    <Text style={styles.cardHeading}>Resume or Skills Summary</Text>
                  </View>

                  <Pressable style={styles.uploadZone} onPress={handleUploadPress}>
                    <Ionicons name="cloud-upload-outline" size={24} color={horizon.accent} />
                    {uploadedFileName ? (
                      <>
                        <Text style={styles.uploadPrimary}>{uploadedFileName}</Text>
                        <Text style={styles.uploadSecondary}>
                          Tap to upload or replace your file
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.uploadSecondary}>
                          <Text style={styles.uploadAccent}>Click to upload</Text> or drag and drop
                        </Text>
                        <Text style={styles.uploadHint}>PDF, TXT, or DOCX (up to 5 MB)</Text>
                      </>
                    )}
                  </Pressable>

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or paste your resume / LinkedIn summary</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TextInput
                    value={resumeText}
                    onChangeText={(value) => {
                      setResumeText(value.slice(0, RESUME_CHAR_LIMIT))
                      if (uploadedFileName) setUploadedFileName(null)
                    }}
                    placeholder="Paste your resume or skills summary here..."
                    placeholderTextColor="#64748B"
                    multiline
                    textAlignVertical="top"
                    style={styles.textArea}
                  />
                  <Text style={styles.charCount}>
                    {resumeText.length} / {RESUME_CHAR_LIMIT} characters
                  </Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.fieldBlock}>
                    <View style={styles.cardHeadingRow}>
                      <Ionicons name="briefcase-outline" size={16} color={horizon.accent} />
                      <Text style={styles.fieldLabel}>Current Job Title</Text>
                    </View>
                    <TextInput
                      value={currentJobTitle}
                      onChangeText={setCurrentJobTitle}
                      placeholder="e.g. Business Analyst"
                      placeholderTextColor="#64748B"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <View style={styles.cardHeadingRow}>
                      <Ionicons name="trending-up-outline" size={16} color={horizon.accent} />
                      <Text style={styles.fieldLabel}>Target Job Title</Text>
                    </View>
                    <TextInput
                      value={targetJobTitle}
                      onChangeText={setTargetJobTitle}
                      placeholder="e.g. Senior Product Manager"
                      placeholderTextColor="#64748B"
                      style={styles.input}
                    />
                  </View>
                </View>

                <HowItWorksCard />

                <PrimaryButton
                  label="Check my AI Career Match"
                  onPress={handleGenerate}
                  leftIcon={<Ionicons name="flash-outline" size={18} color={horizon.buttonText} />}
                  style={styles.submitButton}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: horizon.background,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: horizon.textPrimary,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: horizon.borderMuted,
    paddingBottom: 12,
  },
  tab: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: horizon.accentMuted,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textSecondary,
  },
  tabTextActive: {
    color: horizon.accent,
  },
  form: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  cardHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  uploadZone: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 16,
    paddingVertical: 28,
  },
  uploadPrimary: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
    textAlign: 'center',
  },
  uploadSecondary: {
    marginTop: 12,
    fontSize: 14,
    color: horizon.textSecondary,
    textAlign: 'center',
  },
  uploadAccent: {
    color: horizon.accent,
    fontWeight: '600',
  },
  uploadHint: {
    marginTop: 4,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: horizon.borderMuted,
  },
  dividerText: {
    flexShrink: 1,
    fontSize: 11,
    color: horizon.textSecondary,
    textAlign: 'center',
  },
  textArea: {
    minHeight: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 21,
    color: horizon.textPrimary,
  },
  charCount: {
    marginTop: 8,
    fontSize: 12,
    color: horizon.textSecondary,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  input: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: horizon.textPrimary,
  },
  howItWorksCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 16,
  },
  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  howItWorksRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: horizon.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: horizon.accent,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  submitButton: {
    marginTop: 4,
  },
  loadingCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  loadingSubtitle: {
    marginTop: 8,
    fontSize: 12,
    color: horizon.textSecondary,
    textAlign: 'center',
  },
})
