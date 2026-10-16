import type { CSSProperties } from 'react'
import type { Logo } from '@/data/content'

interface LogoLoopProps {
  label?: string
  logos: Logo[]
  variant?: string
  /** Seconds per full lap */
  speed?: number
}

// Infinite logo loop. The list is rendered twice and the track slides by
// exactly -50%, so the second copy lands where the first started; spacing
// lives in each item's padding (not `gap`) to keep that seam invisible.
export default function LogoLoop({ label, logos, variant = '', speed = 40 }: LogoLoopProps) {
  const trackStyle = { animationDuration: `${speed}s`, '--loop-dur': `${speed}s` } as CSSProperties

  return (
    <div className={`loop ${variant}`.trim()}>
      {label && <p className="loop-k">{label}</p>}
      <div className="loop-view" aria-label={label} role="img">
        <div className="loop-track" style={trackStyle}>
          {[0, 1].map((copy) => (
            <div className="loop-set" key={copy} aria-hidden={copy === 1}>
              {logos.map((l) => (
                <span className="loop-item" key={l.name}>
                  <img src={l.src} alt={copy === 0 ? l.name : ''} loading="lazy" style={l.h ? { height: l.h } : undefined} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
