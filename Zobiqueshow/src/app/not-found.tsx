import Link from 'next/link'
import { pages } from '@/lib/content'

const copy = pages.sections.notFound

export default function NotFound() {
  return (
    <div className="wrap not-found">
      <h1>{copy.heading}</h1>
      <p className="lede" style={{ marginTop: 20 }}>{copy.body}</p>
      <ul>
        {copy.links.map((l) => (
          <li key={l.href}><Link href={l.href} className="btn btn-secondary">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
