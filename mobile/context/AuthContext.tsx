import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PlanId } from '../data/plans'

const PROFILE_STORAGE_KEY = '@future-trace/user-profile'

export type User = {
  email: string
  displayName?: string
  plan: PlanId
}

type StoredProfile = {
  email: string
  displayName?: string
  plan: PlanId
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  continueAsGuest: () => void
  signOut: () => void
  resetPassword: (email: string) => Promise<void>
  updateDisplayName: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function validateEmail(email: string) {
  if (!email.trim() || !email.includes('@')) {
    throw new Error('Enter a valid email address.')
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
}

function defaultDisplayName(email: string, explicit?: string) {
  const trimmed = explicit?.trim()
  if (trimmed) return trimmed
  const local = email.split('@')[0]?.trim()
  if (!local) return 'Future Trace member'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

async function readStoredProfile(): Promise<StoredProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredProfile
  } catch {
    return null
  }
}

async function writeStoredProfile(profile: StoredProfile) {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

function buildUser(email: string, profile: Pick<StoredProfile, 'displayName' | 'plan'>, displayNameOverride?: string): User {
  return {
    email,
    plan: profile.plan === 'pro' ? 'pro' : 'free',
    displayName: defaultDisplayName(email, displayNameOverride ?? profile.displayName),
  }
}

function userToStored(user: User): StoredProfile {
  return {
    email: user.email,
    displayName: user.displayName,
    plan: user.plan,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const stored = await readStoredProfile()
      if (cancelled) return

      if (stored?.email) {
        setUser(buildUser(stored.email, stored))
      }
      setIsLoading(false)
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const persistUser = useCallback(async (next: User) => {
    await writeStoredProfile(userToStored(next))
    setUser(next)
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      validateEmail(email)
      validatePassword(password)
      const normalized = email.trim().toLowerCase()
      const stored = await readStoredProfile()
      const next = buildUser(
        normalized,
        { plan: stored?.plan ?? 'free', displayName: stored?.displayName },
        stored?.email === normalized ? stored.displayName : undefined
      )
      await persistUser(next)
    },
    [persistUser]
  )

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      validateEmail(email)
      validatePassword(password)
      const normalized = email.trim().toLowerCase()
      const next = buildUser(
        normalized,
        { displayName: displayName?.trim(), plan: 'free' },
        displayName?.trim()
      )
      await persistUser(next)
    },
    [persistUser]
  )

  const continueAsGuest = useCallback(() => {
    const next: User = {
      email: 'guest@futuretrace.local',
      displayName: 'Guest',
      plan: 'free',
    }
    void persistUser(next)
  }, [persistUser])

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY)
    setUser(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    validateEmail(email)
  }, [])

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      const trimmed = displayName.trim()
      if (!trimmed) {
        throw new Error('Enter a display name.')
      }
      if (!user) return

      const next: User = { ...user, displayName: trimmed }
      await persistUser(next)
    },
    [persistUser, user]
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      continueAsGuest,
      signOut,
      resetPassword,
      updateDisplayName,
    }),
    [user, isLoading, signIn, signUp, continueAsGuest, signOut, resetPassword, updateDisplayName]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
