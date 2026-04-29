create extension if not exists pgcrypto;

create table if not exists public.landing_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'VIRALYZE',
  logo_url text,
  hero_title text not null,
  hero_subtitle text not null,
  primary_cta_text text not null,
  primary_cta_url text not null,
  secondary_cta_text text,
  secondary_cta_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.landing_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  image_url text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.landing_features (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  icon text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.landing_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  value text not null,
  description text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.landing_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  testimonial text not null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint landing_testimonials_identity unique (name, role)
);

create index if not exists landing_sections_active_order_idx
  on public.landing_sections (is_active, order_index);

create index if not exists landing_features_active_order_idx
  on public.landing_features (is_active, order_index);

create index if not exists landing_stats_active_order_idx
  on public.landing_stats (is_active, order_index);

create index if not exists landing_testimonials_active_idx
  on public.landing_testimonials (is_active);

create or replace function public.set_landing_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists landing_settings_updated_at on public.landing_settings;
create trigger landing_settings_updated_at
before update on public.landing_settings
for each row execute function public.set_landing_updated_at();

drop trigger if exists landing_sections_updated_at on public.landing_sections;
create trigger landing_sections_updated_at
before update on public.landing_sections
for each row execute function public.set_landing_updated_at();

drop trigger if exists landing_features_updated_at on public.landing_features;
create trigger landing_features_updated_at
before update on public.landing_features
for each row execute function public.set_landing_updated_at();

drop trigger if exists landing_stats_updated_at on public.landing_stats;
create trigger landing_stats_updated_at
before update on public.landing_stats
for each row execute function public.set_landing_updated_at();

drop trigger if exists landing_testimonials_updated_at on public.landing_testimonials;
create trigger landing_testimonials_updated_at
before update on public.landing_testimonials
for each row execute function public.set_landing_updated_at();

alter table public.landing_settings enable row level security;
alter table public.landing_sections enable row level security;
alter table public.landing_features enable row level security;
alter table public.landing_stats enable row level security;
alter table public.landing_testimonials enable row level security;

drop policy if exists "Public read landing settings" on public.landing_settings;
create policy "Public read landing settings"
on public.landing_settings for select
using (true);

drop policy if exists "Public read active landing sections" on public.landing_sections;
create policy "Public read active landing sections"
on public.landing_sections for select
using (is_active = true);

drop policy if exists "Public read active landing features" on public.landing_features;
create policy "Public read active landing features"
on public.landing_features for select
using (is_active = true);

drop policy if exists "Public read active landing stats" on public.landing_stats;
create policy "Public read active landing stats"
on public.landing_stats for select
using (is_active = true);

drop policy if exists "Public read active landing testimonials" on public.landing_testimonials;
create policy "Public read active landing testimonials"
on public.landing_testimonials for select
using (is_active = true);
