import { LOGO, LABS_URL } from '../../data/content'

const links = [
  ['Platform', '#platform'],
  ['Labs', '#labs'],
  ['Work', '#work'],
  ['Contact', '#contact'],
]

export function Brand() {
  return (
    <a href="#top" className="brand"><img src={LOGO} alt="" width="32" height="32" />zobique</a>
  )
}

export default function Nav() {
  return (
    <nav>
      <div className="wrap">
        <Brand />
        <div className="links">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <a href={LABS_URL} className="btn btn-o" target="_blank" rel="noopener">
          Book a call <span className="arr">→</span>
        </a>
      </div>
    </nav>
  )
}
