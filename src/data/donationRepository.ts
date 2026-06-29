import { hasSupabaseConfig } from '@/lib/supabase'

type DonationResult = {
  recorded: boolean
  donationId?: string
}

export async function recordDonation(projectId: string, amountUsd: number): Promise<DonationResult> {
  if (!hasSupabaseConfig) {
    if (import.meta.env.DEV) return { recorded: false }
    throw new Error('Supabase is not configured.')
  }

  const response = await fetch('/api/donations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectId,
      amountCents: Math.round(amountUsd * 100),
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    donationId?: string
    error?: string
  }

  if (!response.ok) {
    throw new Error(payload.error ?? 'Donation could not be recorded.')
  }

  return { recorded: true, donationId: payload.donationId }
}
