# KnowEmbed — Embeddable Chatbot Builder (Paralect test MVP)

MVP for [Paralect Product Academy — Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder).

## Stack (matches assignment)

- **Supabase** — auth, Postgres, pgvector, Edge Functions
- **Gemini** (free tier) or **OpenAI** — chat answers
- **Keyword search** — finds relevant doc chunks (no paid embeddings)
- **Vite + React** — landing, dashboard, bot workspace
- **Vanilla widget** — embeddable script for client sites

## Features

- Landing + pricing + mock Stripe checkout
- Email/password auth via Supabase
- Upload `.txt` / `.md` docs → chunked for search
- In-app AI chat (keyword retrieval + Gemini/OpenAI)
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

Run the SQL migration in Supabase dashboard, add `GEMINI_API_KEY` (free) or `OPENAI_API_KEY` secret, deploy Edge Functions.

## Repo

https://github.com/ElenaSamanchuk/knowembed

## Submit to Paralect

See `docs/SUBMISSION.md`.
