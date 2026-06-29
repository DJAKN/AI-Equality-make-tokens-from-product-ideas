import { createClient } from '@supabase/supabase-js'

const maxDonationCents = 100_000

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body)

  let rawBody = ''
  for await (const chunk of req) rawBody += chunk
  return rawBody ? JSON.parse(rawBody) : {}
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' })
    return
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    sendJson(res, 503, { error: 'Donation service is not configured.' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Request body must be valid JSON.' })
    return
  }

  const projectSlug = typeof body.projectId === 'string' ? body.projectId : ''
  const amountCents = Number(body.amountCents)

  if (!projectSlug) {
    sendJson(res, 400, { error: 'projectId is required.' })
    return
  }

  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > maxDonationCents) {
    sendJson(res, 400, { error: 'amountCents must be a positive integer under 100000.' })
    return
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', projectSlug)
    .maybeSingle()

  if (projectError) {
    sendJson(res, 500, { error: projectError.message })
    return
  }

  if (!project) {
    sendJson(res, 404, { error: 'Project not found.' })
    return
  }

  const { data: donation, error: donationError } = await supabase
    .from('donations')
    .insert({
      project_id: project.id,
      amount_cents: amountCents,
      currency: 'usd',
      payment_provider: 'mock',
      status: 'captured',
      donor_display_name: 'Demo donor',
      captured_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (donationError) {
    sendJson(res, 500, { error: donationError.message })
    return
  }

  sendJson(res, 201, { donationId: donation.id })
}
