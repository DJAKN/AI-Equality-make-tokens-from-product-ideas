import { supabase } from '@/lib/supabase'
import { getProject as getStaticProject, projects as staticProjects, type Project } from './projects'

type PublicProjectCardRow = {
  project_id: string
  slug: string
  name: string
  tagline: string
  description: string
  intended_usage: string
  model_hint: string
  requested_budget_cents: number
  received_budget_cents: number
  status: string
}

function centsToDollars(cents: number): number {
  return cents / 100
}

function normalizeStatus(status: string): Project['status'] {
  return status === 'funded' ? 'funded' : 'fundraising'
}

function mapProject(row: PublicProjectCardRow): Project {
  return {
    id: row.slug || row.project_id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    useCase: row.intended_usage || row.model_hint,
    goal: centsToDollars(row.requested_budget_cents),
    raised: centsToDollars(row.received_budget_cents),
    status: normalizeStatus(row.status),
  }
}

export async function listProjects(): Promise<Project[]> {
  if (!supabase) {
    if (import.meta.env.DEV) return staticProjects
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('public_project_cards')
    .select(
      [
        'project_id',
        'slug',
        'name',
        'tagline',
        'description',
        'intended_usage',
        'model_hint',
        'requested_budget_cents',
        'received_budget_cents',
        'status',
      ].join(','),
    )
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => mapProject(row as PublicProjectCardRow))
}

export async function getProject(id: string): Promise<Project | undefined> {
  if (!supabase) {
    if (import.meta.env.DEV) return getStaticProject(id)
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('public_project_cards')
    .select(
      [
        'project_id',
        'slug',
        'name',
        'tagline',
        'description',
        'intended_usage',
        'model_hint',
        'requested_budget_cents',
        'received_budget_cents',
        'status',
      ].join(','),
    )
    .eq('slug', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapProject(data as PublicProjectCardRow) : undefined
}
