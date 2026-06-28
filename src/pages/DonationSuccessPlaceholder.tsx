import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatTokens, getProject } from '@/data/projects'

export default function DonationSuccessPlaceholder() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const project = getProject(params.get('project') ?? '')
  const amount = useMemo(() => {
    const parsed = Number(params.get('amount'))
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 30
  }, [params])

  return (
    <div className="min-h-dvh bg-bg">
      <div
        className="mx-auto flex min-h-dvh w-full max-w-md items-center px-5"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'max(env(safe-area-inset-left), 20px)',
          paddingRight: 'max(env(safe-area-inset-right), 20px)',
        }}
      >
        <main className="w-full rounded-[32px] border border-hairline bg-surface p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,.28)]">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-bg shadow-[0_18px_60px_rgba(52,211,153,.24)]"
            style={{ background: 'linear-gradient(135deg,#34D399,#22D3EE)' }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none">
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald">
            Donation queued
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Impact confirmed</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            ${amount} will give {project?.name ?? 'this idea'} approximately{' '}
            <span className="font-semibold text-brand-cyan">{formatTokens(amount)}</span> GPT-4o
            tokens.
          </p>
          <p className="mt-4 text-xs leading-5 text-muted">
            This is a placeholder route. The high-fidelity success screen is the next donor-track
            screen.
          </p>
          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="mt-6 w-full rounded-full bg-ink px-5 py-4 text-sm font-bold text-bg transition active:scale-[0.99]"
          >
            Back to projects
          </button>
        </main>
      </div>
    </div>
  )
}
