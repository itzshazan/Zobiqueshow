'use client'

import { useEffect } from 'react'
import { track, type AnalyticsEvent } from '@/lib/analytics'

/** Records one analytics event when the page mounts. */
export default function TrackView({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
