'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface CaseNavItem {
  slug: string
  client: string
  eyebrow: string
  logo: string | null
}

// Pinned index on the left, case studies scrolling on the right (as on labs.zobique.com).
// The entry for the case study crossing the middle of the screen is highlighted, and the
// index's progress line follows scroll. Clicking an entry scrolls to that case study.
export default function CaseScroller({ items, children }: { items: CaseNavItem[]; children: ReactNode[] }) {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = items.map((it) => document.getElementById(`case-${it.slug}`)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    cards.forEach((c) => io.observe(c))

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const list = listRef.current
        if (!list) return
        const r = list.getBoundingClientRect()
        const span = r.height - window.innerHeight * 0.5
        setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / Math.max(span, 1))))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  const go = (slug: string) => {
    const el = document.getElementById(`case-${slug}`)
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <div className="cs">
      <nav className="cs-nav" aria-label="Case studies">
        <div className="cs-track" aria-hidden="true"><i style={{ transform: `scaleY(${progress})` }} /></div>
        <ol>
          {items.map((it, i) => (
            <li key={it.slug}>
              <button type="button" className={`cs-item${i === active ? ' is-active' : ''}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(it.slug)}>
                <span className="cs-logo">{it.logo ? <img src={it.logo} alt="" width={80} height={28} /> : <span>{it.client.slice(0, 2)}</span>}</span>
                <span className="cs-text">
                  <span className="cs-client">{it.client}</span>
                  <span className="cs-eyebrow">{it.eyebrow}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="cs-cards" ref={listRef}>
        {children.map((card, i) => (
          <section key={items[i].slug} id={`case-${items[i].slug}`} className={`cs-card${i === active ? ' is-active' : ''}`} aria-label={items[i].client}>
            {card}
          </section>
        ))}
      </div>
    </div>
  )
}
