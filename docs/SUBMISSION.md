# Submission — KnowEmbed (Paralect)

Hi Karina,

I completed the **Embeddable Chatbot Builder** assignment. Written walkthrough below (no video).

## Links

| | URL |
|---|-----|
| **Live app** | https://elenasamanchuk.github.io/knowembed/ |
| **Embed demo** | https://elenasamanchuk.github.io/knowembed/embed-demo.html |
| **Demo guide** | https://elenasamanchuk.github.io/knowembed/docs/demo.html |
| **Repo** | https://github.com/ElenaSamanchuk/knowembed |

## What I built

**KnowEmbed** — upload company docs → AI chatbot in-app → embeddable widget → pricing tiers.

1. Supabase auth + Postgres (bots, documents, chunks, published_bots)  
2. Upload FAQ → chunked & stored in DB  
3. ChatGPT-like workspace — RAG: DB retrieval + Groq LLM  
4. Publish → embed via one script tag (Shadow DOM widget)  
5. Starter / Pro plans + mock Stripe checkout; limits in Edge Functions  

## Stack (per assignment)

- **Supabase** — auth, database, Edge Functions  
- **Groq** (free) — Llama 3.3 for AI answers  
- **Vite + React** — landing, dashboard, workspace  
- **Vanilla widget** — production-style embed  

## How to test (5 min)

See **[docs/DEMO.md](./DEMO.md)** for full walkthrough with expected results.

Quick path: sign up → Store Assistant → ask *How long is shipping?* → Publish → embed-demo.html → Pricing → mock upgrade.

## Tests

```bash
npm run test && npm run test:e2e
```

Built with Cursor. Happy to walk through product decisions on a call.

Best,  
Elena Samanchuk  
elenasamanchuk@gmail.com
