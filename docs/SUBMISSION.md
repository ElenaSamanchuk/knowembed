# Submission draft for Karina (Paralect)

Hi Karina,

I'm back from vacation and completed the Embeddable Chatbot Builder assignment.

**Live demo:** [ADD YOUR DEPLOY URL]
**Embed demo:** [ADD YOUR DEPLOY URL]/embed-demo.html
**Repo:** [ADD YOUR GITHUB URL]
**Walkthrough:** [ADD LOOM OR NOTION LINK]

## What I built — KnowEmbed

An MVP where a team can:

1. Upload company docs (FAQ, pricing, policies)
2. Test answers in a ChatGPT-like workspace
3. Publish bot JSON and embed a widget on any site with one script tag
4. Choose Starter (free, limits + branding) or Pro (mock Stripe checkout)

## Scope decisions

- Focused on the full brief: **docs → chat → embed → pricing**
- Used keyword retrieval for the demo MVP so it works without API keys; production path is Supabase + pgvector + OpenAI/Gemini (schema included)
- Published bots as static JSON so the vanilla widget works on external domains
- Mock billing with plan gates (message limits, doc limits, widget branding)

## Stack

- Vite + React + React Router (landing, app, billing)
- Vanilla JS embed widget (`widget.js`)
- localStorage demo backend; Supabase schema documented for production
- Built with Cursor (vibe-coding workflow)

## How to test (2 min)

1. Open landing → **Start free** → sign in with any email
2. Open **Store Assistant** → ask “How long is shipping?” in test chat
3. Open `/embed-demo.html` → same bot as embedded widget
4. **Pricing** → upgrade to Pro → mock Stripe success → higher limits

Happy to walk through product decisions and what I'd ship next with real users.

Best,
Elena Samanchuk
