-- ============================================================
-- Running App — Supabase Schema
-- הרץ את כל הקובץ הזה ב: SQL Editor → New query → Run
-- ============================================================

-- Profiles (one per family member, all under the same Google account)
create table if not exists public.profiles (
  id           text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  photo        text,                    -- base64 image
  is_strava_user boolean default false,
  strava_tokens  jsonb,                 -- { access_token, refresh_token, expires_at, ... }
  created_at   timestamptz default now()
);

-- Training plans (one plan per profile)
create table if not exists public.plans (
  id           text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  profile_id   text not null references public.profiles(id) on delete cascade,
  name         text not null,
  race_date    date not null,
  race_label   text not null default 'מרוץ',
  start_date   date not null,
  weeks        jsonb not null default '[]',
  created_at   timestamptz default now()
);

-- Workout logs (planned workouts that were completed)
create table if not exists public.workout_logs (
  id             text primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  profile_id     text not null references public.profiles(id) on delete cascade,
  plan_id        text references public.plans(id) on delete set null,
  week_num       integer,
  workout_id     text,
  duration       integer,               -- total seconds
  distance       numeric(6,2),
  avg_heart_rate integer,
  pace           text,
  knee_feeling   integer,
  notes          text,
  date           date,
  photos         jsonb default '[]',
  strava_id      text,
  strava_name    text,
  completed_at   timestamptz default now(),
  created_at     timestamptz default now()
);

-- Free runs (unplanned runs)
create table if not exists public.free_runs (
  id             text primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  profile_id     text not null references public.profiles(id) on delete cascade,
  title          text,
  date           date,
  duration       integer,               -- total seconds
  distance       numeric(6,2),
  avg_heart_rate integer,
  pace           text,
  knee_feeling   integer,
  notes          text,
  photos         jsonb default '[]',
  strava_id      text,
  created_at     timestamptz default now()
);

-- ============================================================
-- Row Level Security — every user sees only their own data
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.plans         enable row level security;
alter table public.workout_logs  enable row level security;
alter table public.free_runs     enable row level security;

create policy "own_profiles"     on public.profiles     for all using (auth.uid() = user_id);
create policy "own_plans"        on public.plans        for all using (auth.uid() = user_id);
create policy "own_workout_logs" on public.workout_logs for all using (auth.uid() = user_id);
create policy "own_free_runs"    on public.free_runs    for all using (auth.uid() = user_id);

-- ============================================================
-- Indexes for common queries
-- ============================================================
create index if not exists idx_profiles_user       on public.profiles(user_id);
create index if not exists idx_plans_profile       on public.plans(profile_id);
create index if not exists idx_logs_plan           on public.workout_logs(plan_id);
create index if not exists idx_logs_profile        on public.workout_logs(profile_id);
create index if not exists idx_freeruns_profile    on public.free_runs(profile_id);
