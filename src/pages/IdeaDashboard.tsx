import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OwnerTopNav from '@/components/OwnerTopNav'
import {
  creatorFundingPercent,
  formatCurrency,
  getCreatorIdea,
  type CreatorIdea,
} from '@/data/creatorIdeas'
import { formatTokens } from '@/data/projects'

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 15V7a2 2 0 0 1 2-2h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <main className="px-5">
      <section className="rounded-2xl border border-hairline bg-surface p-5">
        <p className="font-display text-2xl font-bold text-ink">Idea not found</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          This idea is no longer available, or the dashboard link is incorrect.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-bg transition active:scale-[0.99]"
        >
          Back to My Ideas
        </button>
      </section>
    </main>
  )
}

function DashboardContent({ idea }: { idea: CreatorIdea }) {
  const [hasRun, setHasRun] = useState(false)
  const pct = creatorFundingPercent(idea)

  return (
    <main className="space-y-4 px-5">
      <section className="rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-violet">
              Available balance
            </p>
            <h1 className="mt-2 font-display text-[38px] font-bold leading-none text-brand-emerald">
              {formatCurrency(idea.availableBalance)}
            </h1>
            <p className="mt-2 text-sm text-muted">{idea.name} can spend this on API calls.</p>
          </div>
          <span className="rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-bold text-brand-emerald">
            Active
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-bg/55 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">${idea.raised} funded</span>
            <span className="text-muted">Goal ${idea.goal}</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#1B2236]">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#A855F7,#6366F1)' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>{pct}% funded</span>
            <span>{formatTokens(idea.availableBalance)} tokens available</span>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-hairline bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Platform API key
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">Developer access</h2>
          </div>
          <button
            type="button"
            aria-label="Copy API key"
            className="rounded-full border border-hairline bg-bg/55 p-3 text-brand-cyan transition active:scale-95"
          >
            <CopyIcon />
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-bg/70 p-4 font-mono text-sm text-ink">
          {idea.apiKeyPreview}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          FuelUp controls spend limits behind this key. Alex can use it without managing provider
          billing.
        </p>
      </section>

      <section className="rounded-[28px] border border-hairline bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Live demo
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">Run API call</h2>
          </div>
          <span className="rounded-full border border-hairline bg-bg/55 px-3 py-1 text-xs font-semibold text-muted">
            {idea.useCase}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHasRun(true)}
          className="mt-5 w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_16px_48px_rgba(168,85,247,.24)] transition active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
        >
          Run live API call
        </button>

        {hasRun ? (
          <div className="mt-4 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 p-4">
            <p className="text-sm font-bold text-brand-emerald">✓ 200 OK · response received</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              {idea.liveResponse.model} · {idea.liveResponse.latencyMs}ms ·{' '}
              {idea.liveResponse.message}
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-[24px] border border-hairline bg-bg/55 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Latest donation
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">{idea.lastDonation.donor}</span>
          <span className="text-brand-emerald">+{formatCurrency(idea.lastDonation.amount)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">{idea.lastDonation.receivedAt}</p>
      </section>
    </main>
  )
}

export default function IdeaDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const idea = id ? getCreatorIdea(id) : undefined

  return (
    <div className="min-h-dvh bg-bg">
      <div
        className="mx-auto w-full max-w-md"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 12px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <OwnerTopNav
          variant="down-drill"
          title={idea?.name ?? 'Idea'}
          subtitle="Idea Dashboard"
          onBack={() => navigate('/ideas')}
        />
        {idea ? <DashboardContent idea={idea} /> : <NotFound onBack={() => navigate('/ideas')} />}
      </div>
    </div>
  )
}
