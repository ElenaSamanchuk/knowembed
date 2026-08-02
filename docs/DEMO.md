# KnowEmbed — Demo Guide (written walkthrough)

**Author:** Elena Samanchuk  
**Project:** [Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder) (Paralect test)  
**Live app:** https://elenasamanchuk.github.io/knowembed/  
**Embed demo:** https://elenasamanchuk.github.io/knowembed/embed-demo.html  
**Repo:** https://github.com/ElenaSamanchuk/knowembed

This document replaces a video demo. Follow the steps below to validate the full product flow.

---

## 1. What you're testing

KnowEmbed is an MVP SaaS product:

1. **Landing + pricing** — marketing site with Starter (free) and Pro ($29) plans  
2. **Auth** — Supabase email/password  
3. **Knowledge upload** — `.txt` / `.md` / `.csv` → chunks in Postgres  
4. **In-app chat** — RAG: retrieve doc chunks from DB → Groq LLM answer  
5. **Publish + embed** — one `<script>` widget for any website  
6. **Billing** — Stripe Checkout (test mode) + webhook; plan limits enforced server-side  

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite, React 19, React Router |
| Backend | Supabase Auth, Postgres, Edge Functions |
| AI | Groq (Llama 3.3, free tier) — optional Gemini/OpenAI fallback |
| Widget | Vanilla JS, Shadow DOM (isolated styles) |

---

## 2. Prerequisites

- Supabase project with migration applied (see [SETUP_RU.md](./SETUP_RU.md))  
- Edge Functions deployed (`ingest-document`, `chat`, `publish-bot`, `public-chat`, `public-bot`)  
- Secret `GROQ_API_KEY` in Supabase → Edge Functions → Secrets  
- Local: `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## 3. Step-by-step demo (≈10 minutes)

### Step 1 — Landing & pricing

1. Open `/`  
2. Confirm hero, three feature cards, pricing preview, CTA **Start free**  
3. Open **Pricing** — Starter vs Pro, Stripe test card note  

**Expected:** Clear value prop; no broken links.

### Step 2 — Sign up

1. Go to **Sign in** / **Create account**  
2. Register: email + password (min 6 chars)  
3. Redirect to **Dashboard**  

**Expected:** Demo bot **Store Assistant** appears automatically.

### Step 3 — Upload & index knowledge

1. Open **Store Assistant**  
2. Left panel: settings + **Knowledge docs**  
3. If chat locked (0 chunks): click **Re-index demo FAQ**  
4. Confirm `acme-faq.md` listed  

**Expected:** Notice “Knowledge indexed”; chunk count &gt; 0.

### Step 4 — Test chat (in-app)

1. In **Test chat**, ask: `How long is shipping?`  
2. Wait for Groq response  

**Expected:** Answer mentions **3–5 business days** (from FAQ).  
3. Try: `What is the return policy?`  

**Expected:** Answer mentions **30 days** returns.

### Step 5 — Publish bot

1. Click **Publish bot** (toolbar)  
2. Notice confirms publish  

**Expected:** `demo-store-assistant` is live for widget.

### Step 6 — Embed widget

1. Open `/embed-demo.html` (or live URL + `/embed-demo.html`)  
2. Click chat launcher (bottom-right)  
3. Ask same shipping question  

**Expected:** Widget matches in-app answers; **Powered by KnowEmbed** badge on Starter.

### Step 7 — Pricing & Stripe checkout

1. Go to **Pricing** → **Upgrade with Stripe test**  
2. Mock checkout page shows test card `4242…`  
3. Return to dashboard — Pro plan badge  

**Expected:** Higher limits; widget branding removed after re-publish.

---

## 4. Architecture (for reviewers)

```
User upload → Edge Function ingest-document → chunks table (Postgres)
User question → Edge Function chat → findRelevantChunks (DB) → Groq API → answer
Publish → published_bots table
Website → widget.js → public-bot + public-chat Edge Functions
```

Plan limits (`messages/month`, `documents/bot`) enforced in Edge Functions, not only UI.

---

## 5. Automated tests

```bash
npm run test          # Vitest: plans, chunking, retrieval scoring
npm run test:e2e      # Playwright: landing, pricing, login guard, embed demo
```

Live Supabase E2E (optional):

```bash
TEST_USER_EMAIL=you@example.com TEST_USER_PASSWORD=secret npm run test:e2e
```

---

## 6. Product decisions

- **Groq free tier** — real LLM without paid OpenAI/Gemini quota issues for demo  
- **Keyword retrieval** — pragmatic RAG for small FAQ docs; pgvector schema ready for v2  
- **Stripe test mode** — real Checkout session + webhook updates `profiles.plan`  
- **Shadow DOM widget** — no CSS conflicts on host sites (pattern similar to production chat widgets)  

---

## 7. Known limits (honest MVP scope)

- File types: `.txt`, `.md`, `.csv` (max 200 KB)  
- No PDF/DOCX in v1  
- Chat history not persisted across sessions  
- Public widget has no rate limit counter (in-app chat does)  

---

## 8. Contact

**Elena Samanchuk** — elenasamanchuk@gmail.com · [Portfolio](https://elenasamanchuk.github.io/elena-samanchuk/)
