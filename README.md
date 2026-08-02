# KnowEmbed — Embeddable Chatbot Builder

MVP for [Paralect Product Academy](https://www.paralect.com/academy/product-manager/projects/chatbot-builder).

**Live:** https://elenasamanchuk.github.io/knowembed/  
**Embed demo:** https://elenasamanchuk.github.io/knowembed/embed-demo.html  
**Written demo guide:** [docs/DEMO.md](./docs/DEMO.md) · [online](./public/docs/demo.html)

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

## Submit to Paralect

[docs/SUBMISSION.md](./docs/SUBMISSION.md)

## Repo

https://github.com/ElenaSamanchuk/knowembed
