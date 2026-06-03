import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import Stripe from 'stripe'

const WEBHOOK_PATH = '/api/webhooks/stripe'
const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  'checkout.session.completed',
]

function isPlaceholder(value: string | undefined): boolean {
  if (!value?.trim()) return true
  return ['REPLACE_ME', '...', 'your-'].some((fragment) => value.includes(fragment))
}

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error(`APP_URL must start with http:// or https:// (received: ${raw})`)
  }
  return trimmed
}

function webhookUrl(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}${WEBHOOK_PATH}`
}

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL

  if (isPlaceholder(secretKey)) {
    console.error('Missing STRIPE_SECRET_KEY in .env.local (see docs/STRIPE_SETUP.md).')
    process.exit(1)
  }

  if (!appUrl?.trim()) {
    console.error(
      'Missing APP_URL (or NEXT_PUBLIC_APP_URL) — set your deployed site origin, e.g.\n' +
        '  APP_URL=https://your-app.vercel.app'
    )
    process.exit(1)
  }

  const targetUrl = webhookUrl(appUrl)
  const stripe = new Stripe(secretKey!.trim())

  console.log('\n--- Register Stripe webhook ---\n')
  console.log(`Target URL: ${targetUrl}`)
  console.log(`Events: ${WEBHOOK_EVENTS.join(', ')}\n`)

  const existing = await stripe.webhookEndpoints.list({ limit: 100 })
  const match = existing.data.find((endpoint) => endpoint.url === targetUrl)

  if (match) {
    console.log('✓ Webhook endpoint already registered')
    console.log(`  id: ${match.id}`)
    console.log(`  status: ${match.status}`)
    console.log(`  url: ${match.url}`)
    console.log(
      '\nSigning secret is only shown once at creation. Retrieve it in Stripe Dashboard →'
    )
    console.log('Developers → Webhooks → select endpoint → Signing secret → Reveal')
    console.log('\nSet that value as STRIPE_WEBHOOK_SECRET in .env.local and your host env.\n')
    return
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: targetUrl,
    enabled_events: WEBHOOK_EVENTS,
    description: 'Future Trace premium activation (Web-Dev)',
  })

  console.log('✓ Created webhook endpoint')
  console.log(`  id: ${endpoint.id}`)
  console.log(`  url: ${endpoint.url}`)
  console.log(`\nAdd to .env.local and hosting env:\n`)
  console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`)
  console.log('\nRestart `npm run dev` after updating .env.local.\n')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
