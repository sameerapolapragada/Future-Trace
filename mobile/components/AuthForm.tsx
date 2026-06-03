import { horizon } from '@/theme/colors'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Text } from './AppText'
import { PrimaryButton } from './PrimaryButton'
import { useAuth } from '../context/AuthContext'

type AuthMode = 'signin' | 'signup'

type AuthFormProps = {
  initialMode?: AuthMode
}

function AuthField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
}: {
  label: string
  placeholder: string
  value: string
  onChangeText: (value: string) => void
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'words'
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize ?? 'none'}
        autoCorrect={false}
        style={styles.fieldInput}
      />
    </View>
  )
}

export function AuthForm({ initialMode = 'signin' }: AuthFormProps) {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'signup'

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (isSignUp) {
        const result = await signUp(email, password, displayName)
        if (result.needsEmailVerification) {
          Alert.alert(
            'Verify your email',
            'Account created. Check your inbox for a verification link, then sign in to continue.'
          )
          setMode('signin')
          setPassword('')
          return
        }
      } else {
        await signIn(email, password)
      }
      router.replace('/score')
    } catch (error) {
      Alert.alert(
        isSignUp ? 'Sign up failed' : 'Sign in failed',
        error instanceof Error ? error.message : 'Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.form}>
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => setMode('signin')}>
          {!isSignUp ? (
            <LinearGradient
              colors={[...horizon.buttonGradient]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.tabActiveGradient}
            >
              <Text style={styles.tabTextActive}>Sign In</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>Sign In</Text>
          )}
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setMode('signup')}>
          {isSignUp ? (
            <LinearGradient
              colors={[...horizon.buttonGradient]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.tabActiveGradient}
            >
              <Text style={styles.tabTextActive}>Create Account</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>Create Account</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.heading}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
      <Text style={styles.description}>
        {isSignUp
          ? 'Career Intelligence for the AI Age — create your Future Trace account.'
          : 'Sign in to continue to your dashboard.'}
      </Text>

      {isSignUp ? (
        <AuthField
          label="Full name"
          placeholder="Jane Doe"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      ) : null}

      <AuthField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <AuthField
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton
        label={isSignUp ? 'Create account' : 'Sign in'}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />

      {!isSignUp ? (
        <Link href="/forgot-password" asChild>
          <Pressable style={styles.forgotLink}>
            <Text style={styles.forgotLinkText}>Forgot your password?</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 116, 144, 0.4)',
    backgroundColor: horizon.surface,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  tabActiveGradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.textSecondary,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.buttonText,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: horizon.textPrimary,
  },
  description: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: horizon.textSecondary,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#CBD5E1',
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: horizon.textPrimary,
  },
  submitButton: {
    marginTop: 8,
  },
  forgotLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: horizon.accent,
  },
})
