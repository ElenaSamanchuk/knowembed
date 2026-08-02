import { corsHeaders } from '../_shared/cors.ts';
import { answerWithContext, findRelevantChunks } from '../_shared/ai.ts';
import { logChatEvent } from '../_shared/embeddings.ts';
import { createServiceClient } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { publicId, message } = await req.json();
    if (!publicId || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'publicId and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceClient = createServiceClient();

    const { data: published, error: publishedError } = await serviceClient
      .from('published_bots')
      .select('bot_id, name, bots(owner_id)')
      .eq('public_id', publicId)
      .single();

    if (publishedError || !published) {
      return new Response(JSON.stringify({ error: 'Published bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contextBlocks = await findRelevantChunks(serviceClient, published.bot_id, message, 5);
    const answer = contextBlocks.length
      ? await answerWithContext(message, published.name, contextBlocks)
      : `I couldn't find this in ${published.name}'s knowledge base yet.`;

    const ownerId = (published.bots as { owner_id?: string } | null)?.owner_id;
    if (ownerId) {
      await logChatEvent(serviceClient, {
        botId: published.bot_id,
        ownerId,
        source: 'widget',
        question: message,
      });
    }

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
