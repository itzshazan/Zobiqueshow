'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { outboundDomain, track, type AnalyticsEvent } from '@/lib/analytics'
import ExternalIcon from './ExternalIcon'

interface SmartLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** Event to record on click, in addition to outbound_click for other domains */
  event?: AnalyticsEvent
  onClick?: () => void
  /** Leave the external arrow out (when the caller places its own) */
  hideIcon?: boolean
  'aria-current'?: 'page'
}

// Links leaving zobique.com get the external arrow and open in the same tab
// (brief section E): visitors should feel they moved to a related site.
export default function SmartLink({ href, children, className, event, onClick, hideIcon, ...rest }: SmartLinkProps) {
  const domain = outboundDomain(href)
  const handleClick = () => {
    if (event) track(event)
    if (domain) track({ name: 'outbound_click', domain })
    onClick?.()
  }

  if (domain || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a href={href} className={className} onClick={handleClick} {...rest}>
        {children}
        {domain && !hideIcon && <ExternalIcon />}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
