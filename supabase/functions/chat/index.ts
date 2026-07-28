import { corsHeaders } from '../_shared/cors.ts';
import { answerWithContext, embedText, PLAN_LIMITS } from '../_shared/openai.ts';
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

    const { botId, message } = await req.json();
    if (!botId || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'botId and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await serviceClient
      .from('profiles')
      .select('plan, messages_used_this_month')
      .eq('id', authData.user.id)
      .single();

    const plan = profile?.plan === 'pro' ? 'pro' : 'starter';
    const limits = PLAN_LIMITS[plan];

    if ((profile?.messages_used_this_month ?? 0) >= limits.messagesPerMonth) {
      return new Response(JSON.stringify({ error: 'Monthly message limit reached' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: bot, error: botError } = await serviceClient
      .from('bots')
      .select('id, name, owner_id')
      .eq('id', botId)
      .eq('owner_id', authData.user.id)
      .single();

    if (botError || !bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const queryEmbedding = await embedText(message);
    const { data: matches, error: matchError } = await serviceClient.rpc('match_chunks', {
      p_bot_id: botId,
      p_query_embedding: queryEmbedding,
      p_match_count: 5,
    });

    if (matchError) throw matchError;

    const contextBlocks = (matches ?? []).map((item: { content: string }) => item.content);
    const answer = contextBlocks.length
      ? await answerWithContext(message, bot.name, contextBlocks)
      : `I couldn't find this in ${bot.name}'s knowledge base yet. Upload FAQ or product docs and try again.`;

    await serviceClient.rpc('increment_message_usage', { p_user_id: authData.user.id });

    return new Response(JSON.stringify({ answer }), {
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
