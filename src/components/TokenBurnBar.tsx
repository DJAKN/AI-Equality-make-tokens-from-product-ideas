interface TokenBurnBarProps {
  tokensUsed: number
  tokensRemaining: number
  /** Label for the right-side counter. Defaults to "remaining". */
  remainingLabel?: string
}

/**
 * Burn-down progress bar showing consumed vs remaining funded tokens.
 * Used vs remaining fills left→right with a violet→indigo→cyan gradient.
 */
export default function TokenBurnBar({
  tokensUsed,
  tokensRemaining,
  remainingLabel = 'remaining',
}: TokenBurnBarProps) {
  const total = tokensUsed + tokensRemaining
  const pct = total > 0 ? (tokensUsed / total) * 100 : 0

  return (
    <div className="rounded-2xl border border-hairline bg-bg/55 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-brand-violet">
          {(tokensUsed / 1_000).toFixed(0)}K used
        </span>
        <span className="text-muted">
          {(tokensRemaining / 1_000).toFixed(0)}K {remainingLabel}
        </span>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#1B2236]">
        <div
          className="h-full rounded-l-full transition-[width] duration-500"
          style={{
            width: `${pct.toFixed(1)}%`,
            background: 'linear-gradient(90deg,#A855F7,#6366F1)',
          }}
        />
        <div
          className="h-full flex-1 rounded-r-full"
          style={{ background: 'linear-gradient(90deg,#6366F1,#22D3EE)' }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        {pct.toFixed(0)}% of funded tokens consumed
      </p>
    </div>
  )
}
