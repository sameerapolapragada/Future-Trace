const PLACEHOLDER_PATTERNS = [
  'test_placeholder',
  'your-checkout-link',
  'REPLACE_ME',
  'sk_test_...',
  'whsec_...',
]

function isPlaceholder(value: string | undefined): boolean {
  if (!value?.trim()) return true
  const normalized = value.trim()
  return PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern))
}

/** Public Payment Link base URL (no user binding). */
export function getStripeCheckoutBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL?.trim()
  if (isPlaceholder(url)) return null
  return url ?? null
}

/**
 * Stripe Payment Links accept `client_reference_id` so the webhook can resolve
 * the Supabase user and set `profiles.is_premium = true`.
 */
export function buildStripeCheckoutUrl(userId?: string | null): string | null {
  const baseUrl = getStripeCheckoutBaseUrl()
  if (!baseUrl) return null

  if (!userId?.trim()) return baseUrl

  const url = new URL(baseUrl)
  url.searchParams.set('client_reference_id', userId.trim())
  return url.toString()
}

export function isStripeConfigured(): boolean {
  return Boolean(
    !isPlaceholder(process.env.STRIPE_SECRET_KEY) &&
      !isPlaceholder(process.env.STRIPE_WEBHOOK_SECRET) &&
      getStripeCheckoutBaseUrl()
  )
}
