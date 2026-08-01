import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient, createUserClient } from '../_shared/supabase.ts';

const PRO_PRICE_CENTS = 2900;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'STRIPE_SECRET_KEY is not configured in Supabase secrets' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const authHeader = req.headers.get('Authorization');
    const userClient = createUserClient(authHeader);
    const serviceClient = createServiceClient();

    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { origin = 'http://localhost:5173' } = await req.json().catch(() => ({}));
    const safeOrigin = typeof origin === 'string' && origin.startsWith('http') ? origin : 'http://localhost:5173';

    const { data: profile } = await serviceClient
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', authData.user.id)
      .single();

    const body = new URLSearchParams({
      mode: 'subscription',
      success_url: `${safeOrigin}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${safeOrigin}/pricing?canceled=1`,
      client_reference_id: authData.user.id,
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': String(PRO_PRICE_CENTS),
      'line_items[0][price_data][recurring][interval]': 'month',
      'line_items[0][price_data][product_data][name]': 'KnowEmbed Pro',
      'line_items[0][price_data][product_data][description]': '5 bots, 20 docs, 2000 answers/month, no branding',
      'metadata[user_id]': authData.user.id,
    });

    if (profile?.stripe_customer_id) {
      body.set('customer', profile.stripe_customer_id);
    } else {
      body.set('customer_email', profile?.email ?? authData.user.email ?? '');
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const session = await response.json();
    if (!response.ok) {
      throw new Error(session.error?.message ?? 'Stripe checkout failed');
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
