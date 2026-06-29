import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatTokens, fundingPercent, getProject, type Project } from '@/data/projects'

const fallbackProject: Project = {
  id: 'navisight',
  name: 'NaviSight',
  tagline: 'AI navigation for the visually impaired',
  description:
    'Real-time image recognition and voice guidance to help blind users navigate their surroundings independently.',
  useCase: 'GPT-4o Vision',
  goal: 50,
  raised: 0,
  status: 'fundraising',
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none">
      <path
        d="m5 12.5 4.2 4.2L19 6.8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FlowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M4 12h10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="m11 7 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 5.5v13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".65"
      />
    </svg>
  )
}

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

export default function DonationSuccess() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const amount = useMemo(() => {
    const parsed = Number(params.get('amount'))
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 30
  }, [params])

  const project = getProject(params.get('project') ?? '') ?? fallbackProject
  const updatedProject = useMemo<Project>(
    () => ({
      ...project,
      raised: Math.min(project.goal, project.raised + amount),
      status: project.raised + amount >= project.goal ? 'funded' : project.status,
    }),
    [amount, project],
  )

  const updatedPercent = fundingPercent(updatedProject)
  const visibleRaised = updatedProject.raised
  const contributionShare = Math.min(100, Math.round((amount / project.goal) * 100))

  return (
    <div className="min-h-dvh overflow-hidden bg-bg">
      <div className="pointer-events-none fixed inset-x-0 top-[-120px] mx-auto h-[280px] w-[280px] rounded-full bg-brand-cyan/20 blur-[86px]" />
      <div className="pointer-events-none fixed bottom-[-160px] right-[-80px] h-[320px] w-[320px] rounded-full bg-brand-indigo/20 blur-[96px]" />

      <div
        className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'max(env(safe-area-inset-left), 20px)',
          paddingRight: 'max(env(safe-area-inset-right), 20px)',
        }}
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
          >
            <HomeIcon />
          </button>
        </div>
        <main className="space-y-4">
          <section className="relative overflow-hidden rounded-[34px] border border-brand-cyan/20 bg-surface p-6 text-center shadow-[0_28px_100px_rgba(0,0,0,.34)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/70 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-11 h-28 w-28 -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-2xl" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald shadow-[0_18px_70px_rgba(52,211,153,.22)]">
              <div className="absolute inset-[-12px] rounded-full border border-brand-emerald/10" />
              <div className="absolute inset-[-24px] rounded-full border border-brand-cyan/10" />
              <CheckIcon />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald">
              Funding confirmed
            </p>
            <h1 className="mt-2 font-display text-[34px] font-bold leading-[1.04] text-ink">
              {project.name}
            </h1>
            <p className="mx-auto mt-4 max-w-[290px] text-sm leading-6 text-muted">
              Your ${amount} contribution has been added to {project.name}'s compute budget. Alex can use it through a platform-issued API key.
            </p>

            <div className="mt-6 rounded-3xl border border-brand-cyan/20 bg-bg/60 p-4">
              <div className="flex items-center justify-center gap-3 text-left">
                <div className="rounded-2xl bg-brand-cyan/10 p-3 text-brand-cyan">
                  <FlowIcon />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-cyan">
                    Compute allocated
                  </p>
                  <p className="mt-1 text-sm leading-5 text-ink">
                    <span className="font-bold">${amount}</span> →{' '}
                    <span className="font-bold text-brand-cyan">
                      ~{formatTokens(amount)} GPT-4o tokens
                    </span>{' '}
                    for Alex
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Fundraising updated
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-ink">{project.name}</h2>
              </div>
              <span className="rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-bold text-brand-emerald">
                +{contributionShare}%
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-end justify-between text-sm">
                <span className="font-semibold text-ink">
                  ${visibleRaised} <span className="text-muted">/ ${project.goal}</span>
                </span>
                <span className="text-xs font-semibold text-brand-cyan">{updatedPercent}% funded</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#1B2236]">
                <div
                  className="h-full rounded-full shadow-[0_0_22px_rgba(34,211,238,.34)] transition-[width] duration-700"
                  style={{
                    width: `${updatedPercent}%`,
                    background: 'linear-gradient(90deg,#6366F1,#22D3EE,#34D399)',
                  }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  New balance
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-ink">${amount}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Token access
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-ink">
                  {formatTokens(amount)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted">
              FuelUp converts this contribution into controlled API access, so Alex can start building
              without receiving cash or managing provider billing.
            </p>
          </section>

          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_18px_56px_rgba(34,211,238,.24)] transition active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg,#E6EAF5,#22D3EE)' }}
          >
            Back to projects
          </button>

          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="w-full rounded-full border border-hairline bg-surface px-5 py-4 text-sm font-bold text-muted transition active:scale-[0.99]"
          >
            View project
          </button>
        </main>
      </div>
    </div>
  )
}
