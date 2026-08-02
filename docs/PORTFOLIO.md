# Portfolio case — KnowEmbed

**Role:** Full-stack MVP (design + implementation)  
**Type:** B2B SaaS — embeddable AI support bot  
**Stack:** Supabase · Groq · Stripe · React · Edge Functions · pgvector

## One-liner

Turn company docs into an embeddable AI assistant — real DB, real AI, real billing, production-style widget.

## Highlights for portfolio card

1. **Backend:** Supabase Auth, Postgres schema, RLS, Edge Functions  
2. **AI:** RAG pipeline — doc chunks in DB → Groq Llama 3.3 (+ pgvector when OpenAI key set)  
3. **Product:** Plan limits, Stripe Checkout + webhook  
4. **Embed:** Shadow DOM widget on a Still-style demo storefront  
5. **v2:** PDF upload, analytics dashboard, vector search  
6. **Quality:** Playwright + Vitest, written demo guide, CI  

## Suggested card structure

- **Cover:** Landing hero screenshot  
- **Problem:** Support teams need FAQ bot without engineering sprint  
- **Solution:** Upload → test → publish → embed  
- **Screens:** 7 steps from `/guide`  
- **Tech tags:** Supabase, Groq, Stripe, TypeScript, RAG, pgvector  
- **Links:** Live · GitHub · Demo guide · Case  

## Live links

- App: https://elenasamanchuk.github.io/knowembed/
- Embed demo: https://elenasamanchuk.github.io/knowembed/embed-demo.html
- Guide: https://elenasamanchuk.github.io/knowembed/guide
- Case: https://elenasamanchuk.github.io/knowembed/case.html
- Repo: https://github.com/ElenaSamanchuk/knowembed
