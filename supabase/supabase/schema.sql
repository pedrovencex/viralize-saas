-- VIRALYZE Supabase schema
-- Run this once in Supabase SQL Editor after creating/selecting your project.

create extension if not exists "pgcrypto";

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null unique,
  avatar_url text,
  followers bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  product_url text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint products_name_category_unique unique (name, category)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  thumbnail_url text,
  video_url text,
  views bigint default 0,
  likes bigint default 0,
  comments bigint default 0,
  creator_id uuid not null references public.creators(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint videos_video_url_unique unique (video_url)
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  revenue numeric(14, 2) default 0,
  sales bigint default 0,
  conversion_rate numeric(10, 4),
  extracted_at timestamptz not null default now()
);

create index if not exists creators_username_idx on public.creators (username);
create index if not exists products_category_idx on public.products (category);
create index if not exists videos_creator_id_idx on public.videos (creator_id);
create index if not exists videos_product_id_idx on public.videos (product_id);
create index if not exists videos_views_idx on public.videos (views desc);
create index if not exists metrics_video_id_idx on public.metrics (video_id);
create index if not exists metrics_extracted_at_idx on public.metrics (extracted_at desc);

alter table public.creators enable row level security;
alter table public.products enable row level security;
alter table public.videos enable row level security;
alter table public.metrics enable row level security;

drop policy if exists "Public read creators" on public.creators;
drop policy if exists "Public read products" on public.products;
drop policy if exists "Public read videos" on public.videos;
drop policy if exists "Public read metrics" on public.metrics;

create policy "Public read creators"
  on public.creators for select
  to anon, authenticated
  using (true);

create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Public read videos"
  on public.videos for select
  to anon, authenticated
  using (true);

create policy "Public read metrics"
  on public.metrics for select
  to anon, authenticated
  using (true);

-- Writes are intentionally not opened to anon/authenticated roles.
-- Use SUPABASE_SERVICE_ROLE_KEY from trusted scripts or backend jobs for inserts/upserts.
