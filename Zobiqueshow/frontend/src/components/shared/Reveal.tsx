'use client'

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

type RevealProps<T extends ElementType> = {
  as?: T
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

// Fades and lifts its children in on scroll
export default function Reveal<T extends ElementType = 'div'>({ as, className = '', children, ...rest }: RevealProps<T>) {
  const Tag: ElementType = as ?? 'div'
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={`rv ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
