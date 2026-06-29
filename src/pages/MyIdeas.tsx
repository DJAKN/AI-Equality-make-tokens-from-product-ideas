import { useNavigate, useSearchParams } from 'react-router-dom'
import CreatorIdeaCard from '@/components/CreatorIdeaCard'
import OwnerTopNav from '@/components/OwnerTopNav'
import { creatorIdeas, formatCurrency } from '@/data/creatorIdeas'

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

export default function MyIdeas() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const totalBalance = creatorIdeas.reduce((sum, idea) => sum + idea.availableBalance, 0)
  const created = params.get('created') === '1'

  return (
    <div className="min-h-dvh bg-bg">
      <div
        className="mx-auto w-full max-w-md"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 14px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <OwnerTopNav
          variant="top-level"
          title="My Projects"
          subtitle="Manage funded projects and API access."
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                aria-label="Back to home"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
              >
                <HomeIcon />
              </button>
              <button
                type="button"
                onClick={() => navigate('/ideas/new')}
                className="rounded-full px-6 py-2.5 text-sm font-bold text-bg shadow-[0_12px_36px_rgba(168,85,247,.22)] transition active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
              >
                New
              </button>
            </div>
          }
        />

        <main className="space-y-4 px-5">
          {created ? (
            <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-4 py-3 text-sm font-semibold text-brand-emerald">
              Project draft added to your workspace.
            </div>
          ) : null}

          <section className="rounded-[28px] border border-hairline bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Creator workspace
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Available
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-ink">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Active projects
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-ink">
                  {creatorIdeas.length}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            {creatorIdeas.map((idea) => (
              <CreatorIdeaCard
                key={idea.id}
                idea={idea}
                onOpen={(id) => navigate(`/ideas/${id}`)}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
