const DEFAULT_API_URL = 'http://localhost:3000'

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, '')
  }
  return DEFAULT_API_URL
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

  return fetch(url, { ...init, headers })
}
