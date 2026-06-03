import { parseAuthParamsFromUrl } from './authRedirect'
import { getSupabase } from './supabase'

export async function applySupabaseAuthUrl(url: string): Promise<boolean> {
  const params = parseAuthParamsFromUrl(url)
  const accessToken = params.access_token
  const refreshToken = params.refresh_token

  if (!accessToken || !refreshToken) {
    return false
  }

  const { error } = await getSupabase().auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}
