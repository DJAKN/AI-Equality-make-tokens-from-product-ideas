import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'sign-in' | 'sign-up'

function FuelUpMark() {
  return (
    <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-muted">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg,#A855F7,#6366F1)',
          boxShadow: '0 0 10px rgba(168,85,247,.7)',
        }}
      />
      FuelUp
    </span>
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

export default function CreatorAuth() {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const navigate = useNavigate()
  const isSignIn = mode === 'sign-in'

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/ideas')
  }

  return (
    <div className="min-h-dvh overflow-hidden bg-bg">
      <div
        className="mx-auto flex min-h-dvh w-full max-w-md flex-col"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 14px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <header className="flex items-center justify-between px-4 pb-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to landing"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
          >
            <BackIcon />
          </button>
          <FuelUpMark />
          <div className="h-11 w-11" aria-hidden />
        </header>

        <main className="flex flex-1 flex-col justify-center px-5 pb-4">
          <section className="rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_28px_100px_rgba(0,0,0,.34)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-violet">
                Creator access
              </p>
              <h1 className="mt-2 font-display text-[34px] font-bold leading-[1.04] text-ink">
                {isSignIn ? 'Welcome back' : 'Start building'}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                {isSignIn
                  ? 'Open your funded ideas, balances, and developer keys.'
                  : 'Create a workspace for ideas that need AI compute.'}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-full border border-hairline bg-bg/55 p-1">
              <button
                type="button"
                onClick={() => setMode('sign-in')}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  isSignIn ? 'text-bg' : 'text-muted'
                }`}
                style={
                  isSignIn
                    ? { background: 'linear-gradient(135deg,#A855F7,#6366F1)' }
                    : undefined
                }
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('sign-up')}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  !isSignIn ? 'text-bg' : 'text-muted'
                }`}
                style={
                  !isSignIn
                    ? { background: 'linear-gradient(135deg,#A855F7,#6366F1)' }
                    : undefined
                }
              >
                Sign up
              </button>
            </div>

            <form onSubmit={submitAuth} className="mt-5 space-y-4">
              {!isSignIn ? (
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Name
                  </span>
                  <input
                    required
                    defaultValue="Maya Chen"
                    className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                    placeholder="Your name"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Email
                </span>
                <input
                  required
                  type="email"
                  defaultValue="maya@fuelup.dev"
                  className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Password
                </span>
                <input
                  required
                  type="password"
                  minLength={6}
                  defaultValue="fuelup"
                  className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                  placeholder="Password"
                />
              </label>

              {!isSignIn ? (
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Idea focus
                  </span>
                  <input
                    defaultValue="AI accessibility tools"
                    className="mt-2 w-full rounded-2xl border border-hairline bg-bg/60 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-brand-violet/70"
                    placeholder="What are you building?"
                  />
                </label>
              ) : null}

              <div className="rounded-2xl border border-brand-violet/20 bg-brand-violet/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-violet">
                  Prototype access
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  This demo does not store account details. Continuing opens the creator workspace.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full px-5 py-4 text-sm font-bold text-bg shadow-[0_16px_48px_rgba(168,85,247,.24)] transition active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
              >
                {isSignIn ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}
