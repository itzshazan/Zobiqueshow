import { useInView, useCountUp } from '../../hooks'
import { stats } from '../../data/content'

function Stat({ count, text, suffix, label }) {
  const [ref, inView] = useInView()
  const value = useCountUp(count ?? 0, inView && count != null)
  return (
    <div ref={ref} className={`stat rv ${inView ? 'in' : ''}`}>
      <b>{count != null ? value : text}{suffix}</b>
      <span>{label}</span>
    </div>
  )
}

export default function Stats() {
  return (
    <section style={{ borderTop: 0 }}>
      <div className="wrap">
        <div className="stats">
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  )
}
