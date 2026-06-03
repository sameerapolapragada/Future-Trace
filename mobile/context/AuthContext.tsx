import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PlanId } from '../data/plans'
import { applySupabaseAuthUrl } from '../lib/authSessionFromUrl'
import { getPasswordResetRedirectUrl } from '../lib/authRedirect'
import { fetchSharedProfile, updateSharedProfile } from '../lib/profile'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const PREFS_STORAGE_KEY = '@future-trace/user-prefs'

export type User = {
  id: string
  email: string
  displayName?: string
  plan: PlanId
  currentRole?: string
  emailNotifications: boolean
  weeklyReports: boolean
  memberSince?: string
  lastScanAt?: string | null
}

type LocalPrefs = {
  emailNotifications?: boolean
  weeklyReports?: boolean
  lastScanAt?: string | null
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ needsEmailVerification: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateDisplayName: (displayName: string) => Promise<void>
  updateProfileSettings: (updates: ProfileSettingsUpdate) => Promise<void>
}

export type ProfileSettingsUpdate = {
  displayName?: string
  currentRole?: string
  emailNotifications?: boolean
  weeklyReports?: boolean
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

function defaultDisplayName(email: string, explicit?: string | null) {
  const trimmed = explicit?.trim()
  if (trimmed) return trimmed
  const local = email.split('@')[0]?.trim()
  if (!local) return 'Future Trace member'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

function requireSupabaseAuth() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to mobile/.env (same dev branch keys as the web app).'
    )
  }
}

async function readLocalPrefs(userId: string): Promise<LocalPrefs> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, LocalPrefs>
    return parsed[userId] ?? {}
  } catch {
    return {}
  }
}

async function writeLocalPrefs(userId: string, prefs: LocalPrefs) {
  const raw = await AsyncStorage.getItem(PREFS_STORAGE_KEY)
  const parsed = raw ? (JSON.parse(raw) as Record<string, LocalPrefs>) : {}
  parsed[userId] = prefs
  await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(parsed))
}

async function mapSupabaseUser(
  supabaseUser: SupabaseUser,
  session?: Session | null
): Promise<User> {
  const profile = await fetchSharedProfile(supabaseUser.id)
  const prefs = await readLocalPrefs(supabaseUser.id)
  const email = supabaseUser.email ?? profile?.email ?? ''

  return {
    id: supabaseUser.id,
    email,
    displayName: defaultDisplayName(email, profile?.full_name ?? supabaseUser.user_metadata?.full_name),
    plan: profile?.is_premium ? 'pro' : 'free',
    currentRole: profile?.job_role ?? undefined,
    emailNotifications: prefs.emailNotifications ?? true,
    weeklyReports: prefs.weeklyReports ?? false,
    memberSince: supabaseUser.created_at ?? session?.user.created_at,
    lastScanAt: prefs.lastScanAt ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hydrateFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null)
      return
    }

    const next = await mapSupabaseUser(session.user, session)
    setUser(next)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    const supabase = getSupabase()

    async function bootstrap() {
      try {
        const initialUrl = await Linking.getInitialURL()
        if (initialUrl) {
          await applySupabaseAuthUrl(initialUrl)
        }
      } catch {
        // Deep link parse errors should not block startup.
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!cancelled) {
        await hydrateFromSession(session)
        setIsLoading(false)
      }
    }

    void bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrateFromSession(session)
    })

    const linkSub = Linking.addEventListener('url', ({ url }) => {
      void applySupabaseAuthUrl(url).catch(() => undefined)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
      linkSub.remove()
    }
  }, [hydrateFromSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      requireSupabaseAuth()
      validateEmail(email)
      validatePassword(password)

      const { data, error } = await getSupabase().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      await hydrateFromSession(data.session)
    },
    [hydrateFromSession]
  )

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      requireSupabaseAuth()
      validateEmail(email)
      validatePassword(password)

      const normalized = email.trim().toLowerCase()
      const { data, error } = await getSupabase().auth.signUp({
        email: normalized,
        password,
        options: {
          data: { full_name: displayName?.trim() || null },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.session?.user) {
        await hydrateFromSession(data.session)
        return { needsEmailVerification: false }
      }

      return { needsEmailVerification: true }
    },
    [hydrateFromSession]
  )

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await getSupabase().auth.signOut()
    }
    setUser(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    requireSupabaseAuth()
    validateEmail(email)

    const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: getPasswordResetRedirectUrl(),
    })

    if (error) {
      throw new Error(error.message)
    }
  }, [])

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      if (!user) return
      const trimmed = displayName.trim()
      if (!trimmed) {
        throw new Error('Enter a display name.')
      }

      await updateSharedProfile(user.id, { full_name: trimmed })
      setUser({ ...user, displayName: trimmed })
    },
    [user]
  )

  const updateProfileSettings = useCallback(
    async (updates: ProfileSettingsUpdate) => {
      if (!user) return

      const trimmedName = updates.displayName?.trim()
      if (updates.displayName !== undefined && !trimmedName) {
        throw new Error('Enter a display name.')
      }

      if (trimmedName !== undefined || updates.currentRole !== undefined) {
        await updateSharedProfile(user.id, {
          ...(trimmedName !== undefined ? { full_name: trimmedName } : {}),
          ...(updates.currentRole !== undefined
            ? { job_role: updates.currentRole.trim() || null }
            : {}),
        })
      }

      const prefs = await readLocalPrefs(user.id)
      const nextPrefs: LocalPrefs = {
        ...prefs,
        ...(updates.emailNotifications !== undefined
          ? { emailNotifications: updates.emailNotifications }
          : {}),
        ...(updates.weeklyReports !== undefined ? { weeklyReports: updates.weeklyReports } : {}),
      }
      await writeLocalPrefs(user.id, nextPrefs)

      setUser({
        ...user,
        ...(trimmedName !== undefined ? { displayName: trimmedName } : {}),
        ...(updates.currentRole !== undefined ? { currentRole: updates.currentRole } : {}),
        ...(updates.emailNotifications !== undefined
          ? { emailNotifications: updates.emailNotifications }
          : {}),
        ...(updates.weeklyReports !== undefined ? { weeklyReports: updates.weeklyReports } : {}),
      })
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateDisplayName,
      updateProfileSettings,
    }),
    [user, isLoading, signIn, signUp, signOut, resetPassword, updateDisplayName, updateProfileSettings]
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
