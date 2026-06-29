import { type Project, fundingPercent, formatTokens } from '@/data/projects'
import FundingProgressBar from '@/components/FundingProgressBar'

interface ProjectCardProps {
  project: Project
  onOpen?: (id: string) => void
}

/**
 * Browse list card. Follows the design reference: status pill, name, tagline,
 * gradient progress bar, raised / goal, and a token estimate.
 */
export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const pct = fundingPercent(project)

  return (
    <button
      type="button"
      onClick={() => onOpen?.(project.id)}
      className="block w-full text-left rounded-2xl bg-surface border border-hairline p-4 transition active:scale-[0.99] hover:border-brand-indigo/50"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
          Fundraising
        </span>
        <span className="text-xs text-muted">{project.useCase}</span>
      </div>

      <h3 className="font-display text-lg font-bold leading-tight text-ink">{project.name}</h3>
      <p className="mt-1 text-sm text-muted">{project.tagline}</p>

      <div className="mt-4">
        <FundingProgressBar raised={project.raised} goal={project.goal} />
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span>
            <span className="font-semibold text-ink">${project.raised}</span> raised
          </span>
          <span>Goal ${project.goal}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted">About {formatTokens(project.goal)} tokens at goal</span>
        <span className="font-semibold text-brand-cyan">
          {pct === 0 ? 'Be the first to fund →' : 'Fund project →'}
        </span>
      </div>
    </button>
  )
}
