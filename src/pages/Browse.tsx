import { projects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'

/**
 * Browse — donor track entry point.
 * Top-level header variant (logo + large title, no back) per the design
 * reference, followed by a vertical list of project cards.
 */
export default function Browse() {
  const openProject = (id: string) => {
    // TODO: navigate(`/projects/${id}`) once the Detail screen exists.
    void id
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
        <header className="px-5 pb-4 pt-2">
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
          <h1 className="mt-3 font-display text-3xl font-bold text-ink">Browse</h1>
          <p className="mt-1 text-sm text-muted">Fund AI compute for ideas that matter.</p>
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
