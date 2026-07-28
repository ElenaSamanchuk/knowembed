# KnowEmbed — Embeddable Chatbot Builder (Paralect test MVP)

MVP for [Paralect Product Academy — Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder).

## Stack (matches assignment)

- **Supabase** — auth, Postgres, pgvector, Edge Functions
- **OpenAI** — embeddings (`text-embedding-3-small`) + chat (`gpt-4o-mini`)
- **Vite + React** — landing, dashboard, bot workspace
- **Vanilla widget** — embeddable script for client sites

## Features

- Landing + pricing + mock Stripe checkout
- Email/password auth via Supabase
- Upload `.txt` / `.md` docs → chunked + embedded
- In-app AI chat (vector search + GPT)
- Publish bot → embed widget calls Supabase Edge Functions
- Plan limits (Starter vs Pro)

## Setup

See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for full instructions.

Quick start:

```bash
cp .env.example .env.local
# fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Run the SQL migration in Supabase dashboard, add `OPENAI_API_KEY` secret, deploy Edge Functions.

## Repo

https://github.com/ElenaSamanchuk/knowembed

## Submit to Paralect

See `docs/SUBMISSION.md`.
