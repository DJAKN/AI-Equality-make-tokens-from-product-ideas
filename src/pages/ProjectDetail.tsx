import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fundingPercent, formatTokens, getProject } from '@/data/projects'
import { getProjectUsage, formatBucketDate, formatTimestamp } from '@/data/usageLedger'
import TokenBurnBar from '@/components/TokenBurnBar'

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

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M12 3l1.6 5.3L19 10l-5.4 1.7L12 17l-1.6-5.3L5 10l5.4-1.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 15l.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = id ? getProject(id) : undefined
  const usage = id ? getProjectUsage(id) : undefined
  const [selectedAmount, setSelectedAmount] = useState(30)
  const [customAmount, setCustomAmount] = useState('')

  const effectiveAmount = useMemo(() => {
    if (customAmount.trim() === '') return selectedAmount
    const parsed = Number(customAmount)
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : selectedAmount
  }, [customAmount, selectedAmount])

  const pct = project ? fundingPercent(project) : 0

  const goBack = () => {
    navigate('/browse')
  }

  const fundIdea = () => {
    if (!project) return
    navigate(`/donate/success?project=${project.id}&amount=${effectiveAmount}`)
  }

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
        <header className="grid grid-cols-[48px_1fr_auto] items-center gap-2 px-4 pb-4 pt-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to Browse"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
          >
            <BackIcon />
          </button>
          <div className="min-w-0 text-center">
            <p className="truncate font-display text-base font-bold text-ink">
              {project?.name ?? 'Project'}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-muted">Project details</p>
          </div>
          <div className="flex items-center gap-2">
            {project ? (
              <span className="rounded-full border border-brand-emerald/20 bg-brand-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-brand-emerald">
                Live
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
            >
              <HomeIcon />
            </button>
          </div>
        </header>

        {!project ? (
          <main className="px-5">
            <section className="rounded-2xl border border-hairline bg-surface p-5">
              <p className="font-display text-2xl font-bold text-ink">Project not found</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                This project is no longer available, or the link is incorrect.
              </p>
              <button
                type="button"
                onClick={goBack}
                className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-bg transition active:scale-[0.99]"
              >
                Back to Browse
              </button>
            </section>
          </main>
        ) : (
          <main className="space-y-4 px-5">
            <section className="rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)]">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
                  Fundraising
                </span>
                <span className="rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-muted">
                  {project.useCase}
                </span>
              </div>

              <h1 className="font-display text-[34px] font-bold leading-[1.02] text-ink">
                {project.name}
              </h1>
              <p className="mt-2 text-base font-medium text-muted">{project.tagline}</p>
              <p className="mt-5 text-sm leading-6 text-muted">{project.description}</p>

              <div className="mt-6 rounded-2xl border border-hairline bg-bg/55 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">${project.raised} raised</span>
                  <span className="text-muted">Goal ${project.goal}</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#1B2236]">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg,#6366F1,#22D3EE)',
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>{pct}% funded</span>
                  <span>About {formatTokens(project.goal)} tokens at goal</span>
                </div>
              </div>
            </section>

            {usage ? (
              <>
                {/* Impact Summary */}
                <section className="rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-indigo">
                    Compute funded
                  </p>

                  {/* Burn-down: used vs remaining */}
                  <div className="mt-4">
                    <TokenBurnBar
                      tokensUsed={usage.tokensUsed}
                      tokensRemaining={usage.tokensRemaining}
                      remainingLabel="left"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                      <p className="text-xs text-muted">Tokens funded</p>
                      <p className="mt-1 font-display text-xl font-bold text-brand-cyan">
                        {formatTokens(usage.totalDonated)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                      <p className="text-xs text-muted">Total cost</p>
                      <p className="mt-1 font-display text-xl font-bold text-brand-emerald">
                        ${usage.modelBreakdown.reduce((s, m) => s + m.cost, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Usage Over Time — bottom-anchored bar chart */}
                <section className="rounded-[28px] border border-hairline bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Usage over time
                  </p>
                  {(() => {
                    const max = Math.max(...usage.dailyUsage.map((d) => d.tokens))
                    const chartH = 64
                    return (
                      <div className="mt-5 flex items-end gap-1.5" style={{ height: chartH + 20 }}>
                        {usage.dailyUsage.map((d) => {
                          const barH = Math.max(4, Math.round((d.tokens / max) * chartH))
                          return (
                            <div key={d.dateUtc} className="flex flex-1 flex-col items-center gap-1.5">
                              <div
                                className="w-full rounded-t-[4px]"
                                style={{
                                  height: barH,
                                  background: 'linear-gradient(180deg,#6366F1,#22D3EE)',
                                }}
                              />
                              <span className="text-[9px] leading-none text-muted">
                                {formatBucketDate(d.dateUtc)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </section>

                {/* Compute Allocation — with inline share bars */}
                <section className="rounded-[28px] border border-hairline bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Compute allocation
                  </p>
                  {(() => {
                    const maxT = Math.max(...usage.modelBreakdown.map((m) => m.tokens))
                    return (
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
                                  width: `${((m.tokens / maxT) * 100).toFixed(1)}%`,
                                  background: 'linear-gradient(90deg,#6366F1,#22D3EE)',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </section>

                {/* Recent Activity */}
                <section className="rounded-[28px] border border-hairline bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Recent activity
                  </p>
                  <div className="mt-4 space-y-2">
                    {usage.recentRequests.slice(0, 3).map((r, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-hairline bg-bg/55 px-4 py-3"
                      >
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
                        <p className="mt-1.5 text-xs text-muted">
                          {(r.totalTokens / 1_000).toFixed(1)}K tokens · ${r.estimatedCost.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contribution History */}
                <section className="rounded-[28px] border border-hairline bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Contribution history
                  </p>
                  <div className="mt-4 rounded-2xl border border-hairline bg-bg/55 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink">{project.name}</span>
                      <span className="rounded-full bg-brand-emerald/10 px-2.5 py-0.5 text-xs font-semibold text-brand-emerald">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted">
                      <span>${usage.totalDonated} contributed</span>
                      <span>About {formatTokens(usage.totalDonated)} tokens funded</span>
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            <section className="rounded-[28px] border border-hairline bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Fund API access</h2>
                  <p className="mt-1 text-sm leading-5 text-muted">
                    Your contribution becomes platform-managed compute for Alex.
                  </p>
                </div>
                <div className="rounded-full bg-brand-cyan/10 p-2 text-brand-cyan">
                  <SparkIcon />
                </div>
              </div>

              <div className="mt-5">
                <style>{`
                  .donation-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    border-radius: 9999px;
                    outline: none;
                    cursor: pointer;
                  }
                  .donation-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 9999px;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,.35);
                    cursor: pointer;
                  }
                  .donation-slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border: none;
                    border-radius: 9999px;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,.35);
                    cursor: pointer;
                  }
                `}</style>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-muted">$1</span>
                  <span
                    className="rounded-full px-3 py-1 text-sm font-bold text-bg"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }}
                  >
                    ${customAmount !== '' ? customAmount : selectedAmount}
                  </span>
                  <span className="text-xs text-muted">$500</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={500}
                  step={1}
                  value={customAmount !== '' ? (Number(customAmount) || selectedAmount) : selectedAmount}
                  onChange={(e) => {
                    setSelectedAmount(Number(e.target.value))
                    setCustomAmount('')
                  }}
                  className="donation-slider w-full"
                  style={{
                    background: (() => {
                      const val = customAmount !== '' ? (Number(customAmount) || selectedAmount) : selectedAmount
                      const pct = ((val - 1) / 499) * 100
                      return `linear-gradient(to right, #6366F1 0%, #22D3EE ${pct}%, #1B2236 ${pct}%)`
                    })(),
                  }}
                />
              </div>

              <label className="mt-3 block">
                  <span className="sr-only">Custom contribution amount</span>
                <div className="flex items-center rounded-2xl border border-hairline bg-bg/55 px-4 py-3 focus-within:border-brand-cyan/60">
                  <span className="text-sm font-semibold text-muted">$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={customAmount}
                    onChange={(event) => setCustomAmount(event.target.value.replace(/\D/g, ''))}
                    placeholder="Custom amount"
                    className="ml-2 w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-muted"
                  />
                </div>
              </label>

              <div className="mt-5 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-cyan">
                  Estimated compute
                </p>
                <p className="mt-2 text-sm leading-6 text-ink">
                  <span className="font-bold">${effectiveAmount}</span> gives Alex about{' '}
                  <span className="font-bold text-brand-cyan">{formatTokens(effectiveAmount)}</span>{' '}
                  GPT-4o tokens.
                </p>
              </div>

              <button
                type="button"
                onClick={fundIdea}
                className="mt-5 w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_16px_48px_rgba(34,211,238,.24)] transition active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }}
              >
                Fund this project
              </button>
            </section>

          </main>
        )}
      </div>
    </div>
  )
}
