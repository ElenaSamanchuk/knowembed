import { corsHeaders } from '../_shared/cors.ts';
import { answerWithContext, embedText } from '../_shared/openai.ts';
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
      .select('bot_id, name')
      .eq('public_id', publicId)
      .single();

    if (publishedError || !published) {
      return new Response(JSON.stringify({ error: 'Published bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const queryEmbedding = await embedText(message);
    const { data: matches, error: matchError } = await serviceClient.rpc('match_chunks', {
      p_bot_id: published.bot_id,
      p_query_embedding: queryEmbedding,
      p_match_count: 5,
    });

    if (matchError) throw matchError;

    const contextBlocks = (matches ?? []).map((item: { content: string }) => item.content);
    const answer = contextBlocks.length
      ? await answerWithContext(message, published.name, contextBlocks)
      : `I couldn't find this in ${published.name}'s knowledge base yet.`;

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
