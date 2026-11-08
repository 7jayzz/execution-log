-- The Execution Log: run this once in Supabase → SQL Editor → New query → Run.

-- 1) Profiles: one row per user (name + whether the welcome email went out)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  welcomed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using ((select auth.uid()) = id);

-- Create a profile automatically when someone signs up (email, Google or Apple)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 2) Journal data: every trade, plus one "settings" row per user (accounts, goals, profile, preferences)
create table if not exists public.journal_docs (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.journal_docs enable row level security;
drop policy if exists "own docs select" on public.journal_docs;
drop policy if exists "own docs insert" on public.journal_docs;
drop policy if exists "own docs update" on public.journal_docs;
drop policy if exists "own docs delete" on public.journal_docs;
create policy "own docs select" on public.journal_docs for select using ((select auth.uid()) = user_id);
create policy "own docs insert" on public.journal_docs for insert with check ((select auth.uid()) = user_id);
create policy "own docs update" on public.journal_docs for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own docs delete" on public.journal_docs for delete using ((select auth.uid()) = user_id);
-- Live sync between a user's devices
do $$ begin
  alter publication supabase_realtime add table public.journal_docs;
exception when duplicate_object then null; end $$;

-- 3) Subscriptions: written only by the Stripe webhook (service role); users can read their own
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  status text,
  price_id text,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription" on public.subscriptions for select using ((select auth.uid()) = user_id);

-- 4) Screenshot storage: private bucket, each user can only touch their own folder
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('shots', 'shots', false, 20971520, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;
drop policy if exists "own shots read" on storage.objects;
drop policy if exists "own shots insert" on storage.objects;
drop policy if exists "own shots delete" on storage.objects;
create policy "own shots read" on storage.objects for select using (bucket_id = 'shots' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own shots insert" on storage.objects for insert with check (bucket_id = 'shots' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own shots delete" on storage.objects for delete using (bucket_id = 'shots' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- 5) AI coach daily allowance (written by the server only)
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;

-- One free trial per card. Stripe card fingerprints are the same whatever email or account uses the card.
create table if not exists public.trial_cards (
  fingerprint text primary key,
  user_id uuid references auth.users (id) on delete set null,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);
alter table public.trial_cards enable row level security; -- server-only, no policies

-- Browser push (see lib/push.js and app/api/push/cron). Keys live in Supabase Vault:
--   select vault.create_secret('<VAPID private key>', 'vapid_private_key');
--   select vault.create_secret('<random string>', 'push_cron_secret');
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  p256dh text not null, auth text not null, user_agent text,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "own push select" on public.push_subscriptions for select using ((select auth.uid()) = user_id);
create policy "own push insert" on public.push_subscriptions for insert with check ((select auth.uid()) = user_id);
create policy "own push update" on public.push_subscriptions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own push delete" on public.push_subscriptions for delete using ((select auth.uid()) = user_id);
create table if not exists public.push_log (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null, sent_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.push_log enable row level security;
