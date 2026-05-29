import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  return new Stripe(secretKey)
}

function getAppUrl(request: Request): string {
  const configured = process.env.APP_URL?.trim().replace(/\/$/, '')
  if (configured) return configured
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = getStripe()
    const appUrl = getAppUrl(request)
    const priceId = process.env.STRIPE_PRICE_ID?.trim()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: user.id,
      metadata: { userId: user.id },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
      ...(user.email ? { customer_email: user.email } : {}),
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: 'usd',
                unit_amount: 2900,
                recurring: { interval: 'month' },
                product_data: {
                  name: 'Future Trace Premium',
                  description:
                    'Full transition plan, historical tracking, and your complete 30-day action plan.',
                },
              },
            },
          ],
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout session failed'
    console.error('[checkout] Failed to create session:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
