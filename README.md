# KnowEmbed — Embeddable Chatbot Builder

Turn company docs into an embeddable AI support widget — upload, test, publish, embed.

**Live:** https://elenasamanchuk.github.io/knowembed/  
**Embed demo:** https://elenasamanchuk.github.io/knowembed/embed-demo.html  
**User guide:** [docs/GUIDE.md](./docs/GUIDE.md) · [online /guide](https://elenasamanchuk.github.io/knowembed/guide)

## Features

- Landing + pricing + Stripe Checkout (test mode)
- Supabase auth, Postgres, Edge Functions
- Upload docs → chunks in DB → RAG chat (Groq LLM)
- Publish bot → embeddable Shadow DOM widget
- Plan limits (Starter / Pro) enforced server-side

## Quick start

```bash
cp .env.example .env.local   # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Setup: [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) · [docs/SETUP_RU.md](./docs/SETUP_RU.md)

## Tests

```bash
npm run test           # unit: plans, chunking, retrieval
npm run test:e2e       # Playwright: landing, pricing, embed demo
npm run test:all
```

Optional live E2E: copy `.env.test.example` → set credentials → `npm run test:e2e`

## Repo

https://github.com/ElenaSamanchuk/knowembed
