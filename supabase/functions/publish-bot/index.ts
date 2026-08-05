import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient, createUserClient } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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

    const { botId } = await req.json();
    if (!botId) {
      return new Response(JSON.stringify({ error: 'botId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: bot, error: botError } = await serviceClient
      .from('bots')
      .select('id, public_id, name, welcome, theme_color, system_prompt, owner_id')
      .eq('id', botId)
      .eq('owner_id', authData.user.id)
      .single();

    if (botError || !bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await serviceClient
      .from('profiles')
      .select('plan')
      .eq('id', authData.user.id)
      .single();

    const branding = profile?.plan !== 'pro';

    const { count: chunkCount } = await serviceClient
      .from('chunks')
      .select('*', { count: 'exact', head: true })
      .eq('bot_id', botId);

    if (!chunkCount) {
      return new Response(JSON.stringify({ error: 'Upload knowledge docs before publishing' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: publishError } = await serviceClient.from('published_bots').upsert({
      public_id: bot.public_id,
      bot_id: bot.id,
      name: bot.name,
      welcome: bot.welcome,
      theme_color: bot.theme_color,
      system_prompt: bot.system_prompt ?? null,
      branding,
      published_at: new Date().toISOString(),
    });

    if (publishError) throw publishError;

    return new Response(JSON.stringify({ publicId: bot.public_id, branding }), {
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
