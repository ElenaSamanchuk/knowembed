# Portfolio case — KnowEmbed

**Role:** Full-stack MVP (design + implementation)  
**Type:** B2B SaaS — embeddable AI support bot  
**Stack:** Supabase · Groq · Stripe · React · Edge Functions

## One-liner

Turn company docs into an embeddable AI assistant — real DB, real AI, real billing, production-style widget.

## Comparable work

| Project | What it shows |
|---------|----------------|
| [Sender / NN99](https://senndder.ru/) | Landing polish, product narrative |
| [Platformax](https://platformax.pro/) | SaaS positioning, MVP depth |
| Yandex Pet Day | Case study format: problem → steps → screenshots |

## Highlights for portfolio card

1. **Backend:** Supabase Auth, Postgres schema, RLS, 7 Edge Functions  
2. **AI:** RAG pipeline — doc chunks in DB → Groq Llama 3.3  
3. **Product:** Plan limits, Stripe Checkout + webhook  
4. **Embed:** Shadow DOM widget (no CSS conflicts on host sites)  
5. **Quality:** Playwright + Vitest, written demo guide, CI  

## Suggested card structure (like Pet Day)

- **Cover:** Landing hero screenshot  
- **Problem:** Support teams need FAQ bot without engineering sprint  
- **Solution:** Upload → test → publish → embed  
- **Screens:** 5–7 steps from `/guide`  
- **Tech tags:** Supabase, Groq, Stripe, TypeScript, RAG  
- **Links:** Live · GitHub · Demo guide  

## Ideas to add later (v2)

- PDF upload + async ingest queue  
- pgvector embeddings (schema ready)  
- Custom widget theme editor  
- Analytics dashboard (messages, top questions)  
- Domain allowlist for embed security  
