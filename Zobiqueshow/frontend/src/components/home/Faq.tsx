import { faqs } from '@/data/content'
import Reveal from '@/components/shared/Reveal'
import SectionHead from '@/components/shared/SectionHead'

export default function Faq() {
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead title="Questions, answered." />
        <Reveal className="faq">
          {faqs.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
