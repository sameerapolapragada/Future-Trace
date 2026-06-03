import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Add them to .env.local (see .env.local.example).'
    )
  }

  return { supabaseUrl, supabaseAnonKey }
}

export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() ?? null
}

export function createBearerClient(accessToken: string | null): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = requireSupabaseEnv()

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })
}
