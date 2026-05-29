import { createClient } from '@/utils/supabase/server'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  job_role: string | null
  is_premium: boolean
  updated_at: string
}

export type AuthenticatedProfile = {
  user: User
  profile: Profile | null
}

export async function getAuthenticatedProfile(): Promise<AuthenticatedProfile | null> {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return { user, profile }
}
