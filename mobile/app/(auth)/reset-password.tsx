import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Text } from '../../components/AppText'
import { AuthScreenLayout } from '../../components/AuthScreenLayout'
import { PrimaryButton } from '../../components/PrimaryButton'
import { useAuth } from '../../context/AuthContext'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { horizon } from '../../theme/colors'

export default function ResetPasswordScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(false)
      return
    }

    const supabase = getSupabase()
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(Boolean(session))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUpdatePassword = async () => {
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Re-enter your new password.')
      return
    }

    try {
      setLoading(true)
      const { error } = await getSupabase().auth.updateUser({ password })
      if (error) {
        throw new Error(error.message)
      }

      Alert.alert('Password updated', 'You can now sign in with your new password.')
      router.replace(user ? '/home' : '/sign-in')
    } catch (error) {
      Alert.alert(
        'Could not update password',
        error instanceof Error ? error.message : 'Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout
      subtitle="Choose a new password"
      footer={
        <>
          <Text style={styles.footerText}>Done? </Text>
          <Link href="/sign-in" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Back to Sign In</Text>
            </Pressable>
          </Link>
        </>
      }
    >
      {!ready ? (
        <Text style={styles.helper}>
          Open the reset link from your email on this device. If you already opened it, request a
          new link and try again.
        </Text>
      ) : (
        <>
          <Text style={styles.helper}>Enter a new password for your Future Trace account.</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>New password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              style={styles.fieldInput}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat password"
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              style={styles.fieldInput}
            />
          </View>

          <PrimaryButton
            label="Update Password"
            onPress={handleUpdatePassword}
            loading={loading}
            compact
          />
        </>
      )}
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  helper: {
    color: horizon.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: horizon.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  fieldInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    color: horizon.textPrimary,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footerText: {
    color: horizon.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  footerLink: {
    color: horizon.accent,
    fontSize: 16,
    fontWeight: '700',
  },
})
