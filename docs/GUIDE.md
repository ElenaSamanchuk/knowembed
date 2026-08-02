# KnowEmbed — User Guide

How to use the app from sign-up to a live embed on your site.

Live app: [knowembed.vercel.app](https://knowembed.vercel.app/) · [GitHub Pages](https://elenasamanchuk.github.io/knowembed/)

## Before you start

- Free **Starter** plan — no credit card
- 1 bot, up to 3 documents, 50 AI answers per month
- Demo bot **Store Assistant** is created when you sign up

---

## Step 1 — Create your account

Go to **Sign up**, enter email and password (min 6 characters), click **Create account**.

**You should see:** Dashboard with a ready-made **Store Assistant** bot.

![Sign up](public/docs/screenshots/02-signup.png)

---

## Step 2 — Add knowledge to your bot

Open **Store Assistant**. Upload `.txt`, `.md`, or PDF — or click **Re-index demo FAQ** for the sample store FAQ.

**You should see:** Documents in the list and an active chat input.

![Knowledge](public/docs/screenshots/03-knowledge.png)

---

## Step 3 — Test answers in the app

In **Test chat**, ask questions your customers would ask:

- “How long is shipping?”
- “What is the return policy?”

**You should see:** Answers based on your uploaded content.

![Chat](public/docs/screenshots/04-chat.png)

---

## Step 4 — Customize and publish

Set name, welcome message, and theme color in **Settings**. Click **Publish bot**, then **Copy embed**.

**You should see:** A public bot id and a script snippet for your site.

![Publish](public/docs/screenshots/05-publish.png)

---

## Step 5 — Embed on your site

Paste the snippet before `</body>`. Preview on [embed demo](https://knowembed.vercel.app/embed-demo.html) — launcher bottom-right.

**You should see:** Same answers as in the app; KnowEmbed badge on Starter.

![Embed](public/docs/screenshots/06-embed.png)

---

## Step 6 — Track usage and upgrade

Open **Analytics** for question stats. On **Pricing**, upgrade to **Pro** for more bots, docs, and white-label widget.

**You should see:** Stripe Checkout (test card `4242 4242 4242 4242`) and higher limits after upgrade.

![Stripe](public/docs/screenshots/07-stripe.png)

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Chat input disabled | Index docs first, or click **Re-index demo FAQ** |
| Monthly limit reached | Upgrade to Pro on Pricing, or wait for next billing cycle |
| Widget not loading | Publish the bot first; check the script tag on your page |

## Quick links

| Page | URL |
|------|-----|
| Sign up | /signup |
| Dashboard | /app |
| Pricing | /pricing |
| Embed demo | /embed-demo.html |
