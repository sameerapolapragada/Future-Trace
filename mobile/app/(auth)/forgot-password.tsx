import { Link } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import { Text } from '../../components/AppText'
import { AuthScreenLayout } from '../../components/AuthScreenLayout'
import { GradientField } from '../../components/GradientField'
import { PrimaryButton } from '../../components/PrimaryButton'
import { useAuth } from '../../context/AuthContext'
import { colors } from '../../theme/colors'

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    try {
      setLoading(true)
      await resetPassword(email)
      setSent(true)
      Alert.alert(
        'Check your email',
        'If an account exists for this address, password reset instructions will be sent. (Mock flow — no email sent yet.)'
      )
    } catch (error) {
      Alert.alert('Request failed', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout
      subtitle="Reset your password"
      footer={
        <>
          <Text style={styles.footerText}>Remembered it? </Text>
          <Link href="/sign-in" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Back to Sign In</Text>
            </Pressable>
          </Link>
        </>
      }
    >
      <Text style={styles.helper}>
        Enter the email linked to your account. We will send reset instructions when backend auth
        is connected.
      </Text>

      <GradientField
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        compact
      />

      <PrimaryButton
        label={sent ? 'Sent' : 'Send Reset Link'}
        onPress={handleReset}
        loading={loading}
        disabled={sent}
        compact
      />

      {sent ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Mock reset requested for {email.trim().toLowerCase()}.
          </Text>
        </View>
      ) : null}
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  helper: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  successBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  footerText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  footerLink: {
    color: colors.linkAlt,
    fontSize: 16,
    fontWeight: '700',
  },
})
