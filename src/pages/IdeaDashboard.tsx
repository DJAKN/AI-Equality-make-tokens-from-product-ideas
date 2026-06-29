import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OwnerTopNav from '@/components/OwnerTopNav'
import TokenBurnBar from '@/components/TokenBurnBar'
import FundingProgressBar from '@/components/FundingProgressBar'
import {
  creatorFundingPercent,
  formatCurrency,
  getCreatorIdea,
  type CreatorIdea,
} from '@/data/creatorIdeas'
import { formatTokens } from '@/data/projects'
import {
  getProjectUsage,
  formatTimestamp,
  type ProjectUsage,
} from '@/data/usageLedger'

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M3 12L12 3l9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v9a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

function UsageCards({ usage }: { usage: ProjectUsage }) {
  const inputTokens = usage.recentRequests.reduce((s, r) => s + r.inputTokens, 0)
  const outputTokens = usage.recentRequests.reduce((s, r) => s + r.outputTokens, 0)
  const totalCost = usage.modelBreakdown.reduce((s, m) => s + m.cost, 0)
  const totalTokensAll = usage.tokensUsed + usage.tokensRemaining
  const budgetPct = usage.tokensUsed / totalTokensAll
  const daysRemaining = Math.round(usage.tokensRemaining / (usage.tokensUsed / 7))
  const maxModelTokens = Math.max(...usage.modelBreakdown.map((m) => m.tokens))

  return (
    <>
      {/* Card 5 — Usage Summary */}
      <section className="rounded-[28px] border border-hairline bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Usage summary
        </p>

        {/* Burn-down bar: used vs remaining */}
        <div className="mt-4">
          <TokenBurnBar
            tokensUsed={usage.tokensUsed}
            tokensRemaining={usage.tokensRemaining}
          />
        </div>

        {/* Input vs output stacked bar */}
        <div className="mt-3 rounded-2xl border border-hairline bg-bg/55 p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Input</span>
            <span>Output</span>
          </div>
          {(() => {
            const total = inputTokens + outputTokens
            const inputPct = total > 0 ? (inputTokens / total) * 100 : 50
            return (
              <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
                <div
                  className="h-full"
                  style={{ width: `${inputPct}%`, background: '#6366F1' }}
                />
                <div
                  className="h-full flex-1"
                  style={{ background: '#22D3EE' }}
                />
              </div>
            )
          })()}
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-indigo">
              {(inputTokens / 1_000).toFixed(1)}K in
            </span>
            <span className="font-semibold text-brand-cyan">
              {(outputTokens / 1_000).toFixed(1)}K out
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
            <p className="text-xs text-muted">Total used</p>
            <p className="mt-1 font-display text-lg font-bold text-brand-violet">
              {(usage.tokensUsed / 1_000).toFixed(0)}K
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
            <p className="text-xs text-muted">Total cost</p>
            <p className="mt-1 font-display text-lg font-bold text-brand-emerald">
              ${totalCost.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      {/* Card 6 — Model Breakdown */}
      <section className="rounded-[28px] border border-hairline bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Model usage
        </p>
        <div className="mt-4 space-y-3">
          {usage.modelBreakdown.map((m) => (
            <div key={m.model} className="rounded-2xl border border-hairline bg-bg/55 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-cyan">{m.model}</span>
                <div className="text-right">
                  <span className="block text-sm font-bold text-ink">
                    {(m.tokens / 1_000).toFixed(0)}K
                  </span>
                  <span className="text-xs text-muted">${m.cost.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#1B2236]">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${((m.tokens / maxModelTokens) * 100).toFixed(1)}%`,
                    background: 'linear-gradient(90deg,#6366F1,#22D3EE)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Card 7 — Recent Requests */}
      <section className="rounded-[28px] border border-hairline bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Recent requests
        </p>
        <div className="mt-4 space-y-2">
          {usage.recentRequests.slice(0, 5).map((r, i) => (
            <div key={i} className="rounded-2xl border border-hairline bg-bg/55 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{r.requestType}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.model} · {formatTimestamp(r.timestampUtc)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.status === 'Success'
                      ? 'bg-brand-emerald/10 text-brand-emerald'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                <span>{(r.totalTokens / 1_000).toFixed(1)}K tokens</span>
                <span>·</span>
                <span>${r.estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Card 8 — Budget Alert (conditional) */}
      {budgetPct > 0.75 ? (
        <section className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-base leading-none">⚠️</span>
            <div>
              <p className="text-sm font-bold text-amber-400">
                {Math.round(budgetPct * 100)}% of funded credits used
              </p>
              <p className="mt-1.5 text-xs leading-5 text-amber-400/70">
                At your current pace, this balance may last{' '}
                <span className="font-semibold text-amber-400">{daysRemaining} more days</span>.
                Share your project to attract new funders.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function DashboardContent({ idea }: { idea: CreatorIdea }) {
  const [hasRun, setHasRun] = useState(false)
  const pct = creatorFundingPercent(idea)
  const usage = getProjectUsage(idea.id)

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
          <div className="mt-3">
            <FundingProgressBar raised={idea.raised} goal={idea.goal} />
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
          Latest contribution
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">{idea.lastDonation.donor}</span>
          <span className="text-brand-emerald">+{formatCurrency(idea.lastDonation.amount)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">{idea.lastDonation.receivedAt}</p>
      </section>

      {usage ? <UsageCards usage={usage} /> : null}
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
          action={
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
            >
              <HomeIcon />
            </button>
          }
        />
        {idea ? <DashboardContent idea={idea} /> : <NotFound onBack={() => navigate('/ideas')} />}
      </div>
    </div>
  )
}
