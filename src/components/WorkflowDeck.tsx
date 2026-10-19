'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import SmartLink from './SmartLink'
import { CheckCircle } from './icons'

// Sticky stacked deck, measured from labs.zobique.com "From Workflow to Production":
//   card i sticks at  STICKY_TOP + i * TAB   (80px + i * 52px)
//   card i is         BASE + (n - 1 - i) * TAB tall, so every card's bottom lines up and
//                     the deck leaves the screen as one piece with its tabs still showing.
//   The sticky item is an invisible frame of that height; the visible face inside it is
//   sized to its content (BASE), since these cards carry text only, no image.
//   z-index rises with i, so each card slides up over the last and leaves its
//   header bar showing as a stacked tab. No transforms or fades: pure sticky.
// The newest docked card is the current step (orange label); clicking a header
// scrolls to the exact point where that card docks. Below 1024px it is a plain stack.
const STICKY_TOP = 80
const TAB = 52
const BASE = 420
const DESKTOP = '(min-width: 1025px)'

export interface WorkflowPhase {
  name: string
  title: string
  body: string
  items: string[]
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  /** Optional artwork; when present the checklist moves under the description */
  image?: { src: string; width: number; height: number; alt: string }
}

export default function WorkflowDeck({ phases }: { phases: WorkflowPhase[] }) {
  const deckRef = useRef<HTMLOListElement>(null)
  const cardRefs = useRef<(HTMLLIElement | null)[]>([])
  const [current, setCurrent] = useState(0)

  // Current step = the last card that has reached (or passed) its docking point
  const update = useCallback(() => {
    if (!window.matchMedia(DESKTOP).matches) return setCurrent(0)
    let step = 0
    cardRefs.current.forEach((card, i) => {
      if (card && card.getBoundingClientRect().top <= STICKY_TOP + i * TAB + TAB) step = i
    })
    setCurrent(step)
  }, [])

  useEffect(() => {
    update()
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  // Scroll so card i sits exactly at its docking point
  const goTo = (i: number) => {
    const deck = deckRef.current
    const card = cardRefs.current[i]
    if (!deck || !card) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const deckTop = deck.getBoundingClientRect().top + window.scrollY
    const desktop = window.matchMedia(DESKTOP).matches
    const target = desktop ? deckTop + card.offsetTop - (STICKY_TOP + i * TAB) : card.getBoundingClientRect().top + window.scrollY - STICKY_TOP
    window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <ol className="deck" ref={deckRef} aria-label="Phases">
      {phases.map((p, i) => {
        const style = {
          '--deck-top': `${STICKY_TOP + i * TAB}px`,
          '--deck-height': `${BASE + (phases.length - 1 - i) * TAB}px`,
          zIndex: (i + 1) * 10,
        } as CSSProperties
        return (
          <li key={p.name} className="deck-card" style={style} ref={(el) => { cardRefs.current[i] = el }}>
            <div className="deck-face">
            <button type="button" className="deck-tab" aria-current={i === current ? 'step' : undefined} onClick={() => goTo(i)}>
              <span className="deck-name">{p.name}</span>
            </button>
            <div className="deck-panel">
              <div className="deck-copy">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                {p.image && (
                  <ul className="deck-inline">
                    {p.items.map((item) => <li key={item}><CheckCircle className="deck-check" />{item}</li>)}
                  </ul>
                )}
                <div className="deck-actions">
                  <SmartLink href={p.primary.href} className="deck-cta" hideIcon event={{ name: 'labs_cta_click', location: `workflow-${p.name}` }}>
                    {p.primary.label}
                  </SmartLink>
                  <SmartLink href={p.secondary.href} className="deck-cta-ghost" hideIcon event={{ name: 'labs_cta_click', location: `workflow-${p.name}` }}>
                    {p.secondary.label}
                  </SmartLink>
                </div>
              </div>
              {p.image ? (
                <div className="deck-visual">
                  <img src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} loading="lazy" />
                </div>
              ) : (
                <ul className="deck-bullets">
                  {p.items.map((item) => (
                    <li key={item}><CheckCircle className="deck-check" />{item}</li>
                  ))}
                </ul>
              )}
            </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
