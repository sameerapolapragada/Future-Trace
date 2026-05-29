import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

async function checkSupabase(): Promise<string> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!supabaseUrl || !supabaseAnonKey) {
      const missing = [
        !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
        !supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
      ]
        .filter(Boolean)
        .join(', ')

      return `FAILED ❌ (Missing ${missing})`
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      return `FAILED ❌ (${error.message})`
    }

    return 'CONNECTED ✅'
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return `FAILED ❌ (${message})`
  }
}

async function checkStripeApi(): Promise<string> {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim()

    if (!secretKey) {
      return 'FAILED ❌ (Missing STRIPE_SECRET_KEY)'
    }

    const stripe = new Stripe(secretKey)
    await stripe.paymentIntents.list({ limit: 1 })

    if (secretKey.startsWith('sk_test_')) {
      return 'CONNECTED ✅ (Test Mode Detected)'
    }

    if (secretKey.startsWith('sk_live_')) {
      return 'CONNECTED ✅ (Live Mode Detected)'
    }

    return 'CONNECTED ✅'
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return `FAILED ❌ (${message})`
  }
}

function checkStripeWebhookSecret(): boolean {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    return typeof webhookSecret === 'string' && webhookSecret.trim().length > 0
  } catch {
    return false
  }
}

export async function GET() {
  const database_supabase = await checkSupabase()
  const stripe_api = await checkStripeApi()
  const stripe_webhook_secret_configured = checkStripeWebhookSecret()

  return NextResponse.json({
    database_supabase,
    stripe_api,
    stripe_webhook_secret_configured,
  })
}
