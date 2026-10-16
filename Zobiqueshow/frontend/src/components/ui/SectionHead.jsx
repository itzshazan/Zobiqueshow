import { Reveal } from '../../hooks'

export default function SectionHead({ title, titleStyle, children, style }) {
  return (
    <Reveal className="sec-head" style={style}>
      <h2 style={titleStyle}>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  )
}
