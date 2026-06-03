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

function isCheckoutPaid(session: Stripe.Checkout.Session): boolean {
  if (session.status !== 'complete') return false
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
}

export async function POST() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (profile?.is_premium) {
      return NextResponse.json({ isPremium: true, synced: false })
    }

    const stripe = getStripe()
    const sessions = await stripe.checkout.sessions.list({ limit: 100 })

    const paidSession = sessions.data.find(
      (session) =>
        (session.client_reference_id === user.id || session.metadata?.userId === user.id) &&
        isCheckoutPaid(session)
    )

    if (!paidSession) {
      return NextResponse.json({ isPremium: false, synced: false })
    }

    const admin = createAdminClient()
    const { data: updated, error: updateError } = await admin
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id)
      .select('is_premium')
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ isPremium: updated?.is_premium === true, synced: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync premium status'
    console.error('[checkout/sync]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
