import type { ReactNode } from 'react'

// Plain wrapper. Scroll motion is handled site-wide by components/Motion.tsx (GSAP).
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
