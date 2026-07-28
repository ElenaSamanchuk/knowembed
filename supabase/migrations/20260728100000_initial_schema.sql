-- KnowEmbed schema: auth profiles, bots, documents, vector chunks, published bots

create extension if not exists vector;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'starter' check (plan in ('starter', 'pro')),
  messages_used_this_month integer not null default 0,
  billing_cycle_start timestamptz not null default now(),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table public.bots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  public_id text not null unique,
  name text not null,
  welcome text not null default 'Hi! Ask me anything about our product.',
  theme_color text not null default '#1d4ed8',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete cascade,
  name text not null,
  size_bytes integer not null,
  uploaded_at timestamptz not null default now()
);

create table public.chunks (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  document_name text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table public.published_bots (
  public_id text primary key,
  bot_id uuid not null references public.bots(id) on delete cascade unique,
  name text not null,
  welcome text not null,
  theme_color text not null,
  branding boolean not null default true,
  published_at timestamptz not null default now()
);

create index chunks_bot_id_idx on public.chunks(bot_id);
create index chunks_embedding_idx on public.chunks using hnsw (embedding vector_cosine_ops);

create or replace function public.match_chunks(
  p_bot_id uuid,
  p_query_embedding vector(1536),
  p_match_count int default 5
)
returns table (
  id uuid,
  content text,
  document_name text,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.content,
    c.document_name,
    1 - (c.embedding <=> p_query_embedding) as similarity
  from public.chunks c
  where c.bot_id = p_bot_id
    and c.embedding is not null
  order by c.embedding <=> p_query_embedding
  limit p_match_count;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.increment_message_usage(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set messages_used_this_month = messages_used_this_month + 1
  where id = p_user_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.bots enable row level security;
alter table public.documents enable row level security;
alter table public.chunks enable row level security;
alter table public.published_bots enable row level security;

create policy "profiles are self" on public.profiles
  for all using (auth.uid() = id);

create policy "bots are owned" on public.bots
  for all using (auth.uid() = owner_id);

create policy "documents via bot owner" on public.documents
  for all using (
    exists (
      select 1 from public.bots
      where public.bots.id = documents.bot_id and public.bots.owner_id = auth.uid()
    )
  );

create policy "chunks via bot owner" on public.chunks
  for all using (
    exists (
      select 1 from public.bots
      where public.bots.id = chunks.bot_id and public.bots.owner_id = auth.uid()
    )
  );

create policy "published bots public read" on public.published_bots
  for select using (true);

create policy "owners publish bots" on public.published_bots
  for insert with check (
    exists (
      select 1 from public.bots
      where public.bots.id = bot_id and public.bots.owner_id = auth.uid()
    )
  );

create policy "owners update published bots" on public.published_bots
  for update using (
    exists (
      select 1 from public.bots
      where public.bots.id = bot_id and public.bots.owner_id = auth.uid()
    )
  );

create policy "owners delete published bots" on public.published_bots
  for delete using (
    exists (
      select 1 from public.bots
      where public.bots.id = bot_id and public.bots.owner_id = auth.uid()
    )
  );
