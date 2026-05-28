import { createClient } from '@supabase/supabase-js'

/**
 * Add to `.env.local` at the project root (never commit this file):
 *
 * NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
 *
 * Use Branches → dev → Settings → API for development keys.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const message =
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Create a .env.local file in the project root with both variables (see lib/supabase.ts).'

  console.error(message)
  throw new Error(message)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
