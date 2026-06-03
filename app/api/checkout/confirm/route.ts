import { createAdminClient } from '@/utils/supabase/admin'
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

function sessionBelongsToUser(session: Stripe.Checkout.Session, userId: string): boolean {
  const sessionUserId =
    session.metadata?.userId?.trim() || session.client_reference_id?.trim() || null
  return sessionUserId === userId
}

function isCheckoutPaid(session: Stripe.Checkout.Session): boolean {
  if (session.status !== 'complete') return false
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { sessionId?: string }
    const sessionId = body.sessionId?.trim()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!sessionBelongsToUser(session, user.id)) {
      return NextResponse.json({ error: 'Checkout session does not match signed-in user' }, { status: 403 })
    }

    if (!isCheckoutPaid(session)) {
      return NextResponse.json(
        { error: 'Checkout session is not paid yet', status: session.status, paymentStatus: session.payment_status },
        { status: 402 }
      )
    }

    const admin = createAdminClient()
    const { data: profile, error: updateError } = await admin
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id)
      .select('is_premium')
      .single()

    if (updateError) {
      console.error('[checkout/confirm] Premium activation failed:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ isPremium: profile?.is_premium === true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to confirm checkout'
    console.error('[checkout/confirm]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
