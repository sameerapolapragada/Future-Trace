import { getSupabase } from './supabase'

export type SharedProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  job_role: string | null
  is_premium: boolean | null
  updated_at?: string | null
}

export async function fetchSharedProfile(userId: string): Promise<SharedProfileRow | null> {
  const supabase = getSupabase()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, job_role, is_premium, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (!profileError && profile) {
    return profile as SharedProfileRow
  }

  const { data: legacyProfile, error: legacyError } = await supabase
    .from('user_profiles')
    .select('id, display_name, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (legacyError || !legacyProfile) {
    return null
  }

  return {
    id: legacyProfile.id,
    email: null,
    full_name: legacyProfile.display_name ?? null,
    job_role: null,
    is_premium: false,
    updated_at: legacyProfile.updated_at ?? null,
  }
}

export async function updateSharedProfile(
  userId: string,
  updates: { full_name?: string | null; job_role?: string | null }
): Promise<void> {
  const supabase = getSupabase()

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      job_role: updates.job_role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (!profileError) {
    return
  }

  if (updates.full_name !== undefined) {
    const { error: legacyError } = await supabase
      .from('user_profiles')
      .update({ display_name: updates.full_name })
      .eq('id', userId)

    if (legacyError) {
      throw new Error(profileError.message || legacyError.message)
    }
  } else {
    throw new Error(profileError.message)
  }
}
