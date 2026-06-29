import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import OwnerTopNav from '@/components/OwnerTopNav'

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

export default function PostNewIdea() {
  const navigate = useNavigate()

  const submitIdea = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/ideas?created=1')
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
        <OwnerTopNav
          variant="down-drill"
          title="Post New Project"
          subtitle="Creator intake"
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

        <main className="px-5">
          <form
            onSubmit={submitIdea}
            className="space-y-4 rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)]"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-violet">
                Request compute
              </p>
              <h1 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink">
                Share the project you want to build
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Keep it concrete: what you are building, why API access matters, and how much compute
                you need.
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Project name
              </span>
              <input
                required
                defaultValue="NaviSight"
                className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                placeholder="Project name"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                One-line pitch
              </span>
              <textarea
                required
                defaultValue="AI navigation for the visually impaired"
                rows={3}
                className="mt-2 w-full resize-none rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold leading-6 text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                placeholder="What should funders understand in one sentence?"
              />
            </label>

            <div className="grid grid-cols-[1fr_1.35fr] gap-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Goal
                </span>
                <div className="mt-2 flex items-center rounded-2xl border border-hairline bg-bg/60 px-4 py-3 focus-within:border-brand-violet/70">
                  <span className="text-sm font-semibold text-muted">$</span>
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    defaultValue="50"
                    className="ml-2 w-full bg-transparent text-sm font-semibold text-ink outline-none"
                    aria-label="Goal amount"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  AI use case
                </span>
                <input
                  required
                  defaultValue="GPT-4o Vision"
                  className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                  placeholder="Model or API"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-brand-violet/20 bg-brand-violet/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-violet">
                Review note
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                For the MVP, submission is mocked. In the full product this creates a pending idea
                for verification before fundraising starts.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_16px_48px_rgba(168,85,247,.24)] transition active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
            >
              Submit project
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
