import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import Stripe from 'stripe'
import { buildStripeCheckoutUrl, getStripeCheckoutBaseUrl } from '../lib/stripeCheckout'

type Check = { label: string; ok: boolean; detail?: string }

const PLACEHOLDER_FRAGMENTS = ['test_placeholder', 'your-checkout-link', 'REPLACE_ME', '...']

function isUnset(value: string | undefined): boolean {
  if (!value?.trim()) return true
  return PLACEHOLDER_FRAGMENTS.some((fragment) => value.includes(fragment))
}

async function main() {
  const checks: Check[] = []

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const checkoutUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL

  checks.push({
    label: 'STRIPE_SECRET_KEY present',
    ok: !isUnset(secretKey),
    detail: isUnset(secretKey) ? 'Set sk_test_… or sk_live_… in .env.local' : 'Loaded from .env.local',
  })

  checks.push({
    label: 'STRIPE_WEBHOOK_SECRET present',
    ok: !isUnset(webhookSecret),
    detail: isUnset(webhookSecret)
      ? 'Create webhook endpoint or run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`'
      : 'Loaded from .env.local',
  })

  checks.push({
    label: 'NEXT_PUBLIC_STRIPE_CHECKOUT_URL present',
    ok: !isUnset(checkoutUrl),
    detail: isUnset(checkoutUrl)
      ? 'Create a Payment Link in Stripe Dashboard → Payment Links'
      : checkoutUrl,
  })

  if (!isUnset(secretKey)) {
    try {
      const stripe = new Stripe(secretKey!.trim())
      const balance = await stripe.balance.retrieve()
      checks.push({
        label: 'Stripe secret key valid',
        ok: balance.object === 'balance',
        detail: 'Connected to Stripe test/live account',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid secret key'
      checks.push({ label: 'Stripe secret key valid', ok: false, detail: message })
    }
  }

  const baseUrl = getStripeCheckoutBaseUrl()
  const sampleCheckout = buildStripeCheckoutUrl('00000000-0000-4000-8000-000000000000')

  checks.push({
    label: 'Checkout URL resolves (not placeholder)',
    ok: Boolean(baseUrl),
    detail: baseUrl ?? 'Still using test_placeholder fallback',
  })

  checks.push({
    label: 'Checkout URL accepts client_reference_id',
    ok: Boolean(sampleCheckout?.includes('client_reference_id=')),
    detail: sampleCheckout ?? 'N/A',
  })

  console.log('\n--- Stripe env verification ---\n')

  for (const check of checks) {
    const icon = check.ok ? '✓' : '✗'
    console.log(`${icon} ${check.label}`)
    if (check.detail) {
      console.log(`    ${check.detail}`)
    }
  }

  const passed = checks.filter((check) => check.ok).length
  const total = checks.length
  const allPassed = passed === total

  console.log(`\n${allPassed ? 'PASS' : 'FAIL'} — ${passed}/${total} checks passed\n`)

  if (!allPassed) {
    console.log('Setup guide: docs/STRIPE_SETUP.md\n')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
