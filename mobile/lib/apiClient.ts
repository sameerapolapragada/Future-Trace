import { apiReachabilityHint, resolveApiBaseUrl } from './resolveApiBaseUrl'

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl()
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  try {
    const { getSupabase, isSupabaseConfigured } = await import('./supabase')
    if (!isSupabaseConfigured) return null
    const {
      data: { session },
    } = await getSupabase().auth.getSession()
    return session?.access_token ?? null
  } catch {
    return null
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const accessToken = await getSupabaseAccessToken()
  const headers = new Headers(init.headers)

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    return await fetch(url, { ...init, headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed'
    if (message.toLowerCase().includes('network request failed')) {
      throw new Error(`Network request failed for ${url}. ${apiReachabilityHint()}`)
    }
    throw error
  }
}
