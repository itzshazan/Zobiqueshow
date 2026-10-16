'use client'

import { useEffect, useState } from 'react'
import { LABS_URL } from '@/lib/constants'
import Brand from '@/components/shared/Brand'

const links: [label: string, href: string][] = [
  ['Platform', '#platform'],
  ['Labs', '#labs'],
  ['Work', '#work'],
  ['Contact', '#contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Close the phone menu on Escape or when the screen grows past the breakpoint
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 861px)')
    const onResize = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onResize)
    }
  }, [open])

  return (
    <nav className={open ? 'open' : ''}>
      <div className="wrap">
        <Brand />
        <div className="links">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="nav-end">
          <a href={LABS_URL} className="btn btn-o nav-cta" target="_blank" rel="noopener">
            Book a call <span className="arr">→</span>
          </a>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href={LABS_URL} className="btn btn-o" target="_blank" rel="noopener" onClick={() => setOpen(false)}>
          Book a call <span className="arr">→</span>
        </a>
      </div>
    </nav>
  )
}
