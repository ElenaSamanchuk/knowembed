# KnowEmbed — Embeddable Chatbot Builder (Paralect test MVP)

MVP for [Paralect Product Academy — Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder).

## What it does

- **Landing + pricing** — product positioning, Starter vs Pro plans, mock Stripe checkout
- **Auth + dashboard** — demo sign-in, bot list, usage limits
- **Knowledge upload** — `.txt` / `.md` docs chunked for retrieval
- **In-app chat** — ChatGPT-like test panel before publish
- **Embed widget** — one script tag, free-text Q&A from published JSON
- **Billing gates** — message limits, doc limits, branding on Starter

## Product choices

| Decision | Why |
|----------|-----|
| Keyword retrieval (not OpenAI) for MVP | Works offline, no API keys in test, easy to demo |
| Publish = static JSON at `/bots/{id}.json` | True embed on any domain; matches suggested deploy path |
| localStorage workspace | Fast to ship; Supabase schema documented for production |
| Mock Stripe checkout | Shows gated Pro upgrade without live payments |

## Run locally

```bash
cd paralect-chatbot-builder
npm install
npm run dev
```

- Landing: http://localhost:5173/
- App: sign in with any email → dashboard
- Embed demo: http://localhost:5173/embed-demo.html

## Publish a bot

1. Upload docs in bot workspace
2. Click **Publish JSON** → save as `public/bots/YOUR-PUBLIC-ID.json`
3. `npm run build` and deploy `dist/`

## Deploy

```bash
npm run build
# Deploy dist/ to Vercel or GitHub Pages
```

## Production path (Supabase)

See `docs/supabase-schema.sql` for auth, bots, documents, and vector search with pgvector.

Suggested next step: Edge Function for OpenAI/Gemini answers using retrieved chunks.

## Submit to Paralect

See `docs/SUBMISSION.md` for the email draft to Karina.

Deliverables:

1. Live demo URL (landing + app + embed demo)
2. GitHub repo
3. Loom walkthrough (2–3 min) or written tutorial

Built with **Vite + React + Cursor** (vibe-coding workflow).
