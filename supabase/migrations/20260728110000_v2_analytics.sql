-- v2: chat analytics for dashboard

create table if not exists public.chat_events (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  source text not null check (source in ('app', 'widget')),
  question text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_events_owner_id_idx on public.chat_events(owner_id);
create index if not exists chat_events_bot_id_idx on public.chat_events(bot_id);
create index if not exists chat_events_created_at_idx on public.chat_events(created_at desc);

alter table public.chat_events enable row level security;

create policy "owners read chat events" on public.chat_events
  for select using (auth.uid() = owner_id);

create or replace function public.top_chat_questions(p_limit int default 8)
returns table (question text, count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select lower(trim(question)) as question, count(*) as count
  from public.chat_events
  where owner_id = auth.uid()
    and created_at > now() - interval '30 days'
  group by 1
  order by count desc, question asc
  limit p_limit;
$$;

create or replace function public.chat_stats()
returns table (
  total_messages bigint,
  widget_messages bigint,
  app_messages bigint,
  messages_last_7_days bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::bigint as total_messages,
    count(*) filter (where source = 'widget')::bigint as widget_messages,
    count(*) filter (where source = 'app')::bigint as app_messages,
    count(*) filter (where created_at > now() - interval '7 days')::bigint as messages_last_7_days
  from public.chat_events
  where owner_id = auth.uid();
$$;

grant execute on function public.chat_stats() to authenticated;
grant execute on function public.top_chat_questions(int) to authenticated;
