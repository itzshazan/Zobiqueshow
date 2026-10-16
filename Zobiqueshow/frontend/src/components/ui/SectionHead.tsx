import type { CSSProperties, ReactNode } from 'react'
import { Reveal } from '@/hooks'

interface SectionHeadProps {
  title: ReactNode
  titleStyle?: CSSProperties
  style?: CSSProperties
  children?: ReactNode
}

export default function SectionHead({ title, titleStyle, children, style }: SectionHeadProps) {
  return (
    <Reveal className="sec-head" style={style}>
      <h2 style={titleStyle}>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  )
}
