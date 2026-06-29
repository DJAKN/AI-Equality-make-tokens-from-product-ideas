-- FuelUp initial Supabase/Postgres schema.
--
-- Design constraints:
-- - Supabase Auth owns passwords and sessions.
-- - Real provider API keys stay in server-side environment variables.
-- - Project funding and compute balances are derived from ledgers.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1),
      'Builder'
    ),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null unique,
  name text not null,
  tagline text not null,
  description text not null,
  intended_usage text not null,
  model_hint text not null default 'gpt-4o',
  demo_video_url text,
  requested_budget_cents integer not null check (requested_budget_cents > 0),
  estimated_tokens_per_dollar integer not null default 50000
    check (estimated_tokens_per_dollar > 0),
  status text not null default 'draft'
    check (status in ('draft', 'fundraising', 'funded', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_owner_id_idx on public.projects(owner_id);
create index projects_status_idx on public.projects(status);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table public.donations (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  donor_id uuid references public.profiles(id) on delete set null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd' check (currency = lower(currency)),
  payment_provider text not null default 'mock'
    check (payment_provider in ('mock', 'stripe')),
  payment_reference text,
  status text not null default 'captured'
    check (status in ('pending', 'captured', 'failed', 'refunded')),
  donor_display_name text,
  donor_message text,
  created_at timestamptz not null default now(),
  captured_at timestamptz
);

create index donations_project_id_idx on public.donations(project_id);
create index donations_donor_id_idx on public.donations(donor_id);
create index donations_status_idx on public.donations(status);

create table public.project_access_credentials (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null default 'FuelUp demo access',
  key_prefix text,
  key_hash text,
  masked_key text not null,
  provider text not null default 'openai' check (provider in ('openai')),
  status text not null default 'active'
    check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  constraint access_key_material_check
    check (
      status = 'pending'
      or key_hash is not null
      or masked_key like 'demo_%'
      or masked_key like 'fu_%'
    )
);

create index project_access_credentials_project_id_idx
on public.project_access_credentials(project_id);

create table public.compute_usage_events (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  access_credential_id uuid references public.project_access_credentials(id)
    on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  provider text not null default 'openai' check (provider in ('openai')),
  model text not null,
  request_kind text not null default 'demo_call',
  provider_request_id text,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  total_tokens integer generated always as (input_tokens + output_tokens) stored,
  metered_cost_cents integer not null default 0 check (metered_cost_cents >= 0),
  status text not null default 'succeeded'
    check (status in ('succeeded', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create index compute_usage_events_project_id_idx
on public.compute_usage_events(project_id);

create index compute_usage_events_actor_id_idx
on public.compute_usage_events(actor_id);

create or replace view public.project_funding_summaries as
select
  p.id as project_id,
  p.owner_id,
  p.slug,
  p.name,
  p.tagline,
  p.description,
  p.intended_usage,
  p.model_hint,
  p.demo_video_url,
  p.requested_budget_cents,
  p.estimated_tokens_per_dollar,
  p.status,
  coalesce(d.received_budget_cents, 0) as received_budget_cents,
  coalesce(u.spent_budget_cents, 0) as spent_budget_cents,
  coalesce(d.received_budget_cents, 0) - coalesce(u.spent_budget_cents, 0)
    as net_budget_cents,
  greatest(
    0,
    coalesce(d.received_budget_cents, 0) - coalesce(u.spent_budget_cents, 0)
  ) as available_budget_cents,
  floor(
    greatest(
      0,
      coalesce(d.received_budget_cents, 0) - coalesce(u.spent_budget_cents, 0)
    )::numeric * p.estimated_tokens_per_dollar / 100
  )::bigint as total_available_tokens,
  case
    when p.requested_budget_cents = 0 then 0
    else least(
      100,
      round(
        coalesce(d.received_budget_cents, 0)::numeric
        / p.requested_budget_cents
        * 100
      )
    )::integer
  end as funding_percent,
  p.created_at,
  p.updated_at
from public.projects p
left join (
  select
    project_id,
    sum(amount_cents) filter (where status = 'captured') as received_budget_cents
  from public.donations
  group by project_id
) d on d.project_id = p.id
left join (
  select
    project_id,
    sum(metered_cost_cents) filter (where status = 'succeeded')
      as spent_budget_cents
  from public.compute_usage_events
  group by project_id
) u on u.project_id = p.id;

create or replace view public.public_project_cards as
select
  project_id,
  slug,
  name,
  tagline,
  description,
  intended_usage,
  model_hint,
  demo_video_url,
  requested_budget_cents,
  received_budget_cents,
  total_available_tokens,
  funding_percent,
  status,
  created_at,
  updated_at
from public.project_funding_summaries
where status in ('fundraising', 'funded');

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.donations enable row level security;
alter table public.project_access_credentials enable row level security;
alter table public.compute_usage_events enable row level security;

create policy "profiles are readable by self"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles are updatable by self"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "published projects are publicly readable"
on public.projects
for select
to anon, authenticated
using (
  status in ('fundraising', 'funded')
  or owner_id = (select auth.uid())
);

create policy "authenticated users can create owned projects"
on public.projects
for insert
to authenticated
with check (owner_id = (select auth.uid()));

create policy "owners can update their projects"
on public.projects
for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "donors and owners can read relevant donations"
on public.donations
for select
to authenticated
using (
  donor_id = (select auth.uid())
  or exists (
    select 1
    from public.projects p
    where p.id = donations.project_id
      and p.owner_id = (select auth.uid())
  )
);

create policy "owners can read project access metadata"
on public.project_access_credentials
for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_access_credentials.project_id
      and p.owner_id = (select auth.uid())
  )
);

create policy "owners can read their project usage"
on public.compute_usage_events
for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = compute_usage_events.project_id
      and p.owner_id = (select auth.uid())
  )
);

-- Intentionally no browser insert/update policies for donations,
-- project_access_credentials, or compute_usage_events. The server-side API uses
-- the Supabase service role for mocked donations, platform access issuance, and
-- OpenAI proxy metering.

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.projects to authenticated;
grant select on public.projects to anon;
grant select on public.donations to authenticated;
grant select on public.project_access_credentials to authenticated;
grant select on public.compute_usage_events to authenticated;

revoke all on public.project_funding_summaries from anon, authenticated;
grant select on public.project_funding_summaries to service_role;
grant select on public.public_project_cards to anon, authenticated;
