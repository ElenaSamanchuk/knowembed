-- KnowEmbed production schema (Supabase)
-- Enable pgvector in Supabase dashboard before running.

create extension if not exists vector;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'starter' check (plan in ('starter', 'pro')),
  messages_used_this_month integer not null default 0,
  billing_cycle_start timestamptz not null default now(),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table bots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  public_id text not null unique,
  name text not null,
  welcome text not null,
  theme_color text not null default '#1d4ed8',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references bots(id) on delete cascade,
  name text not null,
  size_bytes integer not null,
  uploaded_at timestamptz not null default now()
);

create table chunks (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references bots(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  document_name text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index chunks_bot_id_idx on chunks(bot_id);
create index chunks_embedding_idx on chunks using ivfflat (embedding vector_cosine_ops);

-- RLS: users can only access their own bots/docs/chunks
alter table profiles enable row level security;
alter table bots enable row level security;
alter table documents enable row level security;
alter table chunks enable row level security;

create policy "profiles are self" on profiles
  for all using (auth.uid() = id);

create policy "bots are owned" on bots
  for all using (auth.uid() = owner_id);

create policy "documents via bot owner" on documents
  for all using (
    exists (
      select 1 from bots
      where bots.id = documents.bot_id and bots.owner_id = auth.uid()
    )
  );

create policy "chunks via bot owner" on chunks
  for all using (
    exists (
      select 1 from bots
      where bots.id = chunks.bot_id and bots.owner_id = auth.uid()
    )
  );

-- Published JSON can be served from Supabase Storage or Edge Function at /bots/{public_id}.json
