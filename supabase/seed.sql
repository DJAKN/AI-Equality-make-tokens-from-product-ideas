-- Manual hackathon seed for hosted Supabase.
--
-- Run after creating at least one Auth user. The first profile becomes the
-- owner for the seeded NaviSight project. This avoids direct writes to
-- auth.users, which should stay owned by Supabase Auth.

with owner_profile as (
  select id
  from public.profiles
  order by created_at
  limit 1
)
insert into public.projects (
  owner_id,
  slug,
  name,
  tagline,
  description,
  intended_usage,
  model_hint,
  requested_budget_cents,
  estimated_tokens_per_dollar,
  status
)
select
  owner_profile.id,
  'navisight',
  'NaviSight',
  'AI navigation for the visually impaired',
  'Real-time image recognition and voice guidance to help blind users navigate their surroundings independently.',
  'GPT-4o Vision API calls for image recognition',
  'gpt-4o',
  5000,
  50000,
  'fundraising'
from owner_profile
on conflict (slug) do update
set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  intended_usage = excluded.intended_usage,
  model_hint = excluded.model_hint,
  requested_budget_cents = excluded.requested_budget_cents,
  estimated_tokens_per_dollar = excluded.estimated_tokens_per_dollar,
  status = excluded.status,
  updated_at = now();
