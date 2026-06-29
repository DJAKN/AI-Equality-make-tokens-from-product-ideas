import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

type Role = 'none' | 'donor' | 'creator'

/**
 * Landing — "Split Duo"
 * Two equal sides (donor / creator) echoing the AI-Equality theme.
 * Interaction: hover a half to preview-expand (desktop), click/tap to enter,
 * tap the center FuelUp pill to reset.
 *
 * On enter we play the "entering" animation briefly, then route to the track.
 */
export default function Landing() {
  const [role, setRole] = useState<Role>('none')
  const navigate = useNavigate()
  const timer = useRef<number>()

  // Clean up a pending navigation timer if the component unmounts.
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const enter = (next: Role) => {
    setRole(next)
    if (next === 'donor') {
      timer.current = window.setTimeout(() => navigate('/browse'), 850)
    } else if (next === 'creator') {
      timer.current = window.setTimeout(() => navigate('/ideas'), 850)
    }
  }

  return (
    <div className="landing">
      <div className="stage" data-selected={role}>
        {/* Donor */}
        <button
          type="button"
          className="half donor"
          onClick={() => enter('donor')}
          aria-label="Continue as donor"
        >
          <span className="ic-wrap">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c1.8 0 3 1 2.5 2.5" />
              <path d="M12 20s7-4.35 9.5-8.5C23 8.5 21.5 5.5 18.5 5.5c-1.8 0-3 1-2.5 2.5" />
              <path d="M12 8v6M9 11h6" />
            </svg>
          </span>
          <span className="big">Fund <span className="accent">ideas</span></span>
          <span className="sub">Turn your idle AI budget into someone's breakthrough.</span>
          <span className="cta">Continue as donor →</span>
          <span className="entering">
            <span className="dots"><i /><i /><i /></span>
            <span className="entering-label">Entering donor space…</span>
          </span>
        </button>

        {/* Creator */}
        <button
          type="button"
          className="half creator"
          onClick={() => enter('creator')}
          aria-label="Continue as creator"
        >
          <span className="ic-wrap">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 21h4" />
              <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" />
              <path d="M9.5 8.5l2.5 2.5 2.5-2.5" />
            </svg>
          </span>
          <span className="big">Build an <span className="accent">idea</span></span>
          <span className="sub">Get the AI compute your project needs — funded by the community.</span>
          <span className="cta">Continue as creator →</span>
          <span className="entering">
            <span className="dots"><i /><i /><i /></span>
            <span className="entering-label">Entering your workspace…</span>
          </span>
        </button>
      </div>

      <div className="divider" aria-hidden />

      <button
        type="button"
        className="logo-pill"
        onClick={() => {
          window.clearTimeout(timer.current)
          setRole('none')
        }}
        aria-label="FuelUp home"
      >
        <span className="gem" aria-hidden />FuelUp
      </button>
    </div>
  )
}
