# Submission draft for Karina (Paralect)

Hi Karina,

I'm back and completed the Embeddable Chatbot Builder assignment.

**Live demo:** [ADD YOUR DEPLOY URL]
**Embed demo:** [ADD YOUR DEPLOY URL]/embed-demo.html
**Repo:** https://github.com/ElenaSamanchuk/knowembed
**Walkthrough:** [ADD LOOM LINK]

## What I built — KnowEmbed

Users can:

1. Sign up with Supabase auth
2. Upload company docs (FAQ, pricing, policies)
3. Test AI answers in a ChatGPT-like workspace (pgvector + OpenAI)
4. Publish a bot and embed it on any site with one script tag
5. Choose Starter (free, limits + branding) or Pro (mock Stripe checkout)

## Stack (as suggested)

- **Supabase** — auth, Postgres, pgvector, Edge Functions
- **OpenAI** — embeddings + GPT answers
- **Vite + React** — landing, app, billing
- **Vanilla embed widget** — calls Supabase public Edge Functions

## How to test

1. Create account → dashboard with seeded Store Assistant bot
2. Ask “How long is shipping?” in test chat
3. Publish bot → open embed demo page
4. Pricing → mock upgrade to Pro

Built with Cursor (vibe-coding workflow). Happy to walk through product decisions.

Best,
Elena Samanchuk
