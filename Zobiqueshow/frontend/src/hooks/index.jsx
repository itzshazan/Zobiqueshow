import { useEffect, useRef, useState } from 'react'

// True once the element has scrolled into view (fires once)
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
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

// Fades and lifts its children in on scroll
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag ref={ref} className={`rv ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}

// Eased count from 0 to `to` once `start` is true
export function useCountUp(to, start, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, duration])
  return value
}
