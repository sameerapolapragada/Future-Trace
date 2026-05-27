import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { Text } from '../../components/AppText'
import { AuthScreenLayout } from '../../components/AuthScreenLayout'
import { GradientField } from '../../components/GradientField'
import { PrimaryButton } from '../../components/PrimaryButton'
import { SocialAuthRow } from '../../components/SocialAuthRow'
import { useAuth } from '../../context/AuthContext'
import { colors } from '../../theme/colors'

export default function SignUpScreen() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Sign up failed', 'Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await signUp(email, password, displayName)
      router.replace('/home')
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout
      subtitle="Create your account"
      afterCard={<SocialAuthRow compact />}
      footer={
        <>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </Link>
        </>
      }
    >
      <GradientField
        label="Name"
        placeholder="Your name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        compact
      />

      <GradientField
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        compact
      />

      <GradientField
        label="Password"
        placeholder="........"
        value={password}
        onChangeText={setPassword}
        compact
        secureTextEntry={passwordHidden}
        rightAccessory={
          <Pressable onPress={() => setPasswordHidden((current) => !current)} hitSlop={10}>
            <Ionicons
              name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="#8B95A5"
            />
          </Pressable>
        }
      />

      <GradientField
        label="Confirm password"
        placeholder="........"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        compact
        secureTextEntry={passwordHidden}
      />

      <PrimaryButton label="Create Account" onPress={handleSignUp} loading={loading} compact />
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
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
