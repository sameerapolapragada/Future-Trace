import * as Linking from 'expo-linking'

/** Must match Supabase Auth → URL Configuration → Redirect URLs. */
export function getPasswordResetRedirectUrl(): string {
  return Linking.createURL('reset-password')
}

export function parseAuthParamsFromUrl(url: string): Record<string, string> {
  const hashIndex = url.indexOf('#')
  const queryPart =
    hashIndex >= 0 ? url.slice(hashIndex + 1) : (url.split('?')[1] ?? '')

  return Object.fromEntries(
    queryPart
      .split('&')
      .filter(Boolean)
      .map((segment) => {
        const [key, ...rest] = segment.split('=')
        return [decodeURIComponent(key), decodeURIComponent(rest.join('='))]
      })
  )
}
