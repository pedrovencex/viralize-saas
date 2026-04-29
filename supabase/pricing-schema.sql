create extension if not exists pgcrypto;

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(10, 2) not null,
  billing_period text not null,
  description text,
  features jsonb not null default '[]'::jsonb,
  checkout_url text not null,
  is_highlighted boolean not null default false,
  badge_text text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pricing_plans_active_highlight_idx
  on public.pricing_plans (is_active, is_highlighted);

create or replace function public.set_pricing_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists pricing_plans_updated_at on public.pricing_plans;
create trigger pricing_plans_updated_at
before update on public.pricing_plans
for each row execute function public.set_pricing_updated_at();

alter table public.pricing_plans enable row level security;

drop policy if exists "Public read active pricing plans" on public.pricing_plans;
create policy "Public read active pricing plans"
on public.pricing_plans for select
using (is_active = true);
