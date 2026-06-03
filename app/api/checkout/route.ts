import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

type CheckoutPlan = 'subscription' | 'single_scan' | 'legacy_premium'

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

function resolvePlan(body: unknown): CheckoutPlan {
  if (!body || typeof body !== 'object') return 'legacy_premium'
  const plan = (body as { plan?: string }).plan
  if (plan === 'subscription' || plan === 'single_scan') return plan
  return 'legacy_premium'
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

    let plan: CheckoutPlan = 'legacy_premium'
    try {
      const body = await request.json()
      plan = resolvePlan(body)
    } catch {
      plan = 'legacy_premium'
    }

    const stripe = getStripe()
    const appUrl = getAppUrl(request)

    if (plan === 'single_scan') {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        client_reference_id: user.id,
        metadata: { userId: user.id, checkoutPlan: 'single_scan' },
        success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
        ...(user.email ? { customer_email: user.email } : {}),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: 299,
              product_data: {
                name: 'Single-Use Unlock Pass',
                description: 'Grants 1 instant AI Career Matcher scan token credit.',
              },
            },
          },
        ],
      })

      if (!session.url) {
        return NextResponse.json({ error: 'Failed to create checkout session URL' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url })
    }

    const subscriptionPriceId = process.env.STRIPE_PRICE_ID?.trim()
    const isMatcherSubscription = plan === 'subscription'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        checkoutPlan: isMatcherSubscription ? 'subscription' : 'legacy_premium',
      },
      success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
      ...(user.email ? { customer_email: user.email } : {}),
      line_items: subscriptionPriceId
        ? [{ price: subscriptionPriceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: 'usd',
                unit_amount: isMatcherSubscription ? 799 : 2900,
                recurring: { interval: 'month' },
                product_data: {
                  name: isMatcherSubscription ? 'Live Market Radar' : 'Future Trace Premium',
                  description: isMatcherSubscription
                    ? 'Continuous background tracking, weekly re-scans, and automated risk alerts.'
                    : 'Full transition plan, historical tracking, and your complete 30-day action plan.',
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
