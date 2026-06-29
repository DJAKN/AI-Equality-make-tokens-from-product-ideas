/**
 * Seed project data.
 *
 * For the hackathon MVP this is static mock data. The shape mirrors what a
 * Supabase `projects` table would return, so screens can be wired to a real
 * backend later without changing the UI.
 */

export type ProjectStatus = 'fundraising' | 'funded'

export interface Project {
  id: string
  name: string
  /** One-line pitch shown on the Browse card. */
  tagline: string
  /** Full description shown on the Detail screen. */
  description: string
  /** Intended AI usage, e.g. which model/API. */
  useCase: string
  /** Fundraising goal in USD. */
  goal: number
  /** Amount raised so far in USD. */
  raised: number
  status: ProjectStatus
}

/** Rough conversion used across the app: $1 ≈ 50k GPT-4o tokens. */
export const TOKENS_PER_DOLLAR = 50_000

/** Format a USD amount as an approximate token count, e.g. 2.5M. */
export function formatTokens(usd: number): string {
  const tokens = usd * TOKENS_PER_DOLLAR
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`
  return `${tokens}`
}

/** Funding progress as a 0–100 percentage. */
export function fundingPercent(p: Project): number {
  if (p.goal <= 0) return 0
  return Math.min(100, Math.round((p.raised / p.goal) * 100))
}

/**
 * Alex's project from the PRD user story. Starts at $0 / $50 — a donor's $30
 * donation later moves it to $30 / $50, matching the demo script.
 */
export const projects: Project[] = [
  {
    id: 'navisight',
    name: 'NaviSight',
    tagline: 'AI navigation for the visually impaired',
    description:
      'Real-time image recognition and voice guidance to help blind users navigate their surroundings independently.',
    useCase: 'GPT-4o Vision',
    goal: 50,
    raised: 30,
    status: 'fundraising',
  },
]

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
