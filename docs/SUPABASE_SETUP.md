# Supabase setup (KnowEmbed)

Project dashboard: https://supabase.com/dashboard/project/buwxmfapwampgpwvnulb

## 1. Run migration

In **SQL Editor**, run:

`supabase/migrations/20260728100000_initial_schema.sql`

Creates: `profiles`, `bots`, `documents`, `chunks`, `published_bots`, RLS, helper functions.

## 2. Auth

**Authentication → Providers → Email**

- Enable sign-up  
- Disable **Confirm email** (for demo frictionless login)

## 3. AI secret (free)

**Edge Functions → Secrets** — add:

```
GROQ_API_KEY=gsk_...
```

Get key: https://console.groq.com/keys

Optional fallbacks: `GEMINI_API_KEY`, `OPENAI_API_KEY`

## 4. Deploy Edge Functions

Push to `main` (triggers GitHub Actions) or run workflow **Deploy Supabase Edge Functions**.

Functions: `ingest-document`, `chat`, `publish-bot`, `public-chat`, `public-bot`

## 5. Frontend env

```bash
cp .env.example .env.local
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
npm install
npm run dev
```

## 6. Verify

1. Sign up at `/login`  
2. Store Assistant → Re-index FAQ if needed  
3. Chat: *How long is shipping?*  
4. Publish → `/embed-demo.html`

`supabase/migrations/20260728110000_v2_analytics.sql` — chat analytics for `/app/analytics`.

Optional: add `OPENAI_API_KEY` to enable pgvector embeddings on ingest (falls back to keyword search without it).
