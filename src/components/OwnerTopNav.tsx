import type { ReactNode } from 'react'

interface OwnerTopNavProps {
  variant: 'top-level' | 'down-drill'
  title: string
  subtitle?: string
  onBack?: () => void
  action?: ReactNode
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

export default function OwnerTopNav({ variant, title, subtitle, onBack, action }: OwnerTopNavProps) {
  if (variant === 'top-level') {
    return (
      <header className="px-5 pb-4 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div>
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
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      </header>
    )
  }

  return (
    <header className="grid grid-cols-[48px_1fr_72px] items-center px-4 pb-4 pt-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to My Ideas"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition active:scale-95"
      >
        <BackIcon />
      </button>
      <div className="min-w-0 text-center">
        <p className="truncate font-display text-base font-bold text-ink">{title}</p>
        {subtitle ? <p className="mt-0.5 text-[11px] font-medium text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="justify-self-end">{action}</div> : null}
    </header>
  )
}
