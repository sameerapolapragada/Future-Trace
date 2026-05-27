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

export default function SignInScreen() {
  const router = useRouter()
  const { signIn, continueAsGuest } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await signIn(email, password)
      router.replace('/home')
    } catch (error) {
      Alert.alert('Sign in failed', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipForNow = () => {
    continueAsGuest()
    router.replace('/home')
  }

  return (
    <AuthScreenLayout
      subtitle="Welcome back"
      afterCard={<SocialAuthRow compact />}
      footer={
        <>
          <Text style={styles.footerText}>{"Don't have an account? "}</Text>
          <Link href="/sign-up" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign Up</Text>
            </Pressable>
          </Link>
        </>
      }
    >
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

      <Link href="/forgot-password" asChild>
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>
      </Link>

      <PrimaryButton label="Sign In" onPress={handleSignIn} loading={loading} compact />

      <Pressable style={styles.skipButton} onPress={handleSkipForNow}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </Pressable>
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.link,
    fontSize: 15,
    fontWeight: '600',
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 18,
  },
  skipButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
