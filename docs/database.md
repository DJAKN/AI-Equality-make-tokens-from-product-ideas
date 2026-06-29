# FuelUp Database Setup

## Strongest Failure Mode

The whiteboard schema is too risky if copied directly. `PW` belongs in Supabase
Auth, not in an app table. `Array of Project ID` should be a relational owner
reference. `API Key` must not live as a raw project column. `Received Budget`
and `Total Available Tokens` should be derived from donation and usage events,
otherwise the core claim of accountable compute funding has no audit trail.

The schema in `supabase/migrations/20260629083000_initial_fuelup_schema.sql`
keeps the hackathon MVP small while avoiding those traps.

## Tools Needed

For the fastest hackathon path:

- Hosted Supabase project.
- Supabase Dashboard SQL editor to run the migration if the CLI is unavailable.
- Supabase Auth for signup and login.
- Node/Express, Vercel serverless routes, or Supabase Edge Functions for server-owned mutations.
- `@supabase/supabase-js` in the app and backend.
- Backend-only environment variables: `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY`.
- Browser-safe environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

For a cleaner version-controlled setup:

- Supabase CLI for migrations, local dev, `db push`, and type generation.
- Docker if using the local Supabase stack.
- Generated TypeScript database types from `supabase gen types`.
- Optional Supabase Storage bucket for uploaded demo videos. For the MVP, a `demo_video_url` column is enough.

Current local workstation note: `supabase` and `psql` are not installed, so the
migration was written but not applied locally.

## Schema Shape

Core tables:

- `profiles`: one row per Supabase Auth user. Stores display name and email only.
- `projects`: idea-owner projects, including `name`, `tagline`, `description`, `intended_usage`, `demo_video_url`, `requested_budget_cents`, and status.
- `donations`: append-only funding ledger. Mock payments insert captured donations through a server route.
- `project_access_credentials`: platform access metadata. It stores masked keys and optional hashes, never raw provider secrets.
- `compute_usage_events`: append-only usage ledger written by the server-side OpenAI proxy.
- `project_funding_summaries`: service-side view for raised amount, spent amount, available balance, token estimate, and funding percent.
- `public_project_cards`: published-only public view for the donor browse screen.

Money is stored as integer cents. Token counts are estimates derived from the
configured `estimated_tokens_per_dollar`, matching the current frontend demo
assumption of `$1 ~= 50,000 GPT-4o tokens`.

## API Contract Mapping

| Whiteboard contract | Recommended implementation | Database touchpoints |
| --- | --- | --- |
| `GET` complete idea list for donors | `GET /api/projects` or direct Supabase select from `public_project_cards` | `public_project_cards` |
| `POST` signup/login | Supabase Auth | `auth.users`, `profiles` trigger |
| `GET` idea list for one owner | `GET /api/me/projects` | `projects` filtered by `owner_id` |
| `POST` add new idea | Authenticated server route or Supabase insert | `projects` |
| `POST` idea donation | Server route using service role | `donations` |
| `GET` one idea dashboard | Owner-only server route | `projects`, `project_funding_summaries`, `project_access_credentials`, `compute_usage_events` |
| Live test call | Server route that checks balance, calls OpenAI, writes usage | `project_funding_summaries`, `compute_usage_events` |

## RLS Posture

RLS is enabled on all app tables.

- Public users can read fundraising and funded project rows.
- Authenticated owners can create and update their own projects.
- Users can read and update only their own `profiles` row.
- Donors and project owners can read relevant donation records.
- Project owners can read masked access metadata and usage events for their projects.
- Browser clients cannot insert donations, access credentials, or usage events. Those writes belong to a server route using the Supabase service role.

This split matters for the demo: the browser may display an access key label,
but real OpenAI credentials remain server-side. The honest claim is
platform-proxied balance metering, not provider-enforced hard dollar caps.

## Suggested Setup Commands

Install the client library when the frontend/backend is ready to connect:

```bash
npm install @supabase/supabase-js
```

With the Supabase CLI installed and linked:

```bash
supabase link --project-ref <project-ref>
supabase db push
supabase gen types typescript --linked --schema public > src/lib/database.types.ts
```

Without the CLI, paste the SQL migration into the Supabase Dashboard SQL editor.
After applying it, test with one auth user, one `projects` row, one mocked
`donations` row, and one mocked `compute_usage_events` row before wiring the UI.

## Council Synthesis

Council run: DeepSeek plus GLM succeeded. Gemini failed because the configured
Gemini quota was exhausted.

DeepSeek recommended rejecting the whiteboard schema in favor of normalized
profiles, projects, donations, platform access keys, usage logs, and derived
balances.

GLM independently identified the same core risks: no raw API-key project column,
no mutable balance as source of truth, no custom password storage, and no array
of project IDs on user rows.

Largest disagreement: not material. DeepSeek leaned slightly more toward an
explicit `project_api_keys` table with hashed platform keys. GLM emphasized a
pure server proxy. The migration keeps access metadata optional and masked,
which supports the dashboard demo without pretending provider keys are exposed.

The check most likely to invalidate this design is deployment reality. If the
team cannot run any server-side route or Edge Function, the secure proxy and
service-role writes are impossible, and the live model-call demo must become
clearly mocked.

## References

- Supabase local development and migrations: https://supabase.com/docs/guides/local-development/overview
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase JavaScript client install: https://supabase.com/docs/reference/javascript/installing
- Supabase CLI type generation: https://supabase.com/docs/reference/cli/introduction
