# Supabase setup for KnowEmbed

Project dashboard: https://supabase.com/dashboard/project/buwxmfapwampgpwvnulb

## 1. Run database migration

In Supabase → **SQL Editor** → New query, paste and run:

`supabase/migrations/20260728100000_initial_schema.sql`

This creates profiles, bots, documents, chunks (pgvector), published_bots, and RLS policies.

## 2. Copy API keys

Supabase → **Project Settings** → **API**

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://buwxmfapwampgpwvnulb.supabase.co
VITE_SUPABASE_ANON_KEY=paste_anon_key_here
```

Also update `public/embed-demo.html` → replace `YOUR_SUPABASE_ANON_KEY`.

## 3. Add OpenAI secret for Edge Functions

Supabase → **Project Settings** → **Edge Functions** → **Secrets**

Add:

```
OPENAI_API_KEY=sk-...
```

## 4. Deploy Edge Functions

If Supabase GitHub integration is connected, push this repo and deploy from the dashboard.

Or install Supabase CLI locally:

```bash
npx supabase login
npx supabase link --project-ref buwxmfapwampgpwvnulb
npx supabase db push
npx supabase functions deploy ingest-document
npx supabase functions deploy chat
npx supabase functions deploy publish-bot
npx supabase functions deploy public-chat
npx supabase functions deploy public-bot
```

## 5. Disable email confirmation (optional for demo)

Supabase → **Authentication** → **Providers** → **Email**

Turn off **Confirm email** so test signup works instantly.

## 6. Test flow

```bash
npm install
npm run dev
```

1. Create account at `/login`
2. Open **Store Assistant** bot (seeded automatically)
3. Ask a question in test chat (uses OpenAI + vector search)
4. Click **Publish bot**
5. Open `/embed-demo.html` and test widget

## Security note

Never commit `.env.local` or database passwords to GitHub. Rotate credentials if they were shared in chat.
