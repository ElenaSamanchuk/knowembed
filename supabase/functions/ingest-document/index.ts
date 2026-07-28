import { corsHeaders } from '../_shared/cors.ts';
import { chunkText, embedText, PLAN_LIMITS } from '../_shared/openai.ts';
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

    const { botId, name, content } = await req.json();
    if (!botId || !name || !content?.trim()) {
      return new Response(JSON.stringify({ error: 'botId, name, and content are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await serviceClient
      .from('profiles')
      .select('plan')
      .eq('id', authData.user.id)
      .single();

    const plan = profile?.plan === 'pro' ? 'pro' : 'starter';
    const limits = PLAN_LIMITS[plan];

    const { data: bot, error: botError } = await serviceClient
      .from('bots')
      .select('id, owner_id')
      .eq('id', botId)
      .eq('owner_id', authData.user.id)
      .single();

    if (botError || !bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { count: docCount } = await serviceClient
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('bot_id', botId);

    if ((docCount ?? 0) >= limits.documents) {
      return new Response(JSON.stringify({ error: 'Document limit reached for your plan' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: document, error: documentError } = await serviceClient
      .from('documents')
      .insert({
        bot_id: botId,
        name,
        size_bytes: content.length,
      })
      .select('id')
      .single();

    if (documentError || !document) {
      throw documentError ?? new Error('Failed to create document');
    }

    const chunks = chunkText(content, document.id, name);
    for (const chunk of chunks) {
      const embedding = await embedText(chunk.content);
      const { error: chunkError } = await serviceClient.from('chunks').insert({
        bot_id: botId,
        document_id: document.id,
        document_name: chunk.documentName,
        content: chunk.content,
        embedding,
      });
      if (chunkError) throw chunkError;
    }

    await serviceClient
      .from('bots')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', botId);

    return new Response(JSON.stringify({ ok: true, chunks: chunks.length }), {
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
