'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ElementType, ReactNode, RefObject } from 'react'

// True once the element has scrolled into view (fires once)
export function useInView<T extends Element = HTMLDivElement>(threshold = 0.15): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

type RevealProps<T extends ElementType> = {
  as?: T
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

// Fades and lifts its children in on scroll
export function Reveal<T extends ElementType = 'div'>({ as, className = '', children, ...rest }: RevealProps<T>) {
  const Tag: ElementType = as ?? 'div'
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={`rv ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}

// Eased count from 0 to `to` once `start` is true
export function useCountUp(to: number, start: boolean, duration = 1400): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, duration])
  return value
}
