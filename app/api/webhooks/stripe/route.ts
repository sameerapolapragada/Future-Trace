import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  return new Stripe(secretKey)
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    // Service role client — bypasses RLS for automated premium activation
    const supabase = createAdminClient()

    let userId = session.metadata?.userId?.trim() || null

    if (!userId && session.client_reference_id?.trim()) {
      userId = session.client_reference_id.trim()
    }

    if (!userId) {
      const email =
        session.customer_email?.trim() ?? session.customer_details?.email?.trim() ?? null

      if (email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle()

        userId = profile?.id ?? null
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Could not resolve user id from checkout session metadata' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Premium activation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
