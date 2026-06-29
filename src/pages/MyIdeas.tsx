import { useNavigate, useSearchParams } from 'react-router-dom'
import CreatorIdeaCard from '@/components/CreatorIdeaCard'
import OwnerTopNav from '@/components/OwnerTopNav'
import { creatorIdeas, formatCurrency } from '@/data/creatorIdeas'

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
          title="My Ideas"
          subtitle="Manage funded ideas and developer access."
          action={
            <button
              type="button"
              onClick={() => navigate('/ideas/new')}
              className="rounded-full px-3.5 py-2 text-xs font-bold text-bg shadow-[0_12px_36px_rgba(168,85,247,.22)] transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
            >
              + New
            </button>
          }
        />

        <main className="space-y-4 px-5">
          {created ? (
            <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-4 py-3 text-sm font-semibold text-brand-emerald">
              Idea draft added to your workspace.
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
                  Active ideas
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
