# Stripe test mode (KnowEmbed Pro)

Real Stripe Checkout — test keys only, no charges.

## 1. Stripe Dashboard

1. https://dashboard.stripe.com/test/apikeys  
2. Copy **Secret key** (`sk_test_…`)

## 2. Webhook

1. Developers → Webhooks → Add endpoint  
2. URL: `https://buwxmfapwampgpwvnulb.supabase.co/functions/v1/stripe-webhook`  
3. Events: `checkout.session.completed`  
4. Copy **Signing secret** (`whsec_…`)

## 3. Supabase Secrets

Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Deploy functions

GitHub Actions → **Deploy Supabase Edge Functions** (includes `create-checkout-session`, `stripe-webhook`)

## 5. Test

1. Pricing → **Upgrade to Pro**  
2. Card: `4242 4242 4242 4242`, any future date, any CVC  
3. Redirect to `/checkout?success=1`  
4. Profile plan = `pro` (via webhook)
