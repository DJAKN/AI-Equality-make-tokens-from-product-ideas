interface FundingProgressBarProps {
  raised: number
  goal: number
}

/**
 * Fundraising progress bar showing raised vs goal amount.
 * Fills left→right with a violet→indigo gradient.
 */
export default function FundingProgressBar({ raised, goal }: FundingProgressBarProps) {
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0

  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#1B2236]">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct.toFixed(1)}%`, background: 'linear-gradient(90deg,#A855F7,#6366F1)' }}
      />
    </div>
  )
}
