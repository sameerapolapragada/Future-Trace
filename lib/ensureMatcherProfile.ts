import {
  BASE_PROFILE_COLUMNS,
  profileFromRow,
  selectMatcherProfile,
} from '@/lib/matcherProfileSelect'
import { createAdminClient } from '@/utils/supabase/admin'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export type { MatcherProfile } from '@/lib/matcherProfileSelect'

export async function ensureMatcherProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<{ profile: import('@/lib/matcherProfileSelect').MatcherProfile | null; error: string | null }> {
  const initial = await selectMatcherProfile(supabase, user.id)
  if (initial.error) {
    return { profile: null, error: initial.error }
  }
  if (initial.profile) {
    return { profile: initial.profile, error: null }
  }

  const created = await createProfileForUser(user)
  if (!created) {
    return {
      profile: null,
      error:
        'We could not load your account profile. Try signing out and back in, or contact support.',
    }
  }

  const refreshed = await selectMatcherProfile(supabase, user.id)
  if (refreshed.error) {
    return { profile: created, error: null }
  }

  return { profile: refreshed.profile ?? created, error: null }
}

async function createProfileForUser(
  user: User,
): Promise<import('@/lib/matcherProfileSelect').MatcherProfile | null> {
  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return null
  }

  const metaName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.display_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null

  const { data, error } = await admin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? '',
        full_name: metaName?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select(BASE_PROFILE_COLUMNS)
    .single()

  if (error || !data) {
    console.error('[ensureMatcherProfile] Admin upsert failed:', error?.message)
    return null
  }

  return profileFromRow(data)
}
