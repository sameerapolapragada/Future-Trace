# Stripe setup (Web-Dev / local)

## Important: use your **Next.js deploy URL**

The metadata in the app references `future-trace.com`, but that domain currently hosts a **different** site (not this repo). Register the webhook against the URL where **this** Next.js app is deployed (e.g. Vercel preview/production).

Webhook path (fixed):

```text
https://YOUR-DEPLOY-ORIGIN/api/webhooks/stripe
```

Confirm the route exists before registering — a `POST` should **not** return `404`:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST https://YOUR-DEPLOY-ORIGIN/api/webhooks/stripe
# Expect 400 (missing stripe-signature) or 500 (missing secret) — not 404
```

---

## 1. Add keys to `.env.local`

Copy from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys) (use **Test mode** first):

```env
APP_URL=https://your-app.vercel.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_CHECKOUT_URL=https://buy.stripe.com/...
```

| Variable | Where to get it |
|----------|-----------------|
| `APP_URL` | Deploy origin only (no trailing slash), e.g. Vercel URL |
| `STRIPE_SECRET_KEY` | Developers → API keys → **Secret key** |
| `NEXT_PUBLIC_STRIPE_CHECKOUT_URL` | Product catalog → **Payment Links** → copy link URL |
| `STRIPE_WEBHOOK_SECRET` | Step 2 (auto via script or Dashboard) |

Restart `npm run dev` after editing `.env.local`.

---

## 2. Register webhook (deployed URL)

### Option A — CLI script (recommended)

After `STRIPE_SECRET_KEY` and `APP_URL` are set:

```bash
npm run register:stripe-webhook
```

This creates (or finds) a Stripe endpoint for:

```text
{APP_URL}/api/webhooks/stripe
```

Event: `checkout.session.completed`

Copy the printed `STRIPE_WEBHOOK_SECRET` into `.env.local` and your host env (Vercel → Settings → Environment Variables).

### Option B — Stripe Dashboard (manual)

1. [Developers → Webhooks](https://dashboard.stripe.com/test/webhooks) → **Add endpoint**
2. **Endpoint URL:** `https://YOUR-DEPLOY-ORIGIN/api/webhooks/stripe`
3. **Events:** `checkout.session.completed`
4. **Signing secret** → Reveal → set `STRIPE_WEBHOOK_SECRET`

### Local development only

Install [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the `whsec_…` from `stripe listen` as `STRIPE_WEBHOOK_SECRET` (separate from the deployed endpoint secret).

---

## 3. Payment Link + user binding

The app appends `client_reference_id=<supabase_user_id>` to the checkout URL so
`/api/webhooks/stripe` can set `profiles.is_premium = true` after payment.

The webhook also checks `metadata.userId` and customer email as fallbacks.

---

## 4. Verify

```bash
npm run verify:stripe-env
```

---

## 5. Hosting (Vercel / etc.)

Set on the host (never commit secrets to git):

- `APP_URL` (optional at runtime; needed for register script)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_CHECKOUT_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (webhook uses admin client)

After deploy, send a test event from Stripe Dashboard → Webhooks → your endpoint → **Send test event** → `checkout.session.completed`.
