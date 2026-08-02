# KnowEmbed — Demo Guide

Written walkthrough with screenshots for review and portfolio. Live app: [knowembed.vercel.app](https://knowembed.vercel.app/) · [GitHub Pages](https://elenasamanchuk.github.io/knowembed/)

## Stack

Supabase Auth + Postgres · Edge Functions · Groq LLM · Stripe Checkout · React · Shadow DOM widget · PDF ingest · pgvector · analytics

---

## Step 1 — Landing & pricing

Open the marketing site. Review hero, use cases, FAQ accordion, and Starter / Pro plans.

**Expected:** Clear value prop; Sign in → `/login`, Start free → `/signup`, Pricing works.

![Landing](public/docs/screenshots/01-landing.png)

---

## Step 2 — Create account

Go to `/signup`. Register with email + password (min 6 chars). Supabase auth creates your profile.

**Expected:** Redirect to Dashboard with seeded **Store Assistant** bot.

![Sign up](public/docs/screenshots/02-signup.png)

---

## Step 3 — Index knowledge

Open **Store Assistant**. If chat is locked, click **Re-index demo FAQ**. Confirm `acme-faq.md` is indexed.

**Expected:** Chunks stored in Postgres; chat input enabled.

![Knowledge](public/docs/screenshots/03-knowledge.png)

---

## Step 4 — Test in-app chat

Ask:

- “How long is shipping?”
- “What is the return policy?”

**Expected:** Groq answers from FAQ context (3–5 business days shipping, 30-day returns).

![Chat](public/docs/screenshots/04-chat.png)

---

## Step 5 — Publish bot

Click **Publish bot**. Copy embed snippet from workspace.

**Expected:** `public_id` `demo-store-assistant` available for widget.

![Publish](public/docs/screenshots/05-publish.png)

---

## Step 6 — Embed widget

Open `/embed-demo.html` — chat launcher bottom-right on a Still-style store page.

**Expected:** Same answers as in-app; **Powered by KnowEmbed** badge on Starter plan.

![Embed](public/docs/screenshots/06-embed.png)

---

## Step 7 — Upgrade with Stripe

Pricing → **Upgrade to Pro** → Stripe Checkout (test card `4242 4242 4242 4242`).

**Expected:** Webhook sets `plan = pro` in DB; higher limits; widget branding removed after re-publish.

![Stripe](public/docs/screenshots/07-stripe.png)

---

## Portfolio angle

Position as **full-stack MVP**: backend (Supabase + Edge Functions), AI (RAG + Groq), payments (Stripe webhooks), embeddable widget, PDF ingest, pgvector search, analytics dashboard.

## Links

| Resource | URL |
|----------|-----|
| Live demo | https://knowembed.vercel.app/ |
| Embed demo | https://knowembed.vercel.app/embed-demo.html |
| Case study | https://knowembed.vercel.app/case.html |
| Repository | https://github.com/ElenaSamanchuk/knowembed |
