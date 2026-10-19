import { PageHead } from './blocks'

interface LegalPageProps {
  heading: string
  updated: string
  draftNotice?: string
  sections: { heading: string; body: string }[]
}

export default function LegalPage({ heading, updated, draftNotice, sections }: LegalPageProps) {
  return (
    <>
      <PageHead title={heading} lede={`Last updated ${updated}`} />
      <div className="wrap" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <div className="legal">
          {draftNotice && <p className="draft-note">{draftNotice}</p>}
          {sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
