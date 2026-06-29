import { useNavigate } from 'react-router-dom'
import { projects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'

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

/**
 * Browse — donor track entry point.
 * Top-level header variant (logo + large title, no back) per the design
 * reference, followed by a vertical list of project cards.
 */
export default function Browse() {
  const navigate = useNavigate()

  const openProject = (id: string) => {
    navigate(`/projects/${id}`)
  }

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
        <header className="flex items-start justify-between px-5 pb-4 pt-2">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg,#22D3EE,#A855F7)',
                  boxShadow: '0 0 10px rgba(34,211,238,.7)',
                }}
              />
              FuelUp
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">Projects to support</h1>
            <p className="mt-1 text-sm text-muted">Fund API access for builders with clear, working ideas.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
          >
            <HomeIcon />
          </button>
        </header>

        <main className="space-y-3 px-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={openProject} />
          ))}
        </main>
      </div>
    </div>
  )
}
