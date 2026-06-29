import { creatorFundingPercent, formatCurrency, type CreatorIdea } from '@/data/creatorIdeas'
import FundingProgressBar from '@/components/FundingProgressBar'

interface CreatorIdeaCardProps {
  idea: CreatorIdea
  onOpen: (id: string) => void
}

export default function CreatorIdeaCard({ idea, onOpen }: CreatorIdeaCardProps) {
  const pct = creatorFundingPercent(idea)

  return (
    <button
      type="button"
      onClick={() => onOpen(idea.id)}
      className="block w-full rounded-2xl border border-hairline bg-surface p-4 text-left transition active:scale-[0.99] hover:border-brand-violet/50"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-violet">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" />
          Fundraising
        </span>
        <span className="rounded-full border border-hairline bg-bg/45 px-2.5 py-1 text-xs font-semibold text-muted">
          {formatCurrency(idea.availableBalance)}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold leading-tight text-ink">{idea.name}</h3>
      <p className="mt-1 text-sm leading-5 text-muted">{idea.tagline}</p>

      <div className="mt-4">
        <FundingProgressBar raised={idea.raised} goal={idea.goal} />
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span>
            <span className="font-semibold text-ink">${idea.raised}</span> / ${idea.goal}
          </span>
          <span>{pct}% funded</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-muted">{idea.useCase}</span>
        <span className="shrink-0 font-semibold text-brand-cyan">Open dashboard →</span>
      </div>
    </button>
  )
}
