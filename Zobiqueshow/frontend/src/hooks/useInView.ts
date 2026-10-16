'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

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
