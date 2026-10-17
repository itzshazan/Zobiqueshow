'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { WorkOwner } from '@/lib/types'

type Filter = 'all' | WorkOwner

interface WorkFilterProps {
  items: { key: string; owner: WorkOwner; card: ReactNode }[]
  labels: Record<Filter, string>
  empty: string
}

export default function WorkFilter({ items, labels, empty }: WorkFilterProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const shown = items.filter((i) => filter === 'all' || i.owner === filter)

  // A filter only helps when there is more than one kind of work to choose between
  const owners = new Set(items.map((i) => i.owner))
  if (owners.size < 2) {
    return <div className="case-grid">{items.map((i) => <div key={i.key}>{i.card}</div>)}</div>
  }

  return (
    <>
      <div className="filter" role="group" aria-label="Filter work">
        {(Object.keys(labels) as Filter[]).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {labels[f]}
          </button>
        ))}
      </div>
      {shown.length === 0 && <p className="muted" aria-live="polite">{empty}</p>}
      <div className="case-grid">
        {shown.map((i) => <div key={i.key}>{i.card}</div>)}
      </div>
    </>
  )
}
