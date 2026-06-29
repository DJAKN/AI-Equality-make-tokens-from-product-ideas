import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fundingPercent, formatTokens, type Project } from '@/data/projects'
import { getProject } from '@/data/projectRepository'
import { recordDonation } from '@/data/donationRepository'

const presetAmounts = [10, 30, 50]

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
  const [project, setProject] = useState<Project | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState(30)
  const [customAmount, setCustomAmount] = useState('')
  const [isDonating, setIsDonating] = useState(false)
  const [donationError, setDonationError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadProject() {
      setIsLoading(true)
      setError(null)
      setProject(undefined)

      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        const nextProject = await getProject(id)
        if (!ignore) {
          setProject(nextProject)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Project details could not load.')
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadProject()

    return () => {
      ignore = true
    }
  }, [id])

  const effectiveAmount = useMemo(() => {
    if (customAmount.trim() === '') return selectedAmount
    const parsed = Number(customAmount)
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : selectedAmount
  }, [customAmount, selectedAmount])

  const pct = project ? fundingPercent(project) : 0

  const goBack = () => {
    navigate('/browse')
  }

  const fundIdea = async () => {
    if (!project) return
    setIsDonating(true)
    setDonationError(null)

    try {
      await recordDonation(project.id, effectiveAmount)
      navigate(`/donate/success?project=${project.id}&amount=${effectiveAmount}`)
    } catch (err) {
      setDonationError(err instanceof Error ? err.message : 'Donation could not be recorded.')
    } finally {
      setIsDonating(false)
    }
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
        <header className="grid grid-cols-[48px_1fr_72px] items-center px-4 pb-4 pt-2">
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
            <p className="mt-0.5 text-[11px] font-medium text-muted">Detail + Donate</p>
          </div>
          {project ? (
            <span className="justify-self-end rounded-full border border-brand-emerald/20 bg-brand-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-brand-emerald">
              Live
            </span>
          ) : null}
        </header>

        {isLoading ? (
          <main className="px-5">
            <section className="rounded-2xl border border-hairline bg-surface p-5">
              <p className="font-display text-2xl font-bold text-ink">Loading project</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Preparing the latest funding details.
              </p>
            </section>
          </main>
        ) : error ? (
          <main className="px-5">
            <section className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5">
              <p className="font-display text-2xl font-bold text-ink">Project could not load</p>
              <p className="mt-2 text-sm leading-6 text-red-100">{error}</p>
              <button
                type="button"
                onClick={goBack}
                className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-bg transition active:scale-[0.99]"
              >
                Back to Browse
              </button>
            </section>
          </main>
        ) : !project ? (
          <main className="px-5">
            <section className="rounded-2xl border border-hairline bg-surface p-5">
              <p className="font-display text-2xl font-bold text-ink">Project not found</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                This idea is no longer available, or the project link is incorrect.
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
                  <span>≈ {formatTokens(project.goal)} tokens at goal</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-hairline bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Choose impact</h2>
                  <p className="mt-1 text-sm leading-5 text-muted">
                    Your donation becomes platform-managed API access for Alex.
                  </p>
                </div>
                <div className="rounded-full bg-brand-cyan/10 p-2 text-brand-cyan">
                  <SparkIcon />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {presetAmounts.map((amount) => {
                  const active = customAmount === '' && selectedAmount === amount
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold transition active:scale-[0.98] ${
                        active
                          ? 'border-transparent text-bg'
                          : 'border-hairline bg-bg/55 text-ink hover:border-brand-cyan/50'
                      }`}
                      style={
                        active
                          ? { background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }
                          : undefined
                      }
                    >
                      ${amount}
                    </button>
                  )
                })}
              </div>

              <label className="mt-3 block">
                <span className="sr-only">Custom donation amount</span>
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
                  Token estimate
                </p>
                <p className="mt-2 text-sm leading-6 text-ink">
                  <span className="font-bold">${effectiveAmount}</span> gives Alex approximately{' '}
                  <span className="font-bold text-brand-cyan">{formatTokens(effectiveAmount)}</span>{' '}
                  GPT-4o tokens.
                </p>
              </div>

              <button
                type="button"
                onClick={fundIdea}
                disabled={isDonating}
                className="mt-5 w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_16px_48px_rgba(34,211,238,.24)] transition active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }}
              >
                {isDonating ? 'Recording donation...' : 'Fund this idea'}
              </button>
              {donationError ? (
                <p className="mt-3 text-sm font-medium text-red-100">{donationError}</p>
              ) : null}
            </section>
          </main>
        )}
      </div>
    </div>
  )
}
